import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, Cell,
  PieChart, Pie, ComposedChart
} from 'recharts';
import { Loader2, ChevronRight, ChevronLeft, BookOpen, ArrowLeft, ArrowRight, Sparkles, Copy, Check, Maximize2, Minimize2, Columns, List } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { MICRO_STUDY_GUIDE } from '../lib/studyData';
import { ADVANCED_STUDY_GUIDE } from '../lib/advancedStudyData';
import { SS2_STUDY_GUIDE } from '../lib/ss2StudyData';
import { SS3_STUDY_GUIDE } from '../lib/ss3StudyData';
import { generateStudyGuide } from '../gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { motion, AnimatePresence } from 'motion/react';
import { useRoadmap } from '../hooks/useRoadmap';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const retryImport = (fn: () => Promise<any>) => async () => {
  try {
    return await fn();
  } catch (error) {
    if (error.message.includes('fetch dynamically imported module') || error.message.includes('Failed to fetch')) {
      console.warn('Chunk loading failed, reloading window...');
      window.location.reload();
    }
    throw error;
  }
};

const LazyInternationalEconomicsTextbook = React.lazy(retryImport(() => 
  import('./InternationalEconomicsTextbook').then(module => ({ default: module.InternationalEconomicsTextbook }))
));
const LazyEconometricsStudyGuide = React.lazy(retryImport(() => 
  import('./EconometricsStudyGuide').then(module => ({ default: module.EconometricsStudyGuide }))
));
const LazyEconomicsSimulator = React.lazy(retryImport(() => 
  import('./EconomicsSimulator').then(module => ({ default: module.EconomicsSimulator }))
));


const cleanMarkdownContent = (text: string) => {
  if (!text) return text;
  
  // Clean up LaTeX formatting and extra asterisks that might mess up parsing
  let cleaned = text.replace(/\\\\\[/g, '$$$$').replace(/\\\\\]/g, '$$$$');
  cleaned = cleaned.replace(/\\\\\(/g, '$').replace(/\\\\\)/g, '$');
  
  return cleaned;
};

const extractLatex = (node: any): string | null => {
  if (!node) return null;
  if (node.type === 'element' && node.tagName === 'annotation' && node.properties?.encoding === 'application/x-tex') {
    return node.children?.[0]?.value || null;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = extractLatex(child);
      if (found) return found;
    }
  }
  return null;
};

const rehypeMathMarker = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number, parent: any) => {
      const classNames = node.properties?.className;
      if (node.tagName === 'span' && Array.isArray(classNames)) {
        if (classNames.includes('katex-display')) {
          node.properties['data-math-block'] = true;
        } else if (classNames.includes('katex') && !classNames.includes('katex-display')) {
          if (parent && parent.tagName === 'span' && Array.isArray(parent.properties?.className) && parent.properties.className.includes('katex-display')) {
            node.properties['data-math-inner'] = true;
          } else {
            node.properties['data-math-inline'] = true;
          }
        }
      }
    });
  };
};

