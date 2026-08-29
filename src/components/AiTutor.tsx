import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, User, Loader2, Sparkles, ChevronDown, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { useAuth } from '../useAuth';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "";

const cleanMarkdownContent = (text: string) => {
  if (!text) return text;
  // Protect currency signs (e.g. $100, $50) from LaTeX delimiters
  let cleaned = text.replace(/\$(\s*\d[\d,.]*)/g, '\\$$$1');
  // Normalize LaTeX delimiters for remarkMath / rehypeKatex
  cleaned = cleaned.replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$');
  cleaned = cleaned.replace(/\\\(/g, '$').replace(/\\\)/g, '$');
  return cleaned;
};

const getOfflineEconomicsResponse = (query: string, displayName: string = 'Scholar', topicContext: string | null = null): string => {
  const q = query.toLowerCase().trim();
  
  if (q.includes('what is economics') || q.includes('define economics') || q.includes('meaning of economics') || q.includes('definition of economics')) {
    return `### **What is Economics?**

**Economics** is the social science that analyzes how individuals, households, businesses, and governments make choices regarding the allocation of **scarce resources** to satisfy **unlimited wants**.

---

### **1. Core Pillars of Economics**
* **Scarcity:** Resources (land, labor, capital, enterprise) are inherently limited in supply.
* **Choice:** Because of scarcity, every society must choose *what* to produce, *how* to produce, and *for whom* to produce.
* **Opportunity Cost:** The real cost of any choice—measured as the value of the next best alternative given up.

---

### **2. Foundational Definitions**
* **Lionel Robbins (1932):** *"Economics is the science which studies human behaviour as a relationship between ends and scarce means which have alternative uses."*
* **Alfred Marshall (1890):** *"A study of mankind in the ordinary business of life; it examines that part of individual and social action which is most closely connected with the attainment and with the use of the material requisites of wellbeing."*
* **Adam Smith (1776):** Focused on the nature and causes of the wealth of nations and the role of the *"invisible hand"* in free markets.

---

### **3. The Two Main Branches**
1. **Microeconomics:** Studies the behavior of individual economic agents (consumers, firms, specific markets, price determination).
2. **Macroeconomics:** Studies aggregate economic variables for the entire nation (GDP, inflation, unemployment, monetary and fiscal policy).

---

### **4. Key Mathematical Formulation**
A consumer faces the foundational **Budget Constraint**:
\\[ P_X \\cdot X + P_Y \\cdot Y \\le I \\]
Where:
* \\( P_X, P_Y \\) = Unit prices of goods \\( X \\) and \\( Y \\)
* \\( X, Y \\) = Quantities consumed
* \\( I \\) = Total available budget/income

Would you like to explore **Microeconomics**, **Macroeconomics**, or a specific topic next?`;
  }

  if (q.includes('elasticity') || q.includes('ped') || q.includes('inelastic')) {
    return `### **Price Elasticity of Demand (PED)**

**Price Elasticity of Demand (PED)** measures the responsiveness or sensitivity of the quantity demanded of a good to a change in its price.

---

### **1. Formula & Calculation**
\\[ \\text{PED} = \\frac{\\% \\Delta Q_d}{\\% \\Delta P} = \\frac{\\frac{Q_2 - Q_1}{Q_1}}{\\frac{P_2 - P_1}{P_1}} \\]

Using the Point-Elasticity differential form:
\\[ \\varepsilon_d = \\frac{dQ}{dP} \\cdot \\frac{P}{Q} \\]

---

### **2. Interpretation of Values**
* \\( |\\text{PED}| > 1 \\): **Price Elastic** (e.g., luxury goods; consumers react strongly to price changes).
* \\( |\\text{PED}| < 1 \\): **Price Inelastic** (e.g., basic food, fuel, essential medicine; quantity changes little).
* \\( |\\text{PED}| = 1 \\): **Unitary Elastic** (revenue is maximized).
* \\( |\\text{PED}| = 0 \\): **Perfectively Inelastic** (vertical demand curve).
* \\( |\\text{PED}| = \\infty \\): **Perfectively Elastic** (horizontal demand curve).

---

### **3. Total Revenue (TR) Relationship**
* If Demand is **Elastic** (\\( |\\text{PED}| > 1 \\)): Lowering price $\\rightarrow$ Increases Total Revenue.
* If Demand is **Inelastic** (\\( |\\text{PED}| < 1 \\)): Increasing price $\\rightarrow$ Increases Total Revenue.`;
  }

  if (q.includes('demand') || q.includes('supply') || q.includes('equilibrium') || q.includes('shortage') || q.includes('surplus')) {
    return `### **Market Demand, Supply & Equilibrium**

In competitive markets, price and output are determined by the interaction of **Demand** and **Supply**.

---

### **1. The Law of Demand and Supply**
* **Law of Demand:** Ceteris paribus, as price \\( P \\) increases, quantity demanded \\( Q_d \\) decreases (downward sloping).
* **Law of Supply:** Ceteris paribus, as price \\( P \\) increases, quantity supplied \\( Q_s \\) increases (upward sloping).

---

### **2. Mathematical Equilibrium**
Equilibrium occurs where quantity demanded equals quantity supplied:
\\[ Q_d(P^*) = Q_s(P^*) \\]

Given linear equations:
\\[ Q_d = a - bP \\]
\\[ Q_s = c + dP \\]

Equilibrium Price (\\( P^* \\)) and Quantity (\\( Q^* \\)):
\\[ P^* = \\frac{a - c}{b + d} \\]
\\[ Q^* = a - b \\left( \\frac{a - c}{b + d} \\right) \\]

* **If \\( P > P^* \\):** Market Surplus (\\( Q_s > Q_d \\)) $\\rightarrow$ downward price pressure.
* **If \\( P < P^* \\):** Market Shortage (\\( Q_d > Q_s \\)) $\\rightarrow$ upward price pressure.`;
  }

  if (q.includes('inflation') || q.includes('cpi') || q.includes('deflation') || q.includes('stagflation')) {
    return `### **Understanding Inflation**

**Inflation** is the persistent, sustained increase in the general price level of goods and services in an economy over a period of time, leading to a decrease in purchasing power.

---

### **1. Major Causes of Inflation**
1. **Demand-Pull Inflation:** Occurs when aggregate demand (AD) outpaces aggregate supply (AS) (*"Too much money chasing too few goods"*).
2. **Cost-Push Inflation:** Caused by rising costs of production (e.g., wage spikes, oil price shocks, raw material shortages).
3. **Monetary Inflation:** Caused by excessive expansion of the domestic money supply by the central bank:
   \\[ M \\cdot V = P \\cdot Y \\quad \\text{(Fisher's Equation of Exchange)} \\]

---

### **2. Measurement: Consumer Price Index (CPI)**
\\[ \\text{CPI}_t = \\left( \\frac{\\sum (P_{t} \\cdot Q_{\\text{base}})}{\\sum (P_{\\text{base}} \\cdot Q_{\\text{base}})} \\right) \\times 100 \\]
\\[ \\text{Inflation Rate} (\\pi) = \\left( \\frac{\\text{CPI}_t - \\text{CPI}_{t-1}}{\\text{CPI}_{t-1}} \\right) \\times 100\\% \\]`;
  }

  if (q.includes('gdp') || q.includes('national income') || q.includes('gross domestic product')) {
    return `### **Gross Domestic Product (GDP)**

**Gross Domestic Product (GDP)** is the total monetary value of all finished goods and services produced within a country's borders during a specific time period.

---

### **1. The Expenditure Approach Equation**
\\[ Y = C + I + G + (X - M) \\]
Where:
* \\( Y \\) = Total National Income / Real GDP
* \\( C \\) = Private Household Consumption
* \\( I \\) = Gross Private Domestic Investment
* \\( G \\) = Government Spending on goods/services
* \\( X - M \\) = Net Exports (Exports minus Imports)

---

### **2. Real vs. Nominal GDP**
* **Nominal GDP:** Measured using current-year market prices (includes inflation effect).
* **Real GDP:** Evaluated at constant base-year prices (reflects true physical output growth).
\\[ \\text{GDP Deflator} = \\left( \\frac{\\text{Nominal GDP}}{\\text{Real GDP}} \\right) \\times 100 \\]`;
  }

  if (q.includes('monetary') || q.includes('fiscal') || q.includes('central bank') || q.includes('tax')) {
    return `### **Monetary Policy vs. Fiscal Policy**

Governments and Central Banks use macroeconomic policies to stabilize the economic business cycle.

---

### **1. Monetary Policy (Central Bank)**
* **Tools:** Open Market Operations (OMO), Policy Interest Rates (e.g., MPR / Fed Funds), Cash Reserve Ratio (CRR).
* **Expansionary Policy:** Lower interest rates $\\rightarrow$ Cheaper borrowing $\\rightarrow$ Increases \\( I \\) & \\( C \\).
* **Contractionary Policy:** Raise interest rates $\\rightarrow$ Tames inflation $\\rightarrow$ Slows aggregate demand.

---

### **2. Fiscal Policy (Ministry of Finance / Government)**
* **Tools:** Taxation (\\( T \\)) and Government Expenditure (\\( G \\)).
* **Keynesian Fiscal Multiplier:**
\\[ k = \\frac{1}{1 - \\text{MPC}} = \\frac{1}{\\text{MPS}} \\]
Where \\( \\text{MPC} \\) is the Marginal Propensity to Consume.`;
  }

  // General fallback for any other question
  return `### **Economics Insight: ${query}**

Hello ${displayName}! Here is a structured breakdown:

1. **Economic Intuition:**
   In economics, every decision involves evaluating trade-offs, opportunity costs, and incentives. When analyzing **"${query}"**, economists examine how rational agents optimize outcomes subject to constraints.

2. **Core Theoretical Framework:**
   * **Marginal Analysis:** Decision makers optimize by setting **Marginal Benefit = Marginal Cost** (\\( MB = MC \\)).
   * **Equilibrium Condition:** Stable states are reached when no agent has an incentive to unilaterally alter their behavior (Nash Equilibrium / Market Clearing).

3. **Recommended Study Path:**
   ${topicContext ? `Since you are studying **${topicContext}**, review the interactive simulations and formulas in the Study Guide tab.` : 'Check the Study Guide and Interactive Simulators for hands-on models and graphs on this topic.'}

Feel free to ask for specific definitions, formulas, or step-by-step mathematical proofs!`;
};

