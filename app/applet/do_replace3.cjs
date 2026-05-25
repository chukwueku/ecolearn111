const fs = require('fs');

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

const startIdx = content.indexOf('### Chapter 5: Household Saving');
const endIdx = content.indexOf('### Chapter 8:');

if (startIdx === -1 || endIdx === -1) {
  console.log("Indices not found.");
  process.exit(1);
}

const replacement = `### Chapter 5: Household Saving and Investment Decisions

**5.1 A Life-Cycle Model of Saving**
The typical framework for analyzing household saving decisions is the life-cycle model. The fundamental assumption of this model is that individuals plan their consumption and savings behavior over their life cycle. They intend to even out their consumption in the best possible manner over their entire lifetimes. 

To achieve this, the present value of lifetime consumption spending and bequests must equal the present value of initial wealth and future labor income, often termed **Human Capital**.

**Intertemporal Budget Constraint:**
$$ \\\\sum_{t=1}^T \\\\frac{C_t}{(1+i)^t} + \\\\frac{B_t}{(1+i)^T} = W_0 + \\\\sum_{t=1}^R \\\\frac{Y_t}{(1+i)^t} $$
Where:
- $C_t$ is consumption in year $t$
- $B_t$ is the bequest at year $T$
- $W_0$ is initial wealth
- $Y_t$ is labor income in year $t$
- $R$ is retirement age
- $T$ is life expectancy

**5.2 Human Capital and Smoothing Consumption**
Human capital is typically the largest asset for most individuals early in their working lives. Since labor income stops at retirement, households must save a portion of their labor income during their working years to finance consumption during retirement. This desire to avoid wide fluctuations in the standard of living is called **consumption smoothing**. 

**5.3 Social Security and Household Saving**
Social security represents a forced savings mechanism imposed by the government to ensure baseline retirement viability. This offsets some of the required voluntary savings households must undertake, modifying their life-cycle saving trajectory. If individuals view social security contributions as a perfect substitute for private savings, total national saving may not change, but the composition of saving shifts away from private markets to government obligations.

**5.4 Asset Allocation Over the Life Cycle**
A household's optimal mix between risky assets (like stocks) and safer assets (like bonds) changes over time. Because young people have substantial human capital (which acts like a bond that pays regular income), they can afford to take higher risks in their financial portfolios. As retirement approaches, human capital depletes, and portfolios should shift towards safer assets.

---

### Chapter 6: The Analysis of Investment Projects

**6.1 The Nature of Project Analysis**
Firms must continuously identify and evaluate physical capital investments, research and development capabilities, and strategic expansions. This process of allocating funds for long-term investments is known as **capital budgeting**. The primary goal of capital budgeting is to maximize the firm's value, which aligns with the objective of maximizing shareholder wealth.

**6.2 Identifying Relevant Cash Flows**
The first step in evaluating a project is establishing its incremental cash flows—the differences in the firm's cash flows if the project is accepted versus if it is rejected. 
- **Sunk costs** (costs already incurred) should be ignored.
- **Opportunity costs** (cash the firm would lose from other assets) must be included.
- **Cannibalization** (where the project reduces sales of existing products) must be accounted for.

**6.3 The Net Present Value Investment Rule**
Net Present Value (NPV) calculation represents the absolute standard for project analysis. It discounts all expected future cash flows at the firm's cost of capital and subtracts the initial investment.

$$ NPV(k) = \\\\sum_{t=0}^n \\\\frac{CF_t}{(1 + k)^t} $$
Where:
- $CF_t$ is the net cash flow at time $t$
- $k$ is the firm's cost of capital (or the required rate of return for the project's risk level)
- $n$ is the project's life span

**Decision Rule**: Invest if and only if the proposed project's NPV is positive ($NPV > 0$). If multiple mutually exclusive projects have positive NPVs, choose the one with the highest NPV.

**6.4 Alternative Investment Rules**
While NPV is the gold standard, firms often use other metrics:
1. **Internal Rate of Return (IRR)**: The discount rate that makes the NPV equal to exactly zero. 
   - **Decision Rule**: Accept the project if $IRR > k$ (the cost of capital).
   - *Warning*: IRR can be misleading for mutually exclusive projects or projects with non-conventional cash flows (where signs change more than once).
2. **Profitability Index (PI)**: A relative measure of value creation.
   - $PI = \\\\frac{\\\\text{PV of Future Cash Flows}}{\\\\text{Initial Investment Cost}}$
   - **Decision Rule**: Accept if $PI > 1$. Useful when dealing with capital rationing (limited investment funds).
3. **Payback Period**: The number of years it takes to recover the initial investment. 
   - Often used as a quick, back-of-the-envelope measure, but it ignores the time value of money and cash flows that occur after the payback date.

---

## PART III: VALUATION MODELS

### Chapter 7: Principles of Market Valuation

**7.1 The Relation between an Asset's Value and Its Price**
The fundamental value of an asset is the price well-informed investors must pay for it in a free and competitive market. Valuation bridges the gap between anticipated future benefits (cash flows), the precise timing of those benefits, and the associated risks. Value is subjective, but market prices aggregate the subjective values of marginal buyers and sellers.

**7.2 Value Maximization vs. Price Maximization**
Managers should focus on maximizing the true fundamental value of the firm's equity, which will eventually be reflected in the stock price. Attempting to manipulate short-term stock prices at the expense of long-term value creation destroys wealth.

**7.3 The Law of One Price and Arbitrage**
The bedrock of financial valuation is the **Law of One Price**: In a competitive market, two assets that generate identical cash flows in every state of the world must have the exact same market price. 
This law is enforced by **arbitrage**, which is the purchase and immediate sale of equivalent assets to earn a riskless profit from price discrepancies. If an asset is priced differently in two markets, arbitrageurs will buy in the cheaper market and sell in the more expensive one, driving prices into equilibrium.

**7.4 Valuation by Using Comparables**
Because of the Law of One Price, we can value an asset by looking at the prices of similar assets in the market. In equity markets, this is often done using valuation multiples like the Price-to-Earnings (P/E) ratio or the Enterprise Value-to-EBITDA ratio of peer companies.

**7.5 Interest Rates and the Law of One Price**
Interest rates dynamically link current prices with future expected values. Arbitrageurs ensure that the risk-free rate of return is consistent across all riskless financial instruments. For example, the rate implied by currency forward contracts must align with the interest rate differential between two countries (Covered Interest Parity) to prevent arbitrage.

**7.11 The Efficient Markets Hypothesis (EMH)**
Developed by Eugene Fama, the Efficient Markets Hypothesis is the proposition that an asset's current price fully reflects all publicly available information about economic fundamentals affecting the asset's value. 
- **Weak Form Efficiency**: Current prices reflect all past trading information (historical prices and volumes). Technical analysis is useless.
- **Semi-Strong Form Efficiency**: Current prices reflect all publicly available information, including earnings reports and news. Fundamental analysis will not yield abnormal returns.
- **Strong Form Efficiency**: Current prices reflect all information, both public and private (insider information). Even insiders cannot earn abnormal returns (though evidence suggests this form does not practically hold).

---

`;

content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
fs.writeFileSync('src/lib/advancedStudyData.ts', content, 'utf8');
console.log("Replaced successfully");
