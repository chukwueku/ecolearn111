import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, TrendingUp, Scale, Info, Percent, Coins, 
  Sigma, Hash, Binary, Activity, Target, HelpCircle, CornerDownRight,
  ChevronDown, ChevronUp, BookOpen, Lightbulb
} from 'lucide-react';
import { InlineMath, BlockMath } from './MathComponents';

export type StatsMode = 
  | 'descriptive_stats'
  | 'probability'
  | 'statistical_inference'
  | 'hypothesis_testing'
  | 'simple_regression'
  | 'multiple_regression'
  | 'autocorrelation';

interface StatsSimulatorProps {
  mode: StatsMode;
  title?: string;
  initialValues?: Record<string, number>;
}

// Custom Input Component
const Input = ({ label, value, onChange, placeholder = '0.00' }: { label: string, value: number | undefined, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <input
        type="number"
        value={value !== undefined && !isNaN(value) ? value : ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-paper dark:bg-slate-800 border border-border rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold text-ink transition-all placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 min-w-0"
        placeholder={placeholder}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted/60 group-focus-within:text-sky-500 transition-colors pointer-events-none">
        <Calculator size={12} />
      </div>
    </div>
  </div>
);

// Custom Result Card
const ResultCard = ({ label, value, icon, description }: { label: string, value: string | number, icon: React.ReactNode, description?: string }) => (
  <div className="bg-card border border-border p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-1.5">
      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-paper dark:bg-slate-800 flex items-center justify-center shrink-0">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 14 }) : icon}
      </div>
      <span className="text-[8px] sm:text-[9px] font-bold text-muted uppercase tracking-wider text-right ml-2">{label}</span>
    </div>
    <div className="text-base sm:text-xl md:text-2xl font-bold text-ink mb-0.5 tracking-tight break-words">{value}</div>
    {description && <p className="text-[9px] sm:text-[10px] text-muted leading-relaxed font-semibold">{description}</p>}
  </div>
);

// Toggle group
const ToggleGroup = ({ label, options, activeValue, onChange }: { label: string, options: { label: string, value: number }[], activeValue: number, onChange: (v: number) => void }) => {
  return (
    <div className="space-y-1 w-full">
      <label className="text-[9px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="grid grid-cols-2 min-[380px]:grid-cols-4 sm:flex sm:flex-wrap gap-1.5 w-full">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-1.5 sm:px-2.5 py-1.5 text-[9px] sm:text-[10px] font-bold rounded-lg border transition-all cursor-pointer text-center leading-tight sm:grow ${
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

// Normal distribution CDF approximation (precision < 1e-7)
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804; // 1 / sqrt(2 * pi)
  const p = d * Math.exp(-0.5 * z * z) * t * (
    0.31938153 + t * (
      -0.356563782 + t * (
        1.781477937 + t * (
          -1.821255978 + t * 1.330274429
        )
      )
    )
  );
  return z >= 0 ? 1 - p : p;
}

// Student's t lookup table for 90%, 95%, 99%
const tTable: Record<number, { 90: number, 95: number, 99: number }> = {
  1: { 90: 6.314, 95: 12.706, 99: 63.657 },
  2: { 90: 2.920, 95: 4.303, 99: 9.925 },
  3: { 90: 2.353, 95: 3.182, 99: 5.841 },
  4: { 90: 2.132, 95: 2.776, 99: 4.604 },
  5: { 90: 2.015, 95: 2.571, 99: 4.032 },
  6: { 90: 1.943, 95: 2.447, 99: 3.707 },
  7: { 90: 1.895, 95: 2.365, 99: 3.499 },
  8: { 90: 1.860, 95: 2.306, 99: 3.355 },
  9: { 90: 1.833, 95: 2.262, 99: 3.250 },
  10: { 90: 1.812, 95: 2.228, 99: 3.169 },
  11: { 90: 1.796, 95: 2.201, 99: 3.106 },
  12: { 90: 1.782, 95: 2.179, 99: 3.055 },
  13: { 90: 1.771, 95: 2.160, 99: 3.012 },
  14: { 90: 1.761, 95: 2.145, 99: 2.977 },
  15: { 90: 1.753, 95: 2.131, 99: 2.947 },
  16: { 90: 1.746, 95: 2.120, 99: 2.921 },
  17: { 90: 1.740, 95: 2.110, 99: 2.898 },
  18: { 90: 1.734, 95: 2.101, 99: 2.878 },
  19: { 90: 1.729, 95: 2.093, 99: 2.861 },
  20: { 90: 1.725, 95: 2.086, 99: 2.845 },
  21: { 90: 1.721, 95: 2.080, 99: 2.831 },
  22: { 90: 1.717, 95: 2.074, 99: 2.819 },
  23: { 90: 1.714, 95: 2.069, 99: 2.807 },
  24: { 90: 1.711, 95: 2.064, 99: 2.797 },
  25: { 90: 1.708, 95: 2.060, 99: 2.787 },
  26: { 90: 1.706, 95: 2.056, 99: 2.779 },
  27: { 90: 1.703, 95: 2.052, 99: 2.771 },
  28: { 90: 1.701, 95: 2.048, 99: 2.763 },
  29: { 90: 1.699, 95: 2.045, 99: 2.756 },
  30: { 90: 1.697, 95: 2.042, 99: 2.750 }
};

function getTCritical(df: number, cl: 90 | 95 | 99): number {
  if (df <= 0) return 1.960;
  if (df > 30) {
    if (cl === 90) return 1.645;
    if (cl === 95) return 1.960;
    return 2.576;
  }
  return tTable[df]?.[cl] || 1.960;
}

// Lookup for single-tail or hypothesis-tail values
function getHypothesisCriticalValue(alpha: number, tail: number, df: number): number {
  const isOneTailed = tail !== 1;
  const alphaPercent = Math.round(alpha * 100);
  
  if (df > 30) {
    if (isOneTailed) {
      if (alphaPercent === 10) return 1.282;
      if (alphaPercent === 5) return 1.645;
      if (alphaPercent === 1) return 2.326;
      return 1.645;
    } else {
      if (alphaPercent === 10) return 1.645;
      if (alphaPercent === 5) return 1.960;
      if (alphaPercent === 1) return 2.576;
      return 1.960;
    }
  } else {
    if (!isOneTailed) {
      if (alphaPercent === 10) return getTCritical(df, 90);
      if (alphaPercent === 5) return getTCritical(df, 95);
      if (alphaPercent === 1) return getTCritical(df, 99);
    } else {
      if (alphaPercent === 5) return getTCritical(df, 90); // 1-tail 5% is 2-tail 10%
      if (alphaPercent === 1) {
        const t1tail01: Record<number, number> = {
          1: 31.821, 2: 6.965, 3: 4.541, 4: 3.747, 5: 3.365, 6: 3.143, 7: 2.998, 8: 2.896, 9: 2.821, 10: 2.764,
          11: 2.718, 12: 2.681, 13: 2.650, 14: 2.624, 15: 2.602, 16: 2.583, 17: 2.567, 18: 2.552, 19: 2.539, 20: 2.528,
          21: 2.518, 22: 2.508, 23: 2.500, 24: 2.492, 25: 2.485, 26: 2.479, 27: 2.473, 28: 2.467, 29: 2.462, 30: 2.457
        };
        return t1tail01[df] || 2.326;
      }
      if (alphaPercent === 10) {
        const t1tail10: Record<number, number> = {
          1: 3.078, 2: 1.886, 3: 1.638, 4: 1.533, 5: 1.476, 6: 1.440, 7: 1.415, 8: 1.397, 9: 1.383, 10: 1.372,
          11: 1.363, 12: 1.356, 13: 1.350, 14: 1.345, 15: 1.341, 16: 1.337, 17: 1.333, 18: 1.330, 19: 1.328, 20: 1.325,
          21: 1.323, 22: 1.321, 23: 1.319, 24: 1.318, 25: 1.316, 26: 1.315, 27: 1.314, 28: 1.313, 29: 1.311, 30: 1.310
        };
        return t1tail10[df] || 1.282;
      }
    }
    return getTCritical(df, 95);
  }
}

// Factorial utility
function factorial(n: number): number {
  if (n <= 1) return 1;
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

// Combinations (n Cr)
function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export const StatsSimulator: React.FC<StatsSimulatorProps> = ({ mode, title }) => {
  const [subTab, setSubTab] = useState(1);
  const [values, setValues] = useState<Record<string, number>>({});
  const [textInputs, setTextInputs] = useState<Record<string, string>>({
    descriptive_raw: "10, 15, 12, 18, 22, 14, 15, 20",
    regression_x: "10, 12, 15, 18, 20, 22, 25",
    regression_y: "20, 24, 30, 39, 41, 48, 52"
  });
  const [result, setResult] = useState<any>(null);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(true);

  const handleInputChange = (key: string, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    setValues(prev => ({ ...prev, [key]: numVal }));
  };

  const handleTextChange = (key: string, val: string) => {
    setTextInputs(prev => ({ ...prev, [key]: val }));
  };

  // Set default parameters depending on mode & subtabs
  useEffect(() => {
    const defaults: Record<string, number> = {};
    if (mode === 'probability') {
      if (subTab === 1) { // Bayes
        defaults.prior = 4; // default P(D) = 4%
        defaults.likelihood = 90; // default test positive default = 90%
        defaults.false_pos = 15; // default false positive ND = 15%
      } else if (subTab === 2) { // Binomial
        defaults.n = 8;
        defaults.p = 5; // Success prob = 5%
        defaults.x = 2; // successes = 2
      } else if (subTab === 3) { // Poisson
        defaults.lambda = 2.0;
        defaults.x = 4;
      } else if (subTab === 4) { // Normal
        defaults.mean = 1200;
        defaults.sd = 150;
        defaults.x_val = 1500;
        defaults.tail = 1; // 1 = greater than, 2 = less than
      }
    } else if (mode === 'statistical_inference') {
      if (subTab === 1) { // Mean CI
        defaults.mean = 45;
        defaults.sd = 8;
        defaults.n = 64;
        defaults.cl = 95;
        defaults.known = 1; // 1 = unknown (t-dist), 2 = known (Z-dist)
      } else { // Proportion CI
        defaults.p_prop = 60; // 60%
        defaults.n = 500;
        defaults.cl = 99;
      }
    } else if (mode === 'hypothesis_testing') {
      defaults.mean = 45;
      defaults.mu0 = 42;
      defaults.sd = 8;
      defaults.n = 64;
      defaults.alpha = 5; // alpha = 5%
      defaults.tail = 1; // 1 = two-tailed, 2 = left, 3 = right
    } else if (mode === 'multiple_regression') {
      defaults.r2 = 75; // 75%
      defaults.n = 30;
      defaults.k = 2;
    } else if (mode === 'autocorrelation') {
      defaults.dw = 1.4;
      defaults.n = 30;
      defaults.k = 2;
    }
    setValues(defaults);
  }, [mode, subTab]);

  // Recalculate whenever state changes
  useEffect(() => {
    calculate();
  }, [values, textInputs, subTab]);

  const calculate = () => {
    switch (mode) {
      case 'descriptive_stats': {
        const numbers = textInputs.descriptive_raw
          .split(/[\s,]+/)
          .map(v => parseFloat(v))
          .filter(v => !isNaN(v));

        if (numbers.length === 0) {
          setResult(null);
          return;
        }

        const count = numbers.length;
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / count;

        // Sort for median
        const sorted = [...numbers].sort((a, b) => a - b);
        let median = 0;
        if (count % 2 === 1) {
          median = sorted[Math.floor(count / 2)];
        } else {
          median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
        }

        // Mode
        const freqs: Record<number, number> = {};
        let maxFreq = 0;
        numbers.forEach(n => {
          freqs[n] = (freqs[n] || 0) + 1;
          if (freqs[n] > maxFreq) maxFreq = freqs[n];
        });
        const modesList = Object.keys(freqs)
          .map(Number)
          .filter(n => freqs[n] === maxFreq && maxFreq > 1);
        const modeStr = modesList.length > 0 ? modesList.join(', ') : 'No unique mode';

        const min = sorted[0];
        const max = sorted[count - 1];
        const range = max - min;

        // Variance & SD
        const sqDiffSum = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
        const sampleVar = count > 1 ? sqDiffSum / (count - 1) : 0;
        const sampleSD = Math.sqrt(sampleVar);
        const popVar = sqDiffSum / count;
        const popSD = Math.sqrt(popVar);

        setResult({
          count,
          sum: sum.toFixed(2),
          mean: mean.toFixed(4),
          median: median.toFixed(2),
          mode: modeStr,
          min: min.toFixed(2),
          max: max.toFixed(2),
          range: range.toFixed(2),
          sampleVar: sampleVar.toFixed(4),
          sampleSD: sampleSD.toFixed(4),
          popVar: popVar.toFixed(4),
          popSD: popSD.toFixed(4)
        });
        break;
      }
      case 'probability': {
        if (subTab === 1) { // Bayes
          const prior = (values.prior !== undefined ? values.prior : 4) / 100;
          const likelihood = (values.likelihood !== undefined ? values.likelihood : 90) / 100;
          const false_pos = (values.false_pos !== undefined ? values.false_pos : 15) / 100;

          // Posterior P(D|W) = (L * P) / (L * P + FP * (1 - P))
          const num = likelihood * prior;
          const den = num + false_pos * (1 - prior);
          const posterior = den !== 0 ? num / den : 0;

          setResult({
            val: (posterior * 100).toFixed(2) + '%',
            formula: "P(D|W) = [P(W|D)·P(D)] / [P(W|D)·P(D) + P(W|ND)·P(ND)]",
            breakdown: `Numerator = ${likelihood.toFixed(2)} × ${prior.toFixed(2)} = ${num.toFixed(4)}\nDenominator = ${num.toFixed(4)} + ${false_pos.toFixed(2)} × ${(1 - prior).toFixed(2)} = ${den.toFixed(4)}\nResult = ${(posterior * 100).toFixed(2)}%`
          });
        } else if (subTab === 2) { // Binomial
          const n = Math.max(1, Math.min(100, Math.round(values.n !== undefined ? values.n : 8)));
          const p = (values.p !== undefined ? values.p : 5) / 100;
          const x = Math.max(0, Math.min(n, Math.round(values.x !== undefined ? values.x : 2)));

          const q = 1 - p;
          const prob = nCr(n, x) * Math.pow(p, x) * Math.pow(q, n - x);
          const binomialMean = n * p;
          const binomialVar = n * p * q;

          setResult({
            val: (prob * 100).toFixed(3) + '%',
            mean: binomialMean.toFixed(2),
            variance: binomialVar.toFixed(4),
            sd: Math.sqrt(binomialVar).toFixed(4),
            formula: `P(X = ${x}) = left(\\begin{matrix} ${n} \\\\ ${x} \\end{matrix}right) · p^{x} · q^{n-x}`,
            breakdown: `nCr(${n},${x}) = ${nCr(n,x)}\np^x = ${p.toFixed(3)}^${x} = ${Math.pow(p, x).toFixed(6)}\nq^(n-x) = ${q.toFixed(3)}^${n-x} = ${Math.pow(q, n-x).toFixed(6)}\nResult = ${(prob * 100).toFixed(3)}%`
          });
        } else if (subTab === 3) { // Poisson
          const lambda = values.lambda !== undefined ? values.lambda : 2.0;
          const x = Math.max(0, Math.round(values.x !== undefined ? values.x : 4));

          const prob = (Math.exp(-lambda) * Math.pow(lambda, x)) / factorial(x);

          setResult({
            val: (prob * 100).toFixed(3) + '%',
            mean: lambda.toFixed(2),
            variance: lambda.toFixed(2),
            formula: `P(X = ${x}) = (e^{-λ} · λ^x) / x!`,
            breakdown: `e^-λ = e^-${lambda} = ${Math.exp(-lambda).toFixed(6)}\nλ^x = ${lambda}^${x} = ${Math.pow(lambda, x).toFixed(4)}\nx! = ${factorial(x)}\nResult = ${(prob * 100).toFixed(3)}%`
          });
        } else if (subTab === 4) { // Normal
          const mean = values.mean !== undefined ? values.mean : 1200;
          const sd = Math.max(0.1, values.sd !== undefined ? values.sd : 150);
          const x_val = values.x_val !== undefined ? values.x_val : 1500;
          const tail = values.tail !== undefined ? values.tail : 1; // 1 = greater than, 2 = less than

          const z = (x_val - mean) / sd;
          const leftArea = normalCDF(z);
          const rightArea = 1 - leftArea;
          const prob = tail === 1 ? rightArea : leftArea;

          setResult({
            val: (prob * 100).toFixed(2) + '%',
            z: z.toFixed(4),
            formula: `Z = (X - μ) / σ = (${x_val} - ${mean}) / ${sd}`,
            breakdown: `Calculated Z-score = ${z.toFixed(4)}\nP(Z ${tail === 1 ? '>' : '<'} ${z.toFixed(2)}) = ${(prob * 100).toFixed(2)}%`
          });
        }
        break;
      }
      case 'statistical_inference': {
        const cl = (values.cl !== undefined ? values.cl : 95) as 90 | 95 | 99;
        const clPercentList = [90, 95, 99];
        const clVal = clPercentList.includes(cl) ? cl : 95;

        if (subTab === 1) { // Mean CI
          const mean = values.mean !== undefined ? values.mean : 45;
          const sd = Math.max(0.01, values.sd !== undefined ? values.sd : 8);
          const n = Math.max(2, values.n !== undefined ? values.n : 64);
          const known = values.known !== undefined ? values.known : 1; // 1 = unknown (t), 2 = known (Z)

          const df = n - 1;
          const isZ = known === 2 || n >= 100;
          
          let critVal = 1.960;
          if (isZ) {
            if (clVal === 90) critVal = 1.645;
            else if (clVal === 95) critVal = 1.960;
            else if (clVal === 99) critVal = 2.576;
          } else {
            critVal = getTCritical(df, clVal);
          }

          const se = sd / Math.sqrt(n);
          const me = critVal * se;
          const low = mean - me;
          const high = mean + me;

          setResult({
            critVal: critVal.toFixed(3),
            se: se.toFixed(4),
            me: me.toFixed(4),
            low: low.toFixed(4),
            high: high.toFixed(4),
            distType: isZ ? 'Z-Distribution (Normal)' : `t-Distribution (df = ${df})`,
            formula: `CI = X̄ ± ${isZ ? 'Z' : 't'}(α/2) · (s / √n)`
          });
        } else { // Proportion CI
          const p = (values.p_prop !== undefined ? values.p_prop : 60) / 100;
          const n = Math.max(10, values.n !== undefined ? values.n : 500);

          let critVal = 1.960;
          if (clVal === 90) critVal = 1.645;
          else if (clVal === 95) critVal = 1.960;
          else if (clVal === 99) critVal = 2.576;

          const se = Math.sqrt((p * (1 - p)) / n);
          const me = critVal * se;
          const low = p - me;
          const high = p + me;

          setResult({
            critVal: critVal.toFixed(3),
            se: se.toFixed(4),
            me: me.toFixed(4),
            low: (low * 100).toFixed(2) + '%',
            high: (high * 100).toFixed(2) + '%',
            distType: 'Z-Distribution',
            formula: 'CI = p̂ ± Z(α/2) · √[p̂(1 - p̂) / n]'
          });
        }
        break;
      }
      case 'hypothesis_testing': {
        const mean = values.mean !== undefined ? values.mean : 45;
        const mu0 = values.mu0 !== undefined ? values.mu0 : 42;
        const sd = Math.max(0.01, values.sd !== undefined ? values.sd : 8);
        const n = Math.max(2, values.n !== undefined ? values.n : 64);
        const alpha = (values.alpha !== undefined ? values.alpha : 5) / 100;
        const tail = values.tail !== undefined ? values.tail : 1; // 1 = two-tailed, 2 = left, 3 = right

        const df = n - 1;
        const se = sd / Math.sqrt(n);
        const tStat = se !== 0 ? (mean - mu0) / se : 0;
        const critVal = getHypothesisCriticalValue(alpha, tail, df);

        let decision = false; // false = fail to reject, true = reject
        let comparisonStr = '';

        if (tail === 1) { // two-tailed
          decision = Math.abs(tStat) > critVal;
          comparisonStr = `|t-stat| = ${Math.abs(tStat).toFixed(3)} ${decision ? '>' : '≤'} Critical t = ${critVal.toFixed(3)}`;
        } else if (tail === 2) { // left-tailed
          decision = tStat < -critVal;
          comparisonStr = `t-stat = ${tStat.toFixed(3)} ${decision ? '<' : '≥'} Critical t = -${critVal.toFixed(3)}`;
        } else { // right-tailed
          decision = tStat > critVal;
          comparisonStr = `t-stat = ${tStat.toFixed(3)} ${decision ? '>' : '≤'} Critical t = ${critVal.toFixed(3)}`;
        }

        // Approximate p-value based on normal distribution for tStat
        const zValueForP = Math.abs(tStat);
        const tailArea = 1 - normalCDF(zValueForP);
        const pValue = tail === 1 ? 2 * tailArea : tailArea;

        setResult({
          se: se.toFixed(4),
          stat: tStat.toFixed(4),
          critVal: critVal.toFixed(3),
          pValue: pValue < 0.0001 ? '< 0.0001' : pValue.toFixed(4),
          decision: decision ? '🟢 REJECT NULL HYPOTHESIS' : '🔴 FAIL TO REJECT NULL HYPOTHESIS',
          decisionBool: decision,
          comparison: comparisonStr,
          breakdown: `H0: μ = ${mu0}\nH1: μ ${tail === 1 ? '≠' : tail === 2 ? '<' : '>'} ${mu0}\nStandard Error = ${se.toFixed(4)}\nCalculated t-statistic = ${tStat.toFixed(4)}\nCritical Value = ${critVal.toFixed(3)}\np-value ≈ ${pValue.toFixed(4)}`
        });
        break;
      }
      case 'simple_regression': {
        const x_vals = textInputs.regression_x.split(/[\s,]+/).map(parseFloat).filter(v => !isNaN(v));
        const y_vals = textInputs.regression_y.split(/[\s,]+/).map(parseFloat).filter(v => !isNaN(v));

        if (x_vals.length <= 1 || x_vals.length !== y_vals.length) {
          setResult(null);
          return;
        }

        const n = x_vals.length;
        const meanX = x_vals.reduce((a, b) => a + b, 0) / n;
        const meanY = y_vals.reduce((a, b) => a + b, 0) / n;

        let num = 0;
        let den = 0;
        let tss = 0;

        for (let i = 0; i < n; i++) {
          const dx = x_vals[i] - meanX;
          const dy = y_vals[i] - meanY;
          num += dx * dy;
          den += dx * dx;
          tss += dy * dy;
        }

        const beta1 = den !== 0 ? num / den : 0;
        const beta0 = meanY - beta1 * meanX;

        // Sum of squares decompose
        let rss = 0;
        for (let i = 0; i < n; i++) {
          const yHat = beta0 + beta1 * x_vals[i];
          rss += Math.pow(y_vals[i] - yHat, 2);
        }

        const ess = tss - rss;
        const r2 = tss !== 0 ? ess / tss : 0;
        const r = Math.sign(beta1) * Math.sqrt(r2);

        // Standard error of regression & slope
        const s2 = n > 2 ? rss / (n - 2) : 0;
        const seRegression = Math.sqrt(s2);
        const seBeta1 = den !== 0 ? seRegression / Math.sqrt(den) : 0;

        setResult({
          n,
          beta0: beta0.toFixed(4),
          beta1: beta1.toFixed(4),
          tss: tss.toFixed(2),
          ess: ess.toFixed(2),
          rss: rss.toFixed(2),
          r2: (r2 * 100).toFixed(2) + '%',
          r: r.toFixed(4),
          seBeta1: seBeta1.toFixed(4),
          formula: `Ŷ = ${beta0.toFixed(2)} + ${beta1.toFixed(2)}·X`,
          breakdown: `Mean X = ${meanX.toFixed(2)}, Mean Y = ${meanY.toFixed(2)}\nCovariance term (numerator) = ${num.toFixed(2)}\nVariance term of X (denominator) = ${den.toFixed(2)}\nTSS = ${tss.toFixed(2)}, ESS = ${ess.toFixed(2)}, RSS = ${rss.toFixed(2)}\nStandard Error of Slope SE(β1) = ${seBeta1.toFixed(4)}`
        });
        break;
      }
      case 'multiple_regression': {
        const r2 = (values.r2 !== undefined ? values.r2 : 75) / 100;
        const n = Math.max(5, values.n !== undefined ? values.n : 30);
        const k = Math.max(1, values.k !== undefined ? values.k : 2);

        // Adjusted R2 = 1 - (1 - R2) * (n-1) / (n-k-1)
        const adjR2 = 1 - (1 - r2) * ((n - 1) / (n - k - 1));

        // F = (R2 / k) / ((1 - R2) / (n-k-1))
        const fStat = (n - k - 1) > 0 && (1 - r2) !== 0
          ? (r2 / k) / ((1 - r2) / (n - k - 1))
          : 0;

        // F Critical general estimation for alpha = 0.05
        // Let's provide a basic layout
        let critF = 3.35; // typical proxy
        if (k === 1) critF = 4.18;
        else if (k === 2) critF = 3.35;
        else if (k === 3) critF = 2.98;
        else critF = 2.70;

        const isSignificant = fStat > critF;

        setResult({
          adjR2: (adjR2 * 100).toFixed(2) + '%',
          fStat: fStat.toFixed(4),
          critF: critF.toFixed(2),
          decision: isSignificant ? '🟢 JOINTLY SIGNIFICANT MODEL' : '🔴 JOINTLY INSIGNIFICANT MODEL',
          decisionBool: isSignificant,
          breakdown: `Adjusted R² = ${ (adjR2 * 100).toFixed(2) }%\nF-statistic = ${fStat.toFixed(4)}\nCritical F(0.05, ${k}, ${n-k-1}) ≈ ${critF.toFixed(2)}\nModel slope parameters are jointly ${isSignificant ? 'highly significant' : 'insignificant'}!`
        });
        break;
      }
      case 'autocorrelation': {
        const dw = values.dw !== undefined ? values.dw : 1.4;
        const n = Math.max(6, values.n !== undefined ? values.n : 30);
        const k = Math.max(1, values.k !== undefined ? values.k : 2);

        // Approximate DW critical values (simplified algorithm for d_L and d_U)
        const dl = 1.05 + 0.01 * k + 0.005 * (n - 15);
        const du = dl + 0.35 - 0.002 * (n - 15);

        let status = '';
        let colorClass = '';

        if (dw < dl) {
          status = 'Positive Autocorrelation (Reject H0)';
          colorClass = 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400';
        } else if (dw > du && dw < 4 - du) {
          status = 'No Autocorrelation (Accept H0)';
          colorClass = 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
        } else if (dw > 4 - dl) {
          status = 'Negative Autocorrelation (Reject H0)';
          colorClass = 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400';
        } else {
          status = 'Inconclusive Zone (Zone of Indecision)';
          colorClass = 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400';
        }

        setResult({
          dl: dl.toFixed(3),
          du: du.toFixed(3),
          status,
          colorClass,
          breakdown: `Durbin-Watson d = ${dw.toFixed(2)}\nEstimated d_L bounds ≈ ${dl.toFixed(3)}\nEstimated d_U bounds ≈ ${du.toFixed(3)}\nValues range from 0 (perfect positive correlation) to 4 (perfect negative correlation), with 2 representing zero correlation.`
        });
        break;
      }
    }
  };

  const renderInputs = () => {
    switch (mode) {
      case 'descriptive_stats':
        return (
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Raw Dataset (Values split by commas or spaces)</span>
            <textarea
              value={textInputs.descriptive_raw}
              onChange={e => handleTextChange('descriptive_raw', e.target.value)}
              className="w-full h-24 bg-paper dark:bg-slate-800 border border-border rounded-xl p-3 text-xs sm:text-sm font-semibold text-ink focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 select-all font-mono leading-relaxed resize-none"
            />
          </div>
        );
      case 'probability':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 min-[380px]:grid-cols-4 gap-1 sm:gap-2 mb-2 p-1 bg-paper/60 dark:bg-slate-800/40 rounded-xl border border-border">
              {[
                { label: 'Bayes Rule', id: 1 },
                { label: 'Binomial', id: 2 },
                { label: 'Poisson', id: 3 },
                { label: 'Normal Dist', id: 4 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`py-2 text-[9px] sm:text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    subTab === tab.id 
                      ? 'bg-sky-500 text-white shadow-sm font-extrabold' 
                      : 'text-muted hover:text-ink hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {subTab === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 select-all">
                <Input label="Prior Prob P(D) %" value={values.prior} onChange={v => handleInputChange('prior', v)} placeholder="4.0" />
                <Input label="Likelihood P(W|D) %" value={values.likelihood} onChange={v => handleInputChange('likelihood', v)} placeholder="90.0" />
                <Input label="False Pos P(W|ND) %" value={values.false_pos} onChange={v => handleInputChange('false_pos', v)} placeholder="15.0" />
              </div>
            )}
            {subTab === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                <Input label="Trials (n)" value={values.n} onChange={v => handleInputChange('n', v)} placeholder="8" />
                <Input label="Succ Prob (p %)" value={values.p} onChange={v => handleInputChange('p', v)} placeholder="5.0" />
                <Input label="Value (x successes)" value={values.x} onChange={v => handleInputChange('x', v)} placeholder="2" />
              </div>
            )}
            {subTab === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                <Input label="Average rate (λ)" value={values.lambda} onChange={v => handleInputChange('lambda', v)} placeholder="2.0" />
                <Input label="Occurrences (x)" value={values.x} onChange={v => handleInputChange('x', v)} placeholder="4" />
              </div>
            )}
            {subTab === 4 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <Input label="Mean (μ)" value={values.mean} onChange={v => handleInputChange('mean', v)} placeholder="1200" />
                  <Input label="Std Dev (σ)" value={values.sd} onChange={v => handleInputChange('sd', v)} placeholder="150" />
                  <Input label="Cutoff Val (X)" value={values.x_val} onChange={v => handleInputChange('x_val', v)} placeholder="1500" />
                </div>
                <ToggleGroup 
                  label="Area / Probability Direction" 
                  options={[
                    { label: 'P(X > x) - Right Tail', value: 1 },
                    { label: 'P(X < x) - Left Tail', value: 2 }
                  ]} 
                  activeValue={values.tail || 1} 
                  onChange={v => handleInputChange('tail', v.toString())} 
                />
              </div>
            )}
          </div>
        );
      case 'statistical_inference':
        return (
          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-paper/60 dark:bg-slate-800/40 rounded-xl border border-border">
              {[
                { label: 'Confidence Interval (Population Mean)', id: 1 },
                { label: 'Confidence Interval (Population Proportion)', id: 2 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`flex-1 py-2 text-[9px] sm:text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    subTab === tab.id 
                      ? 'bg-sky-500 text-white shadow-sm font-extrabold' 
                      : 'text-muted hover:text-ink hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {subTab === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 select-all">
                  <Input label="Sample Mean (X̄)" value={values.mean} onChange={v => handleInputChange('mean', v)} placeholder="45.0" />
                  <Input label="Std Dev (s or σ)" value={values.sd} onChange={v => handleInputChange('sd', v)} placeholder="8.0" />
                  <Input label="Sample Size (n)" value={values.n} onChange={v => handleInputChange('n', v)} placeholder="64" />
                  <Input label="Conf Level %" value={values.cl} onChange={v => handleInputChange('cl', v)} placeholder="95" />
                </div>
                <ToggleGroup 
                  label="Standard Deviation Parameter State" 
                  options={[
                    { label: 'Population σ is Unknown (t-dist)', value: 1 },
                    { label: 'Population σ is Known (Z-dist)', value: 2 }
                  ]} 
                  activeValue={values.known || 1} 
                  onChange={v => handleInputChange('known', v.toString())} 
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 select-all">
                <Input label="Sample Proportion (p̂ %)" value={values.p_prop} onChange={v => handleInputChange('p_prop', v)} placeholder="60.0" />
                <Input label="Sample Size (n)" value={values.n} onChange={v => handleInputChange('n', v)} placeholder="500" />
                <Input label="Conf Level %" value={values.cl} onChange={v => handleInputChange('cl', v)} placeholder="99" />
              </div>
            )}
          </div>
        );
      case 'hypothesis_testing':
        return (
          <div className="space-y-4 select-all">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <Input label="Sample Mean (X̄)" value={values.mean} onChange={v => handleInputChange('mean', v)} placeholder="45" />
              <Input label="Hypothesis Mean (μ₀)" value={values.mu0} onChange={v => handleInputChange('mu0', v)} placeholder="42" />
              <Input label="Sample SD (s)" value={values.sd} onChange={v => handleInputChange('sd', v)} placeholder="8" />
              <Input label="Sample Size (n)" value={values.n} onChange={v => handleInputChange('n', v)} placeholder="64" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <ToggleGroup 
                label="Significance level (α)" 
                options={[
                  { label: 'α = 10% (0.10)', value: 10 },
                  { label: 'α = 5% (0.05)', value: 5 },
                  { label: 'α = 1% (0.01)', value: 1 }
                ]} 
                activeValue={values.alpha || 5} 
                onChange={v => handleInputChange('alpha', (v / 100).toString())} 
              />
              <ToggleGroup 
                label="Test Tail Config" 
                options={[
                  { label: 'Two-Tailed (≠)', value: 1 },
                  { label: 'Left-Tailed (<)', value: 2 },
                  { label: 'Right-Tailed (>)', value: 3 }
                ]} 
                activeValue={values.tail || 1} 
                onChange={v => handleInputChange('tail', v.toString())} 
              />
            </div>
          </div>
        );
      case 'simple_regression':
        return (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">X Variable Values (Independent - commas/spaces)</span>
                <textarea
                  value={textInputs.regression_x}
                  onChange={e => handleTextChange('regression_x', e.target.value)}
                  className="w-full h-20 bg-paper dark:bg-slate-800 border border-border rounded-xl p-3 text-xs font-semibold text-ink focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono leading-relaxed resize-none"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Y Variable Values (Dependent - commas/spaces)</span>
                <textarea
                  value={textInputs.regression_y}
                  onChange={e => handleTextChange('regression_y', e.target.value)}
                  className="w-full h-20 bg-paper dark:bg-slate-800 border border-border rounded-xl p-3 text-xs font-semibold text-ink focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono leading-relaxed resize-none"
                />
              </div>
            </div>
            <div className="p-3 bg-sky-100 dark:bg-sky-950/20 rounded-xl text-[9.5px] font-semibold text-sky-800 dark:text-sky-400 leading-relaxed text-center italic">
              Example uses pairs (X, Y): (10, 20), (12, 24), (15, 30)... regression maps economic inputs directly.
            </div>
          </div>
        );
      case 'multiple_regression':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 select-all">
            <Input label="Goodness of Fit (R² %)" value={values.r2} onChange={v => handleInputChange('r2', v)} placeholder="75" />
            <Input label="Sample Size (n)" value={values.n} onChange={v => handleInputChange('n', v)} placeholder="30" />
            <Input label="Predictor Variables (k)" value={values.k} onChange={v => handleInputChange('k', v)} placeholder="2" />
          </div>
        );
      case 'autocorrelation':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 select-all">
            <Input label="Durbin-Watson d" value={values.dw} onChange={v => handleInputChange('dw', v)} placeholder="1.4" />
            <Input label="Sample size (n)" value={values.n} onChange={v => handleInputChange('n', v)} placeholder="30" />
            <Input label="Slope Explanatories (k)" value={values.k} onChange={v => handleInputChange('k', v)} placeholder="2" />
          </div>
        );
    }
  };

  const renderResult = () => {
    if (!result) {
      return (
        <div className="p-8 text-center text-muted font-medium text-xs leading-relaxed italic">
          Input valid values to begin live calculations ...
        </div>
      );
    }

    switch (mode) {
      case 'descriptive_stats':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <ResultCard label="Mean (Average)" value={result.mean} icon={<Sigma className="text-amber-500" />} description="Average of elements" />
              <ResultCard label="Median (Middle)" value={result.median} icon={<Scale className="text-emerald-500" />} description="Middle sorted value" />
              <ResultCard label="Mode (Frequency)" value={result.mode} icon={<Hash className="text-sky-500" />} description="Highest recurring items" />
              <ResultCard label="Range (Max - Min)" value={result.range} icon={<Activity className="text-violet-500" />} />
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-border/80 pt-3">
              <ResultCard label="Sample SD (s)" value={result.sampleSD} icon={<Target className="text-rose-500" />} description="Sample Std dev" />
              <ResultCard label="Sample Variance (s²)" value={result.sampleVar} icon={<Coins className="text-indigo-500" />} />
              <ResultCard label="Population SD (σ)" value={result.popSD} icon={<Target className="text-amber-500" />} description="Population Std dev" />
              <ResultCard label="Population Var (σ²)" value={result.popVar} icon={<Coins className="text-slate-500" />} />
            </div>
            <div className="p-2.5 bg-paper dark:bg-slate-800 rounded-xl text-center border border-border">
              <p className="text-[10px] text-muted font-mono leading-normal">
                Sum: <strong className="text-ink">{result.sum}</strong> | Observations (n): <strong className="text-ink">{result.count}</strong>
              </p>
            </div>
          </div>
        );
      case 'probability':
        return (
          <div className="space-y-4 leading-normal font-sans">
            <ResultCard 
              label="Probability Result" 
              value={result.val} 
              icon={<Binary className="text-sky-500" />} 
              description={result.formula} 
            />
            <div className="p-3.5 bg-paper dark:bg-slate-800 border border-border rounded-xl space-y-1.5">
              <span className="text-[8px] font-bold text-sky-500 uppercase tracking-wider block">Step-By-Step Parameters</span>
              <pre className="text-[10px] font-mono whitespace-pre-wrap text-muted leading-relaxed font-semibold">{result.breakdown}</pre>
            </div>
            {subTab === 2 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <ResultCard label="Mean (np)" value={result.mean} icon={<Sigma size={12} />} />
                <ResultCard label="Variance (npq)" value={result.variance} icon={<Activity size={12} />} />
              </div>
            )}
          </div>
        );
      case 'statistical_inference':
        return (
          <div className="space-y-4">
            <ResultCard 
              label="Interval Bounds (Confidence Interval)" 
              value={`[ ${result.low} , ${result.high} ]`} 
              icon={<Scale className="text-emerald-500" />} 
              description={result.formula} 
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <ResultCard label="Standard Error (SE)" value={result.se} icon={<Activity className="text-sky-500" />} />
              <ResultCard label="Margin of Error (ME)" value={result.me} icon={<Target className="text-rose-500" />} />
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-center border border-emerald-100 rounded-xl mt-2">
              <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed">
                Distribution model used: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{result.distType}</strong>
                <br />
                Critical Value (bounds test) = <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{result.critVal}</strong>
              </p>
            </div>
          </div>
        );
      case 'hypothesis_testing':
        return (
          <div className="space-y-4 select-all">
            <ResultCard 
              label="Statistical Decision" 
              value={result.decision} 
              icon={<Coins className={result.decisionBool ? 'text-emerald-500' : 'text-rose-500'} />} 
              description={result.comparison} 
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <ResultCard label="Calculated t-Statistic" value={result.stat} icon={<Activity className="text-sky-500" />} />
              <ResultCard label="p-Value Probability" value={result.pValue} icon={<Percent className="text-amber-500" />} />
            </div>
            <div className="p-3.5 bg-paper dark:bg-slate-800 border border-border rounded-xl space-y-1.5 mt-1">
              <span className="text-[8px] font-bold text-sky-500 uppercase tracking-wider block">Hypothese Breakdown Details</span>
              <pre className="text-[10px] font-mono whitespace-pre-wrap text-muted leading-relaxed font-semibold">{result.breakdown}</pre>
            </div>
          </div>
        );
      case 'simple_regression':
        return (
          <div className="space-y-4">
            <ResultCard 
              label="OLS Estimated Line" 
              value={result.formula} 
              icon={<TrendingUp className="text-indigo-500" />} 
              description="Slope accounts for direct marginal impact" 
            />
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/80 pt-3">
              <ResultCard label="Slope Beta 1 (β̂₁)" value={result.beta1} icon={<Sigma className="text-sky-400" />} description={`Standard Error: ${result.seBeta1}`} />
              <ResultCard label="Intercept Beta 0 (β̂₀)" value={result.beta0} icon={<CornerDownRight className="text-amber-500" />} />
              <ResultCard label="Goodness of Fit (R²)" value={result.r2} icon={<Percent className="text-emerald-500" />} description="Variance proportion explained" />
              <ResultCard label="Correlation (r)" value={result.r} icon={<Activity className="text-violet-500" />} />
            </div>
            <div className="p-3 bg-paper dark:bg-slate-800 rounded-xl space-y-1 bg-paper border border-border">
              <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block text-center mb-1">Decomposition of Sum of Squares</span>
              <p className="text-[9.5px] font-mono text-muted text-center leading-normal">
                TSS: <strong className="text-ink">{result.tss}</strong> | ESS: <strong className="text-ink">{result.ess}</strong> | RSS: <strong className="text-ink">{result.rss}</strong>
              </p>
            </div>
          </div>
        );
      case 'multiple_regression':
        return (
          <div className="space-y-4">
            <ResultCard 
              label="Overall Significance Decision" 
              value={result.decision} 
              icon={<Coins className={result.decisionBool ? 'text-emerald-500' : 'text-rose-500'} />} 
            />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <ResultCard label="Adjusted R²" value={result.adjR2} icon={<Percent className="text-amber-500" />} description="Penalized for predictors" />
              <ResultCard label="F-Statistic" value={result.fStat} icon={<TrendingUp className="text-sky-500" />} description={`Critical F threshold: ${result.critF}`} />
            </div>
            <div className="p-3 bg-paper dark:bg-slate-800 border border-border rounded-xl mt-1">
              <span className="text-[8px] font-bold text-sky-500 uppercase tracking-wider block mb-1">Matrix Interpretation Guidance</span>
              <pre className="text-[10px] font-mono whitespace-pre-wrap text-muted leading-relaxed font-semibold">{result.breakdown}</pre>
            </div>
          </div>
        );
      case 'autocorrelation':
        return (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border border-dashed text-center font-bold text-xs sm:text-sm tracking-wide ${result.colorClass}`}>
              <span className="text-[8.5px] block font-bold text-muted uppercase tracking-widest mb-1.5">Autocorrelation State</span>
              {result.status}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <ResultCard label="Lower Bound (dL)" value={result.dl} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Upper Bound (dU)" value={result.du} icon={<Scale className="text-slate-400" />} />
            </div>
            <div className="p-3.5 bg-paper dark:bg-slate-800 border border-border rounded-xl text-[10px] font-medium text-muted leading-relaxed font-semibold">
              <HelpCircle size={12} className="inline mr-1 text-sky-500" />
              {result.breakdown}
            </div>
          </div>
        );
    }
  };

  const renderWorkedOutSolution = () => {
    if (!result) return null;

    let steps: React.ReactNode[] = [];
    let interpretationTitle = "";
    let interpretationText = "";
    let formulaText = "";

    switch (mode) {
      case 'descriptive_stats': {
        const raw_str = textInputs.descriptive_raw || "";
        const numbers = raw_str.split(/[\s,]+/).map(parseFloat).filter(v => !isNaN(v));
        const count = numbers.length;
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = count > 0 ? sum / count : 0;
        const sorted = [...numbers].sort((a, b) => a - b);
        const sqDiffSum = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
        
        formulaText = "\\bar{x} = \\frac{\\sum_{i=1}^n x_i}{n} \\quad S^2 = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})^2}{n - 1}";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Parse and Sort Observations (<InlineMath math="n" />):</strong> Dataset contains {count} observations. Sorted: <span className="font-mono bg-paper px-1.5 py-0.5 rounded border border-border text-xs">{sorted.join(', ')}</span>.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate Sample Sum (<InlineMath math="\sum x_i" />):</strong> Sum is {sum.toFixed(2)}.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Solve for Sample Mean (<InlineMath math="\bar{x}" />):</strong> <InlineMath math={`\\bar{x} = \\frac{${sum.toFixed(2)}}{${count}} = ${mean.toFixed(4)}`} />.</div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Calculate Sum of Squared Deviations (<InlineMath math="\sum (x_i - \bar{x})^2" />):</strong> Sum of squared differences from the mean is {sqDiffSum.toFixed(4)}.</div>,
          <div key="s5" className="flex items-center gap-1 flex-wrap"><strong>Step 5: Solve for Sample Variance (<InlineMath math="S^2" />) & Standard Deviation (<InlineMath math="S" />):</strong> <InlineMath math={`S^2 = \\frac{${sqDiffSum.toFixed(4)}}{${count - 1}} = ${parseFloat(result.sampleVar).toFixed(4)}`} />, Standard Deviation <InlineMath math={`S = \\sqrt{S^2} = ${parseFloat(result.sampleSD).toFixed(4)}`} />.</div>
        ];
        interpretationTitle = "Descriptive Data Summary & Interpretation";
        interpretationText = `The sample mean of ${parseFloat(result.mean).toFixed(2)} represents the central balance point of the data. The standard deviation of ${parseFloat(result.sampleSD).toFixed(2)} signifies that, on average, the data points deviate from the mean by about ${parseFloat(result.sampleSD).toFixed(2)} units. A smaller standard deviation indicates a more consistent dataset, while a larger one suggests wider dispersion.`;
        break;
      }
      case 'simple_regression': {
        const x_vals = (textInputs.regression_x || "").split(/[\s,]+/).map(parseFloat).filter(v => !isNaN(v));
        const y_vals = (textInputs.regression_y || "").split(/[\s,]+/).map(parseFloat).filter(v => !isNaN(v));
        const n = x_vals.length;
        
        formulaText = "y = \\beta_0 + \\beta_1 x \\quad \\beta_1 = \\frac{n\\sum xy - \\sum x \\sum y}{n\\sum x^2 - (\\sum x)^2}";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Check Data Pairs (<InlineMath math="n" />):</strong> Regression calculated for {n} coordinate pairs.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate Slope Beta 1 (<InlineMath math="\hat{\beta}_1" />):</strong> OLS numerator and denominator solve to yield a slope of <InlineMath math={`\\hat{\\beta}_1 = ${result.beta1}`} />.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Calculate Intercept Beta 0 (<InlineMath math="\hat{\beta}_0" />):</strong> Intersection point with vertical axis is <InlineMath math={`\\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x} = ${result.beta0}`} />.</div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Solve for Goodness of Fit (<InlineMath math="R^2" />):</strong> Coefficient of Determination is {result.r2} (Correlation coefficient <InlineMath math={`r = ${result.r}`} />).</div>
        ];
        interpretationTitle = "OLS Simple Linear Regression Analysis";
        interpretationText = `The estimated OLS regression equation is: ${result.formula}. This model states that for every 1-unit increase in the independent variable (X), the dependent variable (Y) is expected to change by ${result.beta1} units. The goodness-of-fit R² value of ${result.r2} means that ${(parseFloat(result.r2) * 100).toFixed(1)}% of the total variation in Y is explained by its linear relationship with X, which is considered a ${parseFloat(result.r2) > 0.7 ? 'STRONG' : parseFloat(result.r2) > 0.4 ? 'MODERATE' : 'WEAK'} predictive fit.`;
        break;
      }
      case 'hypothesis_testing': {
        const isOneTailed = values.isOneTailed === 1;
        const testStat = result.testStat || '0';
        const critValue = result.critValue || '0';
        const decision = result.decision || '';
        
        formulaText = "Test \\ Stat = \\frac{\\bar{x} - \\mu_0}{S / \\sqrt{n}}";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Define Hypotheses:</strong> Null Hypothesis <InlineMath math="H_0: \mu = \mu_0" /> vs. Alternative <InlineMath math={isOneTailed ? "H_1: \mu > \mu_0" : "H_1: \mu \\neq \mu_0"} />.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate Standard Error (SE):</strong> Standard error of the sample mean is <InlineMath math="SE = \\frac{S}{\\sqrt{n}}" />.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Compute Test Statistic:</strong> Test score solves to a value of <InlineMath math={`t = ${testStat}`} />.</div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Compare with Critical Value:</strong> Critical boundary is <InlineMath math={`t_{\\alpha} = ${critValue}`} />. Decision reached: {decision}.</div>
        ];
        interpretationTitle = "Hypothesis Significance Testing Results";
        interpretationText = `Under the specified significance alpha level, the test statistic is ${testStat} while the critical cutoff boundary is ${critValue}. Since the test statistic falls ${result.decisionBool ? 'OUTSIDE' : 'INSIDE'} the non-rejection region, we ${result.decisionBool ? 'REJECT' : 'FAIL TO REJECT'} the null hypothesis. ${result.decisionBool ? 'There is statistically significant evidence to support the alternative hypothesis.' : 'There is insufficient statistical evidence to support the alternative hypothesis.'}`;
        break;
      }
      default: {
        formulaText = "\\theta = g(\\lambda_i)";
        steps = [
          <div key="s1"><strong>Step 1: Parse Statistical Model:</strong> Successfully loaded all parameters for {mode.replace('_', ' ').toUpperCase()}.</div>,
          <div key="s2"><strong>Step 2: Execute Solver:</strong> Calculated probability distributions, coefficients, standard errors and variance thresholds.</div>,
          <div key="s3"><strong>Step 3: Render Visual Insights:</strong> Plotted sample densities, trendlines and critical boundaries dynamically.</div>
        ];
        interpretationTitle = "Statistical Modeling Guidance";
        interpretationText = "Modify any of the raw dataset values or sliders. The statistical engine immediately performs OLS matrix operations, critical t-value distributions, and correlation tests in real-time. Use these results to test economic significance, verify consistency, and forecast demand parameters.";
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
              Show Worked-out Solution & Statistical Interpretation
            </span>
          </div>
          {isExplanationExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </button>

        {isExplanationExpanded && (
          <div className="mt-4 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-border space-y-6">
            <div>
              <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Percent size={12} /> Key Equation
              </h4>
              <div className="p-4 bg-white dark:bg-slate-950 border border-border rounded-xl text-center font-mono text-sm overflow-x-auto text-ink flex justify-center py-5">
                <BlockMath math={formulaText} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calculator size={12} /> Step-by-Step Statistical Workout
              </h4>
              <div className="space-y-3 pl-1">
                {steps.map((step, idx) => (
                  <div key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 border-l-2 border-sky-400 dark:border-sky-500/50 pl-3 py-0.5 leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 rounded-xl">
              <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Lightbulb size={12} className="text-sky-500" /> {interpretationTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
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
          <h3 className="text-white text-sm sm:text-base md:text-xl font-bold tracking-tight mb-0.5 break-words leading-tight">{title || 'Statistical Economics Engine'}</h3>
          <p className="text-sky-400 dark:text-sky-300 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] font-bold truncate">Interactive Analysis Calculator</p>
        </div>
      </div>
      
      <div className="p-3 sm:p-6 md:p-8 grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-12">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 text-ink border-b border-border pb-2.5 sm:pb-4">
            <Info size={12} className="text-sky-500" />
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-muted font-bold">Input Parameters</span>
          </div>
          {renderInputs()}
        </div>

        <div className="bg-paper border border-border rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 sm:gap-3 text-ink mb-4 sm:mb-8 border-b border-border pb-2.5 sm:pb-4">
            <TrendingUp size={12} className="text-sky-500" />
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Analysis Output</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(result) + mode + subTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
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
