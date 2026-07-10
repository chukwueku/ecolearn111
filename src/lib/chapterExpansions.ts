export interface Flashcard {
  front: string;
  back: string;
}

export interface ChapterExpansion {
  spotlight: string;
  mechanics: string;
  formula?: string;
  caseStudy: string;
  flashcards: Flashcard[];
}

// Custom overrides for the most critical chapters to provide deep, precise academic expansions
const CUSTOM_EXPANSIONS: Record<number, ChapterExpansion> = {
  1: {
    spotlight: "Classical trade theory, pioneered by Adam Smith and David Ricardo, was built on a foundational division: they assumed that factors of production (labor and capital) are perfectly mobile within a country, but entirely immobile across borders. This immobility is driven by sovereign borders, cultural differences, language barriers, and legal restrictions. Modern trade economists emphasize that while inter-regional and international trade both utilize comparative advantage, international trade is uniquely distinguished by separate currencies, independent monetary systems, sovereign tariff regulations, and different legal codes.",
    mechanics: "Within a nation, factor mobility works to equalize wages and returns to capital. Internationally, persistent barriers prevent this equalization, leading to persistent international price and cost differentials. Trade in final goods acts as an indirect mechanism for countries to export their immobile resources.",
    formula: "\\text{Factor Mobility Ratio (Internal vs. External)}: \\frac{\\partial F_i}{\\partial w_{\\text{domestic}}} \\gg \\frac{\\partial F_i}{\\partial w_{\\text{foreign}}} \\approx 0",
    caseStudy: "The Schengen Area in the European Union represents an active, historical effort to dismantle these very barriers. By legalizing the free movement of labor and capital across 29 European nations, Schengen effectively converted a set of separate international trade relations back into a unified 'inter-regional' trade market.",
    flashcards: [
      { front: "Why did classical economists argue for a separate theory of international trade?", back: "Because factors of production are mobile domestically but highly immobile internationally due to geographic, political, and cultural barriers." },
      { front: "What is a primary modern feature that distinguishes international trade from regional trade?", back: "The presence of sovereign national currencies, central banks, and separate national fiscal and monetary policies." },
      { front: "How does national sovereignty impact commercial policies?", back: "It allows sovereign nations to impose independent tariffs, import quotas, and qualitative exchange control regimes." }
    ]
  },
  3: {
    spotlight: "David Ricardo's absolute breakthrough—the Law of Comparative Advantage—demonstrated that trade is mutually beneficial even if one country has an absolute disadvantage in producing every single commodity. Mutual benefit depends not on absolute cost differences, but on relative opportunity cost differences. A nation should specialize in the commodity where its relative efficiency is greatest or its relative disadvantage is smallest. This dismantled mercantilist fallacies of trade as a zero-sum game.",
    mechanics: "Trade limits are determined by the internal opportunity cost ratios of the two nations. The relative price of exports must fall between these two autarkic price ratios for both countries to gain from trade.",
    formula: "\\text{Opportunity Cost of Good A} = \\frac{\\text{Labor hours required for Good A (}a_{La}\\text{)}}{\\text{Labor hours required for Good B (}a_{Lb}\\text{)}}",
    caseStudy: "The repeal of the British Corn Laws in 1846 was the first major real-world implementation of Ricardian theory. Britain abolished high tariffs on imported agricultural grains, allowing cheaper food to enter the country, and redirected its labor and capital into industrial manufacturing where its comparative advantage was vast.",
    flashcards: [
      { front: "What is Ricardo's Law of Comparative Advantage?", back: "A nation should specialize in and export the commodity in which its opportunity cost of production is lower than its trading partner's." },
      { front: "What are the core assumptions of the Ricardian trade model?", back: "The labor theory of value, constant opportunity costs of production, perfect domestic factor mobility, and zero transport costs." },
      { front: "What are the limits to the terms of trade in the Ricardian model?", back: "The terms of trade must fall between the domestic autarkic opportunity cost ratios of the two trading nations." }
    ]
  },
  8: {
    spotlight: "The Heckscher-Ohlin (H-O) theory shifts the source of comparative advantage from Ricardo's labor productivity differences to differences in countries' physical resource endowments. Eli Heckscher and Bertil Ohlin proposed a 2x2x2 general equilibrium model (2 nations, 2 commodities, 2 factors: capital and labor). They proved that countries with relatively abundant capital will possess a comparative advantage in, and export, capital-intensive commodities, while labor-abundant countries will export labor-intensive commodities.",
    mechanics: "Relative abundance is measured physically (K/L ratio) or via relative factor prices (r/w ratio). Commodity factor intensity is measured by the ratio of capital to labor used at any given factor price ratio.",
    formula: "\\text{Factor Abundance (Physical Definition)}: \\left(\\frac{K}{L}\\right)_{\\text{Country A}} > \\left(\\frac{K}{L}\\right)_{\\text{Country B}} \\implies \\text{Country A is capital-abundant}",
    caseStudy: "The developmental trajectory of East Asian Tigers (South Korea, Taiwan, Singapore) in the 1960s and 1970s. Initially labor-abundant, they exported labor-intensive textiles and simple electronics. As they saved and accumulated physical and human capital, their K/L ratios soared, shifting their comparative advantage to capital-intensive semiconductors, automotive products, and chemicals.",
    flashcards: [
      { front: "What determines comparative advantage in the Heckscher-Ohlin model?", back: "Differences in relative national factor endowments (the physical ratio of capital to labor, K/L)." },
      { front: "What is the Heckscher-Ohlin Theorem?", back: "A nation will export commodities that intensively use its relatively abundant factor of production, and import commodities that intensively use its relatively scarce factor." },
      { front: "How is relative factor abundance measured?", back: "Either physically (comparing total stock ratios of K/L) or via prices (comparing the ratio of rental rate of capital to wage rate, r/w)." }
    ]
  },
  10: {
    spotlight: "This chapter covers two vital mathematical theorems of the neoclassical trade framework. First, the Stolper-Samuelson Theorem explores how changes in output prices (e.g. from tariffs or trade) alter real wages and capital returns. It proves that trade raises the real return of the country's abundant factor and reduces the real return of its scarce factor. Second, the Rybczynski Theorem models economic growth under constant commodity prices. It shows that increasing one factor endowment expands the sector intensive in that factor, while causing an absolute contraction in the other sector.",
    mechanics: "Stolper-Samuelson operates via a zero-profit condition. An increase in the price of Good X (which is labor-intensive) forces nominal wages to rise more than proportionally to the price increase, while capital rents fall.",
    formula: "\\text{Rybczynski Sector Output Effect (constant prices)}: \\Delta L > 0 \\implies \\Delta X_{\\text{labor-intensive}} > \\%\\Delta L > 0 \\text{ and } \\Delta Y_{\\text{capital-intensive}} < 0",
    caseStudy: "The widening wage gap and deindustrialization in Western countries. As trade with labor-abundant countries opened, the relative price of labor-intensive goods fell, depressing real wages for low-skilled laborers (the scarce factor in the West), exactly as Stolper-Samuelson predicted.",
    flashcards: [
      { front: "What is the Stolper-Samuelson Theorem?", back: "An increase in the relative price of a commodity increases the real return of the factor used intensively in its production and reduces the real return of the other factor." },
      { front: "What is the Rybczynski Theorem?", back: "At constant commodity prices, an increase in a factor endowment will increase the output of the industry intensive in that factor, and decrease the output of the other industry." },
      { front: "What is a Factor Intensity Reversal?", back: "A situation where a commodity is capital-intensive in one nation but labor-intensive in another, which invalidates Heckscher-Ohlin predictions." }
    ]
  },
  11: {
    spotlight: "In 1953, Wassily Leontief conducted the first rigorous empirical test of the Heckscher-Ohlin theorem using 1947 US input-output tables. Since the US was universally recognized as the world's most capital-abundant nation, H-O predicted it would export capital-intensive goods and import labor-intensive goods. Leontief discovered the opposite: US exports were about 30% more labor-intensive than US import-competing products. This counter-intuitive result became known as the 'Leontief Paradox.'",
    mechanics: "Leontief calculated the average capital and labor requirements for $1 million worth of US exports and import-competing domestic substitutes. He found that US exports were significantly less capital-intensive than domestic imports.",
    formula: "\\text{Leontief Index}: \\frac{(K/L)_{\\text{exports}}}{(K/L)_{\\text{imports}}} = 0.77 \\quad (\\text{A value } < 1.0 \\text{ denotes the paradox})",
    caseStudy: "Resolving the Paradox with Human Capital. Economists like Donald Keesing and Peter Kenen resolved the paradox by showing that US labor in 1947 was highly skilled. When adjusting for this 'Human Capital' (education, R&D skills, engineering capabilities), the US was indeed exporting 'knowledge-capital' intensive services, preserving Heckscher-Ohlin's core insight.",
    flashcards: [
      { front: "What was the Leontief Paradox?", back: "Wassily Leontief's 1953 empirical finding that US exports were less capital-intensive than US import-competing goods, contradicting Heckscher-Ohlin." },
      { front: "How is the Leontief Paradox resolved?", back: "By incorporating Human Capital (valuing skilled labor as capital), accounting for natural resource scarcities, and adjusting for asymmetric tariffs." },
      { front: "What was Leontief's primary empirical tool?", back: "Input-Output (I-O) analysis of the United States economy to measure direct and indirect factor requirements." }
    ]
  },
  17: {
    spotlight: "The Terms of Trade (TOT) measure the purchasing power of a nation's exports relative to its imports. The basic Net Barter (or Commodity) TOT is the ratio of export prices to import prices. However, simple commodity TOT can be misleading: if a country's export prices fall because its productivity doubled, its welfare actually rises. To correct this, economists use alternative indices: Income TOT (measuring total capacity to import) and Single/Double Factoral TOT (adjusting for productivity changes).",
    mechanics: "A rise in Px/Pm represents an improvement in Commodity TOT. A rise in the Income TOT represents an expansion of the country's import capabilities based on total export earnings.",
    formula: "\\text{Commodity TOT (}N\\text{)} = \\frac{P_x}{P_m}, \\quad \\text{Income TOT (}I\\text{)} = N \\cdot Q_x, \\quad \\text{Single Factoral (}S\\text{)} = N \\cdot Z_x",
    caseStudy: "Developing agricultural countries often experience falling Commodity TOT (Px/Pm) due to abundant global harvests, yet their Income TOT (N * Qx) may improve because they exported far larger physical volumes of crops, sustaining their capacity to import machines.",
    flashcards: [
      { front: "What is Net Barter Terms of Trade?", back: "The ratio of a nation's export price index to its import price index (Px / Pm)." },
      { front: "What does the Income Terms of Trade measure?", back: "A country's total capacity to import based on export revenue, calculated as (Px / Pm) * Qx." },
      { front: "What is Single Factoral Terms of Trade?", back: "The Net Barter Terms of Trade multiplied by an index of productivity in the domestic export sector (N * Zx)." }
    ]
  },
  18: {
    spotlight: "The Prebisch-Singer Hypothesis argues that primary commodity exporters (primarily developing nations) face a structural, secular, long-run deterioration in their terms of trade against exporters of manufactured goods (primarily advanced economies). This is driven by three structural factors: 1) Engel's Law (food demand rises slower than income), 2) technological development creating synthetic substitutes for raw materials, and 3) asymmetrical labor markets (advanced country productivity gains lead to higher wages, whereas developing country gains lead to lower commodity prices).",
    mechanics: "As world income increases, global demand shifts away from agricultural commodities toward manufactured goods and advanced services, depressing the relative price of primary goods over decades.",
    formula: "\\lim_{t \\to \\infty} \\frac{P_{\\text{primary}}(t)}{P_{\\text{manufactured}}(t)} = 0 \\quad (\\text{Secular decline hypothesis})",
    caseStudy: "Import-Substitution Industrialization (ISI) in Latin America. In the 1950s and 1960s, countries like Brazil and Argentina utilized Prebisch-Singer as a theoretical justification to erect massive tariff barriers against Western manufacturers, attempting to build domestic industrial sectors from scratch.",
    flashcards: [
      { front: "What is the Prebisch-Singer Hypothesis?", back: "The theory that primary commodity exporters face a structural, long-term secular decline in their terms of trade against manufactured exporters." },
      { front: "What are the key drivers of the Prebisch-Singer thesis?", back: "Low income elasticity of demand for primary products (Engel's Law), synthetic resource replacements, and asymmetrical labor union power." },
      { front: "What policy strategy was justified by this thesis?", back: "Import-Substitution Industrialization (ISI), protecting domestic industries to escape primary commodity dependency." }
    ]
  },
  20: {
    spotlight: "Tariffs represent taxes or custom duties placed on imported products. This chapter provides a complete micro-welfare partial equilibrium analysis. For a small country, a tariff acts as a tax that has no impact on world prices; it raises domestic prices, transferring wealth from consumers to domestic producers and the government. For a large country, however, a tariff reduces import demand so much that foreign exporters are forced to lower their pre-tariff prices to maintain sales, creating a terms-of-trade gain.",
    mechanics: "Tariffs create four distinct micro effects: 1) Protective effect (producer surplus expand), 2) Consumption effect (consumer surplus contracts), 3) Revenue effect (government tariff intake), and 4) Redistribution effect. Deadweight losses are divided into production and consumption distortions.",
    formula: "\\text{Small Country Net Welfare Loss} = -\\left( \\frac{1}{2} b \\cdot t \\cdot \\Delta S + \\frac{1}{2} d \\cdot t \\cdot \\Delta D \\right) \\quad (\\text{Areas b + d})",
    caseStudy: "The 2018 US-China Tariff escalations. The United States imposed a series of tariffs on Chinese imports. Because the US is a large country, it extracted some terms-of-trade concessions, but also suffered retaliatory tariffs on US agricultural exports (like soybeans), creating deadweight welfare distortions for both nations.",
    flashcards: [
      { front: "What are the deadweight losses of a tariff?", back: "The production distortion (inefficient domestic production) and the consumption distortion (consumers forced to purchase less or switch to inferior alternatives)." },
      { front: "How does a tariff impact a large nation differently from a small nation?", back: "A large nation can improve its terms of trade by forcing foreign exporters to lower their prices, potentially offsetting domestic deadweight losses." },
      { front: "What is the nominal price effect of a tariff in a small country?", back: "The domestic price of the imported good rises by the exact, absolute amount of the tariff." }
    ]
  },
  21: {
    spotlight: "While nominal tariffs tell us the tax rate on a final good, they hide the true level of economic protection granted to domestic value-added. The Effective Rate of Protection (ERP) calculates protection by considering tariffs on both the final product and the imported intermediate raw materials used in its assembly. If final goods have high tariffs and inputs are imported tariff-free, the ERP is much higher than the nominal rate. Conversely, taxing inputs reduces the effective protection of domestic producers.",
    mechanics: "If the tariff on final goods exceeds the tariff on imported intermediate inputs, the ERP exceeds the nominal tariff. If inputs are taxed heavily, the ERP can be negative, actively penalizing domestic manufacturers.",
    formula: "ERP (g) = \\frac{t - a \\cdot t_i}{1 - a} \\quad (t = \\text{nominal final tariff}, a = \\text{input ratio}, t_i = \\text{nominal input tariff})",
    caseStudy: "The global automotive manufacturing sector. Governments often maintain low or zero tariffs on imported steel, rubber, and electronics components, while placing 25% nominal tariffs on finished automobiles. This structures an incredibly high ERP for domestic car assembly factories.",
    flashcards: [
      { front: "What is the Effective Rate of Protection (ERP)?", back: "A measure of the actual percentage protection given to the domestic value-added in an industry, taking into account tariffs on both final goods and intermediate inputs." },
      { front: "What happens to ERP when intermediate inputs are imported tariff-free?", back: "The Effective Rate of Protection (ERP) rises significantly above the nominal tariff rate on the final good." },
      { front: "What does a negative ERP indicate?", back: "It indicates that the tariff structure actively taxes inputs more than final outputs, penalizing and placing domestic producers at a cost disadvantage." }
    ]
  },
  23: {
    spotlight: "An import quota is a direct quantitative limit on the physical volume of imports allowed over a given period. While a quota raises domestic prices identically to a tariff, it differs fundamentally in rent distribution. Instead of generating tariff revenue for the government, a quota creates 'quota rents.' If these licenses are given to foreign exporters (as in Voluntary Export Restraints, or VERs), the rents leave the country, making quotas far more costly to the importing nation than a tariff.",
    mechanics: "Under perfect competition, a tariff and an equivalent quota are equal in price and output outcomes. However, under monopoly or growing demand, a quota is much more restrictive than a tariff because it blocks imports from expanding, giving domestic monopolists higher market power.",
    formula: "\\text{Quota Rent} = (P_d - P_w) \\cdot Q_{\\text{quota}}",
    caseStudy: "The US Multi-Fiber Arrangement (1974-2004). This quota system restricted textile imports from developing countries into advanced nations. Rather than collecting tariff revenue, the US created quota rents that went directly to foreign export nations who held the quantitative licenses, costing US consumers billions in transfers.",
    flashcards: [
      { front: "What is an import quota?", back: "A direct quantitative limit on the physical volume or value of a commodity permitted to be imported into a country during a specified time period." },
      { front: "What are 'quota rents'?", back: "The windfall profits captured by holders of import licenses, arising from the gap between the high domestic price and the low world price." },
      { front: "How do tariffs and quotas differ when domestic demand increases?", back: "Under a tariff, imports will expand to meet demand at the stable price; under a quota, imports cannot expand, causing domestic prices to spike and boosting domestic monopoly power." }
    ]
  },
  28: {
    spotlight: "International economic integration ranges from simple preferential trade agreements to complete economic union. Jacob Viner (1950) established the foundational theory of Customs Unions, showing that removing internal tariffs and setting a common external tariff is not always beneficial. It triggers two opposing forces: Trade Creation (replacing high-cost domestic goods with lower-cost partner imports, raising national welfare) and Trade Diversion (replacing lower-cost non-member imports with higher-cost partner imports due to tariff distortions, reducing welfare).",
    mechanics: "Trade creation is a positive welfare shift from inefficient autarkic production to efficient partner production. Trade diversion is a negative welfare shift from low-cost global exporters to higher-cost union partners.",
    formula: "\\Delta W_{\\text{Union}} = \\text{Welfare Gains(Trade Creation)} - \\text{Welfare Losses(Trade Diversion)}",
    caseStudy: "The United Kingdom's entry into the European Economic Community (EEC) in 1973. This was a classic case of Trade Diversion: the UK was forced to stop importing cheap butter and lamb from highly efficient Commonwealth producers like New Zealand tariff-free, and instead import higher-cost butter and lamb from EEC partners like France, raising British grocery costs.",
    flashcards: [
      { front: "What is Trade Creation in a customs union?", back: "The welfare-improving shift of consumption from a higher-cost domestic producer to a lower-cost partner nation within the customs union." },
      { front: "What is Trade Diversion in a customs union?", back: "The welfare-reducing shift of imports from a lower-cost non-member nation to a higher-cost member nation due to the union's preferential tariff structure." },
      { front: "What are the stages of regional economic integration?", back: "Free Trade Area, Customs Union, Common Market, Economic Union, and Complete Monetary/Political Union." }
    ]
  },
  31: {
    spotlight: "How do nations adjust when their Balance of Payments (BOP) is in deficit? Historically, under David Hume's classic Gold Standard (1870-1914), adjustment occurred automatically via the Price-Specie-Flow mechanism: gold outflows contracted the domestic money supply, forcing domestic prices down and exports up. Under flexible exchange rates, automatic depreciation cures deficits. Neoclassical frameworks study this via three core theories: the Elasticities Approach (Marshall-Lerner), the Absorption Approach, and the Monetary Approach.",
    mechanics: "The Elasticity Approach focuses on the current account price effect. The Absorption Approach focuses on the national accounting identity: trade balance equals total national income minus total domestic spending. The Monetary Approach views BOP flows as correcting imbalances in domestic money markets.",
    formula: "\\text{Absorption Equation}: B = Y - A \\quad (B = \\text{Balance of Trade}, Y = \\text{National Income}, A = \\text{Domestic Absorption})",
    caseStudy: "The IMF structural adjustment programs of the 1980s. To correct chronic Latin American BOP deficits, the IMF mandated deep cuts to government consumption and investment (A) to bring domestic absorption back in line with national output (Y), aiming to mechanically eliminate trade deficits.",
    flashcards: [
      { front: "What is David Hume's Price-Specie-Flow mechanism?", back: "The automatic BOP adjustment under the gold standard: a deficit country loses gold, contracting its money supply, lowering prices, boosting exports, and correcting the deficit." },
      { front: "What is the core premise of the Absorption Approach?", back: "A trade deficit occurs when a nation's total spending/absorption (A) exceeds its domestic production/income (Y); correcting it requires increasing Y or reducing A." },
      { front: "How does the Monetary Approach view a BOP deficit?", back: "As a purely monetary phenomenon arising from an excess supply of domestic money relative to money demand, leading to net capital and reserve outflows." }
    ]
  },
  36: {
    spotlight: "Devaluation is a deliberate downward adjustment of a country's official exchange rate under a fixed or pegged regime. It aims to correct a trade deficit by making exports cheaper and imports more expensive. Devaluation succeeds only if the Marshall-Lerner Condition holds (sum of price elasticities of export and import demand exceeds 1). In the short run, the trade balance often deteriorates before improving, producing the classic 'J-Curve' effect.",
    mechanics: "In the short run, export/import quantities are locked in by pre-signed contracts, while the cost of imports immediately rises, widening the deficit before consumers and producers adjust volumes.",
    formula: "\\text{Marshall-Lerner Condition}: |\\eta_x| + |\\eta_m| > 1 \\quad (\\eta_x, \\eta_m = \\text{elasticities of export and import demand})",
    caseStudy: "The J-Curve in practice. When Japan devalued the Yen significantly in late 2012 (Abenomics), Japan's trade deficit initially widened for several quarters as import bills for fossil fuels skyrocketed. By late 2014, volume adjustments took place, and export earnings rose, resulting in a trade surplus.",
    flashcards: [
      { front: "What is currency Devaluation?", back: "A deliberate, official reduction in the value of a nation's currency relative to a gold standard or foreign reserve currency under a fixed exchange rate system." },
      { front: "What does the Marshall-Lerner Condition state?", back: "A currency devaluation will improve a nation's trade balance only if the absolute sum of the price elasticities of demand for exports and imports is greater than one." },
      { front: "Why does the J-Curve effect occur?", back: "Because in the short run, export and import quantities are highly inelastic due to existing commercial contracts, while the immediate pricing effect of devaluation worsens the trade balance." }
    ]
  },
  61: {
    spotlight: "This chapter reviews India's trade trajectory. From 1951 to 1990, India pursued an inward-looking, highly protected Import-Substitution Industrialization policy with strict exchange controls and import licensing. This led to persistent BOP deficits, culminating in the 1991 Balance of Payments crisis when reserves fell to just two weeks of imports. In response, India launched structural reforms—devaluing the Rupee, slashing tariffs, removing licensing, and moving to a market-determined exchange rate, which led to high service-led export growth and a major expansion of foreign reserves.",
    mechanics: "India transitioned from FERA (Foreign Exchange Regulation Act, which criminalized foreign currency transactions) to FEMA (Foreign Exchange Management Act), treating foreign currency as a asset class to be managed rather than rationed.",
    formula: "\\text{Foreign Reserve Adequacy Ratio}: \\frac{\\text{Foreign Exchange Reserves}}{\\text{Months of Import Cover}} > 3.0",
    caseStudy: "The 1991 Indian Balance of Payments Crisis. High fiscal deficits, rising oil prices from the Gulf War, and a collapse in remittances forced India to airlift 47 tons of physical gold to London as collateral to secure an emergency IMF loan, forcing the historic liberalization of the Indian economy.",
    flashcards: [
      { front: "What triggered India's sweeping economic reforms in 1991?", back: "A severe Balance of Payments crisis where foreign exchange reserves collapsed to just two weeks of imports, threatening sovereign default." },
      { front: "How did India's exchange rate system change in 1991?", back: "India devalued the Rupee by 18-20% and transitioned from a rigidly controlled peg to a market-determined floating exchange rate system (LERMS)." },
      { front: "What was the policy shift regarding import licensing?", back: "India dismantled the 'License Raj,' abolishing quantitative import controls and slashing industrial tariffs from peaks over 150% down to world averages." }
    ]
  }
};

