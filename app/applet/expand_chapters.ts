import fs from 'fs';

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

const ch1To2Replacement = `### Chapter 1: Financial Economics

**1.1 Defining Finance**
Finance is the study of how people allocate scarce resources over time. The two features that distinguish financial decisions from other resource allocation decisions are that the costs and benefits of financial decisions are (1) spread out over time and (2) usually not known with certainty in advance. By systematically allocating resources over time, participants in the economy can optimize their consumption, investment, and wealth generation across various temporal states.

**1.2 Why Study Finance?**
- **To manage your personal resources**: You will face decisions such as whether to rent or buy a home, how much to save for retirement, and how to allocate your savings among alternative investments (e.g., stocks, bonds, real estate).
- **To deal with the world of business**: Whether you work in marketing, production, human resources, or IT, an understanding of financial concepts will be essential for comprehending the broader goals of your organization and the rationale behind strategic decisions.
- **To pursue interesting and rewarding career opportunities**: Finance offers diverse tracks including investment banking, corporate finance, financial planning, quantitative analysis, and risk management.
- **To make informed public choices as a citizen**: Topics like Social Security reform, tax policy, and government borrowing directly relate to finance.
- **To expand your mind**: Finance combines elements of economics, mathematics, and psychology to form a unified, intellectually rigorous framework.

**1.3 Financial Decisions of Households**
Households face four basic types of financial decisions:
1. *Consumption and saving decisions*: How much of their current wealth should they spend on consumption and how much of their current income should they save for the future?
2. *Investment decisions*: How should they invest the money they have saved? (E.g., establishing a portfolio of low-cost index funds versus holding cash and short-term bonds).
3. *Financing decisions*: When and how should households use other people's money to implement their consumption and investment plans? Examples include taking out a mortgage or an auto loan.
4. *Risk-management decisions*: How and on what terms should households seek to reduce the financial uncertainties they face or when should they increase their risks? This primarily involves buying life, health, or property insurance.

**1.4 Financial Decisions of Firms**
The first decision any firm must make is what businesses it wants to be in (strategic planning). 
- *Capital Budgeting*: The basic unit of analysis in capital budgeting is an investment project. This determines the asset side of the firm's balance sheet.
- *Capital Structure*: Capital structure determines who gets what share of its future cash flows. This involves deciding whether to issue debt (bonds) or equity (stocks).
- *Working Capital Management*: This involves short-term financing and management of daily cash flows, ensuring liquidity and solvency.

**1.7 The Goal of Management**
The goal of corporate management is to maximize shareholder wealth. Because shareholders are the residual claimants to the firm's cash flows, a focus on maximizing the share price leads managers to make the same investment decisions that each of the individual owners would have made had they made the decisions themselves. In highly competitive markets, this objective aligns with maximizing societal welfare by ensuring efficient allocation of capital.

---

### Chapter 2: Financial Markets and Institutions

**2.1 What Is the Financial System?**
The financial system is the collection of markets, institutions, laws, regulations, and techniques through which bonds, stocks, and other securities are traded, interest rates are determined, and financial services are produced and delivered around the world.

**2.3 The Functional Perspective**
Six core functions performed by the financial system:
1. **Transferring Economic Resources**: To provide ways to transfer economic resources through time, across borders, and among industries. For instance, student loans transfer resources from the future to the present.
2. **Managing Risk**: To provide ways of managing risk, such as via insurance companies or derivative markets.
3. **Clearing and Settling Payments**: To provide ways of clearing and settling payments to facilitate trade. The banking system forms the backbone of the payment system.
4. **Pooling Resources**: To provide a mechanism for the pooling of resources and for the subdividing of shares in various enterprises. Mutual funds serve precisely this role.
5. **Providing Price Information**: To provide price information to help coordinate decentralized decision making.
6. **Handling Incentive Problems**: To provide ways of dealing with the incentive problems, including moral hazard (the tendency of a party to take unobserved risks) and adverse selection (when informed parties take advantage of uninformed parties), as well as principal-agent problems.

**2.6 Financial Market Rates**
An interest rate is a promised rate of return. Fixed-income instrument rates depend on unit of account (e.g., USD vs EUR), maturity (length of time until the final payment), and default risk.
*Real Interest Rate*: 
The real interest rate adjusts the nominal interest rate for expected inflation.
$$ 1 + \\\\text{Real Rate} = \\\\frac{1 + \\\\text{Nominal Interest Rate}}{1 + \\\\text{Rate of Inflation}} $$

Using the Fisher Approximation:
$$ \\\\text{Real Rate} \\\\approx \\\\text{Nominal Rate} - \\\\text{Expected Inflation Rate} $$`;

