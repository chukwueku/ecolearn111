import { isDuplicateQuestion } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL || "";
const clientApiKey = (process.env.GEMINI_API_KEY as string) || '';

export const generateStudyGuide = async (topicTitle: string, level: string, description: string) => {
  try {
    if (API_BASE) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${API_BASE}/api/generateStudyGuide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicTitle, level, description }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data.result) return data.result;
      }
    }
    
    // Direct Gemini fallback if server is unreachable or in mobile APK
    if (clientApiKey) {
      const prompt = `You are a world-class Economics professor. Generate a comprehensive study guide for a ${level} student on the topic: "${topicTitle}". Description: ${description}. Format in Markdown with LaTeX math.`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${clientApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    }
    return "Failed to generate study guide. Please try again later.";
  } catch (error) {
    console.error("Study Guide Generation Error:", error);
    return "Failed to generate study guide. Please try again later.";
  }
};

const generateOfflineQuestions = (topicTitle: string, level: string, count: number = 5, exclude: string[] = []) => {
  const isSecondary = level === 'secondary' || level === 'secondary-ss2' || level === 'secondary-ss3' || (typeof level === 'string' && level.startsWith('secondary'));

  const secondaryTemplates = [
    {
      q: () => "Which of the following best defines opportunity cost in economics?",
      opts: [
        "The next best alternative forgone when a choice is made",
        "The total monetary expenditure incurred on goods",
        "The accounting cost recorded in a company's ledger",
        "The market price officially established by the government"
      ],
      ans: 0,
      exp: "Opportunity cost is the real cost of satisfying a want, expressed in terms of the next best alternative sacrificed."
    },
    {
      q: () => "A movement along a demand curve occurs when:",
      opts: [
        "The price of the commodity itself changes",
        "Consumers' disposable income increases",
        "The prices of substitute goods rise",
        "Consumer tastes and preferences shift"
      ],
      ans: 0,
      exp: "Only a change in the price of the commodity itself causes a movement along its demand curve (expansion or contraction in quantity demanded)."
    },
    {
      q: () => "If a 10% rise in the price of a good results in a 20% decline in quantity demanded, the price elasticity of demand is:",
      opts: [
        "Elastic (\\( E_d = 2.0 \\))",
        "Inelastic (\\( E_d = 0.5 \\))",
        "Unitary elastic (\\( E_d = 1.0 \\))",
        "Perfectlys inelastic (\\( E_d = 0 \\))"
      ],
      ans: 0,
      exp: "Price elasticity of demand = \\( \\frac{\\% \\Delta Q}{\\% \\Delta P} = \\frac{20\\%}{10\\%} = 2.0 \\). Because \\( E_d > 1 \\), demand is elastic."
    },
    {
      q: () => "According to the law of diminishing marginal utility, as additional units of a commodity are consumed:",
      opts: [
        "The extra satisfaction derived from each successive unit decreases",
        "Total utility decreases continuously from the very first unit",
        "Marginal utility increases steadily until satiety is achieved",
        "Total utility always equals average utility"
      ],
      ans: 0,
      exp: "The law of diminishing marginal utility states that as a consumer consumes successive units of a good, marginal utility (additional satisfaction) declines."
    },
    {
      q: () => "In production economics, a major limitation to the division of labour is:",
      opts: [
        "The extent of the market and volume of demand",
        "The rate of personal income taxation",
        "The presence of registered trade unions",
        "The availability of commercial bank overdrafts"
      ],
      ans: 0,
      exp: "Adam Smith identified that division of labour and specialization are fundamentally limited by the extent of the market."
    },
    {
      q: () => "Which of the following functions of a Central Bank distinguishes it from Commercial Banks?",
      opts: [
        "Acting as lender of last resort and issuing legal tender",
        "Accepting demand deposits from retail customers",
        "Granting overdraft facilities to private individuals",
        "Opening current and savings accounts for traders"
      ],
      ans: 0,
      exp: "Only the Central Bank issues legal tender currency and serves as the lender of last resort to commercial banks and banker to the government."
    },
    {
      q: () => "Commercial banks create credit and expand the money supply primarily through:",
      opts: [
        "Granting loans and advances by crediting customer deposit accounts",
        "Printing new paper currency and minting coins",
        "Collecting direct income taxes on behalf of the state",
        "Fixing the national statutory minimum wage rate"
      ],
      ans: 0,
      exp: "Commercial banks create credit by granting loans and advances which generate new customer deposits within the banking system."
    },
    {
      q: () => "In banking, liquidity of a commercial bank refers to its ability to:",
      opts: [
        "Convert its assets into cash quickly to meet depositors' cash withdrawal demands",
        "Maximize annual dividend distribution to its shareholders",
        "Eliminate all interest expenses paid on savings deposits",
        "Operate without maintaining cash reserves with the Central Bank"
      ],
      ans: 0,
      exp: "Bank liquidity is the ease and speed with which a financial institution can convert assets into cash to satisfy withdrawal requests from depositors."
    },
    {
      q: () => "A tax system where higher-income earners pay a higher percentage of their income than lower-income earners is known as a:",
      opts: [
        "Progressive tax",
        "Regressive tax",
        "Proportional tax",
        "Specific excise duty"
      ],
      ans: 0,
      exp: "A progressive tax charges an increasing percentage rate as taxable income rises, helping reduce income inequality."
    },
    {
      q: () => "Gross Domestic Product (GDP) differs from Gross National Product (GNP) by:",
      opts: [
        "Net factor income from abroad",
        "Depreciation of fixed capital assets",
        "Government transfer payments",
        "Undistributed corporate profits"
      ],
      ans: 0,
      exp: "GNP equals GDP plus Net Factor Income from Abroad (NFIA)."
    },
    {
      q: () => "According to the principle of comparative advantage, international trade between two nations is mutually beneficial if:",
      opts: [
        "Each nation specializes in the production of the good in which its opportunity cost is lower",
        "One nation has an absolute cost advantage in all commodities",
        "Both nations impose identical protective tariff barriers",
        "Both nations have identical factor endowments and technology"
      ],
      ans: 0,
      exp: "David Ricardo's law of comparative advantage shows mutual trade gains arise when each nation specializes according to lower opportunity cost."
    },
    {
      q: () => "Cost-push inflation in an economy is primarily caused by:",
      opts: [
        "Increases in the costs of production inputs such as wages and raw materials",
        "Excessive growth in the aggregate money supply relative to real output",
        "Persistent balance of payments surpluses in external trade",
        "Substantial reductions in indirect sales and excise taxes"
      ],
      ans: 0,
      exp: "Cost-push inflation occurs when production input costs (wages, raw materials, fuel) rise, shifting the aggregate supply curve upward and raising price levels."
    },
    {
      q: () => "When a government legally imposes a maximum price (price ceiling) below the market equilibrium price, the immediate consequence is:",
      opts: [
        "Excess demand resulting in shortages and black markets",
        "Excess supply resulting in unsellable surpluses",
        "An immediate drop in consumer purchasing power",
        "A rightward shift of the market supply curve"
      ],
      ans: 0,
      exp: "A price ceiling set below equilibrium makes quantity demanded exceed quantity supplied, creating shortages."
    },
    {
      q: () => "Money serves as a standard of deferred payments when it is used to:",
      opts: [
        "State debts and settle future credit transactions",
        "Store purchasing power safely over extended periods",
        "Express the relative values and prices of different commodities",
        "Overcome the problem of double coincidence of wants in barter"
      ],
      ans: 0,
      exp: "As a standard of deferred payments, money enables goods to be bought on credit and debts to be scheduled and settled in the future."
    }
  ];

  const undergraduateTemplates = [
    {
      q: (t: string) => `In advanced models of ${t}, given a utility function \\( U(x,y) = x^\\alpha y^{1-\\alpha} \\) subject to budget constraint \\( P_x x + P_y y = I \\), what is the optimal Marshallian demand for good \\( x \\)?`,
      opts: [
        "\\( x^* = \\frac{\\alpha I}{P_x} \\)",
        "\\( x^* = \\frac{(1-\\alpha) I}{P_y} \\)",
        "\\( x^* = \\frac{P_x I}{\\alpha} \\)",
        "\\( x^* = \\frac{I}{P_x + P_y} \\)"
      ],
      ans: 0,
      exp: "For a Cobb-Douglas utility function \\( U = x^\\alpha y^{1-\\alpha} \\), consumer optimization yields fixed budget shares \\( \\alpha \\), leading to Marshallian demand \\( x^* = \\frac{\\alpha I}{P_x} \\)."
    },
    {
      q: (t: string) => `When evaluating ${t}, under the Gauss-Markov theorem for Ordinary Least Squares (OLS) regression \\( Y_i = \\beta_0 + \\beta_1 X_i + \\varepsilon_i \\), what condition ensures OLS estimators are Best Linear Unbiased Estimators (BLUE)?`,
      opts: [
        "Homoskedasticity and zero conditional mean of errors: \\( E[\\varepsilon_i | X_i] = 0 \\) and \\( Var(\\varepsilon_i | X_i) = \\sigma^2 \\)",
        "Multicollinearity among independent regressors",
        "Heteroskedastic error variance correlated with time \\( t \\)",
        "Endogeneity between regressors and the disturbance term"
      ],
      ans: 0,
      exp: "The Gauss-Markov theorem proves OLS estimators achieve minimum variance among linear unbiased estimators when errors have zero conditional mean, homoskedastic variance, and no autocorrelation."
    },
    {
      q: (t: string) => `In game theory applied to ${t}, consider a symmetric two-player matrix game with payoffs. A strategy profile \\( (s_1^*, s_2^*) \\) constitutes a pure-strategy Nash Equilibrium if and only if:`,
      opts: [
        "\\( u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*) \\) for all \\( s_i \\in S_i \\) and for all players \\( i \\)",
        "The sum of payoffs for both players strictly equals zero",
        "Both players choose strictly dominated strategies",
        "Player 1 maximizes total social revenue while Player 2 minimizes variance"
      ],
      ans: 0,
      exp: "A Nash Equilibrium requires that no player can unilaterally deviate to an alternative strategy and achieve a strictly higher payoff given the opponent's strategy."
    },
    {
      q: (t: string) => `In macroeconomic analysis of ${t}, according to the Solow-Swan growth model with production function \\( Y = F(K, L) = K^\\alpha L^{1-\\alpha} \\), what is the steady-state capital-labor ratio \\( k^* \\) when capital depreciation rate is \\( \\delta \\), population growth rate is \\( n \\), and saving rate is \\( s \\)?`,
      opts: [
        "\\( k^* = \\left( \\frac{s}{n + \\delta} \\right)^{\\frac{1}{1-\\alpha}} \\)",
        "\\( k^* = \\frac{s \\cdot n}{\\delta} \\)",
        "\\( k^* = (s + n + \\delta)^{\\alpha} \\)",
        "\\( k^* = \\frac{1-\\alpha}{s(n+\\delta)} \\)"
      ],
      ans: 0,
      exp: "In steady state, investment equals effective depreciation: \\( s k^\\alpha = (n + \\delta) k \\), which yields \\( k^* = \\left( \\frac{s}{n + \\delta} \\right)^{\\frac{1}{1-\\alpha}} \\)."
    },
    {
      q: (t: string) => `In microeconomic analysis of ${t}, what does the Slutsky equation decompose the total price effect \\( \\frac{\\partial x_i}{\\partial p_i} \\) into?`,
      opts: [
        "Substitution effect \\( \\left( \\frac{\\partial x_i}{\\partial p_i} \\right)_U \\) minus income effect \\( x_i \\frac{\\partial x_i}{\\partial I} \\)",
        "Marginal revenue minus marginal cost",
        "Inflationary gap plus real GDP growth",
        "Consumer surplus plus producer surplus"
      ],
      ans: 0,
      exp: "The Slutsky decomposition states: \\( \\frac{\\partial x_i}{\\partial p_i} = \\left( \\frac{\\partial x_i}{\\partial p_i} \\right)_{hicksian} - x_i \\frac{\\partial x_i}{\\partial I} \\)."
    },
    {
      q: (t: string) => `Under ${t}, in a monopoly setting facing demand curve \\( P(Q) = a - bQ \\) with constant marginal cost \\( MC = c \\), what is the profit-maximizing output level \\( Q^* \\)?`,
      opts: [
        "\\( Q^* = \\frac{a - c}{2b} \\)",
        "\\( Q^* = \\frac{a - c}{b} \\)",
        "\\( Q^* = \\frac{a + c}{2b} \\)",
        "\\( Q^* = \\frac{2a - c}{b} \\)"
      ],
      ans: 0,
      exp: "Monopoly sets Marginal Revenue equal to Marginal Cost: \\( MR = a - 2bQ = c \\implies Q^* = \\frac{a - c}{2b} \\)."
    },
    {
      q: (t: string) => `In international trade theory for ${t}, the Heckscher-Ohlin model predicts that a country will export goods that:`,
      opts: [
        "Intensively use its abundant factor of production",
        "Have the highest tariff rate imposed by trading partners",
        "Are produced strictly under absolute advantage regardless of factor endowments",
        "Rely exclusively on non-renewable natural resources"
      ],
      ans: 0,
      exp: "The Heckscher-Ohlin theorem states that a capital-abundant nation exports capital-intensive goods, while a labor-abundant nation exports labor-intensive goods."
    }
  ];

  const pool = isSecondary ? secondaryTemplates : undergraduateTemplates;
  const nonDupPool = pool.filter(tmpl => !isDuplicateQuestion(tmpl.q(topicTitle), exclude));
  const candidatePool = nonDupPool.length > 0 ? nonDupPool : pool;
  const shuffled = [...candidatePool].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }).map((_, i) => {
    const tmpl = shuffled[i % shuffled.length];
    return {
      question: `${tmpl.q(topicTitle)}`,
      options: tmpl.opts,
      correctAnswer: tmpl.ans,
      explanation: tmpl.exp
    };
  });
};

