export interface Chapter {
  id: number;
  title: string;
  partId: number;
  partTitle: string;
  topics: string[];
  subtopics?: Record<string, string[]>;
  summary: string;
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
  simulatorMode?: 'simple_regression' | 'multiple_regression' | 'autocorrelation';
}

export const ECONOMETRICS_PARTS = [
  { id: 1, title: 'SINGLE-EQUATION REGRESSION MODELS', range: 'Chapters 1 - 8' },
  { id: 2, title: 'RELAXING THE ASSUMPTIONS OF THE CLASSICAL MODEL', range: 'Chapters 9 - 11' },
  { id: 3, title: 'TOPICS IN ECONOMETRICS & TIME SERIES', range: 'Chapter 12' }
];

export const ECONOMETRICS_CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "The Nature and Methodology of Econometrics",
    partId: 1,
    partTitle: "SINGLE-EQUATION REGRESSION MODELS",
    topics: [
      "I.1 What is Econometrics?",
      "I.2 Why a Separate Discipline?",
      "I.3 Methodology of Econometrics",
      "I.4 Types of Econometrics",
      "I.7 Terminology, Notation, and Sources of Data"
    ],
    subtopics: {
      "I.1 What is Econometrics?": [
        "Definition of Econometrics as a separate discipline integrating theory, math, and statistics",
        "Empirical verification of economic laws using quantitative datasets",
        "Key goals: model estimation, structural hypothesis testing, and policy simulation"
      ],
      "I.2 Why a Separate Discipline?": [
        "Limitations of qualitative economic theory (provides direction without numerical magnitude)",
        "Deterministic mathematical economics equations vs. stochastic, random economic reality",
        "Raw economic statistics collections vs. active, structural econometric modeling"
      ],
      "I.3 Methodology of Econometrics": [
        "1. Statement of Theory or Hypothesis (e.g. Keynesian consumption propensity)",
        "2. Specification of Mathematical Model of consumption ($Y = \\beta_1 + \\beta_2 X$)",
        "3. Specification of Econometric/Statistical Model with stochastic disturbance ($u$)",
        "4. Gathering Data: cross-sectional survey or macro time-series acquisition",
        "5. Numerical Estimation of parameters (OLS slope and intercept estimation)",
        "6. Statistical Hypothesis Testing ($t$-tests for marginal impact, $F$-tests for significance)",
        "7. Forecasting or Prediction (using parameters for out-of-sample projections)",
        "8. Policy Design or Control (modifying inputs to steer economic outputs)"
      ],
      "I.4 Types of Econometrics": [
        "Theoretical Econometrics: developing estimators (OLS, MLE, GLS, IV, GMM) and mathematical proofs",
        "Applied Econometrics: empirical study of real-world areas (Labor, Macro, Finance, Health)"
      ],
      "I.7 Terminology, Notation, and Sources of Data": [
        "Dependent variable (regressand, explained, endogenous, target variable)",
        "Explanatory variable (regressor, independent, exogenous, control variable)",
        "Data taxonomies: Time Series (temporal), Cross-Sectional (entities), Panel/Pooled (joint)",
        "Sources of economic data: FRED (Federal Reserve), World Bank, IMF, national bureaus"
      ]
    },
    summary: "Econometrics is a separate discipline that integrates economic theory, mathematical economics, and statistical methods to give empirical content to economic relations. Traditional econometric methodology follows a systematic eight-step process:\n1. Statement of theory or hypothesis.\n2. Specification of the mathematical model.\n3. Specification of the statistical/econometric model (introducing the stochastic disturbance term $u$).\n4. Obtaining data.\n5. Estimation of parameters.\n6. Hypothesis testing.\n7. Forecasting or prediction.\n8. Use of the model for control or policy purposes.\n\nData for economic analysis is categorized into time series (collected over periods), cross-sectional (collected at one point in time across multiple units), and panel/pooled data (combining both cross-sectional and time-series elements).",
    quiz: [
      {
        question: "Why is a stochastic disturbance term (u) included in an econometric model?",
        options: [
          "To account for the mathematical certainty of economic theories",
          "To capture random human behavior, omitted variables, and measurement errors",
          "To force the intercept coefficient to be zero",
          "To satisfy the requirement that all economic variables must be linear"
        ],
        answer: 1,
        explanation: "The stochastic disturbance term (u) is a catch-all representing variables omitted from the model, intrinsic randomness in human behavior, and measurement inaccuracies."
      },
      {
        question: "Which type of data collects observations on multiple economic entities (e.g., households, firms) at a single point in time?",
        options: [
          "Time series data",
          "Cross-sectional data",
          "Panel data",
          "Integrated data"
        ],
        answer: 1,
        explanation: "Cross-sectional data consists of observations of multiple subjects at a single point in time, unlike time series which follows a single subject over multiple intervals."
      }
    ]
  },
  {
    id: 2,
    title: "Two-Variable Regression Analysis: Basic Ideas",
    partId: 1,
    partTitle: "SINGLE-EQUATION REGRESSION MODELS",
    topics: [
      "2.1 A Hypothetical Example",
      "2.2 The Concept of Population Regression Function (PRF)",
      "2.3 The Meaning of the Term 'Linear'",
      "2.4 Stochastic Specification of PRF",
      "2.6 The Sample Regression Function (SRF)"
    ],
    subtopics: {
      "2.1 A Hypothetical Example": [
        "Analyzing the conditional distribution of consumer spending relative to gross weekly household income",
        "Visualizing conditional probabilities and conditional means of Y given X via scatter plots",
        "Concept of subpopulation means and variation within groups"
      ],
      "2.2 The Concept of Population Regression Function (PRF)": [
        "Defining the conditional expectation function: $E(Y|X_i)$",
        "How the PRF represents the systematic, predictable component of the relationship",
        "Functional forms of population parameters ($\\beta_1$ intercept, $\\beta_2$ slope coefficient)"
      ],
      "2.3 The Meaning of the Term 'Linear'": [
        "Linearity in variables: variables raised to the first power only vs non-linear variables ($X^2$, $\\ln X$)",
        "Linearity in parameters: parameters entered only as first-order coefficients without products or quotients",
        "Crucial guideline: OLS requires models to be strictly linear in parameters (variables can be non-linear)"
      ],
      "2.4 Stochastic Specification of PRF": [
        "Introducing the stochastic error/disturbance term ($u_i$) to represent deviations from conditional mean",
        "Additive decomposition of Y into systematic deterministic mean and non-systematic stochastic error",
        "Rationales for the error term: omitted factors, human randomness, model abstraction, measurement errors"
      ],
      "2.6 The Sample Regression Function (SRF)": [
        "Recognizing that population parameters are unobservable and estimated using random sample subsets",
        "Formulating the Sample Regression Function (SRF): $\\hat{Y}_i = \\hat{\\beta}_1 + \\hat{\\beta}_2 X_i$",
        "Distinguishing between population error ($u_i$) and sample calculated residuals ($e_i$ or $\\hat{u}_i$)"
      ]
    },
    summary: "The fundamental goal of regression analysis is to estimate the mean or average value of a dependent variable ($Y$) conditional on the known or fixed values of one or more independent variables ($X$). The Population Regression Function (PRF) represents this conditional expectation: $E(Y|X) = \\beta_1 + \\beta_2 X$. Crucially, 'linearity' in econometrics means linearity in the parameters (the $\\beta$ coefficients), not necessarily in the variables. \n\nBecause individual observations of $Y$ deviate from their conditional mean, we write the stochastic PRF as $Y_i = \\beta_1 + \\beta_2 X_i + u_i$. Since we cannot observe the entire population, we estimate the PRF using the Sample Regression Function (SRF): $\\hat{Y}_i = \\hat{\\beta}_1 + \\hat{\\beta}_2 X_i$, where $\\hat{\\beta}_1$ and $\\hat{\\beta}_2$ are estimators of the true parameters.",
    quiz: [
      {
        question: "In econometrics, what does the requirement of 'linearity' strictly refer to?",
        options: [
          "Linearity in the explanatory variables (X)",
          "Linearity in the dependent variable (Y)",
          "Linearity in the parameters (beta)",
          "Linearity in both variables and parameters"
        ],
        answer: 2,
        explanation: "An econometric model must be linear in its parameters (beta coefficients). The variables (X and Y) can be non-linear (e.g., squared, logarithmic, reciprocal) without violating the assumptions of linear regression."
      }
    ]
  },
  {
    id: 3,
    title: "Two-Variable Regression: OLS Estimation",
    partId: 1,
    partTitle: "SINGLE-EQUATION REGRESSION MODELS",
    topics: [
      "3.1 The Method of Ordinary Least Squares (OLS)",
      "3.2 The Assumptions Underlying OLS (CLRM)",
      "3.3 Standard Errors and Precision of Estimators",
      "3.5 The Coefficient of Determination r^2",
      "3.6 The Gauss-Markov Theorem"
    ],
    subtopics: {
      "3.1 The Method of Ordinary Least Squares (OLS)": [
        "The OLS principle: minimizing the sum of squared sample residuals ($\\sum e_i^2 = \\sum (Y_i - \\hat{Y}_i)^2$)",
        "Mathematical optimization: setting up first-order conditions and partial derivatives to obtain 'Normal Equations'",
        "Closed-form algebraic formulas for slope estimator $\\hat{\\beta}_2$ and intercept estimator $\\hat{\\beta}_1$"
      ],
      "3.2 The Assumptions Underlying OLS (CLRM)": [
        "10 core structural requirements of the Classical Linear Regression Model",
        "Assumptions: $E(u_i | X_i) = 0$ (exogeneity), $Var(u_i) = \\sigma^2$ (homoscedasticity), $Cov(u_i, u_j) = 0$ (no correlation)",
        "Additional requirements: No correlation between error $u_i$ and regressor $X_i$, and non-stochastic fixed values of X"
      ],
      "3.3 Standard Errors and Precision of Estimators": [
        "Determining the sampling distributions and statistical variances of OLS parameter estimators",
        "Derivation of parameter standard errors: $Var(\\hat{\\beta}_2) = \\sigma^2 / \\sum x_i^2$",
        "Estimating unobserved $\\sigma^2$ using sample residual sum of squares divided by degrees of freedom ($n - 2$)"
      ],
      "3.5 The Coefficient of Determination r^2": [
        "Decomposing variation: Total Sum of Squares (TSS) = Explained Sum of Squares (ESS) + Residual Sum of Squares (RSS)",
        "Mathematical definition of $r^2 = ESS / TSS$: proportion of total dependent variable variation explained by X",
        "Properties of $r^2$: bounded between 0 and 1, relation to the correlation coefficient $r$"
      ],
      "3.6 The Gauss-Markov Theorem": [
        "Defining BLUE criteria: Best Linear Unbiased Estimator",
        "Mathematical proof of unbiasedness ($E(\\hat{\\beta}_j) = \\beta_j$) and minimum variance efficiency",
        "Proving that under CLRM, no other linear unbiased estimator can achieve smaller parameter variances than OLS"
      ]
    },
    summary: "The method of Ordinary Least Squares (OLS) minimizes the sum of squared residuals: $\\sum \\hat{u}_i^2 = \\sum (Y_i - \\hat{\\beta}_1 - \\hat{\\beta}_2 X_i)^2$. The resulting OLS estimators are given by:\n$$\\hat{\\beta}_2 = \\frac{\\sum (X_i - \\bar{X})(Y_i - \\bar{Y})}{\\sum (X_i - \\bar{X})^2}$$\n$$\\hat{\\beta}_1 = \\bar{Y} - \\hat{\\beta}_2 \\bar{X}$$\n\nTo ensure OLS estimators possess desirable statistical properties, the Classical Linear Regression Model (CLRM) imposes key assumptions:\n1. Zero mean value of $u_i$: $E(u_i|X_i) = 0$.\n2. Homoscedasticity (constant variance): $Var(u_i) = \\sigma^2$.\n3. No autocorrelation: $Cov(u_i, u_j) = 0$ for $i \\neq j$.\n4. Zero covariance between $u_i$ and $X_i$: $Cov(u_i, X_i) = 0$.\n\nUnder these assumptions, the Gauss-Markov Theorem proves that OLS estimators are **BLUE** (Best Linear Unbiased Estimators), meaning they have the minimum variance among all linear unbiased estimators. The coefficient of determination $r^2$ measures the goodness of fit: the proportion of total variation in $Y$ explained by the regression on $X$.",
    quiz: [
      {
        question: "What does the Gauss-Markov Theorem state about OLS estimators?",
        options: [
          "They are always biased but have high R-squared values",
          "They are Best Linear Unbiased Estimators (BLUE) under CLRM assumptions",
          "They are non-linear and require maximum likelihood to be estimated",
          "They are only valid if sample size is extremely small (micronumerosity)"
        ],
        answer: 1,
        explanation: "The Gauss-Markov Theorem proves that OLS estimators have the minimum variance (are 'Best') among all linear unbiased estimators, under the standard CLRM assumptions."
      },
      {
        question: "Which of the following is NOT an assumption of the Classical Linear Regression Model (CLRM)?",
        options: [
          "Homoscedasticity of error terms",
          "Zero autocorrelation among errors",
          "Exogeneity of regressors (no correlation between X and u)",
          "The explanatory variable X must be a random variable normally distributed"
        ],
        answer: 3,
        explanation: "CLRM assumes that X is non-stochastic (fixed in repeated samples) or, if stochastic, is distributed independently of the error term u. It does not require X to be normally distributed."
      }
    ],
    simulatorMode: 'simple_regression'
  },
  {
    id: 4,
    title: "Classical Normal Linear Regression Model (CNLRM)",
    partId: 1,
    partTitle: "SINGLE-EQUATION REGRESSION MODELS",
    topics: [
      "4.1 The Probability Distribution of u_i",
      "4.2 The Normality Assumption for u_i",
      "4.3 Properties of OLS Estimators under Normality",
      "4.4 The Method of Maximum Likelihood (ML)"
    ],
    subtopics: {
      "4.1 The Probability Distribution of u_i": [
        "Why the Gauss-Markov theorem alone is insufficient for constructing confidence intervals or testing hypotheses",
        "The requirement of specifying the probability distribution of error terms to conduct statistical inference"
      ],
      "4.2 The Normality Assumption for u_i": [
        "Rationale for normal distribution: Central Limit Theorem for the sum of independent random forces",
        "Mathematical notation and density function: $u_i \\sim N(0, \\sigma^2)$",
        "Assessing normality using graphical tools (Normal Probability Plots) and formal tests (Jarque-Bera test)"
      ],
      "4.3 Properties of OLS Estimators under Normality": [
        "Proving that OLS estimators are normally distributed: $\\hat{\\beta}_2 \\sim N(\\beta_2, Var(\\hat{\\beta}_2))$",
        "Minimum variance properties matching the Cramer-Rao Lower Bound (achieving asymptotic efficiency)",
        "Proving the statistical independence of parameter estimators ($\\hat{\\beta}_1, \\hat{\\beta}_2$) and sample variance estimators ($s^2$)"
      ],
      "4.4 The Method of Maximum Likelihood (ML)": [
        "Formulating the Joint Density Function (Likelihood Function) of normal observations",
        "Comparing estimators: ML point estimates of slope and intercept are mathematically identical to OLS",
        "Biasedness of ML error variance estimator: $\\sigma^2_{ML} = \\sum e_i^2 / n$ vs. unbiased OLS $s^2 = \\sum e_i^2 / (n-2)$"
      ]
    },
    summary: "While the Gauss-Markov theorem does not require any assumption about the probability distribution of $u_i$ to prove OLS is BLUE, we must specify its distribution to perform statistical inference (hypothesis testing and confidence intervals). The Classical Normal Linear Regression Model (CNLRM) assumes $u_i$ is normally distributed:\n$$u_i \\sim N(0, \\sigma^2)$$\n\nSince OLS estimators are linear functions of $u_i$, this normality assumption implies that $\\hat{\\beta}_1$ and $\\hat{\\beta}_2$ are also normally distributed:\n$$\\hat{\\beta}_2 \\sim N\\left(\\beta_2, \\frac{\\sigma^2}{\\sum x_i^2}\\right)$$\n\nThis permits us to construct $t$ and $F$ statistics for hypothesis testing. An alternative estimation method is Maximum Likelihood (ML), which for normally distributed errors yields parameter estimates identical to OLS for the slopes, but a biased estimator for the variance: $\\sigma^2_{ML} = \\sum \\hat{u}_i^2 / n$ (undivided by degrees of freedom).",
    quiz: [
      {
        question: "Under the CNLRM normality assumption, what is the exact distribution of the OLS slope estimator?",
        options: [
          "Normal distribution",
          "Chi-Square distribution",
          "F-distribution",
          "Poisson distribution"
        ],
        answer: 0,
        explanation: "Since OLS estimators are linear combinations of the normally distributed error terms u, they are themselves normally distributed."
      },
      {
        question: "How do Maximum Likelihood (ML) estimates of beta coefficients compare to OLS estimates under normal errors?",
        options: [
          "ML estimates are completely different and highly biased",
          "ML estimates are mathematically identical to OLS estimates",
          "ML estimates have larger standard errors than OLS",
          "ML estimates cannot be calculated without matrix algebra"
        ],
        answer: 1,
        explanation: "Under the assumption of normally distributed disturbances, the ML estimators of the intercept and slope coefficients are identical to their OLS counterparts."
      }
    ]
  },
  {
    id: 5,
    title: "Interval Estimation and Hypothesis Testing",
    partId: 1,
    partTitle: "SINGLE-EQUATION REGRESSION MODELS",
    topics: [
      "5.2 Interval Estimation: Basic Concepts",
      "5.3 Confidence Intervals for Beta Coefficients",
      "5.6 Hypothesis Testing: Confidence-Interval vs Test-of-Significance",
      "5.7 The t-test and Chi-square (χ2) Test",
      "5.9 Analysis of Variance (ANOVA) in Regression"
    ],
    subtopics: {
      "5.2 Interval Estimation: Basic Concepts": [
        "Why point estimates are susceptible to sampling error, creating a need for range/interval estimates",
        "Defining confidence intervals, confidence coefficients ($1-\\alpha$), and the level of significance ($\\alpha$)",
        "The correct probability interpretation of a confidence interval under repeated sampling trials"
      ],
      "5.3 Confidence Intervals for Beta Coefficients": [
        "Constructing confidence bounds for $\\beta_1$ and $\\beta_2$ using standard errors and the Student's $t$-distribution",
        "Determining critical $t_{\\alpha/2}$ values based on degrees of freedom ($n-2$)",
        "How sample size ($n$), regressor spread, and model error variance control the width of the interval"
      ],
      "5.6 Hypothesis Testing: Confidence-Interval vs Test-of-Significance": [
        "Formulating Null ($H_0$) and Alternative ($H_1$) hypotheses (one-tailed vs. two-tailed tests)",
        "Confidence-Interval decision rules: Rejecting $H_0$ if the hypothesized value lies outside the confidence interval bounds",
        "Balancing Type I error (rejecting true $H_0$) and Type II error (accepting false $H_0$)"
      ],
      "5.7 The t-test and Chi-square (χ2) Test": [
        "The test-of-significance approach: calculating test statistics $t = (\\hat{\\beta}_2 - \\beta_2^*) / se(\\hat{\\beta}_2)$",
        "Constructing decision regions with critical regions and calculating exact $p$-values",
        "Utilizing the Chi-square ($\\chi^2$) test to perform hypothesis tests on the true error variance ($\\sigma^2$)"
      ],
      "5.9 Analysis of Variance (ANOVA) in Regression": [
        "Structuring the ANOVA Table: partitioning Total Sum of Squares (TSS) into Explained Sum of Squares (ESS) and Residual Sum of Squares (RSS)",
        "Formulating the overall $F$-test to evaluate the joint hypothesis of model significance",
        "Mathematical proof of equivalence between $F$ and $t$ tests in simple regression: $F_{1, n-2} = t^2_{n-2}$"
      ]
    },
    summary: "Statistical inference in regression involves two main approaches: Interval Estimation (constructing confidence intervals) and Hypothesis Testing (comparing a test statistic to a critical value).\n\nTo test the null hypothesis $H_0: \\beta_2 = 0$ (meaning $X$ has no effect on $Y$), we calculate the $t$-statistic:\n$$t = \\frac{\\hat{\\beta}_2 - \\beta_2^*}{se(\\hat{\\beta}_2)}$$\n\nIf the calculated $|t|$ exceeds the critical $t_{\\alpha/2}$ with $n-2$ degrees of freedom, we reject $H_0$. Alternatively, we look at the $p$-value: the probability of obtaining a test statistic at least as extreme as the observed one under $H_0$. \n\nAnalysis of Variance (ANOVA) decomposes the Total Sum of Squares ($TSS = \\sum(Y_i - \\bar{Y})^2$) into Explained Sum of Squares ($ESS = \\sum(\\hat{Y}_i - \\bar{Y})^2$) and Residual Sum of Squares ($RSS = \\sum\\hat{u}_i^2$). For a two-variable model, the $F$-statistic testing the overall significance of the regression is $F = (ESS/1) / (RSS/(n-2))$, which is mathematically equal to $t^2$.",
    quiz: [
      {
        question: "What is the relationship between the F-statistic and the t-statistic of the slope coefficient in a simple two-variable linear regression?",
        options: [
          "F is equal to t",
          "F is equal to the square of t (F = t^2)",
          "F is equal to 1 / t",
          "There is no mathematical relationship between them"
        ],
        answer: 1,
        explanation: "In a simple two-variable model, testing the overall significance with an F-test is equivalent to testing the single slope coefficient with a t-test, with F = t^2."
      }
    ]
  },
  {
    id: 6,
    title: "Extensions and Functional Forms of Regression",
    partId: 1,
    partTitle: "SINGLE-EQUATION REGRESSION MODELS",
    topics: [
      "6.1 Regression Through the Origin",
      "6.4 Functional Forms of Regression Models",
      "6.5 The Log-Linear (Double-Log) Model",
      "6.6 Semilog Models (Log-Lin and Lin-Log)"
    ],
    subtopics: {
      "6.1 Regression Through the Origin": [
        "Analyzing regressions forced through the origin ($Y_i = \\beta_2 X_i + u_i$)",
        "Peculiarities: the sum of sample residuals $\\sum e_i$ is not necessarily zero, and standard $r^2$ formulas can yield negative values",
        "Valid applications of intercept-free regressions (e.g., asset return models, physical laws)"
      ],
      "6.4 Functional Forms of Regression Models": [
        "Using mathematical transformations to model non-linear relationships within a linear parameter framework",
        "Criteria for selecting correct functional specifications based on economic theory and scatter plots",
        "Diagnostic errors from selecting incorrect structural shapes"
      ],
      "6.5 The Log-Linear (Double-Log) Model": [
        "Formulating double-log equations: $\\ln Y_i = \\beta_1 + \\beta_2 \\ln X_i + u_i$",
        "Mathematical derivation showing why slope coefficient $\\beta_2$ measures constant elasticity (elasticity model)",
        "Core applications: Cobb-Douglas production frontiers, market demand elasticities"
      ],
      "6.6 Semilog Models (Log-Lin and Lin-Log)": [
        "Log-Lin models ($\\ln Y_i = \\beta_1 + \\beta_2 X_i + u_i$) for estimating constant relative/percentage growth rates",
        "Lin-Log models ($Y_i = \\beta_1 + \\beta_2 \\ln X_i + u_i$) for estimating absolute changes resulting from percentage changes in X",
        "Alternative shapes: reciprocal models ($1/X$) and polynomial (quadratic/cubic) regressions (e.g., Phillips Curve)"
      ]
    },
    summary: "Economic relationships are frequently non-linear. By applying mathematical transformations, we can estimate these relations using linear regression techniques:\n\n1. **Log-Linear (Double-Log) Model**: $\\ln Y_i = \\beta_1 + \\beta_2 \\ln X_i + u_i$. Here, the slope coefficient $\\beta_2$ measures the **elasticity** of $Y$ with respect to $X$ (constant elasticity model).\n2. **Log-Lin Model**: $\\ln Y_i = \\beta_1 + \\beta_2 X_i + u_i$. The slope coefficient measures the constant **relative change** in $Y$ for an absolute change in $X$ (e.g., estimating growth rates: compound growth is $100 \\times \\beta_2$ percent).\n3. **Lin-Log Model**: $Y_i = \\beta_1 + \\beta_2 \\ln X_i + u_i$. The slope coefficient measures the absolute change in $Y$ for a relative change in $X$: $\\Delta Y = (\\beta_2 / 100) \\%\\Delta X$.\n4. **Reciprocal Model**: $Y_i = \\beta_1 + \\beta_2(1/X_i) + u_i$. As $X$ approaches infinity, $Y$ approaches the asymptote $\\beta_1$. This is used to model things like the Phillips Curve.",
    quiz: [
      {
        question: "In a double-log (log-linear) regression model, how is the slope coefficient (beta_2) interpreted?",
        options: [
          "As the absolute change in Y for a unit change in X",
          "As the percentage growth rate of Y",
          "As the elasticity of Y with respect to X",
          "As the marginal propensity to consume"
        ],
        answer: 2,
        explanation: "In a log-log model, the slope parameter measures the percentage change in Y for a 1% change in X, which is the definition of elasticity."
      },
      {
        question: "Which model is most appropriate for estimating the compound growth rate of an economic variable over time?",
        options: [
          "Lin-Log model",
          "Log-Lin model",
          "Reciprocal model",
          "Linear model"
        ],
        answer: 1,
        explanation: "A Log-Lin model (e.g., ln(GDP) regressed on Time) measures relative change in Y per unit absolute change in time, making it the standard model to calculate compound growth rates."
      }
    ]
  },
  {
    id: 7,
    title: "Multiple Regression Analysis: Estimation & Inference",
    partId: 1,
    partTitle: "SINGLE-EQUATION REGRESSION MODELS",
    topics: [
      "7.1 The Three-Variable Model",
      "7.3 Partial Regression Coefficients",
      "7.5 Multiple Coefficient of Determination R^2 and Adjusted R^2",
      "7.9 The Cobb-Douglas Production Function",
      "8.5 Testing the Overall Significance: The F-test"
    ],
    subtopics: {
      "7.1 The Three-Variable Model": [
        "Expanding to multi-regressor formulations: $Y_i = \\beta_1 + \\beta_2 X_{2i} + \\beta_3 X_{3i} + u_i$",
        "Derivation of the system of partial normal equations using multivariable calculus",
        "Algebraic solutions for partial slope parameters and the intercept coefficient"
      ],
      "7.3 Partial Regression Coefficients": [
        "Concept of partial slope parameters: measuring the net marginal effect of $X_j$ while holding other regressors constant",
        "Understanding ceteris paribus adjustments and controlling for confounding factors",
        "Distinguishing between simple regression slopes and partial regression slopes"
      ],
      "7.5 Multiple Coefficient of Determination R^2 and Adjusted R^2": [
        "Why standard $R^2$ is non-decreasing as additional explanatory variables are introduced, creating overfitting bias",
        "Formulating the Adjusted $R^2$ (denoted $\\bar{R}^2$) to penalize model complexity based on degrees of freedom",
        "Evaluating model expansion using $\\bar{R}^2$ criteria: standard vs. adjusted fit indicators"
      ],
      "7.9 The Cobb-Douglas Production Function": [
        "Empirical formulation of production curves: $Q = A K^\\alpha L^\\beta \\implies \\ln Q = \\ln A + \\alpha \\ln K + \\beta \\ln L$",
        "Interpreting parameters as capital and labor output elasticities",
        "Formulating linear restrictions to test constant returns to scale ($H_0: \\alpha + \\beta = 1$)"
      ],
      "8.5 Testing the Overall Significance: The F-test": [
        "Formulating the joint null hypothesis that all partial slope coefficients are simultaneously zero ($H_0: \\beta_2 = \\beta_3 = 0$)",
        "Structuring the multi-variable ANOVA table with model and error degrees of freedom",
        "The $F$-statistic formula using $R^2$ and calculating its joint significance threshold"
      ]
    },
    summary: "Multiple regression analysis extends the model to include more than one explanatory variable: $Y_i = \\beta_1 + \\beta_2 X_{2i} + \\beta_3 X_{3i} + u_i$. The coefficients $\\beta_2$ and $\\beta_3$ are called **partial regression coefficients** because they measure the effect of one variable while holding the other constant.\n\nAdding variables to a model always increases the standard $R^2$, even if the added variables are irrelevant. To correct for this, we use the **Adjusted $R^2$** (denoted $\\bar{R}^2$), which penalizes the addition of degrees-of-freedom-consuming regressors:\n$$\\bar{R}^2 = 1 - (1 - R^2)\\frac{n-1}{n-k}$$\n\nTo test the joint hypothesis that all partial slope coefficients are simultaneously zero ($H_0: \\beta_2 = \\beta_3 = 0$), we perform an $F$-test using the formula:\n$$F = \\frac{R^2 / (k-1)}{(1-R^2) / (n-k)}$$\nwhere $k$ is the number of estimated parameters.",
    quiz: [
      {
        question: "What is the critical difference between R-squared and Adjusted R-squared?",
        options: [
          "Adjusted R-squared can never be negative, unlike standard R-squared",
          "Adjusted R-squared penalizes the inclusion of additional explanatory variables",
          "Standard R-squared accounts for degrees of freedom, whereas Adjusted R-squared does not",
          "Adjusted R-squared is only used in simple two-variable regressions"
        ],
        answer: 1,
        explanation: "Standard R-squared increases or stays the same when new variables are added. Adjusted R-squared incorporates the degrees of freedom and will only increase if the marginal contribution of the new variable exceeds what is expected by chance."
      }
    ],
    simulatorMode: 'multiple_regression'
  },
  {
    id: 8,
    title: "Dummy Variable Regression Models",
    partId: 1,
    partTitle: "SINGLE-EQUATION REGRESSION MODELS",
    topics: [
      "9.1 The Nature of Dummy Variables",
      "9.2 ANOVA Models (Qualitative Regressors Only)",
      "9.4 ANCOVA Models (Mixed Quantitative & Qualitative)",
      "9.5 Dummy Variable Alternative to the Chow Test",
      "9.6 Interaction Effects Using Dummies"
    ],
    subtopics: {
      "9.1 The Nature of Dummy Variables": [
        "Distinguishing quantitative continuous variables from qualitative categorical variables (gender, region, treatment)",
        "Binary 0-1 coding scheme for indicator variables",
        "Defining reference (base) groups and avoiding the 'Dummy Variable Trap' (perfect multicollinearity)"
      ],
      "9.2 ANOVA Models (Qualitative Regressors Only)": [
        "Formulating models with intercept and qualitative regressors but no continuous quantitative variables",
        "Interpreting coefficients as the mean differences between the base category and alternative groups",
        "Testing differences in categorical means using standard OLS joint F-tests"
      ],
      "9.4 ANCOVA Models (Mixed Quantitative & Qualitative)": [
        "Combining dummy variables and quantitative regressors (Analysis of Covariance)",
        "Interpreting parallel intercept shifts: shifting the regression line vertically without changing its slope",
        "Applying ANCOVA to control for structural categorical differences in continuous models"
      ],
      "9.5 Dummy Variable Alternative to the Chow Test": [
        "Assessing structural stability of regression parameters across different sub-samples",
        "Using additive and multiplicative dummy variables simultaneously to allow intercept and slope differences",
        "Running a single pooled regression to test parameters instead of separate subset regressions"
      ],
      "9.6 Interaction Effects Using Dummies": [
        "Formulating interaction terms as the product of a dummy variable and a continuous variable ($D_i \\times X_i$)",
        "Testing for differential slope coefficients (non-parallel regression lines across groups)",
        "Evaluating joint interactions and multi-category compound interaction terms"
      ]
    },
    summary: "In economic research, we often encounter qualitative variables such as gender, race, region, or policy shifts. We incorporate these into linear regressions using **dummy variables** (or indicator variables), which take values of $0$ or $1$.\n\nIf a qualitative variable has $m$ categories, we must introduce only $m-1$ dummy variables to avoid the **dummy variable trap** (perfect multicollinearity with the intercept). The omitted category acts as the base or reference group.\n\n1. **ANOVA Models**: Contain only dummy variables as regressors.\n2. **ANCOVA Models**: Contain a mixture of qualitative (dummy) and quantitative regressors.\n3. **Interaction Dummies**: By including a regressor that is the product of a dummy ($D$) and a quantitative variable ($X$), we allow both the intercept and the slope of the regression line to differ across categories.",
    quiz: [
      {
        question: "If a qualitative variable has 4 distinct categories (e.g., Spring, Summer, Autumn, Winter) and an intercept is included in the regression, how many dummy variables should be added to avoid the dummy variable trap?",
        options: [
          "4 dummies",
          "3 dummies",
          "5 dummies",
          "2 dummies"
        ],
        answer: 1,
        explanation: "To avoid the dummy variable trap (which causes perfect multicollinearity), you must include m - 1 dummy variables, where m is the number of categories. Thus, 4 - 1 = 3 dummies are required."
      },
      {
        question: "What is the Dummy Variable Trap?",
        options: [
          "A programming bug in statistical software packages",
          "A situation of perfect multicollinearity caused by including too many dummy variables",
          "An error resulting from coding dummy variables as 1 and 2 instead of 0 and 1",
          "A model where the dependent variable is dummy-coded"
        ],
        answer: 1,
        explanation: "The dummy variable trap occurs when dummy variables are set up for all categories alongside an intercept, making the sum of the dummies equal to the constant term, causing perfect multicollinearity."
      }
    ]
  },
  {
    id: 9,
    title: "Multicollinearity: Correlated Regressors",
    partId: 2,
    partTitle: "RELAXING THE ASSUMPTIONS OF THE CLASSICAL MODEL",
    topics: [
      "10.1 The Nature of Multicollinearity",
      "10.2 Perfect vs. Imperfect Multicollinearity",
      "10.5 Practical Consequences of Multicollinearity",
      "10.7 Detection of Multicollinearity (VIF & TOL)",
      "10.8 Remedial Measures"
    ],
    subtopics: {
      "10.1 The Nature of Multicollinearity": [
        "Defining multicollinearity as the existence of linear relationships among explanatory variables",
        "Historical origins: Ragnar Frisch and the ideal setup of orthogonal regressors",
        "Distinguishing between physical/structural collinearity and sample-specific collinearity"
      ],
      "10.2 Perfect vs. Imperfect Multicollinearity": [
        "Perfect collinearity: deterministic linear dependencies, singular $(X'X)$ matrix, OLS fails to solve",
        "Imperfect collinearity: high but non-perfect correlation, OLS remains BLUE but estimators lose precision"
      ],
      "10.5 Practical Consequences of Multicollinearity": [
        "Massive inflation of parameter variances and standard errors, leading to low individual $t$-ratios",
        "High overall model $R^2$ paired with individually insignificant explanatory variables",
        "Extreme sensitivity of coefficient estimates to minor data modifications or additions"
      ],
      "10.7 Detection of Multicollinearity (VIF & TOL)": [
        "Formulating the Variance Inflation Factor ($VIF = 1 / (1 - R_j^2)$) and Tolerance ($TOL = 1 / VIF$)",
        "Running auxiliary regressions to isolate collinearity structures among regressors",
        "Standard heuristic rules: evaluating VIF thresholds exceeding 10"
      ],
      "10.8 Remedial Measures": [
        "Evaluating structural trade-offs: dropping collinear variables vs specifying biased models",
        "Remedies: gathering more data, pooling cross-sectional and time-series records, or transforming variables"
      ]
    },
    summary: "Multicollinearity refers to a situation in multiple regression where two or more explanatory variables are highly linearly correlated. \n\n* **Perfect Multicollinearity**: Explanatory variables are perfectly correlated, meaning parameter estimation is mathematically impossible (infinite variances).\n* **Imperfect Multicollinearity**: The variables are highly but not perfectly correlated. OLS estimators remain BLUE, but their **standard errors become extremely large**.\n\n### Consequences:\nLarge standard errors lead to wider confidence intervals and small $t$-ratios, causing us to fail to reject null hypotheses (variables appear statistically insignificant individually, even though the overall $R^2$ and $F$-statistic might be very high).\n\n### Detection:\nWe detect multicollinearity using the **Variance Inflation Factor (VIF)**:\n$$VIF = \\frac{1}{1 - R_j^2}$$\nwhere $R_j^2$ is the coefficient of determination when regressor $X_j$ is regressed on all other explanatory variables. A VIF exceeding $10$ indicates severe multicollinearity.",
    quiz: [
      {
        question: "What is the primary statistical consequence of high but imperfect multicollinearity?",
        options: [
          "OLS estimators become highly biased",
          "Standard errors of estimated coefficients inflate (become very large)",
          "The R-squared value drops close to zero",
          "The F-test becomes completely invalid"
        ],
        answer: 1,
        explanation: "OLS estimators remain unbiased, but their variances and standard errors expand dramatically. This makes the estimates less precise and leads to very low t-statistics."
      },
      {
        question: "A Variance Inflation Factor (VIF) value greater than what threshold is typically considered indicative of severe multicollinearity?",
        options: [
          "VIF > 1",
          "VIF > 2",
          "VIF > 5",
          "VIF > 10"
        ],
        answer: 3,
        explanation: "A VIF greater than 10 (or tolerance TOL < 0.10) is a standard rule of thumb indicating that multicollinearity has severely inflated the variance of an estimator."
      }
    ]
  },
  {
    id: 10,
    title: "Heteroscedasticity: Nonconstant Error Variance",
    partId: 2,
    partTitle: "RELAXING THE ASSUMPTIONS OF THE CLASSICAL MODEL",
    topics: [
      "11.1 The Nature of Heteroscedasticity",
      "11.2 OLS Estimation in the Presence of Heteroscedasticity",
      "11.3 Generalized Least Squares (GLS) & Weighted Least Squares (WLS)",
      "11.5 Detection of Heteroscedasticity (White, Park, Glejser, Goldfeld-Quandt)",
      "11.6 Remedial Measures"
    ],
    subtopics: {
      "11.1 The Nature of Heteroscedasticity": [
        "Defining homoscedasticity ($Var(u_i) = \\sigma^2$) vs heteroscedasticity ($Var(u_i) = \\sigma_i^2$)",
        "Common occurrences in cross-sectional data reflecting differences in scale, quality, or choice variables",
        "Visualizing non-constant variance using error residual vs fitted value scatter plots"
      ],
      "11.2 OLS Estimation in the Presence of Heteroscedasticity": [
        "Proving OLS slope estimates remain unbiased and linear under heteroscedasticity",
        "Loss of efficiency: OLS is no longer BLUE (other estimators have smaller parameter variances)",
        "Biases in calculated standard OLS standard errors, rendering conventional hypothesis tests invalid"
      ],
      "11.3 Generalized Least Squares (GLS) & Weighted Least Squares (WLS)": [
        "Applying transformation matrices to restore homoscedastic properties",
        "Weighted Least Squares (WLS) mechanics: dividing all terms by standard deviations ($\\sigma_i$) as weights",
        "Proving transformed variables satisfy Gauss-Markov assumptions, yielding BLUE estimators"
      ],
      "11.5 Detection of Heteroscedasticity (White, Park, Glejser, Goldfeld-Quandt)": [
        "Informal diagnostics: inspecting residual plots for systematic shapes",
        "Formal testing procedures: Goldfeld-Quandt (sub-sample ratio), Breusch-Pagan, Park, and Glejser tests",
        "White's General Heteroscedasticity Test: regressing squared residuals on regressors, squares, and cross-products"
      ],
      "11.6 Remedial Measures": [
        "Executing WLS transformations when error variances are known or structurally specified",
        "Utilizing White's Heteroscedasticity-Consistent (Robust) Standard Errors to conduct valid inference when variance is unknown",
        "Logarithmic transformations to compress scale and stabilize variances naturally"
      ]
    },
    summary: "The assumption of homoscedasticity states that the variance of the error term is constant: $Var(u_i) = \\sigma^2$. When the variance varies across observations ($Var(u_i) = \\sigma_i^2$), we have **heteroscedasticity**. This is common in cross-sectional data where units vary in size (e.g., small vs. large firms).\n\n### Consequences:\nOLS estimators remain linear and unbiased, but they are **no longer efficient** (they do not have minimum variance, meaning they are no longer BLUE). Crucially, the standard OLS formula for standard errors is biased, rendering conventional $t$-tests and $F$-tests invalid and misleading.\n\n### Detection:\n* **Goldfeld-Quandt Test**: Compares residual variances of two sub-samples.\n* **Breusch-Pagan-Godfrey Test**: Regresses squared residuals on explanatory variables.\n* **White's General Test**: Regresses squared residuals on all regressors, their squares, and cross-products.\n\n### Remediation:\nIf $\\sigma_i^2$ is known, we use **Weighted Least Squares (WLS)**, which divides the regression equation by $\\sigma_i$ to restore constant variance. If unknown, we can use **White's Heteroscedasticity-Consistent Standard Errors** (robust standard errors) to adjust our inferences.",
    quiz: [
      {
        question: "Which of the following describes the core issue of heteroscedasticity?",
        options: [
          "The error terms are correlated with each other over time",
          "The variance of the stochastic disturbance term is non-constant",
          "The independent variables are highly correlated with each other",
          "The model has been specified with an incorrect functional form"
        ],
        answer: 1,
        explanation: "Heteroscedasticity refers specifically to the case where the variance of the error term u differs across observations (non-constant variance)."
      },
      {
        question: "What is the primary consequence of applying Ordinary Least Squares (OLS) to a model with heteroscedasticity?",
        options: [
          "The OLS parameter estimators become highly biased",
          "OLS estimators are no longer linear",
          "OLS estimators are no longer efficient (no longer BLUE), and standard errors are biased",
          "The R-squared value becomes artificially high"
        ],
        answer: 2,
        explanation: "OLS estimators remain unbiased and linear, but they lose efficiency (minimum variance property) and the computed standard errors are incorrect, making hypothesis tests unreliable."
      }
    ]
  },
  {
    id: 11,
    title: "Autocorrelation: Correlated Error Terms",
    partId: 2,
    partTitle: "RELAXING THE ASSUMPTIONS OF THE CLASSICAL MODEL",
    topics: [
      "12.1 The Nature of the Problem",
      "12.4 Consequences of Using OLS",
      "12.6 Detecting Autocorrelation (Durbin-Watson d Test, Breusch-Godfrey BG Test)",
      "12.9 Correcting for Autocorrelation (GLS & Cochrane-Orcutt)",
      "12.10 Newey-West Standard Errors"
    ],
    subtopics: {
      "12.1 The Nature of the Problem": [
        "Defining autocorrelation as correlation between error terms across different observations ($Cov(u_t, u_s) \\neq 0$)",
        "Prevalence in time series data due to inertia, economic cycles, spatial correlations, and lagged adjustments",
        "Formulating the First-Order Autoregressive AR(1) process: $u_t = \\rho u_{t-1} + \\epsilon_t$"
      ],
      "12.4 Consequences of Using OLS": [
        "Unbiasedness of OLS point estimates under autocorrelation",
        "Loss of efficiency: OLS is no longer BLUE (GLS has lower variance)",
        "Severe underestimation of standard errors, leading to inflated $t$-ratios and misleadingly high $R^2$"
      ],
      "12.6 Detecting Autocorrelation (Durbin-Watson d Test, Breusch-Godfrey BG Test)": [
        "The Durbin-Watson $d$ test: derivation of $d \\approx 2(1 - \\hat{\\rho})$ and interpreting boundaries ($0$, $2$, $4$)",
        "Limitations of the Durbin-Watson test: inapplicable to models with lagged dependent variables or higher lags",
        "The Breusch-Godfrey (BG) Lagrange Multiplier test: general testing framework for higher-order lags"
      ],
      "12.9 Correcting for Autocorrelation (GLS & Cochrane-Orcutt)": [
        "Applying the Cochrane-Orcutt iterative procedure to estimate $\\rho$ and transform variables",
        "Prais-Winsten transformation: conserving the first observation's degrees of freedom",
        "Generalized Least Squares (GLS) as the final corrected regression"
      ],
      "12.10 Newey-West Standard Errors": [
        "Formulating HAC (Heteroscedasticity and Autocorrelation Consistent) Standard Errors",
        "Correcting parameter variances asymptotically without changing biased OLS point estimates",
        "Rule-of-thumb lag length selection in macroeconometric studies"
      ]
    },
    summary: "Autocorrelation occurs when error terms of different observations are correlated: $Cov(u_i, u_j) \\neq 0$ for $i \\neq j$. This is highly prevalent in **time series data**, where shocks persist across consecutive quarters or years (e.g., $u_t = \\rho u_{t-1} + \\epsilon_t$).\n\n### Consequences:\nOLS estimators remain linear and unbiased, but they are **no longer efficient** (no longer BLUE). Standard errors are typically severely underestimated, leading to artificially inflated $t$-statistics and a false impression of model accuracy.\n\n### Detection:\n* **Durbin-Watson $d$ Test**: Tests for first-order autocorrelation. The statistic is defined as:\n$$d \\approx 2(1 - \\hat{\\rho})$$\nwhere $\\hat{\\rho}$ is the correlation coefficient of the residuals. A value of $d \\approx 2$ indicates no autocorrelation; $d \\approx 0$ indicates positive autocorrelation, and $d \\approx 4$ indicates negative autocorrelation.\n* **Breusch-Godfrey (BG) Test**: A more general test that allows for higher-order autoregressive or moving average error processes.\n\n### Remediation:\nWe can transform the model using **Generalized Least Squares (GLS)** via the Cochrane-Orcutt iterative procedure, or adjust standard errors using the **Newey-West** method to produce autocorrelation-robust standard errors.",
    quiz: [
      {
        question: "A Durbin-Watson d statistic close to 0 indicates which of the following?",
        options: [
          "No autocorrelation",
          "Strong positive first-order autocorrelation",
          "Strong negative first-order autocorrelation",
          "Perfect homoscedasticity"
        ],
        answer: 1,
        explanation: "Since d is approximately 2(1 - rho), a value of d near 0 means rho is close to 1, indicating strong positive autocorrelation."
      },
      {
        question: "Why is first-order autocorrelation primarily observed in time series data rather than cross-sectional data?",
        options: [
          "Because time series data always has fewer observations",
          "Because economic shocks and events often persist across successive time periods",
          "Because cross-sectional data cannot be logged",
          "Because time series models do not contain intercepts"
        ],
        answer: 1,
        explanation: "Economic variables in successive time periods are linked by inertia, business cycles, and psychological lags, causing shocks in one period to carry over into the next."
      }
    ],
    simulatorMode: 'autocorrelation'
  },
  {
    id: 12,
    title: "Simultaneous-Equation Models & Time Series Basics",
    partId: 3,
    partTitle: "TOPICS IN ECONOMETRICS & TIME SERIES",
    topics: [
      "18.1 Nature of Simultaneous-Equation Models",
      "18.3 Simultaneous-Equation Bias and OLS Inconsistency",
      "19.2 The Identification Problem (Order & Rank Conditions)",
      "20.4 Two-Stage Least Squares (2SLS) Estimation",
      "21.3 Stationary vs. Nonstationary Stochastic Processes",
      "21.9 Unit Root and Cointegration Tests"
    ],
    subtopics: {
      "18.1 Nature of Simultaneous-Equation Models": [
        "Analyzing simultaneous relationships where variables are determined jointly (supply-demand, aggregate income-consumption)",
        "Distinguishing structural equations from reduced-form equations",
        "Classifying endogenous (jointly determined) vs exogenous (pre-determined/fixed) variables"
      ],
      "18.3 Simultaneous-Equation Bias and OLS Inconsistency": [
        "Proving why endogenous variables are correlated with the structural error term ($Cov(X_i, u_i) \\neq 0$)",
        "Mathematical proof of OLS bias and inconsistency when applied directly to a single simultaneous equation"
      ],
      "19.2 The Identification Problem (Order & Rank Conditions)": [
        "The identification puzzle: whether structural parameters can be recovered from estimated reduced-form parameters",
        "The Order Condition: necessary algebraic check matching excluded vs. included variables ($K - k \\ge m - 1$)",
        "The Rank Condition: sufficient matrix algebraic check evaluating the independence of excluded structural parameters"
      ],
      "20.4 Two-Stage Least Squares (2SLS) Estimation": [
        "Stage 1 mechanics: regressing endogenous regressors on all exogenous variables in the system to obtain fitted values",
        "Stage 2 mechanics: running the structural regression replacing endogenous regressors with their fitted, purged values",
        "Properties of 2SLS: asymptotic consistency and efficiency"
      ],
      "21.3 Stationary vs. Nonstationary Stochastic Processes": [
        "Conditions of Weak (Covariance) Stationarity: constant mean, constant variance, and time-independent autocovariance",
        "The 'Spurious Regression' phenomenon: high $R^2$ and highly significant $t$-ratios in regressions of unrelated trending series",
        "Random walks, drift models, and unit-root structural characteristics"
      ],
      "21.9 Unit Root and Cointegration Tests": [
        "Running Augmented Dickey-Fuller (ADF) tests to verify stationarity",
        "Defining Cointegration: stationary linear combinations of non-stationary processes sharing a long-run equilibrium",
        "Modeling dynamic relationships using the Engle-Granger Error Correction Model (ECM)"
      ]
    },
    summary: "In many economic scenarios, variables are determined simultaneously (e.g., demand and supply, or GDP and consumption). \n\n### Simultaneous-Equation Bias:\nIf we apply OLS directly to a single equation in a simultaneous system, we violate the exogeneity assumption because the explanatory variables are correlated with the error term, causing OLS estimators to be **biased and inconsistent**.\n\n### The Identification Problem:\nBefore estimating, we must determine if a structural equation can be identified (parameters can be uniquely recovered). \n* **Order Condition (Necessary)**: $K - k \\ge m - 1$ (excluded variables must exceed included variables minus one).\n* **Rank Condition (Sufficient)**: The rank of the sub-matrix of excluded parameters must equal the number of equations minus one.\n\n### Estimation:\nWe use **Two-Stage Least Squares (2SLS)**. Stage 1 regresses the endogenous variables on all exogenous variables in the system to obtain fitted values. Stage 2 runs the structural regression substituting these fitted values, eliminating simultaneity bias.\n\n### Modern Time Series:\nMost macro time series are nonstationary, leading to **spurious regressions** (high $R^2$ but completely meaningless). We test for stationarity using **Unit Root tests** (Augmented Dickey-Fuller). If two nonstationary series share a long-run equilibrium relationship, they are **cointegrated**, and we model their dynamics using an **Error Correction Mechanism (ECM)**.",
    quiz: [
      {
        question: "Why does applying OLS directly to a single structural equation in a simultaneous system cause biased and inconsistent estimates?",
        options: [
          "Because simultaneous systems have too many degrees of freedom",
          "Because the explanatory endogenous variable is correlated with the error term",
          "Because simultaneous models cannot be estimated using decimals",
          "Because the F-statistic cannot be calculated in simultaneous models"
        ],
        answer: 1,
        explanation: "In a simultaneous system, the dependent variables are determined jointly. This creates feedback loops, making the endogenous regressors correlated with the error term, violating a crucial OLS exogeneity assumption."
      },
      {
        question: "What is a Spurious Regression?",
        options: [
          "A regression that is highly accurate but has a low R-squared",
          "A regression between nonstationary time series that shows a statistically significant relationship when none exists in reality",
          "A regression estimated using biased maximum likelihood estimators",
          "A regression model that contains too many dummy variables"
        ],
        answer: 1,
        explanation: "When regressing two independent, nonstationary time series (e.g., both trending upwards), OLS often produces highly significant t-ratios and R-squared, creating a false illusion of a relationship."
      }
    ]
  }
];

