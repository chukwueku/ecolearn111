import React, { useState, useEffect } from 'react';
import { getLeaderboard, UserProfile, getXPLevel } from '../firebase';
import { useAuth } from '../useAuth';
import { motion } from 'motion/react';
import { Trophy, Loader2, ShieldCheck, Flame, Medal } from 'lucide-react';
import { cn } from '../lib/utils';


type LeagueId = 'market_novice' | 'classical_thinker' | 'keynesian_master' | 'nobel_laureate' | 'eco_scholar';

const LEAGUES: { id: LeagueId; name: string; colorClass: string; activeBg: string; text: string; range: [number, number] }[] = [
  { id: 'market_novice', name: 'Market Novice', colorClass: 'text-emerald-500', activeBg: 'bg-emerald-500', text: 'Rank 51+', range: [50, 200] },
  { id: 'classical_thinker', name: 'Classical Thinker', colorClass: 'text-blue-500', activeBg: 'bg-blue-500', text: 'Rank 21-50', range: [20, 50] },
  { id: 'keynesian_master', name: 'Keynesian Master', colorClass: 'text-violet-500', activeBg: 'bg-violet-500', text: 'Rank 11-20', range: [10, 20] },
  { id: 'nobel_laureate', name: 'Nobel Laureate', colorClass: 'text-orange-500', activeBg: 'bg-orange-500', text: 'Rank 4-10', range: [3, 10] },
  { id: 'eco_scholar', name: 'Eco Scholar', colorClass: 'text-amber-500', activeBg: 'bg-amber-500', text: 'Rank 1-3', range: [0, 3] },
];

