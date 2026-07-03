export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  subtopics?: string[];
}

export const SECONDARY_ROADMAP: RoadmapTopic[] = [
  { 
    id: 'ss1-ch1', 
    title: 'Meaning of Economics and Basic Concepts', 
    description: 'Definitions, basic concepts (Scarcity, Choice, Opportunity Cost), nature of economics, and why we study it.', 
    category: 'Chapter 1',
    subtopics: [
      'Definition of Economics (Adam Smith, Alfred Marshall, Lionel Robbins)',
      'Basic Concepts: Scarcity, Choice, Scale of Preference, Opportunity Cost',
      'Importance and relevance of Economics to individuals, firms, & government'
    ]
  },
  { 
    id: 'ss1-ch2', 
    title: 'Basic Tools for Economic Analysis', 
    description: 'Functional relationships, tables, graphs, charts, and measures of central tendency (Mean, Median, Mode).', 
    category: 'Chapter 2',
    subtopics: [
      'Mathematical interpretation & functional relationships',
      'Data presentation: Tables, Graphs, Bar/Pie charts & Histograms',
      'Measures of Central Tendency: Arithmetic Mean, Median, and Mode'
    ]
  },
  { 
    id: 'ss1-ch3', 
    title: 'Concepts of Demand, Supply, and Price Determination', 
    description: 'Demand/supply schedules and curves, laws of demand/supply, market equilibrium, and revenue concepts.', 
    category: 'Chapter 3',
    subtopics: [
      'Law and Schedule of Demand & Supply',
      'Determinants of Demand & Supply (curves & shifts)',
      'Market Equilibrium, Price Determination, & Revenue Concepts'
    ]
  },
  { 
    id: 'ss1-ch4', 
    title: 'Theory of Production', 
    description: 'Types of goods and production, factors of production, division of labour, and scale of production.', 
    category: 'Chapter 4',
    subtopics: [
      'Meaning, types of goods, and stages of production',
      'Factors of Production (Land, Labour, Capital, Entrepreneur)',
      'Division of Labour, Specialisation, and Scale of Production'
    ]
  },
  { 
    id: 'ss1-ch5', 
    title: 'Economic System', 
    description: 'Meaning of economic systems and basic economic problems of society.', 
    category: 'Chapter 5',
    subtopics: [
      'Capitalism, Socialism, and Mixed Economic Systems',
      'Basic economic problems of society (What, How, for Whom to produce)',
      'How different economic systems solve their basic economic problems'
    ]
  },
  { 
    id: 'ss1-ch6', 
    title: 'Business Organisation and Finance', 
    description: 'Firms and industries, objectives of business, types of enterprises, and sources of funding.', 
    category: 'Chapter 6',
    subtopics: [
      'Meaning of firms, industries, and business objectives',
      'Types of business enterprises: Sole Proprietorship, Partnership, Cooperatives',
      'Public Corporations, Joint Stock Companies, and Sources of Funding'
    ]
  },
  { 
    id: 'ss1-ch7', 
    title: 'Population', 
    description: 'Determinants of growth, theories of population, distribution, census, and migration.', 
    category: 'Chapter 7',
    subtopics: [
      'Determinants of population growth (Birth rate, Death rate, Migration)',
      'Theories of population: Malthusian theory & Demographic transition',
      'Population census, distribution, and under/over-population implications'
    ]
  },
  { 
    id: 'ss1-ch8', 
    title: 'Labour Market', 
    description: 'Concept of labour force and market, efficiency and mobility of labour.', 
    category: 'Chapter 8',
    subtopics: [
      'Concept of Labour Force, demand & supply of labour',
      'Efficiency of labour and factors affecting productivity',
      'Mobility of labour (Geographical and Occupational)'
    ]
  },
  { 
    id: 'ss1-ch9', 
    title: 'The Nigerian Economy and its Potentials', 
    description: 'Overview of sectors: Agriculture, Manufacturing, Mining, and Service potentials.', 
    category: 'Chapter 9',
    subtopics: [
      'Overview of primary sectors: Agriculture & Manufacturing',
      'The role of Mining, Forestry, and petroleum in Nigeria',
      'Growth potentials, development obstacles, and economic policies'
    ]
  },
  { 
    id: 'ss1-ch10', 
    title: 'Financial Institutions', 
    description: 'Types of financial institutions, banking in Nigeria, and the role of the Central Bank.', 
    category: 'Chapter 10',
    subtopics: [
      'Commercial Banks: roles, functions, and credit creation',
      'The Central Bank of Nigeria: monetary policy & regulatory role',
      'Development, Merchant, and microfinance banking systems'
    ]
  },
  { 
    id: 'ss1-ch11', 
    title: 'Money', 
    description: 'Definition, barter system, historical development, functions, and types of money.', 
    category: 'Chapter 11',
    subtopics: [
      'History of the Barter System and its critical limitations',
      'Aesthetic & technical characteristics of good money',
      'Primary/secondary functions of Money & standard of deferred payments',
      'Fisher Equation (Quantity Theory of Money: MV = PT)'
    ]
  },
  { 
    id: 'ss1-ch12', 
    title: 'Distributive Trade', 
    description: 'Channels of distribution, middlemen (wholesalers/retailers), and government roles.', 
    category: 'Chapter 12',
    subtopics: [
      'Meaning of Distributive Trade and major Channels of Distribution',
      'Detailed role of Middlemen: Wholesaler/Retailer functions',
      'The debate on eliminating middlemen & problems of marketing/distribution in Nigeria'
    ]
  },
];

