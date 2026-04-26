export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  category: string;
}

export const SECONDARY_ROADMAP: RoadmapTopic[] = [
  { id: 'ss1-ch1', title: 'Meaning of Economics and Basic Concepts', description: 'Definitions, basic concepts (Scarcity, Choice, Opportunity Cost), nature of economics, and why we study it.', category: 'Chapter 1' },
  { id: 'ss1-ch2', title: 'Basic Tools for Economic Analysis', description: 'Functional relationships, tables, graphs, charts, and measures of central tendency (Mean, Median, Mode).', category: 'Chapter 2' },
  { id: 'ss1-ch3', title: 'Concepts of Demand, Supply, and Price Determination', description: 'Demand/supply schedules and curves, laws of demand/supply, market equilibrium, and revenue concepts.', category: 'Chapter 3' },
  { id: 'ss1-ch4', title: 'Theory of Production', description: 'Types of goods and production, factors of production, division of labour, and scale of production.', category: 'Chapter 4' },
  { id: 'ss1-ch5', title: 'Economic System', description: 'Meaning of economic systems and basic economic problems of society.', category: 'Chapter 5' },
  { id: 'ss1-ch6', title: 'Business Organisation and Finance', description: 'Firms and industries, objectives of business, types of enterprises, and sources of funding.', category: 'Chapter 6' },
  { id: 'ss1-ch7', title: 'Population', description: 'Determinants of growth, theories of population, distribution, census, and migration.', category: 'Chapter 7' },
  { id: 'ss1-ch8', title: 'Labour Market', description: 'Concept of labour force and market, efficiency and mobility of labour.', category: 'Chapter 8' },
  { id: 'ss1-ch9', title: 'The Nigerian Economy and its Potentials', description: 'Overview of sectors: Agriculture, Manufacturing, Mining, and Service potentials.', category: 'Chapter 9' },
  { id: 'ss1-ch10', title: 'Financial Institutions', description: 'Types of financial institutions, banking in Nigeria, and the role of the Central Bank.', category: 'Chapter 10' },
  { id: 'ss1-ch11', title: 'Money', description: 'Definition, barter system, historical development, functions, and types of money.', category: 'Chapter 11' },
  { id: 'ss1-ch12', title: 'Distributive Trade', description: 'Channels of distribution, middlemen (wholesalers/retailers), and government roles.', category: 'Chapter 12' },
];

export const UNDERGRADUATE_ROADMAP: RoadmapTopic[] = [
  { id: 'ug-micro', title: 'Microeconomics', description: 'Comprehensive guide covering fundamentals, consumer behavior, production, costs, and market structures.', category: 'Microeconomics' },
  { id: 'ug-macro', title: 'Macroeconomics', description: 'Aggregate demand/supply, IS-LM model, and inflation/unemployment.', category: 'Macroeconomics' },
  { id: 'ug-financial', title: 'Financial Economics', description: 'Asset pricing, capital markets, and risk management.', category: 'Financial Economics' },
  { id: 'ug-development', title: 'Development Economics', description: 'Growth models, poverty, inequality, and institutional economics.', category: 'Development Economics' },
  { id: 'ug-econometrics', title: 'Econometrics', description: 'Regression analysis, hypothesis testing, and time-series data.', category: 'Econometrics' },
  { id: 'ug-international', title: 'International Economics', description: 'Trade theories, balance of payments, and exchange rates.', category: 'International' },
  { id: 'ug-monetary', title: 'Monetary Economics', description: 'Money supply, interest rates, and central bank policies.', category: 'Monetary' },
  { id: 'ug-statistical', title: 'Statistical Economics', description: 'Probability distributions, sampling, and statistical inference.', category: 'Statistical Economics' },
];

export const CHALLENGES: Record<string, { question: string, options: string[], answer: number }[]> = {
  'ss1-intro': [
    { question: 'What is the fundamental problem of economics?', options: ['Poverty', 'Scarcity', 'Inflation', 'Unemployment'], answer: 1 },
    { question: 'Opportunity cost is also known as:', options: ['Real cost', 'Money cost', 'Social cost', 'Fixed cost'], answer: 0 },
  ],
  'ug-micro': [
    { question: 'In a perfectly competitive market, firms are:', options: ['Price makers', 'Price takers', 'Monopolists', 'Oligopolists'], answer: 1 },
    { question: 'The law of diminishing marginal utility states that as consumption increases:', options: ['Total utility decreases', 'Marginal utility increases', 'Marginal utility decreases', 'Total utility remains constant'], answer: 2 },
  ]
};
