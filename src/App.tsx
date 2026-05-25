import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { AdminPage } from './components/AdminPage';
import { Leaderboard } from './components/Leaderboard';
import { LiveChallenge } from './components/LiveChallenge';
import { Dashboard as NewDashboard } from './components/Dashboard';
import { Home } from './components/Home';
import { Profile } from './components/Profile';
import { DailyPuzzle } from './components/DailyPuzzle';
import { AppNavigation } from './components/BottomNavBar';
import { MICRO_STUDY_GUIDE } from './lib/studyData';
import { ADVANCED_STUDY_GUIDE } from './lib/advancedStudyData';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './useAuth';
import { 
  loginWithGoogle, registerWithEmail, loginWithEmail, logout, createUserProfile, UserProfile, updateProgress, 
  updatePoints, getUserProfile, getQuestions, updateUserLevel, 
  getGlobalAnnouncement, saveDuelResult 
} from './firebase';
import { SECONDARY_ROADMAP, UNDERGRADUATE_ROADMAP, CHALLENGES } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, User, LogOut, ChevronRight, CheckCircle2, Circle, LayoutDashboard, GraduationCap, School, List, Database, Swords, Menu, X, Loader2, Megaphone, TrendingUp, Award, Sun, Moon, Quote, HelpCircle, ArrowUpRight, Zap, Globe, ShieldCheck, Star, MessageSquare, Mail, Lock } from 'lucide-react';
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
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  useEffect(() => {
    if (!loading && user) {
      if (!profile && window.location.pathname !== '/select-level') {
        navigate('/select-level');
      } else if (profile && window.location.pathname === '/') {
        navigate('/dashboard');
      }
    }
    if (!user) {
      setIsMenuOpen(false);
    }
  }, [user, profile, loading, navigate]);

  if (['/', '/dashboard', '/study', '/profile', '/leaderboard', '/live', '/daily-puzzle'].includes(location.pathname)) return null;

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
        <span className="text-2xl font-bold tracking-tight text-ink">EcoMastery</span>
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

