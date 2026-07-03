import React, { useState, useEffect, useRef } from 'react';
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
import { db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { SECONDARY_ROADMAP, SECONDARY_SS2_ROADMAP, SECONDARY_SS3_ROADMAP, UNDERGRADUATE_REAL_ROADMAP, RoadmapTopic } from '../../constants';
import { 
  Loader2, Plus, Save, Edit3, Trash2, FileUp, Sparkles, CheckCircle2, BookOpen,
  Bold, Italic, Heading2, Heading3, List, Table, Sigma, BarChart3, Play, Eye, Edit
} from 'lucide-react';
import { motion } from 'motion/react';

// Lazy load the EconomicsSimulator component
const LazyEconomicsSimulator = React.lazy(() => 
  import('../EconomicsSimulator').then(module => ({ default: module.EconomicsSimulator }))
);

const cleanMarkdownContent = (text: string): string => {
  if (!text) return text;
  let cleaned = text
    .replace(/\x08/g, '\\b')
    .replace(/\x0c/g, '\\f')
    .replace(/\x09/g, '\\t');
  const lines = cleaned.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('|')) {
      if (i > 0) {
        const prevLine = processedLines[processedLines.length - 1];
        const prevTrimmed = prevLine.trim();
        if (prevTrimmed !== '' && !prevTrimmed.startsWith('|') && !prevTrimmed.startsWith('<!--')) {
          processedLines.push('');
        }
      }
    }
    processedLines.push(line);
  }
  return processedLines.join('\n');
};

const HeadingRenderer = ({ level, children }: { level: number; children: React.ReactNode }) => {
  const text = React.Children.toArray(children).join('');
  const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  const Tag = `h${level}` as any;
  return <Tag id={id} className="scroll-mt-32 font-bold text-slate-900 dark:text-white mt-6 mb-3">{children}</Tag>;
};

