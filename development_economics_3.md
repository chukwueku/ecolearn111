

## Chapter 3

# CHAPTER 3: ECONOMIC GROWTH: THE ONE-SECTOR MODEL

---

## 1. INTRODUCTION TO ECONOMIC GROWTH AND DEVELOPMENT

Economic growth is the sustained increase in a country's productive capacity, typically measured by the growth rate of real Gross Domestic Product (GDP) or real per capita GDP. In development economics, understanding the mechanics of growth is critical because small, sustained differences in annual growth rates lead to massive differences in standards of living over generations due to the power of compounding.

### The Mathematics of Compounding
The relationship between the growth rate and the doubling time of an economy's income can be approximated using the **Rule of 70**:

$$T \approx \frac{70}{g}$$

Where:
*   $T$ is the number of years required for income to double.
*   $g$ is the annual growth rate of income expressed as a percentage.

For example:
*   An economy growing at $1\%$ per year will double its per capita income in approximately $70$ years.
*   An economy growing at $7\%$ per year (typical of rapid late-comer development, such as East Asian miracle economies) will double its per capita income in just $10$ years.

---

## 2. MODERN ECONOMIC GROWTH: BASIC FEATURES (SIMON KUZNETS)

Simon Kuznets, in his pioneering empirical work and his 1971 Nobel Prize lecture, identified six characteristic features of **Modern Economic Growth (MEG)**. These characteristics serve as the empirical benchmarks that any theoretical model of economic growth must attempt to explain.

### A. Quantitative Characteristics
1.  **High Rates of Growth of Per Capita Product and Population:** Developed nations experienced growth rates of per capita product and population that were historically unprecedented, starting around the late 18th to early 19th century. 
2.  **High Rates of Increase in Total Factor Productivity (TFP):** The rise in output could not be accounted for solely by the expansion of inputs (capital and labor). Instead, a large share of growth was driven by an increase in the efficiency with which these inputs were combined—often referred to as TFP or technical progress.

### B. Structural Characteristics
3.  **High Rates of Structural Transformation:** MEG is characterized by a rapid shift in the structure of production and employment. This involves:
    *   A decline in the share of agriculture in both GDP and employment.
    *   A rise in the share of industry (manufacturing and construction), followed later by a rise in the services sector.
4.  **High Rates of Social, Ideological, and Political Transformation:** Structural shifts are accompanied by urbanization, changes in family structure (e.g., lower fertility rates, nuclear families), secularization, and the emergence of legal and political institutions suited for impersonal market transactions.

### C. International Characteristics
5.  **International Outreach of Developed Nations:** Developed countries have an inherent propensity to reach out to the rest of the world for markets, cheap raw materials, and investment opportunities, accelerating globalization and international trade.
6.  **Limited International Spread of Modern Economic Growth:** Despite the international outreach of developed countries, the benefits of MEG have remained concentrated among a quarter of the world's population. This has led to a widening gap between rich and poor nations—a phenomenon often referred to as the **Great Divergence**.

---

## 3. THE HARROD-DOMAR GROWTH MODEL

The Harrod-Domar model (developed independently by Roy Harrod in 1939 and Evsey Domar in 1946) was the first major attempt to formalize the mechanics of economic growth. It is a Keynesian-inspired model that emphasizes the dual role of investment: generating demand (short-run Keynesian effect) and expanding the productive capacity of the economy (long-run classical effect).

### 3.1. Key Assumptions
1.  **Fixed-Proportions (Leontief) Production Function:** Capital and labor are perfect complements. There is no possibility of substituting labor for capital or vice versa. The production function is written as:

    $$Y(t) = \min \left( \frac{K(t)}{c}, \frac{L(t)}{u} \right)$$

    Where:
    *   $Y(t)$ is total output at time $t$.
    *   $K(t)$ is the capital stock at time $t$.
    *   $L(t)$ is the labor force at time $t$.
    *   $c$ is the **capital-output ratio** (the number of units of capital required to produce one unit of output).
    *   $u$ is the **labor-output ratio** (the number of units of labor required to produce one unit of output).

