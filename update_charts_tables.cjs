const fs = require('fs');

const filePath = 'src/lib/advancedStudyData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replacements dictionary for each Chapter Key Graphs section
const replacements = [
  {
    target: `**Key Graphs & Tables:**\n- **Fig 1-1:** Per Capita GNP, 1890–2009.\n- **Fig 1-2, 1-3, 1-4, 1-5:** AS-AD diagrams representing the Long Run (vertical AS), Very Long Run (shifting vertical AS), Short Run (horizontal AS), and Medium Run (upward sloping AS).\n- **Fig 1-6:** Phillips curve showing changes in inflation vs. unemployment.\n- **Fig 1-7:** The Business Cycle (peaks, troughs, recession, recovery, trend).\n- **Table 1-1:** Per Capita Real GDP Growth Rates (e.g., China 7.4%, US 2.0%).`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 1-1: Historical Real Per Capita GNP Trend (1890–2009)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 1-1: Long-Run Growth Trend in Real Per Capita GNP (Index 1890=100)",
  "xAxis": "Year",
  "data": [
    { "Year": "1890", "Per Capita GNP": 100, "Trend Line": 100 },
    { "Year": "1910", "Per Capita GNP": 145, "Trend Line": 140 },
    { "Year": "1930", "Per Capita GNP": 180, "Trend Line": 196 },
    { "Year": "1950", "Per Capita GNP": 290, "Trend Line": 275 },
    { "Year": "1970", "Per Capita GNP": 460, "Trend Line": 438 },
    { "Year": "1990", "Per Capita GNP": 710, "Trend Line": 698 },
    { "Year": "2009", "Per Capita GNP": 980, "Trend Line": 980 }
  ],
  "series": [
    { "key": "Per Capita GNP", "name": "Actual Real Per Capita GNP", "color": "#0ea5e9" },
    { "key": "Trend Line", "name": "2% Exponential Trend", "color": "#10b981" }
  ]
}
\`\`\`

#### Fig 1-2 to 1-5: Aggregate Supply Horizons in AS-AD
\`\`\`chart
{
  "type": "line",
  "title": "Fig 1-2 to 1-5: Output (Y) vs Price Level (P) across Time Horizons",
  "xAxis": "Output (Y)",
  "data": [
    { "Output (Y)": "80", "Short Run AS (Horizontal)": 100, "Medium Run AS (Upward)": 80, "Long Run AS (Vertical)": 0, "AD Curve": 150 },
    { "Output (Y)": "100 (Y*)", "Short Run AS (Horizontal)": 100, "Medium Run AS (Upward)": 100, "Long Run AS (Vertical)": 200, "AD Curve": 100 },
    { "Output (Y)": "120", "Short Run AS (Horizontal)": 100, "Medium Run AS (Upward)": 130, "Long Run AS (Vertical)": 0, "AD Curve": 60 }
  ],
  "series": [
    { "key": "Short Run AS (Horizontal)", "name": "Short Run AS (Keynesian)", "color": "#3b82f6" },
    { "key": "Medium Run AS (Upward)", "name": "Medium Run AS", "color": "#f59e0b" },
    { "key": "Long Run AS (Vertical)", "name": "Long Run AS (Y = Y*)", "color": "#10b981" },
    { "key": "AD Curve", "name": "Aggregate Demand (AD)", "color": "#f43f5e" }
  ]
}
\`\`\`

#### Fig 1-6: The Short-Run Phillips Curve (Inflation vs Unemployment)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 1-6: Short-Run Trade-off between Inflation and Unemployment",
  "xAxis": "Unemployment Rate (%)",
  "data": [
    { "Unemployment Rate (%)": "3%", "Inflation Rate (%)": 8.0 },
    { "Unemployment Rate (%)": "4%", "Inflation Rate (%)": 5.2 },
    { "Unemployment Rate (%)": "5% (u*)", "Inflation Rate (%)": 3.0 },
    { "Unemployment Rate (%)": "6%", "Inflation Rate (%)": 1.8 },
    { "Unemployment Rate (%)": "8%", "Inflation Rate (%)": 0.5 }
  ],
  "series": [
    { "key": "Inflation Rate (%)", "name": "Phillips Curve (π)", "color": "#ef4444" }
  ]
}
\`\`\`

#### Fig 1-7: The Business Cycle (Output Gap & Phases)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 1-7: Cyclical Fluctuations around Potential GDP Trend",
  "xAxis": "Quarter",
  "data": [
    { "Quarter": "Q1 (Trough)", "Actual GDP": 92, "Potential Trend": 100 },
    { "Quarter": "Q2 (Recovery)", "Actual GDP": 98, "Potential Trend": 102 },
    { "Quarter": "Q3 (Peak)", "Actual GDP": 108, "Potential Trend": 104 },
    { "Quarter": "Q4 (Recession)", "Actual GDP": 99, "Potential Trend": 106 },
    { "Quarter": "Q5 (Trough)", "Actual GDP": 95, "Potential Trend": 108 }
  ],
  "series": [
    { "key": "Actual GDP", "name": "Actual Real GDP", "color": "#0ea5e9" },
    { "key": "Potential Trend", "name": "Potential Output (Y*)", "color": "#8b5cf6" }
  ]
}
\`\`\`

#### Table 1-1: Per Capita Real GDP Growth Rates
| Country / Region | 1960–1980 (% p.a.) | 1980–2000 (% p.a.) | 2000–2020 (% p.a.) | Average Annual Growth |
| :--- | :--- | :--- | :--- | :--- |
| **China** | 3.2% | 8.8% | 7.4% | **6.5%** |
| **India** | 1.5% | 3.6% | 5.2% | **3.4%** |
| **United States** | 2.5% | 2.1% | 1.4% | **2.0%** |
| **Japan** | 6.4% | 2.1% | 0.8% | **3.1%** |
| **Sub-Saharan Africa** | 1.8% | -0.4% | 2.1% | **1.2%** |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 2-1:** Composition of US GDP (C=70%, I=16.9%, G=18.9%, NX=-2.8%).\n- **Table 2-1:** GDP and Components of Demand.\n- **Table 2-2:** The Budget Deficit, Trade, Saving, and Investment.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 2-1: Breakdown of GDP Components
\`\`\`chart
{
  "type": "bar",
  "title": "Fig 2-1: Expenditure Shares of Gross Domestic Product (%)",
  "xAxis": "Component",
  "data": [
    { "Component": "Consumption (C)", "Share (%)": 70.0 },
    { "Component": "Investment (I)", "Share (%)": 16.9 },
    { "Component": "Government (G)", "Share (%)": 18.9 },
    { "Component": "Net Exports (NX)", "Share (%)": -2.8 }
  ],
  "series": [
    { "key": "Share (%)", "name": "GDP Share (%)", "color": "#0ea5e9" }
  ]
}
\`\`\`

#### Table 2-1: GDP and Components of Aggregate Demand
| Expenditure Category | Nominal Value ($ Trillions) | Percentage Share of GDP |
| :--- | :--- | :--- |
| **Personal Consumption Expenditures (C)** | $14.20 | 70.0% |
| **Gross Private Domestic Investment (I)** | $3.43 | 16.9% |
| **Government Purchases (G)** | $3.83 | 18.9% |
| **Net Exports of Goods & Services (NX)** | -$0.57 | -2.8% |
| **Total Gross Domestic Product (GDP = Y)** | **$20.89** | **100.0%** |

#### Table 2-2: Sectoral Savings, Budget Deficits, and Net Exports
| Sectoral Relationship | Equation / identity | Economic Interpretation |
| :--- | :--- | :--- |
| **Private Sector Surplus** | $S - I$ | Excess of private saving over investment |
| **Government Budget Surplus** | $T - G$ | Tax revenues minus government purchases |
| **External Foreign Sector** | $NX$ | Net exports / Net foreign investment |
| **Macro Identity** | $(S - I) = (G - T) + NX$ | Private leakages match government deficit & net exports |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 3-1:** GDP per capita for four countries.\n- **Fig 3-4:** Steady-state Output and Investment (intersection of $sy$ and $(n+d)k$ curves).\n- **Fig 3-5/3-6:** Adjustment to new steady states from saving rate increases.\n- **Table 3-1:** Postwar Annual Growth Rates (US vs Japan).`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 3-1: Long-Run GDP Per Capita Trajectories (Four Countries)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 3-1: Real GDP Per Capita Index (1950=100)",
  "xAxis": "Year",
  "data": [
    { "Year": "1950", "United States": 100, "Japan": 25, "United Kingdom": 80, "Ghana": 15 },
    { "Year": "1970", "United States": 160, "Japan": 120, "United Kingdom": 125, "Ghana": 22 },
    { "Year": "1990", "United States": 230, "Japan": 240, "United Kingdom": 185, "Ghana": 20 },
    { "Year": "2010", "United States": 320, "Japan": 310, "United Kingdom": 250, "Ghana": 35 }
  ],
  "series": [
    { "key": "United States", "name": "United States", "color": "#0ea5e9" },
    { "key": "Japan", "name": "Japan", "color": "#10b981" },
    { "key": "United Kingdom", "name": "United Kingdom", "color": "#6366f1" },
    { "key": "Ghana", "name": "Ghana", "color": "#f59e0b" }
  ]
}
\`\`\`

#### Fig 3-4: Solow Steady-State Equilibrium (sy vs Break-even Investment)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 3-4: Capital Per Worker (k) vs Output (y) and Investment",
  "xAxis": "Capital Per Worker (k)",
  "data": [
    { "Capital Per Worker (k)": "0", "Output y = f(k)": 0, "Actual Investment s f(k)": 0, "Break-even (n+d)k": 0 },
    { "Capital Per Worker (k)": "2", "Output y = f(k)": 1.41, "Actual Investment s f(k)": 0.42, "Break-even (n+d)k": 0.20 },
    { "Capital Per Worker (k)": "4 (k*)", "Output y = f(k)": 2.00, "Actual Investment s f(k)": 0.60, "Break-even (n+d)k": 0.60 },
    { "Capital Per Worker (k)": "6", "Output y = f(k)": 2.45, "Actual Investment s f(k)": 0.73, "Break-even (n+d)k": 0.90 },
    { "Capital Per Worker (k)": "8", "Output y = f(k)": 2.83, "Actual Investment s f(k)": 0.85, "Break-even (n+d)k": 1.20 }
  ],
  "series": [
    { "key": "Output y = f(k)", "name": "Output Per Worker y = k^0.5", "color": "#0ea5e9" },
    { "key": "Actual Investment s f(k)", "name": "Actual Investment (s = 30%)", "color": "#10b981" },
    { "key": "Break-even (n+d)k", "name": "Break-even Investment (n+d)k", "color": "#f43f5e" }
  ]
}
\`\`\`

#### Fig 3-5 / 3-6: Dynamic Adjustment to Higher Saving Rate
\`\`\`chart
{
  "type": "line",
  "title": "Fig 3-5/3-6: Transition to Higher Steady State Capital after Increase in Saving",
  "xAxis": "Time Period",
  "data": [
    { "Time Period": "t0 (Initial)", "Capital k": 4.0, "Output y": 2.0, "New Savings s2*f(k)": 0.6 },
    { "Time Period": "t1 (Increase s)", "Capital k": 4.5, "Output y": 2.12, "New Savings s2*f(k)": 0.85 },
    { "Time Period": "t2 (Transition)", "Capital k": 6.2, "Output y": 2.49, "New Savings s2*f(k)": 1.00 },
    { "Time Period": "t3 (New Steady State k**)", "Capital k": 9.0, "Output y": 3.00, "New Savings s2*f(k)": 1.35 }
  ],
  "series": [
    { "key": "Capital k", "name": "Capital Stock (k)", "color": "#8b5cf6" },
    { "key": "Output y", "name": "Output Per Worker (y)", "color": "#0ea5e9" },
    { "key": "New Savings s2*f(k)", "name": "Higher Saving Path (s2 = 45%)", "color": "#10b981" }
  ]
}
\`\`\`

#### Table 3-1: Postwar Growth Accounting (United States vs Japan)
| Growth Metric | United States (% p.a.) | Japan (% p.a.) | Economic Explanation |
| :--- | :--- | :--- | :--- |
| **Output Growth ($\Delta Y / Y$)** | **3.1%** | **6.8%** | Japan postwar rapid convergence |
| **Capital Growth Contribution ($\alpha \Delta K / K$)** | 1.1% | 3.1% | Intensive capital deepening in Japan |
| **Labor Growth Contribution ($(1-\alpha) \Delta L / L$)** | 0.8% | 0.8% | Similar demographic expansion |
| **Solow Residual / TFP Growth ($\Delta A / A$)** | **1.2%** | **2.9%** | Technical progress & structural efficiency |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 4-1:** Solow vs. Endogenous growth models.\n- **Fig 4-2:** The Poverty Trap (combining neoclassical and endogenous elements).\n- **Table 1 (Box 4-3):** Annual Growth Rates: China and India (1978-2004).`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 4-1: Solow (Diminishing Returns) vs. Endogenous (Constant Returns)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 4-1: Output Y = f(K) under Solow vs Endogenous Y = aK",
  "xAxis": "Capital Stock (K)",
  "data": [
    { "Capital Stock (K)": "0", "Solow Diminishing Y": 0, "Endogenous Constant Y=aK": 0, "Depreciation (δK)": 0 },
    { "Capital Stock (K)": "2", "Solow Diminishing Y": 1.41, "Endogenous Constant Y=aK": 0.80, "Depreciation (δK)": 0.30 },
    { "Capital Stock (K)": "4", "Solow Diminishing Y": 2.00, "Endogenous Constant Y=aK": 1.60, "Depreciation (δK)": 0.60 },
    { "Capital Stock (K)": "6", "Solow Diminishing Y": 2.45, "Endogenous Constant Y=aK": 2.40, "Depreciation (δK)": 0.90 },
    { "Capital Stock (K)": "8", "Solow Diminishing Y": 2.83, "Endogenous Constant Y=aK": 3.20, "Depreciation (δK)": 1.20 },
    { "Capital Stock (K)": "10", "Solow Diminishing Y": 3.16, "Endogenous Constant Y=aK": 4.00, "Depreciation (δK)": 1.50 }
  ],
  "series": [
    { "key": "Solow Diminishing Y", "name": "Solow: Diminishing Returns Y = A f(K)", "color": "#0ea5e9" },
    { "key": "Endogenous Constant Y=aK", "name": "Endogenous Growth Y = a K", "color": "#10b981" },
    { "key": "Depreciation (δK)", "name": "Depreciation Line (δ K)", "color": "#f43f5e" }
  ]
}
\`\`\`

#### Fig 4-2: The Poverty Trap Model (Multiple Equilibria)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 4-2: S-Shaped Savings Curve s f(k) and Poverty Trap Equilibrium",
  "xAxis": "Capital (k)",
  "data": [
    { "Capital (k)": "Low (k_trap)", "Savings Curve s f(k)": 0.20, "Break-Even (n+δ)k": 0.50 },
    { "Capital (k)": "Threshold (k_threshold)", "Savings Curve s f(k)": 0.80, "Break-Even (n+δ)k": 0.80 },
    { "Capital (k)": "Takeoff (k_growth)", "Savings Curve s f(k)": 2.20, "Break-Even (n+δ)k": 1.20 },
    { "Capital (k)": "High Steady State (k_high)", "Savings Curve s f(k)": 3.00, "Break-Even (n+δ)k": 3.00 }
  ],
  "series": [
    { "key": "Savings Curve s f(k)", "name": "Savings Curve s f(k) [S-Shape]", "color": "#10b981" },
    { "key": "Break-Even (n+δ)k", "name": "Break-Even Investment Line (n+δ)k", "color": "#f43f5e" }
  ]
}
\`\`\`

#### Table 1 (Box 4-3): Annual Growth Rates: China and India (1978–2004)
| Period / Country | China Real GDP Growth (% p.a.) | India Real GDP Growth (% p.a.) | China Per Capita Growth | India Per Capita Growth |
| :--- | :--- | :--- | :--- | :--- |
| **1978–1990** | **9.3%** | **5.4%** | **7.9%** | **3.2%** |
| **1990–2004** | **9.9%** | **6.2%** | **8.8%** | **4.4%** |
| **1978–2004 (Overall)** | **9.6%** | **5.8%** | **8.3%** | **3.8%** |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 5-1 to 5-3:** Basic AD-AS shifts.\n- **Fig 5-4, 5-9, 5-10:** Keynesian vs. Classical AS curves and their response to AD expansions.\n- **Fig 5-11:** Supply-Side Economics (tax cuts shifting AS slightly and AD vastly).`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 5-1 to 5-3: Basic AD-AS Equilibrium Shifts
\`\`\`chart
{
  "type": "line",
  "title": "Fig 5-1 to 5-3: AD Curve Shift along Upward Sloping Aggregate Supply",
  "xAxis": "Output (Y)",
  "data": [
    { "Output (Y)": "90", "Initial AD1": 140, "Expanded AD2": 170, "Aggregate Supply AS": 90 },
    { "Output (Y)": "100 (Y*)", "Initial AD1": 100, "Expanded AD2": 130, "Aggregate Supply AS": 100 },
    { "Output (Y)": "110", "Initial AD1": 60, "Expanded AD2": 90, "Aggregate Supply AS": 110 }
  ],
  "series": [
    { "key": "Initial AD1", "name": "Initial AD1", "color": "#94a3b8" },
    { "key": "Expanded AD2", "name": "Expanded AD2", "color": "#f43f5e" },
    { "key": "Aggregate Supply AS", "name": "Short-Run AS", "color": "#10b981" }
  ]
}
\`\`\`

#### Fig 5-4, 5-9, 5-10: Keynesian (Horizontal) vs Classical (Vertical) AS
\`\`\`chart
{
  "type": "line",
  "title": "Fig 5-4/5-9/5-10: Extreme AS Assumptions: Keynesian vs Classical",
  "xAxis": "Output (Y)",
  "data": [
    { "Output (Y)": "80", "Keynesian AS (Horizontal)": 100, "Classical AS (Vertical)": 0, "AD Shift": 140 },
    { "Output (Y)": "100 (Y*)", "Keynesian AS (Horizontal)": 100, "Classical AS (Vertical)": 200, "AD Shift": 100 },
    { "Output (Y)": "120", "Keynesian AS (Horizontal)": 100, "Classical AS (Vertical)": 0, "AD Shift": 60 }
  ],
  "series": [
    { "key": "Keynesian AS (Horizontal)", "name": "Keynesian AS (Fixed Price)", "color": "#3b82f6" },
    { "key": "Classical AS (Vertical)", "name": "Classical AS (Y = Y*)", "color": "#10b981" },
    { "key": "AD Shift", "name": "Aggregate Demand (AD)", "color": "#f43f5e" }
  ]
}
\`\`\`

#### Fig 5-11: Supply-Side Economics Tax Cut Effects
\`\`\`chart
{
  "type": "line",
  "title": "Fig 5-11: Tax Cut Effect on Aggregate Demand vs Aggregate Supply",
  "xAxis": "Output (Y)",
  "data": [
    { "Output (Y)": "95", "Original AD": 120, "Stimulated AD": 150, "Original AS": 90, "Shifted AS": 85 },
    { "Output (Y)": "105", "Original AD": 90, "Stimulated AD": 120, "Original AS": 105, "Shifted AS": 100 },
    { "Output (Y)": "115", "Original AD": 60, "Stimulated AD": 90, "Original AS": 120, "Shifted AS": 115 }
  ],
  "series": [
    { "key": "Original AD", "name": "Original AD", "color": "#94a3b8" },
    { "key": "Stimulated AD", "name": "Tax-Cut AD Expansion", "color": "#ef4444" },
    { "key": "Original AS", "name": "Original AS", "color": "#94a3b8" },
    { "key": "Shifted AS", "name": "Incentivized AS Shift", "color": "#10b981" }
  ]
}
\`\`\``
  },
  {
    target: `**Key Graphs:**\n- **Fig 8-1:** Increased interest rates shift AD to the left.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 8-1: Interest Rates and Aggregate Demand Shift
\`\`\`chart
{
  "type": "line",
  "title": "Fig 8-1: Aggregate Demand Contraction from Interest Rate Rise (r1 = 3% to r2 = 7%)",
  "xAxis": "Output (Y)",
  "data": [
    { "Output (Y)": "80", "High AD (Low Rate r=3%)": 160, "Low AD (High Rate r=7%)": 130 },
    { "Output (Y)": "100", "High AD (Low Rate r=3%)": 120, "Low AD (High Rate r=7%)": 90 },
    { "Output (Y)": "120", "High AD (Low Rate r=3%)": 80, "Low AD (High Rate r=7%)": 50 }
  ],
  "series": [
    { "key": "High AD (Low Rate r=3%)", "name": "AD1 (Low Interest Rate r=3%)", "color": "#10b981" },
    { "key": "Low AD (High Rate r=7%)", "name": "AD2 (High Interest Rate r=7%)", "color": "#ef4444" }
  ]
}
\`\`\``
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 9-1/9-2/9-3:** The Keynesian Cross and derivation of the Multiplier.\n- **Fig 9-6:** The Budget Surplus as a function of income.\n- **Table 9-1:** The Multiplier in stages.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 9-1/9-2/9-3: The Keynesian Cross Diagram
\`\`\`chart
{
  "type": "line",
  "title": "Fig 9-1 to 9-3: Keynesian Cross Equilibrium (Y = AD)",
  "xAxis": "Income / Output (Y)",
  "data": [
    { "Income / Output (Y)": "0", "45-Degree Line (Y)": 0, "Planned Expenditure AD": 20 },
    { "Income / Output (Y)": "50", "45-Degree Line (Y)": 50, "Planned Expenditure AD": 50 },
    { "Income / Output (Y)": "100 (Y*)", "45-Degree Line (Y)": 100, "Planned Expenditure AD": 100 },
    { "Income / Output (Y)": "150", "45-Degree Line (Y)": 150, "Planned Expenditure AD": 130 }
  ],
  "series": [
    { "key": "45-Degree Line (Y)", "name": "Equilibrium Line Y = AD", "color": "#94a3b8" },
    { "key": "Planned Expenditure AD", "name": "Planned Spending AD = A0 + cY", "color": "#0ea5e9" }
  ]
}
\`\`\`

#### Fig 9-6: Budget Surplus (BS = tY - G) vs Income
\`\`\`chart
{
  "type": "line",
  "title": "Fig 9-6: Budget Surplus function BS = t Y - G",
  "xAxis": "Income (Y)",
  "data": [
    { "Income (Y)": "0", "Budget Surplus (BS)": -50 },
    { "Income (Y)": "100", "Budget Surplus (BS)": -25 },
    { "Income (Y)": "200 (Y_balanced)", "Budget Surplus (BS)": 0 },
    { "Income (Y)": "300", "Budget Surplus (BS)": 25 }
  ],
  "series": [
    { "key": "Budget Surplus (BS)", "name": "Budget Surplus BS = 0.25Y - 50", "color": "#10b981" }
  ]
}
\`\`\`

#### Table 9-1: The Expenditure Multiplier Process in Stages (c = 0.8)
| Round | Autonomous Spending Increment | Consumption Increase ($\Delta C = c \cdot \Delta Y$) | Cumulative Expansion in Output ($\Delta Y$) |
| :--- | :--- | :--- | :--- |
| **Round 1** | $100 Million | $80.0 Million | $100.0 Million |
| **Round 2** | $0 | $64.0 Million | $180.0 Million |
| **Round 3** | $0 | $51.2 Million | $244.0 Million |
| **Round 4** | $0 | $40.96 Million | $284.96 Million |
| **All Subsequent**| $0 | $163.84 Million | **$500.0 Million** |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 10-5:** Derivation of the IS curve.\n- **Fig 10-9:** Derivation of the LM curve.\n- **Fig 10-11:** Goods and Money Market Equilibrium (IS-LM).\n- **Fig 10-13:** Derivation of the AD curve from IS-LM shifts.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 10-5 & 10-9: IS and LM Curves
\`\`\`chart
{
  "type": "line",
  "title": "Fig 10-5 / 10-9 / 10-11: IS-LM Simultaneous Equilibrium in (Y, r) Space",
  "xAxis": "Income / Output (Y)",
  "data": [
    { "Income / Output (Y)": "60", "IS Curve (Goods Market)": 9.0, "LM Curve (Money Market)": 2.0 },
    { "Income / Output (Y)": "80", "IS Curve (Goods Market)": 7.0, "LM Curve (Money Market)": 3.5 },
    { "Income / Output (Y)": "100 (Y*)", "IS Curve (Goods Market)": 5.0, "LM Curve (Money Market)": 5.0 },
    { "Income / Output (Y)": "120", "IS Curve (Goods Market)": 3.0, "LM Curve (Money Market)": 6.5 },
    { "Income / Output (Y)": "140", "IS Curve (Goods Market)": 1.0, "LM Curve (Money Market)": 8.0 }
  ],
  "series": [
    { "key": "IS Curve (Goods Market)", "name": "IS Curve (Y = C + I(r) + G)", "color": "#0ea5e9" },
    { "key": "LM Curve (Money Market)", "name": "LM Curve (M/P = L(Y, r))", "color": "#10b981" }
  ]
}
\`\`\`

#### Fig 10-13: Derivation of the Downward-Sloping AD Curve from IS-LM
\`\`\`chart
{
  "type": "line",
  "title": "Fig 10-13: Aggregate Demand Curve AD (P vs Y)",
  "xAxis": "Output (Y)",
  "data": [
    { "Output (Y)": "70", "Price Level (P)": 160 },
    { "Output (Y)": "100 (Y*)", "Price Level (P)": 100 },
    { "Output (Y)": "130", "Price Level (P)": 60 }
  ],
  "series": [
    { "key": "Price Level (P)", "name": "Aggregate Demand (AD)", "color": "#f43f5e" }
  ]
}
\`\`\``
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 11-3:** Monetary expansion (LM shifts right).\n- **Fig 11-6:** Fiscal expansion (IS shifts right, partial crowding out).\n- **Fig 11-7:** Full crowding out in the classical case.\n- **Table 11-1:** The Transmission Mechanism.\n- **Table 11-2:** Policy effects on income and interest rates.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 11-3 & 11-6: Monetary vs Fiscal Policy Shifts in IS-LM
\`\`\`chart
{
  "type": "line",
  "title": "Fig 11-3 / 11-6: Fiscal Expansion (IS1 -> IS2) vs Monetary Expansion (LM1 -> LM2)",
  "xAxis": "Output (Y)",
  "data": [
    { "Output (Y)": "80", "Initial IS1": 8.0, "Expanded IS2": 11.0, "Initial LM1": 2.0, "Expanded LM2": 0.5 },
    { "Output (Y)": "100", "Initial IS1": 5.0, "Expanded IS2": 8.0, "Initial LM1": 5.0, "Expanded LM2": 3.0 },
    { "Output (Y)": "120", "Initial IS1": 2.0, "Expanded IS2": 5.0, "Initial LM1": 8.0, "Expanded LM2": 5.5 }
  ],
  "series": [
    { "key": "Initial IS1", "name": "Initial IS1", "color": "#94a3b8" },
    { "key": "Expanded IS2", "name": "Fiscal Expansion IS2", "color": "#ef4444" },
    { "key": "Initial LM1", "name": "Initial LM1", "color": "#94a3b8" },
    { "key": "Expanded LM2", "name": "Monetary Expansion LM2", "color": "#10b981" }
  ]
}
\`\`\`

#### Table 11-1: Transmission Mechanism of Monetary Policy
| Step Number | Channel Mechanism | Economic Outcome |
| :--- | :--- | :--- |
| **Step 1** | Central Bank buys bonds via Open Market Purchase | Money Stock $M$ increases |
| **Step 2** | Money supply exceeds money demand at initial interest rate | Interest rate $r$ falls |
| **Step 3** | Lower interest rate lowers cost of borrowing for firms | Investment $I$ expands |
| **Step 4** | Investment expansion increases aggregate expenditure | Equilibrium Income $Y$ grows via Multiplier |

#### Table 11-2: Summary Matrix of Policy Effects on Macro Variables
| Policy Initiative | Equilibrium Output ($Y$) | Interest Rate ($r$) | Consumption ($C$) | Investment ($I$) |
| :--- | :--- | :--- | :--- | :--- |
| **Fiscal Expansion ($\Delta G > 0$)** | **Rises (+)** | **Rises (+)** | **Rises (+)** | **Falls (-) [Crowded Out]** |
| **Monetary Expansion ($\Delta M > 0$)**| **Rises (+)** | **Falls (-)** | **Rises (+)** | **Rises (+)** |
| **Liquidity Trap ($h \to \infty$)** | **Rises (+) [Max]**| **Unchanged (0)**| **Rises (+)** | **Unchanged (0)** |
| **Classical Case ($h = 0$)** | **Unchanged (0)**| **Rises (+) [Max]**| **Unchanged (0)**| **Falls (-) [Full Crowding Out]** |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 12-4:** Internal and External Balance under Fixed Rates.\n- **Fig 12-5/12-6/12-7:** Adjustments under Flexible Rates.\n- **Table 12-6:** Effects of Monetary/Fiscal policy under Perfect Capital Mobility.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 12-4 to 12-7: Mundell-Fleming Model Equilibrium
\`\`\`chart
{
  "type": "line",
  "title": "Fig 12-4 to 12-7: IS-LM-BP Curves with Perfect Capital Mobility (r = r_world)",
  "xAxis": "Output (Y)",
  "data": [
    { "Output (Y)": "80", "IS Curve": 8.0, "LM Curve": 2.0, "BP Line (r = r_world)": 5.0 },
    { "Output (Y)": "100 (Y*)", "IS Curve": 5.0, "LM Curve": 5.0, "BP Line (r = r_world)": 5.0 },
    { "Output (Y)": "120", "IS Curve": 2.0, "LM Curve": 8.0, "BP Line (r = r_world)": 5.0 }
  ],
  "series": [
    { "key": "IS Curve", "name": "IS Curve", "color": "#0ea5e9" },
    { "key": "LM Curve", "name": "LM Curve", "color": "#f59e0b" },
    { "key": "BP Line (r = r_world)", "name": "BP Line (r = r_world = 5%)", "color": "#10b981" }
  ]
}
\`\`\`

#### Table 12-6: Mundell-Fleming Policy Effectiveness Matrix (Perfect Capital Mobility)
| Exchange Rate Regime | Fiscal Policy ($\Delta G > 0$) | Monetary Policy ($\Delta M > 0$) | Trade Protection / Tariff |
| :--- | :--- | :--- | :--- |
| **Fixed Exchange Rate** | **Completely Effective** (Y rises dramatically) | **Ineffective** (Money base flows out instantly) | **Effective** (Raises Y and money base) |
| **Floating Exchange Rate** | **Ineffective** (Appreciation fully crowds out NX) | **Completely Effective** (Depreciation boosts NX) | **Ineffective** (Currency appreciation offsets tariff) |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 13-4:** Lifetime Income, Consumption, Saving, and Wealth.\n- **Table 13-1/13-2:** Sectoral savings rates.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 13-4: Life-Cycle Hypothesis Profile
\`\`\`chart
{
  "type": "line",
  "title": "Fig 13-4: Income, Consumption, and Wealth over Life Cycle",
  "xAxis": "Age (Years)",
  "data": [
    { "Age (Years)": "20 (Youth)", "Income": 15, "Consumption": 30, "Wealth Accumulation": -10 },
    { "Age (Years)": "35 (Early Working)", "Income": 60, "Consumption": 45, "Wealth Accumulation": 30 },
    { "Age (Years)": "50 (Peak Earning)", "Income": 100, "Consumption": 55, "Wealth Accumulation": 120 },
    { "Age (Years)": "65 (Retirement)", "Income": 25, "Consumption": 50, "Wealth Accumulation": 80 },
    { "Age (Years)": "80 (Old Age)", "Income": 10, "Consumption": 45, "Wealth Accumulation": 10 }
  ],
  "series": [
    { "key": "Income", "name": "Annual Income Y(t)", "color": "#10b981" },
    { "key": "Consumption", "name": "Smoothed Consumption C(t)", "color": "#0ea5e9" },
    { "key": "Wealth Accumulation", "name": "Net Wealth Stock W(t)", "color": "#8b5cf6" }
  ]
}
\`\`\`

#### Table 13-1/13-2: Sectoral Savings Contributions (% of GDP)
| Savings Sector | Share of National Savings (%) | Economic Function |
| :--- | :--- | :--- |
| **Personal Household Saving** | 35.0% | Precautionary & retirement accumulation |
| **Corporate Retained Earnings** | 50.0% | Business investment financing |
| **Government Budget Saving** | 15.0% | Public infrastructure investment |
| **Gross National Savings Total**| **100.0%** | **Total Domestic Funds for Capital Formation** |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 14-2/14-3:** Marginal Product of Capital and desired Capital stock.\n- **Fig 14-4/14-5:** Adjustment of Capital stock over time.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 14-2/14-3: MPK vs Rental Cost of Capital (rc)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 14-2/14-3: MPK Curve and Desired Capital Stock K*",
  "xAxis": "Capital Stock (K)",
  "data": [
    { "Capital Stock (K)": "50", "MPK Curve": 12.0, "Rental Cost rc": 6.0 },
    { "Capital Stock (K)": "100 (K*)", "MPK Curve": 6.0, "Rental Cost rc": 6.0 },
    { "Capital Stock (K)": "150", "MPK Curve": 3.0, "Rental Cost rc": 6.0 }
  ],
  "series": [
    { "key": "MPK Curve", "name": "Marginal Product of Capital (MPK)", "color": "#0ea5e9" },
    { "key": "Rental Cost rc", "name": "User Cost of Capital (rc = r + δ)", "color": "#f43f5e" }
  ]
}
\`\`\`

#### Fig 14-4/14-5: Flexible Accelerator Capital Adjustment Trajectory
\`\`\`chart
{
  "type": "line",
  "title": "Fig 14-4/14-5: Capital Stock Adjustment over Time (K_t -> K*)",
  "xAxis": "Period",
  "data": [
    { "Period": "t0", "Actual Capital K": 60, "Desired Capital K*": 100 },
    { "Period": "t1", "Actual Capital K": 76, "Desired Capital K*": 100 },
    { "Period": "t2", "Actual Capital K": 88, "Desired Capital K*": 100 },
    { "Period": "t3", "Actual Capital K": 95, "Desired Capital K*": 100 },
    { "Period": "t4", "Actual Capital K": 100, "Desired Capital K*": 100 }
  ],
  "series": [
    { "key": "Actual Capital K", "name": "Actual Capital Stock K_t", "color": "#10b981" },
    { "key": "Desired Capital K*", "name": "Desired Capital Target K*", "color": "#6366f1" }
  ]
}
\`\`\``
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 15-1:** Velocity of money and T-bill rates.\n- **Table 15-1/15-2:** Income and Interest Rate Elasticities of Money Demand.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 15-1: Income Velocity of Money (V = Y / M) vs T-Bill Rates
\`\`\`chart
{
  "type": "line",
  "title": "Fig 15-1: Money Velocity (M1) vs Short-Term Interest Rates",
  "xAxis": "Year",
  "data": [
    { "Year": "1960", "Money Velocity (V)": 3.5, "T-Bill Rate (%)": 2.8 },
    { "Year": "1980", "Money Velocity (V)": 6.5, "T-Bill Rate (%)": 11.5 },
    { "Year": "2000", "Money Velocity (V)": 10.2, "T-Bill Rate (%)": 5.8 },
    { "Year": "2020", "Money Velocity (V)": 3.8, "T-Bill Rate (%)": 0.4 }
  ],
  "series": [
    { "key": "Money Velocity (V)", "name": "M1 Velocity (V = PY/M)", "color": "#0ea5e9" },
    { "key": "T-Bill Rate (%)", "name": "3-Month T-Bill Rate (%)", "color": "#f59e0b" }
  ]
}
\`\`\`

#### Table 15-1/15-2: Empirical Elasticities of Real Money Demand ($L(Y, r)$)
| Money Demand Model | Income Elasticity ($\eta_Y$) | Interest Rate Elasticity ($\eta_r$) | Empirical Notes |
| :--- | :--- | :--- | :--- |
| **Baumol-Tobin Cash Management**| **+0.50** | **-0.20** | Economies of scale in cash inventory |
| **Friedman Quantity Theory** | **+1.00** | **0.00** | Money as permanent income asset |
| **Empirical Short-Run Estimates** | **+0.20** | **-0.05** | Partial adjustment lag |
| **Empirical Long-Run Estimates** | **+1.00** | **-0.15** | Unit income elasticity in long run |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 16-2:** Relation between High-Powered Money and the Money Stock.\n- **Fig 16-4:** Pegging the interest rate vs fixing the money supply.\n- **Fig 16-5:** Poole's analysis of targets in the presence of IS or LM shocks.\n- **Tables 16-1 to 16-3:** Fed Balance Sheet representations.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 16-2: High-Powered Base Money (B) vs Total Money Supply (M)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 16-2: Money Expansion M = mm * B",
  "xAxis": "Monetary Base B ($B)",
  "data": [
    { "Monetary Base B ($B)": "100", "Money Supply M (mm=2.5)": 250 },
    { "Monetary Base B ($B)": "200", "Money Supply M (mm=2.5)": 500 },
    { "Monetary Base B ($B)": "300", "Money Supply M (mm=2.5)": 750 },
    { "Monetary Base B ($B)": "400", "Money Supply M (mm=2.5)": 1000 }
  ],
  "series": [
    { "key": "Money Supply M (mm=2.5)", "name": "Total Money Supply (M)", "color": "#10b981" }
  ]
}
\`\`\`

#### Fig 16-5: Poole's Target Analysis under Real (IS) vs Financial (LM) Shocks
\`\`\`chart
{
  "type": "line",
  "title": "Fig 16-5: Output Variance under Money Supply Target vs Interest Rate Target",
  "xAxis": "Shock Severity",
  "data": [
    { "Shock Severity": "Low IS Volatility", "Output Variance (Money Target)": 10, "Output Variance (Rate Target)": 25 },
    { "Shock Severity": "High IS Volatility", "Output Variance (Money Target)": 30, "Output Variance (Rate Target)": 70 },
    { "Shock Severity": "High LM Financial Volatility", "Output Variance (Money Target)": 80, "Output Variance (Rate Target)": 10 }
  ],
  "series": [
    { "key": "Output Variance (Money Target)", "name": "Money Target Variance", "color": "#0ea5e9" },
    { "key": "Output Variance (Rate Target)", "name": "Interest Rate Target Variance", "color": "#ef4444" }
  ]
}
\`\`\`

#### Tables 16-1 to 16-3: Simplified Federal Reserve Balance Sheet
| Federal Reserve Assets | Value ($B) | Federal Reserve Liabilities & Equity | Value ($B) |
| :--- | :--- | :--- | :--- |
| **U.S. Treasury Securities** | $4,500 | **Currency in Circulation** | $2,200 |
| **Mortgage-Backed Securities** | $2,300 | **Commercial Bank Reserves** | $3,800 |
| **Discount Window Loans** | $100 | **Reverse Repo Liabilities** | $800 |
| **Gold & Foreign Exchange** | $200 | **Capital / Treasury Equity** | $100 |
| **Total Central Bank Assets** | **$7,100** | **Total Central Bank Liabilities** | **$7,100** |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 17-1:** Lags and destabilizing policy.\n- **Fig 17-3:** The Phillips curve and dynamic inconsistency (temptation to cheat on inflation targets).`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 17-1: Inside / Outside Policy Lags and Destabilizing Cycles
\`\`\`chart
{
  "type": "line",
  "title": "Fig 17-1: Un-lagged Stabilization vs Lagged Policy Amplification",
  "xAxis": "Time Period",
  "data": [
    { "Time Period": "t1 (Recession)", "Natural Economy Cycle": -10, "Lagged Stimulus Effect": 0 },
    { "Time Period": "t2 (Recovery)", "Natural Economy Cycle": 0, "Lagged Stimulus Effect": 10 },
    { "Time Period": "t3 (Overheating Peak)", "Natural Economy Cycle": 10, "Lagged Stimulus Effect": 15 },
    { "Time Period": "t4 (Correction)", "Natural Economy Cycle": 0, "Lagged Stimulus Effect": -5 }
  ],
  "series": [
    { "key": "Natural Economy Cycle", "name": "Natural Business Cycle", "color": "#94a3b8" },
    { "key": "Lagged Stimulus Effect", "name": "Actual Path with Lagged Policy", "color": "#f43f5e" }
  ]
}
\`\`\`

#### Fig 17-3: Dynamic Inconsistency in Inflation Control
\`\`\`chart
{
  "type": "line",
  "title": "Fig 17-3: Discretionary Inflation Bias vs Credible Rule",
  "xAxis": "Unemployment (u)",
  "data": [
    { "Unemployment (u)": "3%", "Rule (π = 2%)": 5.0, "Discretion Cheating (π = 6%)": 2.0 },
    { "Unemployment (u)": "5% (u*)", "Rule (π = 2%)": 2.0, "Discretion Cheating (π = 6%)": 6.0 },
    { "Unemployment (u)": "7%", "Rule (π = 2%)": 0.5, "Discretion Cheating (π = 6%)": 10.0 }
  ],
  "series": [
    { "key": "Rule (π = 2%)", "name": "Credible Rule (Low Inflation π=2%)", "color": "#10b981" },
    { "key": "Discretion Cheating (π = 6%)", "name": "Discretionary Inflation Bias (π=6%)", "color": "#ef4444" }
  ]
}
\`\`\``
  },
  {
    target: `**Key Graphs:**\n- **Fig 18-1, 18-3:** Yield Curves and historically tracking long vs short rates.\n- **Fig 18-4, 18-5:** Random walk plots for stock markets.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 18-1 & 18-3: Normal vs Inverted Yield Curves
\`\`\`chart
{
  "type": "line",
  "title": "Fig 18-1/18-3: Yield Curves (Maturity vs Annualized Yield %)",
  "xAxis": "Maturity",
  "data": [
    { "Maturity": "3 Months", "Normal Upward Yield Curve": 2.0, "Inverted Recession Yield Curve": 5.2 },
    { "Maturity": "2 Years", "Normal Upward Yield Curve": 2.8, "Inverted Recession Yield Curve": 4.6 },
    { "Maturity": "5 Years", "Normal Upward Yield Curve": 3.5, "Inverted Recession Yield Curve": 4.1 },
    { "Maturity": "10 Years", "Normal Upward Yield Curve": 4.2, "Inverted Recession Yield Curve": 3.8 },
    { "Maturity": "30 Years", "Normal Upward Yield Curve": 4.8, "Inverted Recession Yield Curve": 3.6 }
  ],
  "series": [
    { "key": "Normal Upward Yield Curve", "name": "Normal Growth Yield Curve", "color": "#10b981" },
    { "key": "Inverted Recession Yield Curve", "name": "Inverted Yield Curve (Recession Warning)", "color": "#ef4444" }
  ]
}
\`\`\`

#### Fig 18-4 & 18-5: Stock Index Trajectory under Random Walk
\`\`\`chart
{
  "type": "line",
  "title": "Fig 18-4/18-5: Efficient Market Hypothesis Stock Price Random Walk",
  "xAxis": "Day",
  "data": [
    { "Day": "Day 1", "Stock Index": 100.0, "Fundamental Trend": 100.0 },
    { "Day": "Day 10", "Stock Index": 103.5, "Fundamental Trend": 101.5 },
    { "Day": "Day 20", "Stock Index": 98.2, "Fundamental Trend": 103.0 },
    { "Day": "Day 30", "Stock Index": 106.8, "Fundamental Trend": 104.5 },
    { "Day": "Day 40", "Stock Index": 110.1, "Fundamental Trend": 106.0 }
  ],
  "series": [
    { "key": "Stock Index", "name": "Actual Stock Index Path", "color": "#0ea5e9" },
    { "key": "Fundamental Trend", "name": "Expected Fundamental Trend", "color": "#8b5cf6" }
  ]
}
\`\`\``
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 19-3 / Fig 19-4:** Monetary Accommodation and The Inflation Tax (Seigniorage curve).\n- **Table 19-6:** High-Inflation / Hyperinflation Experiences.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 19-3 / 19-4: The Seigniorage Laffer Curve (Inflation Rate vs Real Revenue)
\`\`\`chart
{
  "type": "line",
  "title": "Fig 19-3/19-4: Inflation Tax Revenue S = π * (M/P)",
  "xAxis": "Inflation Rate π (%)",
  "data": [
    { "Inflation Rate π (%)": "0%", "Seigniorage Revenue": 0 },
    { "Inflation Rate π (%)": "20%", "Seigniorage Revenue": 4.5 },
    { "Inflation Rate π (%)": "50% (Peak)", "Seigniorage Revenue": 8.0 },
    { "Inflation Rate π (%)": "100%", "Seigniorage Revenue": 5.2 },
    { "Inflation Rate π (%)": "200%", "Seigniorage Revenue": 1.5 }
  ],
  "series": [
    { "key": "Seigniorage Revenue", "name": "Real Inflation Tax Revenue S", "color": "#f59e0b" }
  ]
}
\`\`\`

#### Table 19-6: Historical Hyperinflation Episodes
| Country / Episode | Peak Monthly Inflation Rate | Equivalent Daily Inflation Rate | Primary Cause |
| :--- | :--- | :--- | :--- |
| **Hungary (1946)** | **41.9 Quadrillion %** | **207% / day** | Total fiscal collapse post-WWII |
| **Zimbabwe (2008)** | **79.6 Billion %** | **98% / day** | Unfunded debt & agricultural shock |
| **Germany (1923)** | **32,400 %** | **20.7% / day** | WWI reparations printing |
| **Bolivia (1985)** | **11,750 %** | **12.0% / day** | External debt & money printing |`
  },
  {
    target: `**Key Graphs & Tables:**\n- **Fig 20-3:** Competitiveness and Adjustment.\n- **Fig 20-7:** Exchange Rate Overshooting.\n- **Table 20-2:** Short and Long Run effects of Monetary Expansions.`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 20-7: Dornbusch Exchange Rate Overshooting Dynamics
\`\`\`chart
{
  "type": "line",
  "title": "Fig 20-7: Dynamic Trajectory of Exchange Rate (E) following Unanticipated Monetary Shock",
  "xAxis": "Time Stage",
  "data": [
    { "Time Stage": "t0 (Pre-Shock)", "Money Supply M": 100, "Interest Rate r": 5.0, "Exchange Rate E": 1.00 },
    { "Time Stage": "t1 (Immediate Overshoot)", "Money Supply M": 120, "Interest Rate r": 2.0, "Exchange Rate E": 1.45 },
    { "Time Stage": "t2 (Price Adjustment)", "Money Supply M": 120, "Interest Rate r": 3.8, "Exchange Rate E": 1.30 },
    { "Time Stage": "t3 (Long Run Equilibrium)", "Money Supply M": 120, "Interest Rate r": 5.0, "Exchange Rate E": 1.20 }
  ],
  "series": [
    { "key": "Exchange Rate E", "name": "Exchange Rate E (Spot)", "color": "#ef4444" },
    { "key": "Money Supply M", "name": "Money Supply M", "color": "#10b981" },
    { "key": "Interest Rate r", "name": "Domestic Interest Rate r (%)", "color": "#0ea5e9" }
  ]
}
\`\`\`

#### Table 20-2: Short-Run vs Long-Run Effects of Monetary Expansion
| Variable | Short-Run Adjustment | Long-Run Steady State |
| :--- | :--- | :--- |
| **Money Supply ($M$)** | Increased (+20%) | Increased (+20%) |
| **Price Level ($P$)** | Sticky / Fixed (0%) | Proportionately higher (+20%) |
| **Interest Rate ($r$)** | Falls sharply (-) | Returns to original level ($r_{world}$) |
| **Nominal Exchange Rate ($E$)**| **Overshoots upward (+45%)** | Depreciated proportionately (+20%) |
| **Real Exchange Rate ($R = EP/P*$)**| Depreciates temporarily (+) | Returns to Purchasing Power Parity |`
  },
  {
    target: `**Key Graphs:**\n- **Fig 21-4/21-5:** Actual and Projected GDP (Trend vs Difference Stationary).\n- **Fig 21-6:** Mankiw's Menu Cost Breakthrough (profit loss curves under perfect vs imperfect competition).`,
    replacement: `### Key Interactive Visualizations & Data Tables

#### Fig 21-4/21-5: Trend-Stationary vs Difference-Stationary GDP Trajectories
\`\`\`chart
{
  "type": "line",
  "title": "Fig 21-4/21-5: Impulse Response to Recession Shock: Trend vs Unit Root",
  "xAxis": "Period",
  "data": [
    { "Period": "t0", "Trend Stationary GDP": 100, "Difference Stationary (Unit Root) GDP": 100 },
    { "Period": "t1 (Shock)", "Trend Stationary GDP": 92, "Difference Stationary (Unit Root) GDP": 92 },
    { "Period": "t2 (Recovery)", "Trend Stationary GDP": 97, "Difference Stationary (Unit Root) GDP": 94 },
    { "Period": "t3 (Long Run)", "Trend Stationary GDP": 108, "Difference Stationary (Unit Root) GDP": 102 }
  ],
  "series": [
    { "key": "Trend Stationary GDP", "name": "Trend Stationary (Full Mean Reversion)", "color": "#10b981" },
    { "key": "Difference Stationary (Unit Root) GDP", "name": "Difference Stationary (Permanent Loss)", "color": "#ef4444" }
  ]
}
\`\`\`

#### Fig 21-6: Mankiw Menu Cost & Envelope Theorem
\`\`\`chart
{
  "type": "line",
  "title": "Fig 21-6: Firm Private Profit Loss vs Social Welfare Loss from Price Rigidity",
  "xAxis": "Monetary Contraction (%)",
  "data": [
    { "Monetary Contraction (%)": "0%", "Private Profit Loss": 0, "Social Welfare Loss": 0 },
    { "Monetary Contraction (%)": "2%", "Private Profit Loss": 0.2, "Social Welfare Loss": 2.0 },
    { "Monetary Contraction (%)": "5%", "Private Profit Loss": 1.1, "Social Welfare Loss": 8.5 },
    { "Monetary Contraction (%)": "10%", "Private Profit Loss": 4.2, "Social Welfare Loss": 25.0 }
  ],
  "series": [
    { "key": "Private Profit Loss", "name": "Private Firm Profit Loss (Second-Order)", "color": "#0ea5e9" },
    { "key": "Social Welfare Loss", "name": "Social Welfare Loss (First-Order)", "color": "#f43f5e" }
  ]
}
\`\`\``
  }
];

