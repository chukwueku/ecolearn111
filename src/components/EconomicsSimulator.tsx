import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Factory, Zap, Info, Percent, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SimulatorMode = 
  | 'utility' 
  | 'elasticity' 
  | 'equilibrium' 
  | 'production' 
  | 'inflation'
  | 'future_value'
  | 'capital_budgeting'
  | 'bond_valuation'
  | 'capm';

interface SimulatorProps {
  mode: SimulatorMode;
  title?: string;
  initialValues?: Record<string, number>;
}

const Input = ({ label, value, onChange }: { label: string, value: number | undefined, onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <input
        type="number"
        value={value !== undefined && !isNaN(value) ? value : ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-paper dark:bg-slate-800 border border-border rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold text-ink transition-all placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 min-w-0"
        placeholder="0.00"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted/60 group-focus-within:text-sky-500 transition-colors pointer-events-none">
        <Calculator size={12} />
      </div>
    </div>
  </div>
);

const ResultCard = ({ label, value, icon, description }: { label: string, value: string | number, icon: React.ReactNode, description?: string }) => (
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

const ToggleGroup = ({ label, options, activeValue, onChange }: { label: string, options: { label: string, value: number }[], activeValue: number, onChange: (v: number) => void }) => {
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

export const EconomicsSimulator: React.FC<SimulatorProps> = ({ mode, title, initialValues }) => {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    if (mode === 'future_value') {
      defaults.pv = 1000;
      defaults.r = 8;
      defaults.n = 5;
      defaults.m = 1;
    } else if (mode === 'capital_budgeting') {
      defaults.outlay = 1000;
      defaults.rate = 10;
      defaults.cf1 = 300;
      defaults.cf2 = 400;
      defaults.cf3 = 500;
      defaults.cf4 = 600;
      defaults.cf5 = 700;
      defaults.tab = 1;
    } else if (mode === 'bond_valuation') {
      defaults.face = 1000;
      defaults.coupon = 6;
      defaults.years = 10;
      defaults.ytm = 5;
      defaults.m = 1;
    } else if (mode === 'capm') {
      defaults.rf = 4;
      defaults.beta = 1.2;
      defaults.optType = 1;
      defaults.premiumOrReturn = 10; // (Rm = 10% by default)
    }
    return { ...defaults, ...initialValues };
  });
  
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (key: string, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    setValues(prev => ({ ...prev, [key]: numVal }));
  };

  const handleInputChangeDirect = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
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
      case 'future_value': {
        const pv = values.pv !== undefined ? values.pv : 1000;
        const r = values.r !== undefined ? values.r : 8;
        const n = values.n !== undefined ? values.n : 5;
        const m = values.m !== undefined ? values.m : 1;
        
        const i = r / 100;
        let fv = 0;
        if (m === -1) {
          // Continuous compounding: FV = PV * e^(rn)
          fv = pv * Math.exp(i * n);
        } else {
          // Discrete compounding: FV = PV * (1 + r/m)^(nm)
          fv = pv * Math.pow(1 + i / m, n * m);
        }
        
        const simpleFv = pv * (1 + i * n);
        const compoundInterest = fv - pv;
        const simpleInterest = simpleFv - pv;
        const gain = compoundInterest - simpleInterest;
        
        setResult({
          fv: fv.toFixed(2),
          simpleFv: simpleFv.toFixed(2),
          interest: compoundInterest.toFixed(2),
          simpleInterest: simpleInterest.toFixed(2),
          gain: gain.toFixed(2)
        });
        break;
      }
      case 'capital_budgeting': {
        const outlay = values.outlay !== undefined ? values.outlay : 1000;
        const rate = values.rate !== undefined ? values.rate : 10;
        const k = rate / 100;
        
        const cf1 = values.cf1 !== undefined ? values.cf1 : 300;
        const cf2 = values.cf2 !== undefined ? values.cf2 : 400;
        const cf3 = values.cf3 !== undefined ? values.cf3 : 500;
        const cf4 = values.cf4 !== undefined ? values.cf4 : 600;
        const cf5 = values.cf5 !== undefined ? values.cf5 : 700;
        
        const flows = [cf1, cf2, cf3, cf4, cf5];
        
        // Present value of cash inflows
        let pvInflows = 0;
        for (let t = 0; t < flows.length; t++) {
          pvInflows += flows[t] / Math.pow(1 + k, t + 1);
        }
        
        const npv = pvInflows - outlay;
        const pi = outlay !== 0 ? pvInflows / outlay : 0;
        
        // Payback Period (standard)
        let cumulative = 0;
        let payback: string | number = 'Never';
        let recovered = false;
        
        if (outlay === 0) {
          payback = '0.00 Years';
          recovered = true;
        } else {
          for (let t = 0; t < flows.length; t++) {
            const prevCumulative = cumulative;
            cumulative += flows[t];
            if (cumulative >= outlay && !recovered) {
              const fraction = (outlay - prevCumulative) / flows[t];
              payback = (t + fraction).toFixed(2) + ' Years';
              recovered = true;
            }
          }
          if (!recovered) {
            payback = 'Outlay not recovered';
          }
        }
        
        // IRR Bisection solver
        let irr = 0;
        let foundIrr = false;
        let low = -0.99;
        let high = 10.0;
        
        const getNPVForRate = (discRate: number) => {
          let testNpv = -outlay;
          for (let t = 0; t < flows.length; t++) {
            testNpv += flows[t] / Math.pow(1 + discRate, t + 1);
          }
          return testNpv;
        };
        
        const npvLow = getNPVForRate(low);
        const npvHigh = getNPVForRate(high);
        
        if (npvLow * npvHigh < 0) {
          for (let i = 0; i < 100; i++) {
            const mid = (low + high) / 2;
            const npvMid = getNPVForRate(mid);
            if (Math.abs(npvMid) < 1e-6) {
              irr = mid;
              foundIrr = true;
              break;
            }
            if (getNPVForRate(low) * npvMid < 0) {
              high = mid;
            } else {
              low = mid;
            }
          }
          if (!foundIrr) {
            irr = (low + high) / 2;
            foundIrr = true;
          }
        }
        
        // MIRR Calculation
        // Step 1: Compound cash inflows to Year 5 at cost of capital (k)
        let terminalInflows = 0;
        for (let t = 0; t < flows.length; t++) {
          terminalInflows += flows[t] * Math.pow(1 + k, flows.length - (t + 1));
        }
        let mirr = 0;
        if (outlay > 0 && terminalInflows > 0) {
          mirr = Math.pow(terminalInflows / outlay, 1 / flows.length) - 1;
        }
        
        setResult({
          npv: npv.toFixed(2),
          pi: pi.toFixed(2),
          payback: payback,
          irr: foundIrr ? (irr * 100).toFixed(2) + '%' : 'No single real IRR',
          mirr: outlay > 0 && terminalInflows > 0 ? (mirr * 100).toFixed(2) + '%' : 'N/A'
        });
        break;
      }
      case 'bond_valuation': {
        const face = values.face !== undefined ? values.face : 1000;
        const coupon = values.coupon !== undefined ? values.coupon : 6;
        const years = values.years !== undefined ? values.years : 10;
        const ytm = values.ytm !== undefined ? values.ytm : 5;
        const m = values.m !== undefined ? values.m : 1; // 1 = Annual, 2 = Semiannual
        
        const annualCouponPayment = face * (coupon / 100);
        const periodPayment = annualCouponPayment / m;
        const periods = years * m;
        const rPerPeriod = (ytm / 100) / m;
        
        let price = 0;
        if (rPerPeriod === 0) {
          price = periodPayment * periods + face;
        } else {
          price = periodPayment * ((1 - Math.pow(1 + rPerPeriod, -periods)) / rPerPeriod) + face * Math.pow(1 + rPerPeriod, -periods);
        }
        
        const currentYield = price !== 0 ? (annualCouponPayment / price) * 100 : 0;
        const capGainYield = ytm - currentYield;
        let pricingStatus = 'Par Value';
        if (price > face) pricingStatus = 'Premium';
        else if (price < face) pricingStatus = 'Discount';
        
        setResult({
          price: price.toFixed(2),
          currentYield: currentYield.toFixed(2) + '%',
          capGainYield: capGainYield.toFixed(2) + '%',
          pricingStatus,
          annualPayment: annualCouponPayment.toFixed(2)
        });
        break;
      }
      case 'capm': {
        const rf = values.rf !== undefined ? values.rf : 4;
        const beta = values.beta !== undefined ? values.beta : 1.2;
        const optType = values.optType !== undefined ? values.optType : 1; // 1 = Rm, 2 = MRP
        const premiumOrReturn = values.premiumOrReturn !== undefined ? values.premiumOrReturn : 10;
        
        let mr = 0;
        let mrp = 0;
        if (optType === 1) {
          mr = premiumOrReturn;
          mrp = mr - rf;
        } else {
          mrp = premiumOrReturn;
          mr = rf + mrp;
        }
        
        const expectedReturn = rf + beta * mrp;
        
        setResult({
          expectedReturn: expectedReturn.toFixed(2) + '%',
          mr: mr.toFixed(2) + '%',
          mrp: mrp.toFixed(2) + '%'
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
      case 'inflation':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <Input label="Base Year Price (P₁)" value={values.p1} onChange={v => handleInputChange('p1', v)} />
            <Input label="Current Year Price (P₂)" value={values.p2} onChange={v => handleInputChange('p2', v)} />
          </div>
        );
      case 'future_value':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <Input label="Present Value" value={values.pv} onChange={v => handleInputChange('pv', v)} />
              <Input label="Annual Rate (%)" value={values.r} onChange={v => handleInputChange('r', v)} />
              <Input label="Years (n)" value={values.n} onChange={v => handleInputChange('n', v)} />
            </div>
            <ToggleGroup 
              label="Compounding Period" 
              options={[
                { label: 'Annual (m=1)', value: 1 },
                { label: 'Semi-Annual (m=2)', value: 2 },
                { label: 'Quarterly (m=4)', value: 4 },
                { label: 'Monthly (m=12)', value: 12 },
                { label: 'Continuous', value: -1 }
              ]} 
              activeValue={values.m || 1} 
              onChange={v => handleInputChangeDirect('m', v)} 
            />
          </div>
        );
      case 'capital_budgeting':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Initial Outlay (CF₀)" value={values.outlay} onChange={v => handleInputChange('outlay', v)} />
              <Input label="Required Rate (k %)" value={values.rate} onChange={v => handleInputChange('rate', v)} />
            </div>
            <div className="border border-border p-3 rounded-lg bg-paper/30 dark:bg-slate-800/20">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Future Cash Flows (Years 1 to 5)</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                <Input label="Yr 1" value={values.cf1} onChange={v => handleInputChange('cf1', v)} />
                <Input label="Yr 2" value={values.cf2} onChange={v => handleInputChange('cf2', v)} />
                <Input label="Yr 3" value={values.cf3} onChange={v => handleInputChange('cf3', v)} />
                <Input label="Yr 4" value={values.cf4} onChange={v => handleInputChange('cf4', v)} />
                <Input label="Yr 5" value={values.cf5} onChange={v => handleInputChange('cf5', v)} />
              </div>
            </div>
            <ToggleGroup 
              label="View Valuation Category" 
              options={[
                { label: 'NPV & IRR (Traditional)', value: 1 },
                { label: 'Alternative Decision Metrics', value: 2 }
              ]} 
              activeValue={values.tab || 1} 
              onChange={v => handleInputChangeDirect('tab', v)} 
            />
          </div>
        );
      case 'bond_valuation':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Face Value (Par)" value={values.face} onChange={v => handleInputChange('face', v)} />
              <Input label="Annual Coupon (C %)" value={values.coupon} onChange={v => handleInputChange('coupon', v)} />
              <Input label="Years to Maturity (n)" value={values.years} onChange={v => handleInputChange('years', v)} />
              <Input label="Discount Rate / YTM (% )" value={values.ytm} onChange={v => handleInputChange('ytm', v)} />
            </div>
            <ToggleGroup 
              label="Coupon Payment Frequency" 
              options={[
                { label: 'Annual Coupons', value: 1 },
                { label: 'Semiannual Coupons', value: 2 }
              ]} 
              activeValue={values.m || 1} 
              onChange={v => handleInputChangeDirect('m', v)} 
            />
          </div>
        );
      case 'capm':
        return (
          <div className="space-y-3.5">
            <ToggleGroup 
              label="Market Rate / Premium Input Type" 
              options={[
                { label: 'Market Expected Return (Rm)', value: 1 },
                { label: 'Market Risk Premium (MRP)', value: 2 }
              ]} 
              activeValue={values.optType || 1} 
              onChange={v => handleInputChangeDirect('optType', v)} 
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2">
              <Input label="Risk-Free Rate (Rf %)" value={values.rf} onChange={v => handleInputChange('rf', v)} />
              <Input label="Systematic Risk (Beta)" value={values.beta} onChange={v => handleInputChange('beta', v)} />
              <Input 
                label={values.optType === 2 ? 'Risk Prem (MRP %)' : 'Mkt Return (Rm %)'} 
                value={values.premiumOrReturn} 
                onChange={v => handleInputChange('premiumOrReturn', v)} 
              />
            </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ResultCard label="Equilibrium Price (P*)" value={`₦${result.p}`} icon={<Scale className="text-sky-500" />} />
            <ResultCard label="Equilibrium Qty (Q*)" value={result.q} icon={<Scale className="text-sky-500" />} />
          </div>
        );
      case 'production':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ResultCard label="Average Product (AP)" value={result.ap} icon={<Factory className="text-indigo-500" />} />
            <ResultCard label="Marginal Product (MP)" value={result.mp} icon={<Factory className="text-indigo-500" />} />
          </div>
        );
      case 'inflation':
        return <ResultCard label="Inflation Rate" value={`${result.rate}%`} icon={<TrendingUp className="text-rose-500" />} description="The percentage increase in the general price level." />;
      case 'future_value':
        return (
          <div className="space-y-4">
            <ResultCard label="Future Value (FV)" value={`₦${result.fv}`} icon={<Coins className="text-emerald-500" />} description={`Compound worth of capital at Year ${values.n || 5}.`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Interest Earned" value={`₦${result.interest}`} icon={<Percent className="text-indigo-500" />} />
              <ResultCard label="Simple Interest FV" value={`₦${result.simpleFv}`} icon={<Scale className="text-slate-400" />} description="Earnings on starting principal only." />
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-center border border-emerald-100 dark:border-emerald-900/30">
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed">
                Compounding earned you an additional <strong className="text-emerald-600 dark:text-emerald-400 font-bold">₦{result.gain}</strong> over simple interest!
              </p>
            </div>
          </div>
        );
      case 'capital_budgeting':
        const viewingAlternativeDecisionMetrics = values.tab === 2;
        return (
          <div className="space-y-4">
            {!viewingAlternativeDecisionMetrics ? (
              <>
                <ResultCard 
                  label="Net Present Value (NPV)" 
                  value={parseFloat(result.npv) >= 0 ? `+₦${result.npv}` : `-₦${Math.abs(parseFloat(result.npv)).toFixed(2)}`} 
                  icon={<Coins className={parseFloat(result.npv) >= 0 ? "text-emerald-500" : "text-rose-500"} />} 
                  description="Net wealth created/destroyed for shareholders." 
                />
                <ResultCard label="Internal Rate (IRR)" value={result.irr} icon={<TrendingUp className="text-sky-500" />} description="Discount rate resulting in zero NPV." />
                <div className={`p-3.5 rounded-2xl text-center font-bold text-xs uppercase tracking-widest border transition-all ${
                  parseFloat(result.npv) >= 0 
                    ? "bg-emerald-50 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 border-emerald-200" 
                    : "bg-rose-50 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400 border-rose-200"
                }`}>
                  Decision: {parseFloat(result.npv) >= 0 ? "🟢 ACCEPT PROJECT" : "🔴 REJECT PROJECT"}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ResultCard label="Profitability Index (PI)" value={result.pi} icon={<Percent className="text-amber-500" />} description="Ratio of PV of inflows to cost." />
                  <ResultCard label="MIRR (Compounded)" value={result.mirr} icon={<TrendingUp className="text-indigo-500" />} description="Modified rate assuming capital-cost reinvesting." />
                </div>
                <ResultCard label="Payback Horizon" value={result.payback} icon={<Scale className="text-slate-400" />} description="Time required to break-even on cost." />
                <p className="text-[10px] text-muted text-center italic mt-1 font-medium leading-relaxed">
                  Tip: PI is perfect under capital rationing. If PI &gt; 1, accept!
                </p>
              </>
            )}
          </div>
        );
      case 'bond_valuation':
        return (
          <div className="space-y-4">
            <ResultCard label="Intrinsic Bond Price" value={`₦${result.price}`} icon={<Coins className="text-indigo-500" />} description="Fair present value of coupons plus par at maturity." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Current Yield" value={result.currentYield} icon={<Percent className="text-sky-500" />} />
              <ResultCard label="Capital Gain Yield" value={result.capGainYield} icon={<TrendingUp className="text-amber-500" />} />
            </div>
            <div className="flex items-center justify-between p-3.5 bg-paper dark:bg-slate-800 rounded-2xl border border-border">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bond Trade State</span>
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${
                result.pricingStatus === 'Premium' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200' 
                  : result.pricingStatus === 'Discount'
                    ? 'bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border-rose-200'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {result.pricingStatus}
              </span>
            </div>
          </div>
        );
      case 'capm':
        return (
          <div className="space-y-4">
            <ResultCard label="Required Return (Re)" value={result.expectedReturn} icon={<TrendingUp className="text-indigo-500" />} description="The cost of equity required for this asset beta risk level." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Market Return (Rm)" value={result.mr} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Risk Premium (MRP)" value={result.mrp} icon={<Percent className="text-amber-500" />} />
            </div>
            <div className="p-3 rounded-2xl bg-paper dark:bg-slate-800 border border-border">
              <p className="text-[10px] text-muted leading-relaxed font-mono text-center">
                Re = Rf + Beta(Rm - Rf) = Rf + Beta(MRP)
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="my-0 bg-card rounded-xl sm:rounded-3xl border border-border shadow-md sm:shadow-xl overflow-hidden not-prose transition-colors duration-300 w-full max-w-full">
      <div className="bg-slate-900 dark:bg-sky-900/40 p-4 sm:p-6 md:p-8 flex items-center gap-3 sm:gap-6">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-sky-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-500/20">
          <Calculator size={16} className="sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white text-sm sm:text-base md:text-xl font-bold tracking-tight mb-0.5 break-words leading-tight">{title || 'Economics Simulator'}</h3>
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