2.  **Capital as the Binding Constraint:** In developing nations, labor is typically in surplus, meaning $\frac{L(t)}{u} > \frac{K(t)}{c}$. Thus, capital is the sole binding constraint on production:

    $$Y(t) = \frac{K(t)}{c} \quad \implies \quad K(t) = c Y(t)$$

    Here, $c$ is also the incremental capital-output ratio (ICOR):

    $$c = \frac{\Delta K(t)}{\Delta Y(t)}$$

3.  **Constant Savings Rate:** Society saves a constant fraction $s$ of its national income:

    $$S(t) = s Y(t) \quad \text{where } s \in (0, 1)$$

4.  **Macroeconomic Equilibrium:** In a closed economy with no government sector, actual saving equals actual investment:

    $$I(t) = S(t)$$

5.  **Capital Accumulation Law:** The capital stock in period $t+1$ equals the capital stock in period $t$ plus net investment (gross investment minus depreciation):

    $$K(t+1) = (1-\delta)K(t) + I(t)$$

    Where $\delta \in [0, 1]$ is the constant depreciation rate of capital.

### 3.2. Derivation of the Growth Rate
To find the growth rate of output, start with the capital accumulation equation and substitute the macroeconomic equilibrium condition ($I(t) = s Y(t)$):

$$K(t+1) - K(t) = s Y(t) - \delta K(t)$$

Since capital is proportional to output ($K(t) = c Y(t)$ and $K(t+1) = c Y(t+1)$), we substitute these relations into the accumulation equation:

$$c Y(t+1) - c Y(t) = s Y(t) - \delta c Y(t)$$

Divide both sides of the equation by $c Y(t)$:

$$\frac{Y(t+1) - Y(t)}{Y(t)} = \frac{s}{c} - \delta$$

Letting $g = \frac{Y(t+1) - Y(t)}{Y(t)}$ denote the growth rate of total output:

$$g = \frac{s}{c} - \delta$$

This is the fundamental Harrod-Domar growth equation. It states that the growth rate of an economy is directly proportional to its savings rate ($s$) and inversely proportional to its capital-output ratio ($c$).

### 3.3. Per Capita Growth Rate
If the population (and labor force) grows at a constant exogenous rate $n$, such that $L(t+1) = (1+n)L(t)$, the growth rate of per capita income ($g_{pc}$) is defined by:

$$1 + g_{pc} = \frac{1+g}{1+n}$$

Using the linear approximation for small values of $g$ and $n$:

$$g_{pc} \approx g - n = \frac{s}{c} - \delta - n$$

### 3.4. Policy Implications: The "Financing Gap" Model
The Harrod-Domar framework was widely used by international planning agencies (like the World Bank) in the post-WWII era to calculate aid requirements. If a developing country targeted a specific growth rate $g^*$, and had an estimated capital-output ratio $c$ and depreciation rate $\delta$, the required savings rate ($s^*$) was:

$$s^* = c (g^* + \delta)$$

If the domestic savings rate ($s$) was lower than $s^*$, the difference was identified as the **financing gap**:

$$\text{Financing Gap} = s^* - s$$

Foreign aid or foreign direct investment (FDI) was targeted to fill this gap to achieve the desired growth rate.

### 3.5. The "Knife-Edge" Problem
For the economy to experience balanced growth with full employment of both capital and labor, the growth rate of capital must equal the growth rate of the labor force ($n$). 
*   The **warranted growth rate** ($g_w$) is the growth rate of capital: $g_w = \frac{s}{c} - \delta$.
*   The **natural growth rate** ($g_n$) is the growth rate of the labor force: $g_n = n$.
*   Full employment equilibrium requires:

$$\frac{s}{c} - \delta = n$$

Because $s$, $c$, and $n$ are determined by entirely independent factors (savings by household preferences, $c$ by technological parameters of the Leontief production function, and $n$ by demographics), there is no market mechanism to ensure this equality holds. 

*   **Case 1: $g_w > n$ (Labor Shortage / Capital Glut):** The demand for labor grows faster than the labor supply. The economy will run out of labor, leaving capital idle. The capital-output ratio $c$ will rise, lowering $g_w$ until it matches $n$, but this involves severe idle capacity and potential investment collapse.
*   **Case 2: $g_w < n$ (Growing Unemployment):** Capital does not grow fast enough to absorb the growing labor force. The economy faces permanently rising structural unemployment.

