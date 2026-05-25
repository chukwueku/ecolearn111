import fs from 'fs';

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

const target1 = `### Chapter 1: Financial Economics
**1.1 Defining Finance**
Finance is the study of how people allocate scarce resources over time. The two features that distinguish financial decisions from other resource allocation decisions are that the costs and benefits of financial decisions are (1) spread out over time and (2) usually not known with certainty in advance.

**1.2 Why Study Finance?**
- To manage your personal resources.
- To deal with the world of business.
- To pursue interesting and rewarding career opportunities.
- To make informed public choices as a citizen.
- To expand your mind.

**1.3 Financial Decisions of Households**
Households face four basic types of financial decisions:
1. *Consumption and saving decisions*: How much of their current wealth should they spend on consumption and how much of their current income should they save for the future?
2. *Investment decisions*: How should they invest the money they have saved?
3. *Financing decisions*: When and how should households use other people's money to implement their consumption and investment plans?
4. *Risk-management decisions*: How and on what terms should households seek to reduce the financial uncertainties they face or when should they increase their risks?

**1.4 Financial Decisions of Firms**
The first decision any firm must make is what businesses it wants to be in (strategic planning). The basic unit of analysis in capital budgeting is an investment project. Capital structure determines who gets what share of its future cash flows.
Working capital management is extremely important to the success of a firm.

**1.7 The Goal of Management**
The goal of corporate management is to maximize shareholder wealth. It leads managers to make the same investment decisions that each of the individual owners would have made had they made the decisions themselves.

---

### Chapter 2: Financial Markets and Institutions
**2.3 The Functional Perspective**
Six core functions performed by the financial system:
1. To provide ways to transfer economic resources through time, across borders, and among industries.
2. To provide ways of managing risk.
3. To provide ways of clearing and settling payments to facilitate trade.
4. To provide a mechanism for the pooling of resources and for the subdividing of shares in various enterprises.
5. To provide price information to help coordinate decentralized decision making.
6. To provide ways of dealing with the incentive problems (moral hazard, adverse selection, principal-agent problems).

**2.6 Financial Market Rates**
An interest rate is a promised rate of return. Fixed-income instrument rates depend on unit of account, maturity, and default risk.
*Real Interest Rate*: 
$$ 1 + \\\\\\text{Real Rate} = \\\\\\frac{1 + \\\\\\text{Nominal Interest Rate}}{1 + \\\\\\text{Rate of Inflation}} $$

---

### Chapter 3: Managing Financial Health and Performance

**3.6 Analysis Using Financial Ratios**
<div class="overflow-x-auto my-6 markdown-table text-sm">

| Ratio | Formula |
| :--- | :--- |
| **Profitability** | |
| Return on sales (ROS) | $EBIT / \\\\\\text{Sales}$ |
| Return on assets (ROA) | $EBIT / \\\\\\text{Average Total Assets}$ |
| Return on equity (ROE) | $\\\\\\text{Net Income} / \\\\\\text{Stockholders' Equity}$ |
| **Asset Turnover** | |
| Receivables turnover | $\\\\\\text{Sales} / \\\\\\text{Average Receivables}$ |
| Inventory turnover | $\\\\\\text{Cost of Goods Sold} / \\\\\\text{Average Inventory}$ |
| **Financial Leverage** | |
| Debt | $\\\\\\text{Total Debt} / \\\\\\text{Total Assets}$ |
| Times interest earned | $EBIT / \\\\\\text{Interest Expense}$ |
| **Liquidity** | |
| Current | $\\\\\\text{Current Assets} / \\\\\\text{Current Liabilities}$ |
| Quick, or acid test | $(\\\\\\text{Cash} + \\\\\\text{Receivables}) / \\\\\\text{Current Liabilities}$ |

</div>

**ROE Decomposition:**
$$ ROE = (1 - \\\\\\text{Tax Rate}) \\\\\\times \\\\\\left[ ROA + \\\\\\left(\\\\\\frac{\\\\\\text{Debt}}{\\\\\\text{Equity}}\\\\\\right) \\\\\\times (ROA - \\\\\\text{Interest Rate}) \\\\\\right] $$

**3.9 Growth and the Need for External Financing**
$$ \\\\\\text{Sustainable Growth Rate} = \\\\\\text{Earnings Retention Rate} \\\\\\times ROE $$`;

