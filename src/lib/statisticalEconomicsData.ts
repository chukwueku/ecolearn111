export const STATISTICAL_ECONOMICS_GUIDE = `# SCHAUM'S COMPREHENSIVE STUDY Companion FOR STATISTICAL ECONOMICS
*Based on Salvatore & Reagle's Theory and Problems of Statistics and Econometrics*

---

## Chapter 1: Introduction

### 1.1 The Nature of Statistics
Statistics is the mathematical science concerned with the collection, presentation, analysis, and interpretation of numerical data. It is fundamentally divided into:
- **Descriptive Statistics**: Summarizes and visualizes key characteristics of a dataset (e.g., mean, median, standard deviation, relative frequency tables, histograms, and scatter plots) to describe what the data shows without making inferences beyond the sample.
- **Inferential Statistics**: Uses sample data to draw generalizations, make predictions, and test hypotheses about a larger population. It relies on probability theory to account for sampling error and uncertainty.

### 1.2 Statistics and Econometrics
While statistics provides general tools for data analysis, **Econometrics** is a specialized field that applies these tools to economic phenomena:
- **Economic Theory** makes qualitative claims (e.g., "an increase in price reduces demand").
- **Mathematical Economics** formalizes these claims into deterministic equations (e.g., $Q = \\beta_0 - \\beta_1 P$).
- **Econometrics** introduces a stochastic dimension by adding an error term (e.g., $Q = \\beta_0 - \\beta_1 P + u$) to estimate parameters, test hypotheses, and make forecasts using noisy, real-world empirical data.

\`\`\`
+-------------------------------------------------------------+
|                     ECONOMIC THEORY                         |
|                 (Qualitative Hypotheses)                    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                  MATHEMATICAL ECONOMICS                     |
|                (Deterministic Equations)                    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                        ECONOMETRICS                         |
|                (Stochastic Error Modeling)                  |
+-------------------------------------------------------------+
\`\`\`

### 1.3 The Methodology of Econometrics
Economic modeling follows a highly structured, eight-step scientific workflow:
1. **Statement of Theory**: Formulating a behavioral assertion (e.g., Keynesian consumption hypothesis).
2. **Mathematical Specification**: Writing the deterministic relation: $Y = \\beta_0 + \\beta_1 X$ where $0 < \\beta_1 < 1$.
3. **Stochastic Specification**: Adding the disturbance term: $Y = \\beta_0 + \\beta_1 X + u$.
4. **Data Acquisition**: Gathering representative data (cross-sectional, time-series, or panel).
5. **Parameter Estimation**: Computing numerical estimates ($\\hat{\\beta}_0, \\hat{\\beta}_1$) using OLS or other estimators.
6. **Hypothesis Testing**: Performing statistical tests (e.g., t-tests) to verify if the estimates support the theory.
7. **Forecasting**: Predicting future values of $Y$ given assumed configurations of $X$.
8. **Policy Recommendation**: Using the model to design optimal structural policies based on estimated elasticities.

---

## Chapter 2: Descriptive Statistics

### 2.1 Frequency Distributions
Raw statistical observations are unstructured. To analyze them, we construct:
- **Frequency Distributions**: Grouping raw data into mutually exclusive class intervals with defined lower and upper class limits.
- **Class Boundaries and Midpoints**: True limits that eliminate measurement gaps, and class marks (midpoints) used for grouped calculations: $X_i = \\frac{\\text{Lower Limit} + \\text{Upper Limit}}{2}$.
- **Graphical Representations**:
  - **Histograms**: Vertical bars representing frequencies across class intervals.
  - **Frequency Polygons**: Line graphs connecting class midpoints.
  - **Ogives**: Line graphs showing cumulative frequencies, crucial for determining percentiles.

### 2.2 Measures of Central Tendency
Central tendency identifies the representative value of a dataset:
- **Arithmetic Mean ($\\bar{X}$)**: 
  - *Ungrouped*: $\\bar{X} = \\frac{\\sum X_i}{n}$
  - *Grouped*: $\\bar{X} = \\frac{\\sum f_i X_i}{\\sum f_i}$
- **Median**: The middle value when sorted. For grouped data:
  $$\\text{Median} = L + \\left( \\frac{\\frac{N}{2} - F}{f_m} \\right) c$$
  Where $L$ is the lower boundary of the median class, $F$ is the cumulative frequency of the preceding class, $f_m$ is the median class frequency, and $c$ is the interval width.
- **Mode**: The most frequent value. For grouped data:
  $$\\text{Mode} = L + \\left( \\frac{d_1}{d_1 + d_2} \\right) c$$
  Where $d_1 = f_m - f_{m-1}$ and $d_2 = f_m - f_{m+1}$.
- **Weighted Mean ($\\bar{X}_w$)**: $\\bar{X}_w = \\frac{\\sum w_i X_i}{\\sum w_i}$ (e.g., stock index returns, cost of capital).
- **Geometric Mean ($G$)**: Used for growth rates and compounding returns: $G = \\sqrt[n]{X_1 \\cdot X_2 \\cdots X_n}$.
- **Harmonic Mean ($H$)**: Used for average ratios (e.g., average price-to-earnings ratios): $H = \\frac{n}{\\sum \\frac{1}{X_i}}$.

### 2.3 Measures of Dispersion
Dispersion metrics quantify the spread of observations around their central value:
- **Range**: Difference between the maximum and minimum values.
- **Mean Deviation**: $\\text{MD} = \\frac{\\sum |X_i - \\bar{X}|}{n}$.
- **Sample Variance ($s^2$)**: Computed with Bessel's correction ($n-1$) for unbiasedness:
  - *Ungrouped*: $s^2 = \\frac{\\sum (X_i - \\bar{X})^2}{n - 1}$
  - *Grouped*: $s^2 = \\frac{\\sum f_i (X_i - \\bar{X})^2}{N - 1}$
- **Standard Deviation ($s$)**: Absolute measure of dispersion: $s = \\sqrt{s^2}$.
- **Coefficient of Variation ($V$)**: Unit-free relative measure: $V = \\frac{s}{\\bar{X}} \\times 100\\%$. It allows comparison of volatility between different assets.

### 2.4 Shape of Frequency Distributions
- **Skewness**: Asymmetry of the distribution.
  - Pearson's Coefficient: $SK = \\frac{3(\\bar{X} - \\text{Median})}{s}$.
  - $SK > 0 \\implies$ Right-skewed (Mean > Median > Mode).
  - $SK < 0 \\implies$ Left-skewed (Mean < Median < Mode).
- **Kurtosis**: Peakedness or tail weight of a distribution.
  - **Leptokurtic**: Highly peaked, heavy tails (Kurtosis $> 3$).
  - **Mesokurtic**: Normal distribution peak (Kurtosis $= 3$).
  - **Platykurtic**: Flat peak, light tails (Kurtosis $< 3$).

\`\`\`simulator
{
  "mode": "descriptive_stats",
  "title": "Interactive Descriptive Statistics Calculator"
}
\`\`\`

---

## Chapter 3: Probability and Probability Distributions

### 3.1 Probability of a Single Event
Probability measures the likelihood that an event will occur, bounded between $0$ and $1$.
- **Classical (A Priori) Probability**: $P(A) = \\frac{\\text{Number of outcomes favorable to } A}{\\text{Total number of equally likely outcomes}}$.
- **Relative Frequency (Empirical) Probability**: Bounded limit of historical occurrence as the trials approach infinity.
- **Subjective Probability**: Personal belief or expert judgment of an event's likelihood.

### 3.2 Probability of Multiple Events
- **Addition Rule (OR)**: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. If mutually exclusive, $P(A \\cap B) = 0$.
- **Multiplication Rule (AND)**: $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$. If independent, $P(A \\cap B) = P(A) \\cdot P(B)$.
- **Bayes' Theorem**: Updates a priori probabilities based on new information:
  $$P(A_i \\mid B) = \\frac{P(B \\mid A_i) P(A_i)}{\\sum_{j} P(B \\mid A_j) P(A_j)}$$

### 3.3 Discrete Probability Distributions: The Binomial Distribution
Applies to independent trials with binary outcomes (success/failure) and constant probability of success $p$:
- **Probability Mass Function**: $P(X = x) = \\binom{n}{x} p^x q^{n-x}$ where $q = 1-p$.
- **Mean & Variance**: $\\mu = np$ and $\\sigma^2 = npq$.
- *Example*: Default probability of independent bonds in a portfolio.

### 3.4 The Poisson Distribution
Models the number of events occurring within a specified interval of time or space:
- **Probability Mass Function**: $P(X = x) = \\frac{e^{-\\lambda} \\lambda^x}{x!}$ where $\\lambda$ is the mean arrival rate.
- **Mean & Variance**: $\\mu = \\lambda$ and $\\sigma^2 = \\lambda$.
- *Example*: Number of bank transactions or customer arrivals per hour.

### 3.5 Continuous Probability Distributions: The Normal Distribution
The standard symmetrical bell curve governing much of statistical economics:
- **Probability Density Function**: Standardized using the $Z$-score: $Z = \\frac{X - \\mu}{\\sigma}$.
- **Empirical Rule**:
  - $P(\\mu - \\sigma < X < \\mu + \\sigma) \\approx 68.27\\%$
  - $P(\\mu - 2\\sigma < X < \\mu + 2\\sigma) \\approx 95.45\\%$
  - $P(\\mu - 3\\sigma < X < \\mu + 3\\sigma) \\approx 99.73\\%$

\`\`\`simulator
{
  "mode": "probability",
  "title": "Interactive Probability Distribution Visualizer"
}
\`\`\`

---

## Chapter 4: Statistical Inference: Estimation

### 4.1 Sampling
- **Sampling Methods**: Simple Random, Systematic, Stratified (grouping by attributes before drawing), and Cluster sampling.
- **Central Limit Theorem (CLT)**: If the sample size $n$ is sufficiently large ($n \\ge 30$), the sampling distribution of the sample mean $\\bar{X}$ will be approximately normally distributed, regardless of the underlying population distribution:
  $$\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

### 4.2 Sampling Distribution of the Mean
- **Expected Value**: $E[\\bar{X}] = \\mu$ (unbiased).
- **Standard Error**: $\\sigma_{\\bar{X}} = \\frac{\\sigma}{\\sqrt{n}}$.
- **Finite Population Correction (FPC)**: Used if sample size is a large fraction ($>5\\%$) of a finite population $N$:
  $$\\sigma_{\\bar{X}} = \\frac{\\sigma}{\\sqrt{n}} \\sqrt{\\frac{N-n}{N-1}}$$

### 4.3 Estimation Using the Normal Distribution
- **Point Estimator Properties**:
  1. **Unbiasedness**: $E[\\hat{\\theta}] = \\theta$.
  2. **Efficiency**: Unbiased estimator with the smallest variance (Best Linear Unbiased Estimator - BLUE).
  3. **Consistency**: $\\hat{\\theta}$ converges to $\\theta$ in probability as $n \\to \\infty$ ($\\text{plim } \\hat{\\theta}_n = \\theta$).
  4. **Sufficiency**: Utilizes all sample information.
- **Confidence Intervals (Large Sample, $\\sigma$ known)**:
  $$\\bar{X} - Z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} \\le \\mu \\le \\bar{X} + Z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$$
  Common critical values: $Z_{0.05} = 1.96$ (95%), $Z_{0.01} = 2.58$ (99%).

### 4.4 Confidence Intervals Using the t Distribution
If sample size is small ($n < 30$), population is normal, and population standard deviation $\\sigma$ is unknown, we use Student's $t$ distribution with $\\text{df} = n - 1$:
$$\\bar{X} - t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}} \\le \\mu \\le \\bar{X} + t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$$

\`\`\`simulator
{
  "mode": "statistical_inference",
  "title": "Interactive Confidence Interval Simulator"
}
\`\`\`

---

## Chapter 5: Statistical Inference: Testing Hypotheses

### 5.1 Testing Hypotheses
- **Hypotheses**: Null Hypothesis ($H_0$) versus Alternative Hypothesis ($H_1$).
- **Errors in Decision Making**:
  - **Type I Error ($\\alpha$)**: Rejecting $H_0$ when it is true. Level of significance.
  - **Type II Error ($\\beta$)**: Failing to reject $H_0$ when it is false.
  - **Power of the Test**: $1 - \\beta$, the probability of correctly rejecting a false null hypothesis.
- **Decision Criteria**: One-tailed (directional) vs. Two-tailed (non-directional) rejection regions.

### 5.2 Testing Population Means and Proportions
- **Mean ($Z$-test or $t$-test)**:
  $$Z_{\\text{calc}} = \\frac{\\bar{X} - \\mu_0}{\\sigma / \\sqrt{n}} \\quad \\text{or} \\quad t_{\\text{calc}} = \\frac{\\bar{X} - \\mu_0}{s / \\sqrt{n}}$$
- **Proportion ($Z$-test)**:
  $$Z_{\\text{calc}} = \\frac{\\hat{p} - p_0}{\\sqrt{\\frac{p_0(1-p_0)}{n}}}$$

### 5.3 Differences Between Two Means or Proportions
- **Difference of Means (Independent Samples)**:
  $$t = \\frac{(\\bar{X}_1 - \\bar{X}_2) - D_0}{\\sqrt{s_p^2 \\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}} \\quad \\text{where} \\quad s_p^2 = \\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}$$
- **Difference of Proportions**:
  $$Z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\bar{p}(1-\\bar{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}} \\quad \\text{where} \\quad \\bar{p} = \\frac{x_1 + x_2}{n_1 + n_2}$$

### 5.4 Chi-Square ($\\chi^2$) Tests
- **Goodness of Fit**: Checks if observed frequencies fit a theoretical distribution:
  $$\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i} \\quad \\text{with } \\text{df} = k - 1 - p$$
- **Test of Independence**: Analyzes relationship in contingency tables:
  $$\\chi^2 = \\sum \\frac{(O_{ij} - E_{ij})^2}{E_{ij}} \\quad \\text{with } \\text{df} = (r-1)(c-1)$$

### 5.5 Analysis of Variance (ANOVA)
Tests the equality of multiple population means by partitioning total variance:
- **Partitioning Sum of Squares**: $\\text{SST (Total)} = \\text{SSB (Between Groups)} + \\text{SSW (Within Groups)}$.
- **ANOVA Table Layout**:
  - Between Groups Variance (MSB) $= \\text{SSB} / (c - 1)$.
  - Within Groups Variance (MSW) $= \\text{SSW} / (n - c)$.
  - Test Statistic: $F = \\frac{\\text{MSB}}{\\text{MSW}}$ distributed with degrees of freedom $\\text{df}_1 = c-1$ and $\\text{df}_2 = n-c$.

### 5.6 Nonparametric Testing
Used when population distributions cannot be assumed normal:
- **Sign Test**: Based on signs of differences.
- **Wilcoxon Signed-Rank Test**: Incorporates ranks of differences for paired data.
- **Kruskal-Wallis Test**: Nonparametric alternative to One-Way ANOVA.
- **Kolmogorov-Smirnov Test**: Tests goodness of fit for continuous distributions.

\`\`\`simulator
{
  "mode": "hypothesis_testing",
  "title": "Interactive Hypothesis & ANOVA Testing Engine"
}
\`\`\`

---

## STATISTICS EXAMINATION
*Rigorous review of descriptive statistics, probability, estimation, and hypothesis testing*

### Problem 1: Weighted Average Cost of Capital (WACC)
**Question**: A firm is financed with $40\\%$ Debt (cost of debt $= 6\\%$) and $60\\%$ Equity (cost of equity $= 15\\%$). Calculate the WACC.
**Solution**:
$$\\text{WACC} = w_d \\cdot r_d + w_e \\cdot r_e = 0.40(6\\%) + 0.60(15\\%) = 2.4\\% + 9.0\\% = 11.4\\%$$

### Problem 2: Grouped Median Income
**Question**: Given the grouped data: Class 10-20 ($f=5$), Class 20-30 ($f=15$), Class 30-40 ($f=10$). Calculate the median boundary.
**Solution**:
Total $N = 30$, half $N/2 = 15$. The median class is 20-30 ($L=20$, $F=5$, $f_m=15$, $c=10$).
$$\\text{Median} = 20 + \\left(\\frac{15 - 5}{15}\\right) 10 = 20 + \\frac{10}{15} \\times 10 \\approx 26.67$$

### Problem 3: Bayes' Default Probability
**Question**: $2\\%$ of corporate bonds default ($P(D) = 0.02$). If a bond defaults, it is rated high-risk with probability $90\\%$ ($P(HR \\mid D) = 0.90$). If a bond does not default, it is rated high-risk with probability $5\\%$ ($P(HR \\mid D') = 0.05$). Find $P(D \\mid HR)$.
**Solution**:
$$P(D \\mid HR) = \\frac{P(HR \\mid D)P(D)}{P(HR \\mid D)P(D) + P(HR \\mid D')P(D')} = \\frac{(0.90)(0.02)}{(0.90)(0.02) + (0.05)(0.98)} = \\frac{0.018}{0.018 + 0.049} \\approx 26.87\\%$$

### Problem 4: Standard Error with Finite Correction
**Question**: A sample of $n = 100$ is drawn from a company of $N = 500$ employees. If $\\sigma = 20$, calculate the adjusted standard error of the mean.
**Solution**:
$$\\sigma_{\\bar{X}} = \\frac{20}{\\sqrt{100}} \\sqrt{\\frac{500 - 100}{500 - 1}} = 2 \\times \\sqrt{\\frac{400}{499}} = 2 \\times 0.8954 \\approx 1.79$$

### Problem 5: Critical Value Determination
**Question**: For a two-tailed t-test with $n = 16$ and significance level $\\alpha = 0.05$, find the critical value $t_{\\text{crit}}$.
**Solution**:
Degrees of freedom $\\text{df} = 16 - 1 = 15$. Looking up a two-tailed probability of $0.05$ on $15$ degrees of freedom yields:
$$t_{\\text{crit}} = \\pm 2.131$$

---

## Chapter 6: Simple Regression Analysis

### 6.1 The Two-Variable Linear Model
Relates dependent variable $Y$ to single explanatory variable $X$:
- **Population Regression Function (PRF)**: $Y_i = \\beta_0 + \\beta_1 X_i + u_i$
- **Sample Regression Function (SRF)**: $Y_i = \\hat{\\beta}_0 + \\hat{\\beta}_1 X_i + \\hat{u}_i$
- **Stochastic Error Term ($u_i$)**: Captures omitted variables, measurement error, and human randomness.
- **Classical Gauss-Markov Assumptions**:
  1. **Linearity**: The model is linear in parameters: $Y_i = \\beta_0 + \\beta_1 X_i + u_i$.
  2. **Non-Stochastic $X$**: Explanatory variables are fixed in repeated sampling; $E[u_i \\mid X_i] = 0$.
  3. **Zero Mean of Errors**: $E[u_i] = 0$.
  4. **Homoscedasticity**: Constant error variance: $\\text{Var}(u_i) = \\sigma^2$.
  5. **No Autocorrelation**: No correlation between error terms: $\\text{Cov}(u_i, u_j) = 0$ for $i \\neq j$.
  6. **Normality**: Errors are normally distributed: $u_i \\sim N(0, \\sigma^2)$ (for hypothesis testing).

### 6.2 The Ordinary Least-Squares (OLS) Method
Derives estimates by minimizing the sum of squared residuals: $\\sum \\hat{u}_i^2 = \\sum (Y_i - \\hat{\\beta}_0 - \\hat{\\beta}_1 X_i)^2$.
- **Slope Estimator ($\\hat{\\beta}_1$)**:
  $$\\hat{\\beta}_1 = \\frac{\\sum (X_i - \\bar{X})(Y_i - \\bar{Y})}{\\sum (X_i - \\bar{X})^2} = \\frac{n \\sum X_i Y_i - \\sum X_i \\sum Y_i}{n \\sum X_i^2 - (\\sum X_i)^2}$$
- **Intercept Estimator ($\\hat{\\beta}_0$)**:
  $$\\hat{\\beta}_0 = \\bar{Y} - \\hat{\\beta}_1 \\bar{X}$$
- **Gauss-Markov Theorem**: Under the classical assumptions, the OLS estimators are **BLUE** (Best Linear Unbiased Estimators).

### 6.3 Tests of Significance of Parameter Estimates
- **Standard Error of $\\hat{\\beta}_1$**:
  $$\\text{se}(\\hat{\\beta}_1) = \\frac{s_{e}}{\\sqrt{\\sum (X_i - \\bar{X})^2}} \\quad \\text{where} \\quad s_{e}^2 = \\frac{\\sum \\hat{u}_i^2}{n - 2}$$
- **Significance Testing**:
  $$H_0: \\beta_1 = 0 \\quad \\text{vs.} \\quad H_1: \\beta_1 \\neq 0$$
  $$t_{\\text{calc}} = \\frac{\\hat{\\beta}_1}{\\text{se}(\\hat{\\beta}_1)} \\quad \\text{with } \\text{df} = n - 2$$

### 6.4 Goodness of Fit and Correlation
- **Decomposition of Sum of Squares**: $\\text{TSS} = \\text{ESS} + \\text{RSS}$
  - Total Sum of Squares: $\\text{TSS} = \\sum (Y_i - \\bar{Y})^2$.
  - Explained Sum of Squares: $\\text{ESS} = \\sum (\\hat{Y}_i - \\bar{Y})^2$.
  - Residual Sum of Squares: $\\text{RSS} = \\sum \\hat{u}_i^2$.
- **Coefficient of Determination ($R^2$)**: Bounded between $0$ and $1$, measures the proportion of variance in $Y$ explained by $X$:
  $$R^2 = \\frac{\\text{ESS}}{\\text{TSS}} = 1 - \\frac{\\text{RSS}}{\\text{TSS}}$$
- **Correlation Coefficient ($r$)**: Measures the strength and direction of linear association: $r = \\pm \\sqrt{R^2}$.

\`\`\`simulator
{
  "mode": "simple_regression",
  "title": "Interactive Two-Variable OLS Regression Simulator"
}
\`\`\`

---

## Chapter 7: Multiple Regression Analysis

### 7.1 The Three-Variable Linear Model
Extends the analysis to model a dependent variable using two or more explanatory variables:
$$Y_i = \\beta_0 + \\beta_1 X_{1i} + \\beta_2 X_{2i} + u_i$$
- **Partial Regression Coefficients**: $\\beta_1$ measures the change in $Y$ per unit change in $X_1$, holding $X_2$ constant.

### 7.2 Tests of Significance of Parameter Estimates
Individual parameter estimates are tested using the t-statistic:
$$H_0: \\beta_j = 0 \\quad \\text{vs.} \\quad H_1: \\beta_j \\neq 0$$
$$t_{\\text{calc}} = \\frac{\\hat{\\beta}_j}{\\text{se}(\\hat{\\beta}_j)} \\quad \\text{with } \\text{df} = n - k$$
Where $k$ is the total number of estimated parameters (including the intercept).

### 7.3 Coefficient of Multiple Determination ($R^2$)
As independent variables are added, $R^2$ will always increase, even if the new variables have no real explanatory power. To correct for this, we compute the **Adjusted $R^2$ ($\\bar{R}^2$)**:
$$\\bar{R}^2 = 1 - \\left( (1 - R^2) \\frac{n - 1}{n - k} \\right)$$

### 7.4 Test of Overall Significance
To test the joint hypothesis that all slope coefficients are simultaneously zero ($H_0: \\beta_1 = \\beta_2 = \\dots = 0$), we use the overall F-test:
$$F_{\\text{calc}} = \\frac{\\text{ESS} / (k - 1)}{\\text{RSS} / (n - k)} = \\frac{R^2 / (k - 1)}{(1 - R^2) / (n - k)}$$
If $F_{\\text{calc}} > F_{\\text{crit}}$, we reject the null hypothesis and conclude that the model has overall explanatory power.

### 7.5 Partial Correlation Coefficients
Evaluate the correlation between $Y$ and $X_1$ after removing the linear influence of $X_2$:
$$r_{y1.2} = \\frac{r_{y1} - r_{y2} r_{12}}{\\sqrt{(1 - r_{y2}^2)(1 - r_{12}^2)}}$$

### 7.6 Matrix Notation
For $n$ observations and $k$ parameters, the model is:
$$Y = X\\beta + u$$
$$\\hat{\\beta} = (X'X)^{-1} X'Y$$
The variance-covariance matrix of the estimators is:
$$\\text{Var}(\\hat{\\beta}) = \\sigma^2 (X'X)^{-1}$$

\`\`\`simulator
{
  "mode": "multiple_regression",
  "title": "Interactive Multiple Linear Regression Engine"
}
\`\`\`

---

## Chapter 8: Further Techniques and Applications in Regression Analysis

### 8.1 Functional Forms in Regression
OLS requires parameters to be linear, but variables can take non-linear functional forms:
- **Log-Log (Double-Log)**: $\\ln Y_i = \\beta_0 + \\beta_1 \\ln X_i + u_i$. Here, $\\beta_1$ is the constant elasticity of $Y$ with respect to $X$.
- **Log-Lin (Semilog)**: $\\ln Y_i = \\beta_0 + \\beta_1 X_i + u_i$. The slope coefficient $\\beta_1$ is the relative change (growth rate) in $Y$ for an absolute change in $X$: $\\% \\Delta Y = (\\beta_1 \\times 100) \\Delta X$.
- **Lin-Log**: $Y_i = \\beta_0 + \\beta_1 \\ln X_i + u_i$. The slope $\\beta_1$ measures the absolute change in $Y$ for a relative percentage change in $X$: $\\Delta Y = (\\beta_1 / 100) \\% \\Delta X$.
- **Reciprocal**: $Y_i = \\beta_0 + \\beta_1 (1/X_i) + u_i$. As $X \\to \\infty$, $Y$ approaches the horizontal asymptote $\\beta_0$.

### 8.2 Dummy Variables
Used to model qualitative factors (e.g., gender, region, policy shifts) that take values of $0$ or $1$.
- **The Dummy Variable Trap**: If a qualitative factor has $m$ categories, we must only include $m-1$ dummy variables if the model has an intercept, to avoid perfect multicollinearity.
- **Structural Breaks**: Using dummy variables to test if coefficients change across sub-periods (e.g., pre- versus post-economic reform).

### 8.3 Distributed Lag Models
Regress the dependent variable on current and past (lagged) values of independent variables:
$$Y_t = \\alpha + \\beta_0 X_t + \\beta_1 X_{t-1} + \\dots + \\beta_p X_{t-p} + u_t$$
- **The Koyck Transformation**: Assumes that the lag weights decline geometrically over time ($\\beta_k = \\beta_0 \\lambda^k$ where $0 < \\lambda < 1$). The transformed model simplifies to:
  $$Y_t = \\alpha(1-\\lambda) + \\beta_0 X_t + \\lambda Y_{t-1} + v_t$$

### 8.4 Forecasting
Using an estimated model to predict future values:
- **Mean Forecast (Point Prediction)**: Estimating the expected value $E[Y_0 \\mid X_0]$.
- **Individual Forecast**: Predicting a specific future value $Y_0$ for a given $X_0$. It has a larger forecast variance because it includes the variance of the error term $u_0$.

### 8.5 Binary Choice Models
Used when the dependent variable $Y$ is qualitative and binary ($0$ or $1$):
- **Linear Probability Model (LPM)**: $Y_i = \\beta_0 + \\beta_1 X_i + u_i$. Modeled as a standard OLS regression.
  - *Drawbacks*: Probabilities can fall outside the $[0,1]$ range, and error terms are heteroscedastic.
- **Logit Model**: Uses the cumulative logistic distribution:
  $$P_i = \\frac{e^{Z_i}}{1 + e^{Z_i}} \\quad \\text{where} \\quad Z_i = \\beta_0 + \\beta_1 X_i$$
- **Probit Model**: Uses the standard normal cumulative distribution function:
  $$P_i = \\Phi(Z_i) = \\int_{-\\infty}^{Z_i} \\frac{1}{\\sqrt{2\\pi}} e^{-t^2/2} dt$$

### 8.6 Interpretation of Binary Choice Models
- In the **Logit** model, the natural log of the odds ratio is linear: $\\ln(P_i / (1-P_i)) = \\beta_0 + \\beta_1 X_i$.
- Slope coefficients in Logit and Probit models do not measure the marginal effect directly; marginal effects depend on the level of the explanatory variables.

---

## Chapter 9: Problems in Regression Analysis

### 9.1 Multicollinearity
Occurs when two or more independent variables are highly correlated with each other:
- **Consequences**: Estimates remain unbiased, but their standard errors become large. This leads to low t-statistics, making variables appear insignificant even if the overall model has a high $R^2$.
- **Detection**: High pairwise correlations ($r > 0.8$), and a high **Variance Inflation Factor (VIF)**:
  $$\\text{VIF}_j = \\frac{1}{1 - R_j^2}$$
  A VIF $> 10$ indicates severe multicollinearity.
- **Remedies**: Drop one of the collinear variables, obtain more data, or use principal component analysis.

### 9.2 Heteroscedasticity
Occurs when the variance of the error term is not constant: $\\text{Var}(u_i) = \\sigma_i^2$.
- **Consequences**: OLS estimates remain unbiased, but they are no longer efficient (not BLUE). Standard errors are biased, rendering standard hypothesis testing invalid.
- **Detection**:
  - **Goldfeld-Quandt Test**: Formulated by splitting the sample into two groups based on the size of an independent variable and comparing their residual variances: $F = \\text{RSS}_2 / \\text{RSS}_1$.
  - **Breusch-Pagan Test**: Regressing squared residuals on independent variables to test for systematic patterns: $\\Theta = n \\cdot R_{\\text{aux}}^2 \\sim \\chi^2(m)$.
- **Remedies**: Use **Weighted Least Squares (WLS)** or estimate **White's Robust Standard Errors** to make statistical inference valid.

### 9.3 Autocorrelation
Occurs when error terms are correlated over time: $\\text{Cov}(u_t, u_{t-1}) = \\rho \\sigma^2$. This is common in time-series data.
- **Consequences**: Estimates remain unbiased, but standard errors are biased downward, inflating t-statistics and leading to false-positive conclusions of significance.
- **Detection**:
  - **Durbin-Watson ($d$) Test**: Designed to test for first-order ($AR(1)$) autocorrelation:
    $$d \\approx 2(1 - \\hat{\\rho})$$
    A value of $d \\approx 2$ indicates no autocorrelation, $d \\approx 0$ positive, and $d \\approx 4$ negative autocorrelation.
  - **Breusch-Godfrey LM Test**: A more general test that can accommodate higher-order lags and lagged dependent variables.
- **Remedies**: Apply the **Cochrane-Orcutt** transformation or use **Newey-West HAC Robust Standard Errors**.

### 9.4 Errors in Variables
Occurs when independent or dependent variables are measured with error.
- Measurement error in the dependent variable increases the residual variance but does not bias coefficients.
- Measurement error in an independent variable ($X_i$) causes **attenuation bias**, driving the estimated slope coefficient towards zero.

\`\`\`simulator
{
  "mode": "autocorrelation",
  "title": "Interactive Durbin-Watson Autocorrelation Bound Detector"
}
\`\`\`

---

## Chapter 10: Simultaneous-Equations Methods

### 10.1 Simultaneity Bias
Occurs when independent variables are determined simultaneously with the dependent variable, creating endogeneity:
$$Y_{1i} = \\alpha_0 + \\alpha_1 Y_{2i} + \\beta_1 X_{1i} + u_{1i}$$
$$Y_{2i} = \\gamma_0 + \\gamma_1 Y_{1i} + \\beta_2 X_{2i} + u_{2i}$$
Here, $Y_2$ is endogenous and correlated with the error term $u_1$, causing OLS estimates to be biased and inconsistent.

### 10.2 Identification
Before estimation, we must determine if a structural equation's parameters can be estimated from the reduced-form equations.
- **The Order Condition (Necessary)**: An equation is identified if:
  $$K - k \\ge m - 1$$
  Where $K$ is the total number of predetermined variables in the entire system, $k$ is the number of predetermined variables in the equation, and $m$ is the number of endogenous variables in the equation.
  - If $K - k > m - 1$, the equation is **Overidentified**.
  - If $K - k = m - 1$, the equation is **Just Identified**.
  - If $K - k < m - 1$, the equation is **Unidentified**.

### 10.3 Indirect Least Squares (ILS)
If an equation is just identified, we can estimate its parameters by:
1. Writing the reduced-form equations (expressing endogenous variables purely in terms of exogenous variables).
2. Estimating the reduced-form coefficients using OLS.
3. Solving for the structural coefficients from the estimated reduced-form parameters.

### 10.4 Two-Stage Least Squares (2SLS)
If an equation is overidentified, ILS is not possible. We use **2SLS** instead:
- **Stage 1**: Run OLS regressions of the endogenous variables on all predetermined variables in the system to obtain the fitted values ($\\hat{Y}_2$). This isolates the exogenous variation.
- **Stage 2**: Substitute the fitted values ($\\hat{Y}_2$) into the structural equation in place of the original endogenous variables ($Y_2$), and estimate the parameters using OLS.

---

## Chapter 11: Time-Series Methods

### 11.1 Stochastic Processes
A time-series dataset is a realization of a underlying stochastic process.
- **Stationarity**: A process is weakly stationary if its mean, variance, and autocovariance are constant over time.
- **Nonstationarity**: If a time-series has a trend, its mean or variance changes over time, which can lead to **spurious regressions** (high $R^2$ but no actual relationship).

### 11.2 ARMA and ARIMA Models
- **Autoregressive ($AR(p)$)**: $Y_t = c + \\phi_1 Y_{t-1} + \\dots + \\phi_p Y_{t-p} + \\epsilon_t$.
- **Moving Average ($MA(q)$)**: $Y_t = c + \\epsilon_t + \\theta_1 \\epsilon_{t-1} + \\dots + \\theta_q \\epsilon_{t-q}$.
- **ARMA(p,q)**: Combines AR and MA components.
- **ARIMA(p,d,q)**: Integrates differencing ($d$ times) to achieve stationarity before applying ARMA.

### 11.3 Unit Roots and Random Walks
- **Random Walk**: $Y_t = Y_{t-1} + \\epsilon_t$. A nonstationary process where shock effects are permanent.
- **Random Walk with Drift**: $Y_t = c + Y_{t-1} + \\epsilon_t$. It exhibits a deterministic linear trend.

### 11.4 Testing for Unit Roots
To test if a series is nonstationary ($H_0$: unit root present), we use the **Dickey-Fuller (DF)** or **Augmented Dickey-Fuller (ADF)** tests, which regress the first difference on lagged values:
$$\\Delta Y_t = \\delta Y_{t-1} + \\sum \\alpha_i \\Delta Y_{t-i} + \\epsilon_t$$
We test $H_0: \\delta = 0$ using non-standard Dickey-Fuller critical values.

### 11.5 Cointegration and Error Correction
- **Cointegration**: If two nonstationary series ($Y_t$ and $X_t$) are both integrated of order $1$, but their linear combination is stationary, they are cointegrated. This indicates a long-run equilibrium relationship.
- **Error Correction Model (ECM)**: Corrects for short-run deviations from the long-run cointegrated equilibrium:
  $$\\Delta Y_t = \\beta_0 + \\beta_1 \\Delta X_t + \\alpha (Y_{t-1} - \\gamma X_{t-1}) + \\epsilon_t$$
  Where $\\alpha$ is the speed of adjustment parameter (must be negative).

### 11.6 Granger Causality
A time-series variable $X_t$ is said to **Granger-cause** $Y_t$ if incorporating historical values of $X$ improves the forecast of $Y$ compared to using historical values of $Y$ alone:
$$Y_t = \\sum \\alpha_i Y_{t-i} + \\sum \\beta_j X_{t-j} + u_t$$
We test the joint hypothesis $H_0: \\beta_1 = \\beta_2 = \\dots = 0$ using an F-test.

---

## Chapter 12: Computer Applications in Econometrics

### 12.1 Data Formats and Importing
Econometric analyses use several data structures:
- **CSV (Comma Separated Values)**: Universal plain-text format for structured datasets.
- **Spreadsheets**: Row-column data layout, easily imported into econometric software.

### 12.2 Microsoft Excel
Excel is widely used for basic descriptive statistics and simple regression:
- **Analysis ToolPak**: Provides quick tools for running summary statistics, ANOVA, correlation, and OLS regression.

### 12.3 Eviews
Eviews is a specialized econometric package with a graphical interface and command line:
- Excellent for time-series modeling, unit root testing, and forecasting.
- Commands include \`ls y c x\` for OLS regression and \`uroot\` for ADF unit root testing.

### 12.4 SAS (Statistical Analysis System)
SAS is a powerful programming language used for large-scale data analysis:
- **PROC REG**: Used to run multiple regressions and diagnostic tests.
- **PROC AUTOREG**: Specifically designed to estimate regressions with autoregressive errors and ARCH volatility modeling.

---

## ECONOMETRICS EXAMINATION
*Comprehensive test of multiple regression, functional forms, simultaneous equations, and time-series*

### Problem 1: Manual Two-Variable Regression
**Question**: Find the OLS regression slope $\\hat{\\beta}_1$ given the five coordinate points: $(1,2), (2,3), (3,5), (4,4), (5,6)$.
**Solution**:
Calculate the sample means: $\\bar{X} = 3$ and $\\bar{Y} = 4$.
Calculate deviations and their products:
- $X - \\bar{X} = [-2, -1, 0, 1, 2]$
- $Y - \\bar{Y} = [-2, -1, 1, 0, 2]$
- $\\sum (X_i - \\bar{X})^2 = 4 + 1 + 0 + 1 + 4 = 10$.
- $\\sum (X_i - \\bar{X})(Y_i - \\bar{Y}) = 4 + 1 + 0 + 0 + 4 = 9$.
$$\\hat{\\beta}_1 = \\frac{9}{10} = 0.9$$
$$\\hat{\\beta}_0 = \\bar{Y} - \\hat{\\beta}_1 \\bar{X} = 4 - 0.9(3) = 1.3$$
The estimated regression model is:
$$\\hat{Y} = 1.3 + 0.9X$$

### Problem 2: Adjusted $R^2$ Calculation
**Question**: An OLS model with $n = 31$ observations and $k = 4$ parameters yields $R^2 = 0.80$. Compute the Adjusted $R^2$.
**Solution**:
$$\\bar{R}^2 = 1 - \\left( (1 - 0.80) \\frac{31 - 1}{31 - 4} \\right) = 1 - \\left( 0.20 \\times \\frac{30}{27} \\right) = 1 - 0.2222 = 0.7778 \\quad (77.78\\%)$$

### Problem 3: Variance Inflation Factor (VIF)
**Question**: A regression of housing prices includes two highly correlated variables. Regressing $X_1$ on $X_2$ yields an auxiliary $R_j^2 = 0.95$. Calculate the VIF.
**Solution**:
$$\\text{VIF} = \\frac{1}{1 - 0.95} = \\frac{1}{0.05} = 20$$
Since $\\text{VIF} = 20 > 10$, we conclude that severe multicollinearity is present.

### Problem 4: Koyck Lag Speed of Adjustment
**Question**: An estimated Koyck model is $Y_t = 12.5 + 0.6 X_t + 0.4 Y_{t-1}$. Find the speed of adjustment.
**Solution**:
The parameter $\\lambda = 0.4$. The speed of adjustment is given by:
$$\\text{Speed of Adjustment} = 1 - \\lambda = 1 - 0.4 = 0.6 \\quad (60\\% \\text{ adjustment per period})$$

### Problem 5: Granger Causality F-Test
**Question**: To test if asset prices Granger-cause money supply, an unrestricted model with 2 lags is estimated, yielding $\\text{RSS}_{\\text{unrestricted}} = 150$ ($n = 45$). The restricted model (omitting asset price lags) yields $\\text{RSS}_{\\text{restricted}} = 180$. Run the F-test.
**Solution**:
The number of restrictions $q = 2$. The unrestricted parameters $k = 5$.
$$F = \\frac{(\\text{RSS}_R - \\text{RSS}_U) / q}{\\text{RSS}_U / (n - k)} = \\frac{(180 - 150) / 2}{150 / (45 - 5)} = \\frac{15}{3.75} = 4.0$$
Since $F_{\\text{calc}} = 4.0 > F_{\\text{crit}, 0.05, 2, 40} \\approx 3.23$, we reject the null hypothesis and conclude that asset prices Granger-cause money supply.
`;