This lack of stabilizing feedback mechanisms is known as Harrod's **knife-edge instability**.

---

## 4. THE SOLOW-SWAN ONE-SECTOR GROWTH MODEL

Robert Solow (1956) and Trevor Swan (1956) resolved the knife-edge problem by replacing the fixed-proportions Leontief production function with a neoclassical production function that allows for smooth substitution between capital and labor. This adjustment makes the capital-output ratio endogenous and self-correcting.

### 4.1. Key Assumptions
1.  **Neoclassical Production Function:** Output is produced using capital ($K$) and labor ($L$):

    $$Y = F(K, L)$$

2.  **Constant Returns to Scale (CRS):** If both inputs are scaled by a factor $\lambda > 0$, output scales by the same factor:

    $$F(\lambda K, \lambda L) = \lambda F(K, L) \quad \forall \lambda > 0$$

3.  **Positive and Diminishing Marginal Returns:**
    *   Marginal products of capital and labor are positive:
        $$\frac{\partial F}{\partial K} > 0, \quad \frac{\partial F}{\partial L} > 0$$
    *   Marginal products are diminishing:
        $$\frac{\partial^2 F}{\partial K^2} < 0, \quad \frac{\partial^2 F}{\partial L^2} < 0$$

4.  **The Inada Conditions:** These guarantee the existence of a stable interior steady state:
    $$\lim_{K \to 0} \frac{\partial F}{\partial K} = \infty \quad \text{and} \quad \lim_{K \to \infty} \frac{\partial F}{\partial K} = 0$$
    $$\lim_{L \to 0} \frac{\partial F}{\partial L} = \infty \quad \text{and} \quad \lim_{L \to \infty} \frac{\partial F}{\partial L} = 0$$

5.  **Exogenous Population Growth:** The labor force grows at a constant rate $n$:

    $$L(t+1) = (1+n)L(t)$$

6.  **Savings and Capital Accumulation:** As in the Harrod-Domar model, savings are a constant fraction $s$ of income, and the economy is closed ($I = S = sY$).

    $$K(t+1) = (1-\delta)K(t) + sY(t)$$

### 4.2. Intensive Form of the Production Function
Using the CRS property, we can set $\lambda = \frac{1}{L}$ to express all variables in per capita (or per worker) terms:

$$\frac{Y}{L} = F\left( \frac{K}{L}, 1 \right)$$

Define:
*   $y \equiv \frac{Y}{L}$ (output per worker)
*   $k \equiv \frac{K}{L}$ (capital-labor ratio, or capital per worker)

Thus, the intensive production function is:

$$y = f(k)$$

#### Properties of $f(k)$:
*   $f(0) = 0$ (capital is essential for production).
*   $f'(k) > 0$ (positive marginal product of capital per worker):
    $$f'(k) = \frac{\partial F}{\partial K}$$
*   $f''(k) < 0$ (diminishing marginal product of capital):
    $$f''(k) = \frac{\partial^2 F}{\partial K^2} \cdot L < 0$$
*   Inada Conditions in Intensive Form:
    $$\lim_{k \to 0} f'(k) = \infty \quad \text{and} \quad \lim_{k \to \infty} f'(k) = 0$$

---

### 4.3. Mathematical Derivation of the Fundamental Equation of Capital Accumulation

We seek to understand how the capital-labor ratio ($k$) changes over time.

#### Step 1: Divide the capital accumulation equation by $L(t+1)$
Start with:

$$K(t+1) = (1-\delta)K(t) + sY(t)$$

Divide both sides by $L(t+1)$:

$$\frac{K(t+1)}{L(t+1)} = (1-\delta)\frac{K(t)}{L(t+1)} + s\frac{Y(t)}{L(t+1)}$$

#### Step 2: Use the population growth relation $L(t+1) = (1+n)L(t)$
Substitute $L(t+1)$ on the right-hand side:

$$k(t+1) = \frac{1-\delta}{1+n} \left[ \frac{K(t)}{L(t)} \right] + \frac{s}{1+n} \left[ \frac{Y(t)}{L(t)} \right]$$

