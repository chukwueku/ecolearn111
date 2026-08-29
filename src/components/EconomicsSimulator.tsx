import React from 'react';
import { StatsSimulator } from './StatsSimulator';
import { MicroEconomicsSimulator, type MicroMode } from './simulators/MicroEconomicsSimulator';
import { MacroEconomicsSimulator, type MacroMode } from './simulators/MacroEconomicsSimulator';
import { FinancialEconomicsSimulator, type FinancialMode } from './simulators/FinancialEconomicsSimulator';
import { InternationalEconomicsSimulator, type InternationalMode } from './simulators/InternationalEconomicsSimulator';
import { MonetaryEconomicsSimulator, type MonetaryMode } from './simulators/MonetaryEconomicsSimulator';

export type SimulatorMode = 
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

export interface SimulatorProps {
  mode: SimulatorMode;
  title?: string;
  initialValues?: Record<string, number>;
}

export const EconomicsSimulator: React.FC<SimulatorProps> = ({ mode, title, initialValues }) => {
  const statsModes: string[] = [
    'descriptive_stats',
    'probability',
    'statistical_inference',
    'hypothesis_testing',
    'simple_regression',
    'multiple_regression',
    'autocorrelation'
  ];

  const microModes: MicroMode[] = ['utility', 'elasticity', 'equilibrium', 'production', 'cost_revenue'];
  const macroModes: MacroMode[] = ['inflation', 'money_multiplier', 'taylor_rule', 'fiscal_policy', 'labour_market', 'population', 'nigerian_economy', 'distributive_trade'];
  const financialModes: FinancialMode[] = ['future_value', 'capital_budgeting', 'bond_valuation', 'capm'];
  const internationalModes: InternationalMode[] = ['exchange_rate', 'comparative_advantage', 'heckscher_ohlin', 'tariff_simulation', 'j_curve'];
  const monetaryModes: MonetaryMode[] = ['barter_pricing', 'baumol_tobin'];

  if (statsModes.includes(mode)) {
    return <StatsSimulator mode={mode as any} title={title} initialValues={initialValues} />;
  }

  if (microModes.includes(mode as MicroMode)) {
    return <MicroEconomicsSimulator mode={mode as MicroMode} initialValues={initialValues} title={title} />;
  }

  if (macroModes.includes(mode as MacroMode)) {
    return <MacroEconomicsSimulator mode={mode as MacroMode} initialValues={initialValues} title={title} />;
  }

  if (financialModes.includes(mode as FinancialMode)) {
    return <FinancialEconomicsSimulator mode={mode as FinancialMode} initialValues={initialValues} title={title} />;
  }

  if (internationalModes.includes(mode as InternationalMode)) {
    return <InternationalEconomicsSimulator mode={mode as InternationalMode} initialValues={initialValues} title={title} />;
  }

  if (monetaryModes.includes(mode as MonetaryMode)) {
    return <MonetaryEconomicsSimulator mode={mode as MonetaryMode} initialValues={initialValues} title={title} />;
  }

  return (
    <div className="p-6 bg-card border border-border rounded-2xl text-center text-muted">
      <p className="text-sm font-semibold">Simulator mode &ldquo;{mode}&rdquo; is not recognized.</p>
    </div>
  );
};

export default EconomicsSimulator;