const EntryPage = () => {
  const { user, profile, loading: authLoading, setProfile } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper transition-colors duration-300">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    if (user.email === 'chukwuekudavid@gmail.com') return <Navigate to="/admin" replace />;
    if (!profile) return <Navigate to="/select-level" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleAuthResult = async (firebaseUser: any) => {
    try {
      const existingProfile = await getUserProfile(firebaseUser.uid);
      const isAdminEmail = firebaseUser.email === 'chukwuekudavid@gmail.com';
      if (!existingProfile) {
        const newProfile = await createUserProfile({ 
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name || firebaseUser.displayName 
        }, 'secondary');
        setProfile(newProfile);
        if (isAdminEmail) {
          navigate('/admin');
        } else {
          navigate('/select-level');
        }
      } else {
        setProfile(existingProfile);
        if (isAdminEmail) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch profile.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      let firebaseUser;
      if (isLogin) {
        firebaseUser = await loginWithEmail(email, password);
      } else {
        firebaseUser = await registerWithEmail(email, password);
      }
      if (firebaseUser) {
        await handleAuthResult(firebaseUser);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Try logging in.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const firebaseUser = await loginWithGoogle();
      if (firebaseUser) {
        await handleAuthResult(firebaseUser);
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Please allow popups for Google Sign In.');
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
         // popup closed
      } else {
        console.error("Google Auth Error:", err);
        setError(err.message || 'Google sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper relative overflow-x-hidden flex flex-col w-full selection:bg-sky-200">
      {/* Absolute Ambient Atmospheric Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-[20%] left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-sky-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Landing Custom Header / Navigation */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-2xl border-b-4 border-blue-700 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg rotate-3">
            E
          </div>
          <span className="text-sm sm:text-2xl font-bold tracking-tight text-ink font-display whitespace-nowrap">EcoMastery</span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <button 
            onClick={toggleDarkMode}
            className="w-8 h-8 sm:w-10 sm:h-10 flex shrink-0 items-center justify-center text-muted hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => { setShowAuth(true); setIsLogin(true); setError(''); }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted hover:text-sky-500 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap"
          >
            Sign In
          </button>
          <button
            onClick={() => { setShowAuth(true); setIsLogin(false); setError(''); }}
            className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 bg-blue-500 hover:bg-blue-600 active:translate-y-0.5 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            Join Free
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {!showAuth ? (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-20 flex flex-col gap-16 md:gap-24"
          >
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center w-full">
              <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full min-w-0">
                <div className="inline-flex items-center gap-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 px-3.5 py-1.5 rounded-full shadow-sm max-w-full">
                  <Globe className="text-sky-500 animate-spin shrink-0" size={14} style={{ animationDuration: '10s' }} />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 truncate">Gamified Environmental Science Arena</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold text-ink leading-[1.1] tracking-tight font-display text-center lg:text-left w-full">
                  Master Ecology. <br className="hidden sm:block" />
                  <span className="text-sky-500 italic font-serif font-normal">Challenge Peers.</span> <br className="hidden sm:block" />
                  Lead Change.
                </h1>

                <p className="text-muted text-xs sm:text-sm md:text-base lg:text-lg w-full max-w-xl font-medium leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                  EcoMastery is an advanced interactive learning quest designed to build high-scoring ecological scholars. Transition seamlessly from high school preparation to university-grade climatology, and prove your knowledge in fast-paced real-time duels.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full">
                  <button
                    onClick={() => { setShowAuth(true); setIsLogin(false); }}
                    className="px-6 py-3.5 sm:px-8 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/15 whitespace-nowrap"
                  >
                    Start Your Quest Free <ChevronRight size={16} />
                  </button>
                  <a
                    href="#features"
                    className="px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent text-ink border-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl border-b-4 active:border-b-2 active:translate-y-0.5 flex items-center justify-center gap-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                  >
                    Learn Features
                  </a>
                </div>

                {/* Quick stats / social proof indicators with human labels */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-border/40 w-full max-w-md mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <p className="text-lg sm:text-2xl font-bold text-ink">100%</p>
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-muted tracking-widest mt-1">Syllabus Aligned</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-lg sm:text-2xl font-bold text-ink">Active</p>
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-muted tracking-widest mt-1">PVP Matchmaker</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-lg sm:text-2xl font-bold text-ink">Adaptive</p>
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-muted tracking-widest mt-1">Study Guides</p>
                  </div>
                </div>
              </div>

              {/* Graphical Card Deck Mock Visualizer representing app modules */}
              <div className="lg:col-span-5 relative h-[320px] sm:h-[450px] w-full mt-6 lg:mt-0 flex items-center justify-center">
                {/* Visual Backdrop Sphere */}
                <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 mix-blend-multiply blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                
                {/* Interactive Study Module Mock Card */}
                <motion.div 
                  initial={{ rotate: -6, x: -20, y: 10 }}
                  animate={{ rotate: -4, x: -10, y: 0 }}
                  className="absolute w-[240px] sm:w-[280px] bg-card border-2 border-border p-6 rounded-3xl shadow-xl left-[10%] z-10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">Topic Card</span>
                    <Award size={16} className="text-amber-500" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-ink tracking-tight mb-2">Sustainable Energy Systems</h3>
                  <p className="text-muted text-[11px] font-medium mb-4 leading-normal">Explore Photovoltaic formulas, grid parity, and ocean thermal energy conversions.</p>
                  <div className="w-full bg-paper rounded-full h-2 overflow-hidden mb-2">
                    <div className="bg-emerald-500 h-full w-[70%]" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase tracking-wider">
                    <span>Progress</span>
                    <span>70%</span>
                  </div>
                </motion.div>

                {/* Interactive Battle Duel Mock Overlay */}
                <motion.div 
                  initial={{ rotate: 6, x: 20, y: -10 }}
                  animate={{ rotate: 4, x: 10, y: 0 }}
                  className="absolute w-[240px] sm:w-[280px] bg-sky-950 text-white p-6 rounded-3xl shadow-2xl right-[10%] bottom-[10%] z-20 border border-sky-800"
                >
                  <div className="flex items-center gap-2 text-sky-400 mb-3 text-[10px] font-bold uppercase tracking-widest">
                    <Swords size={12} className="animate-bounce" />
                    <span>Real-Time Arena</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold tracking-tight text-white mb-2 leading-tight">Environmental Duel Stream</p>
                  
                  <div className="space-y-2 mt-4 text-[11px]">
                    <div className="flex justify-between items-center bg-sky-900/40 px-2.5 py-1.5 rounded-xl border border-sky-800/50">
                      <span className="font-bold">David (Undergrad)</span>
                      <span className="text-emerald-400 font-bold">+20 pts</span>
                    </div>
                    <div className="flex justify-between items-center bg-sky-900/10 px-2.5 py-1.5 rounded-xl border border-sky-950 text-slate-400">
                      <span>Sarah (Senior)</span>
                      <span>Defeated</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* SYLLABUS AND FEATURES INFO GRID */}
            <div id="features" className="space-y-12">
              <div className="text-center max-w-xl mx-auto space-y-3">
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Architectural Features</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight font-display">Engineered Supporting Modules</h2>
                <p className="text-muted text-xs sm:text-sm font-medium">EcoMastery is built upon standard scientific requirements, allowing precise academic advancement.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Curated Pathways */}
                <div className="bg-card border-2 border-border p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center mb-6">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2 tracking-tight">Curated Pathways</h3>
                  <p className="text-muted text-xs font-medium leading-relaxed">
                    Custom syllabus roadmaps covering High School Secondary or Advanced Undergraduate topics with full interactive study notes.
                  </p>
                </div>

                {/* PVP Battle Arena */}
                <div className="bg-card border-2 border-border p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center mb-6">
                    <Swords size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2 tracking-tight">Peer-to-Peer Duels</h3>
                  <p className="text-muted text-xs font-medium leading-relaxed">
                    Test tactical responses, claim hotkeys, and score points against direct competitors in multiplayer ecology challenges.
                  </p>
                </div>

                {/* Detailed Explanations */}
                <div className="bg-card border-2 border-border p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center mb-6">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2 tracking-tight">Structured Feedback</h3>
                  <p className="text-muted text-xs font-medium leading-relaxed">
                    Every answer is reinforced instantly with extensive micro-explanations, formulas, and references to establish mastery.
                  </p>
                </div>

                {/* Broadcaster */}
                <div className="bg-card border-2 border-border p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center mb-6">
                    <Megaphone size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2 tracking-tight">Broadcast System</h3>
                  <p className="text-muted text-xs font-medium leading-relaxed">
                    Admins can push real-time updates and emergency alerts across the sandbox view to ensure maximum scholar coordination.
                  </p>
                </div>
              </div>
            </div>

            {/* CURRICULUM BRACKETS PREVIEW */}
            <div className="bg-slate-100 dark:bg-slate-900/40 border border-border/60 rounded-[2.5rem] p-8 sm:p-12 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Syllabus Mapping</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight font-display">Choose Scholar Bracket</h2>
                <p className="text-muted text-xs sm:text-sm font-medium leading-relaxed">
                  Both academic categories target verified key learning markers, maintaining real ecological formulas, micro-study guides, and challenging problem structures.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="text-sky-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-ink mb-1">Secondary Prep Category</h4>
                      <p className="text-muted text-[11px] font-medium">Covers ecosystem flow, climate indicators, biodiversity indexes, and conservation pathways.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="text-purple-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-ink mb-1">Undergraduate Scholar Category</h4>
                      <p className="text-muted text-[11px] font-medium">Advanced ecological thermodynamics, global radiative transfers, biogeochemical dynamics, and solar metrics.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => { setShowAuth(true); setIsLogin(false); }}
                    className="btn-premium py-3 px-6 text-xs text-center"
                  >
                    Select Your Level & Join Arena
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border px-5 py-6 rounded-2xl space-y-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center font-bold text-xs">01</div>
                  <p className="font-bold text-xs sm:text-sm text-ink">Ecosystem Dynamics</p>
                  <p className="text-[10px] text-muted font-medium">Examine food webs, trophic cascades, limiting variables, and environmental tolerances.</p>
                </div>
                <div className="bg-card border border-border px-5 py-6 rounded-2xl space-y-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center font-bold text-xs">02</div>
                  <p className="font-bold text-xs sm:text-sm text-ink">Climate Indicators</p>
                  <p className="text-[10px] text-muted font-medium">Analyze greenhouse forcing models, Milankovitch mechanics, and direct mitigation strategies.</p>
                </div>
                <div className="bg-card border border-border px-5 py-6 rounded-2xl space-y-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center font-bold text-xs">03</div>
                  <p className="font-bold text-xs sm:text-sm text-ink">Conservation Science</p>
                  <p className="text-[10px] text-muted font-medium">Study genetics of endangered species, edge effects, restoration paths, and policy metrics.</p>
                </div>
                <div className="bg-card border border-border px-5 py-6 rounded-2xl space-y-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center font-bold text-xs">04</div>
                  <p className="font-bold text-xs sm:text-sm text-ink">Renewable Integration</p>
                  <p className="text-[10px] text-muted font-medium">Evaluate parities of storage solutions, geothermal pumps, and wave system conversions.</p>
                </div>
              </div>
            </div>

            {/* CALL TO ACTION */}
            <div className="bg-sky-500 text-white rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Globe size={200} />
              </div>
              <div className="relative z-10 max-w-xl mx-auto space-y-6">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-2 leading-tight font-display">Ascend From Scholar to Environmental Sage</h2>
                <p className="text-sky-100 text-xs sm:text-sm max-w-md mx-auto">
                  Earn Eco-Points, display academic ranks, and master the detailed metrics. The environmental challenge platform is live right now.
                </p>
                <button
                  onClick={() => { setShowAuth(true); setIsLogin(false); }}
                  className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-2xl text-xs uppercase tracking-widest text-center shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Create Scholar Account
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 my-auto"
          >
            <div className="w-full max-w-md text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-2xl border-b-4 border-blue-700 flex items-center justify-center text-white font-bold text-xl sm:text-2xl mx-auto mb-4 sm:mb-6 shadow-2xl rotate-3">
                E
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2 sm:mb-3 tracking-tight font-display">EcoMastery</h1>
              <p className="text-muted text-xs sm:text-sm font-medium mb-6 sm:mb-8">Access the environmental gamified platform.</p>
              
              {/* Inline Auth Card */}
              <div className="w-full rounded-3xl bg-card border border-border p-6 sm:p-8 text-left shadow-xl max-w-md">
                {error && (
                  <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-medium text-center font-sans">
                    {error}
                  </div>
                )}

                 <form onSubmit={handleEmailAuth} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block">Full Name</label>
                      <div className="relative group">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-sky-500 transition-colors" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          className="w-full bg-paper border border-border rounded-xl pl-10 pr-3 py-3 text-xs sm:text-sm font-medium text-ink placeholder:text-muted/50 focus:outline-none focus:border-sky-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block">Email</label>
                    <div className="relative group">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-sky-500 transition-colors" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full bg-paper border border-border rounded-xl pl-10 pr-3 py-3 text-xs sm:text-sm font-medium text-ink placeholderLine placeholder:text-muted/50 focus:outline-none focus:border-sky-500 transition-colors"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block">Password</label>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-sky-500 transition-colors" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-paper border border-border rounded-xl pl-10 pr-3 py-3 text-xs sm:text-sm font-medium text-ink placeholder:text-muted/50 focus:outline-none focus:border-sky-500 transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-6 py-3 bg-blue-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs font-medium text-muted flex items-center justify-center gap-1.5">
                  <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                  <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="text-sky-600 dark:text-sky-400 font-bold hover:underline font-sans"
                    type="button"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                   <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="w-full py-3 bg-paper text-ink border border-border text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                      Continue with Google
                   </button>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAuth(false)}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-sky-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    ← Back to Landing Information
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
            className="w-16 h-16 bg-blue-500 rounded-2xl border-b-4 border-blue-700 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-10 shadow-2xl rotate-3"
          >
            E
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-ink tracking-tight mb-6"
          >
            Select <span className="text-blue-600">Character</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted font-medium max-w-md mx-auto"
          >
            Choose your starting level to begin your economics quest.
          </motion.p>
        </div>

        <div className="grid gap-6">
          {[
            { id: 'secondary', title: 'Secondary Level', desc: 'High School Economics • Global Exam Prep', icon: School, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
            { id: 'undergraduate', title: 'Undergraduate', desc: 'University Level • Micro, Macro & Econometrics', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' }
          ].map((level, i) => (
            <motion.button 
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => handleSelect(level.id as any)}
              className="w-full p-8 card-gamified text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-8">
                <div className={cn("w-20 h-20 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border-b-4", level.bg, level.color, level.border)}>
                  <level.icon size={36} />
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-ink mb-2 tracking-tight">{level.title}</h4>
                  <p className="text-muted font-medium">{level.desc}</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-b-4 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-700 transition-all">
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
            { label: 'Total XP', value: profile?.points || 0, icon: Award, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
            { label: 'Quests Done', value: completedCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
            { label: 'Global Rank', value: '#--', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-gamified p-8 md:p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <stat.icon size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-[12px] font-bold text-muted uppercase tracking-widest">{stat.label}</p>
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border-b-4 bg-white", stat.color, stat.border)}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-bold text-ink tracking-tight">{stat.value}</p>
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

          <div className="space-y-6 mt-8">
            {filteredRoadmap.map((topic, index) => {
              const isCompleted = progress[topic.id];
              const score = scores[topic.id];
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="card-gamified flex flex-col md:flex-row gap-6 p-8 items-start md:items-center relative overflow-hidden group"
                >
                  <div className="w-16 h-16 rounded-[1.2rem] bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl border-b-4 border-indigo-200 shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-lg">
                        {topic.category}
                      </span>
                      <h4 className="text-xl md:text-2xl font-bold text-ink tracking-tight">{topic.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{topic.description}</p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {isCompleted ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-500 flex items-center justify-center rounded-[1rem] border-b-4 border-emerald-200 mb-2">
                          <CheckCircle2 size={24} />
                        </div>
                        {score !== undefined && (
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{score}/100 XP</span>
                        )}
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center rounded-[1rem] border-b-4 border-slate-200">
                        <Circle size={24} />
                      </div>
                    )}
                    <Link 
                      to={`/study-guide/${topic.id}`}
                      className="flex-1 md:flex-none text-center px-8 py-3 bg-blue-500 text-white text-sm font-bold uppercase tracking-wider rounded-2xl hover:bg-blue-600 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all"
                    >
                      {isCompleted ? 'Review' : 'Play'}
                    </Link>
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

const LazyStudyGuideWrapper = React.lazy(() => import('./components/StudyGuide'));

const StudyGuideWrapper = () => {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-paper pt-24 pb-24 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
        <p className="text-slate-600 dark:text-slate-500 font-medium animate-pulse">Loading Study Guide...</p>
      </div>
    }>
      <LazyStudyGuideWrapper />
    </React.Suspense>
  );
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
          className="max-w-xl w-full card-gamified p-10 md:p-20 text-center transition-colors duration-500 border-indigo-200 border-2"
        >
          <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm border-b-4 border-indigo-200 rotate-6 hover:rotate-12 transition-transform">
            <Trophy size={48} className="text-indigo-500" />
          </div>
          <p className="text-[12px] font-black uppercase tracking-widest text-muted mb-4 transition-colors duration-500">Quest Complete</p>
          <h2 className="text-3xl md:text-5xl font-bold text-ink tracking-tight mb-2 transition-colors duration-500">Total XP Gained</h2>
          <p className="text-6xl md:text-8xl font-black text-indigo-500 mb-12 md:mb-16 tracking-tighter">
            {score * 10} <span className="text-2xl text-slate-400 font-bold uppercase tracking-widest">XP</span>
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full btn-premium justify-center"
          >
            Claim & Return
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
          <p className="text-[12px] font-black uppercase tracking-widest text-blue-500 mb-6">Question {currentStep + 1}</p>
          <h3 className="text-2xl md:text-4xl font-bold text-ink leading-tight tracking-tight">{q.question}</h3>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-6 md:p-8 text-left bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group flex items-center justify-between shadow-[0_4px_0_theme(colors.slate.200)] hover:-translate-y-1 hover:shadow-[0_8px_0_theme(colors.blue.500)] active:translate-y-2 active:shadow-none"
            >
              <div className="flex items-center gap-4 md:gap-8">
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm md:text-base font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 border-b-4 border-slate-200 group-hover:border-blue-200 transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-lg md:text-xl font-bold tracking-tight text-ink group-hover:text-blue-700 dark:group-hover:text-blue-400">{option}</span>
              </div>
              <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 dark:border-slate-700 group-hover:border-blue-400 transition-colors" />
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
  const [pass, setPass] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin) && !authenticated) {
      setShowPrompt(true);
    }
  }, [user, profile, loading, isAdmin, authenticated]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (showPrompt && !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin Access</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Please enter the administrator password to continue.</p>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 mb-4 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (pass === '123456') {
                  setAuthenticated(true);
                } else { 
                  alert('Incorrect password'); 
                  navigate('/dashboard'); 
                }
              }
            }}
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (pass === '123456') {
                  setAuthenticated(true);
                } else { 
                  alert('Incorrect password'); 
                  navigate('/dashboard'); 
                }
              }}
              className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/10"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (user && isAdmin) || authenticated ? <>{children}</> : null;
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

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const showBottomNav = user && ['/dashboard', '/study', '/profile', '/leaderboard', '/live', '/daily-puzzle'].includes(location.pathname);

  return (
    <div className={`min-h-screen bg-paper text-ink transition-colors duration-300 ${showBottomNav ? 'md:ml-[88px]' : ''}`}>
      <Navbar />
      <AnnouncementBanner />
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/select-level" element={<ProtectedRoute><SelectLevel /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/study" element={<ProtectedRoute><NewDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/live" element={<ProtectedRoute><LiveChallenge /></ProtectedRoute>} />
        <Route path="/daily-puzzle" element={<ProtectedRoute><DailyPuzzle /></ProtectedRoute>} />
        <Route path="/study-guide/:topicId" element={<ProtectedRoute><StudyGuideWrapper /></ProtectedRoute>} />
        <Route path="/challenge/:topicId" element={<ProtectedRoute><ChallengeWrapper /></ProtectedRoute>} />
      </Routes>
      {showBottomNav && <AppNavigation />}
    </div>
  );
};

export default function App() {
  return (
    <DarkModeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <MainLayout />
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
