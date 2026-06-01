

## Chapter 9

# Chapter 9: Land Relations and Land Reform

## 1. Introduction: The Role of Land as a Primary Asset

In developing agrarian economies, land is not merely a physical factor of production; it is the primary asset that determines wealth, social status, political power, and economic security. The distribution of land ownership and the institutional arrangements governing its cultivation are central to understanding rural poverty, agricultural productivity, and overall economic development.

### 1.1 Ownership vs. Operational Holdings
To analyze land relations, a fundamental distinction must be made between:
1. **Ownership Holdings**: The land to which an individual or household holds legal title.
2. **Operational Holdings**: The land actually cultivated by a household, which includes owned land plus land leased in, minus land leased out.

$$\text{Operational Holding} = \text{Owned Land} + \text{Leased-in Land} - \text{Leased-out Land}$$

In many developing countries, ownership holdings are highly concentrated, while operational holdings are often smaller and more fragmented due to tenancy arrangements.

### 1.2 The Gini Coefficient of Land Distribution
The inequality of land ownership is typically measured using the Gini coefficient. Let landholdings be ordered from smallest to largest. The Lorenz curve plots the cumulative percentage of households against the cumulative percentage of land owned. The Gini coefficient ($G$) is defined as:

$$G = \frac{A}{A + B}$$

where $A$ is the area between the line of perfect equality (the $45^\circ$ line) and the Lorenz curve, and $B$ is the area under the Lorenz curve. 

In agrarian societies, a high land Gini coefficient (often exceeding $0.7$ or $0.8$ in Latin America, and ranging between $0.5$ and $0.6$ in South Asia) indicates severe structural inequality. This inequality has profound implications for credit access, risk-sharing, and labor market dynamics.

---

## 2. Landlord-Tenant Relations: Typology of Contracts

When landowners do not cultivate the land themselves, they enter into agreements with tenants. The three primary contract forms observed historically and globally are:

| Contract Type | Payment Structure | Risk Allocation | Incentive Level |
| :--- | :--- | :--- | :--- |
| **Fixed-Rent Tenancy** | Tenant pays a fixed fee $R$ (in cash or crop volume). Keeps all residual output. | Tenant bears $100\%$ of the risk. | Maximum (Tenant receives the full marginal product of effort). |
| **Sharecropping** | Tenant pays a fraction $r \in (0,1)$ of the total output to the landlord. | Risk is shared between landlord and tenant. | Muted (Tenant receives only a fraction $s = 1-r$ of the marginal product). |
| **Wage Labor** | Landlord pays a wage $w$ per unit of labor. Landlord retains all crop output. | Landlord bears $100\%$ of the risk. | Minimum (Zero incentive to exert effort unless monitored). |

---

## 3. Tenant Contracts and Allocative Efficiency

The persistence of different tenancy contracts, particularly sharecropping, has puzzled economists for centuries. We analyze these contracts through different theoretical frameworks.

### 3.1 The Marshallian Approach (Incentive Inefficiency)

Alfred Marshall (1920) argued that sharecropping is allocatively inefficient because it acts as a tax on the tenant’s labor effort.

#### The Mathematical Model
Let production be represented by a standard production function:

$$Y = f(e)$$

where:
* $Y$ is the agricultural output.
* $e$ is the labor effort exerted by the tenant.
* $f(e)$ is twice-differentiable, strictly increasing, and concave: $f'(e) > 0$ and $f''(e) < 0$.
* The opportunity cost of labor is $w$ per unit of effort (representing the market wage rate).

#### 1. Socially Optimal (and Owner-Cultivator) Outcome
An owner-cultivator maximizes net surplus:

$$\max_{e} \Pi = f(e) - we$$

The First-Order Condition (FOC) is:

$$f'(e^*) = w$$

This determines the socially optimal level of effort, $e^*$, where the marginal product of labor equals the opportunity cost of labor.

#### 2. Fixed-Rent Tenancy
Under a fixed-rent contract, the tenant pays a fixed rent $R$ to the landlord. The tenant’s optimization problem is:

$$\max_{e} \Pi_{FR} = f(e) - R - we$$