const ch3Replacement = `### Chapter 3: Managing Financial Health and Performance

**3.4 The Balance Sheet and Income Statement**
The firm's financial health is summarized in two key documents: the balance sheet (which shows a snapshot of assets, liabilities, and equity at a specific point in time) and the income statement (which shows the revenues and expenses over a period of time).
The fundamental accounting equation is:
$$ \\\\text{Assets} = \\\\text{Liabilities} + \\\\text{Shareholders' Equity} $$

**3.6 Analysis Using Financial Ratios**
To accurately benchmark companies of different sizes, analysts use financial ratios.

<div class="overflow-x-auto my-6 markdown-table text-sm">

| Ratio Category | Name of Ratio | Formula |
| :--- | :--- | :--- |
| **Profitability** | Return on sales (ROS) | $EBIT / \\\\text{Sales}$ |
| | Return on assets (ROA) | $EBIT / \\\\text{Average Total Assets}$ |
| | Return on equity (ROE) | $\\\\text{Net Income} / \\\\text{Stockholders' Equity}$ |
| **Asset Turnover** | Receivables turnover | $\\\\text{Sales} / \\\\text{Average Receivables}$ |
| | Inventory turnover | $\\\\text{Cost of Goods Sold} / \\\\text{Average Inventory}$ |
| | Asset turnover | $\\\\text{Sales} / \\\\text{Average Total Assets}$ |
| **Financial Leverage** | Debt ratio | $\\\\text{Total Debt} / \\\\text{Total Assets}$ |
| | Times interest earned | $EBIT / \\\\text{Interest Expense}$ |
| **Liquidity** | Current ratio | $\\\\text{Current Assets} / \\\\text{Current Liabilities}$ |
| | Quick (acid-test) ratio | $(\\\\text{Cash} + \\\\text{Marketable Securities} + \\\\text{Receivables}) / \\\\text{Current Liabilities}$ |
| **Market Value** | Price-Earnings (P/E) | $\\\\text{Price per Share} / \\\\text{Earnings per Share}$ |
| | Market-to-Book (M/B) | $\\\\text{Market Value of Equity} / \\\\text{Book Value of Equity}$ |

</div>

**3.7 The DuPont System of Ratio Analysis**
The DuPont system breaks down the Return on Equity (ROE) into constituent parts to understand what exactly is driving a firm's profitability. Specifically, ROE depends on operating efficiency, asset use efficiency, and financial leverage.

**ROE Decomposition Formula:**
$$ ROE = \\\\frac{\\\\text{Net Income}}{\\\\text{Sales}} \\\\times \\\\frac{\\\\text{Sales}}{\\\\text{Assets}} \\\\times \\\\frac{\\\\text{Assets}}{\\\\text{Equity}} $$
$$ ROE = \\\\text{Profit Margin} \\\\times \\\\text{Asset Turnover} \\\\times \\\\text{Equity Multiplier} $$

An alternative decomposition emphasizing interest and taxes:
$$ ROE = (1 - \\\\text{Tax Rate}) \\\\times \\\\left[ ROA + \\\\left(\\\\frac{\\\\text{Debt}}{\\\\text{Equity}}\\\\right) \\\\times (ROA - \\\\text{Interest Rate}) \\\\right] $$

**3.9 Growth and the Need for External Financing**
A firm's sustainable growth rate is the maximum rate at which its sales can grow without exhausting financial resources, changing its debt-to-equity ratio, or issuing new equity.
$$ \\\\text{Sustainable Growth Rate (g)} = \\\\text{Earnings Retention Rate} \\\\times ROE = b \\\\times ROE$$
Where $b = 1 - \\\\text{Dividend Payout Ratio}$.`;

