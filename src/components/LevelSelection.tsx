import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, ArrowRight, Loader2, ChevronLeft, CheckCircle2, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { updateUserLevel } from '../firebase';
import { WassceSyllabus } from './WassceSyllabus';

type MainPath = 'secondary' | 'undergraduate' | null;

/* ─── Animated background ─────────────────────────── */
const AnimatedBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[160px] opacity-[0.06]" />
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[140px] opacity-[0.05]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500 rounded-full blur-[200px] opacity-[0.03]" />
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="level-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#10b981" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#level-grid)" />
    </svg>
  </div>
);

/* ─── Feature pill ─────────────────────────────────── */
const FeaturePill = ({ text }: { text: string }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-medium">
    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
    {text}
  </span>
);

/* ─── Chapters preview dots ────────────────────────── */
const ChapterDots = ({ count, color }: { count: number; color: string }) => (
  <div className="flex flex-wrap gap-1 mt-2">
    {Array.from({ length: Math.min(count, 15) }).map((_, i) => (
      <div
        key={i}
        className="w-2 h-2 rounded-full opacity-30"
        style={{ background: color, opacity: i < 3 ? 0.8 : i < 7 ? 0.5 : 0.2 }}
      />
    ))}
    {count > 15 && <span className="text-[9px] text-slate-600 font-bold ml-1">+{count - 15}</span>}
  </div>
);

