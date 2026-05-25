import React, { useState } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { logout, updateUserLevel } from '../firebase';
import { useDarkMode } from '../DarkModeContext';

export const Profile = () => {
    const { user, profile, setProfile } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // Fallback counts or real data calculation
    const progress = profile?.progress || {};
    const completedCount = Object.values(progress).filter(Boolean).length;
    const wins = 0;

    const handleSwitchLevel = async () => {
        if (!user || !profile) return;
        const newLevel = profile.level === 'secondary' ? 'undergraduate' : 'secondary';
        
        // Let's assume a native confirm is okay for this prototype
        if (window.confirm(`Switch to ${newLevel} level roadmap? Your progress in the current level will be saved.`)) {
            await updateUserLevel(user.uid, newLevel);
            setProfile({ ...profile, level: newLevel });
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        navigate('/');
    };

    return (
        <div className="bg-background text-on-background min-h-screen pb-24 font-['Hanken_Grotesk']">
            {/* TopAppBar */}
            <header className="w-full sticky top-0 z-40 bg-surface dark:bg-surface-container-low shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex justify-between items-center px-grid-margin py-md">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-container active:scale-95 transition-all text-on-surface">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-headline-md text-primary font-bold">Profile</h1>
                <div className="w-10"></div> {/* Spacer to align title center */}
            </header>

            <main className="px-grid-margin mt-lg space-y-6 max-w-4xl mx-auto py-8">
                
                {/* Profile Header */}
                <section className="flex flex-col items-center bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.04)] border border-outline-variant/20">
                    <div className="relative mb-4">
                        <img 
                            className="w-24 h-24 rounded-full border-4 border-secondary-container object-cover" 
                            src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAfzyP_Cs1fhh76Mfc5oxxTt3jrhfEKTIVkLomLlMJBJ4TIAaYQPS6np0hqP8wrxcB1qINH4CNUHkMvoROAvbjvt6gfpx74WXh4bmyRkM37ZZ48f34cpZlJcCmjoVMdrqAfpUllVSB-bgB3UJeXEb67VNsF6PJqauhJ58sMxVa2vBCQpjWA3mCPWbm4Q9itUJ3PR_gzEYGkHOgtbfnFaK8KO136EOFmU0vJxE3Qywds1Bf8Wq-oYz073mppqPg5Lwzx6kYfvj7vt3M"} 
                            alt="User Avatar" 
                        />
                        <div className="absolute bottom-0 right-0 bg-secondary text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md border-2 border-white">
                            {profile?.level === 'undergraduate' ? 'UG' : 'HS'}
                        </div>
                    </div>
                    <h2 className="font-headline-lg text-primary text-2xl font-bold mb-1">{profile?.displayName || 'Scholar'}</h2>
                    <p className="font-body-md text-on-surface-variant font-medium">{user?.email}</p>
                    
                    <div className="flex gap-4 mt-6 w-full">
                        <div className="flex-1 bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-secondary mb-1">generating_tokens</span>
                            <span className="font-label-sm text-outline uppercase tracking-wider text-[10px]">Points</span>
                            <span className="font-headline-md font-bold text-primary">{profile?.points || 0}</span>
                        </div>
                        <div className="flex-1 bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-tertiary-container mb-1">workspace_premium</span>
                            <span className="font-label-sm text-outline uppercase tracking-wider text-[10px]">Completed</span>
                            <span className="font-headline-md font-bold text-primary">{completedCount}</span>
                        </div>
                        <div className="flex-1 bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-error mb-1">emoji_events</span>
                            <span className="font-label-sm text-outline uppercase tracking-wider text-[10px]">Wins</span>
                            <span className="font-headline-md font-bold text-primary">{wins}</span>
                        </div>
                    </div>
                </section>

                {/* Settings Section */}
                <section className="space-y-4">
                    <h3 className="font-label-md text-on-surface-variant uppercase tracking-widest pl-2 font-bold text-xs">Settings</h3>
                    
                    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.04)] border border-outline-variant/20 overflow-hidden divide-y divide-outline-variant/10">
                        
                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer" onClick={toggleDarkMode}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                    <span className="material-symbols-outlined">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
                                </div>
                                <div>
                                    <p className="font-label-md font-bold text-primary">Theme Appearance</p>
                                    <p className="font-label-sm text-on-surface-variant">Toggle dark / light mode</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-outline">chevron_right</span>
                        </div>

                        {/* Switch Level */}
                        <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer" onClick={handleSwitchLevel}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <div>
                                    <p className="font-label-md font-bold text-primary">Academic Level</p>
                                    <p className="font-label-sm text-on-surface-variant capitalize">Current: {profile?.level}</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-outline">sync</span>
                        </div>

                        {/* Profile Settings */}
                        <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => alert('Account settings coming soon!')}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                    <span className="material-symbols-outlined">manage_accounts</span>
                                </div>
                                <div>
                                    <p className="font-label-md font-bold text-primary">Account Details</p>
                                    <p className="font-label-sm text-on-surface-variant">Manage your profile info</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-outline">chevron_right</span>
                        </div>

                        {/* Admin Link */}
                        {(profile?.role === 'admin' || user?.email === 'chukwuekudavid@gmail.com') && (
                            <div className="flex items-center justify-between p-4 bg-sky-50 dark:bg-sky-950/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors cursor-pointer" onClick={() => navigate('/admin')}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                        <span className="material-symbols-outlined">admin_panel_settings</span>
                                    </div>
                                    <div>
                                        <p className="font-label-md font-bold text-sky-800 dark:text-sky-300">Admin Dashboard</p>
                                        <p className="font-label-sm text-sky-600 dark:text-sky-400">Manage database, questions, and challenges</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-sky-500">chevron_right</span>
                            </div>
                        )}

                    </div>
                </section>

                {/* Logout Button */}
                <section className="pt-4">
                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full bg-error-container text-on-error-container font-headline-md font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-error/20 active:scale-95 transition-all text-sm"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        {isLoggingOut ? 'Logging out...' : 'Log Out'}
                    </button>
                    <p className="text-center text-[10px] text-outline font-bold mt-6 tracking-widest uppercase">
                        EcoMastery v1.0.0
                    </p>
                </section>

            </main>


        </div>
    );
};
