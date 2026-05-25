import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronLeft, Lightbulb, Zap, ShieldAlert, ArrowRight, Activity, TrendingUp, DollarSign, Award, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '../useAuth';
import { updatePoints } from '../firebase';

// Mocked massive pool generator for 1000 puzzles
const generatePuzzleScenarios = () => {
    const scenarios = [
        {
            title: "The Inflation Spike",
            topic: "Monetary Policy",
            scenario: "You are the head of the Central Bank. Inflation has unexpectedly hit 8%, up from 2%. Unemployment is steady at 4%. Real wages are declining. Citizens are protesting the cost of living.",
            question: "What is the most orthodox monetary policy response to curb this inflation?",
            options: [
                "Decrease the reserve requirement for banks",
                "Increase the benchmark interest rate",
                "Print more money to pay for citizen subsidies",
                "Lower taxes on essential goods"
            ],
            answer: 1,
            explanation: "Increasing interest rates cools down the economy by making borrowing more expensive, which reduces consumer spending and business investment, ultimately lowering demand-pull inflation."
        },
        {
            title: "The Supply Chain Shock",
            topic: "Macroeconomics",
            scenario: "A global pandemic has disrupted global shipping lines. The cost of shipping a container has quintupled. Local manufacturers cannot get raw parts.",
            question: "What type of inflation is this scenario most likely to cause in the short term?",
            options: [
                "Demand-pull inflation",
                "Cost-push inflation",
                "Built-in inflation",
                "Hyperinflation"
            ],
            answer: 1,
            explanation: "Cost-push inflation occurs when overall prices increase (inflation) due to increases in the cost of wages and raw materials."
        },
        {
            title: "Tech Startup Dilemma",
            topic: "Microeconomics",
            scenario: "You run a software startup. You've noticed that as you hire more developers beyond your 50th hire, the additional output per developer is decreasing, even though pay remains constant.",
            question: "Which economic principle does this situation best illustrate?",
            options: [
                "Economies of scale",
                "The law of diminishing marginal returns",
                "Opportunity cost",
                "Comparative advantage"
            ],
            answer: 1,
            explanation: "The law of diminishing marginal returns states that adding an additional factor of production results in smaller increases in output."
        },
        {
            title: "The Gig Economy Shift",
            topic: "Labor Economics",
            scenario: "A new law requires all ride-sharing apps to classify drivers as full employees with benefits rather than independent contractors.",
            question: "According to standard microeconomic theory, what is the most likely immediate effect on the ride-sharing market?",
            options: [
                "Supply of rides decreases, prices increase",
                "Supply of rides increases, prices decrease",
                "Demand for rides increases, prices increase",
                "Demand for rides decreases, prices decrease"
            ],
            answer: 0,
            explanation: "Classifying drivers as employees increases the cost of labor for platforms. This shifts the supply curve to the left, resulting in fewer rides offered and higher prices for consumers."
        },
        {
            title: "The Currency Crisis",
            topic: "International Trade",
            scenario: "Your developing nation heavily relies on importing oil, priced in USD. Your local currency has just depreciated 20% against the dollar due to capital flight.",
            question: "What is the immediate domestic impact of this currency depreciation?",
            options: [
                "Imported inflation and higher domestic fuel prices",
                "Decreased export competitiveness",
                "Lower interest rates automatically",
                "A decrease in the national debt (if held in USD)"
            ],
            answer: 0,
            explanation: "A weaker domestic currency makes imports (like oil priced in USD) more expensive, leading to imported inflation."
        }
    ];
    
    // Simulate 1000 puzzles by cycling and slight variations
    const massivePool = [];
    for (let i = 0; i < 1000; i++) {
        const base = scenarios[i % scenarios.length];
        massivePool.push({
            ...base,
            id: i + 1,
            level: Math.floor(i / 10) + 1, // Every 10 questions raises the "level"
        });
    }
    return massivePool;
};

const PUZZLE_POOL = generatePuzzleScenarios();