export const getEconometricsExpansion = (id: number): { spotlight: string; mechanics: string; formula?: string; caseStudy: string } => {
  const expansions: Record<number, { spotlight: string; mechanics: string; formula?: string; caseStudy: string }> = {
    1: {
      spotlight: "The birth of econometrics is credited to Ragnar Frisch and Jan Tinbergen (who shared the first Nobel Prize in Economics in 1969) alongside the Cowles Commission. They recognized that verbal economic reasoning and pure mathematical logic were insufficient without empirical validation. Unlike physical sciences, economists cannot perform controlled laboratory experiments. Econometrics was specifically created to extract causal economic relationships from naturally occurring, observational data.",
      mechanics: "Econometric methodology sits at the intersection of economic theory (which states directions of relationships), mathematical economics (which sets up exact equations), and statistics (which handles the probability distributions of error terms). The critical element is isolating 'ceteris paribus' (all other things equal) effects using multiple regression.",
      formula: "Y = f(X_1, X_2, ..., X_k) \\implies Y_i = \\beta_1 + \\beta_2 X_{2i} + ... + \\beta_k X_{ki} + u_i",
      caseStudy: "The estimation of the Marginal Propensity to Consume (MPC). Keynesian theory hypothesized that MPC is between 0 and 1. Through econometric models of consumption regressed on disposable income, economists have consistently estimated real-world MPC values (typically around 0.7 to 0.9) to design national fiscal stimulus packages."
    },
    2: {
      spotlight: "Linearity in parameters is the defining condition for linear regression. A model is linear if the parameters (beta coefficients) appear raised to the first power only and are not multiplied or divided by other parameters. For example, $Y = \\beta_1 + \\beta_2^2 X$ is non-linear in parameters. Conversely, $Y = \\beta_1 + \\beta_2 X^2$ is linear in parameters because the variable $X$ is squared, not the parameter $\\beta_2$. All standard OLS theorems apply to models that are linear in parameters.",
      mechanics: "The Population Regression Function (PRF) describes the behavior of the population as a whole. Since the population is usually inaccessible, we draw a sample and calculate the Sample Regression Function (SRF). The differences between actual Y values and their estimated values in the sample are called residuals ($e_i$), which serve as sample estimators of the unobservable population disturbances ($u_i$).",
      formula: "\\text{PRF}: E(Y|X_i) = \\beta_1 + \\beta_2 X_i \\quad \\longleftrightarrow \\quad \\text{SRF}: \\hat{Y}_i = \\hat{\\beta}_1 + \\hat{\\beta}_2 X_i",
      caseStudy: "The Capital Asset Pricing Model (CAPM) in finance. The model regresses the excess return of a specific stock on the excess return of the entire market. The intercept represents Alpha (excess return), while the slope parameter represents the stock's Beta (systematic risk coefficient), demonstrating linearity in parameters in financial markets."
    },
    3: {
      spotlight: "The Ordinary Least Squares (OLS) estimator is derived by setting up the sum of squared residuals as an objective function and using multi-variable calculus to find the values of beta that minimize it. These are called the 'normal equations.' The Gauss-Markov theorem is the crown jewel of OLS, establishing that no other linear unbiased estimator can beat OLS in terms of efficiency (smallest variance). However, this only holds if the homoscedasticity and no-autocorrelation assumptions are strictly met.",
      mechanics: "Minimizing $\\sum e_i^2$ yields the slope estimator: $\\hat{\\beta}_2 = \\frac{Cov(X,Y)}{Var(X)} = \\frac{\\sum x_i y_i}{\\sum x_i^2}$ in deviation form. The variance of this estimator depends directly on the variance of the error term: $Var(\\hat{\\beta}_2) = \\frac{\\sigma^2}{\\sum x_i^2}$. Greater spread in X increases precision, while larger error variance reduces it.",
      formula: "\\text{Gauss-Markov BLUE Condition}: Var(\\hat{\\beta}_{\\text{OLS}}) \\le Var(\\tilde{\\beta}) \\quad \\forall \\text{ linear unbiased estimators } \\tilde{\\beta}",
      caseStudy: "In labor economics, when regressing Earnings on Years of Education, OLS is used to calculate the private return to schooling. Standard OLS estimates show that each additional year of education yields an average 8-10% increase in hourly earnings, a robust finding across dozens of countries."
    },
    9: {
      spotlight: "The word 'multicollinearity' was coined by Ragnar Frisch. In cases of perfect multicollinearity, the matrix $(X'X)$ is singular and cannot be inverted, meaning OLS equations have no unique solution. In cases of high multicollinearity, the determinant of $(X'X)$ is extremely close to zero, which inflates the diagonal elements of the inverse matrix $(X'X)^{-1}$. These diagonal elements represent the variances of our estimated parameters.",
      mechanics: "As the correlation between $X_2$ and $X_3$ approaches 1, the variance of $\\hat{\\beta}_2$ approaches infinity. This variance inflation is captured by VIF. A high VIF means the standard error is massive, making it very difficult to establish that a variable has any statistically significant impact, even if it is theoretically crucial.",
      formula: "Var(\\hat{\\beta}_j) = \\frac{\\sigma^2}{\\sum x_j^2} \\cdot \\left(\\frac{1}{1 - R_j^2}\\right) = \\frac{\\sigma^2}{\\sum x_j^2} \\cdot VIF_j",
      caseStudy: "Trying to estimate a production function using both 'Capital Stock' and 'Electricity Consumption' as separate independent variables. Because factories with more capital stock naturally consume proportionally more electricity, these two variables are highly collinear, causing OLS to fail to isolate their individual impacts."
    },
    10: {
      spotlight: "Heteroscedasticity is very common in cross-sectional data, but can also occur in time series models where volatility clusters. Under heteroscedasticity, the standard OLS estimator of parameter variance, $\\sigma^2 (X'X)^{-1}$, is biased because the true variance matrix of errors is not a scalar identity matrix $\\sigma^2 I$, but rather a diagonal matrix with unique $\\sigma_i^2$ values. This is why traditional $t$-tests under OLS are completely deceptive when heteroscedasticity is present.",
      mechanics: "We use Weighted Least Squares (WLS) to divide each variable by a weight $w_i = 1/\\sigma_i$. This transforms the heteroscedastic error term $u_i$ into a homoscedastic error $u_i/\\sigma_i$, which has a variance of exactly 1. When the variance structure is unknown, White's robust standard errors compute the square of OLS residuals as proxies for $\\sigma_i^2$, adjusting standard errors directly.",
      formula: "\\text{Weighted Regression Transformation}: \\frac{Y_i}{\\sigma_i} = \\beta_1 \\left(\\frac{1}{\\sigma_i}\\right) + \\beta_2 \\left(\\frac{X_i}{\\sigma_i}\\right) + v_i, \\quad E(v_i^2) = 1",
      caseStudy: "Engel's Law of Food Expenditure. In cross-sectional household surveys, low-income families have very small and tightly clustered food budgets. In contrast, wealthy families have highly volatile food expenditures (some eat simply, others dine luxuriously), creating a classic funnel-shaped scatter plot with massive heteroscedasticity."
    },
    11: {
      spotlight: "Autocorrelation most frequently presents as a first-order autoregressive process, AR(1). Under AR(1), the error term at time $t$ is equal to a fraction of the previous period's error plus a random white noise shock: $u_t = \\rho u_{t-1} + \\epsilon_t$. If $\\rho > 0$, we have positive autocorrelation, which means OLS residuals will tend to have long consecutive strings of positive or negative signs.",
      mechanics: "The Durbin-Watson statistic is $d = \\frac{\\sum_{t=2}^n (e_t - e_{t-1})^2}{\\sum_{t=1}^n e_t^2}$. Expanding this yields $d \\approx 2(1 - \\hat{\\rho})$. If there is perfect positive autocorrelation ($\\rho = 1$), $d = 0$. If there is no autocorrelation ($\\rho = 0$), $d = 2$. Cochrane-Orcutt transforms the variables to $Y_t^* = Y_t - \\rho Y_{t-1}$ to estimate the model via GLS.",
      formula: "u_t = \\rho u_{t-1} + \\epsilon_t \\quad \\longleftrightarrow \\quad Y_t - \\rho Y_{t-1} = \\beta_1(1-\\rho) + \\beta_2(X_t - \\rho X_{t-1}) + \\epsilon_t",
      caseStudy: "Modeling national inflation or stock indices. An unexpected shock (like an oil supply disruption) in quarter 1 will not immediately dissipate; its effects persist in quarter 2 and quarter 3, leading to highly autocorrelated errors if the model does not include lagged variables."
    }
  };

  return expansions[id] || {
    spotlight: "This chapter covers crucial foundational developments in econometric modeling. It emphasizes the importance of combining theoretical insights with statistical rigor to estimate parameters, perform hypothesis tests, and evaluate model specification.",
    mechanics: "The structural mechanics of parameter estimation rely on optimizing an objective function (such as OLS residuals or likelihood function) under the specified degrees of freedom to obtain minimum-variance estimators.",
    caseStudy: "Real-world macroeconomic research consistently employs these econometric formulations to estimate policies and evaluate structural shocks across different sectors."
  };
};
