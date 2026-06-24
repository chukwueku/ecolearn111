import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const WASSCE_SYLLABUS_DATA = [
  {
    section: "1. DEFINITION AND SCOPE OF ECONOMICS",
    topics: [
      "Scarcity and Choice, Scale of Preference, Opportunity Cost, Production Possibility Curve. Economic activities – Production, Distribution and Consumption.",
      "Classification of economic activities - Primary, Secondary and Tertiary and their relative contributions in terms of output/income, employment, savings, investment and foreign exchange."
    ]
  },
  {
    section: "2. FACTORS OF PRODUCTION",
    topics: [
      "Land, labour, capital and entrepreneurship- meaning, characteristics and importance."
    ]
  },
  {
    section: "3. TYPES AND BASIC FEATURES OF ECONOMIC SYSTEMS",
    topics: [
      "(a) Types – capitalism, socialism and mixed economy.",
      "(b) Basic features of each",
      "(c) Advantages and disadvantages of each",
      "(d) Economic problems of society and the approaches for solving them under each of the systems."
    ]
  },
  {
    section: "4. BASIC TOOLS OF ECONOMIC ANALYSIS",
    topics: [
      "Tables, graphs and charts. Some basic statistical measures and representations – arithmetic mean, median, mode and their simple applications."
    ]
  },
  {
    section: "5. DEMAND",
    topics: [
      "Concept of demand and law of demand, the demand schedules and curve, reasons for exceptional demand curves, types of demand (derived, composite, joint and competitive); factors determining demand for goods and services – price of the commodity, prices of other commodities, income, tastes, price expectation, etc.",
      "Distinction between a shift of and movement along a demand curve; concept of elasticity of demand. Types of elasticity of demand and their measurement – price, income and cross elasticities of demand: importance of the concept of elasticity of demand to consumers, producers and government."
    ]
  },
  {
    section: "6. SUPPLY",
    topics: [
      "Concept of supply and law of supply, supply schedules and curve, types of Supply – composite, complementary and competitive. Factors determining supply – input prices, technology, prices of other commodities, climatic factors, etc.",
      "Distinction between the shift of and movement along the supply curve. Concept and measurement of elasticity of supply and its importance to producers and government"
    ]
  },
  {
    section: "7. THEORY OF CONSUMER BEHAVIOUR",
    topics: [
      "The utility concepts- total utility, average utility, marginal utility and the calculation of utility schedules.",
      "The law of diminishing marginal utility, relationship between total utility, average utility and marginal utility.",
      "The concept of equilibrium of a consumer. Determination of consumer equilibrium.",
      "The effects of changes in price on consumer equilibrium. The relationship between marginal utility and the demand curve."
    ]
  },
  {
    section: "8. THEORY OF PRICE DETERMINATION",
    topics: [
      "The Concept of the market; interaction between demand and supply. Price determination under free and regulated markets. Equilibrium price and quantity in product and factor markets.",
      "The effects of changes in supply and demand on equilibrium prices and quantities.",
      "Introduction to algebraic determination of equilibrium price and quantity.",
      "Price controls: maximum and minimum price regulations- meaning and their effects; rationing, black market (parallel market)"
    ]
  },
  {
    section: "9. THEORY OF PRODUCTION",
    topics: [
      "Production: division of labour and specialization: Scale of production (Internal and External economies), concept of total, average and marginal productivity and law of variable proportions."
    ]
  },
  {
    section: "10. THEORY OF COST AND REVENUE",
    topics: [
      "(i) Cost concepts: total cost, average cost, marginal cost, variable cost, fixed cost; short run and long run costs.",
      "(ii) Distinction between economist’s and accountant’s view of cost (opportunity cost and money cost).",
      "(iii) Revenue concepts: total, average and marginal revenue; Marginal revenue Product"
    ]
  },
  {
    section: "11. MARKET STRUCTURES",
    topics: [
      "Concept of a market, characteristics of various market structures, determination of price and output under different structures - perfect competition and imperfect competition (monopoly and monopolistic competition). Review of cost and revenue concepts. Price discrimination."
    ]
  },
  {
    section: "12. BUSINESS ORGANIZATIONS",
    topics: [
      "Types and basic features of business enterprises – Sole Proprietorship; Partnership, Joint- Stock companies (Private and Public), Co-operatives; Statutory Corporation, Joint ventures.",
      "Sources of funds. General and basic problems of business enterprises.",
      "Privatization and Commercialization as solutions to problems of public enterprises. Indigenization and nationalization policies."
    ]
  },
  {
    section: "13. DISTRIBUTIVE TRADE",
    topics: [
      "Process of distribution, role of producers, role of wholesalers, retailers and co-operatives: the role of government agencies in product distribution and the problems of distribution and their solutions."
    ]
  },
  {
    section: "14. POPULATION AND LABOUR MARKET",
    topics: [
      "(a) Population - determination and implication of size and growth of population, Rural – urban migration, Malthusian theory of population Geographical, age, sex and occupational distribution. Importance and problems of census. Population and economic development (under - population, optimum population and over- population).",
      "(b) Labour Market",
      "(i) Concept of labour force and human capital, efficiency and mobility of labour, factors affecting the size of the labour force, particularly the population characteristics (age, sex, occupation, education, etc.)",
      "(ii) supply of and demand for labour: wage determination. Concept of unemployment and underemployment, Trade Unions, Employers’ association and Government policies on labour and wages."
    ]
  },
  {
    section: "15. AGRICULTURE",
    topics: [
      "Structure (e.g. food crops, export crops, livestock, fisheries): systems of agriculture (peasant, commercial, co-operative and state farming);",
      "importance of agriculture to the national economy: marketing of agricultural products (commodity boards).",
      "Agricultural policies (minimum agricultural prices) problems of agriculture and remedies."
    ]
  },
  {
    section: "16. INDUSTRIALIZATION",
    topics: [
      "Meaning and types of industry. Definition of industrial concepts: plant, firm, industry and industrial estates.",
      "Location of industry, localization, role of industrialization in economic development. Strategies of industrialization.",
      "Problems of industrialization. The link between agricultural and industrial development."
    ]
  },
  {
    section: "17. NATIONAL INCOME",
    topics: [
      "Meaning of major national income concepts e.g. Gross Domestic Product, Gross National Product. Net National Product, etc.",
      "Different ways of measuring national income and their problems.",
      "Uses and limitations of national income data; trends and structure of national income."
    ]
  },
  {
    section: "18. MONEY AND INFLATION",
    topics: [
      "(a) Money – definition and historical development-barter and its problems, types, characteristics functions. Supply of and demand for money, value of money and the price level.",
      "(b) Inflation: meaning types, causes, effects and control."
    ]
  },
  {
    section: "19. FINANCIAL INSTITUTIONS",
    topics: [
      "Types (traditional, Central Bank, Commercial Bank, Development Bank, Merchant Bank, and Insurance Companies, Building Societies) : development and functions of financial institutions.",
      "Money and capital markets; meaning, types and functions"
    ]
  },
  {
    section: "20. PUBLIC FINANCE",
    topics: [
      "Fiscal policy and objectives of public finance: Sources of government revenue.",
      "Taxation -types(direct and indirect), objectives, merits, demerits and incidence;",
      "Principles/canons of taxation; Rates of taxation(proportional, progressive and regressive) direct and indirect taxation: incidence and effects of taxes,",
      "composition/structure of public expenditure (recurrent and capital expenditure): effects of public expenditure. Government budget and the national debt."
    ]
  },
  {
    section: "21. ECONOMIC DEVELOPMENT AND PLANNING",
    topics: [
      "Meaning of economic development, distinction between economic growth and development, characteristics and problems of developing countries, elements of development planning (objectives of planning, and problems of planning).",
      "Types of plans (short term, medium term, perspective or long term, rolling plan etc.)."
    ]
  },
  {
    section: "22. INTERNATIONAL TRADE AND BALANCE OF PAYMENTS",
    topics: [
      "(a) International Trade: differences between domestic and international trade, the basis of international trade, absolute and comparative cost advantage, terms of trade (definition and measurement) commercial policy (objectives) and instruments – tariffs (types) and direct control. Trend and structure of West African countries’ external trade.",
      "(b) Balance of Payments: role of money in international transactions, meaning and components of balance of payments, balance of payments disequilibrium, balance of payments adjustments (exchange rate policy exchange control, monetary and fiscal policies) and financing (the use of reserves and international borrowing)."
    ]
  },
  {
    section: "23. ECONOMIC INTEGRATION",
    topics: [
      "Economic Integration (objectives, levels of and features). Development and problems of economic integration in West Africa- ECOWAS"
    ]
  },
  {
    section: "24. INTERNATIONAL ECONOMIC ORGANIZATIONS",
    topics: [
      "Development and role of: Organization of Petroleum Exporting Countries (OPEC), Economic Commission for Africa (ECA), International Monetary Fund (IMF), International Bank for Reconstruction and Development (IBRD), African Development Bank (AfDB), United Nations Conference on Trade and Development (UNCTAD)",
      "Relevance of such organizations to West African Countries."
    ]
  },
  {
    section: "25. MAJOR NATURAL RESOURCES",
    topics: [
      "Development of major natural resources (petroleum, gold, diamond, timber, groundnut etc) effects on West African economies (positive and negative)."
    ]
  }
];

