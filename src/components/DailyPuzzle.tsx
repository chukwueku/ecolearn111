import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronLeft, Lightbulb, Zap, ShieldAlert, ArrowRight, Activity, TrendingUp, DollarSign, Award, BarChart3, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../useAuth';
import { updatePoints, unlockBadge, getQuestionsForLevel } from '../firebase';
import { MathText } from './MathComponents';

export const DailyPuzzle = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    
    // Core game state
    const [allQuestionsCache, setAllQuestionsCache] = useState<any[]>([]);
    const [queue, setQueue] = useState<any[]>([]);
    const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    
    // UI state
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    
    // Session progress
    const [score, setScore] = useState(0);
    const [sessionStreak, setSessionStreak] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    
    const fetchMoreQuestions = async (cacheOverride?: any[]) => {
        const poolToUse = cacheOverride || allQuestionsCache;
        if (!poolToUse || poolToUse.length === 0) return;
        
        // Grab 5 random questions from the pool that are not currently in the queue
        const currentIds = queue.map(q => q.id);
        const available = poolToUse.filter(q => !currentIds.includes(q.id));
        
        // If we've exhausted all available questions, we just shuffle the whole pool again
        let sourceArray = available.length >= 5 ? available : [...poolToUse];
        
        // Shuffle the source array
        for (let i = sourceArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sourceArray[i], sourceArray[j]] = [sourceArray[j], sourceArray[i]];
        }
        
        const newBatch = sourceArray.slice(0, 5);
        setQueue(prev => [...prev, ...newBatch]);
    };

    // Initial fetch
    useEffect(() => {
        const loadInitialQuestions = async () => {
            setInitialLoad(true);
            try {
                const userLevel = profile?.level || 'undergraduate';
                const levelParam = userLevel === 'undergraduate' ? 'undergraduate' : 'secondary';
                const questions = await getQuestionsForLevel(levelParam);
                if (questions && questions.length > 0) {
                    setAllQuestionsCache(questions);
                    await fetchMoreQuestions(questions);
                }
            } catch (e) {
                console.error("Error loading questions from bank:", e);
            } finally {
                setInitialLoad(false);
            }
        };
        
        if (queue.length === 0 && initialLoad) {
            loadInitialQuestions();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const puzzleRaw = queue[currentPuzzleIdx];
    const puzzle = puzzleRaw ? {
        title: puzzleRaw.topicId || "EcoMastery Case Study",
        topic: puzzleRaw.topicId || "Theory & Application",
        question: puzzleRaw.question,
        options: puzzleRaw.options,
        answer: puzzleRaw.correctAnswer,
        explanation: puzzleRaw.explanation || "This answer is derived using standard micro/macro equilibrium models, utility functions, or econometric formulas.",
        level: profile?.level || "Advanced Undergrad",
        id: currentPuzzleIdx + 1
    } : null;

    const handleOptionSelect = (idx: number) => {
        if (isAnswered) return;
        setSelectedOption(idx);
        setIsAnswered(true);
        
        const isCorrect = idx === puzzle?.answer;
        if (isCorrect) {
            // Gamification multiplier logic
            const multiplier = Math.min(3, 1 + Math.floor(sessionStreak / 3)); // Max 3x multiplier
            const pointsGained = 10 * multiplier;
            
            setScore(prev => prev + pointsGained);
            setSessionStreak(prev => prev + 1);
            
            if (user) {
                updatePoints(user.uid, pointsGained);
            }
        } else {
            setSessionStreak(0); // Break streak
        }
    };

    const handleNext = async () => {
        setQuestionsAnswered(prev => prev + 1);
        setIsAnswered(false);
        setSelectedOption(null);
        setCurrentPuzzleIdx(prev => prev + 1);
        
        // Award badge every 10 questions answered in a session
        if ((questionsAnswered + 1) % 10 === 0 && user) {
            const { unlockBadge } = await import('../firebase');
            unlockBadge(user.uid, 'puzzle_master');
        }

        // Fetch more if queue is running low (e.g. 3 questions left)
        if (currentPuzzleIdx >= queue.length - 3) {
            fetchMoreQuestions();
        }
    };

    if (initialLoad) {
        return (
            <div className="min-h-screen bg-surface dark:bg-surface-container flex flex-col items-center justify-center p-4">
                <Loader2 className="animate-spin text-primary mb-3" size={40} />
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Syncing with Admin Bank...</p>
            </div>
        );
    }
    
    if (!puzzle && !initialLoad) {
        return (
            <div className="min-h-screen bg-surface dark:bg-surface-container flex flex-col items-center justify-center p-4">
                <ShieldAlert className="text-warning mb-3" size={40} />
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">No questions available for this level.</p>
                <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-full font-bold">Return to Dashboard</button>
            </div>
        );
    }

    const currentMultiplier = Math.min(3, 1 + Math.floor(sessionStreak / 3));

    return (
        <div className="min-h-screen bg-surface dark:bg-surface-container pb-24 font-['Hanken_Grotesk'] text-on-surface">
            {/* TopAppBar */}
            <header className="w-full sticky top-0 z-40 bg-surface dark:bg-surface-container shadow-sm flex items-center px-4 py-3 border-b border-outline-variant/30">
                <button onClick={() => navigate('/dashboard')} className="p-2 mr-2 active:scale-95 transition-transform hover:bg-surface-container-high rounded-full text-on-surface-variant text-sm">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="font-headline-sm font-bold tracking-tight">Eco-Arena Challenge</h1>
                    <p className="text-xs font-label-sm text-on-surface-variant flex items-center gap-1 uppercase tracking-widest">
                        <Activity size={10} className="text-secondary" /> Case #{puzzle?.id}
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Session Streak multiplier display */}
                    <AnimatePresence mode="popLayout">
                        {currentMultiplier > 1 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex items-center gap-1 bg-violet-50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/30 px-2 py-1.5 rounded-full"
                            >
                                <span className="text-[12px] font-black text-violet-600 dark:text-violet-400">{currentMultiplier}x MULT</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/30 px-2.5 py-1.5 rounded-full">
                        <span className="text-sm">🔥</span>
                        <span className="text-[12px] font-black text-orange-600 dark:text-orange-400">{sessionStreak} Streak</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-secondary-container/50 px-3 py-1.5 rounded-full border border-secondary/20 transition-all">
                        <Zap size={14} className="text-secondary" />
                        <span className="text-sm font-bold font-label-md text-secondary-on-container">{score} XP</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
                {/* Scenario Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={puzzle?.id}
                    className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-outline-variant/50 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <DollarSign size={120} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-error-container text-error flex items-center justify-center border border-error/20">
                                <ShieldAlert size={20} />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold font-headline-md leading-tight text-primary uppercase tracking-widest text-sm">
                                {puzzle?.title}
                            </h2>
                        </div>
                        
                        <div className="mt-4">
                            <div className="text-lg md:text-xl font-bold font-headline-sm text-on-surface mb-6 flex items-start gap-2">
                                <span className="text-secondary opacity-70 shrink-0">Q.</span>
                                <span className="flex-1"><MathText text={puzzle?.question || ''} /></span>
                            </div>

                            <div className="grid gap-3">
                                {puzzle?.options.map((opt: string, idx: number) => {
                                    const isSelected = selectedOption === idx;
                                    const isCorrect = idx === puzzle.answer;
                                    
                                    let buttonStyle = "bg-surface border-outline-variant text-on-surface hover:border-secondary hover:bg-secondary-container/10";
                                    let indicatorStyle = "border-outline text-transparent group-hover:border-secondary";
                                    
                                    if (isAnswered) {
                                        if (isCorrect) {
                                            buttonStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                                            indicatorStyle = "bg-emerald-500 border-none text-white";
                                        } else if (isSelected && !isCorrect) {
                                            buttonStyle = "bg-error-container/50 border-error text-error shadow-[0_0_15px_rgba(186,26,26,0.15)]";
                                            indicatorStyle = "bg-error border-none text-white";
                                        } else {
                                            buttonStyle = "bg-surface-container border-outline-variant/50 text-on-surface-variant opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            disabled={isAnswered}
                                            className={`text-left px-5 py-4 rounded-xl border flex items-center gap-4 transition-all duration-300 font-label-lg group w-full ${buttonStyle} ${!isAnswered ? 'active:scale-[0.98]' : ''}`}
                                        >
                                            <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors text-[10px] font-black ${indicatorStyle}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="flex-1 font-medium"><MathText text={opt} /></span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Feedback Panel */}
                <AnimatePresence>
                    {isAnswered && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: -20 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className={`rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-lg border ${selectedOption === puzzle?.answer ? 'bg-secondary-container/20 border-secondary/30' : 'bg-error-container/20 border-error/30'}`}>
                                <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center shadow-inner ${selectedOption === puzzle?.answer ? 'bg-secondary text-secondary-on-container' : 'bg-error text-error-on-container'}`}>
                                    {selectedOption === puzzle?.answer ? <Trophy size={28} /> : <TrendingUp size={28} className="rotate-180" />}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className={`text-xl font-bold mb-2 font-headline-sm ${selectedOption === puzzle?.answer ? 'text-secondary-on-container dark:text-emerald-400' : 'text-error-on-container dark:text-error'}`}>
                                        {selectedOption === puzzle?.answer ? 'Masterful Logic!' : 'Market Correction!'}
                                    </h3>
                                    <div className="text-on-surface-variant font-body-md leading-relaxed text-sm md:text-base mb-6">
                                        <strong className="text-on-surface">Economic Reasoning:</strong> <MathText text={puzzle?.explanation || ''} />
                                    </div>
                                    
                                    <button 
                                        onClick={handleNext}
                                        className={`inline-flex w-full md:w-auto items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-xl font-label-lg font-bold shadow-lg transition-all text-sm md:text-base hover:bg-primary/90 active:scale-95 hover:shadow-xl hover:-translate-y-0.5`}
                                    >
                                        Next Case Study <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