export const SECONDARY_SS2_ROADMAP: RoadmapTopic[] = [
  {
    id: 'ss2-ch1',
    title: 'Basic Tools for Economic Analysis',
    description: 'Advanced quantitative tools: Simple linear equations and measures of dispersion (deviation, variance, standard deviation)',
    category: 'Chapter 1',
    subtopics: [
      'Simple linear equations and calculating slope',
      'Economic applications of linear equations',
      'Measures of Dispersion: Mean deviation, Standard deviation, and Variance'
    ]
  },
  {
    id: 'ss2-ch2',
    title: 'Concepts of Demand, Supply, and Price Determination I',
    description: 'Abnormal demand and supply curves, changes in demand vs quantity demanded, expansion and contraction.',
    category: 'Chapter 2',
    subtopics: [
      'Effective demand, demand schedules, and curves',
      'Abnormal demand curve causes (Giffen paradox, ostentation)',
      'Expansion vs. contraction of demand (income and substitution effects)',
      'Concept of supply, schedules, and abnormal supply behaviors'
    ]
  },
  {
    id: 'ss2-ch3',
    title: 'Theory of Production',
    description: 'Production Possibility Curve (PPC), productivity measures (TP, AP, MP) and the law of variable proportions.',
    category: 'Chapter 3',
    subtopics: [
      'Production Possibility Curve: assumptions and MRT',
      'Concept of productivity: Total, Average, and Marginal product',
      'Law of variable proportions (diminishing marginal returns)'
    ]
  },
  {
    id: 'ss2-ch4',
    title: 'Theory of Cost and Revenue',
    description: 'Economist vs Accountant costs, short-run costs (FC, VC, TC, AC, MC) and revenue concepts (TR, AR, MR).',
    category: 'Chapter 4',
    subtopics: [
      'Distinction between Economists and Accountants views of cost',
      'Short-run cost curves and AC-MC relationship',
      'Revenue aggregates: TR, AR, and MR across market structures'
    ]
  },
  {
    id: 'ss2-ch5',
    title: 'Labour Market',
    description: 'Labour force size, efficiency and mobility of labour, demand and supply of labor, wage determination, and unemployment.',
    category: 'Chapter 5',
    subtopics: [
      'Features of labor market, labor force size and efficiency',
      'Geographical vs. Occupational mobility of labor and obstacles',
      'Derived demand for labor, labor supply, and wage determination theories',
      'Types and causes of unemployment'
    ]
  },
  {
    id: 'ss2-ch6',
    title: 'Theory of Consumer Behaviour (Utility)',
    description: 'Concept of utility (Total, Average, Marginal), Consumer Equilibrium, and Indifference Curve analysis.',
    category: 'Chapter 6',
    subtopics: [
      'Law of Diminishing Marginal Utility (LDMU) and Satiety Point',
      'Cardinal Consumer Equilibrium (equal utility-to-price ratios)',
      'Ordinal consumer choice: Indifference curves and budget line tangency'
    ]
  },
  {
    id: 'ss2-ch7',
    title: 'Concepts of Demand, Supply, and Determination II',
    description: 'Types of demand (derived, joint, competitive, composite), price elasticity, and price control policies.',
    category: 'Chapter 7',
    subtopics: [
      'Derived, joint, competitive, and composite demand/supply',
      'Price Elasticity of Demand (PED) and Supply (PES)',
      'PED and Total Revenue relationship',
      'Government Intervention: Maximum and Minimum price legislation'
    ]
  },
  {
    id: 'ss2-ch8',
    title: 'Market Structures',
    description: 'Perfect Competition, Monopoly, Oligopoly (kinked demand curve), and Monopolistic Competition equilibrium.',
    category: 'Chapter 8',
    subtopics: [
      'Perfect Competition short-run and long-run equilibrium',
      'Pure, bilateral, and discriminating monopoly equilibrium',
      'Oligopoly: Collusion, price rigidity, and Kinked Demand Curve',
      'Monopolistic Competition product differentiation and tangency'
    ]
  },
  {
    id: 'ss2-ch9',
    title: 'Industry and Industrialisation in Nigeria',
    description: 'Siting and localization of industries, industrial concepts, external economies and diseconomies.',
    category: 'Chapter 9',
    subtopics: [
      'Industrial concepts: Plant, Factory, Firm, Industry, and Estate',
      'Location of industries: raw material vs market orientation',
      'Localisation of industries: External Economies and Diseconomies'
    ]
  },
  {
    id: 'ss2-ch10',
    title: 'Agriculture',
    description: 'Components of agriculture, agricultural problems in West Africa, policies in Nigeria, and Marketing Boards.',
    category: 'Chapter 10',
    subtopics: [
      'Crop and livestock production, forestry, and fishing',
      'West African agricultural problems and rural credit deficits',
      'Nigeria agricultural policies and the role of Marketing Boards'
    ]
  },
  {
    id: 'ss2-ch11',
    title: 'Public Finance and Fiscal Policy',
    description: 'Government budget (deficit, surplus, balanced), direct/indirect taxation, taxation principles, and national debt.',
    category: 'Chapter 11',
    subtopics: [
      'Taxation base, rate, and systems (progressive, proportional, regressive)',
      'Adam Smiths Canons of taxation and burden of tax incidence',
      'Government budgets (surplus and deficit effects) and National Debt',
      'Revenue allocation in Nigeria'
    ]
  },
  {
    id: 'ss2-ch12',
    title: 'Elements of National Income Accounting',
    description: 'GDP, GNP, NNP calculations, output/product value-added measurement, uses, and limitations.',
    category: 'Chapter 12',
    subtopics: [
      'GDP, GNP, NNP, and Per Capita Income aggregates',
      'National income measurement: Output, Income, and Expenditure approaches',
      'Double counting and using value added',
      'Limitations of income estimates'
    ]
  },
  {
    id: 'ss2-ch13',
    title: 'Financial Institutions and Regulatory Agencies',
    description: 'Commercial banks, CBN monetary policy instruments, capital markets, and first-tier vs second-tier stock lists.',
    category: 'Chapter 13',
    subtopics: [
      'Commercial banking functions and credit multiplier creation',
      'Central Bank of Nigeria (CBN) monetary policies',
      'Financial markets: Money vs. Capital market',
      'The Nigerian Stock Exchange: 1st tier and 2nd tier requirements'
    ]
  },
  {
    id: 'ss2-ch14',
    title: 'Money: Demand for and Supply of Money',
    description: 'Keynesian liquidity preference motives, purchasing power of money, and Weighted Retail Price Index numbers.',
    category: 'Chapter 14',
    subtopics: [
      'Keynesian Liquidity Preference (Transactions, Precautionary, Speculative)',
      'Value of money and general price level inverse relationship',
      'Measuring cost of living via Weighted Price Index numbers'
    ]
  },
  {
    id: 'ss2-ch15',
    title: 'Money: Inflation and Deflation',
    description: 'Creeping, hyper, and suppressed inflation, demand-pull and cost-push causes, inflationary gap, and deflation controls.',
    category: 'Chapter 15',
    subtopics: [
      'Creeping, hyperinflation, and suppressed inflation',
      'Demand-pull and Cost-push inflation causes',
      'Inflationary spirals, Stagflation, and policy controls',
      'Deflation: causes, outcomes, and remedial measures'
    ]
  }
];