The FOC is:

$$f'(e_{FR}) = w$$

Since this FOC is identical to the social optimum, fixed-rent tenancy is allocatively efficient:

$$e_{FR} = e^*$$

#### 3. Sharecropping Tenancy
Under sharecropping, the tenant retains only a share $s = 1-r$ of the output, where $r$ is the landlord's share. The tenant's optimization problem is:

$$\max_{e} \Pi_{SC} = s f(e) - we$$

The FOC is:

$$s f'(e_{SC}) = w \implies f'(e_{SC}) = \frac{w}{s}$$

Since $s < 1$, it follows that:

$$\frac{w}{s} > w \implies f'(e_{SC}) > f'(e^*)$$

Given the concavity of the production function ($f''(e) < 0$), a higher marginal product implies a lower level of effort:

$$e_{SC} < e^*$$

#### Graphical Representation of Marshallian Inefficiency

```
Marginal
Product, Wage
  ^
  |        \
  |         \  f'(e) [Marginal Product of Labor]
  |          \
  |  w/s -----\------------------*
  |            \                /|
  |             \              / |
  |   w ---------\------------*--+----- [Opportunity Cost of Labor]
  |               \          /|  |
  |                \        / |  |
  |                 \  s f'(e)|  |  [Tenant's Share of MP]
  |                  \      / |  |
  +-------------------------------------> Effort (e)
                            e_SC e*
```

* **The Horizontal Line at $w$** represents the constant marginal cost of labor.
* **The Curve $f'(e)$** represents the actual marginal product of labor. Its intersection with $w$ defines the efficient labor input $e^*$.
* **The Curve $s f'(e)$** is the tenant's perceived marginal return under sharecropping. Its intersection with $w$ defines the suboptimal labor input $e_{SC}$.
* **Deadweight Loss (DWL)**: The triangular area bounded by $f'(e)$, the wage line $w$, and the vertical lines at $e_{SC}$ and $e^*$ represents the lost allocative efficiency due to the sharecropping contract.

### 3.2 The Cheung Response (Efficient Sharecropping)

Steven Cheung (1969) challenged the Marshallian view. He argued that if landlords can monitor the tenant's effort and specify it explicitly within a legally or socially binding contract, sharecropping can achieve the first-best efficiency.

#### The Model
The landlord offers a contract specifying a pair $(s, e^c)$, where $e^c$ is the mandated effort level. If the tenant fails to provide $e^c$, they are evicted. The landlord sets $e^c = e^*$ and adjusts the share $s$ and any fixed transfers such that the tenant’s participation constraint (Individual Rationality constraint) is just met:

$$s f(e^*) - we^* \ge \bar{u}$$

where $\bar{u}$ is the tenant’s reservation utility (the utility from their next best alternative, such as wage labor in the city).

Under perfect monitoring and contract enforcement, the landlord will choose $e^c = e^*$ to maximize the total surplus, extracting the residual via the contract parameters. Hence, sharecropping is efficient.

#### Critique of Cheung
In developing agricultural markets, effort is highly unobservable. Agricultural tasks (weeding, pest control, water management) are spatially dispersed and temporally extended, making continuous monitoring prohibitively expensive. Consequently, the Cheung assumption of perfect effort observability rarely holds in practice.

---

### 3.3 Risk Sharing as an Explanation for Sharecropping

If sharecropping is Marshallian-inefficient and monitoring is imperfect, why does it persist? The classic explanation relies on a trade-off between **incentives** and **insurance** (risk-sharing) when tenants are risk-averse.

#### The Model Setup
* **Output** is stochastic and depends on both effort $e$ and a random weather shock $\theta$:

  $$Y = e + \theta$$

  where $\theta \sim N(0, \sigma^2)$.
* **The Landlord** is risk-neutral.
* **The Tenant** is risk-averse with a utility function exhibiting Constant Absolute Risk Aversion (CARA):

  $$U(I, e) = -\exp\left( -A \left[ I - v(e) \right] \right)$$

  where:
  * $I$ is the tenant’s income.
  * $A > 0$ is the coefficient of absolute risk aversion.
  * $v(e) = \frac{1}{2} c e^2$ is the cost of effort (with $c > 0$).