Substitute the intensive definitions $k(t) = \frac{K(t)}{L(t)}$ and $f(k(t)) = \frac{Y(t)}{L(t)}$:

$$k(t+1) = \frac{(1-\delta)k(t) + sf(k(t))}{1+n}$$

#### Step 3: Rearrange to find the net change in capital per worker ($\Delta k$)
Multiply both sides by $(1+n)$:

$$(1+n)k(t+1) = (1-\delta)k(t) + sf(k(t))$$

$$k(t+1) + n k(t+1) = k(t) - \delta k(t) + sf(k(t))$$

Subtract $k(t)$ from both sides:

$$[k(t+1) - k(t)] + n k(t+1) = sf(k(t)) - \delta k(t)$$

Let $\Delta k(t) = k(t+1) - k(t)$. For small time intervals (or using the approximation $k(t+1) \approx k(t)$ on the interaction term $n k(t+1)$), we write:

$$\Delta k(t) (1+n) = sf(k(t)) - (n + \delta)k(t)$$

$$\Delta k(t) = \frac{sf(k(t)) - (n+\delta)k(t)}{1+n}$$

In **continuous time**, this equation simplifies exactly to the **Fundamental Equation of the Solow-Swan Model**:

$$\dot{k}(t) = sf(k(t)) - (n+\delta)k(t)$$

Where $\dot{k}(t) \equiv \frac{dk(t)}{dt}$ represents the instantaneous change in the capital-labor ratio over time.

---

### 4.4. Steady-State Equilibrium
The steady state of the economy is defined as a situation where capital per worker is constant over time, meaning $\dot{k}(t) = 0$ (or $\Delta k(t) = 0$). Let $k^*$ denote the steady-state capital-labor ratio:

$$sf(k^*) = (n+\delta)k^*$$

At this equilibrium:
*   **$sf(k^*)$** is **Actual Savings (Investment) per worker**.
*   **$(n+\delta)k^*$** is **Break-Even Investment per worker** (the investment level required to maintain $k$ at its current level. It must cover both physical depreciation of capital, $\delta k^*$, and the capital dilution caused by population growth equipping new workers, $n k^*$).

#### Steady-State Growth Rates (Summary Table)
| Variable | Definition | Steady-State Growth Rate |
| :--- | :--- | :--- |
| Capital-labor ratio ($k$) | $K/L$ | $0$ |
| Output per worker ($y$) | $Y/L$ | $0$ |
| Consumption per worker ($c_w$) | $(1-s)y$ | $0$ |
| Total Capital Stock ($K$) | $k \cdot L$ | $n$ |
| Total Output ($Y$) | $y \cdot L$ | $n$ |

---

### 4.5. Graphical Representation of the Solow Steady State

The Solow growth model is traditionally analyzed using a single diagram plotting capital per worker ($k$) on the horizontal axis and output/investment per worker on the vertical axis.

```
  Output, Investment,
  Savings per worker
     ^
     |                                              y = f(k) [Intensive Production Function]
     |                                             .
     |                                           .  
     |                                         .   
     |                                       .      (n + \delta)k [Break-even Line]
     |                                     .       /
     |                                   ..       /
     |                                 ..        /
     |                               ..         /
     |                             ..          /    sf(k) [Actual Investment]
     |                           ..           /   .
     |                         ..            /  .
     |                       ..             / .
     |                     ..              /.
     |                   .. *             / 
     |                 ..  /|*           /
     |               ..   / |  *        /
     |             ..    /  |    *     /
     |           ..     /   |      *  /
     |         ..      /    |        *
     |       ..       /     |       /  *
     |     ..        /      |      /     *
     |   ..         /       |     /        *
     |  .          /        |    /           *
     | .          /         |   /              *
     |___________/__________|__/_________________*________> Capital per worker (k)
     0                      k*
```

#### Detailed Description of the Graph:
1.  **The Curves:**
    *   **$y = f(k)$:** Starts at the origin and rises steeply. It is strictly concave ($f''(k) < 0$), reflecting diminishing marginal returns to capital.
    *   **$sf(k)$:** The savings/actual investment curve. It has the exact same shape as $f(k)$ but is vertically compressed because $s \in (0, 1)$.
    *   **$(n+\delta)k$:** A straight line starting at the origin with a positive slope equal to $(n+\delta)$.
