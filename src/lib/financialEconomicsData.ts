export const FINANCIAL_ECONOMICS_GUIDE = `
# Financial Economics: Asset Pricing, Portfolio Theory, and Corporate Valuation

## Course Overview
Financial Economics bridges microeconomic theory and the mathematical pricing of financial claims under risk and uncertainty. It covers time value of money, fixed-income yield curve analytics, modern portfolio optimization (Markowitz), equilibrium asset pricing models (CAPM and Factor Models), market efficiency, and derivative securities.

---

## Chapter 1: Time Value of Money and Fixed-Income Mathematics

### 1.1 Fundamental Discounting Formulations
The foundational axiom of financial economics states that a unit of currency received today is worth more than a unit received in the future due to its earning capacity ($r$):
$$PV = \\frac{FV_t}{(1 + r)^t}$$

#### Annuities and Perpetuities:
* **Ordinary Perpetuity (constant cash flow $C$ indefinitely):**
  $$PV = \\frac{C}{r}$$
* **Growing Perpetuity (cash flow grows at constant rate $g < r$, Gordon Growth Model):**
  $$PV = \\frac{C_1}{r - g}$$
* **$T$-Period Annuity:**
  $$PV = \\frac{C}{r} \\left[ 1 - \\frac{1}{(1 + r)^T} \\right]$$

---

### 1.2 Bond Valuation and Yield to Maturity (YTM)
The market price $P_0$ of a coupon bond with face value $M$, coupon payment $C$, and maturity $T$ is:
$$P_0 = \\sum_{t=1}^T \\frac{C}{(1 + y)^t} + \\frac{M}{(1 + y)^T}$$
Where $y$ is the **Yield to Maturity (YTM)**.

---

### 1.3 Macaulay Duration and Modified Duration
**Macaulay Duration ($D_{\\text{mac}}$)** measures the weighted average time until all cash flows of a bond are received:
$$D_{\\text{mac}} = \\frac{1}{P_0} \\sum_{t=1}^T \\frac{t \\cdot C}{(1 + y)^t} + \\frac{T \\cdot M}{(1 + y)^T}$$

**Modified Duration ($D^*$):** Measures the percentage price sensitivity of a bond to interest rate changes:
$$D^* = \\frac{D_{\\text{mac}}}{1 + y}$$
$$\\frac{\\Delta P}{P} \\approx -D^* \\cdot \\Delta y$$

\`\`\`chart
{
  "type": "line",
  "title": "Bond Price Sensitivity to Interest Rate Shifts (Duration vs Convexity)",
  "xAxis": "Yield_YTM_Pct",
  "series": [
    { "key": "Actual_Price", "name": "Actual Convex Bond Price Curve", "color": "#10b981" },
    { "key": "Duration_Approx", "name": "Linear Duration Approximation", "color": "#ef4444" }
  ],
  "data": [
    { "Yield_YTM_Pct": 2, "Actual_Price": 128.5, "Duration_Approx": 125.0 },
    { "Yield_YTM_Pct": 4, "Actual_Price": 113.6, "Duration_Approx": 112.5 },
    { "Yield_YTM_Pct": 6, "Actual_Price": 100.0, "Duration_Approx": 100.0 },
    { "Yield_YTM_Pct": 8, "Actual_Price": 87.8, "Duration_Approx": 87.5 },
    { "Yield_YTM_Pct": 10, "Actual_Price": 76.8, "Duration_Approx": 75.0 }
  ]
}
\`\`\`

* **Convexity Adjustment:** Because the price-yield curve is convex ($P''(y) > 0$), adding the convexity term $\\frac{1}{2} \\text{Convexity} \\cdot (\\Delta y)^2$ provides exact second-order accuracy.

---

## Chapter 2: Modern Portfolio Theory (Markowitz Mean-Variance Optimization)

### 2.1 Portfolio Return and Variance
Consider $N$ risky assets with expected returns $E[R_i]$, variances $\\sigma_i^2$, and covariances $\\sigma_{ij} = \\text{Cov}(R_i, R_j)$.
A portfolio is defined by weights $w = (w_1, \\dots, w_N)^T$ with $\\sum_{i=1}^N w_i = 1$.

* **Expected Portfolio Return:**
  $$E[R_p] = \\sum_{i=1}^N w_i E[R_i] = w^T \\mu$$
* **Portfolio Variance:**
  $$\\sigma_p^2 = \\sum_{i=1}^N \\sum_{j=1}^N w_i w_j \\sigma_{ij} = w^T \\Sigma w$$
  Where $\\Sigma$ is the $N \\times N$ positive semi-definite Covariance Matrix.

---

### 2.2 The Diversification Effect
For a 2-asset portfolio with correlation coefficient $\\rho_{12} \\in [-1, 1]$:
$$\\sigma_p^2 = w_1^2 \\sigma_1^2 + w_2^2 \\sigma_2^2 + 2 w_1 w_2 \\rho_{12} \\sigma_1 \\sigma_2$$
* If $\\rho_{12} < 1$, the portfolio standard deviation $\\sigma_p$ is **strictly less than the weighted average of individual standard deviations** ($w_1 \\sigma_1 + w_2 \\sigma_2$).
* If $\\rho_{12} = -1$, risk can be **completely eliminated** ($\\sigma_p = 0$).

\`\`\`chart
{
  "type": "line",
  "title": "Markowitz Efficient Frontier: Risk-Return Profiles Under Different Asset Correlations",
  "xAxis": "Portfolio_Risk_Sigma",
  "series": [
    { "key": "Uncorrelated_rho0", "name": "Efficient Frontier (rho = 0.0)", "color": "#0ea5e9" },
    { "key": "Neg_Correlated_rhoMinus1", "name": "Perfect Hedge (rho = -0.8)", "color": "#10b981" },
    { "key": "Pos_Correlated_rho1", "name": "No Diversification (rho = +1.0)", "color": "#94a3b8" }
  ],
  "data": [
    { "Portfolio_Risk_Sigma": 4, "Uncorrelated_rho0": 6.5, "Neg_Correlated_rhoMinus1": 8.5, "Pos_Correlated_rho1": 4.5 },
    { "Portfolio_Risk_Sigma": 8, "Uncorrelated_rho0": 9.2, "Neg_Correlated_rhoMinus1": 11.8, "Pos_Correlated_rho1": 7.0 },
    { "Portfolio_Risk_Sigma": 12, "Uncorrelated_rho0": 11.5, "Neg_Correlated_rhoMinus1": 14.2, "Pos_Correlated_rho1": 9.5 },
    { "Portfolio_Risk_Sigma": 16, "Uncorrelated_rho0": 13.4, "Neg_Correlated_rhoMinus1": 16.0, "Pos_Correlated_rho1": 12.0 },
    { "Portfolio_Risk_Sigma": 20, "Uncorrelated_rho0": 15.0, "Neg_Correlated_rhoMinus1": 17.5, "Pos_Correlated_rho1": 14.5 }
  ]
}
\`\`\`

#### 💡 Worked Numerical Example 2.1: Two-Asset Portfolio Optimization
* Asset 1 (Equities): $E[R_1] = 14\\%$, $\\sigma_1 = 20\\%$
* Asset 2 (Bonds): $E[R_2] = 6\\%$, $\\sigma_2 = 10\\%$
* Correlation $\\rho_{12} = 0.20$.
* Portfolio allocation: $w_1 = 60\\% = 0.60$, $w_2 = 40\\% = 0.40$.

1. **Expected Portfolio Return:**
   $$E[R_p] = 0.60(14\\%) + 0.40(6\\%) = 8.4\\% + 2.4\\% = \\mathbf{10.8\\%}$$
2. **Portfolio Variance:**
   $$\\sigma_p^2 = (0.60)^2(20)^2 + (0.40)^2(10)^2 + 2(0.60)(0.40)(0.20)(20)(10)$$
   $$\\sigma_p^2 = 0.36(400) + 0.16(100) + 0.48(0.20)(200) = 144 + 16 + 19.2 = \\mathbf{179.2}$$
3. **Portfolio Standard Deviation:**
   $$\\sigma_p = \\sqrt{179.2} \\approx \\mathbf{13.39\\%}$$
*(Notice that $\\sigma_p = 13.39\\%$ is substantially lower than the weighted average $0.60(20) + 0.40(10) = 16.0\\%$ due to the diversification bonus!)*

---

### 2.3 The Capital Allocation Line (CAL) and Tangency Portfolio
Introducing a risk-free asset with guaranteed return $R_f$:
$$E[R_c] = R_f + \\left( \\frac{E[R_p] - R_f}{\\sigma_p} \\right) \\sigma_c$$
Where the slope is the **Sharpe Ratio ($SR_p$)**:
$$SR_p = \\frac{E[R_p] - R_f}{\\sigma_p}$$
* The **Optimal Tangency Portfolio ($M$)** maximizes the Sharpe Ratio.
* **Tobin's Separation Theorem:** Every investor, regardless of risk aversion, holds the exact same risky tangency portfolio $M$, adjusting only the proportion allocated between $M$ and the risk-free asset $R_f$.

---

## Chapter 3: The Capital Asset Pricing Model (CAPM)

### 3.1 Systematic vs. Idiosyncratic Risk
Total risk of asset $i$ is decomposed as:
$$\\underbrace{\\sigma_i^2}_{\\text{Total Risk}} = \\underbrace{\\beta_i^2 \\sigma_m^2}_{\\text{Systematic (Market) Risk}} + \\underbrace{\\sigma_{\\varepsilon_i}^2}_{\\text{Idiosyncratic (Firm-Specific) Risk}}$$
* **Idiosyncratic Risk** can be completely diversified away in large portfolios.
* In competitive equilibrium, **markets only price systematic risk**.

---

### 3.2 The Security Market Line (SML)
William Sharpe (1964) and John Lintner (1965) proved that in equilibrium, the expected return on any asset $i$ is linearly determined by its systematic risk parameter **Beta ($\\beta_i$)**:
$$E[R_i] = R_f + \\beta_i \\left( E[R_m] - R_f \\right)$$
Where Beta is derived from regression slope:
$$\\beta_i = \\frac{\\text{Cov}(R_i, R_m)}{\\text{Var}(R_m)} = \\frac{\\sigma_{im}}{\\sigma_m^2}$$

#### 💡 Worked Numerical Example 3.1: CAPM Return & Jensen's Alpha
* Risk-free rate $R_f = 4.0\\%$, Market expected return $E[R_m] = 11.0\\%$.
* Stock Alpha Fund has $\\beta = 1.30$ and generated an actual realized return of $R_i = 15.5\\%$.

1. **Required CAPM Return:**
   $$E[R_i] = 4.0 + 1.30(11.0 - 4.0) = 4.0 + 1.30(7.0) = 4.0 + 9.1 = \\mathbf{13.1\\%}$$
2. **Jensen's Alpha ($\\alpha_i$):**
   $$\\alpha_i = R_i - E[R_i] = 15.5\\% - 13.1\\% = \\mathbf{+2.4\\%}$$
The fund generated **+2.4% abnormal excess return** above the market risk-adjusted benchmark.

---

## Chapter 4: Market Efficiency and Factor Models

### 4.1 The Efficient Market Hypothesis (EMH)
Eugene Fama (1970) classified market information efficiency into three nested forms:
1. **Weak-Form Efficiency:** Prices reflect all historical trading data (past prices/volumes). Technical analysis fails.
2. **Semi-Strong Form Efficiency:** Prices reflect all publicly available information. Fundamental analysis cannot beat the market.
3. **Strong-Form Efficiency:** Prices reflect all public and insider private information.

---

### 4.2 Multi-Factor Models (Fama-French Three-Factor Model)
Eugene Fama and Kenneth French (1993) expanded CAPM to capture empirical asset pricing anomalies:
$$E[R_i] - R_f = \\beta_{i,m} (E[R_m] - R_f) + s_i \\cdot \\text{SMB} + h_i \\cdot \\text{HML}$$
Where:
* **SMB (Small Minus Big):** Size premium (small-cap stocks historically outperform large-cap stocks).
* **HML (High Minus Low):** Value premium (high book-to-market value stocks outperform growth stocks).

---

## Chapter 5: Derivative Securities and Option Pricing

### 5.1 Options Payoffs and Put-Call Parity
* **Call Option Payoff at Expiration ($T$):** $C_T = \\max(0, S_T - K)$
* **Put Option Payoff at Expiration ($T$):** $P_T = \\max(0, K - S_T)$
Where $S_T$ is spot price of underlying asset and $K$ is strike price.

#### Put-Call Parity:
A portfolio comprising a Long Call and Cash equal to discounted strike ($K e^{-rT}$) replicates a Long Put and Long Stock:
$$C + K e^{-rT} = P + S_0$$

---

### 5.2 The Black-Scholes-Merton Option Pricing Model (1973)
Under the assumptions of continuous trading, constant volatility $\\sigma$, and log-normal stock price dynamics ($dS = \\mu S dt + \\sigma S dW$), the European Call price $C$ is:
$$C(S_0, K, T, r, \\sigma) = S_0 N(d_1) - K e^{-rT} N(d_2)$$
Where $N(\\cdot)$ is the standard normal cumulative distribution function, and:
$$d_1 = \\frac{\\ln(S_0 / K) + \\left(r + \\frac{\\sigma^2}{2}\\right) T}{\\sigma \\sqrt{T}}$$
$$d_2 = d_1 - \\sigma \\sqrt{T}$$

#### The Option Greeks:
* **Delta ($\\Delta = \\frac{\\partial C}{\\partial S} = N(d_1)$):** Number of shares needed to create a risk-free delta-hedged portfolio.
* **Gamma ($\\Gamma = \\frac{\\partial^2 C}{\\partial S^2}$):** Rate of change of Delta.
* **Theta ($\\Theta = \\frac{\\partial C}{\\partial t}$):** Time decay of the option price.
* **Vega ($\\mathcal{V} = \\frac{\\partial C}{\\partial \\sigma}$):** Sensitivity of option value to volatility spikes.
`;