* **The Contract** is linear:

  $$I = s Y - R$$

  where $s \in [0,1]$ is the tenant's share of output, and $R$ is a fixed payment (if $R > 0$, rent paid to landlord; if $R < 0$, a base wage paid to the tenant).

#### Tenant's Decision
For a CARA utility function and normally distributed income, maximizing expected utility is equivalent to maximizing the mean-variance certainty equivalent:

$$\max_{e} E[I] - \frac{1}{2} A \text{Var}(I) - v(e)$$

Substitute the income equation:

$$E[I] = s e - R$$

$$\text{Var}(I) = \text{Var}(s(e + \theta) - R) = s^2 \sigma^2$$

Thus, the tenant maximizes:

$$\max_{e} \left[ s e - R - \frac{1}{2} A s^2 \sigma^2 - \frac{1}{2} c e^2 \right]$$

The First-Order Condition with respect to $e$ yields the **Incentive Compatibility (IC) Constraint**:

$$s - c e = 0 \implies e(s) = \frac{s}{c}$$

Note that effort $e(s)$ is strictly increasing in the tenant’s share $s$.

#### Landlord's Optimization Problem
The risk-neutral landlord maximizes expected profit:

$$\max_{s, R} E[\Pi] = E[Y - I] = e - s e + R$$

subject to two constraints:
1. **Incentive Compatibility (IC)**: $e = \frac{s}{c}$
2. **Individual Rationality (IR)**: The tenant's certainty equivalent must be at least their reservation utility $\bar{u}$:

   $$s e - R - \frac{1}{2} A s^2 \sigma^2 - \frac{1}{2} c e^2 \ge \bar{u}$$

Since the landlord wants to maximize profit, the IR constraint must bind. We can solve for $R$ from the binding IR constraint:

$$R = s e - \frac{1}{2} A s^2 \sigma^2 - \frac{1}{2} c e^2 - \bar{u}$$

Substitute $R$ into the landlord’s expected profit function:

$$E[\Pi] = e - s e + \left( s e - \frac{1}{2} A s^2 \sigma^2 - \frac{1}{2} c e^2 - \bar{u} \right)$$

$$E[\Pi] = e - \frac{1}{2} c e^2 - \frac{1}{2} A s^2 \sigma^2 - \bar{u}$$

Now, substitute the IC constraint $e = \frac{s}{c}$ into the profit function:

$$E[\Pi] = \frac{s}{c} - \frac{1}{2} c \left(\frac{s}{c}\right)^2 - \frac{1}{2} A s^2 \sigma^2 - \bar{u}$$

$$E[\Pi] = \frac{s}{c} - \frac{s^2}{2c} - \frac{1}{2} A s^2 \sigma^2 - \bar{u}$$

To find the optimal share $s^*$, take the derivative of $E[\Pi]$ with respect to $s$ and set it to zero:

$$\frac{d E[\Pi]}{d s} = \frac{1}{c} - \frac{s}{c} - A s \sigma^2 = 0$$

Multiply the entire equation by $c$:

$$1 - s - A c s \sigma^2 = 0 \implies 1 = s (1 + A c \sigma^2)$$

$$s^* = \frac{1}{1 + A c \sigma^2}$$

#### Analytical Implications of $s^*$
* **Pure Fixed Rent ($s^* = 1$)**: Occurs if $A = 0$ (tenant is risk-neutral) or $\sigma^2 = 0$ (no agricultural risk). The tenant bears all the risk but has first-best incentives.
* **Pure Wage Labor ($s^* = 0$)**: Occurs as risk aversion $A \to \infty$ or risk variance $\sigma^2 \to \infty$. The tenant is fully insulated from risk but has zero incentive to exert effort.
* **Sharecropping ($0 < s^* < 1$)**: Occurs when both risk aversion and risk variance are positive ($A > 0, \sigma^2 > 0$). Sharecropping emerges as the second-best optimal contract, balancing the trade-off between providing incentives (which requires high $s$) and providing insurance (which requires low $s$).

