import React, { useState } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { updateUserLevel } from '../firebase';
import { useRoadmap } from '../hooks/useRoadmap';

export const Dashboard = () => {
    const { user, profile, setProfile } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const level = profile?.level || 'secondary';
    const { roadmap } = useRoadmap(level);
    const progress = profile?.progress || {};

    const filteredRoadmap = roadmap.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const levelLabel = level === 'secondary-ss2' ? 'SS2' : (level === 'secondary-ss3' ? 'SS3' : (level === 'undergraduate' ? 'Undergraduate' : 'SS1'));
    const levelTitle = level === 'secondary-ss2' ? 'Economics SS2 Curriculum' : (level === 'secondary-ss3' ? 'Economics SS3 Curriculum' : (level === 'undergraduate' ? 'Undergraduate Economics' : 'Economics Curriculum'));
    const levelSubtitle = level === 'secondary-ss2' ? 'Advanced Senior Secondary School 2 WAEC/NECO curriculum.' : (level === 'secondary-ss3' ? 'Comprehensive Senior Secondary School 3 WAEC/NECO syllabus including comparative economics, human capital development, international trade, and public finance.' : (level === 'undergraduate' ? 'Advanced undergraduate level curriculum focusing on macro/micro theories and empirical analysis.' : 'This syllabus is designed to assess candidates’ knowledge of basic economic principles needed for rational decision making relating to individuals, businesses, government and society. Such knowledge is necessary in enhancing their appreciation of government economic policies, problems of implementation and how they impact on the economy. This will help candidates to understand that economics is not only an academic field of study but also a practical subject.'));

    return (
        <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24 font-['Hanken_Grotesk']">
            {/* TopAppBar */}
            <header className="bg-surface dark:bg-surface-container-low w-full sticky top-0 z-40 shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex justify-between items-center px-grid-margin py-md">
                <div 
                    onClick={() => {
                        setSearchQuery('');
                        navigate('/study');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="flex items-center gap-sm cursor-pointer group select-none active:scale-[0.98] transition-transform duration-100"
                    title="Home / Reset Curriculum"
                >
                    <div className="relative">
                        {user?.photoURL ? (
                            <img 
                                className="w-10 h-10 rounded-full border-2 border-secondary-container object-cover shrink-0" 
                                src={user.photoURL} 
                                alt="Profile"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full border-2 border-secondary-container bg-black text-white flex items-center justify-center font-bold text-lg shrink-0">
                                {profile?.displayName?.[0]?.toUpperCase() || 'S'}
                            </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {levelLabel}
                        </span>
                    </div>
                    <span className="font-headline-md text-headline-md-mobile font-bold text-primary dark:text-secondary-fixed group-hover:text-secondary transition-colors duration-150">EcoMastery</span>
                </div>
                <button className="flex items-center gap-xs px-md py-1.5 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors active:scale-95 duration-150">
                    <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>generating_tokens</span>
                    <span className="font-label-md text-label-md text-primary">{profile?.points || 0} pts</span>
                </button>
            </header>

            <main className="px-5 py-lg space-y-lg max-w-4xl mx-auto mt-4">
                {/* Search & Header */}
                <section className="space-y-md mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                        <div 
                            onClick={() => {
                                setSearchQuery('');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="cursor-pointer select-none group max-w-2xl"
                            title="Click to reset search and view all chapters"
                        >
                            <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface group-hover:text-secondary font-bold text-3xl mb-1 transition-colors duration-150">
                                {levelTitle}
                            </h1>
                            <p className="font-body-md text-on-surface-variant font-medium group-hover:text-secondary transition-colors duration-150 text-sm">
                                {levelSubtitle}
                            </p>
                        </div>
                        {level !== 'undergraduate' && (
                            <button 
                                onClick={() => navigate('/select-level')}
                                className="shrink-0 self-start md:self-center flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-full font-bold text-xs transition-all active:scale-[0.98] shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[16px] font-bold">school</span>
                                Switch Level
                            </button>
                        )}
                    </div>

                    <div className="relative group mt-6">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-outline">search</span>
                        </div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all shadow-sm" 
                            placeholder="Search topics, theories, or models..." 
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center">
                            <span className="material-symbols-outlined text-outline-variant">tune</span>
                        </div>
                    </div>
                </section>

                {/* Featured / Resume Last */}
                {!searchQuery && roadmap.length > 0 && (
                    <section className="relative overflow-hidden rounded-2xl p-lg bg-primary-container text-on-primary-fixed-variant shadow-xl mb-8 p-6">
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                            <img 
                                className="w-full h-full object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApgk7cDgqhljfw5k1Ryqn6sBCy8R4edA31YbGZJiVDaBf0srO4Nz0U94u6Pw-PXQFxlSxoMX_sYS9qbcr_RszYp_L5IW2oyEJ1pSNTIYnKEE0LEbnak8LtlpBRsjo4Txl63wyrXhIJ9BiJoCoMLZRP86cEzIsTg1kVxflUswrC7Z73etLLI54fMFZb0_HzLfn4p8sNJ-SezOOVifmqCUt9ZgrvgmZsixTn8IKgC1iemMsA_hz-dYv6XdI5wpy670-swwnUse5jKRk"
                                alt=""
                            />
                        </div>
                        <div className="relative z-10 space-y-md">
                            <div className="flex items-center gap-xs mb-4">
                                <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded uppercase tracking-wider">In Progress</span>
                            </div>
                            <div className="space-y-xs mb-6">
                                <h2 className="font-headline-md text-headline-md-mobile text-white text-2xl font-bold mb-1">{roadmap[0].title}</h2>
                                        <p className="font-body-md text-on-primary-container max-w-sm opacity-90 mb-3">{roadmap[0].description}</p>
                                        {roadmap[0].subtopics && roadmap[0].subtopics.length > 0 && (
                                            <div className="mt-2 text-white/90 max-w-xl">
                                                <div className="flex flex-wrap gap-2">
                                                    {roadmap[0].subtopics.map((sub, sIdx) => (
                                                        <span key={sIdx} className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full border border-white/10 font-medium">
                                                            {sub}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-md gap-4 pt-2">
                                        <button 
                                            onClick={() => navigate(`/study-guide/${roadmap[0].id}`)}
                                            className="px-6 py-3 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-xl hover:brightness-105 active:scale-95 transition-all">
                                            Resume Lesson
                                        </button>
                                        <div className="flex flex-col">
                                            <span className="font-label-sm text-label-sm text-white">0% Complete</span>
                                            <div className="w-24 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                                                <div className="h-full bg-secondary-fixed" style={{ width: '0%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Categories List */}
                        <section className="space-y-4 max-w-4xl mx-auto pb-12">
                            {filteredRoadmap.map((topic, index) => {
                                const isChCompleted = progress[topic.id];
                                
                                return (
                                    <button
                                        key={topic.id} 
                                        onClick={() => navigate(`/study-guide/${topic.id}`)}
                                        className="w-full text-left bg-[#0B1121] border border-slate-800/60 p-5 sm:p-6 rounded-2xl shadow-sm hover:border-slate-700 hover:bg-[#111827] hover:-translate-y-0.5 transition-all duration-200 group flex items-center justify-between"
                                    >
                                        <div className="flex-1 pr-4">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                                                    {level === "undergraduate" ? `Course ${index + 1}` : (topic.category || `Chapter ${index + 1}`)}
                                                </span>
                                                {isChCompleted && (
                                                    <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                        Completed
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-base sm:text-lg md:text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
                                                {topic.title}
                                            </h4>
                                            {topic.subtopics && topic.subtopics.length > 0 && (
                                                <div className="mt-3 text-slate-400 text-xs sm:text-sm line-clamp-1 border-t border-slate-800/50 pt-3">
                                                    {topic.subtopics.join(" • ")}
                                                </div>
                                            )}
                                        </div>
                                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/50 group-hover:bg-slate-700 transition-colors">
                                            <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-white transition-colors">arrow_forward_ios</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </section>
            </main>

        </div>
    );
};
