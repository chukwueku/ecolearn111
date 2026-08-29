export const MACRO_ECONOMICS_ADVANCED_GUIDE = `
# Advanced Macroeconomics: Equilibrium, Growth, and Policy

## Course Overview
Advanced Macroeconomics provides dynamic, quantitative models of the aggregate economy. It explores the short-run fluctuations of output and employment (Business Cycles), medium-run adjustments of inflation and monetary policy (Phillips Curve, Taylor Rule), and long-run determinants of living standards and technological progress (Solow-Swan, Ramsey, and Endogenous Growth Models).

---

## Chapter 1: National Income Accounting and Aggregate Dynamics

### 1.1 The Circular Flow and National Product Identities
National output can be measured identically through three equivalent approaches:
1. **Expenditure Approach:**
   $$Y = C + I + G + (X - M)$$
   Where $C = \\text{Household Consumption}$, $I = \\text{Gross Private Investment}$, $G = \\text{Government Purchases}$, $X - M = \\text{Net Exports} (NX)$.
2. **Income Approach:**
   $$Y = W + R + i + \\Pi + \\text{Depreciation} + \\text{Indirect Business Taxes}$$
   Where $W = \\text{Wages}$, $R = \\text{Rental Income}$, $i = \\text{Net Interest}$, $\\Pi = \\text{Corporate Profits}$.
3. **Value Added (Product) Approach:**
   $$Y = \\sum_{j=1}^M (\\text{Gross Output of Industry } j - \\text{Intermediate Inputs of Industry } j)$$

---

### 1.2 The National Savings-Investment Identity
Defining private disposable income $Y_d = Y - T + TR$ (where $T$ is taxes and $TR$ is transfers):
* **Private Saving ($S_p$):** $S_p = Y_d - C = Y - T + TR - C$
* **Public Saving ($S_g$):** $S_g = T - TR - G$ (Government Budget Balance)
* **National Saving ($S$):** $S = S_p + S_g = (Y - C - G)$

Setting National Saving into the expenditure equation yields the foundational macroeconomic balance:
$$S - I = (G + TR - T) + NX$$
$$(S_p - I) + (T - G - TR) = NX$$
**Economic Implication (Twin Deficits):** If a nation runs a large government fiscal deficit ($G + TR > T$) and private saving is insufficient to finance domestic investment ($S_p < I$), the economy must inevitably run a foreign trade/current account deficit ($NX < 0$).

---

## Chapter 2: The IS-LM Framework (Closed Economy)

### 2.1 The IS Curve (Goods Market Equilibrium)
Goods market equilibrium occurs when aggregate output $Y$ equals planned expenditure $E$:
$$Y = C(Y - T) + I(r) + G$$
Where $I'(r) < 0$ reflects that higher real interest rates increase the cost of capital, reducing investment.

#### Derivation of the Slope of the IS Curve:
Totally differentiating:
$$dY = C'(Y - T)(dY - dT) + I'(r)dr + dG$$
$$(1 - c_1)dY = I'(r)dr + dG - c_1 dT$$
$$\\frac{dr}{dY}\\Bigg|_{IS} = \\frac{1 - c_1}{I'(r)} < 0$$
* The **IS curve slopes downward** because an increase in the interest rate $r$ lowers planned investment $I(r)$, which through the Keynesian multiplier $\\frac{1}{1 - c_1}$ reduces total equilibrium income $Y$.
* **Fiscal Policy Multiplier:** $\\frac{\\partial Y}{\\partial G} = \\frac{1}{1 - c_1(1-t)}$.

---

### 2.2 The LM Curve (Money Market Equilibrium)
The money market clears when real money supply $\\frac{M}{P}$ equals real money demand $L(Y, r)$:
$$\\frac{M}{P} = L(Y, r) = kY - h r \\quad (k > 0, h > 0)$$

#### Derivation of the Slope of the LM Curve:
Totally differentiating:
$$d\\left(\\frac{M}{P}\\right) = k dY - h dr = 0 \\implies \\frac{dr}{dY}\\Bigg|_{LM} = \\frac{k}{h} > 0$$
* The **LM curve slopes upward** because higher income $Y$ expands transaction demand for money, requiring higher interest rates $r$ to choke off speculative demand and restore equilibrium.

\`\`\`chart
{
  "type": "line",
  "title": "Simultaneous Equilibrium in Goods and Money Markets (IS-LM Model)",
  "xAxis": "National_Income_Y",
  "series": [
    { "key": "IS_Curve", "name": "IS Curve (Goods Market)", "color": "#0ea5e9" },
    { "key": "LM_Curve", "name": "LM Curve (Money Market)", "color": "#10b981" }
  ],
  "data": [
    { "National_Income_Y": 200, "IS_Curve": 14, "LM_Curve": 2 },
    { "National_Income_Y": 400, "IS_Curve": 11, "LM_Curve": 4 },
    { "National_Income_Y": 600, "IS_Curve": 8, "LM_Curve": 6 },
    { "National_Income_Y": 800, "IS_Curve": 5, "LM_Curve": 8 },
    { "National_Income_Y": 1000, "IS_Curve": 2, "LM_Curve": 10 }
  ]
}
\`\`\`

#### 💡 Worked Mathematical Example 2.1: Solving the IS-LM Equilibrium
Consider an economy with behavioral equations:
* Consumption: $C = 200 + 0.75(Y - T)$
* Investment: $I = 400 - 1000r$
* Government Spending: $G = 300$, Taxes: $T = 200$
* Real Money Demand: $\\left(\\frac{M}{P}\\right)^d = 0.5Y - 2000r$
* Real Money Supply: $\\frac{M}{P} = 600$

**1. Derive the IS Equation:**
$$Y = 200 + 0.75(Y - 200) + 400 - 1000r + 300$$
$$Y = 750 + 0.75Y - 1000r$$
$$0.25Y = 750 - 1000r \\implies Y = 3000 - 4000r \\quad \\text{(IS Curve)}$$

**2. Derive the LM Equation:**
$$600 = 0.5Y - 2000r \\implies 0.5Y = 600 + 2000r \\implies Y = 1200 + 4000r \\quad \\text{(LM Curve)}$$

**3. Equate IS and LM to find Equilibrium $(r^*, Y^*)$:**
$$3000 - 4000r = 1200 + 4000r$$
$$1800 = 8000r \\implies r^* = \\frac{1800}{8000} = 0.225 = \\mathbf{22.5\\%}$$
$$Y^* = 3000 - 4000(0.225) = 3000 - 900 = \\mathbf{2100}$$

---

### 2.3 Policy Interactions & The Liquidity Trap
1. **Crowding-Out Effect:** Expansionary fiscal policy ($G \\uparrow$) shifts the IS curve rightward. While income rises, higher money demand pushes up interest rates $r$, crowding out private investment $I(r)$.
2. **The Liquidity Trap ($h \\to \\infty$):** At the Zero Lower Bound (ZLB), money demand is horizontal. Monetary policy cannot lower interest rates further ($dr/dM = 0$). Here, fiscal policy is at **maximum effectiveness** with zero crowding-out.

---

## Chapter 3: Open Economy Macroeconomics: The Mundell-Fleming Model

The **Mundell-Fleming Model** extends IS-LM to an open economy with international capital flows:
$$\\text{IS: } Y = C(Y - T) + I(r) + G + NX(e, Y, Y^*)$$
$$\\text{LM: } \\frac{M}{P} = L(Y, r)$$
$$\\text{BP: } r = r^* \\quad (\\text{under Perfect Capital Mobility (UIP)})$$

| Exchange Rate Regime | Monetary Policy ($\Delta M$) | Fiscal Policy ($\Delta G$) |
|---|---|---|
| **Floating Exchange Rate** | **Highly Effective:** $\\Delta M \\uparrow \\implies r \\downarrow \\implies \\text{Capital Outflow} \\implies e \\text{ depreciates} \\implies NX \\uparrow \\implies Y \\uparrow$ | **Completely Ineffective:** $\\Delta G \\uparrow \\implies r \\uparrow \\implies \\text{Capital Inflow} \\implies e \\text{ appreciates} \\implies NX \\downarrow$ (100% Crowding Out via $NX$) |
| **Fixed Exchange Rate** | **Completely Ineffective:** Central Bank loses monetary autonomy; money supply must adjust to maintain exchange peg. | **Highly Effective:** $\\Delta G \\uparrow \\implies r \\uparrow \\implies \\text{Capital Inflow} \\implies \\text{Central Bank buys FX, expanding } M \\implies Y \\uparrow\\uparrow$ |

#### The Impossible Trinity (Policy Trilemma):
An open economy cannot simultaneously maintain:
1. **Fixed Exchange Rate**
2. **Free International Capital Mobility**
3. **Independent Sovereign Monetary Policy**

---

## Chapter 4: Aggregate Demand & Aggregate Supply (AD-AS)

### 4.1 Derivation of Aggregate Demand (AD)
The AD curve is derived by varying price level $P$ in the IS-LM framework:
$$P \\uparrow \\implies \\frac{M}{P} \\downarrow \\implies \\text{LM shifts left} \\implies r \\uparrow \\implies I \\downarrow \\implies Y \\downarrow$$
$$Y^{AD} = \\gamma \\bar{A} + \\beta \\left(\\frac{M}{P}\\right)$$

---

### 4.2 Theories of Short-Run Aggregate Supply (SRAS)
Unlike the vertical Classical Long-Run Aggregate Supply (LRAS at potential output $Y^*$), the Short-Run Aggregate Supply curve slopes upward due to nominal rigidities:
$$Y = Y^* + \\alpha (P - P^e)$$

#### Four Theoretical Foundations of Upward-Sloping SRAS:
1. **Sticky-Wage Model (Keynes / Fischer):** Nominal wages $W$ are fixed by long-term labor contracts:
   $$P > P^e \\implies \\frac{W}{P} \\downarrow \\implies \\text{Firms hire more labor } L \\implies Y \\uparrow$$
2. **Worker-Misperception Model (Friedman):** Workers temporarily confuse general price inflation with an increase in their real relative wage.
3. **Imperfect-Information Model (Lucas):** Producers misinterpret aggregate price inflation as an increase in the relative demand for their specific good.
4. **Sticky-Price Model / Menu Costs (Mankiw / Calvo):** Staggered price-setting firms adjust prices with delays due to menu costs.

---

## Chapter 5: Inflation Dynamics and the Phillips Curve

### 5.1 The Expectations-Augmented Phillips Curve
Developed by Milton Friedman and Edmund Phelps:
$$\\pi_t = \\pi_t^e - \\beta (u_t - u_n) + v_t$$
Where:
* $\\pi_t$ = Actual Inflation Rate
* $\\pi_t^e$ = Expected Inflation Rate
* $u_t - u_n$ = Cyclical Unemployment (deviation from Non-Accelerating Inflation Rate of Unemployment, NAIRU)
* $v_t$ = Exogenous Supply Shock (e.g., global oil spike)

\`\`\`chart
{
  "type": "line",
  "title": "Expectations-Augmented Phillips Curve: Shift from Adaptive to Higher Expected Inflation",
  "xAxis": "Unemployment_Rate_u",
  "series": [
    { "key": "SRPC_Initial", "name": "SR Phillips Curve (pi_e = 2%)", "color": "#0ea5e9" },
    { "key": "SRPC_Shifted", "name": "SR Phillips Curve (pi_e = 6%)", "color": "#f43f5e" },
    { "key": "LRPC", "name": "Long-Run Phillips Curve (NAIRU = 5%)", "color": "#10b981" }
  ],
  "data": [
    { "Unemployment_Rate_u": 3, "SRPC_Initial": 6, "SRPC_Shifted": 10, "LRPC": 0 },
    { "Unemployment_Rate_u": 4, "SRPC_Initial": 4, "SRPC_Shifted": 8, "LRPC": 5 },
    { "Unemployment_Rate_u": 5, "SRPC_Initial": 2, "SRPC_Shifted": 6, "LRPC": 12 },
    { "Unemployment_Rate_u": 6, "SRPC_Initial": 0, "SRPC_Shifted": 4, "LRPC": 5 },
    { "Unemployment_Rate_u": 7, "SRPC_Initial": -2, "SRPC_Shifted": 2, "LRPC": 0 }
  ]
}
\`\`\`

---

### 5.2 The Lucas Critique and Rational Expectations
Robert Lucas (1976) demonstrated that econometric parameters estimated under past policy regimes cannot predict the effect of a new policy because economic agents adapt their expectations rationally:
$$\\pi_t^e = \\mathbb{E}_{t-1}[\\pi_t | \\Omega_{t-1}]$$
* Under **Rational Expectations**, systematic, predictable monetary expansions cannot permanently increase output or reduce unemployment even in the short run (**Policy Ineffectiveness Proposition**).
* Disinflation can be achieved with **zero sacrifice ratio** (zero increase in unemployment) if the Central Bank's inflation target is fully credible and transparent.

---

## Chapter 6: Neoclassical and Modern Growth Theory

### 6.1 The Solow-Swan Growth Model
Assuming a constant returns to scale production function in intensive per capita form $y = f(k)$ where $k = K / (A \\cdot L)$:
$$\\dot{k} = s f(k) - (n + g + \\delta) k$$
Where $s = \\text{Saving rate}$, $n = \\text{Population growth}$, $g = \\text{Technological progress}$, $\\delta = \\text{Depreciation}$.

#### Steady-State Equilibrium ($k^*$):
$$\\dot{k} = 0 \\implies s f(k^*) = (n + g + \\delta) k^*$$

\`\`\`chart
{
  "type": "line",
  "title": "Solow-Swan Growth Model: Capital Accumulation and Steady-State Determination",
  "xAxis": "Capital_Per_Worker_k",
  "series": [
    { "key": "Output_y", "name": "Output per Worker f(k)", "color": "#6366f1" },
    { "key": "Investment_sfk", "name": "Actual Investment s*f(k)", "color": "#10b981" },
    { "key": "BreakEven_Inv", "name": "Break-Even Investment (n+g+delta)k", "color": "#f43f5e" }
  ],
  "data": [
    { "Capital_Per_Worker_k": 0, "Output_y": 0, "Investment_sfk": 0, "BreakEven_Inv": 0 },
    { "Capital_Per_Worker_k": 2, "Output_y": 2.8, "Investment_sfk": 0.84, "BreakEven_Inv": 0.2 },
    { "Capital_Per_Worker_k": 4, "Output_y": 4.0, "Investment_sfk": 1.20, "BreakEven_Inv": 0.4 },
    { "Capital_Per_Worker_k": 6, "Output_y": 4.9, "Investment_sfk": 1.47, "BreakEven_Inv": 0.6 },
    { "Capital_Per_Worker_k": 8, "Output_y": 5.6, "Investment_sfk": 1.68, "BreakEven_Inv": 0.8 },
    { "Capital_Per_Worker_k": 10, "Output_y": 6.3, "Investment_sfk": 1.89, "BreakEven_Inv": 1.0 }
  ]
}
\`\`\`

#### 💡 Worked Mathematical Example 6.1: Solow Steady-State Calculation
Let $Y = K^{0.5} L^{0.5} \\implies y = k^{0.5}$. Saving rate $s = 0.30$, population growth $n = 0.02$, depreciation $\\delta = 0.03$, technological progress $g = 0$.
1. **Steady-State Condition:** $s k^{*0.5} = (n + \\delta) k^*$
2. $$0.30 k^{*0.5} = (0.02 + 0.03) k^* = 0.05 k^*$$
3. $$\\frac{k^*}{k^{*0.5}} = \\frac{0.30}{0.05} \\implies k^{*0.5} = 6 \\implies k^* = 6^2 = \\mathbf{36}$$
4. **Steady-State Output per Worker:** $y^* = \\sqrt{36} = \\mathbf{6}$.
5. **Steady-State Consumption per Worker:** $c^* = (1 - s) y^* = (1 - 0.30) \\times 6 = \\mathbf{4.2}$.
6. **Golden Rule Capital ($k_{\\text{gold}}^*$):**
   $$f'(k_{\\text{gold}}^*) = n + \\delta \\implies 0.5 k_{\\text{gold}}^{*-0.5} = 0.05 \\implies k_{\\text{gold}}^{*-0.5} = 0.1 \\implies k_{\\text{gold}}^* = \\left(\\frac{1}{0.1}\\right)^2 = \\mathbf{100}$$
   To achieve maximum consumption, the optimal Golden Rule saving rate is $s_{\\text{gold}} = \\alpha = \\mathbf{50\\%}$.

---

### 6.2 Endogenous Growth Theory (AK & Romer Models)
Neoclassical models imply that policy cannot change long-run growth (only the level of income). Endogenous growth models eliminate diminishing returns to capital:
$$Y = A K \\implies \\frac{\\dot{Y}}{Y} = s A - \\delta$$
* **Paul Romer (1990) Model:** Ideas and knowledge are **non-rival goods**. Investment in R&D creates permanent positive spillover externalities across the entire economy, allowing sustained long-run endogenous growth.

---

## Chapter 7: Macroeconomic Policy Rules and Debt Sustainability

### 7.1 The Taylor Rule for Monetary Policy
Formulated by John B. Taylor (1993), the nominal policy interest rate $i_t$ tracks inflation and output gaps:
$$i_t = r^* + \\pi_t + \\alpha_\\pi (\\pi_t - \\pi^*) + \\alpha_y (y_t - y^*)$$
* Standard weights: $\\alpha_\\pi = 0.5, \\alpha_y = 0.5$, Equilibrium real rate $r^* = 2\\%$, Target inflation $\\pi^* = 2\\%$.
* **The Taylor Principle:** $\\frac{\\partial i_t}{\\partial \\pi_t} = 1 + \\alpha_\\pi > 1$. The Central Bank must increase nominal interest rates by **more than one-for-one** with inflation to raise the real interest rate ($r = i - \\pi$) and cool demand.

#### 💡 Worked Numerical Example 7.1: Taylor Rule Rate Calculation
Suppose target inflation is $\\pi^* = 2.0\\%$, equilibrium real interest rate $r^* = 2.5\\%$. Current inflation is $\\pi_t = 6.0\\%$, and output is $1.5\\%$ above potential ($y_t - y^* = +1.5\\%$).
$$i_t = 2.5 + 6.0 + 0.5(6.0 - 2.0) + 0.5(1.5)$$
$$i_t = 8.5 + 0.5(4.0) + 0.75 = 8.5 + 2.0 + 0.75 = \\mathbf{11.25\\%}$$
The Central Bank should set the nominal policy interest rate at **11.25%** (real interest rate $r = 11.25 - 6.0 = 5.25\\% > 2.5\\%$) to actively combat inflation.

---

### 7.2 Sovereign Debt Dynamics & Sustainability
Let $B_t$ be the real stock of government debt, $Y_t$ be real GDP, and $d_t = B_t / Y_t$ be the debt-to-GDP ratio:
$$\\Delta d_t = (r - g) d_{t-1} - s_t$$
Where $r = \\text{Real Interest Rate}$, $g = \\text{Real GDP Growth Rate}$, $s_t = \\frac{T_t - G_t}{Y_t} = \\text{Primary Surplus Ratio}$.

* **If $r > g$:** The debt ratio is dynamically unstable. The government must run permanent primary surpluses ($s_t > 0$) to avoid debt explosion.
* **If $r < g$:** The government can roll over its debt and run moderate primary deficits without increasing the debt-to-GDP ratio.
`;
