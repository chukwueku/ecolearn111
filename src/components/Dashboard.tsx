import React, { useState } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { SECONDARY_ROADMAP, UNDERGRADUATE_ROADMAP } from '../constants';

export const Dashboard = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const roadmap = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
    const progress = profile?.progress || {};

    const filteredRoadmap = roadmap.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24 font-['Hanken_Grotesk']">
            {/* TopAppBar */}
            <header className="bg-surface dark:bg-surface-container-low w-full sticky top-0 z-40 shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex justify-between items-center px-grid-margin py-md">
                <div className="flex items-center gap-sm">
                    <div className="relative">
                        <img 
                            className="w-10 h-10 rounded-full border-2 border-secondary-container object-cover" 
                            src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuA0IQ9QLALrQhU-R36iXLCf0mJ8TDlUnFvrAMwbVnkBWxV9zYtB2CrpLUDsmWrDG7mxuQRqJqliPuxbEaoL5pgHgNYVPtQcnpwpXAKonEqPIQbqzYg3lip5gn-DOhAKe77zrF2IeGaU_k0QWb6scJsn09iZbCKXvBFYiAR2UHw-QbHMepWijv_Jf43GtB_GH6iKXmILsnI40AGb0_w2aPkKtiglBvtjuNKJedGiY9VLHn_u03J0P6tK8V2Z2WDhGZZcvXZrlIvdrWw"} 
                            alt="Profile"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {profile?.level === 'undergraduate' ? 'UG' : 'HS'}
                        </span>
                    </div>
                    <span className="font-headline-md text-headline-md-mobile font-bold text-primary dark:text-secondary-fixed">EcoMastery</span>
                </div>
                <button className="flex items-center gap-xs px-md py-1.5 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors active:scale-95 duration-150">
                    <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>generating_tokens</span>
                    <span className="font-label-md text-label-md text-primary">{profile?.points || 0} pts</span>
                </button>
            </header>

            <main className="px-5 py-lg space-y-lg max-w-4xl mx-auto mt-4">
                {/* Search & Header */}
                <section className="space-y-md mb-8">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface font-bold text-3xl mb-1">Curriculum</h1>
                        <p className="font-body-md text-on-surface-variant">Master the market through focused study modules.</p>
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
                                <p className="font-body-md text-on-primary-container max-w-xs opacity-90">{roadmap[0].description}</p>
                            </div>
                            <div className="flex items-center gap-md gap-4">
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
                <section className="space-y-md">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-headline-md text-headline-md-mobile text-xl font-bold">Study Modules</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRoadmap.map((topic, index) => {
                            const isCompleted = progress[topic.id];
                            const icons = ['query_stats', 'public', 'extension', 'psychology'];
                            const backgrounds = ['bg-tertiary-fixed text-on-tertiary-fixed', 'bg-secondary-fixed-dim text-on-secondary-fixed-variant', 'bg-surface-container-highest text-on-primary-fixed-variant', 'bg-tertiary-fixed-dim text-on-tertiary-container'];
                            const icon = icons[index % icons.length];
                            const bg = backgrounds[index % backgrounds.length];
                            
                            return (
                                <div key={topic.id} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-xl ${bg}`}>
                                                <span className="material-symbols-outlined">{icon}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-label-sm text-label-sm text-outline capitalize">{topic.category}</span>
                                            </div>
                                        </div>
                                        <h4 className="font-headline-md text-primary font-bold text-lg mb-1">{topic.title}</h4>
                                        <p className="font-body-md text-on-surface-variant text-sm mb-4 line-clamp-2">{topic.description}</p>
                                    </div>
                                    <div>
                                        <div className="space-y-xs mb-4">
                                            <div className="flex justify-between font-label-sm text-label-sm mb-1 text-xs">
                                                <span>Progress</span>
                                                <span className={isCompleted ? "text-secondary font-bold" : "text-outline"}>{isCompleted ? '100%' : 'Not Started'}</span>
                                            </div>
                                            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                                <div className="h-full bg-secondary" style={{ width: isCompleted ? '100%' : '0%' }}></div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/study-guide/${topic.id}`)}
                                            className="w-full py-2.5 bg-surface-container-high text-primary font-bold rounded-lg group-hover:bg-secondary group-hover:text-white transition-colors flex items-center justify-center gap-2">
                                            <span>{isCompleted ? 'Review' : 'Start'}</span>
                                            <span className="material-symbols-outlined text-sm">{isCompleted ? 'arrow_forward' : 'play_arrow'}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>


        </div>
    );
};
