import React, { useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import { useRoadmap } from '../hooks/useRoadmap';
import { getGlobalLeaderboardAndRank, UserProfile, logout } from '../firebase';
import { getUserInitials } from '../lib/utils';
import { Coins, Zap, BookOpen, Loader2, Flame, ArrowRight, Trophy, Star, TrendingUp, Users, Target, ChevronRight } from 'lucide-react';

/* ─── Progress Ring SVG ─────────────────────────────────── */
const ProgressRing = ({ pct, size = 56, stroke = 4 }: { pct: number; size?: number; stroke?: number }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke="rgba(255,255,255,0.15)" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        strokeWidth={stroke}
        stroke="#10b981"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
    </svg>
  );
};

/* ─── Animated Graph BG ─────────────────────────────────── */
const GraphBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#10b981" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Animated demand/supply curves */}
    <svg className="absolute bottom-0 left-0 w-full h-full opacity-[0.08]" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
      <path d="M0,300 Q200,200 400,150 T800,80" stroke="#10b981" strokeWidth="2" fill="none" className="animate-float" />
      <path d="M0,80 Q200,130 400,200 T800,320" stroke="#3b82f6" strokeWidth="2" fill="none" style={{animationDelay:'1s'}} className="animate-float" />
      <circle cx="400" cy="175" r="8" fill="#34d399" opacity="0.6" className="animate-pulse" />
    </svg>
    {/* Ambient blobs */}
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-[0.15]" />
    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-[0.12]" />
    <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-violet-500 rounded-full blur-[80px] opacity-[0.08]" />
  </div>
);

