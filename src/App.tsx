import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { generateStudyGuide } from './gemini';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell,
  PieChart, Pie, ComposedChart
} from 'recharts';
import { EconomicsSimulator } from './components/EconomicsSimulator';
import { AdminPage } from './components/AdminPage';
import { Leaderboard } from './components/Leaderboard';
import { LiveChallenge } from './components/LiveChallenge';
import { MICRO_STUDY_GUIDE } from './lib/studyData';
import { ADVANCED_STUDY_GUIDE } from './lib/advancedStudyData';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './useAuth';
import { 
  loginWithGoogle, registerWithEmail, loginWithEmail, logout, createUserProfile, UserProfile, updateProgress, 
  updatePoints, getUserProfile, getQuestions, updateUserLevel, 
  getGlobalAnnouncement, saveDuelResult 
} from './firebase';
import { SECONDARY_ROADMAP, UNDERGRADUATE_ROADMAP, CHALLENGES } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, User, LogOut, ChevronRight, CheckCircle2, Circle, LayoutDashboard, GraduationCap, School, List, Database, Swords, Menu, X, Loader2, Megaphone, TrendingUp, Award, Sun, Moon, Quote, HelpCircle, ArrowUpRight, Zap, Globe, ShieldCheck, Star, MessageSquare } from 'lucide-react';
import { DarkModeProvider, useDarkMode } from './DarkModeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState<any>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await getGlobalAnnouncement();
        if (data && data.message) {
          setAnnouncement(data);
        }
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      }
    };
    fetchAnnouncement();
  }, []);

  if (!announcement || !visible) return null;

  const colors = {
    info: 'bg-blue-600 text-white',
    warning: 'bg-amber-500 text-white',
    success: 'bg-emerald-600 text-white'
  };

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed top-16 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between shadow-xl border-b border-white/10",
        colors[announcement.type as keyof typeof colors] || colors.info
      )}
    >
      <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
        <Megaphone size={18} className="shrink-0 animate-pulse" />
        <p className="text-[11px] font-bold uppercase tracking-widest">{announcement.message}</p>
      </div>
      <button onClick={() => setVisible(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors mr-4">
        <X size={16} />
      </button>
    </motion.div>
  );
};

import { AuthModal } from './components/AuthModal';