export const generateQuestions = async (topicTitle: string, level: string, count: number = 5, exclude: string[] = []) => {
  const isSecondary = level === 'secondary' || level === 'secondary-ss2' || level === 'secondary-ss3' || (typeof level === 'string' && level.startsWith('secondary'));

  if (API_BASE) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${API_BASE}/api/generateQuestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicTitle, level, count, exclude }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.questions && data.questions.length > 0) {
            return data.questions;
          }
        } catch (e) {
          console.error("JSON parse error:", e);
        }
      }
    } catch (error) {
      console.warn("API Fetch unavailable, falling back to direct or offline generator:", error);
    }
  }

  // Direct client Gemini fallback (e.g. mobile APK or standalone client)
  if (clientApiKey) {
    try {
      const promptExcludes = (exclude || []).slice(0, 80);
      const excludeNotice = promptExcludes.length > 0
        ? ` STRICT NO-DUPLICATION REQUIREMENT: Under NO circumstances repeat or closely rephrase any of these existing questions:\n${JSON.stringify(promptExcludes)}.`
        : '';

      const directPrompt = isSecondary
        ? `You are an expert Chief Examiner for Senior Secondary School Economics specializing in WASSCE and JAMB curricula. Generate exactly ${count} authentic multiple-choice questions for secondary school students (${level}) on: "${topicTitle}". CRITICAL RULES: 1. DO NOT mention "WASSCE", "WAEC", or "JAMB" anywhere in the question text or options. 2. DO NOT echo, prefix, or repeat the topic title in the question stem. Start directly with the question. 3. Under NO circumstances generate undergraduate, graduate, calculus, or econometrics questions. Restrict solely to high school syllabus.${excludeNotice} Output raw JSON array of objects: [{"question":"string","options":["string","string","string","string"],"correctAnswer":0,"explanation":"string"}]. No code blocks.`
        : `You are an experienced Economics professor. Generate exactly ${count} multiple-choice questions for a ${level} student on: "${topicTitle}". DO NOT echo or include the topic title in the question stem.${excludeNotice} Format as raw JSON array: [{"question":"string","options":["string","string","string","string"],"correctAnswer":0,"explanation":"string"}]. No code blocks.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${clientApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: directPrompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const clean: any[] = [];
            for (const q of parsed) {
              if (!isDuplicateQuestion(q, [...exclude, ...clean])) {
                clean.push(q);
              }
            }
            if (clean.length > 0) {
              return clean;
            }
          }
        }
      }
    } catch (directErr) {
      console.warn("Direct Gemini question generation failed, using offline templates:", directErr);
    }
  }

  // Seamless fallback for offline mode / unreachable backend
  return generateOfflineQuestions(topicTitle, level, count, exclude);
};

export const extractQuestionsFromPdf = async (pdfBase64: string, level: string, count: number = 5) => {
  try {
    const response = await fetch(`${API_BASE}/api/extractFromPdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfBase64, level, count }),
    });
    if (response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.questions && data.questions.length > 0) {
          return data.questions;
        }
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }
  } catch (error) {
    console.warn("API Fetch unavailable, using fallback question generator:", error);
  }

  return generateOfflineQuestions("Uploaded Material", level, count);
};

export const generateDailyChallengeBatch = async (courses: string[], count: number = 10, level: string = 'undergraduate', exclude: string[] = []) => {
  try {
    const response = await fetch(`${API_BASE}/api/generateDailyChallengeBatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courses, count, level, exclude }),
    });
    if (response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.questions && data.questions.length > 0) {
          return data.questions;
        }
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }
  } catch (error) {
    console.warn("API Fetch unavailable, using fallback question generator:", error);
  }

  return generateOfflineQuestions("Daily Challenge", level, count);
};
