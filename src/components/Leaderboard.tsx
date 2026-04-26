import React, { useState, useEffect } from 'react';
import { getLeaderboard, UserProfile } from '../firebase';
import { motion } from 'motion/react';
import { Trophy, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const data = await getLeaderboard(20);
        setLeaders(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper transition-colors duration-500">
        <Loader2 className="animate-spin text-ink" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-8 max-w-7xl mx-auto transition-colors duration-500 bg-paper">
      {/* Header */}
      <div className="mb-20 border-b border-border pb-16 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6 font-sans"
          >
            Global Rankings
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-8xl font-bold text-ink font-display tracking-tighter leading-[0.85] uppercase"
          >
            Scholars <br /> Arena
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-right"
        >
          <p className="text-sm font-medium text-muted mb-6 max-w-xs ml-auto">The elite circle of Economics masters. Rankings updated in real-time.</p>
          <div className="flex items-center gap-4 justify-end">
            <span className="px-4 py-1.5 bg-slate-900 dark:bg-sky-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
              Live Data
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted font-mono">
              {new Date().toISOString().slice(0, 10)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Podium Section */}
      {leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-12 mb-32 items-end max-w-5xl mx-auto px-4">
          {/* Rank 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 border border-border bg-card rounded-[2rem] flex items-center justify-center text-ink font-bold text-3xl mb-8 shadow-sm group hover:shadow-xl transition-all transition-duration-500">
              {leaders[1].displayName[0]}
            </div>
            <div className="w-full h-48 bg-card border border-border rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center shadow-sm">
              <span className="text-5xl font-bold text-slate-200 dark:text-slate-800 mb-4 tracking-tighter">02</span>
              <span className="text-xs font-bold uppercase tracking-widest text-ink truncate w-full mb-1">{leaders[1].displayName}</span>
              <span className="text-[10px] font-mono font-bold text-muted">{leaders[1].points} PTS</span>
            </div>
          </motion.div>

          {/* Rank 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <Trophy className="text-accent w-12 h-12" />
                <div className="w-1 h-4 bg-accent/20 rounded-full" />
              </div>
              <div className="w-32 h-32 border border-sky-300 dark:border-sky-900 bg-accent rounded-[2.5rem] flex items-center justify-center text-white font-bold text-5xl mb-8 shadow-2xl shadow-sky-500/20">
                {leaders[0].displayName[0]}
              </div>
            </div>
            <div className="w-full h-72 bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-[3rem] flex flex-col items-center justify-center p-8 text-center shadow-2xl">
              <span className="text-8xl font-bold text-sky-400 mb-6 tracking-tighter">01</span>
              <span className="text-sm font-bold uppercase tracking-widest text-white truncate w-full mb-2">{leaders[0].displayName}</span>
              <span className="text-xs font-mono font-bold text-sky-400">{leaders[0].points} PTS</span>
            </div>
          </motion.div>

          {/* Rank 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 border border-border bg-card rounded-[2rem] flex items-center justify-center text-muted font-bold text-3xl mb-8 shadow-sm">
              {leaders[2].displayName[0]}
            </div>
            <div className="w-full h-40 bg-card border border-border rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center shadow-sm">
              <span className="text-4xl font-bold text-slate-200 dark:text-slate-800 mb-4 tracking-tighter">03</span>
              <span className="text-xs font-bold uppercase tracking-widest text-ink truncate w-full mb-1">{leaders[2].displayName}</span>
              <span className="text-[10px] font-mono font-bold text-muted">{leaders[2].points} PTS</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Leaderboard Grid */}
      <div className="border-t border-border">
        <div className="hidden md:grid md:grid-cols-12 gap-4 py-6 px-6 md:px-10 border-b border-border bg-paper/50 transition-colors duration-500">
          <div className="col-span-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Rank</div>
          <div className="col-span-7 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Scholar Profile</div>
          <div className="col-span-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Level</div>
          <div className="col-span-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted text-right">Points</div>
        </div>

        {leaders.map((user, index) => (
          <motion.div
            key={user.uid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.02 }}
            className={cn(
              "flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-4 py-8 px-6 md:py-10 md:px-10 border-b border-border hover:bg-paper dark:hover:bg-slate-800/50 transition-all transition-duration-500 group cursor-pointer bg-card"
            )}
          >
            <div className="col-span-1 flex items-center justify-between md:justify-start">
              <span className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Rank</span>
              <span className={cn(
                "text-3xl font-mono font-bold tracking-tighter",
                index === 0 ? "text-accent" : 
                index === 1 ? "text-slate-400" : 
                index === 2 ? "text-slate-300 dark:text-slate-700" : "text-slate-200 dark:text-slate-800 group-hover:text-muted"
              )}>
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            
            <div className="col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
              <div className={cn(
                "w-14 h-14 flex items-center justify-center font-bold text-xl border border-border rounded-2xl shrink-0 transition-all transition-duration-500",
                index === 0 ? "bg-accent text-white border-sky-400" : 
                index === 1 ? "bg-paper dark:bg-slate-800 text-ink" : 
                index === 2 ? "bg-paper dark:bg-slate-800/50 text-muted" : "bg-card text-ink group-hover:bg-slate-900 group-hover:text-white"
              )}>
                {user.displayName[0]}
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight uppercase font-display flex items-center gap-4 text-ink">
                  {user.displayName}
                  {index < 3 && <Trophy size={16} className={index === 0 ? "text-accent" : index === 1 ? "text-slate-500" : "text-slate-400"} />}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">
                  {index === 0 ? 'Grandmaster' : index < 5 ? 'Master' : 'Scholar'}
                </p>
              </div>
            </div>

            <div className="col-span-2 flex items-center justify-between md:justify-start pt-4 md:pt-0 border-t border-border mt-4 md:border-t-0 md:mt-0">
              <span className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Level</span>
              <span className="text-[9px] font-bold uppercase tracking-widest border border-border px-3 py-1 rounded-full text-muted group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all">
                {user.level}
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-between md:justify-end pb-2 md:pb-0">
              <span className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Total Pts</span>
              <div className="text-right">
                <p className="text-4xl font-mono font-bold tracking-tighter text-ink">
                  {user.points?.toLocaleString() || 0}
                </p>
                <p className="hidden md:block text-[9px] font-bold uppercase tracking-widest text-muted">Accumulated Pts</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
