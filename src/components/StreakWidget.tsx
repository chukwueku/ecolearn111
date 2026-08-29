import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame } from 'lucide-react';

interface StreakWidgetProps {
  streak: number;
  compact?: boolean;
  showCelebration?: boolean;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ streak, compact = false, showCelebration = false }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (streak > 0) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(t);
    }
  }, [streak]);

  const flameColor = streak >= 30
    ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
    : streak >= 7
    ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]'
    : streak >= 3
    ? 'text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
    : 'text-yellow-400';

  if (compact) {
    return (
      <motion.div
        animate={animate ? { scale: [1, 1.3, 1] } : {}}
        className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/30 px-2.5 py-1 rounded-full"
      >
        <Flame size={14} className={flameColor} />
        <span className="text-[12px] font-black text-orange-600 dark:text-orange-400">{streak}</span>
      </motion.div>
    );
  }

  return (
    <div className="relative p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl border border-orange-200/60 dark:border-orange-800/30">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-lg"
          >
            🔥 Streak extended!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <motion.div
          animate={animate ? { rotate: [-10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
          className="text-4xl"
        >
          🔥
        </motion.div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-orange-600 dark:text-orange-400">{streak}</span>
            <span className="text-sm font-bold text-orange-500 dark:text-orange-500">day streak</span>
          </div>
          <div className="text-[11px] text-orange-400 font-medium">
            {streak === 0 && 'Start your streak today!'}
            {streak >= 1 && streak < 3 && 'Keep going!'}
            {streak >= 3 && streak < 7 && '🔥 On fire!'}
            {streak >= 7 && streak < 30 && '⚡ Weekly warrior!'}
            {streak >= 30 && '💎 Iron Economist!'}
          </div>
        </div>
      </div>

      {/* Mini streak calendar — last 7 days */}
      <div className="mt-3 flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => {
          const daysFilled = Math.min(streak, 7);
          const filled = i < daysFilled;
          const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className={`w-full h-2 rounded-full ${filled ? 'bg-gradient-to-r from-orange-400 to-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                initial={filled ? { scaleX: 0 } : {}}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              />
              <span className="text-[9px] font-bold text-slate-400">{days[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
