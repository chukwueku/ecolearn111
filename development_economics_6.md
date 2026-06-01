

## Chapter 6

# CHAPTER 6: ECONOMIC INEQUALITY

---

## 1. Introduction: Concepts and Distinctions

Economic inequality refers to the disparity in the distribution of economic assets (wealth) or income among individuals, groups, populations, or countries. In development economics, understanding inequality is central to evaluating the welfare outcomes of economic growth.

### 1.1. Inequality vs. Poverty
It is vital to distinguish between **inequality** and **poverty**:
*   **Poverty** is an *absolute* concept. It concerns the level of living of the poorest segment of society and is measured by evaluating whether individuals fall below a minimum acceptable benchmark (the poverty line).
*   **Inequality** is a *relative* concept. It looks at the entire distribution of income or wealth across all segments of a society. It does not focus on an absolute minimum, but rather on the comparative shares of income or wealth held by different percentiles of the population.

### 1.2. Intrinsic vs. Instrumental Value of Inequality
Economists analyze inequality from two distinct philosophical standpoints:
1.  **Intrinsic Perspective:** This view holds that equality is a desirable moral and social goal in its own right. High levels of inequality are viewed as inherently unjust or ethically problematic, drawing on philosophical frameworks such as Rawlsian justice (which prioritizes the welfare of the least-off individual).
2.  **Instrumental (Functional) Perspective:** This view assesses inequality based on its impact on other economic variables of interest. High inequality may be functionally important because it influences:
    *   **Savings and Capital Accumulation:** Since the rich have a higher marginal propensity to save, highly unequal societies might generate more aggregate savings, potentially driving faster capital accumulation.
    *   **Incentives and Productivity:** Differentials in income can serve as economic incentives that encourage effort, risk-taking, investment, and innovation.
    *   **Human Capital:** If credit markets are imperfect, poor households cannot borrow to finance education. Thus, high inequality can restrict human capital accumulation, dragging down long-run growth.
    *   **Political Economy and Stability:** Extreme inequality can lead to social unrest, political instability, rent-seeking behavior, and lobbying by elites, which can disrupt economic progress.

---

## 2. The Formal Environment

To mathematically define inequality and its measures, we specify the formal economic environment.

Let the population size be represented by a positive integer $n \ge 1$. An **income distribution vector** $y$ is defined as:

$$y = (y_1, y_2, \dots, y_n)$$

where $y_i \ge 0$ represents the income of individual $i$ for $i = 1, 2, \dots, n$.

The **mean income** of the population, denoted by $\mu$, is given by:

$$\mu = \frac{1}{n} \sum_{i=1}^n y_i$$

An **inequality index** is a function $I(y)$ that maps any income vector $y$ to a non-negative real number:

$$I: \mathbb{R}^n_+ \to \mathbb{R}_+$$

This index provides a quantitative measure of the inequality present in the distribution $y$.

---

## 3. The Four Criteria for Inequality Measurement

To evaluate whether an inequality index $I(y)$ is ethically and mathematically sound, economists subject it to four fundamental postulates (axioms). 

### 3.1. The Anonymity Principle (Symmetry Axiom)
The identity of the income earners must not affect the measurement of inequality. Only the values of the incomes matter, not who earns them.

#### Mathematical Formulation
Let $y' = (y'_1, y'_2, \dots, y'_n)$ be an income distribution obtained by permuting the coordinates of the income vector $y = (y_1, y_2, \dots, y_n)$. That is, $y' = P y$, where $P$ is an $n \times n$ permutation matrix. Then:

