export const ADVANCED_STUDY_GUIDE: Record<string, string> = {
  "ug-econometrics": `
# COMPREHENSIVE ECONOMETRICS STUDY GUIDE

*Based on Gujarati's Basic Econometrics Table of Contents*

## PART I: SINGLE-EQUATION REGRESSION MODELS

### CHAPTER 1: The Nature of Regression Analysis

As mentioned in the Introduction, regression is a main tool of econometrics, and in this chapter we consider very briefly the nature of this tool.

#### 1.1 Historical Origin of the Term *Regression*
The term *regression* was introduced by Francis Galton. In a famous paper, Galton found that, although there was a tendency for tall parents to have tall children and for short parents to have short children, the average height of children born of parents of a given height tended to move or "regress" toward the average height in the population as a whole. In other words, the height of the children of unusually tall or unusually short parents tends to move toward the average height of the population. Galton's law of universal regression was confirmed by his friend Karl Pearson, who collected more than a thousand records of heights of members of family groups. He found that the average height of sons of a group of tall fathers was less than their fathers' height and the average height of sons of a group of short fathers was greater than their fathers' height, thus "regressing" tall and short sons alike toward the average height of all men. In the words of Galton, this was "regression to mediocrity."

#### 1.2 The Modern Interpretation of Regression
The modern interpretation of regression is, however, quite different. Broadly speaking, we may say:
> Regression analysis is concerned with the study of the dependence of one variable, the *dependent variable*, on one or more other variables, the *explanatory variables*, with a view to estimating and/or predicting the (population) mean or average value of the former in terms of the known or fixed (in repeated sampling) values of the latter.

**Examples:**

**1. Galton's Law of Universal Regression:** Predicting the average height of sons knowing the height of their fathers.
\`\`\`chart
{
  "type": "scatter",
  "title": "Figure 1.1: Hypothetical distribution of sons' heights corresponding to given heights of fathers",
  "xAxis": "father_height",
  "yAxis": "son_height",
  "data": [
    {"father_height": 60, "son_height": 59}, {"father_height": 60, "son_height": 63}, {"father_height": 60, "son_height": 67},
    {"father_height": 65, "son_height": 60}, {"father_height": 65, "son_height": 65}, {"father_height": 65, "son_height": 70},
    {"father_height": 70, "son_height": 62}, {"father_height": 70, "son_height": 67}, {"father_height": 70, "son_height": 72},
    {"father_height": 75, "son_height": 64}, {"father_height": 75, "son_height": 69}, {"father_height": 75, "son_height": 73}
  ],
  "series": [
    {"key": "son_height", "name": "Sons' Heights", "color": "#3b82f6"}
  ]
}
\`\`\`
*(The line connecting the mean or average height of sons corresponding to a given height of the father is known as the regression line).*

**2. Boys' Heights vs. Age:** Predicting the average height of boys given their fixed ages.

**3. Marginal Propensity to Consume (MPC):** Studying the dependence of personal consumption expenditure on after-tax or disposable real personal income.

**4. Price Elasticity of Demand:** A monopolist estimating the response of the demand for a product to changes in price.

**5. Phillips Curve:** A labor economist studying the rate of change of money wages in relation to the unemployment rate.
\`\`\`chart
{
  "type": "scatter",
  "title": "Figure 1.3: Hypothetical Phillips curve",
  "xAxis": "unemployment_rate",
  "yAxis": "wage_change_rate",
  "data": [
    {"unemployment_rate": 2, "wage_change_rate": 8},
    {"unemployment_rate": 3, "wage_change_rate": 5},
    {"unemployment_rate": 4, "wage_change_rate": 3},
    {"unemployment_rate": 5, "wage_change_rate": 1},
    {"unemployment_rate": 6, "wage_change_rate": 0},
    {"unemployment_rate": 7, "wage_change_rate": -1},
    {"unemployment_rate": 8, "wage_change_rate": -2}
  ],
  "series": [
    {"key": "wage_change_rate", "name": "Rate of change of money wages", "color": "#ef4444"}
  ]
}
\`\`\`

**6. Money Holding vs. Inflation Rate ($\pi$):** Predicting the proportion $k$ of income held in money based on inflation expectations.

$$
k = \\frac{Money}{Income}
$$


**7. Advertising Elasticity of Demand:** Predicting the percent change in demand in response to a 1 percent change in the advertising budget.

**8. Crop Yield Analysis:** Agronomist predicting the average crop yield given temperature, rainfall, amount of sunshine, and fertilizer.

#### 1.3 Statistical versus Deterministic Relationships
In regression analysis, we are concerned with *statistical*, not *functional* or *deterministic*, dependence among variables.
- **Statistical relationships** essentially deal with **random** or **stochastic** variables, that is, variables that have probability distributions. We cannot predict crop yield exactly because of errors involved in measuring temperature, rainfall, etc. Thus, there is intrinsic random variability.
- **Deterministic relationships** deal with relationships of the type exhibited by Newton's law of gravity:

$$
F = k \\frac{m_1 m_2}{r^2}
$$

where $F = force$, $m_1, m_2 = masses$, $r = distance$, and $k = constant$. These are not the focus of econometrics unless explicit measurement errors render them statistical.

#### 1.4 Regression versus Causation
Although regression analysis deals with the dependence of one variable on other variables, it does *not* necessarily imply causation. In the words of Kendall and Stuart, "A statistical relationship, however strong and however suggestive, can never establish causal connection: our ideas of causation must come from outside statistics, ultimately from some theory or other."

For example, crop yield is dependent on rainfall (common sense dictates crop yield cannot control rainfall). Causation must be ascribed using *a priori* or theoretical considerations.

#### 1.5 Regression versus Correlation
Closely related to but conceptually very different from regression analysis is **correlation analysis**.
- **Correlation Analysis**: The primary objective is to measure the *strength* or *degree of linear association* between two variables. Variables are treated *symmetrically*; there is no distinction between dependent and explanatory variables. Both variables are assumed to be random (stochastic).
- **Regression Analysis**: The primary objective is to estimate or predict the average value of one variable on the basis of the fixed values of other variables. There is an *asymmetry*: the dependent variable is assumed to be statistical (stochastic or random), whereas the explanatory variables are fixed (non-stochastic in repeated sampling).

#### 1.6 Terminology and Notation
In the literature, the terms *dependent variable* and *explanatory variable* are described variously. A representative list is:

| Dependent variable | Explanatory variable |
| :--- | :--- |
| Explained variable | Independent variable |
| Predictand | Predictor |
| Regressand | Regressor |
| Response | Stimulus |
| Endogenous | Exogenous |
| Outcome | Covariate |
| Controlled variable | Control variable |

*In this text, we will typically use the dependent variable/explanatory variable or the more neutral regressand and regressor terminology.* Note: If there is one explanatory variable, it is **simple** or **two-variable** regression. If there are multiple, it is **multiple regression analysis**.

#### 1.7 The Nature and Sources of Data for Economic Analysis
The success of any econometric analysis ultimately depends on the availability of the appropriate data. Three types of data may be available for empirical analysis:

**Types of Data**
1. **Time Series Data**: A set of observations on the values that a variable takes at different times. Such data may be collected at regular time intervals, such as *daily* (stock prices, weather reports), *weekly* (money supply figures), *monthly* (the unemployment rate, the Consumer Price Index (CPI)), *quarterly* (GDP), *annually* (government budgets), *quinquennially* (every 5 years, e.g., census of manufactures), or *decennially* (every 10 years, e.g., census of population). 
   - A major issue with time series data is **stationarity**. Loosely speaking, a time series is stationary if its mean and variance do not vary systematically over time.
   
\`\`\`chart
{
  "type": "line",
  "title": "Figure 1.5: M1 money supply: United States, 1951:01–1999:09",
  "xAxis": "year",
  "yAxis": "m1_supply",
  "data": [
    {"year": 55, "m1_supply": 130},
    {"year": 60, "m1_supply": 140},
    {"year": 65, "m1_supply": 160},
    {"year": 70, "m1_supply": 200},
    {"year": 75, "m1_supply": 280},
    {"year": 80, "m1_supply": 400},
    {"year": 85, "m1_supply": 600},
    {"year": 90, "m1_supply": 800},
    {"year": 95, "m1_supply": 1100}
  ],
  "series": [
    {"key": "m1_supply", "name": "M1 Money Supply (Billions)", "color": "#10b981"}
  ]
}
\`\`\`

2. **Cross-Section Data**: Data on one or more variables collected *at the same point in time*, such as the census of population conducted by the Census Bureau every 10 years, or opinion polls.
   - A major issue here is **heterogeneity**. To include heterogeneous units in a statistical analysis, the **size** or **scale effect** must be taken into account so as not to mix apples with oranges.
   
3. **Pooled Data**: In pooled, or combined, data are elements of both time series and cross-section data. For instance, recording the egg production and prices for 50 states over two years.
   - **Panel, Longitudinal, or Micropanel Data**: This is a special type of pooled data in which the *same* cross-sectional unit (say, a family or a firm) is surveyed over time.

**The Sources of Data**
The data used in empirical analysis may be collected by a governmental agency (e.g., the Department of Commerce), an international agency (e.g., the IMF or World Bank), a private organization (e.g., Standard & Poor's), or an individual. 

Data collected by various agencies may be **experimental** or **nonexperimental**.
- *Experimental data*: Collected while holding certain factors constant to assess the impact of some factors on a given phenomenon (common in natural sciences).
- *Nonexperimental data*: Data not subject to the control of the researcher (common in social sciences). This lack of control creates special problems in pinning down exact causes.

**The Accuracy of Data**
Although plenty of data are available for economic research, the quality of the data is often not that good. There are several reasons for this:
1. Observational errors, either of omission or commission.
2. Experimentally collected data errors of measurement arising from approximations and roundoffs.
3. In questionnaire-type surveys, the problem of nonresponse (leading to *sample selectivity bias*).
4. Unanswered questions of a financially sensitive nature.
5. The sampling methods used in obtaining the data may vary so widely that it is often difficult to compare the results from various samples.
6. Economic data are generally available at a highly aggregate level (e.g., GNP, inflation) which may not reveal the dynamics of the behavior of microunits.

Because of all these and many other problems, the researcher should always keep in mind that **the results of research are only as good as the quality of the data**. 

**A Note on the Measurement Scales of Variables**
The variables that we will generally encounter fall into four broad categories:
1. **Ratio Scale**: For a variable $X$, taking two values, $X_1$ and $X_2$, the ratio $X_1/X_2$ and the distance $(X_2 - X_1)$ are meaningful quantities. Most economic variables (GDP, income) belong to this category. Natural ordering (ascending/descending) exists.
2. **Interval Scale**: Satisfies the last two properties of the ratio scale variable but not the first. The distance between two time periods (2000 - 1995) is meaningful, but not the ratio (2000 / 1995).
3. **Ordinal Scale**: A variable belongs to this category only if it satisfies the property of natural ordering. Examples are grading systems (A, B, C) or income class (upper, middle, lower). 
4. **Nominal Scale**: Variables in this category have none of the features of the ratio scale variables. Variables such as gender (male/female) or marital status (married/unmarried) simply denote categories.

#### 1.8 Summary and Conclusions
1. The key idea behind regression analysis is the statistical dependence of one variable, the dependent variable, on one or more other variables, the explanatory variables.
2. The objective of such analysis is to estimate and/or predict the mean or average value of the dependent variable on the basis of the known or fixed values of the explanatory variables.
3. In practice the success of regression analysis depends on the availability of the appropriate data. This chapter discussed the nature, sources, and limitations of the data that are generally available for research, especially in the social sciences.
4. In any research, the researcher should clearly state the sources of the data used in the analysis, their definitions, their methods of collection, and any gaps or omissions in the data as well as any revisions. Keep in mind that the macroeconomic data published by the government are often revised.

### CHAPTER 2: Two-Variable Regression Analysis: Some Basic Ideas
In this chapter, we approach the subject in a more formal manner. We introduce the simplest possible regression analysis, namely, the **bivariate**, or **two-variable**, regression, where the dependent variable (regressand) is related to a single explanatory variable (regressor). Over fifty years, the linear two-variable model is the fundamental building block.

#### 2.1 A Hypothetical Example
Regression analysis is largely concerned with estimating and/or predicting the (population) mean value of the dependent variable on the basis of the known or fixed values of the explanatory variable(s).

Consider a hypothetical population of 60 families divided into 10 income groups (from \\$80 to \\$260). We examine the weekly consumption expenditure corresponding to these given income levels. There is considerable variation in weekly consumption expenditure in each income group.

If we ask the question, "What is the *expected value* of weekly consumption expenditure of a family whose monthly income is, say, \\$140?", we look at the exact conditional mean for that bracket. The knowledge of the income level enables us to better predict the mean value of consumption expenditure than if we did not have that knowledge. This probability is the essence of regression analysis.

If we join these conditional mean values against the various $X$ values, we obtain the **population regression line (PRL)**, or more generally, the **population regression curve**. 
- The adjective "population" comes from the fact that we are dealing with the entire population of 60 families. 
- Geometrically, then, a population regression curve is simply the locus of the conditional means of the dependent variable for the fixed values of the explanatory variable(s).

**TABLE 2.1** WEEKLY FAMILY INCOME $X$, \$
<div className="overflow-x-auto my-6 markdown-table">

| $Y \downarrow$ \\ $X \\rightarrow$ | 80 | 100 | 120 | 140 | 160 | 180 | 200 | 220 | 240 | 260 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Weekly family consumption expenditure $Y$, \$** | 55 | 65 | 79 | 80 | 102 | 110 | 120 | 135 | 137 | 150 |
| | 60 | 70 | 84 | 93 | 107 | 115 | 136 | 137 | 145 | 152 |
| | 65 | 74 | 90 | 95 | 110 | 120 | 140 | 140 | 155 | 175 |
| | 70 | 80 | 94 | 103 | 116 | 130 | 144 | 152 | 165 | 178 |
| | 75 | 85 | 98 | 108 | 118 | 135 | 145 | 157 | 175 | 180 |
| | – | 88 | – | 113 | 125 | 140 | – | 160 | 189 | 185 |
| | – | – | – | 115 | – | – | – | 162 | – | 191 |
| **Total** | 325 | 462 | 445 | 707 | 678 | 750 | 685 | 1043 | 966 | 1211 |
| **Conditional means of $Y$, $E(Y|X)$** | 65 | 77 | 89 | 101 | 113 | 125 | 137 | 149 | 161 | 173 |

</div>


\`\`\`chart
{
  "type": "scatter",
  "title": "Figure 2.1: Conditional distribution of expenditure for various levels of income",
  "xAxis": "weekly_income",
  "yAxis": "weekly_consumption",
  "data": [
    {"weekly_income": 80, "weekly_consumption": 55}, {"weekly_income": 80, "weekly_consumption": 60}, {"weekly_income": 80, "weekly_consumption": 65}, {"weekly_income": 80, "weekly_consumption": 70}, {"weekly_income": 80, "weekly_consumption": 75},
    {"weekly_income": 100, "weekly_consumption": 65}, {"weekly_income": 100, "weekly_consumption": 70}, {"weekly_income": 100, "weekly_consumption": 74}, {"weekly_income": 100, "weekly_consumption": 80}, {"weekly_income": 100, "weekly_consumption": 85}, {"weekly_income": 100, "weekly_consumption": 88},
    {"weekly_income": 120, "weekly_consumption": 79}, {"weekly_income": 120, "weekly_consumption": 84}, {"weekly_income": 120, "weekly_consumption": 90}, {"weekly_income": 120, "weekly_consumption": 94}, {"weekly_income": 120, "weekly_consumption": 98},
    {"weekly_income": 140, "weekly_consumption": 80}, {"weekly_income": 140, "weekly_consumption": 93}, {"weekly_income": 140, "weekly_consumption": 95}, {"weekly_income": 140, "weekly_consumption": 103}, {"weekly_income": 140, "weekly_consumption": 108}, {"weekly_income": 140, "weekly_consumption": 113}, {"weekly_income": 140, "weekly_consumption": 115},
    {"weekly_income": 160, "weekly_consumption": 102}, {"weekly_income": 160, "weekly_consumption": 107}, {"weekly_income": 160, "weekly_consumption": 110}, {"weekly_income": 160, "weekly_consumption": 116}, {"weekly_income": 160, "weekly_consumption": 118}, {"weekly_income": 160, "weekly_consumption": 125},
    {"weekly_income": 180, "weekly_consumption": 110}, {"weekly_income": 180, "weekly_consumption": 115}, {"weekly_income": 180, "weekly_consumption": 120}, {"weekly_income": 180, "weekly_consumption": 130}, {"weekly_income": 180, "weekly_consumption": 135}, {"weekly_income": 180, "weekly_consumption": 140},
    {"weekly_income": 200, "weekly_consumption": 120}, {"weekly_income": 200, "weekly_consumption": 136}, {"weekly_income": 200, "weekly_consumption": 140}, {"weekly_income": 200, "weekly_consumption": 144}, {"weekly_income": 200, "weekly_consumption": 145},
    {"weekly_income": 220, "weekly_consumption": 135}, {"weekly_income": 220, "weekly_consumption": 137}, {"weekly_income": 220, "weekly_consumption": 140}, {"weekly_income": 220, "weekly_consumption": 152}, {"weekly_income": 220, "weekly_consumption": 157}, {"weekly_income": 220, "weekly_consumption": 160}, {"weekly_income": 220, "weekly_consumption": 162},
    {"weekly_income": 240, "weekly_consumption": 137}, {"weekly_income": 240, "weekly_consumption": 145}, {"weekly_income": 240, "weekly_consumption": 155}, {"weekly_income": 240, "weekly_consumption": 165}, {"weekly_income": 240, "weekly_consumption": 175}, {"weekly_income": 240, "weekly_consumption": 189},
    {"weekly_income": 260, "weekly_consumption": 150}, {"weekly_income": 260, "weekly_consumption": 152}, {"weekly_income": 260, "weekly_consumption": 175}, {"weekly_income": 260, "weekly_consumption": 178}, {"weekly_income": 260, "weekly_consumption": 180}, {"weekly_income": 260, "weekly_consumption": 185}, {"weekly_income": 260, "weekly_consumption": 191}
  ],
  "series": [
    {"key": "weekly_consumption", "name": "Weekly Consumption ($)", "color": "#8b5cf6"}
  ]
}
\`\`\`
*(The solid line running through the centers of the distributions represents the conditional mean $E(Y|X)$).*

#### 2.2 The Concept of Population Regression Function (PRF)
From the preceding discussion, it is clear that each conditional mean $E(Y|X_i)$ is a function of $X_i$, where $X_i$ is a given value of $X$. Symbolically,

$$
E(Y|X_i) = f(X_i) \\quad \\text{(2.2.1)}
$$

where $f(X_i)$ denotes some function of the explanatory variable $X$. 

The expected value of the distribution of $Y$ given $X_i$ is functionally related to $X_i$. In simple terms, it tells how the mean or average response of $Y$ varies with $X$. Equation (2.2.1) is known as the **conditional expectation function (CEF)**, **population regression function (PRF)**, or simply **population regression (PR)**.

For example, assuming the PRF is a *linear* function of $X_i$, we write:

$$
E(Y|X_i) = \\beta_1 + \\beta_2 X_i \\quad \\text{(2.2.2)}
$$

where $\\beta_1$ and $\\beta_2$ are unknown but fixed parameters known as the **regression coefficients** ($\\beta_1$ is the **intercept** and $\\beta_2$ is the **slope coefficient**). 

#### 2.3 The Meaning of the Term *Linear*
Since this text is concerned primarily with linear models like (2.2.2), it is essential to know what the term *linear* really means. It can be interpreted in two different ways.

**Linearity in the Variables**
The expected value of $Y$ is a linear function of $X_i$. For example, $E(Y|X_i) = \\beta_1 + \\beta_2 X_i$ represents a straight line. Conversely, a model is *not* linear in variables if $X$ appears with a power or index other than 1.

\`\`\`chart
{
  "type": "combo",
  "title": "FIGURE 2.3: Linear-in-parameter functions",
  "xAxis": "x",
  "yAxis": "y",
  "data": [
    {"x": -2, "quadratic": 4, "exponential": 0.135, "cubic": -8},
    {"x": -1.5, "quadratic": 2.25, "exponential": 0.223, "cubic": -3.375},
    {"x": -1, "quadratic": 1, "exponential": 0.368, "cubic": -1},
    {"x": -0.5, "quadratic": 0.25, "exponential": 0.606, "cubic": -0.125},
    {"x": 0, "quadratic": 0, "exponential": 1, "cubic": 0},
    {"x": 0.5, "quadratic": 0.25, "exponential": 1.648, "cubic": 0.125},
    {"x": 1, "quadratic": 1, "exponential": 2.718, "cubic": 1},
    {"x": 1.5, "quadratic": 2.25, "exponential": 4.481, "cubic": 3.375},
    {"x": 2, "quadratic": 4, "exponential": 7.389, "cubic": 8}
  ],
  "series": [
    {"key": "quadratic", "name": "Quadratic", "color": "#f59e0b", "type": "line"},
    {"key": "exponential", "name": "Exponential", "color": "#10b981", "type": "line"},
    {"key": "cubic", "name": "Cubic", "color": "#3b82f6", "type": "line"}
  ]
}
\`\`\`


For example, the following are not linear in variables:

$$
E(Y|X_i) = \\beta_1 + \\beta_2 X_i^2
$$


$$
E(Y|X_i) = \\beta_1 + \\beta_2 \\left(\\frac{1}{X_i}\\right)
$$


**Linearity in the Parameters**
The expected value of $Y$ is a linear function of the *parameters* (the $\\beta$'s); it may or may not be linear in the variable $X$. 
- A model is linear in the parameter if the $\\beta$'s appear with a power or index of 1 only and are not multiplied/divided by other parameters.
- Example of *linear in parameter* (but non-linear in variables): 

$$
E(Y|X_i) = \\beta_1 + \\beta_2 X_i^2
$$

Even though $X$ is squared, the parameters are linear.
- Example of *nonlinear in parameter*: 

$$
E(Y|X_i) = \\beta_1 + \\beta_2^2 X_i
$$


**Crucial Note**: *Therefore, from now on the term "linear" regression will always mean a regression that is linear in the parameters; the $\\beta$'s are raised to the first power only. It may or may not be linear in the explanatory variables, the $X$'s.*

For example, all of these are **Linear Regression Models** (even though they are nonlinear in variables):

$$
Y_i = \\beta_1 + \\beta_2 \\left(\\frac{1}{X_i}\\right) + u_i \\quad \\text{(Reciprocal)}
$$


$$
Y_i = \\beta_1 + \\beta_2 \\ln X_i + u_i \\quad \\text{(Semilogarithmic)}
$$


$$
\\ln Y_i = \\beta_1 + \\beta_2 X_i + u_i \\quad \\text{(Inverse semilogarithmic)}
$$


$$
\\ln Y_i = \\ln \\beta_1 + \\beta_2 \\ln X_i + u_i \\quad \\text{(Logarithmic or double logarithmic)}
$$


However, the following models are **NOT** linear regression models:

$$
Y_i = e^{\\beta_1 + \\beta_2 X_i + u_i}
$$


$$
Y_i = \\frac{1}{1 + e^{\\beta_1 + \\beta_2 X_i + u_i}}
$$



**TABLE 2.3** LINEAR REGRESSION MODELS
<div className="overflow-x-auto my-6 markdown-table">

| Model linear in parameters? | Model linear in variables? Yes | Model linear in variables? No |
| :--- | :--- | :--- |
| **Yes** | LRM | LRM |
| **No** | NLRM | NLRM |

</div>
*Note: LRM = linear regression model, NLRM = nonlinear regression model*

| **No** | Non-Linear Regression Model (NLRM) | Non-Linear Regression Model (NLRM) |

#### 2.4 Stochastic Specification of PRF
It is clear that as family income increases, family consumption expenditure *on average* increases. But an *individual* family's consumption expenditure does not necessarily increase precisely along the mean trend. We can express the *deviation* of an individual $Y_i$ around its expected value as follows:

$$
u_i = Y_i - E(Y|X_i)
$$

or

$$
Y_i = E(Y|X_i) + u_i \\quad \\text{(2.4.1)}
$$

Here $u_i$ is an unobservable random variable taking positive or negative values. Technically, $u_i$ is known as the **stochastic disturbance** or **stochastic error term**.

The expenditure of an individual family can be expressed as the sum of two components:
1. $E(Y|X_i)$, the **systematic** or **deterministic** component.
2. $u_i$, the random, or **nonsystematic** component. It is a surrogate or proxy for all the omitted or neglected variables that may affect $Y$ but are not included in the model.

If we assume $E(Y|X_i)$ is linear in $X_i$, we can write:

$$
Y_i = \\beta_1 + \\beta_2 X_i + u_i \\quad \\text{(2.4.2)}
$$

Eq (2.4.2) posits that consumption is linearly related to income *plus* a disturbance term. Now, if we take the expected value of both sides:

$$
E(Y_i | X_i) = E[E(Y|X_i)] + E(u_i | X_i) = E(Y|X_i) + E(u_i | X_i) \\quad \\text{(2.4.4)}
$$

Since $E(Y_i | X_i)$ is the same thing as $E(Y | X_i)$, this implies that:

$$
E(u_i | X_i) = 0 \\quad \\text{(2.4.5)}
$$

Therefore, the assumption that the regression line passes through the conditional means of $Y$ implies that the conditional mean values of $u_i$ are explicitly zero.

#### 2.5 The Significance of the Stochastic Disturbance Term
As noted in Section 2.4, the disturbance term $u_i$ is a surrogate for all those variables that are omitted from the model but that collectively affect $Y$. The obvious question is: Why not introduce these variables into the model explicitly? Stated otherwise, why not develop a multiple regression model with as many variables as possible? The reasons are many.

1. **Vagueness of theory**: The theory, if any, determining the behavior of $Y$ may be, and often is, incomplete. We might know for certain that weekly income $X$ influences weekly consumption expenditure $Y$, but we might be ignorant or unsure about the other variables affecting $Y$. Therefore, $u_i$ may be used as a substitute for all the excluded or omitted variables from the model.
2. **Unavailability of data**: Even if we know what some of the excluded variables are and therefore consider a multiple regression rather than a simple regression, we may not have quantitative information about these variables. It is a common experience in empirical analysis that the data we would ideally like to have often are not available.
3. **Core variables versus peripheral variables**: Assume in our consumption-income example that besides income $X_1$, the number of children per family $X_2$, sex $X_3$, religion $X_4$, education $X_5$, and geographical region $X_6$ also affect consumption expenditure. But it is quite possible that the joint influence of all or some of these variables may be so small and at best nonsystematic or random that as a practical matter and for cost considerations it does not pay to introduce them into the model explicitly. One hopes that their combined effect can be treated as a random variable $u_i$.
4. **Intrinsic randomness in human behavior**: Even if we succeed in introducing all the relevant variables into the model, there is bound to be some "intrinsic" randomness in individual $Y$'s that cannot be explained no matter how hard we try. The disturbances, the $u$'s, may very well reflect this intrinsic randomness.
5. **Poor proxy variables**: Although the classical regression model assumes that the variables $Y$ and $X$ are measured accurately, in practice the data may be plagued by errors of measurement. The disturbance term $u$ may in this case then also represent the errors of measurement.
6. **Principle of parsimony**: Following Occam's razor, we would like to keep our regression model as simple as possible. If we can explain the behavior of $Y$ "substantially" with two or three explanatory variables and if our theory is not strong enough to suggest what other variables might be included, why introduce more variables? Let $u_i$ represent all other variables.
7. **Wrong functional form**: Even if we have theoretically correct variables explaining a phenomenon, we often do not know the form of the functional relationship between the regressand and the regressors. For all these reasons, the stochastic disturbances $u_i$ assume an extremely critical role in regression analysis.

#### 2.6 The Sample Regression Function (SRF)
By confining our discussion so far to the population of $Y$ values corresponding to the fixed $X$'s, we have deliberately avoided sampling considerations. But it is about time to face up to the sampling problems, for in most practical situations what we have is but a sample of $Y$ values corresponding to some fixed $X$'s. Therefore, our task now is to estimate the PRF on the basis of the sample information.

As an illustration, pretend that the population of Table 2.1 was not known to us and the only information we had was a randomly selected sample of $Y$ values. Since we are dealing with a sample from the population, we conceptually use a **sample regression line**. In general, we would get $N$ different SRFs for $N$ different samples, and these SRFs are not likely to be the same because of sampling fluctuations.


<div className="flex flex-col md:flex-row gap-6 my-6">

<div className="flex-1">

**TABLE 2.4** A RANDOM SAMPLE FROM THE POPULATION OF TABLE 2.1
<div className="overflow-x-auto markdown-table">

| $Y$ | $X$ |
| :--- | :--- |
| 70 | 80 |
| 65 | 100 |
| 90 | 120 |
| 95 | 140 |
| 110 | 160 |
| 115 | 180 |
| 120 | 200 |
| 140 | 220 |
| 155 | 240 |
| 150 | 260 |

</div>
</div>

<div className="flex-1">

**TABLE 2.5** ANOTHER RANDOM SAMPLE FROM THE POPULATION OF TABLE 2.1
<div className="overflow-x-auto markdown-table">

| $Y$ | $X$ |
| :--- | :--- |
| 55 | 80 |
| 88 | 100 |
| 90 | 120 |
| 80 | 140 |
| 118 | 160 |
| 120 | 180 |
| 145 | 200 |
| 135 | 220 |
| 145 | 240 |
| 175 | 260 |

</div>
</div>
</div>


Analogously to the PRF, we develop the concept of the **sample regression function (SRF)** to represent the sample regression line:

$$
\\hat{Y}_i = \\hat{\\beta}_1 + \\hat{\\beta}_2 X_i \\quad \\text{(2.6.1)}
$$

where $\\hat{Y}$ is read as "Y-hat" or "Y-cap" and represents the estimator of $E(Y|X_i)$, $\\hat{\\beta}_1$ = estimator of $\\beta_1$, and $\\hat{\\beta}_2$ = estimator of $\\beta_2$. Note that an **estimator**, also known as a (sample) **statistic**, is simply a rule or formula or method that tells how to estimate the population parameter from the information provided by the sample at hand. A particular numerical value obtained by the estimator in an application is known as an **estimate**.

Now just as we expressed the PRF in two equivalent forms (deterministic and stochastic), we can express the SRF (2.6.1) in its stochastic form as follows:

$$
Y_i = \\hat{\\beta}_1 + \\hat{\\beta}_2 X_i + \\hat{u}_i \\quad \\text{(2.6.2)}
$$

where, in addition to the symbols already defined, $\\hat{u}_i$ denotes the (sample) **residual** term. Conceptually $\\hat{u}_i$ is analogous to $u_i$ and can be regarded as an *estimate* of $u_i$.

To sum up, our primary objective in regression analysis is to estimate the PRF

$$
Y_i = \\beta_1 + \\beta_2 X_i + u_i
$$

on the basis of the SRF

$$
Y_i = \\hat{\\beta}_1 + \\hat{\\beta}_2 X_i + \\hat{u}_i
$$

Because more often than not our analysis is based upon a single sample from some population, the SRF is at best an approximate one. This approximation is shown diagrammatically in Figure 2.5. For observation $X = X_i$, we have one (sample) observation $Y = Y_i$. In terms of the SRF, the observed $Y_i$ can be expressed as:

$$
Y_i = \\hat{Y}_i + \\hat{u}_i \\quad \\text{(2.6.3)}
$$

and in terms of the PRF, it can be expressed as:

$$
Y_i = E(Y|X_i) + u_i \\quad \\text{(2.6.4)}
$$


\`\`\`chart
{
  "type": "combo",
  "title": "Figure 2.5: Sample and population regression lines",
  "xAxis": "weekly_income",
  "yAxis": "weekly_consumption",
  "data": [
    {"weekly_income": 40, "prf": 50, "srf": 60},
    {"weekly_income": 140, "prf": 110, "srf": 130, "sample_point": 160},
    {"weekly_income": 200, "prf": 146, "srf": 172}
  ],
  "series": [
    {"key": "prf", "name": "PRF: E(Y|X) = B1 + B2X", "color": "#10b981", "type": "line"},
    {"key": "srf", "name": "SRF: Y^ = B1^ + B2^X", "color": "#3b82f6", "type": "line"},
    {"key": "sample_point", "name": "Yi", "color": "#ef4444", "type": "scatter"}
  ]
}
\`\`\`

Obviously, the SRF may overestimate or underestimate the true PRF because of sampling fluctuations. The critical question now is: Granted that the SRF is but an approximation of the PRF, can we devise a method that will make this approximation as "close" as possible? This will occupy much of Chapter 3.

#### 2.7 An Illustrative Example
We conclude this chapter with an example using data on the level of education (measured by the number of years of schooling), the mean hourly wages earned by people at each level of education, and the number of people at the stated level of education from the current population survey conducted in May 1985. 


**TABLE 2.6** MEAN HOURLY WAGE BY EDUCATION
<div className="overflow-x-auto my-6 markdown-table">

| Years of schooling | Mean wage, \$ | Number of people |
| :--- | :--- | :--- |
| 6 | 4.4567 | 3 |
| 7 | 5.7700 | 5 |
| 8 | 5.9787 | 15 |
| 9 | 7.3317 | 12 |
| 10 | 7.3182 | 17 |
| 11 | 6.5844 | 27 |
| 12 | 7.8182 | 218 |
| 13 | 7.8351 | 37 |
| 14 | 11.0223 | 56 |
| 15 | 10.6738 | 13 |
| 16 | 10.8361 | 70 |
| 17 | 13.6150 | 24 |
| 18 | 13.5310 | 31 |
| **Total** | | **528** |

</div>


Plotting the (conditional) mean wage against education gives a regression curve showing how mean wages vary with the level of education; they generally increase with the level of education, a finding one should not find surprising.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 2.6: Relationship between mean wages and education",
  "xAxis": "years_of_schooling",
  "yAxis": "mean_wage",
  "data": [
    {"years_of_schooling": 6, "mean_wage": 4.4567},
    {"years_of_schooling": 7, "mean_wage": 5.7700},
    {"years_of_schooling": 8, "mean_wage": 5.9787},
    {"years_of_schooling": 9, "mean_wage": 7.3317},
    {"years_of_schooling": 10, "mean_wage": 7.3182},
    {"years_of_schooling": 11, "mean_wage": 6.5844},
    {"years_of_schooling": 12, "mean_wage": 7.8182},
    {"years_of_schooling": 13, "mean_wage": 7.8351},
    {"years_of_schooling": 14, "mean_wage": 11.0223},
    {"years_of_schooling": 15, "mean_wage": 10.6738},
    {"years_of_schooling": 16, "mean_wage": 10.8361},
    {"years_of_schooling": 17, "mean_wage": 13.6150},
    {"years_of_schooling": 18, "mean_wage": 13.5310}
  ],
  "series": [
    {"key": "mean_wage", "name": "Mean Wage ($)", "color": "#10b981"}
  ]
}
\`\`\`

#### 2.8 Summary and Conclusions
1. The key concept underlying regression analysis is the concept of the **conditional expectation function (CEF)**, or **population regression function (PRF)**. Our objective in regression analysis is to find out how the average value of the dependent variable (or regressand) varies with the given value of the explanatory variable (or regressor).
2. This book largely deals with **linear PRFs**, that is, regressions that are linear in the parameters. They may or may not be linear in the regressand or the regressors.
3. For empirical purposes, it is the **stochastic PRF** that matters. The **stochastic disturbance term** $u_i$ plays a critical role in estimating the PRF.
4. The PRF is an idealized concept, since in practice one rarely has access to the entire population of interest. Therefore, one uses the **stochastic sample regression function (SRF)** to estimate the PRF. How this is actually accomplished is discussed in Chapter 3.


#### EXERCISES

**Questions**

**2.1.** What is the conditional expectation function or the population regression function?
**2.2.** What is the difference between the population and sample regression functions? Is this a distinction without difference?
**2.3.** What is the role of the stochastic error term $u_i$ in regression analysis? What is the difference between the stochastic error term and the residual, $\\hat{u}_i$?
**2.4.** Why do we need regression analysis? Why not simply use the mean value of the regressand as its best value?
**2.5.** What do we mean by a *linear* regression model?
**2.6.** Determine whether the following models are linear in the parameters, or the variables, or both. Which of these models are linear regression models?

<div className="overflow-x-auto my-4 markdown-table">

| Model | Descriptive title |
| :--- | :--- |
| **a.** $Y_i = \\beta_1 + \\beta_2 \\left(\\frac{1}{X_i}\\right) + u_i$ | Reciprocal |
| **b.** $Y_i = \\beta_1 + \\beta_2 \\ln X_i + u_i$ | Semilogarithmic |
| **c.** $\\ln Y_i = \\beta_1 + \\beta_2 X_i + u_i$ | Inverse semilogarithmic |
| **d.** $\\ln Y_i = \\ln \\beta_1 + \\beta_2 \\ln X_i + u_i$ | Logarithmic or double logarithmic |
| **e.** $\\ln Y_i = \\beta_1 - \\beta_2 \\left(\\frac{1}{X_i}\\right) + u_i$ | Logarithmic reciprocal |

</div>

*Note:* $\\ln$ = natural log (i.e., log to the base $e$); $u_i$ is the stochastic disturbance term. We will study these models in Chapter 6.

**2.7.** Are the following models linear regression models? Why or why not?
**a.** $ Y_i = e^{\\beta_1 + \\beta_2 X_i + u_i} $
**b.** $ Y_i = \\frac{1}{1 + e^{\\beta_1 + \\beta_2 X_i + u_i}} $
**c.** $ \\ln Y_i = \\beta_1 + \\beta_2 \\left(\\frac{1}{X_i}\\right) + u_i $
**d.** $ Y_i = \\beta_1 + (0.75 - \\beta_1) e^{-\\beta_2 (X_i - 2)} + u_i $
**e.** $ Y_i = \\beta_1 + \\beta_2^3 X_i + u_i $

**2.8.** What is meant by an *intrinsically linear* regression model? If $\\beta_2$ in exercise 2.7d were $0.8$, would it be a linear or nonlinear regression model?

***2.9.** Consider the following nonstochastic models (i.e., models without the stochastic error term). Are they linear regression models? If not, is it possible, by suitable algebraic manipulations, to convert them into linear models?
**a.** $ Y_i = \\frac{1}{\\beta_1 + \\beta_2 X_i} $
**b.** $ Y_i = \\frac{X_i}{\\beta_1 + \\beta_2 X_i} $
**c.** $ Y_i = \\frac{1}{1 + \\exp(-\\beta_1 - \\beta_2 X_i)} $

**2.10.** You are given the scattergram in Figure 2.7 along with the regression line. What general conclusion do you draw from this diagram? Is the regression line sketched in the diagram a population regression line or the sample regression line?

\`\`\`chart
{
  "type": "scatter",
  "title": "FIGURE 2.7: Growth rates of real manufacturing wages and exports.",
  "xAxis": "export_growth",
  "yAxis": "wage_growth",
  "data": [
    {"export_growth": -0.05, "wage_growth": -3.5},
    {"export_growth": -0.04, "wage_growth": 1.5},
    {"export_growth": -0.03, "wage_growth": -0.5},
    {"export_growth": -0.02, "wage_growth": 3.0},
    {"export_growth": -0.01, "wage_growth": 1.0},
    {"export_growth": 0.00, "wage_growth": 2.5},
    {"export_growth": 0.01, "wage_growth": 4.5},
    {"export_growth": 0.02, "wage_growth": 6.8},
    {"export_growth": 0.03, "wage_growth": 5.0},
    {"export_growth": 0.04, "wage_growth": 8.5}
  ],
  "series": [
    {"key": "wage_growth", "name": "Growth (%)", "color": "#64748b"}
  ]
}
\`\`\`
*(Simulated approximation of Figure 2.7 diagram data points representing 50 developing countries)*

**2.11.** From the scattergram given in Figure 2.8, what general conclusions do you draw? What is the economic theory that underlies this scattergram? (*Hint*: Look up any international economics textbook and read up on the Heckscher–Ohlin model of trade.)

\`\`\`chart
{
  "type": "scatter",
  "title": "FIGURE 2.8: Skill intensity of exports and human capital endowment.",
  "xAxis": "human_capital",
  "yAxis": "skill_intensity",
  "data": [
    {"human_capital": 2, "skill_intensity": -4},
    {"human_capital": 3, "skill_intensity": -2},
    {"human_capital": 4, "skill_intensity": 0},
    {"human_capital": 5, "skill_intensity": 1},
    {"human_capital": 6, "skill_intensity": 2},
    {"human_capital": 7, "skill_intensity": 1.5},
    {"human_capital": 8, "skill_intensity": 3},
    {"human_capital": 9, "skill_intensity": 2.5}
  ],
  "series": [
    {"key": "skill_intensity", "name": "Exports Ratio", "color": "#3b82f6"}
  ]
}
\`\`\`

**2.12.** What does the scattergram in Figure 2.9 reveal? On the basis of this diagram, would you argue that minimum wage laws are good for economic well-being?

**2.13.** Is the regression line shown in Figure I.3 of the Introduction the PRF or the SRF? Why? How would you interpret the scatterpoints around the regression line? Besides GDP, what other factors, or variables, might determine personal consumption expenditure?

**2.14.** You are given the data in Table 2.7 for the United States for years 1980–1996.

<div className="overflow-x-auto my-4 markdown-table text-xs">

**TABLE 2.7** LABOR FORCE PARTICIPATION DATA

| Year | CLFPRM | CLFPRF | UNRM | UNRF | AHE82 | AHE |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1980 | 77.4 | 51.5 | 6.9 | 7.4 | 7.78 | 6.66 |
| 1981 | 77.0 | 52.1 | 7.4 | 7.9 | 7.69 | 7.25 |
| 1982 | 76.6 | 52.6 | 9.9 | 9.4 | 7.68 | 7.68 |
| 1983 | 76.4 | 53.9 | 9.9 | 9.2 | 7.79 | 8.02 |
| 1984 | 76.4 | 53.6 | 7.4 | 7.6 | 7.80 | 8.32 |
| 1985 | 76.3 | 54.5 | 7.0 | 7.4 | 7.77 | 8.57 |
| 1986 | 76.3 | 55.3 | 6.9 | 7.1 | 7.81 | 8.76 |
| 1987 | 76.2 | 56.0 | 6.2 | 6.2 | 7.73 | 8.98 |
| 1988 | 76.2 | 56.6 | 5.5 | 5.6 | 7.69 | 9.28 |
| 1989 | 76.4 | 57.4 | 5.2 | 5.4 | 7.64 | 9.66 |
| 1990 | 76.4 | 57.5 | 5.7 | 5.5 | 7.52 | 10.01 |
| 1991 | 75.8 | 57.4 | 7.2 | 6.4 | 7.45 | 10.32 |
| 1992 | 75.8 | 57.8 | 7.9 | 7.0 | 7.41 | 10.57 |
| 1993 | 75.4 | 57.9 | 7.2 | 6.6 | 7.39 | 10.83 |
| 1994 | 75.1 | 58.8 | 6.2 | 6.0 | 7.40 | 11.12 |
| 1995 | 75.0 | 58.9 | 5.6 | 5.6 | 7.40 | 11.44 |
| 1996 | 74.9 | 59.3 | 5.4 | 5.4 | 7.43 | 11.82 |

</div>

**a.** Plot the male civilian labor force participation rate against male civilian unemployment rate. Eyeball a regression line through the scatter points. A priori, what is the expected relationship between the two and what is the underlying economic theory? Does the scattergram support the theory?
**b.** Repeat part **a** for females.
**c.** Now plot both the male and female labor participation rates against average hourly earnings (in 1982 dollars). (You may use separate diagrams.) Now what do you find? And how would you rationalize your finding?
**d.** Can you plot the labor force participation rate against the unemployment rate and the average hourly earnings simultaneously? If not, how would you verbalize the relationship among the three variables?

**2.15.** Table 2.8 gives data on expenditure on food and total expenditure, measured in rupees, for a sample of 55 rural households from India. (In early 2000, a U.S. dollar was about 40 Indian rupees.)

**TABLE 2.8** FOOD AND TOTAL EXPENDITURE (RUPEES)
*(We omit the long 55-row table for brevity, but it follows the typical regression exercise pattern relating food expenditure to total expenditure).*

**a.** Plot the data, using the vertical axis for expenditure on food and the horizontal axis for total expenditure, and sketch a regression line through the scatterpoints.
**b.** What broad conclusions can you draw from this example?
**c.** A priori, would you expect expenditure on food to increase linearly as total expenditure increases regardless of the level of total expenditure? Why or why not? You can use total expenditure as a proxy for total income.

**2.16.** Table 2.9 gives data on mean Scholastic Aptitude Test (SAT) scores for college-bound seniors for 1967–1990.

**a.** Use the horizontal axis for years and the vertical axis for SAT scores to plot the verbal and math scores for males and females separately.
**b.** What general conclusions can you draw?
**c.** Knowing the verbal scores of males and females, how would you go about predicting their math scores?
**d.** Plot the female verbal SAT score against the male verbal SAT score. Sketch a regression line through the scatterpoints. What do you observe?


c## CHAPTER 3: Two-Variable Regression Model: The Problem of Estimation

#### 3.1 The Method of Ordinary Least Squares (OLS)
The method of ordinary least squares is attributed to Carl Friedrich Gauss. Under certain assumptions, the method of least squares has some very attractive statistical properties that have made it one of the most powerful and popular methods of regression analysis.

Recall the Sample Regression Function (SRF):

$$
Y_i = \\\hat{\\\beta}_1 + \\\hat{\\\beta}_2 X_i + \\\hat{u}_i
$$

We can write the residual as:

$$
\\\mathbf{u}_i = Y_i - \\\hat{Y}_i = Y_i - \\\hat{\\\beta}_1 - \\\mathbf{\\\beta}_2 X_i
$$

The OLS principle states that we should choose the sample estimators $\\\mathbf{\\\beta}_1$ and $\\\mathbf{\\\beta}_2$ in such a way that the **residual sum of squares (RSS)** is as small as possible:

$$
\\\begin{equation}\\\mathbf{ui^2} = \\\sum (Y_i - \\\mathbf{\\\beta}_1 - \\\mathbf{\\\beta}_2 X_i)^2
\\\end{equation}
$$

By taking the partial derivatives of the RSS with respect to $\\\mathbf{\\\beta}_1$ and $\\\mathbf{\\\beta}_2$ and setting them to zero, we obtain the **normal equations*:

$$
\\\begin{equation}\\\mathbf|\\\sum Y_i = n\\\mathbf{\\\beta}_1 + \\\mathbf{\\\beta}_2 \\\sum X_i\\\end{equation}
$$

$$
\\\begin{equation}\\\sum Y_i X_i = \\\mathbf{\\\beta}_1 \\\sum X_i + \\\hat{\\\beta}_2 \\\sum X_i^2\\\end{equation}
$$

Solving these equations simultaneously yields the OLS estimators:

$$
\\\begin{equation}\\\hat{\\\beta}_2 = \\\frac{n\\\sum X_i Y_i - (\\\sum X_i)(\\\sum Y_i)}{n\\\sum X_i^2 - (\\\sum X_i)^2} - \\\frac{\\\sum x_i y_i}{\\\sum x_i^2}\\\end{equation}
$$

$$
\\\begin{equation}\\\hat{\\\beta}_1 = \\\bar{Y} - \\\hat{\\\beta}_2 \\\bar{X}\\\end{equation}
$$

$(Note: lower case letters $x_i$ and $y_i$ denote deviations from their sample means: $x_i = X_i - \\\bar{X}$ and $y_i = Y_i - \\\bar{Y}$.)*

#### 3.2 The Classical Linear Regression Model (CLRM)
The theoretical justification for OLS rests on the CLRM.
1. **Linear in Parameters**: The regression model is linear in the parameters $\\\beta$.
2. **Fixed $X$ values**: Values taken by the regressor $X$ are considered fixed in repeated sampling.
3. **Zero Mean of Disturbance**: $E(u_i | X_i) = 0$.
4. **Homoscedasticity**: Equal variance of $u_i$. $var(u_i | X_i) = \\\sigma^2$.
5. **No Autocorrelation**: Given $X$, there is no autocorrelation between the disturbances. $cov(u_i, u_j | X_i, X_j) = 0$ for $i \\\neq j$.
6. **Zero Covariance between $X_i$ and $u_i$**: $cov(X_i, u_i) = 0$.
7. **Number of Observations**: The number of observations $n$ must be greater than the number of parameters to be estimated.

#### 3.3 Precision or Standard Errors of Least-Squares Estimates
The standard errors are necessary for hypothesis testing and interval estimation:

$$
var(\\\hat{\\\beta}_2) = \\\frac{\\\sigma^2}{\\\sum x_i^2} \\\quad , \\\quad se(\\\hat{\\\beta}_2) = \\\frac{\\\sigma}{\\\sqrt{\\\sum x_i^2}}
$$

$$
var(\\\hat{\\\beta}_1) = \\\frac{\\\sum X_i^2}{n \\\sum x_i^2} \\\sigma^2 \\\quad , \\\quad se(\\\hat{\\\beta}_1) = \\\sqrt{\\\frac{\\\sum X_i^2}{n \\\sum x_i^2}} \\\sigma
$$

To estimate the true variance of the disturbance term $\\\sigma^2$, we use the estimator $\\\hat{\\\sigma}^2$:
\\\begin{equation}\\\hat{\\\sigma}^2 = \\\frac{\\\sum \\\hat{u}_i^2}{n - 2}\\\end{equation}

#### 3.4 Properties of Least-Squares Estimators: The Gauss-Markov Theorem
> **Gauss-Markov Theorem**: Given the assumptions of the CLRM, the least-squares estimators, in the class of unbiased linear estimators, have minimum variance, that is, they are BLUE.

* **B**est (minimum variance)
+ **L**inear
* **U**nbiased
+ **E**stimator

#### 3.5 The Coefficient of Determination (**x**): A Measure of 'Goodness of Fit'
The $R^2$ tells us the proportion of variation in the dependent variable $Y$ that is explained by the explained by the explanatory variable $X$.

$$
TSS = ESS + RSS
$$

$$
\\\sum (Y_i - \\\bar{Y})^2 = \\\sum (\\\hat{Y}_i - \\\bar{Y})^2 + \\\sum \\\hat{u}_i^2
$$

Then, defining $R^2$ as the ratio of the explained variation to the total variation:

$$
R^2 = \\\frac{ESS}{TSS} = 1 - \\\frac{RSS}{TSS} = 1 - \\\frac{\\\sum \\\hat{u}_i^2}{\\\sum y_i^2}
$$

The sample correlation coefficient $r$ is:
$$
r = \\\pm \\\sqrt{R^2} = \\\frac{\\\sum x_i y_i}{\\\sqrt{(\\\sum x_i^2)(\\\sum y_i^2)}}
$$

#### 3.6 A Numerical Example
To illustrate the computations of OLS, we utilize a hypothetical dataset representing Weekly Family Income ($X$) and Weekly Consumption Expenditure ($Y$).

**Table 3.2: Raw Data and Computations**

| $Y_i$ (Consumption) | $X_i$ (Income) | $y_i = Y_i - \\\bar{Y}$ | $x_i = X_i - \\\bar{X}$ | $x_i y_i$ | $x_i^2$ | $y_i^2$ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 70 | 80 | -41 | -90 | 3690 | 8100 | 1681 |
| 65 | 100 | -46 | -70 | 3220 | 4900 | 2116 |
| 90 | 120 | -21 | -50 | 1050 | 2500 | 441 |
| 95 | 140 | -16 | -30 | 480 | 900 | 256 |
| 110 | 160 | -1 | -10 | 10 | 100 | 1  |
| 115 | 180 | 4 | 10 | 40 | 100 | 16 |
| 120 | 200 | 9 | 30 | 270 | 900 | 81 |
| 140 | 220 | 29 | 50 | 140 | 2500 | 841 |
| 155 | 240 | 44 | 70 | 3080 | 4900 | 1936 |
| 150 | 260 | 39 | 90 | 3510 | 8100 | 1521 |
| **Sum: 1110** | **Sum: 1700** | **0** | **0** | **16800** | **33000** | **8890** |

From the table, $\\\bar{Y} = 111$ and $\\\bar{X} = 170$.
Using the normal equations:
$$
\\\hat{\\\beta}_2 = \\\frac{\\\sum x_i y_i}{\\\sum x_i^2} = \\\frac{16800}{33000} = 0.5091
$$
$$
\\\hat{\\\beta}_1 = \\\bar{Y} - \\\hat{\\\beta}_2 \\\bar{X} = 111 - 0.5091(170) = 24.453
$$

So the Sample Regression Function is:
$$
\\\mathbf{Y}_i = 24.453 + 0.5091 X_i
$$

We calculate variances:
$$
\\\hat{\\\sigma}^2 = \\\frac{\\\sum \\\hat{u}_i^2}{n - 2 = 42.159
$$
$$
se(\\\hat{\\\beta}_2) = 0.0357 \\\quad , \\\quad se(\\\mathbf{\\\beta}_1) = 6.4138
$$

$$R^2$ is calculated as:
$$
R^2 = \\\frac{\\\hat{\\\beta}_2^2 \\\sum x_i^2}{\\\sum y_i^2} = \\\frac{0.5091^2 \\\times 33000}{8890} = 0.9621
$$
This means approx 96.21% of the variation in weekly consumption expenditure is explained by weekly income.

\`\`\`chart
{
  "type": "scatter",
  "title": "Figure 3.3: Consumption-Income Relationship with Sample Regression Line",
  "xAxis": "Income ($)",
  "yAxis": "Consumption ($)",
  "regression": true,
  "data": [
    {"Income ($)": 80, "Consumption ($)": 70},
    {"Income ($)": 100, "Consumption ($)": 65},
    {"Income ($)": 120, "Consumption ($)": 90},
    {"Income ($)": 140, "Consumption ($)": 95},
    {"Income ($)": 160, "Consumption ($)": 110},
    {"Income ($)": 180, "Consumption ($)": 115},
    {"Income ($)": 200, "Consumption ($)": 120},
    {"Income ($)": 220, "Consumption ($)": 140},
    {"Income ($)": 240, "Consumption ($)": 155},
    {"Income ($)": 260, "Consumption ($)": 150}
  ],
  "series": [
    {"key": "Consumption ($)", "name": "Actual Consumption", "color": "#16a34a"}
  ]
}
\`\`\`

#### 3.7 Illustrative Examples
**Example 1: The Relationship between Real GBP and M2**
Consider estimating how changes in the money supply (M2) affect Real GDP. This illustrates the macroeconomic application of regression estimation.

#### 3.8 A Note on Monte Carlo Experiments
In cases where theoretical assumptions might break down, Experiments bty Simulation heles.

#### 3.9 Summary and Conclusions
1. The **primary objective** is to estimate population parameters from sample data.
2. **OLS** minimizes the RSS.
3. **CLRM* assumptions make OLS **BLUE**.
4. $R^2$ measures goodness-of-fit (Ess/Tss).


### CHAPTER 4: Classical Normal Linear Regression Model (CNLRM)
4.1 The Probability Distribution of Disturbances $u_i$
4.2 The Normality Assumption for $u_i$
4.3 Properties of OLS Estimators under the Normality Assumption
4.4 The Method of Maximum Likelihood (ML)
4.5 Summary and Conclusions

### CHAPTER 5: Two-Variable Regression: Interval Estimation and Hypothesis Testing
5.1 Statistical Prerequisites
5.2 Interval Estimation: Some Basic Ideas
5.3 Confidence Intervals for Regression Coefficients
5.4 Confidence Interval for $\\sigma^2$
5.5 Hypothesis Testing: General Comments
5.6 Hypothesis Testing: The Confidence-Interval Approach
5.7 Hypothesis Testing: The Test-of-Significance Approach
5.8 Hypothesis Testing: Some Practical Aspects
5.9 Regression Analysis and Analysis of Variance
5.10 Application of Regression Analysis: The Problem of Prediction
5.11 Reporting the Results of Regression Analysis
5.12 Evaluating the Results of Regression Analysis
5.13 Summary and Conclusions

### CHAPTER 6: Extensions of the Two-Variable Linear Regression Model
6.1 Regression through the Origin
6.2 Scaling and Units of Measurement
6.3 Regression on Standardized Variables
6.4 Functional Forms of Regression Models
6.5 How to Measure Elasticity: The Log-Linear Model
6.6 Semilog Models: Log-Lin and Lin-Log Models
6.7 Reciprocal Models
6.8 Choice of Functional Form
6.9 A Note on the Nature of the Stochastic Error Term
6.10 Summary and Conclusions

### CHAPTER 7: Multiple Regression Analysis: The Problem of Estimation
7.1 The Three-Variable Model: Notation and Assumptions
7.2 Interpretation of Multiple Regression Equation
7.3 The Meaning of Partial Regression Coefficients
7.4 OLS and ML Estimation of the Partial Regression Coefficients
7.5 The Multiple Coefficient of Determination $R^2$ and Correlation $R$
7.6 Example 7.1: Child Mortality in relation to GNP and Literacy
7.7 Simple Regression in the context of Multiple Regression
7.8 $R^2$ and the Adjusted $R^2$
7.9 Example 7.3: The Cobb-Douglas Production Function
7.10 Polynomial Regression Models
7.11 Partial Correlation Coefficients
7.12 Summary and Conclusions

### CHAPTER 8: Multiple Regression Analysis: The Problem of Inference
8.1 The Normality Assumption Once Again
8.2 Example 8.1: Child Mortality Example Revisited
8.3 Hypothesis Testing in Multiple Regression
8.4 Hypothesis Testing about Individual Regression Coefficients
8.5 Testing the Overall Significance of the Sample Regression
8.6 Testing the Equality of Two Regression Coefficients
8.7 Restricted Least Squares: Testing Linear Equality Restrictions
8.8 Testing for Structural or Parameter Stability: The Chow Test
8.9 Prediction with Multiple Regression
8.10 Likelihood Ratio, Wald, and Lagrange Multiplier Tests
8.11 Testing the Functional Form of Regression
8.12 Summary and Conclusions

### CHAPTER 9: Dummy Variable Regression Models
9.1 The Nature of Dummy Variables
9.2 ANOVA Models
9.3 ANOVA Models with Two Qualitative Variables
9.4 Regression with a Mixture of Quantitative and Qualitative Regressors: ANCOVA
9.5 The Dummy Variable Alternative to the Chow Test
9.6 Interaction Effects using Dummy Variables
9.7 The Use of Dummy Variables in Seasonal Analysis
9.8 Piecewise Linear Regression
9.9 Panel Data Regression Models
9.10 Technical Aspects of the Dummy Variable Technique
9.11 Topics for Further Study
9.12 Summary and Conclusions

---

## PART II: RELAXING THE ASSUMPTIONS OF THE CLASSICAL MODEL

### CHAPTER 10: Multicollinearity: What Happens if the Regressors Are Correlated?
10.1 The Nature of Multicollinearity
10.2 Estimation in the Presence of Perfect Multicollinearity
10.3 Estimation in the Presence of "High" but "Imperfect" Multicollinearity
10.4 Theoretical Consequences of Multicollinearity
10.5 Practical Consequences of Multicollinearity
10.6 An Illustrative Example
10.7 Detection of Multicollinearity
10.8 Remedial Measures
10.9 Is Multicollinearity Necessarily Bad?
10.10 An Extended Example: The Longley Data
10.11 Summary and Conclusions

### CHAPTER 11: Heteroscedasticity: What Happens if the Error Variance Is Nonconstant?
11.1 The Nature of Heteroscedasticity
11.2 OLS Estimation in the Presence of Heteroscedasticity
11.3 The Method of Generalized Least Squares (GLS)
11.4 Consequences of Using OLS in the Presence of Heteroscedasticity
11.5 Detection of Heteroscedasticity
11.6 Remedial Measures
11.7 Concluding Examples
11.8 A Caution about Overreacting
11.9 Summary and Conclusions

### CHAPTER 12: Autocorrelation: What Happens if the Error Terms Are Correlated
12.1 The Nature of the Problem
12.2 OLS Estimation in the Presence of Autocorrelation
12.3 The BLUE Estimator in the Presence of Autocorrelation
12.4 Consequences of Using OLS
12.5 Relationship between Wages and Productivity
12.6 Detecting Autocorrelation
12.7 Remedial Measures
12.8 Model Mis-Specification versus Pure Autocorrelation
12.9 Correcting for Pure Autocorrelation: GLS
12.10 The Newey-West Method
12.11 OLS versus FGLS and HAC
12.12 Forecasting with Autocorrelated Error Terms
12.13 Additional Aspects (ARCH/GARCH)
12.14 Summary and Conclusions

### CHAPTER 13: Econometric Modeling: Model Specification and Diagnostic Testing
13.1 Model Selection Criteria
13.2 Types of Specification Errors
13.3 Consequences of Model Specification Errors
13.4 Tests of Specification Errors
13.5 Errors of Measurement
13.6 Incorrect Specification of the Stochastic Error Term
13.7 Nested versus Non-nested Models
13.8 Tests of Non-nested Hypotheses
13.9 Model Selection Criteria
13.10 Additional Topics
13.11 Concluding Example
13.12 A Word to the Practitioner
13.13 Summary and Conclusions

---

## PART III: TOPICS IN ECONOMETRICS

### CHAPTER 14: Nonlinear Regression Models
14.1 Intrinsically Linear and Nonlinear Models
14.2 Estimation
14.3 The Trial-and-Error Method
14.4 Approaches to Estimating Nonlinear Models
14.5 Illustrative Examples
14.6 Summary and Conclusions

### CHAPTER 15: Qualitative Response Regression Models
15.1 The Nature of Qualitative Response Models
15.2 The Linear Probability Model (LPM)
15.3 Applications of LPM
15.4 Alternatives to LPM
15.5 The Logit Model
15.6 Estimation of the Logit Model
15.7 The Grouped Logit Model
15.8 The Logit Model for Ungrouped Data
15.9 The Probit Model
15.10 Logit and Probit Models
15.11 The Tobit Model
15.12 Modeling Count Data: The Poisson Regression Model
15.13 Further Topics
15.14 Summary and Conclusions

### CHAPTER 16: Panel Data Regression Models
16.1 Why Panel Data?
16.2 An Illustrative Example
16.3 Estimation: The Fixed Effects Approach
16.4 Estimation: The Random Effects Approach
16.5 Fixed Effects versus Random Effects Model
16.6 Concluding Comments
16.7 Summary and Conclusions

### CHAPTER 17: Dynamic Econometric Models: Autoregressive and Distributed-Lag Models
17.1 The Role of "Time" or "Lag" in Economics
17.2 The Reasons for Lags
17.3 Estimation of Distributed-Lag Models
17.4 The Koyck Approach
17.5 Rationalization of the Koyck Model: Adaptive Expectations
17.6 Another Rationalization: The Stock Adjustment Model
17.7 Combination Models
17.8 Estimation of Autoregressive Models
17.9 The Method of Instrumental Variables (IV)
17.10 Detecting Autocorrelation in Autoregressive Models: Durbin h Test
17.11 Numerical Example: Demand for Money
17.12 Illustrative Examples
17.13 The Almon Approach to Distributed-Lag Models
17.14 Causality in Economics: The Granger Causality Test
17.15 Summary and Conclusions

---

## PART IV: SIMULTANEOUS-EQUATION MODELS

### CHAPTER 18: Simultaneous-Equation Models
18.1 The Nature of Simultaneous-Equation Models
18.2 Examples
18.3 Simultaneous-Equation Bias: Inconsistency of OLS Estimators
18.4 Simultaneous-Equation Bias: Numerical Example
18.5 Summary and Conclusions

### CHAPTER 19: The Identification Problem
19.1 Notations and Definitions
19.2 The Identification Problem
19.3 Rules for Identification (Order and Rank)
19.4 A Test of Simultaneity (Hausman Test)
19.5 Tests for Exogeneity
19.6 Summary and Conclusions

### CHAPTER 20: Simultaneous-Equation Methods
20.1 Approaches to Estimation
20.2 Recursive Models and OLS
20.3 Estimation of a Just Identified Equation: Indirect Least Squares (ILS)
20.4 Estimation of an Overidentified Equation: Two-Stage Least Squares (2SLS)
20.5 2SLS: Numerical Example
20.6 Illustrative Examples
20.7 Summary and Conclusions

### CHAPTER 21: Time Series Econometrics: Some Basic Concepts
21.1 Selected U.S. Economic Time Series
21.2 Key Concepts
21.3 Stochastic Processes
21.4 Unit Root Stochastic Process
21.5 Trend Stationary and Difference Stationary Processes
21.6 Integrated Stochastic Processes
21.7 Spurious Regression
21.8 Tests of Stationarity
21.9 The Unit Root Test
21.10 Transforming Nonstationary Time Series
21.11 Cointegration and Error Correction Mechanism (ECM)
21.12 Some Economic Applications
21.13 Summary and Conclusions

### CHAPTER 22: Time Series Econometrics: Forecasting
22.1 Approaches to Economic Forecasting
22.2 AR, MA, and ARIMA Modeling
22.3 The Box-Jenkins Methodology
22.4 Identification
22.5 Estimation of the ARIMA Model
22.6 Diagnostic Checking
22.7 Forecasting
22.8 Further Aspects
22.9 Vector Autoregression (VAR)
22.10 Measuring Volatility: ARCH and GARCH Models
22.11 Concluding Examples
22.12 Summary and Conclusions

*(Note: Data, tables, formulas, and graphs will be populated here as provided.)*
`,

  "ug-monetary": `
# COMPREHENSIVE MONETARY ECONOMICS STUDY GUIDE

## CHAPTER 1: THE NATURE AND FUNCTIONS OF MONEY

### 1.1 What is Money?
Anything that is generally acceptable as a medium of exchange, a measure of value, and a store of value.

### 1.2 Functions of Money
1. **Medium of Exchange**.
2. **Measure of Value** (Unit of Account).
3. **Standard of Deferred Payments**.
4. **Store of Value**.

### 1.3 The Demand for Money (Liquidity Preference)
Keynesian motives:
1. **Transactions Motive**.
2. **Precautionary Motive**.
3. **Speculative Motive**.

---

## CHAPTER 2: THE QUANTITY THEORY OF MONEY

### 2.1 The Fisher Equation of Exchange
$$MV = PY$$
Where $M$ = Money Supply, $V$ = Velocity, $P$ = Price Level, $Y$ = Real Output.

---

## CHAPTER 3: CENTRAL BANKING AND MONETARY POLICY

### 3.1 The Role of the Central Bank
Managing the currency and maintaining monetary stability.

### 3.2 Instruments of Monetary Policy
- **Quantitative Tools**: OMO, Bank Rate, Reserve Requirements.
- **Qualitative Tools**: Moral Suasion, Credit Rationing.

---

## CHAPTER 4: THE IS-LM MODEL

### 4.1 The IS Curve
Relationship between interest rates and output where $I = S$. Slopes downward.

### 4.2 The LM Curve
Relationship where $L = M$. Slopes upward.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 4.1: The IS-LM Equilibrium",
  "xAxis": "output",
  "yAxis": "interest_rate",
  "data": [
    {"output": 10, "IS": 10, "LM": 2},
    {"output": 20, "IS": 8, "LM": 4},
    {"output": 30, "IS": 6, "LM": 6},
    {"output": 40, "IS": 4, "LM": 8},
    {"output": 50, "IS": 2, "LM": 10}
  ],
  "series": [
    {"key": "IS", "name": "IS Curve", "color": "#ef4444"},
    {"key": "LM", "name": "LM Curve", "color": "#3b82f6"}
  ]
}
\`\`\`
`,

  "ug-development": `
# COMPREHENSIVE DEVELOPMENT ECONOMICS STUDY GUIDE

## CHAPTER 1: PRINCIPLES AND CONCEPTS

### 1.1 What is Development Economics?
Dealing with economic aspects of the development process in low-income countries.

### 1.2 Core Values of Development
Sustenance, Self-Esteem, Freedom from Servitude.

---

## CHAPTER 2: CLASSIC THEORIES

### 2.1 Harrod-Domar Growth Model
$$g = \\frac{s}{v}$$
### 2.2 Lewis Two-Sector Model
Transfer of labor from agriculture to industry.

---

## CHAPTER 3: CONTEMPORARY MODELS

### 3.1 Solow Growth Model
$$Y = A K^\\alpha L^{1-\\alpha}$$

---

## CHAPTER 4: POVERTY AND INEQUALITY

### 4.1 The Lorenz Curve
\`\`\`chart
{
  "type": "area",
  "title": "Figure 4.1: The Lorenz Curve",
  "xAxis": "population_share",
  "yAxis": "income_share",
  "data": [
    {"population_share": 0, "equality": 0, "actual": 0},
    {"population_share": 20, "equality": 20, "actual": 5},
    {"population_share": 40, "equality": 40, "actual": 15},
    {"population_share": 60, "equality": 60, "actual": 30},
    {"population_share": 80, "equality": 80, "actual": 55},
    {"population_share": 100, "equality": 100, "actual": 100}
  ],
  "series": [
    {"key": "equality", "name": "Line of Perfect Equality", "color": "#94a3b8"},
    {"key": "actual", "name": "Lorenz Curve", "color": "#3b82f6"}
  ]
}
\`\`\`
`,

  "ug-financial": `
# COMPREHENSIVE FINANCIAL ECONOMICS STUDY GUIDE

## CHAPTER 1: ASSET PRICING AND RETURN

### 1.1 Net Present Value (NPV)
$$NPV = \\sum_{t=0}^n \\frac{CF_t}{(1+r)^t}$$

### 1.2 Expected Return and Risk
$$E(R) = \\sum p_i R_i$$
$$\\sigma^2 = \\sum p_i (R_i - E(R))^2$$

---

## CHAPTER 2: PORTFOLIO THEORY AND CAPM

### 2.1 The Capital Asset Pricing Model
$$E(R_i) = R_f + \\beta_i (E(R_m) - R_f)$$

\`\`\`chart
{
  "type": "line",
  "title": "Figure 2.1: The Security Market Line (SML)",
  "xAxis": "beta",
  "yAxis": "return",
  "data": [
    {"beta": 0, "return": 5},
    {"beta": 0.5, "return": 8},
    {"beta": 1.0, "return": 11},
    {"beta": 1.5, "return": 14},
    {"beta": 2.0, "return": 17}
  ],
  "series": [
    {"key": "return", "name": "Required Return", "color": "#ef4444"}
  ]
}
\`\`\`
`,

  "ug-international": `
# COMPREHENSIVE INTERNATIONAL ECONOMICS STUDY GUIDE

## CHAPTER 1: THE BASIS OF INTERNATIONAL TRADE

### 1.1 Why Countries Trade
Countries trade because they can benefit from specialization based on their unique resources and efficiencies.

### 1.2 Absolute Advantage (Adam Smith)
A country should specialize in and export commodities in which it has an absolute advantage.

### 1.3 Comparative Advantage (David Ricardo)
Even if one country has an absolute advantage in both goods, trade can be beneficial if countries specialize where they have a lower opportunity cost.

---

## CHAPTER 2: TRADE THEORIES AND MODELS

### 2.1 The Heckscher-Ohlin Model
A country will export goods that use its abundant factors of production intensively.

### 2.2 The Leontief Paradox
Empirical finding that the US (a capital-abundant country) exported labor-intensive goods, contradicting the H-O theory.

---

## CHAPTER 3: TRADE POLICY AND RESTRICTIONS

### 3.1 Tariffs and Quotas
Governments use tariffs (taxes) and quotas (limits) to protect domestic industries.

### 3.2 The Impact of a Tariff
\`\`\`chart
{
  "type": "line",
  "title": "Figure 3.1: Impact of a Tariff on Domestic Market",
  "xAxis": "quantity",
  "yAxis": "price",
  "data": [
    {"quantity": 10, "demand": 100, "supply": 20},
    {"quantity": 20, "demand": 80, "supply": 40},
    {"quantity": 30, "demand": 60, "supply": 60},
    {"quantity": 40, "demand": 40, "supply": 80},
    {"quantity": 50, "demand": 20, "supply": 100}
  ],
  "series": [
    {"key": "demand", "name": "Domestic Demand", "color": "#ef4444"},
    {"key": "supply", "name": "Domestic Supply", "color": "#3b82f6"}
  ]
}
\`\`\`

---

## CHAPTER 4: BALANCE OF PAYMENTS

### 4.1 Current Account and Capital Account
- **Current Account**: Trade in goods/services, primary/secondary income.
- **Capital Account**: Financial transactions, direct/portfolio investment.

---

## CHAPTER 5: EXCHANGE RATES

### 5.1 Purchasing Power Parity (PPP)
The exchange rate between two currencies should equal the ratio of the two countries' price levels.
$$E = \\frac{P_1}{P_2}$$
`,

  "ug-macro": `
# COMPREHENSIVE MACROECONOMICS STUDY GUIDE

## CHAPTER 1: AGGREGATE DEMAND AND SUPPLY

### 1.1 Aggregate Demand (AD)
The total demand for goods and services in an economy.
$$AD = C + I + G + (X - M)$$

### 1.2 Aggregate Supply (AS)
- **Short-Run AS (SRAS)**: Slopes upward due to sticky wages/prices.
- **Long-Run AS (LRAS)**: Vertical at full-employment output.

---

## CHAPTER 2: THE MULTIPLIER EFFECT

### 2.1 The Investment Multiplier
$$k = \\frac{1}{1 - MPC}$$
Where $MPC$ is the Marginal Propensity to Consume.

---

## CHAPTER 3: FISCAL AND MONETARY POLICY

### 3.1 Fiscal Policy
Government spending and taxation to influence AD.

### 3.2 Monetary Policy
Central bank actions to manage money supply and interest rates.

---

## CHAPTER 4: INFLATION AND UNEMPLOYMENT

### 4.1 The Phillips Curve
Inverse relationship between inflation and unemployment in the short run.

\`\`\`chart
{
  "type": "line",
  "title": "Figure 4.1: The Phillips Curve",
  "xAxis": "unemployment",
  "yAxis": "inflation",
  "data": [
    {"unemployment": 2, "inflation": 10},
    {"unemployment": 4, "inflation": 6},
    {"unemployment": 6, "inflation": 4},
    {"unemployment": 8, "inflation": 3},
    {"unemployment": 10, "inflation": 2.5}
  ],
  "series": [
    {"key": "inflation", "name": "Short-Run Phillips Curve", "color": "#10b981"}
  ]
}
\`\`\`
`,
  "ug-statistical": `
# COMPREHENSIVE STATISTICAL ECONOMICS STUDY GUIDE

## CHAPTER 1: DATA AND STATISTICS

### 1.1 Data Collection and Representation
Statistics is the science of collecting, analyzing, presenting, and interpreting data. In economics, data provides the empirical foundation for theories.

### 1.2 Types of Data
1. **Time Series Data**: Observations over time (e.g., Annual GDP over 20 years).
2. **Cross-Sectional Data**: Observations of different units at the same point in time (e.g., Income of 100 households in 2023).
3. **Panel Data**: Combination of both (e.g., Annual GDP of 10 countries over 20 years).

---

## CHAPTER 2: PROBABILITY DISTRIBUTIONS

### 2.1 The Normal Distribution
The most important distribution in statistics, characterized by its bell-shaped curve and symmetry around the mean.

### 2.2 Standard Normal Distribution (Z)
A normal distribution with a mean of 0 and a standard deviation of 1.
$$Z = \frac{X - \mu}{\sigma}$$

\`\`\`chart
{
  "type": "area",
  "title": "Figure 2.1: The Normal Distribution Curve",
  "xAxis": "z_score",
  "data": [
    {"z_score": -3, "prob": 0.01},
    {"z_score": -2, "prob": 0.05},
    {"z_score": -1, "prob": 0.24},
    {"z_score": 0, "prob": 0.4},
    {"z_score": 1, "prob": 0.24},
    {"z_score": 2, "prob": 0.05},
    {"z_score": 3, "prob": 0.01}
  ],
  "series": [
    {"key": "prob", "name": "Probability Density", "color": "#6366f1"}
  ]
}
\`\`\`

---

## CHAPTER 3: STATISTICAL INFERENCE

### 3.1 Sampling Distributions
The distribution of a statistic (like the sample mean) computed from all possible samples of a fixed size.

### 3.2 Central Limit Theorem (CLT)
States that for a large enough sample size, the sampling distribution of the mean will be approximately normal, regardless of the population distribution.

### 3.3 Hypothesis Testing
- **Null Hypothesis ($H_0$)**: Statement of no effect or no difference.
- **Alternative Hypothesis ($H_a$)**: Statement of what we want to prove.

---

## CHAPTER 4: REGRESSION ANALYSIS

### 4.1 Simple Linear Regression
$Y = \beta_0 + \beta_1 X + \epsilon$

### 4.2 Correlation Coefficient ($r$)
Measures the strength and direction of the linear relationship between two variables. Range: [-1, 1].

\`\`\`chart
{
  "type": "scatter",
  "title": "Figure 4.1: Correlation Analysis",
  "xAxis": "x",
  "yAxis": "y",
  "regression": true,
  "data": [
    {"x": 10, "y": 12},
    {"x": 20, "y": 25},
    {"x": 30, "y": 28},
    {"x": 40, "y": 45},
    {"x": 50, "y": 48},
    {"x": 60, "y": 62},
    {"x": 70, "y": 75}
  ],
  "series": [
    {"key": "y", "name": "Data Points", "color": "#8b5cf6"}
  ]
}
\`\`\`
`
};

