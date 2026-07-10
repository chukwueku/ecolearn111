import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronLeft, Lightbulb, Zap, ShieldAlert, ArrowRight, Activity, TrendingUp, DollarSign, Award, BarChart3, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../useAuth';
import { updatePoints, getTodayDailyChallenge, saveDailyChallengeAttempt, getUserDailyChallengeAttempt } from '../firebase';
import { MathText } from './MathComponents';

// Mocked massive pool generator for 1000 puzzles
const generatePuzzleScenarios = () => {
    const scenarios = [
        {
            title: "Law of Diminishing Returns",
            topic: "Production Theory (Micro)",
            scenario: "A bakery keeps adding workers to a fixed kitchen with a single oven. Initially, output rises rapidly, but eventually, each additional worker adds less output than the previous one.",
            question: "Which economic principle explains this phenomenon, assuming constant technology?",
            options: [
                "Law of Diminishing Marginal Returns",
                "Decreasing Returns to Scale",
                "Negative Income Elasticity of Labor",
                "Price Elasticity of Supply"
            ],
            answer: 0,
            explanation: "The Law of Diminishing Marginal Returns states that as equal increments of a variable input (labor) are added to a fixed input (kitchen/oven), the marginal product of the variable input will eventually decrease."
        },
        {
            title: "The Liquidity Trap",
            topic: "Monetary Policy (Macro)",
            scenario: "An economy is in a deep recession, and the central bank has lowered the nominal interest rate \\(r\\) to near zero. Despite this, consumers and businesses prefer to hold cash rather than invest or spend.",
            question: "Which macroeconomic condition does this scenario describe, where conventional monetary policy becomes ineffective?",
            options: [
                "Liquidity Trap",
                "Stagflation",
                "Fiscal Dominance",
                "Crowding-In"
            ],
            answer: 0,
            explanation: "In a liquidity trap, the nominal interest rate is near zero, and the public holds cash because they expect interest rates to rise. Under these conditions, injections of monetary reserves fail to stimulate aggregate demand or private investment."
        },
        {
            title: "Theory of Comparative Advantage",
            topic: "Trade Theory (International)",
            scenario: "Country A can produce both agricultural goods and high-tech software more efficiently in absolute terms than Country B.",
            question: "According to David Ricardo's trade theory, why should Country A still engage in trade with Country B?",
            options: [
                "Country A should specialize in the product in which it has a lower opportunity cost (comparative advantage)",
                "Country A should impose protective tariffs to avoid wages being depressed by Country B",
                "Trade is only beneficial if both countries possess an absolute advantage in at least one good",
                "Country A should specialize entirely in high-tech software and export everything to balance its currency value"
            ],
            answer: 0,
            explanation: "The Law of Comparative Advantage states that trade is mutually beneficial if countries specialize in producing goods for which they have the lowest relative opportunity cost, even if one country has an absolute advantage in all goods."
        },
        {
            title: "Omitted Variable Bias",
            topic: "Regression Analysis (Econometrics)",
            scenario: "A researcher regresses student test scores on classroom size but fails to control for socioeconomic status, which is positively correlated with smaller classrooms and higher scores.",
            question: "What econometric issue does the estimated coefficient on classroom size suffer from?",
            options: [
                "Omitted Variable Bias",
                "High Multicollinearity",
                "Heteroscedasticity",
                "Simultaneity Bias"
            ],
            answer: 0,
            explanation: "Failing to include a variable that correlates with both the key independent variable (classroom size) and the dependent variable (test scores) introduces Omitted Variable Bias."
        },
        {
            title: "Public Goods Characteristics",
            topic: "Market Failure (Micro)",
            scenario: "A coastal lighthouse provides warning signals to all passing ships. One ship utilizing the light does not reduce the light available to others, and the lighthouse owner cannot exclude any ship from seeing the light.",
            question: "Which two key properties define this type of public good?",
            options: [
                "Non-rivalry and Non-excludability",
                "Rivalry and Excludability",
                "High Income Elasticity and Low Cost",
                "Asymmetric Information and External Diseconomies"
            ],
            answer: 0,
            explanation: "Public goods are defined by two main characteristics: Non-rivalry (one person's consumption does not diminish another's) and Non-excludability (it is impossible or extremely costly to prevent non-payers from consuming it)."
        },
        {
            title: "The Phillips Curve Trade-off",
            topic: "Monetary Policy (Macro)",
            scenario: "In the short run, there is an inverse relationship between inflation and unemployment. In the long run, this trade-off disappears.",
            question: "Why does the long-run Phillips curve become a vertical line at the natural rate of unemployment?",
            options: [
                "Inflation expectations fully adjust, causing nominal wages to rise in step with prices",
                "Governments balance budgets in the long run",
                "Central banks always peg nominal interest rates to zero",
                "Aggregate demand becomes completely horizontal"
            ],
            answer: 0,
            explanation: "In the long run, expected inflation equals actual inflation. Nominal wages adjust to price changes, leaving the real wage and natural rate of unemployment unchanged."
        },
        {
            title: "The Mundell-Fleming Trilemma",
            topic: "Open Economy Macroeconomics",
            scenario: "The Impossible Trinity states that an open economy cannot simultaneously achieve three major policy goals.",
            question: "Which three policy objectives are mutually exclusive under the Trilemma framework?",
            options: [
                "Fixed exchange rates, free capital flow, and independent monetary policy",
                "Low inflation, high employment, and balanced government budgets",
                "Floating exchange rates, trade surpluses, and gold standard adherence",
                "High interest rates, low tariffs, and direct foreign investment"
            ],
            answer: 0,
            explanation: "The Trilemma dictates that a nation must choose any two out of a fixed exchange rate, free capital mobility, and an independent monetary policy. It cannot have all three."
        },
        {
            title: "Multicollinearity in OLS",
            topic: "Regression Diagnostics (Econometrics)",
            scenario: "In a multiple linear regression model \\(Y = \\beta_0 + \\beta_1 X_1 + \\beta_2 X_2 + u\\), the independent variables \\(X_1\\) and \\(X_2\\) are highly correlated with each other.",
            question: "What is the primary consequence of this multicollinearity on the OLS estimators?",
            options: [
                "The standard errors of the coefficients become very large, making it difficult to establish individual statistical significance",
                "The OLS estimators become biased and lose their linear properties",
                "The R-squared value drops to zero regardless of the actual relationship",
                "The error term \\(u\\) is guaranteed to suffer from heteroscedasticity"
            ],
            answer: 0,
            explanation: "Multicollinearity does not induce bias in the OLS coefficient estimates, but it dramatically increases the variance (and standard errors) of the estimates, making individual coefficients statistically insignificant and highly sensitive to small model changes."
        },
        {
            title: "Nash Equilibrium in Prisoners' Dilemma",
            topic: "Game Theory (Micro)",
            scenario: "Two rival firms choose to 'Cooperate' (keep prices high) or 'Cheat' (undercut). If both cooperate, each earns \\(\\$50\\). If one cheats, they earn \\(\\$80\\) while the cooperator earns \\(\\$10\\). If both cheat, each earns \\(\\$20\\).",
            question: "Determine the dominant strategy and resulting Nash Equilibrium.",
            options: [
                "Dominant strategy is 'Cheat'; Nash Equilibrium is both cheat (\\(\\$20\\), \\(\\$20\\))",
                "Dominant strategy is 'Cooperate'; Nash Equilibrium is both cooperate (\\(\\$50\\), \\(\\$50\\))",
                "No dominant strategy exists; equilibrium is unstable",
                "Firms will alternate between Cooperating and Cheating"
            ],
            answer: 0,
            explanation: "Cheating is dominant because it yields a higher payoff regardless of what the rival does (\\(80 > 50\\) if they cooperate, \\(20 > 10\\) if they cheat). Thus, both cheat is the unique Nash Equilibrium."
        },
        {
            title: "The Crowding-Out Effect",
            topic: "Fiscal Policy (Macro)",
            scenario: "A government engages in massive deficit spending to fund projects, issuing a high volume of treasury bonds to borrow from domestic credit markets.",
            question: "How does this heavy borrowing affect domestic interest rates and private investment?",
            options: [
                "It drives interest rates up, which reduces (crowds out) private investment",
                "It lowers interest rates, boosting private investment",
                "It leaves interest rates unchanged but increases private consumption",
                "It forces the central bank to raise the required reserve ratio"
            ],
            answer: 0,
            explanation: "Heavy government borrowing increases the demand for loanable funds, driving up interest rates. Higher interest rates make borrowing more expensive for businesses, reducing private investment."
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

    // Live daily challenge states
    const [challenge, setChallenge] = useState<any | null>(null);
    const [challengeQuestions, setChallengeQuestions] = useState<any[]>([]);
    const [alreadyCompleted, setAlreadyCompleted] = useState<any | null>(null);
    const [loadingChallenge, setLoadingChallenge] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                // Try to find for user's level. Fallback to undergraduate.
                const userLevel = profile?.level || 'undergraduate';
                const todayChallenge = await getTodayDailyChallenge(userLevel);
                if (todayChallenge) {
                    setChallenge(todayChallenge);
                    setChallengeQuestions(todayChallenge.questions || []);
                    
                    if (user) {
                        const previousAttempt = await getUserDailyChallengeAttempt(user.uid, todayChallenge.id!);
                        if (previousAttempt) {
                            setAlreadyCompleted(previousAttempt);
                        }
                    }
                }
            } catch (e) {
                console.error("Error loading daily challenge:", e);
            } finally {
                setLoadingChallenge(false);
            }
        };
        fetchChallenge();
    }, [user, profile]);

    const [activePool, setActivePool] = useState<any[]>([]);
    const isRealChallenge = challengeQuestions.length > 0;

    useEffect(() => {
        if (!loadingChallenge) {
            let poolToUse = [];
            if (challengeQuestions.length > 0) {
                poolToUse = [...challengeQuestions];
            } else {
                poolToUse = [...PUZZLE_POOL.slice(0, 10)];
            }
            
            // Perform Fisher-Yates shuffle
            for (let i = poolToUse.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [poolToUse[i], poolToUse[j]] = [poolToUse[j], poolToUse[i]];
            }
            
            setActivePool(poolToUse);
        }
    }, [challengeQuestions, loadingChallenge]);

    const totalQuestions = activePool.length > 0 ? activePool.length : 10;

    // Map active puzzle to standard format
    const puzzleRaw = activePool[currentPuzzleIdx] || activePool[0];
    const puzzle = isRealChallenge && puzzleRaw
        ? {
            title: puzzleRaw.course || "Advanced Economics",
            topic: puzzleRaw.course || "Theory & Application",
            scenario: puzzleRaw.scenario || puzzleRaw.question,
            question: puzzleRaw.scenario ? puzzleRaw.question : "Analyze the options carefully and select the single most rigorous economic outcome:",
            options: puzzleRaw.options,
            answer: puzzleRaw.correctAnswer !== undefined ? puzzleRaw.correctAnswer : puzzleRaw.answer,
            explanation: puzzleRaw.explanation || "This answer is derived using standard micro/macro equilibrium models, utility functions, or econometric formulas.",
            level: challenge?.level || "Advanced Undergrad",
            id: currentPuzzleIdx + 1
          }
        : puzzleRaw;

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
        if (questionsAnswered + 1 >= totalQuestions) {
            setIsSessionComplete(true);
            if (isRealChallenge && user && challenge) {
                // Save the completion attempt to Firestore so they don't have to repeat it
                saveDailyChallengeAttempt({
                    userId: user.uid,
                    userDisplayName: profile?.displayName || user.email || 'Anonymous Scholar',
                    challengeId: challenge.id!,
                    challengeTitle: challenge.title,
                    score: score,
                    questionsCount: totalQuestions,
                    correctAnswers: score / 10,
                    answers: {},
                    completedAt: new Date()
                });
            }
        } else {
            setQuestionsAnswered(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
            setCurrentPuzzleIdx((prev) => (prev + 1) % activePool.length);
        }
    };

    if (loadingChallenge || activePool.length === 0) {
        return (
            <div className="min-h-screen bg-surface dark:bg-surface-container flex flex-col items-center justify-center p-4">
                <Loader2 className="animate-spin text-primary mb-3" size={40} />
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Syncing Daily Challenge...</p>
            </div>
        );
    }

    if (alreadyCompleted) {
        return (
            <div className="min-h-screen bg-surface dark:bg-surface-container pb-24 font-['Hanken_Grotesk'] text-on-surface">
                <header className="w-full sticky top-0 z-40 bg-surface dark:bg-surface-container shadow-sm flex items-center px-4 py-3 border-b border-outline-variant/30">
                    <button onClick={() => navigate('/dashboard')} className="p-2 mr-2 active:scale-95 transition-transform hover:bg-surface-container-high rounded-full text-on-surface-variant text-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex-1">
                        <h1 className="font-headline-sm font-bold tracking-tight">Challenge Already Completed</h1>
                    </div>
                </header>

                <main className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-8">
                    <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-outline-variant/50 text-center relative overflow-hidden">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-inner">
                            <CheckCircle size={40} />
                        </div>
                        
                        <h2 className="text-3xl font-bold font-headline-md text-emerald-600 dark:text-emerald-400 mb-2">
                            Challenge Completed!
                        </h2>
                        <p className="text-on-surface-variant mb-6 text-lg">
                            You have already answered today's Daily Challenge "<strong>{alreadyCompleted.challengeTitle}</strong>". Great job!
                        </p>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                          <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Your Score</span>
                            <span className="text-2xl font-black text-on-surface">{alreadyCompleted.score} XP</span>
                          </div>
                          <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Accuracy</span>
                            <span className="text-2xl font-black text-on-surface">
                              {Math.round((alreadyCompleted.correctAnswers / alreadyCompleted.questionsCount) * 100)}%
                            </span>
                          </div>
                        </div>

                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-primary text-on-primary px-10 py-4 rounded-xl font-label-lg font-bold shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
                        >
                            Return to Dashboard <ArrowRight size={18} />
                        </button>
                    </div>
                </main>
            </div>
        );
    }

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
                            {totalCorrect === totalQuestions ? 'Perfect Score, Scholar!' : totalCorrect >= totalQuestions / 2 ? 'Great Work, Scholar!' : 'Keep Practicing!'}
                        </h2>
                        <p className="text-on-surface-variant mb-10 text-lg">
                            {totalCorrect === totalQuestions 
                                ? 'You analyzed every single economic case study with absolute precision.' 
                                : 'You have successfully completed today\'s economic challenge.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                            <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500" /> Accuracy</span>
                                <span className="text-3xl font-black text-on-surface">{Math.round((totalCorrect / totalQuestions) * 100)}%</span>
                            </div>
                            <div className="bg-secondary-container/20 p-4 rounded-2xl border border-secondary/30 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1"><Zap size={14} className="text-secondary" /> Score</span>
                                <span className="text-3xl font-black text-secondary">{score} XP</span>
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
                            <div className="text-base md:text-lg text-on-surface leading-relaxed font-body-lg">
                                <MathText text={puzzle.scenario} />
                            </div>
                        </div>

                        <div className="mt-4 border-t border-outline-variant/30 pt-6">
                            <div className="text-lg font-bold font-headline-sm text-on-surface mb-6 flex items-start gap-2">
                                <span className="text-secondary opacity-70 shrink-0">Q.</span>
                                <span className="flex-1"><MathText text={puzzle.question} /></span>
                            </div>

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
                            <div className={`rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-lg border ${selectedOption === puzzle.answer ? 'bg-secondary-container/20 border-secondary/30' : 'bg-error-container/20 border-error/30'}`}>
                                <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center shadow-inner ${selectedOption === puzzle.answer ? 'bg-secondary text-secondary-on-container' : 'bg-error text-error-on-container'}`}>
                                    {selectedOption === puzzle.answer ? <Trophy size={28} /> : <TrendingUp size={28} className="rotate-180" />}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className={`text-xl font-bold mb-2 font-headline-sm ${selectedOption === puzzle.answer ? 'text-secondary-on-container dark:text-emerald-400' : 'text-error-on-container dark:text-error'}`}>
                                        {selectedOption === puzzle.answer ? 'Masterful Logic!' : 'Market Correction!'}
                                    </h3>
                                    <div className="text-on-surface-variant font-body-md leading-relaxed text-sm md:text-base mb-6">
                                        <strong className="text-on-surface">Economic Reasoning:</strong> <MathText text={puzzle.explanation} />
                                    </div>
                                    
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