const CopyMathButton = ({ latex, isBlock }: { latex: string, isBlock?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(isBlock ? `$$\n${latex}\n$$` : `$${latex}$`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={cn(
        "z-10 p-1.5 flex items-center justify-center text-slate-400 hover:text-sky-600 dark:text-slate-500 dark:hover:text-sky-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm cursor-pointer hover:shadow",
        isBlock ? "absolute top-2 right-2 md:top-4 md:right-4" : "absolute -top-7 left-1/2 -translate-x-1/2"
      )}
      title="Copy LaTeX"
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
};

export const StudyGuide = ({ topicId }: { topicId: string }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const level = useMemo(() => {
    if (topicId.startsWith('ss2-')) return 'secondary-ss2';
    if (topicId.startsWith('ug-ch')) return 'secondary-ss3';
    if (topicId.startsWith('ug-') || topicId.startsWith('uni-')) return 'undergraduate';
    return 'secondary';
  }, [topicId]);
  
  const { roadmap } = useRoadmap(level);

  const topic = roadmap.find(t => t.id === topicId) || { id: topicId, title: 'Loading...', description: '', category: '' };
  
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState<'textbook' | 'standard'>('standard');
  const [isWideReader, setIsWideReader] = useState(false);
  const [readerWidth, setReaderWidth] = useState<'standard' | 'wide' | 'full'>('wide');
  const [isDoubleColumn, setIsDoubleColumn] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState<'base' | 'lg' | 'xl'>('base');
  const [showFloatingTOC, setShowFloatingTOC] = useState(false);
  
  // Touch Swipes
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      if (!topic || topic.title === 'Loading...') return;
      setLoading(true);

      // Check local content first to render INSTANTLY without any network delay!
      let localContent = topicId.startsWith('ss2-') 
        ? SS2_STUDY_GUIDE[topicId] 
        : (topicId in ADVANCED_STUDY_GUIDE 
          ? ADVANCED_STUDY_GUIDE[topicId as keyof typeof ADVANCED_STUDY_GUIDE] 
          : (topicId === 'ug-micro'
            ? MICRO_STUDY_GUIDE['ug-micro']
            : (topicId.startsWith('ug-ch') 
              ? SS3_STUDY_GUIDE[topicId] 
              : MICRO_STUDY_GUIDE[topicId])));
      
      // Special case: uni-ch1 or ug-development (restore missing Development Economics guide)
      if (!localContent && (topicId === 'uni-ch1' || topicId === 'ug-development')) {
        try {
          const res = await fetch('/api/restoreAdvancedStudy', { method: 'POST' });
          if (res.ok) {
            const data = await res.json();
            localContent = data.content;
          }
        } catch (restoreErr) {
          console.error("Failed to restore advanced study guide", restoreErr);
        }
      }

      if (localContent) {
        setContent(cleanMarkdownContent(localContent));
        setLoading(false);
        
        // Seed Firestore asynchronously in the background without blocking the UI
        const docRef = doc(db, 'study_materials', topicId);
        getDoc(docRef).then((snap) => {
          if (!snap.exists()) {
            setDoc(docRef, { content: localContent }).catch(e => console.warn("Failed to background seed study material", e));
          }
        }).catch(e => console.warn("Failed to check background study material existence", e));
        return;
      }

      // If no local content, try fetching from Firestore
      try {
        const docRef = doc(db, 'study_materials', topicId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().content) {
          setContent(cleanMarkdownContent(docSnap.data().content));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch study material from db", err);
      }

      // If not in Firestore either, generate using AI
      try {
        const genLevel = level === 'undergraduate' ? 'undergraduate' : 'secondary';
        const guideContent = await generateStudyGuide(topic.title, genLevel, topic.description);
        setContent(cleanMarkdownContent(guideContent));
        
        // Save generated guide to Firestore in background
        setDoc(doc(db, 'study_materials', topicId), { content: guideContent }).catch(e => console.warn(e));
      } catch (genErr) {
        console.error("Failed to generate and save study guide", genErr);
      }
      setLoading(false);
    };

    if (roadmap.length > 0 && topic && topic.title !== 'Loading...') {
      fetchGuide();
    }
  }, [topicId, topic?.title, topic?.description, roadmap.length]);

  // Reset to first page when topicId changes
  useEffect(() => {
    setCurrentPage(0);
    setDirection(0);
  }, [topicId]);

  // Parse pages split by horizontal rule `---` or fall back to high-level headings
  const pages = useMemo(() => {
    if (!content) return [];
    
    // Pre-scan content to find the chapter heading level
    let chapterLevel = 1; // Default to level 1 (e.g., # Chapter 1)
    const chapterMatch = content.match(/^(#{1,4})\s+(CHAPTER|Chapter)\b/m);
    if (chapterMatch) {
      chapterLevel = chapterMatch[1].length;
    }
    
    const subtopicPrefix = '#'.repeat(chapterLevel + 1) + ' ';
    const lines = content.split('\n');
    const finalPages: string[] = [];
    let currentPart: string[] = [];
    
    const isNewPageBoundary = (lineStr: string) => {
      const trimmed = lineStr.trim();
      
      // 1. Explicit page break
      if (trimmed === '---') return true;
      
      // 2. Chapter starts
      if (trimmed.match(/^#{1,4}\s+(CHAPTER|Chapter)\b/i)) {
        return true;
      }
      
      // 3. Part starts
      if (trimmed.match(/^#{1,3}\s+(PART|Part)\b/i)) {
        return true;
      }
      
      // 4. Subtopic starts (matches '## ' if chapter is level 1, '### ' if level 2, '#### ' if level 3)
      if (trimmed.startsWith(subtopicPrefix)) {
        // Double check it's not a chapter or part to prevent double matching
        const cleanText = trimmed.substring(subtopicPrefix.length).trim();
        if (!cleanText.toUpperCase().startsWith('CHAPTER') && !cleanText.toUpperCase().startsWith('PART')) {
          return true;
        }
      }
      
      return false;
    };
    
    for (const line of lines) {
      if (isNewPageBoundary(line) && currentPart.length > 0) {
        const joined = currentPart.join('\n').trim();
        if (joined.length > 0) {
          finalPages.push(joined);
        }
        
        if (line.trim() === '---') {
          currentPart = [];
        } else {
          currentPart = [line];
        }
      } else {
        if (line.trim() !== '---') {
          currentPart.push(line);
        }
      }
    }
    
    if (currentPart.length > 0) {
      const joined = currentPart.join('\n').trim();
      if (joined.length > 0) {
        finalPages.push(joined);
      }
    }
    
    return finalPages;
  }, [content]);

  const totalPages = pages.length;

  // Extract headings with exact page index for smart jumped navigation
  const headingsWithPages = useMemo(() => {
    if (pages.length === 0) return [];
    const extracted: { level: number; text: string; id: string; pageIndex: number }[] = [];
    
    pages.forEach((pageContent, pageIndex) => {
      const pageHeadingRegex = /^(#{1,4})\s+(.+)$/gm;
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
  const scrollIntoReadingView = () => {
    const element = document.getElementById('reading-content-start');
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 32; // Offset by 32px for elegant top spacing
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
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
    return <Tag id={id} className="scroll-mt-32 break-inside-avoid">{children}</Tag>;
  };

  const SimulatorRenderer = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : '';
    
    if (lang === 'chart') {
      try {
        let parsedConfig = JSON.parse(String(children).replace(/\n$/, ''));
        
        // Transform Chart.js style (labels/datasets) configuration to Recharts config if needed
        if (parsedConfig.labels && parsedConfig.datasets) {
          const colors = ['#0ea5e9', '#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
          const transformedData = parsedConfig.labels.map((label: string, idx: number) => {
            const item: any = { label };
            parsedConfig.datasets.forEach((dataset: any, dIdx: number) => {
              item[`value_${dIdx}`] = dataset.data[idx];
            });
            return item;
          });
          
          const transformedSeries = parsedConfig.datasets.map((dataset: any, dIdx: number) => ({
            key: `value_${dIdx}`,
            name: dataset.label,
            color: dataset.color || colors[dIdx % colors.length]
          }));

          parsedConfig = {
            ...parsedConfig,
            xAxis: 'label',
            data: transformedData,
            series: transformedSeries
          };
        }

        const { type, data, xAxis, yAxis, series, title, height = 300 } = parsedConfig;
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
        return <code className={className} {...props}>{children}</code>;
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
        return <code className={className} {...props}>{children}</code>;
      }
    }

    const isBlockCode = className && className.includes('language-');
    if (!isBlockCode) {
      return (
        <code className={cn(className, "px-1.5 py-0.5 text-xs sm:text-sm font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200")} {...props}>
          {children}
        </code>
      );
    }

    return <code className={className} {...props}>{children}</code>;
  };

  return (
    <div className="min-h-screen bg-paper pt-24 md:pt-32 pb-24 md:pb-32 transition-colors duration-300">
      {/* Hero Header */}
      <header className={cn(
        "px-6 md:px-10 mx-auto mb-10 md:mb-16 transition-all duration-500",
        isWideReader 
          ? (readerWidth === 'full' ? "max-w-[95%] lg:max-w-[90%]" : readerWidth === 'wide' ? "max-w-5xl" : "max-w-3xl")
          : "max-w-7xl"
      )}>
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

      {(topicId === 'ug-international' || topicId === 'ug-econometrics') && (
        <div className={cn(
          "px-6 md:px-10 mx-auto mb-10 flex gap-3 flex-wrap transition-all duration-500",
          isWideReader 
            ? (readerWidth === 'full' ? "max-w-[95%] lg:max-w-[90%]" : readerWidth === 'wide' ? "max-w-5xl" : "max-w-3xl")
            : "max-w-7xl"
        )}>
          <button
            onClick={() => setViewMode('textbook')}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer shadow-sm",
              viewMode === 'textbook'
                ? "bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-600"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            {topicId === 'ug-international' ? '62-Chapter Textbook Companion' : '12-Chapter Textbook Companion'}
          </button>
          <button
            onClick={() => setViewMode('standard')}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer shadow-sm",
              viewMode === 'standard'
                ? "bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-600"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            {topicId === 'ug-international' ? '5-Page Core Summary Guide' : 'Core Summary Guide'}
          </button>
        </div>
      )}

      {/* Dynamic Option-based Layout Toolbar for Widescreen Reading */}
      <div className={cn(
        "px-6 md:px-10 mx-auto mb-10 transition-all duration-500",
        isWideReader 
          ? (readerWidth === 'full' ? "max-w-[95%] lg:max-w-[90%]" : readerWidth === 'wide' ? "max-w-5xl" : "max-w-3xl")
          : "max-w-7xl"
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm transition-all">
          {/* Left: Mode togglers */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsWideReader(!isWideReader);
                if (!isWideReader) {
                  setReaderWidth('wide'); // Default to wide on first focus
                }
              }}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer",
                isWideReader
                  ? "bg-slate-900 dark:bg-sky-600 text-white border-slate-900 dark:bg-sky-600 shadow-sm"
                  : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
              )}
              title={isWideReader ? "Disable Wide Reading View" : "Enable Wide Reading View"}
            >
              {isWideReader ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isWideReader ? "Exit Focus" : "Focus Mode"}</span>
            </button>
            
            {isWideReader && viewMode !== 'textbook' && (
              <button
                onClick={() => setIsDoubleColumn(!isDoubleColumn)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer hidden md:flex",
                  isDoubleColumn
                    ? "bg-slate-900 dark:bg-sky-600 text-white border-slate-900 dark:bg-sky-600 shadow-sm"
                    : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                )}
                title="Toggle Double Column Textbook Layout"
              >
                <Columns size={14} />
                <span>{isDoubleColumn ? "2-Column" : "1-Column"}</span>
              </button>
            )}
          </div>

          {/* Right: Sub-controls when Wide View is active */}
          {isWideReader && (
            <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-slate-600 dark:text-slate-400">
              {/* Width Preset Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Width</span>
                <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-xl flex border border-slate-200 dark:border-slate-800">
                  {(['standard', 'wide', 'full'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => setReaderWidth(w)}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer",
                        readerWidth === w
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      )}
                    >
                      {w === 'standard' ? '3XL' : w === 'wide' ? '5XL' : 'Cinema'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Text</span>
                <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-xl flex border border-slate-200 dark:border-slate-800">
                  {(['base', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setReaderFontSize(sz)}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center min-w-[2rem]",
                        readerFontSize === sz
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      )}
                    >
                      {sz === 'base' ? 'A' : sz === 'lg' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {topicId === 'ug-international' && viewMode === 'textbook' ? (
        <div className={cn(
          "px-4 sm:px-6 md:px-10 mx-auto mb-24 transition-all duration-500",
          isWideReader 
            ? (readerWidth === 'full' ? "max-w-[95%] lg:max-w-[90%]" : readerWidth === 'wide' ? "max-w-5xl" : "max-w-3xl")
            : "max-w-7xl"
        )}>
          <React.Suspense fallback={
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-sky-600 w-10 h-10" />
              <p className="text-slate-600 dark:text-slate-400 font-semibold animate-pulse">Loading Textbook Companion...</p>
            </div>
          }>
            <LazyInternationalEconomicsTextbook />
          </React.Suspense>
        </div>
      ) : topicId === 'ug-econometrics' && viewMode === 'textbook' ? (
        <div className={cn(
          "px-4 sm:px-6 md:px-10 mx-auto mb-24 transition-all duration-500",
          isWideReader 
            ? (readerWidth === 'full' ? "max-w-[95%] lg:max-w-[90%]" : readerWidth === 'wide' ? "max-w-5xl" : "max-w-3xl")
            : "max-w-7xl"
        )}>
          <React.Suspense fallback={
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-sky-600 w-10 h-10" />
              <p className="text-slate-600 dark:text-slate-400 font-semibold animate-pulse">Loading Textbook Companion...</p>
            </div>
          }>
            <LazyEconometricsStudyGuide />
          </React.Suspense>
        </div>
      ) : (
        <div className={cn(
          "px-4 sm:px-6 md:px-10 mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 transition-all duration-500",
          isWideReader 
            ? (readerWidth === 'full' ? "max-w-[95%] lg:max-w-[90%]" : readerWidth === 'wide' ? "max-w-5xl" : "max-w-3xl")
            : "max-w-7xl"
        )}>
        {/* Sidebar TOC & Chapter Filter */}
        <aside className={cn(
          "hidden lg:block w-64 shrink-0 sticky top-32 h-fit space-y-12 transition-all duration-500",
          isWideReader ? "lg:hidden opacity-0 w-0 h-0 overflow-hidden pointer-events-none" : "opacity-100"
        )}>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-8">{profile?.level === "undergraduate" ? "Switch Course" : "Switch Topic"}</p>
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
                  {profile?.level === "undergraduate" ? ch.title : ch.category}
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
                      heading.level === 2 ? "pl-4 text-slate-600 dark:text-slate-500" : heading.level === 3 ? "pl-8 text-slate-500 dark:text-slate-700" : "pl-12 text-slate-400 dark:text-slate-600"
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-4">{profile?.level === "undergraduate" ? "Switch Course" : "Select Topic"}</p>
            <select 
              value={topicId}
              onChange={(e) => navigate(`/study-guide/${e.target.value}`)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none"
            >
              {roadmap.map((ch) => (
                <option key={ch.id} value={ch.id}>{profile?.level === "undergraduate" ? ch.title : `${ch.category}: ${ch.title}`}</option>
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
        <div className={cn(
          "flex-1 transition-all duration-500",
          isWideReader 
            ? (readerWidth === 'full' ? "max-w-none" : readerWidth === 'wide' ? "max-w-5xl" : "max-w-3xl")
            : "max-w-3xl"
        )}>
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-6">
              <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
              <p className="text-slate-600 dark:text-slate-500 font-medium animate-pulse">Generating your study guide...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Dynamic Pages Indicator & Swipe Hint */}
              <div id="reading-content-start" className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
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
                    <div className={cn(
                      "markdown-body prose prose-slate dark:prose-invert max-w-none transition-all duration-300",
                      isWideReader && isDoubleColumn ? "lg:columns-2 lg:gap-12 xl:gap-16 [column-fill:auto]" : "",
                      readerFontSize === 'lg' ? "prose-lg md:prose-xl" : readerFontSize === 'xl' ? "prose-xl md:prose-2xl" : "prose-base md:prose-lg",
                      "prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:tracking-tight prose-headings:font-bold prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-li:text-slate-600 dark:prose-li:text-slate-400"
                    )}>
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeKatex, rehypeMathMarker]}
                        components={{
                          h1: ({ children }) => <HeadingRenderer level={1}>{children}</HeadingRenderer>,
                          h2: ({ children }) => <HeadingRenderer level={2}>{children}</HeadingRenderer>,
                          h3: ({ children }) => <HeadingRenderer level={3}>{children}</HeadingRenderer>,
                          pre: ({ children, node, ...props }: any) => {
                            let isInteractive = false;
                            React.Children.forEach(children, (child: any) => {
                              if (React.isValidElement(child)) {
                                const childProps: any = child.props || {};
                                const className = childProps.className || '';
                                if (className.includes('language-chart') || className.includes('language-simulator')) {
                                  isInteractive = true;
                                }
                              }
                            });

                            if (isInteractive) {
                              return <>{children}</>;
                            }

                            return (
                              <pre 
                                className="my-6 p-4 sm:p-6 bg-slate-950 dark:bg-slate-900/50 border border-slate-800 dark:border-slate-800/80 rounded-xl overflow-x-auto whitespace-pre text-xs sm:text-sm font-mono text-slate-100 dark:text-slate-200 leading-normal scrollbar-thin break-inside-avoid"
                                {...props}
                              >
                                {children}
                              </pre>
                            );
                          },
                          code: SimulatorRenderer,
                          span: ({ node, className, children, ...props }: any) => {
                            const isBlock = props['data-math-block'];
                            const isInline = props['data-math-inline'];
                            if (isBlock || isInline) {
                              const latex = extractLatex(node);
                              const cleanProps = { ...props };
                              delete cleanProps['data-math-block'];
                              delete cleanProps['data-math-inline'];
                              delete cleanProps['data-math-inner'];

                              return (
                                <span className={cn(className, "relative group", isBlock ? "flex justify-center w-full my-6 p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800 break-inside-avoid" : "inline-block mx-0.5 px-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-text")} {...cleanProps}>
                                  {children}
                                  {latex && <CopyMathButton latex={latex} isBlock={isBlock} />}
                                </span>
                              );
                            }
                            const cleanProps = { ...props };
                            delete cleanProps['data-math-block'];
                            delete cleanProps['data-math-inline'];
                            delete cleanProps['data-math-inner'];
                            return <span className={className} {...cleanProps}>{children}</span>;
                          },
                          table: ({ children }) => (
                            <div className="my-10 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-card shadow-sm break-inside-avoid">
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
      )}

      {/* Floating TOC Trigger Button - Only visible in Focus Mode */}
      {isWideReader && !loading && headingsWithPages.length > 0 && (
        <button
          onClick={() => setShowFloatingTOC(!showFloatingTOC)}
          className={cn(
            "fixed bottom-8 left-8 z-40 p-4 rounded-full shadow-lg border backdrop-blur transition-all duration-300 flex items-center justify-center cursor-pointer",
            showFloatingTOC
              ? "bg-slate-950 dark:bg-sky-600 text-white border-slate-950 dark:border-sky-600 rotate-90 scale-105 animate-none"
              : "bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 hover:scale-110 active:scale-95 shadow-slate-200/50 dark:shadow-none"
          )}
          title="Toggle Navigation Outline"
        >
          <List size={20} />
        </button>
      )}

      {/* Slide-out Outline Drawer */}
      <AnimatePresence>
        {isWideReader && showFloatingTOC && !loading && headingsWithPages.length > 0 && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFloatingTOC(false)}
              className="fixed inset-0 bg-black z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-8 z-50 shadow-2xl overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Course Outline</span>
                <button
                  onClick={() => setShowFloatingTOC(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              </div>
              
              <nav className="space-y-4">
                {headingsWithPages.map((heading, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleHeadingClick(heading.id, heading.pageIndex);
                      setShowFloatingTOC(false);
                    }}
                    className={cn(
                      "block text-left text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-sky-600 dark:hover:text-sky-400 w-full cursor-pointer leading-relaxed",
                      currentPage === heading.pageIndex ? "text-sky-600 dark:text-sky-400" :
                      heading.level === 1 ? "text-slate-900 dark:text-white font-black" : 
                      heading.level === 2 ? "pl-4 text-slate-600 dark:text-slate-500" : heading.level === 3 ? "pl-8 text-slate-500 dark:text-slate-700" : "pl-12 text-slate-400 dark:text-slate-600"
                    )}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const StudyGuideWrapper = () => {
  const { topicId } = useParams();
  return <StudyGuide topicId={topicId || ''} />;
};

export default StudyGuideWrapper;