$$I(y') = I(y)$$

#### Economic Intuition
If person A earns $\$10,000$ and person B earns $\$50,000$, swap their incomes so that person A earns $\$50,000$ and person B earns $\$10,000$. The overall inequality in this two-person economy remains identical. This principle permits us to always arrange incomes in non-decreasing order without loss of generality:

$$y_1 \le y_2 \le \dots \le y_n$$

### 3.2. The Population Principle (Population Replication Axiom)
Cloning an entire population—along with its corresponding income distribution—must not alter the level of measured inequality. This allows for meaningful inequality comparisons across countries or regions of vastly different sizes.

#### Mathematical Formulation
Let $y \in \mathbb{R}^n_+$ be an income vector. Let $y^* \in \mathbb{R}^{2n}_+$ be a 2-fold replication of $y$ such that:

$$y^* = (y, y) = (y_1, y_2, \dots, y_n, y_1, y_2, \dots, y_n)$$

More generally, for any integer $m \ge 1$, let $y^m \in \mathbb{R}^{m \cdot n}_+$ be the $m$-fold replication of $y$:

$$y^m = (\underbrace{y, y, \dots, y}_{m \text{ times}})$$

The Population Principle requires that:

$$I(y^m) = I(y)$$

#### Economic Intuition
An economy with two people earning $\$10,000$ and $\$50,000$ has the exact same level of inequality as an economy with four people where two earn $\$10,000$ each and two earn $\$50,000$ each. The focus is on the *proportion* of the population at each income level, not the absolute number of people.

### 3.3. The Relative Income Principle (Income Scale Independence)
Only relative incomes should matter for the measurement of inequality; absolute monetary scales must be filtered out.

#### Mathematical Formulation
For any scalar $\lambda > 0$ and any income vector $y \in \mathbb{R}^n_+$:

$$I(\lambda y) = I(\lambda y_1, \lambda y_2, \dots, \lambda y_n) = I(y)$$

#### Economic Intuition
If everyone’s income is doubled, or if the national currency changes from dollars to euros, the measured inequality index must remain unchanged. The relative share of income held by each individual is what matters.

### 3.4. The Dalton Transfer Principle (Pigou-Dalton Principle)
If a transfer of income is made from a richer individual to a poorer individual, and this transfer does not reverse their relative income ranks, then the measured inequality must strictly decrease.

#### Mathematical Formulation
Let $y = (y_1, \dots, y_i, \dots, y_j, \dots, y_n)$ be an income vector where $y_i \le y_j$. Suppose a transfer of size $\delta > 0$ is made from the richer individual $j$ to the poorer individual $i$, yielding a new distribution $y'$ such that:

$$y'_i = y_i + \delta$$

$$y'_j = y_j - \delta$$

with $y'_k = y_k$ for all $k \neq i, j$. 

To prevent rank reversal, we require that:

$$y_i + \delta \le y_j - \delta \implies \delta \le \frac{y_j - y_i}{2}$$

Under these conditions, the Dalton Transfer Principle dictates that:

$$I(y') < I(y)$$

Conversely, a **regressive transfer** (from a poorer person to a richer person) must strictly increase inequality.

---

## 4. The Lorenz Curve

The Lorenz curve is the primary geometric instrument used to represent and analyze income inequality within a population.

### 4.1. Mathematical Definition and Construction
To construct a Lorenz curve, perform the following steps:

1.  **Sort the population** of size $n$ in ascending order of income:
    $$y_1 \le y_2 \le \dots \le y_n$$
2.  Calculate the **cumulative population share** up to individual $k$ (for $k = 1, 2, \dots, n$):
    $$p_k = \frac{k}{n}$$
    By definition, $p_0 = 0$ and $p_n = 1$.
3.  Calculate the **cumulative income share** up to individual $k$:
    $$L_k = \frac{\sum_{i=1}^k y_i}{\sum_{i=1}^n y_i} = \frac{\sum_{i=1}^k y_i}{n\mu}$$
    By definition, $L_0 = 0$ and $L_n = 1$.
4.  Plot $L_k$ against $p_k$ on a two-dimensional plane. The **Lorenz curve** is the continuous, piecewise linear curve obtained by connecting the coordinates $(p_0, L_0), (p_1, L_1), \dots, (p_n, L_n)$. For a continuous income distribution, the Lorenz curve is a smooth curve $L(p)$ defined on the interval $p \in [0, 1]$.

### 4.2. Mathematical Properties of the Lorenz Curve
*   **Boundary Conditions:** The curve must pass through $(0,0)$ and $(1,1)$.
    $$L(0) = 0, \quad L(1) = 1$$
*   **Monotonicity (First Derivative):** The curve is non-decreasing because incomes are non-negative ($y_i \ge 0$).
    $$\frac{dL}{dp} \ge 0$$
*   **Convexity (Second Derivative):** The curve is convex. Because individuals are sorted from poorest to richest, the marginal contribution of each subsequent individual to the cumulative income share is non-decreasing.
    $$\frac{d^2L}{dp^2} \ge 0$$
*   **Line of Perfect Equality:** If all individuals earn the exact same income ($y_i = \mu$ for all $i$), then $L(p) = p$. This is represented by the 45-degree diagonal line connecting $(0,0)$ to $(1,1)$.
*   **Line of Perfect Inequality:** If one person holds the entirety of societal income ($y_n = n\mu$) and everyone else has nothing ($y_i = 0$ for all $i < n$), the Lorenz curve runs along the horizontal axis until the very end, jumping to $(1,1)$ at $p=1$.

### 4.3. Visualizing the Lorenz Curve
The following graph illustrates a typical Lorenz curve alongside the 45-degree Line of Perfect Equality.

```
Cumulative Income Share (L)
1.0 |                                     / (1,1)
    |                                    / .
    |                                   /   .
    |                                  /     .
    |                                 /       . <-- Lorenz Curve L(p)
    |                                /       .  (convex, below diagonal)
    |                               /      .
    |                              /     .
    |                             /    .
    |                            /  .  Area A (Inequality Area)
    |                           / .
    |                          /.
    |                         /
    |                       /   Area B (Area Under Curve)
    |                     /
    |                   /
  0 +------------------/------------------------
    0                                        1.0
                  Cumulative Population Share (p)
```

### 4.4. Lorenz Dominance
Let $A$ and $B$ be two distinct income distributions with corresponding Lorenz curves $L_A(p)$ and $L_B(p)$. 

#### Definition
We say that distribution $A$ **Lorenz-dominates** distribution $B$ (written as $A \succ_L B$) if:

$$L_A(p) \ge L_B(p) \quad \forall p \in [0, 1]$$

and the inequality is strict for at least one $p \in (0, 1)$. Geometrically, this means that the Lorenz curve of $A$ lies entirely inside (closer to the 45-degree line) the Lorenz curve of $B$.

#### The Lorenz Dominance Theorem (Shorrocks, 1983; Fields and Fei, 1978)
An inequality index $I(y)$ satisfies the four axioms of **Anonymity, Population, Relative Income, and Dalton Transfer** if and only if, for any two income distributions $A$ and $B$ with the same mean:

$$I(A) < I(B) \quad \text{whenever } A \text{ Lorenz-dominates } B$$

This theorem is a cornerstone of inequality theory. It guarantees that if one Lorenz curve lies completely above another, any ethically sound inequality index will unambiguously rank the upper curve as more equal than the lower one.

### 4.5. The Problem of Crossing Lorenz Curves
When the Lorenz curves of two distributions intersect, Lorenz dominance does not apply.

```
Cumulative Income Share (L)
1.0 |                                     / (1,1)
    |                                    /
    |                                   /. *
    |                                  /  .  *
    |                                 /    .   *  Curve B
    |                                /     *     .
    |                               /    *        .
    |                              /   *           . Curve A
    |                             /  *              .
    |                            / *                 .
    |                           /*                    .
    |                          /                       .
    |                         /
    |                       /
    |                     /
  0 +--------------------/----------------------
    0                                        1.0
                  Cumulative Population Share (p)
```

In this scenario:
*   **Curve A** has a more equal distribution among the poorest segments of the population (the curve is flatter at the beginning, meaning the very poor have a slightly higher share than in B).
*   **Curve B** has a more equal distribution among the richer segments of the population.
*   Because the curves cross, the Lorenz criteria cannot rank them.
*   Different inequality indices (which place different weights on different parts of the income distribution) will yield contradictory rankings. An index highly sensitive to the bottom of the distribution may rank $A$ as more equal, while an index sensitive to the top may rank $B$ as more equal.

---

## 5. Complete Measures of Inequality

To resolve ranking ambiguities when Lorenz curves cross, economists use complete indices that collapse the entire distribution into a single real number. Below, we analyze six of the most prominent inequality indices, verifying them against the four criteria.

### 5.1. The Range
The Range is the simplest measure of dispersion. It calculates the difference between the maximum and minimum incomes in a society, normalized by the mean income.

#### Formula
$$R(y) = \frac{1}{\mu} (y_{max} - y_{min})$$

where $y_{max} = \max_i \{y_i\}$ and $y_{min} = \min_i \{y_i\}$.

#### Axiomatic Evaluation
*   **Anonymity:** **Satisfied.** Permuting individuals does not alter the maximum or minimum values.
*   **Population Principle:** **Satisfied.** Cloning the population keeps the absolute maximum and minimum the same, and the mean remains identical.
*   **Relative Income Principle:** **Satisfied.** Scaling all incomes by $\lambda$ changes the range to $\lambda(y_{max} - y_{min})$ and the mean to $\lambda\mu$. The terms cancel:
    $$R(\lambda y) = \frac{1}{\lambda \mu} (\lambda y_{max} - \lambda y_{min}) = R(y)$$
*   **Dalton Transfer Principle:** **Violated.** The range is completely insensitive to any income transfers that occur *between* the richest and poorest individuals. For example, if a transfer occurs from a moderately rich person to a moderately poor person, the range remains unchanged because $y_{max}$ and $y_{min}$ are unaffected.

### 5.2. The Kuznets Ratio
Popularized by Simon Kuznets, this index measures the ratio of the income share held by a specified top percentile to that held by a specified bottom percentile. Common variants include the 20/20 ratio or the 10/40 ratio.

#### Formula
$$KR = \frac{\text{Share of income received by the top } x\% \text{ of the population}}{\text{Share of income received by the bottom } y\% \text{ of the population}}$$

For instance, the $20/20$ ratio is:

$$KR_{20/20} = \frac{\sum_{i=n-0.2n+1}^{n} y_i}{\sum_{i=1}^{0.2n} y_i}$$

assuming sorted incomes $y_1 \le y_2 \le \dots \le y_n$.

#### Axiomatic Evaluation
*   **Anonymity:** **Satisfied.**
*   **Population Principle:** **Satisfied.**
*   **Relative Income Principle:** **Satisfied.**
*   **Dalton Transfer Principle:** **Violated.** The Kuznets ratio ignores transfers that take place entirely *within* the designated groups. For instance, a progressive transfer within the bottom 20% of the population will leave their collective share unchanged, meaning the Kuznets Ratio will register no change in inequality.

### 5.3. The Mean Absolute Deviation
The Mean Absolute Deviation measures the average distance of all incomes from the mean income, normalized by the mean.

#### Formula
$$M(y) = \frac{1}{n\mu} \sum_{i=1}^n |y_i - \mu|$$

#### Axiomatic Evaluation
*   **Anonymity:** **Satisfied.**
*   **Population Principle:** **Satisfied.**
*   **Relative Income Principle:** **Satisfied.**
*   **Dalton Transfer Principle:** **Violated.** While it appears to capture all individuals, it fails to register transfers that occur entirely on one side of the mean.
    
    *Proof of Violation:* Let there be two individuals $i$ and $j$ both earning less than the mean: $y_i < y_j < \mu$. Perform a progressive transfer of size $\delta > 0$ from $j$ to $i$ such that $y'_i = y_i + \delta$ and $y'_j = y_j - \delta$, with $y'_i \le y'_j < \mu$.
    
    Let us evaluate their contribution to the summation:
    $$\text{Original Sum} = |y_i - \mu| + |y_j - \mu| = (\mu - y_i) + (\mu - y_j) = 2\mu - y_i - y_j$$
    $$\text{New Sum} = |y'_i - \mu| + |y'_j - \mu| = (\mu - (y_i + \delta)) + (\mu - (y_j - \delta)) = 2\mu - y_i - \delta - y_j + \delta = 2\mu - y_i - y_j$$
    
    The sum is unchanged. Thus, $M(y') = M(y)$, violating the strict inequality required by the Dalton Transfer Principle.

### 5.4. The Coefficient of Variation (CV)
The Coefficient of Variation is the ratio of the standard deviation of the income distribution to its mean.

#### Formula
$$CV(y) = \frac{\sigma}{\mu} = \frac{1}{\mu} \left[ \frac{1}{n} \sum_{i=1}^n (y_i - \mu)^2 \right]^{1/2}$$

#### Axiomatic Evaluation
*   **Anonymity:** **Satisfied.**
*   **Population Principle:** **Satisfied.**
*   **Relative Income Principle:** **Satisfied.**
*   **Dalton Transfer Principle:** **Satisfied.** By squaring the deviations from the mean, any transfer from a richer individual to a poorer individual will reduce the variance (and thus the CV), regardless of where they lie relative to the mean.
    
    *Analytical Proof for Dalton Principle:* Let $y_j > y_i$. Let $y'_j = y_j - \delta$ and $y'_i = y_i + \delta$. The term $(y_j - \mu)^2 + (y_i - \mu)^2$ is replaced by:
    $$(y_j - \delta - \mu)^2 + (y_i + \delta - \mu)^2 = (y_j - \mu)^2 + (y_i - \mu)^2 - 2\delta(y_j - \mu) + 2\delta(y_i - \mu) + 2\delta^2$$
    $$= (y_j - \mu)^2 + (y_i - \mu)^2 - 2\delta(y_j - y_i - \delta)$$
    
    Since $y_j - y_i > \delta$ (no rank reversal), the term $-2\delta(y_j - y_i - \delta)$ is strictly negative. Thus, the sum of squared deviations strictly decreases, which lowers the CV.

### 5.5. The Gini Coefficient
The Gini Coefficient is the most widely used index in empirical research. It represents the expected absolute difference between the incomes of any two individuals chosen at random from the population, normalized by twice the mean.

#### Formula
$$G(y) = \frac{1}{2 n^2 \mu} \sum_{i=1}^n \sum_{j=1}^n |y_i - y_j|$$

#### Alternative Order-Based Formula
If we sort the income vector such that $y_1 \le y_2 \le \dots \le y_n$, the formula simplifies to:

$$G(y) = \frac{n+1}{n} - \frac{2}{n^2 \mu} \sum_{i=1}^n (n - i + 1) y_i$$

Or, equivalently:

$$G(y) = \frac{1}{n} \left( n + 1 - 2 \left[ \frac{\sum_{i=1}^n (n - i + 1) y_i}{\sum_{i=1}^n y_i} \right] \right)$$

#### Geometric Interpretation
On the Lorenz curve diagram, let $A$ represent the area between the 45-degree Line of Perfect Equality and the Lorenz curve $L(p)$. Let $B$ represent the area under the Lorenz curve.

Since the total area under the 45-degree line is exactly $0.5$:

$$A + B = 0.5$$

The Gini coefficient is defined as:

$$G = \frac{A}{A+B} = \frac{A}{0.5} = 2A = 1 - 2B$$

#### Axiomatic Evaluation
*   **Anonymity, Population, Relative Income, and Dalton Transfer:** **All Satisfied.** The Gini coefficient is fully Lorenz-consistent. Any Dalton transfer moves the Lorenz curve strictly closer to the diagonal, shrinking area $A$ and reducing the Gini coefficient.

### 5.6. The Theil Index
Derived from information theory and Shannon's entropy, the Theil Index measures the distance between the actual income distribution and a state of maximum entropy (where everyone has the same income).

#### Formula
$$T(y) = \frac{1}{n} \sum_{i=1}^n \frac{y_i}{\mu} \ln\left(\frac{y_i}{\mu}\right)$$

#### Properties
*   **Bounds:**
    *   If there is perfect equality ($y_i = \mu$ for all $i$), then $\frac{y_i}{\mu} = 1$ and $\ln(1) = 0$, yielding $T(y) = 0$.
    *   If there is perfect inequality (one person holds all income $n\mu$), then $T(y) = \ln(n)$.
*   **Axioms:** **All Satisfied** (Anonymity, Population, Relative Income, and Dalton Transfer).
*   **Decomposability:** This is the most important feature of the Theil Index. Unlike the Gini coefficient, the Theil index is **subgroup-consistent**. It can be perfectly decomposed into inequality *within* subgroups and inequality *between* subgroups.

#### Decomposability Formulation
Suppose a population of size $n$ is divided into $G$ mutually exclusive subgroups (e.g., regions, ethnic groups, educational categories), indexed by $g = 1, 2, \dots, G$. Let:
*   $n_g$ be the population of group $g$, and $s_g = \frac{n_g}{n}$ be its population share.
*   $\mu_g$ be the mean income of group $g$.
*   $w_g = \frac{n_g \mu_g}{n \mu}$ be the income share of group $g$.
*   $T_g$ be the internal Theil index of group $g$ calculated as if it were an independent economy.

The total Theil Index $T(y)$ can be decomposed as:

$$T(y) = \sum_{g=1}^G w_g T_g + \sum_{g=1}^G w_g \ln\left(\frac{\mu_g}{\mu}\right)$$

Where:
*   **Within-Group Inequality:** $\sum_{g=1}^G w_g T_g$ is the weighted sum of internal inequalities within each subgroup.
*   **Between-Group Inequality:** $\sum_{g=1}^G w_g \ln\left(\frac{\mu_g}{\mu}\right)$ is the inequality that would exist if everyone within each subgroup had exactly their group’s mean income $\mu_g$.

---

## 6. Summary Comparison of Inequality Indices

| Inequality Index | Anonymity | Population Principle | Relative Income | Dalton Transfer | Key Strengths / Weaknesses |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **The Range** | Yes | Yes | Yes | **No** | Simple to compute; ignores all intermediate distribution changes. |
| **Kuznets Ratio** | Yes | Yes | Yes | **No** | Very intuitive; completely blind to transfers within the specified top and bottom cohorts. |
| **Mean Absolute Deviation** | Yes | Yes | Yes | **No** | Captures overall dispersion; blind to transfers occurring on the same side of the mean. |
| **Coefficient of Variation** | Yes | Yes | Yes | Yes | Mathematically tractable; highly sensitive to extreme wealth outliers due to squaring. |
| **Gini Coefficient** | Yes | Yes | Yes | Yes | Lorenz-consistent; geometrically intuitive; cannot be decomposed cleanly. |
| **Theil Index** | Yes | Yes | Yes | Yes | Satisfies all criteria; exhibits perfect subgroup decomposability; less intuitively accessible than Gini. |

---

## 7. Concrete Step-by-Step Numerical Example

To understand how these indices are calculated and how they behave, we analyze a hypothetical three-person economy ($n = 3$).

$$\text{Income Vector: } y = (1, 2, 9)$$

### 7.1. Basic Calculations
*   **Sorted Vector:** $y = (1, 2, 9)$ (already sorted: $y_1 = 1$, $y_2 = 2$, $y_3 = 9$)
*   **Total Income:** $\sum_{i=1}^3 y_i = 1 + 2 + 9 = 12$
*   **Mean Income ($\mu$):**
    $$\mu = \frac{12}{3} = 4$$

---

### 7.2. Calculating the Range ($R$)
$$R = \frac{1}{\mu} (y_{max} - y_{min}) = \frac{1}{4} (9 - 1) = 2.0$$

---

### 7.3. Calculating the Kuznets Ratio ($KR$)
Let the top percentile cohort be the top 33.3% (1 person: person 3) and the bottom cohort be the bottom 66.7% (2 people: persons 1 and 2).
*   **Top 33.3% Share:** $\frac{9}{12} = 0.75$
*   **Bottom 66.7% Share:** $\frac{1+2}{12} = \frac{3}{12} = 0.25$
*   **Kuznets Ratio:**
    $$KR = \frac{0.75}{0.25} = 3.0$$

---

### 7.4. Calculating the Mean Absolute Deviation ($M$)
$$M = \frac{1}{n\mu} \sum_{i=1}^n |y_i - \mu|$$
$$M = \frac{1}{3 \times 4} \left( |1 - 4| + |2 - 4| + |9 - 4| \right)$$
$$M = \frac{1}{12} \left( |-3| + |-2| + |5| \right) = \frac{1}{12} (3 + 2 + 5) = \frac{10}{12} \approx 0.833$$

---

### 7.5. Calculating the Coefficient of Variation ($CV$)
$$CV = \frac{1}{\mu} \left[ \frac{1}{n} \sum_{i=1}^n (y_i - \mu)^2 \right]^{1/2}$$
$$CV = \frac{1}{4} \left[ \frac{1}{3} \left( (1-4)^2 + (2-4)^2 + (9-4)^2 \right) \right]^{1/2}$$
$$CV = \frac{1}{4} \left[ \frac{1}{3} \left( (-3)^2 + (-2)^2 + (5)^2 \right) \right]^{1/2}$$
$$CV = \frac{1}{4} \left[ \frac{1}{3} (9 + 4 + 25) \right]^{1/2} = \frac{1}{4} \left[ \frac{38}{3} \right]^{1/2}$$
$$CV \approx \frac{1}{4} \sqrt{12.667} \approx \frac{3.559}{4} \approx 0.890$$

---

### 7.6. Calculating the Gini Coefficient ($G$)
We compute Gini using both the pairwise difference formula and the sorted order-based formula to show their equivalence.

#### Method A: Pairwise Differences
$$G = \frac{1}{2 n^2 \mu} \sum_{i=1}^n \sum_{j=1}^n |y_i - y_j|$$

First, construct the matrix of absolute differences $|y_i - y_j|$:

| | $y_1 = 1$ | $y_2 = 2$ | $y_3 = 9$ | **Row Sum** |
| :--- | :---: | :---: | :---: | :---: |
| **$y_1 = 1$** | $0$ | $1$ | $8$ | $9$ |
| **$y_2 = 2$** | $1$ | $0$ | $7$ | $8$ |
| **$y_3 = 9$** | $8$ | $7$ | $0$ | $15$ |

Sum of all entries:
$$\sum_{i=1}^3 \sum_{j=1}^3 |y_i - y_j| = 9 + 8 + 15 = 32$$

Now, apply the Gini denominator:
$$G = \frac{32}{2 \times (3)^2 \times 4} = \frac{32}{2 \times 9 \times 4} = \frac{32}{72} = \frac{4}{9} \approx 0.444$$

#### Method B: Sorted Order-Based Formula
$$G = \frac{n+1}{n} - \frac{2}{n^2 \mu} \sum_{i=1}^n (n - i + 1) y_i$$
$$G = \frac{3+1}{3} - \frac{2}{3^2 \times 4} \left[ (3-1+1)y_1 + (3-2+1)y_2 + (3-3+1)y_3 \right]$$
$$G = \frac{4}{3} - \frac{2}{36} \left[ 3(1) + 2(2) + 1(9) \right]$$
$$G = \frac{4}{3} - \frac{1}{18} \left[ 3 + 4 + 9 \right] = \frac{4}{3} - \frac{16}{18} = \frac{4}{3} - \frac{8}{9}$$
$$G = \frac{12}{9} - \frac{8}{9} = \frac{4}{9} \approx 0.444$$

Both formulas yield an identical Gini coefficient of **0.444**.

---

### 7.7. Calculating the Theil Index ($T$)
$$T = \frac{1}{n} \sum_{i=1}^n \frac{y_i}{\mu} \ln\left(\frac{y_i}{\mu}\right)$$
$$T = \frac{1}{3} \left[ \frac{1}{4} \ln\left(\frac{1}{4}\right) + \frac{2}{4} \ln\left(\frac{2}{4}\right) + \frac{9}{4} \ln\left(\frac{9}{4}\right) \right]$$
$$T = \frac{1}{3} \left[ 0.25 \ln(0.25) + 0.50 \ln(0.50) + 2.25 \ln(2.25) \right]$$

Now compute the natural logarithms:
*   $\ln(0.25) \approx -1.3863$
*   $\ln(0.50) \approx -0.6931$
*   $\ln(2.25) \approx 0.8109$

Substitute these values back:
$$T = \frac{1}{3} \left[ 0.25(-1.3863) + 0.50(-0.6931) + 2.25(0.8109) \right]$$
$$T = \frac{1}{3} \left[ -0.3466 - 0.3466 + 1.8245 \right]$$
$$T = \frac{1}{3} [ 1.1313 ] \approx 0.377$$

The Theil Index for this distribution is **0.377**.

---

## 8. Distributional Weights and Sensitivity Analysis

Even when indices satisfy all four axioms, they weight transfers at different parts of the income distribution differently. Choosing an inequality index is therefore an implicit value judgment.

### 8.1. Gini Sensitivity
The Gini coefficient is highly sensitive to transfers around the **median** of the distribution. This is because Gini is based on rank-distance. In a standard bell-shaped income distribution, the density of the population is highest near the middle. A transfer of a dollar between two middle-income earners changes their relative ranks (and the ranks of those between them) much more than an identical dollar transfer between two extremely wealthy individuals or two extremely poor individuals.

### 8.2. Coefficient of Variation Sensitivity
Because the CV squares the deviations from the mean:

$$(y_i - \mu)^2$$

it places a disproportionately higher weight on **extreme outliers**. A transfer at the upper tail (among the ultra-rich) or the lower tail (among the ultra-poor) will affect the CV much more than a transfer of the same size in the middle of the distribution.

### 8.3. Theil Index Sensitivity
The presence of the logarithm in the expression:

$$\frac{y_i}{\mu} \ln\left(\frac{y_i}{\mu}\right)$$

makes the Theil Index highly sensitive to changes at the **lower end** of the income distribution. When $y_i$ is very small, the ratio $\frac{y_i}{\mu}$ approaches zero, and the slope of the logarithmic function becomes extremely steep. Consequently, a transfer to a very poor person induces a larger change in the Theil Index than an identical transfer to a middle-income or wealthy person.

