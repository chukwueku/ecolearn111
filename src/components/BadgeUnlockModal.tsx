import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../useAuth';
import { BADGE_DEFINITIONS } from '../firebase';
import { Trophy } from 'lucide-react';

const ConfettiParticle = ({ index }: { index: number }) => {
  const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
  const color = colors[index % colors.length];
  const x = Math.random() * 100;
  const delay = Math.random() * 0.2;
  const duration = 1.5 + Math.random();
  return (
    <motion.div
      className="absolute top-0 w-2 h-2 rounded-sm z-[100]"
      style={{ left: `${x}%`, backgroundColor: color }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: 300, opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
      transition={{ duration, delay, ease: 'easeIn' }}
    />
  );
};

export const BadgeUnlockModal = () => {
  const { profile } = useAuth();
  const [queue, setQueue] = useState<string[]>([]);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  
  // Keep track of badges previously seen to detect newly added ones
  const prevBadgesRef = useRef<string[]>(profile?.badges || []);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!profile?.badges) return;
    
    // Find newly added badges
    const newBadges = profile.badges.filter(b => !prevBadgesRef.current.includes(b));
    
    if (newBadges.length > 0) {
      setQueue(prev => [...prev, ...newBadges]);
      prevBadgesRef.current = [...profile.badges];
    }
  }, [profile?.badges]);

  useEffect(() => {
    if (queue.length > 0 && !activeBadge && !isAnimatingRef.current) {
      // Dequeue the next badge
      const nextBadge = queue[0];
      setActiveBadge(nextBadge);
      isAnimatingRef.current = true;

      // Show it for 4.5 seconds, then hide and process next
      setTimeout(() => {
        setActiveBadge(null);
        setQueue(prev => prev.slice(1));
        
        // Small delay before showing next badge if any
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 500);
      }, 4500);
    }
  }, [queue, activeBadge]);

  const badgeDef = activeBadge ? BADGE_DEFINITIONS[activeBadge] : null;

  return (
    <AnimatePresence>
      {activeBadge && badgeDef && (
        <motion.div
          className="fixed top-10 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4"
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          {/* Confetti Explosion */}
          <div className="absolute inset-0 pointer-events-none overflow-visible flex justify-center">
             <div className="relative w-64 h-20">
               {Array.from({ length: 40 }).map((_, i) => <ConfettiParticle key={`confetti-${i}`} index={i} />)}
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl p-4 w-full max-w-sm flex items-center gap-5 relative overflow-hidden pointer-events-auto ring-1 ring-white/10 transform-gpu hover:scale-[1.02] transition-transform duration-300">
            {/* Ambient Background Shimmer */}
            <div className={`absolute -inset-1/2 bg-gradient-to-tr ${badgeDef.color} opacity-20 blur-2xl rounded-full`} />
            
            {/* The 3D Badge Shape */}
            <div className={`flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br ${badgeDef.color} flex items-center justify-center text-4xl relative overflow-hidden`} style={{
               boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.4), inset 0 -8px 16px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2)'
            }}>
              {/* Internal gleam */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl" />
              <div className="absolute -inset-full animate-[spin_4s_linear_infinite] bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
              
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10">{badgeDef.emoji}</span>
              
              <motion.div 
                className="absolute inset-0 rounded-xl border-2 border-white/50 z-20"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
            
            <div className="flex-grow z-10">
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy size={14} className="text-yellow-400 drop-shadow-md" />
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400/90 drop-shadow-md">Achievement Unlocked</span>
              </div>
              <h3 className="font-black text-xl text-white leading-tight drop-shadow-md">
                {badgeDef.name}
              </h3>
              <p className="text-sm text-slate-300 font-medium leading-snug mt-1 drop-shadow-sm">
                {badgeDef.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
