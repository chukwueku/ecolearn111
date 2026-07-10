import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Trophy, 
  TrendingUp, 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  BookOpenCheck,
  Award,
  PlayCircle,
  Lightbulb,
  Layers,
  Globe,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chapter, PARTS, INTERNATIONAL_ECONOMICS_CHAPTERS } from '../lib/internationalEconomicsChapters';
import { EconomicsSimulator } from './EconomicsSimulator';
import { MathText } from './MathComponents';
import { getChapterExpansion } from '../lib/chapterExpansions';

export const InternationalEconomicsTextbook: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'summary' | 'syllabus' | 'quiz' | 'simulator'>('summary');
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Flashcard states
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Get currently selected chapter
  const currentChapter = useMemo(() => {
    return INTERNATIONAL_ECONOMICS_CHAPTERS.find(ch => ch.id === selectedChapterId) || INTERNATIONAL_ECONOMICS_CHAPTERS[0];
  }, [selectedChapterId]);

  // Retrieve expanded academic details for the active chapter
  const chapterExpansion = useMemo(() => {
    return getChapterExpansion(
      currentChapter.id,
      currentChapter.title,
      currentChapter.partId,
      currentChapter.summary,
      currentChapter.topics
    );
  }, [currentChapter]);

  // Reset states when chapter changes
  React.useEffect(() => {
    setActiveTab('summary');
    setQuizAnswers({});
    setShowExplanation({});
    setActiveCardIdx(0);
    setIsFlipped(false);
  }, [selectedChapterId]);

  // Filtered chapters list
  const filteredChapters = useMemo(() => {
    return INTERNATIONAL_ECONOMICS_CHAPTERS.filter(ch => {
      const matchesPart = selectedPart === 'all' || ch.partId === selectedPart;
      const matchesSearch = 
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ch.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPart && matchesSearch;
    });
  }, [selectedPart, searchQuery]);

  // Handle quiz selection
  const handleSelectOption = (qIdx: number, optIdx: number) => {
    const key = `${selectedChapterId}-${qIdx}`;
    if (quizAnswers[key] !== undefined) return; // Prevent changing answer once selected
    
    setQuizAnswers(prev => ({ ...prev, [key]: optIdx }));
    setShowExplanation(prev => ({ ...prev, [key]: true }));
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all">
      {/* Textbook Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8 text-white border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-sky-500/20">
                Interactive Edition
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Advanced Study Suite</p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">International Economics Companion</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Complete, interactive 62-chapter textbook study guide and simulator portal based on the authoritative curriculum syllabus.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-2 text-slate-300">
            <BookOpenCheck size={16} className="text-sky-400" />
            <div className="text-left">
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Curriculum Coverage</p>
              <p className="text-xs font-bold mt-0.5">62 Chapters Mastered</p>
            </div>
          </div>
        </div>

        {/* Search and Parts Filter row */}
        <div className="mt-8 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search chapters, topics, or key concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          </div>

          <div className="flex flex-wrap gap-1.5 max-w-full overflow-x-auto pb-1 xl:pb-0">
            <button
              onClick={() => setSelectedPart('all')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                selectedPart === 'all'
                  ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              All Parts
            </button>
            {PARTS.map(part => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
                  selectedPart === part.id
                    ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Part {part.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Sidebar Chapter Selector */}
        <div className="col-span-1 lg:col-span-4 border-r border-slate-200 dark:border-slate-800/80 max-h-[600px] overflow-y-auto bg-slate-50/50 dark:bg-slate-900/10 scrollbar-thin">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950/40">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Showing {filteredChapters.length} Chapters
            </p>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-900">
            {filteredChapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChapterId(ch.id)}
                className={`w-full text-left p-4 transition-all hover:bg-sky-500/5 dark:hover:bg-sky-500/10 flex items-start gap-3.5 border-l-4 cursor-pointer ${
                  selectedChapterId === ch.id
                    ? 'bg-sky-50/80 dark:bg-sky-950/20 border-l-sky-500'
                    : 'border-l-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  selectedChapterId === ch.id
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {ch.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 leading-none mb-1">
                    Part {ch.partId} • Ch {ch.id}
                  </p>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate">
                    {ch.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    {ch.topics.join(', ')}
                  </p>
                </div>
              </button>
            ))}
            
            {filteredChapters.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Search className="mx-auto mb-3 opacity-30" size={32} />
                <p className="text-xs font-bold">No chapters found matching your query.</p>
                <p className="text-[10px] opacity-70 mt-1">Try another search or select "All Parts"</p>
              </div>
            )}
          </div>
        </div>

        {/* Reading and Practice Pane */}
        <div className="col-span-1 lg:col-span-8 flex flex-col bg-white dark:bg-slate-950">
          {/* Active Chapter Header Info */}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/10">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                Part {currentChapter.partId}: {currentChapter.partTitle}
              </span>
              <div className="flex gap-1.5 shrink-0">
                <button
                  disabled={currentChapter.id === 1}
                  onClick={() => setSelectedChapterId(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={currentChapter.id === 62}
                  onClick={() => setSelectedChapterId(prev => Math.min(62, prev + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              Chapter {currentChapter.id}: {currentChapter.title}
            </h3>
          </div>

          {/* Chapter Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/20">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3.5 px-3 border-b-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'summary'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              High-Yield Study Guide
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`py-3.5 px-3 border-b-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'syllabus'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Syllabus Outline
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`py-3.5 px-3 border-b-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy size={11} />
              Practice Quiz
            </button>
            {currentChapter.simulatorMode && (
              <button
                onClick={() => setActiveTab('simulator')}
                className={`py-3.5 px-3 border-b-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 ${
                  activeTab === 'simulator'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent hover:text-emerald-500'
                }`}
              >
                <TrendingUp size={11} />
                Interactive Simulator
              </button>
            )}
          </div>

          {/* Active Tab Panel */}
          <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[640px] scrollbar-thin">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-4"
                >
                  <div className="bg-sky-500/5 dark:bg-sky-500/[0.02] p-5 sm:p-6 rounded-2xl border border-sky-500/10 shadow-inner">
                    <p className="text-sm leading-relaxed font-normal whitespace-pre-line text-slate-800 dark:text-slate-200">
                      <MathText text={currentChapter.summary} />
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80">
                    <Compass size={14} className="text-slate-400 shrink-0" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Study Tip: Read through the syllabus and attempt the companion quiz to test your comprehension!
                    </p>
                  </div>

                  {/* Expanded Core Study Toolkit */}
                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/80 space-y-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-sky-500 animate-pulse" size={16} />
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
                        Comprehensive Academic Expansion
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Section 1: Academic Spotlight */}
                      <div className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3.5">
                        <div className="flex items-center gap-2">
                          <BookOpen className="text-sky-500 shrink-0" size={16} />
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Core Theoretical Spotlight
                          </h5>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                          {chapterExpansion.spotlight}
                        </p>
                      </div>

                      {/* Section 2: Analytical Mechanics & Formula */}
                      <div className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3.5 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Layers className="text-sky-500 shrink-0" size={16} />
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                              Analytical Mechanics & Equations
                            </h5>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                            {chapterExpansion.mechanics}
                          </p>
                        </div>
                        {chapterExpansion.formula && (
                          <div className="mt-4 p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 text-center shadow-sm">
                            <MathText text={`$$ ${chapterExpansion.formula} $$`} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 3: Sovereign Policy Case Study */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="text-sky-500 shrink-0" size={16} />
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Sovereign Policy & Historical Application
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {chapterExpansion.caseStudy}
                      </p>
                    </div>

                    {/* Section 4: Interactive Flashcards */}
                    <div className="p-5 bg-sky-500/5 dark:bg-sky-500/[0.01] border border-sky-500/10 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="text-amber-500 shrink-0" size={16} />
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Active Recall Challenge
                          </h5>
                        </div>
                        <div className="text-[10px] font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                          Card {activeCardIdx + 1} of 3
                        </div>
                      </div>

                      {/* Flashcard Area */}
                      <div className="relative min-h-[140px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.button
                            key={`${activeCardIdx}-${isFlipped}`}
                            initial={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            exit={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => setIsFlipped(prev => !prev)}
                            className={`w-full min-h-[120px] p-6 rounded-xl border text-center flex flex-col items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer ${
                              isFlipped 
                                ? 'bg-sky-500 text-white border-sky-600' 
                                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-500/50'
                            }`}
                          >
                            <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 leading-none">
                              {isFlipped ? "Theory / Explanation" : "Core Academic Concept"}
                            </span>
                            <p className="text-xs sm:text-sm font-bold leading-relaxed max-w-lg px-2">
                              {isFlipped 
                                ? chapterExpansion.flashcards[activeCardIdx]?.back 
                                : chapterExpansion.flashcards[activeCardIdx]?.front
                              }
                            </p>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 opacity-70 mt-1">
                              <RefreshCw size={9} />
                              Click to Flip Card
                            </span>
                          </motion.button>
                        </AnimatePresence>
                      </div>

                      {/* Flashcard Pagination */}
                      <div className="flex justify-between items-center pt-2">
                        <button
                          disabled={activeCardIdx === 0}
                          onClick={() => {
                            setIsFlipped(false);
                            setTimeout(() => setActiveCardIdx(prev => prev - 1), 150);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 cursor-pointer"
                        >
                          Previous Card
                        </button>
                        <button
                          disabled={activeCardIdx === 2}
                          onClick={() => {
                            setIsFlipped(false);
                            setTimeout(() => setActiveCardIdx(prev => prev + 1), 150);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 cursor-pointer"
                        >
                          Next Card
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'syllabus' && (
                <motion.div
                  key="syllabus"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Topics covered in the textbook table of contents:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentChapter.topics.map((topic, index) => (
                      <li 
                        key={index}
                        className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/60"
                      >
                        <div className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal">
                          {topic}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-8"
                >
                  {currentChapter.quiz.map((q, qIdx) => {
                    const key = `${selectedChapterId}-${qIdx}`;
                    const chosenOptIdx = quizAnswers[key];
                    const isAnswered = chosenOptIdx !== undefined;

                    return (
                      <div 
                        key={qIdx} 
                        className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-4"
                      >
                        <div className="flex items-start gap-3">
                          <HelpCircle className="text-sky-500 shrink-0 mt-0.5" size={16} />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-normal">
                            Question {qIdx + 1}: {q.question}
                          </h4>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-2.5 pl-7">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = chosenOptIdx === optIdx;
                            const isCorrect = q.answer === optIdx;
                            let btnStyle = "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900";

                            if (isAnswered) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-400";
                              } else if (isSelected) {
                                btnStyle = "bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-400";
                              } else {
                                btnStyle = "opacity-60 bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isAnswered}
                                onClick={() => handleSelectOption(qIdx, optIdx)}
                                className={`w-full text-left p-3.5 border text-xs font-semibold rounded-xl flex items-center justify-between gap-3 transition-all ${btnStyle} ${!isAnswered && 'cursor-pointer'}`}
                              >
                                <span>{opt}</span>
                                {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0" size={14} />}
                                {isAnswered && isSelected && !isCorrect && <XCircle className="text-rose-500 shrink-0" size={14} />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {showExplanation[key] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-sky-500/5 dark:bg-sky-500/[0.02] border-l-4 border-l-sky-500 p-4 rounded-r-xl ml-7 mt-3"
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <Award className="text-sky-500" size={14} />
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                                {chosenOptIdx === q.answer ? "Excellent! Correct Answer" : "Incorrect, Study Explanation"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                              {q.explanation}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'simulator' && currentChapter.simulatorMode && (
                <motion.div
                  key="simulator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
                    <PlayCircle className="text-emerald-500" size={18} />
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider leading-none">
                        Interactive Live Model Connected
                      </h4>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-1">
                        Manipulate parameters directly to visualize the theoretical outcomes described in Chapter {currentChapter.id}.
                      </p>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-1 sm:p-2">
                    <EconomicsSimulator mode={currentChapter.simulatorMode} title={currentChapter.title + " Simulator"} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
