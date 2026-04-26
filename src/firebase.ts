import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp, Timestamp, orderBy, limit, getDocFromServer, addDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  level: 'secondary' | 'undergraduate';
  progress: Record<string, boolean>;
  scores?: Record<string, number>;
  role?: 'admin' | 'user';
  points?: number;
  createdAt: any;
}

export interface Question {
  id?: string;
  topicId: string;
  level: 'secondary' | 'undergraduate';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  createdAt: any;
}

// Auth functions
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};

// User Profile functions
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
       return docSnap.data() as UserProfile;
    }
  } catch(error) {
    console.error('Error fetching user:', error);
  }
  return null;
};

export const createUserProfile = async (user: any, level: 'secondary' | 'undergraduate' = 'secondary'): Promise<UserProfile> => {
  const isAdmin = user.email === 'chukwuekudavid@gmail.com';
  const profile: UserProfile = {
    uid: user.uid || user.id,
    email: user.email || '',
    displayName: user.displayName || user.user_metadata?.full_name || '',
    level,
    progress: {},
    role: isAdmin ? 'admin' : 'user',
    points: 0,
    createdAt: serverTimestamp(),
  };
  
  try {
    await setDoc(doc(db, 'users', profile.uid), profile);
  } catch(e) {
    console.error(e);
  }
  return profile;
};

export const saveQuestions = async (questions: Question[]) => {
  for (const q of questions) {
    try {
      const qRef = doc(collection(db, 'questions'));
      await setDoc(qRef, {
        ...q,
        id: qRef.id,
        createdAt: serverTimestamp()
      });
    } catch(e) {
      console.error(e);
    }
  }
};

export const getQuestions = async (topicId: string): Promise<Question[]> => {
  try {
    const q = query(collection(db, 'questions'), where('topicId', '==', topicId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
  } catch(e) {
    console.error(e);
    return [];
  }
};

export const updateProgress = async (uid: string, topicId: string, completed: boolean, score?: number) => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const progress = data.progress || {};
      const scores = data.scores || {};
      progress[topicId] = completed;
      if (score !== undefined) {
         scores[topicId] = score;
      }
      await updateDoc(userRef, { progress, scores });
    }
  } catch(e) {
    console.error(e);
  }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as UserProfile);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const deleteUserAccount = async (uid: string): Promise<void> => {
  try {
     await deleteDoc(doc(db, 'users', uid));
  } catch(e) {
     console.error(e);
  }
};

export const updateUserRole = async (uid: string, role: 'admin' | 'user'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), { role });
  } catch(e) { console.error(e); }
};

export const updateUserLevel = async (uid: string, level: 'secondary' | 'undergraduate'): Promise<void> => {
  try {
     await updateDoc(doc(db, 'users', uid), { level });
  } catch(e) { console.error(e); }
};

export const updatePoints = async (uid: string, pointsToAdd: number) => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
       const u = snap.data();
       await updateDoc(userRef, { points: (u.points || 0) + pointsToAdd });
    }
  } catch(e) { console.error(e); }
};

export const getAllQuestionsAdmin = async (): Promise<Question[]> => {
  try {
     const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
     const snap = await getDocs(q);
     return snap.docs.map(d => ({ id: d.id, ...d.data() } as Question));
  } catch(e) {
     console.error(e);
     return [];
  }
};

export const updateQuestion = async (id: string, updates: Partial<Question>) => {
  if (updates.id) delete updates.id;
  try {
    await updateDoc(doc(db, 'questions', id), updates);
  } catch(e) {
    console.error(e);
  }
};

export const deleteQuestion = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'questions', id));
  } catch(e) {
    console.error(e);
  }
};

export const getAdminStats = async () => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const qsSnap = await getDocs(collection(db, 'questions'));
    
    const users = usersSnap.docs.map(d => d.data());
    const totalPoints = users.reduce((sum: number, u: any) => sum + (u.points || 0), 0);
    
    const topicCounts: Record<string, number> = {};
    users.forEach((u: any) => {
      Object.keys(u.progress || {}).forEach(topicId => {
        topicCounts[topicId] = (topicCounts[topicId] || 0) + 1;
      });
    });
    
    const popularTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({ id, count }));
      
    return {
      totalUsers: users.length,
      totalQuestions: qsSnap.size,
      totalPoints,
      popularTopics,
      topUsers: users.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5)
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const setGlobalAnnouncement = async (message: string, type: 'info' | 'warning' | 'success' = 'info') => {
  try {
    await setDoc(doc(db, 'settings', 'announcement'), {
      message, type, updatedAt: serverTimestamp()
    });
  } catch(e) {
    console.error(e);
  }
};

export const getGlobalAnnouncement = async () => {
  try {
     const docSnap = await getDoc(doc(db, 'settings', 'announcement'));
     if (docSnap.exists()) return docSnap.data();
  } catch(e) {
     console.error(e);
  }
  return null;
};

export const saveDuelResult = async (result: any) => {
  try {
    await addDoc(collection(db, 'duels'), { ...result, timestamp: serverTimestamp() });
  } catch(e) { console.error(e); }
};

export const getRecentDuels = async (limitCount: number = 10) => {
  try {
    const q = query(collection(db, 'duels'), orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {
    console.error(e);
    return [];
  }
};

export const getLeaderboard = async (limitCount: number = 10): Promise<UserProfile[]> => {
  try {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as UserProfile);
  } catch(e) {
    console.error(e);
    return [];
  }
};