2.  **The Equilibrium ($k^*$):**
    *   The intersection of the $sf(k)$ curve and the $(n+\delta)k$ line defines the steady-state capital-labor ratio $k^*$.
    *   To the left of $k^*$ (where $k < k^*$): The savings curve is above the break-even investment line ($sf(k) > (n+\delta)k$). Consequently, $\dot{k} > 0$, and $k$ increases over time.
    *   To the right of $k^*$ (where $k > k^*$): The break-even investment line is above the savings curve ($sf(k) < (n+\delta)k$). Consequently, $\dot{k} < 0$, and $k$ decreases.
    *   This confirms that $k^*$ is a **globally stable** equilibrium.

---

### 4.6. Comparative Statics

#### A. An Increase in the Savings Rate ($s \to s'$)
Suppose the savings rate increases from $s$ to $s'$ where $s' > s$.

```
  y, sf(k)
     ^                                         y = f(k)
     |                                        /
     |                                       /      (n + \delta)k
     |                                      /      /
     |                                     /      /
     |                                    /      /   s'f(k) [New Savings]
     |                                   /      /   .
     |                                  /      /  . 
     |                                 /      / .  
     |                                /      /.   sf(k) [Old Savings]
     |                               /      /*  .
     |                              /      /| *  .
     |                             /      / |   *.
     |                            /      /  |     *
     |                           /      /   |    / *
     |                          /      /    |   /   *
     |                         /      /     |  /     *
     |                        /      /      | /       *
     |                       /      /       |/         *
     |                      /      /|       |           *
     |_____________________/______/_|_______|___________*______> k
     0                           k*       k**
```

*   **Dynamic Adjustment:**
    1.  At the instant of the savings rate increase, the actual savings curve shifts upward to $s'f(k)$.
    2.  At the old steady state $k^*$, actual investment now exceeds break-even requirements: $s'f(k^*) > (n+\delta)k^*$.
    3.  This generates positive capital accumulation ($\dot{k} > 0$).
    4.  As $k$ grows, the economy experiences a transitory period of growth in per capita output ($y = f(k)$) and per capita capital ($k$).
    5.  Due to diminishing returns, the growth rate of $k$ slows down until actual investment equals break-even investment at the new steady state $k^{**}$.
*   **Long-Run Effects:**
    *   A higher steady-state capital-labor ratio ($k^{**} > k^*$).
    *   A higher steady-state output per worker ($y^{**} > y^*$).
    *   **Level Effect vs. Growth Effect:** The long-run growth rate of per capita output returns to $0$. A change in the savings rate only has a *level effect* on long-run per capita income, not a *growth effect*. It only causes a temporary *growth effect* during the transition phase.

#### B. An Increase in the Population Growth Rate ($n \to n'$)
Suppose the population growth rate increases from $n$ to $n'$ where $n' > n$.

```
  y, sf(k)
     ^                                         y = f(k)
     |                                        /
     |                                       /        (n' + \delta)k [New Break-even]
     |                                      /        / 
     |                                     /        /   (n + \delta)k [Old Break-even]
     |                                    /        /   /
     |                                   /        /   /
     |                                  /        /   /
     |                                 /        /   /
     |                                /        /   /   sf(k)
     |                               /        /   /  .
     |                              /        /  /  .
     |                             /        / /  .
     |                            /        //  .
     |                           /        /|  .
     |                          /       /* | .
     |                         /       /|* |.
     |                        /       / | *
     |                       /       /  |/ *
     |                      /       /   |   *
     |_____________________/_______/____|___*__________________> k
     0                           k**   k*
```