---

### 3.4 Limited Liability and Wealth Constraints

An alternative explanation for sharecropping does not rely on risk aversion. Under **limited liability**, a poor tenant cannot pay rent if output falls below a certain threshold. This wealth constraint prevents the landlord from extracting rent using standard fixed-rent contracts.

#### The Model (Shetty 1988, Sengupta 1997)
* Consider a risk-neutral tenant and a risk-neutral landlord.
* Output can take two values:
  * High: $Y_H$ with probability $p(e)$
  * Low: $Y_L$ with probability $1 - p(e)$
  * Assume $p'(e) > 0, p''(e) < 0$. Effort cost is $e$.
* The tenant has zero initial wealth and must be guaranteed a minimum subsistence consumption level $M$ in every state of nature (Limited Liability Constraint).
* A contract consists of payments to the landlord in each state: $(R_H, R_L)$.

#### Constraints
1. **Limited Liability Constraint (LLC)**:
   The tenant’s payoff in any state cannot fall below $M$. Assuming $M = 0$:

   $$Y_L - R_L \ge 0 \implies R_L \le Y_L$$

   $$Y_H - R_H \ge 0 \implies R_H \le Y_H$$

2. **Tenant's Incentive Compatibility (IC)**:
   The tenant chooses $e$ to maximize expected net payoff:

   $$\max_{e} p(e)(Y_H - R_H) + (1-p(e))(Y_L - R_L) - e$$

   The FOC is:

   $$p'(e) \left[ (Y_H - R_H) - (Y_L - R_L) \right] = 1$$

   Let $\Delta Y = Y_H - Y_L$ and $\Delta R = R_H - R_L$. The FOC becomes:

   $$p'(e) \left[ \Delta Y - \Delta R \right] = 1$$

