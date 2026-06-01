

## Chapter 4

# Study Guide: Chapter 4 — The New Growth Theories

---

## 1. Introduction and the Limits of Classical Growth Theory

The classical Solow-Swan growth model, while foundational, possesses core theoretical limitations that motivated the development of endogenous growth theory (the "New Growth Theories").

### 1.1 The Theoretical Limits of the Solow-Swan Model
1. **Exogenous Technological Progress**: In the Solow model, sustained long-run growth in per capita income is driven entirely by the rate of technological progress ($T$ or $A$). However, this rate is assumed to be exogenous—determined outside the model. The model explains how an economy responds to technological progress, but not where technology comes from.
2. **The Convergence Paradox**: The Solow model predicts **conditional convergence**. Because of diminishing marginal returns to physical capital, countries with lower initial capital-labor ratios should have higher marginal products of capital ($MPK$) and, consequently, grow faster than rich countries with identical savings rates, population growth rates, and technology levels. Mathematically:
   $$MPK = \frac{\partial Y}{\partial K} = \alpha A \left(\frac{K}{L}\right)^{\alpha-1} = \alpha A k^{\alpha-1}$$
   As $k \to 0$, $MPK \to \infty$. Thus, capital should flow from rich to poor nations, accelerating convergence. Empirically, broad absolute convergence is not observed across all countries; instead, the global income distribution exhibits persistent divergence and polarization.
3. **Inadequate Explanation of Savings Effects**: In the Solow framework, an increase in the savings rate ($s$) yields only a **level effect**—it temporarily raises the growth rate during the transition to a new steady state, but has zero effect on the long-run steady-state growth rate, which remains anchored to the exogenous technological growth rate ($g$).

### 1.2 Transition to Endogenous Growth
Endogenous growth models seek to internalize the engine of long-run growth within the decision-making processes of economic agents (firms, households, and governments). They achieve this by:
* Eliminating the assumption of asymptotically diminishing marginal returns to reproducible factors of production.
* Modeling the production, accumulation, and spillover of knowledge, technology, and human capital.

---

## 2. Human Capital and Growth

One of the first extensions to rescue and modify the classical growth framework was the formal integration of **human capital** ($H$)—the stock of skills, education, training, and health embodied in the labor force.

### 2.1 The Mankiw-Romer-Weil (MRW) Model (1992)
Mankiw, Romer, and Weil extended the Solow model by adding human capital as an explicit, reproducible factor of production.

#### The Production Function
The aggregate production function is Cobb-Douglas with constant returns to scale across physical capital ($K$), human capital ($H$), and effective labor ($A \cdot L$):
$$Y(t) = K(t)^\alpha H(t)^\beta [A(t)L(t)]^{1-\alpha-\beta}$$
where:
* $\alpha > 0, \beta > 0$, and $\alpha + \beta < 1$ (diminishing returns to reproducible physical and human capital combined).
* $A(t)$ is the level of technology growing at rate $g$: $A(t) = A(0)e^{gt}$.
* $L(t)$ is the labor force growing at rate $n$: $L(t) = L(0)e^{nt}$.

#### Accumulation Dynamics
Let $s_k$ be the fraction of income invested in physical capital, and $s_h$ be the fraction invested in human capital. Both physical and human capital depreciate at the same rate $\delta$.
$$\dot{K}(t) = s_k Y(t) - \delta K(t)$$
$$\dot{H}(t) = s_h Y(t) - \delta H(t)$$

#### Steady-State Analysis in Intensive Form
Define variables per unit of effective labor:
$$y = \frac{Y}{AL}, \quad k = \frac{K}{AL}, \quad h = \frac{H}{AL}$$
The intensive production function is:
$$y = k^\alpha h^\beta$$
The evolution of the capital stocks per unit of effective labor is governed by:
$$\dot{k}(t) = s_k y(t) - (n + g + \delta)k(t) = s_k k(t)^\alpha h(t)^\beta - (n + g + \delta)k(t)$$
$$\dot{h}(t) = s_h y(t) - (n + g + \delta)h(t) = s_h k(t)^\alpha h(t)^\beta - (n + g + \delta)h(t)$$

