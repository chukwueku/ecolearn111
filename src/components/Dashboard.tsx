import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { updateStreak, unlockBadge, getXPLevel } from '../firebase';
import { useRoadmap } from '../hooks/useRoadmap';
import { getUserInitials } from '../lib/utils';
import {
  Coins, GraduationCap, Search, Zap, ChevronRight,
  CheckCircle2, BookOpen, Lock, PlayCircle, Flame, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { XPLevelBar } from './XPLevelBar';
import { StreakWidget } from './StreakWidget';

/* ─── Progress ring ─────────────────────────────── */
const MiniProgressRing = ({ pct }: { pct: number }) => {
  const size = 36; const stroke = 3;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg] shrink-0">
      <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} stroke="rgba(255,255,255,0.1)" fill="none" />
      <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} stroke="#10b981" fill="none"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
    </svg>
  );
};

/* ─── Tier config ────────────────────────────────── */
const getTierConfig = (id: string) => {
  if (id.startsWith('ss2-'))  return { color: '#f59e0b', bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400',  label: 'SS2' };
  if (id.startsWith('ug-ch')) return { color: '#6366f1', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', label: 'SS3' };
  if (id.startsWith('ug-'))   return { color: '#3b82f6', bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   label: 'UG' };
  return { color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'SS1' };
};

/* ─── Topic Card ─────────────────────────────────── */
interface TopicCardProps {
  topic: { id: string; title: string; description: string; category: string; subtopics?: string[] };
  index: number;
  isCompleted: boolean;
  isNext: boolean;
  levelLabel: string;
  onClick: () => void;
}

const TopicCard = ({ topic, index, isCompleted, isNext, levelLabel, onClick }: TopicCardProps) => {
  const tier = getTierConfig(topic.id);
  const status = isCompleted ? 'done' : isNext ? 'next' : 'locked';

  return (
    <motion.button
      key={topic.id}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`w-full text-left rounded-2xl p-5 transition-all duration-200 group relative overflow-hidden border ${
        isCompleted
          ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
          : isNext
          ? 'bg-slate-800/80 border-white/15 hover:border-white/30 ring-1 ring-emerald-500/30'
          : 'bg-slate-900/60 border-white/6 hover:border-white/15 hover:bg-slate-900/80'
      }`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-opacity duration-300"
        style={{ background: tier.color, opacity: isCompleted ? 1 : isNext ? 0.8 : 0.3 }}
      />

      {/* "Next" glow */}
      {isNext && (
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity" />
      )}

      <div className="relative z-10 flex items-start gap-4">
        {/* Status icon */}
        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
          isCompleted
            ? 'bg-emerald-500/15 border-emerald-500/30 group-hover:bg-emerald-500/25'
            : isNext
            ? 'bg-white/8 border-white/20 group-hover:bg-emerald-500/15 group-hover:border-emerald-500/30'
            : 'bg-white/4 border-white/8 group-hover:bg-white/8'
        }`}>
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isNext ? (
            <PlayCircle className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
          ) : (
            <BookOpen className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-500/70' : 'text-slate-500'}`}>
              {topic.category || `Chapter ${index + 1}`}
            </span>
            {isCompleted && (
              <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                ✓ Complete
              </span>
            )}
            {isNext && !isCompleted && (
              <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[9px] font-black rounded-full uppercase tracking-wider animate-pulse">
                Up Next
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className={`font-bold text-base leading-snug mb-2 transition-colors ${
            isCompleted ? 'text-emerald-100' : isNext ? 'text-white' : 'text-slate-300 group-hover:text-white'
          }`}>
            {topic.title}
          </h4>

          {/* Subtopics as tags */}
          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {topic.subtopics.slice(0, 3).map((sub, si) => (
                <span
                  key={si}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/8 text-slate-400 font-medium line-clamp-1 max-w-[180px] truncate"
                >
                  {sub}
                </span>
              ))}
              {topic.subtopics.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/8 text-slate-500 font-medium">
                  +{topic.subtopics.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: isCompleted ? '100%' : '0%',
                  background: isCompleted ? '#10b981' : tier.color,
                }}
              />
            </div>
            <span className={`text-[10px] font-bold shrink-0 ${isCompleted ? 'text-emerald-400' : 'text-slate-600'}`}>
              {isCompleted ? '100%' : '0%'}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className={`shrink-0 self-center transition-all duration-200 ${
          isNext || isCompleted ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
        }`}>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.button>
  );
};

/* ─── Main Dashboard ─────────────────────────────── */
export const Dashboard = () => {
  const { user, profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [streakCelebration, setStreakCelebration] = useState(false);
  const [showGameStats, setShowGameStats] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const level = profile?.level || 'secondary';
  const { roadmap } = useRoadmap(level);
  const progress = profile?.progress || {};

  const filteredRoadmap = roadmap.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.subtopics?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const levelLabel = level === 'secondary-ss2' ? 'SS2' : level === 'secondary-ss3' ? 'SS3' : level === 'undergraduate' ? 'UG' : 'SS1';
  const levelTitle = level === 'secondary-ss2' ? 'Economics SS2' : level === 'secondary-ss3' ? 'Economics SS3' : level === 'undergraduate' ? 'Undergraduate Economics' : 'Economics SS1';
  const levelSubtitle = level === 'secondary-ss2'
    ? 'Advanced SS2 WAEC/NECO Curriculum'
    : level === 'secondary-ss3'
    ? 'Comprehensive SS3 WAEC/NECO Syllabus'
    : level === 'undergraduate'
    ? 'Advanced University-Level Curriculum'
    : 'Foundation Economics — WAEC/NECO SS1';

  const tierColors: Record<string, string> = {
    'secondary': '#10b981', 'secondary-ss2': '#f59e0b',
    'secondary-ss3': '#6366f1', 'undergraduate': '#3b82f6',
  };

  useEffect(() => {
    if (!user) return;
    const runStreak = async () => {
      const result = await updateStreak(user.uid);
      if (result.isNew) {
        setStreakCelebration(true);
        setTimeout(() => setStreakCelebration(false), 3000);
        if (profile) setProfile({ ...profile, streak: result.streak });
        if (result.streak >= 30) unlockBadge(user.uid, 'streak_30');
        else if (result.streak >= 7) unlockBadge(user.uid, 'streak_7');
        else if (result.streak >= 3) unlockBadge(user.uid, 'streak_3');
      }
    };
    runStreak();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const nextTopicIndex = roadmap.findIndex(t => !progress[t.id]);
  const resumeTopic = nextTopicIndex >= 0 ? roadmap[nextTopicIndex] : roadmap[0];
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalTopics = roadmap.length;
  const overallProgress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  const xpInfo = getXPLevel(profile?.xp || 0);
  const streak = profile?.streak || 0;
  const accentColor = tierColors[level] || '#10b981';

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-28 font-['Inter',sans-serif]">

      {/* ── TOP BAR ── */}
      <header className="bg-slate-950/90 backdrop-blur-xl w-full sticky top-0 z-40 border-b border-white/5 flex justify-between items-center px-4 sm:px-5 py-3">
        <div
          onClick={() => { setSearchQuery(''); navigate('/study'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none active:scale-[0.98] transition-transform"
        >
          <div className="relative">
            {user?.photoURL ? (
              <img className="w-10 h-10 rounded-full border-2 border-white/10 object-cover shrink-0" src={user.photoURL} alt="Profile" />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {getUserInitials(profile?.displayName, profile?.email)}
              </div>
            )}
            <span
              className="absolute -bottom-1 -right-1 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black border border-black/20"
              style={{ background: accentColor }}
            >
              {levelLabel}
            </span>
          </div>
          <span className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">EcoMastery</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGameStats(s => !s)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full hover:bg-amber-500/15 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-amber-400">{streak}</span>
          </button>
          <button
            onClick={() => setShowGameStats(s => !s)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full hover:bg-violet-500/15 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-black text-violet-400">Lv.{xpInfo.level}</span>
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full hover:bg-emerald-500/15 transition-colors">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-black text-emerald-400">{profile?.points || 0}</span>
          </button>
        </div>
      </header>

      {/* ── EXPANDABLE STATS PANEL ── */}
      <AnimatePresence>
        {showGameStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-900 border-b border-white/5"
          >
            <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
              <StreakWidget streak={streak} showCelebration={streakCelebration} />
              <XPLevelBar xp={profile?.xp || 0} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="px-4 sm:px-5 py-5 space-y-5 max-w-4xl mx-auto">

        {/* ── OVERALL PROGRESS BANNER ── */}
        {totalTopics > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl p-5 border border-white/8"
            style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(20,30,50,0.95) 100%)' }}
          >
            {/* Accent glow */}
            <div
              className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[60px] opacity-20"
              style={{ background: accentColor }}
            />
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="font-black text-white text-lg">{levelTitle}</h2>
                    <p className="text-slate-400 text-xs">{levelSubtitle}</p>
                  </div>
                  {level !== 'undergraduate' && (
                    <button
                      onClick={() => navigate('/select-level')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-bold text-slate-300 transition-all"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      Switch
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-black shrink-0" style={{ color: accentColor }}>
                    {overallProgress}%
                  </span>
                  <span className="text-xs text-slate-500 shrink-0">{completedCount}/{totalTopics}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── RESUME CARD ── */}
        {!searchQuery && resumeTopic && (
          <section
            onClick={() => navigate(`/study-guide/${resumeTopic.id}`)}
            className="relative overflow-hidden rounded-2xl p-5 cursor-pointer group border border-white/10 hover:border-emerald-500/30 transition-all"
            style={{ background: 'linear-gradient(135deg, #0d2010 0%, #0a1628 100%)' }}
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500 rounded-full blur-[50px] opacity-15 group-hover:opacity-25 transition-opacity" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <PlayCircle className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider">
                    {completedCount > 0 ? 'Continue' : 'Start Here'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">{resumeTopic.category}</span>
                </div>
                <h3 className="font-black text-white text-base leading-snug mb-2 group-hover:text-emerald-100 transition-colors">
                  {resumeTopic.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{resumeTopic.description}</p>
                {resumeTopic.subtopics && resumeTopic.subtopics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {resumeTopic.subtopics.slice(0, 3).map((sub, si) => (
                      <span key={si} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-400">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                <div className="text-right">
                  <div className="text-xs font-black text-white">{overallProgress}%</div>
                  <div className="text-[10px] text-slate-500">done</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── SEARCH ── */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-slate-900/80 border border-white/8 hover:border-white/15 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all text-white placeholder-slate-500 text-sm font-medium"
            placeholder="Search chapters, topics, models..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 text-xs font-bold transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── SEARCH RESULTS label ── */}
        {searchQuery && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">
              {filteredRoadmap.length} result{filteredRoadmap.length !== 1 ? 's' : ''} for "{searchQuery}"
            </span>
          </div>
        )}

        {/* ── TOPIC CARDS ── */}
        <section className="space-y-3">
          {!searchQuery && (
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-black text-white text-base">All Chapters</h2>
              <span className="text-xs text-slate-500 font-bold">{totalTopics} topics</span>
            </div>
          )}

          {filteredRoadmap.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="font-semibold">No chapters match "{searchQuery}"</p>
              <button onClick={() => setSearchQuery('')} className="mt-3 text-emerald-400 text-sm font-bold hover:underline">
                Clear search
              </button>
            </div>
          ) : (
            filteredRoadmap.map((topic, index) => {
              const realIndex = roadmap.indexOf(topic);
              const isCompleted = !!progress[topic.id];
              const isNext = !isCompleted && realIndex === nextTopicIndex;
              return (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  index={index}
                  isCompleted={isCompleted}
                  isNext={isNext}
                  levelLabel={levelLabel}
                  onClick={() => navigate(`/study-guide/${topic.id}`)}
                />
              );
            })
          )}
        </section>

      </main>
    </div>
  );
};