#### The Impact of Tenant Wealth
If the tenant is wealthy, they can tolerate negative returns in bad states. The landlord can set $R_L > Y_L$ (using the tenant's wealth as collateral) and lower $R_H$ to keep $\Delta Y - \Delta R$ high, encouraging the efficient effort level $e^*$ while extracting all surplus.

If the tenant is asset-poor, the LLC binds in the bad state:

$$R_L = Y_L$$

The IC constraint becomes:

$$p'(e) [ Y_H - R_H ] = 1$$

To induce high effort $e$, the landlord must leave a large return in the high state to the tenant, meaning $R_H$ must be low. If the landlord increases $R_H$ to extract more rent, the tenant's incentive to exert effort drops ($\Delta Y - \Delta R$ decreases), causing effort to fall below the first-best level ($e < e^*$).

Thus, when tenants are poor, the landlord face a trade-off between extracting rent and maintaining effort incentives. This friction generates sharecropping-like outcomes (where both parties' payoffs depend on the state of nature) even when both parties are completely risk-neutral.

---

### 3.5 Screening and Heterogeneity

When landlords cannot observe tenant ability (adverse selection), offering a menu of tenancy contracts can act as a screening mechanism to sort tenants.

#### The Model
Suppose there are two types of tenants:
* **High-ability tenants** ($\theta_H$) with agricultural output $Y_H = \theta_H f(e)$
* **Low-ability tenants** ($\theta_L$) with agricultural output $Y_L = \theta_L f(e)$, where $\theta_H > \theta_L$.

The landlord offers a menu of contracts:
1. **Contract 1 (Fixed Rent)**: High fixed rent $R$, but the tenant retains $100\%$ of the marginal output ($s=1$).
2. **Contract 2 (Sharecropping)**: No fixed rent ($R=0$), but the tenant keeps only a share $s < 1$ of the output.

#### Self-Selection Mechanics
* **High-ability tenants** expect high yields. They prefer the fixed-rent contract because they keep the high residual return and do not have to share their superior output with the landlord.
* **Low-ability tenants** expect lower yields. They cannot afford the high fixed rent $R$ and prefer the sharecropping contract, which protects them in case of low yields.

By offering this menu, the landlord induces self-selection, matching high-ability tenants with high-incentive, high-risk contracts, and low-ability tenants with lower-incentive, shared-risk contracts.

---

## 4. Land Reform

Given the widespread inefficiencies in agrarian contracts and the high concentration of land ownership, land reform is a central policy tool in development economics.

### 4.1 The Inverse Relationship Between Farm Size and Productivity

A robust empirical finding across many developing countries (first systematically noted by Amartya Sen in 1962) is the **inverse relationship between farm size and productivity per acre**: smaller farms consistently produce higher yields per hectare than larger farms.

```
Yield per Hectare
  ^
  |  \
  |   \
  |    \
  |     \
  |      \
  |       \
  |        \
  +-------------------------------------> Farm Size (Hectares)
```

#### Theoretical Explanations

#### 1. Labor Supervision Costs
Large farms rely heavily on hired wage labor. Hired workers have little incentive to work diligently unless supervised. Let $H$ be hired labor and $F$ be family labor. The effective labor input $L_E$ is:

$$L_E = F + \alpha(S) H$$

where $S$ is supervision effort exerted by the owner, and $\alpha(S)$ is the efficiency of hired labor, with $\alpha'(S) > 0$ and $\alpha(0) < 1$.

Supervising hired labor is costly, which increases the effective cost of labor on large farms. In contrast, small family farms rely on family labor ($F$), which requires no supervision ($\alpha = 1$). Family members also share in the farm's residual profits, giving them high natural incentives. Consequently, small farms apply more labor per hectare, resulting in higher yields.

#### 2. Credit Market Imperfections
While small farms are more labor-efficient, they are often credit-constrained. Large landowners have formal land titles that can be used as collateral, giving them access to cheaper credit:

$$i_{\text{large}} < i_{\text{small}}$$

This allows large farms to purchase more capital-intensive inputs (fertilizers, tractors, high-yield seed varieties). However, this capital-labor substitution does not always offset the labor-quality advantage of small, family-run farms, maintaining the inverse relationship.

#### 3. Market Failures and Dual Labor Markets
If rural labor markets are imperfect, family labor may face a shadow wage $w_F$ that is lower than the market wage $w_H$ paid to hired labor:

$$w_F < w_H$$

Because family members cannot easily find off-farm employment, they over-allocate their labor to their own small plots. They work until the marginal product of labor equals their low shadow wage:

$$f'(e_{\text{family}}) = w_F < w_H = f'(e_{\text{large}})$$

Since $f''(e) < 0$, small farms apply more labor per unit of land, leading to higher output per acre.

---

### 4.2 Redistributive Land Reform

The inverse relationship between farm size and productivity suggests a rare win-win in economic policy: **redistributive land reform can improve both equity and efficiency.**

```
   [ Land Redistribution ]
             |
             v
   [ Breakup of Large Estates ] -------> [ Elimination of Hired Labor Supervision Costs ]
             |                                                  |
             v                                                  v
   [ Creation of Small Family Farms ] --> [ Increased Labor Application & Higher Yields ]
```

#### Economic Arguments
1. **Elimination of Marshallian Inefficiency**: Transferring ownership to former sharecroppers increases their output share from $s < 1$ to $s = 1$. This raises their labor effort to the socially optimal level ($e^*$).
2. **Elimination of Supervision Costs**: Breaking up large estates that rely on hired labor into small, owner-cultivated family plots eliminates supervision costs, raising aggregate agricultural output.
3. **Collateral and Credit Access**: Providing ownership titles to poor households gives them collateral, helping them access formal credit markets and escape debt traps.

#### Political Economy and Implementation Barriers
Despite its economic benefits, land reform is politically difficult to implement.
* **Landowner Opposition**: Landed elites hold substantial political power and can block, delay, or dilute land reform legislation.
* **Evasion and "Paper Divorces"**: Landlords often bypass land ceiling laws (laws limiting the maximum land one household can own) by registering portions of their land under the names of relatives, employees, or fictitious entities.
* **De-tenanting**: To avoid future claims on their land, landlords may pre-emptively evict tenants and convert their land to self-cultivation using machinery or casual wage labor, worsening rural poverty.

---

### 4.3 Tenancy Reform

When full ownership redistribution is politically impossible, governments often turn to tenancy reform. These reforms typically focus on two main policies:
1. **Rent Control**: Capping the share of output that the landlord can extract (e.g., setting the maximum landlord share $r$ to $25\%$, so the tenant's share $s$ rises to $75\%$).
2. **Security of Tenure**: Legally protecting tenants from arbitrary eviction, often granting them permanent cultivation rights that can be passed down to heirs.

#### Economic Analysis of Tenancy Reform

Let us model the dynamic incentives of a tenant under different policy regimes.

Let production over two periods ($t = 1, 2$) be:

$$Y_t = f(e_t, k)$$

where $e_t$ is labor effort in period $t$, and $k$ is a long-term capital investment (e.g., soil conservation, irrigation digging) made by the tenant in period 1 at cost $C(k)$.

#### Scenario A: No Security of Tenure
The landlord can evict the tenant at the end of period 1 with probability $(1 - \pi)$. If evicted, the tenant loses the returns on their investment $k$ in period 2. The tenant's expected lifetime utility is:

$$V = \left[ s f(e_1, k) - w e_1 - C(k) \right] + \beta \left[ \pi s f(e_2, 0) + (1-\pi) \bar{u} - w e_2 \right]$$

where $\beta \in (0,1)$ is the discount factor.

Because the tenant faces eviction risk ($\pi < 1$), their incentive to invest in long-term soil improvements $k$ is low:

$$\frac{\partial V}{\partial k} = s \frac{\partial f(e_1, k)}{\partial k} - C'(k) = 0 \implies \text{suboptimal } k$$

#### Scenario B: Tenancy Reform (Security of Tenure and Rent Control)
The reform legally guarantees tenure security ($\pi \to 1$) and increases the tenant's share $s$ to $s_{\text{reform}} > s$.

The tenant's objective function becomes:

$$V_{\text{reform}} = \left[ s_{\text{reform}} f(e_1, k) - w e_1 - C(k) \right] + \beta \left[ s_{\text{reform}} f(e_2, k) - w e_2 \right]$$

The FOC with respect to investment $k$ is:

$$s_{\text{reform}} \left[ \frac{\partial f(e_1, k)}{\partial k} + \beta \frac{\partial f(e_2, k)}{\partial k} \right] = C'(k)$$

Because $s_{\text{reform}} > s$ and the tenant is secure in their tenure ($\pi = 1$), the returns on investment are internalized over both periods. This leads to a substantial increase in investment $k^*$ and labor effort $e_t^*$, boosting agricultural productivity.

#### The Eviction Threat as an Incentive Device (Bardhan and Singh 1987)
While security of tenure increases long-term investment incentives, it can sometimes reduce short-term effort incentives if landlords were previously using eviction threats to motivate tenants.

If a landlord cannot observe effort, they can use a threat of eviction if output falls below a threshold $Y_{\text{min}}$ as an incentive device:

$$\text{Eviction Probability} = 
\begin{cases} 
0 & \text{if } Y \ge Y_{\text{min}} \\ 
1 - \pi & \text{if } Y < Y_{\text{min}} 
\end{cases}$$

If the government bans evictions, this incentive tool is lost. Unless the tenant's crop share $s$ is increased enough to compensate for the lost threat, short-term effort may fall. This highlights the importance of pairing tenure security with rent control (increasing $s$) to ensure productivity rises.

#### Empirical Evidence: Operation Barga (West Bengal, India)
A classic empirical study of tenancy reform is **Operation Barga**, launched in West Bengal in 1978 by a newly elected left-wing coalition government.

* **The Reform**: The program quickly registered more than 1.5 million sharecroppers (*bargadars*), guaranteeing them permanent cultivation rights and capping the landlord's crop share at $25\%$ (leaving $75\%$ to the tenant).
* **The Outcome**: Empirical studies (e.g., Banerjee, Gertler, and Ghatak, 2002) found that Operation Barga led to a significant increase in agricultural productivity. The combination of secure tenure and higher output shares stimulated tenant effort and investment in tube wells and improved seeds, accelerating agricultural growth in West Bengal relative to neighboring states.

