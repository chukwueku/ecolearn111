export const chapter1 = {
  id: 1,
  title: "Introduction",
  sections: [
    {
      type: "text",
      heading: "1.1 THE NATURE OF STATISTICS",
      content: "Statistics refers to the collection, presentation, analysis, and utilization of numerical data to make inferences and reach decisions in the face of uncertainty in economics, business, and other social and physical sciences.\n\nStatistics is subdivided into descriptive and inferential. Descriptive statistics is concerned with summarizing and describing a body of data. Inferential statistics is the process of reaching generalizations about the whole (called the population) by examining a portion (called the sample). In order for this to be valid, the sample must be representative of the population and the probability of error also must be specified.\n\nDescriptive statistics is discussed in detail in Chap. 2. This is followed by (the more crucial) statistical inference; Chap. 3 deals with probability, Chap. 4 with estimation, and Chap. 5 with hypothesis testing."
    },
    {
      type: "example",
      heading: "EXAMPLE 1",
      content: "Suppose that we have data on the incomes of 1000 U.S. families. This body of data can be summarized by finding the average family income and the spread of these family incomes above and below the average. The data also can be described by constructing a table, chart, or graph of the number or proportion of families in each income class. This is descriptive statistics. If these 1000 families are representative of all U.S. families, we can then estimate and test hypotheses about the average family income in the United States as a whole. Since these conclusions are subject to error, we also would have to indicate the probability of error. This is statistical inference."
    },
    {
      type: "text",
      heading: "1.2 STATISTICS AND ECONOMETRICS",
      content: "Econometrics refers to the application of economic theory, mathematics, and statistical techniques for the purpose of testing hypotheses and estimating and forecasting economic phenomena. Econometrics has become strongly identified with regression analysis. This relates a dependent variable to one or more independent or explanatory variables. Since relationships among economic variables are generally inexact, a disturbance or error term (with well-defined probabilistic properties) must be included (see Prob. 1.8).\n\nChapters 6 and 7 deal with regression analysis; Chap. 8 extends the basic regression model; Chap. 9 deals with methods of testing and correcting for violations in the assumptions of the basic regression model; and Chaps. 10 and 11 deal with two specific areas of econometrics, specifically simultaneous-equations and time-series methods. Thus Chaps. 1 to 5 deal with the statistics required for econometrics (Chaps. 6 to 11). Chapter 12 is concerned with using the computer to aid in the calculations involved in the previous chapters."
    },
    {
      type: "example",
      heading: "EXAMPLE 2",
      content: "Consumption theory tells us that, in general, people increase their consumption expenditure C as their disposable (after-tax) income Y_d increases, but not by as much as the increase in their disposable income. This can be stated in explicit linear equation form as"
    },
    {
      type: "equation",
      latex: "C = b_0 + b_1Y_d",
      number: "1.1"
    },
    {
      type: "text",
      content: "where b_0 and b_1 are unknown constants called parameters. The parameter b_1 is the slope coefficient representing the marginal propensity to consume (MPC). Since even people with identical disposable income are likely to have somewhat different consumption expenditures, the theoretically exact and deterministic relationship represented by Eq. (1.1) must be modified to include a random disturbance or error term, u, making it stochastic:"
    },
    {
      type: "equation",
      latex: "C = b_0 + b_1Y_d + u",
      number: "1.2"
    },
    {
      type: "text",
      heading: "1.3 THE METHODOLOGY OF ECONOMETRICS",
      content: "Econometric research, in general, involves the following three stages:\n\n1. Specification of the model or maintained hypothesis in explicit stochastic equation form, together with the a priori theoretical expectations about the sign and size of the parameters of the function.\n2. Collection of data on the variables of the model and estimation of the coefficients of the function with appropriate econometric techniques (presented in Chaps. 6 to 8).\n3. Evaluation of the estimated coefficients of the function on the basis of economic, statistical, and econometric criteria."
    },
    {
      type: "example",
      heading: "EXAMPLE 3",
      content: "The first stage in econometric research on consumption theory is to state the theory in explicit stochastic equation form, as in Eq. (1.1), with the expectation that b_0 > 0 (i.e., at Y_d = 0, C > 0 as people dissave and/or borrow) and 0 < b_1 < 1. The second stage involves the collection of data on consumption expenditure and disposable income and estimation of Eq. (1.1). The third stage in econometric research involves (1) checking to see if the estimated value of b_0 > 0 and if 0 < b_1 < 1; (2) determining if a \"satisfactory\" proportion of the variation in C is \"explained\" by changes in Y_d and if b_0 and b_1 are \"statistically significant at acceptable levels\" [see Prob. 1.13(c) and Sec. 5.2]; and (3) testing to see if the assumptions of the basic regression model are satisfied or, if not, how to correct for violations. If the estimated relationship does not pass these tests, the hypothesized relationship must be modified and reestimated until a satisfactory estimated consumption relationship is achieved."
    },
    {
      type: "text",
      heading: "Solved Problems - THE NATURE OF STATISTICS",
      content: "1.1 What is the purpose and function of (a) The field of study of statistics? (b) Descriptive statistics? (c) Inferential statistics?\n\n(a) Statistics is the body of procedures and techniques used to collect, present, and analyze data on which to base decisions in the face of uncertainty or incomplete information. Statistical analysis is used today in practically every profession. The economist uses it to test the efficiency of alternative production techniques; the businessperson may use it to test the product design or package that maximizes sales; the sociologist to analyze the result of a drug rehabilitation program; the industrial psychologist to examine workers' responses to plant environment; the political scientist to forecast voting patterns; the physician to test the effectiveness of a new drug; the chemist to produce cheaper fertilizers; and so on.\n\n(b) Descriptive statistics summarizes a body of data with one or two pieces of information that characterize the whole data. It also refers to the presentation of a body of data in the form of tables, charts, graphs, and other forms of graphic display.\n\n(c) Inferential statistics (both estimation and hypothesis testing) refers to the drawing of generalizations about the properties of the whole (called a population) from the specific or a sample drawn from the population. Inferential statistics thus involves inductive reasoning. (This is to be contrasted with deductive reasoning, which ascribes properties to the specific starting with the whole.)\n\n1.8 What justifies the inclusion of a disturbance or error term in regression analysis?\n\nThe inclusion of a (random) disturbance or error term (with well-defined probabilistic properties) is required in regression analysis for three important reasons. First, since the purpose of theory is to generalize and simplify, economic relationships usually include only the most important forces at work. This means that numerous other variables with slight and irregular effects are not included. The error term can be viewed as representing the net effect of this large number of small and irregular forces at work. Second, the inclusion of the error term can be justified in order to take into consideration the net effect of possible errors in measuring the dependent variable, or variable being explained. Finally, since human behavior usually differs in a random way under identical circumstances, the disturbance or error term can be used to capture this inherently random human behavior. This error term thus allows for individual random deviations from the exact and deterministic relationships postulated by economic theory and mathematical economics."
    },
    {
      type: "text",
      heading: "1.9 Consumer demand theory states that...",
      content: "Consumer demand theory states that the quantity demanded of a commodity D_X is a function of, or depends on, its price P_X, consumer's income Y, and the price of other (related) commodities, say, commodity Z (i.e., P_Z). Assuming that consumers' tastes remain constant during the period of analysis, state the preceding theory in (a) specific or explicit linear form or equation and (b) in stochastic form. (c) Which are the coefficients to be estimated? What are they called?"
    },
    {
      type: "equation",
      latex: "(a) \\quad D_X = b_0 + b_1P_X + b_2Y + b_3P_Z",
      number: "1.3"
    },
    {
      type: "equation",
      latex: "(b) \\quad D_X = b_0 + b_1P_X + b_2Y + b_3P_Z + u",
      number: "1.4"
    },
    {
      type: "text",
      content: "(c) The coefficients to be estimated are b_0, b_1, b_2, and b_3. They are called parameters."
    }
  ]
};
