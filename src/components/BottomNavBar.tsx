import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';
import { useAuth } from '../useAuth';
import { Home, BookOpen, Gamepad2, Trophy, User, ShieldCheck, Sun, Moon } from 'lucide-react';

export const AppNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { user, profile } = useAuth();

    const isAdmin = profile?.role === 'admin' || user?.email === 'chukwuekudavid@gmail.com';

    const tabs = [
        { id: 'home', path: '/', label: 'Home', Icon: Home },
        { id: 'study', path: '/study', label: 'Study', Icon: BookOpen },
        { id: 'play', path: '/live', label: 'Play', Icon: Gamepad2 },
        { id: 'ranks', path: '/leaderboard', label: 'Ranks', Icon: Trophy },
        { id: 'profile', path: '/profile', label: 'Profile', Icon: User },
    ];

    if (isAdmin) {
        tabs.push({ id: 'admin', path: '/admin', label: 'Admin', Icon: ShieldCheck });
    }

    return (
        <>
            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full z-[100] bg-white dark:bg-slate-900 shadow-[0_-4px_12px_rgba(15,23,42,0.1)] flex justify-around items-center h-[64px] px-2 pb-safe border-t border-slate-200 dark:border-slate-800 md:hidden text-slate-600 dark:text-slate-400 font-['Hanken_Grotesk']">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path || (tab.id === 'study' && (location.pathname.startsWith('/study-guide') || location.pathname === '/study' || location.pathname === '/dashboard'));
                    const IconComponent = tab.Icon;
                    return (
                        <button key={tab.id} onClick={() => navigate(tab.path)} className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 duration-200 ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'hover:text-emerald-500'}`}>
                            <IconComponent size={22} className={isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"} />
                            <span className="text-[10px] mt-1 font-bold">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Desktop Navigation Rail */}
            <nav className="hidden md:flex flex-col items-center fixed left-0 top-0 h-screen w-[88px] z-[100] bg-white dark:bg-slate-900 shadow-[4px_0_12px_rgba(15,23,42,0.06)] py-8 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-['Hanken_Grotesk']">
                <div className="w-12 h-12 bg-emerald-600 group flex items-center justify-center rounded-2xl mb-8 shadow-lg cursor-pointer" onClick={() => navigate('/')}>
                    <span className="text-white font-bold text-2xl group-hover:scale-110 transition-transform">E</span>
                </div>
                
                <div className="flex flex-col gap-6 flex-1 w-full items-center">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path || (tab.id === 'study' && (location.pathname.startsWith('/study-guide') || location.pathname === '/study' || location.pathname === '/dashboard'));
                        const IconComponent = tab.Icon;
                        return (
                            <button key={tab.id} onClick={() => navigate(tab.path)} className={`flex flex-col items-center justify-center w-full transition-all hover:text-emerald-600 active:scale-95 duration-200 group`}>
                                <div className={`flex items-center justify-center w-14 h-8 rounded-full mb-1 transition-colors ${isActive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}`}>
                                    <IconComponent size={20} />
                                </div>
                                <span className={`text-[11px] font-bold ${isActive ? 'text-slate-900 dark:text-white' : ''}`}>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <button onClick={toggleDarkMode} className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-auto text-slate-600 dark:text-slate-400">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </nav>
        </>
    );
};