At the steady state ($\dot{k} = 0$ and $\dot{h} = 0$):
$$s_k k^{*\alpha} h^{*\beta} = (n + g + \delta)k^* \implies k^* = \left( \frac{s_k}{n+g+\delta} \right) k^{*\alpha} h^{*\beta}$$
$$s_h k^{*\alpha} h^{*\beta} = (n + g + \delta)h^* \implies h^* = \left( \frac{s_h}{n+g+\delta} \right) k^{*\alpha} h^{*\beta}$$

Dividing the two equations yields:
$$\frac{k^*}{h^*} = \frac{s_k}{s_h} \implies h^* = k^* \left(\frac{s_h}{s_k}\right)$$

Substituting $h^*$ back into the steady-state equation for $k^*$:
$$k^* = \left( \frac{s_k^{1-\beta} s_h^\beta}{n+g+\delta} \right)^{\frac{1}{1-\alpha-\beta}}$$
$$h^* = \left( \frac{s_k^\alpha s_h^{1-\alpha}}{n+g+\delta} \right)^{\frac{1}{1-\alpha-\beta}}$$

#### Steady-State Income Per Capita
Substitute $k^*$ and $h^*$ back into the intensive production function $y^* = (k^*)^\alpha (h^*)^\beta$:
$$y^* = \left( \frac{s_k^\alpha s_h^\beta}{n+g+\delta} \right)^{\frac{1}{1-\alpha-\beta}}$$
Expressing this in terms of income per worker ($\ln(Y/L)$) at time $t$:
$$\ln\left(\frac{Y(t)}{L(t)}\right) = \ln A(0) + gt + \frac{\alpha}{1-\alpha-\beta}\ln(s_k) + \frac{\beta}{1-\alpha-\beta}\ln(s_h) - \frac{\alpha+\beta}{1-\alpha-\beta}\ln(n+g+\delta)$$

#### Key Insights of the MRW Model
* **Higher Explanatory Power**: By adding human capital, the combined share of capital ($\alpha + \beta \approx 1/3 + 1/3 = 2/3$) is much larger than physical capital alone ($\alpha \approx 1/3$).
* **Slower Convergence**: The rate of convergence is given by $\lambda = (1-\alpha-\beta)(n+g+\delta)$. If $\alpha+\beta \approx 2/3$, the speed of convergence is much slower (around 2% per year), matching empirical observations.

---

### 2.2 The Lucas Model (1988) with Human Capital Externalities
Robert Lucas formulated a growth model where human capital has both a **private effect** (raising individual productivity) and an **external effect** (raising the productivity of all factors of production via societal interactions).

#### The Production Function
The aggregate production function is:
$$Y(t) = A K(t)^\beta [u(t) h(t) L(t)]^{1-\beta} h_a(t)^\gamma$$
where:
* $K(t)$ is physical capital.
* $u(t)$ is the fraction of non-leisure time spent in current production ($0 \le u \le 1$).
* $h(t)$ is the average human capital of the worker.
* $L(t)$ is the labor force.
* $h_a(t)$ is the aggregate (average) human capital across the entire economy, which acts as a technological externality ($\gamma > 0$). If all workers are identical, $h_a(t) = h(t)$.

#### Human Capital Accumulation
The growth of human capital depends on the time devoted to education ($1-u(t)$):
$$\dot{h}(t) = \delta (1 - u(t)) h(t)$$
where $\delta$ is the productivity coefficient of schooling.

#### Balanced Growth Path (BGP) Derivation
On a balanced growth path, $u(t) = u$ (constant), meaning the growth rate of human capital is constant:
$$g_h = \frac{\dot{h}}{h} = \delta(1-u)$$
Since $h_a = h$ in equilibrium, the production function becomes:
$$Y = A K^\beta (u h L)^{1-\beta} h^\gamma = A K^\beta u^{1-\beta} L^{1-\beta} h^{1-\beta+\gamma}$$