export const WassceSyllabus = () => {
    const [openSection, setOpenSection] = useState<number | null>(0);

    return (
        <div className="max-w-4xl mx-auto py-12 px-2 sm:px-6">
            <div className="bg-primary-container text-on-primary-container rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden group mb-6">
                <div className="absolute right-0 top-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <h2 className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-tight flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-secondary text-4xl">local_library</span>
                        Official WASSCE Syllabus
                    </h2>
                    <p className="text-on-primary-container/80 max-w-2xl font-medium leading-relaxed">
                        The comprehensive West African Senior School Certificate Examination (WASSCE) guideline for Economics. Expand sections to explore all 25 fundamental areas of the curriculum.
                    </p>
                </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-3 sm:p-5 shadow-sm space-y-2">
                {WASSCE_SYLLABUS_DATA.map((section, idx) => {
                    const isOpen = openSection === idx;
                    return (
                        <div key={idx} className="bg-surface rounded-2xl overflow-hidden border border-outline-variant/30 transition-all hover:border-outline hover:shadow-sm">
                            <button
                                onClick={() => setOpenSection(isOpen ? null : idx)}
                                className="w-full flex items-center justify-between p-4 sm:p-6 text-left transition-colors"
                            >
                                <h3 className={`font-black text-sm sm:text-base ${isOpen ? 'text-primary' : 'text-on-surface'}`}>
                                    {section.section}
                                </h3>
                                <span className={`material-symbols-outlined transition-transform duration-300 ml-4 shrink-0 ${isOpen ? 'rotate-180 text-primary' : 'text-outline'}`}>
                                    expand_more
                                </span>
                            </button>
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden bg-surface-container-lowest border-t border-outline-variant/20"
                                    >
                                        <div className="p-4 sm:p-6">
                                            <ul className="space-y-4">
                                                {section.topics.map((topic, tIdx) => (
                                                    <li key={tIdx} className="flex items-start gap-4 text-on-surface-variant text-sm sm:text-base">
                                                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            push_pin
                                                        </span>
                                                        <span className="leading-relaxed font-medium">{topic}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