export const DailyPuzzle = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [performance, setPerformance] = useState<Record<string, { total: number, correct: number }>>({});

    const [botScore, setBotScore] = useState(0);

    useEffect(() => {
        if (!isSessionComplete && !isAnswered) {
            const timer = setTimeout(() => {
                // The bot answers. 70% chance to get it right.
                const gotCorrect = Math.random() > 0.3;
                if (gotCorrect) {
                     setBotScore(prev => prev + 10);
                }
            }, 3000 + Math.random() * 6000); // Between 3 and 9 seconds
            return () => clearTimeout(timer);
        }
    }, [currentPuzzleIdx, isSessionComplete, isAnswered]);

    const puzzle = PUZZLE_POOL[currentPuzzleIdx];

    const handleOptionSelect = (idx: number) => {
        if (isAnswered) return;
        setSelectedOption(idx);
        setIsAnswered(true);
        
        const isCorrect = idx === puzzle.answer;
        if (isCorrect) {
            setScore((prev) => prev + 10);
            if (user) {
                updatePoints(user.uid, 10);
            }
        }

        setPerformance(prev => {
            const topic = puzzle.topic;
            const current = prev[topic] || { total: 0, correct: 0 };
            return {
                ...prev,
                [topic]: {
                    total: current.total + 1,
                    correct: current.correct + (isCorrect ? 1 : 0)
                }
            };
        });
    };

    const handleNext = () => {
        if (questionsAnswered + 1 >= 5) {
            setIsSessionComplete(true);
        } else {
            setQuestionsAnswered(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
            setCurrentPuzzleIdx((prev) => (prev + 1) % PUZZLE_POOL.length);
        }
    };

    if (isSessionComplete) {
        const totalCorrect = Object.values(performance).reduce((acc, val) => acc + val.correct, 0);
        return (
            <div className="min-h-screen bg-surface dark:bg-surface-container pb-24 font-['Hanken_Grotesk'] text-on-surface">
                <header className="w-full sticky top-0 z-40 bg-surface dark:bg-surface-container shadow-sm flex items-center px-4 py-3 border-b border-outline-variant/30">
                    <button onClick={() => navigate('/dashboard')} className="p-2 mr-2 active:scale-95 transition-transform hover:bg-surface-container-high rounded-full text-on-surface-variant text-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex-1">
                        <h1 className="font-headline-sm font-bold tracking-tight">Session Complete</h1>
                    </div>
                </header>

                <main className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-outline-variant/50 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Award size={160} />
                        </div>
                        
                        <div className="w-20 h-20 bg-secondary-container text-secondary flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-inner rotate-3">
                            <Trophy size={40} />
                        </div>
                        
                        <h2 className="text-3xl font-bold font-headline-md text-primary mb-2">
                            {score > botScore ? 'Great Work, Scholar!' : score === botScore ? 'It\'s a Tie!' : 'Auto-Bot Won!'}
                        </h2>
                        <p className="text-on-surface-variant mb-10 text-lg">
                            {score > botScore ? 'You outsmarted the Auto-Bot.' : score === botScore ? 'You matched the Auto-Bot\'s efficiency.' : 'The Auto-Bot calculated faster this time.'}
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-10">
                            <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500" /> Accuracy</span>
                                <span className="text-3xl font-black text-on-surface">{Math.round((totalCorrect / 5) * 100)}%</span>
                            </div>
                            <div className="bg-secondary-container/20 p-4 rounded-2xl border border-secondary/30 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1"><Zap size={14} className="text-secondary" /> You</span>
                                <span className="text-3xl font-black text-secondary">{score}</span>
                            </div>
                            <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">Bot</span>
                                <span className="text-3xl font-black text-slate-500">{botScore}</span>
                            </div>
                        </div>

                        <div className="text-left bg-surface w-full rounded-2xl border border-outline-variant/30 p-6 relative z-10">
                            <h3 className="text-lg font-bold font-headline-sm mb-6 flex items-center gap-2 text-primary">
                                <BarChart3 size={20} className="text-secondary" /> Performance Breakdown
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(performance).map(([topic, data]) => {
                                    const percentage = Math.round((data.correct / data.total) * 100);
                                    let barColor = "bg-primary";
                                    if (percentage === 100) barColor = "bg-emerald-500";
                                    else if (percentage < 50) barColor = "bg-error";
                                    
                                    return (
                                        <div key={topic} className="flex flex-col gap-2">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span className="text-on-surface">{topic}</span>
                                                <span className="text-on-surface-variant">{data.correct}/{data.total} ({percentage}%)</span>
                                            </div>
                                            <div className="h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                                                <div className={`h-full ${barColor} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="mt-10 inline-flex w-full md:w-auto items-center justify-center gap-2 bg-primary text-on-primary px-10 py-4 rounded-xl font-label-lg font-bold shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
                        >
                            Return to Dashboard <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface dark:bg-surface-container pb-24 font-['Hanken_Grotesk'] text-on-surface">
            {/* TopAppBar */}
            <header className="w-full sticky top-0 z-40 bg-surface dark:bg-surface-container shadow-sm flex items-center px-4 py-3 border-b border-outline-variant/30">
                <button onClick={() => navigate('/dashboard')} className="p-2 mr-2 active:scale-95 transition-transform hover:bg-surface-container-high rounded-full text-on-surface-variant text-sm">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="font-headline-sm font-bold tracking-tight">Eco-Simulator Puzzle</h1>
                    <p className="text-xs font-label-sm text-on-surface-variant flex items-center gap-1 uppercase tracking-widest">
                        <Activity size={10} className="text-secondary" /> Level {puzzle.level} • Case #{puzzle.id}
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Auto-Bot</span>
                        <div className="flex items-center gap-1 text-slate-500">
                            <span className="font-mono text-sm font-black">{botScore} XP</span>
                        </div>
                    </div>
                    <div className="h-6 w-px bg-outline-variant/50 hidden md:block" />
                    <div className="flex items-center gap-2 bg-secondary-container/50 px-3 py-1.5 rounded-full border border-secondary/20">
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
                    key={puzzle.id}
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
                            <h2 className="text-xl md:text-2xl font-bold font-headline-md leading-tight text-primary">
                                {puzzle.title}
                            </h2>
                        </div>
                        
                        <div className="bg-surface-container-low p-5 md:p-6 rounded-2xl border-l-4 border-l-secondary shadow-inner">
                            <p className="text-base md:text-lg text-on-surface leading-relaxed font-body-lg">
                                {puzzle.scenario}
                            </p>
                        </div>

                        <div className="mt-4 border-t border-outline-variant/30 pt-6">
                            <p className="text-lg font-bold font-headline-sm text-on-surface mb-6 flex items-start gap-2">
                                <span className="text-secondary opacity-70">Q.</span>
                                {puzzle.question}
                            </p>

                            <div className="grid gap-3">
                                {puzzle.options.map((opt, idx) => {
                                    const isSelected = selectedOption === idx;
                                    const isCorrect = idx === puzzle.answer;
                                    const showStatus = isAnswered && (isSelected || isCorrect);
                                    
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
                                            className={`text-left px-5 py-4 rounded-xl border flex items-center gap-4 transition-all duration-300 font-label-lg group w-full ${buttonStyle} ${!isAnswered && 'active:scale-[0.98]'}`}
                                        >
                                            <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors text-[10px] font-black ${indicatorStyle}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="flex-1 font-medium">{opt}</span>
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
                            <div className={`rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-lg border ${selectedOption === puzzle.answer ? 'bg-secondary-container/20 border-secondary/30' : 'bg-error-container/20 border-error/30'}`}>
                                <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center shadow-inner ${selectedOption === puzzle.answer ? 'bg-secondary text-secondary-on-container' : 'bg-error text-error-on-container'}`}>
                                    {selectedOption === puzzle.answer ? <Trophy size={28} /> : <TrendingUp size={28} className="rotate-180" />}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className={`text-xl font-bold mb-2 font-headline-sm ${selectedOption === puzzle.answer ? 'text-secondary-on-container dark:text-emerald-400' : 'text-error-on-container dark:text-error'}`}>
                                        {selectedOption === puzzle.answer ? 'Masterful Logic!' : 'Market Correction!'}
                                    </h3>
                                    <p className="text-on-surface-variant font-body-md leading-relaxed text-sm md:text-base mb-6">
                                        <strong className="text-on-surface">Economic Reasoning:</strong> {puzzle.explanation}
                                    </p>
                                    
                                    <button 
                                        onClick={handleNext}
                                        className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-xl font-label-lg font-bold shadow-lg hover:bg-primary/90 active:scale-95 transition-all text-sm md:text-base hover:shadow-xl hover:-translate-y-0.5"
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
