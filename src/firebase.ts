import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp, Timestamp, orderBy, limit, getDocFromServer, addDoc, runTransaction } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
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
    photoURL: user.photoURL || '',
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

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), updates);
  } catch(e) { console.error(e); }
};

export const updateUserPresence = async (uid: string) => {
  try {
    await updateDoc(doc(db, 'users', uid), { 
      lastActive: Date.now() 
    });
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

// --- Arena Matchmaking ---

export const enterMatchmaking = async (user: { uid: string, displayName: string }, topicId: string, questions: Question[], gameMode: 'bullet' | 'blitz' | 'rapid' = 'blitz') => {
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
        // Found opponent
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
            
            // Slice questions based on mode
            const modeCounts = { bullet: 5, blitz: 15, rapid: 20 };
            const finalQuestions = questions.slice(0, modeCounts[gameMode] || 15);

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
          topicId,
          gameMode,
          enteredAt: serverTimestamp()
        });
        return null;
      }
    }
    
    return null;

  } catch(e) {
    console.error("Error in matchmaking:", e);
    return null;
  }
};

export const leaveMatchmaking = async (uid: string) => {
  try {
    await deleteDoc(doc(db, 'arena_queue', uid));
  } catch(e) { console.error(e); }
};

export const submitMatchAnswer = async (matchId: string, uid: string, correct: boolean, questionIndex: number) => {
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
        players[pIndex].answers[questionIndex] = correct;
        
        players[pIndex].currentQuestion = questionIndex + 1;
        
        const nextPlayer = players.find((p: any) => p.id !== uid);
        let nextTurnUid = nextPlayer ? nextPlayer.id : uid;

        // check win
        let status = data.status;
        const totalQuestions = data.questions?.length || 0;
        
        if (players.every((p: any) => p.currentQuestion >= totalQuestions)) {
          status = 'finished';
        } else if (nextPlayer && nextPlayer.currentQuestion >= totalQuestions) {
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
  } catch(e) { console.error(e); }
};

export const sendMatchMessage = async (matchId: string, senderId: string, senderName: string, message: string) => {
  try {
    await addDoc(collection(db, `arena_matches/${matchId}/messages`), {
       senderId, senderName, message, timestamp: serverTimestamp()
    });
  } catch(e) { console.error(e); }
};

export const requestMatchRematch = async (matchId: string, challengerName: string, challengerId: string) => {
  try {
    await updateDoc(doc(db, 'arena_matches', matchId), {
       rematchOffered: { challengerName, challengerId }
    });
  } catch(e) { console.error(e); }
};

export const acceptMatchRematch = async (matchId: string, questions: Question[]) => {
  try {
    const matchRef = doc(db, 'arena_matches', matchId);
    await runTransaction(db, async (transaction) => {
       const snap = await transaction.get(matchRef);
       if (!snap.exists()) return;
       const data = snap.data();
       const players = data.players.map((p: any) => ({ ...p, score: 0, currentQuestion: 0, answers: {} }));
       const mode = data.gameMode || 'blitz';
       const modeCounts: any = { bullet: 5, blitz: 15, rapid: 20 };
       const finalQuestions = questions.slice(0, modeCounts[mode] || 15);

       transaction.update(matchRef, {
         players,
         questions: finalQuestions,
         status: 'playing',
         currentTurnUid: data.rematchOffered.challengerId,
         lastTurnChangeAt: serverTimestamp(),
         rematchOffered: null
       });
    });
  } catch(e) { console.error(e); }
};

export const sendDirectChallenge = async (challengerId: string, challengerName: string, targetId: string, targetName: string, topicId: string) => {
  try {
    const challengeRef = doc(collection(db, 'direct_challenges'));
    await setDoc(challengeRef, {
      id: challengeRef.id,
      challengerId,
      challengerName,
      targetId,
      targetName,
      topicId,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return challengeRef.id;
  } catch(e) {
    console.error(e);
    return null;
  }
};

export const respondDirectChallenge = async (challengeId: string, status: 'accepted' | 'declined', questions?: Question[]) => {
  try {
    const challengeRef = doc(db, 'direct_challenges', challengeId);
    
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(challengeRef);
      if (!snap.exists()) return;
      const data = snap.data();
      
      transaction.update(challengeRef, { status });
      
      if (status === 'accepted' && questions) {
         const mode = data.gameMode || 'blitz';
         const modeCounts: any = { bullet: 5, blitz: 15, rapid: 20 };
         const finalQuestions = questions.slice(0, modeCounts[mode] || 15);

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
    console.error(e);
  }
};

// Also listen to online users for lobby representation: Just simple presence.
// We'll read from arena_queue for those "searching", and we can't easily track idle without cloud functions.
// We'll skip complex presence for now to ensure stability on Vercel.

