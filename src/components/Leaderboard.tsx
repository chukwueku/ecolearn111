import React, { useState, useEffect } from 'react';
import { getLeaderboard, UserProfile } from '../firebase';
import { useAuth } from '../useAuth';
import { motion } from 'motion/react';
import { Trophy, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const Leaderboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeLeague, setActiveLeague] = useState<'keynes' | 'eco_titan'>('keynes');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setLeaders([]);
      setLoading(false);
      return;
    }

    const fetchLeaders = async () => {
      try {
        const data = await getLeaderboard(50);
        setLeaders(data);
        
        // Auto-select league based on highest populated or default to eco_titan if keynes is empty
        if (data.filter(l => (l.points || 0) >= 3000).length === 0) {
           setActiveLeague('eco_titan');
        }
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

  const keynesLeaders = leaders.filter(l => (l.points || 0) >= 3000);
  const ecoTitanLeaders = leaders.filter(l => (l.points || 0) < 3000);
  
  const displayLeaders = activeLeague === 'keynes' ? keynesLeaders : ecoTitanLeaders;

  return (
    <div className="min-h-screen pt-8 md:pt-16 pb-20 px-8 max-w-7xl mx-auto transition-colors duration-500 bg-paper font-sans">
      {/* Header */}
      <div className="mb-12 border-b-4 border-border pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
        <div className="w-full md:w-auto">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12px] font-black uppercase tracking-widest text-amber-500 mb-6"
          >
            Global Rankings
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black text-ink font-display tracking-tight uppercase drop-shadow-sm break-words w-full"
          >
            Leagues
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-left md:text-right w-full md:w-auto mt-6 md:mt-0"
        >
          <p className="text-base font-bold text-slate-500 mb-6 w-full md:max-w-xs md:ml-auto">Compete in Eco Titan, then climb to the legendary Keynes league at 3,000 XP.</p>
          <div className="flex items-center gap-4 justify-start md:justify-end">
            <span className="px-4 py-1.5 bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-full border-b-4 border-blue-700">
              Live Data
            </span>
          </div>
        </motion.div>
      </div>

      {/* League Toggle */}
      <div className="flex justify-center mb-8 md:mb-16 px-4">
        <div className="bg-slate-100 p-1.5 md:p-2 rounded-2xl flex gap-1 sm:gap-2 w-full max-w-md border-b-4 border-slate-200">
          <button 
            onClick={() => setActiveLeague('eco_titan')}
            className={cn(
              "flex-1 py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all text-center",
              activeLeague === 'eco_titan' 
                ? "bg-emerald-500 text-white shadow-[0_4px_0_theme(colors.emerald.600)]" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            )}
          >
            Eco Titan
            <div className="text-[8px] sm:text-[9px] opacity-80 normal-case mt-1 tracking-normal font-bold">(&lt; 3,000 XP)</div>
          </button>
          <button 
            onClick={() => setActiveLeague('keynes')}
            className={cn(
              "flex-1 py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all text-center",
              activeLeague === 'keynes' 
                ? "bg-amber-500 text-white shadow-[0_4px_0_theme(colors.amber.600)]" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            )}
          >
            Keynes
            <div className="text-[8px] sm:text-[9px] opacity-80 normal-case mt-1 tracking-normal font-bold">(3,000+ XP)</div>
          </button>
        </div>
      </div>

      {/* Podium Section */}
      {displayLeaders.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-12 mb-16 md:mb-32 items-end max-w-5xl mx-auto px-2 sm:px-4">
          {/* Rank 2 (Silver) */}
          <div className="flex flex-col items-center w-full">
            {displayLeaders[1] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center w-full"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-slate-200 border-4 border-slate-300 rounded-full sm:rounded-[2rem] flex items-center justify-center text-slate-700 font-bold text-2xl sm:text-3xl mb-2 sm:mb-4 shadow-[0_4px_0_theme(colors.slate.300)] sm:shadow-[0_8px_0_theme(colors.slate.300)] translate-y-[2px] sm:translate-y-[-8px]">
                  {displayLeaders[1].displayName[0]}
                </div>
                <div className="w-full h-32 sm:h-40 md:h-48 bg-slate-100 border-4 border-slate-200 rounded-2xl sm:rounded-[2rem] flex flex-col items-center justify-center p-2 sm:p-4 text-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-400 mb-1 sm:mb-2">2</span>
                  <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-slate-700 truncate w-full mb-1">{displayLeaders[1].displayName}</span>
                  <span className="text-[9px] sm:text-xs font-black text-slate-500">{displayLeaders[1].points} XP</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Rank 1 (Gold) */}
          <div className="flex flex-col items-center z-10 w-full">
            {displayLeaders[0] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center w-full"
              >
                <div className="relative">
                  <div className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <Trophy className="text-amber-400 w-8 h-8 sm:w-12 sm:h-12 drop-shadow-md" fill="currentColor" />
                  </div>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-amber-400 border-4 border-amber-500 rounded-full sm:rounded-[2.5rem] flex items-center justify-center text-white font-bold text-4xl sm:text-5xl mb-2 sm:mb-4 shadow-[0_6px_0_theme(colors.amber.500)] sm:shadow-[0_12px_0_theme(colors.amber.500)] translate-y-[4px] sm:translate-y-[-12px]">
                    {displayLeaders[0].displayName[0]}
                  </div>
                </div>
                <div className="w-full h-40 sm:h-56 md:h-72 bg-amber-100 border-4 border-amber-200 rounded-2xl sm:rounded-[2.5rem] flex flex-col items-center justify-center p-2 sm:p-4 text-center">
                  <span className="text-4xl sm:text-6xl md:text-8xl font-black text-amber-500 mb-2 sm:mb-4">1</span>
                  <span className="text-[10px] sm:text-base font-bold uppercase tracking-widest text-amber-900 truncate w-full mb-1 sm:mb-2">{displayLeaders[0].displayName}</span>
                  <span className="text-[10px] sm:text-sm font-black text-amber-600">{displayLeaders[0].points} XP</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="flex flex-col items-center w-full">
            {displayLeaders[2] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center w-full"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-orange-200 border-4 border-orange-300 rounded-full sm:rounded-[2rem] flex items-center justify-center text-orange-800 font-bold text-2xl sm:text-3xl mb-2 sm:mb-4 shadow-[0_4px_0_theme(colors.orange.300)] sm:shadow-[0_8px_0_theme(colors.orange.300)] translate-y-[2px] sm:translate-y-[-8px]">
                  {displayLeaders[2].displayName[0]}
                </div>
                <div className="w-full h-24 sm:h-32 md:h-40 bg-orange-50 border-4 border-orange-100 rounded-2xl sm:rounded-[2rem] flex flex-col items-center justify-center p-2 sm:p-4 text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-400 mb-1 sm:mb-2">3</span>
                  <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-orange-900 truncate w-full mb-1">{displayLeaders[2].displayName}</span>
                  <span className="text-[9px] sm:text-xs font-black text-orange-500">{displayLeaders[2].points} XP</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <Trophy className="text-slate-300 w-16 h-16" />
          <p className="text-slate-500 font-bold max-w-sm">No scholars have reached this league yet. Keep playing to climb the ranks!</p>
        </div>
      )}

      {/* Leaderboard Grid */}
      <div className="space-y-3 sm:space-y-4 max-w-5xl mx-auto px-2 sm:px-4">
        {displayLeaders.slice(3).map((user, index) => (
          <motion.div
            key={user.uid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.02 }}
            className="card-gamified flex items-center justify-between p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-center gap-3 sm:gap-6 md:gap-10 min-w-0">
              <span className="text-xl sm:text-3xl font-black text-slate-300 w-8 sm:w-12 text-center shrink-0">
                {index + 4}
              </span>
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-100 border-b-2 sm:border-b-4 border-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl text-slate-600 shrink-0">
                {user.displayName[0]}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight uppercase font-display text-ink truncate">
                  {user.displayName}
                </h3>
                <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-blue-500 mt-0.5 sm:mt-1 truncate">
                  LVL {user.level?.replace('-', ' ') || 'Secondary'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2 sm:pl-4">
              <p className="text-xl sm:text-3xl md:text-4xl font-black text-ink whitespace-nowrap">
                {user.points?.toLocaleString() || 0} <span className="text-[10px] sm:text-sm text-slate-400 uppercase tracking-widest">XP</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
