import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';
import { useAuth } from '../useAuth';

export const AppNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { user, profile } = useAuth();

    const isAdmin = profile?.role === 'admin' || user?.email === 'chukwuekudavid@gmail.com';

    const tabs = [
        { id: 'home', path: '/dashboard', label: 'Home', icon: 'home' },
        { id: 'study', path: '/study', label: 'Study', icon: 'menu_book' },
        { id: 'play', path: '/live', label: 'Play', icon: 'sports_esports' },
        { id: 'ranks', path: '/leaderboard', label: 'Ranks', icon: 'leaderboard' },
        { id: 'profile', path: '/profile', label: 'Profile', icon: 'person' },
    ];

    if (isAdmin) {
        tabs.push({ id: 'admin', path: '/admin', label: 'Admin', icon: 'admin_panel_settings' });
    }

    return (
        <>
            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full z-[100] bg-surface-container dark:bg-surface-container-lowest shadow-[0_-4px_12px_rgba(15,23,42,0.06)] flex justify-around items-center h-[72px] px-2 pb-safe border-t border-outline-variant/20 md:hidden text-on-surface-variant font-['Hanken_Grotesk']">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button key={tab.id} onClick={() => navigate(tab.path)} className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 duration-200 ${isActive ? 'bg-secondary-container text-on-secondary-container rounded-full px-5' : 'hover:text-secondary'}`}>
                            <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"}}>{tab.icon}</span>
                            <span className="font-label-sm text-[10px] mt-0.5 font-bold">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Desktop Navigation Rail */}
            <nav className="hidden md:flex flex-col items-center fixed left-0 top-0 h-screen w-[88px] z-[100] bg-surface-container dark:bg-surface-container-lowest shadow-[4px_0_12px_rgba(15,23,42,0.06)] py-8 border-r border-outline-variant/20 text-on-surface-variant font-['Hanken_Grotesk']">
                <div className="w-12 h-12 bg-primary group flex items-center justify-center rounded-2xl mb-8 shadow-lg cursor-pointer" onClick={() => navigate('/')}>
                    <span className="text-on-primary font-bold text-2xl group-hover:scale-110 transition-transform">E</span>
                </div>
                
                <div className="flex flex-col gap-6 flex-1 w-full items-center">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        return (
                            <button key={tab.id} onClick={() => navigate(tab.path)} className={`flex flex-col items-center justify-center w-full transition-all hover:text-secondary active:scale-95 duration-200 group`}>
                                <div className={`flex items-center justify-center w-14 h-8 rounded-full mb-1 transition-colors ${isActive ? 'bg-secondary-container text-on-secondary-container' : 'group-hover:bg-surface-container-highest'}`}>
                                    <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"}}>{tab.icon}</span>
                                </div>
                                <span className={`font-label-sm text-[11px] font-bold ${isActive ? 'text-on-surface' : ''}`}>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <button onClick={toggleDarkMode} className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-surface-container-highest transition-colors mt-auto">
                    <span className="material-symbols-outlined text-[24px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                </button>
            </nav>
        </>
    );
};
