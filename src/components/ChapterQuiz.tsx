import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, XCircle, Loader2, Trophy, Sparkles, RefreshCw, BookOpen } from 'lucide-react';
import { generateQuestions } from '../gemini';
import { updatePoints, unlockBadge, updateProgress } from '../firebase';
import { useAuth } from '../useAuth';

interface ChapterQuizProps {
  topicId: string;
  topicTitle: string;
  level: string;
  onClose: () => void;
  onComplete?: (score: number, total: number) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const ConfettiParticle = ({ index }: { index: number }) => {
  const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
  const color = colors[index % colors.length];
  const x = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const duration = 1.5 + Math.random();
  return (
    <motion.div
      className="absolute top-0 w-2 h-2 rounded-sm"
      style={{ left: `${x}%`, backgroundColor: color }}
      initial={{ y: -10, opacity: 1, rotate: 0 }}
      animate={{ y: 300, opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
      transition={{ duration, delay, ease: 'easeIn' }}
    />
  );
};

export const ChapterQuiz: React.FC<ChapterQuizProps> = ({ topicId, topicTitle, level, onClose, onComplete }) => {
  const { user, profile, setProfile } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const qs = await generateQuestions(topicTitle, level, 5);
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [topicTitle, level]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const handleAnswer = async (answerIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIdx);
    setShowExplanation(true);
    const isCorrect = answerIdx === questions[currentQ].correctAnswer;
    const newAnswers = [...answers, answerIdx];
    setAnswers(newAnswers);
    if (isCorrect) setScore(s => s + 1);

    // After last question
    if (currentQ === questions.length - 1) {
      const finalScore = isCorrect ? score + 1 : score;
      const xp = finalScore * 15;
      setXpEarned(xp);
      
      setTimeout(async () => {
        setFinished(true);
        if (finalScore === questions.length) {
          setConfetti(true);
        }
        if (user) {
          await updatePoints(user.uid, xp);
          await updateProgress(user.uid, topicId, finalScore >= Math.ceil(questions.length * 0.6));
          
          if (finalScore === questions.length) {
            await unlockBadge(user.uid, 'quiz_perfect');
          }
          // Check chapters_5 / chapters_10 badges
          const completedCount = Object.values(profile?.progress || {}).filter(Boolean).length + 1;
          if (completedCount >= 10) await unlockBadge(user.uid, 'chapters_10');
          else if (completedCount >= 5) await unlockBadge(user.uid, 'chapters_5');
          
          // Advanced Time-based Badges
          const hour = new Date().getHours();
          const day = new Date().getDay();
          
          if (hour >= 0 && hour < 4) {
             await unlockBadge(user.uid, 'night_owl');
          } else if (hour >= 5 && hour <= 8) {
             await unlockBadge(user.uid, 'early_bird');
          }
          
          if (day === 0 || day === 6) { // Sunday or Saturday
             await unlockBadge(user.uid, 'weekend_warrior');
          }
          
          if (profile) {
              const newTotalXp = (profile.xp || 0) + xp;
              setProfile({ ...profile, xp: newTotalXp });
              
              // Level 25 prodigy check (requires getXPLevel, we will dynamically import it)
              const { getXPLevel } = await import('../firebase');
              const { level } = getXPLevel(newTotalXp);
              if (level >= 25) {
                  await unlockBadge(user.uid, 'economic_prodigy');
              }
          }
        }
        onComplete?.(finalScore, questions.length);
      }, 1600);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQ(q => q + 1);
  };

  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {confetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {Array.from({ length: 30 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
              <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chapter Quiz</div>
              <div className="text-sm font-black text-slate-800 dark:text-white truncate max-w-[220px]">{topicTitle}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={32} className="animate-spin text-emerald-500" />
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Generating quiz questions...</p>
          </div>
        ) : finished ? (
          /* Results screen */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-6xl mx-auto w-fit"
              >
                {scorePercent === 100 ? '🏆' : scorePercent >= 60 ? '🎯' : '📚'}
              </motion.div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                {scorePercent === 100 ? 'Perfect Score!' : scorePercent >= 60 ? 'Well Done!' : 'Keep Studying!'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                You scored <span className="font-black text-emerald-600">{score}</span> out of <span className="font-black">{questions.length}</span>
              </p>
            </div>

            {/* Score ring */}
            <div className="relative w-28 h-28 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-100 dark:text-slate-800" />
                <motion.circle
                  cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5"
                  stroke={scorePercent === 100 ? '#10b981' : scorePercent >= 60 ? '#6366f1' : '#f59e0b'}
                  strokeLinecap="round"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - scorePercent }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{scorePercent}%</span>
              </div>
            </div>

            {/* XP earned */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 bg-violet-50 dark:bg-violet-950/30 rounded-xl py-3 border border-violet-200/60 dark:border-violet-800/30"
            >
              <Sparkles size={16} className="text-violet-500" />
              <span className="text-sm font-black text-violet-700 dark:text-violet-300">+{xpEarned} XP earned!</span>
            </motion.div>



            {/* Per-question review */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {questions.map((q, i) => {
                const userAns = answers[i];
                const correct = userAns === q.correctAnswer;
                return (
                  <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl text-xs ${correct ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/30' : 'bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/30'}`}>
                    {correct ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <XCircle size={14} className="text-red-400 shrink-0" />}
                    <span className="font-medium text-slate-600 dark:text-slate-300 truncate">{q.question}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setFinished(false); setCurrentQ(0); setScore(0); setAnswers([]); setConfetti(false); loadQuestions(); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <RefreshCw size={15} /> Retry
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors active:scale-[0.97]"
              >
                Continue →
              </button>
            </div>
          </div>
        ) : (
          /* Question screen */
          <div className="p-6 space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Question {currentQ + 1} of {questions.length}</span>
                <span className="text-xs font-black text-emerald-600">{score} correct</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-base font-bold text-slate-800 dark:text-white leading-relaxed">
                  {questions[currentQ]?.question}
                </p>

                <div className="space-y-2.5">
                  {questions[currentQ]?.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === questions[currentQ].correctAnswer;
                    const showResult = selectedAnswer !== null;

                    let optClass = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20';
                    if (showResult) {
                      if (isCorrect) optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30';
                      else if (isSelected) optClass = 'border-red-400 bg-red-50 dark:bg-red-950/30';
                      else optClass = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-50';
                    }

                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3 ${optClass}`}
                        whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] font-black transition-all ${showResult && isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : showResult && isSelected ? 'border-red-400 bg-red-400 text-white' : 'border-slate-300 dark:border-slate-600 text-slate-500'}`}>
                          {showResult && isCorrect ? '✓' : showResult && isSelected ? '✗' : String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-slate-700 dark:text-slate-200">{opt}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${selectedAnswer === questions[currentQ].correctAnswer ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'}`}
                    >
                      <span className="font-black">Explanation: </span>
                      {questions[currentQ].explanation}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedAnswer !== null && currentQ < questions.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={nextQuestion}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] text-white font-bold rounded-xl transition-all"
                  >
                    Next Question →
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
