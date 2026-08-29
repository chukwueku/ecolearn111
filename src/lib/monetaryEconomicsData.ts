export const MONETARY_ECONOMICS_GUIDE = `
# Monetary Economics: Money, Banking, and Central Bank Policy

## Course Overview
Monetary Economics examines the role of money, credit, and financial institutions in determining output, prices, and interest rates. It develops the analytical foundations of money supply creation, the microfoundations of money demand, term structure theories of interest rates, and the monetary transmission mechanisms through which Central Banks influence the real economy.

---

## Chapter 1: Nature, Functions, and Evolution of Money

### 1.1 The Theoretical Functions of Money
Money is uniquely defined by four universal functions:
1. **Medium of Exchange:** Eliminates the necessity of a "double coincidence of wants" in a barter system, drastically lowering transaction and search costs.
2. **Unit of Account:** Serves as a standard numerical monetary unit of measurement of the market value of goods, services, and assets.
3. **Store of Value:** An asset that retains purchasing power into future periods (subject to erosion by inflation).
4. **Standard of Deferred Payment:** Standardizes debt contracts and future loan obligations.

---

### 1.2 Monetary Aggregates
Central banks categorize money supply based on its degree of liquidity:
* **$M_0$ (Monetary Base / High-Powered Money $B$):** Currency in circulation ($C$) + Total bank reserves held at the Central Bank ($R$).
* **$M_1$ (Narrow Money):** Currency in circulation + Demand deposits (checkable checking accounts) + Non-bank traveler's checks. Highly liquid.
* **$M_2$ (Broad Money):** $M_1$ + Savings deposits + Small-denomination time deposits (certificates of deposit) + Retail money market mutual funds.
* **$M_3$ (Broadest Money):** $M_2$ + Large-denomination institutional time deposits + Term repurchase agreements (Repos) + Eurodollar deposits.

---

## Chapter 2: The Money Supply Process & The Money Multiplier

### 2.1 The Balance Sheet of the Central Bank
The monetary base $B$ is created exclusively by the Central Bank:
$$\\text{Assets} = \\text{Liabilities}$$
$$\\text{Government Securities} + \\text{Foreign Exchange Reserves} + \\text{Discount Loans} = \\text{Currency in Circulation } C + \\text{Bank Reserves } R$$

### 2.2 Derivation of the Complete Money Multiplier
Total money supply is $M = C + D$, where $D$ is total checkable bank deposits.
Total monetary base is $B = C + R$, where bank reserves $R = RR + ER$ (Required Reserves $RR$ + Excess Reserves $ER$).

Define behavioral ratios:
* **Currency-to-Deposit Ratio:** $c = \\frac{C}{D}$ (determined by public preference for cash)
* **Required Reserve Ratio:** $r_d = \\frac{RR}{D}$ (mandated by Central Bank)
* **Excess Reserve Ratio:** $e = \\frac{ER}{D}$ (held by commercial banks for liquidity)

Expressing $M$ and $B$ in terms of deposits $D$:
$$M = c D + D = (1 + c) D$$
$$B = c D + r_d D + e D = (c + r_d + e) D$$

Dividing $M$ by $B$ gives the **Money Multiplier ($m$)**:
$$m = \\frac{M}{B} = \\frac{1 + c}{c + r_d + e}$$
$$M = m \\cdot B = \\left(\\frac{1 + c}{c + r_d + e}\\right) B$$

\`\`\`chart
{
  "type": "bar",
  "title": "Money Multiplier Sensitivity to Reserve Ratios (rd) and Cash Preferences (c)",
  "xAxis": "Scenario",
  "series": [
    { "key": "Multiplier", "name": "Money Multiplier (m)", "color": "#0ea5e9" }
  ],
  "data": [
    { "Scenario": "Baseline (c=0.2, rd=0.1, e=0.02)", "Multiplier": 3.75 },
    { "Scenario": "High CRR (c=0.2, rd=0.25, e=0.02)", "Multiplier": 2.55 },
    { "Scenario": "Cash Panic (c=0.6, rd=0.1, e=0.05)", "Multiplier": 2.13 },
    { "Scenario": "Digital Economy (c=0.05, rd=0.1, e=0.01)", "Multiplier": 6.56 }
  ]
}
\`\`\`

#### 💡 Worked Mathematical Example 2.1: Calculating the Money Supply
Suppose total checkable deposits $D = \\$800\\text{ billion}$, currency in circulation $C = \\$200\\text{ billion}$, required reserve ratio $r_d = 10\\%$, excess reserves $ER = \\$16\\text{ billion}$, and total monetary base $B = \\$296\\text{ billion}$.
1. **Ratios:**
   * $c = \\frac{200}{800} = 0.25$
   * $r_d = 0.10$
   * $e = \\frac{16}{800} = 0.02$
2. **Money Multiplier ($m$):**
   $$m = \\frac{1 + 0.25}{0.25 + 0.10 + 0.02} = \\frac{1.25}{0.37} \\approx \\mathbf{3.378}$$
3. **Total Money Supply ($M_1$):**
   $$M_1 = m \\times B = 3.378 \\times 296\\text{B} = \\mathbf{\\$1,000\\text{ billion}} \\quad (C + D = 200 + 800 = 1000\\text{B})$$
4. **Impact of a \\$10B Open Market Purchase:**
   $$\\Delta M_1 = m \\times \\Delta B = 3.378 \\times 10\\text{B} = \\mathbf{+\\$33.78\\text{ billion}}$$

---

## Chapter 3: Advanced Theories of Money Demand

### 3.1 The Classical and Cambridge Quantity Theory
* **Irving Fisher (1911) Equation of Exchange:**
  $$M \\cdot V = P \\cdot Y$$
  Assuming constant velocity of circulation $\\bar{V}$ and full-employment potential output $\\bar{Y}$, changes in the money supply $M$ produce an exact, one-for-one proportional change in the price level $P$ (**Classical Neutrality of Money**).
* **Cambridge Cash-Balance Approach (Marshall / Pigou):**
  $$M^d = k \\cdot P \\cdot Y \\quad \\text{where } k = \\frac{1}{V}$$

---

### 3.2 Keynesian Liquidity Preference Theory
John Maynard Keynes identified three motives for holding real money balances $\\left(\\frac{M}{P}\\right)^d$:
1. **Transactions Motive:** $L_1(Y)$ ($L_1' > 0$) — financing daily purchases.
2. **Precautionary Motive:** $L_2(Y)$ ($L_2' > 0$) — unexpected financial emergencies.
3. **Speculative Motive:** $L_3(i)$ ($L_3' < 0$) — holding money when bond prices are expected to fall (interest rates expected to rise).
$$\\left(\\frac{M}{P}\\right)^d = L(Y, i) = kY - h i$$

---

### 3.3 The Baumol-Tobin Inventory-Theoretic Model
William Baumol (1952) and James Tobin (1956) modeled money demand as an inventory optimization problem.
A consumer receives annual income $Y$, visits the bank $N$ times a year, incurs fixed transaction brokerage fee $b$ per withdrawal, and faces interest opportunity cost $i$.

Average cash balance is $\\frac{Y}{2N}$. The total annual cost function is:
$$\\text{Total Cost} = b \\cdot N + i \\cdot \\left(\\frac{Y}{2N}\\right)$$
Minimizing with respect to $N$:
$$\\frac{d(\\text{Total Cost})}{dN} = b - \\frac{i Y}{2 N^2} = 0 \\implies N^* = \\sqrt{\\frac{i Y}{2b}}$$

#### The Optimal Average Money Demand ($M^*$):
$$M^* = \\frac{Y}{2 N^*} = \\sqrt{\\frac{b Y}{2i}}$$

#### 💡 Worked Mathematical Example 3.1: Baumol-Tobin Optimal Cash Balance
A consultant earns annual salary $Y = \\$72,000$. Bank withdrawal fee $b = \\$5.00$ per transaction. Annual interest rate on savings $i = 5\\% = 0.05$.
1. **Optimal Number of Trips to Bank ($N^*$):**
   $$N^* = \\sqrt{\\frac{0.05 \\times 72,000}{2 \\times 5}} = \\sqrt{\\frac{3600}{10}} = \\sqrt{360} \\approx \\mathbf{19\\text{ trips per year}}$$
2. **Optimal Withdrawal Size ($Z^*$):**
   $$Z^* = \\frac{Y}{N^*} = \\frac{72,000}{19} \\approx \\mathbf{\\$3,790}$$
3. **Average Money Balance ($M^*$):**
   $$M^* = \\frac{Z^*}{2} = \\frac{3,790}{2} = \\mathbf{\\$1,895}$$

---

## Chapter 4: Term Structure and Interest Rate Determination

### 4.1 The Fisher Equation
$$i_t = r_t + \\pi_t^e$$
Where $i_t$ is nominal interest rate, $r_t$ is real interest rate, and $\\pi_t^e$ is expected inflation.

### 4.2 Theories of the Yield Curve (Term Structure)
The yield curve plots bond yields against their maturities ($1\\text{M}, 2\\text{Y}, 5\\text{Y}, 10\\text{Y}, 30\\text{Y}$).

\`\`\`chart
{
  "type": "line",
  "title": "Yield Curve Profiles: Normal, Inverted (Recession Signal), and Flat",
  "xAxis": "Maturity_Years",
  "series": [
    { "key": "Normal_Yield", "name": "Normal Expansion Yield Curve", "color": "#10b981" },
    { "key": "Inverted_Yield", "name": "Inverted Recession Yield Curve", "color": "#ef4444" },
    { "key": "Flat_Yield", "name": "Flat Transition Yield Curve", "color": "#f59e0b" }
  ],
  "data": [
    { "Maturity_Years": 1, "Normal_Yield": 3.0, "Inverted_Yield": 5.8, "Flat_Yield": 4.5 },
    { "Maturity_Years": 2, "Normal_Yield": 3.4, "Inverted_Yield": 5.4, "Flat_Yield": 4.5 },
    { "Maturity_Years": 5, "Normal_Yield": 4.1, "Inverted_Yield": 4.8, "Flat_Yield": 4.5 },
    { "Maturity_Years": 10, "Normal_Yield": 4.8, "Inverted_Yield": 4.2, "Flat_Yield": 4.5 },
    { "Maturity_Years": 30, "Normal_Yield": 5.5, "Inverted_Yield": 3.8, "Flat_Yield": 4.5 }
  ]
}
\`\`\`

1. **Expectations Hypothesis:** An $n$-period long-term interest rate $i_{nt}$ equals the average of expected future 1-period short rates:
   $$i_{nt} = \\frac{1}{n} \\sum_{j=0}^{n-1} \\mathbb{E}_t [i_{1, t+j}]$$
2. **Liquidity Premium Theory:** Investors demand an additional term premium $k_{nt} > 0$ to compensate for the higher duration risk of holding long-term bonds:
   $$i_{nt} = \\frac{1}{n} \\sum_{j=0}^{n-1} \\mathbb{E}_t [i_{1, t+j}] + k_{nt}$$
   * **Inverted Yield Curve ($i_{10\\text{Y}} < i_{2\\text{Y}}$):** When markets expect aggressive central bank rate cuts due to an impending economic recession.

---

## Chapter 5: Monetary Policy Transmission Mechanisms

The Central Bank changes its policy rate ($MPR$), which ripples through the real economy via five distinct channels:

\`\`\`mermaid
graph TD
    A[Central Bank Raises Policy Rate MPR] --> B[Interest Rate Channel: Real r Rises]
    A --> C[Exchange Rate Channel: Capital Inflows]
    A --> D[Asset Price Channel: Equity Prices Fall]
    A --> E[Credit Channel: Bank Lending Drops]
    
    B --> F[Cost of Capital Rises -> Investment I & Consumption C Fall]
    C --> G[Domestic Currency Appreciates -> Net Exports NX Fall]
    D --> H[Tobin's q Falls & Wealth Effect Reduces Consumption C]
    E --> I[Loan Supply to Small Firms Contracts]
    
    F --> J[Aggregate Demand AD Contracts -> Inflation Drops & Output Cools]
    G --> J
    H --> J
    I --> J
\`\`\`

---

## Chapter 6: Monetary Policy in Nigeria (CBN Framework)

### 6.1 Instruments of the Central Bank of Nigeria (CBN)
1. **Monetary Policy Rate (MPR):** The anchor interest rate signaling the stance of monetary policy, flanked by an asymmetric corridor (e.g., $+100 / -300$ bps) for the Standing Lending Facility (SLF) and Standing Deposit Facility (SDF).
2. **Cash Reserve Ratio (CRR):** Mandatory minimum percentage of total customer deposits that commercial banks must sterilize with the CBN (e.g., $32.5\\% - 45.0\\%$).
3. **Liquidity Ratio (LR):** Minimum percentage of liquid assets to total liabilities (typically $30\\%$).
4. **Open Market Operations (OMO):** Issuance of CBN OMO bills to institutional investors to absorb or inject excess liquidity into the interbank system.

### 6.2 Structural Challenges in Developing Economies
* **Fiscal Dominance:** When government fiscal deficits are monetized by the Central Bank (Ways and Means advances), causing structural inflationary pressures that neutralize interest rate hikes.
* **Informal Financial Sector:** A large unbanked population reduces the sensitivity of aggregate demand to interest rate adjustments.
* **Foreign Exchange Pass-Through:** Heavy import dependence causes exchange rate depreciation to rapidly transmit into domestic CPI inflation.
`;
