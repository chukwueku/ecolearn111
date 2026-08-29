import { useState, useEffect, createContext, useContext } from 'react';
import { auth, getUserProfile, createUserProfile, UserProfile, updateUserRole, updateUserLevel } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  setProfile: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          let userProfile = await getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            // Auto-create missing profile so user doesn't get stuck with profile === null
            userProfile = await createUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Scholar',
              photoURL: firebaseUser.photoURL || ''
            }, 'pending');
            
            // Award first login badge
            const { unlockBadge } = await import('./firebase');
            await unlockBadge(firebaseUser.uid, 'first_login');
          }

          // Ensure default admin has admin role
          const isAdminEmail = firebaseUser.email === 'chukwuekudavid@gmail.com';

          if (isAdminEmail && userProfile && userProfile.role !== 'admin') {
            await updateUserRole(firebaseUser.uid, 'admin');
            userProfile = { ...userProfile, role: 'admin' };
          }
          
          setProfile(userProfile);
        } catch (err) {
          console.error("Error fetching or creating user profile:", err);
          // Fallback profile if Firestore is unreachable
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Scholar',
            photoURL: firebaseUser.photoURL || '',
            level: 'pending',
            progress: {},
            role: firebaseUser.email === 'chukwuekudavid@gmail.com' ? 'admin' : 'user',
            points: 0,
            createdAt: new Date()
          };
          setProfile(fallbackProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