export const AiTutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { profile } = useAuth();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth' });
  }, [messages, isLoading, isStreaming]);

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
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage = input.trim();
    const topicContext = getTopicContext(location.pathname);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Build context-aware prompt
      const systemPrompt = `You are an expert AI Economics Tutor named "EcoTutor". The user is ${profile?.displayName || 'a student'}.
${topicContext ? `The user is currently studying the topic: ${topicContext}. Try to relate your answers to this if relevant.` : ''}
Answer the user's question clearly, pedagogically, and accurately. Use Markdown and LaTeX (with single backslash) for math formatting where appropriate.
User's query: ${userMessage}`;

      const response = await fetch(`${API_BASE}/api/agentTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'antigravity-preview-05-2026',
          prompt: systemPrompt,
          stream: true
        })
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      if (!response.body) throw new Error('No response body');

      // Add a placeholder message for the AI response
      setMessages(prev => [...prev, { role: 'model', content: '' }]);
      setIsLoading(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete fragment in buffer
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          
          const dataStr = trimmed.substring(6);
          if (dataStr === '[DONE]') {
            break;
          }
          
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              aiResponse += parsed.text;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'model',
                  content: aiResponse
                };
                return newMessages;
              });
            } else if (parsed.error) {
              console.error('AI Tutor Stream Error:', parsed.error);
              throw new Error(parsed.error);
            }
          } catch (e: any) {
            if (e.message && !e.message.includes('Unexpected end of JSON')) {
              console.warn('AI Tutor stream chunk warning:', e);
            }
          }
        }
      }
    } catch (error) {
      console.warn('AI Tutor API unavailable, generating smart offline response:', error);
      
      const fallbackResponse = getOfflineEconomicsResponse(userMessage, profile?.displayName, topicContext);
      
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'model' && lastMsg.content.length === 0) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'model',
            content: fallbackResponse
          };
          return updated;
        } else if (lastMsg && lastMsg.role === 'model' && lastMsg.content.length > 0) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'model',
            content: lastMsg.content + '\n\n*(Stream disconnected)*'
          };
          return updated;
        }

        return [...prev, { 
          role: 'model', 
          content: fallbackResponse 
        }];
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
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
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center font-['Hanken_Grotesk'] border-2 border-emerald-400/30 cursor-pointer"
        aria-label="Open AI Tutor"
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
            className="fixed bottom-0 md:bottom-8 right-0 md:right-8 z-[110] w-full md:w-[420px] h-[85vh] md:h-[600px] bg-white dark:bg-slate-900 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden font-['Hanken_Grotesk'] border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between shadow-md z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">EcoTutor AI</h3>
                  <p className="text-emerald-100 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    {isStreaming ? 'Streaming answer...' : 'Online & Ready'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
              >
                <ChevronDown size={22} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
              {messages.map((msg, idx) => {
                const isCurrentStreamingModel = isStreaming && idx === messages.length - 1 && msg.role === 'model';

                return (
                  <div 
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      
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
                            remarkPlugins={[remarkGfm, remarkMath]} 
                            rehypePlugins={[rehypeKatex]}
                          >
                            {cleanMarkdownContent(msg.content)}
                          </ReactMarkdown>
                          {isCurrentStreamingModel && (
                            <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse align-middle" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
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
                  placeholder={isStreaming ? "EcoTutor is responding..." : "Ask a question..."}
                  disabled={isLoading || isStreaming}
                  className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-slate-800 dark:text-white px-2 py-2.5 text-sm disabled:opacity-50"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || isStreaming}
                  className="w-11 h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors active:scale-95 cursor-pointer"
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
