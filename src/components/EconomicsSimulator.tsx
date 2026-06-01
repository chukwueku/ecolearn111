import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Factory, Zap, Info, Percent, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StatsSimulator } from './StatsSimulator';

type SimulatorMode = 
  | 'utility' 
  | 'elasticity' 
  | 'equilibrium' 
  | 'production' 
  | 'inflation'
  | 'future_value'
  | 'capital_budgeting'
  | 'bond_valuation'
  | 'capm'
  | 'money_multiplier'
  | 'taylor_rule'
  | 'exchange_rate'
  | 'barter_pricing'
  | 'baumol_tobin'
  | 'descriptive_stats'
  | 'probability'
  | 'statistical_inference'
  | 'hypothesis_testing'
  | 'simple_regression'
  | 'multiple_regression'
  | 'autocorrelation';

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
  const statsModes = [
    'descriptive_stats',
    'probability',
    'statistical_inference',
    'hypothesis_testing',
    'simple_regression',
    'multiple_regression',
    'autocorrelation'
  ];

  if (statsModes.includes(mode)) {
    return <StatsSimulator mode={mode as any} title={title} initialValues={initialValues} />;
  }

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
    } else if (mode === 'money_multiplier') {
      defaults.mb = 1000000;
      defaults.rr = 10;
      defaults.c = 20;
      defaults.e = 5;
    } else if (mode === 'taylor_rule') {
      defaults.r_star = 2;
      defaults.target_inf = 2;
      defaults.current_inf = 4;
      defaults.output_gap = 2;
      defaults.alpha = 0.5;
      defaults.beta = 0.5;
    } else if (mode === 'exchange_rate') {
      defaults.sim_type = 1; // 1 = PPP, 2 = UIRP
      defaults.p_d = 1200;
      defaults.p_f = 1000;
      defaults.i_d = 12;
      defaults.i_f = 6;
      defaults.e_exp = 150;
    } else if (mode === 'barter_pricing') {
      defaults.n_goods = 10;
    } else if (mode === 'baumol_tobin') {
      defaults.annual_income = 50000;
      defaults.interest_rate = 5;
      defaults.brokerage_cost = 10;
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
      case 'money_multiplier': {
        const mb = values.mb !== undefined ? values.mb : 1000000;
        const rr = (values.rr !== undefined ? values.rr : 10) / 100;
        const c = (values.c !== undefined ? values.c : 20) / 100;
        const e = (values.e !== undefined ? values.e : 5) / 100;

        const simpleMult = rr > 0 ? 1 / rr : 0;
        const denom = rr + e + c;
        const m1Mult = denom > 0 ? (1 + c) / denom : 0;
        const m1Supply = m1Mult * mb;
        const totalDeposits = denom > 0 ? mb / denom : 0;
        const currencyDrain = c * totalDeposits;
        const excessReserves = e * totalDeposits;
        const requiredReserves = rr * totalDeposits;

        setResult({
          simpleMult: simpleMult.toFixed(2),
          m1Mult: m1Mult.toFixed(4),
          m1Supply: m1Supply.toFixed(2),
          totalDeposits: totalDeposits.toFixed(2),
          currencyDrain: currencyDrain.toFixed(2),
          excessReserves: excessReserves.toFixed(2),
          requiredReserves: requiredReserves.toFixed(2)
        });
        break;
      }
      case 'taylor_rule': {
        const r_star = values.r_star !== undefined ? values.r_star : 2;
        const target_inf = values.target_inf !== undefined ? values.target_inf : 2;
        const current_inf = values.current_inf !== undefined ? values.current_inf : 4;
        const output_gap = values.output_gap !== undefined ? values.output_gap : 2;
        const alpha = values.alpha !== undefined ? values.alpha : 0.5;
        const beta = values.beta !== undefined ? values.beta : 0.5;

        const inf_gap = current_inf - target_inf;
        const nominal_rate = current_inf + r_star + alpha * output_gap + beta * inf_gap;
        const real_rate = nominal_rate - current_inf;

        setResult({
          inf_gap: inf_gap.toFixed(2) + '%',
          nominal_rate: nominal_rate.toFixed(2) + '%',
          real_rate: real_rate.toFixed(2) + '%'
        });
        break;
      }
      case 'exchange_rate': {
        const sim_type = values.sim_type !== undefined ? values.sim_type : 1;
        const p_d = values.p_d !== undefined ? values.p_d : 1200;
        const p_f = values.p_f !== undefined ? values.p_f : 1000;
        const i_d = values.i_d !== undefined ? values.i_d : 12;
        const i_f = values.i_f !== undefined ? values.i_f : 6;
        const e_exp = values.e_exp !== undefined ? values.e_exp : 150;

        if (sim_type === 1) {
          const ppp_rate = p_f > 0 ? p_d / p_f : 0;
          setResult({
            ppp_rate: ppp_rate.toFixed(4)
          });
        } else {
          const factor = (1 + i_d / 100) / (1 + i_f / 100);
          const uirp_rate = factor > 0 ? e_exp / factor : 0;
          const premium = uirp_rate > 0 ? ((e_exp - uirp_rate) / uirp_rate) * 100 : 0;
          setResult({
            uirp_rate: uirp_rate.toFixed(4),
            premium: premium.toFixed(2) + '%'
          });
        }
        break;
      }
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
      case 'money_multiplier':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Monetary Base (MB)" value={values.mb} onChange={v => handleInputChange('mb', v)} />
              <Input label="Req. Reserve Ratio (rr %)" value={values.rr} onChange={v => handleInputChange('rr', v)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Currency Ratio (c %)" value={values.c} onChange={v => handleInputChange('c', v)} />
              <Input label="Excess Reserve Ratio (e %)" value={values.e} onChange={v => handleInputChange('e', v)} />
            </div>
          </div>
        );
      case 'taylor_rule':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <Input label="Equil. Real Rate (r* %)" value={values.r_star} onChange={v => handleInputChange('r_star', v)} />
              <Input label="Target Inflation (π* %)" value={values.target_inf} onChange={v => handleInputChange('target_inf', v)} />
              <Input label="Current Inflation (π %)" value={values.current_inf} onChange={v => handleInputChange('current_inf', v)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <Input label="Output Gap (y - y* %)" value={values.output_gap} onChange={v => handleInputChange('output_gap', v)} />
              <Input label="Gap Weight (α)" value={values.alpha} onChange={v => handleInputChange('alpha', v)} />
              <Input label="Inflation Weight (β)" value={values.beta} onChange={v => handleInputChange('beta', v)} />
            </div>
          </div>
        );
      case 'exchange_rate':
        return (
          <div className="space-y-3.5">
            <ToggleGroup 
              label="Exchange Rate Paradigm" 
              options={[
                { label: 'Purchasing Power Parity (PPP)', value: 1 },
                { label: 'Uncovered Interest Parity (UIRP)', value: 2 }
              ]} 
              activeValue={values.sim_type || 1} 
              onChange={v => handleInputChangeDirect('sim_type', v)} 
            />
            {values.sim_type === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                <Input label="Domestic Price Index (Pd)" value={values.p_d} onChange={v => handleInputChange('p_d', v)} />
                <Input label="Foreign Price Index (Pf)" value={values.p_f} onChange={v => handleInputChange('p_f', v)} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                <Input label="Domestic Interest Rate (id %)" value={values.i_d} onChange={v => handleInputChange('i_d', v)} />
                <Input label="Foreign Interest Rate (if %)" value={values.i_f} onChange={v => handleInputChange('i_f', v)} />
                <Input label="Expected Future Spot (Ee)" value={values.e_exp} onChange={v => handleInputChange('e_exp', v)} />
              </div>
            )}
          </div>
        );
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
              <Input label="Standard Period Expense (Y ₦)" value={values.annual_income} onChange={v => handleInputChange('annual_income', v)} />
              <Input label="Bonds Interest Rate (R %)" value={values.interest_rate} onChange={v => handleInputChange('interest_rate', v)} />
              <Input label="Brokerage/Contract Fee (b0 ₦)" value={values.brokerage_cost} onChange={v => handleInputChange('brokerage_cost', v)} />
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
        return (
          <div className="space-y-4">
            <ResultCard label="Inflation Rate" value={`${result.rate}%`} icon={<TrendingUp className="text-rose-500" />} description="The percentage increase in the general price level." />
            <div className="mt-4 p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/30 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold text-xs">
                <Info size={14} />
                <span>Economic Theory & Interpretation</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Purchasing Power Erosion:</strong> An inflation rate of <span className="text-rose-600 dark:text-rose-400 font-semibold">{result.rate}%</span> indicates that a standard basket of commodities costing ₦{values.p1} in the base period now requires ₦{values.p2}. This effectively reduces the purchasing power of each nominal currency unit.
              </p>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Macroeconomic Policy Relevance:</strong> If nominal household income remains stagnant over this period, real consumer disposable wealth shrinks. Central banks maintain inflation targets (usually around 2%-3%) to protect currency purchasing power while avoiding deflationary liquidity traps that encourage consumer spending deferrals.
              </p>
            </div>
          </div>
        );
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
      case 'money_multiplier':
        return (
          <div className="space-y-4">
            <ResultCard label="M1 Money Multiplier (m₁)" value={result.m1Mult} icon={<Percent className="text-emerald-500" />} description="Ratio of total money supply to base money assets." />
            <ResultCard label="M1 Money Supply (M1)" value={`₦${parseFloat(result.m1Supply).toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={<Coins className="text-sky-500" />} />
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <ResultCard label="Required Reserves" value={`₦${parseFloat(result.requiredReserves).toLocaleString(undefined, {minimumFractionDigits: 0})}`} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Excess Reserves" value={`₦${parseFloat(result.excessReserves).toLocaleString(undefined, {minimumFractionDigits: 0})}`} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Cash Drainage" value={`₦${parseFloat(result.currencyDrain).toLocaleString(undefined, {minimumFractionDigits: 0})}`} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Simple Multiplier" value={result.simpleMult} icon={<Percent className="text-slate-400" />} description="1 / rr (no leaks)" />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/30 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold text-xs">
                <Info size={14} />
                <span>Economic Theory & Interpretation</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Leakage-Adjusted Multiplier:</strong> In a realistic banking system, the actual multiplier (<span className="text-sky-600 dark:text-sky-400 font-semibold">{result.m1Mult}</span>) is substantially lower than the theoretical simple credit multiplier (<span className="text-slate-500 font-semibold">{result.simpleMult}</span>). This shrinkage is caused by systemic leakages: cash drainage into the public hands (cash ratio <span className="text-amber-600 dark:text-amber-400 font-semibold">{(values.c !== undefined ? values.c : 0.15) * 100}%</span>) and excessive reserve hoarding by commercial banks (excess ratio <span className="text-amber-600 dark:text-amber-400 font-semibold">{(values.e !== undefined ? values.e : 0.05) * 100}%</span>).
              </p>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Credit Transmission Path:</strong> From the initial high-powered money base, fractional systems create <span className="text-sky-600 dark:text-sky-400 font-semibold">₦{parseFloat(result.m1Supply).toLocaleString(undefined, {minimumFractionDigits: 2})}</span> total M1 supply. Commercial credit expansion accumulates ₦{parseFloat(result.requiredReserves).toLocaleString()} in required reserves and ₦{parseFloat(result.excessReserves).toLocaleString()} in extra safety buffers, while ₦{parseFloat(result.currencyDrain).toLocaleString()} leaks away as currency in circulation. This demonstrates the central role of public behavior and banking confidence in monetary transmission.
              </p>
            </div>
          </div>
        );
      case 'taylor_rule':
        return (
          <div className="space-y-4">
            <ResultCard label="Suggested Nominal Rate" value={result.nominal_rate} icon={<Percent className="text-emerald-500" />} description="Target central bank policy interest rate." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Inflation Gap" value={result.inf_gap} icon={<TrendingUp className="text-sky-500" />} />
              <ResultCard label="Implied Real Rate" value={result.real_rate} icon={<Percent className="text-indigo-500" />} description="R - π (adjusted for inflation)" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border text-center">
              <p className="text-[10px] text-muted leading-relaxed font-mono">
                R = π + r* + α(y - y*) + β(π - π*)
              </p>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/30 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold text-xs">
                <Info size={14} />
                <span>Economic Theory & Interpretation</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Policy Rate Guidance (R):</strong> The rule recommends a central bank policy nominal interest rate of <span className="text-sky-600 dark:text-sky-400 font-semibold">{result.nominal_rate}%</span> to steer aggregate demand toward steady state.
              </p>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>The Taylor Principle:</strong> The feedback coefficient ensures that when inflation rises above the target, the nominal rate is lifted by more than 1-to-1 (the feedback slope). This drives the implied real interest rate up to <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{result.real_rate}%</span>, successfully cooling the economy's output gap to contain demand-pull pressures.
              </p>
            </div>
          </div>
        );
      case 'exchange_rate':
        return (
          <div className="space-y-4">
            {values.sim_type === 1 ? (
              <>
                <ResultCard label="Fair Exchange Rate (E)" value={result.ppp_rate} icon={<Scale className="text-emerald-500" />} description="Exchange rate predicted by purchasing power parity (Pd / Pf)" />
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300 font-semibold leading-relaxed border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-center text-[10px] sm:text-xs">
                  According to PPP, if domestic price level is higher, your currency should depreciate to clear arbitrage.
                </div>
              </>
            ) : (
              <>
                <ResultCard label="Imputed Spot Rate (Et)" value={result.uirp_rate} icon={<Scale className="text-sky-500" />} description="Current price of foreign currency balancing expected bond yields." />
                <ResultCard label="Expected Depr. / Prem." value={result.premium} icon={<TrendingUp className="text-amber-500" />} description="Expected change in the exchange rate to equal interest parity." />
              </>
            )}
            <div className="mt-4 p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/30 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold text-xs">
                <Info size={14} />
                <span>Economic Theory & Interpretation</span>
              </div>
              {values.sim_type === 1 ? (
                <>
                  <p className="text-[11px] text-muted leading-relaxed">
                    <strong>Purchasing Power Parity (PPP):</strong> Absolute PPP suggests the nominal exchange rate is a direct reflection of relative domestic versus foreign price levels. At <span className="text-sky-600 dark:text-sky-400 font-semibold">{result.ppp_rate}</span>, commodity arbitrage is fully cleared under the Law of One Price.
                  </p>
                  <p className="text-[11px] text-muted leading-relaxed">
                    <strong>Systematic Violations:</strong> In actual data, transportation costs, tariffs, and non-traded inputs systematically violate static PPP. The <em>Balassa-Samuelson Effect</em> explains why developed nations with rapid traded sector productivity growth experience higher domestic price levels and persistently appear overvalued.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[11px] text-muted leading-relaxed">
                    <strong>Uncovered Interest Rate Parity (UIRP):</strong> To prevent riskless speculative capital runs across borders, international assets must offer identical expected returns. A domestic nominal rate of <span className="text-sky-600 dark:text-sky-400 font-semibold">{values.i_d !== undefined ? values.i_d : 12}%</span> compared to foreign yield <span className="text-sky-600 dark:text-sky-400 font-semibold">{values.i_f !== undefined ? values.i_f : 6}%</span> forces an expected spot rate of <span className="text-sky-600 dark:text-sky-400 font-semibold">{result.uirp_rate}</span>.
                  </p>
                  <p className="text-[11px] text-muted leading-relaxed">
                    <strong>Expected Depreciation Alignment:</strong> The equilibrium expected currency shift of <span className="text-amber-600 dark:text-amber-400 font-semibold">{result.premium}</span> exactly wipes out foreign yield advantages. This ensures investors are neutral between domestic or foreign currency denominated interest assets, aligning Balance of Payments capital accounts.
                  </p>
                </>
              )}
            </div>
          </div>
        );
      case 'barter_pricing':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Barter Prices Needed" value={result.barter_prices} icon={<Scale className="text-rose-500" />} description="n * (n - 1) / 2" />
              <ResultCard label="Monetary Prices Needed" value={result.money_prices} icon={<Coins className="text-emerald-500" />} description="n - 1" />
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-center text-xs">
              Value Exchange Optimization: Using money reduces the number of transactional price listings by {result.saved_pct}!
            </div>
            <div className="mt-4 p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/30 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold text-xs">
                <Info size={14} />
                <span>Economic Theory & Interpretation</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Exploding Price Tag Complexity:</strong> In a pure barter system with <span className="text-sky-600 dark:text-sky-400 font-semibold">{values.n_goods !== undefined ? values.n_goods : 10}</span> goods, every commodity must exchange directly against every other commodity. This forces prices to grow quadratically at a rate of <code>n(n - 1) / 2</code>, resulting in <span className="text-rose-600 dark:text-rose-400 font-semibold">{result.barter_prices}</span> distinct cross-market prices.
              </p>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Money's Optimization Paradigm:</strong> Introducing a single unit of account (money) reduces price complexity to a linear function <code>n - 1</code>, requiring only <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{result.money_prices}</span> prices. This collapses search costs and computational overhead by <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{result.saved_pct}</span>, illustrating the supreme efficiency gain of a monetized economy.
              </p>
            </div>
          </div>
        );
      case 'baumol_tobin':
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
            <div className="mt-4 p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/30 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold text-xs">
                <Info size={14} />
                <span>Economic Theory & Interpretation</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Optimal Lot Size (W*):</strong> Initiating cash withdrawals of <span className="text-sky-600 dark:text-sky-400 font-semibold">₦{parseFloat(result.w_star).toLocaleString(undefined, {minimumFractionDigits: 2})}</span> minimizes the sum of transaction brokerage costs and foregone bond interest. This balances the classic inventory trade-off perfectly.
              </p>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Inventory Trade-Off Equilibrium:</strong> At this optimal point, your annual brokerage fee overhead (<span className="text-amber-600 dark:text-amber-400 font-semibold">₦{parseFloat(result.brokerage_cost_total).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>) is exactly equal to the foregone interest income (<span className="text-sky-600 dark:text-sky-400 font-semibold">₦{parseFloat(result.foregone_interest_total).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>) on your average cash holding (half of W*). This confirms the mathematical condition of the Baumol-Tobin square-root model.
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