Assume labor growth is zero ($n=0$) for simplicity. Let's find the growth rate of aggregate output ($g_Y$) and physical capital ($g_K$).
On the BGP, the output-capital ratio $Y/K$ must be constant, so $g_Y = g_K$.
Taking logs and differentiating the production function with respect to time $t$:
$$\ln Y = \ln A + \beta \ln K + (1-\beta)\ln u + (1-\beta)\ln L + (1-\beta+\gamma)\ln h$$
$$\frac{\dot{Y}}{Y} = \beta \frac{\dot{K}}{K} + (1-\beta+\gamma)\frac{\dot{h}}{h}$$
Since $g_Y = g_K$:
$$g_Y = \beta g_Y + (1-\beta+\gamma)g_h$$
$$g_Y(1-\beta) = (1-\beta+\gamma)g_h$$
$$g_Y = \left[ 1 + \frac{\gamma}{1-\beta} \right] g_h = \left[ 1 + \frac{\gamma}{1-\beta} \right] \delta(1-u)$$

#### Market Failure and Policy Implications
* **Underinvestment in Education**: In a decentralized market, individual agents do not internalize the social externality parameter $\gamma$. They choose their educational investment based only on the private return:
  $$g_Y^{\text{private}} = \delta(1-u)$$
* Because the social growth rate $g_Y > g_Y^{\text{private}}$, a competitive economy will under-invest in human capital (choosing a $u$ that is too high). This provides a strong justification for government subsidies for education.

---

## 3. Endogenous Technological Progress (The Romer Models)

Paul Romer pioneered models where technological progress is generated endogenously by self-interested firms investing in research and development (R&D).

### 3.1 Romer’s (1986) Learning-by-Doing and Knowledge Spillovers
This model represents the transition step where aggregate capital accumulation yields aggregate constant returns to scale, preventing the marginal product of capital from falling to zero.

#### The Model Setup
An individual firm $i$ produces using physical capital $K_i$, labor $L_i$, and the economy-wide level of knowledge, which Romer indexes by the aggregate capital stock $K = \sum_i K_i$.
The production function of firm $i$ is:
$$Y_i = A(K) K_i^\alpha L_i^{1-\alpha}$$
Romer assumes that knowledge accumulation is a byproduct of capital accumulation (learning-by-doing). Let the technological spillover function be:
$$A(K) = B K^\beta$$
where $B > 0$ is a technological constant.

#### Aggregate Production Function
Assuming $N$ identical firms in the economy, such that $K_i = K/N$ and $L_i = L/N$:
$$Y_i = B K^\beta \left(\frac{K}{N}\right)^\alpha \left(\frac{L}{N}\right)^{1-\alpha} = B K^{\alpha+\beta} N^{-\alpha} \left(\frac{L}{N}\right)^{1-\alpha}$$
Summing over all $N$ firms to get aggregate output $Y = N Y_i$:
$$Y = N \left[ B K^{\alpha+\beta} N^{-\alpha} \left(\frac{L}{N}\right)^{1-\alpha} \right] = B K^{\alpha+\beta} L^{1-\alpha}$$

#### The AK Case ($\alpha + \beta = 1$)
If the spillover effect exactly offsets the diminishing returns to physical capital ($\beta = 1 - \alpha$), the aggregate production function becomes:
$$Y = (B L^{1-\alpha}) K \implies Y = \Psi K$$
where $\Psi = B L^{1-\alpha}$ is a constant. This is the **AK Model**.

#### Dynamic Equilibrium of the AK Model
Capital accumulation is given by:
$$\dot{K} = s Y - \delta K$$
Substitute $Y = \Psi K$:
$$\dot{K} = s \Psi K - \delta K \implies \frac{\dot{K}}{K} = s \Psi - \delta$$
Since $Y = \Psi K$, the growth rate of output $g_Y$ is identical to the growth rate of capital $g_K$:
$$g_Y = g_K = s \Psi - \delta$$

```
   Growth Rate (g)
         ^
         |             /  g_Y = s * Psi - delta
         |            /
         |           /
         |          /  
         |         /   
         |        /    
       -d|-------/-----------------------> Savings Rate (s)
         |
```

*Figure 1: The linear relationship between the savings rate ($s$) and the long-run growth rate ($g_Y$) in the AK model. Unlike the Solow model, policy changes that alter $s$ yield permanent growth effects.*

