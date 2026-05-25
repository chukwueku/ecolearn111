import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, Cell,
  PieChart, Pie, ComposedChart
} from 'recharts';
import { Loader2, ChevronRight, ChevronLeft, BookOpen, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { SECONDARY_ROADMAP, UNDERGRADUATE_ROADMAP } from '../constants';
import { MICRO_STUDY_GUIDE } from '../lib/studyData';
import { ADVANCED_STUDY_GUIDE } from '../lib/advancedStudyData';
import { generateStudyGuide } from '../gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Lazy load the EconomicsSimulator component
const LazyEconomicsSimulator = React.lazy(() => 
  import('./EconomicsSimulator').then(module => ({ default: module.EconomicsSimulator }))
);

export const StudyGuide = ({ topicId }: { topicId: string }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const roadmap = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
  const topic = roadmap.find(t => t.id === topicId);
  
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Touch Swipes
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      const currentRoadmap = profile?.level === 'secondary' ? SECONDARY_ROADMAP : UNDERGRADUATE_ROADMAP;
      const currentTopic = currentRoadmap.find(t => t.id === topicId);
      if (!currentTopic) return;
      setLoading(true);

      const localContent = MICRO_STUDY_GUIDE[topicId] || ADVANCED_STUDY_GUIDE[topicId];
      let guideContent = "";

      if (localContent) {
        guideContent = localContent;
      } else {
        guideContent = await generateStudyGuide(currentTopic.title, profile?.level || 'secondary', currentTopic.description);
      }

      setContent(guideContent);
      setLoading(false);
    };
    fetchGuide();
  }, [profile?.level, topicId]);

  // Reset to first page when topicId changes
  useEffect(() => {
    setCurrentPage(0);
    setDirection(0);
  }, [topicId]);

  // Parse pages split by horizontal rule `---` or fall back to high-level headings
  const pages = useMemo(() => {
    if (!content) return [];
    let items = content.split(/(?:^|\n)\s*---\s*(?:\n|$)/);
    items = items.map(p => p.trim()).filter(p => p.length > 0);
    
    if (items.length <= 1) {
      // Split by Level 2 headings as page breaks
      const headingPages: string[] = [];
      const lines = content.split('\n');
      let currentPart: string[] = [];
      for (const line of lines) {
        if (line.trim().startsWith('## ') && currentPart.length > 0) {
          headingPages.push(currentPart.join('\n'));
          currentPart = [line];
        } else {
          currentPart.push(line);
        }
      }
      if (currentPart.length > 0) {
        headingPages.push(currentPart.join('\n'));
      }
      if (headingPages.length > 1) {
        return headingPages;
      }
    }
    return items.length > 0 ? items : [content];
  }, [content]);

  const totalPages = pages.length;

  // Extract headings with exact page index for smart jumped navigation
  const headingsWithPages = useMemo(() => {
    if (pages.length === 0) return [];
    const extracted: { level: number; text: string; id: string; pageIndex: number }[] = [];
    
    pages.forEach((pageContent, pageIndex) => {
      const pageHeadingRegex = /^(#{1,3})\s+(.+)$/gm;
      let match;
      while ((match = pageHeadingRegex.exec(pageContent)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        extracted.push({ level, text, id, pageIndex });
      }
    });
    return extracted;
  }, [pages]);

  // Navigation handlers
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHeadingClick = (headingId: string, pageIndex: number) => {
    if (pageIndex !== currentPage) {
      setDirection(pageIndex > currentPage ? 1 : -1);
      setCurrentPage(pageIndex);
    }
    setTimeout(() => {
      const el = document.getElementById(headingId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading || totalPages <= 1) return;
      if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, currentPage, totalPages]);

  // Mobile swipes
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // Skip swipe handling if user is interacting with interactive or scrollable components
    if (
      target.closest('.overflow-x-auto') ||
      target.closest('table') ||
      target.closest('select') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('.recharts-responsive-container') ||
      target.closest('.simulator-container')
    ) {
      touchStartRef.current = null;
      return;
    }

    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    touchEndRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    touchEndRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const dx = touchStartRef.current.x - touchEndRef.current.x;
    const dy = touchStartRef.current.y - touchEndRef.current.y;
    
    // If user is mostly scrolling vertically, ignore swipe and abort
    if (Math.abs(dy) > Math.abs(dx) || Math.abs(dy) > 50) {
      touchStartRef.current = null;
      touchEndRef.current = null;
      return;
    }

    const isLeftSwipe = dx > 70;
    const isRightSwipe = dx < -70;
    
    if (isLeftSwipe) {
      nextPage();
    } else if (isRightSwipe) {
      prevPage();
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  if (!topic) return <div>Topic not found</div>;

  const HeadingRenderer = ({ level, children }: { level: number; children: React.ReactNode }) => {
    const text = React.Children.toArray(children).join('');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const Tag = `h${level}` as any;
    return <Tag id={id} className="scroll-mt-32">{children}</Tag>;
  };

  const SimulatorRenderer = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : '';
    
    if (lang === 'chart') {
      try {
        const config = JSON.parse(String(children).replace(/\n$/, ''));
        const { type, data, xAxis, yAxis, series, title, height = 300 } = config;
        const chartHeight = typeof height === 'number' && !isNaN(height) ? height : 300;
        
        return (
          <div className="my-10 p-4 sm:p-8 card-minimal bg-white dark:bg-slate-900 not-prose border border-border rounded-xl">
            {title && (
              <h4 className="text-[10px] font-bold text-slate-500 mb-6 text-center uppercase tracking-wider">
                {title}
              </h4>
            )}
            <div style={{ width: '100%', height: chartHeight }}>
              <ResponsiveContainer>
                {type === 'line' ? (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                    {series.map((s: any, i: number) => (
                      <Line key={i} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#0ea5e9'} strokeWidth={2} dot={{ r: 3, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                    ))}
                  </LineChart>
                ) : type === 'area' ? (
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                    {series.map((s: any, i: number) => (
                      <Area key={i} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#0ea5e9'} fill={s.color || '#0ea5e9'} fillOpacity={0.1} />
                    ))}
                  </AreaChart>
                ) : type === 'bar' ? (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                    {series.map((s: any, i: number) => (
                      <Bar key={i} dataKey={s.key} name={s.name} fill={s.color || '#0ea5e9'} radius={[4, 4, 0, 0]} stackId={s.stackId} />
                    ))}
                  </BarChart>
                ) : type === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey={series[0].key}
                      nameKey={xAxis}
                      label
                    >
                      {data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#0f172a', '#0ea5e9', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][index % 8]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" />
                  </PieChart>
                ) : type === 'combo' ? (
                  <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis type="number" dataKey={xAxis} name={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis type="number" yAxisId="left" name={yAxis} tick={{ fontSize: 10, fontWeight: 900 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '0', border: '1px solid #000' }} />
                    <Legend />
                    {series.map((s: any, i: number) => {
                      if (s.type === 'line') {
                        return <Line key={i} yAxisId="left" type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#10b981'} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />;
                      } else {
                        return <Scatter key={i} yAxisId="left" dataKey={s.key} name={s.name} fill={s.color || '#ef4444'} shape="circle" />;
                      }
                    })}
                  </ComposedChart>
                ) : (
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis type="number" dataKey={xAxis} name={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis type="number" dataKey={yAxis} name={yAxis} tick={{ fontSize: 10, fontWeight: 900 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '0', border: '1px solid #000' }} />
                    <Legend />
                    {series.map((s: any, i: number) => (
                      <Scatter key={i} name={s.name} data={data} fill={s.color || '#10b981'} shape="circle" />
                    ))}
                  </ScatterChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        );
      } catch (e) {
        return <pre className={className} {...props}>{children}</pre>;
      }
    }

    if (lang === 'simulator') {
      try {
        const config = JSON.parse(String(children).replace(/\n$/, ''));
        return (
          <div className="my-6 sm:my-10 overflow-hidden">
            <React.Suspense fallback={
              <div className="p-8 sm:p-12 text-center bg-card border-border flex flex-col items-center justify-center gap-4 rounded-xl sm:rounded-3xl border">
                <Loader2 className="animate-spin text-sky-500 w-8 h-8" />
                <p className="text-xs text-muted font-bold tracking-wider uppercase">Loading Interactive Simulator...</p>
              </div>
            }>
              <LazyEconomicsSimulator {...config} />
            </React.Suspense>
          </div>
        );
      } catch (e) {
        return <pre className={className} {...props}>{children}</pre>;
      }
    }

    return <pre className={className} {...props}>{children}</pre>;
  };

  return (
    <div className="min-h-screen bg-paper pt-24 md:pt-32 pb-24 md:pb-32 transition-colors duration-300">
      {/* Hero Header */}
      <header className="px-6 md:px-10 max-w-7xl mx-auto mb-10 md:mb-16">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
            Back to Dashboard
          </button>
          <span className="w-1 h-1 bg-slate-300 dark:bg-slate-800 rounded-full"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
            <BookOpen size={10} />
            {topic.category}
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.0] mb-6">
          {topic.title}
        </h1>
        <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-500 max-w-2xl leading-relaxed">
          {topic.description}
        </p>
      </header>

      <div className="px-4 sm:px-6 md:px-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Sidebar TOC & Chapter Filter */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit space-y-12">
          <div className="border-l border-slate-200 dark:border-slate-800 pl-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-8">Topics</p>
            <nav className="space-y-4">
              {roadmap.map((ch) => (
                <Link
                  key={ch.id}
                  to={`/study-guide/${ch.id}`}
                  className={cn(
                    "block text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-sky-600 dark:hover:text-sky-400",
                    topicId === ch.id ? "text-sky-600 dark:text-sky-400" : "text-slate-500 dark:text-slate-700"
                  )}
                >
                  {ch.category}
                </Link>
              ))}
            </nav>
          </div>

          {!loading && headingsWithPages.length > 0 && (
            <div className="border-l border-slate-200 dark:border-slate-800 pl-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-700 mb-8">Table of Contents</p>
              <nav className="space-y-5">
                {headingsWithPages.map((heading, i) => (
                  <button
                    key={i}
                    onClick={() => handleHeadingClick(heading.id, heading.pageIndex)}
                    className={cn(
                      "block text-left text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-sky-600 dark:hover:text-sky-400 w-full cursor-pointer",
                      currentPage === heading.pageIndex ? "text-sky-600 dark:text-sky-400" :
                      heading.level === 1 ? "text-slate-900 dark:text-white" : 
                      heading.level === 2 ? "pl-4 text-slate-600 dark:text-slate-500" : "pl-8 text-slate-500 dark:text-slate-700"
                    )}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </aside>

        {/* Mobile Chapter Filter */}
        <div className="lg:hidden px-0 mb-4 space-y-4">
          <div className="bg-white dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-4">Select Topic</p>
            <select 
              value={topicId}
              onChange={(e) => navigate(`/study-guide/${e.target.value}`)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none"
            >
              {roadmap.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.category}: {ch.title}</option>
              ))}
            </select>
          </div>

          {!loading && headingsWithPages.length > 0 && (
            <div className="bg-white dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-4">Jump to Section</p>
              <select 
                value=""
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const [headingId, pageIndexStr] = val.split(':');
                    handleHeadingClick(headingId, parseInt(pageIndexStr, 10));
                  }
                }}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none"
              >
                <option value="">-- Table of Contents --</option>
                {headingsWithPages.map((h, i) => (
                  <option key={i} value={`${h.id}:${h.pageIndex}`}>
                    {h.level > 1 ? '\u00A0\u00A0'.repeat(h.level - 1) : ''}{h.text}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Paginated Content & Controls */}
        <div className="flex-1 max-w-3xl">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-6">
              <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
              <p className="text-slate-600 dark:text-slate-500 font-medium animate-pulse">Generating your study guide...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Dynamic Pages Indicator & Swipe Hint */}
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
                <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                  <Sparkles size={11} className="animate-pulse" />
                  Swipe left/right or use arrows to turn pages
                </span>
                <span>
                  Page {currentPage + 1} of {totalPages}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 dark:bg-sky-400 transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
              </div>

              {/* Page Container with elegant 2D Horizontal Page Turn */}
              <div 
                className="relative min-h-[480px] overflow-visible"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'pan-y' }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={{
                      initial: (dir: number) => ({
                        x: dir > 0 ? 120 : -120,
                        opacity: 0,
                        scale: 0.98,
                      }),
                      animate: {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                          x: { type: "spring", stiffness: 300, damping: 28 },
                          opacity: { duration: 0.2 },
                          scale: { duration: 0.22, ease: "easeOut" }
                        }
                      },
                      exit: (dir: number) => ({
                        x: dir > 0 ? -120 : 120,
                        opacity: 0,
                        scale: 0.98,
                        transition: {
                          x: { type: "spring", stiffness: 300, damping: 28 },
                          opacity: { duration: 0.15 },
                          scale: { duration: 0.18, ease: "easeIn" }
                        }
                      })
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none border-l-[3px] sm:border-l-[6px] border-l-sky-500 dark:border-l-sky-600/90"
                    style={{ touchAction: 'pan-y' }}
                  >
                    <div className="markdown-body prose prose-base md:prose-lg prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:tracking-tight prose-headings:font-bold prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-li:text-slate-600 dark:prose-li:text-slate-400">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]}
                        components={{
                          h1: ({ children }) => <HeadingRenderer level={1}>{children}</HeadingRenderer>,
                          h2: ({ children }) => <HeadingRenderer level={2}>{children}</HeadingRenderer>,
                          h3: ({ children }) => <HeadingRenderer level={3}>{children}</HeadingRenderer>,
                          pre: ({ children }) => <>{children}</>,
                          code: SimulatorRenderer,
                          table: ({ children }) => (
                            <div className="my-10 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-card shadow-sm">
                              <table className="w-full border-collapse text-left min-w-[500px]">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-slate-50 dark:bg-slate-900 border-b border-border">{children}</thead>,
                          th: ({ children }) => <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink border-r border-slate-200 dark:border-slate-800 last:border-r-0 whitespace-nowrap">{children}</th>,
                          td: ({ children }) => <td className="p-4 text-sm text-muted border-b border-r border-slate-100 dark:border-slate-900 last:border-r-0 align-top font-medium">{children}</td>,
                          tr: ({ children }) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 last:border-b-0">{children}</tr>,
                        }}
                      >
                        {pages[currentPage] || ''}
                      </ReactMarkdown>
                    </div>

                    {/* Final module complete banner ONLY render on the absolute last page */}
                    {currentPage === totalPages - 1 && (
                      <div className="mt-16 p-6 sm:p-10 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Module Complete?</p>
                          <h4 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">Test your knowledge</h4>
                        </div>
                        <Link 
                          to={`/challenge/${topicId}`}
                          className="px-8 py-4 bg-slate-900 dark:bg-sky-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-sky-600 dark:hover:bg-sky-700 transition-all shadow-2xl shrink-0"
                        >
                          Start Challenge
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls layout toolbar */}
              <div className="flex items-center justify-between pt-4 bg-paper">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} className="mr-0.5" />
                  Prev Page
                </button>

                <div className="text-xs font-bold text-muted uppercase tracking-widest hidden sm:block">
                  {currentPage + 1} / {totalPages}
                </div>

                {currentPage < totalPages - 1 ? (
                  <button
                    onClick={nextPage}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-sky-300 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    Next Page
                    <ArrowRight size={14} className="ml-0.5" />
                  </button>
                ) : (
                  <Link
                    to={`/challenge/${topicId}`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold uppercase tracking-[0.15em] transition-all"
                  >
                    Finish Module
                    <Sparkles size={14} className="ml-0.5 animate-pulse" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StudyGuideWrapper = () => {
  const { topicId } = useParams();
  return <StudyGuide topicId={topicId || ''} />;
};

export default StudyGuideWrapper;