const replace1 = `### Chapter 1: Financial Economics

**1.1 Defining Finance**
Finance is the study of how people allocate scarce resources over time. The two features that distinguish financial decisions from other resource allocation decisions are that the costs and benefits of financial decisions are (1) spread out over time and (2) usually not known with certainty in advance.

**1.2 Why Study Finance?**
- **To manage your personal resources**: You will face decisions such as whether to rent or buy a home, how much to save for retirement.
- **To deal with the world of business**: An understanding of financial concepts will be essential for comprehending the broader goals of your organization.
- **To pursue interesting and rewarding career opportunities**: Finance offers diverse tracks including investment banking, corporate finance, financial planning.
- **To make informed public choices as a citizen**.
- **To expand your mind**.

**1.3 Financial Decisions of Households**
Households face four basic types of financial decisions:
1. *Consumption and saving decisions*: How much of their current wealth should they spend on consumption?
2. *Investment decisions*: How should they invest the money they have saved?
3. *Financing decisions*: When and how should households use other people's money?
4. *Risk-management decisions*: How and on what terms should households seek to reduce financial uncertainties?

**1.4 Financial Decisions of Firms**
The first decision any firm must make is what businesses it wants to be in. 
- *Capital Budgeting*: The basic unit of analysis in capital budgeting is an investment project.
- *Capital Structure*: Capital structure determines who gets what share of its future cash flows.
- *Working Capital Management*: This involves short-term financing and management of daily cash flows.

**1.7 The Goal of Management**
The goal of corporate management is to maximize shareholder wealth. Because shareholders are the residual claimants to the firm's cash flows, a focus on maximizing the share price leads managers to make the same investment decisions.

---

### Chapter 2: Financial Markets and Institutions

**2.1 What Is the Financial System?**
The financial system is the collection of markets, institutions, laws, regulations, and techniques through which bonds, stocks, and other securities are traded.

**2.3 The Functional Perspective**
Six core functions performed by the financial system:
1. **Transferring Economic Resources**: To provide ways to transfer economic resources through time, across borders, and among industries.
2. **Managing Risk**: To provide ways of managing risk, such as via insurance companies.
3. **Clearing and Settling Payments**: To provide ways of clearing and settling payments to facilitate trade.
4. **Pooling Resources**: To provide a mechanism for the pooling of resources.
5. **Providing Price Information**: To provide price information to help coordinate decentralized decision making.
6. **Handling Incentive Problems**: To provide ways of dealing with incentive problems (moral hazard, adverse selection).

**2.6 Financial Market Rates**
An interest rate is a promised rate of return.
*Real Interest Rate*: 
$$ 1 + \\\\\\text{Real Rate} = \\\\\\frac{1 + \\\\\\text{Nominal Interest Rate}}{1 + \\\\\\text{Rate of Inflation}} $$

---

### Chapter 3: Managing Financial Health and Performance

**3.4 The Balance Sheet and Income Statement**
The firm's financial health is summarized in the balance sheet and the income statement.
$$ \\\\\\text{Assets} = \\\\\\text{Liabilities} + \\\\\\text{Shareholders' Equity} $$

**3.6 Analysis Using Financial Ratios**
<div class="overflow-x-auto my-6 markdown-table text-sm">

| Ratio Category | Name of Ratio | Formula |
| :--- | :--- | :--- |
| **Profitability** | Return on sales (ROS) | $EBIT / \\\\\\text{Sales}$ |
| | Return on assets (ROA) | $EBIT / \\\\\\text{Average Total Assets}$ |
| | Return on equity (ROE) | $\\\\\\text{Net Income} / \\\\\\text{Stockholders' Equity}$ |
| **Asset Turnover** | Receivables turnover | $\\\\\\text{Sales} / \\\\\\text{Average Receivables}$ |
| | Inventory turnover | $\\\\\\text{Cost of Goods Sold} / \\\\\\text{Average Inventory}$ |
| | Asset turnover | $\\\\\\text{Sales} / \\\\\\text{Average Total Assets}$ |
| **Financial Leverage**| Debt ratio | $\\\\\\text{Total Debt} / \\\\\\text{Total Assets}$ |
| | Times interest earned | $EBIT / \\\\\\text{Interest Expense}$ |
| **Liquidity** | Current ratio | $\\\\\\text{Current Assets} / \\\\\\text{Current Liabilities}$ |
| | Quick ratio | $(\\\\\\text{Cash} + \\\\\\text{Receivables}) / \\\\\\text{Current Liabilities}$ |

</div>

**ROE Decomposition:**
$$ ROE = \\\\\\frac{\\\\\\text{Net Income}}{\\\\\\text{Sales}} \\\\\\times \\\\\\frac{\\\\\\text{Sales}}{\\\\\\text{Assets}} \\\\\\times \\\\\\frac{\\\\\\text{Assets}}{\\\\\\text{Equity}} $$

$$ ROE = (1 - \\\\\\text{Tax Rate}) \\\\\\times \\\\\\left[ ROA + \\\\\\left(\\\\\\frac{\\\\\\text{Debt}}{\\\\\\text{Equity}}\\\\\\right) \\\\\\times (ROA - \\\\\\text{Interest Rate}) \\\\\\right] $$

**3.9 Growth and the Need for External Financing**
$$ \\\\\\text{Sustainable Growth Rate} = \\\\\\text{Earnings Retention Rate} \\\\\\times ROE $$`;

