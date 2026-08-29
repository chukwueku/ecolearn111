import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Info, Percent, Coins, ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';
import { InlineMath, BlockMath } from '../MathComponents';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Input, ResultCard, ToggleGroup } from './SimulatorShared';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MacroMode = 'inflation' | 'money_multiplier' | 'taylor_rule' | 'fiscal_policy' | 'labour_market' | 'population' | 'nigerian_economy' | 'distributive_trade';

export interface MacroSimulatorProps {
  mode: MacroMode;
  initialValues?: Record<string, number>;
  title?: string;
}

export const MacroEconomicsSimulator: React.FC<MacroSimulatorProps> = ({ mode, initialValues, title }) => {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
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
      case 'inflation': {
        const { p1, p2 } = values;
        if (p1 && p1 !== 0) {
          const rate = ((p2 - p1) / p1) * 100;
          setResult({ rate: rate.toFixed(2) });
        }
        break;
      }
      case 'money_multiplier': {
        const { mb, rr, cr, er } = values;
        const reqReserveRatio = (rr !== undefined ? rr : 10) / 100;
        const currRatio = (cr !== undefined ? cr : 0) / 100;
        const excessRatio = (er !== undefined ? er : 0) / 100;
        const monetaryBase = mb !== undefined ? mb : 1000000;

        const m1Mult = (1 + currRatio) / (reqReserveRatio + excessRatio + currRatio);
        const simpleMult = 1 / reqReserveRatio;

        const m1Supply = monetaryBase * m1Mult;
        
        const deposits = m1Supply / (1 + currRatio);
        const currencyDrain = deposits * currRatio;
        const requiredReserves = deposits * reqReserveRatio;
        const excessReserves = deposits * excessRatio;

        setResult({
          m1Mult: m1Mult.toFixed(2),
          simpleMult: simpleMult.toFixed(2),
          m1Supply: m1Supply.toFixed(2),
          requiredReserves: requiredReserves.toFixed(2),
          excessReserves: excessReserves.toFixed(2),
          currencyDrain: currencyDrain.toFixed(2)
        });
        break;
      }
      case 'taylor_rule': {
        const { r_star, target_inf, current_inf, output_gap, alpha, beta } = values;
        const rs = r_star !== undefined ? r_star : 2;
        const pt = target_inf !== undefined ? target_inf : 2;
        const pc = current_inf !== undefined ? current_inf : 4;
        const y_gap = output_gap !== undefined ? output_gap : 2;
        const a = alpha !== undefined ? alpha : 0.5;
        const b = beta !== undefined ? beta : 0.5;

        const inf_gap = pc - pt;
        const nominal_rate = pc + rs + a * y_gap + b * inf_gap;
        const real_rate = nominal_rate - pc;

        setResult({
          nominal_rate: nominal_rate.toFixed(2) + '%',
          real_rate: real_rate.toFixed(2) + '%',
          inf_gap: inf_gap.toFixed(2) + '%'
        });
        break;
      }
      case 'population': {
        const { initial_population, birth_rate, death_rate, net_migration_rate, years_to_project } = values;
        const initPop = initial_population !== undefined ? initial_population : 200;
        const br = birth_rate !== undefined ? birth_rate : 38;
        const dr = death_rate !== undefined ? death_rate : 11;
        const nm = net_migration_rate !== undefined ? net_migration_rate : -1;
        const yrs = years_to_project !== undefined ? years_to_project : 10;

        const growthRatePer1000 = br - dr + nm;
        const growthRatePct = growthRatePer1000 / 10;
        
        let finalPop = initPop;
        for (let i = 0; i < yrs; i++) {
          finalPop = finalPop * (1 + growthRatePct / 100);
        }

        const doublingTime = growthRatePct > 0 ? 70 / growthRatePct : 0;

        setResult({
          growthRatePct: growthRatePct.toFixed(2) + '%',
          projectedPop: finalPop.toFixed(2) + 'M',
          doublingTime: doublingTime > 0 ? doublingTime.toFixed(1) + ' Years' : 'N/A (Shrinking)'
        });
        break;
      }
      case 'labour_market': {
        const { working_age_pop, participation_rate, unemployment_rate } = values;
        const wPop = working_age_pop !== undefined ? working_age_pop : 120;
        const pr = participation_rate !== undefined ? participation_rate : 65;
        const ur = unemployment_rate !== undefined ? unemployment_rate : 33;

        const lf = wPop * (pr / 100);
        const unemployed = lf * (ur / 100);
        const employed = lf - unemployed;

        setResult({
          labourForce: lf.toFixed(1) + 'M',
          employed: employed.toFixed(1) + 'M',
          unemployed: unemployed.toFixed(1) + 'M'
        });
        break;
      }
      case 'nigerian_economy': {
        const { oil_price, oil_production, exchange_rate, other_rev_trillions } = values;
        const p = oil_price !== undefined ? oil_price : 75;
        const q = oil_production !== undefined ? oil_production : 1.4;
        const xr = exchange_rate !== undefined ? exchange_rate : 1500;
        const other = other_rev_trillions !== undefined ? other_rev_trillions : 12;

        const dailyOilUsd = p * q;
        const dailyOilNgn = dailyOilUsd * xr;
        const annualOilNgnTrillion = (dailyOilNgn * 365) / 1000000;

        const totalRevenue = annualOilNgnTrillion + other;
        const oilShare = (annualOilNgnTrillion / totalRevenue) * 100;

        setResult({
          oilRevenue: annualOilNgnTrillion.toFixed(2) + 'T ₦',
          totalRevenue: totalRevenue.toFixed(2) + 'T ₦',
          oilShare: oilShare.toFixed(1) + '%'
        });
        break;
      }
      case 'distributive_trade': {
        const { producer_cost, wholesaler_markup, retailer_markup, logistics_cost } = values;
        const cost = producer_cost !== undefined ? producer_cost : 1000;
        const wMarkup = wholesaler_markup !== undefined ? wholesaler_markup : 15;
        const rMarkup = retailer_markup !== undefined ? retailer_markup : 25;
        const logistics = logistics_cost !== undefined ? logistics_cost : 200;

        const wPrice = cost * (1 + wMarkup / 100);
        const rPrice = (wPrice + logistics) * (1 + rMarkup / 100);

        const directPrice = cost + logistics;
        const premium = rPrice - directPrice;
        const infPct = (premium / directPrice) * 100;

        setResult({
          final_consumer_price: '₦' + rPrice.toFixed(2),
          direct_price: '₦' + directPrice.toFixed(2),
          premium: '₦' + premium.toFixed(2),
          inflation_pct: infPct.toFixed(1) + '%'
        });
        break;
      }
      case 'fiscal_policy': {
        const { mpc, t, g, i, c0 } = values;
        const mpcVal = mpc !== undefined ? mpc : 0.75;
        const tVal = t !== undefined ? t : 400;
        const gVal = g !== undefined ? g : 500;
        const iVal = i !== undefined ? i : 300;
        const c0Val = c0 !== undefined ? c0 : 200;

        const multiplier = 1 / (1 - mpcVal);
        const taxMultiplier = -mpcVal / (1 - mpcVal);
        
        const autoSpending = c0Val - (mpcVal * tVal) + iVal + gVal;
        const equilibriumY = multiplier * autoSpending;
        
        const disposableIncome = equilibriumY - tVal;
        const consumption = c0Val + mpcVal * disposableIncome;
        
        const budgetBalance = tVal - gVal;

        setResult({
          multiplier: multiplier.toFixed(2),
          taxMultiplier: taxMultiplier.toFixed(2),
          autonomousSpending: autoSpending.toFixed(2),
          equilibriumY: equilibriumY.toFixed(2),
          disposableIncome: disposableIncome.toFixed(2),
          consumption: consumption.toFixed(2),
          budgetBalance: budgetBalance.toFixed(2)
        });
        break;
      }
    }
  };

  const renderInputs = () => {
    switch (mode) {
      case 'inflation':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <Input label="CPI Year 1 (P₁)" value={values.p1} onChange={v => handleInputChange('p1', v)} />
            <Input label="CPI Year 2 (P₂)" value={values.p2} onChange={v => handleInputChange('p2', v)} />
          </div>
        );
      case 'money_multiplier':
        return (
          <div className="space-y-3">
            <Input label="Monetary Base (MB ₦)" value={values.mb} onChange={v => handleInputChange('mb', v)} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
              <Input label="Required Reserve Ratio (rr %)" value={values.rr} onChange={v => handleInputChange('rr', v)} />
              <Input label="Currency Drain Ratio (cr %)" value={values.cr} onChange={v => handleInputChange('cr', v)} />
              <Input label="Excess Reserve Ratio (er %)" value={values.er} onChange={v => handleInputChange('er', v)} />
            </div>
            <p className="text-[10px] text-muted italic">
              Advanced Multiplier = $(1 + cr) / (rr + er + cr)$
            </p>
          </div>
        );
      case 'taylor_rule':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <Input label="Current Inflation Rate (π %)" value={values.current_inf} onChange={v => handleInputChange('current_inf', v)} />
            <Input label="Target Inflation Rate (π* %)" value={values.target_inf} onChange={v => handleInputChange('target_inf', v)} />
            <Input label="Output Gap (GDP %)" value={values.output_gap} onChange={v => handleInputChange('output_gap', v)} />
            <Input label="Neutral Real Rate (r* %)" value={values.r_star} onChange={v => handleInputChange('r_star', v)} />
          </div>
        );
      case 'population':
        return (
          <div className="space-y-3">
            <Input label="Initial Population (Millions)" value={values.initial_population} onChange={v => handleInputChange('initial_population', v)} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
              <Input label="Births per 1000" value={values.birth_rate} onChange={v => handleInputChange('birth_rate', v)} />
              <Input label="Deaths per 1000" value={values.death_rate} onChange={v => handleInputChange('death_rate', v)} />
              <Input label="Net Migration per 1000" value={values.net_migration_rate} onChange={v => handleInputChange('net_migration_rate', v)} />
            </div>
            <Input label="Projection Horizon (Years)" value={values.years_to_project} onChange={v => handleInputChange('years_to_project', v)} />
          </div>
        );
      case 'labour_market':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <Input label="Working Age Pop (Millions)" value={values.working_age_pop} onChange={v => handleInputChange('working_age_pop', v)} />
            <Input label="Participation Rate (%)" value={values.participation_rate} onChange={v => handleInputChange('participation_rate', v)} />
            <Input label="Unemployment Rate (%)" value={values.unemployment_rate} onChange={v => handleInputChange('unemployment_rate', v)} />
          </div>
        );
      case 'nigerian_economy':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Crude Oil Price ($/barrel)" value={values.oil_price} onChange={v => handleInputChange('oil_price', v)} />
              <Input label="Production (Millions barrels/day)" value={values.oil_production} onChange={v => handleInputChange('oil_production', v)} step={0.1} />
              <Input label="Exchange Rate (₦/$)" value={values.exchange_rate} onChange={v => handleInputChange('exchange_rate', v)} />
              <Input label="Other Non-Oil Revenue (Trillions ₦)" value={values.other_rev_trillions} onChange={v => handleInputChange('other_rev_trillions', v)} />
            </div>
          </div>
        );
      case 'distributive_trade':
        return (
          <div className="space-y-3">
            <Input label="Producer Cost (₦)" value={values.producer_cost} onChange={v => handleInputChange('producer_cost', v)} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
              <Input label="Wholesaler Markup (%)" value={values.wholesaler_markup} onChange={v => handleInputChange('wholesaler_markup', v)} />
              <Input label="Retailer Markup (%)" value={values.retailer_markup} onChange={v => handleInputChange('retailer_markup', v)} />
              <Input label="Logistics/Transport Cost (₦)" value={values.logistics_cost} onChange={v => handleInputChange('logistics_cost', v)} />
            </div>
          </div>
        );
      case 'fiscal_policy':
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <Input label="Marginal Propensity to Consume (mpc)" value={values.mpc} onChange={v => handleInputChange('mpc', v)} step={0.05} />
              <Input label="Autonomous Consumption (C0)" value={values.c0} onChange={v => handleInputChange('c0', v)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
              <Input label="Govt Spending (G)" value={values.g} onChange={v => handleInputChange('g', v)} />
              <Input label="Taxes (T)" value={values.t} onChange={v => handleInputChange('t', v)} />
              <Input label="Investment (I)" value={values.i} onChange={v => handleInputChange('i', v)} />
            </div>
          </div>
        );
    }
  };

  const renderResult = () => {
    if (!result) return null;
    switch (mode) {
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
            </div>
          </div>
        );
      case 'money_multiplier': {
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
            
            <div className="overflow-x-auto border border-border rounded-xl mt-4">
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

            {fdData.length > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl flex items-center justify-center mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={fdData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                      {fdData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
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
        const neutralNominalRate = (values.current_inf || 4) + (values.r_star || 2);
        const taylorCompareData = [
          { name: 'Neutral Policy', Rate: neutralNominalRate },
          { name: 'Taylor Suggested Rate', Rate: parseFloat(result.nominal_rate) }
        ];

        return (
          <div className="space-y-4">
            <ResultCard label="Suggested Nominal Rate" value={result.nominal_rate} icon={<Percent className="text-emerald-500" />} description="Target central bank policy interest rate." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <ResultCard label="Inflation Gap" value={result.inf_gap} icon={<TrendingUp className="text-sky-500" />} />
              <ResultCard label="Implied Real Rate" value={result.real_rate} icon={<Percent className="text-indigo-500" />} description="R - π (adjusted for inflation)" />
            </div>

            <div className="h-36 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl mt-4">
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
      case 'population': {
        const popProjectionData = [];
        let currentPop = values.initial_population || 200;
        const growthRatePct = parseFloat(result.growthRatePct);
        const yrs = values.years_to_project || 10;
        for (let yr = 0; yr <= Math.min(20, yrs); yr++) {
          popProjectionData.push({
            year: `Yr ${yr}`,
            Population: parseFloat(currentPop.toFixed(2)),
          });
          currentPop = currentPop * (1 + growthRatePct / 100);
        }

        return (
          <div className="space-y-4">
            <ResultCard label="Projected Population" value={result.projectedPop} icon={<Scale className="text-emerald-500" />} description="Future population size after projection years." />
            
            {popProjectionData.length > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl mt-4">
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
        const marketAllocData = [
          { name: 'Employed', value: parseFloat(result.employed), color: '#10b981' },
          { name: 'Unemployed', value: parseFloat(result.unemployed), color: '#ef4444' },
          { name: 'Out of Labour Force', value: parseFloat((working - parseFloat(result.labourForce)).toFixed(1)), color: '#64748b' }
        ].filter(item => item.value > 0);

        return (
          <div className="space-y-4">
            <ResultCard label="Active Labour Force" value={result.labourForce} icon={<Scale className="text-emerald-500" />} description="Citizens working or actively searching for employment." />
            
            {marketAllocData.length > 0 && (
              <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl flex items-center justify-center mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={marketAllocData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                      {marketAllocData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
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
        const revPieces = [
          { name: 'Crude Oil exports', value: parseFloat(result.oilRevenue), color: '#f59e0b' },
          { name: 'Other Sector revenues', value: parseFloat(result.totalRevenue) - parseFloat(result.oilRevenue), color: '#10b981' }
        ];

        return (
          <div className="space-y-4">
            <ResultCard label="Annual Oil Revenue" value={result.oilRevenue} icon={<Coins className="text-amber-500" />} description="Projected state intake from crude exports." />
            <ResultCard label="total unified GDP/Rev" value={result.totalRevenue} icon={<Scale className="text-sky-500" />} />
            
            <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-900/30 p-2 border border-border rounded-xl flex items-center justify-center mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revPieces} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                    {revPieces.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: any) => `${value.toFixed(2)}T ₦`} />
                  <Legend wrapperStyle={{ fontSize: '9px' }} layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }
      case 'distributive_trade': {
        return (
          <div className="space-y-4">
            <ResultCard label="Final Consumer Price" value={result.final_consumer_price} icon={<Coins className="text-rose-500" />} description="The price paid by end-users after markups." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <ResultCard label="Direct (No Middlemen)" value={result.direct_price} icon={<Scale className="text-emerald-500" />} />
              <ResultCard label="Middlemen Markup Premium" value={result.premium} icon={<TrendingUp className="text-rose-500" />} />
            </div>
          </div>
        );
      }
      case 'fiscal_policy': {
        const cVal = parseFloat(result.consumption);
        const iVal = values.i || 300;
        const gVal = values.g || 500;
        const totalExp = cVal + iVal + gVal;
        const shares = [
          { name: 'Consumption (C)', value: cVal, color: '#3b82f6' },
          { name: 'Investment (I)', value: iVal, color: '#f59e0b' },
          { name: 'Govt Spending (G)', value: gVal, color: '#10b981' }
        ];

        return (
          <div className="space-y-4">
            <ResultCard label="Equilibrium National Income (Y)" value={`₦${result.equilibriumY}b`} icon={<Coins className="text-emerald-500" />} description={`Y = Multiplier (${result.multiplier}x) × Autonomous Spending (₦${result.autonomousSpending}b)`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <ResultCard label="Fiscal Budget Balance" value={`₦${result.budgetBalance}b`} icon={<Scale className="text-sky-500" />} description="Taxes - Govt Spending" />
              <ResultCard label="Keynesian Multiplier" value={`${result.multiplier}x`} icon={<TrendingUp className="text-indigo-500" />} description="Magnification effect of spending" />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-border space-y-2 mt-4">
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Aggregate Demand Composition (C + I + G)</h4>
              <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                {shares.map((part, idx) => {
                  const pct = totalExp > 0 ? (part.value / totalExp) * 100 : 0;
                  return (
                    <div key={idx} className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: part.color }} />
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
          </div>
        );
      }
    }
  };

  const renderWorkedOutSolution = () => {
    if (!result) return null;

    let steps: React.ReactNode[] = [];
    let interpretationTitle = "";
    let interpretationText = "";
    let formulaText = "";

    switch (mode) {
      case 'fiscal_policy': {
        const { mpc, t, g, i, c0 } = values;
        const multiplier = parseFloat(result.multiplier);
        const autoSpend = parseFloat(result.autonomousSpending);
        const eqY = parseFloat(result.equilibriumY);

        formulaText = "k = \\frac{1}{1 - mpc} \\quad Y = k \\times [C_0 - mpc(T) + I + G]";
        steps = [
          <div key="s1" className="flex items-center gap-1 flex-wrap"><strong>Step 1: Calculate the Keynesian Spending Multiplier (<InlineMath math="k" />):</strong> <InlineMath math={`k = \\frac{1}{1 - mpc} = \\frac{1}{1 - ${mpc}} = ${multiplier.toFixed(2)}`} />x</div>,
          <div key="s2" className="flex items-center gap-1 flex-wrap"><strong>Step 2: Calculate total autonomous spending (<InlineMath math="A" />):</strong> <InlineMath math={`A = C_0 - mpc(T) + I + G = ${c0} - ${mpc}(${t}) + ${i} + ${g} = ₦${autoSpend.toFixed(2)}`} />b</div>,
          <div key="s3" className="flex items-center gap-1 flex-wrap"><strong>Step 3: Multiply to find Equilibrium National Income (<InlineMath math="Y" />):</strong> <InlineMath math={`Y = k \\times A = ${multiplier.toFixed(2)} \\times ${autoSpend.toFixed(2)} = ₦${eqY.toFixed(2)}`} />b</div>
        ];
        interpretationTitle = "Macroeconomic Multiplier and Fiscal Stance";
        interpretationText = `The Keynesian multiplier of ${multiplier.toFixed(2)}x indicates that any change in government spending, autonomous investment, or consumption will be magnified ${multiplier.toFixed(2)} times in the national economy. With Govt Spending at ₦${g}b and Taxes at ₦${t}b, the government has a budget ${(t || 0) - (g || 0) >= 0 ? 'SURPLUS' : 'DEFICIT'} of ₦${Math.abs((t || 0) - (g || 0)).toFixed(2)}b. To stimulate a stagnant economy, policy makers can leverage the multiplier by raising government spending or cutting taxes.`;
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
      <div className="bg-slate-900 dark:bg-emerald-900/40 p-4 sm:p-6 md:p-8 flex items-center gap-3 sm:gap-6">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
          <Calculator size={16} className="sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white text-sm sm:text-base md:text-xl font-bold tracking-tight mb-0.5 break-words leading-tight">{title || 'Macroeconomics Simulator'}</h3>
          <p className="text-emerald-400 dark:text-emerald-300 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] font-bold truncate">Interactive Calculation Engine</p>
        </div>
      </div>
      
      <div className="p-3 sm:p-6 md:p-8 grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-12">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 text-ink border-b border-border pb-2.5 sm:pb-4">
            <Info size={12} className="text-emerald-500" />
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Input Parameters</span>
          </div>
          {renderInputs()}
        </div>

        <div className="bg-paper border border-border rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 sm:gap-3 text-ink mb-4 sm:mb-8 border-b border-border pb-2.5 sm:pb-4">
            <TrendingUp size={12} className="text-emerald-500" />
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
