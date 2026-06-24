import React, { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { logout, updateUserLevel, updateUserProfile, deleteUserAccount } from '../firebase';
import { useDarkMode } from '../DarkModeContext';

export const Profile = () => {
    const { user, profile, setProfile } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhotoURL, setEditPhotoURL] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setEditName(profile.displayName || '');
            setEditPhotoURL(profile.photoURL || '');
        }
    }, [profile]);
    
    // Fallback counts or real data calculation
    const progress = profile?.progress || {};
    const level = profile?.level || 'secondary';
    const levelLabel = level === 'secondary-ss2' ? 'SS2' : (level === 'undergraduate' ? 'SS3' : 'SS1');
    const completedCount = Object.values(progress).filter(Boolean).length;
    const wins = 0;

    const handleSwitchLevel = () => {
        navigate('/select-level');
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        navigate('/');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !profile) return;
        if (!editName.trim()) return;

        setUpdateLoading(true);
        try {
            const updates: Partial<{ displayName: string; photoURL: string }> = { displayName: editName };
            if (editPhotoURL) updates.photoURL = editPhotoURL;
            
            await updateUserProfile(user.uid, updates);
            setProfile({ ...profile, ...updates });
            setIsEditing(false);
        } catch (e) {
            console.error(e);
        } finally {
            setUpdateLoading(false);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for base64
                alert('Image is too large. Please select an image under 1MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditPhotoURL(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResetProgress = async () => {
        if (!user || !profile) return;
        if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            setUpdateLoading(true);
            try {
                await updateUserProfile(user.uid, { progress: {}, scores: {}, points: 0 });
                setProfile({ ...profile, progress: {}, scores: {}, points: 0 });
                alert('Progress reset successfully.');
            } catch (e) {
                console.error(e);
            } finally {
                setUpdateLoading(false);
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (!user || !profile) return;
        if (window.confirm('DANGER: This will permanently delete your EcoMastery account and all your data. Are you absolutely sure?')) {
            setUpdateLoading(true);
            try {
                // Delete from firestore
                await deleteUserAccount(user.uid);
                
                // Then logout (Actual Auth deletion would require re-authentication usually, so we just clear data and logout for this prototype)
                await logout();
                navigate('/');
                alert('Your account has been deleted.');
            } catch (e) {
                console.error(e);
                alert('Error deleting account. You might need to re-login to perform this action.');
            } finally {
                setUpdateLoading(false);
            }
        }
    };

    if (isEditing) {
        return (
            <div className="bg-background text-on-background min-h-screen pb-24 font-['Hanken_Grotesk']">
                <header className="w-full sticky top-0 z-40 bg-surface dark:bg-surface-container-low shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex justify-between items-center px-grid-margin py-md">
                    <button onClick={() => setIsEditing(false)} className="p-2 -ml-2 rounded-full hover:bg-surface-container active:scale-95 transition-all text-on-surface">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h1 className="font-headline-md text-primary font-bold">Edit Profile</h1>
                    <div className="w-10"></div>
                </header>

                <main className="px-grid-margin mt-lg max-w-xl mx-auto py-8">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                {(editPhotoURL || user?.photoURL) ? (
                                    <img 
                                        className="w-24 h-24 rounded-full border-4 border-secondary-container object-cover mb-4 group-hover:opacity-75 transition-opacity shrink-0" 
                                        src={editPhotoURL || user?.photoURL || ""} 
                                        alt="Avatar" 
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full border-4 border-secondary-container bg-black text-white flex items-center justify-center font-bold text-4xl shrink-0 mb-4 group-hover:opacity-75 transition-opacity">
                                        {editName?.[0]?.toUpperCase() || profile?.displayName?.[0]?.toUpperCase() || 'S'}
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                                    <div className="bg-primary/80 text-on-primary p-1.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={onFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>
                            <p className="font-label-sm text-outline mt-2 text-center">Click avatar to upload from gallery</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="font-label-md text-on-surface-variant ml-1 font-bold">Display Name</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-on-surface font-medium"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5 opacity-60">
                                <label className="font-label-md text-on-surface-variant ml-1 font-bold">Email Address</label>
                                <input 
                                    type="email" 
                                    value={user?.email || ''} 
                                    disabled
                                    className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl px-6 py-4 text-on-surface font-medium cursor-not-allowed"
                                />
                                <p className="text-[10px] text-outline font-medium ml-1">Email cannot be changed directly</p>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={updateLoading}
                            className="w-full bg-primary text-on-primary font-headline-md font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8"
                        >
                            {updateLoading ? (
                                <span className="animate-spin material-symbols-outlined">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined">check</span>
                            )}
                            Save Changes
                        </button>

                        <div className="pt-10 space-y-4">
                            <h4 className="font-label-md text-error uppercase tracking-widest pl-1 font-bold text-[10px]">Danger Zone</h4>
                            
                            <button 
                                type="button"
                                onClick={handleResetProgress}
                                disabled={updateLoading}
                                className="w-full border border-outline-variant/30 text-error font-label-md font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-error/5 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">restart_alt</span>
                                Reset All Progress
                            </button>

                            <button 
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={updateLoading}
                                className="w-full border border-error/30 text-error font-label-md font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-error/5 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">delete_forever</span>
                                Delete Account
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        );
    }

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
                        {(profile?.photoURL || user?.photoURL) ? (
                            <img 
                                className="w-24 h-24 rounded-full border-4 border-secondary-container object-cover shrink-0" 
                                src={profile?.photoURL || user?.photoURL || ""} 
                                alt="User Avatar" 
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full border-4 border-secondary-container bg-black text-white flex items-center justify-center font-bold text-4xl shrink-0">
                                {profile?.displayName?.[0]?.toUpperCase() || 'S'}
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-secondary text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md border-2 border-white">
                            {levelLabel}
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

                        {/* Switch Learning Path */}
                        <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer" onClick={handleSwitchLevel}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <div>
                                    <p className="font-label-md font-bold text-primary">Change Learning Path</p>
                                    <p className="font-label-sm text-on-surface-variant">Switch between SS1 and SS2</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-outline">chevron_right</span>
                        </div>

                        {/* Profile Settings */}
                        <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => setIsEditing(true)}>
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