export const SECONDARY_SS3_ROADMAP: RoadmapTopic[] = [
  {
    id: 'ug-ch1',
    title: 'Economic Lessons from the Asian Tigers and Japan',
    description: 'Analytical study of the rapid development strategies of the Four Asian Tigers and post-WWII Japan, with key policy lessons for Nigeria.',
    category: 'Chapter 1',
    subtopics: [
      'The Four Asian Tigers',
      'Key Development Strategies Employed',
      'The Japanese Post-War Miracle',
      'The Role of Human Capital and Technology',
      'The Impact of Foreign Direct Investment (FDI)',
      'Case Studies and Practical Examples',
      'Vital Lessons for the Nigerian Economy'
    ]
  },
  {
    id: 'ug-ch2',
    title: 'Human Capital Development',
    description: 'Explains characteristics and efficiency factors of human capital vs physical assets, and brain drain causes, impacts, and solutions in Nigeria.',
    category: 'Chapter 2',
    subtopics: [
      'Characteristics of human capital',
      'Factors that affect the efficiency of human capital',
      'Differences between human capital and physical capital',
      'Brain drain causes, effects, and solutions'
    ]
  },
  {
    id: 'ug-ch3',
    title: 'Petroleum and the Nigerian Economy',
    description: 'Historical background, positive and negative macroeconomic impacts, NNPC and OPEC core structures, and the Petroleum Industry Bill (PIB).',
    category: 'Chapter 3',
    subtopics: [
      'Historical development of petroleum in Nigeria',
      'Positive and negative contributions of petroleum',
      'Regulatory role of the NNPC & OPEC production controls',
      'The Petroleum Industry Bill (PIB) objectives & challenges'
    ]
  },
  {
    id: 'ug-ch4',
    title: 'Manufacturing and Construction',
    description: 'Transforming inputs, traditional food processing and local crafts, industrial location/localisation factors, and the construction industry.',
    category: 'Chapter 4',
    subtopics: [
      'Meaning of manufacturing & types of industries in Nigeria',
      'Local craft industries: leather, blacksmithing, pottery, weaving',
      'Major hindrances to manufacturing and remedies in Nigeria',
      'The construction industry contributions to economic development'
    ]
  },
  {
    id: 'ug-ch5',
    title: 'Service Industries',
    description: 'Characteristics of tertiary soft services, tourism, advertisement, banking, transport, and insurance roles for economic development.',
    category: 'Chapter 5',
    subtopics: [
      'The service industry & its characteristics (intangibility, perishability)',
      'Types of services: tourism, banking, transport, advertising, warehousing, insurance',
      'Contributions of the service industry to the economic development of Nigeria'
    ]
  },
  {
    id: 'ug-ch6',
    title: 'Agencies that Regulate the Financial Market',
    description: 'Detailed analysis of money market regulators (CBN, NDIC), capital market operations (SEC/NSE), and the credit creation money multiplier.',
    category: 'Chapter 6',
    subtopics: [
      'The Money Market & its regulatory agencies (CBN, NDIC)',
      'Instruments of financial regulation used by the Central Bank',
      'The Capital Market: Money vs. Capital market & components',
      'The Nigerian Stock Exchange & Benefits of CSCS',
      'The Securities and Exchange Commission (SEC) role, tools and functions'
    ]
  },
  {
    id: 'ug-ch7',
    title: 'International Trade',
    description: 'Classical comparative advantage vs. Smith absolute advantage theories, export protectionist policies, economic integration (ECOWAS), and globalisation.',
    category: 'Chapter 7',
    subtopics: [
      'Distinction between domestic trade and international trade',
      'Scholarly theories of Absolute vs Comparative Advantage',
      'Commercial Policy: tariffs, quotas, and infant industry protection',
      'Economic Integration: Free trade area, Customs Union, Common Market, Economic Union',
      'Economic Community of West African States (ECOWAS)',
      'The New International Economic Order (NIEO) & Globalisation'
    ]
  },
  {
    id: 'ug-ch8',
    title: 'Balance of Payments',
    description: 'Current and Capital account structures, BOP surplus vs deficit disequilibrium, and corrective adjustment policies.',
    category: 'Chapter 8',
    subtopics: [
      'Role of money in international transactions & Foreign Exchange Market',
      'Measurement and determinants of the Terms of Trade',
      'Meaning and components of the Balance of Payments (BOP)',
      'BOP Disequilibrium: Surplus vs. Deficit effects',
      'BOP Adjustment Policies: Tariffs, quotas, monetary/fiscal policy, devaluation'
    ]
  },
  {
    id: 'ug-ch9',
    title: 'Economic Development and Planning',
    description: 'Differences between growth and development, underdevelopment theories (Classical, Schumpeter, Keynes), plans in Nigeria, and the Structural Adjustment Programme (SAP).',
    category: 'Chapter 9',
    subtopics: [
      'Distinction between economic growth and economic development',
      'Alternative explanations of economic development (Classical, Neo-classical, Schumpeter, Keynes)',
      'Economic planning & prerequisites for success',
      'First, Second, Third, and Fourth National Development Plans in Nigeria',
      'The Structural Adjustment Programme (SAP) in Nigeria: origins & outcomes'
    ]
  },
  {
    id: 'ug-ch10',
    title: 'International Economic Organisations',
    description: 'Examines the strategic economic roles of major institutions including the IMF, World Bank (IBRD), EEC, ADB, ECA, UNCTAD, WACH, and GATT/WTO.',
    category: 'Chapter 10',
    subtopics: [
      'International Monetary Fund (IMF) and World Bank (IBRD) roles',
      'European Economic Community (EEC) and African Development Bank (ADB)',
      'Economic Commission for Africa (ECA) and WACH',
      'UNCTAD & General Agreement on Tariffs and Trade (GATT/WTO)'
    ]
  },
  {
    id: 'ug-ch11',
    title: 'Current Economic Plans',
    description: 'Review of contemporary Nigerian strategies: MDGs targets and importance, NEEDS, SEEDS, and the goals of Vision 2020.',
    category: 'Chapter 11',
    subtopics: [
      'Millennium Development Goals (MDGs): targets & importance',
      'National Economic Empowerment and Development Strategy (NEEDS)',
      'Vision 2020 objectives, parameters and parameters goals'
    ]
  },
  {
    id: 'ug-ch12',
    title: 'Economic Development Challenges',
    description: 'Structural bottlenecks: debt burden/relief, poverty metrics, HIV/AIDS, corruption, power crisis and reforms, and resource control controversies.',
    category: 'Chapter 12',
    subtopics: [
      'Debt burden & Debt relief in Nigeria',
      'Concept and methods of poverty alleviation/eradication & agencies',
      'Impact of HIV/AIDS and Corruption on the economy',
      'The power/energy sector crisis and privatization reforms',
      'Resource Control: arguments in favour and against'
    ]
  },
  {
    id: 'ug-ch13',
    title: 'Economic Reform Programmes',
    description: 'Soludo banking consolidation reforms, market privatisation, commercialisation and deregulation, and anti-corruption regulators (EFCC, ICPC, NAFDAC, SON).',
    category: 'Chapter 13',
    subtopics: [
      'Consolidation of financial institutions & Soludo banking reforms',
      'Privatisation, commercialisation and deregulation',
      'Role of anti-corruption agencies (EFCC & ICPC)',
      'Role of regulatory agencies (NAFDAC & SON)'
    ]
  }
];