/* ─── Main Component ───────────────────────────────── */
export const LevelSelection = () => {
  const { user, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedMainPath, setSelectedMainPath] = useState<MainPath>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (profile && profile.level !== 'pending') {
      if (profile.level === 'undergraduate') {
        setSelectedMainPath('undergraduate');
      } else {
        setSelectedMainPath('secondary');
      }
    }
  }, [profile]);

  const handleSelectLevel = async (level: 'secondary' | 'secondary-ss2' | 'secondary-ss3' | 'undergraduate') => {
    if (!user) return;
    setLoading(level);
    try {
      await updateUserLevel(user.uid, level);
      if (profile) setProfile({ ...profile, level });
      navigate('/');
    } catch (error) {
      console.error('Error updating level:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col items-center font-['Inter',sans-serif] relative overflow-x-hidden pb-16">
      <AnimatedBg />

      <div className="w-full max-w-6xl relative z-10 px-5 pt-12 md:pt-20">

        {/* ── Header ── */}
        <div className="text-center space-y-4 mb-12">
          {selectedMainPath && profile?.level === 'pending' && (
            <button
              onClick={() => setSelectedMainPath(null)}
              className="mb-6 mx-auto flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-full text-sm font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Paths
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto rounded-2xl eco-gradient flex items-center justify-center shadow-xl shadow-emerald-500/25 animate-float"
          >
            <Star className="w-8 h-8 text-white fill-white/30" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
          >
            {selectedMainPath ? 'Choose Your Level' : 'Pick Your Learning Path'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-lg mx-auto font-medium text-base"
          >
            {selectedMainPath
              ? 'Select your specific curriculum tier to access tailored study guides, quizzes, and challenges.'
              : 'Select your curriculum focus to unlock interactive guides, mathematical simulations, and personalized progress tracking.'}
          </motion.p>
        </div>

        {/* ── Cards ── */}
        <AnimatePresence mode="wait">

          {/* MAIN PATH SELECTION */}
          {!selectedMainPath ? (
            <motion.div
              key="main-paths"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6"
            >
              {/* Secondary */}
              <div
                onClick={() => setSelectedMainPath('secondary')}
                className="relative p-7 rounded-3xl border border-white/10 hover:border-emerald-500/40 bg-white/3 hover:bg-white/5 cursor-pointer group transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500 rounded-bl-[6rem] opacity-[0.07] group-hover:opacity-[0.12] transition-opacity" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500 rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                      <BookOpen className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                      SS1 · SS2 · SS3
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-100 transition-colors">
                      Senior Secondary
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Comprehensive WAEC/NECO curriculum covering all three years of senior secondary Economics. From basic concepts to complex market structures.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['12 SS1 Chapters', '15 SS2 Chapters', '13 SS3 Chapters', 'WAEC Patterns'].map(f => (
                      <FeaturePill key={f} text={f} />
                    ))}
                  </div>

                  <ChapterDots count={40} color="#10b981" />

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[11px] font-black tracking-widest text-slate-500 group-hover:text-emerald-400 transition-colors uppercase">
                      Explore Roadmap
                    </span>
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Undergraduate */}
              <div
                onClick={() => !loading && handleSelectLevel('undergraduate')}
                className="relative p-7 rounded-3xl border border-white/10 hover:border-blue-500/40 bg-white/3 hover:bg-white/5 cursor-pointer group transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-bl-[6rem] opacity-[0.07] group-hover:opacity-[0.12] transition-opacity" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
                      <GraduationCap className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                      University Level
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-100 transition-colors">
                      Undergraduate
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Advanced academic tier covering microeconomics, macroeconomics, econometrics, monetary & financial economics for university scholars.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['8 University Courses', 'Econometrics & OLS', 'IS-LM Models', 'CAPM & Finance'].map(f => (
                      <FeaturePill key={f} text={f} />
                    ))}
                  </div>

                  <ChapterDots count={8} color="#3b82f6" />

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[11px] font-black tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors uppercase">
                      Select This Path
                    </span>
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all">
                      {loading === 'undergraduate'
                        ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                        : <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          ) : selectedMainPath === 'secondary' ? (
            /* SECONDARY LEVEL SELECTION */
            <motion.div
              key="secondary-levels"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-5"
            >
              {/* SS1 */}
              <div
                onClick={() => !loading && handleSelectLevel('secondary')}
                className={`relative p-6 rounded-3xl border cursor-pointer group transition-all duration-300 overflow-hidden ${
                  loading === 'secondary'
                    ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500/50'
                    : 'border-white/10 hover:border-emerald-500/40 bg-white/3 hover:bg-white/5 hover:-translate-y-1'
                }`}
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500 rounded-bl-[4rem] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity" />
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-xl group-hover:bg-emerald-500/25 transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                      SS1
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-emerald-100 transition-colors mb-1">Economics SS1</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Foundation — demand, supply, production, money, labour, financial institutions, and Nigerian economy overview.
                    </p>
                  </div>
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    {['12 Chapters', 'WAEC/NECO Ready', 'Interactive Diagrams'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">Select Level</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                      {loading === 'secondary'
                        ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                        : <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white transition-colors" />
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* SS2 */}
              <div
                onClick={() => !loading && handleSelectLevel('secondary-ss2')}
                className={`relative p-6 rounded-3xl border cursor-pointer group transition-all duration-300 overflow-hidden ${
                  loading === 'secondary-ss2'
                    ? 'ring-2 ring-amber-500 bg-amber-500/10 border-amber-500/50'
                    : 'border-white/10 hover:border-amber-500/40 bg-white/3 hover:bg-white/5 hover:-translate-y-1'
                }`}
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500 rounded-bl-[4rem] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity" />
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-amber-500/15 border border-amber-500/25 text-amber-400 rounded-xl group-hover:bg-amber-500/25 transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                      SS2
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-100 transition-colors mb-1">Economics SS2</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Advanced — elasticity, market structures, national income accounting, fiscal policy, and utility theory.
                    </p>
                  </div>
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    {['15 Chapters', 'Elasticity & Utility', 'Fiscal & Monetary Policy'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-amber-400 transition-colors uppercase tracking-wider">Select Level</span>
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-500 transition-all">
                      {loading === 'secondary-ss2'
                        ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                        : <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-colors" />
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* SS3 */}
              <div
                onClick={() => !loading && handleSelectLevel('secondary-ss3')}
                className={`relative p-6 rounded-3xl border cursor-pointer group transition-all duration-300 overflow-hidden ${
                  loading === 'secondary-ss3'
                    ? 'ring-2 ring-violet-500 bg-violet-500/10 border-violet-500/50'
                    : 'border-white/10 hover:border-violet-500/40 bg-white/3 hover:bg-white/5 hover:-translate-y-1'
                }`}
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-violet-500 rounded-bl-[4rem] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity" />
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-violet-500/15 border border-violet-500/25 text-violet-400 rounded-xl group-hover:bg-violet-500/25 transition-colors">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                      SS3
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-violet-100 transition-colors mb-1">Economics SS3</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Exam prep — international trade, BOP, development planning, economic reform programmes, and WAEC exam patterns.
                    </p>
                  </div>
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    {['13 Chapters', 'International Trade', 'WAEC Exam Prep'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-violet-400 transition-colors uppercase tracking-wider">Select Level</span>
                    <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500 group-hover:border-violet-500 transition-all">
                      {loading === 'secondary-ss3'
                        ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                        : <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:text-white transition-colors" />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          ) : (
            /* UNDERGRADUATE SELECTION */
            <motion.div
              key="undergraduate-levels"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-sm mx-auto"
            >
              <div
                onClick={() => !loading && handleSelectLevel('undergraduate')}
                className={`relative p-7 rounded-3xl border cursor-pointer group transition-all duration-300 overflow-hidden ${
                  loading === 'undergraduate'
                    ? 'ring-2 ring-blue-500 bg-blue-500/10 border-blue-500/50'
                    : 'border-white/10 hover:border-blue-500/40 bg-white/3 hover:bg-white/5 hover:-translate-y-1'
                }`}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-bl-[6rem] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity" />
                <div className="relative z-10 space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">Undergraduate Economics</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      8 advanced university courses covering micro & macroeconomics, econometrics, monetary economics, and financial theory.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['8 University Courses', 'OLS & Regression', 'CAPM & Finance', 'Game Theory'].map(f => (
                      <FeaturePill key={f} text={f} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors uppercase">Select Level</span>
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all">
                      {loading === 'undergraduate'
                        ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                        : <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── WAEC Syllabus (secondary only) ── */}
      {selectedMainPath === 'secondary' && (
        <div className="w-full relative z-10 mt-16">
          <WassceSyllabus />
        </div>
      )}
    </div>
  );
};
