import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { loginWithGoogle, registerWithEmail, loginWithEmail, createUserProfile, getUserProfile, updateUserLevel } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLevel?: 'secondary' | 'undergraduate';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultLevel = 'secondary' }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { setProfile, user } = useAuth();

  const handleAuthResult = async (firebaseUser: any) => {
    try {
      const existingProfile = await getUserProfile(firebaseUser.uid);
      if (!existingProfile) {
        // Provide a default level if registering new
        const newProfile = await createUserProfile({ ...firebaseUser, displayName: name || firebaseUser.displayName }, defaultLevel);
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
        setError('Authentication failed. Please try again.');
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
        setError('Sign-in failed: Unauthorized domain.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }} 
          className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8"
        >
          <button onClick={onClose} className="absolute right-6 top-6 text-muted hover:text-ink transition-colors">
            <X size={20} />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-ink mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-muted">
              {isLogin ? 'Sign in to access your dashboard' : 'Join thousands of scholars today'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm list-none">
                {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">Full Name</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-paper border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-paper border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-paper border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 dark:bg-sky-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-sky-600 transition-colors mt-6 flex justify-center items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted flex items-center justify-center gap-2">
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-bold hover:underline"
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
                className="w-full py-4 bg-paper text-ink border border-border text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                Continue with Google
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
