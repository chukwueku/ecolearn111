const fs = require('fs');

const markdownContent = `
# COMPREHENSIVE STATISTICAL ECONOMICS STUDY GUIDE

## CHAPTER 1: Introduction

**1.1 What is Econometrics?**
Econometrics applies statistical and mathematical methods to analyze economic data, test theories, and forecast future trends. It acts as an empirical bridge, translating abstract theoretical models into quantifiable, testable hypotheses using observational data.

**1.2 Methodology of Econometrics**
1. **Statement of hypothesis**: Example: Keynesian consumption function postulates a positive relationship between consumption and income.
2. **Specification of the mathematical model**: $$ Y = \\beta_1 + \\beta_2 X $$
3. **Specification of the statistical (econometric) model**: To account for unobservable factors, a stochastic error term $u$ is introduced: 
   $$ Y_i = \\beta_1 + \\beta_2 X_i + u_i $$
4. **Data collection**: Gathering observational macro or micro data.
5. **Estimation of parameters**: Using methods like OLS.
6. **Hypothesis testing**: Using t-tests and F-tests.
7. **Forecasting or prediction**.

**1.3 Types of Data**
| Data Type | Description |
|-----------|-------------|
| **Time Series** | Observations on variables over time (e.g., GDP over 50 years). Prone to autocorrelation. |
| **Cross-Sectional** | Observations at a single point in time across multiple entities (e.g., income across 50 states in 2020). Prone to heteroscedasticity. |
| **Panel Data** | Cross-sectional data tracked over time, providing multiple dimensional observations. |

---

## CHAPTER 2: Descriptive Statistics

**2.1 Central Tendency**
Measures of central location indicate where the data is centered.
- **Mean**: $$ \\bar{X} = \\frac{1}{n} \\sum_{i=1}^n X_i $$
- **Median**: The middle value when sorted.
- **Mode**: The most frequent value.

**2.2 Dispersion**
Dispersion measures the spread of the data around the central value.
- **Variance**: Population variance $\\sigma^2$ and sample variance $s^2$:
  $$ s^2 = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})^2 $$
- **Standard Deviation**: $$ s = \\sqrt{s^2} $$

**2.3 Covariance and Correlation**
These measure the linear association between two variables.
- **Sample Covariance**: 
  $$ Cov(X,Y) = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})(Y_i - \\bar{Y}) $$
- **Sample Correlation Coefficient ($r$)**: Standardizes covariance between -1 and 1.
  $$ r = \\frac{Cov(X,Y)}{s_X s_Y} = \\frac{\\sum (X_i - \\bar{X})(Y_i - \\bar{Y})}{\\sqrt{\\sum (X_i - \\bar{X})^2 \\sum (Y_i - \\bar{Y})^2}} $$

\`\`\`chart
{
  "type": "scatter",
  "title": "Figure 2.1: Positive Correlation between Income and Consumption",
  "xAxis": "Income ($)",
  "yAxis": "Consumption ($)",
  "data": [
    {"Income": 30000, "Consumption": 25000},
    {"Income": 40000, "Consumption": 32000},
    {"Income": 50000, "Consumption": 38000},
    {"Income": 60000, "Consumption": 44000},
    {"Income": 70000, "Consumption": 50000},
    {"Income": 80000, "Consumption": 54000}
  ],
  "series": [
    {"key": "Consumption", "name": "Households"}
  ]
}
\`\`\`

---

## CHAPTER 3: Probability and Distributions

**3.1 Basic Probability Concepts**
Probability models quantify randomness.
- **Addition Rule**: $$ P(A \\cup B) = P(A) + P(B) - P(A \\cap B) $$
- **Conditional Probability**: $$ P(A|B) = \\frac{P(A \\cap B)}{P(B)} $$

**3.2 Expected Value and Variance**
For a discrete random variable $X$:
- **Expected Value**: $$ E(X) = \\sum x_i P(x_i) $$
- **Variance**: $$ Var(X) = E[(X - E(X))^2] = E(X^2) - [E(X)]^2 $$

**3.3 The Normal Distribution**
A cornerstone of econometrics due to the Central Limit Theorem.
A random variable follows a normal distribution with mean $\\mu$ and variance $\\sigma^2$: $X \\sim N(\\mu, \\sigma^2)$.
The Probability Density Function (PDF) is:
$$ f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2} \\left( \\frac{x-\\mu}{\\sigma} \\right)^2} $$

**3.4 Other Key Distributions**
| Distribution | Key Usage |
|-------------|-----------|
| **t-distribution** | Used for hypothesis testing of coefficients when sample size is small or population variance is unknown. |
| **Chi-square ($\\chi^2$)** | Used for testing variances and goodness-of-fit. |
| **F-distribution** | Used for jointly testing multiple restrictions (e.g., overall significance of a regression). |

---

## CHAPTER 4: Estimation Principles

**4.1 Properties of Estimators**
An estimator is a rule for calculating an estimate of a parameter (like $\\beta$) based on sample data. Good estimators possess:
1. **Unbiasedness**: $$ E(\\hat{\\beta}) = \\beta $$
2. **Efficiency**: It has the minimum variance among all unbiased estimators.
3. **Consistency**: As sample size $n \\to \\infty$, the estimate converges in probability to the true parameter: $plim(\\hat{\\beta}) = \\beta$.

**4.2 Methods of Estimation**
- **Ordinary Least Squares (OLS)**: Minimizes the sum of squared residuals.
- **Maximum Likelihood (ML)**: Maximizes the probability density function (likelihood) of the observed sample. For normal errors, ML and OLS estimators for $\\beta$ are identical.

$$ L(\\beta, \\sigma^2) = \\prod_{i=1}^n f(Y_i | X_i; \\beta, \\sigma^2) $$

---

## CHAPTER 5: Hypothesis Testing

**5.1 Null and Alternative Hypotheses**
Testing whether an independent variable significantly affects completing a dependent variable.
- $H_0: \\beta_2 = 0$ (No relationship)
- $H_1: \\beta_2 \\neq 0$ (Two-sided relationship)

**5.2 The t-Test**
To test individual coefficients:
$$ t = \\frac{\\hat{\\beta}_2 - \\beta_{2, \\text{null}}}{se(\\hat{\\beta}_2)} $$

Reject $H_0$ if $|t| > t_{\\text{critical}}$ corresponding to the chosen significance level $\\alpha$ and degrees of freedom $n-k$.

**5.3 Type I and Type II Errors**
| | $H_0$ is True | $H_0$ is False |
|---|---|---|
| **Reject $H_0$** | Type I Error (Prob = $\\alpha$) | Correct Decision (Power) |
| **Do not reject $H_0$** | Correct Decision | Type II Error (Prob = $\\beta$) |

---

## CHAPTER 6: Simple Linear Regression

**6.1 The Population Regression Function (PRF)**
$$ E(Y | X) = \\beta_1 + \\beta_2 X $$
Where $\\beta_1$ is the intercept and $\\beta_2$ is the slope coefficient.

**6.2 The Sample Regression Function (SRF) and OLS**
Because we only have a sample, we estimate:
$$ \\hat{Y}_i = \\hat{\\beta}_1 + \\hat{\\beta}_2 X_i $$
The residual is $e_i = Y_i - \\hat{Y}_i$. 
OLS minimizes the Residual Sum of Squares (RSS): $\\sum e_i^2 = \\sum (Y_i - \\hat{\\beta}_1 - \\hat{\\beta}_2 X_i)^2$.

**Taking the derivatives and setting them to zero yields the Normal Equations:**
$$ \\hat{\\beta}_2 = \\frac{\\sum(X_i - \\bar{X})(Y_i - \\bar{Y})}{\\sum(X_i - \\bar{X})^2} $$
$$ \\hat{\\beta}_1 = \\bar{Y} - \\hat{\\beta}_2 \\bar{X} $$

**6.3 The Gauss-Markov Theorem**
Under Classical Linear Regression Model assumptions, OLS estimators are **BLUE** (Best Linear Unbiased Estimators).
1. Linear in parameters
2. Random sampling
3. Zero conditional mean of error: $E(u_i | X_i) = 0$
4. Homoscedasticity: $Var(u_i | X_i) = \\sigma^2$
5. No perfect collinearity

**6.4 Goodness of Fit ($R^2$)**
Measures the proportion of variation in $Y$ explained by the model:
$$ R^2 = \\frac{ESS}{TSS} = 1 - \\frac{RSS}{TSS} $$
Where $TSS = \\sum(Y_i - \\bar{Y})^2$ and $ESS = \\sum(\\hat{Y}_i - \\bar{Y})^2$.

---

## CHAPTER 7: Multiple Regression

**7.1 The Mathematical Model**
$$ Y_i = \\beta_1 + \\beta_2 X_{2i} + \\beta_3 X_{3i} + \\dots + \\beta_k X_{ki} + u_i $$

**7.2 Interpretation of Partial Coefficients**
$\\beta_2$ measures the change in the expected value of $Y$ for a one-unit change in $X_2$, **holding all other variables constant** (ceteris paribus).

**7.3 Matrix Notation**
$$ \\mathbf{Y} = \\mathbf{X}\\boldsymbol{\\beta} + \\mathbf{u} $$
The OLS estimator in matrix form is universally written as:
$$ \\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}'\\mathbf{X})^{-1} \\mathbf{X}'\\mathbf{Y} $$
With variance-covariance matrix:
$$ Var(\\hat{\\boldsymbol{\\beta}}) = \\sigma^2 (\\mathbf{X}'\\mathbf{X})^{-1} $$

**7.4 Adjusted $R^2$ and the F-Test**
- Standard $R^2$ never decreases when new variables are added, encouraging overfitting. 
- **Adjusted $R^2$ ($\\bar{R}^2$)** penalizes for extra parameters:
  $$ \\bar{R}^2 = 1 - \\left( \\frac{RSS/(n-k)}{TSS/(n-1)} \\right) $$

**The F-Test for Overall Significance**: tests $H_0: \\beta_2 = \\beta_3 = \\dots = \\beta_k = 0$.
$$ F = \\frac{R^2 / (k-1)}{(1 - R^2) / (n-k)} $$

\`\`\`chart
{
  "type": "bar",
  "title": "Figure 7.1: R-squared vs Adjusted R-squared as Features Increase",
  "xAxis": "Number of Features (k)",
  "yAxis": "Score",
  "data": [
    {"k": "1", "R2": 0.60, "Adj_R2": 0.59},
    {"k": "2", "R2": 0.65, "Adj_R2": 0.63},
    {"k": "5", "R2": 0.70, "Adj_R2": 0.64},
    {"k": "10", "R2": 0.72, "Adj_R2": 0.58},
    {"k": "15", "R2": 0.73, "Adj_R2": 0.45}
  ],
  "series": [
    {"key": "R2", "name": "R-squared", "color": "#0ea5e9"},
    {"key": "Adj_R2", "name": "Adjusted R-squared", "color": "#f97316"}
  ]
}
\`\`\`

---

## CHAPTER 8: Problems in Regression/Specification Errors

Errors in model specification can severely damage OLS estimates.
1. **Omitted Variable Bias (OVB)**: Leaving out a relevant variable that is correlated with included independent variables leads to biased and inconsistent estimators.
   $$ E(\\tilde{\\beta}_2) = \\beta_2 + \\beta_3 \\left( \\frac{Cov(X_2, X_3)}{Var(X_2)} \\right) $$
2. **Inclusion of an Irrelevant Variable**: Results in unbiased but inefficient estimators (larger standard errors).
3. **Measurement Errors**: 
   - Measurement error in the dependent variable ($Y$) increases error variance but does not cause bias.
   - Measurement error in the independent variable ($X$) causes **attenuation bias** (coefficients biased toward zero).

---

## CHAPTER 9: Dummy Variables

**9.1 Creating Categorical Variables**
Dummy variables take values of 0 or 1 to quantify qualitative attributes (e.g., Gender, Region, Policy status).
$$ Y_i = \\beta_1 + \\beta_2 X_i + \\beta_3 D_i + u_i $$
Where $D_i = 1$ if female, $0$ if male.
- $\\beta_1$ is the base expected value for males.
- $\\beta_1 + \\beta_3$ is the expected value for females.
- $\\beta_3$ acts as an intercept shifter.

**9.2 The Dummy Variable Trap**
If a categorical variable has $m$ categories, only $m-1$ dummy variables can be included to avoid perfect multicollinearity with the intercept.

**9.3 Interaction Effects**
Dummy variables can be multiplied by continuous variables to allow the *slope* to change between categories.
$$ Y_i = \\beta_1 + \\beta_2 X_i + \\beta_3 D_i + \\beta_4 (D_i X_i) + u_i $$

---

## CHAPTER 10: Multicollinearity

**10.1 The Nature of Multicollinearity**
Occurs when explanatory variables are highly correlated with one another.
- Perfect collinearity violates classical assumptions: $(\\mathbf{X}'\\mathbf{X})$ cannot be inverted.
- Imperfect (high) collinearity does *not* violate assumptions, meaning OLS estimators remain BLUE, but it severely degrades precision.

**10.2 Consequences**
1. Standard errors become inflated, rendering t-statistics small ($H_0$ is harder to reject).
2. The overall $R^2$ and F-statistic remain high despite insignificant individual t-tests.
3. Estimators are extremely sensitive to minor changes in the data.

**The Variance Inflation Factor (VIF)** provides a diagnostic metric:
$$ VIF_j = \\frac{1}{1 - R_j^2} $$
Where $R_j^2$ is from regressing $X_j$ on all other regressors. A VIF > 10 suggests severe multicollinearity.

---

## CHAPTER 11: Heteroscedasticity

**11.1 The Nature of Heteroscedasticity**
The variance of the error term is not constant across observations:
$$ Var(u_i | X_i) = \\sigma_i^2 $$
It frequently occurs in cross-sectional data (e.g., consumption variance is higher for wealthy households than poor households).

**11.2 Consequences**
- OLS estimators remain unbiased and consistent.
- **OLS estimators are no longer efficient (loss of BLUE).**
- Standard error estimates become biased, meaning standard $t$-tests and $F$-tests are invalid and unreliable.

**11.3 Detection Methods**
- **Residual Plots**: Plotting squared residuals $\\hat{u}_i^2$ against $\\hat{Y}_i$ to visually spot widening variance cones.
- **Breusch-Pagan Test**: Regress $\\hat{u}_i^2$ on explanatory variables.
- **White's General Test**: Regresses squared residuals on regressors, their squares, and cross-products. Does not assume a specific form of heteroscedasticity.

**11.4 Remedies**
1. **White's Heteroscedasticity-Consistent Standard Errors**: Also known as Robust Standard Errors. Corrects the variance matrix without altering the coefficient estimates.
   $$ \\widehat{Var}_{\\text{robust}}(\\hat{\\beta}) = (\\mathbf{X}'\\mathbf{X})^{-1} (\\mathbf{X}'\\mathbf{\\Omega}\\mathbf{X}) (\\mathbf{X}'\\mathbf{X})^{-1} $$
2. **Weighted Least Squares (WLS)**: If $\\sigma_i^2$ is known or estimated, divide variables by $\\sigma_i$ (transforming the data) to restore homoscedasticity.

\`\`\`chart
{
  "type": "scatter",
  "title": "Figure 11.1: Visualizing Heteroscedasticity (Cone Shape)",
  "xAxis": "Income",
  "yAxis": "Residuals (u)",
  "data": [
    {"Income": 1000, "Residuals": 50}, {"Income": 1100, "Residuals": -45},
    {"Income": 2000, "Residuals": 150}, {"Income": 2100, "Residuals": -120},
    {"Income": 4000, "Residuals": -300}, {"Income": 4200, "Residuals": 400},
    {"Income": 6000, "Residuals": 650}, {"Income": 6500, "Residuals": -800}
  ],
  "series": [
    {"key": "Residuals", "name": "Errors"}
  ]
}
\`\`\`

---

## CHAPTER 12: Autocorrelation

**12.1 The Nature of Autocorrelation**
Error terms in one period are correlated with error terms in subsequent periods, typically found in time-series data due to inertia, sluggish adjustment, or data smoothing.
$$ E(u_t u_s) \\neq 0 \\quad \\text{for } t \\neq s $$

**AR(1) Model of Errors**:
$$ u_t = \\rho u_{t-1} + \\epsilon_t \\quad \\text{where } -1 < \\rho < 1 $$

**12.2 Consequences**
Similar to heteroscedasticity:
- OLS estimators remain unbiased, but **lose efficiency**.
- Estimated variances are severely biased downward.
- t-statistics are artificially inflated, projecting phantom significance.

**12.3 Detection**
- **Durbin-Watson $d$ Statistic**: 
  $$ d = \\frac{\\sum_{t=2}^T (e_t - e_{t-1})^2}{\\sum_{t=1}^T e_t^2} \\approx 2(1 - \\hat{\\rho}) $$
  - If $d \\approx 2$: No autocorrelation.
  - If $d \\approx 0$: Severe positive autocorrelation.
- **Breusch-Godfrey LM Test**: Allows testing for higher-order AR(p) processes.

**12.4 Remedies**
1. **Newey-West Standard Errors (HAC)**: Heteroscedasticity and Autocorrelation Consistent standard errors correct the $t$-statistics.
2. **Generalized Least Squares (GLS)**: e.g., the Cochrane-Orcutt iterative procedure transform the model to eliminate the serial correlation.
3. Replace the static model with a **Dynamic Model** (e.g., adding lagged dependent variables).

---
*End of Statistical Economics / Econometrics Summary*
`;

const targetFile = 'src/lib/advancedStudyData.ts';
let content = fs.readFileSync(targetFile, 'utf8');

// We use a regex to match from "ug-statistical": ` to the end of the file.
const regex = /"ug-statistical"\s*:\s*\\`[\\s\\S]*?\\};/m;
const match = content.match(regex);
if (match) {
    const newContent = content.replace(regex, '"ug-statistical": \\`\\n' + markdownContent + '\\n\\`\\n};');
    fs.writeFileSync(targetFile, newContent);
    console.log('Successfully updated ug-statistical in advancedStudyData.ts');
} else {
    console.log('Could not find ug-statistical block');
}
