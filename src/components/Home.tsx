import React, { useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { SECONDARY_ROADMAP, UNDERGRADUATE_ROADMAP } from '../constants';

export const Home = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    const roadmap = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
    const progress = profile?.progress || {};
    const completedCount = Object.values(progress).filter(Boolean).length;
    const totalCount = roadmap.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setAnimatedPercentage(percentage);
        }, 100);
    }, [percentage]);

    const activeCourse = roadmap.find(t => !progress[t.id]) || roadmap[0];
    const completedCoursesForActive = activeCourse ? 0 : 0; // Simplified

    return (
        <div className="bg-background text-on-background min-h-screen pb-24 font-['Hanken_Grotesk']">
            {/* TopAppBar */}
            <header className="w-full sticky top-0 z-40 bg-surface dark:bg-surface-container-low shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex justify-between items-center px-grid-margin py-md">
                <div className="flex items-center gap-sm">
                    <div className="relative active:scale-95 duration-150 transition-transform">
                        <img 
                            className="w-10 h-10 rounded-full border-2 border-secondary-container object-cover" 
                            src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAfzyP_Cs1fhh76Mfc5oxxTt3jrhfEKTIVkLomLlMJBJ4TIAaYQPS6np0hqP8wrxcB1qINH4CNUHkMvoROAvbjvt6gfpx74WXh4bmyRkM37ZZ48f34cpZlJcCmjoVMdrqAfpUllVSB-bgB3UJeXEb67VNsF6PJqauhJ58sMxVa2vBCQpjWA3mCPWbm4Q9itUJ3PR_gzEYGkHOgtbfnFaK8KO136EOFmU0vJxE3Qywds1Bf8Wq-oYz073mppqPg5Lwzx6kYfvj7vt3M"} 
                            alt="User Avatar" 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-secondary-fixed-dim text-on-secondary-fixed text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                            {profile?.level === 'undergraduate' ? 'UG' : 'HS'}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-headline-md text-headline-md-mobile font-bold text-primary dark:text-secondary-fixed">EcoMastery</h1>
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
                        onClick={() => navigate('/study')}
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
                            <img className="w-10 h-10 rounded-full object-cover" src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuBwnLbWe-4qLSQ7ew6ZxdFhatOx3p1i5RF6JFskvQykoUnowvT2GHSs_KCr4BRtYBrsUTZ3AjKpNGv12dYGLVLyIaMGiK7mnBUdf5nOCcH9cb2LL72QgRUO-dTDarHd6K6ymumXzmvCDm1HV5uOw_wh7ZB5yMUaP0QVUc2bVHAj1EII-KwTMY77ROGdYIothxXAjIdeeeP9pCRuh1wfgac09E-771EtZ6woOWK0fgR4Z5Aw_nBeh22NMNHBDTzfk887uaDWLDanxXY"} alt="User" />
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
