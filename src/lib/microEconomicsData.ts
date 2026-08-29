export const MICRO_ECONOMICS_ADVANCED_GUIDE = `
# Advanced Microeconomics: Mathematical and Theoretical Foundations

## Course Overview
Advanced Microeconomics provides rigorous mathematical formulations of individual decision-making, market interactions, and general equilibrium. This course bridges the gap between intermediate economic principles and doctoral-level economic theory, employing multivariate calculus, constrained optimization (Lagrange and Kuhn-Tucker multipliers), duality theory, and non-cooperative game theory.

---

## Chapter 1: Advanced Consumer Theory and Duality

### 1.1 Preference Relations and Utility Representation
Consumer theory begins with a preference relation $\\succsim$ defined over a consumption set $X = \\mathbb{R}_+^n$. A rational consumer possesses preferences satisfying four fundamental axioms:
1. **Completeness:** $\\forall x, y \\in X$, either $x \\succsim y$, $y \\succsim x$, or both ($x \\sim y$).
2. **Transitivity:** $\\forall x, y, z \\in X$, if $x \\succsim y$ and $y \\succsim z$, then $x \\succsim z$.
3. **Continuity:** For any $x \\in X$, the upper contour set $\\{y \\in X : y \\succsim x\\}$ and lower contour set $\\{y \\in X : x \\succsim y\\}$ are closed sets in $\\mathbb{R}_+^n$. (Debreu's Representation Theorem guarantees the existence of a continuous utility function $u: X \\to \\mathbb{R}$).
4. **Strict Monotonicity & Strict Convexity:** More of any good is strictly preferred, and diminishing marginal rates of substitution ensure strictly quasi-concave utility functions.

---

### 1.2 The Utility Maximization Problem (UMP)
A consumer with income $I > 0$ facing price vector $p = (p_1, p_2, \\dots, p_n) \\gg 0$ solves:
$$\\max_{x \\ge 0} u(x) \\quad \\text{subject to} \\quad p \\cdot x \\le I$$

Using the Lagrangian formulation:
$$\\mathcal{L}(x, \\lambda) = u(x) + \\lambda (I - p \\cdot x)$$

#### First-Order Necessary Conditions (FOCs):
$$\\frac{\\partial \\mathcal{L}}{\\partial x_i} = \\frac{\\partial u(x^*)}{\\partial x_i} - \\lambda^* p_i = 0 \\quad (\\forall i = 1, \\dots, n)$$
$$\\frac{\\partial \\mathcal{L}}{\\partial \\lambda} = I - \\sum_{i=1}^n p_i x_i^* = 0$$

Taking the ratio of FOCs for any pair of goods $i$ and $j$:
$$\\text{MRS}_{i,j} = \\frac{MU_i}{MU_j} = \\frac{p_i}{p_j}$$
The solution yields the **Marshallian (Uncompensated) Demand Functions**:
$$x_i^* = x_i(p, I)$$

Substituting Marshallian demands back into the utility function gives the **Indirect Utility Function** $v(p, I)$:
$$v(p, I) = u(x^*(p, I))$$

#### Key Properties of Indirect Utility $v(p, I)$:
* Homogeneous of degree 0 in $(p, I)$: $v(kp, kI) = v(p, I)$ for $k > 0$.
* Non-increasing in prices $p$ and strictly increasing in income $I$.
* Quasi-convex in prices $p$.
* **Roy's Identity:** Marshallian demand can be recovered by:
  $$x_i(p, I) = -\\frac{\\frac{\\partial v(p, I)}{\\partial p_i}}{\\frac{\\partial v(p, I)}{\\partial I}}$$

#### 💡 Worked Mathematical Example 1.1: Cobb-Douglas Demand & Roy's Identity
Let utility be $u(x_1, x_2) = x_1^\\alpha x_2^{1-\\alpha}$ with $\\alpha \\in (0, 1)$.
1. Set up the Lagrangian: $\\mathcal{L} = x_1^\\alpha x_2^{1-\\alpha} + \\lambda (I - p_1 x_1 - p_2 x_2)$.
2. Tangency condition: $\\text{MRS}_{1,2} = \\frac{\\alpha x_2}{(1-\\alpha) x_1} = \\frac{p_1}{p_2} \\implies p_2 x_2 = \\frac{1-\\alpha}{\\alpha} p_1 x_1$.
3. Substitute into the budget constraint: $p_1 x_1 + \\frac{1-\\alpha}{\\alpha} p_1 x_1 = I \\implies \\frac{1}{\\alpha} p_1 x_1 = I$.
4. **Marshallian Demands:**
   $$x_1^*(p, I) = \\frac{\\alpha I}{p_1}, \\quad x_2^*(p, I) = \\frac{(1-\\alpha) I}{p_2}$$
5. **Indirect Utility Function:**
   $$v(p, I) = \\left(\\frac{\\alpha I}{p_1}\\right)^\\alpha \\left(\\frac{(1-\\alpha) I}{p_2}\\right)^{1-\\alpha} = I \\cdot \\left(\\frac{\\alpha}{p_1}\\right)^\\alpha \\left(\\frac{1-\\alpha}{p_2}\\right)^{1-\\alpha}$$
6. **Applying Roy's Identity:**
   $$\\frac{\\partial v}{\\partial p_1} = -\\frac{\\alpha}{p_1} v(p, I), \\quad \\frac{\\partial v}{\\partial I} = \\frac{v(p, I)}{I}$$
   $$x_1(p, I) = -\\frac{-\\frac{\\alpha}{p_1} v(p, I)}{\\frac{v(p, I)}{I}} = \\frac{\\alpha I}{p_1} \\quad \\text{(Matches exactly!)}$$

---

### 1.3 The Expenditure Minimization Problem (EMP) and Duality
The dual problem to UMP asks: What is the minimum expenditure needed to achieve target utility level $\\bar{u}$?
$$\\min_{x \\ge 0} p \\cdot x \\quad \\text{subject to} \\quad u(x) \\ge \\bar{u}$$

Using the Lagrangian:
$$\\mathcal{L}(x, \\mu) = p \\cdot x + \\mu (\\bar{u} - u(x))$$

The solution yields the **Hicksian (Compensated) Demand Functions**:
$$h_i^* = h_i(p, \\bar{u})$$

Substituting Hicksian demands into the objective function yields the **Expenditure Function** $e(p, \\bar{u})$:
$$e(p, \\bar{u}) = p \\cdot h(p, \\bar{u})$$

#### Key Properties of Expenditure Function $e(p, \\bar{u})$:
* Homogeneous of degree 1 in prices $p$.
* Strictly increasing in target utility $\\bar{u}$ and non-decreasing in $p$.
* Concave in prices $p$.
* **Shephard's Lemma:** Hicksian demand is the gradient of the expenditure function with respect to price:
  $$h_i(p, \\bar{u}) = \\frac{\\partial e(p, \\bar{u})}{\\partial p_i}$$

---

### 1.4 The Slutsky Equation: Decomposing Price Effects
The fundamental bridge between Marshallian and Hicksian demand is the **Slutsky Decomposition**:
$$\\frac{\\partial x_i(p, I)}{\\partial p_j} = \\underbrace{\\frac{\\partial h_i(p, u)}{\\partial p_j}}_{\\text{Substitution Effect (SE)}} - \\underbrace{x_j(p, I) \\frac{\\partial x_i(p, I)}{\\partial I}}_{\\text{Income Effect (IE)}}$$

\`\`\`chart
{
  "type": "line",
  "title": "Slutsky Decomposition: Income and Substitution Effects of Price Drop",
  "xAxis": "Good_X",
  "series": [
    { "key": "Initial_Budget", "name": "Initial Budget Line", "color": "#94a3b8" },
    { "key": "Compensated_Budget", "name": "Compensated Budget (SE Only)", "color": "#f59e0b" },
    { "key": "Final_Budget", "name": "Final Budget Line (SE + IE)", "color": "#10b981" }
  ],
  "data": [
    { "Good_X": 0, "Initial_Budget": 50, "Compensated_Budget": 62, "Final_Budget": 50 },
    { "Good_X": 20, "Initial_Budget": 40, "Compensated_Budget": 48, "Final_Budget": 45 },
    { "Good_X": 40, "Initial_Budget": 30, "Compensated_Budget": 34, "Final_Budget": 40 },
    { "Good_X": 60, "Initial_Budget": 20, "Compensated_Budget": 20, "Final_Budget": 35 },
    { "Good_X": 80, "Initial_Budget": 10, "Compensated_Budget": 6, "Final_Budget": 30 },
    { "Good_X": 100, "Initial_Budget": 0, "Compensated_Budget": 0, "Final_Budget": 25 }
  ]
}
\`\`\`

#### 💡 Worked Numerical Example 1.2: Slutsky Numerical Split
Let $u(x_1, x_2) = x_1 x_2$, $I = 120$, $p_1 = 2$, $p_2 = 3$.
1. **Initial Consumption (A):** $x_1^A = \\frac{120}{2(2)} = 30$, $x_2^A = \\frac{120}{2(3)} = 20$. Initial utility $u_0 = 30 \\times 20 = 600$.
2. Suppose price of Good 1 drops to $p_1' = 1$.
   * **Final Consumption (C):** $x_1^C = \\frac{120}{2(1)} = 60$. Total Price Effect $\\Delta x_1 = 60 - 30 = +30$.
3. **Compensated Income ($I'$):** The income required to afford the initial basket $(30, 20)$ at new prices is $I' = 1(30) + 3(20) = 90$.
4. **Intermediate Compensated Consumption (B):** $x_1^B = \\frac{90}{2(1)} = 45$.
5. **Decomposition:**
   * **Substitution Effect:** $x_1^B - x_1^A = 45 - 30 = \\mathbf{+15}$
   * **Income Effect:** $x_1^C - x_1^B = 60 - 45 = \\mathbf{+15}$
   * **Total Effect:** $15 + 15 = \\mathbf{+30}$ units.

---

## Chapter 2: Advanced Theory of the Firm and Production

### 2.1 Production Technologies
A firm transforms inputs (Capital $K$, Labor $L$) into output $y$ via production function $y = f(K, L)$.
* **Marginal Rate of Technical Substitution (MRTS):**
  $$\\text{MRTS}_{L,K} = -\\frac{dK}{dL}\\Bigg|_{y=\\bar{y}} = \\frac{MP_L}{MP_K} = \\frac{\\partial f / \\partial L}{\\partial f / \\partial K}$$
* **Elasticity of Substitution ($\\sigma$):** Measures the percentage change in factor ratio relative to MRTS:
  $$\\sigma = \\frac{\\% \\Delta (K/L)}{\\% \\Delta \\text{MRTS}} = \\frac{d \\ln (K/L)}{d \\ln (MP_L / MP_K)}$$

#### Canonical Production Functions:
1. **Cobb-Douglas ($y = A K^\\alpha L^\\beta$):** $\\sigma = 1$. Returns to scale equal $\\alpha + \\beta$.
2. **Constant Elasticity of Substitution (CES):**
   $$y = A \\left[ \\delta K^{-\\rho} + (1-\\delta) L^{-\\rho} \\right]^{-\\frac{\\nu}{\\rho}}$$
   where $\\sigma = \\frac{1}{1 + \\rho}$.
3. **Leontief (Fixed Proportions):** $y = \\min \\left( \\frac{K}{a}, \\frac{L}{b} \\right)$, $\\sigma = 0$.
4. **Linear (Perfect Substitutes):** $y = aK + bL$, $\\sigma = \\infty$.

---

### 2.2 Cost Minimization
The firm minimizes total expenditure $C = rK + wL$ subject to target output $f(K,L) \\ge y$:
$$\\mathcal{L}(K, L, \\lambda) = rK + wL + \\lambda (y - f(K, L))$$
FOCs require:
$$\\frac{MP_L}{MP_K} = \\frac{w}{r}$$
Solving yields **Conditional Factor Demands** $L(w, r, y)$ and $K(w, r, y)$, and the **Cost Function** $C(w, r, y)$.

#### Shephard's Lemma for Production:
$$L(w, r, y) = \\frac{\\partial C(w, r, y)}{\\partial w} \\quad \\text{and} \\quad K(w, r, y) = \\frac{\\partial C(w, r, y)}{\\partial r}$$

---

### 2.3 Profit Maximization
For a price-taking firm facing output price $p$:
$$\\max_{K, L} \\pi(p, w, r) = p f(K, L) - wL - rK$$
FOCs establish factor market equilibrium:
$$p \\cdot MP_L = w \\quad \\text{and} \\quad p \\cdot MP_K = r$$
**Hotelling's Lemma:**
$$y^*(p, w, r) = \\frac{\\partial \\pi(p, w, r)}{\\partial p}, \\quad L^*(p, w, r) = -\\frac{\\partial \\pi(p, w, r)}{\\partial w}, \\quad K^*(p, w, r) = -\\frac{\\partial \\pi(p, w, r)}{\\partial r}$$

---

## Chapter 3: General Equilibrium and Welfare Theorems

### 3.1 Pure Exchange Economy & The Edgeworth Box
Consider an economy with 2 consumers ($A, B$) and 2 goods ($1, 2$). Initial endowments are $\\omega^A = (\\omega_1^A, \\omega_2^A)$ and $\\omega^B = (\\omega_1^B, \\omega_2^B)$. Total endowment is $\\Omega = \\omega^A + \\omega^B$.

#### Pareto Efficiency:
An allocation $(x^A, x^B)$ is **Pareto efficient** if there is no other feasible allocation $(x'^A, x'^B)$ such that $u^A(x'^A) \\ge u^A(x^A)$ and $u^B(x'^B) \\ge u^B(x^B)$ with at least one strict inequality.
The **Contract Curve** characterizes the locus of all Pareto efficient points where indifference curves are tangent:
$$\\text{MRS}_{1,2}^A = \\text{MRS}_{1,2}^B$$

\`\`\`chart
{
  "type": "area",
  "title": "Edgeworth Box Contract Curve: Locus of Pareto Optimal Allocations",
  "xAxis": "Good_1_Consumer_A",
  "series": [
    { "key": "Contract_Curve_Good2", "name": "Contract Curve Allocation (Good 2)", "color": "#6366f1" }
  ],
  "data": [
    { "Good_1_Consumer_A": 0, "Contract_Curve_Good2": 0 },
    { "Good_1_Consumer_A": 20, "Contract_Curve_Good2": 15 },
    { "Good_1_Consumer_A": 40, "Contract_Curve_Good2": 32 },
    { "Good_1_Consumer_A": 60, "Contract_Curve_Good2": 52 },
    { "Good_1_Consumer_A": 80, "Contract_Curve_Good2": 74 },
    { "Good_1_Consumer_A": 100, "Contract_Curve_Good2": 100 }
  ]
}
\`\`\`

---

### 3.2 Walrasian Competitive Equilibrium
A Walrasian equilibrium is a price vector $p^* = (p_1^*, p_2^*)$ and allocations $(x^{*A}, x^{*B})$ such that:
1. Each consumer maximizes utility subject to their budget constraint: $p^* \\cdot x^i \\le p^* \\cdot \\omega^i$.
2. All markets clear simultaneously:
   $$x_1^{*A} + x_1^{*B} = \\omega_1^A + \\omega_1^B \\quad \\text{and} \\quad x_2^{*A} + x_2^{*B} = \\omega_2^A + \\omega_2^B$$

#### Walras' Law:
For any price vector $p$, the aggregate value of excess demand across all markets is identically zero:
$$\\sum_{k=1}^n p_k z_k(p) \\equiv 0 \\quad \\text{where} \\quad z_k(p) = \\sum_{i} x_k^i(p) - \\sum_{i} \\omega_k^i$$
**Implication:** In an $n$-good economy, if $n-1$ markets clear, the $n^{\\text{th}}$ market must automatically clear.

---

### 3.3 The Fundamental Welfare Theorems
* **First Fundamental Theorem of Welfare Economics:** If preferences are locally non-satiated and markets are complete and competitive with no externalities or asymmetric information, every Walrasian competitive equilibrium is Pareto efficient.
* **Second Fundamental Theorem of Welfare Economics:** If preferences and production sets are convex and markets are complete, any Pareto efficient allocation can be supported as a competitive equilibrium through an appropriate initial lump-sum redistribution of endowments.

---

## Chapter 4: Monopoly, Pricing Strategies, and Regulation

### 4.1 Monopoly Profit Maximization & Lerner Index
A monopolist faces downward-sloping demand $P(Q)$ and cost function $C(Q)$.
$$\\max_Q \\pi(Q) = P(Q) Q - C(Q)$$
$$\\text{FOC:} \\quad \\frac{d\\pi}{dQ} = P(Q) + Q P'(Q) - C'(Q) = 0 \\implies MR = MC$$

#### The Lerner Index of Market Power:
$$L = \\frac{P - MC}{P} = -\\frac{1}{\\varepsilon_d}$$
Where $\\varepsilon_d = \\frac{dQ}{dP} \\frac{P}{Q}$ is the price elasticity of demand.
* A monopolist will **never produce on the inelastic portion** of the demand curve ($|\\varepsilon_d| < 1$) because $MR = P \\left(1 - \\frac{1}{|\\varepsilon_d|}\\right) < 0$.

---

### 4.2 Price Discrimination
1. **First-Degree (Perfect) Price Discrimination:** The monopolist charges each consumer their exact reservation price. Consumer surplus is fully extracted ($CS = 0$), and output equals competitive output ($Q^* = Q_c$), producing **zero deadweight loss**.
2. **Second-Degree (Non-linear Pricing):** Pricing varies by quantity or quality tier (volume discounts, two-part tariffs $T + p \\cdot q$). The firm designs menus satisfying Incentive Compatibility ($IC$) and Individual Rationality ($IR$) constraints.
3. **Third-Degree (Market Segmentation):** The monopolist charges different prices $p_1, p_2$ across distinct observable consumer segments:
   $$MR_1 = MR_2 = MC \\implies p_1 \\left(1 - \\frac{1}{|\\varepsilon_1|}\\right) = p_2 \\left(1 - \\frac{1}{|\\varepsilon_2|}\\right)$$
   **Rule:** Higher prices are charged in the market with lower price elasticity of demand ($|\\varepsilon_1| < |\\varepsilon_2| \\implies p_1 > p_2$).

#### 💡 Worked Numerical Example 4.1: Third-Degree Price Discrimination
A monopolist operates in two separated sub-markets with demands:
* Market 1: $P_1 = 100 - Q_1 \\implies MR_1 = 100 - 2Q_1$
* Market 2: $P_2 = 80 - 2Q_2 \\implies MR_2 = 80 - 4Q_2$
* Constant marginal cost: $MC = 20$.

1. Equate $MR_1 = MC$: $100 - 2Q_1 = 20 \\implies 2Q_1 = 80 \\implies Q_1^* = 40, \\; P_1^* = 100 - 40 = \\mathbf{60}$.
2. Equate $MR_2 = MC$: $80 - 4Q_2 = 20 \\implies 4Q_2 = 60 \\implies Q_2^* = 15, \\; P_2^* = 80 - 2(15) = \\mathbf{50}$.
3. Profit in Market 1: $\\pi_1 = (60 - 20) \\times 40 = 1,600$.
4. Profit in Market 2: $\\pi_2 = (50 - 20) \\times 15 = 450$.
5. Total Profit: $\\pi_{\\text{total}} = 1,600 + 450 = \\mathbf{2,050}$.

---

## Chapter 5: Oligopoly and Non-Cooperative Game Theory

### 5.1 Static Oligopoly Models
Consider a market with 2 firms (duopoly), market demand $P = a - b(q_1 + q_2)$, and constant marginal cost $c$.

| Model | Strategic Variable | Equilibrium Price ($P^*$) | Total Output ($Q^*$) | Total Industry Profit |
|---|---|---|---|---|
| **Collusion / Monopoly** | Joint Quantity | $\\frac{a + c}{2}$ | $\\frac{a - c}{2b}$ | $\\frac{(a-c)^2}{4b}$ |
| **Cournot Duopoly** | Simultaneous Quantity | $\\frac{a + 2c}{3}$ | $\\frac{2(a - c)}{3b}$ | $\\frac{2(a-c)^2}{9b}$ |
| **Stackelberg Duopoly** | Sequential Quantity | $\\frac{a + 3c}{4}$ | $\\frac{3(a - c)}{4b}$ | $\\frac{3(a-c)^2}{16b}$ |
| **Bertrand Duopoly** | Simultaneous Price | $c$ | $\\frac{a - c}{b}$ | $0$ (Competitive) |

#### Reaction Curves in Cournot Duopoly:
$$q_1^*(q_2) = \\frac{a - c - b q_2}{2b} \\quad \\text{and} \\quad q_2^*(q_1) = \\frac{a - c - b q_1}{2b}$$

\`\`\`chart
{
  "type": "line",
  "title": "Cournot Reaction Curves and Nash Equilibrium Point",
  "xAxis": "Firm_1_Output",
  "series": [
    { "key": "Firm2_Reaction", "name": "Firm 2 Best Response q2*(q1)", "color": "#0ea5e9" },
    { "key": "Firm1_Reaction", "name": "Firm 1 Best Response q1*(q2)", "color": "#f43f5e" }
  ],
  "data": [
    { "Firm_1_Output": 0, "Firm2_Reaction": 40, "Firm1_Reaction": 0 },
    { "Firm_1_Output": 10, "Firm2_Reaction": 35, "Firm1_Reaction": 5 },
    { "Firm_1_Output": 20, "Firm2_Reaction": 30, "Firm1_Reaction": 15 },
    { "Firm_1_Output": 26.67, "Firm2_Reaction": 26.67, "Firm1_Reaction": 26.67 },
    { "Firm_1_Output": 40, "Firm2_Reaction": 20, "Firm1_Reaction": 45 },
    { "Firm_1_Output": 60, "Firm2_Reaction": 10, "Firm1_Reaction": 70 },
    { "Firm_1_Output": 80, "Firm2_Reaction": 0, "Firm1_Reaction": 90 }
  ]
}
\`\`\`

---

### 5.2 Dynamic Games & Subgame Perfect Nash Equilibrium (SPNE)
In games with sequential moves, players use **backward induction** to eliminate non-credible threats.
* **Selten's Theorem:** Every finite extensive-form game of perfect information has a Subgame Perfect Nash Equilibrium reachable via backward induction.
* In repeated games (Folk Theorem), cooperation in the Prisoner's Dilemma can be sustained as an SPNE if the discount factor satisfies $\\delta \\ge \\frac{\\text{Gain from Cheating} - \\text{Cooperation Payoff}}{\\text{Gain from Cheating} - \\text{Punishment Payoff}}$.

---

## Chapter 6: Risk, Uncertainty, and Expected Utility Theory

### 6.1 Expected Utility (von Neumann-Morgenstern)
Under uncertainty, an agent evaluates lotteries $L = (p_1, x_1; p_2, x_2; \\dots; p_n, x_n)$ with $\\sum p_i = 1$ via the **Expected Utility Function**:
$$U(L) = \\sum_{i=1}^n p_i u(x_i)$$

### 6.2 Measures of Risk Aversion
* **Risk Averse:** $u''(w) < 0$ (Strictly concave utility; prefers guaranteed outcome over fair gamble).
* **Certainty Equivalent ($CE$):** The guaranteed wealth level yielding identical expected utility: $u(CE) = \\mathbb{E}[u(w)]$.
* **Risk Premium ($\\pi$):** $\\pi = \\mathbb{E}[w] - CE$.
* **Arrow-Pratt Absolute Risk Aversion (ARA):**
  $$A(w) = -\\frac{u''(w)}{u'(w)}$$
* **Arrow-Pratt Relative Risk Aversion (RRA):**
  $$R(w) = -w \\frac{u''(w)}{u'(w)}$$

#### 💡 Worked Numerical Example 6.1: Risk Premium Calculation
An investor with initial wealth $w_0 = 100$ faces a gamble: win $44$ with $p = 0.5$ or lose $36$ with $p = 0.5$. Utility function $u(w) = \\sqrt{w}$.
1. **Possible Wealth Outcomes:** $w_1 = 100 + 44 = 144$, $w_2 = 100 - 36 = 64$.
2. **Expected Wealth:** $\\mathbb{E}[w] = 0.5(144) + 0.5(64) = 72 + 32 = 104$.
3. **Expected Utility:** $\\mathbb{E}[u(w)] = 0.5\\sqrt{144} + 0.5\\sqrt{64} = 0.5(12) + 0.5(8) = 6 + 4 = 10$.
4. **Certainty Equivalent ($CE$):** $\\sqrt{CE} = 10 \\implies CE = 10^2 = 100$.
5. **Risk Premium ($\\pi$):** $\\pi = \\mathbb{E}[w] - CE = 104 - 100 = \\mathbf{4}$.
The investor is willing to pay up to **$4** in insurance to avoid this fair risk.

---

## Chapter 7: Information Economics: Asymmetric Information

### 7.1 Adverse Selection (Hidden Information)
* **Akerlof's Market for Lemons (1970):** When buyers cannot observe car quality prior to purchase, high-quality cars ("peaches") are driven out of the market because market equilibrium price reflects only average quality, leading to market unraveling.
* **Signaling (Michael Spence 1973):** High-productivity workers signal quality by acquiring education. For education $e$ to serve as a credible signal, it must satisfy the **Single-Crossing Property** (cost of education is strictly lower for high-productivity workers: $c_H < c_L$).

### 7.2 Moral Hazard (Hidden Action)
In a Principal-Agent relationship (e.g., Shareholder vs CEO, Insurer vs Policyholder), the agent exerts unobservable effort $e$. The principal solves:
$$\\max_{w(y)} \\mathbb{E}[y - w(y)]$$
Subject to:
1. **Participation Constraint (IR):** $\\mathbb{E}[u(w(y))] - c(e) \\ge \\bar{U}$
2. **Incentive Compatibility Constraint (IC):** $e^* = \\arg\\max_{e} \\mathbb{E}[u(w(y))] - c(e)$

---

## Chapter 8: Factor Markets and Monopsony

### 8.1 Competitive Factor Demand
A competitive firm hires labor until:
$$\\text{Value of Marginal Product} = \\text{VMPL} = P \\cdot MP_L = w$$
If the firm has monopoly power in the output market:
$$\\text{Marginal Revenue Product} = \\text{MRPL} = MR \\cdot MP_L = w$$

### 8.2 Monopsony in Labor Markets
A single buyer of labor faces upward-sloping labor supply $w(L)$ ($w'(L) > 0$).
$$\\text{Total Labor Cost: } TLC = w(L) \\cdot L$$
$$\\text{Marginal Factor Cost: } MFC = \\frac{d(TLC)}{dL} = w(L) + L w'(L) > w(L)$$

\`\`\`chart
{
  "type": "line",
  "title": "Monopsony Labor Market: Wage Exploitation and Employment Deadweight Loss",
  "xAxis": "Labor_Units",
  "series": [
    { "key": "MRPL", "name": "Marginal Revenue Product (MRPL)", "color": "#0ea5e9" },
    { "key": "Labor_Supply", "name": "Average Labor Supply w(L)", "color": "#10b981" },
    { "key": "MFC", "name": "Marginal Factor Cost (MFC)", "color": "#ef4444" }
  ],
  "data": [
    { "Labor_Units": 10, "MRPL": 90, "Labor_Supply": 20, "MFC": 30 },
    { "Labor_Units": 20, "MRPL": 80, "Labor_Supply": 30, "MFC": 50 },
    { "Labor_Units": 30, "MRPL": 70, "Labor_Supply": 40, "MFC": 70 },
    { "Labor_Units": 40, "MRPL": 60, "Labor_Supply": 50, "MFC": 90 },
    { "Labor_Units": 50, "MRPL": 50, "Labor_Supply": 60, "MFC": 110 }
  ]
}
\`\`\`

* The monopsonist sets $MFC = MRPL$ to choose employment $L_M = 30$, and pays wage $w_M = w(30) = 40$.
* Under perfect competition, $w_C = 50$ and $L_C = 50$.
* **Monopsonistic Exploitation:** $MRPL - w_M = 70 - 40 = 30$.
* **Policy Implication:** Imposing an effective minimum wage $w_{\\min} \\in (w_M, w_C]$ can **increase both wages and total employment** in a monopsonistic labor market.
`;
