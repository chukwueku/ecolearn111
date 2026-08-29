import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Factory, Zap, Info, ChevronDown, ChevronUp, BookOpen, Lightbulb, Percent } from 'lucide-react';
import { InlineMath, BlockMath } from '../MathComponents';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Input, ResultCard, ToggleGroup } from './SimulatorShared';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MicroMode = 'utility' | 'elasticity' | 'equilibrium' | 'production' | 'cost_revenue';

export interface MicroSimulatorProps {
  mode: MicroMode;
  initialValues?: Record<string, number>;
}

export const MicroEconomicsSimulator: React.FC<MicroSimulatorProps> = ({ mode, initialValues }) => {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    if (mode === 'cost_revenue') {
      defaults.fc = 50;
      defaults.a = 2;
      defaults.b = 1;
      defaults.price = 20;
      defaults.q = 5;
    }
    return { ...defaults, ...initialValues };
  });
  
  const [result, setResult] = useState<any>(null);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(true);

  const handleInputChange = (key: string, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    setValues(prev => ({ ...prev, [key]: numVal }));
  };

  useEffect(() => {
    calculate();
  }, [values, mode]);

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
        const { a, b, c, d } = values;
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
      case 'cost_revenue': {
        const fc = values.fc !== undefined ? values.fc : 50;
        const a = values.a !== undefined ? values.a : 2;
        const b = values.b !== undefined ? values.b : 1;
        const price = values.price !== undefined ? values.price : 20;
        const q = values.q !== undefined ? values.q : 5;

        const vc = a * q + b * q * q;
        const tc = fc + vc;
        const ac = q > 0 ? tc / q : 0;
        const avc = q > 0 ? vc / q : 0;
        const afc = q > 0 ? fc / q : 0;
        const mc = q > 0 ? a + b * (2 * q - 1) : 0;
        const tr = price * q;
        const profit = tr - tc;

        setResult({
          fc: fc.toFixed(2),
          vc: vc.toFixed(2),
          tc: tc.toFixed(2),
          ac: ac.toFixed(2),
          avc: avc.toFixed(2),
          afc: afc.toFixed(2),
          mc: mc.toFixed(2),
          tr: tr.toFixed(2),
          profit: profit.toFixed(2)
        });
        break;
      }
    }
  };

  const renderInputs = () => {
    switch (mode) {
      case 'utility':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <Input label="Initial TU (TU₁)" value={values.tu1} onChange={v => handleInputChange('tu1', v)} />
            <Input label="Final TU (TU₂)" value={values.tu2} onChange={v => handleInputChange('tu2', v)} />
            <Input label="Initial Q (Q₁)" value={values.q1} onChange={v => handleInputChange('q1', v)} />
            <Input label="Final Q (Q₂)" value={values.q2} onChange={v => handleInputChange('q2', v)} />
          </div>
        );
      case 'elasticity':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <Input label="Initial Price (P₁)" value={values.p1} onChange={v => handleInputChange('p1', v)} />
            <Input label="Final Price (P₂)" value={values.p2} onChange={v => handleInputChange('p2', v)} />
            <Input label="Initial Qty (Q₁)" value={values.q1} onChange={v => handleInputChange('q1', v)} />
            <Input label="Final Qty (Q₂)" value={values.q2} onChange={v => handleInputChange('q2', v)} />
          </div>
        );
      case 'equilibrium':
        return (
          <div className="space-y-3">
            <div className="p-2.5 bg-sky-100 dark:bg-sky-900/20 rounded-lg text-[9px] font-mono text-sky-800 dark:text-sky-400 font-bold uppercase tracking-wider text-center">
              Qd = a - bP | Qs = c + dP
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="a (Demand Intercept)" value={values.a} onChange={v => handleInputChange('a', v)} />
              <Input label="b (Demand Slope)" value={values.b} onChange={v => handleInputChange('b', v)} />
              <Input label="c (Supply Intercept)" value={values.c} onChange={v => handleInputChange('c', v)} />
              <Input label="d (Supply Slope)" value={values.d} onChange={v => handleInputChange('d', v)} />
            </div>
          </div>
        );
      case 'production':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <Input label="Initial TP (TP₁)" value={values.tp1} onChange={v => handleInputChange('tp1', v)} />
            <Input label="Final TP (TP₂)" value={values.tp2} onChange={v => handleInputChange('tp2', v)} />
            <Input label="Initial Labour (L₁)" value={values.l1} onChange={v => handleInputChange('l1', v)} />
            <Input label="Final Labour (L₂)" value={values.l2} onChange={v => handleInputChange('l2', v)} />
          </div>
        );
      case 'cost_revenue':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Fixed Cost (FC ₦)" value={values.fc} onChange={v => handleInputChange('fc', v)} />
              <Input label="Unit Price (P ₦)" value={values.price} onChange={v => handleInputChange('price', v)} />
              <Input label="Linear Variable Cost (a)" value={values.a} onChange={v => handleInputChange('a', v)} />
              <Input label="Quadratic Cost (b)" value={values.b} onChange={v => handleInputChange('b', v)} />
            </div>
            <Input label="Target Output Level (Q)" value={values.q} onChange={v => handleInputChange('q', v)} />
            <p className="text-[10px] text-muted italic">
              Adjust parameters to shift Fixed Costs and scale Variable Costs ($VC = aQ + bQ^2$).
            </p>
          </div>
        );
    }
  };

  const renderResult = () => {
    if (!result) return null;
    switch (mode) {
      case 'utility': {
        const tu1 = values.tu1 !== undefined ? values.tu1 : 15;
        const tu2 = values.tu2 !== undefined ? values.tu2 : 25;
        const q1 = values.q1 !== undefined ? values.q1 : 1;
        const q2 = values.q2 !== undefined ? values.q2 : 2;
        const avg_mu = q2 !== q1 ? (tu2 - tu1) / (q2 - q1) : 0;
        
        const chartData = [
          { name: `Qty ${q1}`, 'Total Utility': tu1, 'Avg Marginal Utility': tu1 / q1 },
          { name: `Qty ${q2}`, 'Total Utility': tu2, 'Avg Marginal Utility': avg_mu }
        ];

        return (
          <div className="space-y-4">
            <ResultCard label="Marginal Utility (MU)" value={result.mu} icon={<Zap className="text-amber-500" />} description="The additional satisfaction gained from consuming one more unit." />
            
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2 text-right">Total Utility</th>
                    <th className="px-3 py-2 text-right">Marginal Utility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Unit {q1}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{tu1}</td>
                    <td className="px-3 py-2 text-right text-muted">{(tu1 / q1).toFixed(1)}</td>
                  </tr>
                  <tr className="bg-slate-50/40 dark:bg-slate-850/20">
                    <td className="px-3 py-2 font-medium text-ink">Unit {q2}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{tu2}</td>
                    <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">{avg_mu.toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="Total Utility" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Avg Marginal Utility" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'elasticity': {
        const p1 = values.p1 !== undefined ? values.p1 : 10;
        const p2 = values.p2 !== undefined ? values.p2 : 12;
        const q1 = values.q1 !== undefined ? values.q1 : 100;
        const q2 = values.q2 !== undefined ? values.q2 : 80;

        const chartData = [
          { name: `P=₦${p1}`, Price: p1, Quantity: q1 },
          { name: `P=₦${p2}`, Price: p2, Quantity: q2 }
        ].sort((a, b) => a.Price - b.Price);

        return (
          <div className="space-y-4">
            <ResultCard label="Price Elasticity (PED)" value={result.ped} icon={<TrendingUp className="text-sky-500" />} />
            <div className={cn(
              "p-3 rounded-xl text-center font-bold text-xs uppercase tracking-widest border border-border",
              result.type === 'Elastic' ? "bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            )}>
              {result.type} Demand Curve Segment
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">State</th>
                    <th className="px-3 py-2 text-right">Price</th>
                    <th className="px-3 py-2 text-right">Quantity</th>
                    <th className="px-3 py-2 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Initial (A)</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">₦{p1}</td>
                    <td className="px-3 py-2 text-right text-ink">{q1}</td>
                    <td className="px-3 py-2 text-right text-muted font-mono">₦{p1 * q1}</td>
                  </tr>
                  <tr className="bg-slate-50/40 dark:bg-slate-850/20">
                    <td className="px-3 py-2 font-medium text-ink">Final (B)</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">₦{p2}</td>
                    <td className="px-3 py-2 text-right text-ink">{q2}</td>
                    <td className="px-3 py-2 text-right text-muted font-mono">₦{p2 * q2}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="Quantity" tick={{ fontSize: 9 }} label={{ value: 'Quantity', position: 'insideBottom', offset: -5, fontSize: 9 }} />
                  <YAxis dataKey="Price" tick={{ fontSize: 9 }} label={{ value: 'Price (₦)', angle: -90, position: 'insideLeft', fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Line name="Demand curve" type="linear" dataKey="Price" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#fff', strokeWidth: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'equilibrium': {
        const a = values.a !== undefined ? values.a : 100;
        const b = values.b !== undefined ? values.b : 2;
        const c = values.c !== undefined ? values.c : 20;
        const d = values.d !== undefined ? values.d : 3;

        const eqP = (a - c) / (b + d);
        
        const eqData = [];
        if (eqP > 0 && b + d > 0) {
          const minP = Math.max(0, Math.floor(eqP * 0.4));
          const maxP = Math.round(eqP * 1.6);
          const step = Math.max(1, Math.round((maxP - minP) / 5));
          for (let pVal = minP; pVal <= maxP; pVal += step) {
            eqData.push({
              Price: pVal,
              Demand: Math.max(0, parseFloat((a - b * pVal).toFixed(1))),
              Supply: Math.max(0, parseFloat((c + d * pVal).toFixed(1)))
            });
          }
        }

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <ResultCard label="Equilibrium Price (P*)" value={`₦${result.p}`} icon={<Scale className="text-sky-500" />} />
              <ResultCard label="Equilibrium Qty (Q*)" value={result.q} icon={<Scale className="text-sky-500" />} />
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Price (P)</th>
                    <th className="px-3 py-2 text-right">Quantity Demanded (Qd)</th>
                    <th className="px-3 py-2 text-right">Quantity Supplied (Qs)</th>
                    <th className="px-3 py-2 text-right">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {eqData.map((row, idx) => {
                    const isEq = Math.abs(row.Price - eqP) < 1.0;
                    return (
                      <tr key={idx} className={isEq ? "bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold" : ""}>
                        <td className="px-3 py-2 text-ink">₦{row.Price}</td>
                        <td className="px-3 py-2 text-right text-indigo-600 dark:text-indigo-400">{row.Demand}</td>
                        <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400">{row.Supply}</td>
                        <td className="px-3 py-2 text-right text-[10px]">
                          {row.Demand > row.Supply ? (
                            <span className="text-rose-500">Shortage</span>
                          ) : row.Demand < row.Supply ? (
                            <span className="text-amber-500">Surplus</span>
                          ) : (
                            <span className="text-emerald-600 font-bold">Equilibrium</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {eqData.length > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={eqData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="Price" tick={{ fontSize: 9 }} label={{ value: 'Price (₦)', position: 'insideBottom', offset: -5, fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" name="Demand" dataKey="Demand" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" name="Supply" dataKey="Supply" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      }
      case 'production': {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <ResultCard label="Average Product (AP)" value={result.ap} icon={<Factory className="text-indigo-500" />} />
              <ResultCard label="Marginal Product (MP)" value={result.mp} icon={<Factory className="text-indigo-500" />} />
            </div>
          </div>
        );
      }
      case 'cost_revenue': {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
               <ResultCard label="Total Cost (TC)" value={`₦${result.tc}`} icon={<Calculator />} />
               <ResultCard label="Total Revenue (TR)" value={`₦${result.tr}`} icon={<TrendingUp />} />
               <ResultCard label="Marginal Cost (MC)" value={`₦${result.mc}`} icon={<Calculator />} />
               <ResultCard label="Profit" value={`₦${result.profit}`} icon={<Zap />} />
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-card border border-border p-3 sm:p-5 rounded-2xl shadow-sm">
        <h2 className="text-sm font-bold text-ink mb-3 sm:mb-4 uppercase tracking-wider flex items-center gap-2">
          <Calculator className="text-sky-500" size={16} />
          Input Parameters
        </h2>
        {renderInputs()}
      </div>

      <div className="bg-card border border-border p-3 sm:p-5 rounded-2xl shadow-sm">
        <h2 className="text-sm font-bold text-ink mb-3 sm:mb-4 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="text-emerald-500" size={16} />
          Results & Analysis
        </h2>
        {result ? renderResult() : (
          <div className="text-center py-6 text-muted text-xs font-medium bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-border">
            Adjust inputs above to see calculated results and analysis.
          </div>
        )}
      </div>
    </div>
  );

  function renderWorkedOutSolution() {
    if (!result) return null;

    let steps: React.ReactNode[] = [];
    let interpretationTitle = "";
    let interpretationText = "";
    let formulaText = "";

    switch (mode) {
      case 'utility': {
        const tu1 = values.tu1 !== undefined ? values.tu1 : 15;
        const tu2 = values.tu2 !== undefined ? values.tu2 : 25;
        const q1 = values.q1 !== undefined ? values.q1 : 1;
        const q2 = values.q2 !== undefined ? values.q2 : 2;
        const deltaTU = tu2 - tu1;
        const deltaQ = q2 - q1;
        const mu = deltaQ !== 0 ? deltaTU / deltaQ : 0;

        formulaText = "MU = \\frac{\\Delta TU}{\\Delta Q} = \\frac{TU_2 - TU_1}{Q_2 - Q_1}";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Identify Initial and Final States:</strong> Initial Satisfaction (<InlineMath math="TU_1" />) = ₦{tu1} at Quantity (<InlineMath math="Q_1" />) = {q1}. Final Satisfaction (<InlineMath math="TU_2" />) = ₦{tu2} at Quantity (<InlineMath math="Q_2" />) = {q2}.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate the change in Total Utility (<InlineMath math="\\Delta TU" />):</strong> <InlineMath math="\\Delta TU = TU_2 - TU_1" /> = {tu2} - {tu1} = {deltaTU} units.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Calculate the change in Quantity Consumed (<InlineMath math="\\Delta Q" />):</strong> <InlineMath math="\\Delta Q = Q_2 - Q_1" /> = {q2} - {q1} = {deltaQ} units.</div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Solve for Marginal Utility (<InlineMath math="MU" />):</strong> <InlineMath math="MU = \\frac{\\Delta TU}{\\Delta Q} = \\frac{deltaTU}{deltaQ}" /> = {mu.toFixed(2)} units.</div>
        ];
        interpretationTitle = "Law of Diminishing Marginal Utility";
        interpretationText = mu > 0 
          ? `Consuming this additional unit increases your total utility by ${mu.toFixed(2)} units. Since Marginal Utility is positive, you have not yet reached oversaturation, but typically, each additional unit consumed will yield less extra satisfaction than the one before it.`
          : `Marginal Utility is ${mu.toFixed(2)}. Since it is non-positive, additional consumption does not increase your total satisfaction. You have reached or passed your point of satiation (disutility).`;
        break;
      }
      case 'elasticity': {
        const p1 = values.p1 !== undefined ? values.p1 : 10;
        const p2 = values.p2 !== undefined ? values.p2 : 12;
        const q1 = values.q1 !== undefined ? values.q1 : 100;
        const q2 = values.q2 !== undefined ? values.q2 : 80;

        const changeQ = q2 - q1;
        const pctChangeQ = ((q2 - q1) / q1) * 100;
        const changeP = p2 - p1;
        const pctChangeP = ((p2 - p1) / p1) * 100;
        const pedVal = Math.abs(pctChangeQ / (pctChangeP || 1));

        formulaText = "PED = \\left| \\frac{\\% \\Delta Q_d}{\\% \\Delta P} \\right| = \\left| \\frac{(Q_2 - Q_1)/Q_1}{(P_2 - P_1)/P_1} \\right|";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Calculate the Percentage Change in Quantity Demanded (<InlineMath math="\\% \\Delta Q_d" />):</strong> <InlineMath math="\\% \\Delta Q_d = \\frac{Q_2 - Q_1}{Q_1} \\times 100\\%" /> = <InlineMath math={`\\frac{${changeQ}}{${q1}} \\times 100\\% = ${pctChangeQ.toFixed(2)}\\%`} /></div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate the Percentage Change in Price (<InlineMath math="\\% \\Delta P" />):</strong> <InlineMath math="\\% \\Delta P = \\frac{P_2 - P_1}{P_1} \\times 100\\%" /> = <InlineMath math={`\\frac{${changeP}}{${p1}} \\times 100\\% = ${pctChangeP.toFixed(2)}\\%`} /></div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Solve for Price Elasticity of Demand (PED):</strong> <InlineMath math={`PED = \\left| \\frac{${pctChangeQ.toFixed(2)}\\%}{${pctChangeP.toFixed(2)}\\%} \\right| = ${pedVal.toFixed(2)}`} /></div>
        ];
        interpretationTitle = `Elasticity Interpretation: ${result.type || 'N/A'}`;
        interpretationText = pedVal > 1
          ? `Demand is ELASTIC (PED = ${pedVal.toFixed(2)} > 1). Consumers are highly responsive to price adjustments. A 1% increase in price leads to a ${pedVal.toFixed(2)}% drop in quantity demanded. In this case, raising prices is counterproductive because it will reduce Total Revenue (TR decreases from ₦${p1*q1} to ₦${p2*q2}).`
          : pedVal < 1
          ? `Demand is INELASTIC (PED = ${pedVal.toFixed(2)} < 1). Consumers are relatively unresponsive to price changes (likely due to necessity or lack of close substitutes). A 1% increase in price leads to only a ${pedVal.toFixed(2)}% decrease in quantity demanded. Raising prices here is profitable because it increases Total Revenue (TR rises from ₦${p1*q1} to ₦${p2*q2}).`
          : `Demand is UNITARY (PED = 1). The percentage change in quantity demanded exactly matches the percentage change in price. Total Revenue remains identical.`;
        break;
      }
      case 'equilibrium': {
        const a = values.a !== undefined ? values.a : 100;
        const b = values.b !== undefined ? values.b : 2;
        const c = values.c !== undefined ? values.c : 20;
        const d = values.d !== undefined ? values.d : 3;

        const eqP = (a - c) / (b + d);
        const eqQ = a - b * eqP;

        formulaText = "Q_d = Q_s \\implies a - bP = c + dP \\implies P^* = \\frac{a - c}{b + d}";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Set Demand Equal to Supply:</strong> <InlineMath math="Q_d = Q_s \\implies a - bP = c + dP" /> which is <InlineMath math={`${a} - ${b}P = ${c} + ${d}P`} /></div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Collect like terms:</strong> <InlineMath math={`${a} - ${c} = ${b}P + ${d}P \\implies ${a - c} = ${b + d}P`} /></div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Solve for Equilibrium Price (<InlineMath math="P^*" />):</strong> <InlineMath math={`P^* = \\frac{${a - c}}{${b + d}} = ₦${eqP.toFixed(2)}`} /></div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Substitute <InlineMath math="P^*" /> back to get Equilibrium Quantity (<InlineMath math="Q^*" />):</strong> <InlineMath math={`Q^* = ${a} - ${b}(${eqP.toFixed(2)}) = ${eqQ.toFixed(2)}`} /> units</div>
        ];
        interpretationTitle = "Market Equilibrium Analysis";
        interpretationText = `At the equilibrium price of ₦${eqP.toFixed(2)}, the market is in balance. The quantity that consumers are willing and able to buy (${eqQ.toFixed(2)} units) matches perfectly with the quantity producers are willing and able to supply. There is neither excess demand (shortage) nor excess supply (surplus) in the market.`;
        break;
      }
      case 'production': {
        const tp1 = values.tp1 !== undefined ? values.tp1 : 150;
        const tp2 = values.tp2 !== undefined ? values.tp2 : 180;
        const l1 = values.l1 !== undefined ? values.l1 : 5;
        const l2 = values.l2 !== undefined ? values.l2 : 6;
        const ap = l2 > 0 ? tp2 / l2 : 0;
        const mp = l2 !== l1 ? (tp2 - tp1) / (l2 - l1) : 0;

        formulaText = "AP = \\frac{TP_2}{L_2} \\quad \\text{and} \\quad MP = \\frac{\\Delta TP}{\\Delta L} = \\frac{TP_2 - TP_1}{L_2 - L_1}";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Calculate Average Product (AP) at final labor level:</strong> <InlineMath math={`AP = \\frac{TP_2}{L_2} = \\frac{${tp2}}{${l2}} = ${ap.toFixed(2)}`} /> units per worker.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate the change in Total Product (<InlineMath math="\\Delta TP" />):</strong> <InlineMath math={`\\Delta TP = TP_2 - TP_1 = ${tp2} - ${tp1} = ${tp2 - tp1}`} /> units.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Calculate the change in Labor (<InlineMath math="\\Delta L" />):</strong> <InlineMath math={`\\Delta L = L_2 - L_1 = ${l2} - ${l1} = ${l2 - l1}`} /> workers.</div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Solve for Marginal Product (MP) of the last worker:</strong> <InlineMath math={`MP = \\frac{\\Delta TP}{\\Delta L} = \\frac{${tp2 - tp1}}{${l2 - l1}} = ${mp.toFixed(2)}`} /> units.</div>
        ];
        interpretationTitle = "Law of Variable Proportions & Returns";
        interpretationText = mp > ap
          ? `Marginal Product (${mp.toFixed(2)}) is greater than Average Product (${ap.toFixed(2)}). This represents increasing returns. Adding workers increases productivity of previous workers due to synergy and specialization.`
          : `Marginal Product (${mp.toFixed(2)}) is less than Average Product (${ap.toFixed(2)}). This is the classic stage of Diminishing Marginal Returns. Although total output is still rising, each added worker contributes less than the previous one because the fixed capital assets are shared.`;
        break;
      }
      case 'cost_revenue': {
        const fc = values.fc !== undefined ? values.fc : 50;
        const a = values.a !== undefined ? values.a : 2;
        const b = values.b !== undefined ? values.b : 1;
        const price = values.price !== undefined ? values.price : 20;
        const q = values.q !== undefined ? values.q : 5;

        const vc = a * q + b * q * q;
        const tc = fc + vc;
        const ac = q > 0 ? tc / q : 0;
        const mc = q > 0 ? a + b * (2 * q - 1) : 0;
        const tr = price * q;
        const profit = tr - tc;

        formulaText = "TC = FC + VC(Q) = FC + (aQ + bQ^2) \\quad AC = \\frac{TC}{Q} \\quad MC \\approx a + b(2Q - 1)";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Calculate Variable Cost (VC) at Q = {q}:</strong> <InlineMath math={`VC = aQ + bQ^2 = ${a}(${q}) + ${b}(${q}^2) = ₦${vc}`} /></div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate Total Cost (TC):</strong> <InlineMath math={`TC = FC + VC = ${fc} + ${vc} = ₦${tc}`} /></div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Calculate Average Cost (AC):</strong> <InlineMath math={`AC = \\frac{TC}{Q} = \\frac{${tc}}{${q}} = ₦${ac.toFixed(2)}`} /></div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Solve for Marginal Cost (MC) at Q = {q}:</strong> <InlineMath math={`MC = a + b(2Q-1) = ${a} + ${b}(2(${q})-1) = ₦${mc.toFixed(2)}`} /></div>,
          <div key="s5" className="flex items-center gap-1 flex-wrap"><strong>Step 5: Calculate Revenues and Profit:</strong> <InlineMath math={`TR = P \\times Q = ${price} \\times ${q} = ₦${tr}`} />. <InlineMath math={`\\text{Profit} = TR - TC = ${tr} - ${tc} = ₦${profit.toFixed(2)}`} /></div>
        ];
        interpretationTitle = "Cost-Volume-Profit Optimization Analysis";
        interpretationText = profit >= 0
          ? `The firm is highly profitable, earning a net positive economic profit of ₦${profit.toFixed(2)}. Since Price (₦${price}) exceeds Average Cost (₦${ac.toFixed(2)}), you are covering all explicit and implicit costs. If Marginal Cost (₦${mc.toFixed(2)}) is close to Price, you are near your profit-maximizing output level.`
          : `The firm is operating at a loss of ₦${Math.abs(profit).toFixed(2)}. Since Price (₦${price}) is less than Average Cost (₦${ac.toFixed(2)}), you are not covering your full production costs. Check if Price is greater than Average Variable Cost (AVC) to decide if you should continue producing in the short run to offset fixed costs, or shut down.`;
        break;
      }
      default:
        return null;
    }

    return (
      <div className="mt-8 border-t border-border pt-6 px-3 sm:px-6 md:px-8">
        <button 
          onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
          className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-colors border border-border"
        >
          <div className="flex items-center gap-2 text-ink">
            <BookOpen size={16} className="text-sky-500" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Show Worked-out Solution & Economic Interpretation
            </span>
          </div>
          {isExplanationExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </button>

        {isExplanationExpanded && (
          <div className="mt-4 p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h4 className="text-xs font-extrabold text-sky-700 dark:text-sky-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Percent size={14} className="text-sky-600 dark:text-sky-400" /> Core Formula Used
              </h4>
              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-mono text-sm overflow-x-auto text-slate-900 dark:text-slate-100 flex justify-center py-5 shadow-sm">
                <BlockMath math={formulaText} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-sky-700 dark:text-sky-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calculator size={14} className="text-sky-600 dark:text-sky-400" /> Step-by-Step Mathematical Workout
              </h4>
              <div className="space-y-3 pl-1">
                {steps.map((step, idx) => (
                  <div key={idx} className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 border-l-2 border-sky-500 dark:border-sky-400 pl-3.5 py-1 leading-relaxed font-medium bg-white/60 dark:bg-slate-950/40 rounded-r-lg">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl shadow-sm">
              <h4 className="text-xs font-extrabold text-sky-800 dark:text-sky-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Lightbulb size={16} className="text-sky-600 dark:text-sky-400 shrink-0" /> {interpretationTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                {interpretationText}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-0 bg-card rounded-xl sm:rounded-3xl border border-border shadow-md sm:shadow-xl overflow-hidden not-prose transition-colors duration-300 w-full max-w-full">
      <div className="bg-slate-900 dark:bg-sky-900/40 p-4 sm:p-6 md:p-8 flex items-center gap-3 sm:gap-6">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-sky-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-500/20">
          <Calculator size={16} className="sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white text-sm sm:text-base md:text-xl font-bold tracking-tight mb-0.5 break-words leading-tight">Microeconomics Simulator</h3>
          <p className="text-sky-400 dark:text-sky-300 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] font-bold truncate">Interactive Calculation Engine</p>
        </div>
      </div>
      
      <div className="p-3 sm:p-6 md:p-8 grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-12">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 text-ink border-b border-border pb-2.5 sm:pb-4">
            <Info size={12} className="text-sky-500" />
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Input Parameters</span>
          </div>
          {renderInputs()}
        </div>

        <div className="bg-paper border border-border rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 sm:gap-3 text-ink mb-4 sm:mb-8 border-b border-border pb-2.5 sm:pb-4">
            <TrendingUp size={12} className="text-sky-500" />
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Live Analysis</span>
          </div>
          {result ? renderResult() : (
            <div className="text-center py-6 text-muted text-xs font-medium bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-border">
              Adjust inputs above to see calculated results and analysis.
            </div>
          )}
        </div>
      </div>
      {renderWorkedOutSolution()}
    </div>
  );
};