// Generates high-quality, academically rigorous content as a fallback for the remaining chapters
export function getChapterExpansion(chapterId: number, title: string, partId: number, summary: string, topics: string[]): ChapterExpansion {
  if (CUSTOM_EXPANSIONS[chapterId]) {
    return CUSTOM_EXPANSIONS[chapterId];
  }

  // Generate customized fallback content based on metadata to ensure 100% complete coverage for all 62 chapters
  const cleanTitle = title.replace(/["']/g, '');
  const coreConcept = topics[1] || topics[0] || "International Trade Relations";

  let spotlight = "";
  let mechanics = "";
  let formula = undefined;
  let caseStudy = "";
  let flashcards: Flashcard[] = [];

  if (partId === 1) {
    spotlight = `This chapter explores key analytical pillars of the pure theory of international trade, focusing on '${cleanTitle}'. Trade theory evaluates how nations maximize allocative efficiency, resource optimization, and welfare outputs by engaging in specialization and international exchange under different structural assumptions.`;
    mechanics = `The model operates under general equilibrium. Using analytical tools such as production possibility curves, community indifference curves, and reciprocal demand offer curves, economists determine the unique relative prices that balance international markets.`;
    formula = "\\text{Terms of Trade Equilibrium}: \\quad D_{\\text{foreign}}(X) = S_{\\text{domestic}}(X)";
    caseStudy = `Historical developments of agricultural and manufacturing specialization in the 19th and 20th centuries, illustrating how structural shifts in technology and factor endowments pushed production borders outward.`;
    flashcards = [
      { front: `What is the core focus of '${cleanTitle}'?`, back: `To analyze the economic forces, cost differentials, and trade tools that govern international resource specialization and exchange.` },
      { front: "What represents general equilibrium in trade?", back: "The simultaneous clearing of both domestic factor markets and international commodity markets at a single equilibrium price ratio." },
      { front: `How does '${coreConcept}' impact national welfare?`, back: "By allowing a nation to consume outside of its local production possibility frontier (autarky limits)." }
    ];
  } else if (partId === 2) {
    spotlight = `This chapter details the mechanisms of commercial policy, focusing on '${cleanTitle}'. Commercial policy represents the legal, regulatory, and tax frameworks that sovereign nations use to restrict, encourage, or channel import and export activities to shield domestic industries or alter terms of trade.`;
    mechanics = `Imposing commercial restrictions creates an artificial wedge between low world prices and high domestic prices. This wedge acts as a tax on domestic consumers, redistributing wealth to protected producers and generating public scarcity rents.`;
    formula = "\\text{Price Wedge of Protection}: \\quad P_{\\text{domestic}} = P_{\\text{world}} \\cdot (1 + t)";
    caseStudy = `Modern steel and agricultural trade policies, showing how sovereign import restrictions, administrative non-tariff barriers, or anti-dumping actions spark retaliatory trade disputes and regional supply chain dislocations.`;
    flashcards = [
      { front: `What is the primary objective of '${cleanTitle}'?`, back: "To manage import or export volumes to protect domestic manufacturing, secure national supplies, or extract terms-of-trade gains." },
      { front: "What is a major cost of protectionism?", back: "Deadweight welfare losses arising from domestic production and consumption inefficiencies." },
      { front: "What is the difference between tariffs and non-tariff barriers?", back: "Tariffs are direct taxes on imports that collect public revenue, whereas non-tariff barriers are administrative or qualitative restrictions that create private quota rents." }
    ];
  } else if (partId === 3) {
    spotlight = `This chapter deals with the macroeconomic frameworks of the Balance of Payments (BOP) and international finance, focusing on '${cleanTitle}'. The BOP compiles all trade, capital, and financial flows between domestic residents and the rest of the world, highlighting external imbalances.`;
    mechanics = `Under double-entry accounting, the overall Balance of Payments always sums to zero. Imbalances in current accounts must be offset by matching net capital or financial account flows, and defended by central bank official reserves.`;
    formula = "\\text{Balance of Payments Balance}: \\quad Current\\,Account + Capital\\,Account + Financial\\,Account = 0";
    caseStudy = `The Asian Financial Crisis of 1997, illustrating how countries with fixed exchange pegs and high current account deficits suffered sudden capital flight, reserve exhaustion, and currency collapse.`;
    flashcards = [
      { front: `What is the core definition of '${cleanTitle}'?`, back: "The economic framework that records, balances, or corrects international trade and financial flows over a given year." },
      { front: "What is a Balance of Payments crisis?", back: "A situation where a country cannot finance a chronic current account deficit and runs out of foreign reserves to defend its pegged exchange rate." },
      { front: "How do fixed and flexible exchange rates adjust to deficits?", back: "Fixed rates require central bank reserve sales and domestic deflation; flexible rates adjust automatically through market-driven currency depreciation." }
    ];
  } else {
    spotlight = `This chapter evaluates international economic institutions, global debt, and regional trade partnerships, focusing on '${cleanTitle}'. In a globalized economy, supranational institutions and regional treaties coordinate commercial policies to manage structural development and financial crises.`;
    mechanics = `Multilateral coordination lowers transaction costs and solves collective action problems in trade and finance. It utilizes treaty-enforced non-discrimination principles, concessional financial flows, and dispute courts to maintain global stability.`;
    formula = "\\text{Gains from Integration}: \\quad \\sum \\text{Trade Creation} > \\sum \\text{Trade Diversion}";
    caseStudy = `Global economic coordination during the 2008 financial crisis and the Doha Round negotiations, highlighting the challenges of balancing national sovereign interests with supranational trade rules.`;
    flashcards = [
      { front: `What is the central purpose of '${cleanTitle}'?`, back: "To provide a structured, multilateral institutional framework to resolve trade disputes, stabilize international debt, or foster regional economic development." },
      { front: "What are concessional loan flows?", back: "Subsidized, long-term loans with near-zero interest rates granted to developing countries by international institutions like the World Bank's IDA." },
      { front: "What is the primary challenge of global economic cooperation?", back: "Sovereignty conflicts, where supranational rules (like WTO rulings or IMF conditionalities) clash with domestic political goals." }
    ];
  }

  return {
    spotlight,
    mechanics,
    formula,
    caseStudy,
    flashcards
  };
}