const Navbar = () => {
  const { user, profile, loading } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  useEffect(() => {
    if (user && !loading && !profile && window.location.pathname !== '/select-level') {
      navigate('/select-level');
    }
    if (!user) {
      setIsMenuOpen(false);
    }
  }, [user, loading, profile, navigate]);

  const NavLinks = () => {
    const isAdmin = profile?.role === 'admin' || user?.email === 'chukwuekudavid@gmail.com';
    return (
      <>
        {isAdmin && (
          <Link 
            to="/admin" 
            onClick={() => setIsMenuOpen(false)}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-ink transition-all flex items-center gap-2 py-2 md:py-0"
          >
            <Database size={14} />
            <span>Admin</span>
          </Link>
        )}
      <Link 
        to="/leaderboard" 
        onClick={() => setIsMenuOpen(false)}
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-ink transition-all flex items-center gap-2 py-2 md:py-0"
      >
        <Trophy size={14} />
        <span>Leaderboard</span>
      </Link>
      <Link 
        to="/live" 
        onClick={() => setIsMenuOpen(false)}
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-ink transition-all flex items-center gap-2 py-2 md:py-0"
      >
        <Swords size={14} />
        <span>Live Duel</span>
      </Link>
      <Link 
        to="/dashboard" 
        onClick={() => setIsMenuOpen(false)}
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-ink transition-all flex items-center gap-2 py-2 md:py-0"
      >
        <BookOpen size={14} />
        <span>Study Guide</span>
      </Link>
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 glass z-50 px-6 md:px-10 flex items-center justify-between transition-colors duration-500">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-all shadow-lg shadow-accent/20">E</div>
        <span className="text-2xl font-bold tracking-tight text-ink">EcoLearn</span>
      </Link>

      <div className="flex items-center gap-6 md:gap-10">
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center text-muted hover:text-sky-500 hover:bg-paper dark:hover:bg-slate-800 rounded-xl transition-all"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <>
            <div className="hidden lg:flex items-center gap-10">
              <NavLinks />
            </div>

            <div className="hidden sm:flex items-center gap-6 pl-10 border-l border-border">
              <div className="text-right">
                <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em]">Scholar</p>
                <p className="text-sm font-bold text-ink">{profile?.displayName || user.displayName}</p>
              </div>
              <button onClick={logout} className="w-10 h-10 flex items-center justify-center text-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
                <LogOut size={18} />
              </button>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-12 h-12 bg-card border border-border text-ink hover:border-accent transition-all flex items-center justify-center rounded-2xl"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
              className="btn-premium py-2.5 px-6"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultIsLogin={authMode === 'login'} />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 bg-card rounded-[2.5rem] border border-border shadow-2xl p-10 lg:hidden flex flex-col gap-8 transition-colors duration-500"
          >
            <div className="flex items-center gap-5 pb-6 border-b border-border sm:hidden">
              <div className="w-14 h-14 bg-paper dark:bg-slate-800 rounded-2xl flex items-center justify-center text-ink font-bold text-lg transition-colors duration-500">
                {(profile?.displayName || user?.displayName)?.[0]}
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em]">Scholar</p>
                <p className="text-lg font-bold text-ink">{profile?.displayName || user?.displayName}</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <NavLinks />
            </div>
            <button 
              onClick={() => { setIsMenuOpen(false); logout(); }}
              className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors pt-6 mt-2 border-t border-border"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Landing = () => {
  const { user, profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'secondary' | 'undergraduate'>('secondary');

  const handleStart = async (level: 'secondary' | 'undergraduate') => {
    if (!user) {
      setSelectedLevel(level);
      setIsAuthModalOpen(true);
      return;
    }
    
    if (!profile) {
       const newProfile = await createUserProfile(user, level);
       setProfile(newProfile);
    } else if (profile.level !== level) {
       await updateUserLevel(user.uid, level);
       setProfile({ ...profile, level });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-paper transition-colors duration-500">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultLevel={selectedLevel} defaultIsLogin={false} />
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-24 md:pb-40 px-6 md:px-10 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="bg-noise" />
          <div className="atmosphere-layer" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-grid" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10 inline-flex items-center gap-3 px-6 py-2 bg-card border border-border rounded-full shadow-lg transition-colors duration-500"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-paper overflow-hidden transition-colors duration-500">
                    <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <span className="text-micro">
                Joined by 50,000+ Scholars
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-display mb-8 max-w-5xl"
            >
              Master <span className="text-accent italic font-serif font-normal">the</span> <br />
              Economics <span className="text-slate-400 dark:text-slate-600">Universe</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-muted leading-relaxed mb-16 max-w-3xl font-medium"
            >
              The definitive platform for global scholars. From foundational principles to advanced econometrics, master every concept with AI-guided clarity.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <button 
                onClick={() => handleStart('secondary')}
                className="btn-premium group"
              >
                Secondary Education
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => handleStart('undergraduate')}
                className="btn-outline group"
              >
                Undergraduate Level
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-border py-16 mt-20 transition-colors duration-500"
          >
            {[
              { label: 'Active Scholars', value: '50k+', icon: User },
              { label: 'Study Modules', value: '1.2k+', icon: BookOpen },
              { label: 'Live Duels', value: '250k+', icon: Swords },
              { label: 'AI Guides', value: '10k+', icon: Loader2 }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-3 mb-3">
                  <stat.icon size={16} className="text-accent" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{stat.label}</p>
                </div>
                <p className="text-5xl font-bold text-ink tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-b border-paper dark:border-slate-800/50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center mb-10">
            Trusted by Scholars from Leading Institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Oxford', 'Stanford', 'MIT', 'Harvard', 'LSE', 'Cambridge'].map((uni) => (
              <span key={uni} className="text-xl md:text-2xl font-serif font-bold text-ink tracking-tighter uppercase transition-colors duration-500">
                {uni}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-40 px-6 md:px-10 bg-paper transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4">The Journey</p>
            <h2 className="text-4xl md:text-6xl font-bold text-ink tracking-tight transition-colors duration-500">How it <span className="text-accent italic font-serif font-normal">Works</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0 transition-colors duration-500" />
            
            {[
              { step: '01', title: 'Choose Path', desc: 'Select between Secondary or Undergraduate roadmaps tailored to your current academic goals.', icon: School },
              { step: '02', title: 'AI Mastery', desc: 'Engage with dynamic study guides and simulators powered by advanced AI models.', icon: Loader2 },
              { step: '03', title: 'Live Arena', desc: 'Test your knowledge in real-time duels and climb the global leaderboard of scholars.', icon: Trophy }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 bg-card p-12 rounded-[3rem] border-none ring-1 ring-ink/5 dark:ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.1)] hover:-translate-y-2 transition-all duration-500 group text-center"
              >
                <div className="w-16 h-16 bg-slate-900 dark:bg-sky-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-xl font-bold group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xl shadow-slate-900/10">
                  <item.icon size={24} />
                </div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4">Step {item.step}</p>
                <h3 className="text-2xl font-bold text-ink mb-4 tracking-tight">{item.title}</h3>
                <p className="text-muted font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-24 md:py-40 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4">Academic Tracks</p>
            <h2 className="text-5xl md:text-7xl font-bold text-ink leading-[0.9] tracking-tight transition-colors duration-500">Choose Your <br /> <span className="text-slate-400 dark:text-slate-600">Specialization</span></h2>
          </div>
          <p className="text-xl text-muted max-w-md font-medium leading-relaxed transition-colors duration-500">
            Whether you're preparing for high school finals or diving into university research, we have a path for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-card p-16 rounded-[4rem] border-none ring-1 ring-ink/5 dark:ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.1)] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.07] group-hover:opacity-[0.1] transition-opacity text-ink pointer-events-none transition-colors duration-500">
              <School size={240} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <div className="w-20 h-20 bg-paper dark:bg-slate-800 rounded-3xl flex items-center justify-center text-ink group-hover:bg-slate-900 dark:group-hover:bg-sky-600 group-hover:text-white transition-all shadow-lg transition-colors duration-500">
                  <School size={40} />
                </div>
                <div className="px-6 py-2 bg-paper dark:bg-sky-900/20 shadow-sm text-accent text-[10px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-2 transition-colors duration-500">
                  <Award size={14} />
                  EXAM PREP READY
                </div>
              </div>
              <h3 className="text-5xl font-bold text-ink mb-6 tracking-tight">Secondary</h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium">Comprehensive coverage of high school economics curriculum. Curated questions aligned with global standards for academic excellence.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-16">
                {['Micro Foundations', 'Market Dynamics', 'Global Trade', 'Fiscal Policy'].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold text-ink">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    {item}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleStart('secondary')}
                className="w-full py-5 btn-premium justify-center mt-auto"
              >
                Start Roadmap
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-card p-16 rounded-[4rem] border-none ring-1 ring-ink/5 dark:ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.1)] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.07] group-hover:opacity-[0.1] transition-opacity text-ink pointer-events-none transition-colors duration-500">
              <GraduationCap size={240} />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-paper dark:bg-slate-800 rounded-3xl flex items-center justify-center text-ink group-hover:bg-slate-900 dark:group-hover:bg-sky-600 group-hover:text-white transition-all shadow-lg mb-12 transition-colors duration-500">
                <GraduationCap size={40} />
              </div>
              <h3 className="text-5xl font-bold text-ink mb-6 tracking-tight">Undergraduate</h3>
              <p className="text-xl text-muted mb-12 leading-relaxed font-medium transition-colors duration-500">Advanced university-level topics. Deep dive into Micro, Macro, and specialized fields for future economists.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-16">
                {['Microeconomics', 'Macroeconomics', 'Econometrics', 'Finance'].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold text-ink transition-colors duration-500">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    {item}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleStart('undergraduate')}
                className="w-full py-5 btn-premium justify-center mt-auto"
              >
                Start Roadmap
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Arena Preview */}
      <section className="py-24 md:py-40 px-6 md:px-10 bg-card border-y border-border overflow-hidden relative transition-colors duration-500">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] dark:opacity-[0.1] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-accent/30 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-6">Competitive Learning</p>
              <h2 className="text-5xl md:text-7xl font-bold text-ink mb-10 leading-[0.9] tracking-tight transition-colors duration-500">Enter the <br /> <span className="text-accent italic font-serif font-normal">Live Arena</span></h2>
              <p className="text-xl text-muted mb-12 leading-relaxed font-medium transition-colors duration-500">
                Knowledge is best tested in the heat of competition. Duel with other scholars, earn points, and prove your mastery in real-time economics challenges.
              </p>
              
              <div className="space-y-8 mb-16">
                {[
                  { title: 'Real-time Matchmaking', desc: 'Find opponents at your skill level instantly.' },
                  { title: 'Dynamic Question Sets', desc: 'AI-curated questions that adapt to the duel intensity.' },
                  { title: 'Instant Rankings', desc: 'See your position on the global stage immediately.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-accent" size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-ink mb-1 transition-colors duration-500">{item.title}</h4>
                      <p className="text-muted text-sm transition-colors duration-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                to="/live"
                className="btn-premium inline-flex py-5"
              >
                Go to Arena
                <Swords size={20} />
              </Link>
            </div>

            <div className="relative">
              <motion.div 
                initial={{ rotate: -5, y: 40, opacity: 0 }}
                whileInView={{ rotate: 0, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-paper p-10 rounded-[3rem] border border-border shadow-2xl relative z-10 transition-colors duration-500"
              >
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-border transition-colors duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-bold text-white shadow-lg">S1</div>
                    <div>
                      <p className="text-xs font-bold text-ink transition-colors duration-500">Scholar_Alpha</p>
                      <p className="text-[10px] text-muted transition-colors duration-500">Level 42</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">VS</p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-xs font-bold text-ink transition-colors duration-500">Econ_Master</p>
                      <p className="text-[10px] text-muted transition-colors duration-500">Level 38</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center font-bold text-white shadow-lg">E2</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-center text-sm font-medium text-muted mb-8 transition-colors duration-500">Current Question: Macroeconomic Equilibrium</p>
                  <div className="h-3 bg-border rounded-full overflow-hidden transition-colors duration-500">
                    <div className="h-full bg-accent w-2/3" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted transition-colors duration-500">
                    <span>1,250 PTS</span>
                    <span>840 PTS</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 md:py-40 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] mb-4">The EcoLearn Edge</p>
          <h2 className="text-4xl md:text-6xl font-bold text-ink tracking-tight">Advanced <span className="text-sky-600 italic font-serif font-normal">Capabilities</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main AI Feature */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-2 bg-paper border border-border rounded-[3rem] p-12 text-ink relative overflow-hidden group transition-colors duration-500"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={200} className="text-accent" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-accent/20">
                  <Zap size={28} className="text-white" />
                </div>
                <h3 className="text-4xl font-bold mb-6 tracking-tight">AI-Powered Study Guides</h3>
                <p className="text-xl text-muted max-w-md leading-relaxed">
                  Our proprietary AI engine synthesizes complex economic theories into digestible, interactive study modules tailored to your specific curriculum.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4 text-accent font-bold uppercase tracking-widest text-xs cursor-pointer hover:text-sky-600 transition-colors">
                Explore Technology <ArrowUpRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* Secondary Features */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-card border border-border rounded-[3rem] p-10 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 bg-paper dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-sky-600">
              <Globe size={24} />
            </div>
            <h4 className="text-xl font-bold text-ink mb-3 tracking-tight">Global Duels</h4>
            <p className="text-muted text-sm leading-relaxed">
              Compete with scholars worldwide in real-time economics challenges.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-card border border-border rounded-[3rem] p-10 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 bg-paper dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-sky-600">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-xl font-bold text-ink mb-3 tracking-tight">Verified Content</h4>
            <p className="text-muted text-sm leading-relaxed">
              All academic material is verified by top-tier economics educators.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-3 bg-sky-50 dark:bg-sky-900/10 rounded-[3rem] p-12 border border-sky-100 dark:border-sky-900/20 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="max-w-xl">
              <h3 className="text-3xl font-bold text-ink mb-4 tracking-tight">Advanced Analytics Dashboard</h3>
              <p className="text-muted leading-relaxed">
                Visualize your learning curve with detailed metrics on every topic. Identify strengths and bridge knowledge gaps with precision.
              </p>
            </div>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-card bg-paper overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i+10}/48/48`} alt="user" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-card bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                +12k
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-40 px-6 md:px-10 bg-paper transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-24 gap-8">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] mb-4">Wall of Love</p>
              <h2 className="text-5xl md:text-6xl font-bold text-ink tracking-tight">Scholars <span className="text-sky-600 italic font-serif font-normal">Speaking</span></h2>
            </div>
            <div className="flex gap-2">
              <div className="flex text-sky-500">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-sm font-bold text-ink">4.9/5 Average Rating</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Dr. Sarah Chen', role: 'Economics Professor', text: 'EcoLearn has transformed how my students engage with complex econometric models. The AI guides are remarkably accurate.', avatar: 'sarah' },
              { name: 'Marcus Thorne', role: 'Undergraduate Student', text: 'The Live Arena is addictive. I went from struggling with macro to topping my class in just three months.', avatar: 'marcus' },
              { name: 'Elena Rodriguez', role: 'Secondary Teacher', text: 'Finally, a platform that makes economics exciting for high schoolers. The gamification is perfectly balanced.', avatar: 'elena' }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-card p-10 rounded-[3rem] border-none ring-1 ring-ink/5 dark:ring-white/10 shadow-sm hover:shadow-[0_20px_50px_rgba(2,132,199,0.1)] transition-all"
              >
                <Quote className="text-sky-500 mb-6" size={32} />
                <p className="text-muted text-lg leading-relaxed mb-8 font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-paper overflow-hidden">
                    <img src={`https://picsum.photos/seed/${t.avatar}/48/48`} alt={t.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h5 className="font-bold text-ink">{t.name}</h5>
                    <p className="text-xs text-muted uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-40 px-6 md:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <HelpCircle className="mx-auto text-sky-500 mb-6" size={48} />
          <h2 className="text-4xl md:text-5xl font-bold text-ink tracking-tight">Common <span className="text-sky-600 italic font-serif font-normal">Questions</span></h2>
        </div>

        <div className="space-y-4">
          {[
            { q: 'Is EcoLearn free for students?', a: 'We offer a comprehensive free tier that includes basic study guides and limited Live Arena duels. Premium features are available for advanced scholars.' },
            { q: 'How accurate are the AI study guides?', a: 'Our AI models are specifically trained on academic economics literature and verified by our board of educators to ensure 99.9% accuracy.' },
            { q: 'Can I use EcoLearn for exam preparation?', a: 'Absolutely. Our Secondary track is aligned with major global curricula including AP, IB, and A-Levels.' },
            { q: 'How do Live Duels work?', a: 'You are matched with a scholar of similar skill. You both answer a series of timed questions, and the highest score wins points and rank.' }
          ].map((faq, i) => (
            <details key={i} className="group bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                <span className="text-lg font-bold text-ink">{faq.q}</span>
                <div className="w-8 h-8 rounded-full bg-paper dark:bg-slate-800 flex items-center justify-center group-open:rotate-180 transition-transform">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </summary>
              <div className="px-8 pb-8 text-muted leading-relaxed font-medium">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 md:py-40 px-6 md:px-10">
        <div className="max-w-7xl mx-auto bg-slate-900 dark:bg-sky-600 rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to start your <span className="italic font-serif font-normal">journey?</span></h2>
            <p className="text-lg md:text-xl text-white/70 mb-12 font-medium">Join thousands of scholars mastering economics with AI-guided clarity today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => handleStart('secondary')}
                className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-slate-100 transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Get Started Now
              </button>
              <Link 
                to="/leaderboard"
                className="w-full sm:w-auto px-12 py-6 bg-transparent border border-white/30 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all hover:scale-105 active:scale-95 flex justify-center items-center"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-24 px-6 md:px-10 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-slate-900 dark:bg-sky-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">E</div>
              <span className="text-2xl font-bold tracking-tight text-ink">EcoLearn</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
              The definitive platform for global scholars. Master economics with AI-guided clarity and real-time competition.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-8">Platform</h4>
            <ul className="space-y-4">
              {['Study Guide', 'Live Arena', 'Leaderboard', 'Simulators'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-8">Connect</h4>
            <ul className="space-y-4">
              {['Twitter', 'Discord', 'Github', 'LinkedIn'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">© 2026 EcoLearn Platform • Built for Excellence</p>
          <div className="flex gap-10">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};


const SelectLevel = () => {
  const { user, setProfile } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (level: 'secondary' | 'undergraduate') => {
    if (!user) return;
    const profile = await createUserProfile(user, level);
    setProfile(profile);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 md:px-10 bg-paper transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-slate-900 dark:bg-sky-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-10 shadow-2xl shadow-slate-900/20 dark:shadow-sky-500/20"
          >
            E
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-ink tracking-tight mb-6"
          >
            Initialize <span className="text-sky-600 italic font-serif font-normal">Roadmap</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted font-medium max-w-md mx-auto"
          >
            Select your academic level to begin your personalized economics journey.
          </motion.p>
        </div>

        <div className="grid gap-6">
          {[
            { id: 'secondary', title: 'Secondary Level', desc: 'High School Economics • Global Exam Prep', icon: School, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-900/20' },
            { id: 'undergraduate', title: 'Undergraduate', desc: 'University Level • Micro, Macro & Econometrics', icon: GraduationCap, color: 'text-ink', bg: 'bg-paper dark:bg-slate-800' }
          ].map((level, i) => (
            <motion.button 
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => handleSelect(level.id as any)}
              className="w-full p-10 bg-card rounded-[2.5rem] border border-border text-left flex items-center justify-between group hover:shadow-2xl hover:border-sky-600 transition-all transition-duration-500"
            >
              <div className="flex items-center gap-8">
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm", level.bg, level.color)}>
                  <level.icon size={36} />
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-ink mb-2 tracking-tight">{level.title}</h4>
                  <p className="text-muted font-medium">{level.desc}</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-paper dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                <ChevronRight size={24} />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-700"
        >
          You can switch levels anytime from your dashboard.
        </motion.p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, profile, setProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const roadmap = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
  const progress = profile?.progress || {};
  const scores = profile?.scores || {};
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = roadmap.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const categories = Array.from(new Set(roadmap.map(t => t.category)));

  const handleSwitchLevel = async () => {
    if (!user || !profile) return;
    const newLevel = profile.level === 'secondary' ? 'undergraduate' : 'secondary';
    if (confirm(`Switch to ${newLevel} level roadmap? Your progress in the current level will be saved.`)) {
      await updateUserLevel(user.uid, newLevel);
      const updatedProfile = await getUserProfile(user.uid);
      setProfile(updatedProfile);
      setSelectedCategory(null); // Reset filter on level switch
    }
  };

  const filteredRoadmap = selectedCategory 
    ? roadmap.filter(t => t.category === selectedCategory)
    : roadmap;

  return (
    <div className="min-h-screen bg-paper pt-24 md:pt-32 pb-24 md:pb-32 px-6 md:px-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-16 md:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="px-4 py-1.5 bg-slate-900 dark:bg-sky-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-slate-900/10">
                Active Scholar
              </div>
              <div className="hidden sm:block px-4 py-1.5 bg-card border border-border text-[10px] font-bold uppercase tracking-[0.2em] text-muted rounded-full">
                UID: {user?.uid.slice(0, 8)}
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ink tracking-tight leading-[0.9] mb-8">
              Welcome, <br /> <span className="text-sky-600 italic font-serif font-normal">{profile?.displayName?.split(' ')[0]}</span>
            </h2>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Roadmap</p>
                <p className="text-lg font-bold text-ink capitalize">{profile?.level}</p>
              </div>
              <button 
                onClick={handleSwitchLevel}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-all border-b-2 border-sky-600/20 hover:border-sky-600 pb-1"
              >
                Switch Level
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[400px] bg-card p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-border shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.07] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-1">Overall Progress</p>
                  <p className="text-sm font-bold text-ink">{completedCount} of {totalCount} Modules</p>
                </div>
                <span className="text-5xl font-bold text-ink tracking-tighter">{percentage}%</span>
              </div>
              <div className="h-3 bg-paper dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-sky-600 shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-24">
          {[
            { label: 'Total Points', value: profile?.points || 0, icon: Award, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-900/20' },
            { label: 'Mastery Modules', value: completedCount, icon: CheckCircle2, color: 'text-ink', bg: 'bg-paper dark:bg-slate-800' },
            { label: 'Global Rank', value: '#--', icon: Trophy, color: 'text-ink', bg: 'bg-paper dark:bg-slate-800' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-border shadow-sm hover:shadow-2xl hover:shadow-sky-500/5 transition-all group relative overflow-hidden transition-duration-500"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.07] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                <stat.icon size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{stat.label}</p>
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", stat.bg, stat.color)}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <p className="text-4xl md:text-6xl font-bold text-ink tracking-tighter">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Roadmap Section */}
        <div className="space-y-8 md:space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 md:px-10 gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Curriculum Roadmap</h3>
              <p className="text-sm text-slate-500 font-medium">Step-by-step guide to mastering economics.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border",
                  !selectedCategory 
                    ? "bg-slate-900 dark:bg-sky-600 text-white border-transparent shadow-lg" 
                    : "bg-card text-muted border-border hover:border-sky-500"
                )}
              >
                All Topics
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border",
                    selectedCategory === cat
                      ? "bg-slate-900 dark:bg-sky-600 text-white border-transparent shadow-lg"
                      : "bg-card text-muted border-border hover:border-sky-500"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mastered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredRoadmap.map((topic, index) => {
              const isCompleted = progress[topic.id];
              const score = scores[topic.id];
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-card flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 p-8 md:p-12 items-start md:items-center rounded-[2.5rem] md:rounded-[3.5rem] border border-border shadow-sm hover:shadow-2xl hover:border-sky-200 dark:hover:border-sky-800 transition-all transition-duration-500 group"
                >
                  <div className="hidden md:block col-span-1 font-bold text-slate-100 dark:text-slate-800 text-4xl tracking-tighter">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="md:col-span-6 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-paper dark:bg-slate-800 text-muted rounded-full">
                        {topic.category}
                      </span>
                      <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-ink tracking-tight">{topic.title}</h4>
                    </div>
                    <p className="text-sm md:text-base text-muted font-medium leading-relaxed">{topic.description}</p>
                  </div>
                  <div className="md:col-span-2 flex md:justify-center w-full md:w-auto">
                    {isCompleted ? (
                      <div className="flex items-center md:flex-col gap-3 md:gap-2">
                        <div className="flex items-center gap-2 px-5 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full">
                          <CheckCircle2 size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Mastered</span>
                        </div>
                        {score !== undefined && (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score: {score}/100</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-5 py-2 bg-paper dark:bg-slate-800 text-slate-400 dark:text-slate-600 rounded-full">
                        <Circle size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Pending</span>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                    <Link 
                      to={`/study-guide/${topic.id}`}
                      className="flex-1 md:flex-none text-center px-8 md:px-10 py-4 md:py-5 bg-slate-900 dark:bg-sky-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-sky-600 dark:hover:bg-sky-700 transition-all shadow-xl shadow-slate-900/10"
                    >
                      {isCompleted ? 'Review Guide' : 'Start Module'}
                    </Link>
                    {isCompleted && (
                      <Link 
                        to={`/challenge/${topic.id}`}
                        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-paper dark:bg-slate-800 text-muted hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 rounded-2xl transition-all shadow-sm"
                        title="Take Quiz"
                      >
                        <List size={20} className="md:w-6 md:h-6" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudyGuide = ({ topicId }: { topicId: string }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const roadmap = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
  const topic = roadmap.find(t => t.id === topicId);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState<{ level: number; text: string; id: string }[]>([]);

  const isSecondary = profile?.level === 'secondary';

  useEffect(() => {
    const fetchGuide = async () => {
      if (!topic) return;
      setLoading(true);

      const localContent = MICRO_STUDY_GUIDE[topicId] || ADVANCED_STUDY_GUIDE[topicId];
      let guideContent = "";

      if (localContent) {
        guideContent = localContent;
      } else {
        guideContent = await generateStudyGuide(topic.title, profile?.level || 'secondary', topic.description);
      }

      setContent(guideContent);
      
      const headingRegex = /^(#{1,3})\s+(.+)$/gm;
      const extractedHeadings = [];
      let match;
      while ((match = headingRegex.exec(guideContent)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        extractedHeadings.push({ level, text, id });
      }
      setHeadings(extractedHeadings);
      setLoading(false);
    };
    fetchGuide();
  }, [topic, profile?.level, topicId]);

  if (!topic) return <div>Topic not found</div>;

  const HeadingRenderer = ({ level, children }: { level: number; children: React.ReactNode }) => {
    const text = React.Children.toArray(children).join('');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const Tag = `h${level}` as any;
    return <Tag id={id} className="scroll-mt-32">{children}</Tag>;
  };

  const SimulatorRenderer = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : '';
    
    if (lang === 'chart') {
      try {
        const config = JSON.parse(String(children).replace(/\n$/, ''));
        const { type, data, xAxis, yAxis, series, title, height = 300 } = config;
        const chartHeight = typeof height === 'number' && !isNaN(height) ? height : 300;
        
        return (
          <div className="my-10 p-8 card-minimal bg-white not-prose">
            {title && (
              <h4 className="text-[10px] font-bold text-slate-500 mb-6 text-center uppercase tracking-wider">
                {title}
              </h4>
            )}
            <div style={{ width: '100%', height: chartHeight }}>
              <ResponsiveContainer>
                {type === 'line' ? (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                    {series.map((s: any, i: number) => (
                      <Line key={i} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#0ea5e9'} strokeWidth={2} dot={{ r: 3, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                    ))}
                  </LineChart>
                ) : type === 'area' ? (
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                    {series.map((s: any, i: number) => (
                      <Area key={i} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#0ea5e9'} fill={s.color || '#0ea5e9'} fillOpacity={0.1} />
                    ))}
                  </AreaChart>
                ) : type === 'bar' ? (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                    {series.map((s: any, i: number) => (
                      <Bar key={i} dataKey={s.key} name={s.name} fill={s.color || '#0ea5e9'} radius={[4, 4, 0, 0]} stackId={s.stackId} />
                    ))}
                  </BarChart>
                ) : type === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey={series[0].key}
                      nameKey={xAxis}
                      label
                    >
                      {data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#0f172a', '#0ea5e9', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][index % 8]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" />
                  </PieChart>
                ) : type === 'combo' ? (
                  <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis type="number" dataKey={xAxis} name={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis type="number" yAxisId="left" name={yAxis} tick={{ fontSize: 10, fontWeight: 900 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '0', border: '1px solid #000' }} />
                    <Legend />
                    {series.map((s: any, i: number) => {
                      if (s.type === 'line') {
                        return <Line key={i} yAxisId="left" type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#10b981'} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />;
                      } else {
                        return <Scatter key={i} yAxisId="left" dataKey={s.key} name={s.name} fill={s.color || '#ef4444'} shape="circle" />;
                      }
                    })}
                  </ComposedChart>
                ) : (
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis type="number" dataKey={xAxis} name={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis type="number" dataKey={yAxis} name={yAxis} tick={{ fontSize: 10, fontWeight: 900 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '0', border: '1px solid #000' }} />
                    <Legend />
                    {series.map((s: any, i: number) => (
                      <Scatter key={i} name={s.name} data={data} fill={s.color || '#10b981'} shape="circle" />
                    ))}
                  </ScatterChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        );
      } catch (e) {
        return <pre className={className} {...props}>{children}</pre>;
      }
    }

    if (lang === 'simulator') {
      try {
        const config = JSON.parse(String(children).replace(/\n$/, ''));
        return (
          <div className="my-12 border border-gray-900 overflow-hidden">
            <EconomicsSimulator {...config} />
          </div>
        );
      } catch (e) {
        return <pre className={className} {...props}>{children}</pre>;
      }
    }

    return <pre className={className} {...props}>{children}</pre>;
  };

  return (
    <div className="min-h-screen bg-paper pt-24 md:pt-32 pb-24 md:pb-32 transition-colors duration-300">
      {/* Hero Header */}
      <header className="px-6 md:px-10 max-w-7xl mx-auto mb-16 md:mb-20">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"
          >
            <ChevronRight size={14} className="rotate-180" />
            Back to Dashboard
          </button>
          <span className="w-1 h-1 bg-slate-300 dark:bg-slate-800 rounded-full"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
            {topic.category}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[0.9] mb-10">
          {topic.title}
        </h1>
        <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-500 max-w-2xl leading-relaxed">
          {topic.description}
        </p>
      </header>

      <div className="px-6 md:px-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 md:gap-20">
        {/* Sidebar TOC & Chapter Filter */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit space-y-12">
          {isSecondary && (
            <div className="border-l border-slate-200 dark:border-slate-800 pl-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-8">Chapters (Level 1)</p>
              <nav className="space-y-4">
                {SECONDARY_ROADMAP.map((ch) => (
                  <Link
                    key={ch.id}
                    to={`/study-guide/${ch.id}`}
                    className={cn(
                      "block text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-sky-600 dark:hover:text-sky-400",
                      topicId === ch.id ? "text-sky-600 dark:text-sky-400" : "text-slate-500 dark:text-slate-700"
                    )}
                  >
                    {ch.category}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {!loading && headings.length > 0 && (
            <div className="border-l border-slate-200 dark:border-slate-800 pl-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-700 mb-8">Table of Contents</p>
              <nav className="space-y-5">
                {headings.map((heading, i) => (
                  <a
                    key={i}
                    href={`#${heading.id}`}
                    className={cn(
                      "block text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-sky-600 dark:hover:text-sky-400",
                      heading.level === 1 ? "text-slate-900 dark:text-white" : 
                      heading.level === 2 ? "pl-4 text-slate-600 dark:text-slate-500" : "pl-8 text-slate-500 dark:text-slate-700"
                    )}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </aside>

        {/* Mobile Chapter Filter */}
        {isSecondary && (
          <div className="lg:hidden px-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-4">Select Chapter</p>
              <select 
                value={topicId}
                onChange={(e) => navigate(`/study-guide/${e.target.value}`)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                {SECONDARY_ROADMAP.map((ch) => (
                  <option key={ch.id} value={ch.id}>{ch.category}: {ch.title}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex-1 max-w-3xl">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-6">
              <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
              <p className="text-slate-600 dark:text-slate-500 font-medium animate-pulse">Generating your study guide...</p>
            </div>
          ) : (
            <div className="markdown-body prose prose-base md:prose-lg lg:prose-xl prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:tracking-tight prose-headings:font-bold prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-li:text-slate-600 dark:prose-li:text-slate-400">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({ children }) => <HeadingRenderer level={1}>{children}</HeadingRenderer>,
                  h2: ({ children }) => <HeadingRenderer level={2}>{children}</HeadingRenderer>,
                  h3: ({ children }) => <HeadingRenderer level={3}>{children}</HeadingRenderer>,
                  code: SimulatorRenderer,
                  table: ({ children }) => (
                    <div className="my-12 overflow-x-auto rounded-[2rem] border border-border bg-card shadow-sm transition-colors duration-500">
                      <table className="w-full border-collapse text-left min-w-[600px]">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-paper border-b border-border transition-colors duration-500">{children}</thead>,
                  th: ({ children }) => <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink border-r border-border last:border-r-0 whitespace-nowrap transition-colors duration-500">{children}</th>,
                  td: ({ children }) => <td className="p-6 text-sm text-muted border-b border-r border-border last:border-r-0 align-top font-medium transition-colors duration-500">{children}</td>,
                  tr: ({ children }) => <tr className="hover:bg-paper transition-colors last:border-b-0 duration-500">{children}</tr>,
                }}
              >
                {content || ''}
              </ReactMarkdown>

              <div className="mt-20 md:mt-32 p-8 md:p-16 bg-card rounded-3xl md:rounded-[3rem] border border-border shadow-sm flex flex-col md:flex-row justify-between items-center gap-10 transition-colors duration-500">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Module Complete?</p>
                  <h4 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">Test your knowledge</h4>
                </div>
                <Link 
                  to={`/challenge/${topicId}`}
                  className="px-10 py-5 bg-slate-900 dark:bg-sky-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-sky-600 dark:hover:bg-sky-700 transition-all shadow-2xl shadow-slate-900/10 dark:shadow-sky-500/20"
                >
                  Start Challenge
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StudyGuideWrapper = () => {
  const { topicId } = useParams();
  return <StudyGuide topicId={topicId || ''} />;
};

const Challenge = ({ topicId }: { topicId: string }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const dbQuestions = await getQuestions(topicId);
      if (dbQuestions.length > 0) {
        setQuestions(dbQuestions.map(q => ({ ...q, answer: q.correctAnswer })));
      } else {
        setQuestions(CHALLENGES[topicId] || [
          { question: 'What is the subject matter of economics?', options: ['Wealth', 'Scarcity', 'Choice', 'All of the above'], answer: 3 },
          { question: 'Who is known as the father of economics?', options: ['Adam Smith', 'John Keynes', 'Alfred Marshall', 'David Ricardo'], answer: 0 }
        ]);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [topicId]);

  const handleAnswer = (index: number) => {
    if (index === questions[currentStep].answer) {
      setScore(s => s + 1);
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setFinished(true);
      if (user) {
        updateProgress(user.uid, topicId, true, score);
        updatePoints(user.uid, score * 10); // Reward 10 points per correct answer
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper transition-colors duration-300">
      <div className="w-8 h-8 border-4 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 md:px-10 bg-paper transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-card p-10 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem] border border-border shadow-2xl text-center transition-colors duration-500"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-paper dark:bg-sky-900/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg transition-colors duration-500">
            <Trophy size={40} className="text-accent md:w-12 md:h-12" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-4 transition-colors duration-500">Assessment Complete</p>
          <h2 className="text-3xl md:text-5xl font-bold text-ink tracking-tight mb-2 transition-colors duration-500">Final Score</h2>
          <p className="text-6xl md:text-8xl font-bold text-accent mb-12 md:mb-16 tracking-tighter">
            {score}<span className="text-border">/</span>{questions.length}
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-6 bg-slate-900 dark:bg-sky-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-sky-600 transition-all shadow-xl shadow-slate-900/10"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentStep];

  return (
    <div className="min-h-screen bg-paper pt-32 md:pt-48 pb-24 md:pb-32 px-6 md:px-10 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Quiz Header */}
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10 border-b border-slate-200 dark:border-slate-800 pb-8 md:pb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-700 mb-4">Module Assessment</p>
            <h3 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">
              {topicId.replace(/-/g, ' ')}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-1.5 mb-4">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 w-6 md:w-8 rounded-full transition-all", 
                    i < currentStep ? "bg-emerald-500" : 
                    i === currentStep ? "bg-slate-900 dark:bg-sky-600" : "bg-slate-100 dark:bg-slate-800"
                  )} 
                />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-700">
              Step <span className="text-slate-900 dark:text-white">{String(currentStep + 1).padStart(2, '0')}</span> of {String(questions.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-6">Question</p>
          <h3 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{q.question}</h3>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-6 md:p-8 text-left bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-3xl hover:bg-slate-900 dark:hover:bg-sky-600 hover:text-white hover:border-slate-900 dark:hover:border-sky-600 transition-all group flex items-center justify-between shadow-sm hover:shadow-2xl"
            >
              <div className="flex items-center gap-4 md:gap-8">
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-600 group-hover:bg-white/10 group-hover:text-white transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-white">{option}</span>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-100 dark:border-slate-800 group-hover:border-white/20 transition-colors" />
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 flex justify-between items-center opacity-40">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-600">System Ready</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-600">UTC: {new Date().toISOString().slice(11, 19)}</p>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return user ? <>{children}</> : null;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'admin' || user?.email === 'chukwuekudavid@gmail.com';

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, profile, loading, navigate, isAdmin]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return user && isAdmin ? <>{children}</> : null;
};

// --- Error Boundary ---

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Something went wrong.';
      try {
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error) errorMessage = `Firestore Error: ${parsed.error}`;
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-red-50 dark:bg-red-950/20 transition-colors duration-300">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 font-display">Oops!</h2>
            <p className="text-slate-700 dark:text-slate-400 mb-6">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-red-600 dark:bg-red-500 text-white font-bold rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-all"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Main App ---

export default function App() {
  return (
    <DarkModeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-paper text-ink transition-colors duration-300">
              <Navbar />
              <AnnouncementBanner />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/select-level" element={<ProtectedRoute><SelectLevel /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="/live" element={<ProtectedRoute><LiveChallenge /></ProtectedRoute>} />
                <Route path="/study-guide/:topicId" element={<ProtectedRoute><StudyGuideWrapper /></ProtectedRoute>} />
                <Route path="/challenge/:topicId" element={<ProtectedRoute><ChallengeWrapper /></ProtectedRoute>} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </DarkModeProvider>
  );
}

const ChallengeWrapper = () => {
  const { topicId } = useParams();
  return <Challenge topicId={topicId || ''} />;
};
