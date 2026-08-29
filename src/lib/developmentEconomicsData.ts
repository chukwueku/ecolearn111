export const DEVELOPMENT_ECONOMICS_GUIDE = `
# Advanced Development Economics: Theory, Empirical Evidence, and Policy

## Course Overview
Advanced Development Economics explores the structural, institutional, and human transformations required for low- and middle-income nations to achieve sustainable growth and poverty eradication. It integrates microeconomic household models, dual-sector transition theories, institutional economics, and empirical policy evaluation.

---

## Chapter 1: Conceptualizing and Measuring Economic Development

### 1.1 Beyond GDP: Multidimensional Development
Economic growth measures the expansion of aggregate output ($\\Delta \\text{GDP}$). In contrast, **economic development** is defined by structural transformation, poverty eradication, reduction of inequality, and the expansion of human capabilities.

---

### 1.2 The Human Development Index (HDI)
Formulated by Mahbub ul Haq and Amartya Sen (UNDP), the modern HDI is the **geometric mean** of three normalized dimensional indices:
$$\\text{HDI} = \\sqrt[3]{I_{\\text{Health}} \\cdot I_{\\text{Education}} \\cdot I_{\\text{Income}}}$$

#### Mathematical Dimensional Indices:
1. **Health (Life Expectancy Index $I_{\\text{Health}}$):**
   $$I_{\\text{Health}} = \\frac{\\text{LE} - 20}{85 - 20}$$
2. **Education Index ($I_{\\text{Education}}$):**
   $$I_{\\text{Education}} = \\frac{1}{2} \\left( \\frac{\\text{Mean Years of Schooling}}{15} \\right) + \\frac{1}{2} \\left( \\frac{\\text{Expected Years of Schooling}}{18} \\right)$$
3. **Income (GNI per Capita Index $I_{\\text{Income}}$):**
   $$I_{\\text{Income}} = \\frac{\\ln(\\text{GNIpc}) - \\ln(100)}{\\ln(75,000) - \\ln(100)}$$

* The use of the **geometric mean** (introduced in 2010) penalizes uneven progress across dimensions, ensuring that high income cannot easily compensate for dismal health or education outcomes.

---

## Chapter 2: Poverty, Inequality, and Distributional Metrics

### 2.1 The Lorenz Curve and the Gini Coefficient
Let cumulative share of population be on the horizontal axis ($p \\in [0, 1]$) and cumulative share of income be $L(p)$ on the vertical axis.
* **Line of Perfect Equality:** $L(p) = p$ (45-degree diagonal).
* **Lorenz Curve:** $L(p) \\le p$ ($L'(p) > 0, L''(p) > 0$).

\`\`\`chart
{
  "type": "area",
  "title": "Lorenz Curve and Area of Inequality (Gini Coefficient Calculation)",
  "xAxis": "Cumulative_Population_Pct",
  "series": [
    { "key": "Equality_Line", "name": "Line of Perfect Equality (45 deg)", "color": "#10b981" },
    { "key": "Lorenz_Curve", "name": "Actual Lorenz Curve L(p)", "color": "#f43f5e" }
  ],
  "data": [
    { "Cumulative_Population_Pct": 0, "Equality_Line": 0, "Lorenz_Curve": 0 },
    { "Cumulative_Population_Pct": 20, "Equality_Line": 20, "Lorenz_Curve": 4 },
    { "Cumulative_Population_Pct": 40, "Equality_Line": 40, "Lorenz_Curve": 12 },
    { "Cumulative_Population_Pct": 60, "Equality_Line": 60, "Lorenz_Curve": 26 },
    { "Cumulative_Population_Pct": 80, "Equality_Line": 80, "Lorenz_Curve": 48 },
    { "Cumulative_Population_Pct": 100, "Equality_Line": 100, "Lorenz_Curve": 100 }
  ]
}
\`\`\`

#### The Gini Coefficient ($G$):
$$G = \\frac{\\text{Area between Equality Line and Lorenz Curve}}{\\text{Total Area under Equality Line}} = \\frac{A}{A + B} = 1 - 2 \\int_0^1 L(p) dp$$
* $G = 0$: Absolute income equality.
* $G = 1$: Absolute inequality (one individual possesses all national income).

#### 💡 Worked Numerical Example 2.1: Calculating the Gini Coefficient
Given income quintile distribution:
* Quintile 1 (Bottom 20%): receives 4% of income $\\rightarrow (p_1=0.2, L_1=0.04)$
* Quintile 2 (20-40%): receives 8% of income $\\rightarrow (p_2=0.4, L_2=0.12)$
* Quintile 3 (40-60%): receives 14% of income $\\rightarrow (p_3=0.6, L_3=0.26)$
* Quintile 4 (60-80%): receives 22% of income $\\rightarrow (p_4=0.8, L_4=0.48)$
* Quintile 5 (Top 20%): receives 52% of income $\\rightarrow (p_5=1.0, L_5=1.00)$

Using trapezoidal integration under the Lorenz curve:
$$B = \\sum_{i=1}^5 \\frac{L_{i-1} + L_i}{2} \\times 0.2$$
$$B = 0.2 \\times \\left[ \\frac{0+0.04}{2} + \\frac{0.04+0.12}{2} + \\frac{0.12+0.26}{2} + \\frac{0.26+0.48}{2} + \\frac{0.48+1.00}{2} \\right]$$
$$B = 0.2 \\times [0.02 + 0.08 + 0.19 + 0.37 + 0.74] = 0.2 \\times 1.40 = 0.28$$
$$\\mathbf{G} = 1 - 2(B) = 1 - 2(0.28) = 1 - 0.56 = \\mathbf{0.44}$$

---

### 2.2 The Foster-Greer-Thorbecke (FGT) Poverty Metrics
Let $z$ be the poverty line, $y_i$ be income of individual $i$, $N$ total population, and $q$ the count of poor individuals ($y_i < z$):
$$P_\\alpha = \\frac{1}{N} \\sum_{i=1}^q \\left( \\frac{z - y_i}{z} \\right)^\\alpha$$

1. **Headcount Ratio ($\\alpha = 0$):** $P_0 = \\frac{q}{N}$ (Proportion of population living in poverty).
2. **Poverty Gap Index ($\\alpha = 1$):** $P_1 = \\frac{1}{N} \\sum_{i=1}^q \\left( \\frac{z - y_i}{z} \\right)$ (Depth of poverty; the per capita cash transfer required to lift all poor to the poverty line).
3. **Squared Poverty Gap / Poverty Severity ($\\alpha = 2$):** $P_2 = \\frac{1}{N} \\sum_{i=1}^q \\left( \\frac{z - y_i}{z} \\right)^2$ (Captures inequality among the poor themselves; satisfies Sen's Transfer Axiom).

#### 💡 Worked Numerical Example 2.2: FGT Poverty Indices Calculation
Suppose a community of $N = 10$ individuals has daily incomes:
$$\\{20, 40, 60, 80, 90, 110, 130, 150, 180, 200\\}$$
Poverty line is $z = \\$100$. There are $q = 5$ poor individuals.
1. **Normalized Poverty Shortfalls $\\left(\\frac{100 - y_i}{100}\\right)$:**
   * Individual 1: $\\frac{100 - 20}{100} = 0.80$
   * Individual 2: $\\frac{100 - 40}{100} = 0.60$
   * Individual 3: $\\frac{100 - 60}{100} = 0.40$
   * Individual 4: $\\frac{100 - 80}{100} = 0.20$
   * Individual 5: $\\frac{100 - 90}{100} = 0.10$
2. **Headcount Index ($P_0$):** $P_0 = \\frac{5}{10} = \\mathbf{50\\%}$.
3. **Poverty Gap Index ($P_1$):**
   $$P_1 = \\frac{0.80 + 0.60 + 0.40 + 0.20 + 0.10}{10} = \\frac{2.10}{10} = \\mathbf{0.21 = 21\\%}$$
4. **Poverty Severity Index ($P_2$):**
   $$P_2 = \\frac{0.80^2 + 0.60^2 + 0.40^2 + 0.20^2 + 0.10^2}{10} = \\frac{0.64 + 0.36 + 0.16 + 0.04 + 0.01}{10} = \\frac{1.21}{10} = \\mathbf{0.121 = 12.1\\%}$$

---

## Chapter 3: Dual-Sector and Structural Transformation Models

### 3.1 The W. Arthur Lewis Model of Unlimited Supplies of Labor (1954)
The economy consists of two sectors:
1. **Traditional Rural Sector:** Agrarian, zero or negligible marginal product of labor ($MP_L \\approx 0$, disguised unemployment). Workers receive average subsistence wage $\\bar{w}$.
2. **Modern Industrial Sector:** Capitalist, high productivity ($MP_L > 0$). Pays a constant institutional urban wage $w_u = (1.30) \\bar{w}$.

\`\`\`chart
{
  "type": "line",
  "title": "Lewis Dual-Sector Model: Industrial Capitalist Expansion and Reinvestment",
  "xAxis": "Modern_Sector_Labor",
  "series": [
    { "key": "MPL_Stage1", "name": "MPL Initial Capital K1", "color": "#94a3b8" },
    { "key": "MPL_Stage2", "name": "MPL Reinvested Capital K2", "color": "#0ea5e9" },
    { "key": "MPL_Stage3", "name": "MPL Advanced Capital K3", "color": "#6366f1" },
    { "key": "Urban_Wage", "name": "Constant Urban Wage wu", "color": "#ef4444" }
  ],
  "data": [
    { "Modern_Sector_Labor": 10, "MPL_Stage1": 35, "MPL_Stage2": 50, "MPL_Stage3": 70, "Urban_Wage": 15 },
    { "Modern_Sector_Labor": 20, "MPL_Stage1": 25, "MPL_Stage2": 38, "MPL_Stage3": 55, "Urban_Wage": 15 },
    { "Modern_Sector_Labor": 30, "MPL_Stage1": 15, "MPL_Stage2": 28, "MPL_Stage3": 42, "Urban_Wage": 15 },
    { "Modern_Sector_Labor": 40, "MPL_Stage1": 8, "MPL_Stage2": 18, "MPL_Stage3": 30, "Urban_Wage": 15 },
    { "Modern_Sector_Labor": 50, "MPL_Stage1": 3, "MPL_Stage2": 10, "MPL_Stage3": 20, "Urban_Wage": 15 }
  ]
}
\`\`\`

* **The Engine of Growth:** The capitalist sector extracts economic surplus ($Total Output - Total Wages Paid$). Reinvestment of this profit into capital accumulation shifts the $MP_L$ curve outward, absorbing more surplus agricultural labor without creating wage inflation.
* **The Lewis Turning Point:** Occurs when surplus rural labor is fully exhausted. The rural supply curve becomes upward-sloping, requiring rising real wages across the entire economy.

---

### 3.2 The Harris-Todaro Model of Rural-Urban Migration
John Harris and Michael Todaro (1970) resolved the paradox of continuous rural-to-urban migration despite massive urban unemployment.

#### The Equilibrating Expected Wage Condition:
A risk-neutral rural worker migrates if expected urban income exceeds rural agricultural wage $w_A$:
$$w_A = \\mathbb{E}[w_u] = w_u \\cdot P_e$$
Where $P_e$ is the probability of securing a formal urban job:
$$P_e = \\frac{E_u}{L_u} = \\frac{\\text{Urban Formal Employment}}{\\text{Total Urban Labor Force}}$$
$$w_A = w_u \\left( \\frac{E_u}{L_u} \\right)$$

#### 💡 Worked Numerical Example 3.1: Harris-Todaro Migration Equilibrium
Suppose the rural agricultural wage is $w_A = \\$60\\text{/month}$. The institutional minimum wage in the urban modern sector is $w_u = \\$150\\text{/month}$. Total urban formal jobs $E_u = 400,000$.
1. **Find the Equilibrium Job Probability ($P_e^*$):**
   $$w_A = w_u \\cdot P_e \\implies 60 = 150 \\cdot P_e \\implies P_e^* = \\frac{60}{150} = \\mathbf{0.40 = 40\\%}$$
2. **Find Equilibrium Urban Labor Force ($L_u^*$):**
   $$P_e^* = \\frac{E_u}{L_u} \\implies 0.40 = \\frac{400,000}{L_u} \\implies L_u^* = \\frac{400,000}{0.40} = \\mathbf{1,000,000\\text{ workers}}$$
3. **Urban Unemployment:**
   $$\\text{Unemployed} = L_u^* - E_u = 1,000,000 - 400,000 = \\mathbf{600,000\\text{ workers}}$$
   $$\\text{Urban Unemployment Rate} = 1 - P_e^* = 1 - 0.40 = \\mathbf{60\\%}$$

---

## Chapter 4: Coordination Failures and Poverty Traps

### 4.1 Rosenstein-Rodan's Big Push Model
In the presence of increasing returns to scale and market externalities, an economy can get stuck in an **underdevelopment trap** (Pareto-inferior equilibrium).
* A single firm modernizing and adopting high fixed-cost technology cannot be profitable because domestic consumer purchasing power is too small.
* **The Big Push:** Simultaneous, coordinated public investments across multiple complementary manufacturing sectors generate mutual demand for each other's products, shifting the entire economy to the high-productivity equilibrium.

---

### 4.2 Kremer's O-Ring Theory of Development (1993)
Named after the Challenger space shuttle disaster caused by the failure of a single inexpensive component (the O-ring).
Production involves $n$ tasks, each requiring skill level $q_i \\in [0, 1]$:
$$Y = A \\prod_{i=1}^n q_i$$
* **Positive Assortative Matching:** High-skill workers cluster together with high-skill coworkers in high-tech firms.
* Small differences in worker skill lead to **exponential, magnified differences in national wages and GDP**.
* Countries with low average skill face low incentives for individuals to invest in human capital (Skill Trap).

---

## Chapter 5: Institutions and Capabilities in Development

### 5.1 Amartya Sen's Capability Approach
* **Commodities vs Functionings:** Commodities are mere instruments. **Functionings** are what a person actually succeeds in doing or being (being nourished, healthy, literate, socially respected).
* **Capabilities:** The freedom and real opportunities an individual possesses to achieve combinations of functionings.
* **Development as Freedom:** Freedom is both the **primary objective** (constitutive role) and the **principal means** (instrumental role) of economic development.

---

### 5.2 The Colonial Origins of Comparative Development
Daron Acemoglu, Simon Johnson, and James A. Robinson (2001) established the causal impact of institutions on long-run development using historical **Settler Mortality Rates** as an Instrumental Variable ($IV$):

\`\`\`mermaid
graph LR
    A[Historical Settler Mortality in 18th Century] --> B[Colonial Settlement Strategy]
    B --> C[Early Historical Institutions]
    C --> D[Modern Institutional Quality Rule of Law]
    D --> E[Current Real GDP per Capita]
\`\`\`

1. **Extractive Institutions (High Settler Mortality - e.g., Congo, West Africa):** Colonizers established coercive systems to extract natural resources without protecting private property rights for the indigenous population.
2. **Inclusive Institutions (Low Settler Mortality - e.g., USA, Canada, Australia):** Colonizers settled in large numbers and created institutions that enforced property rights, constraints on government power, and equal legal access.

---

## Chapter 6: The Resource Curse and Dutch Disease

### 6.1 Mechanics of Dutch Disease
When a country experiences a massive natural resource discovery (e.g., Crude Oil in Nigeria, Natural Gas in the Netherlands):
1. **Resource Movement Effect:** Capital and labor flow into the booming extractive sector, starving domestic agriculture and manufacturing.
2. **Spending Effect:** Massive foreign exchange inflows cause severe **real exchange rate appreciation**:
   $$RER = e \\cdot \\frac{P_{\\text{domestic}}}{P_{\\text{foreign}}} \\uparrow$$
3. **De-industrialization:** Domestic non-oil export sectors (cocoa, textiles, groundnuts) lose international competitiveness and collapse.

---

### 6.2 Institutional Remedies
* **Sovereign Wealth Funds (SWFs):** Sterilizing resource windfalls into offshore diversified portfolios to prevent domestic currency overvaluation.
* **Fiscal Rules:** Countercyclical budget frameworks (e.g., Oil Price-Based Fiscal Rule in Nigeria) that smooth government expenditure across boom-and-bust commodity price cycles.
`;