#### Implication
* **Perpetual Growth**: If $s \Psi > \delta$, the economy grows indefinitely without technological progress.
* **No Convergence**: Countries with different initial capital levels but identical structural parameters ($s, \Psi, \delta$) will maintain their relative gap forever. If their savings rates differ, their growth rates will differ permanently, leading to divergence.

---

### 3.2 Romer’s (1990) Endogenous Technical Change (R&D Model)
Romer’s 1990 model introduces a horizontal innovation framework with three sectors: the final goods sector, the intermediate goods sector, and the R&D sector.

#### Key Features of the Three Sectors
1. **Final Goods Sector**: Operates under perfect competition. Uses labor $L_Y$ and a range of differentiated intermediate inputs $x_i$.
2. **Intermediate Goods Sector**: Operates under monopolistic competition. Firms buy patents from the R&D sector and produce a specific variety of intermediate input $x_i$.
3. **R&D Sector**: Operates under perfect competition. Uses research labor $L_A$ and the existing stock of knowledge $A$ to invent new designs (patents).

#### Mathematical Formulation
* **Final Goods Production**:
  $$Y = L_Y^{1-\alpha} \int_{0}^{A} x_i^\alpha di$$
  where $A$ is the stock of ideas (the number of intermediate goods available), and $0 < \alpha < 1$.
* **Intermediate Goods Production**: One unit of intermediate good $x_i$ requires exactly one unit of physical capital:
  $$K = \int_{0}^{A} x_i di$$
  Assuming symmetry among intermediate producers such that $x_i = x$ for all $i$:
  $$K = A x \implies x = \frac{K}{A}$$
  Substituting $x$ back into the final goods production function:
  $$Y = L_Y^{1-\alpha} \int_{0}^{A} \left(\frac{K}{A}\right)^\alpha di = L_Y^{1-\alpha} A \left(\frac{K}{A}\right)^\alpha = K^\alpha (A L_Y)^{1-\alpha}$$

* **The R&D Sector (Idea Production)**:
  $$\dot{A} = \delta L_A A$$
  where:
  * $L_A$ is the quantity of labor employed in research.
  * $\delta > 0$ is a research productivity parameter.
  * $A$ is the existing stock of knowledge, capturing the public-good nature of ideas (knowledge spillovers).
* **Labor Constraint**:
  $$L = L_Y + L_A$$

#### Balanced Growth Path Dynamics
Let $s_A = L_A/L$ be the constant share of the labor force allocated to research, so $L_A = s_A L$ and $L_Y = (1-s_A)L$.
The growth rate of technology $g_A$ is:
$$g_A = \frac{\dot{A}}{A} = \delta L_A = \delta s_A L$$

Since $Y = K^\alpha (A L_Y)^{1-\alpha}$, along the BGP where $L_Y$ is constant, the growth rate of output $g_Y$ and capital $g_K$ must equal $g_A$:
$$g_Y = g_K = g_A = \delta s_A L$$

#### Key Policy Implications
* **Scale Effects**: The growth rate is proportional to the total population of workers $L$. If $L$ increases, $g_Y$ increases. This "scale effect" has been highly debated empirically (Jones, 1995).
* **Market Imperfection**: Monopoly profits drive the innovation process. However, because inventors cannot capture the full social value of their ideas (due to the intertemporal knowledge spillover $A$ in $\dot{A} = \delta L_A A$), decentralized market economies under-invest in research relative to the social optimum.

---

## 4. Infrastructure, Public Goods, and Growth (The Barro Model)

Robert Barro (1990) introduced productive government spending as an endogenous engine of growth.

### 4.1 Model Setup
The government provides a public service $G$ that acts as an input to private production. The production function of an individual firm is:
$$Y = A K^{1-\alpha} G^\alpha$$
where $K$ is private capital, and $G$ is publicly provided infrastructure (roads, legal system, public security).

### 4.2 Government Budget Constraint
The government funds its expenditure by levying a flat-rate tax $\tau$ on total output:
$$G = \tau Y$$
where $0 \le \tau \le 1$.

