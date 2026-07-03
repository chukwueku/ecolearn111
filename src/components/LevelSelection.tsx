import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, ArrowRight, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { updateUserLevel } from '../firebase';
import { WassceSyllabus } from './WassceSyllabus';

type MainPath = 'secondary' | 'undergraduate' | null;

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
      if (profile) {
        setProfile({ ...profile, level });
      }
      
      navigate('/'); // Go straight to home for all levels
    } catch (error) {
      console.error('Error updating level:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col justify-start pt-12 md:pt-24 items-center p-6 font-['Hanken_Grotesk'] relative w-full overflow-x-hidden">
      {/* Background soft ambient glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-6xl relative z-10 py-8">
        <div className="text-center space-y-4 mb-12">
          {selectedMainPath && profile?.level === 'pending' && (
            <button 
              onClick={() => setSelectedMainPath(null)}
              className="mb-8 mx-auto flex items-center gap-2 px-4 py-2 bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors rounded-full text-sm font-bold border border-outline-variant/30"
            >
              <ChevronLeft size={16} />
              Back to Paths
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-primary/10 text-primary mx-auto flex items-center justify-center rounded-2xl shadow-inner border border-primary/10"
          >
            <span className="material-symbols-outlined text-3xl font-bold">school</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-primary"
          >
            {selectedMainPath ? 'Select Your Level' : 'Choose Your Learning Path'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-on-surface-variant max-w-xl mx-auto font-medium text-base md:text-lg"
          >
            {selectedMainPath ? 'Choose your specific curriculum tier.' : 'Select your curriculum focus. Gain access to interactive study guides, mathematical simulations, and personalized progress boards.'}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedMainPath ? (
            <motion.div 
              key="main-paths"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 pt-4"
            >
              {/* Secondary Level Roadmap */}
              <div
                onClick={() => setSelectedMainPath('secondary')}
                className={`p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden hover:-translate-y-1`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[4rem] pointer-events-none" />
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <BookOpen size={32} />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <h3 className="text-2xl font-black text-on-surface group-hover:text-primary transition-colors">
                      Secondary Level Roadmap
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed font-medium min-h-[72px]">
                      Comprehensive curriculum covering SS1, SS2, and SS3 Economics. Designed for WAEC/NECO preparation and fundamental economic principles.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-[12px] font-black tracking-widest text-outline group-hover:text-primary transition-colors">
                    EXPLORE ROADMAP
                  </span>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Advanced Undergrad Level Roadmap */}
              <div
                onClick={() => !loading && handleSelectLevel('undergraduate')}
                className={`p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden hover:-translate-y-1`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-[4rem] pointer-events-none" />
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap size={32} />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <h3 className="text-2xl font-black text-on-surface group-hover:text-indigo-500 transition-colors">
                      Advanced Undergrad Level
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed font-medium min-h-[72px]">
                      Advanced academic tier covering microeconomics, macroeconomics, and applied economic theory for university-level scholars.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-[12px] font-black tracking-widest text-outline group-hover:text-indigo-500 transition-colors">
                    EXPLORE ROADMAP
                  </span>
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : selectedMainPath === 'secondary' ? (
            <motion.div 
              key="secondary-levels"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-6 pt-4"
            >
              {/* Economics SS1 */}
              <div
                onClick={() => !loading && handleSelectLevel('secondary')}
                className={`p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-secondary transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${loading === 'secondary' ? 'ring-2 ring-secondary' : 'hover:-translate-y-1'}`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-secondary-container/10 text-secondary rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <BookOpen size={24} />
                    </div>
                    <span className="px-3 py-1 bg-secondary-container/10 text-primary text-[10px] font-bold rounded-full border border-secondary-container/5">
                      ECONOMICS SS1
                    </span>
                  </div>
                  <div className="space-y-2 text-left">
                    <h3 className="text-xl font-black text-primary group-hover:text-secondary transition-colors">
                      Economics SS1
                    </h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed font-medium min-h-[72px]">
                      Assess candidates’ knowledge of basic economic principles needed for rational decision making.
                    </p>
                  </div>
                  <div className="space-y-2.5 pt-2 border-t border-dashed border-outline-variant/20">
                    <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      <span>12 Interactive Chapters</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-wider text-outline group-hover:text-secondary transition-colors">
                    SELECT LEVEL
                  </span>
                  <div className="w-8 h-8 rounded-full bg-secondary-container/15 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                    {loading === 'secondary' ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              </div>

              {/* Economics SS2 */}
              <div
                onClick={() => !loading && handleSelectLevel('secondary-ss2')}
                className={`p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-amber-500 transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${loading === 'secondary-ss2' ? 'ring-2 ring-amber-500' : 'hover:-translate-y-1'}`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded-full border border-amber-500/10">
                      ECO SS2
                    </span>
                  </div>
                  <div className="space-y-2 text-left">
                    <h3 className="text-xl font-black text-primary group-hover:text-amber-500 transition-colors">
                      Economics SS2
                    </h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed font-medium min-h-[72px]">
                      Advanced linear equations, dispersion stats, utility behaviors, elasticity calculations, fiscal dynamics.
                    </p>
                  </div>
                  <div className="space-y-2.5 pt-2 border-t border-dashed border-outline-variant/20">
                    <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      <span>15 Complete Chapters</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-wider text-outline group-hover:text-amber-500 transition-colors">
                    SELECT LEVEL
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                    {loading === 'secondary-ss2' ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              </div>

              {/* Economics SS3 */}
              <div
                onClick={() => !loading && handleSelectLevel('secondary-ss3')}
                className={`p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${loading === 'secondary-ss3' ? 'ring-2 ring-emerald-500' : 'hover:-translate-y-1'}`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <BookOpen size={24} />
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-500/10">
                      ECO SS3
                    </span>
                  </div>
                  <div className="space-y-2 text-left">
                    <h3 className="text-xl font-black text-primary group-hover:text-emerald-500 transition-colors">
                      Economics SS3
                    </h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed font-medium min-h-[72px]">
                      Comparative lessons, human capital, petroleum roles, regulatory agencies, BOP adjustment mechanisms.
                    </p>
                  </div>
                  <div className="space-y-2.5 pt-2 border-t border-dashed border-outline-variant/20">
                    <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span>13 Comprehensive Chapters</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-wider text-outline group-hover:text-emerald-500 transition-colors">
                    SELECT LEVEL
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {loading === 'secondary-ss3' ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="undergraduate-levels"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 max-w-sm mx-auto gap-6 pt-4"
            >
              {/* Undergraduate Level */}
              <div
                onClick={() => !loading && handleSelectLevel('undergraduate')}
                className={`p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${loading === 'undergraduate' ? 'ring-2 ring-indigo-500' : 'hover:-translate-y-1'}`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap size={24} />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <h3 className="text-xl font-black text-primary group-hover:text-indigo-500 transition-colors">
                      Undergraduate Economics
                    </h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed font-medium min-h-[72px]">
                      Advanced microeconomics, firm theory, consumer choice, and competitive markets.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-wider text-outline group-hover:text-indigo-500 transition-colors">
                    SELECT LEVEL
                  </span>
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    {loading === 'undergraduate' ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {selectedMainPath === 'secondary' && (
        <div className="w-full relative z-10 mt-12 bg-surface">
          <WassceSyllabus />
        </div>
      )}
    </div>
  );
};