export const StudyMaterialsManager: React.FC = () => {
  const [level, setLevel] = useState<'secondary' | 'secondary-ss2' | 'secondary-ss3' | 'undergraduate'>('secondary');
  const [roadmap, setRoadmap] = useState<RoadmapTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [editingTopic, setEditingTopic] = useState<RoadmapTopic | null>(null);
  const [topicContent, setTopicContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  // File parsing for PDFs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchRoadmap();
  }, [level]);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'roadmaps', level);
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().topics) {
        setRoadmap(snap.data().topics);
      } else {
        // Init with constants if not exists
        let fallback: RoadmapTopic[] = [];
        if (level === 'secondary-ss2') fallback = SECONDARY_SS2_ROADMAP;
        else if (level === 'secondary-ss3') fallback = SECONDARY_SS3_ROADMAP;
        else if (level === 'undergraduate') fallback = UNDERGRADUATE_REAL_ROADMAP;
        else fallback = SECONDARY_ROADMAP;
        
        await setDoc(docRef, { topics: fallback });
        setRoadmap(fallback);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSaveTopic = async () => {
    if (!editingTopic) return;
    setLoading(true);
    try {
      const updatedRoadmap = roadmap.map(t => t.id === editingTopic.id ? editingTopic : t);
      // If it's a new topic
      if (!roadmap.find(t => t.id === editingTopic.id)) {
        updatedRoadmap.push(editingTopic);
      }
      
      await updateDoc(doc(db, 'roadmaps', level), { topics: updatedRoadmap });
      setRoadmap(updatedRoadmap);
      
      // Save content if any
      if (topicContent) {
        await setDoc(doc(db, 'study_materials', editingTopic.id), { content: topicContent });
      }
      
      setSuccess('Topic saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setEditingTopic(null);
      setTopicContent('');
    } catch (err) {
      console.error(err);
      alert('Error saving topic');
    }
    setLoading(false);
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    setLoading(true);
    try {
      const updatedRoadmap = roadmap.filter(t => t.id !== id);
      await updateDoc(doc(db, 'roadmaps', level), { topics: updatedRoadmap });
      setRoadmap(updatedRoadmap);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEditClick = async (t: RoadmapTopic) => {
    setEditingTopic(t);
    setEditorTab('write');
    setContentLoading(true);
    try {
      const matSnap = await getDoc(doc(db, 'study_materials', t.id));
      if (matSnap.exists()) {
        setTopicContent(matSnap.data().content || '');
      } else {
        setTopicContent('');
      }
    } catch (err) {
      console.error(err);
    }
    setContentLoading(false);
  };

  // Convert PDF to Base64 and send to Gemini to extract markdown
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF.');
      return;
    }

    setContentLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        try {
          // Send to Gemini backend endpoint to parse PDF to Markdown
          const response = await fetch('/api/parsePdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfBase64: base64, prompt: 'Extract the full text and educational content from this PDF and format it as a comprehensive Markdown study guide. Include headings, bullet points, and any important formulas using LaTeX. Do not generate questions, just extract and format the content into a study guide.' })
          });
          
          if (!response.ok) throw new Error('Failed to parse PDF');
          const data = await response.json();
          if (data.markdown) {
            setTopicContent(prev => prev + '\n\n' + data.markdown);
            setSuccess('PDF Content extracted successfully!');
            setTimeout(() => setSuccess(''), 3000);
          } else if (data.questions) {
             setTopicContent(prev => prev + '\n\n' + JSON.stringify(data.questions, null, 2));
          } else {
             alert('No valid content returned.');
          }
        } catch (err) {
          console.error(err);
          alert('Error extracting from PDF.');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    }
    setContentLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const insertTemplate = (template: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setTopicContent(prev => prev + template);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newContent = before + template + after;
    setTopicContent(newContent);

    // Reset cursor position after insert
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + template.length;
    }, 50);
  };

  const SimulatorRenderer = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : '';
    
    if (lang === 'chart') {
      try {
        let parsedConfig = JSON.parse(String(children).replace(/\n$/, ''));
        
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

        const { type, data, xAxis, yAxis, series, title, height = 240 } = parsedConfig;
        const chartHeight = typeof height === 'number' && !isNaN(height) ? height : 240;
        
        return (
          <div className="my-6 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            {title && (
              <h4 className="text-[10px] font-bold text-slate-500 mb-4 text-center uppercase tracking-wider">
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
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" />
                    {series.map((s: any, i: number) => (
                      <Line key={i} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#0ea5e9'} strokeWidth={2} dot={{ r: 3, fill: '#fff' }} />
                    ))}
                  </LineChart>
                ) : type === 'area' ? (
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
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
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" />
                    {series.map((s: any, i: number) => (
                      <Bar key={i} dataKey={s.key} name={s.name} fill={s.color || '#0ea5e9'} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                ) : type === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
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
                ) : (
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis type="number" dataKey={xAxis} name={xAxis} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis type="number" dataKey={yAxis} name={yAxis} tick={{ fontSize: 10 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
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
          <div className="my-6 overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <React.Suspense fallback={
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-sky-500 w-6 h-6" />
                <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Loading Interactive Simulator...</p>
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
        <code className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200" {...props}>
          {children}
        </code>
      );
    }

    return <code className={className} {...props}>{children}</code>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Study Materials & Roadmaps</h2>
          <p className="text-sm text-slate-500">Manage curriculum topics and attach study guides (PDF extraction).</p>
        </div>
        <select 
          value={level}
          onChange={(e) => setLevel(e.target.value as any)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="secondary">SS1 (Secondary)</option>
          <option value="secondary-ss2">SS2 (Secondary)</option>
          <option value="secondary-ss3">SS3 (Secondary)</option>
          <option value="undergraduate">Undergraduate</option>
        </select>
      </div>

      {level === 'undergraduate' && (
        <button 
          onClick={async () => {
            try {
              setLoading(true);
              const res = await fetch('/api/restoreAdvancedStudy', { method: 'POST' });
              if (res.ok) {
                const data = await res.json();
                setTopicContent(data.content);
                setEditingTopic({ id: 'ug-development', title: 'Advanced Development Economics', description: 'Comprehensive guide covering major theories and models', category: 'Chapter 6' });
                setSuccess('Loaded advanced study guide content into editor. Click Save to deploy.');
              } else {
                alert('File not found or error loading');
              }
            } catch (e) {
              console.error(e);
            }
            setLoading(false);
          }}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700"
        >
          Restore Missing PDF Upload (Development Economics)
        </button>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3">
          <CheckCircle2 size={18} />
          <span className="font-medium text-sm">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Topics</h3>
            <button 
              onClick={() => {
                setEditingTopic({ id: `new-topic-${Date.now()}`, title: '', description: '', category: 'Chapter ' + (roadmap.length + 1) });
                setTopicContent('');
                setEditorTab('write');
              }}
              className="p-1.5 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-sky-500" /></div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {roadmap.map((t) => (
                <div key={t.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start justify-between group">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.category}</p>
                    <p className="font-semibold text-slate-900 dark:text-white truncate text-sm">{t.title}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(t)} className="p-1.5 text-slate-400 hover:text-sky-500"><Edit3 size={14} /></button>
                    <button onClick={() => handleDeleteTopic(t.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor & Live Preview Panel */}
        <div className="lg:col-span-2">
          {editingTopic ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {roadmap.find(r => r.id === editingTopic.id) ? 'Edit Topic' : 'New Topic'}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Add content, formulas, interactive charts or simulators.</p>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700">
                    <button
                      onClick={() => setEditorTab('write')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${
                        editorTab === 'write' 
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Edit size={12} />
                      Write
                    </button>
                    <button
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${
                        editorTab === 'preview' 
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Eye size={12} />
                      Preview
                    </button>
                  </div>

                  <button 
                    onClick={handleSaveTopic} 
                    disabled={loading || contentLoading} 
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                  >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    Save
                  </button>
                </div>
              </div>

              {editorTab === 'write' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">ID (Unique)</label>
                      <input type="text" value={editingTopic.id} onChange={e => setEditingTopic({...editingTopic, id: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                      <input type="text" value={editingTopic.category} onChange={e => setEditingTopic({...editingTopic, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500" placeholder="e.g. Chapter 1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                    <input type="text" value={editingTopic.title} onChange={e => setEditingTopic({...editingTopic, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea rows={2} value={editingTopic.description} onChange={e => setEditingTopic({...editingTopic, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Study Guide Content (Markdown)</label>
                      
                      <div className="relative">
                        <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={contentLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          {contentLoading ? <Loader2 size={12} className="animate-spin" /> : <FileUp size={12} />}
                          Extract from PDF
                        </button>
                      </div>
                    </div>

                    {/* Rich Markdown Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-t-lg px-3 py-1.5 border-b-0">
                      <button type="button" onClick={() => insertTemplate('**bold text**')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors" title="Bold"><Bold size={14} /></button>
                      <button type="button" onClick={() => insertTemplate('*italic text*')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors" title="Italic"><Italic size={14} /></button>
                      <button type="button" onClick={() => insertTemplate('\n## Section Title\n')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors" title="Heading 2"><Heading2 size={14} /></button>
                      <button type="button" onClick={() => insertTemplate('\n### Sub-section Title\n')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors" title="Heading 3"><Heading3 size={14} /></button>
                      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                      <button type="button" onClick={() => insertTemplate('\n- List item')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors" title="Bullet List"><List size={14} /></button>
                      <button type="button" onClick={() => insertTemplate('\n| Header 1 | Header 2 |\n|---|---|\n| Row 1 Col 1 | Row 1 Col 2 |\n')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors" title="Table"><Table size={14} /></button>
                      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                      <button type="button" onClick={() => insertTemplate('$f(x) = \\sigma^2$')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors font-semibold flex items-center justify-center text-[10px]" title="Inline Math"><Sigma size={13} /></button>
                      <button type="button" onClick={() => insertTemplate('$$\n\\Delta y = \\beta_0 + \\beta_1 \\Delta x + \\epsilon\n$$')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors font-semibold flex items-center justify-center text-[10px]" title="Block Math"><span className="text-[9px] font-bold">$$</span></button>
                      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                      <button type="button" onClick={() => insertTemplate('\n```chart\n{\n  "type": "line",\n  "title": "Interactive Demand & Supply Curve",\n  "xAxis": "price",\n  "series": [\n    { "key": "demand", "name": "Demand", "color": "#f43f5e" },\n    { "key": "supply", "name": "Supply", "color": "#10b981" }\n  ],\n  "data": [\n    { "price": 10, "demand": 100, "supply": 20 },\n    { "price": 20, "demand": 80, "supply": 40 },\n    { "price": 30, "demand": 60, "supply": 60 },\n    { "price": 40, "demand": 40, "supply": 80 },\n    { "price": 50, "demand": 20, "supply": 100 }\n  ]\n}\n```\n')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors flex items-center gap-1 text-[10px]" title="Insert Interactive Recharts Chart"><BarChart3 size={13} /><span className="text-[9px] font-medium hidden sm:inline">Chart</span></button>
                      <button type="button" onClick={() => insertTemplate('\n```simulator\n{\n  "type": "solow",\n  "title": "Solow Growth Simulator",\n  "params": {\n    "savingsRate": 0.2,\n    "depreciationRate": 0.05,\n    "populationGrowth": 0.02,\n    "techGrowth": 0.01\n  }\n}\n```\n')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-colors flex items-center gap-1 text-[10px]" title="Insert Solow-Swan Growth Simulator"><Play size={13} /><span className="text-[9px] font-medium hidden sm:inline">Simulator</span></button>
                    </div>
                    
                    <textarea 
                      ref={textareaRef}
                      rows={14} 
                      value={topicContent} 
                      onChange={e => setTopicContent(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-b-lg px-4 py-3 text-sm font-mono outline-none focus:border-sky-500" 
                      placeholder="Paste Markdown content here or use the helper tools above..."
                    />
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-h-[600px] overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
                  {topicContent ? (
                    <div className="markdown-body prose dark:prose-invert max-w-none prose-slate">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]}
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
                              <pre className="my-4 p-4 bg-slate-950 text-slate-100 rounded-lg overflow-x-auto whitespace-pre font-mono text-xs" {...props}>
                                {children}
                              </pre>
                            );
                          },
                          code: SimulatorRenderer,
                          table: ({ children }) => (
                            <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                              <table className="w-full border-collapse text-left min-w-[500px]">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">{children}</thead>,
                          th: ({ children }) => <th className="p-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-r border-slate-200 dark:border-slate-800 last:border-r-0 whitespace-nowrap">{children}</th>,
                          td: ({ children }) => <td className="p-3 text-sm text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-800 last:border-r-0 align-top font-medium">{children}</td>,
                          tr: ({ children }) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 last:border-b-0">{children}</tr>,
                        }}
                      >
                        {cleanMarkdownContent(topicContent)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400">
                      <Eye size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium">No content to preview yet. Start typing in the "Write" tab.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <BookOpen size={48} className="mb-4 opacity-50" />
              <p className="font-medium text-sm">Select a topic to edit or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