### 4.3 Finding the Aggregate Production Function
Substitute the government budget constraint into the production function:
$$Y = A K^{1-\alpha} (\tau Y)^\alpha = A K^{1-\alpha} \tau^\alpha Y^\alpha$$
Divide both sides by $Y^\alpha$:
$$Y^{1-\alpha} = A \tau^\alpha K^{1-\alpha} \implies Y = A^{\frac{1}{1-\alpha}} \tau^{\frac{\alpha}{1-\alpha}} K$$
This simplifies to an $AK$-type model:
$$Y = \Phi(\tau) K$$
where $\Phi(\tau) = A^{\frac{1}{1-\alpha}} \tau^{\frac{\alpha}{1-\alpha}}$.

### 4.4 Capital Accumulation and Economic Growth
The consumer's disposable income is $(1-\tau)Y$. Assuming a constant savings rate $s$:
$$\dot{K} = s(1-\tau)Y - \delta K$$
Substitute the expression for $Y$:
$$\dot{K} = s(1-\tau)\Phi(\tau) K - \delta K \implies g_K = \frac{\dot{K}}{K} = s(1-\tau) A^{\frac{1}{1-\alpha}} \tau^{\frac{\alpha}{1-\alpha}} - \delta$$
Since $Y = \Phi(\tau)K$, the growth rate of output is:
$$g_Y = g(\tau) = s(1-\tau) A^{\frac{1}{1-\alpha}} \tau^{\frac{\alpha}{1-\alpha}} - \delta$$

### 4.5 The Barro Growth-Tax Trade-off
There are two competing effects of the tax rate $\tau$ on the growth rate:
1. **The Productive Effect**: A higher $\tau$ increases $G$, raising the marginal product of private capital.
2. **The Distortionary Tax Effect**: A higher $\tau$ reduces the net-of-tax return on private investment, reducing the incentive to accumulate capital.

```
       Growth Rate (g)
             ^
             |             * Optimal Tax (tau* = alpha)
             |          *     *
             |        *         *
             |       *            *
             |      *               *
             |     *                 *
             |    *                   *
             +------------------------------> Tax Rate (tau)
             0                             1
```

*Figure 2: The Barro Growth-Tax Curve. Growth is maximized where the productive marginal benefit of public infrastructure equals the distortionary cost of taxation.*

To find the growth-maximizing tax rate $\tau^*$, maximize $\ln g(\tau)$ or simply the variable components $f(\tau) = (1-\tau)\tau^{\frac{\alpha}{1-\alpha}}$ with respect to $\tau$:
$$\ln f(\tau) = \ln(1-\tau) + \frac{\alpha}{1-\alpha}\ln\tau$$
Differentiating with respect to $\tau$ and setting to 0:
$$\frac{d \ln f(\tau)}{d\tau} = \frac{-1}{1-\tau} + \frac{\alpha}{1-\alpha}\frac{1}{\tau} = 0$$
$$\frac{1}{1-\tau} = \frac{\alpha}{(1-\alpha)\tau}$$
$$(1-\alpha)\tau = \alpha(1-\tau) \implies \tau - \alpha\tau = \alpha - \alpha\tau \implies \tau^* = \alpha$$
Thus, the growth-maximizing tax rate is exactly equal to the output elasticity of government services, $\alpha$. This is a specific application of the **static efficiency rule** (the Samuelson condition for public goods).

---

## 5. The Empirical Debate on Convergence

The "New Growth Theories" changed the empirical focus of development economics, generating a long-running debate over whether poor countries are catching up to rich countries.

### 5.1 Absolute vs. Conditional Convergence
* **Absolute Convergence**: The hypothesis that poor countries grow faster than rich countries regardless of their institutional characteristics, causing their per capita income levels to converge over time.
  $$\frac{1}{T}\ln\left(\frac{y_{i,T}}{y_{i,0}}\right) = \alpha - \beta \ln(y_{i,0}) + \epsilon_i$$
  For absolute convergence, $\beta > 0$ must hold when regressing growth on initial income without control variables.
