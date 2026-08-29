import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, User, Loader2, Sparkles, ChevronDown, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useAuth } from '../useAuth';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const AiTutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { profile } = useAuth();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initial greeting if opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const topicContext = getTopicContext(location.pathname);
      const greeting = topicContext 
        ? `Hi ${profile?.displayName || 'Scholar'}! I see you're studying **${topicContext}**. What questions do you have about it?` 
        : `Hi ${profile?.displayName || 'Scholar'}! I'm your AI Economics Tutor. How can I help you today?`;
      
      setMessages([{ role: 'model', content: greeting }]);
    }
  }, [isOpen, messages.length, location.pathname, profile]);

  const getTopicContext = (pathname: string) => {
    if (pathname.startsWith('/study-guide/')) {
      const parts = pathname.split('/');
      return parts[parts.length - 1].replace(/-/g, ' ');
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Build context-aware prompt
      const topicContext = getTopicContext(location.pathname);
      const systemPrompt = `You are an expert AI Economics Tutor named "EcoTutor". The user is ${profile?.displayName || 'a student'}.
${topicContext ? `The user is currently studying the topic: ${topicContext}. Try to relate your answers to this if relevant.` : ''}
Answer the user's question clearly, pedagogically, and accurately. Use Markdown and LaTeX (with single backslash) for math formatting where appropriate.
User's query: ${userMessage}`;

      const response = await fetch('/api/agentTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'antigravity-preview-05-2026',
          prompt: systemPrompt
        })
      });

      if (!response.ok) throw new Error('Failed to fetch from AI Tutor');

      const data = await response.json();
      let aiResponse = "";
      
      // Handle the two possible response formats from our backend
      if (typeof data.result === 'string') {
        aiResponse = data.result;
      } else if (data.result && data.result.response) {
         // If it returns the interaction object directly
         aiResponse = data.result.response.text || data.result.response;
      } else {
        aiResponse = JSON.stringify(data.result);
      }

      setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    } catch (error) {
      console.error('AI Tutor Error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center font-['Hanken_Grotesk'] border-2 border-emerald-400/30"
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 md:bottom-8 right-0 md:right-8 z-[110] w-full md:w-[400px] h-[85vh] md:h-[600px] bg-white dark:bg-slate-900 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden font-['Hanken_Grotesk'] border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between shadow-md z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">EcoTutor AI</h3>
                  <p className="text-emerald-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online & Ready
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors active:scale-95"
              >
                <ChevronDown size={22} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-1">
                      {msg.role === 'user' ? (
                        <div className="w-7 h-7 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-sm">
                          <User size={14} />
                        </div>
                      ) : (
                        <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-sm">
                          <Bot size={14} />
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div 
                      className={`p-3.5 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-sky-600 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm rounded-tl-none'
                      }`}
                    >
                      <div className="text-sm prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100 max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-sm">
                        <Bot size={14} />
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-tl-none flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-emerald-600" />
                      <span className="text-xs text-slate-500 font-medium">EcoTutor is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-slate-800 dark:text-white px-2 py-2.5 text-sm"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors active:scale-95"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400 font-medium">EcoTutor AI • Powered by Gemini</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