const ch5To7Replacement = `### Chapter 5: Household Saving and Investment Decisions

**5.1 A Life-Cycle Model of Saving**
The core framework for analyzing household saving decisions is the life-cycle model. The present value of a household's lifetime consumption spending and bequests must equal the present value of its initial wealth and its future labor income (often referred to as Human Capital).

*Intertemporal Budget Constraint:*
$$ \\\\sum_{t=1}^T \\\\frac{C_t}{(1+i)^t} + \\\\frac{B_t}{(1+i)^T} = W_0 + \\\\sum_{t=1}^R \\\\frac{Y_t}{(1+i)^t} $$
Where $C_t$ is consumption in year $t$, $Y_t$ is labor income, $B_t$ is the bequest, $W_0$ is current wealth, and $i$ is the interest rate.

**5.3 Social Security and Household Saving**
Social security represents a forced savings mechanism imposed by the government to ensure baseline retirement viability. This offsets some of the required voluntary savings households must undertake, modifying the life-cycle trajectory.

---

### Chapter 6: The Analysis of Investment Projects

**6.1 The Nature of Project Analysis**
Firms must continuously identify and evaluate physical capital investments, research and development capabilities, and strategic expansions. This is known as **capital budgeting**.

**6.3 The Net Present Value Investment Rule**
The NPV rule is the absolute gold standard of capital budgeting.
Net Present Value (NPV) calculation:
$$ NPV = \\\\sum_{t=0}^n \\\\frac{CF_t}{(1 + k)^t} $$
Where $CF_t$ is the cash flow at time $t$ (note that $CF_0$ is typically negative, representing the initial investment), and $k$ is the firm's cost of capital (or the required rate of return for the project's risk profile).
**Rule**: Invest if and only if the proposed project's NPV is positive ($NPV > 0$). When choosing between mutually exclusive projects, pick the one with the highest positive NPV.

**6.4 Alternative Investment Rules**
1. **Internal Rate of Return (IRR)**: The discount rate that makes the NPV equal to exactly zero.
   $$ \\\\sum_{t=0}^n \\\\frac{CF_t}{(1 + IRR)^t} = 0 $$
   *Rule*: Accept the project if the IRR exceeds the firm's cost of capital ($IRR > k$). Beware of multiple IRRs if cash flows change signs more than once.
2. **Payback Period**: The number of years required to recover the initial investment. This method is heavily criticized because it ignores the time value of money and any cash flows occurring after the payback threshold.
3. **Profitability Index (PI)**: The ratio of the present value of future cash flows to the initial investment.
   $$ PI = \\\\frac{\\\\text{PV of Future Cash Flows}}{\\\\text{Initial Investment Cost}} $$

---

### Chapter 7: Principles of Market Valuation

**7.1 The Relation between an Asset's Value and Its Price**
The fundamental value of an asset is the price well-informed investors must pay for it in a free and competitive market. The valuation process connects anticipated future benefits, the timing of those benefits, and the associated risks into a single present-day metric.

**7.3 The Law of One Price and Arbitrage**
In a competitive market, two assets that are equivalent (meaning they produce identical future cash flows with identical risks) will tend to have the same market price. This is enforced by **arbitrage**—the purchase and immediate sale of equivalent assets to earn a sure profit from a difference in their prices without taking any risk.

**7.5 Interest Rates and the Law of One Price**
Interest rates dynamically link current prices with future expected values. Arbitrageurs ensure that the risk-free rate of return is consistent across all riskless financial instruments in the economy.

**7.11 The Efficient Markets Hypothesis (EMH)**
The Efficient Markets Hypothesis asserts that an asset's current price fully and immediately reflects all publicly available information about economic fundamentals affecting the asset's value. 
- *Weak Form EMH*: Stock prices reflect all historical data (technical analysis is useless).
- *Semi-Strong Form EMH*: Stock prices reflect all publicly accessible data (fundamental analysis cannot consistently beat the market).
- *Strong Form EMH*: Stock prices reflect all data, both public and private (even insider trading cannot yield long-term outsized returns).`;

// 1. Relpace Chapters 1 to 3
const regex1to3 = /### Chapter 1: Financial Economics[\s\S]*?(?=## PART II: TIME AND RESOURCE ALLOCATION)/;
content = content.replace(regex1to3, ch1To2Replacement + '\n\n---\n\n' + ch3Replacement + '\n\n---\n\n');

// 2. Replace Chapters 5 to 7
const regex5to7 = /### Chapter 5: Household Saving and Investment Decisions[\s\S]*?(?=### Chapter 8: Valuation of Known Cash Flows: Bonds)/;
content = content.replace(regex5to7, ch5To7Replacement + '\n\n---\n\n');

fs.writeFileSync('src/lib/advancedStudyData.ts', content);

