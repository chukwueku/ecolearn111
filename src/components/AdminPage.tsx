import React, { useState, useEffect, useRef } from 'react';
import { generateQuestions, extractQuestionsFromPdf } from '../gemini';
import { 
  saveQuestions, Question, getAllUsers, UserProfile, deleteUserAccount, 
  updateUserRole, getAdminStats, getAllQuestionsAdmin, updateQuestion, 
  deleteQuestion, getRecentDuels, setGlobalAnnouncement, getGlobalAnnouncement 
} from '../firebase';
import { SECONDARY_ROADMAP, UNDERGRADUATE_ROADMAP } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, Plus, Save, Loader2, CheckCircle2, Users, Search, Mail, 
  Calendar, ShieldCheck, User, Trash2, UserPlus, UserMinus, BarChart3, 
  History, Settings, Megaphone, Edit3, X, ChevronRight, TrendingUp, 
  BookOpen, Award, Activity, AlertTriangle, Check, Shield, FileUp, FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

import { cn } from '../lib/utils';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';

export const AdminPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = profile?.role === 'admin' || user?.email === 'chukwuekudavid@gmail.com';

  useEffect(() => {
     if (!authLoading && !isAdmin) {
        navigate('/');
     }
  }, [authLoading, isAdmin, navigate]);

  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'users' | 'activity' | 'settings'>('overview');
  const [subTab, setSubTab] = useState<'generate' | 'extract' | 'bank' | 'create'>('generate');
  
  // Stats State
  const [stats, setStats] = useState<any>(null);
  
  // Questions State
  const [level, setLevel] = useState<'secondary' | 'undergraduate'>('secondary');
  const [topicId, setTopicId] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  
  // PDF Extraction State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const emptyQuestion = { question: '', options: ['', '', '', ''], correctAnswer: 0, topicId: '', level: 'secondary' as const, explanation: '', createdAt: new Date() };
  const [newQuestion, setNewQuestion] = useState<Question>(emptyQuestion);
  
  // Users State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Activity State
  const [recentDuels, setRecentDuels] = useState<any[]>([]);
  
  // Settings State
  const [announcement, setAnnouncement] = useState('');
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success'>('info');

  const [confirmAction, setConfirmAction] = useState<{ type: string, id: string, message: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const topics = level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;

  useEffect(() => {
    if (activeTab === 'overview') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'questions' && subTab === 'bank') fetchBank();
    if (activeTab === 'activity') fetchActivity();
    if (activeTab === 'settings') fetchAnnouncement();
  }, [activeTab, subTab]);

  const fetchStats = async () => {
    setLoading(true);
    const data = await getAdminStats();
    setStats(data);
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    setLoading(false);
  };

  const fetchBank = async () => {
    setLoading(true);
    const questions = await getAllQuestionsAdmin();
    setBankQuestions(questions);
    setLoading(false);
  };

  const fetchActivity = async () => {
    setLoading(true);
    const duels = await getRecentDuels();
    setRecentDuels(duels);
    setLoading(false);
  };

  const fetchAnnouncement = async () => {
    const data = await getGlobalAnnouncement();
    if (data) {
      setAnnouncement(data.message);
      setAnnouncementType(data.type);
    }
  };

  const handleGenerate = async () => {
    if (!topicId) {
      alert("Please select a topic.");
      return;
    }
    setLoading(true);
    setSaved(false);
    const topic = topics.find(t => t.id === topicId);
    if (!topic) {
      setLoading(false);
      return;
    }

    try {
      const questions = await generateQuestions(topic.title, level, count);
      if (!questions || questions.length === 0) {
        alert("Failed to generate questions. Please try again.");
      } else {
        setGeneratedQuestions(questions);
      }
    } catch (error) {
      console.error("Error in handleGenerate:", error);
      alert("An error occurred while generating. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        alert("File size exceeds 20MB limit.");
        return;
      }
      setPdfFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1] || '';
        setPdfBase64(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PDF document.");
    }
  };

  const handleExtractFromPdf = async () => {
    if (!pdfBase64 || !topicId) {
      alert("Please ensure a PDF is uploaded and a topic is selected.");
      return;
    }
    setLoading(true);
    setSaved(false);
    try {
      const questions = await extractQuestionsFromPdf(pdfBase64, level, count);
      if (!questions || questions.length === 0) {
        alert("Failed to extract questions. Please try a different PDF or format.");
      } else {
        setGeneratedQuestions(questions);
      }
    } catch (error) {
      console.error("Error in handleExtractFromPdf:", error);
      alert("An error occurred while uploading. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (generatedQuestions.length === 0) return;
    setLoading(true);
    const questionsToSave: Question[] = generatedQuestions.map(q => ({
      ...q,
      topicId,
      level,
      createdAt: new Date()
    }));
    await saveQuestions(questionsToSave);
    setSaved(true);
    setLoading(false);
    setGeneratedQuestions([]);
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion?.id) return;
    setLoading(true);
    await updateQuestion(editingQuestion.id, editingQuestion);
    setEditingQuestion(null);
    fetchBank();
    setLoading(false);
    setSuccessMessage('Question updated successfully.');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.topicId || !newQuestion.question) return;
    setLoading(true);
    await saveQuestions([{ ...newQuestion, createdAt: new Date() }]);
    setNewQuestion(emptyQuestion);
    setSaved(true);
    setLoading(false);
    setSuccessMessage('Question created manually.');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleDeleteQuestion = async (id: string) => {
    setConfirmAction({
      type: 'delete_question',
      id,
      message: 'Are you sure you want to delete this question from the bank?'
    });
  };

  const executeDeleteQuestion = async (id: string) => {
    await deleteQuestion(id);
    fetchBank();
    setConfirmAction(null);
    setSuccessMessage('Question deleted.');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleUpdateRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setConfirmAction({
      type: 'update_role',
      id: id,
      message: `Change user role to ${newRole}?`,
      extra: newRole
    } as any);
  };

  const executeUpdateRole = async (id: string, newRole: 'admin' | 'user') => {
    await updateUserRole(id, newRole);
    fetchUsers();
    setConfirmAction(null);
    setSuccessMessage(`User role updated to ${newRole}.`);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleDeleteUser = async (id: string) => {
    setConfirmAction({
      type: 'delete_user',
      id: id,
      message: 'Permanently delete this user account? This action cannot be undone.'
    });
  };

  const executeDeleteUser = async (id: string) => {
    await deleteUserAccount(id);
    fetchUsers();
    setConfirmAction(null);
    setSuccessMessage('User account deleted.');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleSaveAnnouncement = async () => {
    setLoading(true);
    await setGlobalAnnouncement(announcement, announcementType);
    setLoading(false);
    setSuccessMessage('Announcement updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const COLORS = isDarkMode 
    ? ['#38bdf8', '#94a3b8', '#64748b', '#475569', '#334155']
    : ['#141414', '#4b5563', '#9ca3af', '#d1d5db', '#e5e7eb'];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-950/50 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 sm:mb-3">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-md font-medium">Manage your platform content, users, and system settings with precision.</p>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full lg:w-auto">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'questions', icon: BookOpen, label: 'Content' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'activity', icon: Activity, label: 'Activity' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center justify-center gap-2 px-3 sm:px-5 py-3 sm:py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                idx === 4 ? "col-span-2 sm:col-span-1" : "col-span-1",
                activeTab === tab.id 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md sm:shadow-lg shadow-slate-900/10" 
                  : "text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Total Scholars', value: stats?.totalUsers || 0, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Question Bank', value: stats?.totalQuestions || 0, icon: BookOpen, color: 'text-slate-600', bg: 'bg-slate-50' },
                { label: 'Global Points', value: stats?.totalPoints?.toLocaleString() || 0, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Active Duels', value: recentDuels.length, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((stat, i) => (
                <div key={i} className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", stat.bg, stat.bg.includes('slate') && 'dark:bg-slate-800')}>
                      <stat.icon size={18} className={stat.color} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Live Data</span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
              {/* Popular Topics Chart */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10">
                  <div>
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Engagement</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                       Popular Topics
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500">
                    <Activity size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Analysis</span>
                  </div>
                </div>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.popularTopics || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="id" hide />
                      <YAxis stroke={isDarkMode ? '#475569' : '#94a3b8'} fontSize={10} fontWeight={700} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', 
                          padding: '12px sm:padding-16px',
                          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                          color: isDarkMode ? '#ffffff' : '#0f172a'
                        }}
                        cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                      />
                      <Bar dataKey="count" fill={isDarkMode ? '#38bdf8' : '#0f172a'} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Performers */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
                <div className="mb-6 sm:mb-10">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Leaderboard</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    Elite Scholars
                  </h3>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  {stats?.topUsers?.map((user: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 w-4">
                          {i + 1}
                        </span>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-slate-600 dark:text-slate-500 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all text-xs sm:text-sm">
                          {user.displayName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">{user.displayName}</p>
                          <p className="text-[8px] sm:text-[9px] text-slate-600 dark:text-slate-500 font-bold uppercase tracking-wider">{user.level}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-xs sm:text-sm text-sky-600 dark:text-sky-400">{user.points?.toLocaleString()}</p>
                        <p className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase">PTS</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-3 sm:flex bg-white dark:bg-slate-900 p-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-fit shadow-sm gap-1">
              <button
                onClick={() => setSubTab('generate')}
                className={cn(
                   "px-2 sm:px-6 py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-lg sm:rounded-xl transition-all text-center flex items-center justify-center",
                   subTab === 'generate' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                Generate
              </button>
              <button
                onClick={() => setSubTab('extract')}
                className={cn(
                   "px-2 sm:px-6 py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-lg sm:rounded-xl transition-all text-center flex items-center justify-center",
                   subTab === 'extract' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                Extract
              </button>
              <button
                onClick={() => setSubTab('bank')}
                className={cn(
                   "px-2 sm:px-6 py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-lg sm:rounded-xl transition-all text-center flex items-center justify-center",
                   subTab === 'bank' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                Bank
              </button>
              <button
                onClick={() => setSubTab('create')}
                className={cn(
                   "px-2 sm:px-6 py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-lg sm:rounded-xl transition-all text-center flex items-center justify-center",
                   subTab === 'create' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                Manual
              </button>
            </div>

            {subTab === 'generate' ? (
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Academic Level</label>
                      <select
                        value={level}
                        onChange={(e) => {
                          setLevel(e.target.value as any);
                          setTopicId('');
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer"
                      >
                        <option value="secondary">Economics SS1</option>
                        <option value="undergraduate">Undergraduate</option>
                      </select>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Target Topic</label>
                      <select
                        value={topicId}
                        onChange={(e) => setTopicId(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        {topics.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 sm:space-y-3 col-span-1 sm:col-span-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Question Count</label>
                      <input
                        type="number"
                        value={isNaN(count) ? '' : count}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setCount(isNaN(val) ? 0 : val);
                        }}
                        min="1"
                        max="20"
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !topicId}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Generate Questions
                  </button>
                </div>

                {generatedQuestions.length > 0 && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 sm:pb-6 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">AI Output</p>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">Generated Preview</h2>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-sky-600 text-white px-6 sm:px-8 py-3.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:bg-sky-700 transition-all w-full sm:w-auto"
                      >
                        Save to Bank
                      </button>
                    </div>
                    <div className="grid gap-4 sm:gap-6">
                      {generatedQuestions.map((q, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
                          <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-lg font-bold">
                              {i + 1}
                            </span>
                            <p className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight font-sans">{q.question}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ml-0 sm:ml-14 md:ml-16">
                            {q.options.map((opt: string, idx: number) => (
                              <div key={idx} className={cn(
                                "p-4 sm:p-5 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold transition-all",
                                idx === q.correctAnswer 
                                  ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-900/30 text-sky-700 dark:text-sky-400' 
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-500'
                              )}>
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : subTab === 'extract' ? (
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
                  <div className="mb-6 sm:mb-10">
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Document Parsing</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                       Extract from PDF
                    </h3>
                  </div>
                  
                  {/* Upload Interface */}
                  <div className="mb-6 sm:mb-8">
                    <label 
                      htmlFor="pdf-upload" 
                      className="flex flex-col items-center justify-center w-full h-32 sm:h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileUp className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 group-hover:text-sky-500 transition-colors mb-3 sm:mb-4" />
                        <p className="mb-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
                          <span className="text-sky-500">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">PDF (MAX. 20MB)</p>
                      </div>
                      <input 
                        id="pdf-upload" 
                        type="file" 
                        accept="application/pdf"
                        className="hidden" 
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>

                  {pdfFile && (
                    <div className="flex items-center justify-between p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl sm:rounded-2xl border border-sky-100 dark:border-sky-900/30 mb-6 sm:mb-8">
                      <div className="flex items-center gap-3">
                        <FileText className="text-sky-500" size={20} />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{pdfFile.name}</p>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setPdfFile(null);
                          setPdfBase64('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Academic Level</label>
                      <select
                        value={level}
                        onChange={(e) => {
                          setLevel(e.target.value as any);
                          setTopicId('');
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer"
                      >
                        <option value="secondary">Economics SS1</option>
                        <option value="undergraduate">Undergraduate</option>
                      </select>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Target Topic</label>
                      <select
                        value={topicId}
                        onChange={(e) => setTopicId(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        {topics.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 sm:space-y-3 col-span-1 sm:col-span-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Question Count</label>
                      <input
                        type="number"
                        value={isNaN(count) ? '' : count}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setCount(isNaN(val) ? 0 : val);
                        }}
                        min="1"
                        max="20"
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleExtractFromPdf}
                    disabled={loading || !topicId || !pdfBase64}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                    Extract Questions
                  </button>
                </div>

                {generatedQuestions.length > 0 && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 sm:pb-6 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">AI Output</p>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">Extracted Preview</h2>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-sky-600 text-white px-6 sm:px-8 py-3.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:bg-sky-700 transition-all w-full sm:w-auto"
                      >
                        Save to Bank
                      </button>
                    </div>
                    <div className="grid gap-4 sm:gap-6">
                      {generatedQuestions.map((q, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
                          <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-lg font-bold">
                              {i + 1}
                            </span>
                            <p className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight font-sans">{q.question}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ml-0 sm:ml-14 md:ml-16">
                            {q.options.map((opt: string, idx: number) => (
                              <div key={idx} className={cn(
                                "p-4 sm:p-5 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold transition-all",
                                idx === q.correctAnswer 
                                  ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-900/30 text-sky-700 dark:text-sky-400' 
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-500'
                              )}>
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : subTab === 'create' ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
                <div className="mb-6 sm:mb-10">
                  <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Manual Entry</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    Create New Question
                  </h3>
                </div>
                <form onSubmit={handleCreateQuestion} className="space-y-6 sm:space-y-8 animate-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Academic Level</label>
                      <select
                        value={newQuestion.level}
                        onChange={(e) => {
                          setNewQuestion({ ...newQuestion, level: e.target.value as any, topicId: '' });
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer font-sans"
                        required
                      >
                        <option value="secondary">Economics SS1</option>
                        <option value="undergraduate">Undergraduate</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Target Topic</label>
                      <select
                        value={newQuestion.topicId}
                        onChange={(e) => setNewQuestion({ ...newQuestion, topicId: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer font-sans"
                        required
                      >
                        <option value="">Select a topic</option>
                        {(newQuestion.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP).map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Question Text</label>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all min-h-[100px] sm:min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {newQuestion.options.map((opt, i) => (
                      <div key={i} className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Option {i + 1}</label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[i] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: newOptions });
                          }}
                          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Correct Answer</label>
                    <select
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: parseInt(e.target.value) })}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer font-sans"
                    >
                      {newQuestion.options.map((_, i) => (
                        <option key={i} value={i}>Option {i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Explanation (Optional)</label>
                    <textarea
                      value={newQuestion.explanation || ''}
                      onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all min-h-[70px] sm:min-h-[80px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !newQuestion.topicId || !newQuestion.question}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Question Manually
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex items-center gap-4">
                  <Search className="text-slate-400 dark:text-slate-600 flex-shrink-0" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search question bank..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
                <div className="grid gap-4 sm:gap-6">
                  {bankQuestions.map((q, i) => (
                    <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-8">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-full">{q.level}</span>
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">{q.topicId}</span>
                          </div>
                          <p className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight font-sans">{q.question}</p>
                        </div>
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                          <button 
                            onClick={() => setEditingQuestion(q)}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(q.id!)}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl text-slate-400 dark:text-slate-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center justify-center border border-transparent hover:border-rose-200 dark:hover:border-rose-900/30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Search className="text-slate-400 dark:text-slate-600 flex-shrink-0" size={18} />
                <input 
                  type="text" 
                  placeholder="Search scholars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-center">
                {filteredUsers.length} Scholars
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-5 sm:px-8 md:px-10 py-4 sm:py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Scholar</th>
                    <th className="px-5 sm:px-8 md:px-10 py-4 sm:py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Level</th>
                    <th className="px-5 sm:px-8 md:px-10 py-4 sm:py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Points</th>
                    <th className="px-5 sm:px-8 md:px-10 py-4 sm:py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-5 sm:px-8 md:px-10 py-4 sm:py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-5 sm:px-8 md:px-10 py-4 sm:py-6">
                        <div className="flex items-center gap-3 sm:gap-5">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all flex-shrink-0">
                            {user.displayName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.displayName}</p>
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 sm:px-8 md:px-10 py-4 sm:py-6">
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full">{user.level}</span>
                      </td>
                      <td className="px-5 sm:px-8 md:px-10 py-4 sm:py-6">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{user.points?.toLocaleString()}</span>
                      </td>
                      <td className="px-5 sm:px-8 md:px-10 py-4 sm:py-6">
                        <span className={cn(
                          "text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full",
                          user.role === 'admin' ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500"
                        )}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-5 sm:px-8 md:px-10 py-4 sm:py-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          {user.role === 'admin' ? (
                            <button 
                              onClick={() => handleUpdateRole(user.uid, user.role || 'user')}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700 gap-1"
                              title="Demote to User"
                            >
                              <Shield size={12} className="text-slate-400 dark:text-slate-500" />
                              <span className="hidden sm:inline">Make User</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUpdateRole(user.uid, user.role || 'user')}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all flex items-center justify-center border border-transparent hover:border-sky-200 dark:hover:border-sky-900/30 gap-1"
                              title="Promote to Admin"
                            >
                              <ShieldCheck size={12} />
                              <span className="hidden sm:inline">Make Admin</span>
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteUser(user.uid)}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-slate-400 dark:text-slate-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center justify-center border border-transparent hover:border-rose-200 dark:hover:border-rose-900/30 flex-shrink-0"
                            title="Delete User"
                          >
                            <UserMinus size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
              <div className="mb-6 sm:mb-10">
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Live Feed</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Live Duel Stream
                </h3>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {recentDuels.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest text-[10px]">No recent activity recorded.</div>
                ) : (
                  recentDuels.map((duel, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all group gap-4">
                      <div className="flex items-center gap-4 sm:gap-8">
                        <div className="flex -space-x-3 sm:-space-x-4 flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white dark:border-slate-900 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg">
                            {duel.winnerName?.charAt(0) || '?'}
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg">
                            {duel.loserName?.charAt(0) || '?'}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                            {duel.winnerName} <span className="text-slate-400 dark:text-slate-600 font-medium mx-1 uppercase text-[9px] sm:text-[10px] tracking-widest">defeated</span> {duel.loserName}
                          </p>
                          <p className="text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                            {duel.topicId} • {formatDistanceToNow(duel.timestamp?.toDate() || new Date())} ago
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-dashed border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                        <p className="font-bold text-lg sm:text-xl text-sky-600 dark:text-sky-400">+{duel.pointsAwarded}</p>
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 sm:ml-0">Points</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm">
              <div className="mb-6 sm:mb-10">
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">System Config</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Global Announcement
                </h3>
              </div>
              <div className="space-y-6 sm:space-y-10">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Broadcast Message</label>
                  <textarea
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    placeholder="Enter system-wide announcement..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all min-h-[120px] sm:min-h-[150px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Priority Level</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700">
                      {(['info', 'warning', 'success'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setAnnouncementType(type)}
                          className={cn(
                            "flex-1 py-2 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-lg sm:rounded-xl transition-all",
                            announcementType === type ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md shadow-slate-900/5" : "text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          )}
                        >
                           {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSaveAnnouncement}
                      disabled={loading}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Deploy Broadcast
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] font-sans"
          >
            <div className="px-6 py-5 sm:px-10 sm:py-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
              <div>
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Editor</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Question</h3>
              </div>
              <button onClick={() => setEditingQuestion(null)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateQuestion} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Question Text</label>
                <textarea
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all min-h-[100px] sm:min-h-[120px]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {editingQuestion.options.map((opt, i) => (
                  <div key={i} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Option {i + 1}</label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.options];
                        newOptions[i] = e.target.value;
                        setEditingQuestion({ ...editingQuestion, options: newOptions });
                      }}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Correct Answer</label>
                <select
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: parseInt(e.target.value) })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer font-sans"
                >
                  {editingQuestion.options.map((_, i) => (
                    <option key={i} value={i}>Option {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Explanation (Optional)</label>
                <textarea
                  value={editingQuestion.explanation || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all min-h-[70px] sm:min-h-[80px]"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="flex-1 px-6 py-3.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 uppercase tracking-widest text-[10px] text-center"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 sm:p-10 shadow-2xl text-center mx-4 font-sans"
          >
            <div className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 mx-auto",
              confirmAction.type === 'update_role' 
                ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400" 
                : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
            )}>
              {confirmAction.type === 'update_role' ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Are you sure?</h3>
            <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm mb-6 sm:mb-10 font-medium">{confirmAction.message}</p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-6 py-3.5 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'delete_question') executeDeleteQuestion(confirmAction.id);
                  if (confirmAction.type === 'update_role') executeUpdateRole(confirmAction.id, (confirmAction as any).extra);
                  if (confirmAction.type === 'delete_user') executeDeleteUser(confirmAction.id);
                }}
                className={cn(
                  "flex-1 text-white py-3.5 rounded-xl sm:rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl",
                  confirmAction.type === 'update_role'
                    ? "bg-sky-600 hover:bg-sky-700 shadow-sky-500/20"
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                )}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl z-[60] flex items-center gap-4 border border-slate-800"
          >
            <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
