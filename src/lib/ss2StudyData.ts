export const SS2_STUDY_GUIDE: Record<string, string> = {
  "ss2-ch1": `
# Chapter 1: Basic Tools for Economic Analysis

## 1.1 Introduction
In Senior Secondary School 2 (SS2) Economics, we build on the mathematical foundations laid in SS1. Analysis becomes more quantitative, focusing on algebraic relationships and statistical tools to measure economic behaviors. The main focus of this chapter is describing variables through simple linear equations and measuring their scattering or distribution through measures of dispersion.

## 1.2 Simple Linear Equations
A functional relationship shows how one variable depends on another. A **linear function** produces a straight-line graph when plotted. The general form of a simple linear equation is:

$$y = a + bx$$

Where:
*   $y$ = dependent variable (the unknown being explained)
*   $x$ = independent or explanatory variable (the known factor)
*   $a$ = intercept (the value of $y$ when $x = 0$)
*   $b$ = gradient or slope (the rate at which $y$ changes per unit change in $x$)

### Calculating the Slope ($b$)
The slope is the ratio of vertical distance (rise) to horizontal distance (run). Given two distinct points $(x_1, y_1)$ and $(x_2, y_2)$:

$$b = \\frac{y_2 - y_1}{x_2 - x_1}$$

*   If $b > 0$, the curve slopes upwards from left to right.
*   If $b < 0$, the curve slopes downwards from left to right.

### Applications of Linear Equations in Economics
Linear equations link economic variables such as:
1.  **Demand**: $Q_d = a - bP$ (negative slope, showing the inverse relationship with price)
2.  **Supply**: $Q_s = a + bP$ (positive slope, showing the direct relationship with price)
3.  **Consumption**: $C = a + bY$ (where $a$ is autonomous consumption, $b$ is the marginal propensity to consume, and $Y$ is national income)

### Equilibrium Price and Quantity Example
Consider market equations:
*   Demand: $Q_d = 30 - 3P$
*   Supply: $Q_s = P + 20$

Solve for equilibrium where $Q_d = Q_s$:
$$30 - 3P = P + 20$$
$$30 - 20 = P + 3P$$
$$10 = 4P \\implies P = \\frac{10}{4} = 2.5$$

Substitute $P = 2.5$ into the demand function to find the equilibrium quantity ($Q$):
$$Q = 30 - 3(2.5) = 22.5$$

Equilibrium price is **₦2.50** and equilibrium quantity is **22.5 units**.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 1.1: Market Equilibrium",
  "xAxis": "quantity",
  "yAxis": "price",
  "data": [
    {"price": 10,"demand": 0, "supply": 30},
    {"price": 5, "demand": 15, "supply": 25},
    {"price": 2.5, "demand": 22.5, "supply": 22.5},
    {"price": 1, "demand": 27, "supply": 21},
    {"price": 0, "demand": 30, "supply": 20}
  ],
  "series": [
    {"key": "demand", "name": "Demand (Qd)", "color": "#ef4444"},
    {"key": "supply", "name": "Supply (Qs)", "color": "#10b981"}
  ]
}
\`\`\`

---

## 1.3 Measures of Dispersion
While measures of central tendency (mean, median, mode) tell us the center of a distribution, **measures of dispersion** state how spread out or clustered those data points are. The three most common metrics are:

### 1. Mean Deviation
The average of the absolute differences between each value and the mean.
$$\\text{Ungrouped Mean Deviation } d = \\frac{\\sum \\lvert x - \\bar{x} \\rvert}{n}$$
$$\\text{Grouped Mean Deviation } d = \\frac{\\sum f\\lvert x - \\bar{x} \\rvert}{\\sum f}$$

### 2. Standard Deviation
The square root of the arithmetic mean of the squared deviations from the mean. It is the most reliable measure of dispersion.
$$\\text{Ungrouped Standard Deviation } S = \\sqrt{\\frac{\\sum(x - \\bar{x})^2}{n}}$$
$$\\text{Grouped Standard Deviation } S = \\sqrt{\\frac{\\sum f(x - \\bar{x})^2}{\\sum f}}$$

### 3. Variance
The square of the standard deviation.
$$V = S^2 = \\frac{\\sum f(x - \\bar{x})^2}{\\sum f}$$

#### Advantages of Standard Deviation:
1. It uses all values in the data for calculation.
2. It is widely used in advanced statistical inferences and sampling theories.
3. It does not ignore positive/negative signs (by squaring values).

#### Disadvantages of Standard Deviation:
1. It is difficult and tedious to calculate manually.
2. It gives more weight to extreme outliers due to squaring.

### Worked-Out Example 1: Ungrouped Data Dispersion
Given the scores of 5 students in an Economics test: **10, 12, 14, 16, 18**. Let's calculate the Mean, Mean Deviation, Variance, and Standard Deviation.

#### Step 1: Calculate the Mean ($\\bar{x}$)
$$\\bar{x} = \\frac{10 + 12 + 14 + 16 + 18}{5} = \\frac{70}{5} = 14$$

#### Step 2: Calculate Deviations and Squared Deviations
| Score ($x$) | Deviation ($x - \\bar{x}$) | Absolute Deviation ($\\lvert x - \\bar{x} \\rvert$) | Squared Deviation ($(x - \\bar{x})^2$) |
| :---: | :---: | :---: | :---: |
| 10 | $10 - 14 = -4$ | 4 | 16 |
| 12 | $12 - 14 = -2$ | 2 | 4 |
| 14 | $14 - 14 = 0$ | 0 | 0 |
| 16 | $16 - 14 = 2$ | 2 | 4 |
| 18 | $18 - 14 = 4$ | 4 | 16 |
| **Sum** | **0** | **12** | **40** |

#### Step 3: Mean Deviation
$$MD = \\frac{\\sum \\lvert x - \\bar{x} \\rvert}{n} = \\frac{12}{5} = 2.4$$

#### Step 4: Variance ($S^2$)
$$Variance = \\frac{\\sum (x - \\bar{x})^2}{n} = \\frac{40}{5} = 8$$

#### Step 5: Standard Deviation ($S$)
$$SD = \\sqrt{8} \\approx 2.83$$

### Worked-Out Example 2: Grouped Data Dispersion
The table below represents the marks of 20 students in a Senior Secondary Economics quiz, grouped into classes. Let's calculate the Mean, Mean Deviation, Variance, and Standard Deviation.

| Mark Class | Frequency ($f$) | Midpoint ($x$) | $fx$ | Deviation ($x - \\bar{x}$) | Absolute Deviation ($\\lvert x - \\bar{x} \\rvert$) | $f\\lvert x - \\bar{x} \\rvert$ | Squared Deviation ($(x - \\bar{x})^2$) | $f(x - \\bar{x})^2$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 - 5 | 2 | 3 | 6 | $3 - 13 = -10$ | 10 | 20 | 100 | 200 |
| 6 - 10 | 4 | 8 | 32 | $8 - 13 = -5$ | 5 | 20 | 25 | 100 |
| 11 - 15 | 6 | 13 | 78 | $13 - 13 = 0$ | 0 | 0 | 0 | 0 |
| 16 - 20 | 8 | 18 | 144 | $18 - 13 = 5$ | 5 | 40 | 25 | 200 |
| **Sum** | **$\\sum f = 20$** | - | **$\\sum fx = 260$** | - | - | **$\\sum f\\lvert x - \\bar{x} \\rvert = 80$** | - | **$\\sum f(x - \\bar{x})^2 = 500$** |

#### Step 1: Calculate the Grouped Mean ($\\bar{x}$)
$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{260}{20} = 13.0$$

#### Step 2: Calculate Grouped Mean Deviation (MD)
Using the sum of $f\\lvert x - \\bar{x} \\rvert$:
$$MD = \\frac{\\sum f\\lvert x - \\bar{x} \\rvert}{\\sum f} = \\frac{80}{20} = 4.0$$

#### Step 3: Calculate Grouped Variance ($S^2$)
Using the sum of $f(x - \\bar{x})^2$:
$$S^2 = \\frac{\\sum f(x - \\bar{x})^2}{\\sum f} = \\frac{500}{20} = 25.0$$

#### Step 4: Calculate Grouped Standard Deviation ($S$)
Take the square root of the variance:
$$S = \\sqrt{25.0} = 5.0$$

#### Interactive Dispersion & Stats Simulator
\`\`\`simulator
{
  "mode": "descriptive_stats",
  "title": "Descriptive Statistics & Dispersion Calculator"
}
\`\`\`
`,

  "ss2-ch2": `
# Chapter 2: Concepts of Demand, Supply, and Price Determination I

## 2.1 Concept of Demand
**Demand** is the quantity of a good or service that consumers, households, and governments are willing and able to purchase at a given price and period. In economics, only **effective demand** is considered. Effective demand is a desire backed by the ability (financial resources) and preparedness to pay.

## 2.2 Demand Schedule and Demand Curve
A **demand schedule** is a tabular representation of the prices of a commodity and the corresponding quantities demanded. A **demand curve** is the graphical representation of this table, conventionally sloping downwards from left to right.

### Abnormal (Exceptional) Demand Curves
An abnormal demand curve does not obey the law of demand. Instead of sloping downwards, it slopes upward (positive relationship) or behaves irregularly. It occurs due to:
1.  **Articles of Ostentation (Veblen Goods)**: High-price goods purchased by the wealthy to display social status (e.g., diamonds, luxury sports cars).
2.  **Giffen/Inferior Goods (Giffen Paradox)**: Essential goods consumed by the poor (e.g., bread or gari) where an inflation spike in price forces them to buy more of it because they can no longer afford better substitutes (like meat).
3.  **Speculation**: Expectation of a further future price rise causes people to buy more now.
4.  **Quality-Price Association**: Consumers assuming high price represents high quality.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 2.1: Abnormal Demand Curve (Articles of Ostentation)",
  "xAxis": "quantity",
  "yAxis": "price",
  "data": [
    {"price": 100, "quantity": 10},
    {"price": 200, "quantity": 25},
    {"price": 300, "quantity": 40},
    {"price": 400, "quantity": 60}
  ],
  "series": [
    {"key": "quantity", "name": "Quantity Demanded", "color": "#ea580c"}
  ]
}
\`\`\`

---

## 2.3 Changes in Demand vs. Changes in Quantity Demanded

### 1. Change in Quantity Demanded (Expansion/Contraction)
This refers to movement **along the same demand curve** caused solely by a change in the price of the commodity.
*   **Expansion (Extension)**: Price falls, quantity demanded rises.
*   **Contraction**: Price rises, quantity demanded falls.
*   *Causes*: Income effect (lower price raises real income/purchasing power) and Substitution effect (lower price makes a good more attractive than substitutes).

### 2. Change in Demand (Shift in Demand Curve)
This refers to a **shift of the entire demand curve** to the left (decrease) or right (increase) at constant prices.
*   *Determinants of Shift*:
    *   Change in consumer disposable income.
    *   Government tax policy.
    *   Prices of other related commodities (Substitutes or Complements).
    *   Changes in taste, vogue, and fashion.
    *   Seasonal effects (e.g., cardigans during harmattan).
    *   Changes in consumer population size.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 2.2: Shifts in Demand (Constant Price P=10)",
  "xAxis": "quantity",
  "yAxis": "price",
  "data": [
    {"quantity": 20, "price": 10, "left_shift": 10, "right_shift": 35},
    {"quantity": 20, "price": 10, "left_shift": 10, "right_shift": 35}
  ],
  "series": [
    {"key": "left_shift", "name": "Decrease in Demand (Left)", "color": "#ef4444"},
    {"key": "quantity", "name": "Original Demand (D0)", "color": "#3b82f6"},
    {"key": "right_shift", "name": "Increase in Demand (Right)", "color": "#10b981"}
  ]
}
\`\`\`

---

## 2.4 Concept of Supply
**Supply** is the quantity of an economic good that sellers are ready to offer for sale at a particular price and specified time. Supply is a **flow** (measured per unit of time), not a constant **stock**. It is distinct from total production, as producers may keep part of total production for reserve stocks or self-consumption.

### Abnormal Supply Curve
A supply curve that does not slope upward continuously. A classic example is the **backward-bending supply curve of labor**, where beyond a certain high wage ($W^*$), workers prefer leisure to labor, causing the quantity of labor supplied to contract as the wage increases.

#### Interactive Market Price Simulator
\`\`\`simulator
{
  "mode": "equilibrium",
  "title": "Interactive Demand & Supply Price Simulator",
  "initialValues": {
    "num1": 1500,
    "num2": 1600,
    "num3": 40,
    "num4": 20,
    "num5": 10
  }
}
\`\`\`
`,

  "ss2-ch3": `
# Chapter 3: Production

## 3.1 Production Possibility Curve (PPC)
The **Production Possibility Curve (PPC)** (or Frontier - PPF) is a graphical representation displaying the maximum alternative combinations of two goods that can be produced by an economy given fixed technology and resources, assuming full and efficient resource employment.

### Key Assumptions of the PPC:
1.  **Fixity of resources**: The factors of production are static in the short run.
2.  **Full employment of resources**: No idle capacity exists; all resources are optimally utilized.
3.  **Two-good economy**: For simplification, only two goods are compared (e.g., Good X and Good Y).

\`\`\`chart
{
  "type": "area",
  "title": "Figure 3.1: Production Possibility Curve",
  "xAxis": "good_x",
  "yAxis": "good_y",
  "data": [
    {"good_x": 0, "good_y": 100},
    {"good_x": 20, "good_y": 90},
    {"good_x": 40, "good_y": 75},
    {"good_x": 60, "good_y": 50},
    {"good_x": 80, "good_y": 0}
  ],
  "series": [
    {"key": "good_y", "name": "PPF frontier", "color": "#6366f1"}
  ]
}
\`\`\`

### Analysis of PPC Zones:
*   **Points on the curve**: Efficient production (all resources fully employed; e.g., points $(20, 90)$ or $(40, 75)$).
*   **Points inside the curve**: Inefficient production (existence of idle capacity or unemployment of resources).
*   **Points outside the curve**: Attainable only through economic growth, resource discovery, or technological breakthrough.
*   **Slope of PPC**: Measured by the **Marginal Rate of Transformation (MRT)**, expressing the opportunity cost of producing more of Good X in terms of Good Y foregone.

---

## 3.2 Concept of Productivity
Productivity measures the efficiency of a factor of production over a giving timeframe. We identify three measures:

1.  **Total Product ($TP$)**: The overall output produced by combining variable factors with fixed factors.
2.  **Average Product ($AP$)**: Output per unit of variable factor.
    $$AP = \\frac{TP}{L}$$
3.  **Marginal Product ($MP$)**: The incremental output when one more unit of variable factor is added ($L$ represent labor).
    $$MP = \\frac{\\Delta TP}{\\Delta L}$$

### Product Relationship Table (Concept of Productivity)
| Variable Labor ($L$) | Fixed Land | Total Product ($TP$) | Average Product ($AP = \\frac{TP}{L}$) | Marginal Product ($MP = \\frac{\\Delta TP}{\\Delta L}$) |
| :---: | :---: | :---: | :---: | :---: |
| 1 | 3 | 3 | 3.0 | 3 |
| 2 | 3 | 12 | 6.0 | 9 |
| 3 | 3 | 24 | 8.0 | 12 |
| 4 | 3 | 32 | 8.0 | 8 |
| 5 | 3 | 37.5 | 7.5 | 5.5 |
| 6 | 3 | 42 | 7.0 | 4.5 |
| 7 | 3 | 42 | 6.0 | 0 |
| 8 | 3 | 40 | 5.0 | -2 |

\`\`\`chart
{
  "type": "line",
  "title": "Figure 3.2: Production Productivity Curves",
  "xAxis": "labor",
  "yAxis": "value",
  "data": [
    {"labor": 1, "tp": 3, "ap": 3.0, "mp": 3},
    {"labor": 2, "tp": 12, "ap": 6.0, "mp": 9},
    {"labor": 3, "tp": 24, "ap": 8.0, "mp": 12},
    {"labor": 4, "tp": 32, "ap": 8.0, "mp": 8},
    {"labor": 5, "tp": 37.5, "ap": 7.5, "mp": 5.5},
    {"labor": 6, "tp": 42, "ap": 7.0, "mp": 4.5},
    {"labor": 7, "tp": 42, "ap": 6.0, "mp": 0},
    {"labor": 8, "tp": 40, "ap": 5.0, "mp": -2}
  ],
  "series": [
    {"key": "tp", "name": "Total Product (TP)", "color": "#3b82f6"},
    {"key": "ap", "name": "Average Product (AP)", "color": "#10b981"},
    {"key": "mp", "name": "Marginal Product (MP)", "color": "#f43f5e"}
  ]
}
\`\`\`

---

## 3.3 Law of Variable Proportions (Diminishing Marginal Returns)
This fundamental economic law states that as successive units of a variable factor (labor) are added to a constant quantity of fixed factors (land/machinery), a point is reached where the marginal product ($MP$) and subsequently the average product ($AP$) start to diminish.

### Core Stages of the Law:
1.  **Stage I: Increasing Returns ($L=1$ to $3$)**: TP increases at an increasing rate. MP is rising and reaches its peak.
2.  **Stage II: Decreasing/Diminishing Returns ($L=3$ to $7$)**: TP increases at a decreasing rate. MP is falling but positive. This is the optimal stage of production. At the end of this stage ($L=7$), TP is maximized and $MP = 0$.
3.  **Stage III: Negative Returns ($L > 7$)**: TP decreases; MP becomes negative. Additional variable factors actually obstruct production.

#### Interactive Production Simulator
\`\`\`simulator
{
  "mode": "production",
  "title": "Interactive Variable Proportions Work Simulator",
  "initialValues": {
    "num1": 1500,
    "num2": 1600,
    "num3": 40,
    "num4": 20,
    "num5": 10
  }
}
\`\`\`
`,

  "ss2-ch4": `
# Chapter 4: Theory of Cost and Revenue

## 4.1 Concept of Cost
Every business must incur costs in production. However, accountants and economists view cost differently:

### 1. Accountant's View: Outlays / Money Cost
The actual monetary expenditures incurred to obtain inputs. The accountant records exact cash flows, ledger balances, and explicit expenses (e.g., buying land, paying wages).

### 2. Economist's View: Real Cost / Opportunity Cost
The value of the next best alternative foregone. For example, if a firm spends ₦1,000,000 to construct a warehouse, the money cost is ₦1,000,000, but the opportunity cost is the value of the machinery they could have purchased with that same ₦1,000,000.

---

## 4.2 Kinds of Costs
In the short run (where at least one factor of production is fixed in supply), short-run costs are divided into:

### 1. Fixed Cost (FC)
Costs that stay constant regardless of the scale of production (e.g., rents, machinery depreciation). This curve is a straight horizontal line. Also known as overhead or supplementary costs.

### 2. Variable Cost (VC)
Costs that fluctuate directly with output (e.g., raw materials, direct wages, fuel). Also known as prime or operating costs.

### 3. Total Cost (TC)
The sum of fixed and variable costs at each level of output.
$$TC = FC + VC$$

### 4. Average Cost (AC)
The unit cost of production.
$$AC = \\frac{TC}{Q} \\quad (\\text{or } AC = AFC + AVC)$$
Where $AFC = \\frac{FC}{Q}$ and $AVC = \\frac{VC}{Q}$.

### 5. Marginal Cost (MC)
The change in total cost resulting from producing one additional unit of output.
$$MC = \\frac{\\Delta TC}{\\Delta Q}$$

### Short-Run Cost Calculations Table
| Total Output ($Q$) | Fixed Cost ($FC$) | Variable Cost ($VC$) | Total Cost ($TC$) | Average Cost ($AC = \\frac{TC}{Q}$) | Marginal Cost ($MC = \\frac{\\Delta TC}{\\Delta Q}$) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 16 | 8 | 24 | 24.0 | - |
| 2 | 16 | 14 | 30 | 15.0 | 6 |
| 3 | 16 | 35 | 51 | 17.0 | 21 |
| 4 | 16 | 64 | 80 | 20.0 | 29 |
| 5 | 16 | 104 | 120 | 24.0 | 40 |

\`\`\`chart
{
  "type": "line",
  "title": "Figure 4.1: Cost Curves",
  "xAxis": "output",
  "yAxis": "cost",
  "data": [
    {"output": 1, "fc": 16, "vc": 8, "tc": 24, "ac": 24.0, "mc": 10},
    {"output": 2, "fc": 16, "vc": 14, "tc": 30, "ac": 15.0, "mc": 6},
    {"output": 3, "fc": 16, "vc": 35, "tc": 51, "ac": 17.0, "mc": 21},
    {"output": 4, "fc": 16, "vc": 64, "tc": 80, "ac": 20.0, "mc": 29},
    {"output": 5, "fc": 16, "vc": 104, "tc": 120, "ac": 24.0, "mc": 40}
  ],
  "series": [
    {"key": "fc", "name": "Fixed Cost (FC)", "color": "#f59e0b"},
    {"key": "tc", "name": "Total Cost (TC)", "color": "#3b82f6"},
    {"key": "ac", "name": "Average Cost (AC)", "color": "#10b981"},
    {"key": "mc", "name": "Marginal Cost (MC)", "color": "#ef4444"}
  ]
}
\`\`\`

### Relationship Between MC and AC:
1.  **When $MC < AC$**: Average Cost ($AC$) is falling.
2.  **When $MC > AC$**: Average Cost ($AC$) is rising.
3.  **When $MC = AC$**: Average Cost ($AC$) is at its absolute minimum level. The MC curve cuts the AC curve from below at its lowest point.

---

## 4.3 Concept of Revenue
Revenue is the income earned from sales of products.
1.  **Total Revenue (TR)**: The entire sum received.
    $$TR = P \\times Q$$
2.  **Average Revenue (AR)**: Unit revenue received.
    $$AR = \\frac{TR}{Q} = P$$
3.  **Marginal Revenue (MR)**: Incremental revenue from selling one more unit.
    $$MR = \\frac{\\Delta TR}{\\Delta Q}$$

### Solved Example: Finding the Optimum Output Level
A firm has a Fixed Cost ($FC$) of **₦50** and its Variable Cost ($VC$) function is $VC = 2Q + Q^2$. Let's compute the costs and find the Average Cost ($AC$) and Marginal Cost ($MC$) for output levels $Q = 4$ and $Q = 5$.

#### 1. For Output Level $Q = 4$:
*   $FC = 50$
*   $VC = 2(4) + 4^2 = 8 + 16 = 24$
*   $TC = FC + VC = 50 + 24 = ₦74$
*   $AC = \\frac{TC}{Q} = \\frac{74}{4} = ₦18.50$
*   $MC = TC(4) - TC(3) = 74 - [50 + 2(3) + 3^2] = 74 - 65 = ₦9.00$

#### 2. For Output Level $Q = 5$:
*   $FC = 50$
*   $VC = 2(5) + 5^2 = 10 + 25 = 35$
*   $TC = FC + VC = 50 + 35 = ₦85$
*   $AC = \\frac{TC}{Q} = \\frac{85}{5} = ₦17.00$ (falling!)
*   $MC = TC(5) - TC(4) = 85 - 74 = ₦11.00$

Notice that as long as $MC < AC$ ($11.00 < 17.00$), Average Cost continues to fall!

#### Interactive Cost & Revenue Simulator
\`\`\`simulator
{
  "mode": "cost_revenue",
  "title": "Interactive AC-MC Cost Curve Simulator",
  "initialValues": {
    "fc": 50,
    "a": 2,
    "b": 1,
    "price": 20,
    "q": 5
  }
}
\`\`\`
`,

  "ss2-ch5": `
# Chapter 5: Labour Market

## 5.1 Introduction
The **labour market** is the market where labor services (supplied by workers and demanded by employers) are bought and sold. Labor stands out as a unique factor of production. It exhibits distinctive characteristics:
1.  **Joint Seller-Commodity**: Labor is embodied in its seller; the worker must be physically present to deliver the commodity.
2.  **Partial Monetization**: Labor is highly sensitive to non-monetary conditions (social status, job security, benefits) rather than simple cash wages.
3.  **Limited Control by the Buyer**: Labor remains the intrinsic property of the seller even after purchase.

## 5.2 Supply and Demand of Labour

### 1. The Size of the Labour Force
The portion of the population available and legally permitted to work. The size of the labor force depends on:
*   Age distribution of the population
*   Sex distribution of the population
*   Compulsory educational school-leaving age
*   Official retirement age

### 2. Efficiency of the Labour Force
The ability of a worker to achieve maximum productivity with the lowest expenditure of resources. It is influenced by:
*   General education and skill development
*   Work environment and ergonomics
*   On-the-job training schemes
*   Provision of welfare benefits (health, housing, pension)

### 3. Mobility of Labour
The ease with which workers can switch jobs. We distinguish:
*   **Geographical Mobility**: Restructured by transport costs, family ties, and regional housing constraints.
*   **Occupational Mobility**: Changing careers. Unskilled labor is highly occupationally mobile due to minimal retraining cost, while highly skilled professionals (e.g., brain surgeons) are highly occupationally immobile.

### 4. Demand for Labour
Demand for labor is a **derived demand**, meaning it depends on the demand for the final goods the labor helps produce. An entrepreneur employs labor up to the point where the cost of the last worker (wage) equals the **Marginal Revenue Product of Labour (MRPL)**:

$$MRP_L = MP_L \\times MR$$

---

## 5.3 Wages and Unemployment

### Theories of Wage Determination
1.  **Subsistence Theory**: Wages should equal the basic necessities required for survival.
2.  **Wage-Fund Theory**: Wages depend on the predetermined capital pool accumulated by employers to pay labor.
3.  **Bargaining Theory**: Wages are decided by collective bargaining between trade unions and management.
4.  **Marginal Productivity Theory**: Wages tend to equal the value of the marginal product of labor.

### Unemployment Rate Calculation
Unemployment is the condition of being able and willing to work but unable to find a job.
$$\\text{Unemployment Rate } U = \\frac{x}{x + y} \\times 100$$
Where:
*   $x$ = Number of unemployed persons
*   $y$ = Number of employed persons
*   $x+y$ = Total labor force

### Major Types of Unemployment
1.  **Hidden**: Working in non-preferred jobs merely to stay active.
2.  **Underemployment**: Working beneath full capacity or skill level.
3.  **Disguised**: Marginal productivity is zero ($MP_L = 0$). Removing the worker does not reduce total output.
4.  **Frictional**: Temporary search unemployment between jobs.
5.  **Structural**: Permanent mismatch due to industrial decline or tech replacement.
6.  **Cyclical (Mass)**: Due to economic recessions and drop in aggregate demand.
7.  **Seasonal**: Due to fluctuations in climate/demand seasons.

#### Interactive Labour Market Simulator
\`\`\`simulator
{
  "mode": "labour_market",
  "title": "Interactive Wage Determination & Unemployment Simulator",
  "initialValues": {
    "num1": 1500,
    "num2": 1600,
    "num3": 40,
    "num4": 20,
    "num5": 10
  }
}
\`\`\`
`,

  "ss2-ch6": `
# Chapter 6: Theory of Consumer Behaviour (Utility)

## 6.1 Concept of Utility
**Utility** is the capacity of a good or service to satisfy a human want. It is psychological, subjective, and exists in the mind of the consumer.
1.  **Total Utility (TU)**: Overallsatisfaction derived from consuming a specific quantity of a commodity.
2.  **Average Utility (AU)**: Satisfaction per unit consumed.
    $$AU = \\frac{TU}{q}$$
3.  **Marginal Utility (MU)**: The incremental satisfaction from consuming one more unit.
    $$MU = \\frac{\\Delta TU}{\\Delta q}$$

### The Law of Diminishing Marginal Utility (LDMU)
As a consumer consumes successive equal increments of a commodity, the marginal utility derived from each additional unit decreases.
*   **Satiety Point**: When $MU = 0$, Total Utility ($TU$) reaches its absolute maximum.
*   **Negative Utility**: If consumption continues beyond satiety, $MU$ becomes negative (disutility) and $TU$ starts falling.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 6.1: Utility relationship",
  "xAxis": "units",
  "yAxis": "utility",
  "data": [
    {"units": 1, "tu": 10, "mu": 10},
    {"units": 2, "tu": 16, "mu": 6},
    {"units": 3, "tu": 20, "mu": 4},
    {"units": 4, "tu": 23, "mu": 3},
    {"units": 5, "tu": 25, "mu": 2},
    {"units": 6, "tu": 22, "mu": -3},
    {"units": 7, "tu": 17, "mu": -5}
  ],
  "series": [
    {"key": "tu", "name": "Total Utility (TU)", "color": "#6366f1"},
    {"key": "mu", "name": "Marginal Utility (MU)", "color": "#f43f5e"}
  ]
}
\`\`\`

---

## 6.2 Consumer Equilibrium & Maximisation
Under cardinal utility (utility is measurable in cardinal numbers), the utility-maximizing consumer distributed income such that:

$$\\frac{MU_A}{P_A} = \\frac{MU_B}{P_B} = \\frac{MU_C}{P_C}$$

Where $MU$ is the marginal utility of each good, and $P$ is its unit price. Once this condition is met, the ratio of price to marginal utility across all commodities is equalised, maximizing total utility.

---

## 6.3 Ordinal Utility & Indifference Curves
Under ordinal utility, subjective satisfaction is compared through rankings rather than direct measurements. The primary tool is the **indifference curve (IC)**, showing combinations of two goods yielding equal overall utility.

### Properties of Indifference Curves:
1.  They slope downwards from left to right.
2.  They are convex to the origin due to the diminishing **Marginal Rate of Substitution (MRS)**:
    $$MRS_{xy} = -\\frac{\\Delta y}{\\Delta x}$$
3.  Two indifference curves can never intersect, as that would violate transitivity.
4.  Higher indifference curves represent higher levels of consumer satisfaction.

### Consumer Budget Line & Tangency Point
The budget line shows all purchasable combinations of Good X and Good Y given prices and money income:
$$I = P_x X + P_y Y$$

The consumer is in equilibrium at the point of **tangency**, where the slope of the budget line equals the slope of the highest attainable indifference curve ($MRS = \\frac{P_x}{P_y}$).

\`\`\`chart
{
  "type": "line",
  "title": "Figure 6.2: Indifference Tangency",
  "xAxis": "good_x",
  "yAxis": "good_y",
  "data": [
    {"good_x": 0, "budget": 15, "indifference": 18},
    {"good_x": 5, "budget": 11.25, "indifference": 12},
    {"good_x": 10, "budget": 7.5, "indifference": 7.5},
    {"good_x": 15, "budget": 3.75, "indifference": 5},
    {"good_x": 20, "budget": 0, "indifference": 4}
  ],
  "series": [
    {"key": "budget", "name": "Budget Line", "color": "#10b981"},
    {"key": "indifference", "name": "Indifference Curve (IC)", "color": "#8b5cf6"}
  ]
}
\`\`\`

### Solved Example: Utility Optimization
Suppose a consumer enjoys eating plantain chips. The table below represents their satisfaction:
*   1st chip: Total Utility ($TU$) = 10 Utils. Marginal Utility ($MU$) = 10.
*   2nd chip: $TU = 16$. $MU = 16 - 10 = 6$.
*   3rd chip: $TU = 20$. $MU = 20 - 16 = 4$.
*   4th chip: $TU = 23$. $MU = 23 - 20 = 3$.
*   5th chip: $TU = 25$. $MU = 25 - 23 = 2$.
*   6th chip (Satiety Point): $TU = 25$. $MU = 25 - 25 = 0$.
*   7th chip (Overconsumption): $TU = 22$. $MU = 22 - 25 = -3$.

Notice how marginal utility drops from 10 to -3, illustrating the **Law of Diminishing Marginal Utility**.

#### Interactive Utility Simulator
\`\`\`simulator
{
  "mode": "utility",
  "title": "Interactive Consumer Utility Simulator",
  "initialValues": {
    "tu1": 15,
    "tu2": 25,
    "q1": 1,
    "q2": 2
  }
}
\`\`\`
`,

  "ss2-ch7": `
# Chapter 7: Concepts of Demand, Supply, and Price Determination II

## 7.1 Complex Types of Demand and Supply

### 1. Types of Demand
*   **Derived Demand**: Demanded not for its own sake, but for its use in generating another product (e.g., labor, steel for automobile manufacturing, or land).
*   **Joint / Complementary Demand**: Demand for two or more commodities that are used together to satisfy a single want (e.g., cars and fuel, pens and ink). A price increase in one decreases the demand for both.
*   **Competitive Demand**: Demand for commodities that serves as substitutes (e.g., butter and margarine, beef and fish). A rise in the price of one increases the demand for the other.
*   **Composite Demand**: Demand for a commodity that has multiple distinct uses (e.g., timber for construction, furniture, or paper; or milk).

### 2. Types of Supply
*   **Joint Supply**: Two or more products derived from a single production process (e.g., beef and hides, mutton and wool, palm oil and palm kernel).
*   **Competitive Supply**: Supply of a single input that has alternative production uses (e.g., allocating agricultural land to crop farming vs. residential housing).
*   **Composite Supply**: The total aggregate supply of alternative commodities satisfying a single demand (e.g., composite supply of energy: oil, solar, gas, coal).

---

## 7.2 Elasticity of Demand & Supply
**Elasticity** measures the degree of responsiveness of quantity demanded or supplied to changes in price, income, or related variables.

### Price Elasticity of Demand (PED)
$$E_p = \\frac{\\% \\Delta Q_d}{\\% \\Delta P} = \\frac{\\Delta Q}{Q} \\times \\frac{P}{\\Delta P}$$

*   $E_p > 1$ : **Fairly Elastic** (gradual sloping curve; luxury goods).
*   $E_p = 1$ : **Unitary Elastic** (hyperbolic curve; total spending remains constant).
*   $E_p < 1$ : **Fairly Inelastic** (steep curve; necessities/addictions).
*   $E_p = 0$ : **Perfectly Inelastic** (vertical line; necessary medicine/salt).
*   $E_p = \\infty$ : **Perfectly Elastic** (horizontal line; competitive market).

### Price Elasticity of Supply (PES)
$$E_s = \\frac{\\% \\Delta Q_s}{\\% \\Delta P}$$
PES is influenced by:
1.  **Time Lag**: Short run is highly inelastic; long run is elastic.
2.  **Cost of Production**: If expansion rises marginal costs rapidly, supply is inelastic.
3.  **Product Durability**: Perishable items are inelastic; durable stocks are elastic.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 7.1: Elasticity Slopes comparison",
  "xAxis": "quantity",
  "yAxis": "price",
  "data": [
    {"quantity": 5, "elastic": 10, "inelastic": 20},
    {"quantity": 10, "elastic": 8, "inelastic": 12},
    {"quantity": 15, "elastic": 6, "inelastic": 5}
  ],
  "series": [
    {"key": "elastic", "name": "Elastic Demand Curve (Ep > 1)", "color": "#0ea5e9"},
    {"key": "inelastic", "name": "Inelastic Demand Curve (Ep < 1)", "color": "#e11d48"}
  ]
}
\`\`\`

---

## 7.3 Price Control / Price Legislation
The government may intervene in a free market to regulate price extremes through two tools:

### 1. Maximum Price Control (Price Ceiling)
The government fixes the highest legal price below equilibrium to protect low-income consumers in times of scarcity.
*   **Effects**: Excess demand ($Q_d > Q_s$), hoarding, black markets.
*   **Solutions**: Rationing or direct government allocation of basic quotas.

### 2. Minimum Price Control (Price Floor)
The government fixes the lowest legal price above equilibrium to protect farm incomes (crop floors) or workers (minimum wages).
*   **Effects**: Excess supply / surplus, illegal price discounting by desperate sellers.

### Solved Example 1: Calculating Price Elasticity of Demand (PED)
Suppose the price of a loaf of bread in Lagos increases from **₦10 to ₦12**, and the quantity demanded falls from **100 loaves to 80 loaves** daily. Let's compute the Price Elasticity of Demand.

#### Step 1: Compute Percentage Change in Quantity
*   Change in Quantity ($\\Delta Q$) = $80 - 100 = -20$
*   Percentage Change = $\\frac{-20}{100} \\times 100 = -20\\%$

#### Step 2: Compute Percentage Change in Price
*   Change in Price ($\\Delta P$) = $12 - 10 = 2$
*   Percentage Change = $\\frac{2}{10} \\times 100 = 20\\%$

#### Step 3: Calculate PED ($E_p$)
$$E_p = \\frac{\\% \\Delta Q_d}{\\% \\Delta P} = \\frac{-20\\%}{20\\%} = -1.0$$

Taking the absolute value, $|E_p| = 1.0$. This represents a case of **Unitary Elastic** demand, where the change in price results in an exactly proportional change in quantity.

---

### Solved Example 2: Calculating Income Elasticity of Demand (YED)
Suppose a civil servant's monthly income increases from **₦100,000 to ₦150,000**, and their weekly demand for chicken meat increases from **2kg to 4kg**. Let's compute their Income Elasticity of Demand ($E_y$).

#### Step 1: Compute Percentage Change in Quantity Demanded
*   Change in Quantity Demanded ($\\Delta Q_d$) = $4 - 2 = 2\\text{kg}$
*   Percentage Change = $\\frac{2}{2} \\times 100\\% = 100\\%$

#### Step 2: Compute Percentage Change in Income
*   Change in Income ($\\Delta Y$) = $150,000 - 100,000 = 50,000$
*   Percentage Change = $\\frac{50,000}{100,000} \\times 100\\% = 50\\%$

#### Step 3: Calculate YED ($E_y$)
$$E_y = \\frac{\\% \\Delta Q_d}{\\% \\Delta Y} = \\frac{100\\%}{50\\%} = 2.0$$

**Interpretation**: Since $E_y > 1$, demand is highly income-elastic. Because $E_y$ is positive ($E_y > 0$), chicken meat is a **normal/luxury good** for this consumer (demand increases as income increases).

---

### Solved Example 3: Calculating Cross Elasticity of Demand (XED)
Suppose the price of cocoa beverage (Milo) increases from **₦500 to ₦600** per sachet, causing the quantity demanded of tea (a substitute beverage) to increase from **1,000 boxes to 1,500 boxes** daily. Let's compute the Cross Elasticity of Demand ($E_{xy}$).

#### Step 1: Compute Percentage Change in Quantity Demanded of Tea (Good X)
*   Change in Quantity ($\\Delta Q_x$) = $1,500 - 1,000 = 500$
*   Percentage Change = $\\frac{500}{1,000} \\times 100\\% = 50\\%$

#### Step 2: Compute Percentage Change in Price of Cocoa (Good Y)
*   Change in Price ($\\Delta P_y$) = $600 - 500 = 100$
*   Percentage Change = $\\frac{100}{500} \\times 100\\% = 20\\%$

#### Step 3: Calculate Cross Elasticity ($E_{xy}$)
$$E_{xy} = \\frac{\\% \\Delta Q_x}{\\% \\Delta P_y} = \\frac{50\\%}{20\\%} = +2.5$$

**Interpretation**: Since $E_{xy} > 0$ (positive), Cocoa and Tea are **substitute goods** (an increase in the price of one leads to an increase in the demand for the other as consumers switch).

---

### Solved Example 4: Calculating Price Elasticity of Supply (PES)
A farmer in Ondo state supplies cocoa beans. When the price of cocoa beans increases from **₦200,000 to ₦240,000** per ton, their quantity supplied increases from **50 tons to 55 tons**. Let's compute the Price Elasticity of Supply ($E_s$).

#### Step 1: Compute Percentage Change in Quantity Supplied
*   Change in Quantity Supplied ($\\Delta Q_s$) = $55 - 50 = 5\\text{ tons}$
*   Percentage Change = $\\frac{5}{50} \\times 100\\% = 10\\%$

#### Step 2: Compute Percentage Change in Price
*   Change in Price ($\\Delta P$) = $240,000 - 200,000 = 40,000$
*   Percentage Change = $\\frac{40,000}{200,000} \\times 100\\% = 20\\%$

#### Step 3: Calculate PES ($E_s$)
$$E_s = \\frac{\\% \\Delta Q_s}{\\% \\Delta P} = \\frac{10\\%}{20\\%} = 0.5$$

**Interpretation**: Since $E_s < 1$ ($E_s = 0.5$), the supply of cocoa beans is **price-inelastic**. This indicates that a change in price results in a less-than-proportional change in quantity supplied (typical of agricultural goods due to long gestation periods).

#### Interactive Elasticity Simulator
\`\`\`simulator
{
  "mode": "elasticity",
  "title": "Price Elasticity of Demand Calculator",
  "initialValues": {
    "p1": 10,
    "p2": 12,
    "q1": 100,
    "q2": 80
  }
}
\`\`\`
`,

  "ss2-ch8": `
# Chapter 8: Market Structures

## 8.1 Introduction & Concept of Market
To economists, a **market** is not necessarily a geographical location. It is any physical or virtual arrangement where buyers and sellers can communicate to negotiate transactions. Markets are categorized based on their structural characteristics into two main categories: perfect and imperfect markets.

---

## 8.2 Perfect Competition
A market structure characterized by a large number of buyers and sellers, such that no individual agent can influence the market price. All firms are **price takers**.

### Conditions/Assumptions for Perfect Competition:
1.  **Many Buyers and Sellers**: No single agent's size makes up a significant share of the market.
2.  **Homogeneous Product**: All goods produced by different firms are identical and perfect substitutes.
3.  **Free Entry and Exit**: No artificial barriers, patents, or trade secrets exist to block incoming competition.
4.  **Perfect Information**: All buyers/sellers have complete knowledge of prevailing prices and profit margins.
5.  **Factor Mobility**: Resources can move freely to where rewards are highest.

### Price and Quantity Determination under Perfect Competition
Under perfect competition, the individual firm faces a **perfectly elastic demand curve** at the ruling market price established by aggregate market demand and supply:

$$P = AR = MR$$

\`\`\`chart
{
  "type": "line",
  "title": "Figure 8.1: Perfect Competition Short-Run Equilibrium",
  "xAxis": "quantity",
  "yAxis": "price",
  "data": [
    {"quantity": 0, "p_ar_mr": 10, "mc": 15, "ac": 12},
    {"quantity": 5, "p_ar_mr": 10, "mc": 6, "ac": 8},
    {"quantity": 10, "p_ar_mr": 10, "mc": 10, "ac": 7},
    {"quantity": 12, "p_ar_mr": 10, "mc": 14, "ac": 7.5}
  ],
  "series": [
    {"key": "p_ar_mr", "name": "Demand Curve (P = AR = MR)", "color": "#10b981"},
    {"key": "mc", "name": "Marginal Cost (MC)", "color": "#ef4444"},
    {"key": "ac", "name": "Average Cost (AC)", "color": "#6366f1"}
  ]
}
\`\`\`

*   **Short-Run Supernormal (Abnormal) Profits**: Firms maximize profits where $MC = MR$. When $AC < AR$, the firm reaps supernormal profits (area of $(AR - AC) \\times Q$).
*   **Long-Run Normal Profits**: The presence of abnormal profits attracts new firms in the long run. Market supply expands, driving prices down until $P = AR = MR = MC = AC$. All supernormal profits are competed away, leaving only normal profits.

---

## 8.3 Imperfect Competition

### 1. Monopoly
A market structure dominated by **one producer** selling a good with no close substitutes (e.g., Nigerian Railway Corporation). The monopolist is a **price maker** facing a downward-sloping demand curve ($AR > MR$).
*   **Types**: Absolute/Pure, Bilateral (single buyer vs. single seller), Discriminating (charging different prices to different buyers for the same good).
*   **Key Barriers to Entry**: Patent laws, natural resource dominance, state creation.

### 2. Oligopoly
A market structure dominated by a **few highly interdependent firms** (e.g., domestic cement or aviation in Nigeria). Oligopolistic firms compete primarily through product differentiation and branding.
*   **Kinked Demand Curve**: A firm expects rivals to match price cuts but ignore price hikes. This causes the demand curve to be highly elastic above the current price ($P_k$) and inelastic below it, leading to rigid prices.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 8.2: Oligopoly Kinked Demand Curve",
  "xAxis": "quantity",
  "yAxis": "price",
  "data": [
    {"quantity": 0, "price": 15},
    {"quantity": 5, "price": 12},
    {"quantity": 10, "price": 10},
    {"quantity": 11, "price": 5},
    {"quantity": 12, "price": 2}
  ],
  "series": [
    {"key": "price", "name": "Kinked Demand Curve (Kink at Q=10, P=10)", "color": "#8b5cf6"}
  ]
}
\`\`\`

### 3. Monopolistic Competition
Many firms selling **differentiated products** that are close substitutes (e.g., soap brands, textiles). Firms enjoy temporary monopoly power due to branding but are restricted to normal profits in the long run ($AR = AC$) due to accessible entry.
`,

  "ss2-ch9": `
# Chapter 9: Industry and Industrialisation in Nigeria

## 9.1 Concept Definitions
In discussing production and secondary sectors, we define specific categories:
1.  **Plant**: An assembly of machinery, apparatus, and equipment placed in a location to execute industrial processing.
2.  **Factory**: The actual building housing the productive plant and labor resources.
3.  **Firm**: An independent business or productive unit under a distinct management (e.g., Zenith Bank is a firm, whereas banking is the industry).
4.  **Industry**: A conglomerate of firms producing identical or highly similar goods or services (e.g., cement industry, sugar industry).
5.  **Industrial Estate**: A specific geographical zone designated exclusively for industrial activities with modern infrastructure (electricity, roads, warehouses, waste handling).

---

## 9.2 What is Industrialisation?
**Industrialisation** is the systematic process by which an economy transitions from a primarily agrarian society based on manual labor to an industrial society based on mechanised, large-scale manufacturing and service provision. It involves the extensive application of technology and capital equipment to boost labor productivity and expand output.

### Classification of Industries
Industries can be broadly classified based on their primary activities:
1.  **Primary (Extractive) Industries**: Involved in extracting raw natural resources directly from the earth or water. Examples: mining, quarrying, crude oil extraction, forestry, and fishing.
2.  **Secondary (Manufacturing & Construction) Industries**: Transform raw materials into finished or semi-finished goods. Examples: cement manufacturing, textile weaving, car assembly, and building construction.
3.  **Tertiary (Service) Industries**: Do not produce physical goods but render essential services to facilitate trade and production. Examples: banking, tourism, transport, and warehousing.

---

## 9.3 Siting (Location) of Industries
**Location of Industry** refers to where an industry is established. Rational entrepreneurs consider these major location factors:

1.  **Availability of Raw Materials**: Industries involving heavy and bulky raw inputs (which lose significant weight in processing) are always located near the source to reduce transport costs (e.g., Nkalagu Cement Company situated near limestone deposits in Enugu State).
2.  **Proximity to Markets**: Industries producing perishable or fragile items are situated near markets (e.g., bakeries, brewery bottling, and plastic mat factories near urban centers).
3.  **Availability of Labour**: Industries need pools of skilled and unskilled workers.
4.  **Nearness to Power Supply**: Siting factories close to stable national grid hubs.
5.  **Government Policy**: Siting factories in specific backward areas through tax concessions (tax holidays) to disperse industrial clusters.

---

## 9.4 Localisation of Industry
**Localisation** is the concentration of many related industrial firms in a single geographical location (e.g., Broad Street, Lagos for finance; or Kaduna for textiles).

### Advantages of Localisation (External Economies):
1.  **Growth of Subsidiary Firms**: Attracts specialized firms providing support (e.g., boat repairs and net-making near fishing clusters).
2.  **Common Pool of Skilled Labour**: Creates a specialized labor market from which firms can recruit instantly.
3.  **Organized Markets**: Attracts wholesale buyers, decreasing advertising costs of individual firms.
4.  **Social Amenities**: Encourages the government to provide infrastructure (feeder roads, railways, hospitals) due to high population density.

### Disadvantages of Localisation (External Diseconomies):
1.  **Target in War / Enemy Attack**: Exposes the country to industrial paralysis if the cluster is bombed.
2.  **Frictional Unemployment**: Extreme specialization makes labor structurally immobile if that specific industry encounters decline.
3.  **Overcrowding**: Raises city rents, causing congestion, poor sanitation, and slums.
4.  **Environmental Pollution**: Concentrates heavy smoke and biological effluents.

---

## 9.5 Industrialisation Strategies
Developing countries like Nigeria adopt different strategic paths to achieve industrialization:

### 1. Import Substitution Industrialisation (ISI)
An inward-looking strategy aiming to replace foreign imports with domestically produced manufactured goods. It uses protectionist policies (tariffs, quotas) to shield domestic infant industries.
*   **Aims**: Conserve scarce foreign exchange reserves, achieve self-reliance, and create local jobs.
*   **Examples in Nigeria**: Setting up local breweries, assembly plants, and textile mills to replace imported items.
*   **Formulas of Protectionism**: The **Effective Rate of Protection ($g$)** measures the percentage increase in value-added made possible by the tariff structure:
    $$g = \frac{t_f - a \cdot t_m}{1 - a}$$
    Where $t_f$ is the tariff rate on finished imports, $t_m$ is the tariff on imported raw inputs, and $a$ is the ratio of imported input value to finished product value.

### 2. Export Promotion Industrialisation (EPI)
An outward-looking strategy focused on producing manufactured goods specifically for export to global markets.
*   **Aims**: Leverage international markets to achieve economies of scale, earn foreign exchange, and integrate with the global supply chain.
*   **Examples**: East Asian Tigers (South Korea, Taiwan) focused heavily on EPI (electronics, ships, automobiles).

### Comparative Summary: ISI vs. EPI
| Feature | Import Substitution (ISI) | Export Promotion (EPI) |
| :--- | :--- | :--- |
| **Market Focus** | Inward-looking (Domestic consumers) | Outward-looking (Global consumers) |
| **Trade Policy** | High protectionism (tariffs, quotas) | Free-market or subsidized exports |
| **Exchange Rate** | Often overvalued (cheap imported machinery) | Competitive or undervalued (cheap exports) |
| **Core Advantage** | Easy to start; conserves forex initially | High efficiency, scale economies, global standards |
| **Core Limitation** | Inefficient monopolies; lack of competition | Susceptible to global recessions & protectionism |

---

## 9.6 Nigeria's Manufacturing Landscape
To understand the structural significance of industrialization, we look at the share of manufacturing in Nigeria's nominal GDP. Despite policy efforts, manufacturing's contribution has hovered under 10% due to power deficits and high exchange rate volatility.

\`\`\`chart
{
  "type": "bar",
  "title": "Figure 9.1: Estimated Manufacturing Sector Share of Nigeria's GDP (Percentage)",
  "xAxis": "year",
  "data": [
    {"year": "1960", "share": 4.8},
    {"year": "1970", "share": 7.2},
    {"year": "1980", "share": 8.4},
    {"year": "1990", "share": 8.1},
    {"year": "2000", "share": 6.2},
    {"year": "2010", "share": 6.8},
    {"year": "2020", "share": 8.9},
    {"year": "2024", "share": 8.5}
  ],
  "series": [
    {"key": "share", "name": "Manufacturing % of GDP", "color": "#0ea5e9"}
  ]
}
\`\`\`

### Example Calculation: Rate of Industrial Growth
Suppose Nigeria's industrial output was valued at **₦4.2 trillion** in 2022 and grew to **₦4.5 trillion** in 2023. Let's calculate the annual industrial growth rate ($G_{ind}$):
$$G_{ind} = \frac{\text{Output}_{2023} - \text{Output}_{2022}}{\text{Output}_{2022}} \times 100$$
$$G_{ind} = \frac{4.5 - 4.2}{4.2} \times 100 = \frac{0.3}{4.2} \times 100 = 7.14\%$$
This represents a healthy rate of industrial expansion for that period.
`,

  "ss2-ch10": `
# Chapter 10: Agriculture

## 10.1 Components of Agriculture
Agriculture refers to the cultivation of soil for crop production, livestock breeding, forestry, and fishing.
1.  **Crop Production**: Subdivided into **subsistence** (small-scale, peasant, for self-feeding) and **commercial** (large-scale, mechanised, tree crops like cocoa, oil palm, rubber).
2.  **Livestock Production**: Breeding of animals (poultry, swine, sheep, goats, cattle). Skewed to Northern Nigeria due to the absence of tsetse flies, which transmit trypanosomiasis (sleeping sickness) in Southern forest zones.
3.  **Forestry**: Development and wood extraction from forest reserves.
4.  **Fishing**: Estuary, coastal, riverine, and aquaculture farms.

---

## 10.2 Systems of Agriculture
Agricultural practices vary according to land tenure, level of capital, and target markets:
*   **Subsistence Farming**: Smallholder peasants cultivating tiny, fragmented plots using crude implements (hoes and cutlasses). Labor is primarily family-based, and output is almost entirely consumed locally with little or no surplus.
*   **Plantation Farming**: Large-scale monoculture dedicated to growing single cash crops (e.g., cocoa, rubber, oil palm, coffee) for commercial exports. It is highly capital-intensive, requiring specialized managers and wage laborers.
*   **Cooperative Farming**: A system where small farmers pool their land, labor, and capital resources to enjoy economies of scale in purchasing inputs (fertilizers, tractors) and marketing their crops collectively.
*   **Settlement Schemes**: Government-sponsored agricultural communities established to settle young farmers, providing them with modern housing, extension training, credit, and farm machinery to boost food production.

---

## 10.3 Agricultural Challenges in West Africa
West African agricultural output faces core systemic blockages:
1.  **Land Tenure / Fragmentation**: Customary inheritance laws subdivide family land into small, scattered, uneconomic segments, discouraging mechanised tractor farming.
2.  **Traditional Tools**: Dominated by energy-sapping cutlasses and hoes.
3.  **Erratic Climate**: Extreme desertification droughts in Sahel zones (e.g., Bornu, Sokoto) kill crops and livestock. Crucial irrigation models remain scarce.
4.  **Pests and Diseases**: Termite, locust, and tsetse fly infestations.
5.  **Lack of Credit Facilities**: Farmers lack acceptable land deeds to serve as bank collateral.
6.  **Inadequate Transportation**: Dearth of rural feeder roads, making evacuation to cities expensive and causing post-harvest waste.

---

## 10.4 Agricultural Policies & Marketing Boards

### Historical & Contemporary Policies in Nigeria
To resolve these structural bottlenecks, various Nigerian administrations launched specific campaigns:
1.  **Operation Feed the Nation (OFN, 1976)**: Launched under Gen. Olusegun Obasanjo to raise public consciousness on agricultural self-sufficiency by distributing subsidized inputs to urban and rural backyard farmers.
2.  **The Green Revolution (1980)**: Initiated under President Shehu Shagari, focusing on massive credit injection, establishing river basin authorities, and importing tractors to achieve mechanised food security.
3.  **Directorate of Food, Roads and Rural Infrastructure (DFRRI, 1986)**: Formed under Gen. Ibrahim Babangida to open up rural agricultural hinterlands by constructing feeder roads, boreholes, and rustic electricity grids.
4.  **Agricultural Credit Guarantee Scheme Fund (ACGSF)**: Managed by the CBN to guarantee up to 75% of bank loans extended to local farmers, shielding commercial banks from default risks.
5.  **Anchor Borrowers' Programme (ABP, 2015)**: Initiated by the CBN to connect smallholder farmers of key crops (rice, maize, cassava) with large-scale processors (anchors), providing loans in kind (inputs) and securing guaranteed buyback off-takers.

### Commodity Marketing Boards
Statutory organizations created by the government to stabilize agricultural export earnings (cocoa, groundnuts, cotton) and streamline evacuation. They accumulate surplus funds during price booms by buying from farmers at a fixed guaranteed price, and then using these accumulated reserves to stabilize farmers' incomes during global price crashes.

---

## 10.5 Economic Significance of Agriculture
To understand the macroeconomic role of agriculture in Nigeria, we analyze its share of nominal GDP. While its share declined dramatically from over 60% in 1960 due to the crude oil boom, agriculture remains the single largest employer of labor and contributes a stable 20-25% of modern GDP.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 10.1: Agriculture Sector Share of Nigeria's Nominal GDP (1960 - 2024)",
  "xAxis": "year",
  "yAxis": "percentage",
  "data": [
    {"year": "1960", "percentage": 64.0},
    {"year": "1970", "percentage": 48.8},
    {"year": "1980", "percentage": 20.6},
    {"year": "1990", "percentage": 32.5},
    {"year": "2000", "percentage": 26.1},
    {"year": "2010", "percentage": 23.9},
    {"year": "2020", "percentage": 24.1},
    {"year": "2024", "percentage": 22.8}
  ],
  "series": [
    {"key": "percentage", "name": "Agriculture % of GDP", "color": "#10b981"}
  ]
}
\`\`\`

### Example Calculation: Crop Productivity Index
A cooperative farmer cultivating cassava harvested **15 tonnes per hectare** in Year 1 using traditional inputs. After joining the Anchor Borrowers' Programme and adopting high-yielding stems and fertilizer, the yield rose to **22 tonnes per hectare** in Year 2.

Let's calculate the percentage increase in cassava land productivity ($P_{land}$):
$$P_{land} = \frac{\text{Yield}_{\text{Year 2}} - \text{Yield}_{\text{Year 1}}}{\text{Yield}_{\text{Year 1}}} \times 100$$
$$P_{land} = \frac{22 - 15}{15} \times 100 = \frac{7}{15} \times 100 = 46.67\%$$
Thus, adopting improved inputs raised agricultural land productivity by **46.67%**!
`,

  "ss2-ch11": `
# Chapter 11: Public Finance and Fiscal Policy

## 11.1 Concept of Public Finance & Fiscal Policy
*   **Public Finance**: The study of government revenue collection, expenditures, borrowing, and debt management.
*   **Fiscal Policy**: The selective use of government taxation and public expenditure measures to influence aggregate demand, control inflation, and redistribute wealth.

---

## 11.2 Concepts of Taxation
A **tax** is a compulsory financial contribution levied on individuals, firms, and properties by the state.

### 1. Direct Taxes
Taxes levied directly on the income, wealth, or profit of individuals and corporations. The tax burden cannot be shifted to another person.
*   **Examples**:
    *   **Personal Income Tax (PAYE)**: Deducted directly from salaries of workers.
    *   **Company Income Tax (CIT)**: Levied on the net profits of registered corporations.
    *   **Capital Gains Tax (CGT)**: Levied on the profit made from selling capital assets like shares or real estate.

### 2. Indirect Taxes
Taxes levied on goods and services. The tax burden can be shifted partially or fully to the final consumer in the form of higher prices.
*   **Examples**:
    *   **Value Added Tax (VAT)**: Multi-stage sales tax levied on the value added at each stage of production and distribution.
    *   **Customs Duties (Tariffs)**: Levied on goods imported (Import Duty) or exported (Export Duty).
    *   **Excise Duties**: Levied on locally manufactured goods (especially luxury or harmful items like cigarettes and alcohol) to discourage consumption.

### Systems of Taxation
1.  **Progressive Tax**: The tax rate increases as the tax base (income) rises. It acts as an equitable wealth distribution tool.
2.  **Proportional Tax**: The tax rate remains constant across all income levels (e.g., flat 10%).
3.  **Regressive Tax**: The tax rate decreases as income increases. It places a severe burden on low-income groups. (e.g., flat Poll tax, value-added sales taxes on basic foodstuffs).

\`\`\`chart
{
  "type": "line",
  "title": "Figure 11.1: Tax Systems Comparison",
  "xAxis": "income",
  "yAxis": "rate",
  "data": [
    {"income": 1000, "progressive": 5, "proportional": 10, "regressive": 25},
    {"income": 5000, "progressive": 15, "proportional": 10, "regressive": 15},
    {"income": 10000, "progressive": 35, "proportional": 10, "regressive": 7.5}
  ],
  "series": [
    {"key": "progressive", "name": "Progressive Tax", "color": "#10b981"},
    {"key": "proportional", "name": "Proportional Tax", "color": "#f59e0b"},
    {"key": "regressive", "name": "Regressive Tax", "color": "#ef4444"}
  ]
}
\`\`\`

### Canons of Taxation (Adam Smith)
*   **Equity**: Obligated contribution based on the individual's ability to pay.
*   **Certainty**: Prevents arbitrary assessments; rates and locations of collection must be known.
*   **Convenience**: Collected at a time and manner most convenient to consumers (e.g., PAYE pay deduction).
*   **Economy**: The collection cost must be minor relative to the total tax revenue.

---

## 11.3 Incidence and Sharing of Indirect Taxes
**Incidence of Taxation** refers to the final resting point of the tax burden—who actually pays the tax in the end. When the government levies an indirect tax $t$ on a product, the burden is split between the buyer and the seller depending on the **price elasticity of demand ($E_d$)** and **price elasticity of supply ($E_s$)**:

1.  **Perfectly Inelastic Demand ($E_d = 0$)**: The entire tax is shifted to the buyer; price rises by the full tax amount.
2.  **Perfectly Elastic Demand ($E_d = \infty$)**: The seller bears the entire tax burden; price does not change.
3.  **Perfectly Inelastic Supply ($E_s = 0$)**: The seller bears the entire tax burden.
4.  **Perfectly Elastic Supply ($E_s = \infty$)**: The buyer bears the entire tax burden.

### Mathematical Incidence Formulas
The share of a unit tax $t$ borne by the buyer ($T_{buyer}$) and the seller ($T_{seller}$) can be calculated as:
$$T_{buyer} = t \times \frac{E_s}{E_d + E_s}$$
$$T_{seller} = t \times \frac{E_d}{E_d + E_s}$$

### Solved Example: Tax Incidence Calculation
Suppose the government levies an indirect tax of **₦50** per bag on cement. The price elasticity of demand for cement is **$0.4$** (inelastic) and the price elasticity of supply is **$1.6$** (elastic). Let's calculate how the tax burden is shared:

*   **Step 1: Calculate the Buyer's Share ($T_{buyer}$)**
    $$T_{buyer} = ₦50 \times \frac{1.6}{0.4 + 1.6} = ₦50 \times \frac{1.6}{2.0} = ₦50 \times 0.8 = ₦40$$
*   **Step 2: Calculate the Seller's Share ($T_{seller}$)**
    $$T_{seller} = ₦50 \times \frac{0.4}{0.4 + 1.6} = ₦50 \times \frac{0.4}{2.0} = ₦50 \times 0.2 = ₦10$$

Therefore, the **buyer bears ₦40** (in the form of a ₦40 price increase), while the **seller bears ₦10** (in the form of lower net margins). This shows that because demand is more inelastic than supply, the buyer bears the greater share of the tax!

---

## 11.4 The Laffer Curve Concept
Arthur Laffer proposed that as tax rates rise from 0%, tax revenue increases up to an optimum tax rate ($t^*$). However, raising tax rates beyond $t^*$ discourages productivity, encourages tax evasion, and ultimately **reduces** total tax revenue. At a 100% tax rate, revenue would fall to zero because there would be no incentive to work.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 11.2: The Laffer Curve (Tax Rate % vs. Estimated Revenue ₦ Billion)",
  "xAxis": "rate",
  "yAxis": "revenue",
  "data": [
    {"rate": "0%", "revenue": 0},
    {"rate": "15%", "revenue": 120},
    {"rate": "30%", "revenue": 220},
    {"rate": "45%", "revenue": 280},
    {"rate": "50% (Optimum)", "revenue": 300},
    {"rate": "65%", "revenue": 250},
    {"rate": "80%", "revenue": 140},
    {"rate": "100%", "revenue": 0}
  ],
  "series": [
    {"key": "revenue", "name": "Tax Revenue", "color": "#6366f1"}
  ]
}
\`\`\`

---

## 11.5 Government Budgets & Public Expenditure
A **budget** is estimated projected revenues and expenditures of a government over a fiscal year.
*   **Balanced Budget**: Expected revenues = Expected expenditures (neutral effect).
*   **Deficit Budget**: Expenditures exceed revenues (expansionary, used to reflate depressed economies, but risks inflation).
*   **Surplus Budget**: Revenues exceed expenditures (contractionary, used to mop up excess demand inflation).

### Solved Example: The Fiscal Spending Multiplier
The government of Nigeria decides to spend **₦500 billion** on road construction. If the citizens have a Marginal Propensity to Consume (MPC) of **0.75**, let's calculate the total increase in national income.

#### Step 1: Calculate the Keynesian Multiplier ($k$)
$$Multiplier \ k = \frac{1}{1 - MPC} = \frac{1}{1 - 0.75} = \frac{1}{0.25} = 4.0$$

#### Step 2: Calculate the Total Increase in Income ($\Delta Y$)
$$\Delta Y = k \times \Delta G = 4.0 \times ₦500\text{ billion} = ₦2,000\text{ billion}$$

Therefore, injecting ₦500 billion of government spending re-circulates to generate **₦2 trillion** in total national income!

#### Interactive Fiscal Policy Simulator
\`\`\`simulator
{
  "mode": "fiscal_policy",
  "title": "Interactive Keynesian Fiscal Multiplier Board",
  "initialValues": {
    "g": 500,
    "t": 400,
    "c0": 200,
    "i": 300,
    "mpc": 0.75
  }
}
\`\`\`
`,

  "ss2-ch12": `
# Chapter 12: Elements of National Income Accounting

## 12.1 Concept of National Income
**National Income** is the total money value of all goods and services produced in a country over a fiscal year, usually after adjusting for depreciation.

## 12.2 Major National Income Aggregates

### 1. Gross Domestic Product (GDP)
The total market value of final products produced within national borders.
$$GDP_{\\text{at factor cost}} = GDP_{\\text{at market prices}} - \\text{Indirect Taxes} + \\text{Subsidies}$$

### 2. Gross National Product (GNP)
National income based on ownership of assets. It adds net property income from abroad ($X - M$) to GDP:
$$GNP = GDP + (\\text{Exports} - \\text{Imports})$$

### 3. Net National Product (NNP)
The productive value after replacing worn-out capital stocks:
$$NNP = GNP - \\text{Depreciation}$$

### 4. Per Capita Income (PCI)
The average income share of each individual in the country:
$$PCI = \\frac{GNP}{\\text{Total Population}}$$

---

## 12.3 Measurement Approaches of National Income

### 1. Output/Product Method
The sum of values added at each stage of production. Using **value added** (Sales Value - Purchase Price) avoids **double counting**, which would falsely inflate national income calculations.

#### Table 12.1: Double Counting Avoidance (Loaf of Bread production)
| Production stage | Purchase value (₦) | Sales value (₦) | Value added (₦) |
| :--- | :---: | :---: | :---: |
| Farmer | – | 1.00 | 1.00 (grain value) |
| Flour mill | 1.00 | 1.50 | 0.50 (milling processing) |
| Baker | 1.50 | 2.50 | 1.00 (baking processing) |
| Bread seller | 2.50 | 4.00 | 1.50 (retailing cost) |
| **Sum total** | **5.00** | **9.00** | **4.00 (Actual GDP contribution)** |

We use only the sum of values added (₦4.00) or the final market price of the bread (₦4.00) to measure GDP. Recording the raw sum of sales (₦9.00) represents a case of double counting.

### 2. Income Method
The sum of all income earned by the owners of factors of production (Wages, Salaries, Rents, Profits, and Interest) over a year, minus transfer payments.

### 3. Expenditure Method
The sum of all spending on final products over a year:
$$Y = C + I + G + (X - M) + \\Delta \\text{stocks}$$

Where:
*   $C$ = Private Consumption
*   $I$ = Gross private investment (capital formation)
*   $G$ = Government expenditure on goods
*   $X - M$ = Net exports (Exports - Imports)

---

## 12.4 Uses and Limitations of National Income Estimates
*   **Uses**: Indicates domestic economic performance; compares national standards of living; provides data for fiscal planning.
*   **Limitations**:
    *   Fails to capture income inequality.
    *   Excludes non-marketed and domestic household production (e.g., a mother nursing her infant).
    *   Ignores qualitative conditions (environmental pollution, work hazards, aggregate defense warfare assets).

#### Interactive GDP Calculator
\`\`\`simulator
{
  "mode": "nigerian_economy",
  "title": "National Income (GDP) Expenditure Simulator",
  "initialValues": {
    "num1": 1500,
    "num2": 1600,
    "num3": 40,
    "num4": 20,
    "num5": 10
  }
}
\`\`\`
`,

  "ss2-ch13": `
# Chapter 13: Financial Institutions and Regulatory Agencies

## 13.1 Banking Financial Institutions

### 1. Commercial Banks
Joint-stock business corporations aiming to achieve profits by accepting deposits and advancing short-term loans.
*   **Forms of Bank Accounts**: Savings, Current, Fixed deposit, Special accounts.

### 2. Credit Creation by Commercial Banks
Commercial banks create money through the iterative process of lending and re-depositing. When ₦100 is deposited, if the bank maintains a **Cash Reserve Ratio ($r$)** of 20%, it keeps ₦20 in cash and lends ₦80. When ₦80 is re-deposited in Bank B, it keeps ₦16 and lends ₦64. This sequence continues. The multiplier determines total credit creation:

$$\\text{Money Multiplier } M = \\frac{1}{\\text{Cash Reserve Ratio}} = \\frac{1}{r}$$

$$\\text{Total Credit Created} = \\text{Initial Deposit} \\times \\frac{1}{r}$$

For an initial deposit of ₦5,000 at a 20% Cash Reserve Ratio ($r = 0.20$):
$$\\text{Total Credit Created} = ₦5,000 \\times \\frac{1}{0.20} = ₦25,000$$

### 3. The Central Bank of Nigeria (CBN)
The apex regulatory financial institution established in 1958. It controls monetary aggregates and currency issuance using:
*   **Open Market Operations (OMO)**: Sells or buys treasury bills to mop up or expand money supply.
*   **Discount (Bank) Rate**: Raising interest rates to curb lending of commercial banks.
*   **Selective Directives**: Directing credit streams to critical domains (e.g., Nigerian agriculture).
*   **Moral Suasion**: Appeals to commercial banks to restrain lending.

---

## 13.2 Non-Banking Financial Institutions
*   **Insurance Companies**: Spreads risk by pooling premiums paid by clients to cover indemnities.
*   **Hire-Purchase Companies**: Allows buyers to use durable goods immediately by paying deposits and installment, preserving ownership until full payment.

---

## 13.3 Money and Capital Markets
*   **Money Market**: Market dealing in short-term loan instruments (less than 3 years) (e.g., Treasury bills, bills of exchange).
*   **Capital Market**: Market dealing in long-term capital and development investment securities (e.g., shares, debentures, corporate loans).

### Siting Listing Requirements on the Nigerian Stock Exchange (NSE)
To be listed on the trading floor, companies must satisfy strict standards:
*   **First-Tier Market**: Must be a public company, have 5 years of audit records, minimum of 300 shareholders, and at least 25% of issued capital must go to the public.
*   **Second-Tier Securities Market (SSM)**: Created to assist mid-sized local firms. Requires only 3 years of records, at least 10% of capital must go to the public, and has a minimum of 100 shareholders.

### Solved Example: Credit Multiplier Action
Let's see how commercial banks expand a deposit of **₦1,000,000** with a **20%** Cash Reserve Ratio ($rr = 0.20$):
*   **Step 1**: Multiplier ($M$) = $\\frac{1}{0.20} = 5.0$
*   **Step 2**: Total Credit Created = $₦1,000,000 \\times 5.0 = ₦5,000,000$
*   The banking system has generated **₦4,000,000** of new credit/money in circulation beyond the original deposit!

#### Interactive Credit Multiplier Simulator
\`\`\`simulator
{
  "mode": "money_multiplier",
  "title": "Iterative Credit Creation & Money Multiplier Tracker",
  "initialValues": {
    "mb": 1000000,
    "rr": 20,
    "c": 10,
    "e": 5
  }
}
\`\`\`
`,

  "ss2-ch14": `
# Chapter 14: Money: Demand for and Supply of Money

## 14.1 Keynesian Liquidity Preference Theory
John Maynard Keynes described the **demand for money** as the desire of individuals to hold their wealth in cash (liquidity) instead of interest-yielding assets. He identified three motives:

1.  **Transactions Motive**: Holding cash to execute daily purchases arising from the time gap between income receipt and payment delivery.
2.  **Precautionary Motive**: Holding cash as an emergency buffer for unexpected problems (e.g., sudden family illness, accidents).
3.  **Speculative Motive**: Holding cash to take advantage of changes in asset/bond prices. It is deeply dependent on interest rates ($r$). If interest rates are expected to fall, bond prices will rise, causing people to hold less cash and buy bonds.

$$\\text{Speculative Demand for Money } M_{sp} = f(r) \\quad \\text{(inverse relationship with interest rate)}$$

\`\`\`chart
{
  "type": "line",
  "title": "Figure 14.1: Liquidity Preference",
  "xAxis": "demand_for_liquidity",
  "yAxis": "interest_rate",
  "data": [
    {"demand_for_liquidity": 10, "interest_rate": 15},
    {"demand_for_liquidity": 25, "interest_rate": 10},
    {"demand_for_liquidity": 48, "interest_rate": 5},
    {"demand_for_liquidity": 80, "interest_rate": 2}
  ],
  "series": [
    {"key": "interest_rate", "name": "Speculative Money Demand Curve", "color": "#f43f5e"}
  ]
}
\`\`\`

---

## 14.2 Concept of Value of Money
Money is not demanded for its own sake, but for the goods and services it can buy. The **value of money** is its purchasing power. It is inversely related to the general price level ($P$):

$$\\text{Value of Money} = \\frac{1}{P}$$

*   As the price level **rises** (inflation), the value of money **falls**.
*   As the price level **falls** (deflation), the value of money **rises**.

---

## 14.3 Measuring Price Changes via Index Numbers
The price level is tracked using index numbers (e.g. Retail Price Index).

### Weighted Price Index Calculation Example
A consumer spends money on Rice and Beans.
*   Base year (1980): Rice = ₦5, Beans = ₦8.
*   Current year (1987): Rice = ₦8, Beans = ₦12.
*   Consumer spends twice as much on Rice as Beans $\implies$ Weight ($W$) of Rice = 2, Weight of Beans = 1.

#### Step 1: Calculate Price Index ($P_{idx} = \\frac{Current}{Base} \\times 100$)
*   Rice: $\\frac{8}{5} \\times 100 = 160$
*   Beans: $\\frac{12}{8} \\times 100 = 150$

#### Step 2: Apply weights using Weighted Price Index formula
$$\\text{Weighted Index} = \\frac{\\sum P_{idx} \\times W}{\\sum W}$$
$$\\text{Weighted Index} = \\frac{(160 \\times 2) + (150 \\times 1)}{2 + 1} = \\frac{470}{3} = 156.67\\%$$

This implies the cost of living raised by **56.67%** between 1980 and 1987.

#### Interactive Inflation Index Calculator
\`\`\`simulator
{
  "mode": "inflation",
  "title": "Weighted Retail Price Index (Cost of Living) Calculator",
  "initialValues": {
    "p1": 100,
    "p2": 156.67
  }
}
\`\`\`
`,

  "ss2-ch15": `
# Chapter 15: Money: Inflation and Deflation

## 15.1 Inflation
**Inflation** is a persistent and continuous rise in the general price level of commodities, leading to a falling value of money.

### Main Types of Inflation:
1.  **Creeping (Chronic) Inflation**: A slow, gradual increase in price levels, typically around 5% per annum. Often considered healthy for economic growth of developed and developing nations.
2.  **Hyperinflation (Galloping)**: Extremely rapid, explosive, uncontrolled inflation. It destroys confidence in money, making the currency valueless (e.g., Weimar Germany in 1923).
3.  **Suppressed Inflation**: When prices are structurally held down using official price ceilings and direct price controls.

### Theories of Inflation Causes
*   **Demand-Pull Inflation**: Occurs when aggregate demand exceeds aggregate supply of goods at full employment ("too much money chasing too few goods").
*   **Cost-Push Inflation**: Occurs when firms raise prices to offset rising input costs (e.g., wage increases, raw material cost surges).
*   **Import-Cost-Push Inflation**: Rising prices due to imports of expensive raw inputs from source countries.

---

## 15.2 Inflationary Terminology
1.  **Inflationary Gap**: The difference between aggregate demand and full-employment output.
2.  **Inflationary Spiral**: Wage-price spiral where high prices force higher wage demands, raising production costs and causing further price increases.
3.  **Stagflation**: Concurrent existence of high inflation, slow industrial production, and rising unemployment.
4.  **Slumpflation**: High inflation paired with deep recession and declining output.
5.  **Disinflation**: Selective measures to reduce inflationary pressures without tipping into recessions.

---

## 15.3 Control of Inflation
*   **Restrictive Monetary Policy**: CBN raises commercial bank discount rates, sells treasury bills (OMO), and raises cash reserve ratios to decrease bank lending power.
*   **Tight Fiscal Policy**: Raising tax rates and implementing surplus budgets (reducing government spending).
*   **Price Ceilings & Wage Freezes**: Legally capping price and wage rises.

---

## 15.4 Deflation
**Deflation** is a persistent and continuous fall in the general price level, leading to an increase in the value of money.
*   **Causes**: Surplus budgets, severe contraction in bank lending and money supply, aggregate overproduction over demand.
*   **Effects**: Business profit falls, rising unemployment, gains for lenders/creditors.
*   **Controls**: Deficit budgeting, direct reduction in bank lending rates, tax relief cuts.

#### Interactive Inflation Strategy Policy Simulator
\`\`\`simulator
{
  "mode": "taylor_rule",
  "title": "Interactive Policy Deflation Strategy Board",
  "initialValues": {
    "r_star": 3,
    "target_inf": 2,
    "current_inf": 12,
    "output_gap": -4,
    "alpha": 0.5,
    "beta": 0.5
  }
}
\`\`\`
`
};
