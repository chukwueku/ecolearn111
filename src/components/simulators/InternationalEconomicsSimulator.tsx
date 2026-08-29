import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Scale, Info, BookOpen, ChevronDown, ChevronUp, Coins, Activity, Lightbulb, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InlineMath, BlockMath } from '../MathComponents';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Input, ResultCard, ToggleGroup } from './SimulatorShared';

export type InternationalMode = 'exchange_rate' | 'comparative_advantage' | 'heckscher_ohlin' | 'tariff_simulation' | 'j_curve';

export interface InternationalSimulatorProps {
  mode: InternationalMode;
  initialValues?: Record<string, number>;
  title?: string;
}

export const InternationalEconomicsSimulator: React.FC<InternationalSimulatorProps> = ({ mode, initialValues, title }) => {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    if (mode === 'exchange_rate') {
      defaults.sim_type = 1;
      defaults.p_d = 1200;
      defaults.p_f = 1000;
      defaults.i_d = 12;
      defaults.i_f = 6;
      defaults.e_exp = 150;
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
    }
  };

  const renderInputs = () => {
    switch (mode) {
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
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Country A Output / labor hour</span>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Cocoa output (units)" value={values.prod_a_c} onChange={v => handleInputChange('prod_a_c', v)} />
                <Input label="Machinery output (units)" value={values.prod_a_m} onChange={v => handleInputChange('prod_a_m', v)} />
              </div>
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Country B Output / labor hour</span>
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
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (mode) {
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
                    <td className="px-3 py-2 font-medium text-ink">Country A</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.oc_a_c}</td>
                    <td className="px-3 py-2 text-right text-ink font-semibold">{result.oc_a_m}</td>
                  </tr>
                  <tr className="bg-slate-50/40 dark:bg-slate-850/20">
                    <td className="px-3 py-2 font-medium text-ink">Country B</td>
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
    }
  };

  const renderWorkedOutSolution = () => {
    if (!result) return null;

    let formulaText = "";
    let steps: React.ReactNode[] = [];
    let interpretationTitle = "";
    let interpretationText = "";

    switch (mode) {
      case 'exchange_rate': {
        if (values.sim_type === 1) {
          formulaText = "E = \\frac{P_d}{P_f}";
          steps = [
            <div key="s1"><strong>Step 1: Identify Price Levels:</strong> Domestic Price Level (Pd) = {values.p_d}, Foreign Price Level (Pf) = {values.p_f}.</div>,
            <div key="s2"><strong>Step 2: Apply Purchasing Power Parity (PPP):</strong> <InlineMath math={`E = \\frac{${values.p_d}}{${values.p_f}} = ${result.ppp_rate}`} />.</div>
          ];
          interpretationTitle = "Purchasing Power Parity (PPP) & Law of One Price";
          interpretationText = `Under absolute PPP, the exchange rate adjusts until identical baskets of tradeable goods cost the same in both currencies. A ratio of ${result.ppp_rate} indicates the equilibrium conversion rate where currency purchasing parity is preserved.`;
        } else {
          formulaText = "(1 + i_d) = \\frac{E^e}{E_t}(1 + i_f) \\implies E_t = \\frac{E^e}{\\frac{1 + i_d}{1 + i_f}}";
          steps = [
            <div key="s1"><strong>Step 1: Interest Rate Differential:</strong> Domestic Rate = {values.i_d}%, Foreign Rate = {values.i_f}%, Expected Spot = {values.e_exp}.</div>,
            <div key="s2"><strong>Step 2: Compute Equilibrium Spot Rate:</strong> <InlineMath math={`E_t = \\frac{${values.e_exp}}{\\frac{1 + ${(values.i_d || 12)/100}}{1 + ${(values.i_f || 6)/100}}} = ${result.uirp_rate}`} />.</div>,
            <div key="s3"><strong>Step 3: Expected Change:</strong> Expected Depreciation / Premium = {result.premium}.</div>
          ];
          interpretationTitle = "Uncovered Interest Rate Parity (UIRP)";
          interpretationText = `UIRP dictates that higher domestic interest yields must be matched by an expected depreciation of the domestic currency (${result.premium}), preventing risk-free cross-border carry arbitrage.`;
        }
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
          <div key="s5" className="flex items-center gap-1 flex-wrap"><strong>Step 5: Determine Comparative Advantage:</strong> Cocoa specialist is {result.comp_c} (lower cost of {result.comp_c === 'Country A' ? result.oc_a_c : result.oc_b_c} vs {result.comp_c === 'Country A' ? result.oc_b_c : result.oc_a_c}). Machinery specialist is {result.comp_m} (lower cost of {result.comp_m === 'Country A' ? result.oc_a_m : result.oc_b_m} vs {result.comp_m === 'Country A' ? result.oc_b_m : result.oc_a_m}).</div>
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
              Show Worked-out Solution & International Trade Theory
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
            {title || 'International Economics Simulator'}
          </h3>
          <p className="text-sky-400 dark:text-sky-300 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] font-bold truncate">
            Trade & Global Finance Modeling
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
