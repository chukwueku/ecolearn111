import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../useAuth';
import { getQuestions, updatePoints, saveDuelResult, db, enterMatchmaking, leaveMatchmaking, submitMatchAnswer, sendMatchMessage, requestMatchRematch, acceptMatchRematch } from '../firebase';
import { onSnapshot, collection, query, doc, orderBy, where } from 'firebase/firestore';
import { SECONDARY_ROADMAP, UNDERGRADUATE_ROADMAP } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Zap, Trophy, Loader2, User, Swords, CheckCircle2, XCircle, Timer, MessageSquare, Send, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LiveChallenge: React.FC = () => {
  const { user, profile } = useAuth();
  const [lobbyUsers, setLobbyUsers] = useState<any[]>([]);
  const [incomingChallenge, setIncomingChallenge] = useState<any>(null); // Disabled for now
  const [matchData, setMatchData] = useState<any>(null);
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
  const timerRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [searchTime, setSearchTime] = useState(0);
  const [matchFoundState, setMatchFoundState] = useState(false);
  const searchTimerRef = useRef<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Listen to queue to show searching users
  useEffect(() => {
    const q = query(collection(db, 'arena_queue'));
    const unsubQueue = onSnapshot(q, (snap) => {
      const usersInQueue = snap.docs.map(doc => ({ ...doc.data(), status: 'searching' }));
      setLobbyUsers(usersInQueue);
    });

    return () => unsubQueue();
  }, []);

  // Listen to active matches to find if user has a match
  useEffect(() => {
    if (!user) return;
    
    const matchesRef = collection(db, 'arena_matches');
    const unsubMatches = onSnapshot(matchesRef, (snap) => {
      const allMatches = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      const myMatch = allMatches.find(m => m.players?.some((p: any) => p.id === user.uid) && m.status !== 'finished');

      if (myMatch) {
         if (!matchData || matchData.matchId !== myMatch.matchId) {
             // New match found!
             clearInterval(searchTimerRef.current);
             setSearchTime(0);
             setIsSearching(false);
             setMatchFoundState(true);
             const opponent = myMatch.players.find((p: any) => p.id !== user.uid);
             
             setPlayers([
               myMatch.players.find((p: any) => p.id === user.uid),
               opponent
             ]);
             
             setTimeout(() => {
                  setMatchData(myMatch);
                  setMatchFoundState(false);
                  setLoading(false);
                  setFinished(false);
                  setCurrentQuestion(0);
                  setRematchRequested(false);
                  setRematchOffered(null);
                  startTimer();
             }, 2000);
         } else {
             // Match updated (progress sync)
             setPlayers(myMatch.players);
             
             if (myMatch.rematchOffered && myMatch.rematchOffered.challengerId !== user.uid) {
                setRematchOffered(myMatch.rematchOffered);
             } else if (!myMatch.rematchOffered) {
                setRematchOffered(null);
             }
         }
      } else {
          // Check if myMatch just finished
          const myFinishedMatch = allMatches.find(m => m.players?.some((p: any) => p.id === user.uid) && m.status === 'finished' && m.matchId === matchData?.matchId);
          if (myFinishedMatch) {
              setPlayers(myFinishedMatch.players);
              setFinished(true);
              clearInterval(timerRef.current);
              
              const me = myFinishedMatch.players.find((p: any) => p.id === user.uid);
              const opponent = myFinishedMatch.players.find((p: any) => p.id !== user.uid);
              
              if (me && opponent && me.score > opponent.score && !me.pointsAwarded) {
                  updatePoints(user.uid, 50); // Win bonus
                  saveDuelResult({
                    winnerUid: user.uid,
                    winnerName: profile!.displayName,
                    loserUid: opponent.id,
                    loserName: opponent.displayName,
                    topicId: selectedTopicId || 'General',
                    pointsAwarded: 50
                  });
              } else if (me && opponent && me.score === opponent.score && !me.pointsAwarded) {
                updatePoints(user.uid, 20); // Draw
              } else {
                updatePoints(user.uid, 10); // Participation
              }
          }
      }
    });

    return () => unsubMatches();
  }, [user, matchData]);

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

  const startTimer = () => {
    setTimeLeft(15);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(false);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChallenge = async (targetUserId: string) => {
    alert("Please join the Matchmaking Queue instead!");
  };

  const handleAnswer = (correct: boolean) => {
    if (!matchData?.matchId || !user) return;
    submitMatchAnswer(matchData.matchId, user.uid, correct, currentQuestion);
    
    if (currentQuestion < matchData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      startTimer();
    } else {
      clearInterval(timerRef.current);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !matchData?.matchId || !user) return;
    
    sendMatchMessage(matchData.matchId, user.uid, profile?.displayName || 'User', chatInput);
    setChatInput('');
  };

  const handleRematch = () => {
    if (!matchData?.matchId || !user) return;
    setRematchRequested(true);
    requestMatchRematch(matchData.matchId, profile?.displayName || 'User', user.uid);
  };

  const acceptRematch = async () => {
    if (!matchData?.matchId || !profile) return;
    setLoading(true);
    const topics = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
    const topic = topics.find(t => t.id === matchData.topicId) || topics[0];
    
    const questions = await getQuestions(topic.id);
    
    await acceptMatchRematch(matchData.matchId, questions.length > 0 ? questions : [
       { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3, level: 'secondary', topicId: topic.id, explanation: "" }
    ]);
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
        const finalQuestions = questions.length > 0 ? questions : [
          { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3, level: 'secondary', topicId: topic.id, explanation: "" }
        ];

        setIsSearching(true);
        enterMatchmaking({ uid: user.uid, displayName: profile.displayName }, selectedTopicId, finalQuestions);

        // Start search timer
        setSearchTime(0);
        clearInterval(searchTimerRef.current);
        searchTimerRef.current = setInterval(() => {
          setSearchTime(prev => prev + 1);
        }, 1000);
      } catch (error) {
        console.error("Error fetching questions:", error);
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
      <div className="min-h-screen flex items-center justify-center px-6 bg-paper transition-colors duration-300 relative overflow-hidden">
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
    const q = matchData.questions[currentQuestion];

    if (!q) {
        return null; // Safety against index out of bounds while syncing
    }

    return (
      <div className="min-h-screen bg-paper pt-8 md:pt-16 pb-12 px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              {/* Subtle Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-20 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[8px] font-bold uppercase tracking-[0.3em] rounded-full border border-sky-500/20">
                      Combat Phase
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.3em] mb-2">Question {currentQuestion + 1} of {matchData.questions.length}</p>
                  <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter uppercase font-display italic">Active Duel</h2>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-4xl md:text-6xl font-mono font-bold tracking-tighter transition-all duration-300",
                    timeLeft <= 5 ? 'text-rose-500 animate-pulse scale-110' : 'text-slate-900 dark:text-white'
                  )}>
                    {timeLeft}s
                  </div>
                  <p className="text-[9px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.3em] mt-2">Remaining Time</p>
                </div>
              </div>

              <div className="space-y-16 relative z-10">
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight max-w-2xl">
                  {q.question}
                </h3>
                <div className="grid gap-5">
                  {q.options.map((option: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i === q.correctAnswer)}
                      className="w-full p-10 text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-900/30 transition-all group flex items-center justify-between shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-700 dark:text-slate-500 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-2xl font-medium text-slate-800 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{option}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 group-hover:bg-sky-500 transition-all">
                        <ChevronRight className="text-slate-400 dark:text-slate-600 group-hover:text-white transition-all" size={24} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Scoreboard */}
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
              <h4 className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.4em] mb-12 relative z-10">Live Performance</h4>
              <div className="space-y-10 relative z-10">
                <div className="flex items-center justify-between p-8 bg-slate-900 dark:bg-sky-600 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20 dark:shadow-sky-500/20 border border-white/5">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center font-bold text-lg text-white border border-white/10">ME</div>
                    <div>
                      <p className="text-base font-bold">You</p>
                      <p className="text-[9px] text-slate-500 dark:text-sky-200 font-bold uppercase tracking-[0.2em] mt-1">Current Score</p>
                    </div>
                  </div>
                  <span className="text-5xl font-bold font-mono tracking-tighter text-sky-400 dark:text-white">{me?.score || 0}</span>
                </div>
                <div className="flex items-center justify-between p-8 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900/50">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-lg text-slate-700 dark:text-slate-500 border border-slate-200 dark:border-slate-700">OP</div>
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{opponent?.displayName || 'Opponent'}</p>
                      <p className="text-[9px] text-sky-500 dark:text-sky-400 font-bold uppercase tracking-[0.2em] mt-1">Opponent Score</p>
                    </div>
                  </div>
                  <span className="text-5xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter">{opponent?.score || 0}</span>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[600px] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-100/30 dark:bg-slate-800/30 relative z-10">
                <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.4em]">Combat Comms</h4>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                  <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-[0.2em]">Active</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-8 relative z-10">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 dark:opacity-20">
                    <MessageSquare size={80} className="mb-8 text-slate-900 dark:text-white" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-900 dark:text-white">Quiet in the arena</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}
                    >
                      <div className={cn(
                        "px-6 py-4 rounded-[1.8rem] max-w-[85%] text-sm font-medium leading-relaxed shadow-sm",
                        msg.senderId === user?.uid 
                          ? 'bg-slate-900 dark:bg-sky-600 text-white rounded-tr-none' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'
                      )}>
                        {msg.message}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4 relative z-10 bg-white dark:bg-slate-900">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl px-8 py-5 text-sm font-medium focus:ring-8 focus:ring-sky-500/5 outline-none border-none transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  className="w-16 h-16 bg-slate-900 dark:bg-sky-600 text-white rounded-2xl flex items-center justify-center hover:bg-sky-600 dark:hover:bg-sky-500 transition-all shadow-2xl shadow-slate-900/20 group"
                >
                  <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
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

                    <div>
                      <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter uppercase font-display italic">Match Found!</h2>
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-[1px] bg-sky-500/30" />
                        <p className="text-sky-400 font-bold uppercase tracking-[0.5em] text-[10px]">Initializing Duel Arena</p>
                        <div className="w-12 h-[1px] bg-sky-500/30" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 md:gap-16 pt-8">
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
        </AnimatePresence>

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
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{lobbyUsers.length} in Queue</span>
            </div>
          </div>
        </div>

        {/* Action Bar: Topic Selection */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm mb-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Select Combat Topic</label>
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
        </div>

        {/* Lobby Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lobbyUsers.filter(u => u.uid !== user?.uid).map((u, i) => (
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
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{u.displayName}</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{u.level || 'Economics'} Scholar</p>
              </div>
              <button
                disabled={true}
                className="w-full btn-premium justify-center opacity-50"
              >
                In Queue
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
      </div>
    </div>
  );
};
