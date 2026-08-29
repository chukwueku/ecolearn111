import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InlineMath, BlockMath } from '../MathComponents';

export const Input = ({ 
  label, 
  value, 
  onChange,
  min,
  max,
  step = 1,
  suffix = ""
}: { 
  label: string, 
  value: number | undefined, 
  onChange: (v: string) => void,
  min?: number,
  max?: number,
  step?: number,
  suffix?: string
}) => {
  const currentVal = value !== undefined && !isNaN(value) ? value : 0;
  const hasSlider = min !== undefined && max !== undefined;

  return (
    <div className="space-y-1 bg-paper/60 dark:bg-slate-800/40 p-2.5 rounded-xl border border-border/70">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest">{label}</label>
        {hasSlider && (
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
            {currentVal}{suffix}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hasSlider && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentVal}
            onChange={e => onChange(e.target.value)}
            className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg shrink"
          />
        )}
        <div className="relative group shrink-0">
          <input
            type="number"
            value={value !== undefined && !isNaN(value) ? value : ''}
            onChange={e => onChange(e.target.value)}
            className="w-24 bg-card border border-border rounded-lg pl-2 pr-6 py-1.5 text-xs font-semibold text-ink transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            placeholder="0.00"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted/60 group-focus-within:text-sky-500 transition-colors pointer-events-none">
            <Calculator size={11} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormulaBreakdown = ({ 
  title, 
  formula, 
  steps 
}: { 
  title: string, 
  formula: string, 
  steps: { label: string, value: string, math?: string }[] 
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border border-border/80 rounded-2xl bg-card overflow-hidden transition-all shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <BookOpen size={14} />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-ink block">{title}</span>
            <span className="text-[10px] text-muted font-medium">Click to view mathematical step-by-step derivation</span>
          </div>
        </div>
        <div className="text-muted">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 border-t border-border space-y-3 bg-paper/40 dark:bg-slate-900/40"
          >
            <div className="bg-card p-3 rounded-xl border border-border/60">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted block mb-1">Core Formula</span>
              <BlockMath math={formula} />
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted block">Step-by-Step Calculation</span>
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-card rounded-lg border border-border/40 text-xs gap-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{step.label}</span>
                  <div className="font-mono font-semibold text-sky-600 dark:text-sky-400">
                    {step.math ? <InlineMath math={step.math} /> : step.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PresetScenarios = ({ 
  presets, 
  onSelect 
}: { 
  presets: { label: string, description: string, values: Record<string, number> }[], 
  onSelect: (v: Record<string, number>) => void 
}) => (
  <div className="mb-4 space-y-2">
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-wider">
      <Lightbulb size={12} className="text-amber-500" />
      <span>Quick Preset Scenarios</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {presets.map((preset, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(preset.values)}
          className="p-2.5 rounded-xl border border-border bg-card hover:border-sky-500/50 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 text-left transition-all text-xs group cursor-pointer"
        >
          <div className="font-bold text-ink group-hover:text-sky-600 dark:group-hover:text-sky-400 leading-snug">{preset.label}</div>
          <div className="text-[9px] text-muted line-clamp-1 leading-tight">{preset.description}</div>
        </button>
      ))}
    </div>
  </div>
);

export const ResultCard = ({ label, value, icon, description }: { label: string, value: string | number, icon: React.ReactNode, description?: string }) => (
  <div className="bg-card border border-border p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-1.5">
      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-paper dark:bg-slate-800 flex items-center justify-center shrink-0">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 14 }) : icon}
      </div>
      <span className="text-[8px] sm:text-[9px] font-bold text-muted uppercase tracking-wider text-right ml-2">{label}</span>
    </div>
    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-ink mb-0.5 tracking-tight break-words">{value}</div>
    {description && <p className="text-[9px] sm:text-[11px] text-muted leading-relaxed font-medium">{description}</p>}
  </div>
);

export const ToggleGroup = ({ label, options, activeValue, onChange }: { label: string, options: { label: string, value: number }[], activeValue: number, onChange: (v: number) => void }) => {
  const colsClass = options.length <= 2 
    ? "grid grid-cols-2 gap-1.5 w-full" 
    : "grid grid-cols-2 min-[380px]:grid-cols-3 sm:flex sm:flex-wrap gap-1.5 w-full";

  return (
    <div className="space-y-1 w-full">
      <label className="text-[9px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className={colsClass}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-1.5 sm:px-2.5 py-1.5 text-[9px] sm:text-[11px] font-bold rounded-lg border transition-all cursor-pointer text-center leading-tight sm:grow ${
              activeValue === opt.value
                ? "bg-sky-500 text-white border-sky-600 shadow-sm"
                : "bg-paper dark:bg-slate-800 text-ink border-border hover:bg-slate-50 dark:hover:bg-slate-700/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
