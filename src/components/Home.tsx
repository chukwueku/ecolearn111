import React, { useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import { useRoadmap } from '../hooks/useRoadmap';
import { getGlobalLeaderboardAndRank, UserProfile } from '../firebase';

export const Home = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authDefaultIsLogin, setAuthDefaultIsLogin] = useState(true);
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    const [globalLeaders, setGlobalLeaders] = useState<UserProfile[]>([]);
    const [userGlobalRank, setUserGlobalRank] = useState<number>(1);
    const [loadingLeaders, setLoadingLeaders] = useState<boolean>(true);

    const level = profile?.level || 'secondary';
    const { roadmap } = useRoadmap(level);
    const levelLabel = level === 'secondary-ss2' ? 'SS2' : (level === 'secondary-ss3' ? 'SS3' : (level === 'undergraduate' ? 'Undergraduate' : 'SS1'));
    const progress = profile?.progress || {};
    const completedCount = Object.values(progress).filter(Boolean).length;
    const totalCount = roadmap ? roadmap.length : 0;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedPercentage(percentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    useEffect(() => {
        if (profile?.level === 'pending') {
            navigate('/select-level', { replace: true });
        }
    }, [profile, navigate]);

    useEffect(() => {
        let isMounted = true;
        const fetchRanks = async () => {
            try {
                const res = await getGlobalLeaderboardAndRank(user?.uid);
                if (isMounted) {
                    setGlobalLeaders(res.topUsers);
                    setUserGlobalRank(res.userRank);
                }
            } catch (err) {
                console.error("Failed to fetch global ranks", err);
            } finally {
                if (isMounted) setLoadingLeaders(false);
            }
        };
        fetchRanks();
        return () => { isMounted = false; };
    }, [user?.uid, profile?.points]);

    if (user && !profile) {
        return (
            <div className="flex bg-surface text-on-surface w-full min-h-screen items-center justify-center font-['Hanken_Grotesk']">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                    <p className="font-semibold text-on-surface/60 opacity-80">Loading your account...</p>
                </div>
            </div>
        );
    }

    if (profile?.level === 'pending') {
        return (
            <div className="flex bg-surface text-on-surface w-full min-h-screen items-center justify-center font-['Hanken_Grotesk']">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                    <p className="font-semibold text-on-surface/60 opacity-80">Preparing your academy...</p>
                </div>
            </div>
        );
    }

    const activeCourse = (roadmap || []).find(t => !progress[t.id]) || (roadmap || [])[0];
    const completedCoursesForActive = activeCourse ? 0 : 0; // Simplified

    if (!user) {
        return (
            <div className="bg-surface text-on-surface min-h-screen font-['Hanken_Grotesk'] overflow-x-hidden">
                {/* Header Navbar */}
                <header className="w-full bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-xs">
                        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-2xl shadow-lg">
                            <span className="text-on-primary font-bold text-xl">E</span>
                        </div>
                        <h1 className="text-2xl font-bold text-primary tracking-tight ml-2">EcoMastery</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => { setAuthDefaultIsLogin(false); setIsAuthOpen(true); }}
                            className="bg-primary hover:bg-primary/95 text-on-primary px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/15 hover:shadow-primary/25 active:scale-95 transition-all text-sm"
                        >
                            Get Started
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 max-w-xl text-left">
                        <div className="inline-flex items-center gap-2 bg-secondary-container/25 text-primary px-4 py-1.5 rounded-full font-bold text-xs tracking-wider border border-secondary-container/20">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>COMPETITIVE MULTIPLAYER MACROECONOMICS</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-primary tracking-tight leading-tight">
                            Master the <br/>
                            Economics <span className="text-secondary text-emerald-600 dark:text-emerald-400">Curriculums.</span>
                        </h2>
                        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-medium">
                            EcoMastery is an interactive Economics training arena. Study structured chapters for SS1, SS2, or University levels, solve daily policy crises, and revise with real-time multiplayer duels.
                        </p>
                        <div className="pt-4">
                            <button 
                                onClick={() => { setAuthDefaultIsLogin(false); setIsAuthOpen(true); }}
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">rocket_launch</span>
                                Get Started
                            </button>
                        </div>
                        <div className="flex items-center gap-6 pt-6 border-t border-outline-variant/25">
                            <div>
                                <h4 className="text-2xl font-black text-primary">5,000+</h4>
                                <p className="text-xs font-bold text-outline tracking-wider uppercase mt-1">Scholars Active</p>
                            </div>
                            <div className="h-8 w-[1px] bg-outline-variant/30"></div>
                            <div>
                                <h4 className="text-2xl font-black text-primary">120+</h4>
                                <p className="text-xs font-bold text-outline tracking-wider uppercase mt-1">Economic Quizzes</p>
                            </div>
                            <div className="h-8 w-[1px] bg-outline-variant/30"></div>
                            <div>
                                <h4 className="text-2xl font-black text-primary">100%</h4>
                                <p className="text-xs font-bold text-outline tracking-wider uppercase mt-1">Syllabus Covered</p>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Showcase Grid */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-[2.5rem] blur-3xl pointer-events-none -z-10" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1 */}
                            <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] shadow-sm hover:shadow-md transition-all space-y-4">
                                <div className="p-3 bg-secondary-container/20 text-secondary w-fit rounded-2xl">
                                    <span className="material-symbols-outlined text-2xl">sports_esports</span>
                                </div>
                                <h3 className="text-lg font-bold text-primary">Arena PvP Duels</h3>
                                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                                    Challenge other students in real-time GDP prediction duels under timed market pressures.
                                </p>
                            </div>
                            {/* Card 2 */}
                            <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] shadow-sm hover:shadow-md transition-all space-y-4">
                                <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit rounded-2xl">
                                    <span className="material-symbols-outlined text-2xl">menu_book</span>
                                </div>
                                <h3 className="text-lg font-bold text-primary">Active Roadmaps</h3>
                                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                                    Study tailored Curriculums for Senior Secondary (SS1, SS2, and SS3) Economics.
                                </p>
                            </div>
                            {/* Card 3 */}
                            <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] shadow-sm hover:shadow-md transition-all space-y-4">
                                <div className="p-3 bg-amber-500/10 text-amber-500 w-fit rounded-2xl">
                                    <span className="material-symbols-outlined text-2xl">extension</span>
                                </div>
                                <h3 className="text-lg font-bold text-primary">Daily Puzzles</h3>
                                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                                    Solve tactical scenarios like surprise inflation surges and interest rate hikes with direct policy models.
                                </p>
                            </div>
                            {/* Card 4 */}
                            <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] shadow-sm hover:shadow-md transition-all space-y-4">
                                <div className="p-3 bg-rose-500/10 text-rose-500 w-fit rounded-2xl">
                                    <span className="material-symbols-outlined text-2xl">leaderboard</span>
                                </div>
                                <h3 className="text-lg font-bold text-primary">Global Rankings</h3>
                                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                                    Earn Mastery Points by completing modules and winning duels to climb the Diamond and Gold leagues.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="w-full bg-surface-container-low border-t border-outline-variant/10 py-12 mt-16 text-center text-xs text-outline font-bold tracking-widest uppercase">
                    EcoMastery Arena © 2026 • Real-Time Educational Game-Theory
                </footer>

                {/* Auth Screen Modal */}
                <AuthModal 
                    isOpen={isAuthOpen} 
                    onClose={() => setIsAuthOpen(false)} 
                    defaultIsLogin={authDefaultIsLogin} 
                />
            </div>
        );
    }

    return (
        <div className="bg-background text-on-background min-h-screen pb-24 font-['Hanken_Grotesk']">
            {/* TopAppBar */}
            <header className="w-full sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center px-4 sm:px-6 py-3">
                <div onClick={() => navigate('/study')} className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative active:scale-95 duration-150 transition-transform">
                        <img 
                            className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover" 
                            src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAfzyP_Cs1fhh76Mfc5oxxTt3jrhfEKTIVkLomLlMJBJ4TIAaYQPS6np0hqP8wrxcB1qINH4CNUHkMvoROAvbjvt6gfpx74WXh4bmyRkM37ZZ48f34cpZlJcCmjoVMdrqAfpUllVSB-bgB3UJeXEb67VNsF6PJqauhJ58sMxVa2vBCQpjWA3mCPWbm4Q9itUJ3PR_gzEYGkHOgtbfnFaK8KO136EOFmU0vJxE3Qywds1Bf8Wq-oYz073mppqPg5Lwzx6kYfvj7vt3M"} 
                            alt="User Avatar" 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm uppercase tracking-wider">
                            {levelLabel}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">EcoMastery</h1>
                        <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{profile?.displayName?.split(' ')[0] || 'Scholar'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 duration-150 shadow-sm">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>
                        monetization_on
                    </span>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{profile?.points || 0} pts</span>
                </div>
            </header>

            <main className="px-4 sm:px-6 mt-4 space-y-6 max-w-4xl mx-auto py-4">
                {/* Hero Section: Quick Match */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 md:p-8 shadow-xl text-white mb-6 border border-slate-800">
                    <div className="absolute inset-0 opacity-25 pointer-events-none">
                        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500 rounded-full blur-3xl"></div>
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">Ready for Battle?</h2>
                        <p className="text-slate-300 text-sm font-medium mb-6 opacity-90 leading-relaxed">Compete with rivals in Real-Time GDP Prediction challenges.</p>
                        <button 
                            onClick={() => navigate('/live')}
                            className="w-full py-3.5 bg-emerald-500 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                            Quick Match
                        </button>
                    </div>
                </section>

                {/* Bento Grid: Progress & News */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Study Progress Card */}
                    <div 
                        onClick={() => {
                            const defaultChapters: Record<string, string> = {
                                'secondary': 'ss1-ch1',
                                'secondary-ss2': 'ss2-ch1',
                                'secondary-ss3': 'ug-ch1',
                                'undergraduate': 'ug-micro'
                            };
                            const defaultId = defaultChapters[level] || 'ss1-ch1';
                            navigate(activeCourse ? `/study-guide/${activeCourse.id}` : `/study-guide/${defaultId}`);
                        }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-2xl">menu_book</span>
                                </div>
                                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider">Active Course</span>
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-extrabold text-lg mb-1">{activeCourse?.category || 'Economics'}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-6">{activeCourse?.title || 'Start Learning'}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 capitalize">{percentage}% complete</span>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{completedCount}/{totalCount} lessons</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                <div 
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${animatedPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Daily Challenge Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between min-h-[220px]">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-2">
                                <span className="material-symbols-outlined text-[18px]">emergency</span>
                                <span>DAILY CHALLENGE</span>
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-extrabold text-lg mb-1">The Inflation Spike</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">How would you adjust interest rates to counter a 4% surprise in CPI?</p>
                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <img className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUr1WfUKHsKxxyqCD6DWj0EwzyN0Ywktrhg4VFdxIdGl2knqLxqQtWH1VHvQWFL6pdcFS_6tKFwjB9PCWuBS7cAb-IvJID7M2XSGQO6OqrjHsy6ctWCTPtDcOpFiyp5iIfkWT_oOHlbo59fwQVlR2v_qzw922T7y2GZB1ceT8yNmxeDI1jkHdfu4phLnU-9KklFBgss3ueE12Tv4py2d4IfnvIOE7sMWTreE6DB-mfgzqaBCnMd-UiYG9tL4miYqjTSl-CXbzsa9w" alt="User" />
                                    <img className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbP4uecKU10vXLD2whhVAcli3ojWMzwQe7gn1PpoLMlAWxX6xMLRdFw4LKRQ6yoHe2bKAIf5CZTpxpxQcaTMv4XW2mFY-C48Tv1HzJOrMBUHmjiRPuKJmQiXhnTiwCSiCRkp_q9EYWhHtEUO626gJYfRNWbCEdcHp2vILn_JliC6GJf5TrqdCY4Dlm4TnW1pP-YX3_bwrUqiQzlj4way0E86rniiK8HlSomUHC5dIC1wUKtLc_igkdL1jBUdxZVOVeH4R8tiaT730" alt="User" />
                                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px] font-black border-2 border-white dark:border-slate-900">+42</div>
                                </div>
                                <button 
                                    onClick={() => navigate('/daily-puzzle')}
                                    className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-xl font-extrabold text-sm shadow-sm transition-all active:scale-95">
                                    Solve Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Snapshot */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Global Ranks</h3>
                        <span onClick={() => navigate('/leaderboard')} className="text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline font-extrabold text-sm">View All</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loadingLeaders ? (
                            <div className="p-6 text-center text-slate-400 font-medium text-sm flex items-center justify-center gap-2 bg-white dark:bg-slate-900">
                                <span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>
                                Loading real ranks...
                            </div>
                        ) : globalLeaders.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400 font-medium text-sm bg-white dark:bg-slate-900">
                                No registered scholars yet. Be the first on the leaderboard!
                            </div>
                        ) : (
                            <>
                                {globalLeaders.slice(0, 3).map((leader, index) => {
                                    const isCurrentUser = leader.uid === user?.uid;
                                    const points = leader.points || 0;
                                    const league = points >= 3000 ? 'Keynes League' : 'Eco Titan League';
                                    const rankNum = index + 1;

                                    return (
                                        <div 
                                            key={leader.uid || index}
                                            className={`flex items-center gap-4 px-4 py-3.5 transition-colors ${
                                                isCurrentUser 
                                                    ? 'bg-emerald-50/90 dark:bg-emerald-950/50 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60' 
                                                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <span className={`w-6 font-black text-center text-sm ${rankNum === 1 ? 'text-amber-500' : rankNum === 2 ? 'text-slate-400' : 'text-amber-700 dark:text-amber-500'}`}>
                                                {rankNum}
                                            </span>
                                            {leader.photoURL ? (
                                                <img className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700" src={leader.photoURL} alt={leader.displayName || 'User'} />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-black text-base shrink-0 uppercase border border-slate-300 dark:border-slate-700">
                                                    {(leader.displayName || 'S')[0]}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-900 dark:text-white font-bold text-sm truncate">
                                                    {isCurrentUser 
                                                        ? `You (${profile?.displayName?.split(' ')[0] || leader.displayName?.split(' ')[0] || 'Scholar'})` 
                                                        : (leader.displayName || 'Scholar')}
                                                </p>
                                                <p className={`text-xs truncate ${isCurrentUser ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>
                                                    {league}
                                                </p>
                                            </div>
                                            <span className="text-slate-900 dark:text-white font-extrabold text-sm shrink-0">
                                                {points.toLocaleString()} <span className="text-xs text-slate-400 font-medium">pts</span>
                                            </span>
                                        </div>
                                    );
                                })}

                                {/* If logged-in user is not in top 3, show user's position row */}
                                {userGlobalRank > 3 && (
                                    <div className="flex items-center gap-4 px-4 py-3.5 bg-emerald-50/90 dark:bg-emerald-950/50 border-t-2 border-emerald-500/30">
                                        <span className="w-6 font-black text-emerald-700 dark:text-emerald-400 text-center text-sm">
                                            {userGlobalRank}
                                        </span>
                                        {user?.photoURL ? (
                                            <img className="w-10 h-10 rounded-full object-cover shrink-0 border border-emerald-300 dark:border-emerald-700" src={user.photoURL} alt="User" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-base shrink-0 uppercase shadow-sm">
                                                {(profile?.displayName || 'S')[0]}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-900 dark:text-white font-bold text-sm truncate">
                                                You ({profile?.displayName?.split(' ')[0] || 'Scholar'})
                                            </p>
                                            <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-xs truncate">
                                                {(profile?.points || 0) >= 3000 ? 'Keynes League' : 'Eco Titan League'}
                                            </p>
                                        </div>
                                        <span className="text-slate-900 dark:text-white font-extrabold text-sm shrink-0">
                                            {(profile?.points || 0).toLocaleString()} <span className="text-xs text-slate-400 font-medium">pts</span>
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>


        </div>
    );
};