export const UNDERGRADUATE_REAL_ROADMAP: RoadmapTopic[] = [
  {
    id: 'ug-micro',
    title: 'Advanced Microeconomics',
    description: 'Advanced consumer theory, indifference curves, producer theory, perfect and imperfect market structures, and general equilibrium.',
    category: 'Course 1',
    subtopics: [
      'Consumer Utility & Indifference Curves',
      'Theory of Production & Cost Functions',
      'Perfect Competition vs. Pure Monopoly',
      'Oligopoly Models & Game Theory'
    ]
  },
  {
    id: 'ug-macro',
    title: 'Advanced Macroeconomics',
    description: 'Aggregate output determination, IS-LM model framework, inflation dynamics, unemployment, and long-run economic growth theories.',
    category: 'Course 2',
    subtopics: [
      'National Income Determination',
      'The IS-LM Equilibrium Framework',
      'Aggregate Demand & Aggregate Supply (AD-AS)',
      'The Phillips Curve and Inflation Expectations',
      'Solow-Swan and Endogenous Growth Models'
    ]
  },
  {
    id: 'ug-statistical',
    title: 'Statistical Economics',
    description: 'Descriptive and inferential statistics, probability distributions, sampling techniques, estimation, and hypothesis testing.',
    category: 'Course 3',
    subtopics: [
      'Measures of Central Tendency & Dispersion',
      'Probability Theory and Conditional Probability',
      'Discrete & Continuous Probability Distributions',
      'Point and Interval Estimation Techniques',
      'Null Hypothesis Testing, t-tests, & Chi-Square'
    ]
  },
  {
    id: 'ug-econometrics',
    title: 'Basic Econometrics',
    description: 'Single-equation regression models, Ordinary Least Squares (OLS) estimation, multiple regression analysis, and diagnostic testing.',
    category: 'Course 4',
    subtopics: [
      'The Methodology and Goals of Econometrics',
      'Two-Variable Linear Regression Model (OLS)',
      'Multiple Regression Analysis & Matrix Form',
      'Multicollinearity, Heteroscedasticity, & Autocorrelation'
    ]
  },
  {
    id: 'ug-monetary',
    title: 'Monetary Economics',
    description: 'Money supply creation, central banking instruments, money demand theories, interest rates, and transmission channels.',
    category: 'Course 5',
    subtopics: [
      'Functions, Evolution, and Definitions of Money',
      'The Credit Creation Money Multiplier Process',
      'Classical, Keynesian, and Monetarist Demand for Money',
      'Central Bank Policy Instruments & Interest Rates'
    ]
  },
  {
    id: 'ug-development',
    title: 'Advanced Development Economics',
    description: 'Multidimensional development concepts, income disparities, economic traps, capability theories, and structural transformations.',
    category: 'Course 6',
    subtopics: [
      'Economic Growth vs. Multidimensional Development',
      'Income Disparities and Danny Quah Twin Peaks',
      'Amartya Sen Capability Approach & Functionings',
      'Occupational Structures, Urbanization, and Debt Traps'
    ]
  },
  {
    id: 'ug-financial',
    title: 'Financial Economics',
    description: 'Financial markets, asset valuation, risk and returns, the Capital Asset Pricing Model (CAPM), and portfolio optimization.',
    category: 'Course 7',
    subtopics: [
      'Financial System Functions & Market Types',
      'Present Value, Bond Valuation, and Yields',
      'Portfolio Theory: Variance & Diversification of Risk',
      'Capital Asset Pricing Model (CAPM) & Beta Calculation'
    ]
  },
  {
    id: 'ug-international',
    title: 'International Economics',
    description: 'Pure theories of trade, protectionist tariffs, foreign exchange markets, and balance of payments disequilibrium adjustments.',
    category: 'Course 8',
    subtopics: [
      'Classical & Heckscher-Ohlin Trade Theories',
      'Commercial Policy: Tariffs, Quotas, and Welfare Effects',
      'Foreign Exchange Rate Determination Models',
      'Balance of Payments (BOP) Accounts & Devaluation'
    ]
  }
];

export const CHALLENGES: Record<string, { question: string, options: string[], answer: number }[]> = {
  'ss1-intro': [
    { question: 'What is the fundamental problem of economics?', options: ['Poverty', 'Scarcity', 'Inflation', 'Unemployment'], answer: 1 },
    { question: 'Opportunity cost is also known as:', options: ['Real cost', 'Money cost', 'Social cost', 'Fixed cost'], answer: 0 },
  ],
  'ug-ch1': [
    { question: 'Which country is NOT considered one of the Four Asian Tigers?', options: ['South Korea', 'Singapore', 'Japan', 'Taiwan'], answer: 2 },
    { question: 'What was the average annual economic growth rate of the Asian Tigers from the 1960s to 1990s?', options: ['Exceeding 7%', 'Around 2%', 'Between 3-4%', 'Negative growth'], answer: 0 },
  ]
};
