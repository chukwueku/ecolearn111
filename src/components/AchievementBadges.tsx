import React from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { BADGE_DEFINITIONS } from '../firebase';
import { useAuth } from '../useAuth';

interface AchievementBadgesProps {
  earnedBadges: string[];
  compact?: boolean;
  showAll?: boolean;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  earnedBadges,
  compact = false,
  showAll = true,
}) => {
  const { profile } = useAuth();
  
  // Determine user's tier (defaults to secondary if unknown)
  const userTier = profile?.level?.startsWith('secondary') ? 'secondary' : 'undergrad';
  
  // Filter all badge IDs to only those that match 'both' or the user's tier
  const allBadgeIds = Object.keys(BADGE_DEFINITIONS).filter(
    id => BADGE_DEFINITIONS[id].tier === 'both' || BADGE_DEFINITIONS[id].tier === userTier
  );

  const displayBadges = showAll ? allBadgeIds : allBadgeIds.filter(id => earnedBadges.includes(id));

  if (displayBadges.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 text-sm">
        Complete challenges to earn badges!
      </div>
    );
  }

  if (compact) {
    const earned = allBadgeIds.filter(id => earnedBadges.includes(id)).slice(0, 5);
    return (
      <div className="flex items-center gap-1.5">
        {earned.map(id => (
          <div key={id} title={BADGE_DEFINITIONS[id].name} className="text-lg">{BADGE_DEFINITIONS[id].emoji}</div>
        ))}
        {earnedBadges.length > 5 && (
          <div className="text-[11px] font-bold text-slate-400">+{earnedBadges.length - 5}</div>
        )}
        {earnedBadges.length === 0 && <div className="text-xs text-slate-400">No badges yet</div>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {displayBadges.map((badgeId, index) => {
        const badge = BADGE_DEFINITIONS[badgeId];
        const earned = earnedBadges.includes(badgeId);
        return (
          <motion.div
            key={badgeId}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.04, type: 'spring', bounce: 0.3 }}
            className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
              earned
                ? 'border-transparent bg-white dark:bg-slate-800 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                : 'border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 opacity-50'
            }`}
          >
            {earned && (
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${badge.color} opacity-10`} />
            )}

            <div className={`relative text-3xl ${earned ? '' : 'grayscale'}`}>
              {earned ? badge.emoji : <Lock size={24} className="text-slate-300 dark:text-slate-600" />}
            </div>

            <div className="text-center">
              <div className={`text-[11px] font-black ${earned ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {badge.name}
              </div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                {badge.description}
              </div>
            </div>

            {earned && (
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br ${badge.color} border-2 border-white dark:border-slate-900 flex items-center justify-center`}>
                <span className="text-[8px] text-white font-black">✓</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