const target2 = `### Chapter 5: Household Saving and Investment Decisions
**5.1 A Life-Cycle Model of Saving**
The present value of lifetime consumption spending and bequests equals the present value of initial wealth and future labor income (Human Capital).
Intertemporal Budget Constraint:
$$ \\\\\\sum_{t=1}^T \\\\\\frac{C_t}{(1+i)^t} + \\\\\\frac{B_t}{(1+i)^T} = W_0 + \\\\\\sum_{t=1}^R \\\\\\frac{Y_t}{(1+i)^t} $$

---

### Chapter 6: The Analysis of Investment Projects
**6.3 The Net Present Value Investment Rule**
Net Present Value (NPV) calculation:
$$ NPV(k) = \\\\\\sum_{t=0}^n \\\\\\frac{CF_t}{(1 + k)^t} $$
**Rule**: Invest if the proposed project's NPV is positive.

---

## PART III: VALUATION MODELS

### Chapter 7: Principles of Market Valuation
**7.1 The Relation between an Asset's Value and Its Price**
The fundamental value of an asset is the price well-informed investors must pay for it in a free and competitive market.

**7.3 The Law of One Price and Arbitrage**
In a competitive market, two assets that are equivalent will tend to have the same market price. Enforced by arbitrage (purchase and immediate sale of equivalent assets to earn a sure profit from a difference in their prices).

**7.11 The Efficient Markets Hypothesis**
The proposition that an asset's current price fully reflects all publicly available information about economic fundamentals affecting the asset's value.`;

const replace2 = `### Chapter 5: Household Saving and Investment Decisions
**5.1 A Life-Cycle Model of Saving**
The typical framework for analyzing household saving decisions is the life-cycle model. The present value of lifetime consumption spending and bequests equals the present value of initial wealth and future labor income (Human Capital).
Intertemporal Budget Constraint:
$$ \\\\\\sum_{t=1}^T \\\\\\frac{C_t}{(1+i)^t} + \\\\\\frac{B_t}{(1+i)^T} = W_0 + \\\\\\sum_{t=1}^R \\\\\\frac{Y_t}{(1+i)^t} $$

**5.3 Social Security and Household Saving**
Social security represents a forced savings mechanism imposed by the government to ensure baseline retirement viability. This offsets some of the required voluntary savings households must undertake, modifying the life-cycle trajectory.

---

### Chapter 6: The Analysis of Investment Projects
**6.1 The Nature of Project Analysis**
Firms must continuously identify and evaluate physical capital investments, research and development capabilities, and strategic expansions. This is known as **capital budgeting**.

**6.3 The Net Present Value Investment Rule**
Net Present Value (NPV) calculation represents the absolute standard for project analysis:
$$ NPV(k) = \\\\\\sum_{t=0}^n \\\\\\frac{CF_t}{(1 + k)^t} $$
Where $CF_t$ is the cash flow at time $t$, and $k$ is the firm's cost of capital.
**Rule**: Invest if and only if the proposed project's NPV is positive.

**6.4 Alternative Investment Rules**
1. **Internal Rate of Return (IRR)**: The discount rate that makes the NPV equal to exactly zero. Accept if $IRR > k$.
2. **Profitability Index (PI)**: $PI = \\\\\\frac{\\\\\\text{PV of Future Cash Flows}}{\\\\\\text{Initial Investment Cost}}$

---

## PART III: VALUATION MODELS

### Chapter 7: Principles of Market Valuation
**7.1 The Relation between an Asset's Value and Its Price**
The fundamental value of an asset is the price well-informed investors must pay for it in a free and competitive market. The valuation connects anticipated future benefits, the timing of those benefits, and associated risks.

**7.3 The Law of One Price and Arbitrage**
In a competitive market, two equivalent assets will tend to have the same market price. Enforced by **arbitrage** (purchase and immediate sale of equivalent assets to earn a riskless profit).

**7.5 Interest Rates and the Law of One Price**
Interest rates dynamically link current prices with future expected values. Arbitrageurs ensure that the risk-free rate of return is consistent across all riskless financial instruments.

**7.11 The Efficient Markets Hypothesis (EMH)**
The proposition that an asset's current price fully reflects all publicly available information about economic fundamentals affecting the asset's value. 
- *Weak Form*: Prices reflect historical data.
- *Semi-Strong Form*: Prices reflect publicly available data.
- *Strong Form*: Prices reflect all data, both public and private.`;

if(content.includes(target1)){ content = content.replace(target1, replace1); } else { throw new Error('target1 not found'); }
if(content.includes(target2)){ content = content.replace(target2, replace2); } else { throw new Error('target2 not found'); }

fs.writeFileSync('src/lib/advancedStudyData.ts', content);