export const Leaderboard: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeLeague, setActiveLeague] = useState<LeagueId>('market_novice');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setLeaders([]);
      setLoading(false);
      return;
    }

    const fetchLeaders = async () => {
      try {
        const mainPath = profile?.level === 'undergraduate' ? 'undergraduate' : 'secondary';
        // Fetch top 200 to populate all 5 leagues
        const data = await getLeaderboard(200, mainPath);
        setLeaders(data);
        
        // Auto-select league based on user's current rank
        const userIndex = data.findIndex(l => l.uid === user.uid);
        if (userIndex !== -1) {
          if (userIndex < 3) setActiveLeague('eco_scholar');
          else if (userIndex < 10) setActiveLeague('nobel_laureate');
          else if (userIndex < 20) setActiveLeague('keynesian_master');
          else if (userIndex < 50) setActiveLeague('classical_thinker');
          else setActiveLeague('market_novice');
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, [user, profile, authLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper transition-colors duration-500">
        <Loader2 className="animate-spin text-ink" size={40} />
      </div>
    );
  }

  const activeLeagueDef = LEAGUES.find(l => l.id === activeLeague)!;
  const [startIdx, endIdx] = activeLeagueDef.range;
  const displayLeaders = leaders.slice(startIdx, endIdx);

  return (
    <div className="min-h-screen pt-8 md:pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto transition-colors duration-500 bg-paper font-sans">
      {/* Header */}
      <div className="mb-10 border-b-4 border-border pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
        <div className="w-full md:w-auto">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12px] font-black uppercase tracking-widest text-amber-500 mb-4"
          >
            Global Rankings
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black text-ink font-display tracking-tight uppercase drop-shadow-sm break-words w-full leading-none"
          >
            Leagues
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-left md:text-right w-full md:w-auto mt-4 md:mt-0"
        >
          <p className="text-sm font-bold text-slate-500 mb-4 w-full md:max-w-xs md:ml-auto">
            Overtake the player above you to steal their rank and advance to the next league!
          </p>
          <div className="flex items-center gap-4 justify-start md:justify-end">
            <span className="px-4 py-1.5 bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-full border-b-4 border-blue-700">
              Live Data
            </span>
          </div>
        </motion.div>
      </div>

      {/* 5-League Toggle */}
      <div className="flex justify-center mb-12 w-full">
        <div className="bg-slate-100 p-1.5 md:p-2 rounded-2xl flex gap-1 w-full max-w-4xl border-b-4 border-slate-200 overflow-x-auto overflow-y-hidden snap-x">
          {LEAGUES.map((league) => (
            <button 
              key={league.id}
              onClick={() => setActiveLeague(league.id)}
              className={cn(
                "flex-1 min-w-[100px] py-2 sm:py-3 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all text-center snap-center shrink-0",
                activeLeague === league.id 
                  ? `${league.activeBg} text-white shadow-[0_4px_0_rgba(0,0,0,0.2)]` 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              )}
            >
              <div className="truncate px-1">{league.name}</div>
              <div className={cn(
                "text-[9px] normal-case mt-0.5 tracking-normal font-bold opacity-80",
                activeLeague === league.id ? "text-white" : league.colorClass
              )}>
                ({league.text})
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Podium Section */}
      {displayLeaders.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-12 mb-16 md:mb-32 items-end max-w-5xl mx-auto px-2 sm:px-4">
          {/* Rank 2 (Silver podium of this league) */}
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
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-400 mb-1 sm:mb-2">{startIdx + 2}</span>
                  <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-slate-700 truncate w-full mb-1">{displayLeaders[1].displayName}</span>
                  <span className="text-[9px] sm:text-xs font-black text-slate-500">{(displayLeaders[1].xp || displayLeaders[1].points || 0).toLocaleString()} XP</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Rank 1 (Gold podium of this league) */}
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
                  <span className="text-4xl sm:text-6xl md:text-8xl font-black text-amber-500 mb-2 sm:mb-4">{startIdx + 1}</span>
                  <span className="text-[10px] sm:text-base font-bold uppercase tracking-widest text-amber-900 truncate w-full mb-1 sm:mb-2">{displayLeaders[0].displayName}</span>
                  <span className="text-[10px] sm:text-sm font-black text-amber-600">{(displayLeaders[0].xp || displayLeaders[0].points || 0).toLocaleString()} XP</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Rank 3 (Bronze podium of this league) */}
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
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-400 mb-1 sm:mb-2">{startIdx + 3}</span>
                  <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-orange-900 truncate w-full mb-1">{displayLeaders[2].displayName}</span>
                  <span className="text-[9px] sm:text-xs font-black text-orange-500">{(displayLeaders[2].xp || displayLeaders[2].points || 0).toLocaleString()} XP</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <Trophy className="text-slate-300 w-16 h-16" />
          <p className="text-slate-500 font-bold max-w-sm">No scholars have reached this tier yet. Keep playing to climb the ranks!</p>
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
                {startIdx + index + 4}
              </span>
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-100 border-b-2 sm:border-b-4 border-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl text-slate-600 shrink-0">
                {user.displayName[0]}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight uppercase font-display text-ink truncate flex items-center gap-2">
                  {user.displayName}
                  {user.streak && user.streak >= 3 && (
                    <span className="hidden sm:flex items-center gap-0.5 text-xs font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full tracking-widest">
                      <Flame size={12} className="fill-orange-500" /> {user.streak}
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-3 mt-0.5 sm:mt-1">
                  <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-blue-500 truncate flex items-center gap-1">
                    <ShieldCheck size={12} className="hidden sm:block" /> {getXPLevel(user.xp || user.points || 0).title}
                  </p>
                  {(user.badges?.length ?? 0) > 0 && (
                    <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-emerald-500 truncate flex items-center gap-1 border-l border-slate-200 pl-3">
                      <Medal size={12} /> {user.badges?.length} Badges
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2 sm:pl-4">
              <p className="text-xl sm:text-3xl md:text-4xl font-black text-ink whitespace-nowrap">
                {(user.xp || user.points || 0).toLocaleString()} <span className="text-[10px] sm:text-sm text-slate-400 uppercase tracking-widest">XP</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

