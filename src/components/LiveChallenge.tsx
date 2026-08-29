import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../useAuth';
import { getQuestions, updatePoints, saveDuelResult, db, enterMatchmaking, leaveMatchmaking, submitMatchAnswer, timeoutMatchTurn, forfeitMatch, sendMatchMessage, requestMatchRematch, acceptMatchRematch, getAllUsers, sendDirectChallenge, respondDirectChallenge, updateUserPresence, Question, getLeaderboard, unlockBadge } from '../firebase';
import { onSnapshot, collection, query, doc, getDoc, orderBy, where, updateDoc } from 'firebase/firestore';
import { useRoadmap } from '../hooks/useRoadmap';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Zap, Trophy, Loader2, User, Swords, CheckCircle2, XCircle, Timer, MessageSquare, Send, ChevronRight, Search, Flag, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FALLBACK_QUESTIONS: Question[] = [
  { question: "What is the primary subject matter of Economics?", options: ["Wealth accumulation only", "Scarcity and choice under limited resources", "Stock market trading algorithms", "Government tax collection"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Economics is the study of allocation of scarce resources among competing ends." },
  { question: "Which of the following is classified as a land factor of production?", options: ["Machinery", "Natural mineral deposits", "Bank deposits", "Entrepreneurial skill"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Land encompasses all natural resources provided by nature." },
  { question: "A market equilibrium occurs when:", options: ["Price equals zero", "Quantity demanded equals quantity supplied", "Government sets a price ceiling", "Imports exceed exports"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Equilibrium is reached when quantity demanded equals quantity supplied." },
  { question: "What does an upward-sloping supply curve indicate?", options: ["Producers supply less at higher prices", "Producers supply more at higher prices", "Consumers buy more at higher prices", "Price has no effect on supply"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "According to the Law of Supply, higher prices incentivize greater output." },
  { question: "Opportunity cost measures:", options: ["The monetary cost paid", "The value of the next best alternative forgone", "The total accounting profit", "The inflation rate"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Opportunity cost is the foregone benefit of the next best option." },
  { question: "Inflation is best defined as:", options: ["A one-time increase in prices", "A sustained increase in the general price level", "An increase in stock prices", "A decrease in unemployment"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Inflation is a continuous rise in overall prices over time." },
  { question: "Which policy is used by central banks to control money supply?", options: ["Fiscal Policy", "Monetary Policy", "Trade Policy", "Industrial Policy"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Monetary policy regulates interest rates and money supply." },
  { question: "A public good is characterized by:", options: ["Rivalry and Excludability", "Non-rivalry and Non-excludability", "High cost and low demand", "Private ownership"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Public goods can be consumed simultaneously without excluding anyone." },
  { question: "Gross Domestic Product (GDP) measures:", options: ["Total wealth of citizens", "Total market value of goods and services produced within a country", "Government budget surplus", "Total exports minus total gold reserves"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "GDP measures output within a nation's borders." },
  { question: "What happens to price when demand exceeds supply?", options: ["Price tends to fall", "Price tends to rise", "Price remains fixed", "Supply automatically doubles"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Shortage creates upward pressure on prices." },
  { question: "Which market structure has a single seller with no close substitutes?", options: ["Monopoly", "Perfect Competition", "Oligopoly", "Monopolistic Competition"], correctAnswer: 0, level: 'secondary', topicId: 'ss1', explanation: "A monopoly is controlled by a single supplier." },
  { question: "The law of diminishing marginal utility states that as consumption increases:", options: ["Total utility decreases to zero", "Additional satisfaction from each unit decreases", "Price automatically falls", "Demand becomes infinitely elastic"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Marginal utility falls as more units are consumed." },
  { question: "Fiscal policy is implemented through changes in:", options: ["Interest rates and reserve ratios", "Government spending and taxation", "Exchange rates and tariffs", "Money supply and credit limits"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Fiscal policy uses taxation and government spending." },
  { question: "In economics, 'capital' as a factor of production refers to:", options: ["Money in bank accounts", "Man-made assets used in production", "Shares of stocks", "Raw land"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Capital includes physical tools, machinery, and buildings used in production." },
  { question: "Elasticity of demand measures:", options: ["The absolute price of a good", "Responsiveness of quantity demanded to a price change", "Cost of production", "Income level of producers"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Elasticity measures sensitivity of quantity demanded to price changes." },
  { question: "Deflation is characterized by:", options: ["Rising prices and low interest rates", "A sustained decrease in the general price level", "High inflation and high unemployment", "Increased government spending"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Deflation is a persistent decline in general price levels." },
  { question: "When marginal cost equals marginal revenue, a firm:", options: ["Maximizes total profit", "Minimizes total revenue", "Breaks even with zero cost", "Shuts down immediately"], correctAnswer: 0, level: 'secondary', topicId: 'ss1', explanation: "Profit is maximized where MR = MC." },
  { question: "A tariff is best defined as a tax on:", options: ["Domestically produced goods", "Imported goods and services", "Corporate profits", "Individual income"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "Tariffs are duties imposed on imported items." },
  { question: "Which curve shows the relationship between tax rates and tax revenue?", options: ["Lorenz Curve", "Laffer Curve", "Phillips Curve", "Indifference Curve"], correctAnswer: 1, level: 'secondary', topicId: 'ss1', explanation: "The Laffer Curve illustrates tax revenue at varying tax rates." },
  { question: "A negative externality in production results in:", options: ["Overproduction relative to social optimum", "Underproduction relative to social optimum", "Zero social cost", "Equal private and social benefits"], correctAnswer: 0, level: 'secondary', topicId: 'ss1', explanation: "Negative externalities lead to social costs exceeding private costs." }
];

const getQuestionForPlayer = (match: any, playerIndex: number, qIndexForPlayer: number) => {
  if (!match?.questions || match.questions.length === 0) return null;
  const total = match.questions.length;
  const pIndex = playerIndex < 0 ? 0 : playerIndex;
  const globalIndex = (pIndex === 0 ? qIndexForPlayer * 2 : qIndexForPlayer * 2 + 1) % total;
  return match.questions[globalIndex];
};

export const LiveChallenge: React.FC = () => {
  const { user, profile } = useAuth();
  
  const level = profile?.level || 'secondary';
  const { roadmap } = useRoadmap(level);

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
  const [sidebarTab, setSidebarTab] = useState<'history' | 'analysis'>('history');
  const [selectedAnalysisIndex, setSelectedAnalysisIndex] = useState<number>(0);
  const [toastOptions, setToastOptions] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const parseAnswer = (ans: any) => {
    if (ans === undefined || ans === null) return null;
    if (typeof ans === 'boolean') {
      return { isCorrect: ans, selectedOption: null, timeTaken: null, timedOut: false };
    }
    if (typeof ans === 'object') {
      return {
        isCorrect: !!ans.isCorrect,
        selectedOption: typeof ans.selectedOption === 'number' ? ans.selectedOption : null,
        timeTaken: typeof ans.timeTaken === 'number' ? ans.timeTaken : null,
        timedOut: !!ans.timedOut
      };
    }
    return null;
  };
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

        const unsubMatches = onSnapshot(qMatches, async (snap) => {
      setFirestoreError(false);
      const allMatches = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      const myMatch = allMatches.find(m => m.status !== 'finished');

      if (myMatch) {
         const isMyTurn = myMatch.currentTurnUid === user.uid;
         const me = myMatch.players.find((p: any) => p.id === user.uid);
         const matchDocId = myMatch.id || myMatch.matchId;
         
         if (currentMatchIdRef.current !== matchDocId) {
             const opponent = myMatch.players.find((p: any) => p.id !== user.uid);
             if (isSearching || expectingMatchRef.current || myMatch.status === 'playing') {
                 // New match found from queue or accepted challenge
                 currentMatchIdRef.current = matchDocId;
                 clearInterval(searchTimerRef.current);
                 setSearchTime(0);
                 setIsSearching(false);
                 setPlayers(myMatch.players || [me, opponent]);
                 
                 // Auto-start the duel
                 setMatchData(myMatch);
                 setCurrentQuestion(me?.currentQuestion || 0);
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
         } else {
             // Active match update - directly sync state whenever Firestore updates
             setPlayers(myMatch.players);
             setMatchData(myMatch);
             setDuelStarted(true);
             
             // Directly sync question and turn state from DB
             if (me) {
               setCurrentQuestion(me.currentQuestion || 0);
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
          const activeId = currentMatchIdRef.current || matchData?.matchId || matchData?.id;
          const myFinishedMatch = allMatches.find(m => 
            m.players?.some((p: any) => p.id === user.uid) && 
            m.status === 'finished' && 
            (m.matchId === activeId || m.id === activeId || (duelStarted && activeId))
          );
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

                  let winPoints = 15;
                  let drawPoints = 5;
                  let participationPoints = 2; // loss points

                  const mode = myFinishedMatch.gameMode || 'blitz';
                  if (mode === 'bullet') {
                    winPoints = 10; drawPoints = 3; participationPoints = 1;
                  } else if (mode === 'blitz') {
                    winPoints = 15; drawPoints = 5; participationPoints = 2;
                  } else if (mode === 'rapid') {
                    winPoints = 30; drawPoints = 10; participationPoints = 5;
                  }

                  // --- Gamification Logic Start ---
                  const userRef = doc(db, 'users', user.uid);
                  const userSnap = await getDoc(userRef);
                  const uData = userSnap.data() || {};
                  let duelCount = (uData.duelCount || 0) + 1;
                  let duelWinStreak = uData.duelWinStreak || 0;
                  let duelWins = uData.duelWins || 0;

                  unlockBadge(user.uid, 'social_butterfly');
                  if (duelCount >= 10) unlockBadge(user.uid, 'duel_10');
                  if (duelCount >= 50) unlockBadge(user.uid, 'duel_veteran');
                  if (duelCount >= 100) unlockBadge(user.uid, 'duel_legend');

                  const answerValues = Object.values(me.answers || {});
                  const isFlawless = answerValues.length > 0 && answerValues.every((a: any) => a.isCorrect);
                  if (isFlawless) unlockBadge(user.uid, 'flawless_victory');
                  // --- Gamification Logic End ---

                  if (me.score > opponent.score) {
                    duelWinStreak += 1;
                    duelWins += 1;
                    
                    // Flame Streak Bonus (Chess.com logic)
                    let finalWinPoints = winPoints;
                    if (duelWinStreak >= 3) {
                      finalWinPoints += 5;
                    }
                    
                    updatePoints(user.uid, finalWinPoints); // Win bonus
                    unlockBadge(user.uid, 'first_win');
                    
                    if (duelWins >= 10) unlockBadge(user.uid, 'win_10');
                    if (duelWins >= 25) unlockBadge(user.uid, 'win_25');
                    if (duelWins >= 50) unlockBadge(user.uid, 'win_50');
                    if (duelWins >= 100) unlockBadge(user.uid, 'win_100');
                    if (duelWinStreak >= 5) unlockBadge(user.uid, 'undefeated');

                    saveDuelResult({
                      winnerUid: user.uid,
                      winnerName: profile!.displayName,
                      loserUid: opponent.id,
                      loserName: opponent.displayName,
                      topicId: selectedTopicId || 'General',
                      pointsAwarded: finalWinPoints
                    });
                  } else if (me.score === opponent.score) {
                    updatePoints(user.uid, drawPoints); // Draw
                    duelWinStreak = 0;
                    unlockBadge(user.uid, 'john_nash'); // John Nash Equilibrium badge!
                  } else {
                    updatePoints(user.uid, participationPoints); // Participation
                    duelWinStreak = 0;
                  }
                  
                  updateDoc(userRef, { duelCount, duelWinStreak, duelWins });
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

  const activeTurnPlayer = matchData?.players?.find((p: any) => p.id === matchData?.currentTurnUid);
  const activeQuestionIndex = activeTurnPlayer?.currentQuestion || 0;

  useEffect(() => {
    if (!matchData || finished) return;
    const mode = matchData.gameMode as keyof typeof MODE_CONFIGS || 'blitz';
    const totalTime = MODE_CONFIGS[mode]?.time || 15;

    setTimeLeft(totalTime);
  }, [matchData?.matchId, matchData?.currentTurnUid, activeQuestionIndex, finished]);

  useEffect(() => {
    if (!matchData || finished) return;
    
    const myUid = user?.uid || 'player-1';
    const isMyTurn = matchData.currentTurnUid === myUid;

    const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
            const next = Math.max(0, prev - 1);
            
            if (next === 0 && prev !== 0 && !showAnswerFeedback) {
                if (isMyTurn && !waitingForOpponent) {
                    handleAnswer(false);
                } else if (!isMyTurn || waitingForOpponent) {
                    if (matchData.isDemoMode) {
                        // Demo opponent timed out on their turn!
                        handleDemoOpponentAnswer(false, MODE_CONFIGS[matchData.gameMode as keyof typeof MODE_CONFIGS || 'blitz'].time);
                    } else if (user) {
                        // Safe fallback timeout for opponent if disconnected
                        const opp = matchData?.players?.find((p: any) => p.id !== user.uid);
                        if (opp && matchData.matchId && matchData.currentTurnUid === opp.id) {
                           timeoutMatchTurn(matchData.matchId, opp.id, opp.currentQuestion || 0);
                        }
                    }
                }
            }
            
            return next;
        });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [matchData?.matchId, matchData?.currentTurnUid, activeQuestionIndex, finished, waitingForOpponent, showAnswerFeedback, user]);

  const demoOpponentTimeoutRef = useRef<any>(null);

  const handleDemoOpponentAnswer = (isCorrect: boolean, thinkTimeSeconds: number) => {
    const myUid = user?.uid || 'player-1';
    setPlayers(prevOpp => {
      const oppIndex = prevOpp.findIndex(p => p.id !== myUid);
      const oppPlayer = prevOpp[oppIndex !== -1 ? oppIndex : 1];
      const qIndex = oppPlayer?.currentQuestion || 0;
      const currentQ = getQuestionForPlayer(matchData, oppIndex !== -1 ? oppIndex : 1, qIndex);
      let oppSelectedOpt = 0;
      if (currentQ) {
        if (isCorrect) {
          oppSelectedOpt = currentQ.correctAnswer;
        } else {
          oppSelectedOpt = (currentQ.correctAnswer + 1) % (currentQ.options?.length || 4);
        }
      }

      const updatedOpp = prevOpp.map(p => {
        if (p.id !== myUid) {
          const newOppScore = p.score + (isCorrect ? 100 : 0);
          const nextOppQ = p.currentQuestion + 1;
          const prevAnswers = p.answers || {};
          const newAnswers = {
            ...prevAnswers,
            [qIndex]: {
              isCorrect,
              selectedOption: oppSelectedOpt,
              timeTaken: thinkTimeSeconds
            }
          };
          return { ...p, score: newOppScore, currentQuestion: nextOppQ, answers: newAnswers };
        }
        return p;
      });

      const meNow = updatedOpp.find(p => p.id === myUid);
      const oppNow = updatedOpp.find(p => p.id !== myUid);
      const mode = matchData?.gameMode as keyof typeof MODE_CONFIGS || 'blitz';
      const targetQ = MODE_CONFIGS[mode]?.questions || 5;

      // Add chat feedback for opponent answer
      setMessages(prevMsgs => [
        ...prevMsgs,
        {
          id: `m-${Date.now()}`,
          senderName: oppNow?.displayName || 'Alex',
          text: isCorrect ? `Answered correctly in ${thinkTimeSeconds}s (+100 pts)!` : `Missed Q${(oppNow?.currentQuestion || 1)} after ${thinkTimeSeconds}s!`,
          timestamp: Date.now()
        }
      ]);

      if (meNow && meNow.currentQuestion >= targetQ && oppNow && oppNow.currentQuestion >= targetQ) {
        setFinished(true);
        setDuelStarted(false);
      } else if (meNow && meNow.currentQuestion >= targetQ) {
        setWaitingForOpponent(true);
        const modeTime = MODE_CONFIGS[mode]?.time || 15;
        setMatchData(prev => prev ? ({ ...prev, currentTurnUid: oppNow?.id || 'sample-rival-2' }) : null);
        triggerDemoOpponentTurn(modeTime);
      } else {
        setWaitingForOpponent(false);
        setMatchData(prev => prev ? ({ ...prev, currentTurnUid: myUid }) : null);
        setCurrentQuestion(meNow?.currentQuestion || 0);
      }
      return updatedOpp;
    });
  };

  const triggerDemoOpponentTurn = (modeTime: number) => {
    const thinkTimeSeconds = Math.floor(Math.random() * 2) + 1; // fast 1-2 seconds
    
    if (demoOpponentTimeoutRef.current) clearTimeout(demoOpponentTimeoutRef.current);

    demoOpponentTimeoutRef.current = setTimeout(() => {
      const isCorrect = Math.random() < 0.75;
      handleDemoOpponentAnswer(isCorrect, thinkTimeSeconds);
    }, thinkTimeSeconds * 1000);
  };

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
    const topicId = incomingChallenge.topicId;
    
    try {
      let questions = await getQuestions(topicId);
      
      // Shuffle the admin questions
      for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      // Limit to max 30 questions
      questions = questions.slice(0, 30);
      
      const finalQuestions: Question[] = questions.length >= 5 ? questions : FALLBACK_QUESTIONS;
      await respondDirectChallenge(incomingChallenge.id, 'accepted', finalQuestions);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleDeclineChallenge = async () => {
    if (!incomingChallenge) return;
    await respondDirectChallenge(incomingChallenge.id, 'declined');
  };

  const handleAnswer = (correct: boolean, optionIndex?: number) => {
    if (showAnswerFeedback || waitingForOpponent) return;
    
    setShowAnswerFeedback(correct ? 'correct' : 'incorrect');

    if (matchData?.isDemoMode) {
      setTimeout(() => {
        setShowAnswerFeedback(null);
        const myUid = user?.uid || 'player-1';
        const modeTime = MODE_CONFIGS[matchData.gameMode as keyof typeof MODE_CONFIGS || 'blitz'].time;
        
        // Update user score and question
        setPlayers(prev => {
          const updated = prev.map(p => {
            if (p.id === myUid) {
              const newScore = p.score + (correct ? 100 : 0);
              const nextQ = p.currentQuestion + 1;
              const prevAnswers = p.answers || {};
              const newAnswers = {
                ...prevAnswers,
                [p.currentQuestion]: {
                  isCorrect: correct,
                  selectedOption: typeof optionIndex === 'number' ? optionIndex : null,
                  timeTaken: modeTime - timeLeft
                }
              };
              return { ...p, score: newScore, currentQuestion: nextQ, answers: newAnswers };
            }
            return p;
          });

          const me = updated.find(p => p.id === myUid);
          const opp = updated.find(p => p.id !== myUid);
          const mode = matchData.gameMode as keyof typeof MODE_CONFIGS || 'blitz';
          const targetQ = MODE_CONFIGS[mode]?.questions || 5;

          // Check if both completed target questions
          if (me && me.currentQuestion >= targetQ && opp && opp.currentQuestion >= targetQ) {
            setFinished(true);
            setDuelStarted(false);
          } else {
            // Hand turn over to opponent
            setWaitingForOpponent(true);
            setMatchData(prev => prev ? ({ ...prev, currentTurnUid: 'sample-rival-2' }) : null);
            setTimeLeft(modeTime);
            triggerDemoOpponentTurn(modeTime);
          }
          return updated;
        });
      }, 400);
      return;
    }

    if (!currentMatchIdRef.current || !user) return;
    
    // Minimal delay to see feedback
    setTimeout(async () => {
      try {
        await submitMatchAnswer(currentMatchIdRef.current!, user.uid, correct, currentQuestion, optionIndex);
        setWaitingForOpponent(true);
      } catch (error) {
        console.error(error);
        setToastOptions({ message: "Network error submitting answer", type: 'error' });
      } finally {
        setShowAnswerFeedback(null);
      }
    }, 400);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    if (matchData?.isDemoMode) {
      const myName = profile?.displayName || 'You';
      const userMsg = { id: `m-${Date.now()}`, senderName: myName, text: chatInput, timestamp: Date.now() };
      setMessages(prev => [...prev, userMsg]);
      const currentInput = chatInput;
      setChatInput('');

      setTimeout(() => {
        const replies = [
          "Good answer! Keep it up!",
          "That was a close question!",
          "Nice speed! Let's see who wins this round.",
          "Economics speed is key here!",
          "Great match so far!"
        ];
        const replyText = replies[Math.floor(Math.random() * replies.length)];
        const oppMsg = { id: `m-${Date.now() + 1}`, senderName: 'Alex (Sample Rival)', text: replyText, timestamp: Date.now() };
        setMessages(prev => [...prev, oppMsg]);
      }, 1000);
      return;
    }

    if (!matchData?.matchId || !user) return;
    sendMatchMessage(matchData.matchId, user.uid, profile?.displayName || 'User', chatInput);
    setChatInput('');
  };

  const handleRematch = async () => {
    if (matchData?.isDemoMode) {
      startDemoDuel();
      return;
    }
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
    if (!confirm("Are you sure you want to resign this match? You will lose the match.")) return;

    const myUid = user?.uid || 'player-1';

    if (matchData?.isDemoMode) {
      if (demoOpponentTimeoutRef.current) clearTimeout(demoOpponentTimeoutRef.current);
      
      const updatedPlayers = players.map(p => {
        if (p.id === myUid) return { ...p, score: 0 };
        return { ...p, score: Math.max(p.score || 0, 500) };
      });

      const finishedMatchData = {
        ...matchData,
        status: 'finished',
        forfeitedBy: myUid,
        players: updatedPlayers
      };

      setPlayers(updatedPlayers);
      setMatchData(finishedMatchData);
      setFinished(true);
      setDuelStarted(false);
      setToastOptions({ message: "You resigned the match.", type: 'error' });
      return;
    }

    const activeMatchId = matchData?.id || matchData?.matchId || currentMatchIdRef.current;
    if (!activeMatchId || !user) return;

    try {
      const updatedPlayers = players.map(p => {
        if (p.id === user.uid) return { ...p, score: 0 };
        return { ...p, score: Math.max(p.score || 0, 500) };
      });
      setPlayers(updatedPlayers);
      if (matchData) {
        setMatchData({
          ...matchData,
          status: 'finished',
          forfeitedBy: user.uid,
          players: updatedPlayers
        });
      }
      setFinished(true);
      setDuelStarted(false);

      await forfeitMatch(activeMatchId, user.uid);
      setToastOptions({ message: "You resigned the match.", type: 'error' });
    } catch (err) {
      console.error("Error resigning match:", err);
    }
  };

  const startDemoDuel = async () => {
    setLoading(true);
    try {
      const topicId = selectedTopicId || (profile?.level === 'undergraduate' ? 'uni' : 'ss1');
      let questions = await getQuestions(topicId);
      
      // Shuffle the admin questions
      for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      
      const finalQuestions: Question[] = questions.length >= 10 ? questions.slice(0, 10) : [
        { question: "What is the primary subject matter of Economics?", options: ["Wealth accumulation only", "Scarcity and choice under limited resources", "Stock market trading algorithms", "Government tax collection"], correctAnswer: 1, level: 'secondary', topicId, explanation: "Economics is the study of allocation of scarce resources among competing ends." },
        { question: "Which of the following is classified as a land factor of production?", options: ["Machinery", "Natural mineral deposits", "Bank deposits", "Entrepreneurial skill"], correctAnswer: 1, level: 'secondary', topicId, explanation: "Land encompasses all natural resources provided by nature." },
        { question: "A market equilibrium occurs when:", options: ["Price equals zero", "Quantity demanded equals quantity supplied", "Government sets a price ceiling", "Imports exceed exports"], correctAnswer: 1, level: 'secondary', topicId, explanation: "Equilibrium is reached when quantity demanded equals quantity supplied." },
        { question: "What does an upward-sloping supply curve indicate?", options: ["Producers supply less at higher prices", "Producers supply more at higher prices", "Consumers buy more at higher prices", "Price has no effect on supply"], correctAnswer: 1, level: 'secondary', topicId, explanation: "According to the Law of Supply, higher prices incentivize greater output." },
        { question: "Opportunity cost measures:", options: ["The monetary cost paid", "The value of the next best alternative forgone", "The total accounting profit", "The inflation rate"], correctAnswer: 1, level: 'secondary', topicId, explanation: "Opportunity cost is the foregone benefit of the next best option." },
        { question: "Inflation is best defined as:", options: ["A one-time increase in prices", "A sustained increase in the general price level", "An increase in stock prices", "A decrease in unemployment"], correctAnswer: 1, level: 'secondary', topicId, explanation: "Inflation is a continuous rise in overall prices over time." },
        { question: "Which policy is used by central banks to control money supply?", options: ["Fiscal Policy", "Monetary Policy", "Trade Policy", "Industrial Policy"], correctAnswer: 1, level: 'secondary', topicId, explanation: "Monetary policy regulates interest rates and money supply." },
        { question: "A public good is characterized by:", options: ["Rivalry and Excludability", "Non-rivalry and Non-excludability", "High cost and low demand", "Private ownership"], correctAnswer: 1, level: 'secondary', topicId, explanation: "Public goods can be consumed simultaneously without excluding anyone." },
        { question: "Gross Domestic Product (GDP) measures:", options: ["Total wealth of citizens", "Total market value of goods and services produced within a country", "Government budget surplus", "Total exports minus total gold reserves"], correctAnswer: 1, level: 'secondary', topicId, explanation: "GDP measures output within a nation's borders." },
        { question: "What happens to price when demand exceeds supply?", options: ["Price tends to fall", "Price tends to rise", "Price remains fixed", "Supply automatically doubles"], correctAnswer: 1, level: 'secondary', topicId, explanation: "Shortage creates upward pressure on prices." }
      ];

      const myUid = user?.uid || 'player-1';
      const myName = profile?.displayName || 'You (Player 1)';

      const p1 = {
        id: myUid,
        displayName: myName,
        score: 0,
        currentQuestion: 0,
        isDemo: false
      };

      const p2 = {
        id: 'sample-rival-2',
        displayName: 'Alex (Sample Rival)',
        score: 0,
        currentQuestion: 0,
        isDemo: true
      };

      const demoMatch = {
        matchId: 'demo-sample-match-' + Date.now(),
        topicId,
        gameMode: gameMode || 'blitz',
        questions: finalQuestions,
        currentQuestion: 0,
        turnDeadline: Date.now() + 30000,
        players: [p1, p2],
        currentTurnUid: p1.id,
        scores: {
          [p1.id]: 0,
          [p2.id]: 0
        },
        status: 'active',
        isDemoMode: true
      };

      currentMatchIdRef.current = demoMatch.matchId;
      setMatchData(demoMatch);
      setPlayers([p1, p2]);
      setCurrentQuestion(0);
      setFinished(false);
      setTimeLeft(MODE_CONFIGS[gameMode]?.time || 30);
      setWaitingForOpponent(false);
      setMessages([
        { id: 'm1', senderName: 'System', text: '🎮 2-Player Demo Arena initialized! Practice turn-based dueling.', timestamp: Date.now() },
        { id: 'm2', senderName: 'Alex (Sample Rival)', text: 'Good luck! Let’s test our economics speed.', timestamp: Date.now() + 100 }
      ]);
      setDuelStarted(true);
      setToastOptions({ message: "🎮 Demo 2-Player Duel Started!", type: 'success' });
    } catch (err) {
      console.error("Demo duel error:", err);
    } finally {
      setLoading(false);
    }
  };

  const acceptRematch = async () => {
    if (!matchData?.matchId || !profile) return;
    setLoading(true);
    setDuelStarted(true);
    const topics = roadmap.length > 0 ? roadmap : [{ id: matchData.topicId, title: "Custom Topic" } as any];
    const topic = topics.find(t => t.id === matchData.topicId) || topics[0];
    
    let questions = await getQuestions(topic.id);
    
    // Shuffle the admin questions
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    // Limit to max 30 questions to prevent exceeding Firestore 1MB document limit
    questions = questions.slice(0, 30);
    
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
        alert("Please select a curriculum first!");
        return;
      }
      
      setLoading(true);

      try {
        let questions = await getQuestions(selectedTopicId);
        
        // Shuffle the admin questions
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        // Limit to max 30 questions to prevent exceeding Firestore 1MB document limit
        questions = questions.slice(0, 30);

        const finalQuestions: Question[] = questions.length > 0 ? questions : [
          { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3, level: 'secondary', topicId: selectedTopicId, explanation: "" }
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
    const myUid = user?.uid || 'player-1';
    const me = players.find(p => p.id === myUid) || players[0];
    const opponent = players.find(p => p.id !== myUid) || players[1];

    const isForfeitedByMe = matchData?.forfeitedBy === myUid;
    const isForfeitedByOpponent = Boolean(matchData?.forfeitedBy && matchData.forfeitedBy !== myUid);

    const won = isForfeitedByOpponent || (!isForfeitedByMe && (me?.score || 0) > (opponent?.score || 0));
    const draw = !matchData?.forfeitedBy && (me?.score || 0) === (opponent?.score || 0);

    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-paper transition-colors duration-300 relative overflow-y-auto py-12">
        {/* Victory/Defeat Background Glow */}
        <div className={cn(
          "absolute inset-0 pointer-events-none blur-[120px] opacity-20 transition-all duration-1000",
          won ? "bg-primary" : draw ? "bg-outline" : "bg-error"
        )} />
        
        <motion.div 
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="bg-surface-container-lowest p-8 md:p-16 rounded-[4rem] border border-outline-variant/30 shadow-2xl text-center max-w-xl w-full relative z-10 backdrop-blur-3xl"
        >
          <div className="mb-16">
            <div className="relative inline-block">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  "absolute inset-0 rounded-full blur-2xl",
                  won ? "bg-primary" : draw ? "bg-outline" : "bg-error"
                )}
              />
              <div className={cn(
                "w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all relative z-10 border-2",
                won ? "bg-primary text-on-primary shadow-2xl shadow-primary/40 border-primary" : draw ? "bg-surface-container-low text-outline border-outline-variant/30" : "bg-error text-on-error shadow-2xl shadow-error/40 border-error"
              )}>
                <Trophy size={64} className={won ? "animate-bounce" : ""} />
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-4 uppercase font-display italic">
              {won ? 'Victory' : draw ? 'Stalemate' : 'Defeat'}
            </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-[1px] bg-outline-variant/50" />
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.4em]">Arena Results</p>
                <div className="w-8 h-[1px] bg-outline-variant/50" />
              </div>
              {matchData?.forfeitedBy && (
                <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-rose-500 animate-pulse bg-rose-500/10 py-1.5 px-4 rounded-full border border-rose-500/30 inline-block">
                   {isForfeitedByMe ? "You Resigned The Match" : "Opponent Forfeited The Match"}
                </p>
              )}
          </div>

          <div className="grid grid-cols-2 gap-px bg-outline-variant/30 rounded-[3rem] overflow-hidden border border-outline-variant/30 mb-16 shadow-inner">
            <div className="bg-surface-container-lowest p-6 md:p-12 group transition-colors hover:bg-surface">
              <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4">Your Score</p>
              <p className="text-5xl md:text-7xl font-bold text-on-surface font-mono tracking-tighter group-hover:text-primary transition-colors">{me?.score}</p>
            </div>
            <div className="bg-surface-container-lowest p-6 md:p-12 group transition-colors hover:bg-surface">
              <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4">Opponent</p>
              <p className="text-5xl md:text-7xl font-bold text-on-surface font-mono tracking-tighter group-hover:text-error transition-colors">{opponent?.score}</p>
            </div>
          </div>

          <div className="space-y-6">
            {rematchOffered ? (
              <div className="bg-primary/10 p-10 rounded-[3rem] mb-10 border border-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl transition-all" />
                <p className="text-[10px] font-bold text-primary mb-8 uppercase tracking-[0.3em] relative z-10">
                  {rematchOffered.challengerName} is seeking redemption
                </p>
                <button 
                  onClick={acceptRematch}
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-bold py-6 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 uppercase tracking-[0.3em] text-[10px] relative z-10"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                  Accept Rematch
                </button>
              </div>
            ) : (
              <button 
                onClick={handleRematch}
                disabled={rematchRequested}
                className="w-full bg-surface-container-high text-on-surface-variant font-bold py-6 rounded-2xl hover:bg-surface-container-highest transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[10px] shadow-xl"
              >
                {rematchRequested ? <Loader2 className="animate-spin" size={20} /> : <Swords size={20} />}
                {rematchRequested ? 'Waiting for response...' : 'Request Rematch'}
              </button>
            )}

            <button 
              onClick={() => {
                setFinished(false);
                setSidebarTab('analysis');
                setSelectedAnalysisIndex(0);
                setMobileTab('analysis');
              }}
              className="w-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold py-5 rounded-2xl hover:bg-sky-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.25em] text-[10px] shadow-lg"
            >
              <Search size={16} />
              Inspect Full Analysis & Moves
            </button>
            
            <button 
              onClick={() => {
                setMatchData(null);
                setFinished(false);
                setDuelStarted(false);
                currentMatchIdRef.current = null;
              }}
              className="w-full py-6 text-on-surface-variant font-bold hover:text-on-surface transition-all text-[10px] uppercase tracking-[0.4em] group"
            >
              <span className="group-hover:tracking-[0.6em] transition-all">Return to Lobby</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (matchData) {
    const meIndex = players.findIndex(p => p.id === user?.uid);
    const oppIndex = players.findIndex(p => p.id !== user?.uid);
    const mePlayerIdx = meIndex !== -1 ? meIndex : 0;
    const oppPlayerIdx = oppIndex !== -1 ? oppIndex : 1;

    const me = players[mePlayerIdx];
    const opponent = players[oppPlayerIdx];

    const displayQuestionIndex = waitingForOpponent ? (opponent?.currentQuestion || 0) : currentQuestion;
    const q = waitingForOpponent 
      ? getQuestionForPlayer(matchData, oppPlayerIdx, displayQuestionIndex)
      : getQuestionForPlayer(matchData, mePlayerIdx, displayQuestionIndex);

    const myCurrentAns = parseAnswer(me?.answers?.[displayQuestionIndex]);
    const oppCurrentAns = parseAnswer(opponent?.answers?.[displayQuestionIndex]);

    if (!q) {
        return (
          <div className="min-h-screen bg-paper flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
          </div>
        );
    }

    return (
      <div className="min-h-screen bg-paper pb-24 md:pb-0 text-ink flex flex-col md:flex-row font-sans md:overflow-auto">
        {toastOptions && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300" 
               style={{ backgroundColor: toastOptions.type === 'error' ? '#ef4444' : '#10b981', color: '#fff' }}>
            {toastOptions.message}
          </div>
        )}
        {firestoreError && (
          <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-500 text-on-surface text-[10px] font-black uppercase tracking-widest py-1 text-center animate-pulse">
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
               <div className="bg-surface-container-low border border-outline-variant/30 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-xl">
                  {MODE_CONFIGS[matchData.gameMode as keyof typeof MODE_CONFIGS]?.icon}
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant hidden md:inline">
                     {MODE_CONFIGS[matchData.gameMode as keyof typeof MODE_CONFIGS]?.label || 'Blitz'}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500/80">Q{displayQuestionIndex + 1}/{MODE_CONFIGS[matchData.gameMode as keyof typeof MODE_CONFIGS || 'blitz']?.questions || 15}</span>
               </div>
               <button onClick={handleQuit} className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-400 font-black tracking-widest uppercase text-[9px] rounded-full transition-all border border-rose-500/20 group">
                  <XCircle size={12} className="group-hover:rotate-90 transition-transform" />
                  <span className="hidden md:inline">Resign</span>
               </button>
            </div>

            {/* Opponent Panel */}
            <div className={cn(
              "flex items-center justify-between bg-surface-container-low rounded-lg p-2 md:p-3 shadow-lg border transition-all",
              (matchData.currentTurnUid !== user?.uid || waitingForOpponent) ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "border-outline-variant/30"
            )}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-container-high rounded-lg flex items-center justify-center font-bold text-lg md:text-xl text-on-surface border border-outline-variant/50 shrink-0">
                  {opponent?.displayName?.[0] || 'O'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm md:text-lg font-bold truncate">{opponent?.displayName || 'Opponent'}</p>
                    {waitingForOpponent ? (
                      <span className="text-[8px] md:text-[10px] bg-emerald-500 text-on-surface px-1 md:px-1.5 py-0.5 rounded font-black uppercase animate-pulse shrink-0">Thinking</span>
                    ) : (
                      <span className="text-[8px] md:text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/40 px-1 md:px-1.5 py-0.5 rounded font-black uppercase shrink-0">Waiting</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-xs text-on-surface-variant flex items-center gap-1">
                      <Swords size={10} />
                      Score: {opponent?.score || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className={cn(
                "px-4 py-2 md:px-6 md:py-3 rounded-lg font-mono text-xl md:text-3xl font-bold border-2 transition-all shrink-0",
                (matchData.currentTurnUid !== user?.uid || waitingForOpponent) ? "bg-emerald-500/10 border-emerald-500 text-on-surface" : "bg-surface-container border-outline-variant/50 text-on-surface-variant"
              )}>
                {(matchData.currentTurnUid !== user?.uid || waitingForOpponent) ? `00:${timeLeft.toString().padStart(2, '0')}` : '--:--'}
              </div>
            </div>

            {/* Question Area (The "Board") */}
            <div className="relative aspect-square md:aspect-[4/3] w-full bg-surface-container-low rounded-xl md:rounded-2xl border-2 md:border-4 border-outline-variant/50 shadow-2xl flex flex-col overflow-hidden">
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
                        className="h-full flex flex-col items-center justify-center text-center space-y-4"
                      >
                         <div className={cn(
                           "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 animate-in zoom-in duration-300",
                           showAnswerFeedback === 'correct' ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : "bg-rose-500/20 border-rose-500 text-rose-500"
                         )}>
                           {showAnswerFeedback === 'correct' ? <CheckCircle2 size={44} /> : <XCircle size={44} />}
                         </div>
                         <h3 className={cn(
                           "text-3xl md:text-4xl font-black uppercase tracking-tighter italic",
                           showAnswerFeedback === 'correct' ? "text-emerald-500" : "text-rose-500"
                         )}>
                           {showAnswerFeedback === 'correct' ? "Brilliant!" : "Blunder!"}
                         </h3>

                         {/* Selections side-by-side comparison */}
                         <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 bg-surface-container-highest/90 backdrop-blur p-3 px-5 rounded-2xl border border-outline-variant/40 shadow-xl max-w-md w-full">
                           <div className="flex items-center gap-2">
                             <span className="font-bold text-sky-400 text-xs">You:</span>
                             {myCurrentAns?.selectedOption !== null && myCurrentAns?.selectedOption !== undefined ? (
                               <span className={cn(
                                 "px-2.5 py-0.5 rounded-md font-black uppercase text-[10px] flex items-center gap-1 border",
                                 myCurrentAns.isCorrect ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                               )}>
                                 Opt {String.fromCharCode(65 + myCurrentAns.selectedOption)} {myCurrentAns.isCorrect ? '✓' : '✗'}
                               </span>
                             ) : (
                               <span className="text-on-surface-variant/50 italic text-[10px]">No selection</span>
                             )}
                           </div>

                           <div className="w-px h-5 bg-outline-variant/40 hidden sm:block" />

                           <div className="flex items-center gap-2">
                             <span className="font-bold text-amber-400 text-xs">{opponent?.displayName || 'Opponent'}:</span>
                             {oppCurrentAns?.selectedOption !== null && oppCurrentAns?.selectedOption !== undefined ? (
                               <span className={cn(
                                 "px-2.5 py-0.5 rounded-md font-black uppercase text-[10px] flex items-center gap-1 border",
                                 oppCurrentAns.isCorrect ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                               )}>
                                 Opt {String.fromCharCode(65 + oppCurrentAns.selectedOption)} {oppCurrentAns.isCorrect ? '✓' : '✗'}
                               </span>
                             ) : (
                               <span className="text-on-surface-variant/50 italic text-[10px]">Thinking...</span>
                             )}
                           </div>
                         </div>

                         <p className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">Switching turns...</p>
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
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-auto">
                          {waitingForOpponent && (
                             <div className="absolute inset-0 z-10 bg-surface-container-low/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl border border-outline-variant/30">
                                <div className="bg-surface-container-highest px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-emerald-500/30">
                                   <Clock size={14} className="text-emerald-500 animate-pulse" />
                                   <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Opponent is deciding...</span>
                                </div>
                             </div>
                          )}
                          {q.options.map((option: string, i: number) => {
                            const showSelection = waitingForOpponent || Boolean(showAnswerFeedback);
                            const youPicked = showSelection && myCurrentAns?.selectedOption === i;
                            const oppPicked = showSelection && oppCurrentAns?.selectedOption === i;

                            return (
                              <button
                                key={i}
                                disabled={waitingForOpponent}
                                onClick={() => handleAnswer(i === q.correctAnswer, i)}
                                className={cn(
                                  "group relative min-h-16 md:min-h-20 rounded-xl border-l-[4px] md:border-l-[6px] transition-all text-left px-4 md:px-5 py-3 flex items-center justify-between gap-3 overflow-hidden",
                                  youPicked && oppPicked
                                    ? "bg-purple-500/20 border-l-purple-500 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                    : youPicked
                                      ? "bg-sky-500/20 border-l-sky-500 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                                      : oppPicked
                                        ? "bg-amber-500/20 border-l-amber-500 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                        : waitingForOpponent 
                                          ? "bg-surface-container-highest border-outline-variant/30 opacity-60 cursor-not-allowed"
                                          : "bg-surface-container-highest hover:bg-surface-container-highest border-outline-variant/30 hover:border-sky-500 cursor-pointer"
                                )}
                              >
                                 <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={cn(
                                      "w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center font-mono font-bold text-sm md:text-lg transition-colors shrink-0",
                                      youPicked && oppPicked ? "bg-purple-500 text-on-surface" :
                                      youPicked ? "bg-sky-500 text-on-surface" :
                                      oppPicked ? "bg-amber-500 text-on-surface" :
                                      "bg-surface-container-highest text-on-surface-variant/50 group-hover:text-sky-500/50"
                                    )}>
                                       {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className={cn(
                                      "text-sm md:text-base font-medium tracking-tight text-on-surface transition-transform line-clamp-2",
                                      !waitingForOpponent && !youPicked && !oppPicked && "group-hover:translate-x-1"
                                    )}>{option}</span>
                                 </div>

                                 {/* Choice Badges */}
                                 <div className="flex items-center gap-1 shrink-0 ml-2">
                                    {youPicked && oppPicked ? (
                                      <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 border border-purple-500/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                        <Users size={10} /> Both Picked
                                      </span>
                                    ) : (
                                      <>
                                        {youPicked && (
                                          <span className="px-2 py-0.5 rounded bg-sky-500/30 text-sky-300 border border-sky-500/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <User size={10} /> Your Choice
                                          </span>
                                        )}
                                        {oppPicked && (
                                          <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <Swords size={10} /> {opponent?.displayName || 'Opponent'}'s Choice
                                          </span>
                                        )}
                                      </>
                                    )}
                                 </div>

                                 {!waitingForOpponent && !youPicked && !oppPicked && (
                                   <div className="absolute right-0 top-0 bottom-0 w-1 bg-surface-container opacity-0 group-hover:opacity-100 transition-opacity" />
                                 )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               {/* Game Progress Bar */}
               <div className="h-1.5 md:h-2 bg-surface-container-lowest flex">
                  {matchData.questions.map((_: any, i: number) => {
                    const myProgress = me?.currentQuestion || 0;
                    const oppProgress = opponent?.currentQuestion || 0;
                    return (
                      <div 
                        key={i}
                        className={cn(
                          "flex-1 h-full border-r border-outline-variant/30 transition-all flex",
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
              "flex items-center justify-between bg-surface-container-low rounded-lg p-2 md:p-3 shadow-lg border-2 transition-all",
              (matchData.currentTurnUid === user?.uid && !waitingForOpponent) ? "border-sky-500" : "border-outline-variant/30"
            )}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-lg md:text-xl text-on-surface border shrink-0",
                  (matchData.currentTurnUid === user?.uid && !waitingForOpponent) ? "bg-sky-500 border-sky-400" : "bg-surface-container-high border-outline-variant/50"
                )}>
                  {profile?.displayName?.[0] || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm md:text-lg font-bold truncate">You</p>
                    {waitingForOpponent ? (
                      <span className="text-[8px] md:text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/40 px-1 md:px-1.5 py-0.5 rounded font-black uppercase shrink-0">Waiting</span>
                    ) : (matchData.currentTurnUid === user?.uid) ? (
                      <span className="text-[8px] md:text-[10px] bg-sky-500 text-on-surface px-1 md:px-1.5 py-0.5 rounded font-black uppercase shrink-0 animate-pulse">Thinking</span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] md:text-xs text-emerald-400 flex items-center gap-1">
                      <Trophy size={10} />
                      Score: {me?.score || 0}
                    </span>
                    <button 
                      onClick={handleQuit}
                      className="text-[9px] md:text-[10px] text-rose-400 hover:text-rose-300 transition-colors uppercase font-black tracking-widest flex items-center gap-1 border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 rounded shadow-sm"
                    >
                      <Flag size={10} />
                      Resign
                    </button>
                  </div>
                </div>
              </div>
              <div className={cn(
                "px-4 py-2 md:px-6 md:py-3 rounded-lg font-mono text-xl md:text-3xl font-bold border-2 transition-all shrink-0",
                matchData.currentTurnUid === user?.uid && !waitingForOpponent
                  ? timeLeft <= 5 ? "bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse" : "bg-sky-500/10 border-sky-500 text-on-surface" 
                  : "bg-surface-container border-outline-variant/50 text-on-surface-variant"
              )}>
                {matchData.currentTurnUid === user?.uid && !waitingForOpponent ? `00:${timeLeft.toString().padStart(2, '0')}` : '--:--'}
              </div>
            </div>
            
          </div>
        </div>

        {/* Sidebar (Move History / Analysis / Chat) */}
        <div className={cn(
          "flex-1 md:flex-none w-full md:w-[360px] bg-surface-container-low border-l border-outline-variant/30 flex flex-col transition-all duration-300",
          mobileTab !== 'analysis' && "hidden md:flex"
        )}>
           {/* Header tabs */}
           <div className="flex border-b border-outline-variant/30 p-1 bg-surface-container-low shrink-0">
              <button 
                onClick={() => setSidebarTab('history')} 
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2",
                  sidebarTab === 'history' ? "text-sky-400 border-sky-500 font-bold" : "text-on-surface-variant/60 border-transparent hover:text-on-surface"
                )}
              >
                Move History
              </button>
              <button 
                onClick={() => setSidebarTab('analysis')} 
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2",
                  sidebarTab === 'analysis' ? "text-sky-400 border-sky-500 font-bold" : "text-on-surface-variant/60 border-transparent hover:text-on-surface"
                )}
              >
                Analysis
              </button>
              <button onClick={handleQuit} className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-all border-l border-outline-variant/30 flex items-center gap-1.5 shrink-0 bg-rose-500/10 hover:bg-rose-500/20">
                <Flag size={11} />
                Resign
              </button>
           </div>

           {/* Tab Body */}
           <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans scrollbar-hide">
              {sidebarTab === 'history' ? (
                <div className="space-y-2">
                   <div className="grid grid-cols-[30px_1fr_1fr] items-center text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 px-2 py-1 border-b border-outline-variant/20">
                      <span>Q#</span>
                      <span className="text-center text-sky-400">You</span>
                      <span className="text-center text-emerald-400">{opponent?.displayName || 'Opponent'}</span>
                   </div>
                   {matchData.questions.map((q: Question, i: number) => {
                     const myAns = parseAnswer(me?.answers?.[i]);
                     const oppAns = parseAnswer(opponent?.answers?.[i]);
                     const isMyCurrent = me?.currentQuestion === i;
                     const isOppCurrent = opponent?.currentQuestion === i;

                     return (
                       <div 
                         key={i} 
                         onClick={() => {
                           setSelectedAnalysisIndex(i);
                           setSidebarTab('analysis');
                         }}
                         className={cn(
                           "p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col space-y-2",
                           selectedAnalysisIndex === i 
                            ? "bg-sky-500/10 border-sky-500/50 shadow-md"
                            : "bg-surface-container-highest/50 hover:bg-surface-container-highest border-outline-variant/20"
                         )}
                       >
                         <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono font-bold text-on-surface-variant/70">Move {i + 1}</span>
                            <span className="text-[9px] text-on-surface-variant/50 truncate max-w-[180px] italic">{q.question}</span>
                         </div>

                         <div className="grid grid-cols-2 gap-2">
                            {/* My Move Status */}
                            <div className={cn(
                              "h-8 rounded-lg flex items-center justify-between px-2 text-[9px] font-black uppercase tracking-tight transition-all",
                              myAns !== null
                                ? myAns.isCorrect 
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : isMyCurrent && matchData.currentTurnUid === user?.uid && !waitingForOpponent
                                  ? "bg-sky-500/20 text-sky-400 animate-pulse border border-sky-500/40"
                                  : "bg-surface-container text-on-surface-variant/40"
                            )}>
                              {myAns !== null ? (
                                <>
                                  <span>{myAns.selectedOption !== null ? `Opt ${String.fromCharCode(65 + myAns.selectedOption)}` : 'Answered'}</span>
                                  <span>{myAns.isCorrect ? '+100' : '+0'}</span>
                                </>
                              ) : isMyCurrent && matchData.currentTurnUid === user?.uid && !waitingForOpponent ? (
                                <span className="w-full text-center">Your Turn...</span>
                              ) : (
                                <span className="w-full text-center">...</span>
                              )}
                            </div>

                            {/* Opponent Move Status */}
                            <div className={cn(
                              "h-8 rounded-lg flex items-center justify-between px-2 text-[9px] font-black uppercase tracking-tight transition-all",
                              oppAns !== null
                                ? oppAns.isCorrect 
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : isOppCurrent && (matchData.currentTurnUid !== user?.uid || waitingForOpponent)
                                  ? "bg-emerald-500/20 text-emerald-400 animate-pulse border border-emerald-500/40"
                                  : "bg-surface-container text-on-surface-variant/40"
                            )}>
                              {oppAns !== null ? (
                                <>
                                  <span>{oppAns.selectedOption !== null ? `Opt ${String.fromCharCode(65 + oppAns.selectedOption)}` : 'Answered'}</span>
                                  <span>{oppAns.isCorrect ? '+100' : '+0'}</span>
                                </>
                              ) : isOppCurrent && (matchData.currentTurnUid !== user?.uid || waitingForOpponent) ? (
                                <span className="w-full text-center">Thinking...</span>
                              ) : (
                                <span className="w-full text-center">...</span>
                              )}
                            </div>
                         </div>
                       </div>
                     );
                   })}
                </div>
              ) : (
                /* ANALYSIS TAB */
                <div className="space-y-4">
                   {/* Question Selector Pills */}
                   <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                      {matchData.questions.map((_: any, idx: number) => {
                        const myAns = parseAnswer(me?.answers?.[idx]);
                        const isSelected = selectedAnalysisIndex === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedAnalysisIndex(idx)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all shrink-0 border",
                              isSelected 
                                ? "bg-sky-500 text-on-surface border-sky-400 shadow-md scale-105" 
                                : myAns !== null
                                  ? myAns.isCorrect ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                  : "bg-surface-container-highest text-on-surface-variant/60 border-outline-variant/20"
                            )}
                          >
                            Q{idx + 1}
                          </button>
                        );
                      })}
                   </div>

                   {/* Analysis Details for selected question */}
                   {(() => {
                     const currentQ = matchData.questions[selectedAnalysisIndex];
                     if (!currentQ) return null;
                     const myAns = parseAnswer(me?.answers?.[selectedAnalysisIndex]);
                     const oppAns = parseAnswer(opponent?.answers?.[selectedAnalysisIndex]);

                     return (
                       <div className="space-y-3">
                          <div className="bg-surface-container-highest/60 p-3 rounded-xl border border-outline-variant/30 space-y-2">
                            <div className="flex items-center justify-between">
                               <span className="text-[9px] font-black uppercase tracking-widest text-sky-400">Question {selectedAnalysisIndex + 1} Analysis</span>
                               <span className="text-[9px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-mono uppercase">{currentQ.level || 'Economics'}</span>
                            </div>
                            <h4 className="text-xs font-bold leading-relaxed text-on-surface">{currentQ.question}</h4>
                          </div>

                          {/* Options Breakdown */}
                          <div className="space-y-2">
                             {currentQ.options.map((opt: string, optIdx: number) => {
                               const isCorrectOpt = optIdx === currentQ.correctAnswer;
                               const youPicked = myAns?.selectedOption === optIdx;
                               const oppPicked = oppAns?.selectedOption === optIdx;

                               return (
                                 <div 
                                   key={optIdx}
                                   className={cn(
                                     "p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all",
                                     isCorrectOpt 
                                       ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                       : (youPicked || oppPicked)
                                         ? "bg-rose-500/15 border-rose-500/50 text-rose-300"
                                         : "bg-surface-container-highest/40 border-outline-variant/20 text-on-surface-variant/70"
                                   )}
                                 >
                                    <div className="flex items-center gap-2 min-w-0 pr-2">
                                       <span className={cn(
                                         "w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] shrink-0",
                                         isCorrectOpt ? "bg-emerald-500 text-on-surface" : "bg-surface-container text-on-surface-variant/60"
                                       )}>
                                         {String.fromCharCode(65 + optIdx)}
                                       </span>
                                       <span className="truncate">{opt}</span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                       {isCorrectOpt && (
                                         <span className="bg-emerald-500/30 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Correct</span>
                                       )}
                                       {youPicked && (
                                         <span className="bg-sky-500/30 text-sky-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">You</span>
                                       )}
                                       {oppPicked && (
                                         <span className="bg-purple-500/30 text-purple-300 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Opponent</span>
                                       )}
                                    </div>
                                 </div>
                               );
                             })}
                          </div>

                          {/* Rationale / Explanation Box */}
                          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                             <div className="flex items-center gap-1.5 text-amber-400 text-[9px] font-black uppercase tracking-widest">
                                <Zap size={12} />
                                Economic Explanation
                             </div>
                             <p className="text-[11px] text-on-surface-variant/90 leading-normal italic">
                                {currentQ.explanation || "In economic theory, this question addresses fundamental principles of market behavior and resource allocation."}
                             </p>
                          </div>

                          {/* Pagination buttons */}
                          <div className="flex justify-between gap-2 pt-1">
                             <button 
                               disabled={selectedAnalysisIndex === 0}
                               onClick={() => setSelectedAnalysisIndex(prev => Math.max(0, prev - 1))}
                               className="flex-1 py-1.5 bg-surface-container-highest hover:bg-surface-container border border-outline-variant/30 text-on-surface-variant disabled:opacity-40 rounded-lg text-[9px] font-black uppercase tracking-wider"
                             >
                               ← Prev Q
                             </button>
                             <button 
                               disabled={selectedAnalysisIndex === matchData.questions.length - 1}
                               onClick={() => setSelectedAnalysisIndex(prev => Math.min(matchData.questions.length - 1, prev + 1))}
                               className="flex-1 py-1.5 bg-surface-container-highest hover:bg-surface-container border border-outline-variant/30 text-on-surface-variant disabled:opacity-40 rounded-lg text-[9px] font-black uppercase tracking-wider"
                             >
                               Next Q →
                             </button>
                          </div>
                       </div>
                     );
                   })()}
                </div>
              )}
           </div>

           {/* Chat Section */}
           <div className="h-[210px] border-t border-outline-variant/30 flex flex-col bg-black/10 shrink-0">
              <div className="p-2.5 border-b border-black/10 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   Live Arena Chat
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs scrollbar-hide">
                 {messages.length === 0 ? (
                   <p className="text-[10px] text-on-surface-variant/50 text-center mt-2 italic">No chat messages yet...</p>
                 ) : (
                   messages.map((m, i) => (
                     <div key={i} className="flex gap-1.5 text-[11px] leading-tight">
                        <span className="font-bold text-sky-400 shrink-0">{m.senderName}:</span>
                        <span className="text-on-surface/90">{m.text || m.message}</span>
                     </div>
                   ))
                 )}
                 <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-2 border-t border-outline-variant/20">
                 <div className="bg-surface-container-highest rounded-lg border border-outline-variant/30 p-1 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type chat message..."
                      className="flex-1 bg-transparent border-none outline-none text-xs px-2 py-0.5 placeholder:text-outline text-on-surface"
                    />
                    <button type="submit" className="p-1 px-3 bg-sky-500 hover:bg-sky-400 text-on-surface rounded-md text-[9px] font-black uppercase tracking-widest transition-colors">Send</button>
                 </div>
              </form>
           </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden flex h-16 bg-paper border-t border-outline-variant/30 pb-2 shrink-0">
           <button 
             onClick={() => setMobileTab('board')}
             className={cn(
               "flex-1 flex flex-col items-center justify-center gap-1 transition-all",
               mobileTab === 'board' ? "text-sky-400" : "text-on-surface-variant"
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
               mobileTab === 'analysis' ? "text-sky-400" : "text-on-surface-variant"
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
              className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-6 overflow-y-auto"
            >
              {/* Atmospheric Background Gradients */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/15 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.6)_100%)]" />
              </div>

              {/* Quick Top-Right Quit Button */}
              <button
                onClick={toggleSearching}
                className="absolute top-5 right-5 z-20 w-11 h-11 bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-full border border-slate-700/60 hover:border-rose-500/40 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
                title="Cancel search and exit"
              >
                <XCircle size={22} />
              </button>

              <div className="text-center max-w-md w-full relative z-10 py-6">
                {matchFoundState ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-10"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-sky-500/20 rounded-full blur-3xl"
                      />
                      <div className="w-36 h-36 bg-sky-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(14,165,233,0.3)] border border-sky-400 relative z-10">
                        <Swords size={72} className="text-white animate-bounce" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight uppercase font-display italic">Match Found!</h2>
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-[1px] bg-sky-500/40" />
                        <p className="text-sky-400 font-extrabold uppercase tracking-[0.4em] text-[10px]">
                          {pendingMatch?.gameMode ? (`Ready for ${MODE_CONFIGS[pendingMatch.gameMode as keyof typeof MODE_CONFIGS]?.label || 'Duel'}`) : 'Initializing Duel Arena'}
                        </p>
                        <div className="w-10 h-[1px] bg-sky-500/40" />
                      </div>

                      <div className="flex flex-col items-center gap-3.5 w-full">
                        <button 
                          onClick={enterDuel}
                          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce active:scale-95 transition-all cursor-pointer"
                        >
                          Start Duel
                        </button>
                        <button 
                          onClick={cancelMatchFound}
                          className="w-full py-3 bg-slate-800/80 hover:bg-rose-500/20 text-rose-400 border border-slate-700/60 hover:border-rose-500/40 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <XCircle size={16} />
                          Cancel & Quit Arena
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center group">
                        <div className="w-20 h-20 bg-slate-800/90 rounded-[2rem] flex items-center justify-center text-white mb-2 font-black text-2xl border border-slate-700 shadow-xl backdrop-blur-md">
                          {profile?.displayName?.[0]}
                        </div>
                        <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">{profile?.displayName}</p>
                        <p className="text-[9px] text-sky-400 font-bold uppercase tracking-widest mt-0.5">Player 1</p>
                      </div>

                      <div className="relative">
                        <div className="text-3xl font-black text-slate-600 italic font-display select-none">VS</div>
                        <motion.div 
                          animate={{ height: ['0%', '100%', '0%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-1/2 top-0 w-[1px] bg-gradient-to-b from-transparent via-sky-500/50 to-transparent -translate-x-1/2"
                        />
                      </div>

                      <div className="text-center group">
                        <div className="w-20 h-20 bg-slate-800/90 rounded-[2rem] flex items-center justify-center text-white mb-2 font-black text-2xl border border-slate-700 shadow-xl backdrop-blur-md">
                          {players.find((p: any) => p.id !== user?.uid)?.displayName?.[0] || '?'}
                        </div>
                        <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">{players.find((p: any) => p.id !== user?.uid)?.displayName || 'Opponent'}</p>
                        <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">Player 2</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-[1px] border-dashed border-sky-500/30 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-3 border-[1px] border-dashed border-indigo-500/30 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-sky-400 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <Users size={44} className="text-sky-400 animate-pulse" />
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-sky-500 rounded-full blur-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight uppercase font-display italic">Searching...</h2>
                    
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-slate-800/90 border border-slate-700/80 rounded-full mb-5 backdrop-blur-md shadow-md">
                      <Timer size={16} className="text-sky-400" />
                      <p className="text-sky-400 font-mono text-xl font-black tracking-tight">
                        {Math.floor(searchTime / 60)}:{(searchTime % 60).toString().padStart(2, '0')}
                      </p>
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm mb-6 font-medium leading-relaxed max-w-xs mx-auto">
                      Scanning the arena for a worthy opponent in <br />
                      <span className="text-emerald-400 font-extrabold text-base block mt-1 tracking-tight">
                        {selectedTopicId === 'ss1' ? 'SS1 Curriculum' : selectedTopicId === 'ss2' ? 'SS2 Curriculum' : selectedTopicId === 'ug' ? 'SS3 Curriculum' : 'Selected Curriculum'}
                      </span>
                    </p>

                    <button
                      onClick={toggleSearching}
                      className="w-full py-4 px-6 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2xl transition-all border border-rose-400/40 uppercase tracking-widest text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <XCircle size={18} />
                      Cancel Search & Quit
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
              className="fixed inset-0 z-[60] bg-surface/80 backdrop-blur-sm flex items-center justify-center p-8"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/30 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Swords className="text-primary" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2 uppercase font-display tracking-tight">Challenge</h3>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                   <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-2">
                      {MODE_CONFIGS[incomingChallenge.gameMode as keyof typeof MODE_CONFIGS]?.icon}
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                         {MODE_CONFIGS[incomingChallenge.gameMode as keyof typeof MODE_CONFIGS]?.label || 'Blitz'}
                      </span>
                   </div>
                </div>

                <p className="text-on-surface-variant text-sm mb-8 font-medium">
                  <span className="font-bold text-on-surface">{incomingChallenge.challengerName}</span> has challenged you!
                </p>
                <div className="flex gap-4">
                  <button onClick={handleDeclineChallenge} className="flex-1 py-4 font-bold rounded-2xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-all">Decline</button>
                  <button onClick={handleAcceptChallenge} className="flex-1 py-4 font-bold rounded-2xl bg-primary text-on-primary shadow-[0_4px_0_var(--color-primary)] active:translate-y-1 active:shadow-none transition-all">Accept</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeMatchBanner && (
          <div className="mb-8 bg-tertiary/10 border border-tertiary/20 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <Timer className="text-tertiary" size={24} />
                <div>
                  <h3 className="font-bold text-tertiary text-sm uppercase tracking-wider">Match In Progress!</h3>
                  <p className="text-tertiary/70 text-xs">You have an unfinished duel. Resume or forfeit to start a new one.</p>
                </div>
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={forfeitBannerMatch} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-tertiary/10 text-tertiary text-[10px] font-bold hover:bg-tertiary/20 transition-all uppercase tracking-widest border border-tertiary/20">Forfeit</button>
                <button onClick={resumeBannerMatch} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-tertiary text-on-tertiary text-[10px] font-black hover:bg-tertiary/90 transition-all uppercase tracking-widest shadow-[0_4px_0_var(--color-tertiary)] active:translate-y-1 active:shadow-none">Resume</button>
             </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 border-b-4 border-outline-variant/30 pb-16 relative">
          <div className="relative z-10 w-full md:w-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--color-primary)]" />
              <span className="text-[12px] font-black text-primary uppercase tracking-widest">Live Arena</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-on-surface tracking-tight mb-6 uppercase block font-display shadow-sm break-words md:break-normal w-full">Duel Arena</h1>
            <p className="text-on-surface-variant text-base font-bold leading-relaxed w-full md:max-w-md">
              Challenge peers in real-time economic combat. <br className="hidden md:block" />
              <span className="text-on-surface">Climb the global leaderboard and claim your status.</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10 w-full md:w-auto mt-6 md:mt-0">
            <button
              onClick={startDemoDuel}
              className="px-6 py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 shadow-lg flex items-center gap-3 active:translate-y-1 active:shadow-none group cursor-pointer shrink-0"
              title="Try an interactive 2-player sample preview duel"
            >
              <Swords size={20} className="transition-transform group-hover:rotate-12" />
              Preview Demo Duel
            </button>
            <button
              onClick={toggleSearching}
              className={cn(
                "px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none flex items-center gap-4 group cursor-pointer",
                isSearching
                  ? "bg-error text-on-error hover:bg-error/90 border-b-4 border-error/50"
                  : "bg-primary text-on-primary hover:bg-primary/90 border-b-4 border-primary/50"
              )}
            >
              <Zap size={20} className={cn("transition-transform group-hover:scale-110", isSearching && "animate-pulse")} />
              {isSearching ? "In Matchmaking" : "Enter Arena Queue"}
            </button>
            <div className="bg-surface-container-low border-2 border-outline-variant/30 px-6 py-4 rounded-xl shadow-sm flex items-center gap-5 backdrop-blur-md">
              <Users size={20} className="text-outline" />
              <div className="flex flex-col">
                 <span className="text-xs font-black text-on-surface uppercase tracking-widest">{lobbyUsers.filter(u => u.status === 'searching').length} in Queue</span>
                 <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{lobbyUsers.length} Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar: Topic & Mode Selection */}
        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[3rem] border border-outline-variant/30 shadow-sm mb-16 flex flex-col lg:flex-row items-stretch md:items-center gap-8 md:gap-10">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4 ml-1">Combat Topic</label>
            <div className="relative">
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 px-8 py-5 rounded-2xl text-sm font-bold text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Choose a curriculum...</option>
                {profile?.level === 'undergraduate' ? (
                  <option value="uni">Undergraduate Curriculum</option>
                ) : (
                  <>
                    <option value="ss1">SS1 Curriculum</option>
                    <option value="ss2">SS2 Curriculum</option>
                    <option value="ug">SS3 Curriculum</option>
                  </>
                )}
              </select>
              <ChevronRight size={20} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-outline pointer-events-none" />
            </div>
          </div>

          <div className="w-full lg:w-[450px]">
            <label className="block text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4 ml-1">Speed Control</label>
            <div className="flex gap-2 p-2 bg-surface-container-low rounded-2xl border border-outline-variant/30">
               {(Object.keys(MODE_CONFIGS) as Array<keyof typeof MODE_CONFIGS>).map((mode) => (
                 <button
                    key={mode}
                    onClick={() => setGameMode(mode)}
                    className={cn(
                      "flex-1 py-4 px-3 rounded-xl flex items-center justify-center gap-3 transition-all",
                      gameMode === mode 
                        ? "bg-surface-container-lowest border border-outline-variant/50 shadow-md text-primary" 
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50"
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
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input 
              id="lobby-search-input"
              type="text"
              value={lobbySearchQuery}
              onChange={(e) => setLobbySearchQuery(e.target.value)}
              placeholder="Search opponent by name..."
              className="w-full bg-surface-container-lowest border border-outline-variant/50 pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-outline">
             <span>{lobbyUsers.filter(u => u.uid !== user?.uid && (u.displayName || '').toLowerCase().includes(lobbySearchQuery.toLowerCase())).length} Results</span>
             <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/50" />
             <span>Lobby Filter</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            {lobbyUsers
              .filter(u => u.uid !== user?.uid && (u.displayName || '').toLowerCase().includes(lobbySearchQuery.toLowerCase()))
              .map((u, i) => (
            <motion.div
              key={u.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-gamified p-8 relative overflow-hidden group border-2 border-outline-variant/30 bg-surface-container-lowest translate-y-[-4px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-3xl transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-surface-container-low rounded-2xl border-b-4 border-outline-variant/30 flex items-center justify-center font-black text-3xl text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all shadow-sm">
                  {u.displayName ? u.displayName[0] : '?'}
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all font-black text-[10px] uppercase tracking-widest",
                  u.status === 'searching' 
                    ? "bg-tertiary/10 border-tertiary/30 text-tertiary" 
                    : u.status === 'playing' 
                      ? "bg-surface-container-high border-outline-variant/30 text-on-surface-variant" 
                      : "bg-secondary/10 border-secondary/30 text-secondary"
                )}>
                  {u.status === 'searching' ? "Queue" : u.status === 'playing' ? "In Duel" : "Idle"}
                </div>
              </div>
              <div className="mb-10 relative z-10">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-black text-on-surface tracking-tight uppercase group-hover:text-primary transition-colors">{u.displayName}</h3>
                  <div className="flex items-center gap-1.5 bg-secondary/10 px-2 py-0.5 rounded-md border border-secondary/20">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                    <span className="text-[9px] font-black tracking-widest uppercase text-secondary">Online</span>
                  </div>
                </div>
                <p className="text-xs font-black text-outline uppercase tracking-widest">{u.level || 'Economics'} Scholar</p>
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
              <div className="col-span-full py-16 px-6 text-center rounded-[3rem] border border-dashed border-outline-variant bg-surface/30">
                <div className="w-20 h-20 bg-surface-container-lowest rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Users className="text-outline" size={36} />
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2 tracking-tighter uppercase font-display">Arena is Empty</h3>
                <p className="text-on-surface-variant font-medium text-sm mb-6">Be the first to enter matchmaking, or try an interactive 2-player preview duel!</p>
                <button
                  onClick={startDemoDuel}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-3 active:scale-95 cursor-pointer"
                >
                  <Swords size={18} />
                  Launch 2-Player Demo Preview
                </button>
              </div>
            )}
          </div>

          {/* Sidebar: Leaderboard & Stats */}
          <div className="space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-[3rem] border border-outline-variant/30 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-outline mb-8 flex items-center gap-2">
                <Trophy size={14} className="text-tertiary" />
                Top Gladiators
              </h3>
              <div className="space-y-4">
                {leaderboard.map((u, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-[8px] font-bold text-outline group-hover:text-primary transition-colors uppercase">#{i+1}</span>
                      <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center font-bold text-on-surface group-hover:bg-primary group-hover:text-on-primary transition-all">
                        {u.displayName?.[0]}
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant truncate flex-1 group-hover:text-on-surface transition-colors">{u.displayName || 'Unknown'}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-primary">{u.points || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 rounded-[3rem] text-on-surface shadow-xl relative overflow-hidden group">
               <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-on-surface/10 rotate-12 group-hover:scale-110 transition-transform" />
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