*   **Dynamic Adjustment:**
    1.  The break-even investment line rotates counter-clockwise (steeper) from $(n+\delta)k$ to $(n'+\delta)k$.
    2.  At the old steady state $k^*$, the actual investment is now less than the break-even requirement: $sf(k^*) < (n'+\delta)k^*$.
    3.  This causes capital dilution to exceed capital accumulation, meaning $\dot{k} < 0$.
    4.  The capital-labor ratio declines until a new steady state is established at $k^{**} < k^*$.
*   **Long-Run Effects:**
    *   A lower steady-state capital-labor ratio ($k^{**} < k^*$).
    *   A lower steady-state output per worker ($y^{**} < y^*$).
    *   This result provides a structural explanation for why countries with high population growth rates often have lower standards of living (per capita GDP).

---

## 5. TECHNOLOGICAL PROGRESS IN THE SOLOW MODEL

To explain sustained long-run growth in per capita output (which we observe in the real world, contrary to the basic Solow model where per capita growth falls to zero), we must introduce technological progress.

### 5.1. Harrod-Neutral (Labor-Augmenting) Technical Progress
To preserve the steady state (under balanced growth conditions), technical progress must enter the production function in a labor-augmenting form:

$$Y(t) = F(K(t), A(t)L(t))$$

Where:
*   $A(t)$ is the level of labor-augmenting technology (or efficiency of labor) at time $t$.
*   $A(t)$ grows at an exogenous, constant rate $p$:

$$A(t) = A(0)e^{pt} \quad \implies \quad \frac{\dot{A}(t)}{A(t)} = p$$

*   $E(t) \equiv A(t)L(t)$ is defined as the number of **effective units of labor**.
*   The effective labor force grows at the rate:

$$\frac{\dot{E}(t)}{E(t)} = n + p$$

### 5.2. Steady State in Effective Terms
Define variables in terms of effective labor:
*   Capital per unit of effective labor:
    $$\hat{k} \equiv \frac{K}{AL}$$
*   Output per unit of effective labor:
    $$\hat{y} \equiv \frac{Y}{AL} = F\left(\frac{K}{AL}, 1\right) = f(\hat{k})$$

Applying the capital accumulation equation and differentiating $\hat{k}$ with respect to time yields the **Fundamental Solow Equation with Technology**:

$$\dot{\hat{k}}(t) = sf(\hat{k}(t)) - (n + p + \delta)\hat{k}(t)$$

In the steady state, $\dot{\hat{k}} = 0$, which yields the equilibrium capital per effective worker $\hat{k}^*$:

$$sf(\hat{k}^*) = (n + p + \delta)\hat{k}^*$$

At this steady state, the properties of the economy on the **Balanced Growth Path (BGP)** are as follows:

| Variable | Steady-State Value | Growth Rate on BGP |
| :--- | :--- | :--- |
| Capital per effective worker ($\hat{k}$) | $\hat{k}^*$ | $0$ |
| Output per effective worker ($\hat{y}$) | $f(\hat{k}^*)$ | $0$ |
| Capital per worker ($k = \hat{k} \cdot A$) | $\hat{k}^* A(t)$ | $p$ |
| Output per worker ($y = \hat{y} \cdot A$) | $f(\hat{k}^*) A(t)$ | $p$ |
| Total Output ($Y = \hat{y} \cdot AL$) | $f(\hat{k}^*) A(0) L(0) e^{(n+p)t}$ | $n + p$ |
| Total Capital Stock ($K = \hat{k} \cdot AL$) | $\hat{k}^* A(0) L(0) e^{(n+p)t}$ | $n + p$ |

### Key Conclusion
Exogenous technological progress ($p$) is the **only** engine of sustained long-run growth in per capita income in the Solow-Swan framework. Without technological progress, per capita growth must eventually cease due to diminishing marginal returns to capital.

---

## 6. EMPIRICAL APPLICATION: GROWTH ACCOUNTING AND THE SOLOW RESIDUAL

Growth accounting is a methodology developed by Robert Solow (1957) to decompose the observed growth rate of aggregate output into components driven by input accumulation (capital and labor) and a residual component that represents efficiency improvements (TFP).

### 6.1. Mathematical Derivation
Start with a general aggregate production function:

$$Y(t) = A(t) F(K(t), L(t))$$

Where $A(t)$ represents **Hicks-neutral** productivity (Total Factor Productivity).

Take the natural logarithm of both sides:

$$\ln Y(t) = \ln A(t) + \ln F(K(t), L(t))$$

Differentiate both sides with respect to time $t$:

$$\frac{1}{Y(t)} \frac{dY(t)}{dt} = \frac{1}{A(t)} \frac{dA(t)}{dt} + \frac{1}{F(K, L)} \left[ \frac{\partial F}{\partial K}\frac{dK}{dt} + \frac{\partial F}{\partial L}\frac{dL}{dt} \right]$$

Using dot notation for time derivatives ($\dot{X} \equiv \frac{dX}{dt}$):

$$\frac{\dot{Y}}{Y} = \frac{\dot{A}}{A} + \frac{A \frac{\partial F}{\partial K}}{Y} \dot{K} + \frac{A \frac{\partial F}{\partial L}}{Y} \dot{L}$$

Multiply and divide the second term by $K$, and the third term by $L$:

$$\frac{\dot{Y}}{Y} = \frac{\dot{A}}{A} + \left( \frac{\partial Y}{\partial K} \frac{K}{Y} \right) \frac{\dot{K}}{K} + \left( \frac{\partial Y}{\partial L} \frac{L}{Y} \right) \frac{\dot{L}}{L}$$

Let:
*   $g_Y \equiv \frac{\dot{Y}}{Y}$ be the growth rate of output.
*   $g_A \equiv \frac{\dot{A}}{A}$ be the growth rate of TFP (technological progress).
*   $g_K \equiv \frac{\dot{K}}{K}$ be the growth rate of capital.
*   $g_L \equiv \frac{\dot{L}}{L}$ be the growth rate of labor.
*   $\alpha_K \equiv \frac{\partial Y}{\partial K} \frac{K}{Y}$ be the elasticity of output with respect to capital.
*   $\alpha_L \equiv \frac{\partial Y}{\partial L} \frac{L}{Y}$ be the elasticity of output with respect to labor.

Rewrite the equation:

$$g_Y = g_A + \alpha_K g_K + \alpha_L g_L$$

### 6.2. Factor Shares and Perfect Competition
Under the assumption of perfect competition in factor markets, factors are paid their marginal products:
*   The real rental rate of capital: $r = \frac{\partial Y}{\partial K}$
*   The real wage rate: $w = \frac{\partial Y}{\partial L}$

Thus, the elasticities can be written as:
*   $\alpha_K = \frac{r K}{Y}$ (the share of total capital payments in total output).
*   $\alpha_L = \frac{w L}{Y}$ (the share of total labor payments in total output).

Under Constant Returns to Scale, Euler's Theorem guarantees that these shares sum to one:

$$\alpha_K + \alpha_L = 1$$

Letting $\alpha_K = \alpha$ and $\alpha_L = 1 - \alpha$, we obtain the standard **Growth Accounting Equation**:

$$g_Y = g_A + \alpha g_K + (1-\alpha)g_L$$

### 6.3. Calculating the Solow Residual
Because $g_Y$, $g_K$, and $g_L$ can be directly measured from national accounts data, and the capital share $\alpha$ can be estimated from income distribution data, TFP growth ($g_A$) can be calculated as a leftover or residual:

$$g_A = g_Y - [\alpha g_K + (1-\alpha)g_L]$$

This $g_A$ is known as the **Solow Residual**.

#### In Per Capita Terms
The growth accounting equation can be expressed in terms of per capita growth ($g_y = g_Y - g_L$ and $g_k = g_K - g_L$):

$$g_y = g_A + \alpha g_k$$

### 6.4. Interpretation and Critique of the Solow Residual
*   **"Measure of our Ignorance":** Moses Abramovitz famously described the Solow Residual as a "measure of our ignorance" because it aggregates everything that increases output without increasing measured physical inputs.
*   **What does it capture?**
    *   Pure technological innovation.
    *   Institutional improvements (stronger property rights, better contract enforcement).
    *   Improved organization of production.
    *   Changes in capacity utilization.
    *   Upgrading of human capital (if labor is not adjusted for education/skills).
    *   Measurement errors in capital stock and labor hours.

---

## 7. THE CONVERGENCE HYPOTHESIS

The neoclassical growth model has important implications for how differences in per capita income between rich and poor countries behave over time.

### 7.1. Unconditional (Absolute) Convergence
**Definition:** Poor countries will grow faster than rich countries, and eventually catch up to their level of per capita income, regardless of their institutional or structural characteristics.

#### Theoretical Foundation
Consider two countries, Rich ($R$) and Poor ($P$). Assume they are structurally identical: they have the same savings rate ($s_R = s_P = s$), same population growth rate ($n_R = n_P = n$), same technology growth ($p_R = p_P = p$), and same depreciation rate ($\delta_R = \delta_P = \delta$). Consequently, they share the **same steady state** $\hat{k}^*$ and $\hat{y}^*$.

*   By definition, $k_{P,0} < k_{R,0} < k^*$.
*   Because of diminishing marginal returns to capital, the marginal product of capital is higher in the poor country:
    $$f'(k_P) > f'(k_R)$$
*   The rate of capital accumulation per worker is given by:
    $$\frac{\dot{k}}{k} = s\frac{f(k)}{k} - (n+\delta)$$
*   Since the average productivity of capital $\frac{f(k)}{k}$ is decreasing in $k$, the growth rate of capital (and thus output) is higher for lower values of $k$.
*   Therefore:
    $$g_{y,P} > g_{y,R}$$

#### Graphical representation of Absolute Convergence:
```
  Growth rate of k (k_dot / k)
     ^
     | \
     |   \
     |     \  s f(k)/k  [Average product of capital scaled by s]
     |       \
     |         \
     |           \
     |             \--------------------------------------- n + \delta [Constant line]
     |              | \
     |              |   \
     |              |     \
     +--------------|------|------------------------------------> k
     0            k_P    k_R  k*
                    |      |
             High Growth  Low Growth
```

#### Empirical Evidence
Globally, absolute convergence **does not hold**. When plotting the initial per capita income of all countries in the world (e.g., in 1960) against their subsequent average growth rates over the next several decades, there is no statistically significant negative correlation. In fact, many extremely poor countries have grown slower than rich countries, leading to **divergence**.

---

### 7.2. Conditional Convergence
**Definition:** A country grows faster the further it is below its *own* steady-state level of income.

#### Theoretical Foundation
Countries are not structurally identical. They differ in savings rates ($s_i$), population growth rates ($n_i$), human capital levels, and institutional quality. This means that each country $i$ has its own unique steady state $y_i^*$.

*   A poor country with low savings ($s$) and high population growth ($n$) will have a very low steady state $y^*$. If this country is already close to its low steady state, it will grow slowly.
*   A rich country might still be growing moderately fast if it is far below a very high steady state (due to high $s$ and technological capacity).
*   The convergence equation is:

$$g_i \approx \beta (\ln y_i^* - \ln y_{i,0})$$

Where:
*   $g_i$ is the growth rate of country $i$.
*   $y_{i,0}$ is the initial per capita income.
*   $y_i^*$ is the steady-state per capita income of country $i$ (determined by $s_i$, $n_i$, educational attainment, and political stability).
*   $\beta > 0$ is the speed of convergence (empirically found to be around $2\%$ per year).

#### Empirical Evidence
When researchers control for variables that determine the steady state—such as savings rates, education, and political stability—there is a strong, statistically significant negative relationship between initial income and subsequent growth rate. This supports **conditional convergence**.

---

### 7.3. Club Convergence
**Definition:** Groups of countries with similar structural characteristics (such as the OECD nations, states within the United States, or European regions) tend to converge to one another because they share similar technology levels, institutional environments, and preference profiles. They form a **convergence club** where absolute convergence holds internally.

#### Summary Comparison of Convergence Concepts
| Concept | Key Assumption | Implication | Empirical Validity |
| :--- | :--- | :--- | :--- |
| **Absolute Convergence** | All countries share the same structural parameters and steady state. | Poor countries grow faster than rich countries. | Rejected globally; holds only within homogeneous regions. |
| **Conditional Convergence** | Countries have different steady states; growth depends on the distance to their own steady state. | Controlling for structural parameters, poorer countries grow faster. | Strongly supported by global cross-country regression data. |
| **Club Convergence** | Structural parameters are shared within specific sub-groups of countries. | Member nations of the "club" converge to a common high income level. | Supported among OECD countries and regional economies. |