/* ─── Feature Card ──────────────────────────────────────── */
const FeatureCard = ({
  icon, title, desc, color, delay
}: { icon: string; title: string; desc: string; color: string; delay: string }) => (
  <div
    className="relative p-6 rounded-2xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/8 backdrop-blur-sm transition-all duration-300 group cursor-default"
    style={{ animationDelay: delay }}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} transition-transform duration-300 group-hover:scale-110`}>
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <h3 className="font-bold text-white text-base mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

/* ─── Stat Block ────────────────────────────────────────── */
const StatBlock = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-2xl font-black text-white mb-1">{value}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

/* ─── Main Component ────────────────────────────────────── */
export const Home = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultIsLogin, setAuthDefaultIsLogin] = useState(true);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const [globalLeaders, setGlobalLeaders] = useState<UserProfile[]>([]);
  const [userGlobalRank, setUserGlobalRank] = useState<number>(1);
  const [loadingLeaders, setLoadingLeaders] = useState<boolean>(true);

  const level = profile?.level || 'secondary';
  const { roadmap } = useRoadmap(level);
  const levelLabel = level === 'secondary-ss2' ? 'SS2' : (level === 'secondary-ss3' ? 'SS3' : (level === 'undergraduate' ? 'UG' : 'SS1'));
  const progress = profile?.progress || {};
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = roadmap ? roadmap.length : 0;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  useEffect(() => {
    if (profile?.level === 'pending') navigate('/select-level', { replace: true });
  }, [profile, navigate]);

  useEffect(() => {
    let isMounted = true;
    const fetchRanks = async () => {
      try {
        const res = await getGlobalLeaderboardAndRank(user?.uid);
        if (isMounted) {
          setGlobalLeaders(res.topUsers);
          setUserGlobalRank(res.userRank);
        }
      } catch (err) {
        console.error('Failed to fetch global ranks', err);
      } finally {
        if (isMounted) setLoadingLeaders(false);
      }
    };
    fetchRanks();
    return () => { isMounted = false; };
  }, [user?.uid, profile?.points]);

  /* ── Loading states ── */
  if (user && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 font-['Inter',sans-serif]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-20" />
          </div>
          <p className="font-semibold text-slate-400">Loading your academy...</p>
          <button
            onClick={() => logout()}
            className="mt-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-200 border border-slate-800 hover:border-slate-600 rounded-full transition-colors"
          >
            Cancel & Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (profile?.level === 'pending') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 font-['Inter',sans-serif]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <p className="font-semibold text-slate-400">Preparing your academy...</p>
        </div>
      </div>
    );
  }

  const activeCourse = (roadmap || []).find(t => !progress[t.id]) || (roadmap || [])[0];

  /* ─────────────────────────────────────────────────────────
     LANDING PAGE (Not logged in)
  ─────────────────────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="bg-slate-950 text-white min-h-screen font-['Inter',sans-serif] overflow-x-hidden">

        {/* ── NAV ── */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 eco-gradient rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">EcoMastery</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setAuthDefaultIsLogin(true); setIsAuthOpen(true); }}
                className="text-slate-300 hover:text-white font-semibold text-sm transition-colors px-3 py-2"
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthDefaultIsLogin(false); setIsAuthOpen(true); }}
                className="eco-gradient text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-110 active:scale-95 transition-all"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="relative min-h-[90vh] flex items-center">
          <GraphBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

            {/* Left: Copy */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <Star className="w-3.5 h-3.5 fill-emerald-400 animate-sparkle" />
                <span>West Africa's #1 Economics Platform</span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
                  Master <span className="gradient-text-eco">Economics</span><br />
                  Like a Champion.
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                  Interactive study guides, real-time multiplayer duels, and AI-powered tutoring for SS1–SS3 and University-level Economics.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => { setAuthDefaultIsLogin(false); setIsAuthOpen(true); }}
                  className="eco-gradient text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  Join the Arena — Free
                </button>
                <button
                  onClick={() => { setAuthDefaultIsLogin(true); setIsAuthOpen(true); }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-base active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Stats strip */}
              <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                <StatBlock value="5,000+" label="Active Scholars" />
                <div className="h-10 w-px bg-white/10" />
                <StatBlock value="120+" label="Economics Quizzes" />
                <div className="h-10 w-px bg-white/10" />
                <StatBlock value="100%" label="Syllabus Covered" />
              </div>
            </div>

            {/* Right: Feature Cards Grid */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-violet-500/10 rounded-[2.5rem] blur-3xl -z-10" />
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard
                  icon="sports_esports"
                  title="Arena PvP Duels"
                  desc="Real-time GDP prediction duels against other students. Live scoring, leaderboards, and ranked matchmaking."
                  color="bg-emerald-500/15 text-emerald-400"
                  delay="0ms"
                />
                <FeatureCard
                  icon="menu_book"
                  title="Structured Roadmaps"
                  desc="Chapter-by-chapter SS1, SS2, SS3, and University Economics curricula with interactive diagrams."
                  color="bg-blue-500/15 text-blue-400"
                  delay="100ms"
                />
                <FeatureCard
                  icon="extension"
                  title="Daily Puzzles"
                  desc="Solve real-world policy crises — inflation surges, interest rate hikes, fiscal deficits — every day."
                  color="bg-amber-500/15 text-amber-400"
                  delay="200ms"
                />
                <FeatureCard
                  icon="leaderboard"
                  title="Global Rankings"
                  desc="Earn Mastery Points, climb the Diamond & Gold leagues, and compare yourself with top scholars."
                  color="bg-rose-500/15 text-rose-400"
                  delay="300ms"
                />
              </div>

              {/* Floating achievement badge */}
              <div className="absolute -top-4 -right-4 bg-slate-900 border border-emerald-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl animate-float">
                <div className="w-10 h-10 eco-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Just unlocked</div>
                  <div className="text-sm font-black text-white">Gold Scholar 🏅</div>
                </div>
              </div>

              {/* Live players pill */}
              <div className="absolute -bottom-4 -left-4 bg-slate-900 border border-white/10 rounded-full px-5 py-3 flex items-center gap-3 shadow-2xl">
                <div className="flex -space-x-2">
                  {['bg-emerald-600','bg-blue-600','bg-violet-600'].map((c,i) => (
                    <div key={i} className={`w-7 h-7 ${c} rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] font-black text-white`}>
                      {['OA','KU','EM'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-black text-white">243 students</div>
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                    live right now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LEVELS SECTION ── */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
              <Target className="w-4 h-4" />
              Curriculum Levels
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Your Level. Your Pace. Your Victory.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Whether you're preparing for WAEC/NECO or studying Advanced Economics at university, we've got a tailored curriculum built for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { level: 'SS1', desc: '12 foundational chapters covering demand, supply, production, money & more.', color: 'from-emerald-500/20 to-teal-500/10', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: '📗', chapters: 12 },
              { level: 'SS2', desc: '15 advanced chapters — elasticity, market structures, fiscal & monetary policy.', color: 'from-amber-500/20 to-orange-500/10', badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: '📙', chapters: 15 },
              { level: 'SS3', desc: '13 comprehensive revision chapters with WAEC exam patterns & Nigerian case studies.', color: 'from-violet-500/20 to-indigo-500/10', badge: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: '📘', chapters: 13 },
              { level: 'University', desc: '8 advanced university courses — micro, macro, econometrics, financial economics & more.', color: 'from-blue-500/20 to-cyan-500/10', badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: '🎓', chapters: 8 },
            ].map((item) => (
              <div
                key={item.level}
                onClick={() => { setAuthDefaultIsLogin(false); setIsAuthOpen(true); }}
                className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br ${item.color} border border-white/10 hover:border-white/20 cursor-pointer group transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-3 ${item.badge}`}>
                  {item.level}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold">{item.chapters} chapters</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/5 py-12 text-center text-xs text-slate-600 font-bold tracking-widest uppercase">
          EcoMastery Arena © 2026 • Real-Time Educational Game-Theory
        </footer>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultIsLogin={authDefaultIsLogin} />
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
     HOME DASHBOARD (Logged In)
  ─────────────────────────────────────────────────────────── */
  return (
    <div className="bg-slate-950 text-white min-h-screen pb-28 font-['Inter',sans-serif]">

      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 flex justify-between items-center">
        <div onClick={() => navigate('/study')} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <img
              className="w-10 h-10 rounded-full border-2 border-emerald-500/60 object-cover ring-2 ring-emerald-500/20"
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'S')}&background=059669&color=fff`}
              alt="Avatar"
            />
            <div className="absolute -bottom-1 -right-1 eco-gradient text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              {levelLabel}
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors">EcoMastery</h1>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {profile?.displayName?.split(' ')[0] || 'Scholar'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-extrabold text-xs text-amber-400">{profile?.streak || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <Coins className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            <span className="font-extrabold text-xs text-emerald-400">{profile?.points || 0} pts</span>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 max-w-4xl mx-auto space-y-5 py-5">

        {/* ── HERO BANNER: Continue Learning ── */}
        <section
          onClick={() => navigate(activeCourse ? `/study-guide/${activeCourse.id}` : '/study')}
          className="relative overflow-hidden rounded-3xl cursor-pointer group"
          style={{ background: 'linear-gradient(135deg, #0d1f0f 0%, #0a1628 50%, #0d0f1f 100%)' }}
        >
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-blue-500 rounded-full blur-[60px] opacity-15" />
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#10b981" strokeWidth="0.5"/>
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>
          </div>

          <div className="relative z-10 p-6 md:p-8 flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                  {completedCount > 0 ? '▶ Continue Learning' : '🚀 Start Learning'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                {activeCourse?.category && <span className="text-slate-400 text-sm font-bold block mb-1">{activeCourse.category}</span>}
                {activeCourse?.title || 'Begin Your Economics Journey'}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md line-clamp-2">
                {activeCourse?.description || 'Start your structured learning path through Economics.'}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 max-w-[180px]">
                  <div className="flex justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-slate-400">Overall Progress</span>
                    <span className="text-emerald-400">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${animatedPercentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{completedCount}/{totalCount} chapters</div>
                </div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 eco-gradient rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-500/25 group-hover:brightness-110 group-hover:shadow-emerald-500/40 active:scale-95 transition-all">
                  Open <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Progress ring */}
            <div className="relative shrink-0 hidden sm:flex items-center justify-center">
              <ProgressRing pct={animatedPercentage} size={80} stroke={5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-white">{percentage}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK ACTIONS: 2-col ── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Quick Match */}
          <button
            onClick={() => navigate('/live')}
            className="relative overflow-hidden rounded-2xl p-5 text-left group bg-gradient-to-br from-violet-900/50 to-violet-950 border border-violet-500/20 hover:border-violet-500/40 transition-all active:scale-95"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-35 transition-opacity" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-violet-400 fill-violet-400" />
              </div>
              <h3 className="font-black text-white text-sm">Quick Match</h3>
              <p className="text-violet-400/70 text-xs mt-0.5">PvP Economics Duel</p>
            </div>
          </button>

          {/* Daily Challenge */}
          <button
            onClick={() => navigate('/daily-puzzle')}
            className="relative overflow-hidden rounded-2xl p-5 text-left group bg-gradient-to-br from-rose-900/50 to-rose-950 border border-rose-500/20 hover:border-rose-500/40 transition-all active:scale-95"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-35 transition-opacity" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5 text-rose-400 fill-rose-400" />
              </div>
              <h3 className="font-black text-white text-sm">Daily Puzzle</h3>
              <p className="text-rose-400/70 text-xs mt-0.5">Inflation Spike</p>
            </div>
          </button>
        </div>

        {/* ── LEADERBOARD SNAPSHOT ── */}
        <section className="rounded-2xl overflow-hidden border border-white/8 bg-slate-900/50">
          <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 fill-amber-400/40" />
              <h3 className="font-extrabold text-white text-base">Global Ranks</h3>
            </div>
            <button
              onClick={() => navigate('/leaderboard')}
              className="text-emerald-400 hover:text-emerald-300 font-bold text-sm flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            {loadingLeaders ? (
              <div className="p-6 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                Loading ranks...
              </div>
            ) : globalLeaders.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No scholars yet. Be the first on the leaderboard!
              </div>
            ) : (
              <>
                {globalLeaders.slice(0, 3).map((leader, index) => {
                  const isCurrentUser = leader.uid === user?.uid;
                  const points = leader.points || 0;
                  const rankNum = index + 1;
                  const rankColors = ['text-amber-400', 'text-slate-400', 'text-amber-700'];
                  const rankBg = ['bg-amber-500/10 border-amber-500/20', 'bg-slate-700/30 border-white/5', 'bg-slate-800/30 border-white/5'];

                  return (
                    <div
                      key={leader.uid || index}
                      className={`flex items-center gap-4 px-5 py-3.5 transition-colors border-b border-white/5 last:border-0 ${
                        isCurrentUser ? 'bg-emerald-500/5' : 'hover:bg-white/3'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border ${rankBg[index] || 'bg-white/5 border-white/10'} ${rankColors[index] || 'text-slate-400'}`}>
                        {rankNum}
                      </div>
                      {leader.photoURL ? (
                        <img className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" src={leader.photoURL} alt="" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 border border-white/10">
                          {getUserInitials(leader.displayName, leader.email)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-white truncate">
                          {isCurrentUser ? `You (${profile?.displayName?.split(' ')[0] || 'Scholar'})` : (leader.displayName || 'Scholar')}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {points >= 3000 ? 'Keynes League' : 'Eco Titan League'}
                        </p>
                      </div>
                      <span className="font-extrabold text-sm text-white shrink-0">
                        {points.toLocaleString()} <span className="text-xs text-slate-500 font-normal">pts</span>
                      </span>
                    </div>
                  );
                })}

                {userGlobalRank > 3 && (
                  <div className="flex items-center gap-4 px-5 py-3.5 bg-emerald-500/5 border-t border-emerald-500/20">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-sm text-emerald-400">
                      {userGlobalRank}
                    </div>
                    {(user?.photoURL || profile?.photoURL) ? (
                      <img className="w-9 h-9 rounded-full object-cover shrink-0 border border-emerald-500/30" src={user?.photoURL || profile?.photoURL || ''} alt="" />
                    ) : (
                      <div className="w-9 h-9 rounded-full eco-gradient text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {getUserInitials(profile?.displayName || user?.displayName, profile?.email || user?.email)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">You ({profile?.displayName?.split(' ')[0] || 'Scholar'})</p>
                      <p className="text-xs text-emerald-400 truncate">{(profile?.points || 0) >= 3000 ? 'Keynes League' : 'Eco Titan League'}</p>
                    </div>
                    <span className="font-extrabold text-sm text-white shrink-0">
                      {(profile?.points || 0).toLocaleString()} <span className="text-xs text-slate-500 font-normal">pts</span>
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── BROWSE COURSES CTA ── */}
        <button
          onClick={() => navigate('/study')}
          className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-900/60 border border-white/8 hover:border-white/15 hover:bg-slate-900 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-white text-sm">Browse All Chapters</h3>
              <p className="text-slate-500 text-xs">{totalCount} topics in your curriculum</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

      </main>
    </div>
  );
};