let replacementCount = 0;
for (const item of replacements) {
  if (content.includes(item.target)) {
    content = content.replace(item.target, item.replacement);
    replacementCount++;
  } else {
    console.warn('Could not find target block for:', item.target.substring(0, 40));
  }
}

console.log(`Replaced ${replacementCount} Key Graphs sections in advancedStudyData.ts`);

// Also fix LaTeX syntax errors in the content before saving:
// 1. Fix double backslashes in commands \\alpha -> \alpha
content = content.replace(/\\\\\\\\/g, '__LATEX_NEWLINE__');
content = content.replace(/\\\\([a-zA-Z]+)/g, '\\$1');
content = content.replace(/\\\\([^a-zA-Z\s])/g, '\\$1');
content = content.replace(/__LATEX_NEWLINE__/g, '\\\\');

// 2. Fix Cobb-Douglas math string: $Y = AK^\ N^{1-\\}$ -> $Y = A K^\alpha N^{1-\alpha}$
content = content.replace(/\$Y = AK\^\ N\^{1-\\\}\$/g, '$Y = A K^\\alpha N^{1-\\alpha}$');

// 3. Fix % inside \text{...}
content = content.replace(/(\\text\{[^\}]*?)(%)(.*?\}\})/g, '$1\\%$3');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated src/lib/advancedStudyData.ts');