* **Conditional Convergence**: The hypothesis that countries converge to their own country-specific steady states, which are determined by structural characteristics (e.g., savings rates, population growth, institutional quality, education).
  $$\frac{1}{T}\ln\left(\frac{y_{i,T}}{y_{i,0}}\right) = \alpha - \beta \ln(y_{i,0}) + \mathbf{X_i} \mathbf{\gamma} + \epsilon_i$$
  where $\mathbf{X_i}$ is a vector of structural control variables. Empirical evidence strongly supports **conditional convergence** at a rate of roughly 2% per year across global economies, and **absolute convergence** only within homogeneous groups (e.g., OECD countries, US states, prefectures of Japan).

### 5.2 $\beta$-Convergence vs. $\sigma$-Convergence
* **$\beta$-Convergence**: Occurs when poor economies grow faster than rich ones. It is a necessary but not sufficient condition for $\sigma$-convergence.
* **$\sigma$-Convergence**: Occurs when the dispersion of real per capita income across a group of economies tends to decrease over time.
  $$\sigma_t^2 = \frac{1}{N}\sum_{i=1}^N \left[ \ln(y_{i,t}) - \mu_t \right]^2$$
  where $\mu_t$ is the mean of $\ln(y_{i,t})$ at time $t$. If $\sigma_{t+T}^2 < \sigma_t^2$, then $\sigma$-convergence exists.

### 5.3 Comparative Summary of Growth Models

| Feature / Model | Solow-Swan Model | Mankiw-Romer-Weil (MRW) | Lucas (1988) | Romer (1986) AK | Romer (1990) R&D | Barro (1990) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Engine of Growth** | Exogenous technological progress ($g$) | Exogenous technological progress ($g$) | Education / Human Capital Accumulation ($1-u$) | Knowledge Spillovers from Physical Capital | R&D / Horizontal Innovation | Productive Government Infrastructure |
| **Returns to Scale (Reproducible Factors)** | Diminishing | Diminishing (but slower rate) | Constant | Constant (at aggregate level) | Constant (at aggregate level) | Constant (at aggregate aggregate level) |
| **Savings Rate Effect** | Level effect only | Level effect only | Permanent growth effect | Permanent growth effect | Permanent growth effect | Permanent growth effect |
| **Convergence Prediction** | Absolute (if parameters match) or Conditional | Conditional (very slow rate) | No convergence (or conditional) | No convergence / Divergence | No convergence / Divergence | Divergence (depending on tax choices) |
| **Policy Implications** | Passive (technology is exogenous) | Invest in education/savings to raise steady-state level | Subsidize education (correct externality $\gamma$) | Subsidize investment | Subsidize R&D, patent protection | Optimize tax rate ($\tau^* = \alpha$) |

---

## 6. Coordination Failures and Multiple Equilibria

Development economics frequently employs models of **coordination failure** to explain persistent underdevelopment. These models share features with endogenous growth theory, such as externalities and non-convexities.

### 6.1 Rosenstein-Rodan’s "Big Push" Theory
Rosenstein-Rodan (1943) argued that individual private investors, acting independently, cannot break out of an underdevelopment trap. A coordinated investment program across multiple sectors of the economy—the **Big Push**—is required to create mutually reinforcing markets.

#### The Core Mechanism
Consider an economy with $N$ potential sectors.
* **Traditional Sector**: Uses a constant-returns-to-scale technology where 1 unit of labor produces 1 unit of output. Wage rate is normalized to $W_T = 1$.
* **Modern Sector**: Uses a modern, increasing-returns-to-scale technology:
  $$L = F + c Q$$
  where $F$ is a fixed setup cost of labor, $c < 1$ is the marginal labor requirement, and $Q$ is the output. Modern sector wages are higher: $W_M = 1 + \theta > 1$.

```
     Output (Y)
         ^                                    / Modern Sector (Slope = 1/c)
         |                                   / 
         |                                  /  
         |                                 /   
         |                                /    
         |                               /     
         |                              /      
         |   --------------------------/------- Traditional Sector (Slope = 1)
         |  |                         /
         |  |                        / 
         |  |                       /  
         |  |                      /   
       -F|--*                     /    
         |                       /     
         +-------------------------------------> Labor Input (L)
```

*Figure 3: Modern vs. Traditional production technologies. The modern sector requires a fixed entry cost $F$ but has a higher marginal productivity ($1/c > 1$).*

