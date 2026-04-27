import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { loginWithGoogle, registerWithEmail, loginWithEmail, createUserProfile, getUserProfile, updateUserLevel } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLevel?: 'secondary' | 'undergraduate';
  defaultIsLogin?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultLevel = 'secondary', defaultIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultIsLogin);
      setError('');
      setPassword('');
      // optionally don't clear email so they don't have to retype it if they flipped to login
    }
  }, [isOpen, defaultIsLogin]);
  
  const navigate = useNavigate();
  const { setProfile, user } = useAuth();

  const handleAuthResult = async (firebaseUser: any) => {
    try {
      const existingProfile = await getUserProfile(firebaseUser.uid);
      if (!existingProfile) {
        // Provide a default level if registering new
        const newProfile = await createUserProfile({ 
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name || firebaseUser.displayName 
        }, defaultLevel);
        setProfile(newProfile);
        onClose();
        navigate('/select-level');
      } else {
        setProfile(existingProfile);
        onClose();
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch profile.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      let firebaseUser;
      if (isLogin) {
        firebaseUser = await loginWithEmail(email, password);
      } else {
        firebaseUser = await registerWithEmail(email, password);
      }
      if (firebaseUser) {
        await handleAuthResult(firebaseUser);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Try logging in.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const firebaseUser = await loginWithGoogle();
      if (firebaseUser) {
        await handleAuthResult(firebaseUser);
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Please allow popups for this site to sign in with Google.');
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
         // User closed popup
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Sign-in failed: Unauthorized domain. Please add this domain (e.g. your vercel.app domain) to your Firebase Authentication Settings -> Authorized domains.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" 
              onClick={onClose} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative transform overflow-hidden rounded-[2.5rem] bg-card border-none ring-1 ring-ink/5 dark:ring-white/10 text-left shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all w-full max-w-md max-h-[90vh] my-8"
            >
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-noise mix-blend-overlay opacity-50" />
              <div className="p-8 sm:p-10 relative z-10">
                <button onClick={onClose} className="absolute right-6 top-6 text-muted hover:text-ink hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors z-10 w-10 h-10 flex items-center justify-center">
                  <X size={20} />
                </button>
                
                <div className="text-center mb-10 mt-2">
                  <h2 className="text-3xl font-display font-bold text-ink mb-3 tracking-tight">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                  </h2>
                  <p className="text-sm font-medium text-muted">
                    {isLogin ? 'Sign in to access your dashboard' : 'Join thousands of scholars today'}
                  </p>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 text-sm list-none font-medium text-center">
                      {error}
                  </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-5">
                  {!isLogin && (
                    <div>
                      <label className="text-micro mb-2 block">Full Name</label>
                      <div className="relative group">
                        <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-sky-500 transition-colors" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          autoComplete="name"
                          className="w-full bg-paper border border-border rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-ink placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-micro mb-2 block">Email</label>
                    <div className="relative group">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-sky-500 transition-colors" />
                      <input 
                        type="email" 
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full bg-paper border border-border rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-ink placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-micro mb-2 block">Password</label>
                    <div className="relative group">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-sky-500 transition-colors" />
                      <input 
                        type="password" 
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        className="w-full bg-paper border border-border rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-ink placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-8 btn-premium justify-center shadow-sky-500/20"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-8 text-center text-[13px] font-medium text-muted flex items-center justify-center gap-2">
                  <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                  <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
                    type="button"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-border">
                   <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="w-full py-4 bg-paper text-ink border border-border text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-3 shadow-sm"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                      Continue with Google
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
