export interface Chapter {
  id: number;
  title: string;
  partId: number;
  partTitle: string;
  topics: string[];
  summary: string;
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
  simulatorMode?: 'comparative_advantage' | 'heckscher_ohlin' | 'tariff_simulation' | 'exchange_rate' | 'j_curve';
}

export const PARTS = [
  { id: 1, title: 'THE PURE THEORY OF INTERNATIONAL TRADE', range: 'Chapters 1 - 18' },
  { id: 2, title: 'COMMERCIAL POLICY', range: 'Chapters 19 - 29' },
  { id: 3, title: 'BALANCE OF PAYMENTS', range: 'Chapters 30 - 40' },
  { id: 4, title: 'INTERNATIONAL ECONOMIC RELATIONS', range: 'Chapters 41 - 62' }
];

export const INTERNATIONAL_ECONOMICS_CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Distinguishing Features of Inter-regional and International Trade",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "Difference between Inter-regional and International Trade", "Similarities between Inter-regional and International Trade", "Exercises"],
    summary: "Classical economists, led by Adam Smith and David Ricardo, argued that international trade requires a separate theory because factors of production (labor and capital) are mobile domestically but highly immobile internationally due to geographic, cultural, and political barriers. Modern economists point out that while similarities exist—both types of trade are based on specialization and exchange—international trade is uniquely characterized by distinct national currencies, separate monetary systems, sovereign tariff/commercial policies, and differing legal frameworks.",
    quiz: [
      {
        question: "Why did classical economists believe international trade required a separate theory from domestic trade?",
        options: [
          "Because goods are completely different across countries",
          "Because factors of production are immobile internationally but mobile domestically",
          "Because international transactions do not involve money",
          "Because transport costs are always zero in domestic trade"
        ],
        answer: 1,
        explanation: "Classical economists assumed perfect factor mobility within a nation but absolute factor immobility between nations, justifying a separate theory of international trade."
      },
      {
        question: "Which of the following is a primary modern distinguishing feature of international trade compared to inter-regional trade?",
        options: [
          "It does not follow the law of demand",
          "The absence of transport costs",
          "Different sovereign currency and monetary systems",
          "Perfect knowledge among all consumers"
        ],
        answer: 2,
        explanation: "Sovereign currency systems, exchange rates, and independent monetary policies are unique to international transactions."
      }
    ]
  },
  {
    id: 2,
    title: "International Trade Equilibrium: Some Analytical Tools",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "The Production Possibility Curve", "The Community Indifference Curve", "The Offer Curve", "The Trade Indifference Curve", "The Box Diagram", "Exercises"],
    summary: "Neoclassical trade theory employs general equilibrium tools to determine terms of trade and trade volumes. The Production Possibility Curve (PPC) represents supply-side constraints and trade-offs under constant or increasing costs. The Community Indifference Curve (CIC) models demand preferences and welfare, though it is subject to index number problems. Edgeworth Box Diagrams represent general equilibrium in factor markets. Offer curves (developed by Marshall and Edgeworth) synthesize supply and demand to represent the willingness of a country to trade exports for imports at various relative prices, with equilibrium terms of trade determined at their intersection.",
    quiz: [
      {
        question: "What does an offer curve (reciprocal demand curve) represent?",
        options: [
          "The maximum a nation is willing to consume of any good",
          "The volume of exports a nation is willing to offer in exchange for imports at various relative prices",
          "The domestic production possibilities under autarky",
          "The tax revenue collected from dynamic tariffs"
        ],
        answer: 1,
        explanation: "Offer curves show the reciprocal demand of nations, mapping the exact quantity of exports offered to buy different import volumes at varying relative price ratios."
      }
    ]
  },
  {
    id: 3,
    title: "The Classical Theory of Comparative Advantage",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "Smith's Theory of Absolute Differences in Costs", "Ricardo's Theory of Comparative Differences in Costs", "Exercises"],
    summary: "Adam Smith demonstrated that a country should specialize in producing goods where it possesses an absolute advantage (using fewer labor hours). David Ricardo expanded this with his Law of Comparative Advantage, showing that trade remains mutually beneficial even if a country has an absolute disadvantage in both goods. What matters is the relative cost structure: a country should specialize in the good in which its opportunity cost is lower. Both models assume the Labor Theory of Value, constant opportunity costs, and perfect domestic factor mobility.",
    simulatorMode: "comparative_advantage",
    quiz: [
      {
        question: "If Nigeria requires 2 hours of labor for a bag of cocoa and 4 hours for a radio, what is Nigeria's opportunity cost of a radio?",
        options: [
          "0.5 bags of cocoa",
          "2.0 bags of cocoa",
          "4.0 bags of cocoa",
          "8.0 bags of cocoa"
        ],
        answer: 1,
        explanation: "The opportunity cost of a radio is the ratio of labor hours needed: 4 hours / 2 hours = 2 bags of cocoa."
      }
    ]
  },
  {
    id: 4,
    title: "The Classical Theory of Comparative Costs and UDCs",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Classical Theory not Applicable to UDCs", "Theories of International Trade Applicable to UDCs", "Exercises"],
    summary: "Underdeveloped Countries (UDCs) often challenge classical trade theory. Critics like Raul Prebisch and Gunnar Myrdal argue that classical models assume frictionless factor reallocations and perfect competition, which are absent in UDCs with structural rigidities, primary commodity dependence, and underemployed labor. To address this, dynamic versions of comparative advantage consider 'vent-for-surplus' theories, where trade utilizes previously idle land or labor resources to expand production beyond autarkic production frontiers.",
    quiz: [
      {
        question: "The 'vent-for-surplus' theory of trade suggests that trade:",
        options: [
          "Always leads to a trade deficit for developing countries",
          "Is a zero-sum game that exploits natural resources",
          "Enables a nation to utilize previously idle resources to produce exports",
          "Is only beneficial to highly developed industrial nations"
        ],
        answer: 2,
        explanation: "Vent-for-surplus theory argues that international trade provides an outlet ('vent') for surplus resources (like idle land or labor) that had no domestic demand."
      }
    ]
  },
  {
    id: 5,
    title: "Refinements of the Comparative Costs Theory",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "Theory of Comparative Costs in Terms of Money", "The Theory of Comparative Costs Applied to more than Two Goods", "Theory of Comparative Costs in Terms of Two Goods And Many Countries", "Multi-country and Multi-Goods Trade Model", "Costs of Transport Under the Theory of Comparative Costs", "Variable Costs of Production Under Theory of Comparative Costs", "Exercises"],
    summary: "Ricardo's basic model was refined to establish trade in monetary terms (where exchange rates align absolute wages and prices to match real comparative advantages). Further extensions modified the model for multi-good, multi-country frameworks. Introducing transportation costs reduces the volume of trade, creates a category of non-traded goods, and limits complete specialization. Incorporating increasing opportunity costs also prevents complete specialization, leading to incomplete specialization where domestic production coexists with imports.",
    quiz: [
      {
        question: "When transport costs are introduced into the classical trade model:",
        options: [
          "Specialization is always complete in both countries",
          "The price of traded goods becomes identical in both countries",
          "A range of non-traded goods emerges and complete specialization is hindered",
          "Trade volume increases dramatically"
        ],
        answer: 2,
        explanation: "Transportation costs create a gap between domestic and foreign prices, making goods with high transport-to-value ratios non-traded."
      }
    ]
  },
  {
    id: 6,
    title: "Haberler's Theory of Opportunity Costs",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "The Theory of Opportunity Costs", "Critical Appraisal", "Exercises"],
    summary: "Gottfried Haberler freed the comparative advantage theory from the restrictive Labor Theory of Value by reformulating it using opportunity costs. Under his model, opportunity cost is represented by the slope of the Production Possibility Curve (the marginal rate of transformation). This allows for multiple factors of production and models constant costs, increasing costs (concave PPC, representing heterogeneous resources), and decreasing costs (convex PPC, representing economies of scale).",
    quiz: [
      {
        question: "How did Haberler reformulate Ricardo's theory of comparative advantage?",
        options: [
          "By discarding opportunity costs entirely",
          "By basing it on the opportunity cost doctrine instead of the labor theory of value",
          "By proving that only labor matters in production",
          "By introducing gold as the sole measure of value"
        ],
        answer: 1,
        explanation: "Haberler replaced the labor theory of value with the opportunity cost curve, enabling trade theory to handle multiple inputs and variable costs."
      }
    ]
  },
  {
    id: 7,
    title: "Mill's Theory of Reciprocal Demand",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "Exercises"],
    summary: "While Ricardo showed the outer limits within which terms of trade must fall, John Stuart Mill's Theory of Reciprocal Demand explained how the actual equilibrium terms of trade are determined. Mill demonstrated that the terms of trade are dictated by the strength and elasticity of each country's demand for the other's product. The closer the final terms of trade are to a country's internal autarkic price ratio, the smaller its share of the gains from trade.",
    quiz: [
      {
        question: "According to J.S. Mill, the equilibrium terms of trade are determined by:",
        options: [
          "The ratio of money supply in both countries",
          "The strength of reciprocal demand between trading nations",
          "The absolute cost of labor",
          "The level of protective tariffs"
        ],
        answer: 1,
        explanation: "Mill's theory of reciprocal demand states that the equilibrium exchange ratio is determined by the relative strength and elasticity of each nation's demand for the other's export."
      }
    ]
  },
  {
    id: 8,
    title: "The Modern Theory of Factor Endowments: The Heckscher-Ohlin Theory",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "The Heckscher-Ohlin Theory", "Exercises"],
    summary: "The Heckscher-Ohlin (H-O) theory explains trade patterns based on countries' relative factor endowments. A capital-abundant nation will possess a comparative advantage in, and export, capital-intensive goods, while a labor-abundant nation will export labor-intensive goods. This shifts the focus from classical differences in labor productivity to differences in relative factor supplies (K/L).",
    simulatorMode: "heckscher_ohlin",
    quiz: [
      {
        question: "According to the Heckscher-Ohlin theorem, a capital-abundant nation will export:",
        options: [
          "Labor-intensive goods",
          "Capital-intensive goods",
          "Agricultural commodities only",
          "No goods at all"
        ],
        answer: 1,
        explanation: "The H-O theorem states that countries export goods that intensively use their relatively abundant factor of production."
      }
    ]
  },
  {
    id: 9,
    title: "International Trade and Factor Prices",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "Samuelson's Factor-Price Equalisation Theorem", "Exercises"],
    summary: "Paul Samuelson extended the H-O model with his Factor-Price Equalization Theorem. He proved that free international trade in final goods acts as a perfect substitute for international factor mobility. Trade will lead to the absolute and relative equalization of homogeneous factor rewards (wages and capital rents) across trading nations. Trade raises wages in labor-abundant nations and depresses them in capital-abundant nations, moving them toward global convergence.",
    quiz: [
      {
        question: "The Factor-Price Equalization Theorem states that free trade in final goods:",
        options: [
          "Widens the income gap between countries",
          "Equalizes the nominal exchange rates",
          "Equalizes real wages and capital returns across countries",
          "Leads to higher inflation globally"
        ],
        answer: 2,
        explanation: "Under perfect H-O assumptions, commodity trade leads to complete equalization of real rewards for capital and labor across trading partners."
      }
    ]
  },
  {
    id: 10,
    title: "Factor Intensity Reversals: Stolper-Samuelson and Rybczynski Theorems",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Meaning of Factor Intensity Reversal", "The Stolper-Samuelson Theorem: The Effect of Change in Commodity Prices on Real Factor Rewards", "The Rybczynski Theorem: The Effect of Factor Endowment Changes on Trade", "Exercises"],
    summary: "This chapter covers crucial theorems of neoclassical trade. The Stolper-Samuelson Theorem proves that a rise in the relative price of a good increases the real return of the factor used intensively in its production and reduces the real return of the other factor. The Rybczynski Theorem shows that at constant commodity prices, an increase in one factor endowment leads to an absolute expansion of the sector using that factor intensively and an absolute contraction in the other sector. Factor Intensity Reversal occurs when a good is capital-intensive in one country but labor-intensive in another, which invalidates the H-O predictions.",
    quiz: [
      {
        question: "The Stolper-Samuelson Theorem implies that a tariff on capital-intensive imports will:",
        options: [
          "Reduce real wages and increase real returns to capital",
          "Increase real wages and reduce returns to capital",
          "Equalize both wages and capital returns",
          "Have no impact on factor rewards"
        ],
        answer: 0,
        explanation: "The theorem states that a tariff, by raising the price of the capital-intensive import, increases the real return to capital (the intensive factor) and reduces the real wage of labor."
      },
      {
        question: "According to the Rybczynski Theorem, if a nation experiences a massive inflow of foreign capital (K) at constant prices, output of:",
        options: [
          "Both goods will expand proportionally",
          "The labor-intensive sector will expand and capital-intensive will contract",
          "The capital-intensive sector will expand and labor-intensive will contract",
          "Both goods will contract"
        ],
        answer: 2,
        explanation: "Rybczynski states that increasing one factor endowment increases output of the industry intensive in that factor, and decreases output of the other industry."
      }
    ]
  },
  {
    id: 11,
    title: "Empirical Testing of Comparative Costs and H.O. Theories",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "Testing the Classical Theory", "The Leontief Paradox", "Exercises"],
    summary: "Wassily Leontief conducted the first empirical test of the Heckscher-Ohlin model in 1953 using US input-output data. Surprisingly, he found that the US (the most capital-abundant nation) exported labor-intensive goods and imported capital-intensive goods. This 'Leontief Paradox' led to deep reassessments, introducing concepts like human capital differences, tariff structures, and resource-saving technological biases to reconcile empirical data with trade theory.",
    quiz: [
      {
        question: "What was the Leontief Paradox?",
        options: [
          "The finding that US exports were capital-intensive, contrary to classical models",
          "The finding that US exports were labor-intensive despite the US being capital-abundant",
          "The discovery that tariffs do not cause deadweight loss",
          "The proof that wages are identical worldwide"
        ],
        answer: 1,
        explanation: "Leontief's 1953 study unexpectedly showed that US exports were less capital-intensive than US import-competing products, contradicting basic H-O theory."
      }
    ]
  },
  {
    id: 12,
    title: "Extensions of H.O. Theory: Dynamic Factors in International Trade",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "Changes in Factor Endowments", "Economies of scale", "Changes in Tastes", "Differing Demand Conditions", "Transport Costs", "The Specific Factors Model", "Exercises"],
    summary: "This chapter bridges the gap between static theory and dynamic realities. It analyzes how tastes, growth, transport costs, and localized factor mobility affect trade. It features the Specific Factors Model, which represents the short-run reality of trade where some factors (e.g., machinery or specialized land) are stuck in their industries, meaning trade creates clear short-run winners and losers even if it is net-beneficial in the long run.",
    quiz: [
      {
        question: "In the Specific Factors Model, trade causes:",
        options: [
          "No changes in factor distribution",
          "Gains for owners of factors specific to export industries, and losses for those specific to import-competing industries",
          "Equal gains for all factors of production",
          "Absolute losses for labor in both sectors"
        ],
        answer: 1,
        explanation: "Specific factors cannot move between sectors in the short run. Opening to trade benefits specific factors in export sectors but harms those in import-competing sectors."
      }
    ]
  },
  {
    id: 13,
    title: "Some New Theories of International Trade",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "The Kravis Theory of Availability", "Linder's Theory of Volume of Trade and Demand Pattern", "Posner's Imitation gap or Technological Gap Theory", "Vernon's Product Cycle Theory", "Kenen's Theory of Human Capital", "Emmanuel's Theory of Unequal Exchange", "Intra-Industry Trade", "Exercises"],
    summary: "This chapter explores modern trade frameworks that move beyond H-O. Staffan Linder's Representative Demand theory argues that trade is strongest between countries with similar income levels because they share similar consumption patterns. Posner's Technological Gap and Raymond Vernon's Product Life Cycle model explain trade through a product's evolution: moving from an innovation phase (exported by the inventor) to a standardized phase (production shifts to low-wage nations).",
    quiz: [
      {
        question: "According to Staffan Linder's demand-similarity hypothesis:",
        options: [
          "Countries with different income levels trade the most",
          "Trade is driven entirely by differences in resource abundance",
          "Countries with similar per capita incomes and consumer preferences trade most intensively in manufactured goods",
          "Tropical countries trade exclusively with polar countries"
        ],
        answer: 2,
        explanation: "Linder argued that manufactured exports are extensions of domestic production; thus, trade is greatest among nations with similar representative demand structures."
      },
      {
        question: "Vernon's Product Life Cycle theory suggests that as a product matures and standardizes, its production:",
        options: [
          "Stays concentrated in the high-income inventing nation",
          "Shifts to lower-cost developing nations with cheap labor",
          "Is completely banned under international patent law",
          "Becomes highly subsidized by the IMF"
        ],
        answer: 1,
        explanation: "As products standardize, comparative advantage shifts from innovation-heavy nations to nations with low-cost labor and assembly plants."
      }
    ]
  },
  {
    id: 14,
    title: "Economic Growth and International Trade",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Introduction", "Effects of Growth on Trade", "Effect of Growth on Terms of Trade", "Effects of Growth on Production", "Trade", "Welfare and Terms of Trade of a Small Country", "Effects of Growth on Production", "Trade and Welfare of a Large Country", "Immiserising Growth", "Exercises"],
    summary: "This chapter deals with the dynamic interactions of growth and trade. Growth can be export-biased, import-biased, or neutral, depending on which sector expands. Jagdish Bhagwati's theory of Immiserizing Growth demonstrates a rare but serious danger for large primary exporters: rapid export-biased growth can expand export supply so much that the resulting terms-of-trade deterioration more than offsets the physical gains from growth, leaving the country worse off than before.",
    quiz: [
      {
        question: "Immiserizing growth is a welfare-reducing phenomenon that can occur when:",
        options: [
          "A small country experiences import-biased growth",
          "A large country experiences rapid export-biased growth facing highly price-inelastic foreign demand",
          "A country completely closes its borders to trade",
          "Wages rise faster than capital rents in a labor-abundant country"
        ],
        answer: 1,
        explanation: "Immiserizing growth requires a large nation whose export-biased expansion collapses its own terms of trade, destroying more welfare than the growth created."
      }
    ]
  },
  {
    id: 15,
    title: "Technical Progress and International Trade",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Meaning of Technical Progress", "Classification of Technical Progress", "Effects of Technical Progress on Trade", "Exercises"],
    summary: "Technical progress can be classified as capital-saving, labor-saving, or neutral depending on how it alters the marginal rate of technical substitution. When technical progress occurs in the export sector of a large nation, it increases the export supply and degrades the terms of trade. Conversely, progress in the import-competing sector reduces the demand for imports, improving the country's terms of trade but potentially hurting foreign trading partners.",
    quiz: [
      {
        question: "If a labor-abundant country experiences neutral technical progress in its export sector:",
        options: [
          "Its export volume will decrease",
          "Its terms of trade will likely deteriorate if it is a large country",
          "It will stop trading altogether",
          "It will become capital-abundant overnight"
        ],
        answer: 1,
        explanation: "Technical progress in the export sector increases supply, driving down world prices and deteriorating the terms of trade for a large country."
      }
    ]
  },
  {
    id: 16,
    title: "The Gains from Trade",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Meaning", "Potential and Actual Gain from International Trade", "Measurement of Gains from Trade", "Factors Determining the Gains from Trade", "Gains From Trade and Income Distribution", "Gains from Trade in the Case of Large and Small Country", "Free Trade Superior to no Trade", "Restricted Trade Superior to no Trade", "Static and Dynamic Gains from Trade", "Exercises"],
    summary: "This chapter quantifies the benefits of trade, distinguishing between static gains (reallocating resources along a fixed PPC to reach a higher consumption indifference curve) and dynamic gains (technological transfers, increased competition, foreign investment, and scale economies that push the PPC outward). It also demonstrates that while trade is net welfare-improving for a nation, it redistributes domestic income, making domestic compensation mechanisms (like Trade Adjustment Assistance) politically and socially necessary.",
    quiz: [
      {
        question: "What is the difference between static and dynamic gains from trade?",
        options: [
          "Static gains involve moving resources on a fixed production frontier; dynamic gains shift the production frontier outward over time",
          "Static gains only apply to capital; dynamic gains only apply to labor",
          "Static gains are negative; dynamic gains are positive",
          "Static gains occur under autarky; dynamic gains occur under tariffs"
        ],
        answer: 0,
        explanation: "Static gains maximize efficiency with existing resources, while dynamic gains expand productive capacity through technology, investment, and learning-by-doing."
      }
    ]
  },
  {
    id: 17,
    title: "The Terms of Trade",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["Commodity or Net Barter Terms of Trade", "Gross Barter Terms of Trade", "Income Terms of Trade", "Single Factoral Terms of Trade", "Double Factoral Terms of Trade", "Real Cost Terms of Trade", "Utility Terms of Trade", "Determination of Terms of Trade", "Factors Affecting Terms of Trade", "Summary of Factors Affecting Terms of Trade", "Exercises"],
    summary: "The Terms of Trade (TOT) measure the relative prices of a country's exports compared to its imports. The Net Barter (or Commodity) TOT is calculated as $P_x/P_m$. To account for changes in productivity and export volumes, economists use alternative indicators: Income TOT ($(P_x/P_m) \\cdot Q_x$, measuring the capacity to import) and Single Factoral TOT ($(P_x/P_m) \\cdot Z_x$, adjusting for export productivity).",
    quiz: [
      {
        question: "Which index measures a nation's total capacity to import based on both relative export prices and export volumes?",
        options: [
          "Net Barter Terms of Trade",
          "Double Factoral Terms of Trade",
          "Income Terms of Trade",
          "Single Factoral Terms of Trade"
        ],
        answer: 2,
        explanation: "Income Terms of Trade is defined as (Px / Pm) * Qx, which scales the commodity terms of trade by export quantity to measure the total purchasing power of exports."
      }
    ]
  },
  {
    id: 18,
    title: "Terms of Trade and Economic Development: Secular Deterioration Hypothesis",
    partId: 1,
    partTitle: "THE PURE THEORY OF INTERNATIONAL TRADE",
    topics: ["The Prebisch-Singer Thesis", "Exercises"],
    summary: "The Prebisch-Singer Hypothesis argues that primary commodity exporters face a structural, long-run secular deterioration in their terms of trade against manufactured goods exporters. This is driven by: 1) low income elasticity of demand for food and raw materials (Engel's Law), 2) synthetic substitutes replacing natural inputs, and 3) asymmetrical labor markets (where productivity gains in rich nations lead to higher wages, while gains in developing nations lead to lower prices). This hypothesis formed the theoretical foundation for import-substitution industrialization (ISI) in developing nations.",
    quiz: [
      {
        question: "According to the Prebisch-Singer thesis, developing nations face a long-term decline in their terms of trade because:",
        options: [
          "They import too much gold",
          "Primary products have low income elasticity of demand compared to manufactured products",
          "They are too small to negotiate trade agreements",
          "High transport costs eat up all their export profits"
        ],
        answer: 1,
        explanation: "Engel's Law and structural factors cause demand for primary goods to rise more slowly than income, depressing primary product prices relative to manufactured goods over time."
      }
    ]
  },
  {
    id: 19,
    title: "Free Trade Versus Protection",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Free Trade", "Protection", "Exercises"],
    summary: "The long-standing debate between free trade (which maximizes global productive efficiency and consumer welfare) and protectionism (restricting trade to shield domestic industries). While economists generally favor free trade, valid economic arguments for protection include the Infant Industry Argument (protecting young domestic firms until they gain scale economies) and national security arguments. However, protectionism risks retaliatory trade wars and deadweight welfare losses.",
    quiz: [
      {
        question: "The Infant Industry Argument suggests that protection is justified:",
        options: [
          "Permanently for all agricultural sectors",
          "Temporarily for new domestic industries until they achieve cost efficiencies and scale economies to compete globally",
          "Only if the country has a permanent trade surplus",
          "To transfer wealth from domestic consumers to foreign producers"
        ],
        answer: 1,
        explanation: "This argument holds that temporary protection protects young domestic firms from foreign competition until they achieve economies of scale and learning-by-doing."
      }
    ]
  },
  {
    id: 20,
    title: "Tariffs",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Meaning and Types", "Effects of Tariffs", "Effects of a Tariff in a Large Country", "Optimum Tariff and Welfare", "Effects of a Tariff on Income Distribution: The Stolper-Samuelson Theorem", "Exercises"],
    summary: "Tariffs are custom duties or taxes imposed on imported goods. This chapter provides a complete micro-welfare analysis of tariffs. In a small country, a tariff raises domestic prices, resulting in a loss of consumer surplus, a gain in producer surplus, government revenue, and deadweight losses (consumption and production distortions). In a large country, a tariff reduces import demand, forcing foreign exporters to cut prices, improving the importing nation's Terms of Trade. The 'Optimum Tariff' maximizes this terms-of-trade gain over the deadweight loss.",
    simulatorMode: "tariff_simulation",
    quiz: [
      {
        question: "For a small country, the net welfare effect of a tariff is:",
        options: [
          "Always positive due to tariff revenue",
          "Always negative, resulting in a deadweight loss of production and consumption distortions",
          "Zero, because consumer loss equals producer gain",
          "Dependent on foreign export supply elasticities"
        ],
        answer: 1,
        explanation: "A small country cannot alter world prices. Therefore, it experiences no terms-of-trade gain, and any tariff strictly reduces national welfare by creating deadweight losses (areas b + d)."
      }
    ]
  },
  {
    id: 21,
    title: "Effective Rate of Protection",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Exercises"],
    summary: "The Effective Rate of Protection (ERP) measures the true level of protection given to domestic value-added rather than the nominal tariff on the final good. ERP takes into account tariffs on both final goods and imported intermediate inputs. If final goods have high tariffs and inputs are imported tariff-free, the ERP is much higher than the nominal rate. Conversely, taxing inputs reduces the effective protection of domestic producers.",
    quiz: [
      {
        question: "If a final product has a nominal tariff of 10%, and intermediate inputs represent 50% of the cost and are imported tariff-free, what is the Effective Rate of Protection?",
        options: [
          "5%",
          "10%",
          "15%",
          "20%"
        ],
        answer: 3,
        explanation: "Using the formula ERP = (t - a*ti) / (1 - a): ERP = (0.10 - 0.5*0) / (1 - 0.5) = 0.10 / 0.5 = 20%."
      }
    ]
  },
  {
    id: 22,
    title: "Non-Tariff Barriers (NTBs)",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Meaning, Classification of NTBs, Type of NTBs, Exercises"],
    summary: "Non-Tariff Barriers (NTBs) are administrative, qualitative, or regulatory restrictions used to limit imports without directly applying custom duties. Types of NTBs include sanitary and phytosanitary (SPS) regulations, technical barriers to trade (TBT), domestic-content requirements, and import licensing systems. Since the WTO has successfully reduced global tariffs, sovereign governments increasingly rely on NTBs for protectionism.",
    quiz: [
      {
        question: "Why have non-tariff barriers (NTBs) increased in relative importance in modern trade policy?",
        options: [
          "Because WTO agreements have drastically bound and reduced nominal tariff rates globally",
          "Because NTBs are easier to calculate than tariffs",
          "Because consumers prefer NTBs over free trade",
          "Because NTBs raise more government revenue than tariffs"
        ],
        answer: 0,
        explanation: "As international treaties successfully lower traditional tariffs, protectionist pressures pivot toward non-tariff measures like SPS, TBT, and licensing."
      }
    ]
  },
  {
    id: 23,
    title: "Import Quotas",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Meaning, Objectives of Import Quotas, Types of Import Quotas, Effects of Import Quotas, The Equivalence of Tariffs and Quotas, Import Quotas vs. Tariffs, Conclusion with Reference to LDCs, Exercises"],
    summary: "An import quota is a direct quantitative limit on the physical volume of imports allowed over a given period. While a quota raises domestic prices identically to a tariff, it differs in rent distribution. Instead of generating tariff revenue for the government, a quota creates 'quota rents.' If these licenses are given to foreign exporters (as in Voluntary Export Restraints, or VERs), the rents leave the country, making quotas far more costly to the importing nation than a tariff.",
    quiz: [
      {
        question: "A major economic difference between an import tariff and an equivalent import quota is:",
        options: [
          "A quota does not affect domestic prices",
          "A tariff restricts the physical volume of imports while a quota does not",
          "A tariff generates government revenue, whereas a quota generates quota rents that may go to private importers or foreign exporters",
          "Quotas are always legal under WTO rules"
        ],
        answer: 2,
        explanation: "Both restrict supply and raise prices. However, a tariff collects revenue, while a quota creates scarcity rent; who captures this rent determines the comparative welfare loss."
      }
    ]
  },
  {
    id: 24,
    title: "Dumping",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Meaning, Types of Dumping, Objectives of Dumping, Price Determination Under Dumping, Effects of Dumping, Anti-Dumping Measures, Exercises"],
    summary: "Dumping occurs when a firm exports a commodity at a price lower than its domestic price or below its cost of production. It is classified as: 1) sporadic (disposing of casual excess inventory), 2) predatory (selling at a loss temporarily to drive foreign competitors out of business), and 3) persistent (continuous international price discrimination to maximize profits). Anti-dumping duties are WTO-permitted retaliatory measures designed to offset these price distortions.",
    quiz: [
      {
        question: "Which type of dumping represents continuous international price discrimination, where a monopolist charges a lower price in the highly price-elastic foreign market?",
        options: [
          "Sporadic dumping",
          "Predatory dumping",
          "Persistent dumping",
          "Accidental dumping"
        ],
        answer: 2,
        explanation: "Persistent dumping occurs when a firm permanently exploits differences in demand elasticities between insulated domestic markets and highly competitive foreign markets."
      }
    ]
  },
  {
    id: 25,
    title: "Exchange Control",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Meaning, Features, Objectives of Exchange Control, Methods of Exchange Control, Merits and Demerits of Exchange Control, Exercises"],
    summary: "Exchange control is a state policy where the government centralizes and monopolizes all foreign currency transactions. Private individuals and firms must sell foreign earnings to the central bank at an officially mandated exchange rate, and rationed foreign exchange is allocated only for government-approved imports. While used to prevent capital flight and defend fixed exchange rates, it often leads to black markets, resource misallocations, and severe import bottlenecks.",
    quiz: [
      {
        question: "What is a major demit or consequence of rigid state exchange controls?",
        options: [
          "A complete lack of inflation",
          "The rapid development of a parallel or black market for foreign exchange",
          "An immediate surplus in the current account",
          "Perfect liquidity for all domestic firms"
        ],
        answer: 1,
        explanation: "When the government rations foreign currency at an overvalued official rate, excess demand spills over, creating a parallel or black market."
      }
    ]
  },
  {
    id: 26,
    title: "International Cartels",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Meaning, Objectives of International Cartels, Conditions for the Success of Cartels, Price, Output and Profit Determination by a Cartel, Exercises"],
    summary: "An international cartel is an organization of independent producers from different countries that agree to limit output, fix export prices, and divide global markets. The primary goal is to act as a shared monopoly. Cartel success depends on: 1) low price elasticity of demand for the commodity, 2) high barriers to entry, and 3) strong internal discipline to prevent individual members from 'cheating' by exceeding their production quotas. The most famous example is OPEC.",
    quiz: [
      {
        question: "Which of the following conditions is most crucial for the long-term survival of an international cartel?",
        options: [
          "High price elasticity of demand for the product",
          "Active price-slashing by members",
          "Strong internal monitoring and enforcement mechanisms to prevent cheating on quotas",
          "A large number of small, independent non-member producers"
        ],
        answer: 2,
        explanation: "Cartels naturally incentivize cheating (selling secret extra volume at high prices); without strict discipline and monitoring, cartels collapse."
      }
    ]
  },
  {
    id: 27,
    title: "State Trading",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Introduction, Objectives of State Trading, Merits of State Trading, Demerits of State Trading, State Trading in India, Exercises"],
    summary: "State trading refers to direct governmental intervention in international trade where state-owned enterprises or monopolies conduct import and export transactions. This is used to secure critical food or fuel supplies, negotiate bulk purchase discounts, control luxury consumption, and capture trade profits directly for the state. However, state trading enterprises often suffer from bureaucratization, inefficiency, and lack of commercial flexibility.",
    quiz: [
      {
        question: "State trading enterprises are primarily established by governments to:",
        options: [
          "Abolish international trade completely",
          "Conduct bulk purchasing and control import channels for strategic commodities",
          "Eliminate all domestic agricultural production",
          "Avoid paying transport costs on shipping lines"
        ],
        answer: 1,
        explanation: "Governments use state monopolies to secure bulk prices and stabilize domestic supplies of critical items like grains, petroleum, and fertilizers."
      }
    ]
  },
  {
    id: 28,
    title: "International Economic Integration: Customs Union",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["International Economic Integration, The Theory of Customs Union, Economic Integration Among Developing Countries, Exercises"],
    summary: "Economic integration describes countries coordinating their commercial policies. Jacob Viner (1950) analyzed the trade-off in forming a Customs Union (which eliminates internal tariffs and establishes a common external tariff). It triggers two opposing forces: Trade Creation (replacing high-cost domestic goods with lower-cost partner imports, raising welfare) and Trade Diversion (replacing lower-cost non-member imports with higher-cost partner imports due to tariff distortions, reducing welfare).",
    quiz: [
      {
        question: "Under Jacob Viner's customs union theory, 'Trade Diversion' occurs when trade shifts from:",
        options: [
          "A higher-cost partner country to a lower-cost non-member",
          "A lower-cost non-member country to a higher-cost partner country due to preferential tariff removal",
          "Domestic producers to foreign monopolists",
          "Manufacturing sectors to agricultural sectors"
        ],
        answer: 1,
        explanation: "Trade diversion is a welfare-reducing distortion where tariff preferences force a country to buy imports from a less efficient union partner instead of a more efficient global producer."
      }
    ]
  },
  {
    id: 29,
    title: "ASEAN and NAFTA",
    partId: 2,
    partTitle: "COMMERCIAL POLICY",
    topics: ["Association of South East Asian Nations (ASEAN)", "North American Free Trade Agreement (NAFTA)", "Exercises"],
    summary: "This chapter analyzes real-world case studies of regional economic integration. The Association of Southeast Asian Nations (ASEAN) represents a highly successful developmental trade bloc characterized by consensus-driven integration. The North American Free Trade Agreement (NAFTA, now USMCA) represents a deep trade agreement between advanced economies (US and Canada) and a major developing economy (Mexico), demonstrating both wage adjustments, supply chain integration, and structural dislocations.",
    quiz: [
      {
        question: "Which trade agreement integrated the supply chains of Canada, Mexico, and the United States?",
        options: [
          "ASEAN",
          "MERCOSUR",
          "NAFTA",
          "ECOWAS"
        ],
        answer: 2,
        explanation: "NAFTA (North American Free Trade Agreement, now USMCA) eliminated trade barriers and deeply integrated production across North America."
      }
    ]
  },
  {
    id: 30,
    title: "Balance of Payments: Meaning and Components",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Meaning, Structure of Balance of Payments Accounts, Is Balance of Payments Always in Equilibrium?, Measuring Deficit or Surplus in Balance of Payments, Balance of Trade and Balance of Payments, Disequilibrium in Balance of Payments, Measures to Correct Deficit in Balance of Payments, Exercises"],
    summary: "The Balance of Payments (BOP) is a comprehensive record of a country's economic transactions with the rest of the world over a year. Using double-entry bookkeeping, the total BOP always sums to zero. It is divided into: 1) the Current Account (trade in goods, services, primary income, and unilateral transfers), 2) the Capital Account (debt forgiveness, non-financial asset transfers), and 3) the Financial Account (FDI, portfolio flows, and official central bank reserve movements). A 'BOP crisis' refers to a structural deficit requiring central banks to exhaust foreign reserves to defend their currency.",
    quiz: [
      {
        question: "Which of the following transactions is recorded in the Current Account of the Balance of Payments?",
        options: [
          "A foreign multinational buying a domestic factory (FDI)",
          "An expatriate worker sending a cash remittance to their family in their home country",
          "A domestic bank purchasing foreign treasury bonds",
          "The central bank selling gold reserves"
        ],
        answer: 1,
        explanation: "Worker remittances are unilateral transfers, which are classified as secondary income inside the Current Account."
      }
    ]
  },
  {
    id: 31,
    title: "Adjustment Mechanisms of Balance of Payments",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Introduction, Automatic Price Adjustment Under Gold Standard, Automatic Price Adjustment Under Flexible Exchange Rates (Price Effect), The Elasticity Approach, The Absorption Approach, The Monetary Approach, Exercises"],
    summary: "This chapter covers how countries adjust to Balance of Payments disequilibria. Under the classic Gold Standard, adjustment occurs automatically via David Hume's Price-Specie-Flow mechanism (gold flows alter domestic money supplies, shifting relative prices). Under flexible exchange rates, adjustment occurs through currency appreciation/depreciation. Modern adjustments are analyzed using three core frameworks: the Elasticities Approach (Marshall-Lerner), the Absorption Approach ($B = Y - A$), and the Monetary Approach (where BOP flows correct imbalances between money supply and money demand).",
    quiz: [
      {
        question: "According to the Absorption Approach, a current account deficit represents a situation where a nation's:",
        options: [
          "Money supply exceeds its money demand",
          "Total output (Y) is less than its domestic absorption/spending (A)",
          "Exports exceed its imports",
          "Tariffs are too high"
        ],
        answer: 1,
        explanation: "The Absorption formula is B = Y - A. A trade deficit (B < 0) occurs when domestic spending/absorption (A) exceeds national output (Y)."
      }
    ]
  },
  {
    id: 32,
    title: "Balance of Payments Policies: Internal and External Balance",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Introduction, Expenditure Changing Monetary and Fiscal Policies, Monetary-Fiscal Mix, Internal and External Balance Policies, Monetary and Fiscal Policies for Achieving Internal and External Balance Simultaneously, The Assignment Problem: The Mundellian Model of Monetary-Fiscal Policies for Internal and External Balance, Expenditure Switching Policies, Exercises"],
    summary: "Governments strive to achieve both Internal Balance (full employment with price stability) and External Balance (sustainable BOP equilibrium). Under the Mundell-Fleming model, achieving both requires matching different policy instruments to specific targets (the Tinbergen Rule). Robert Mundell's 'Assignment Problem' proved that monetary policy should be assigned to external balance (as capital flows are sensitive to interest rates), while fiscal policy should be assigned to internal balance. Using the wrong policy mix leads to severe economic instability.",
    quiz: [
      {
        question: "Robert Mundell's Assignment Problem states that under fixed exchange rates, monetary policy should be assigned to:",
        options: [
          "Internal balance (employment)",
          "External balance (BOP/capital flows) due to interest-rate-sensitive capital mobility",
          "Reducing government debt",
          "Abolishing tariffs"
        ],
        answer: 1,
        explanation: "Monetary policy affects interest rates, which directly drives capital inflows or outflows. Thus, it is more effective at managing the external balance than fiscal policy."
      }
    ]
  },
  {
    id: 33,
    title: "Income Adjustment: Foreign Trade Multiplier",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Working of Foreign Trade Multiplier, Exercises"],
    summary: "The Foreign Trade Multiplier (or open-economy Keynesian multiplier) shows how an autonomous increase in exports or domestic investment expands national income. Unlike a closed economy where saving ($S$) is the only leak, an open economy has two leaks: saving and imports ($M$). The open economy multiplier is: $K_f = 1 / (MPS + MPM)$, where $MPS$ is the marginal propensity to save and $MPM$ is the marginal propensity to import. A rise in exports boosts domestic income, which in turn causes imports to rise, partially feeding back into foreign economies.",
    quiz: [
      {
        question: "If a country has a marginal propensity to save (MPS) of 0.2 and a marginal propensity to import (MPM) of 0.3, what is the open-economy foreign trade multiplier?",
        options: [
          "1.0",
          "2.0",
          "3.33",
          "5.0"
        ],
        answer: 1,
        explanation: "The open economy multiplier is Kf = 1 / (MPS + MPM). Here, Kf = 1 / (0.2 + 0.3) = 1 / 0.5 = 2.0."
      }
    ]
  },
  {
    id: 34,
    title: "Foreign Exchange Rate",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Meaning of Foreign Exchange Rate, Determination of Equilibrium Exchange Rate, Theories of Foreign Exchange Rate, Causes of Changes in the Exchange Rate, Exercises"],
    summary: "The foreign exchange rate is the price of one currency in terms of another. Equilibrium exchange rates are determined by supply and demand for foreign currency. Long-run exchange rates are modeled using Purchasing Power Parity (PPP, driven by relative inflation rates). Short-run movements are driven by interest rate differentials and investor expectations, modeled by Interest Rate Parity (IRP).",
    simulatorMode: "exchange_rate",
    quiz: [
      {
        question: "According to Purchasing Power Parity, if price levels double in Country A while remaining flat in Country B:",
        options: [
          "Country A's currency should appreciate by 50%",
          "Country A's currency should depreciate by approximately 50% relative to Country B's",
          "The nominal exchange rate remains unchanged",
          "Trade between the two nations ceases"
        ],
        answer: 1,
        explanation: "PPP states that the exchange rate adjusts to maintain purchasing parity: E = Pa / Pb. If Pa doubles, E must rise (depreciating currency A) to balance real purchasing power."
      }
    ]
  },
  {
    id: 35,
    title: "Foreign Exchange Rate Policy",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Introduction, Fixed Exchange Rates, Flexible Exchange Rates, Hybrid or Intermediate Exchange Rate Systems, Multiple Exchange Rates System, Exchange Rate Regimes in Practice, Exercises"],
    summary: "Sovereign nations must choose an exchange rate regime. Fixed exchange rates provide price stability and encourage trade, but require central banks to hold massive foreign reserves and surrender monetary independence. Flexible exchange rates absorb external shocks automatically and preserve monetary autonomy, but introduce volatility and currency risk. Hybrid systems include crawling pegs, target zones, and managed floats ('dirty floats').",
    quiz: [
      {
        question: "Under a managed float (or 'dirty float') exchange rate system:",
        options: [
          "The exchange rate is completely fixed to gold",
          "The exchange rate is determined by market forces, but the central bank occasionally intervenes to smooth out extreme fluctuations",
          "The country uses multiple exchange rates for different goods",
          "The currency value is legally determined by the IMF"
        ],
        answer: 1,
        explanation: "A managed float combines market-driven rates with selective central bank interventions to stabilize currency volatility."
      }
    ]
  },
  {
    id: 36,
    title: "Devaluation",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Meaning, Effects of Devaluation, Conditions for the Success of Devaluation, Exercises"],
    summary: "Devaluation is a deliberate downward adjustment of a country's official exchange rate under a fixed or pegged regime. It aims to correct a trade deficit by making exports cheaper and imports more expensive. Devaluation succeeds only if the Marshall-Lerner Condition holds (sum of price elasticities of export and import demand exceeds 1). In the short run, the trade balance often deteriorates before improving, producing the classic 'J-Curve' effect.",
    simulatorMode: "j_curve",
    quiz: [
      {
        question: "The J-Curve effect explains that immediately following a currency devaluation, the trade balance:",
        options: [
          "Improves immediately due to cheap exports",
          "Worsens in the short run due to inelastic short-run contracts, before improving in the long run",
          "Remains completely flat",
          "Flctuates randomly without any pattern"
        ],
        answer: 1,
        explanation: "In the immediate short run, export/import quantities are locked in by pre-signed contracts, while the cost of imports immediately rises, widening the deficit before consumers and producers adjust volumes."
      }
    ]
  },
  {
    id: 37,
    title: "Optimum Currency Area",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Introduction, Theories of Optimum Currency Area, Merits and Demerits of Optimum Currency Area, Exercises"],
    summary: "Robert Mundell's theory of Optimum Currency Areas (OCA) defines the conditions under which a group of countries benefit from sharing a single currency. Key criteria for a successful OCA include: 1) high labor mobility across regions, 2) capital mobility and price/wage flexibility, 3) a centralized fiscal transfer system to assist depressed regions, and 4) synchronized business cycles. Sharing a currency eliminates exchange risk but deprives members of individual monetary policy and exchange rate adjustment tools (as seen in the Eurozone crisis).",
    quiz: [
      {
        question: "Which of the following is a primary criterion for a successful Optimum Currency Area (OCA)?",
        options: [
          "High barriers to labor migration",
          "Sovereign monetary independence for each region",
          "High labor and capital mobility across the member nations",
          "Different inflation targets in every country"
        ],
        answer: 2,
        explanation: "High factor mobility allows regions to adjust to asymmetric shocks without needing to devalue an independent national currency."
      }
    ]
  },
  {
    id: 38,
    title: "The Foreign Exchange Market",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Introduction, The Structure of Foreign Exchange Market, Methods of Foreign Payments, Spot and Forward Exchange Markets, Exercises"],
    summary: "The institutional framework where international currencies are bought and sold. It operates globally as an over-the-counter market dominated by commercial banks and foreign exchange brokers. Transactions are divided into the Spot Market (immediate currency exchange, usually settled within two business days) and the Forward Market (contracts to exchange currencies at a fixed rate on a specified future date, used for hedging and speculation).",
    quiz: [
      {
        question: "A transaction in the forward foreign exchange market involves:",
        options: [
          "The immediate physical delivery of currency at the current price",
          "An agreement to exchange currencies at a specified rate on a specified future date",
          "The purchase of gold directly from the IMF",
          "A transaction that is completely free of exchange rate risk"
        ],
        answer: 1,
        explanation: "Forward contracts allow businesses to lock in an exchange rate today for a future transaction, hedging against currency fluctuations."
      }
    ]
  },
  {
    id: 39,
    title: "International Capital Movements",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Meaning, Types of International Capital Movements, Factors Affecting International Capital Movements, Exercises"],
    summary: "International capital movements represent the flow of financial assets across national borders. They are categorized as: 1) Foreign Direct Investment (FDI, acquiring physical capital or a controlling stake in a foreign company), and 2) Foreign Portfolio Investment (FPI, acquiring liquid financial assets like stocks and bonds). Capital flows are driven by search for higher returns, portfolio diversification, economic stability, and tax policies, but highly volatile 'hot money' portfolio flows can destabilize developing economies during panics.",
    quiz: [
      {
        question: "What distinguishes Foreign Direct Investment (FDI) from Foreign Portfolio Investment (FPI)?",
        options: [
          "FPI involves taking a controlling management stake in a foreign enterprise; FDI does not",
          "FDI involves physical assets or a controlling management stake (usually 10%+); FPI involves passive ownership of liquid financial assets like stocks and bonds",
          "FDI is always short-term; FPI is always long-term",
          "FDI is illegal under WTO rules; FPI is mandatory"
        ],
        answer: 1,
        explanation: "FDI represents a long-term strategic investment with active management control, whereas FPI consists of passive, highly liquid financial asset holdings."
      }
    ]
  },
  {
    id: 40,
    title: "The Transfer Problem",
    partId: 3,
    partTitle: "BALANCE OF PAYMENTS",
    topics: ["Introduction, The Transfer Problem, Exercises"],
    summary: "The Transfer Problem (debated heavily by Keynes and Ohlin regarding German WWI reparations) asks whether transferring purchasing power from Country A to Country B requires a shift in their terms of trade. Keynes argued that a physical transfer creates a severe 'transfer burden' because the paying country must depreciate its currency to generate a trade surplus. Ohlin argued that the transfer itself shifts purchasing power and demand directly, automatically adjusting the trade balance without requiring a major terms-of-trade deterioration.",
    quiz: [
      {
        question: "In the famous debate on the Transfer Problem, Keynes argued that Germany's war reparations:",
        options: [
          "Would naturally balance out without any terms-of-trade adjustments",
          "Required a significant depreciation of the German Mark, imposing an additional 'transfer burden' on its terms of trade",
          "Would enrich Germany by boosting manufactured exports",
          "Should be paid entirely in physical gold"
        ],
        answer: 1,
        explanation: "Keynes claimed that making unilateral transfers required exporting more, which could only be achieved by devaluing the currency and worsening the country's terms of trade."
      }
    ]
  },
  {
    id: 41,
    title: "Foreign Trade and Economic Development",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction", "Importance of Foreign Trade", "Exercises"],
    summary: "This chapter analyzes the role of trade as an 'engine of economic growth' (as famously termed by Dennis Robertson). Under classical views, trade allows developing countries to escape small domestic markets, specialize in commodities, import capital goods, and attract foreign technology. However, structuralist critics argue that trade can lock developing nations into primary commodity traps, exacerbating international inequalities.",
    quiz: [
      {
        question: "The phrase 'trade is an engine of growth' implies that:",
        options: [
          "Trade leads to high tariffs and quotas",
          "Trade enables resource reallocation, technological transfers, and market expansion that drives aggregate development",
          "Trading nations always experience massive inflation",
          "Only heavy manufacturing can be exported"
        ],
        answer: 1,
        explanation: "This view highlights the dynamic, developmental gains of trade that expand a nation's long-run productive capacity."
      }
    ]
  },
  {
    id: 42,
    title: "Commercial Policy and Inward-Looking and Outward-Looking Policies",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Meaning, Commercial Policy for Economic Development, Conclusion, Exercises"],
    summary: "The contrast between two primary developmental strategies: 1) Inward-Looking Industrialization (Import-Substitution Industrialization, or ISI), which uses high tariffs and quotas to shield domestic markets and develop domestic manufacturing, and 2) Outward-Looking Growth (Export-Led Growth), which utilizes low trade barriers, competitive exchange rates, and export subsidies to integrate into global markets (as executed by the East Asian Tigers). History has shown that outward-looking policies generally lead to far higher long-term productivity and growth.",
    quiz: [
      {
        question: "Import-Substitution Industrialization (ISI) is characterized by:",
        options: [
          "Abolishing all domestic manufacturing",
          "Imposing high tariffs and import quotas to protect and nurture domestic industries replacing foreign imports",
          "Subsidizing multinational corporation exports",
          "Pegging the national currency directly to the Euro"
        ],
        answer: 1,
        explanation: "ISI is an inward-looking policy that uses trade barriers to foster domestic manufacturing of goods that were previously imported."
      }
    ]
  },
  {
    id: 43,
    title: "Foreign Aid in Economic Development",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Types of Foreign Aid, Role of Foreign Aid in Economic Development, Tied Vs. Untied Aid, Factors Determining the Amount of Foreign Aid for Economic Development, Aid or Trade, Exercises"],
    summary: "Foreign aid consists of international transfers of capital, goods, or technical expertise. Aid can be bilateral (government-to-government) or multilateral (via the World Bank or UN). A critical debate involves 'Tied Aid' (aid that must be spent on goods and services from the donor country, which often inflates costs and reduces aid efficiency) versus 'Untied Aid.' While aid can bridge domestic savings and foreign exchange gaps, critics argue it can foster corruption, dependency, and Dutch disease.",
    quiz: [
      {
        question: "What is 'tied aid'?",
        options: [
          "Aid that is legally tied to a fixed interest rate",
          "Aid that requires the recipient country to purchase goods and services from the donor country",
          "Aid that is strictly given in the form of physical ropes and shipping ties",
          "Aid that can only be spent on environmental projects"
        ],
        answer: 1,
        explanation: "Tied aid obligates the recipient nation to buy imports from the donor, which often prevents them from sourcing cheaper or more appropriate materials elsewhere."
      }
    ]
  },
  {
    id: 44,
    title: "Export Instability and International Commodity Agreements",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction, Export Instability Problem, Exercises"],
    summary: "Developing countries dependent on primary commodities face severe export instability due to highly price-inelastic and volatile world supply and demand. To stabilize export prices, countries have historically entered International Commodity Agreements (ICAs) using: 1) buffer stocks (buying up supplies when prices fall, and selling reserves when prices rise), 2) export quotas, and 3) multilateral contracts. However, funding buffer stocks and preventing cheating makes these agreements notoriously difficult to sustain.",
    quiz: [
      {
        question: "How does a buffer stock scheme attempt to stabilize commodity prices?",
        options: [
          "By banning all exports of the commodity",
          "By purchasing the commodity when prices are low and selling from reserves when prices are high",
          "By fixing prices at a permanent high level regardless of demand",
          "By tax-subsidizing foreign consumers"
        ],
        answer: 1,
        explanation: "Buffer stocks absorb excess market supply during gluts to support prices, and inject supply during shortages to cap price spikes."
      }
    ]
  },
  {
    id: 45,
    title: "Private Foreign Investment and Multinational Corporations",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Types of Private Foreign Investment, Merits and Demerits of Private Foreign Investments (PFI), Multinational Corporations and LDCs, Exercises"],
    summary: "Multinational Corporations (MNCs) are the primary vehicles for private foreign direct investment. For Less Developed Countries (LDCs), MNCs provide critical capital, technology transfers, managerial expertise, and global market access. However, demerits include potential crowding out of domestic firms, repatriation of high profits, transfer pricing to avoid taxes, and interference in domestic economic sovereignty.",
    quiz: [
      {
        question: "Transfer pricing is a technique used by some multinational corporations to:",
        options: [
          "Equalize wages across all their international subsidiaries",
          "Shift profits from high-tax jurisdictions to low-tax jurisdictions by manipulating prices of internal transactions",
          "Lower transport costs on international trade routes",
          "Establish fair prices for poor consumers"
        ],
        answer: 1,
        explanation: "Transfer pricing involves pricing transactions between subsidiaries to ensure profits accumulate in low-tax tax havens, minimizing global corporate tax bills."
      }
    ]
  },
  {
    id: 46,
    title: "The International Monetary Fund (IMF)",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Origin of IMF, Objectives of the Fund, Functions of the Fund, Organisation and Structure of the Fund, Working of The Fund, Suggestions to Reform the IMF, India and The IMF, The Role of Gold in the IMF, Special Drawing Rights (SDRs), Exercises"],
    summary: "Established at the Bretton Woods Conference in 1944, the IMF was designed to oversee the international monetary system, promote exchange rate stability, and provide short-term financial assistance to countries experiencing temporary Balance of Payments deficits. It issues Special Drawing Rights (SDRs)—an international reserve asset based on a basket of five major currencies (US Dollar, Euro, Chinese Renminbi, Japanese Yen, and British Pound). IMF loans often come with strict structural adjustment conditions.",
    quiz: [
      {
        question: "The basket of currencies determining the value of Special Drawing Rights (SDRs) includes:",
        options: [
          "US Dollar, Euro, Chinese Renminbi, Japanese Yen, British Pound",
          "US Dollar, Canadian Dollar, Swiss Franc, Australian Dollar, Euro",
          "US Dollar, Gold, Silver, Oil, Grain",
          "Euro, Japanese Yen, Indian Rupee, Brazilian Real, Russian Ruble"
        ],
        answer: 0,
        explanation: "SDR value is based on a weighted average of the five currencies representing major global trade and financial transactions."
      }
    ]
  },
  {
    id: 47,
    title: "The World Bank",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Functions, Membership, Organisation, Capital Structure, Funding Strategy, Bank Borrowings, Bank Lending Activities, Other Activities, Critical Appraisal, India and the World Bank, Exercises"],
    summary: "The International Bank for Reconstruction and Development (IBRD), commonly known as the World Bank, was founded alongside the IMF at Bretton Woods. While the IMF focuses on short-term monetary and BOP stability, the World Bank focuses on long-term economic development and poverty reduction. It finances large-scale infrastructure projects (roads, dams, power plants), agricultural programs, and social sector reforms (education, healthcare) in developing countries.",
    quiz: [
      {
        question: "A key structural difference in mission between the IMF and the World Bank is:",
        options: [
          "The IMF only lends to rich countries; the World Bank only to poor countries",
          "The IMF focuses on short-term macroeconomic and BOP stability; the World Bank focuses on long-term development projects and poverty reduction",
          "The IMF manages military aid; the World Bank manages commercial trade",
          "There is no difference; they are identical institutions"
        ],
        answer: 1,
        explanation: "The IMF acts as a monetary guardian and lender of last resort, while the World Bank is a developmental lending institution."
      }
    ]
  },
  {
    id: 48,
    title: "The World Bank Group",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["The International Development Association (IDA), The International Finance Corporation (IFC), The Multilateral Investment Guarantee Agency (MIGA), Exercieses"],
    summary: "The World Bank Group consists of five closely associated institutions: 1) IBRD (lending to middle-income governments), 2) International Development Association (IDA, providing interest-free loans and grants—known as 'concessional flows'—to the poorest nations), 3) International Finance Corporation (IFC, investing directly in private sector projects in developing nations), 4) Multilateral Investment Guarantee Agency (MIGA, offering political risk insurance), and 5) ICSID (handling investment disputes).",
    quiz: [
      {
        question: "Which World Bank Group institution is responsible for providing highly concessional interest-free loans ('soft loans') and grants to the world's poorest countries?",
        options: [
          "International Finance Corporation (IFC)",
          "Multilateral Investment Guarantee Agency (MIGA)",
          "International Development Association (IDA)",
          "International Centre for Settlement of Investment Disputes (ICSID)"
        ],
        answer: 2,
        explanation: "IDA is the concessional window of the World Bank, providing highly subsidized funding and grants to low-income countries."
      }
    ]
  },
  {
    id: 49,
    title: "International Liquidity",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Meaning, Problem of International Liquidity, Measures to Solve the Problem of International Liquidity, Position of International Reserves, IMF and International Liquidity, Role of the IMF in Increasing World Liquidity, Exercises"],
    summary: "International liquidity refers to the total stock of globally accepted reserve assets (gold, key foreign currencies, SDRs, and reserve positions in the IMF) available to national central banks to settle balance of payments deficits and defend exchange rates. The central problem of international liquidity is ensuring the supply of reserves grows in line with expanding world trade, without triggering global inflation or undermining confidence in the reserve currencies.",
    quiz: [
      {
        question: "International liquidity is primarily used by national central banks to:",
        options: [
          "Fund domestic welfare programs",
          "Settle international balance of payments deficits and stabilize exchange rates",
          "Buy up foreign real estate directly",
          "Pay off private commercial bank loans"
        ],
        answer: 1,
        explanation: "Central banks hold international reserves (liquidity) as a buffer to clear payment gaps with other nations without suffering disruptive currency collapses."
      }
    ]
  },
  {
    id: 50,
    title: "The International Debt Problem",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction, The Debt Crisis, Measure to Solve the Debt Crisis, Exercises"],
    summary: "The Third World Debt Crisis erupted in 1982 when Mexico declared it could no longer service its sovereign debt, triggering panic across commercial banks. The crisis was fueled by heavy commercial borrowing of recycled petrodollars in the 1970s, combined with soaring US interest rates and falling primary export prices. Resolving the crisis required structural adjustments, debt rescheduling, and ultimately debt write-offs under programs like the Brady Plan and the Heavily Indebted Poor Countries (HIPC) initiative.",
    quiz: [
      {
        question: "What major international initiative helped resolve the 1980s sovereign debt crisis by converting bank loans into collateralized bonds backed by US Treasuries?",
        options: [
          "The Marshall Plan",
          "The Brady Plan",
          "The Keynes Plan",
          "The Prebisch Initiative"
        ],
        answer: 1,
        explanation: "The Brady Plan (1989) allowed debtor countries to convert defaulted commercial bank loans into 'Brady Bonds,' restructuring and writing off significant debt."
      }
    ]
  },
  {
    id: 51,
    title: "International Monetary System",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Meaning, The Bretton Woods System, The Breakdown of the Bretton Woods System, The Present International Monetary System, Exercises"],
    summary: "The rules, custom systems, and institutions governing international payments. History is divided into: 1) the Gold Standard (1870-1914, fixed exchange rates backed by physical gold), 2) the Interwar Period (chaos and floating rates), 3) the Bretton Woods System (1944-1971, adjustable peg where currencies were pegged to the US Dollar, which was pegged to gold at $35/ounce), and 4) the post-1973 Managed Float era. The Bretton Woods system collapsed due to the 'Triffin Dilemma' (the conflict between providing global liquidity and maintaining confidence in the US dollar).",
    quiz: [
      {
        question: "The Triffin Dilemma explained why the Bretton Woods system was inherently unstable, citing:",
        options: [
          "The conflict between global trade volumes and shipping capacity",
          "The fundamental conflict between the US running perpetual balance of payment deficits to supply global liquidity, and maintaining gold-convertibility confidence in the US Dollar",
          "The rising price of silver",
          "The complete lack of IMF funding"
        ],
        answer: 1,
        explanation: "To supply global reserves, the US had to run trade deficits, which naturally watered down the gold backing of the USD, eventually causing a run on US gold reserves."
      }
    ]
  },
  {
    id: 52,
    title: "The Euro-Dollar Market",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Meaning, Origin and Growth, Features of Euro-Dollar Market, How Does it Function?, Role in International Financial System, Exercises"],
    summary: "The Euro-dollar (or Eurocurrency) market represents US dollar-denominated deposits held in commercial banks outside the United States (not limited to Europe). This market grew rapidly due to the absence of domestic regulations (like interest rate caps, reserve requirements, and capital controls) on foreign deposits. This unregulated market provides highly efficient, high-volume international lending, but can accelerate speculative currency flows during financial panics.",
    quiz: [
      {
        question: "A 'Eurodollar' deposit refers to:",
        options: [
          "A digital currency combining the Euro and US Dollar",
          "A US Dollar-denominated bank deposit held in any commercial bank outside the United States",
          "The official currency of the European Central Bank",
          "A bond issued by European governments in local currency"
        ],
        answer: 1,
        explanation: "Despite the prefix 'Euro,' Eurodollars are simply US dollars deposited in foreign banks (including in Asia, Europe, or offshore), operating outside US banking regulations."
      }
    ]
  },
  {
    id: 53,
    title: "The European Union (EU)",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["History, Objectives, Organisation, Working And Achievements, EU and Developing Countries, India and EU, Exercises"],
    summary: "The European Union is the world's most advanced example of regional economic integration. It progressed from a Sectoral integration (European Coal and Steel Community in 1951) to a Free Trade Area, to a Customs Union (Treaty of Rome in 1957), then to a Common Market (eliminating barriers to labor and capital), and finally to an Economic and Monetary Union with a single currency (the Euro). This deep integration has yielded massive trade gains, but highlights challenges of fiscal sovereignty.",
    quiz: [
      {
        question: "Which treaty established the European Economic Community (EEC) in 1957, laying the groundwork for the modern EU customs union?",
        options: [
          "Treaty of Versailles",
          "Treaty of Rome",
          "Maastricht Treaty",
          "Schengen Agreement"
        ],
        answer: 1,
        explanation: "The Treaty of Rome (1957) created the EEC, establishing a common market and a customs union among its original six European members."
      }
    ]
  },
  {
    id: 54,
    title: "The European Monetary System and the Euro",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction, The European Monetary System, The European Monetary Union: The EURO, Exercises"],
    summary: "The transition from a managed exchange rate peg (the European Monetary System with its 'snake' and exchange rate mechanisms) to a complete monetary union in 1999 (the Euro, governed by the European Central Bank). Joining the Eurozone requires meeting strict Maastricht Convergence Criteria regarding inflation, interest rates, budget deficits (under 3% of GDP), and public debt (under 60% of GDP).",
    quiz: [
      {
        question: "To adopt the Euro, EU member states must satisfy the Maastricht criteria, which limits sovereign annual budget deficits to a maximum of:",
        options: [
          "1% of GDP",
          "3% of GDP",
          "5% of GDP",
          "10% of GDP"
        ],
        answer: 1,
        explanation: "The Maastricht Convergence Criteria mandates that member budget deficits must not exceed 3% of GDP, and total public debt must stay below 60% of GDP."
      }
    ]
  },
  {
    id: 55,
    title: "The General Agreement on Tariffs and Trade (GATT)",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction, What is GATT?, Objectives of GATT, Provisions of GATT, GATT 'Rounds' of Global Trade Negotiations, GATT and Developing Countries, Criticisms of GATT, Exercises"],
    summary: "Established in 1947 as a temporary treaty after the planned International Trade Organization (ITO) failed ratification, GATT oversaw global trade for nearly 50 years. Guided by key principles—Most Favored Nation (MFN, non-discrimination among trading partners) and National Treatment (treating foreign products identically to domestic products)—GATT organized eight rounds of multilateral trade negotiations (culminating in the Uruguay Round, 1986-1994), which slashed average industrial tariffs from 40% to under 5%.",
    quiz: [
      {
        question: "The 'Most Favored Nation' (MFN) principle under GATT/WTO rules means:",
        options: [
          "A country must grant its trading partners the lowest tariff rates it offers to any other nation, ensuring non-discrimination",
          "A country must buy all its imports from its favorite neighbor",
          "Rich countries must receive higher subsidies than poor countries",
          "Tariffs should be replaced entirely with import quotas"
        ],
        answer: 0,
        explanation: "MFN ensures trade non-discrimination: any trade concession or tariff reduction granted to one WTO member must immediately be extended to all members."
      }
    ]
  },
  {
    id: 56,
    title: "The World Trade Organisation (WTO)",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction, The WTO, Difference Between GATT and WTO, Its Structure, Its Objectives, Its Functions, WTO Agreement, Critical Appraisal of Uruguay Round and WTO Agreement, Working of WTO, Doha Round, Exercises"],
    summary: "Created on January 1, 1995, as a result of the Uruguay Round, the WTO replaced GATT as a permanent international organization. Unlike GATT (which only covered goods), the WTO covers services (GATS), intellectual property (TRIPS), and agricultural trade. Crucially, the WTO has a powerful, legally binding Dispute Settlement Mechanism that can authorize retaliatory trade sanctions against members violating trade rules. The ongoing Doha Round launched in 2001 has struggled to resolve disputes regarding agricultural subsidies in wealthy nations.",
    quiz: [
      {
        question: "A major difference between GATT and the WTO is that:",
        options: [
          "GATT was a permanent organization; the WTO is just a temporary treaty",
          "The WTO has a legally binding Dispute Settlement Mechanism and covers services and intellectual property, which GATT did not",
          "GATT only applied to agricultural goods; the WTO only applies to manufacturing",
          "The WTO is controlled entirely by the World Bank"
        ],
        answer: 1,
        explanation: "The WTO has institutional permanency, a formal court-like dispute settlement system, and expanded coverage over services (GATS) and intellectual property rights (TRIPS)."
      }
    ]
  },
  {
    id: 57,
    title: "The UN Conference on Trade and Development (UNCTAD)",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Origin, Organisation, Functions of UNCTAD, Objectives and Achievements of UNCTAD, An Appraisal of UNCTAD, Exercises"],
    summary: "Established in 1964, UNCTAD was championed by developing nations who felt that GATT favored the trade interests of wealthy industrialized countries. Under the leadership of Raul Prebisch, UNCTAD became a platform for the 'Group of 77' to demand fairer trade rules. Its achievements include the Generalized System of Preferences (GSP), which allows developing countries' exports to enter rich countries under lower tariffs without requiring reciprocal tariff cuts.",
    quiz: [
      {
        question: "The Generalized System of Preferences (GSP), championed by UNCTAD, permits:",
        options: [
          "Developing countries to charge higher tariffs on all imports",
          "Wealthy nations to grant non-reciprocal, lower tariff rates to imports from developing nations",
          "The IMF to directly set prices for agricultural exports",
          "Free capital mobility between developing nations only"
        ],
        answer: 1,
        explanation: "GSP is a non-reciprocal trade concession that gives developing countries preferential market access in advanced economies to stimulate export industrialization."
      }
    ]
  },
  {
    id: 58,
    title: "The Asian Development Bank (ADB)",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Origin, Its Objectives, Its Membership, Its Management, Its Financial Resources, Its Functions, Its Progress, India and ADB, Its Evaluation, Exercises"],
    summary: "Established in 1966 and headquartered in Manila, Philippines, the ADB is a regional developmental bank designed to foster economic growth and cooperation in Asia and the Pacific. Modeled closely on the World Bank, it is dominated by major shareholders like Japan and the United States. The ADB provides loans, technical assistance, and equity investments for infrastructure (energy, transport, urban development) and social programs in regional member nations.",
    quiz: [
      {
        question: "The Asian Development Bank (ADB) is headquartered in which city?",
        options: [
          "Tokyo, Japan",
          "Manila, Philippines",
          "Beijing, China",
          "New Delhi, India"
        ],
        answer: 1,
        explanation: "The ADB was established in 1966 with its headquarters located in Manila, Philippines."
      }
    ]
  },
  {
    id: 59,
    title: "South Asian Association for Regional Cooperation (SAARC)",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction, Objectives, Principles, General Provisions, Organisation, Co-operation with Other Organisations, SAARC Funds, Trade and Economic Co-operation, Criticisms of SAARC, Suggestions to Increase Economic Co-operation and Trade in SAARC, Appraisal of SAARC, Exercises"],
    summary: "Established in 1985, SAARC promotes regional integration and economic cooperation among South Asian countries (including India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, and Maldives). Efforts to boost trade led to the South Asian Free Trade Area (SAFTA) in 2006. However, SAARC's progress has been severely limited by political tensions between its two largest members, India and Pakistan.",
    quiz: [
      {
        question: "What has been the primary barrier to deep economic integration and trade expansion within SAARC?",
        options: [
          "A complete lack of shared borders",
          "Geopolitical and political tensions between India and Pakistan",
          "The refusal of member countries to use money",
          "A lack of any agricultural sector in the region"
        ],
        answer: 1,
        explanation: "The long-standing political rivalry between India and Pakistan has continuously gridlocked SAARC's institutional and trade integration projects."
      }
    ]
  },
  {
    id: 60,
    title: "New International Economic Order (NIEO)",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Origin, Objectives (or Features) of NIEO, Implementations of NIEO Programme, Exercises"],
    summary: "The New International Economic Order (NIEO) was a set of proposals advocated by developing countries (via the Non-Aligned Movement and G77) in the 1970s through the UN General Assembly. It demanded a structural overhaul of the global economy, including: 1) sovereign control over domestic natural resources, 2) stabilizing primary commodity prices via international regulation, 3) transferring technology to developing nations, and 4) restructuring sovereign debts and expanding voting power in the IMF and World Bank. While approved as a UN resolution in 1974, NIEO faced strong resistance from advanced Western economies and faded in influence during the 1980s.",
    quiz: [
      {
        question: "The New International Economic Order (NIEO) proposals of the 1970s primarily demanded:",
        options: [
          "The complete elimination of international trade",
          "A structural restructuring of global economic rules to favor developing nations' sovereign resource rights, debt burdens, and voting power",
          "Mandatory adoption of fixed exchange rates by all nations",
          "A global tax on internet transactions"
        ],
        answer: 1,
        explanation: "Developing nations sought to dismantle what they viewed as post-colonial economic biases in the international monetary, trade, and financial systems."
      }
    ]
  },
  {
    id: 61,
    title: "Foreign Trade and Balance of Payments in India",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction, Volume of Trade, Balance of Trade, Terms of Trade, India's Balance of Payments Position : 1951-90, Balance of Payments Developments Since 1990, India's Foreign Trade Policy, Exercises"],
    summary: "This chapter reviews India's trade trajectory. From 1951 to 1990, India pursued an inward-looking, highly protected Import-Substitution Industrialization policy with strict exchange controls and import licensing. This led to persistent BOP deficits, culminating in the 1991 Balance of Payments crisis when reserves fell to just two weeks of imports. In response, India launched structural reforms—devaluing the Rupee, slashing tariffs, removing licensing, and moving to a market-determined exchange rate, which led to high service-led export growth and a major expansion of foreign reserves.",
    quiz: [
      {
        question: "India's landmark economic reforms in 1991 were directly triggered by:",
        options: [
          "An extreme labor shortage",
          "A severe Balance of Payments crisis where foreign exchange reserves collapsed to just two weeks of imports",
          "An unexpected surplus of gold reserves",
          "A directive from the European Union"
        ],
        answer: 1,
        explanation: "The 1991 crisis forced India to pledge its gold reserves to secure IMF loans and execute sweeping liberalizing reforms to restructure its economy."
      }
    ]
  },
  {
    id: 62,
    title: "Foreign Capital in India",
    partId: 4,
    partTitle: "INTERNATIONAL ECONOMIC RELATIONS",
    topics: ["Introduction", "Government Policy Towards Foreign Capital", "Foreign Capital in India", "India's External Debt", "Impact of Foreign Capital on India's Economic Development", "Exercises"],
    summary: "This final chapter traces India's policy on foreign capital. Historically highly suspicious of foreign investment, India's policy shifted after 1991. The country opened its economy to foreign direct investment (FDI) across manufacturing, retail, and technology sectors, and foreign portfolio investment (FPI) in local capital markets. While foreign capital has bridged savings gaps, financed tech start-ups, and bolstered reserves, India carefully manages external commercial borrowings (ECB) and short-term debt limits to maintain national financial sovereignty.",
    quiz: [
      {
        question: "Following the 1991 reforms, India's policy toward foreign capital shifted from:",
        options: [
          "Complete free-trade flows to capital controls",
          "A highly restrictive, suspicious approach to an actively liberalizing approach promoting FDI and portfolio inflows under monitored thresholds",
          "Relying entirely on foreign portfolio flows to banning FDI",
          "Banning all foreign aid transfers"
        ],
        answer: 1,
        explanation: "Post-1991, India dismantled strict licensing (such as FERA) and replaced it with a modern regime (FEMA) welcoming foreign capital while guarding financial stability."
      }
    ]
  }
];
