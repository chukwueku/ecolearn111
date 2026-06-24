import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { updateUserLevel } from '../firebase';
import { WassceSyllabus } from './WassceSyllabus';

export const LevelSelection = () => {
  const { user, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectLevel = async (level: 'secondary' | 'secondary-ss2' | 'undergraduate') => {
    if (!user) return;
    setLoading(level);
    try {
      await updateUserLevel(user.uid, level);
      if (profile) {
        setProfile({ ...profile, level });
      }
      
      if (level === 'secondary') {
        navigate('/study-guide/ss1-ch1');
      } else if (level === 'secondary-ss2') {
        navigate('/study-guide/ss2-ch1');
      } else {
        navigate('/study-guide/ug-ch1');
      }
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
      
      <div className="w-full max-w-6xl relative z-10 space-y-12 py-8">
        <div className="text-center space-y-4">
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
            Choose Your Learning Path
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-on-surface-variant max-w-xl mx-auto font-medium text-base md:text-lg"
          >
            Select your curriculum focus. Gain access to interactive study guides, mathematical simulations, and personalized progress boards.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-6 pt-4">
          {/* Economics SS1 Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => !loading && handleSelectLevel('secondary')}
            className={`p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-secondary transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${
              loading === 'secondary' ? 'ring-2 ring-secondary' : 'hover:-translate-y-1'
            }`}
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
                  Designed to assess candidates’ knowledge of basic economic principles needed for rational decision making relating to individuals, businesses, government and society.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-dashed border-outline-variant/20">
                <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  <span>12 Interactive Chapters</span>
                </div>
                <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  <span>Foundation of Analysis</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-wider text-outline group-hover:text-secondary transition-colors">
                SELECT ROADMAP
              </span>
              <div className="w-8 h-8 rounded-full bg-secondary-container/15 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                {loading === 'secondary' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Economics SS2 Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => !loading && handleSelectLevel('secondary-ss2')}
            className={`p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-secondary transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${
              loading === 'secondary-ss2' ? 'ring-2 ring-secondary' : 'hover:-translate-y-1'
            }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-secondary-container/10 text-secondary rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Sparkles size={24} className="text-amber-500 animate-pulse" />
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded-full border border-amber-500/10">
                  NEW • ECO SS2
                </span>
              </div>
              
              <div className="space-y-2 text-left">
                <h3 className="text-xl font-black text-primary group-hover:text-secondary transition-colors flex items-center gap-2">
                  Economics SS2
                </h3>
                <p className="text-on-surface-variant text-xs leading-relaxed font-medium min-h-[72px]">
                  Extract the complete WAEC/NECO syllabus. Advanced linear equations, dispersion stats, utility behaviors, elasticity calculations, fiscal dynamics, and national accounting aggregates.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-dashed border-outline-variant/20">
                <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span>15 Complete New Chapters</span>
                </div>
                <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span>Formulas, Tables & Interactive Charts</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-wider text-amber-600 group-hover:text-secondary transition-colors">
                CHOOSE ADVANCED SS2
              </span>
              <div className="w-8 h-8 rounded-full bg-secondary-container/15 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                {loading === 'secondary-ss2' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Economics SS3 Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onClick={() => !loading && handleSelectLevel('undergraduate')}
            className={`p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-secondary transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${
              loading === 'undergraduate' ? 'ring-2 ring-secondary' : 'hover:-translate-y-1'
            }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap size={24} className="text-indigo-500 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-500/10">
                  NEW • ECO SS3
                </span>
              </div>
              
              <div className="space-y-2 text-left">
                <h3 className="text-xl font-black text-primary group-hover:text-secondary transition-colors flex items-center gap-2">
                  Economics SS3
                </h3>
                <p className="text-on-surface-variant text-xs leading-relaxed font-semibold min-h-[72px]">
                  Master the final tier of the WAEC/NECO syllabus. Comparative lessons from Japan and Asian Tigers, human capital, petroleum roles, regulatory agencies, BOP adjustment mechanisms, and economic systems/reforms.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-dashed border-outline-variant/20">
                <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  <span>13 Comprehensive Chapters</span>
                </div>
                <div className="flex gap-2 items-center text-[11px] font-bold text-on-surface/80">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  <span>Interactive Policy & Money Simulators</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-wider text-indigo-600 group-hover:text-secondary transition-colors">
                CHOOSE ADVANCED SS3
              </span>
              <div className="w-8 h-8 rounded-full bg-secondary-container/15 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                {loading === 'undergraduate' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="w-full relative z-10 mt-12 bg-surface">
        <WassceSyllabus />
      </div>
    </div>
  );
};
