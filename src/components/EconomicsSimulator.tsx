import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Factory, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SimulatorMode = 'utility' | 'elasticity' | 'equilibrium' | 'production' | 'inflation';

interface SimulatorProps {
  mode: SimulatorMode;
  title?: string;
  initialValues?: Record<string, number>;
}

const Input = ({ label, value, onChange }: { label: string, value: number | undefined, onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <input
        type="number"
        value={value !== undefined && !isNaN(value) ? value : ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-paper dark:bg-slate-800 border border-border rounded-xl px-4 py-3 text-sm font-semibold text-ink transition-all placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        placeholder="0.00"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-sky-500 transition-colors">
        <Calculator size={14} />
      </div>
    </div>
  </div>
);

const ResultCard = ({ label, value, icon, description }: { label: string, value: string | number, icon: React.ReactNode, description?: string }) => (
  <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-paper dark:bg-slate-800 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-4xl font-bold text-ink mb-2 tracking-tight">{value}</div>
    {description && <p className="text-[11px] text-muted leading-relaxed font-medium">{description}</p>}
  </div>
);

export const EconomicsSimulator: React.FC<SimulatorProps> = ({ mode, title, initialValues }) => {
  const [values, setValues] = useState<Record<string, number>>(initialValues || {});
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (key: string, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    setValues(prev => ({ ...prev, [key]: numVal }));
  };

  useEffect(() => {
    calculate();
  }, [values]);

  const calculate = () => {
    switch (mode) {
      case 'utility': {
        const { tu1, tu2, q1, q2 } = values;
        if (q2 !== q1) {
          const mu = (tu2 - tu1) / (q2 - q1);
          setResult({ mu: mu.toFixed(2) });
        }
        break;
      }
      case 'elasticity': {
        const { p1, p2, q1, q2 } = values;
        if (p1 && q1 && p2 !== p1) {
          const perChangeQ = ((q2 - q1) / q1) * 100;
          const perChangeP = ((p2 - p1) / p1) * 100;
          const ped = Math.abs(perChangeQ / perChangeP);
          let type = '';
          if (ped > 1) type = 'Elastic';
          else if (ped < 1) type = 'Inelastic';
          else if (ped === 1) type = 'Unitary';
          else if (ped === 0) type = 'Perfectly Inelastic';
          else type = 'Perfectly Elastic';
          setResult({ ped: ped.toFixed(2), type });
        }
        break;
      }
      case 'equilibrium': {
        const { a, b, c, d } = values; // Qd = a - bP, Qs = c + dP
        if (b + d !== 0) {
          const p = (a - c) / (b + d);
          const q = a - (b * p);
          setResult({ p: p.toFixed(2), q: q.toFixed(2) });
        }
        break;
      }
      case 'production': {
        const { tp1, tp2, l1, l2 } = values;
        if (l2 !== 0) {
          const ap = tp2 / l2;
          const mp = l2 !== l1 ? (tp2 - tp1) / (l2 - l1) : 0;
          setResult({ ap: ap.toFixed(2), mp: mp.toFixed(2) });
        }
        break;
      }
      case 'inflation': {
        const { p1, p2 } = values;
        if (p1 !== 0) {
          const rate = ((p2 - p1) / p1) * 100;
          setResult({ rate: rate.toFixed(2) });
        }
        break;
      }
    }
  };

  const renderInputs = () => {
    switch (mode) {
      case 'utility':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Initial TU (TU₁)" value={values.tu1} onChange={v => handleInputChange('tu1', v)} />
            <Input label="Final TU (TU₂)" value={values.tu2} onChange={v => handleInputChange('tu2', v)} />
            <Input label="Initial Q (Q₁)" value={values.q1} onChange={v => handleInputChange('q1', v)} />
            <Input label="Final Q (Q₂)" value={values.q2} onChange={v => handleInputChange('q2', v)} />
          </div>
        );
      case 'elasticity':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Initial Price (P₁)" value={values.p1} onChange={v => handleInputChange('p1', v)} />
            <Input label="Final Price (P₂)" value={values.p2} onChange={v => handleInputChange('p2', v)} />
            <Input label="Initial Qty (Q₁)" value={values.q1} onChange={v => handleInputChange('q1', v)} />
            <Input label="Final Qty (Q₂)" value={values.q2} onChange={v => handleInputChange('q2', v)} />
          </div>
        );
      case 'equilibrium':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-sky-100 dark:bg-sky-900/20 rounded-xl text-[10px] font-mono text-sky-800 dark:text-sky-400 font-bold uppercase tracking-wider">
              Qd = a - bP | Qs = c + dP
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="a (Demand Intercept)" value={values.a} onChange={v => handleInputChange('a', v)} />
              <Input label="b (Demand Slope)" value={values.b} onChange={v => handleInputChange('b', v)} />
              <Input label="c (Supply Intercept)" value={values.c} onChange={v => handleInputChange('c', v)} />
              <Input label="d (Supply Slope)" value={values.d} onChange={v => handleInputChange('d', v)} />
            </div>
          </div>
        );
      case 'production':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Initial TP (TP₁)" value={values.tp1} onChange={v => handleInputChange('tp1', v)} />
            <Input label="Final TP (TP₂)" value={values.tp2} onChange={v => handleInputChange('tp2', v)} />
            <Input label="Initial Labour (L₁)" value={values.l1} onChange={v => handleInputChange('l1', v)} />
            <Input label="Final Labour (L₂)" value={values.l2} onChange={v => handleInputChange('l2', v)} />
          </div>
        );
      case 'inflation':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Base Year Price (P₁)" value={values.p1} onChange={v => handleInputChange('p1', v)} />
            <Input label="Current Year Price (P₂)" value={values.p2} onChange={v => handleInputChange('p2', v)} />
          </div>
        );
    }
  };

  const renderResult = () => {
    if (!result) return null;
    switch (mode) {
      case 'utility':
        return <ResultCard label="Marginal Utility (MU)" value={result.mu} icon={<Zap className="text-amber-500" />} description="The additional satisfaction gained from consuming one more unit." />;
      case 'elasticity':
        return (
          <div className="space-y-3">
            <ResultCard label="Price Elasticity (PED)" value={result.ped} icon={<TrendingUp className="text-sky-500" />} />
            <div className={cn(
              "p-4 rounded-2xl text-center font-bold text-sm uppercase tracking-widest",
              result.type === 'Elastic' ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-700"
            )}>
              {result.type} Demand
            </div>
          </div>
        );
      case 'equilibrium':
        return (
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Equilibrium Price (P*)" value={`₦${result.p}`} icon={<Scale className="text-sky-500" />} />
            <ResultCard label="Equilibrium Qty (Q*)" value={result.q} icon={<Scale className="text-sky-500" />} />
          </div>
        );
      case 'production':
        return (
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Average Product (AP)" value={result.ap} icon={<Factory className="text-indigo-500" />} />
            <ResultCard label="Marginal Product (MP)" value={result.mp} icon={<Factory className="text-indigo-500" />} />
          </div>
        );
      case 'inflation':
        return <ResultCard label="Inflation Rate" value={`${result.rate}%`} icon={<TrendingUp className="text-rose-500" />} description="The percentage increase in the general price level." />;
    }
  };

  return (
    <div className="my-12 bg-card rounded-3xl border border-border shadow-xl overflow-hidden not-prose transition-colors duration-300">
      <div className="bg-slate-900 dark:bg-sky-900/40 p-8 flex items-center gap-6">
        <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
          <Calculator size={24} />
        </div>
        <div>
          <h3 className="text-white text-xl font-bold tracking-tight mb-1">{title || 'Economics Simulator'}</h3>
          <p className="text-sky-400 dark:text-sky-300 text-[10px] uppercase tracking-[0.2em] font-bold">Interactive Calculation Engine</p>
        </div>
      </div>
      
      <div className="p-8 grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-ink border-b border-border pb-4">
            <Info size={14} className="text-sky-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Input Parameters</span>
          </div>
          {renderInputs()}
        </div>

        <div className="bg-paper border border-border rounded-2xl p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-ink mb-8 border-b border-border pb-4">
            <TrendingUp size={14} className="text-sky-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Live Analysis</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(result)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderResult()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
