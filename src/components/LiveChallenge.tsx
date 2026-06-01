import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../useAuth';
import { getQuestions, updatePoints, saveDuelResult, db, enterMatchmaking, leaveMatchmaking, submitMatchAnswer, timeoutMatchTurn, forfeitMatch, sendMatchMessage, requestMatchRematch, acceptMatchRematch, getAllUsers, sendDirectChallenge, respondDirectChallenge, updateUserPresence, Question, getLeaderboard } from '../firebase';
import { onSnapshot, collection, query, doc, orderBy, where, updateDoc } from 'firebase/firestore';
import { SECONDARY_ROADMAP, UNDERGRADUATE_ROADMAP } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Zap, Trophy, Loader2, User, Swords, CheckCircle2, XCircle, Timer, MessageSquare, Send, ChevronRight, Search } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LiveChallenge: React.FC = () => {
  const { user, profile } = useAuth();
  const [lobbyUsers, setLobbyUsers] = useState<any[]>([]);
  const [allUsersData, setAllUsersData] = useState<any[]>([]);
  const [incomingChallenge, setIncomingChallenge] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const currentMatchIdRef = useRef<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [finished, setFinished] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchOffered, setRematchOffered] = useState<any>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [mobileTab, setMobileTab] = useState<'board' | 'analysis'>('board');
  const [toastOptions, setToastOptions] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const [challengedUserIds, setChallengedUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (toastOptions) {
      const timer = setTimeout(() => setToastOptions(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastOptions]);
  const [gameMode, setGameMode] = useState<'bullet' | 'blitz' | 'rapid'>('blitz');
  const [lobbySearchQuery, setLobbySearchQuery] = useState('');
  const timerRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const MODE_CONFIGS = {
    bullet: { time: 15, label: 'Bullet', questions: 5, icon: <Zap size={18} /> },
    blitz: { time: 30, label: 'Blitz', questions: 15, icon: <Timer size={18} /> },
    rapid: { time: 45, label: 'Rapid', questions: 20, icon: <Swords size={18} /> }
  };

  const [searchTime, setSearchTime] = useState(0);
  const [matchFoundState, setMatchFoundState] = useState(false);
  const [pendingMatch, setPendingMatch] = useState<any>(null);
  const [duelStarted, setDuelStarted] = useState(false);
  const [firestoreError, setFirestoreError] = useState(false);
  const [activeMatchBanner, setActiveMatchBanner] = useState<any>(null);
  const expectingMatchRef = useRef(false);
  const searchTimerRef = useRef<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    getLeaderboard(5).then(setLeaderboard);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load all users & maintain presence
  useEffect(() => {
    if (!user) return;
    updateUserPresence(user.uid);
    const interval = setInterval(() => updateUserPresence(user.uid), 60000);
    return () => clearInterval(interval);
  }, [user]);

  const [usersInQueue, setUsersInQueue] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setAllUsersData([]);
      return;
    }
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
       setAllUsersData(snap.docs.map(d => d.data()));
    }, (err) => {
      console.error("Users snapshot error:", err);
      // If we get permission error, we still want to show something
    });
    return () => unsub();
  }, [user]);

  // Listen to queue to show searching users and merge with all users
  useEffect(() => {
    if (!user) {
      setUsersInQueue([]);
      return;
    }
    const q = query(collection(db, 'arena_queue'));
    const unsubQueue = onSnapshot(q, (snap) => {
      setUsersInQueue(snap.docs.map(doc => ({ ...doc.data(), status: 'searching' })));
    }, (err) => {
      console.error("Queue snapshot error:", err);
    });
    return () => unsubQueue();
  }, [user]);

  useEffect(() => {
      const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
      const onlineUsers = allUsersData.filter(u => u.lastActive >= fiveMinsAgo || u.uid === user?.uid);

      const merged = onlineUsers.map((u: any) => {
         const inQueue = usersInQueue.find((qu: any) => qu.uid === u.uid);
         if (inQueue) return inQueue;
         return { ...u, status: 'idle' };
      });
      // also include queue users who might not be in allUsersData (rare)
      usersInQueue.forEach((qu: any) => {
         if (!merged.find(m => m.uid === qu.uid)) merged.push(qu);
      });
      
      setLobbyUsers(merged.length > 0 ? merged : onlineUsers.map((u: any) => ({ ...u, status: 'idle' })));
  }, [allUsersData, usersInQueue, user?.uid]);

  // Listen to incoming direct challenges
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'direct_challenges'), where('targetId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const pendingChallenge = snap.docs.find(d => d.data().status === 'pending');
        if (pendingChallenge) {
          setIncomingChallenge({ id: pendingChallenge.id, ...pendingChallenge.data() });
        } else {
          setIncomingChallenge(null);
        }
      } else {
        setIncomingChallenge(null);
      }
    }, (err) => {
      console.error("Direct challenges error:", err);
    });
    return () => unsub();
  }, [user]);

  // Listen to active matches to find if user has a match
  useEffect(() => {
    if (!user) return;
    
    const matchesRef = collection(db, 'arena_matches');
    const qMatches = query(matchesRef, where('playerUids', 'array-contains', user.uid));

        const unsubMatches = onSnapshot(qMatches, (snap) => {
      setFirestoreError(false);
      const allMatches = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      const myMatch = allMatches.find(m => m.status !== 'finished');

      if (myMatch) {
         const isMyTurn = myMatch.currentTurnUid === user.uid;
         const me = myMatch.players.find((p: any) => p.id === user.uid);
         
         if (currentMatchIdRef.current !== myMatch.matchId) {
             const opponent = myMatch.players.find((p: any) => p.id !== user.uid);
             if (isSearching || expectingMatchRef.current) {
                 // New match found from queue or accepted challenge
                 currentMatchIdRef.current = myMatch.matchId;
                 clearInterval(searchTimerRef.current);
                 setSearchTime(0);
                 setIsSearching(false);
                 setPlayers([me, opponent]);
                 
                 // Auto-start the duel
                 setMatchData(myMatch);
                 setCurrentQuestion(me.currentQuestion || 0);
                 setWaitingForOpponent(myMatch.currentTurnUid !== user.uid);
                 setDuelStarted(true);
                 setMatchFoundState(false);
                 setPendingMatch(null);
                 setFinished(false);
                 setRematchRequested(false);
                 setRematchOffered(null);
                 
                 expectingMatchRef.current = false;
             } else {
                 // Component mounted and we found an old active match
                 setActiveMatchBanner(myMatch);
             }
             setLoading(false);
         } else if (duelStarted) {
             setPlayers(myMatch.players);
             setMatchData(myMatch);
             
             // Directly sync question and turn state from DB
             if (me) {
               setCurrentQuestion(me.currentQuestion);
             }
             setWaitingForOpponent(!isMyTurn);

             if (myMatch.rematchOffered && myMatch.rematchOffered.challengerId !== user.uid) {
                setRematchOffered(myMatch.rematchOffered);
             } else if (!myMatch.rematchOffered) {
                setRematchOffered(null);
             }
         }
      } else {
          if (activeMatchBanner) setActiveMatchBanner(null);
          // Check if myMatch just finished
          const myFinishedMatch = allMatches.find(m => m.players?.some((p: any) => p.id === user.uid) && m.status === 'finished' && m.matchId === currentMatchIdRef.current);
          if (myFinishedMatch) {
              setMatchData(myFinishedMatch);
              setPlayers(myFinishedMatch.players);
              setFinished(true);
              setDuelStarted(false);
              clearInterval(timerRef.current);
              
              const me = myFinishedMatch.players.find((p: any) => p.id === user.uid);
              const opponent = myFinishedMatch.players.find((p: any) => p.id !== user.uid);
              
              if (me && opponent && !me.pointsAwarded) {
                  const matchRef = doc(db, 'arena_matches', myFinishedMatch.id);
                  const updatedPlayers = myFinishedMatch.players.map((p: any) => 
                    p.id === user.uid ? { ...p, pointsAwarded: true } : p
                  );
                  updateDoc(matchRef, { players: updatedPlayers });

                  if (me.score > opponent.score) {
                    updatePoints(user.uid, 50); // Win bonus
                    saveDuelResult({
                      winnerUid: user.uid,
                      winnerName: profile!.displayName,
                      loserUid: opponent.id,
                      loserName: opponent.displayName,
                      topicId: selectedTopicId || 'General',
                      pointsAwarded: 50
                    });
                  } else if (me.score === opponent.score) {
                    updatePoints(user.uid, 20); // Draw
                  } else {
                    updatePoints(user.uid, 10); // Participation
                  }
              }
          }
      }
    }, (err) => {
      console.error("Matches snapshot error:", err);
      setFirestoreError(true);
    });

    return () => unsubMatches();
  }, [user, profile, selectedTopicId]);

  const enterDuel = () => {
    if (!pendingMatch) return;
    setMatchData(pendingMatch);
    setDuelStarted(true);
    setMatchFoundState(false);
    setPendingMatch(null);
    setFinished(false);
    const me = pendingMatch.players.find((p: any) => p.id === user?.uid);
    setCurrentQuestion(me.currentQuestion || 0);
    setWaitingForOpponent(pendingMatch.currentTurnUid !== user?.uid);
    setRematchRequested(false);
    setRematchOffered(null);
  };

  // Listen to messages
  useEffect(() => {
     if (!matchData?.matchId) return;
     const q = query(collection(db, `arena_matches/${matchData.matchId}/messages`), orderBy('timestamp', 'asc'));
     const unsub = onSnapshot(q, (snap) => {
         setMessages(snap.docs.map(doc => doc.data()));
     });
     return () => unsub();
  }, [matchData?.matchId]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(searchTimerRef.current);
      if (user) leaveMatchmaking(user.uid);
    };
  }, [user]);

  const pendingSubmitRef = useRef(false);

  useEffect(() => {
    if (!matchData || finished) return;
    const mode = matchData.gameMode as keyof typeof MODE_CONFIGS || 'blitz';
    const totalTime = MODE_CONFIGS[mode].time;
    setTimeLeft(totalTime);
  }, [matchData?.matchId, matchData?.currentTurnUid, finished]);

  useEffect(() => {
    if (!matchData || finished) return;
    
    const isMyTurn = matchData.currentTurnUid === user?.uid;

    const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
            const next = Math.max(0, prev - 1);
            
            if (next === 0 && prev !== 0 && !showAnswerFeedback && user) {
                if (isMyTurn && !waitingForOpponent) {
                    handleAnswer(false);
                } else if (!isMyTurn) {
                    // Try to forcefully timeout the opponent if they disconnected
                    const opp = matchData?.players?.find((p: any) => p.id !== user.uid);
                    if (opp && matchData.matchId) {
                       timeoutMatchTurn(matchData.matchId, opp.id, opp.currentQuestion || 0);
                    }
                }
            }
            
            return next;
        });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [matchData?.matchId, matchData?.currentTurnUid, finished, waitingForOpponent, showAnswerFeedback, user]);

  const handleChallenge = async (targetUser: any) => {
    if (!user || !profile) return;
    if (!selectedTopicId) {
      setToastOptions({ message: "Please select a topic first!", type: 'error' });
      return;
    }
    
    // Optimistically update UI
    setChallengedUserIds(prev => new Set(prev).add(targetUser.uid));
    expectingMatchRef.current = true;
    
    const id = await sendDirectChallenge(user.uid, profile.displayName, targetUser.uid, targetUser.displayName || 'User', selectedTopicId, gameMode);
    if (!id) {
       setToastOptions({ message: "Failed to send challenge.", type: 'error' });
       setChallengedUserIds(prev => {
          const next = new Set(prev);
          next.delete(targetUser.uid);
          return next;
       });
    } else {
       setToastOptions({ message: `Challenge sent to ${targetUser.displayName}! Waiting for response...`, type: 'success' });
    }
  };

  const handleAcceptChallenge = async () => {
    if (!incomingChallenge || !profile) return;
    setLoading(true);
    expectingMatchRef.current = true;
    const topics = profile.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
    const topic = topics.find(t => t.id === incomingChallenge.topicId) || topics[0];
    
    try {
      const questions = await getQuestions(topic.id);
      const finalQuestions: Question[] = questions.length > 0 ? questions : [
         { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3, level: 'secondary', topicId: topic.id, explanation: "" }
      ];
      await respondDirectChallenge(incomingChallenge.id, 'accepted', finalQuestions);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleDeclineChallenge = async () => {
    if (!incomingChallenge) return;
    await respondDirectChallenge(incomingChallenge.id, 'declined');
  };

  const handleAnswer = (correct: boolean) => {
    if (!currentMatchIdRef.current || !user || waitingForOpponent || showAnswerFeedback) return;
    
    setShowAnswerFeedback(correct ? 'correct' : 'incorrect');
    
    // Minimal delay to see feedback
    setTimeout(async () => {
      try {
        await submitMatchAnswer(currentMatchIdRef.current!, user.uid, correct, currentQuestion);
        setWaitingForOpponent(true);
      } catch (error) {
        console.error(error);
        setToastOptions({ message: "Network error submitting answer", type: 'error' });
      } finally {
        setShowAnswerFeedback(null);
      }
    }, 1200);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !matchData?.matchId || !user) return;
    
    sendMatchMessage(matchData.matchId, user.uid, profile?.displayName || 'User', chatInput);
    setChatInput('');
  };

  const handleRematch = async () => {
    if (!matchData?.matchId || !user) return;
    setRematchRequested(true);
    await requestMatchRematch(matchData.matchId, profile?.displayName || 'User', user.uid);
  };

  const cancelMatchFound = async () => {
    if (!pendingMatch || !user) return;
    forfeitMatch(pendingMatch.matchId, user.uid);
    setMatchFoundState(false);
    setPendingMatch(null);
    setDuelStarted(false);
    currentMatchIdRef.current = null;
  };

  const resumeBannerMatch = () => {
    if (!activeMatchBanner) return;
    const myMatch = activeMatchBanner;
    currentMatchIdRef.current = myMatch.matchId;
    
    const me = myMatch.players.find((p: any) => p.id === user?.uid);
    const opponent = myMatch.players.find((p: any) => p.id !== user?.uid);
    setPlayers([me, opponent]);
    setMatchData(myMatch);
    setDuelStarted(true);
    if (me) setCurrentQuestion(me.currentQuestion);
    setWaitingForOpponent(myMatch.currentTurnUid !== user?.uid);
    setActiveMatchBanner(null);
  };

  const forfeitBannerMatch = () => {
    if (!activeMatchBanner || !user) return;
    forfeitMatch(activeMatchBanner.matchId, user.uid);
    setActiveMatchBanner(null);
  };

  const handleQuit = async () => {
    if (!currentMatchIdRef.current || !user) return;
    if (confirm("Are you sure you want to resign this match?")) {
      await forfeitMatch(currentMatchIdRef.current, user.uid);
    }
  };

  const acceptRematch = async () => {
    if (!matchData?.matchId || !profile) return;
    setLoading(true);
    setDuelStarted(true);
    const topics = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
    const topic = topics.find(t => t.id === matchData.topicId) || topics[0];
    
    const questions = await getQuestions(topic.id);
    
    const finalQuestions: Question[] = questions.length > 0 ? questions : [
       { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3, level: 'secondary', topicId: topic.id, explanation: "" }
    ];
    await acceptMatchRematch(matchData.matchId, finalQuestions);
    setLoading(false);
  };

  const toggleSearching = async () => {
    if (!user || !profile) return;
    
    if (isSearching) {
      setIsSearching(false);
      leaveMatchmaking(user.uid);
      clearInterval(searchTimerRef.current);
      setSearchTime(0);
    } else {
      if (!selectedTopicId) {
        alert("Please select a topic first!");
        return;
      }
      
      setLoading(true);
      const topics = profile.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
      const topic = topics.find(t => t.id === selectedTopicId);
      if (!topic) {
        setLoading(false);
        return;
      }

      try {
        const questions = await getQuestions(topic.id);
        const finalQuestions: Question[] = questions.length > 0 ? questions : [
          { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3, level: 'secondary', topicId: topic.id, explanation: "" }
        ];

        setIsSearching(true);
        setSearchTime(0);
        searchTimerRef.current = setInterval(() => setSearchTime(prev => prev + 1), 1000);

        const matchResult = await enterMatchmaking({ uid: user.uid, displayName: profile.displayName, points: profile.points || 0 }, selectedTopicId, finalQuestions, gameMode);
        
        if (matchResult === null) {
             // Success putting in queue
        } else if (matchResult) {
            // Match found immediately - snapshot takes over
        }
      } catch (e) {
        console.error(e);
        setIsSearching(false);
      } finally {
        setLoading(false);
      }
    }
  };
  if (finished) {
    const me = players.find(p => p.id === user?.uid);
    const opponent = players.find(p => p.id !== user?.uid);
    const won = me.score > opponent.score;
    const draw = me.score === opponent.score;

    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-paper transition-colors duration-300 relative overflow-y-auto py-12">
        {/* Victory/Defeat Background Glow */}
        <div className={cn(
          "absolute inset-0 pointer-events-none blur-[120px] opacity-20 transition-all duration-1000",
          won ? "bg-sky-500" : draw ? "bg-slate-500" : "bg-rose-500"
        )} />
        
        <motion.div 
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center max-w-xl w-full relative z-10 backdrop-blur-3xl"
        >
          <div className="mb-16">
            <div className="relative inline-block">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  "absolute inset-0 rounded-full blur-2xl",
                  won ? "bg-sky-500" : draw ? "bg-slate-500" : "bg-rose-500"
                )}
              />
              <div className={cn(
                "w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all relative z-10 border-2",
                won ? "bg-sky-500 text-white shadow-2xl shadow-sky-500/40 border-sky-400" : draw ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700" : "bg-rose-500 text-white shadow-2xl shadow-rose-500/40 border-rose-400"
              )}>
                <Trophy size={64} className={won ? "animate-bounce" : ""} />
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white mb-4 uppercase font-display italic">
              {won ? 'Victory' : draw ? 'Stalemate' : 'Defeat'}
            </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-[1px] bg-slate-400 dark:bg-slate-800" />
                <p className="text-[10px] text-slate-700 dark:text-slate-500 font-bold uppercase tracking-[0.4em]">Arena Results</p>
                <div className="w-8 h-[1px] bg-slate-400 dark:bg-slate-800" />
              </div>
              {matchData?.forfeitedBy && (
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 animate-pulse">
                   {matchData.forfeitedBy === user?.uid ? "Match Resigned" : "Opponent Forfeited"}
                </p>
              )}
          </div>

          <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 mb-16 shadow-inner">
            <div className="bg-slate-100 dark:bg-slate-900/50 p-6 md:p-12 group transition-colors hover:bg-white dark:hover:bg-slate-900">
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Your Score</p>
              <p className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{me?.score}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900/50 p-6 md:p-12 group transition-colors hover:bg-white dark:hover:bg-slate-900">
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Opponent</p>
              <p className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{opponent?.score}</p>
            </div>
          </div>

          <div className="space-y-6">
            {rematchOffered ? (
              <div className="bg-sky-100 dark:bg-sky-900/20 p-10 rounded-[3rem] mb-10 border border-sky-200 dark:border-sky-900/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl transition-all" />
                <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 mb-8 uppercase tracking-[0.3em] relative z-10">
                  {rematchOffered.challengerName} is seeking redemption
                </p>
                <button 
                  onClick={acceptRematch}
                  disabled={loading}
                  className="w-full bg-sky-600 text-white font-bold py-6 rounded-2xl hover:bg-sky-700 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-sky-500/30 uppercase tracking-[0.3em] text-[10px] relative z-10"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                  Accept Rematch
                </button>
              </div>
            ) : (
              <button 
                onClick={handleRematch}
                disabled={rematchRequested}
                className="w-full bg-slate-900 dark:bg-sky-600 text-white font-bold py-6 rounded-2xl hover:bg-slate-800 dark:hover:bg-sky-500 transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[10px] shadow-xl"
              >
                {rematchRequested ? <Loader2 className="animate-spin" size={20} /> : <Swords size={20} />}
                {rematchRequested ? 'Waiting for response...' : 'Request Rematch'}
              </button>
            )}
            
            <button 
              onClick={() => {
                setMatchData(null);
                setFinished(false);
                setDuelStarted(false);
                currentMatchIdRef.current = null;
              }}
              className="w-full py-6 text-slate-700 dark:text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-all text-[10px] uppercase tracking-[0.4em] group"
            >
              <span className="group-hover:tracking-[0.6em] transition-all">Return to Lobby</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (matchData) {
    const me = players.find(p => p.id === user?.uid);
    const opponent = players.find(p => p.id !== user?.uid);
    const displayQuestionIndex = waitingForOpponent ? (opponent?.currentQuestion || 0) : currentQuestion;
    const q = matchData.questions[displayQuestionIndex];

    if (!q) {
        return (
          <div className="min-h-screen bg-paper flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
          </div>
        );
    }

    return (
      <div className="min-h-screen bg-[#161512] pb-24 md:pb-0 text-[#f1f1f1] flex flex-col md:flex-row font-sans md:overflow-auto">
        {toastOptions && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300" 
               style={{ backgroundColor: toastOptions.type === 'error' ? '#ef4444' : '#10b981', color: '#fff' }}>
            {toastOptions.message}
          </div>
        )}
        {firestoreError && (
          <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center animate-pulse">
            Firestore Connection error - App may be out of sync
          </div>
        )}
        {/* Main Game Area */}
        <div className={cn(
          "flex-1 flex flex-col items-center justify-center p-4 md:p-8 space-y-4 transition-all duration-300 overflow-y-auto md:overflow-visible",
          mobileTab !== 'board' && "hidden md:flex"
        )}>
          <div className="w-full max-w-[700px] flex flex-col space-y-3 md:space-y-4 relative">
            
            {/* Top Bar: Mode Indicator + Quick Quits */}
            <div className="flex items-center justify-between mb-2">
               <div className="w-16"></div> {/* Spacer for alignment */}
               <div className="bg-[#262421] border border-white/5 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-xl">
                  {MODE_CONFIGS[matchData.gameMode as keyof typeof MODE_CONFIGS]?.icon}
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hidden md:inline">
                     {MODE_CONFIGS[matchData.gameMode as keyof typeof MODE_CONFIGS]?.label || 'Blitz'}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500/80">Q{displayQuestionIndex + 1}/{matchData.questions.length}</span>
               </div>
               <button onClick={handleQuit} className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-400 font-black tracking-widest uppercase text-[9px] rounded-full transition-all border border-rose-500/20 group">
                  <XCircle size={12} className="group-hover:rotate-90 transition-transform" />
                  <span className="hidden md:inline">Resign</span>
               </button>
            </div>

            {/* Opponent Panel */}
            <div className={cn(
              "flex items-center justify-between bg-[#262421] rounded-lg p-2 md:p-3 shadow-lg border transition-all",
              (matchData.currentTurnUid !== user?.uid || waitingForOpponent) ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "border-white/5"
            )}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-lg flex items-center justify-center font-bold text-lg md:text-xl text-white border border-white/10 shrink-0">
                  {opponent?.displayName?.[0] || 'O'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm md:text-lg font-bold truncate">{opponent?.displayName || 'Opponent'}</p>
                    {(matchData.currentTurnUid !== user?.uid || waitingForOpponent) && (
                      <span className="text-[8px] md:text-[10px] bg-emerald-500 text-white px-1 md:px-1.5 py-0.5 rounded font-black uppercase animate-pulse shrink-0">Thinking</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-xs text-white/40 flex items-center gap-1">
                      <Swords size={10} />
                      Score: {opponent?.score || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className={cn(
                "px-4 py-2 md:px-6 md:py-3 rounded-lg font-mono text-xl md:text-3xl font-bold border-2 transition-all shrink-0",
                (matchData.currentTurnUid !== user?.uid || waitingForOpponent) ? "bg-emerald-500/10 border-emerald-500 text-white" : "bg-white/5 border-white/10 text-white/40"
              )}>
                {(matchData.currentTurnUid !== user?.uid || waitingForOpponent) ? `00:${timeLeft.toString().padStart(2, '0')}` : '--:--'}
              </div>
            </div>

            {/* Question Area (The "Board") */}
            <div className="relative aspect-square md:aspect-[4/3] w-full bg-[#262421] rounded-xl md:rounded-2xl border-2 md:border-4 border-[#3c3a37] shadow-2xl flex flex-col overflow-hidden">
               {/* Background grid pattern like chess board */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle, #f1f1f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
               
               <div className="flex-1 p-6 md:p-12 flex flex-col relative z-10 overflow-y-auto scrollbar-hide">
                  <AnimatePresence mode="wait">
                    {showAnswerFeedback ? (
                      <motion.div 
                        key="feedback"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-6"
                      >
                         <div className={cn(
                           "w-24 h-24 rounded-full flex items-center justify-center border-4 animate-in zoom-in duration-300",
                           showAnswerFeedback === 'correct' ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : "bg-rose-500/20 border-rose-500 text-rose-500"
                         )}>
                           {showAnswerFeedback === 'correct' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                         </div>
                         <h3 className={cn(
                           "text-4xl font-black uppercase tracking-tighter italic",
                           showAnswerFeedback === 'correct' ? "text-emerald-500" : "text-rose-500"
                         )}>
                           {showAnswerFeedback === 'correct' ? "Brilliant!" : "Blunder!"}
                         </h3>
                         <p className="text-white/40 font-mono text-sm">SWITCHING TURNS...</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={waitingForOpponent ? "opponentQuestion" : "myQuestion"}
                        initial={{ opacity: 0, x: waitingForOpponent ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col"
                      >
                        <div className="mb-6 md:mb-8">
                          <span className={cn(
                            "text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-2 block",
                            waitingForOpponent ? "text-emerald-500 animate-pulse" : "text-sky-400"
                          )}>
                            {waitingForOpponent ? `Opponent's Turn • Q${displayQuestionIndex + 1}` : `Your Turn • Q${displayQuestionIndex + 1}`}
                          </span>
                          <h3 className="text-xl md:text-3xl font-bold leading-tight">
                            {q.question}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-auto">
                          {q.options.map((option: string, i: number) => (
                            <button
                              key={i}
                              disabled={waitingForOpponent}
                              onClick={() => handleAnswer(i === q.correctAnswer)}
                              className={cn(
                                "group relative h-16 md:h-20 rounded-xl border-l-[4px] md:border-l-[6px] transition-all text-left px-4 md:px-6 flex items-center gap-3 md:gap-4 overflow-hidden",
                                waitingForOpponent 
                                  ? "bg-[#3c3a37] border-[#312e2b] opacity-60 cursor-not-allowed"
                                  : "bg-[#3c3a37] hover:bg-[#484643] border-[#312e2b] hover:border-sky-500 cursor-pointer"
                              )}
                            >
                               <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-black/20 flex items-center justify-center font-mono font-bold text-sm md:text-lg text-white/20 transition-colors shrink-0 group-hover:text-sky-500/50">
                                 {String.fromCharCode(65 + i)}
                               </div>
                               <span className={cn(
                                 "text-sm md:text-lg font-medium tracking-tight text-white transition-transform line-clamp-2",
                                 !waitingForOpponent && "group-hover:translate-x-1"
                               )}>{option}</span>
                               {!waitingForOpponent && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               {/* Game Progress Bar */}
               <div className="h-1.5 md:h-2 bg-black/40 flex">
                  {matchData.questions.map((_: any, i: number) => {
                    const myProgress = me?.currentQuestion || 0;
                    const oppProgress = opponent?.currentQuestion || 0;
                    return (
                      <div 
                        key={i}
                        className={cn(
                          "flex-1 h-full border-r border-black/20 transition-all flex",
                          i < Math.min(myProgress, oppProgress) ? "bg-emerald-500" : "bg-transparent"
                        )}
                      >
                         <div className={cn("flex-1 h-full", i === myProgress && matchData.currentTurnUid === user?.uid && !waitingForOpponent ? "bg-sky-500 animate-pulse" : "")} />
                         <div className={cn("flex-1 h-full", i === oppProgress && (matchData.currentTurnUid !== user?.uid || waitingForOpponent) ? "bg-emerald-500/50 animate-pulse" : "")} />
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* My Panel */}
            <div className={cn(
              "flex items-center justify-between bg-[#262421] rounded-lg p-2 md:p-3 shadow-lg border-2 transition-all",
              (matchData.currentTurnUid === user?.uid && !waitingForOpponent) ? "border-sky-500" : "border-white/5"
            )}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-lg md:text-xl text-white border shrink-0",
                  (matchData.currentTurnUid === user?.uid && !waitingForOpponent) ? "bg-sky-500 border-sky-400" : "bg-white/10 border-white/10"
                )}>
                  {profile?.displayName?.[0] || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm md:text-lg font-bold truncate">You</p>
                    {matchData.currentTurnUid === user?.uid && !waitingForOpponent && (
                      <span className="text-[8px] md:text-[10px] bg-sky-500 text-white px-1 md:px-1.5 py-0.5 rounded font-black uppercase shrink-0">Your Turn</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] md:text-xs text-emerald-400 flex items-center gap-1">
                      <Trophy size={10} />
                      Score: {me?.score || 0}
                    </span>
                    <button 
                      onClick={handleQuit}
                      className="text-[8px] md:text-[10px] text-rose-500/50 hover:text-rose-500 transition-colors uppercase font-black tracking-widest flex items-center gap-1 border border-rose-500/20 px-1.5 py-0.5 rounded"
                    >
                      Resign
                    </button>
                  </div>
                </div>
              </div>
              <div className={cn(
                "px-4 py-2 md:px-6 md:py-3 rounded-lg font-mono text-xl md:text-3xl font-bold border-2 transition-all shrink-0",
                matchData.currentTurnUid === user?.uid && !waitingForOpponent
                  ? timeLeft <= 5 ? "bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse" : "bg-sky-500/10 border-sky-500 text-white" 
                  : "bg-white/5 border-white/10 text-white/40"
              )}>
                {matchData.currentTurnUid === user?.uid && !waitingForOpponent ? `00:${timeLeft.toString().padStart(2, '0')}` : '--:--'}
              </div>
            </div>
            
          </div>
        </div>

        {/* Sidebar (Analysis/Chat) */}
        <div className={cn(
          "flex-1 md:flex-none w-full md:w-[320px] bg-[#262421] border-l border-black/20 flex flex-col transition-all duration-300",
          mobileTab !== 'analysis' && "hidden md:flex"
        )}>
           {/* Header tabs */}
           <div className="flex border-b border-black/20 p-1">
              <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-[#f1f1f1] border-b-2 border-sky-500 transition-all">Move History</button>
              <button onClick={() => setIsChatOpen(!isChatOpen)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Analysis</button>
              <button onClick={handleQuit} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-all border-l border-white/5 flex items-center gap-2">
                <XCircle size={12} />
                Resign
              </button>
           </div>

           {/* History List */}
           <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono scrollbar-hide">
              {matchData.questions.map((_: any, i: number) => {
                const myAnswer = me?.answers?.[i];
                const opponentAnswer = opponent?.answers?.[i];
                const myAsked = i <= (me?.currentQuestion || 0);
                const oppAsked = i <= (opponent?.currentQuestion || 0);

                const myRes = myAnswer !== undefined ? (myAnswer ? "WIN" : "LOSS") : "...";
                const oppRes = opponentAnswer !== undefined ? (opponentAnswer ? "WIN" : "LOSS") : "...";

                return (
                  <div key={i} className={cn(
                    "flex items-center gap-4 p-2 rounded transition-colors group",
                    (i === me?.currentQuestion || i === opponent?.currentQuestion) ? "bg-white/5 border-l-2 border-sky-500/50" : ""
                  )}>
                    <span className="text-white/20 text-[10px] w-6">{i + 1}.</span>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                       <div className={cn(
                         "h-7 rounded flex items-center justify-center text-[8px] font-bold uppercase tracking-tighter transition-all",
                         myAnswer !== undefined
                          ? myAnswer ? "bg-emerald-500/20 text-emerald-500 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]" : "bg-rose-500/20 text-rose-500"
                          : "bg-black/40 text-white/5"
                       )}>
                         {myRes}
                       </div>
                       <div className={cn(
                         "h-7 rounded flex items-center justify-center text-[8px] font-bold uppercase tracking-tighter transition-all opacity-60",
                         opponentAnswer !== undefined
                          ? opponentAnswer ? "bg-emerald-500/10 text-emerald-500/60" : "bg-rose-500/10 text-rose-500/60"
                          : "bg-black/40 text-white/5"
                       )}>
                         {oppRes}
                       </div>
                    </div>
                  </div>
                );
              })}
           </div>

           {/* Chat Section */}
           <div className="h-[250px] md:h-[250px] border-t border-black/20 flex flex-col bg-black/10">
              <div className="p-3 border-b border-black/10 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   Live Chat
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {messages.length === 0 ? (
                   <p className="text-[10px] text-white/20 text-center mt-4 italic">No messages yet...</p>
                 ) : (
                   messages.map((m, i) => (
                     <div key={i} className="flex gap-2 text-xs leading-relaxed">
                        <span className="font-bold text-sky-400 shrink-0">{m.senderName}:</span>
                        <span className="text-white/80">{m.message}</span>
                     </div>
                   ))
                 )}
                 <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-3">
                 <div className="bg-black/20 rounded border border-white/5 p-1 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none outline-none text-xs px-2 py-1 placeholder:text-white/10"
                    />
                    <button type="submit" className="p-1 px-3 bg-[#3c3a37] text-white/40 hover:text-white rounded text-[10px] font-black uppercase tracking-widest transition-colors">Send</button>
                 </div>
              </form>
           </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden flex h-16 bg-[#161512] border-t border-white/5 pb-2 shrink-0">
           <button 
             onClick={() => setMobileTab('board')}
             className={cn(
               "flex-1 flex flex-col items-center justify-center gap-1 transition-all",
               mobileTab === 'board' ? "text-sky-400" : "text-white/40"
             )}
           >
             <Swords size={20} className={cn("transition-transform", mobileTab === 'board' && "scale-110")} />
             <span className="text-[10px] font-black uppercase tracking-tighter">Arena</span>
             {mobileTab === 'board' && <div className="w-1 h-1 bg-sky-400 rounded-full mt-1" />}
           </button>
           <button 
             onClick={() => setMobileTab('analysis')}
             className={cn(
               "flex-1 flex flex-col items-center justify-center gap-1 transition-all",
               mobileTab === 'analysis' ? "text-sky-400" : "text-white/40"
             )}
           >
             <div className="relative">
                <MessageSquare size={20} className={cn("transition-transform", mobileTab === 'analysis' && "scale-110")} />
                {messages.length > 0 && mobileTab !== 'analysis' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-[#161512]" />
                )}
             </div>
             <span className="text-[10px] font-black uppercase tracking-tighter">Logs</span>
             {mobileTab === 'analysis' && <div className="w-1 h-1 bg-sky-400 rounded-full mt-1" />}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pt-8 md:pt-16 pb-24 px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Searching Overlay */}
        <AnimatePresence>
          {(isSearching || matchFoundState) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/98 dark:bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-8 overflow-hidden"
            >
              {/* Atmospheric Background Gradients */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.4)_100%)]" />
              </div>

              <div className="text-center max-w-lg w-full relative z-10">
                {matchFoundState ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-16"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-sky-500/20 rounded-full blur-3xl"
                      />
                      <div className="w-48 h-48 bg-sky-500 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(14,165,233,0.3)] border border-sky-400 relative z-10">
                        <Swords size={96} className="text-white animate-bounce" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter uppercase font-display italic">Match Found!</h2>
                      <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-12 h-[1px] bg-sky-500/30" />
                        <p className="text-sky-400 font-bold uppercase tracking-[0.5em] text-[10px]">
                          {pendingMatch?.gameMode ? (`Ready for ${MODE_CONFIGS[pendingMatch.gameMode as keyof typeof MODE_CONFIGS]?.label || 'Duel'}`) : 'Initializing Duel Arena'}
                        </p>
                        <div className="w-12 h-[1px] bg-sky-500/30" />
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <button 
                          onClick={enterDuel}
                          className="btn-premium px-12 py-5 text-sm uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(14,165,233,0.3)] animate-bounce"
                        >
                          Start Duel
                        </button>
                        <button 
                          onClick={cancelMatchFound}
                          className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60 transition-all"
                        >
                          Cancel & Return to Lobby
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 md:gap-16">
                      <div className="text-center group">
                        <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-white mb-6 font-bold text-4xl border border-white/10 shadow-2xl backdrop-blur-md group-hover:border-sky-500/50 transition-colors">
                          {profile?.displayName?.[0]}
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">{profile?.displayName}</p>
                        <p className="text-[8px] text-sky-500/50 font-bold uppercase tracking-widest mt-1">Player 1</p>
                      </div>

                      <div className="relative">
                        <div className="text-5xl font-black text-white/5 italic font-display select-none">VS</div>
                        <motion.div 
                          animate={{ height: ['0%', '100%', '0%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-1/2 top-0 w-[1px] bg-gradient-to-b from-transparent via-sky-500/50 to-transparent -translate-x-1/2"
                        />
                      </div>

                      <div className="text-center group">
                        <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-white mb-6 font-bold text-4xl border border-white/10 shadow-2xl backdrop-blur-md group-hover:border-rose-500/50 transition-colors">
                          {players.find((p: any) => p.id !== user?.uid)?.displayName?.[0] || '?'}
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">{players.find((p: any) => p.id !== user?.uid)?.displayName || 'Opponent'}</p>
                        <p className="text-[8px] text-rose-500/50 font-bold uppercase tracking-widest mt-1">Player 2</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="relative w-48 h-48 mx-auto mb-20">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-[1px] border-dashed border-sky-500/20 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-[1px] border-dashed border-indigo-500/20 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-sky-500 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <Users size={64} className="text-sky-500 animate-pulse" />
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-sky-500 rounded-full blur-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter uppercase font-display italic">Searching...</h2>
                    
                    <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full mb-12 backdrop-blur-md">
                      <Timer size={16} className="text-sky-400" />
                      <p className="text-sky-400 font-mono text-2xl font-bold tracking-tighter">
                        {Math.floor(searchTime / 60)}:{(searchTime % 60).toString().padStart(2, '0')}
                      </p>
                    </div>

                    <p className="text-slate-500 text-sm mb-20 font-medium leading-relaxed max-w-xs mx-auto">
                      Scanning the arena for a worthy opponent in <br />
                      <span className="text-white font-bold text-lg block mt-2 tracking-tight">
                        {(profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP).find(t => t.id === selectedTopicId)?.title || 'Selected Topic'}
                      </span>
                    </p>

                    <button
                      onClick={toggleSearching}
                      className="w-full py-6 bg-white/5 text-white font-bold rounded-[2rem] hover:bg-white/10 transition-all border border-white/10 uppercase tracking-[0.4em] text-[10px] hover:border-rose-500/30 hover:text-rose-400 group"
                    >
                      <span className="group-hover:scale-110 transition-transform inline-block">Abstain from Combat</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Incoming Challenge Modal */}
          {incomingChallenge && !matchData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-8"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Swords className="text-sky-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 uppercase font-display tracking-tight">Challenge</h3>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                   <div className="px-3 py-1 bg-sky-500/10 rounded-full border border-sky-500/20 flex items-center gap-2">
                      {MODE_CONFIGS[incomingChallenge.gameMode as keyof typeof MODE_CONFIGS]?.icon}
                      <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">
                         {MODE_CONFIGS[incomingChallenge.gameMode as keyof typeof MODE_CONFIGS]?.label || 'Blitz'}
                      </span>
                   </div>
                </div>

                <p className="text-slate-500 text-sm mb-8 font-medium">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{incomingChallenge.challengerName}</span> has challenged you!
                </p>
                <div className="flex gap-4">
                  <button onClick={handleDeclineChallenge} className="flex-1 py-4 font-bold rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Decline</button>
                  <button onClick={handleAcceptChallenge} className="flex-1 py-4 font-bold rounded-2xl bg-sky-500 text-white shadow-[0_4px_0_theme(colors.sky.700)] active:translate-y-1 active:shadow-none transition-all">Accept</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeMatchBanner && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <Timer className="text-amber-500" size={24} />
                <div>
                  <h3 className="font-bold text-amber-500 text-sm uppercase tracking-wider">Match In Progress!</h3>
                  <p className="text-amber-500/70 text-xs">You have an unfinished duel. Resume or forfeit to start a new one.</p>
                </div>
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={forfeitBannerMatch} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-amber-500/10 text-amber-500 text-[10px] font-bold hover:bg-amber-500/20 transition-all uppercase tracking-widest border border-amber-500/20">Forfeit</button>
                <button onClick={resumeBannerMatch} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-amber-500 text-slate-900 text-[10px] font-black hover:bg-amber-400 transition-all uppercase tracking-widest shadow-[0_4px_0_theme(colors.amber.600)] active:translate-y-1 active:shadow-none">Resume</button>
             </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 border-b-4 border-slate-200 dark:border-slate-800 pb-16 relative">
          <div className="relative z-10 w-full md:w-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
              <span className="text-[12px] font-black text-sky-700 dark:text-sky-400 uppercase tracking-widest">Live Arena</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6 uppercase block font-display shadow-sm break-words md:break-normal w-full">Duel Arena</h1>
            <p className="text-slate-700 dark:text-slate-500 text-base font-bold leading-relaxed w-full md:max-w-md">
              Challenge peers in real-time economic combat. <br className="hidden md:block" />
              <span className="text-slate-900 dark:text-slate-300">Climb the global leaderboard and claim your status.</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10 w-full md:w-auto mt-6 md:mt-0">
            <button
              onClick={toggleSearching}
              className={cn(
                "px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none flex items-center gap-4 group",
                isSearching
                  ? "bg-rose-500 text-white hover:bg-rose-600 border-b-4 border-rose-700"
                  : "bg-blue-500 text-white hover:bg-blue-600 border-b-4 border-blue-700"
              )}
            >
              <Zap size={20} className={cn("transition-transform group-hover:scale-110", isSearching && "animate-pulse")} />
              {isSearching ? "In Matchmaking" : "Enter Arena Queue"}
            </button>
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 px-6 py-4 rounded-xl shadow-sm flex items-center gap-5 backdrop-blur-md">
              <Users size={20} className="text-slate-400 dark:text-slate-600" />
              <div className="flex flex-col">
                 <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{lobbyUsers.filter(u => u.status === 'searching').length} in Queue</span>
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{lobbyUsers.length} Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar: Topic & Mode Selection */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm mb-16 flex flex-col lg:flex-row items-stretch md:items-center gap-8 md:gap-10">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Combat Topic</label>
            <div className="relative">
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 px-8 py-5 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-8 focus:ring-sky-500/5 transition-all appearance-none cursor-pointer"
              >
                <option value="">Choose a topic...</option>
                {(profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP).map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
              <ChevronRight size={20} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 dark:text-slate-600 pointer-events-none" />
            </div>
          </div>

          <div className="w-full lg:w-[450px]">
            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Speed Control</label>
            <div className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800">
               {(Object.keys(MODE_CONFIGS) as Array<keyof typeof MODE_CONFIGS>).map((mode) => (
                 <button
                    key={mode}
                    onClick={() => setGameMode(mode)}
                    className={cn(
                      "flex-1 py-4 px-3 rounded-xl flex items-center justify-center gap-3 transition-all",
                      gameMode === mode 
                        ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-sky-600 dark:text-sky-400" 
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
                    )}
                 >
                    {MODE_CONFIGS[mode].icon}
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-tighter">{MODE_CONFIGS[mode].label}</span>
                        <span className="text-[8px] font-bold opacity-40">{MODE_CONFIGS[mode].questions} Q / {MODE_CONFIGS[mode].time}s</span>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Lobby Grid */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              id="lobby-search-input"
              type="text"
              value={lobbySearchQuery}
              onChange={(e) => setLobbySearchQuery(e.target.value)}
              placeholder="Search opponent by name..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-8 focus:ring-sky-500/5 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span>{lobbyUsers.filter(u => u.uid !== user?.uid && u.displayName?.toLowerCase().includes(lobbySearchQuery.toLowerCase())).length} Results</span>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
             <span>Lobby Filter</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            {lobbyUsers
              .filter(u => u.uid !== user?.uid && u.displayName?.toLowerCase().includes(lobbySearchQuery.toLowerCase()))
              .map((u, i) => (
            <motion.div
              key={u.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-gamified p-8 relative overflow-hidden group border-[3px] border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-[0_8px_0_theme(colors.indigo.200)] translate-y-[-4px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/0 group-hover:bg-indigo-500/10 rounded-full blur-3xl transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl border-b-4 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-3xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
                  {u.displayName ? u.displayName[0] : '?'}
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all font-black text-[10px] uppercase tracking-widest",
                  u.status === 'searching' 
                    ? "bg-amber-100 border-amber-300 text-amber-700" 
                    : u.status === 'playing' 
                      ? "bg-slate-100 border-slate-300 text-slate-500" 
                      : "bg-emerald-100 border-emerald-300 text-emerald-700"
                )}>
                  {u.status === 'searching' ? "Queue" : u.status === 'playing' ? "In Duel" : "Idle"}
                </div>
              </div>
              <div className="mb-10 relative z-10">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{u.displayName}</h3>
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">Online</span>
                  </div>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{u.level || 'Economics'} Scholar</p>
              </div>
              <button
                onClick={() => handleChallenge(u)}
                disabled={u.status !== 'idle' || challengedUserIds.has(u.uid)}
                className={cn("w-full btn-premium justify-center", (u.status !== 'idle' || challengedUserIds.has(u.uid)) && "opacity-50")}
              >
                {challengedUserIds.has(u.uid) ? 'Pending...' : 
                 u.status === 'idle' ? 'Challenge' : 
                 u.status === 'searching' ? 'Wait in Queue' : 'In Duel'}
              </button>
            </motion.div>
          ))}
          
            {lobbyUsers.length <= 1 && (
              <div className="col-span-full py-24 text-center rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Users className="text-slate-200 dark:text-slate-700" size={40} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tighter uppercase font-display">Arena is Empty</h3>
                <p className="text-slate-500 font-medium">Be the first to enter the matchmaking queue.</p>
              </div>
            )}
          </div>

          {/* Sidebar: Leaderboard & Stats */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2">
                <Trophy size={14} className="text-amber-500" />
                Top Gladiators
              </h3>
              <div className="space-y-4">
                {leaderboard.map((u, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-[8px] font-bold text-slate-400 group-hover:text-sky-500 transition-colors uppercase">#{i+1}</span>
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-900 dark:text-white group-hover:bg-sky-500 group-hover:text-white transition-all">
                        {u.displayName?.[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate flex-1 group-hover:text-slate-900 transition-colors">{u.displayName || 'Unknown'}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">{u.points || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
               <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 relative z-10 text-indigo-100">Live Status</h3>
               <p className="text-2xl font-bold tracking-tight mb-8 relative z-10">Arena Heat Map</p>
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-200">
                    <span>Active Duels</span>
                    <span>{Math.floor(lobbyUsers.length / 2)}</span>
                  </div>
                  <div className="w-full h-1 bg-indigo-400/30 rounded-full" />
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-200">
                    <span>Searching</span>
                    <span>{lobbyUsers.filter(u => u.status === 'searching').length}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
