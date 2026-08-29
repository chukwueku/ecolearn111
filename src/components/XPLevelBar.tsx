import React from 'react';
import { motion } from 'motion/react';
import { getXPLevel } from '../firebase';
import { Zap } from 'lucide-react';

interface XPLevelBarProps {
  xp: number;
  compact?: boolean;
}

export const XPLevelBar: React.FC<XPLevelBarProps> = ({ xp, compact = false }) => {
  const { level, title, currentXP, nextXP, progress } = getXPLevel(xp);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-gradient-to-r from-violet-600 to-purple-700 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
          <Zap size={11} className="fill-yellow-300 stroke-yellow-300" />
          <span>Lv.{level}</span>
        </div>
        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[80px]">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-2xl border border-violet-200/60 dark:border-violet-800/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap size={18} className="fill-yellow-300 stroke-yellow-300" />
          </div>
          <div>
            <div className="text-[11px] text-violet-500 dark:text-violet-400 font-bold uppercase tracking-wider">Level {level}</div>
            <div className="text-sm font-black text-violet-900 dark:text-violet-100">{title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{currentXP.toLocaleString()} / {nextXP.toLocaleString()} XP</div>
          <div className="text-[10px] text-slate-400 font-medium">to level {Math.min(level + 1, 50)}</div>
        </div>
      </div>
      <div className="h-3 bg-white/60 dark:bg-slate-800/60 rounded-full overflow-hidden border border-violet-200/40 dark:border-violet-700/30">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};
