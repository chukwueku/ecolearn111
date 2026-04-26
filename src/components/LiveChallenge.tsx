import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../useAuth';
import { getQuestions, updatePoints, saveDuelResult } from '../firebase';
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lobbyUsers, setLobbyUsers] = useState<any[]>([]);
  const [incomingChallenge, setIncomingChallenge] = useState<any>(null);
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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    if (user && profile) {
      newSocket.emit("join_lobby", { id: user.uid, displayName: profile.displayName, level: profile.level });
    }

    newSocket.on("lobby_users_list", (users) => {
      setLobbyUsers(users);
    });

    newSocket.on("user_joined_lobby", (newUser) => {
      setLobbyUsers(prev => {
        const exists = prev.find(u => u.socketId === newUser.socketId);
        if (exists) return prev.map(u => u.socketId === newUser.socketId ? newUser : u);
        return [...prev, newUser];
      });
    });

    newSocket.on("user_left_lobby", (socketId) => {
      setLobbyUsers(prev => prev.filter(u => u.socketId !== socketId));
    });

    newSocket.on("user_status_updated", ({ socketId, status }) => {
      setLobbyUsers(prev => prev.map(u => u.socketId === socketId ? { ...u, status } : u));
    });

    newSocket.on("match_found", ({ roomId, opponent, questions }) => {
      clearInterval(searchTimerRef.current);
      setSearchTime(0);
      setMatchFoundState(true);
      setPlayers([
        { id: user?.uid, displayName: profile?.displayName, score: 0 },
        { id: opponent.id, displayName: opponent.displayName, score: 0 }
      ]);
      
      // Brief delay to show "Match Found" state
      setTimeout(() => {
        setMatchData({ roomId, questions });
        setMatchFoundState(false);
        setLoading(false);
        setFinished(false);
        setCurrentQuestion(0);
        setRematchRequested(false);
        setRematchOffered(null);
        startTimer();
      }, 2000);
    });

    newSocket.on("challenge_received", (challenge) => {
      setIncomingChallenge(challenge);
    });

    newSocket.on("challenge_accepted", async ({ roomId, acceptor, questions }) => {
      setMatchData({ roomId, questions });
      newSocket.emit("join_match", { roomId, user: { id: user?.uid, displayName: profile?.displayName } });
    });

    newSocket.on("match_started", ({ players, questions }) => {
      setPlayers(players);
      setMatchData(prev => ({ ...prev, questions }));
      setLoading(false);
      setFinished(false);
      setCurrentQuestion(0);
      setRematchRequested(false);
      setRematchOffered(null);
      startTimer();
    });

    newSocket.on("player_progress", ({ players }) => {
      setPlayers(players);
    });

    newSocket.on("receive_message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on("rematch_offered", (data) => {
      setRematchOffered(data);
    });

    newSocket.on("match_finished", ({ players }) => {
      setPlayers(players);
      setFinished(true);
      clearInterval(timerRef.current);
      
      const me = players.find(p => p.id === user?.uid);
      const opponent = players.find(p => p.id !== user?.uid);
      
      if (me && opponent && me.score > opponent.score) {
        updatePoints(user!.uid, 50); // Win bonus
        saveDuelResult({
          winnerUid: user!.uid,
          winnerName: profile!.displayName,
          loserUid: opponent.id,
          loserName: opponent.displayName,
          topicId: selectedTopicId || 'General',
          pointsAwarded: 50
        });
      } else if (me && opponent && me.score === opponent.score) {
        updatePoints(user!.uid, 20); // Draw bonus
      } else {
        updatePoints(user!.uid, 10); // Participation points
      }
    });

    return () => {
      newSocket.disconnect();
      clearInterval(timerRef.current);
    };
  }, [user, profile]);

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

  const handleChallenge = async (targetSocketId: string) => {
    if (!selectedTopicId) {
      alert("Please select a topic first!");
      return;
    }
    setLoading(true);
    const topics = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
    const topic = topics.find(t => t.id === selectedTopicId);
    if (!topic) return;
    
    const questions = await getQuestions(topic.id);
    
    socket?.emit("challenge_user", { 
      targetSocketId, 
      challenger: { id: user?.uid, displayName: profile?.displayName },
      topicTitle: topic.title,
      questions: questions.length > 0 ? questions : [
        { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3 }
      ]
    });
  };

  const acceptChallenge = async () => {
    socket?.emit("accept_challenge", { 
      challengerSocketId: incomingChallenge.challengerSocketId, 
      acceptor: { id: user?.uid, displayName: profile?.displayName },
      questions: incomingChallenge.questions
    });
    setIncomingChallenge(null);
  };

  const handleAnswer = (correct: boolean) => {
    socket?.emit("submit_answer", { 
      roomId: matchData.roomId, 
      correct, 
      questionIndex: currentQuestion 
    });
    
    if (currentQuestion < matchData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      startTimer();
    } else {
      clearInterval(timerRef.current);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !matchData?.roomId) return;
    
    socket?.emit("send_message", {
      roomId: matchData.roomId,
      message: chatInput,
      senderName: profile?.displayName || 'User'
    });
    setChatInput('');
  };

  const handleRematch = () => {
    if (!matchData?.roomId) return;
    setRematchRequested(true);
    socket?.emit("request_rematch", { 
      roomId: matchData.roomId, 
      challengerName: profile?.displayName 
    });
  };

  const acceptRematch = async () => {
    if (!matchData?.roomId) return;
    setLoading(true);
    const topics = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
    const topic = topics.find(t => t.id === selectedTopicId) || topics[0];
    
    const questions = await getQuestions(topic.id);
    
    socket?.emit("accept_rematch", { 
      roomId: matchData.roomId, 
      questions: questions.length > 0 ? questions : [
        { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3 }
      ]
    });
  };

  const toggleSearching = async () => {
    if (!socket || !user || !profile) return;
    
    const myUser = lobbyUsers.find(u => u.socketId === socket.id);
    const isSearching = myUser?.status === 'searching';

    if (isSearching) {
      socket.emit("cancel_search");
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
          { question: "What is Economics?", options: ["Wealth", "Scarcity", "Choice", "All"], correctAnswer: 3 }
        ];

        socket.emit("find_match", {
          user: { id: user.uid, displayName: profile.displayName },
          topicId: selectedTopicId,
          questions: finalQuestions
        });

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
              <p className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{me.score}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900/50 p-6 md:p-12 group transition-colors hover:bg-white dark:hover:bg-slate-900">
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Opponent</p>
              <p className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{opponent.score}</p>
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
              onClick={() => window.location.reload()}
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

    return (
      <div className="min-h-screen bg-paper pt-32 pb-12 px-8 transition-colors duration-300">
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
                      className={`flex flex-col ${msg.senderId === socket?.id ? 'items-end' : 'items-start'}`}
                    >
                      <div className={cn(
                        "px-6 py-4 rounded-[1.8rem] max-w-[85%] text-sm font-medium leading-relaxed shadow-sm",
                        msg.senderId === socket?.id 
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
    <div className="min-h-screen bg-paper pt-32 pb-20 px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Searching Overlay */}
        <AnimatePresence>
          {(lobbyUsers.find(u => u.socketId === socket?.id)?.status === 'searching' || matchFoundState) && (
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
                        <p className="text-[8px] text-sky-500/50 font-bold uppercase tracking-widest mt-1">Challenger</p>
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
                          {players.find(p => p.id !== user?.uid)?.displayName?.[0] || '?'}
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">{players.find(p => p.id !== user?.uid)?.displayName || 'Opponent'}</p>
                        <p className="text-[8px] text-rose-500/50 font-bold uppercase tracking-widest mt-1">Defender</p>
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
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-slate-200 dark:border-slate-800 pb-16 relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
              <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-[0.4em]">Live Arena</span>
            </div>
            <h1 className="text-4xl md:text-6xl md:text-8xl font-bold text-slate-900 dark:text-white tracking-tighter mb-6 uppercase font-display italic">Duel Arena</h1>
            <p className="text-slate-700 dark:text-slate-500 text-sm max-w-md font-medium leading-relaxed">
              Challenge peers in real-time economic combat. <br />
              <span className="text-slate-900 dark:text-slate-300">Climb the global leaderboard and claim your status.</span>
            </p>
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <button
              onClick={toggleSearching}
              className={cn(
                "px-12 py-6 rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center gap-4 group",
                lobbyUsers.find(u => u.socketId === socket?.id)?.status === 'searching'
                  ? "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-500/30"
                  : "bg-slate-900 dark:bg-sky-600 text-white hover:bg-slate-800 dark:hover:bg-sky-500 shadow-slate-900/20 dark:shadow-sky-500/20"
              )}
            >
              <Zap size={18} className={cn("transition-transform group-hover:scale-125", lobbyUsers.find(u => u.socketId === socket?.id)?.status === 'searching' && "animate-pulse")} />
              {lobbyUsers.find(u => u.socketId === socket?.id)?.status === 'searching' ? "In Matchmaking" : "Enter Arena Queue"}
            </button>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-8 py-6 rounded-[2rem] shadow-sm flex items-center gap-5 backdrop-blur-md">
              <Users size={20} className="text-slate-400 dark:text-slate-600" />
              <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">{lobbyUsers.length} Online</span>
            </div>
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
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

        {/* Incoming Challenge Notification */}
        <AnimatePresence>
          {incomingChallenge && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative mb-16 group"
            >
              <div className="absolute inset-0 bg-sky-500/20 rounded-[3.5rem] blur-2xl group-hover:bg-sky-500/30 transition-all" />
              <div className="relative bg-slate-900 dark:bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-sky-500 rounded-[1.5rem] blur-lg opacity-50 animate-pulse" />
                    <div className="w-24 h-24 bg-sky-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl border border-sky-400 relative z-10">
                      <Swords size={48} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-sky-500/20 text-sky-400 text-[8px] font-bold uppercase tracking-[0.3em] rounded-full border border-sky-500/30">
                        Combat Request
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold mb-2 tracking-tighter uppercase font-display italic">{incomingChallenge.challenger.displayName}</h2>
                    <p className="text-slate-400 text-xs font-medium tracking-wide">
                      Topic: <span className="text-sky-400 font-bold uppercase tracking-widest ml-1">{incomingChallenge.topicTitle}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={acceptChallenge}
                    className="flex-1 md:flex-none px-16 py-6 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] uppercase tracking-[0.3em] text-[10px]"
                  >
                    Accept Duel
                  </button>
                  <button 
                    onClick={() => setIncomingChallenge(null)}
                    className="flex-1 md:flex-none px-12 py-6 bg-white/5 text-slate-400 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] border border-white/5"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lobby Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {lobbyUsers.filter(u => u.id !== user?.uid).map((u, i) => (
            <motion.div
              key={u.socketId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-sky-500/30 transition-all group relative overflow-hidden"
            >
              {/* Subtle Background Glow on Hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/0 group-hover:bg-sky-500/5 rounded-full blur-3xl transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center font-bold text-3xl text-slate-900 dark:text-white group-hover:bg-slate-900 dark:group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm border border-transparent group-hover:border-white/10">
                  {u.displayName[0]}
                </div>
                <div className={cn(
                  "flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all",
                  u.status === 'searching' 
                    ? "bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800" 
                    : u.status === 'playing' 
                      ? "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700" 
                      : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700"
                )}>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    u.status === 'searching' ? "bg-sky-500 animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]" : u.status === 'playing' ? "bg-slate-400" : "bg-slate-200 dark:bg-slate-700"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    u.status === 'searching' ? "text-sky-600 dark:text-sky-400" : u.status === 'playing' ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"
                  )}>
                    {u.status === 'searching' ? "Searching" : u.status === 'playing' ? "In Match" : "Idle"}
                  </span>
                </div>
              </div>
              <div className="mb-16 relative z-10">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tighter uppercase font-display italic group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{u.displayName}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800" />
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{u.level} Scholar</p>
                </div>
              </div>
              <button
                onClick={() => handleChallenge(u.socketId)}
                disabled={loading || u.status === 'playing'}
                className="w-full py-6 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-[2rem] hover:bg-slate-900 dark:hover:bg-sky-600 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center gap-4 group/btn relative z-10 overflow-hidden"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover/btn:scale-125 transition-transform" />}
                {u.status === 'playing' ? "Occupied" : "Issue Challenge"}
              </button>
            </motion.div>
          ))}
          
          {lobbyUsers.length <= 1 && (
            <div className="col-span-full py-48 text-center rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
              <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm">
                <Users className="text-slate-200 dark:text-slate-700" size={40} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tighter uppercase font-display">Arena is Empty</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Waiting for other scholars to join the lobby.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