An individual entrepreneur will adopt the modern technology only if they can cover their fixed cost $F$ and higher wage bill $W_M$, which requires a sufficiently large market size. If other sectors remain traditional, market demand is too low, and the modern investment is unprofitable. If all sectors modernize together, they generate income for each other’s workers, expanding the market and making modernization universally profitable.

---

### 6.2 Complementarities and the Cooper-John Formulation
Cooper and John (1988) provided a general game-theoretic framework for analyzing coordination failures.

#### Mathematical Model
Let $y_i \ge 0$ represent the action (e.g., investment) of agent $i$, and let $y$ be the average action of all other agents in the economy:
$$y = \frac{1}{N-1}\sum_{j \neq i} y_j$$
The payoff function for agent $i$ is:
$$V_i = V(y_i, y)$$

#### Definitions
* **Spillovers (Externalities)**: There is a positive spillover if an increase in the aggregate action $y$ increases the payoff of agent $i$:
  $$\frac{\partial V_i}{\partial y} > 0$$
* **Strategic Complementarity**: Exists if an increase in the aggregate action $y$ increases the marginal payoff of agent $i$'s action $y_i$:
  $$\frac{\partial^2 V_i}{\partial y_i \partial y} > 0$$
  This implies that agent $i$'s reaction function, $y_i^* = f(y)$, is upward-sloping:
  $$f'(y) > 0$$

#### Multiple Equilibria Visualization
If $f(y)$ is S-shaped, it can intersect the $45^\circ$ line (where $y_i = y$) multiple times.

```
   Agent i's Action (y_i)
         ^
         |                                         / 45-degree line (y_i = y)
         |                                     _.-'
         |                                 _.-' * Equilibrium E_3 (High)
         |                             _.-'   .
         |                         _.-'      .  Reaction function f(y)
         |                      .-'      _.-'
         |                   .-'     _.-' 
         |                 .'    _.-' * Equilibrium E_2 (Unstable)
         |               .'  _.-'   .
         |             .'_.-'     .
         |          _.-'* Equilibrium E_1 (Low / Trap)
         |      _.-' .
         |  _.-'    .
         +-------------------------------------> Average Action (y)
```

*Figure 4: Multiple Equilibria in the Cooper-John Framework. The S-shaped curve represents the reaction function $f(y)$. Intersections with the $45^\circ$ line define the equilibria:*
* *$\mathbf{E_1}$ is a **low-level stable equilibrium** (underdevelopment trap).*
* *$\mathbf{E_2}$ is an **unstable equilibrium** (threshold / tipping point).*
* *$\mathbf{E_3}$ is a **high-level stable equilibrium** (developed state).*

#### Welfare Rankings
Because of positive spillovers ($\partial V_i / \partial y > 0$), the equilibria are Pareto-ranked:
$$V(y^*_{\mathbf{E_3}}, y^*_{\mathbf{E_3}}) > V(y^*_{\mathbf{E_1}}, y^*_{\mathbf{E_1}})$$
An economy can remain stuck at the low-level equilibrium $\mathbf{E_1}$ indefinitely simply because agents expect everyone else to choose low actions. This is a **coordination failure**.

---

### 6.3 History vs. Expectations (Krugman, 1991)
How does an economy transition from a low-level equilibrium to a high-level equilibrium? Krugman analyzed the roles of history and expectations.

Assume there are two stable equilibria: Traditional (Low) and Modern (High).
* **History**: If physical or human capital is slow to accumulate, past investments determine current payoffs. The economy is locked into its current path, and transition is governed by **path dependence**.
* **Expectations**: If capital is highly mobile and adjustments can be made quickly, self-fulfilling prophecies can occur. If agents suddenly expect the economy to modernize, they will invest immediately, shifting the economy from the low to the high equilibrium.

Mathematically, the transition dynamic depends on the relative adjustment speed of capital ($\theta$) versus the discount rate ($r$):
* If $\theta$ is small (adjustment is slow and costly) or $r$ is large (future is discounted heavily), **history** dominates.
* If $\theta$ is large (fast adjustment) or $r$ is small (patient agents), **expectations** can coordinate a jump across the unstable threshold $\mathbf{E_2}$ to the high-level equilibrium $\mathbf{E_3}$.

