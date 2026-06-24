import React, { useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { SECONDARY_ROADMAP, SECONDARY_SS2_ROADMAP, UNDERGRADUATE_ROADMAP } from '../constants';
import { AuthModal } from './AuthModal';

export const Home = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authDefaultIsLogin, setAuthDefaultIsLogin] = useState(true);
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    const level = profile?.level || 'secondary';
    const roadmap = level === 'secondary-ss2' ? SECONDARY_SS2_ROADMAP : (level === 'undergraduate' ? UNDERGRADUATE_ROADMAP : SECONDARY_ROADMAP);
    const levelLabel = level === 'secondary-ss2' ? 'SS2' : (level === 'undergraduate' ? 'SS3' : 'SS1');
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
            <header className="w-full sticky top-0 z-40 bg-surface dark:bg-surface-container-low shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex justify-between items-center px-grid-margin py-md">
                <div onClick={() => navigate('/study')} className="flex items-center gap-sm cursor-pointer group select-none">
                    <div className="relative active:scale-95 duration-150 transition-transform">
                        <img 
                            className="w-10 h-10 rounded-full border-2 border-secondary-container object-cover" 
                            src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAfzyP_Cs1fhh76Mfc5oxxTt3jrhfEKTIVkLomLlMJBJ4TIAaYQPS6np0hqP8wrxcB1qINH4CNUHkMvoROAvbjvt6gfpx74WXh4bmyRkM37ZZ48f34cpZlJcCmjoVMdrqAfpUllVSB-bgB3UJeXEb67VNsF6PJqauhJ58sMxVa2vBCQpjWA3mCPWbm4Q9itUJ3PR_gzEYGkHOgtbfnFaK8KO136EOFmU0vJxE3Qywds1Bf8Wq-oYz073mppqPg5Lwzx6kYfvj7vt3M"} 
                            alt="User Avatar" 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-secondary-fixed-dim text-on-secondary-fixed text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                            {levelLabel}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-headline-md text-headline-md-mobile font-bold text-primary dark:text-secondary-fixed group-hover:text-secondary transition-colors animate-pulse">EcoMastery</h1>
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{profile?.displayName?.split(' ')[0] || 'Scholar'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-xs bg-surface-container-high px-sm py-1.5 rounded-full transition-colors hover:bg-surface-container-highest active:scale-95 duration-150">
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>
                        monetization_on
                    </span>
                    <span className="font-label-md text-label-md text-primary">{profile?.points || 0} pts</span>
                </div>
            </header>

            <main className="px-5 mt-lg space-y-lg max-w-4xl mx-auto py-8">
                {/* Hero Section: Quick Match */}
                <section className="relative overflow-hidden rounded-xl bg-primary-container p-6 md:p-8 shadow-xl group mb-6">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute -right-10 -top-10 w-48 h-48 bg-secondary rounded-full blur-3xl"></div>
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-primary mb-1 text-2xl font-bold">Ready for Battle?</h2>
                        <p className="font-body-md text-body-md text-on-primary-container mb-6 opacity-90">Compete with rivals in Real-Time GDP Prediction challenges.</p>
                        <button 
                            onClick={() => navigate('/live')}
                            className="w-full py-4 bg-secondary-container text-on-secondary-container font-headline-md text-headline-md font-bold rounded-xl shadow-lg hover:bg-secondary-fixed transition-all active:scale-95 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
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
                                'undergraduate': 'ug-ch1'
                            };
                            const defaultId = defaultChapters[level] || 'ss1-ch1';
                            navigate(activeCourse ? `/study-guide/${activeCourse.id}` : `/study-guide/${defaultId}`);
                        }}
                        className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-secondary-container/30 p-2 rounded-lg">
                                    <span className="material-symbols-outlined text-secondary">menu_book</span>
                                </div>
                                <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2 py-0.5 rounded-full font-bold">Active Course</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md-mobile text-primary mb-1 font-bold text-lg">{activeCourse?.category || 'Economics'}</h3>
                            <p className="font-label-md text-label-md text-on-surface-variant mb-6">{activeCourse?.title || 'Start Learning'}</p>
                        </div>
                        <div className="space-y-sm">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-label-md text-label-md text-on-surface capitalize font-bold">{percentage}% complete</span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant">{completedCount}/{totalCount} lessons</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-secondary shadow-[0_0_20px_rgba(0,108,73,0.15)] rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${animatedPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Daily Challenge Card */}
                    <div className="relative overflow-hidden rounded-xl bg-surface-container p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)] border border-outline-variant/30 flex flex-col min-h-[220px]">
                        <img 
                            className="absolute inset-0 w-full h-full object-cover opacity-10" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnkUkTeJ3ufPnQbSSbEIhCrCfNs9iTiBHDTbRQMNXv4EPsrsx7qE22rhzrprouLfcgUmowsHWK4cPX9wHgguqB30vlfc8Csc88Dw_Q6EwbsTZmX_eQlmc2IRwf_ltVGO-rcF7ootZUhH26LOW93Gg3d9P8I0DzsFycnhjRKrjTio6EFiV1ul1cpkVU4TLYQ6h7ZyYcTKdngzoLeJSu68aRO54Mty2TdSMZM0QQqQghFivCNZH5nMWtSYOy2x18Fw0jcdAgpIpzOjQ" 
                            alt="" 
                        />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-1 text-error font-label-md text-label-md mb-2 font-bold">
                                <span className="material-symbols-outlined text-[18px]">emergency</span>
                                <span>DAILY CHALLENGE</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md-mobile text-primary mb-2 font-bold text-lg">The Inflation Spike</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2 text-sm">How would you adjust interest rates to counter a 4% surprise in CPI?</p>
                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <img className="w-6 h-6 rounded-full border border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUr1WfUKHsKxxyqCD6DWj0EwzyN0Ywktrhg4VFdxIdGl2knqLxqQtWH1VHvQWFL6pdcFS_6tKFwjB9PCWuBS7cAb-IvJID7M2XSGQO6OqrjHsy6ctWCTPtDcOpFiyp5iIfkWT_oOHlbo59fwQVlR2v_qzw922T7y2GZB1ceT8yNmxeDI1jkHdfu4phLnU-9KklFBgss3ueE12Tv4py2d4IfnvIOE7sMWTreE6DB-mfgzqaBCnMd-UiYG9tL4miYqjTSl-CXbzsa9w" alt="User" />
                                    <img className="w-6 h-6 rounded-full border border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbP4uecKU10vXLD2whhVAcli3ojWMzwQe7gn1PpoLMlAWxX6xMLRdFw4LKRQ6yoHe2bKAIf5CZTpxpxQcaTMv4XW2mFY-C48Tv1HzJOrMBUHmjiRPuKJmQiXhnTiwCSiCRkp_q9EYWhHtEUO626gJYfRNWbCEdcHp2vILn_JliC6GJf5TrqdCY4Dlm4TnW1pP-YX3_bwrUqiQzlj4way0E86rniiK8HlSomUHC5dIC1wUKtLc_igkdL1jBUdxZVOVeH4R8tiaT730" alt="User" />
                                    <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-[8px] font-bold border border-surface">+42</div>
                                </div>
                                <button 
                                    onClick={() => navigate('/daily-puzzle')}
                                    className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md font-bold hover:bg-primary/90 active:scale-95 transition-all text-sm">
                                    Solve Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Snapshot */}
                <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.06)] overflow-hidden">
                    <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-white dark:bg-slate-900">
                        <h3 className="font-headline-md text-headline-md-mobile text-primary font-bold text-lg">Global Ranks</h3>
                        <span onClick={() => navigate('/leaderboard')} className="font-label-md text-label-md text-secondary cursor-pointer hover:underline font-bold text-sm">View All</span>
                    </div>
                    <div className="divide-y divide-outline-variant/10">
                        {/* Rank 1 */}
                        <div className="flex items-center gap-4 px-4 py-3 hover:bg-surface-container-low transition-colors bg-white dark:bg-slate-900">
                            <span className="w-6 font-bold text-secondary-container-on text-center font-bold">1</span>
                            <img className="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFikOaSazV4rrXe9HRuL57SS_JBiCggGAtI6pE8wq5xnnTBlg7JjcBuTNprXisifOg_Wv1UzqyU8pq-1-MnIFUZfELRygXLSYxNMImqx1GXbm0jWxD-cBzM1yl7H5MgjYqiR_zkkMhC8_qs0mMOoPVDx8MyPS8PKNwJGyCvlqJRDHqrExz2YAy9UEDT9awsEl0lRHSy9XAPSkrmTX46xgyUK-wTBrbEaA0oodZI-ZJYzmz-yNxgIv78pr3lVovN4vnTPeQ5g_qpvw" alt="Sophia" />
                            <div className="flex-1">
                                <p className="font-label-md text-label-md text-on-surface font-bold text-sm">Sophia Chen</p>
                                <p className="font-label-sm text-label-sm text-on-surface-variant text-xs">Diamond League</p>
                            </div>
                            <span className="font-label-md text-label-md font-bold text-primary font-bold">4,820</span>
                        </div>
                        {/* Rank 2 */}
                        <div className="flex items-center gap-4 px-4 py-3 hover:bg-surface-container-low transition-colors bg-white dark:bg-slate-900">
                            <span className="w-6 font-bold text-on-surface-variant text-center font-bold">2</span>
                            <img className="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpqXMLbUWHt7se78wEwhtqByVqiPGqRiFr46n0Y7UTFuk7I7t1ineNR2YYGEbzSzLK00ZC_2HsfdQHf_-7Sss1X8CPNrDff7ak0_1xl7zx-K6T2U63WHRCehVDELdXmYxmUm7g2I0kbm1n09Ysse2OcfvWO94kkGyHha5Gm7dJGk9QpHml4MOZ2gDJaU6hYIxcLFXOYN6M_IALpApHyK7YsAT2DcKSOGjn7dgBrxQQZH71cXSYgLW8v8F0G7rHVmjviW_lmsJnqBE" alt="Marcus" />
                            <div className="flex-1">
                                <p className="font-label-md text-label-md text-on-surface font-bold text-sm">Marcus Thorne</p>
                                <p className="font-label-sm text-label-sm text-on-surface-variant text-xs">Gold League</p>
                            </div>
                            <span className="font-label-md text-label-md font-bold text-primary font-bold">4,150</span>
                        </div>
                        {/* User's Position */}
                        <div className="flex items-center gap-4 px-4 py-3 bg-secondary-container/20">
                            <span className="w-6 font-bold text-secondary text-center">12</span>
                            {user?.photoURL ? (
                                <img className="w-10 h-10 rounded-full object-cover shrink-0" src={user.photoURL} alt="User" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shrink-0">
                                    {profile?.displayName?.[0]?.toUpperCase() || 'S'}
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-label-md text-label-md text-on-surface font-bold text-sm">You ({profile?.displayName?.split(' ')[0] || 'Scholar'})</p>
                                <p className="font-label-sm text-label-sm text-secondary font-semibold text-xs">Gold League</p>
                            </div>
                            <span className="font-label-md text-label-md font-bold text-primary font-bold">{profile?.points || 0}</span>
                        </div>
                    </div>
                </section>
            </main>


        </div>
    );
};
