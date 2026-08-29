import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Info, Percent, Coins, ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InlineMath, BlockMath } from '../MathComponents';
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
  Legend
} from 'recharts';
import { Input, ResultCard, ToggleGroup } from './SimulatorShared';

export type FinancialMode = 'future_value' | 'capital_budgeting' | 'bond_valuation' | 'capm';

export interface FinancialSimulatorProps {
  mode: FinancialMode;
  initialValues?: Record<string, number>;
  title?: string;
}

export const FinancialEconomicsSimulator: React.FC<FinancialSimulatorProps> = ({ mode, initialValues, title }) => {
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
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(true);

  const handleInputChange = (key: string, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    setValues(prev => ({ ...prev, [key]: numVal }));
  };

  const handleInputChangeDirect = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  useEffect(() => {
    calculate();
  }, [values, mode]);

  const calculate = () => {
    switch (mode) {
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
    }
  };

  const renderWorkedOutSolution = () => {
    if (!result) return null;

    let formulaText = "";
    let steps: React.ReactNode[] = [];
    let interpretationTitle = "";
    let interpretationText = "";

    switch (mode) {
      case 'future_value': {
        const pv = values.pv !== undefined ? values.pv : 1000;
        const r = values.r !== undefined ? values.r : 8;
        const n = values.n !== undefined ? values.n : 5;
        const m = values.m !== undefined ? values.m : 1;
        formulaText = m === -1 ? "FV = PV \\times e^{r \\times n}" : "FV = PV \\left(1 + \\frac{r}{m}\\right)^{n \\times m}";
        steps = [
          <div key="s1"><strong>Step 1: Identify Parameters:</strong> Principal (PV) = ₦{pv}, Annual Rate (r) = {r}%, Time (n) = {n} years, Compounding frequency (m) = {m === -1 ? 'Continuous' : m}.</div>,
          <div key="s2"><strong>Step 2: Calculate Compounding Factor:</strong> {m === -1 ? `e^(${r / 100} × ${n})` : `(1 + ${(r / 100 / (m || 1)).toFixed(4)})^(${n * (m || 1)})`}</div>,
          <div key="s3"><strong>Step 3: Compute Future Value:</strong> FV = ₦{result.fv}. Total Interest = ₦{result.interest}. Compounding bonus over simple interest = ₦{result.gain}.</div>
        ];
        interpretationTitle = "Time Value of Money & Compound Growth";
        interpretationText = `A present capital sum of ₦${pv} compounded at ${r}% for ${n} years will grow into ₦${result.fv}. Compounding interest magnifies earnings exponentially over time because returns earn subsequent returns. Notice how higher compounding frequency (semi-annual, quarterly, monthly, or continuous) increases final wealth compared to standard annual compounding.`;
        break;
      }
      case 'capital_budgeting': {
        const outlay = values.outlay !== undefined ? values.outlay : 1000;
        const rate = values.rate !== undefined ? values.rate : 10;
        formulaText = "NPV = \\sum_{t=1}^{n} \\frac{CF_t}{(1+k)^t} - CF_0 \\quad \\text{and} \\quad PI = \\frac{\\sum_{t=1}^n \\frac{CF_t}{(1+k)^t}}{CF_0}";
        steps = [
          <div key="s1"><strong>Step 1: Initial Investment:</strong> CF₀ = ₦{outlay} at required cost of capital k = {rate}%.</div>,
          <div key="s2"><strong>Step 2: Discount Inflows:</strong> Discounted cash flows summed to compute Present Value of Inflows.</div>,
          <div key="s3"><strong>Step 3: Compute NPV:</strong> NPV = PV Inflows - CF₀ = ₦{result.npv}. IRR = {result.irr}. PI = {result.pi}. Payback = {result.payback}.</div>
        ];
        interpretationTitle = "Capital Investment Appraisal Criteria";
        interpretationText = parseFloat(result.npv) >= 0
          ? `With an NPV of +₦${result.npv} and an IRR of ${result.irr} exceeding the hurdle rate (${rate}%), this project generates economic value above the firm's opportunity cost of capital and should be ACCEPTED.`
          : `With an NPV of ₦${result.npv}, this project does not yield sufficient cash flows to cover the required return of ${rate}% and will destroy shareholder wealth. It should be REJECTED.`;
        break;
      }
      case 'bond_valuation': {
        const face = values.face !== undefined ? values.face : 1000;
        const coupon = values.coupon !== undefined ? values.coupon : 6;
        const ytm = values.ytm !== undefined ? values.ytm : 5;
        formulaText = "P = \\sum_{t=1}^{n} \\frac{C}{(1+y)^t} + \\frac{M}{(1+y)^n}";
        steps = [
          <div key="s1"><strong>Step 1: Coupon Stream:</strong> Annual coupon = {coupon}% × ₦{face} = ₦{result.annualPayment}.</div>,
          <div key="s2"><strong>Step 2: Discount Rate:</strong> Yield to Maturity (YTM) = {ytm}%.</div>,
          <div key="s3"><strong>Step 3: Bond Price & Yields:</strong> Fair Intrinsic Price = ₦{result.price}. Current Yield = {result.currentYield}. Capital Gain Yield = {result.capGainYield}. Status: {result.pricingStatus}.</div>
        ];
        interpretationTitle = "Bond Pricing Dynamics & Interest Rate Risk";
        interpretationText = coupon > ytm
          ? `Because the coupon rate (${coupon}%) exceeds the market yield (${ytm}%), investors pay a PREMIUM (₦${result.price} > ₦${face}) to receive higher coupon payments.`
          : coupon < ytm
          ? `Because the coupon rate (${coupon}%) is lower than market yields (${ytm}%), the bond trades at a DISCOUNT (₦${result.price} < ₦${face}) to compensate buyers.`
          : `Because coupon equals yield (${coupon}% = ${ytm}%), the bond trades exactly at PAR VALUE (₦${face}).`;
        break;
      }
      case 'capm': {
        const rf = values.rf !== undefined ? values.rf : 4;
        const beta = values.beta !== undefined ? values.beta : 1.2;
        formulaText = "E(R_i) = R_f + \\beta_i [E(R_m) - R_f]";
        steps = [
          <div key="s1"><strong>Step 1: Identify Inputs:</strong> Risk-free rate (Rf) = {rf}%, Asset Systematic Risk (Beta) = {beta}.</div>,
          <div key="s2"><strong>Step 2: Market Risk Premium:</strong> MRP = [Rm - Rf] = {result.mrp}.</div>,
          <div key="s3"><strong>Step 3: Calculate Required Return:</strong> Re = {rf}% + ({beta} × {result.mrp}) = {result.expectedReturn}.</div>
        ];
        interpretationTitle = "Capital Asset Pricing Model (CAPM) & Security Market Line";
        interpretationText = `An asset with a beta of ${beta} is ${beta > 1 ? `${((beta - 1) * 100).toFixed(0)}% more volatile` : `${((1 - beta) * 100).toFixed(0)}% less volatile`} than the overall market. Under CAPM, investors require an expected equity return of ${result.expectedReturn} to hold this level of non-diversifiable systematic risk.`;
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
              Show Worked-out Solution & Financial Interpretation
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
            {title || 'Financial Economics Simulator'}
          </h3>
          <p className="text-sky-400 dark:text-sky-300 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] font-bold truncate">
            Valuation & Corporate Finance Engine
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
