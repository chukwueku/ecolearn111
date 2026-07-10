import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Factory, Zap, Info, Percent, Coins, ChevronDown, ChevronUp, BookOpen, Lightbulb, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InlineMath, BlockMath } from './MathComponents';
import { StatsSimulator } from './StatsSimulator';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  ReferenceLine
} from 'recharts';

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
  | 'autocorrelation'
  | 'population'
  | 'labour_market'
  | 'nigerian_economy'
  | 'distributive_trade'
  | 'cost_revenue'
  | 'fiscal_policy'
  | 'comparative_advantage'
  | 'heckscher_ohlin'
  | 'tariff_simulation'
  | 'j_curve';

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
    } else if (mode === 'population') {
      defaults.birth_rate = 38;
      defaults.death_rate = 11;
      defaults.net_migration_rate = -1;
      defaults.years_to_project = 10;
      defaults.initial_population = 200;
    } else if (mode === 'labour_market') {
      defaults.working_age_pop = 120;
      defaults.participation_rate = 65;
      defaults.unemployment_rate = 33;
    } else if (mode === 'nigerian_economy') {
      defaults.oil_price = 75;
      defaults.oil_production = 1.4;
      defaults.other_rev_trillions = 12;
      defaults.exchange_rate = 1500;
    } else if (mode === 'distributive_trade') {
      defaults.producer_cost = 1000;
      defaults.wholesaler_markup = 15;
      defaults.retailer_markup = 25;
      defaults.logistics_cost = 200;
    } else if (mode === 'cost_revenue') {
      defaults.fc = 50;
      defaults.a = 2;
      defaults.b = 1;
      defaults.price = 20;
      defaults.q = 5;
    } else if (mode === 'fiscal_policy') {
      defaults.g = 500;
      defaults.t = 400;
      defaults.mpc = 0.75;
      defaults.c0 = 200;
      defaults.i = 300;
    } else if (mode === 'comparative_advantage') {
      defaults.prod_a_c = 10;
      defaults.prod_a_m = 2;
      defaults.prod_b_c = 5;
      defaults.prod_b_m = 5;
    } else if (mode === 'heckscher_ohlin') {
      defaults.k_a = 80;
      defaults.l_a = 40;
      defaults.k_b = 30;
      defaults.l_b = 60;
    } else if (mode === 'tariff_simulation') {
      defaults.p_w = 50;
      defaults.tariff = 10;
      defaults.dem_a = 200;
      defaults.dem_b = 2;
      defaults.sup_c = 20;
      defaults.sup_d = 1;
    } else if (mode === 'j_curve') {
      defaults.dev_pct = 20;
      defaults.e_x = 0.6;
      defaults.e_m = 0.5;
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
      case 'comparative_advantage': {
        const prod_a_c = values.prod_a_c !== undefined ? values.prod_a_c : 10;
        const prod_a_m = values.prod_a_m !== undefined ? values.prod_a_m : 2;
        const prod_b_c = values.prod_b_c !== undefined ? values.prod_b_c : 5;
        const prod_b_m = values.prod_b_m !== undefined ? values.prod_b_m : 5;

        const oc_a_c = prod_a_c > 0 ? prod_a_m / prod_a_c : 0;
        const oc_a_m = prod_a_m > 0 ? prod_a_c / prod_a_m : 0;
        const oc_b_c = prod_b_c > 0 ? prod_b_m / prod_b_c : 0;
        const oc_b_m = prod_b_m > 0 ? prod_b_c / prod_b_m : 0;

        const abs_c = prod_a_c > prod_b_c ? 'Country A' : prod_b_c > prod_a_c ? 'Country B' : 'Equal';
        const abs_m = prod_a_m > prod_b_m ? 'Country A' : prod_b_m > prod_a_m ? 'Country B' : 'Equal';

        const comp_c = oc_a_c < oc_b_c ? 'Country A' : oc_b_c < oc_a_c ? 'Country B' : 'Equal';
        const comp_m = oc_a_m < oc_b_m ? 'Country A' : oc_b_m < oc_a_m ? 'Country B' : 'Equal';

        setResult({
          oc_a_c: oc_a_c.toFixed(2),
          oc_a_m: oc_a_m.toFixed(2),
          oc_b_c: oc_b_c.toFixed(2),
          oc_b_m: oc_b_m.toFixed(2),
          abs_c,
          abs_m,
          comp_c,
          comp_m
        });
        break;
      }
      case 'heckscher_ohlin': {
        const k_a = values.k_a !== undefined ? values.k_a : 80;
        const l_a = values.l_a !== undefined ? values.l_a : 40;
        const k_b = values.k_b !== undefined ? values.k_b : 30;
        const l_b = values.l_b !== undefined ? values.l_b : 60;

        const ratio_a = l_a > 0 ? k_a / l_a : 0;
        const ratio_b = l_b > 0 ? k_b / l_b : 0;

        const abundance = ratio_a > ratio_b ? 'Country A (Capital) & Country B (Labor)' : ratio_b > ratio_a ? 'Country B (Capital) & Country A (Labor)' : 'Equal factor endowments';

        setResult({
          ratio_a: ratio_a.toFixed(2),
          ratio_b: ratio_b.toFixed(2),
          abundance
        });
        break;
      }
      case 'tariff_simulation': {
        const p_w = values.p_w !== undefined ? values.p_w : 50;
        const tariff = values.tariff !== undefined ? values.tariff : 10;
        const dem_a = values.dem_a !== undefined ? values.dem_a : 200;
        const dem_b = values.dem_b !== undefined ? values.dem_b : 2;
        const sup_c = values.sup_c !== undefined ? values.sup_c : 20;
        const sup_d = values.sup_d !== undefined ? values.sup_d : 1;

        const p_free = p_w;
        const p_tariff = p_w + tariff;

        const q_d_free = Math.max(0, dem_a - dem_b * p_free);
        const q_s_free = Math.max(0, sup_c + sup_d * p_free);
        const imports_free = Math.max(0, q_d_free - q_s_free);

        const q_d_tariff = Math.max(0, dem_a - dem_b * p_tariff);
        const q_s_tariff = Math.max(0, sup_c + sup_d * p_tariff);
        const imports_tariff = Math.max(0, q_d_tariff - q_s_tariff);

        const cs_loss = 0.5 * (q_d_free + q_d_tariff) * tariff;
        const ps_gain = 0.5 * (q_s_free + q_s_tariff) * tariff;
        const gov_rev = imports_tariff * tariff;
        const dwl = cs_loss - ps_gain - gov_rev;

        setResult({
          p_free: p_free.toFixed(2),
          p_tariff: p_tariff.toFixed(2),
          q_d_free: q_d_free.toFixed(1),
          q_s_free: q_s_free.toFixed(1),
          imports_free: imports_free.toFixed(1),
          q_d_tariff: q_d_tariff.toFixed(1),
          q_s_tariff: q_s_tariff.toFixed(1),
          imports_tariff: imports_tariff.toFixed(1),
          cs_loss: cs_loss.toFixed(2),
          ps_gain: ps_gain.toFixed(2),
          gov_rev: gov_rev.toFixed(2),
          dwl: dwl.toFixed(2)
        });
        break;
      }
      case 'j_curve': {
        const dev_pct = values.dev_pct !== undefined ? values.dev_pct : 20;
        const e_x = values.e_x !== undefined ? values.e_x : 0.6;
        const e_m = values.e_m !== undefined ? values.e_m : 0.5;

        const sum_elasticities = e_x + e_m;
        const ml_condition = sum_elasticities > 1 ? 'Holds' : 'Fails';

        setResult({
          sum_elasticities: sum_elasticities.toFixed(2),
          ml_condition
        });
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
      case 'population': {
        const br = values.birth_rate !== undefined ? values.birth_rate : 38;
        const dr = values.death_rate !== undefined ? values.death_rate : 11;
        const nm = values.net_migration_rate !== undefined ? values.net_migration_rate : -1;
        const years = values.years_to_project !== undefined ? values.years_to_project : 10;
        const initPop = values.initial_population !== undefined ? values.initial_population : 200;

        const growthRatePer1000 = br - dr + nm;
        const growthRatePct = growthRatePer1000 / 10;
        const projectedPop = initPop * Math.pow(1 + growthRatePct / 100, years);
        const doublingTime = growthRatePct > 0 ? 70 / growthRatePct : 0;

        setResult({
          growthRatePct: growthRatePct.toFixed(2) + '%',
          projectedPop: projectedPop.toFixed(2) + 'M',
          doublingTime: doublingTime > 0 ? doublingTime.toFixed(1) + ' Years' : 'Never'
        });
        break;
      }
      case 'labour_market': {
        const working = values.working_age_pop !== undefined ? values.working_age_pop : 120;
        const part = values.participation_rate !== undefined ? values.participation_rate : 65;
        const unemp = values.unemployment_rate !== undefined ? values.unemployment_rate : 33;

        const lf = working * (part / 100);
        const unemployed = lf * (unemp / 100);
        const employed = lf - unemployed;

        setResult({
          labourForce: lf.toFixed(1) + 'M',
          employed: employed.toFixed(1) + 'M',
          unemployed: unemployed.toFixed(1) + 'M',
          participationRate: part.toFixed(1) + '%',
          unemploymentRate: unemp.toFixed(1) + '%'
        });
        break;
      }
      case 'nigerian_economy': {
        const price = values.oil_price !== undefined ? values.oil_price : 75;
        const prod = values.oil_production !== undefined ? values.oil_production : 1.4;
        const other = values.other_rev_trillions !== undefined ? values.other_rev_trillions : 12;
        const xrate = values.exchange_rate !== undefined ? values.exchange_rate : 1500;

        const dailyOilUsd = price * prod;
        const dailyOilNgn = dailyOilUsd * xrate;
        const annualOilNgnTrillion = (dailyOilNgn * 365) / 1000000;
        const totalRev = annualOilNgnTrillion + other;
        const oilShare = totalRev > 0 ? (annualOilNgnTrillion / totalRev) * 100 : 0;

        setResult({
          oilRevenue: annualOilNgnTrillion.toFixed(2) + 'T ₦',
          totalRevenue: totalRev.toFixed(2) + 'T ₦',
          oilShare: oilShare.toFixed(1) + '%'
        });
        break;
      }
      case 'distributive_trade': {
        const cost = values.producer_cost !== undefined ? values.producer_cost : 1000;
        const wMarkup = values.wholesaler_markup !== undefined ? values.wholesaler_markup : 15;
        const rMarkup = values.retailer_markup !== undefined ? values.retailer_markup : 25;
        const logistics = values.logistics_cost !== undefined ? values.logistics_cost : 200;

        const wholesalerPrice = cost * (1 + wMarkup / 100);
        const finalConsumerPrice = (wholesalerPrice + logistics) * (1 + rMarkup / 100);
        const directPrice = cost + logistics;
        const markupPrem = finalConsumerPrice - directPrice;
        const inflationPct = directPrice > 0 ? (markupPrem / directPrice) * 100 : 0;

        setResult({
          wholesaler_price: '₦' + wholesalerPrice.toFixed(2),
          final_consumer_price: '₦' + finalConsumerPrice.toFixed(2),
          premium: '₦' + markupPrem.toFixed(2),
          direct_price: '₦' + directPrice.toFixed(2),
          inflation_pct: inflationPct.toFixed(1) + '%'
        });
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
      case 'fiscal_policy': {
        const g = values.g !== undefined ? values.g : 500;
        const t = values.t !== undefined ? values.t : 400;
        const mpc = values.mpc !== undefined ? values.mpc : 0.75;
        const c0 = values.c0 !== undefined ? values.c0 : 200;
        const i = values.i !== undefined ? values.i : 300;

        const multiplier = mpc < 1 ? 1 / (1 - mpc) : 100;
        const taxMultiplier = mpc < 1 ? -mpc / (1 - mpc) : -100;
        const budgetBalance = t - g;

        const autonomousSpending = c0 - mpc * t + i + g;
        const equilibriumY = multiplier * autonomousSpending;

        const disposableIncome = equilibriumY - t;
        const consumption = c0 + mpc * disposableIncome;

        setResult({
          multiplier: multiplier.toFixed(2),
          taxMultiplier: taxMultiplier.toFixed(2),
          budgetBalance: budgetBalance.toFixed(2),
          autonomousSpending: autonomousSpending.toFixed(2),
          equilibriumY: equilibriumY.toFixed(2),
          disposableIncome: disposableIncome.toFixed(2),
          consumption: consumption.toFixed(2)
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
      case 'comparative_advantage':
        return (
          <div className="space-y-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Country A (e.g. Nigeria) Output / labor hour</span>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Cocoa output (units)" value={values.prod_a_c} onChange={v => handleInputChange('prod_a_c', v)} />
                <Input label="Machinery output (units)" value={values.prod_a_m} onChange={v => handleInputChange('prod_a_m', v)} />
              </div>
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Country B (e.g. UK) Output / labor hour</span>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Cocoa output (units)" value={values.prod_b_c} onChange={v => handleInputChange('prod_b_c', v)} />
                <Input label="Machinery output (units)" value={values.prod_b_m} onChange={v => handleInputChange('prod_b_m', v)} />
              </div>
            </div>
          </div>
        );
      case 'heckscher_ohlin':
        return (
          <div className="space-y-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Country A Factor Endowments</span>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Capital stock (K)" value={values.k_a} onChange={v => handleInputChange('k_a', v)} />
                <Input label="Labor force (L)" value={values.l_a} onChange={v => handleInputChange('l_a', v)} />
              </div>
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Country B Factor Endowments</span>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Capital stock (K)" value={values.k_b} onChange={v => handleInputChange('k_b', v)} />
                <Input label="Labor force (L)" value={values.l_b} onChange={v => handleInputChange('l_b', v)} />
              </div>
            </div>
          </div>
        );
      case 'tariff_simulation':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="World Price (Pw ₦)" value={values.p_w} onChange={v => handleInputChange('p_w', v)} />
              <Input label="Import Tariff (t ₦)" value={values.tariff} onChange={v => handleInputChange('tariff', v)} />
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Domestic Demand: Qd = a - bP</span>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Intercept (a)" value={values.dem_a} onChange={v => handleInputChange('dem_a', v)} />
                <Input label="Slope (b)" value={values.dem_b} onChange={v => handleInputChange('dem_b', v)} />
              </div>
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Domestic Supply: Qs = c + dP</span>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Intercept (c)" value={values.sup_c} onChange={v => handleInputChange('sup_c', v)} />
                <Input label="Slope (d)" value={values.sup_d} onChange={v => handleInputChange('sup_d', v)} />
              </div>
            </div>
          </div>
        );
      case 'j_curve':
        return (
          <div className="space-y-4">
            <Input label="Devaluation Percentage (%)" value={values.dev_pct} onChange={v => handleInputChange('dev_pct', v)} />
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Price Elasticities of Demand</span>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Exports Elasticity (ηx)" value={values.e_x} onChange={v => handleInputChange('e_x', v)} />
                <Input label="Imports Elasticity (ηm)" value={values.e_m} onChange={v => handleInputChange('e_m', v)} />
              </div>
            </div>
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
      case 'population':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Birth Rate (per 1,000)" value={values.birth_rate} onChange={v => handleInputChange('birth_rate', v)} />
              <Input label="Death Rate (per 1,000)" value={values.death_rate} onChange={v => handleInputChange('death_rate', v)} />
              <Input label="Net Migration (per 1,000)" value={values.net_migration_rate} onChange={v => handleInputChange('net_migration_rate', v)} />
              <Input label="Initial Pop. (Millions)" value={values.initial_population} onChange={v => handleInputChange('initial_population', v)} />
            </div>
            <Input label="Projection Period (Years)" value={values.years_to_project} onChange={v => handleInputChange('years_to_project', v)} />
          </div>
        );
      case 'labour_market':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <Input label="Working Age Pop (Millions)" value={values.working_age_pop} onChange={v => handleInputChange('working_age_pop', v)} />
              <Input label="Participation Rate (%)" value={values.participation_rate} onChange={v => handleInputChange('participation_rate', v)} />
              <Input label="Unemployment Rate (%)" value={values.unemployment_rate} onChange={v => handleInputChange('unemployment_rate', v)} />
            </div>
          </div>
        );
      case 'nigerian_economy':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Oil Price ($/barrel)" value={values.oil_price} onChange={v => handleInputChange('oil_price', v)} />
              <Input label="Oil Prodn (M barrels/day)" value={values.oil_production} onChange={v => handleInputChange('oil_production', v)} />
              <Input label="Exchange Rate (₦/$)" value={values.exchange_rate} onChange={v => handleInputChange('exchange_rate', v)} />
              <Input label="Non-Oil Sector (Trillion ₦)" value={values.other_rev_trillions} onChange={v => handleInputChange('other_rev_trillions', v)} />
            </div>
          </div>
        );
      case 'distributive_trade':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Producer Unit Cost (₦)" value={values.producer_cost} onChange={v => handleInputChange('producer_cost', v)} />
              <Input label="Logistics & Transport (₦)" value={values.logistics_cost} onChange={v => handleInputChange('logistics_cost', v)} />
              <Input label="Wholesaler Mark-up (%)" value={values.wholesaler_markup} onChange={v => handleInputChange('wholesaler_markup', v)} />
              <Input label="Retailer Mark-up (%)" value={values.retailer_markup} onChange={v => handleInputChange('retailer_markup', v)} />
            </div>
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
      case 'fiscal_policy':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Govt Spending (G ₦b)" value={values.g} onChange={v => handleInputChange('g', v)} />
              <Input label="Tax Revenues (T ₦b)" value={values.t} onChange={v => handleInputChange('t', v)} />
              <Input label="Autonomous Cons (C0 ₦b)" value={values.c0} onChange={v => handleInputChange('c0', v)} />
              <Input label="Investment (I ₦b)" value={values.i} onChange={v => handleInputChange('i', v)} />
            </div>
            <Input label="Marginal Propensity to Consume (MPC)" value={values.mpc} onChange={v => handleInputChange('mpc', v)} />
            <p className="text-[10px] text-muted italic">
              Change MPC to see multiplier acceleration: Multiplier = 1 / (1 - MPC). MPC must be less than 1.0.
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
            
            {/* Table */}
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

            {/* Chart */}
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

            {/* Table */}
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

            {/* Chart */}
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

            {/* Table */}
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

            {/* Curve Chart */}
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
        const tp1 = values.tp1 !== undefined ? values.tp1 : 150;
        const tp2 = values.tp2 !== undefined ? values.tp2 : 180;
        const l1 = values.l1 !== undefined ? values.l1 : 5;
        const l2 = values.l2 !== undefined ? values.l2 : 6;
        const ap1 = l1 > 0 ? tp1 / l1 : 0;
        const ap2 = l2 > 0 ? tp2 / l2 : 0;
        const mpVal = l2 !== l1 ? (tp2 - tp1) / (l2 - l1) : 0;

        const prodData = [
          { name: `L=${l1}`, TP: tp1, AP: parseFloat(ap1.toFixed(1)), MP: parseFloat(ap1.toFixed(1)) },
          { name: `L=${l2}`, TP: tp2, AP: parseFloat(ap2.toFixed(1)), MP: parseFloat(mpVal.toFixed(1)) }
        ];

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <ResultCard label="Average Product (AP)" value={result.ap} icon={<Factory className="text-indigo-500" />} />
              <ResultCard label="Marginal Product (MP)" value={result.mp} icon={<Factory className="text-indigo-500" />} />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Labour (L)</th>
                    <th className="px-3 py-2 text-right">Total Product (TP)</th>
                    <th className="px-3 py-2 text-right">Average Product (AP)</th>
                    <th className="px-3 py-2 text-right">Marginal Product (MP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">{l1} Workers</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{tp1}</td>
                    <td className="px-3 py-2 text-right text-muted">{ap1.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right text-muted">-</td>
                  </tr>
                  <tr className="bg-slate-50/40 dark:bg-slate-850/20">
                    <td className="px-3 py-2 font-medium text-ink">{l2} Workers</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{tp2}</td>
                    <td className="px-3 py-2 text-right text-indigo-600 dark:text-indigo-400 font-medium">{ap2.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">{mpVal.toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bar Chart comparing AP vs MP */}
            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prodData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar name="Average Product" dataKey="AP" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar name="Marginal Product" dataKey="MP" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
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
      case 'future_value': {
        const initialPv = values.pv !== undefined ? values.pv : 1000;
        const rateLimit = values.r !== undefined ? values.r : 8;
        const yearsFV = values.n !== undefined ? values.n : 5;
        const compoundingM = values.m !== undefined ? values.m : 1;
        const rDecimal = rateLimit / 100;
        
        const fvData = [];
        for (let yr = 0; yr <= yearsFV; yr++) {
          let compoundVal = 0;
          if (compoundingM === -1) {
            // Continuous
            compoundVal = initialPv * Math.exp(rDecimal * yr);
          } else {
            compoundVal = initialPv * Math.pow(1 + rDecimal / compoundingM, yr * compoundingM);
          }
          const simpleVal = initialPv * (1 + rDecimal * yr);
          fvData.push({
            year: `Yr ${yr}`,
            'Compound Value': parseFloat(compoundVal.toFixed(1)),
            'Simple Value': parseFloat(simpleVal.toFixed(1)),
          });
        }

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

            {/* Compound Curve Chart */}
            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fvData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Area type="monotone" name="Compound Value" dataKey="Compound Value" stroke="#10b981" fillOpacity={1} fill="url(#colorComp)" strokeWidth={2} />
                  <Line type="monotone" name="Simple Value" dataKey="Simple Value" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'capital_budgeting': {
        const viewingAlternativeDecisionMetrics = values.tab === 2;
        const outVal = values.outlay !== undefined ? values.outlay : 1000;
        const budgetingData = [
          { year: 'Yr 0 (Cost)', 'Cash Flow': -outVal },
          { year: 'Yr 1', 'Cash Flow': values.cf1 !== undefined ? values.cf1 : 300 },
          { year: 'Yr 2', 'Cash Flow': values.cf2 !== undefined ? values.cf2 : 400 },
          { year: 'Yr 3', 'Cash Flow': values.cf3 !== undefined ? values.cf3 : 500 },
          { year: 'Yr 4', 'Cash Flow': values.cf4 !== undefined ? values.cf4 : 600 },
          { year: 'Yr 5', 'Cash Flow': values.cf5 !== undefined ? values.cf5 : 700 }
        ];

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

            {/* Cash Flow Timeline Columns Chart */}
            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetingData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="Cash Flow" radius={[4, 4, 0, 0]}>
                    {budgetingData.map((item, index) => {
                      const isNegative = item['Cash Flow'] < 0;
                      return <Cell key={`cell-${index}`} fill={isNegative ? '#f43f5e' : '#10b981'} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'bond_valuation': {
        const bondFace = values.face !== undefined ? values.face : 1000;
        const bondCoupon = values.coupon !== undefined ? values.coupon : 6;
        const bondYears = values.years !== undefined ? values.years : 10;
        const annualCouponVal = bondFace * (bondCoupon / 100);
        
        const cashFlows = [];
        for (let i = 1; i <= Math.min(15, bondYears); i++) {
          let flowVal = annualCouponVal;
          if (i === bondYears) {
            flowVal += bondFace;
          }
          cashFlows.push({
            year: `Yr ${i}`,
            'Expected Cashflow': flowVal,
          });
        }

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

            {/* Bond cash flow chart */}
            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlows} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar name="Annual Cashflow Received" dataKey="Expected Cashflow" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'capm': {
        const rf = values.rf !== undefined ? values.rf : 4;
        const beta = values.beta !== undefined ? values.beta : 1.2;
        const optType = values.optType !== undefined ? values.optType : 1; 
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

        const smlData = [
          { betaPoint: 0.0, name: 'Risk-Free (Rf)', Return: rf },
          { betaPoint: 0.5, name: 'Low Beta', Return: rf + 0.5 * mrp },
          { betaPoint: 1.0, name: 'Market (Rm)', Return: mr },
          { betaPoint: parseFloat(beta.toFixed(2)), name: 'Our Asset', Return: parseFloat(expectedReturn.toFixed(2)) },
          { betaPoint: 1.5, name: 'High Beta', Return: rf + 1.5 * mrp }
        ].sort((a,b) => a.betaPoint - b.betaPoint);

        return (
          <div className="space-y-4 font-sans">
            <ResultCard label="Required Return (Re)" value={result.expectedReturn} icon={<TrendingUp className="text-indigo-500" />} description="The cost of equity required for this asset beta risk level." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Market Return (Rm)" value={result.mr} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Risk Premium (MRP)" value={result.mrp} icon={<Percent className="text-amber-500" />} />
            </div>

            {/* SML Line Chart */}
            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={smlData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="betaPoint" type="number" scale="linear" domain={[0, 2]} tick={{ fontSize: 9 }} name="Beta" label={{ value: 'Systemic Risk (Beta)', position: 'insideBottom', offset: -5, fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} label={{ value: 'Required Return (%)', angle: -90, position: 'insideLeft', fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Line name="Security Market Line" type="linear" dataKey="Return" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'money_multiplier': {
        const mb = values.mb !== undefined ? values.mb : 1000000;
        const fdData = [
          { name: 'Required Reserves', value: parseFloat(result.requiredReserves), color: '#3b82f6' },
          { name: 'Excess Reserves', value: parseFloat(result.excessReserves), color: '#f59e0b' },
          { name: 'Currency Drainage', value: parseFloat(result.currencyDrain), color: '#ef4444' },
          { name: 'Active Economic Deposits', value: Math.max(0, parseFloat(result.m1Supply) - parseFloat(result.requiredReserves) - parseFloat(result.excessReserves) - parseFloat(result.currencyDrain)), color: '#10b981' }
        ].filter(item => item.value > 0);

        return (
          <div className="space-y-4 font-sans">
            <ResultCard label="M1 Money Multiplier (m₁)" value={result.m1Mult} icon={<Percent className="text-emerald-500" />} description="Ratio of total money supply to base money assets." />
            <ResultCard label="M1 Money Supply (M1)" value={`₦${parseFloat(result.m1Supply).toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={<Coins className="text-sky-500" />} />
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <ResultCard label="Required Reserves" value={`₦${parseFloat(result.requiredReserves).toLocaleString(undefined, {minimumFractionDigits: 0})}`} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Excess Reserves" value={`₦${parseFloat(result.excessReserves).toLocaleString(undefined, {minimumFractionDigits: 0})}`} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Cash Drainage" value={`₦${parseFloat(result.currencyDrain).toLocaleString(undefined, {minimumFractionDigits: 0})}`} icon={<Scale className="text-slate-400" />} />
              <ResultCard label="Simple Multiplier" value={result.simpleMult} icon={<Percent className="text-slate-400" />} description="1 / rr (no leaks)" />
            </div>

            {/* Multiplier components comparison table */}
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[10px] sm:text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">System Asset Element</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-right">Proportion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fdData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 font-medium text-ink flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: row.color }}></span>
                        {row.name}
                      </td>
                      <td className="px-3 py-2 text-right text-ink font-semibold">₦{row.value.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                      <td className="px-3 py-2 text-right text-muted font-mono">
                        {((row.value / parseFloat(result.m1Supply)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pie Chart of allocations */}
            {fdData.length > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fdData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {fdData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₦${parseFloat(value).toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: '9px' }} layout="horizontal" align="center" verticalAlign="bottom"/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      }
      case 'taylor_rule': {
        const r_star = values.r_star !== undefined ? values.r_star : 2;
        const target_inf = values.target_inf !== undefined ? values.target_inf : 2;
        const current_inf = values.current_inf !== undefined ? values.current_inf : 4;
        const output_gap = values.output_gap !== undefined ? values.output_gap : 2;
        const alpha = values.alpha !== undefined ? values.alpha : 0.5;
        const betaVal = values.beta !== undefined ? values.beta : 0.5;

        const inf_gap = current_inf - target_inf;
        const nominal_rate = current_inf + r_star + alpha * output_gap + betaVal * inf_gap;
        
        const neutralNominalRate = current_inf + r_star;

        const taylorCompareData = [
          { name: 'Neutral Policy', Rate: neutralNominalRate },
          { name: 'Taylor Suggested Rate', Rate: parseFloat(nominal_rate.toFixed(2)) }
        ];

        return (
          <div className="space-y-4">
            <ResultCard label="Suggested Nominal Rate" value={result.nominal_rate} icon={<Percent className="text-emerald-500" />} description="Target central bank policy interest rate." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Inflation Gap" value={result.inf_gap} icon={<TrendingUp className="text-sky-500" />} />
              <ResultCard label="Implied Real Rate" value={result.real_rate} icon={<Percent className="text-indigo-500" />} description="R - π (adjusted for inflation)" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Macroeconomic Input Variable</th>
                    <th className="px-3 py-2 text-right">Value Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[11px]">
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Target Inflation Rate (π*)</td>
                    <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{target_inf}%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Current Inflation Rate (π)</td>
                    <td className="px-3 py-2 text-right text-rose-500 font-medium">{current_inf}%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Real GDP Output Gap</td>
                    <td className="px-3 py-2 text-right text-amber-500 font-medium">{output_gap}%</td>
                  </tr>
                  <tr className="bg-slate-100/50 dark:bg-slate-800/30 font-bold">
                    <td className="px-3 py-2 text-ink">Taylor Policy Suggestion Rate</td>
                    <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400">{nominal_rate.toFixed(2)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bar comparison */}
            <div className="h-36 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taylorCompareData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar name="Interest Rate (%)" dataKey="Rate" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    <Cell fill="#94a3b8" />
                    <Cell fill="#10b981" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
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

            {/* Line/Curve chart showing explosive barter growth */}
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
          // generate sweep points around W* to show the trade-off
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

            {/* Table */}
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

            {/* Line Chart */}
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
      case 'population': {
        const br = values.birth_rate !== undefined ? values.birth_rate : 38;
        const dr = values.death_rate !== undefined ? values.death_rate : 11;
        const nm = values.net_migration_rate !== undefined ? values.net_migration_rate : -1;
        const years = values.years_to_project !== undefined ? values.years_to_project : 10;
        const initPop = values.initial_population !== undefined ? values.initial_population : 200;

        const growthRatePer1000 = br - dr + nm;
        const growthRatePct = growthRatePer1000 / 10;
        
        const popProjectionData = [];
        let currentPop = initPop;
        for (let yr = 0; yr <= Math.min(20, years); yr++) {
          popProjectionData.push({
            year: `Yr ${yr}`,
            Population: parseFloat(currentPop.toFixed(2)),
          });
          currentPop = currentPop * (1 + growthRatePct / 100);
        }

        return (
          <div className="space-y-4">
            <ResultCard label="Projected Population" value={result.projectedPop} icon={<Scale className="text-emerald-500" />} description="Future population size after projection years." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Growth Rate" value={result.growthRatePct} icon={<TrendingUp className="text-sky-500" />} />
              <ResultCard label="Doubling Horizon" value={result.doublingTime} icon={<Scale className="text-amber-500" />} description="Estimated years to double population (Rule of 70)." />
            </div>

            {/* Projection Data Table */}
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Milestone Year</th>
                    <th className="px-3 py-2 text-right">Population Size</th>
                    <th className="px-3 py-2 text-right">Incremental Increase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Baseline Year 0</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{initPop.toFixed(1)}M</td>
                    <td className="px-3 py-2 text-right text-muted">-</td>
                  </tr>
                  {popProjectionData.length > 1 && (
                    <>
                      {years > 2 && (
                        <tr>
                          <td className="px-3 py-2 font-medium text-ink">Mid-Point Year {Math.floor(years / 2)}</td>
                          <td className="px-3 py-2 text-right text-ink font-semibold">
                            {popProjectionData[Math.floor(years / 2)]?.Population.toFixed(1)}M
                          </td>
                          <td className="px-3 py-2 text-right text-muted">
                            +{(popProjectionData[Math.floor(years / 2)]?.Population - initPop).toFixed(1)}M
                          </td>
                        </tr>
                      )}
                      <tr className="bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold">
                        <td className="px-3 py-2 text-ink">Target Year {years}</td>
                        <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400">{popProjectionData[popProjectionData.length - 1]?.Population.toFixed(1)}M</td>
                        <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400">
                          +{(popProjectionData[popProjectionData.length - 1]?.Population - initPop).toFixed(1)}M
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Line/Area chart of compounding population growth */}
            {popProjectionData.length > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={popProjectionData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Area type="monotone" name="Population (M)" dataKey="Population" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorPop)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      }
      case 'labour_market': {
        const working = values.working_age_pop !== undefined ? values.working_age_pop : 120;
        const part = values.participation_rate !== undefined ? values.participation_rate : 65;
        const unemp = values.unemployment_rate !== undefined ? values.unemployment_rate : 33;

        const lf = working * (part / 100);
        const unemployed = lf * (unemp / 100);
        const employed = lf - unemployed;
        const outOfLabourForce = working - lf;

        const marketAllocData = [
          { name: 'Employed', value: parseFloat(employed.toFixed(1)), color: '#10b981' },
          { name: 'Unemployed', value: parseFloat(unemployed.toFixed(1)), color: '#ef4444' },
          { name: 'Out of Labour Force', value: parseFloat(outOfLabourForce.toFixed(1)), color: '#64748b' }
        ].filter(item => item.value > 0);

        return (
          <div className="space-y-4">
            <ResultCard label="Active Labour Force" value={result.labourForce} icon={<Scale className="text-emerald-500" />} description="Citizens working or actively searching for employment." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Employed" value={result.employed} icon={<TrendingUp className="text-sky-500" />} />
              <ResultCard label="Unemployed" value={result.unemployed} icon={<Scale className="text-rose-500" />} />
            </div>

            {/* Allocation Table */}
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Economic Class Segment</th>
                    <th className="px-3 py-2 text-right">Size (M)</th>
                    <th className="px-3 py-2 text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {marketAllocData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 font-medium text-ink flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: row.color }}></span>
                        {row.name}
                      </td>
                      <td className="px-3 py-2 text-right text-ink font-semibold">{row.value}M</td>
                      <td className="px-3 py-2 text-right text-muted font-mono">
                        {((row.value / working) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/40 dark:bg-slate-800/20 font-semibold border-t-2 border-border">
                    <td className="px-3 py-2 text-ink">Total Working Age Pop</td>
                    <td className="px-3 py-2 text-right text-ink font-bold">{working}M</td>
                    <td className="px-3 py-2 text-right text-muted font-mono">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pie Chart */}
            {marketAllocData.length > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketAllocData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {marketAllocData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value}M Workers`} />
                    <Legend wrapperStyle={{ fontSize: '9px' }} layout="horizontal" align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      }
      case 'nigerian_economy': {
        const price = values.oil_price !== undefined ? values.oil_price : 75;
        const prod = values.oil_production !== undefined ? values.oil_production : 1.4;
        const other = values.other_rev_trillions !== undefined ? values.other_rev_trillions : 12;
        const xrate = values.exchange_rate !== undefined ? values.exchange_rate : 1500;

        const dailyOilUsd = price * prod;
        const dailyOilNgn = dailyOilUsd * xrate;
        const annualOilNgnTrillion = (dailyOilNgn * 365) / 1000000;
        const totalRev = annualOilNgnTrillion + other;

        const revPieces = [
          { name: 'Crude Oil exports', value: parseFloat(annualOilNgnTrillion.toFixed(2)), color: '#f59e0b' },
          { name: 'Other Sector revenues', value: parseFloat(other.toFixed(2)), color: '#10b981' }
        ];

        return (
          <div className="space-y-4">
            <ResultCard label="Annual Oil Revenue" value={result.oilRevenue} icon={<Coins className="text-amber-500" />} description="Projected state intake from crude exports." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="total unified GDP/Rev" value={result.totalRevenue} icon={<Scale className="text-sky-500" />} />
              <ResultCard label="Oil Revenue Share" value={result.oilShare} icon={<Percent className="text-indigo-500" />} />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Revenue Channel Stream</th>
                    <th className="px-3 py-2 text-right">Annual Earned (₦)</th>
                    <th className="px-3 py-2 text-right">Revenue Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {revPieces.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 font-medium text-ink flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: row.color }}></span>
                        {row.name}
                      </td>
                      <td className="px-3 py-2 text-right text-ink font-semibold">{row.value.toFixed(2)}T ₦</td>
                      <td className="px-3 py-2 text-right text-muted font-mono">
                        {((row.value / totalRev) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/40 dark:bg-slate-800/20 font-semibold border-t-2 border-border">
                    <td className="px-3 py-2 text-ink">Total Consolidated Revenue</td>
                    <td className="px-3 py-2 text-right text-ink font-bold">{totalRev.toFixed(2)}T ₦</td>
                    <td className="px-3 py-2 text-right text-muted font-mono">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pie Chart of Exposure */}
            {totalRev > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revPieces}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {revPieces.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value}T ₦`} />
                    <Legend wrapperStyle={{ fontSize: '9px' }} layout="horizontal" align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      }
      case 'distributive_trade': {
        const cost = values.producer_cost !== undefined ? values.producer_cost : 1000;
        const wMarkup = values.wholesaler_markup !== undefined ? values.wholesaler_markup : 15;
        const rMarkup = values.retailer_markup !== undefined ? values.retailer_markup : 25;
        const logistics = values.logistics_cost !== undefined ? values.logistics_cost : 200;

        const wholesalerPrice = cost * (1 + wMarkup / 100);
        const costAndLogistics = wholesalerPrice + logistics;
        const finalConsumerPrice = costAndLogistics * (1 + rMarkup / 100);

        const cascadeStages = [
          { stage: 'Producer Cost', price: cost, added: 0, tag: 'Starting Base' },
          { stage: 'Wholesaler Price', price: parseFloat(wholesalerPrice.toFixed(1)), added: parseFloat((wholesalerPrice - cost).toFixed(1)), tag: `+${wMarkup}% Markup` },
          { stage: 'Plus Logistics', price: parseFloat(costAndLogistics.toFixed(1)), added: logistics, tag: 'Transport Costs' },
          { stage: 'Final Retailer Price', price: parseFloat(finalConsumerPrice.toFixed(1)), added: parseFloat((finalConsumerPrice - costAndLogistics).toFixed(1)), tag: `+${rMarkup}% Markup` }
        ];

        return (
          <div className="space-y-4">
            <ResultCard label="Final Consumer Price" value={result.final_consumer_price} icon={<Coins className="text-rose-500" />} description="The price paid by end-users after markups." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard label="Direct (No Middlemen)" value={result.direct_price} icon={<Scale className="text-emerald-500" />} />
              <ResultCard label="Middlemen Markup Premium" value={result.premium} icon={<TrendingUp className="text-rose-500" />} />
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/30 rounded-xl text-center">
              <span className="text-[11px] text-rose-800 dark:text-rose-400 font-bold">
                Middlemen markups inflated final price by {result.inflation_pct}!
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[10px] sm:text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-2 py-1.5">Distribution Stage</th>
                    <th className="px-2 py-1.5 text-right">Value (₦)</th>
                    <th className="px-2 py-1.5 text-right">Cost Element</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cascadeStages.map((row, idx) => (
                    <tr key={idx} className={idx === cascadeStages.length - 1 ? "bg-rose-50/30 dark:bg-rose-950/10 font-bold" : ""}>
                      <td className="px-2 py-1.5 text-ink">{row.stage}</td>
                      <td className="px-2 py-1.5 text-right text-ink">₦{row.price.toLocaleString(undefined, {minimumFractionDigits: 1})}</td>
                      <td className="px-2 py-1.5 text-right text-slate-500 text-[10px] font-mono">{row.tag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bar Chart cascade build-up */}
            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cascadeStages} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="stage" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip formatter={(value: any) => `₦${value}`} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar name="Price Build-up (₦)" dataKey="price" fill="#ef4444" radius={[4, 4, 0, 0]}>
                    {cascadeStages.map((entry, index) => {
                      const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'cost_revenue': {
        const fc = values.fc !== undefined ? values.fc : 50;
        const a = values.a !== undefined ? values.a : 2;
        const b = values.b !== undefined ? values.b : 1;
        const price = values.price !== undefined ? values.price : 20;

        const chartData = [];
        for (let i = 1; i <= 10; i++) {
          const ivc = a * i + b * i * i;
          const itc = fc + ivc;
          const iac = itc / i;
          const iavc = ivc / i;
          const imc = a + b * (2 * i - 1);
          chartData.push({
            output: i,
            'Average Cost (AC)': parseFloat(iac.toFixed(2)),
            'Average Variable Cost (AVC)': parseFloat(iavc.toFixed(2)),
            'Marginal Cost (MC)': parseFloat(imc.toFixed(2)),
            'Price (P)': price
          });
        }

        const isProfitable = parseFloat(result.profit) >= 0;

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <ResultCard label="Total Cost (TC)" value={`₦${result.tc}`} icon={<Scale className="text-amber-500" />} description={`FC (₦${result.fc}) + VC (₦${result.vc})`} />
              <ResultCard label="Net Profit" value={`₦${result.profit}`} icon={<Coins className={isProfitable ? "text-emerald-500" : "text-rose-500"} />} description={isProfitable ? "Firm is making excess profits!" : "Firm is operating at a loss."} />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-border text-center">
                <span className="text-[8px] font-bold text-muted uppercase tracking-wider block">Average Cost (AC)</span>
                <span className="text-xs font-bold text-ink">₦{result.ac}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-border text-center">
                <span className="text-[8px] font-bold text-muted uppercase tracking-wider block">Marginal Cost (MC)</span>
                <span className="text-xs font-bold text-ink">₦{result.mc}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-border text-center">
                <span className="text-[8px] font-bold text-muted uppercase tracking-wider block">Avg Var Cost (AVC)</span>
                <span className="text-xs font-bold text-ink">₦{result.avc}</span>
              </div>
            </div>

            {/* Cost Curves Chart */}
            <div className="h-48 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="output" tick={{ fontSize: 9 }} label={{ value: 'Output (Q)', position: 'insideBottom', offset: -5, style: { fontSize: 8, fill: '#64748b' } }} />
                  <YAxis tick={{ fontSize: 9 }} label={{ value: 'Cost / Price (₦)', angle: -90, position: 'insideLeft', style: { fontSize: 8, fill: '#64748b' } }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '9px' }} />
                  <Line type="monotone" dataKey="Average Cost (AC)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Average Variable Cost (AVC)" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="Marginal Cost (MC)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Price (P)" stroke="#10b981" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-[10px] text-muted leading-relaxed text-center italic">
              Profit Maximization Rule: Optimal production is at $MC = MR$ (Price). Check if $MC$ is close to Price (₦{price}).
            </p>
          </div>
        );
      }
      case 'comparative_advantage': {
        const prod_a_c = values.prod_a_c !== undefined ? values.prod_a_c : 10;
        const prod_a_m = values.prod_a_m !== undefined ? values.prod_a_m : 2;
        const prod_b_c = values.prod_b_c !== undefined ? values.prod_b_c : 5;
        const prod_b_m = values.prod_b_m !== undefined ? values.prod_b_m : 5;

        const maxCocoa = Math.max(prod_a_c * 10, prod_b_c * 10);
        const ppfData = [];
        for (let i = 0; i <= 5; i++) {
          const cocoaVal = Math.round((maxCocoa / 5) * i);
          const machA = Math.max(0, prod_a_m * 10 - cocoaVal * (prod_a_m / prod_a_c));
          const machB = Math.max(0, prod_b_m * 10 - cocoaVal * (prod_b_m / prod_b_c));
          ppfData.push({
            Cocoa: cocoaVal,
            'Country A (Machinery)': parseFloat(machA.toFixed(1)),
            'Country B (Machinery)': parseFloat(machB.toFixed(1))
          });
        }

        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <ResultCard 
                label="Cocoa Comp. Adv." 
                value={result.comp_c} 
                icon={<Scale className="text-amber-500" />} 
                description={`Lower opportunity cost of Cocoa (${result.comp_c === 'Country A' ? result.oc_a_c : result.oc_b_c} vs ${result.comp_c === 'Country A' ? result.oc_b_c : result.oc_a_c})`}
              />
              <ResultCard 
                label="Machinery Comp. Adv." 
                value={result.comp_m} 
                icon={<Scale className="text-sky-500" />} 
                description={`Lower opportunity cost of Machinery (${result.comp_m === 'Country A' ? result.oc_a_m : result.oc_b_m} vs ${result.comp_m === 'Country A' ? result.oc_b_m : result.oc_a_m})`}
              />
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Country</th>
                    <th className="px-3 py-2 text-right">Cocoa OC (in Machinery)</th>
                    <th className="px-3 py-2 text-right">Machinery OC (in Cocoa)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Country A (Nigeria)</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.oc_a_c}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.oc_a_m}</td>
                  </tr>
                  <tr className="bg-slate-50/40 dark:bg-slate-850/20">
                    <td className="px-3 py-2 font-medium text-ink">Country B (UK)</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.oc_b_c}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.oc_b_m}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="h-48 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center mb-1">Production Possibility Frontiers (PPF)</span>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={ppfData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="Cocoa" label={{ value: 'Cocoa', position: 'insideBottomRight', offset: -5, fontSize: 9 }} tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="Country A (Machinery)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Country B (Machinery)" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'heckscher_ohlin': {
        const k_a = values.k_a !== undefined ? values.k_a : 80;
        const l_a = values.l_a !== undefined ? values.l_a : 40;
        const k_b = values.k_b !== undefined ? values.k_b : 30;
        const l_b = values.l_b !== undefined ? values.l_b : 60;
        const ratio_a = l_a > 0 ? k_a / l_a : 0;
        const ratio_b = l_b > 0 ? k_b / l_b : 0;

        const chartData = [
          { name: 'Country A', 'Capital-Labor Ratio (K/L)': parseFloat(ratio_a.toFixed(2)) },
          { name: 'Country B', 'Capital-Labor Ratio (K/L)': parseFloat(ratio_b.toFixed(2)) }
        ];

        return (
          <div className="space-y-4 text-left">
            <ResultCard 
              label="Relative Factor Abundance" 
              value={result.abundance} 
              icon={<TrendingUp className="text-emerald-500" />} 
              description={`Country A K/L ratio is ${result.ratio_a} vs Country B ${result.ratio_b}`}
            />

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Country</th>
                    <th className="px-3 py-2 text-right">Capital (K)</th>
                    <th className="px-3 py-2 text-right">Labor (L)</th>
                    <th className="px-3 py-2 text-right">K/L Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Country A</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{k_a}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{l_a}</td>
                    <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">{result.ratio_a}</td>
                  </tr>
                  <tr className="bg-slate-50/40 dark:bg-slate-850/20">
                    <td className="px-3 py-2 font-medium text-ink">Country B</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{k_b}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{l_b}</td>
                    <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">{result.ratio_b}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="Capital-Labor Ratio (K/L)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'tariff_simulation': {
        const p_w = values.p_w !== undefined ? values.p_w : 50;
        const tariff = values.tariff !== undefined ? values.tariff : 10;
        const dem_a = values.dem_a !== undefined ? values.dem_a : 200;
        const dem_b = values.dem_b !== undefined ? values.dem_b : 2;
        const sup_c = values.sup_c !== undefined ? values.sup_c : 20;
        const sup_d = values.sup_d !== undefined ? values.sup_d : 1;

        const q_max = dem_a;
        const chartData = [];
        for (let i = 0; i <= 5; i++) {
          const q = Math.round((q_max / 5) * i);
          const p_d = Math.max(0, (dem_a - q) / dem_b);
          const p_s = Math.max(0, (q - sup_c) / sup_d);
          chartData.push({
            Quantity: q,
            'Demand Price (₦)': parseFloat(p_d.toFixed(1)),
            'Supply Price (₦)': parseFloat(p_s.toFixed(1)),
            'World Price (₦)': p_w,
            'Tariff Price (₦)': p_w + tariff
          });
        }

        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <ResultCard 
                label="Deadweight Loss (DWL)" 
                value={`₦${result.dwl}`} 
                icon={<Activity className="text-red-500" />} 
                description="Efficiency loss from consumption and production distortion."
              />
              <ResultCard 
                label="Government Tariff Rev." 
                value={`₦${result.gov_rev}`} 
                icon={<Coins className="text-emerald-500" />} 
                description={`Tariff revenue from ${result.imports_tariff} units of imports.`}
              />
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-[11px] text-left text-muted">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Metric</th>
                    <th className="px-3 py-2 text-right">Free Trade</th>
                    <th className="px-3 py-2 text-right">With Tariff</th>
                    <th className="px-3 py-2 text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Domestic Price</td>
                    <td className="px-3 py-2 text-right text-ink">₦{result.p_free}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">₦{result.p_tariff}</td>
                    <td className="px-3 py-2 text-right text-amber-600 font-bold">+{tariff}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Domestic Demand (Qd)</td>
                    <td className="px-3 py-2 text-right text-ink">{result.q_d_free}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.q_d_tariff}</td>
                    <td className="px-3 py-2 text-right text-red-500 font-bold">{(parseFloat(result.q_d_tariff) - parseFloat(result.q_d_free)).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-ink">Domestic Production (Qs)</td>
                    <td className="px-3 py-2 text-right text-ink">{result.q_s_free}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.q_s_tariff}</td>
                    <td className="px-3 py-2 text-right text-emerald-500 font-bold">+{(parseFloat(result.q_s_tariff) - parseFloat(result.q_s_free)).toFixed(1)}</td>
                  </tr>
                  <tr className="bg-slate-50/40 dark:bg-slate-850/20">
                    <td className="px-3 py-2 font-medium text-ink">Imports (M)</td>
                    <td className="px-3 py-2 text-right text-ink">{result.imports_free}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.imports_tariff}</td>
                    <td className="px-3 py-2 text-right text-amber-600 font-bold">{(parseFloat(result.imports_tariff) - parseFloat(result.imports_free)).toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="h-48 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center mb-1">Tariff Welfare & Deadweight Loss (DWL) Analysis</span>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="Quantity" label={{ value: 'Quantity', position: 'insideBottomRight', offset: -5, fontSize: 9 }} tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="Demand Price (₦)" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Supply Price (₦)" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="World Price (₦)" stroke="#6b7280" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Tariff Price (₦)" stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'j_curve': {
        const dev_pct = values.dev_pct !== undefined ? values.dev_pct : 20;
        const e_x = values.e_x !== undefined ? values.e_x : 0.6;
        const e_m = values.e_m !== undefined ? values.e_m : 0.5;

        const sum_el = e_x + e_m;
        const tb_0 = 0;
        const tb_1 = -dev_pct * 1.5;
        const tb_2 = -dev_pct * 0.8;
        const tb_3 = dev_pct * (sum_el - 1) * 1.2;
        const tb_4 = dev_pct * (sum_el - 1) * 2.5;
        const tb_5 = dev_pct * (sum_el - 1) * 4.0;

        const chartData = [
          { Period: 't=0 (Before)', 'Trade Balance (₦)': tb_0 },
          { Period: 't=1 (Immediate)', 'Trade Balance (₦)': parseFloat(tb_1.toFixed(1)) },
          { Period: 't=2 (Short-run)', 'Trade Balance (₦)': parseFloat(tb_2.toFixed(1)) },
          { Period: 't=3 (Adjustment)', 'Trade Balance (₦)': parseFloat(tb_3.toFixed(1)) },
          { Period: 't=4 (Medium-run)', 'Trade Balance (₦)': parseFloat(tb_4.toFixed(1)) },
          { Period: 't=5 (Long-run)', 'Trade Balance (₦)': parseFloat(tb_5.toFixed(1)) }
        ];

        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <ResultCard 
                label="Sum of Elasticities" 
                value={result.sum_elasticities} 
                icon={<Scale className="text-amber-500" />} 
                description="ηx + ηm: Critical threshold for Marshall-Lerner theorem."
              />
              <ResultCard 
                label="Marshall-Lerner Condition" 
                value={result.ml_condition === 'Holds' ? 'HOLDS (Sum > 1)' : 'FAILS (Sum ≤ 1)'} 
                icon={<TrendingUp className={result.ml_condition === 'Holds' ? "text-emerald-500" : "text-red-500"} />} 
                description={result.ml_condition === 'Holds' ? "Devaluation improves Trade Balance in long run." : "Devaluation permanently worsens Trade Balance."}
              />
            </div>

            <div className="h-48 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center mb-1">Dynamic J-Curve Trade Balance Path</span>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="Period" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <ReferenceLine y={0} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="Trade Balance (₦)" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'fiscal_policy': {
        const g = values.g !== undefined ? values.g : 500;
        const t = values.t !== undefined ? values.t : 400;
        const mpc = values.mpc !== undefined ? values.mpc : 0.75;
        const c0 = values.c0 !== undefined ? values.c0 : 200;
        const i = values.i !== undefined ? values.i : 300;

        const isSurplus = parseFloat(result.budgetBalance) >= 0;
        const absBalance = Math.abs(parseFloat(result.budgetBalance)).toFixed(2);

        const cVal = parseFloat(result.consumption);
        const totalExp = cVal + i + g;
        const shares = [
          { name: 'Consumption (C)', value: cVal, color: '#3b82f6' },
          { name: 'Investment (I)', value: i, color: '#f59e0b' },
          { name: 'Govt Spending (G)', value: g, color: '#10b981' }
        ];

        return (
          <div className="space-y-4">
            <ResultCard 
              label="Equilibrium National Income (Y)" 
              value={`₦${result.equilibriumY}b`} 
              icon={<Coins className="text-emerald-500" />} 
              description={`Y = Multiplier (${result.multiplier}x) × Autonomous Spending (₦${result.autonomousSpending}b)`} 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard 
                label="Fiscal Budget Balance" 
                value={isSurplus ? `+₦${absBalance}b` : `-₦${absBalance}b`} 
                icon={<Scale className={isSurplus ? "text-emerald-500" : "text-rose-500"} />} 
                description={isSurplus ? "Fiscal Surplus (Taxes > Spending)" : "Fiscal Deficit (Spending > Taxes)"} 
              />
              <div className="bg-card border border-border p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-paper dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <TrendingUp className="text-sky-500" size={14} />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-muted uppercase tracking-wider text-right">Keynesian Multiplier</span>
                </div>
                <div className="text-base sm:text-xl md:text-2xl font-bold text-ink mb-0.5 tracking-tight">{result.multiplier}x</div>
                <p className="text-[9px] sm:text-[10px] text-muted leading-relaxed font-semibold">Every ₦1 of govt spending creates ₦{result.multiplier} of national income.</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-border space-y-2">
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Aggregate Demand Composition (C + I + G)</h4>
              <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                {shares.map((part, idx) => {
                  const pct = totalExp > 0 ? (part.value / totalExp) * 100 : 0;
                  return (
                    <div 
                      key={idx} 
                      className="h-full transition-all" 
                      style={{ width: `${pct}%`, backgroundColor: part.color }}
                      title={`${part.name}: ${pct.toFixed(1)}%`}
                    />
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[9px] font-semibold text-muted">
                {shares.map((part, idx) => {
                  const pct = totalExp > 0 ? (part.value / totalExp) * 100 : 0;
                  return (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: part.color }}></span>
                      <span className="truncate">{part.name}: {pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] text-muted leading-relaxed text-center italic">
              Disposable Income: ₦{result.disposableIncome}b | Autonomous Consumption (C0): ₦{c0}b | Tax Multiplier: {result.taxMultiplier}x
            </p>
          </div>
        );
      }
    }
  };

  const [isExplanationExpanded, setIsExplanationExpanded] = useState(true);

  const renderWorkedOutSolution = () => {
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
      case 'fiscal_policy': {
        const g = values.g !== undefined ? values.g : 500;
        const t = values.t !== undefined ? values.t : 400;
        const mpc = values.mpc !== undefined ? values.mpc : 0.75;
        const c0 = values.c0 !== undefined ? values.c0 : 200;
        const i = values.i !== undefined ? values.i : 300;

        const multiplier = 1 / (1 - mpc);
        const autoSpend = c0 - mpc * t + i + g;
        const eqY = multiplier * autoSpend;

        formulaText = "k = \\frac{1}{1 - mpc} \\quad Y = k \\times [C_0 - mpc(T) + I + G]";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Calculate the Keynesian Spending Multiplier (<InlineMath math="k" />):</strong> <InlineMath math={`k = \\frac{1}{1 - mpc} = \\frac{1}{1 - ${mpc}} = ${multiplier.toFixed(2)}`} />x</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate total autonomous spending (<InlineMath math="A" />):</strong> <InlineMath math={`A = C_0 - mpc(T) + I + G = ${c0} - ${mpc}(${t}) + ${i} + ${g} = ₦${autoSpend.toFixed(2)}`} />b</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Multiply to find Equilibrium National Income (<InlineMath math="Y" />):</strong> <InlineMath math={`Y = k \\times A = ${multiplier.toFixed(2)} \\times ${autoSpend.toFixed(2)} = ₦${eqY.toFixed(2)}`} />b</div>
        ];
        interpretationTitle = "Macroeconomic Multiplier and Fiscal Stance";
        interpretationText = `The Keynesian multiplier of ${multiplier.toFixed(2)}x indicates that any change in government spending, autonomous investment, or consumption will be magnified ${multiplier.toFixed(2)} times in the national economy. With Govt Spending at ₦${g}b and Taxes at ₦${t}b, the government has a budget ${t - g >= 0 ? 'SURPLUS' : 'DEFICIT'} of ₦${Math.abs(t - g).toFixed(2)}b. To stimulate a stagnant economy, policy makers can leverage the multiplier by raising government spending or cutting taxes.`;
        break;
      }
      case 'comparative_advantage': {
        const prod_a_c = values.prod_a_c !== undefined ? values.prod_a_c : 10;
        const prod_a_m = values.prod_a_m !== undefined ? values.prod_a_m : 2;
        const prod_b_c = values.prod_b_c !== undefined ? values.prod_b_c : 5;
        const prod_b_m = values.prod_b_m !== undefined ? values.prod_b_m : 5;

        formulaText = "OC_{\\text{Cocoa}} = \\frac{\\text{Output of Machinery}}{\\text{Output of Cocoa}} \\quad \\text{and} \\quad OC_{\\text{Machinery}} = \\frac{\\text{Output of Cocoa}}{\\text{Output of Machinery}}";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Calculate Country A's Opportunity Cost of Cocoa:</strong> <InlineMath math={`OC_{Cocoa}^A = \\frac{${prod_a_m}}{${prod_a_c}} = ${result.oc_a_c}`} /> Machinery.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate Country A's Opportunity Cost of Machinery:</strong> <InlineMath math={`OC_{Machinery}^A = \\frac{${prod_a_c}}{${prod_a_m}} = ${result.oc_a_m}`} /> Cocoa.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Calculate Country B's Opportunity Cost of Cocoa:</strong> <InlineMath math={`OC_{Cocoa}^B = \\frac{${prod_b_m}}{${prod_b_c}} = ${result.oc_b_c}`} /> Machinery.</div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Calculate Country B's Opportunity Cost of Machinery:</strong> <InlineMath math={`OC_{Machinery}^B = \\frac{${prod_b_c}}{${prod_b_m}} = ${result.oc_b_m}`} /> Cocoa.</div>,
          <div key="s5" className="flex items-center gap-1 flex-wrap"><strong>Step 5: Determine Comparative Advantage:</strong> Compare opportunity costs. Cocoa specialist is {result.comp_c} (lower cost of {result.comp_c === 'Country A' ? result.oc_a_c : result.oc_b_c} vs {result.comp_c === 'Country A' ? result.oc_b_c : result.oc_a_c}). Machinery specialist is {result.comp_m} (lower cost of {result.comp_m === 'Country A' ? result.oc_a_m : result.oc_b_m} vs {result.comp_m === 'Country A' ? result.oc_b_m : result.oc_a_m}).</div>
        ];
        interpretationTitle = "Ricardian Comparative Advantage & Terms of Trade";
        interpretationText = `Country A holds a comparative advantage in Cocoa, while Country B holds it in Machinery. Trade is mutually beneficial if the Terms of Trade (TOT) for 1 unit of Cocoa settles between their respective opportunity costs: ${result.oc_a_c} < TOT < ${result.oc_b_c} units of Machinery. Specialization allows both countries to consume outside their local production possibility frontiers (PPF), maximizing global economic welfare.`;
        break;
      }
      case 'heckscher_ohlin': {
        const k_a = values.k_a !== undefined ? values.k_a : 80;
        const l_a = values.l_a !== undefined ? values.l_a : 40;
        const k_b = values.k_b !== undefined ? values.k_b : 30;
        const l_b = values.l_b !== undefined ? values.l_b : 60;

        formulaText = "\\text{Capital-Labor Ratio} = \\frac{K}{L}";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Compute Country A's relative factor endowment:</strong> <InlineMath math={`\\left(\\frac{K}{L}\\right)_A = \\frac{${k_a}}{${l_a}} = ${result.ratio_a}`} />.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Compute Country B's relative factor endowment:</strong> <InlineMath math={`\\left(\\frac{K}{L}\\right)_B = \\frac{${k_b}}{${l_b}} = ${result.ratio_b}`} />.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Compare Factor Abundance:</strong> Since <InlineMath math={`${result.ratio_a} > ${result.ratio_b}`} />, Country A is relatively capital-abundant, and Country B is relatively labor-abundant.</div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Identify Factor Intensities:</strong> Assume Machinery is capital-intensive and Textiles are labor-intensive.</div>,
          <div key="s5" className="flex items-center gap-1 flex-wrap"><strong>Step 5: Apply Heckscher-Ohlin Theorem:</strong> Capital-abundant Country A should export Machinery. Labor-abundant Country B should export Textiles.</div>
        ];
        interpretationTitle = "Heckscher-Ohlin Endowment Theorem & Stolper-Samuelson Effect";
        interpretationText = `The Heckscher-Ohlin theorem states that a nation will export goods that intensively utilize its relatively abundant and cheap factor of production. Based on these ratios, Country A specializes in Capital-intensive products, while Country B specializes in Labor-intensive ones. Under the Stolper-Samuelson effect, trade will increase the real return of the abundant factor (capitalists in Country A, workers in Country B) and decrease the real return of the scarce factor, causing internal income redistribution.`;
        break;
      }
      case 'tariff_simulation': {
        const tariff = values.tariff !== undefined ? values.tariff : 10;
        formulaText = "CS_{\\text{loss}} = \\frac{1}{2}(Q_{d1} + Q_{d2})t \\quad PS_{\\text{gain}} = \\frac{1}{2}(Q_{s1} + Q_{s2})t \\quad GovRev = M_{t} \\times t \\quad DWL = CS_{\\text{loss}} - PS_{\\text{gain}} - GovRev";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Calculate Domestic Prices:</strong> Free trade price = ₦{result.p_free}. Tariff price = ₦{result.p_tariff}. Price hike = ₦{tariff}.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate Consumer Surplus (CS) Loss:</strong> <InlineMath math={`\\Delta CS = 0.5 \\times (${result.q_d_free} + ${result.q_d_tariff}) \\times ${tariff} = ₦${result.cs_loss}`} />.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Calculate Producer Surplus (PS) Gain:</strong> <InlineMath math={`\\Delta PS = 0.5 \\times (${result.q_s_free} + ${result.q_s_tariff}) \\times ${tariff} = ₦${result.ps_gain}`} />.</div>,
          <div key="s4" className="flex items-center gap-1 flex-wrap"><strong>Step 4: Calculate Government Revenue Collected:</strong> <InlineMath math={`GovRev = Imports \\times Tariff = ${result.imports_tariff} \\times ${tariff} = ₦${result.gov_rev}`} />.</div>,
          <div key="s5" className="flex items-center gap-1 flex-wrap"><strong>Step 5: Calculate Deadweight Loss (DWL):</strong> <InlineMath math={`DWL = CS_{loss} - PS_{gain} - GovRev = ${result.cs_loss} - ${result.ps_gain} - ${result.gov_rev} = ₦${result.dwl}`} />.</div>
        ];
        interpretationTitle = "Partial Equilibrium Tariff Welfare Effects";
        interpretationText = `Imposing a tariff of ₦${tariff} raises the domestic price, causing a transfer of wealth. Consumers lose ₦${result.cs_loss} of surplus. Part of this loss is redistributed to domestic producers (₦${result.ps_gain}) and the government (₦${result.gov_rev}). The remaining ₦${result.dwl} is pure Deadweight Loss (DWL) - representing a net social efficiency loss consisting of production distortion (excessive domestic production by less efficient firms) and consumption distortion (unnecessary curtailment of consumer choice).`;
        break;
      }
      case 'j_curve': {
        const e_x = values.e_x !== undefined ? values.e_x : 0.6;
        const e_m = values.e_m !== undefined ? values.e_m : 0.5;
        formulaText = "\\eta_x + \\eta_m > 1";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Identify Price Elasticities of Demand:</strong> Exports elasticity (<InlineMath math="\\eta_x" />) = {e_x}. Imports elasticity (<InlineMath math="\\eta_m" />) = {e_m}.</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Sum the Elasticities:</strong> <InlineMath math={`\\eta_x + \\eta_m = ${e_x} + ${e_m} = ${result.sum_elasticities}`} />.</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Test Marshall-Lerner Condition:</strong> Since sum is {result.sum_elasticities} ({result.ml_condition === 'Holds' ? '> 1' : '≤ 1'}), the Marshall-Lerner condition {result.ml_condition === 'Holds' ? 'holds' : 'fails'}.</div>
        ];
        interpretationTitle = "Marshall-Lerner Condition & J-Curve Dynamics";
        interpretationText = result.ml_condition === 'Holds'
          ? `Because the sum of elasticities (${result.sum_elasticities}) exceeds 1, devaluation will successfully improve the trade balance in the long run. However, in the short run (t=1, t=2), trade balance temporarily deteriorates because purchase contracts are fixed (prices adjust faster than quantities), creating the classic J-Curve shape.`
          : `Because the sum of elasticities (${result.sum_elasticities}) is less than or equal to 1, the Marshall-Lerner condition fails. Devaluation will permanently worsen the trade balance because export and import quantities are too price-inelastic to offset the currency depreciation loss.`;
        break;
      }
      default: {
        formulaText = "Value_{computed} = f(Parameters_{input})";
        steps = [
          <div key="s1"><strong>Step 1: Parse Inputs:</strong> Successfully captured all parameters and values: {Object.entries(values).map(([k, v]) => `${k.toUpperCase()} = ${v}`).join(', ')}.</div>,
          <div key="s2"><strong>Step 2: Apply Economic Formula:</strong> Calculated the mathematical output using standard theoretical modeling algorithms.</div>,
          <div key="s3"><strong>Step 3: Live Output Updated:</strong> Refreshed the live charts and analytics tables to match your custom parameters.</div>
        ];
        interpretationTitle = "Educational Insights";
        interpretationText = "Adjust any slider or input value on the left panel. The live graph and table values on the right panel will immediately update in real-time, allowing you to observe direct mathematical correlations, sensitivity thresholds, and optimal economic clearing points.";
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
              Show Worked-out Solution & Economic Interpretation
            </span>
          </div>
          {isExplanationExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </button>

        {isExplanationExpanded && (
          <div className="mt-4 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-border space-y-6">
            <div>
              <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Percent size={12} /> Core Formula Used
              </h4>
              <div className="p-4 bg-white dark:bg-slate-950 border border-border rounded-xl text-center font-mono text-sm overflow-x-auto text-ink flex justify-center py-5">
                <BlockMath math={formulaText} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calculator size={12} /> Step-by-Step Mathematical Workout
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
      
      {renderWorkedOutSolution()}
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
