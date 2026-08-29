import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Info, BookOpen, ChevronDown, ChevronUp, Coins, Percent, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InlineMath, BlockMath } from '../MathComponents';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Input, ResultCard } from './SimulatorShared';

export type MonetaryMode = 'barter_pricing' | 'baumol_tobin';

export interface MonetarySimulatorProps {
  mode: MonetaryMode;
  initialValues?: Record<string, number>;
  title?: string;
}

export const MonetaryEconomicsSimulator: React.FC<MonetarySimulatorProps> = ({ mode, initialValues, title }) => {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    if (mode === 'barter_pricing') {
      defaults.n_goods = 10;
    } else if (mode === 'baumol_tobin') {
      defaults.annual_income = 50000;
      defaults.interest_rate = 5;
      defaults.brokerage_cost = 10;
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
      case 'barter_pricing': {
        const n_goods = values.n_goods !== undefined ? values.n_goods : 10;
        const barter_prices = (n_goods * (n_goods - 1)) / 2;
        const money_prices = n_goods - 1;
        const saved_pct = barter_prices > 0 ? ((barter_prices - money_prices) / barter_prices) * 100 : 0;
        setResult({
          barter_prices: Math.round(barter_prices),
          money_prices: Math.round(money_prices),
          saved_pct: saved_pct.toFixed(1) + '%'
        });
        break;
      }
      case 'baumol_tobin': {
        const Y = values.annual_income !== undefined ? values.annual_income : 50000;
        const R = values.interest_rate !== undefined ? values.interest_rate : 5;
        const b = values.brokerage_cost !== undefined ? values.brokerage_cost : 10;

        const r_decimal = R / 100;
        if (r_decimal > 0) {
          const w_star = Math.sqrt((2 * b * Y) / r_decimal);
          const m_star = w_star / 2;
          const num_withdrawals = w_star > 0 ? Y / w_star : 0;
          const brokerage_cost_total = b * num_withdrawals;
          const foregone_interest_total = r_decimal * m_star;
          const total_cost = brokerage_cost_total + foregone_interest_total;

          setResult({
            w_star: w_star.toFixed(2),
            m_star: m_star.toFixed(2),
            num_withdrawals: num_withdrawals.toFixed(1),
            brokerage_cost_total: brokerage_cost_total.toFixed(2),
            foregone_interest_total: foregone_interest_total.toFixed(2),
            total_cost: total_cost.toFixed(2)
          });
        } else {
          setResult({
            w_star: '0.00',
            m_star: '0.00',
            num_withdrawals: '0.00',
            brokerage_cost_total: '0.00',
            foregone_interest_total: '0.00',
            total_cost: '0.00'
          });
        }
        break;
      }
    }
  };

  const renderInputs = () => {
    switch (mode) {
      case 'barter_pricing':
        return (
          <div className="space-y-3.5">
            <Input label="Number of Commodities (n)" value={values.n_goods} onChange={v => handleInputChange('n_goods', v)} />
            <p className="text-[10px] text-muted leading-relaxed italic">
              Try values between 3 and 100 to witness how barter pricing complexity explodes!
            </p>
          </div>
        );
      case 'baumol_tobin':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <Input label="Period Expenditure (Y ₦)" value={values.annual_income} onChange={v => handleInputChange('annual_income', v)} />
              <Input label="Bond Interest Rate (R %)" value={values.interest_rate} onChange={v => handleInputChange('interest_rate', v)} />
              <Input label="Brokerage/Contract Fee (b ₦)" value={values.brokerage_cost} onChange={v => handleInputChange('brokerage_cost', v)} />
            </div>
          </div>
        );
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (mode) {
      case 'barter_pricing': {
        const n_goods = values.n_goods !== undefined ? values.n_goods : 10;
        const complexityData = [];
        for (let n = 2; n <= Math.max(15, n_goods); n += 2) {
          complexityData.push({
            goods: n,
            'Barter Prices': (n * (n - 1)) / 2,
            'Money Prices': n - 1
          });
        }

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Barter Prices Needed" value={result.barter_prices} icon={<Scale className="text-rose-500" />} description="n * (n - 1) / 2" />
              <ResultCard label="Monetary Prices Needed" value={result.money_prices} icon={<Coins className="text-emerald-500" />} description="n - 1" />
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-center text-xs">
              Value Exchange Optimization: Using money reduces the number of transactional price listings by {result.saved_pct}!
            </div>

            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complexityData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="goods" tick={{ fontSize: 9 }} label={{ value: 'Number of Goods (N)', position: 'insideBottom', offset: -5, fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" name="Barter (N(N-1)/2)" dataKey="Barter Prices" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" name="Money (N-1)" dataKey="Money Prices" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'baumol_tobin': {
        const Y = values.annual_income !== undefined ? values.annual_income : 50000;
        const R = values.interest_rate !== undefined ? values.interest_rate : 5;
        const b = values.brokerage_cost !== undefined ? values.brokerage_cost : 10;
        const r_decimal = R / 100;

        const optimalW = parseFloat(result.w_star);
        const bData = [];
        if (optimalW > 0) {
          const startPoints = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
          startPoints.forEach(pFactor => {
            const currentW = Math.round(optimalW * pFactor);
            const numWith = currentW > 0 ? Y / currentW : 0;
            const bCost = b * numWith;
            const iCost = r_decimal * (currentW / 2);
            const tCost = bCost + iCost;
            bData.push({
              W: `W*${pFactor.toFixed(2)}`,
              'Brokerage Cost': parseFloat(bCost.toFixed(1)),
              'Interest Cost': parseFloat(iCost.toFixed(1)),
              'Total Cost': parseFloat(tCost.toFixed(1))
            });
          });
        }

        return (
          <div className="space-y-4">
            <ResultCard label="Optimal Withdrawal (W*)" value={`₦${parseFloat(result.w_star).toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={<Coins className="text-emerald-500" />} description="Ideal size for cash withdrawal to minimize overhead + foregone interest." />
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <ResultCard label="Avg Cash Balance" value={`₦${parseFloat(result.m_star).toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="# of Transactions" value={result.num_withdrawals} icon={<TrendingUp className="text-slate-400" />} />
              <ResultCard label="Brokerage Cost" value={`₦${parseFloat(result.brokerage_cost_total).toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={<Percent className="text-slate-400" />} />
              <ResultCard label="Interest Cost" value={`₦${parseFloat(result.foregone_interest_total).toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={<Percent className="text-slate-400" />} />
            </div>
            <p className="text-[10px] text-muted text-center font-mono py-1 border border-dashed border-border rounded-xl">
              Total Cost = {`₦${parseFloat(result.total_cost).toLocaleString(undefined, {minimumFractionDigits: 2})}`}
            </p>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[10px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-2 py-1.5">Size vs W*</th>
                    <th className="px-2 py-1.5 text-right">Brokerage</th>
                    <th className="px-2 py-1.5 text-right">Interest Foregone</th>
                    <th className="px-2 py-1.5 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bData.filter((_, i) => i % 2 === 1).map((row, idx) => {
                    const isOptimal = row.W === 'W*1.00';
                    return (
                      <tr key={idx} className={isOptimal ? "bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold" : ""}>
                        <td className="px-2 py-1.5 text-ink">{isOptimal ? 'Optimal (1.0x)' : row.W}</td>
                        <td className="px-2 py-1.5 text-right font-mono">₦{row['Brokerage Cost']}</td>
                        <td className="px-2 py-1.5 text-right font-mono">₦{row['Interest Cost']}</td>
                        <td className="px-2 py-1.5 text-right text-emerald-600 dark:text-emerald-400 font-bold font-mono">₦{row['Total Cost']}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {bData.length > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="W" tick={{ fontSize: 8 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '9px' }} />
                    <Line type="monotone" name="Brokerage Cost" dataKey="Brokerage Cost" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" name="Interest Cost" dataKey="Interest Cost" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" name="Total Cost" dataKey="Total Cost" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      }
    }
  };

  const renderWorkedOutSolution = () => {
    if (!result) return null;

    let formulaText = "";
    let steps: React.ReactNode[] = [];
    let interpretationTitle = "";
    let interpretationText = "";

    switch (mode) {
      case 'barter_pricing': {
        const n_goods = values.n_goods !== undefined ? values.n_goods : 10;
        formulaText = "\\text{Barter Exchange Ratios} = \\frac{N(N-1)}{2} \\quad \\text{vs} \\quad \\text{Money Prices} = N - 1";
        steps = [
          <div key="s1"><strong>Step 1: Count Commodities:</strong> Number of goods (N) = {n_goods}.</div>,
          <div key="s2"><strong>Step 2: Calculate Barter Relative Price Pairs:</strong> <InlineMath math={`\\frac{${n_goods} \\times (${n_goods} - 1)}{2} = ${result.barter_prices}`} /> prices.</div>,
          <div key="s3"><strong>Step 3: Calculate Monetary Prices:</strong> With a common unit of account, only (N - 1) = {result.money_prices} prices are needed. Efficiency gain = {result.saved_pct}.</div>
        ];
        interpretationTitle = "Evolution of Money & Transaction Efficiency";
        interpretationText = `In a barter economy without money, every commodity must trade against every other commodity, necessitating ${result.barter_prices} separate exchange ratios. Introducing money as a universal unit of account eliminates the need for double coincidence of wants and reduces the price directory to just ${result.money_prices} quotations, saving ${result.saved_pct} in information and search costs.`;
        break;
      }
      case 'baumol_tobin': {
        const Y = values.annual_income !== undefined ? values.annual_income : 50000;
        const R = values.interest_rate !== undefined ? values.interest_rate : 5;
        const b = values.brokerage_cost !== undefined ? values.brokerage_cost : 10;
        formulaText = "W^* = \\sqrt{\\frac{2bY}{r}} \\quad \\text{and} \\quad \\bar{M} = \\frac{W^*}{2}";
        steps = [
          <div key="s1"><strong>Step 1: Identify Inventory Parameters:</strong> Income (Y) = ₦{Y}, Bond Interest (r) = {R}%, Transaction Fee (b) = ₦{b}.</div>,
          <div key="s2"><strong>Step 2: Solve Optimal Cash Withdrawal (Square-Root Formula):</strong> <InlineMath math={`W^* = \\sqrt{\\frac{2 \\times ${b} \\times ${Y}}{${(R/100).toFixed(4)}}} = ₦${result.w_star}`} />.</div>,
          <div key="s3"><strong>Step 3: Determine Average Cash Holdings:</strong> <InlineMath math={`\\bar{M} = \\frac{W^*}{2} = ₦${result.m_star}`} /> across {result.num_withdrawals} trips. Total minimal cost = ₦{result.total_cost}.</div>
        ];
        interpretationTitle = "Baumol-Tobin Inventory Model of Transactions Money Demand";
        interpretationText = `The Baumol-Tobin model balances transaction costs (brokerage fees of trips to the bank) against the opportunity cost of holding liquid cash (foregone interest on bonds). The optimal cash withdrawal size of ₦${result.w_star} uniquely minimizes total carrying costs. Notice that as interest rates rise, optimal cash balances shrink, demonstrating an interest-elastic transactions demand for money.`;
        break;
      }
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
              Show Worked-out Solution & Monetary Theory
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
  };

  return (
    <div className="my-0 bg-card rounded-xl sm:rounded-3xl border border-border shadow-md sm:shadow-xl overflow-hidden not-prose transition-colors duration-300 w-full max-w-full">
      <div className="bg-slate-900 dark:bg-sky-900/40 p-4 sm:p-6 md:p-8 flex items-center gap-3 sm:gap-6">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-sky-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-500/20">
          <Calculator size={16} className="sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white text-sm sm:text-base md:text-xl font-bold tracking-tight mb-0.5 break-words leading-tight">
            {title || 'Monetary Economics Simulator'}
          </h3>
          <p className="text-sky-400 dark:text-sky-300 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] font-bold truncate">
            Currency & Liquidity Preference Engine
          </p>
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
      
      {renderWorkedOutSolution()}
    </div>
  );
};
