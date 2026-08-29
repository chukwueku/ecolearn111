import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp, Timestamp, orderBy, limit, getDocFromServer, addDoc, runTransaction } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// --- Firestore Error Handling ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  level: 'secondary' | 'secondary-ss2' | 'secondary-ss3' | 'undergraduate' | 'pending';
  progress: Record<string, boolean>;
  scores?: Record<string, number>;
  role?: 'admin' | 'user';
  points?: number;
  xp?: number;
  streak?: number;
  lastStreakDate?: string; // ISO date string YYYY-MM-DD
  badges?: string[];
  dailyQuizStreak?: number;
  lastDailyQuizDate?: string;
  lastActive?: number;
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
  createdAt?: any;
}

// Auth functions
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};

// User Profile functions
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const path = `users/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
       return docSnap.data() as UserProfile;
    }
  } catch(error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
  return null;
};

export const createUserProfile = async (user: any, level: 'secondary' | 'undergraduate' | 'pending' = 'pending'): Promise<UserProfile> => {
  const isAdmin = user.email === 'chukwuekudavid@gmail.com';
  const profile: UserProfile = {
    uid: user.uid || user.id,
    email: user.email || '',
    displayName: user.displayName || user.user_metadata?.full_name || '',
    photoURL: user.photoURL || '',
    level,
    progress: {},
    role: isAdmin ? 'admin' : 'user',
    points: 0,
    createdAt: serverTimestamp(),
  };
  
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile);
  } catch(e) {
    handleFirestoreError(e, OperationType.WRITE, path);
  }
  return profile;
};

export const normalizeQuestionText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
};

const STOP_WORDS_SET = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t',
  'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'isn\'t', 'it', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no',
  'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'shan\'t', 'she', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
  'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'were', 'weren\'t', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'following', 'best', 'defines', 'defined', 'definition', 'statement',
  'refers', 'referred', 'explain', 'explains', 'described', 'describes', 'example', 'examples', 'true',
  'correct', 'incorrect', 'consider', 'economics', 'economic', 'given', 'identify', 'whichof', 'whatis'
]);

const tokenizeCoreWords = (text: string): string[] => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS_SET.has(w));
};

const getJaccardAndOverlap = (words1: string[], words2: string[]) => {
  if (words1.length === 0 || words2.length === 0) return { jaccard: 0, overlap: 0 };
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  let intersection = 0;
  for (const w of set1) {
    if (set2.has(w)) intersection++;
  }
  const union = set1.size + set2.size - intersection;
  const minSize = Math.min(set1.size, set2.size);
  return {
    jaccard: union === 0 ? 0 : intersection / union,
    overlap: minSize === 0 ? 0 : intersection / minSize
  };
};

export const isDuplicateQuestion = (
  newQuestion: string | { question: string; options?: string[] },
  existingQuestions: (string | { question: string; options?: string[] })[]
): boolean => {
  const qText = typeof newQuestion === 'string' ? newQuestion : newQuestion?.question;
  if (!qText) return false;

  const normNew = normalizeQuestionText(qText);
  if (!normNew) return false;

  const wordsNew = tokenizeCoreWords(qText);
  const newOpts = (typeof newQuestion === 'object' && Array.isArray(newQuestion.options))
    ? new Set(newQuestion.options.map(o => normalizeQuestionText(String(o))).filter(Boolean))
    : null;

  return existingQuestions.some(existing => {
    const exText = typeof existing === 'string' ? existing : existing?.question;
    if (!exText) return false;

    const normExist = normalizeQuestionText(exText);
    if (!normExist) return false;

    // 1. Direct normalized match
    if (normExist === normNew) return true;

    // 2. Overlap check for substantial length questions
    if (normNew.length > 28 && normExist.length > 28) {
      if (normNew.includes(normExist) || normExist.includes(normNew)) return true;
    }

    // 3. Option overlap (if 3 or more options match)
    if (newOpts && typeof existing === 'object' && Array.isArray(existing.options)) {
      let optMatches = 0;
      for (const o of existing.options) {
        if (newOpts.has(normalizeQuestionText(String(o)))) optMatches++;
      }
      if (optMatches >= 3) return true;
    }

    // 4. Core concept keyword Jaccard and Szymkiewicz–Simpson overlap
    const wordsExist = tokenizeCoreWords(exText);
    if (wordsNew.length >= 3 && wordsExist.length >= 3) {
      const { jaccard, overlap } = getJaccardAndOverlap(wordsNew, wordsExist);
      if (jaccard >= 0.58 || (overlap >= 0.72 && Math.min(wordsNew.length, wordsExist.length) >= 4)) {
        return true;
      }
    }

    return false;
  });
};

export const saveQuestions = async (questions: Question[]): Promise<{ savedCount: number; duplicateCount: number }> => {
  let savedCount = 0;
  let duplicateCount = 0;

  // Retrieve existing question bank to check for duplicates
  let existingTexts: string[] = [];
  try {
    const snap = await getDocs(collection(db, 'questions'));
    existingTexts = snap.docs.map(d => d.data().question).filter(Boolean);
  } catch (e) {
    console.warn("Could not fetch existing question bank for deduplication:", e);
  }

  const seenInBatch: string[] = [];

  for (const q of questions) {
    if (!q.question || !q.question.trim()) continue;

    if (isDuplicateQuestion(q.question, [...existingTexts, ...seenInBatch])) {
      console.warn("Duplicate question rejected:", q.question);
      duplicateCount++;
      continue;
    }

    seenInBatch.push(q.question);
    const path = 'questions';
    try {
      const qRef = doc(collection(db, 'questions'));
      await setDoc(qRef, {
        ...q,
        id: qRef.id,
        createdAt: serverTimestamp()
      });
      savedCount++;
      existingTexts.push(q.question);
    } catch(e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }

  return { savedCount, duplicateCount };
};

export const getQuestionsForLevel = async (level: string): Promise<Question[]> => {
  const path = 'questions';
  try {
    const q = query(collection(db, 'questions'), where('level', '==', level));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Question));
  } catch(e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const getQuestions = async (topicId: string): Promise<Question[]> => {
  const path = 'questions';
  try {
    let q;
    if (topicId === 'ss1' || topicId === 'ss2' || topicId === 'ug' || topicId === 'uni') {
      q = query(collection(db, 'questions'), where('topicId', '>=', topicId + '-'), where('topicId', '<=', topicId + '-\uf8ff'));
    } else {
      q = query(collection(db, 'questions'), where('topicId', '==', topicId));
    }
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Question));
  } catch(e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const updateProgress = async (uid: string, topicId: string, completed: boolean, score?: number) => {
  const path = `users/${uid}`;
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
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), updates);
  } catch(e) { 
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

export const updateUserPresence = async (uid: string) => {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), { 
      lastActive: Date.now() 
    });
  } catch(e) {
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as UserProfile);
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const deleteUserAccount = async (uid: string): Promise<void> => {
  const path = `users/${uid}`;
  try {
     await deleteDoc(doc(db, 'users', uid));
  } catch(e) {
     handleFirestoreError(e, OperationType.DELETE, path);
  }
};

export const updateUserRole = async (uid: string, role: 'admin' | 'user'): Promise<void> => {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), { role });
  } catch(e) { 
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

export const updateUserLevel = async (uid: string, level: 'secondary' | 'secondary-ss2' | 'secondary-ss3' | 'undergraduate' | 'pending'): Promise<void> => {
  const path = `users/${uid}`;
  try {
     await updateDoc(doc(db, 'users', uid), { level });
  } catch(e) { 
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

export const updatePoints = async (uid: string, pointsToAdd: number) => {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
       const u = snap.data();
       await updateDoc(userRef, {
         points: (u.points || 0) + pointsToAdd,
         xp: (u.xp || 0) + pointsToAdd,
       });
    }
  } catch(e) { 
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

// Get today's date as YYYY-MM-DD
const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// Update login streak — call once on user login or daily puzzle completion
export const updateStreak = async (uid: string): Promise<{ streak: number; isNew: boolean }> => {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return { streak: 0, isNew: false };
    const u = snap.data();
    const today = getTodayDateStr();
    const lastDate = u.lastStreakDate || '';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    let streak = u.streak || 0;
    let isNew = false;
    if (lastDate === today) {
      return { streak, isNew: false }; // Already updated today
    } else if (lastDate === yesterdayStr) {
      streak = streak + 1;
      isNew = true;
    } else if (lastDate !== today) {
      streak = 1; // Reset streak
      isNew = true;
    }
    // Award bonus XP for streak milestones
    const bonusXP = streak % 7 === 0 ? 50 : streak % 3 === 0 ? 20 : 10;
    await updateDoc(userRef, {
      streak,
      lastStreakDate: today,
      xp: (u.xp || 0) + bonusXP,
      points: (u.points || 0) + bonusXP,
    });
    return { streak, isNew };
  } catch(e) {
    handleFirestoreError(e, OperationType.UPDATE, path);
    return { streak: 0, isNew: false };
  }
};

// Badge IDs available in the system
export const BADGE_DEFINITIONS: Record<string, { name: string; description: string; emoji: string; color: string; tier: 'secondary' | 'undergrad' | 'both' }> = {
  // --- Firsts & Early Milestones (5) ---
  'first_lesson': { name: 'First Step', description: 'Completed your first lesson', emoji: '📖', color: 'from-emerald-400 to-teal-500', tier: 'both' },
  'first_win': { name: 'First Victory', description: 'Won your first PvP duel', emoji: '⚔️', color: 'from-amber-400 to-orange-500', tier: 'both' },
  'first_friend': { name: 'Socialite', description: 'Added your first friend', emoji: '👋', color: 'from-pink-400 to-rose-400', tier: 'both' },
  'quiz_perfect': { name: 'Perfect Score', description: 'Got 100% on a chapter quiz', emoji: '💯', color: 'from-sky-400 to-blue-600', tier: 'both' },
  'social_butterfly': { name: 'Social Butterfly', description: 'Engaged in a direct multiplayer duel', emoji: '🤝', color: 'from-pink-500 to-purple-600', tier: 'both' },

  // --- Streaks (6) ---
  'streak_3': { name: 'On Fire', description: 'Maintained a 3-day streak', emoji: '🔥', color: 'from-orange-400 to-red-500', tier: 'both' },
  'streak_7': { name: 'Weekly Warrior', description: 'Maintained a 7-day streak', emoji: '🗓️', color: 'from-violet-400 to-purple-600', tier: 'both' },
  'streak_14': { name: 'Fortnight Fighter', description: 'Maintained a 14-day streak', emoji: '📅', color: 'from-indigo-400 to-blue-500', tier: 'both' },
  'streak_30': { name: 'Iron Economist', description: 'Maintained a 30-day streak', emoji: '🏆', color: 'from-yellow-400 to-amber-600', tier: 'both' },
  'streak_100': { name: 'Centurion', description: 'Maintained a 100-day streak', emoji: '💯', color: 'from-red-500 to-rose-700', tier: 'both' },
  'streak_365': { name: 'A Year of Eco', description: 'Maintained a 365-day streak', emoji: '🌍', color: 'from-yellow-300 to-yellow-600', tier: 'both' },

  // --- Chapter & Study Milestones (9) ---
  'chapters_5': { name: 'Scholar', description: 'Completed 5 chapters', emoji: '🎓', color: 'from-green-400 to-emerald-600', tier: 'both' },
  'chapters_10': { name: 'Economist', description: 'Completed 10 chapters', emoji: '📊', color: 'from-indigo-400 to-blue-600', tier: 'both' },
  'chapters_25': { name: 'Researcher', description: 'Completed 25 chapters', emoji: '🔍', color: 'from-teal-400 to-cyan-600', tier: 'both' },
  'chapters_50': { name: 'Professor', description: 'Completed 50 chapters', emoji: '👨‍🏫', color: 'from-blue-500 to-indigo-700', tier: 'both' },
  'subject_master': { name: 'Subject Master', description: 'Completed an entire subject roadmap', emoji: '📜', color: 'from-amber-600 to-red-700', tier: 'both' },
  'curious_mind': { name: 'Curious Mind', description: 'Read 10 different chapter summaries', emoji: '🧠', color: 'from-teal-400 to-emerald-500', tier: 'both' },
  'night_owl': { name: 'Night Owl', description: 'Completed a quiz between midnight and 4 AM', emoji: '🦉', color: 'from-indigo-700 to-slate-800', tier: 'both' },
  'early_bird': { name: 'Early Bird', description: 'Studied between 5 AM and 8 AM', emoji: '🌅', color: 'from-orange-300 to-amber-500', tier: 'both' },
  'weekend_warrior': { name: 'Weekend Warrior', description: 'Completed a chapter on the weekend', emoji: '🎉', color: 'from-fuchsia-500 to-rose-600', tier: 'both' },

  // --- Daily Puzzles (5) ---
  'puzzle_1': { name: 'Puzzler', description: 'Completed your first daily puzzle', emoji: '🧩', color: 'from-pink-400 to-rose-500', tier: 'both' },
  'puzzle_master': { name: 'Puzzle Master', description: 'Completed 10 daily puzzles', emoji: '🧩', color: 'from-pink-500 to-rose-600', tier: 'both' },
  'puzzle_grandmaster': { name: 'Puzzle Grandmaster', description: 'Completed 50 daily puzzles', emoji: '👑', color: 'from-purple-500 to-fuchsia-600', tier: 'both' },
  'puzzle_streak_7': { name: 'Puzzle Addict', description: 'Solved daily puzzles 7 days in a row', emoji: '📅', color: 'from-blue-400 to-cyan-500', tier: 'both' },
  'puzzle_flawless': { name: 'Sharp Mind', description: 'Got 5/5 on a daily puzzle batch', emoji: '🎯', color: 'from-emerald-400 to-green-600', tier: 'both' },

  // --- Live Duel Milestones (9) ---
  'duel_10': { name: 'Gladiator', description: 'Played 10 multiplayer duels', emoji: '⚔️', color: 'from-slate-400 to-gray-600', tier: 'both' },
  'duel_veteran': { name: 'Duel Veteran', description: 'Played 50 multiplayer duels', emoji: '🛡️', color: 'from-slate-500 to-gray-700', tier: 'both' },
  'duel_legend': { name: 'Duel Legend', description: 'Played 100 multiplayer duels', emoji: '🏰', color: 'from-slate-600 to-gray-900', tier: 'both' },
  'win_10': { name: 'Competitor', description: 'Won 10 multiplayer duels', emoji: '🏅', color: 'from-amber-300 to-orange-400', tier: 'both' },
  'win_25': { name: 'Champion', description: 'Won 25 multiplayer duels', emoji: '🏆', color: 'from-amber-400 to-orange-500', tier: 'both' },
  'win_50': { name: 'Conqueror', description: 'Won 50 multiplayer duels', emoji: '👑', color: 'from-amber-500 to-orange-600', tier: 'both' },
  'win_100': { name: 'Invincible', description: 'Won 100 multiplayer duels', emoji: '🐉', color: 'from-red-500 to-rose-700', tier: 'both' },
  'undefeated': { name: 'Undefeated', description: 'Won 5 duels in a row', emoji: '🔥', color: 'from-yellow-400 to-yellow-600', tier: 'both' },
  'flawless_victory': { name: 'Flawless Victory', description: 'Won a duel with 100% accuracy', emoji: '🌟', color: 'from-blue-400 to-indigo-500', tier: 'both' },

  // --- XP & Level Tiers (5) ---
  'level_10': { name: 'Rising Star', description: 'Reached Level 10', emoji: '⭐', color: 'from-cyan-300 to-blue-400', tier: 'both' },
  'level_25': { name: 'Economic Prodigy', description: 'Reached Level 25', emoji: '📈', color: 'from-emerald-400 to-lime-500', tier: 'both' },
  'level_50': { name: 'Mastermind', description: 'Reached Level 50', emoji: '🧠', color: 'from-purple-400 to-fuchsia-500', tier: 'both' },
  'level_75': { name: 'Visionary', description: 'Reached Level 75', emoji: '👁️', color: 'from-rose-400 to-red-600', tier: 'both' },
  'level_100': { name: 'Apex Economist', description: 'Reached Level 100', emoji: '⛰️', color: 'from-yellow-400 to-amber-600', tier: 'both' },

  // --- Notable Economics Scholars (Prestige Badges) (11) ---
  'adam_smith': { name: 'Adam Smith Award', description: 'Reached 5,000 XP (Master of Free Markets)', emoji: '🏛️', color: 'from-amber-500 to-yellow-700', tier: 'both' },
  'keynes_league': { name: 'Keynesian', description: 'Reached Keynes League (3000+ pts)', emoji: '💎', color: 'from-cyan-400 to-blue-500', tier: 'both' },
  'karl_marx': { name: 'Karl Marx Medal', description: 'Read 20 chapters on Labor and Production', emoji: '🏭', color: 'from-red-500 to-red-800', tier: 'undergrad' },
  'milton_friedman': { name: 'Milton Friedman Trophy', description: 'Answered 50 questions on Monetary Policy correctly', emoji: '💵', color: 'from-emerald-500 to-green-700', tier: 'undergrad' },
  'hayek': { name: 'Hayek Prize', description: 'Maintained an 80% win rate over 20 duels', emoji: '⚖️', color: 'from-indigo-400 to-purple-600', tier: 'undergrad' },
  'david_ricardo': { name: 'David Ricardo Shield', description: 'Perfect score in International Trade chapters', emoji: '🚢', color: 'from-blue-400 to-cyan-600', tier: 'secondary' },
  'john_stuart_mill': { name: 'John Stuart Mill Star', description: 'Completed all Microeconomics chapters', emoji: '🌟', color: 'from-yellow-300 to-amber-500', tier: 'undergrad' },
  'thomas_malthus': { name: 'Thomas Malthus Pin', description: 'Completed Population chapters', emoji: '👨‍👩‍👧‍👦', color: 'from-orange-400 to-red-500', tier: 'secondary' },
  'joseph_schumpeter': { name: 'Schumpeter Crown', description: 'Won 10 duels as the underdog (lower rating)', emoji: '👑', color: 'from-purple-500 to-pink-600', tier: 'undergrad' },
  'amartya_sen': { name: 'Amartya Sen Ribbon', description: 'Completed Development Economics chapters', emoji: '🌱', color: 'from-green-300 to-emerald-500', tier: 'undergrad' },
  'john_nash': { name: 'John Nash Equilibrium', description: 'Draw 3 live duels', emoji: '🤝', color: 'from-slate-400 to-slate-600', tier: 'both' },
};

export const unlockBadge = async (uid: string, badgeId: string): Promise<boolean> => {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return false;
    const u = snap.data();
    const existing: string[] = u.badges || [];
    if (existing.includes(badgeId)) return false; // Already has it
    const newBadges = [...existing, badgeId];
    await updateDoc(userRef, { badges: newBadges });
    return true; // Newly unlocked
  } catch(e) {
    console.warn('unlockBadge error:', e);
    return false;
  }
};

// XP level calculation — returns level 1-50 based on XP
export const getXPLevel = (xp: number = 0): { level: number; title: string; currentXP: number; nextXP: number; progress: number } => {
  const thresholds = [0,100,250,500,850,1300,1900,2700,3700,5000,6600,8500,10800,13500,16700,20400,24700,29600,35200,41500,48600,56500,65200,74700,85000,96100,108000,120700,134200,148500,163600,179500,196200,213700,232000,251100,271000,291700,313200,335500,358600,382500,407200,432700,459000,486100,514000,542700,572200,600000];
  const titles = ['Novice','Apprentice','Student','Scholar','Analyst','Economist','Strategist','Expert','Advisor','Theorist','Senior Analyst','Policy Maker','Research Fellow','Associate Prof','Lecturer','Sr. Lecturer','Professor','Economic Advisor','Lead Economist','Policy Director','Chief Economist','Macro Strategist','Trade Expert','Development Expert','Market Analyst','Keynesian','Monetarist','Supply-Sider','Institutional Expert','Behavioral Expert','Development Theorist','International Trade Expert','Game Theory Expert','Econometrician','Policy Architect','Macro Master','Micro Master','Global Economist','Financial Economist','Economic Historian','Nobel Contender','Economic Philosopher','Grand Economist','Economic Legend','Market Master','Supreme Economist','Economic Oracle','Economic Titan','Economic God','Keynesian Master'];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1;
    else break;
  }
  level = Math.min(level, 50);
  const currentXP = xp - thresholds[level - 1];
  const nextXP = level < 50 ? thresholds[level] - thresholds[level - 1] : 1;
  return { level, title: titles[level - 1], currentXP, nextXP, progress: Math.min((currentXP / nextXP) * 100, 100) };
};

export const getAllQuestionsAdmin = async (): Promise<Question[]> => {
  const path = 'questions';
  try {
     const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
     const snap = await getDocs(q);
     return snap.docs.map(d => ({ id: d.id, ...d.data() } as Question));
  } catch(e) {
     handleFirestoreError(e, OperationType.LIST, path);
     return [];
  }
};

export const updateQuestion = async (id: string, updates: Partial<Question>) => {
  const path = `questions/${id}`;
  if (updates.id) delete updates.id;
  try {
    await updateDoc(doc(db, 'questions', id), updates);
  } catch(e) {
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

export const deleteQuestion = async (id: string) => {
  const path = `questions/${id}`;
  try {
    await deleteDoc(doc(db, 'questions', id));
  } catch(e) {
    handleFirestoreError(e, OperationType.DELETE, path);
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
      
    const levelCounts: Record<string, number> = {
      'secondary': 0,
      'secondary-ss2': 0,
      'secondary-ss3': 0,
      'undergraduate': 0,
      'pending': 0
    };
    users.forEach((u: any) => {
      const lvl = u.level || 'secondary';
      levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
    });

    return {
      totalUsers: users.length,
      totalQuestions: qsSnap.size,
      totalPoints,
      popularTopics,
      levelCounts,
      topUsers: users.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5)
    };
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, 'admin_stats');
    return null;
  }
};

export const setGlobalAnnouncement = async (message: string, type: 'info' | 'warning' | 'success' = 'info') => {
  const path = 'settings/announcement';
  try {
    await setDoc(doc(db, 'settings', 'announcement'), {
      message, type, updatedAt: serverTimestamp()
    });
  } catch(e) {
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const getGlobalAnnouncement = async () => {
  const path = 'settings/announcement';
  try {
     const docSnap = await getDoc(doc(db, 'settings', 'announcement'));
     if (docSnap.exists()) return docSnap.data();
  } catch(e) {
     handleFirestoreError(e, OperationType.GET, path);
  }
  return null;
};

export const saveDuelResult = async (result: any) => {
  const path = 'duels';
  try {
    await addDoc(collection(db, 'duels'), { ...result, timestamp: serverTimestamp() });
  } catch(e) { 
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const getRecentDuels = async (limitCount: number = 10) => {
  const path = 'duels';
  try {
    const q = query(collection(db, 'duels'), orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const getLeaderboard = async (limitCount: number = 10, mainPath: 'secondary' | 'undergraduate' | 'all' = 'secondary'): Promise<UserProfile[]> => {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    let users = snap.docs.map(d => d.data() as UserProfile);
    if (mainPath === 'undergraduate') {
      users = users.filter(u => u.level === 'undergraduate');
    } else if (mainPath === 'secondary') {
      users = users.filter(u => u.level === 'secondary' || u.level === 'secondary-ss2' || u.level === 'secondary-ss3');
    }
    users.sort((a, b) => (b.points || 0) - (a.points || 0));
    return users.slice(0, limitCount);
  } catch(e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const getGlobalLeaderboardAndRank = async (currentUid?: string) => {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    const allUsers = snap.docs.map(d => d.data() as UserProfile);
    
    // Sort all users by points descending
    allUsers.sort((a, b) => (b.points || 0) - (a.points || 0));
    
    let userRank = 1;
    if (currentUid) {
      const idx = allUsers.findIndex(u => u.uid === currentUid);
      if (idx !== -1) {
        userRank = idx + 1;
      }
    }
    
    return {
      topUsers: allUsers,
      userRank,
      totalUsers: allUsers.length
    };
  } catch(e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return { topUsers: [], userRank: 1, totalUsers: 0 };
  }
};

// --- Arena Matchmaking ---

export const enterMatchmaking = async (user: { uid: string, displayName: string, points: number }, topicId: string, questions: Question[], gameMode: 'bullet' | 'blitz' | 'rapid' = 'blitz') => {
  const path = 'arena_queue';
  try {
    const queueRef = collection(db, 'arena_queue');
    let matchCreated = null;

    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      
      const q = query(queueRef, where('topicId', '==', topicId), where('gameMode', '==', gameMode));
      const snap = await getDocs(q);
      const potentialOpponents = snap.docs.filter(d => d.data().uid !== user.uid);
      
      if (potentialOpponents.length > 0) {
        // Find the opponent with closest points
        potentialOpponents.sort((a, b) => {
          const pointsA = a.data().points || 0;
          const pointsB = b.data().points || 0;
          return Math.abs(pointsA - user.points) - Math.abs(pointsB - user.points);
        });
        const opponent = potentialOpponents[0];
        
        try {
          await runTransaction(db, async (transaction) => {
            const oppSnap = await transaction.get(opponent.ref);
            if (!oppSnap.exists()) {
              throw new Error("Opponent taken");
            }
            
            const oppData = oppSnap.data() as any;
            transaction.delete(opponent.ref);

            const matchRef = doc(collection(db, 'arena_matches'));
            matchCreated = matchRef.id;
            
            // Slice questions based on mode (2x total questions so each player gets unique set)
            const modeCounts = { bullet: 10, blitz: 30, rapid: 40 };
            const finalQuestions = questions.slice(0, modeCounts[gameMode] || 30);

            transaction.set(matchRef, {
              matchId: matchRef.id,
              topicId,
              questions: finalQuestions,
              gameMode,
              playerUids: [user.uid, oppData.uid],
              players: [
                { id: user.uid, displayName: user.displayName, score: 0, currentQuestion: 0, connected: true, answers: {} },
                { id: oppData.uid, displayName: oppData.displayName, score: 0, currentQuestion: 0, connected: true, answers: {} }
              ],
              status: 'playing',
              currentTurnUid: oppData.uid, // The one who was waiting gets first move
              lastTurnChangeAt: serverTimestamp(),
              createdAt: serverTimestamp()
            });
          });
          
          if (matchCreated) {
            return matchCreated;
          }
        } catch(txnErr) {
          console.warn("Transaction collision, retrying matchmaking...", txnErr);
          continue; // Try again
        }
      } else {
        // No opponent found, add self to queue
        const myQueueRef = doc(collection(db, 'arena_queue'), user.uid);
        await setDoc(myQueueRef, {
          uid: user.uid,
          displayName: user.displayName,
          points: user.points,
          topicId,
          gameMode,
          enteredAt: serverTimestamp()
        });
        return null;
      }
    }
    
    return null;

  } catch(e) {
    handleFirestoreError(e, OperationType.WRITE, path);
    return null;
  }
};

export const leaveMatchmaking = async (uid: string) => {
  const path = `arena_queue/${uid}`;
  try {
    await deleteDoc(doc(db, 'arena_queue', uid));
  } catch(e) { 
    handleFirestoreError(e, OperationType.DELETE, path);
  }
};

export const submitMatchAnswer = async (matchId: string, uid: string, correct: boolean, questionIndex: number, selectedOption?: number) => {
  const path = `arena_matches/${matchId}`;
  try {
    const matchRef = doc(db, 'arena_matches', matchId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(matchRef);
      if (!snap.exists()) return;
      const data = snap.data();
      
      // Check turn (Chess-like)
      if (data.currentTurnUid !== uid) {
        console.warn("Not your turn!");
        return;
      }

      const players = data.players || [];
      const pIndex = players.findIndex((p: any) => p.id === uid);
      if (pIndex !== -1) {
         // Only process if they are answering their expected current question
        if (players[pIndex].currentQuestion !== questionIndex) return;

        if (correct) players[pIndex].score += 100;
        
        // Track answers for history
        if (!players[pIndex].answers) players[pIndex].answers = {};
        players[pIndex].answers[questionIndex] = {
          isCorrect: correct,
          selectedOption: typeof selectedOption === 'number' ? selectedOption : null
        };
        
        players[pIndex].currentQuestion = questionIndex + 1;
        
        const nextPlayer = players.find((p: any) => p.id !== uid);
        let nextTurnUid = nextPlayer ? nextPlayer.id : uid;

        // check win
        let status = data.status;
        const mode = data.gameMode || 'blitz';
        const targetQuestionsMap: Record<string, number> = { bullet: 5, blitz: 15, rapid: 20 };
        const targetQuestions = targetQuestionsMap[mode] || 15;
        
        if (players.every((p: any) => p.currentQuestion >= targetQuestions)) {
          status = 'finished';
        } else if (nextPlayer && nextPlayer.currentQuestion >= targetQuestions) {
          // If the opponent is done, turn returns to us until we're done
          nextTurnUid = uid;
        }
        
        transaction.update(matchRef, { 
          players, 
          status,
          currentTurnUid: nextTurnUid,
          lastTurnChangeAt: serverTimestamp()
        });
      }
    });
  } catch(e) { 
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const timeoutMatchTurn = async (matchId: string, timedOutUid: string, questionIndex: number) => {
  const path = `arena_matches/${matchId}`;
  try {
    const matchRef = doc(db, 'arena_matches', matchId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(matchRef);
      if (!snap.exists()) return;
      const data = snap.data();
      
      if (data.currentTurnUid !== timedOutUid) return; // Prevent skipping someone else's current turn
      if (data.status === 'finished') return;

      const players = data.players || [];
      const pIndex = players.findIndex((p: any) => p.id === timedOutUid);
      if (pIndex !== -1) {
         if (players[pIndex].currentQuestion !== questionIndex) return;

         if (!players[pIndex].answers) players[pIndex].answers = {};
         players[pIndex].answers[questionIndex] = {
           isCorrect: false,
           selectedOption: null,
           timedOut: true
         };
         
         players[pIndex].currentQuestion = questionIndex + 1;
         
         const nextPlayer = players.find((p: any) => p.id !== timedOutUid);
         let nextTurnUid = nextPlayer ? nextPlayer.id : timedOutUid;

         let status = data.status;
         const mode = data.gameMode || 'blitz';
         const targetQuestionsMap: Record<string, number> = { bullet: 5, blitz: 15, rapid: 20 };
         const targetQuestions = targetQuestionsMap[mode] || 15;
         
         if (players.every((p: any) => p.currentQuestion >= targetQuestions)) {
           status = 'finished';
         } else if (nextPlayer && nextPlayer.currentQuestion >= targetQuestions) {
           nextTurnUid = timedOutUid;
         }
         
         transaction.update(matchRef, { 
           players, 
           status,
           currentTurnUid: nextTurnUid,
           lastTurnChangeAt: serverTimestamp()
         });
      }
    });
  } catch(e) { 
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const forfeitMatch = async (matchId: string, quitterUid: string) => {
  const path = `arena_matches/${matchId}`;
  try {
    const matchRef = doc(db, 'arena_matches', matchId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(matchRef);
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.status === 'finished') return;

      const players = data.players || [];
      const winner = players.find((p: any) => p.id !== quitterUid);
      const quitter = players.find((p: any) => p.id === quitterUid);

      if (quitter && winner) {
        // Penalty for quitter, small reward for winner
        quitter.score = 0;
        winner.score = Math.max(winner.score, 500); // Ensure winner has a decent score or keeps their high score
      }

      transaction.update(matchRef, { 
        status: 'finished',
        forfeitedBy: quitterUid,
        players,
        lastTurnChangeAt: serverTimestamp()
      });
    });
  } catch(e) { 
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const sendMatchMessage = async (matchId: string, senderId: string, senderName: string, message: string) => {
  const path = `arena_matches/${matchId}/messages`;
  try {
    await addDoc(collection(db, `arena_matches/${matchId}/messages`), {
       senderId, senderName, message, timestamp: serverTimestamp()
    });
  } catch(e) { 
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const requestMatchRematch = async (matchId: string, challengerName: string, challengerId: string) => {
  const path = `arena_matches/${matchId}`;
  try {
    await updateDoc(doc(db, 'arena_matches', matchId), {
       rematchOffered: { challengerName, challengerId }
    });
  } catch(e) { 
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

export const acceptMatchRematch = async (matchId: string, questions: Question[]) => {
  const path = `arena_matches/${matchId}`;
  try {
    const matchRef = doc(db, 'arena_matches', matchId);
    await runTransaction(db, async (transaction) => {
       const snap = await transaction.get(matchRef);
       if (!snap.exists()) return;
       const data = snap.data();
       const players = data.players.map((p: any) => ({ ...p, score: 0, currentQuestion: 0, answers: {} }));
       const mode = data.gameMode || 'blitz';
       const modeCounts: any = { bullet: 10, blitz: 30, rapid: 40 };
       const finalQuestions = questions.slice(0, modeCounts[mode] || 30);

       transaction.update(matchRef, {
         players,
         questions: finalQuestions,
         status: 'playing',
         currentTurnUid: data.rematchOffered.challengerId,
         lastTurnChangeAt: serverTimestamp(),
         rematchOffered: null
       });
    });
  } catch(e) { 
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const sendDirectChallenge = async (challengerId: string, challengerName: string, targetId: string, targetName: string, topicId: string, gameMode: string = 'blitz') => {
  const path = 'direct_challenges';
  try {
    const challengeRef = doc(collection(db, 'direct_challenges'));
    await setDoc(challengeRef, {
      id: challengeRef.id,
      challengerId,
      challengerName,
      targetId,
      targetName,
      topicId,
      gameMode,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return challengeRef.id;
  } catch(e) {
    handleFirestoreError(e, OperationType.WRITE, path);
    return null;
  }
};

export const respondDirectChallenge = async (challengeId: string, status: 'accepted' | 'declined', questions?: Question[]) => {
  const path = `direct_challenges/${challengeId}`;
  try {
    const challengeRef = doc(db, 'direct_challenges', challengeId);
    
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(challengeRef);
      if (!snap.exists()) return;
      const data = snap.data();
      
      transaction.update(challengeRef, { status });
      
      if (status === 'accepted' && questions) {
         const mode = data.gameMode || 'blitz';
         const modeCounts: any = { bullet: 10, blitz: 30, rapid: 40 };
         const finalQuestions = questions.slice(0, modeCounts[mode] || 30);

         // Create the match
         const matchRef = doc(collection(db, 'arena_matches'));
         transaction.set(matchRef, {
            matchId: matchRef.id,
            topicId: data.topicId,
            questions: finalQuestions,
            gameMode: data.gameMode || 'blitz',
            playerUids: [data.challengerId, data.targetId],
            players: [
              { id: data.challengerId, displayName: data.challengerName, score: 0, currentQuestion: 0, connected: true, answers: {} },
              { id: data.targetId, displayName: data.targetName, score: 0, currentQuestion: 0, connected: true, answers: {} }
            ],
            status: 'playing',
            currentTurnUid: data.challengerId, // Challenger starts
            lastTurnChangeAt: serverTimestamp(),
            createdAt: serverTimestamp()
         });
      }
    });
  } catch(e) {
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

// Also listen to online users for lobby representation: Just simple presence.
// We'll read from arena_queue for those "searching", and we can't easily track idle without cloud functions.
// We'll skip complex presence for now to ensure stability on Vercel.

export interface DailyChallenge {
  id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  level: string; // "undergraduate" or other levels
  questions: any[]; // 50 questions
  active: boolean;
  createdAt: any;
}

export interface DailyChallengeAttempt {
  id?: string;
  userId: string;
  userDisplayName: string;
  challengeId: string;
  challengeTitle: string;
  score: number;
  questionsCount: number;
  correctAnswers: number;
  answers: Record<number, boolean>;
  completedAt: any;
}

export const saveDailyChallenge = async (challenge: Omit<DailyChallenge, 'id'>) => {
  const path = 'daily_challenges';
  try {
    const docRef = doc(collection(db, 'daily_challenges'));
    await setDoc(docRef, {
      ...challenge,
      id: docRef.id,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch(e) {
    handleFirestoreError(e, OperationType.WRITE, path);
    return null;
  }
};

export const getDailyChallengesAdmin = async (): Promise<DailyChallenge[]> => {
  const path = 'daily_challenges';
  try {
    const q = query(collection(db, 'daily_challenges'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyChallenge));
  } catch(e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const deleteDailyChallenge = async (id: string): Promise<void> => {
  const path = `daily_challenges/${id}`;
  try {
    await deleteDoc(doc(db, 'daily_challenges', id));
  } catch(e) {
    handleFirestoreError(e, OperationType.DELETE, path);
  }
};

export const getTodayDailyChallenge = async (level: string): Promise<DailyChallenge | null> => {
  const path = 'daily_challenges';
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    // 1. Try to fetch the challenge specifically for today's date
    const qToday = query(
      collection(db, 'daily_challenges'),
      where('level', '==', level),
      where('active', '==', true),
      where('date', '==', todayStr)
    );
    const snapToday = await getDocs(qToday);
    if (!snapToday.empty) {
      return { id: snapToday.docs[0].id, ...snapToday.docs[0].data() } as DailyChallenge;
    }

    // 2. Fallback: Try to fetch any recent active challenge for this level
    const qFallback = query(
      collection(db, 'daily_challenges'),
      where('level', '==', level),
      where('active', '==', true),
      orderBy('date', 'desc'),
      limit(1)
    );
    const snapFallback = await getDocs(qFallback);
    if (!snapFallback.empty) {
      return { id: snapFallback.docs[0].id, ...snapFallback.docs[0].data() } as DailyChallenge;
    }
  } catch(e) {
    handleFirestoreError(e, OperationType.LIST, path);
  }
  return null;
};

export const saveDailyChallengeAttempt = async (attempt: Omit<DailyChallengeAttempt, 'id'>) => {
  const path = 'daily_challenge_attempts';
  try {
    const docRef = doc(collection(db, 'daily_challenge_attempts'));
    await setDoc(docRef, {
      ...attempt,
      id: docRef.id,
      completedAt: serverTimestamp()
    });
    return docRef.id;
  } catch(e) {
    handleFirestoreError(e, OperationType.WRITE, path);
    return null;
  }
};

export const getUserDailyChallengeAttempt = async (userId: string, challengeId: string): Promise<DailyChallengeAttempt | null> => {
  const path = 'daily_challenge_attempts';
  try {
    const q = query(
      collection(db, 'daily_challenge_attempts'),
      where('userId', '==', userId),
      where('challengeId', '==', challengeId),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as DailyChallengeAttempt;
    }
  } catch(e) {
    handleFirestoreError(e, OperationType.LIST, path);
  }
  return null;
};

