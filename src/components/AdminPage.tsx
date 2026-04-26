import React, { useState, useEffect } from 'react';
import { generateQuestions } from '../gemini';
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
  BookOpen, Award, Activity, AlertTriangle, Check, Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

import { cn } from '../lib/utils';

import { DarkModeProvider, useDarkMode } from '../DarkModeContext';

export const AdminPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'users' | 'activity' | 'settings'>('overview');
  const [subTab, setSubTab] = useState<'generate' | 'bank'>('generate');
  
  // Stats State
  const [stats, setStats] = useState<any>(null);
  
  // Questions State
  const [level, setLevel] = useState<'secondary' | 'undergraduate'>('secondary');
  const [topicId, setTopicId] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
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
    if (!topicId) return;
    setLoading(true);
    setSaved(false);
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const questions = await generateQuestions(topic.title, level, count);
    setGeneratedQuestions(questions);
    setLoading(false);
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
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-950/50">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Control Center</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md font-medium">Manage your platform content, users, and system settings with precision.</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'questions', icon: BookOpen, label: 'Content' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'activity', icon: Activity, label: 'Activity' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/10" 
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Scholars', value: stats?.totalUsers || 0, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Question Bank', value: stats?.totalQuestions || 0, icon: BookOpen, color: 'text-slate-600', bg: 'bg-slate-50' },
                { label: 'Global Points', value: stats?.totalPoints?.toLocaleString() || 0, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Active Duels', value: recentDuels.length, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((stat, i) => (
                <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", stat.bg, stat.bg.includes('slate') && 'dark:bg-slate-800')}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Live Data</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Popular Topics Chart */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Engagement</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      Popular Topics
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500">
                    <Activity size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Analysis</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.popularTopics || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="id" hide />
                      <YAxis stroke={isDarkMode ? '#475569' : '#94a3b8'} fontSize={10} fontWeight={700} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '20px', 
                          border: 'none', 
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', 
                          padding: '16px',
                          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                          color: isDarkMode ? '#ffffff' : '#0f172a'
                        }}
                        cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                      />
                      <Bar dataKey="count" fill={isDarkMode ? '#38bdf8' : '#0f172a'} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Performers */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
                <div className="mb-10">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Leaderboard</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    Elite Scholars
                  </h3>
                </div>
                <div className="space-y-6">
                  {stats?.topUsers?.map((user: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 w-4">
                          {i + 1}
                        </span>
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-600 dark:text-slate-500 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all">
                          {user.displayName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{user.displayName}</p>
                          <p className="text-[9px] text-slate-600 dark:text-slate-500 font-bold uppercase tracking-wider">{user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-sky-600 dark:text-sky-400">{user.points?.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase">PTS</p>
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
            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit shadow-sm">
              <button
                onClick={() => setSubTab('generate')}
                className={cn(
                   "px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                   subTab === 'generate' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/10" : "text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                Generate Content
              </button>
              <button
                onClick={() => setSubTab('bank')}
                className={cn(
                   "px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                   subTab === 'bank' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/10" : "text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                Question Bank
              </button>
            </div>

            {subTab === 'generate' ? (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
                  <div className="grid md:grid-cols-3 gap-8 mb-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Academic Level</label>
                      <select
                        value={level}
                        onChange={(e) => {
                          setLevel(e.target.value as any);
                          setTopicId('');
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all appearance-none cursor-pointer"
                      >
                        <option value="secondary">Secondary School</option>
                        <option value="undergraduate">Undergraduate</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Target Topic</label>
                      <select
                        value={topicId}
                        onChange={(e) => setTopicId(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        {topics.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Question Count</label>
                      <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        min="1"
                        max="20"
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !topicId}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Generate Questions
                  </button>
                </div>

                {generatedQuestions.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                      <div>
                        <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">AI Output</p>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Generated Preview</h2>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-sky-600 text-white px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:bg-sky-700 transition-all"
                      >
                        Save to Bank
                      </button>
                    </div>
                    <div className="grid gap-6">
                      {generatedQuestions.map((q, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
                          <div className="flex items-start gap-6 mb-8">
                            <span className="flex-shrink-0 w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center text-lg font-bold">
                              {i + 1}
                            </span>
                            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{q.question}</p>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4 ml-16">
                            {q.options.map((opt: string, idx: number) => (
                              <div key={idx} className={cn(
                                "p-5 rounded-2xl border text-sm font-bold transition-all",
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
            ) : (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-5">
                  <Search className="text-slate-400 dark:text-slate-600" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search question bank..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
                <div className="grid gap-6">
                  {bankQuestions.map((q, i) => (
                    <div key={q.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex items-start justify-between gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-3 py-1.5 rounded-full">{q.level}</span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">{q.topicId}</span>
                          </div>
                          <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{q.question}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setEditingQuestion(q)}
                            className="w-12 h-12 rounded-2xl text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(q.id!)}
                            className="w-12 h-12 rounded-2xl text-slate-400 dark:text-slate-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center justify-center border border-transparent hover:border-rose-200 dark:hover:border-rose-900/30"
                          >
                            <Trash2 size={18} />
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
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-5">
              <Search className="text-slate-400 dark:text-slate-600" size={20} />
              <input 
                type="text" 
                placeholder="Search scholars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Scholar</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Level</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Points</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all">
                            {user.displayName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{user.displayName}</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full">{user.level}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{user.points?.toLocaleString()}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full",
                          user.role === 'admin' ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateRole(user.uid, user.role || 'user')}
                            className="w-10 h-10 rounded-xl text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            title="Toggle Admin Role"
                          >
                            <Shield size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.uid)}
                            className="w-10 h-10 rounded-xl text-slate-400 dark:text-slate-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center justify-center border border-transparent hover:border-rose-200 dark:hover:border-rose-900/30"
                            title="Delete User"
                          >
                            <UserMinus size={16} />
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
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
              <div className="mb-10">
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Live Feed</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Live Duel Stream
                </h3>
              </div>
              <div className="space-y-6">
                {recentDuels.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest text-[10px]">No recent activity recorded.</div>
                ) : (
                  recentDuels.map((duel, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all group">
                      <div className="flex items-center gap-8">
                        <div className="flex -space-x-4">
                          <div className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shadow-lg">
                            {duel.winnerName?.charAt(0) || '?'}
                          </div>
                          <div className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 flex items-center justify-center font-bold text-sm shadow-lg">
                            {duel.winnerName?.charAt(0) || '?'}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">
                            {duel.winnerName} <span className="text-slate-400 dark:text-slate-600 font-medium mx-1 uppercase text-[10px] tracking-widest">defeated</span> {duel.loserName}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                            {duel.topicId} • {formatDistanceToNow(duel.timestamp?.toDate() || new Date())} ago
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-sky-600 dark:text-sky-400">+{duel.pointsAwarded}</p>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Points</span>
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
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
              <div className="mb-10">
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">System Config</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Global Announcement
                </h3>
              </div>
              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Broadcast Message</label>
                  <textarea
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    placeholder="Enter system-wide announcement..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all min-h-[150px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Priority Level</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      {(['info', 'warning', 'success'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setAnnouncementType(type)}
                          className={cn(
                            "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                            announcementType === type ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg shadow-slate-900/5" : "text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
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
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
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
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 w-full max-w-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
              <div>
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Editor</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Question</h3>
              </div>
              <button onClick={() => setEditingQuestion(null)} className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateQuestion} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Question Text</label>
                <textarea
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all min-h-[120px]"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {editingQuestion.options.map((opt, i) => (
                  <div key={i} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Option {i + 1}</label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.options];
                        newOptions[i] = e.target.value;
                        setEditingQuestion({ ...editingQuestion, options: newOptions });
                      }}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-1">Correct Answer</label>
                <select
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: parseInt(e.target.value) })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all appearance-none cursor-pointer"
                >
                  {editingQuestion.options.map((_, i) => (
                    <option key={i} value={i}>Option {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 w-full max-md p-10 shadow-2xl text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-8 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Are you sure?</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm mb-10 font-medium">{confirmAction.message}</p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-8 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'delete_question') executeDeleteQuestion(confirmAction.id);
                  if (confirmAction.type === 'update_role') executeUpdateRole(confirmAction.id, (confirmAction as any).extra);
                  if (confirmAction.type === 'delete_user') executeDeleteUser(confirmAction.id);
                }}
                className="flex-1 bg-rose-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20"
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
