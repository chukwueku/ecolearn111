import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const app = express();
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(express.json({ limit: "50mb" }));
  
  const httpServer = createServer(app);
  
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined.");
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  const withRetry = async (fn: () => Promise<any>, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        const isRetryable = error?.status === 503 || error?.status === 429 || error?.code === 503 || error?.code === 429 || error?.status === "UNAVAILABLE" || error?.status === "RESOURCE_EXHAUSTED";
        if (isRetryable && i < maxRetries - 1) {
          console.log(`Retrying API call (attempt ${i + 1})...`);
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          continue;
        }
        throw error;
      }
    }
  };
  
  const generateWithModelFallback = async (ai: GoogleGenAI, payload: any) => {
    const modelsToTry = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"];
    let lastError: any = null;
    for (const modelName of modelsToTry) {
      try {
        return await withRetry(() => ai.models.generateContent({
          ...payload,
          model: modelName
        }));
      } catch (error: any) {
        console.warn(`Gemini model '${modelName}' call failed, attempting fallback model:`, error?.message || error);
        lastError = error;
      }
    }
    throw lastError;
  };

  app.post("/api/generateStudyGuide", async (req, res) => {
    const { topicTitle, level, description } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });
    
    const prompt = `You are a world-class, elite university Economics professor. Generate a brilliant, comprehensive study guide for a ${level} student on the topic: "${topicTitle}". 
Description: ${description}

Format the output strictly in Markdown and follow this precise 5-phase pedagogical structure:

## 1. The Hook
Start with a highly engaging, tangible real-world hook (e.g., "Imagine the central bank just printed a trillion dollars..." or a brief historical anecdote) that immediately grabs the student's attention and illustrates why this topic matters.

## 2. Core Economic Principles
Provide bulleted, punchy explanations of the fundamental theory. Define key terms clearly and professionally.

## 3. Mathematical Intuition (Required)
You MUST include the relevant mathematical models, formulas, or equations that underpin this topic. Break down what each variable means step-by-step.
- Mathematical expressions MUST be formatted in LaTeX using \\( ... \\) for inline math and \\[ ... \\] for block math. Ensure all LaTeX commands (like \\frac, \\Delta, \\epsilon) are correctly formatted with a single backslash as per standard LaTeX.

## 4. Real-World Case Study
Provide a specific, historical or modern real-world application (e.g., Hyperinflation in Zimbabwe, Tech Monopoly pricing, the 2008 Financial Crisis) where this theory was put into practice. 

## 5. Visual Flow (Mermaid Diagram)
Include a Mermaid.js diagram (e.g., a flowchart, a circular flow diagram, or relationship map) that visually summarizes the concept. Use \`\`\`mermaid syntax.

Make the tone deeply educational, intellectually stimulating, and perfectly tailored to a ${level} level.`;

    try {
      const response = await generateWithModelFallback(ai, { contents: prompt });
      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let status = typeof error?.status === 'number' ? error.status : 500;
      if (error?.status === "UNAVAILABLE" || error?.code === 503) status = 503;
      if (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) status = 429;
      const message = status === 503 ? "Gemini API is currently overloaded. Please try again in a moment." : "Failed to generate study guide";
      res.status(status).json({ error: message });
    }
  });
  
  const normText = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();

  const deduplicateQuestions = (rawQuestions: any[], excludeList: string[] = []) => {
    const normExcludes = new Set((excludeList || []).map(e => normText(e)).filter(Boolean));
    const seenInBatch = new Set<string>();
    const filtered: any[] = [];

    for (const q of rawQuestions) {
      if (!q || !q.question) continue;
      const n = normText(q.question);
      if (!n) continue;

      let isDup = normExcludes.has(n) || seenInBatch.has(n);
      if (!isDup && n.length > 25) {
        for (const ex of normExcludes) {
          if (n.includes(ex) || ex.includes(n)) {
            isDup = true;
            break;
          }
        }
      }

      if (!isDup) {
        seenInBatch.add(n);
        filtered.push(q);
      } else {
        console.log("Server deduplication filtered out duplicate question:", q.question);
      }
    }

    return filtered;
  };

  app.post("/api/generateQuestions", async (req, res) => {
    const { topicTitle, level, count: requestedCount, exclude } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });

    const isSecondary = level === 'secondary' || level === 'secondary-ss2' || level === 'secondary-ss3' || (typeof level === 'string' && level.startsWith('secondary'));
    const totalNeeded = Math.min(Math.max(Number(requestedCount) || 5, 1), 500);
    const excludeList = Array.isArray(exclude) ? [...exclude] : [];
    const allQuestions: any[] = [];
    const chunkSize = 10; // Generate in reliable chunks of 10 to prevent JSON truncation/timeouts

    try {
      let attemptsWithoutProgress = 0;
      while (allQuestions.length < totalNeeded && attemptsWithoutProgress < 3) {
        const currentBatchCount = Math.min(chunkSize, totalNeeded - allQuestions.length);
        const accumulatedExcludes = [
          ...excludeList,
          ...allQuestions.map(q => q.question)
        ];

        const prompt = isSecondary
          ? `You are an expert Chief Examiner for Senior Secondary School Economics, specializing strictly in the West African Examinations Council (WAEC / WASSCE) and Nigerian Joint Admissions and Matriculation Board (JAMB / UTME) curricula.

Generate exactly ${currentBatchCount} authentic, high-quality multiple-choice questions for a Senior Secondary School student (${level}) covering: "${topicTitle}".

CRITICAL CURRICULUM BOUNDARIES & STRICT INSTRUCTIONS:
1. STRICT WAEC & JAMB STANDARDS ONLY:
   - Target the exact standard, style, and syllabus of official WASSCE and JAMB UTME Economics examination past questions.
   - Questions must test high school principles, analytical clarity, definitions, features, functions, differences, and practical West African / Nigerian economic scenarios.
2. ABSOLUTELY NO UNDERGRADUATE CONTENT:
   - Under no circumstances should university-level, graduate-level, or advanced undergraduate economics questions be generated.
   - STRICTLY FORBIDDEN: Calculus, partial derivatives, Lagrangian optimization, Cobb-Douglas utility derivations (\\( U = x^\\alpha y^{1-\\alpha} \\)), Slutsky equations, Solow-Swan growth differential equations, Gauss-Markov theorem, OLS matrix regression / econometric error assumptions, Game Theory payoff matrices / Nash equilibria, IS-LM-BP algebraic proofs.
3. ALLOWED MATHEMATICS / QUANTITATIVE LEVEL:
   - Only basic secondary school arithmetic calculations typical of WAEC/JAMB:
     * Simple elasticity calculation: \\( \\text{Elasticity} = \\frac{\\% \\Delta Q}{\\% \\Delta P} \\) or \\( \\frac{\\Delta Q}{\\Delta P} \\times \\frac{P}{Q} \\).
     * Simple arithmetic tables: Calculating Total Revenue (\\( TR = P \\times Q \\)), Marginal Revenue (\\( MR = \\Delta TR / \\Delta Q \\)), Average Cost (\\( AC = TC / Q \\)), Marginal Cost (\\( MC = \\Delta TC / \\Delta Q \\)), or Total/Marginal Utility (\\( MU = \\Delta TU / \\Delta Q \\)).
     * Finding market equilibrium price and quantity from simple linear equations like \\( Q_d = 50 - 2P \\) and \\( Q_s = 10 + 2P \\).
     * Simple multiplier: \\( k = \\frac{1}{1 - MPC} \\) or \\( \\frac{1}{MPS} \\).
     * Simple statistics: Mean, Median, Mode from simple frequency data.
4. DIVERSE QUESTION TYPES:
   - Conceptual understanding and definitions (e.g. Scarcity vs Choice, Scale of Preference, Opportunity Cost, Factors of Production, Division of Labour).
   - Real-world West African economic scenarios (e.g. inflation control, agricultural marketing boards, crude oil sector, ECOWAS trade).
   - Curve analysis & shifts (e.g. shifts in demand vs movement along demand curve, price ceilings and minimum price legislation).
5. QUESTION FORMAT:
   - Concise, direct question stems (1–2 sentences).
   - Exactly 4 realistic options (Option A, B, C, D) with one unambiguously correct answer and 3 plausible distractors typical of WAEC/JAMB.
   - Whenever variables or equations appear, format using inline LaTeX \\( ... \\).
6. NO DUPLICATION: Do NOT repeat or generate questions similar to any of these excluded questions:
${JSON.stringify(accumulatedExcludes.slice(-100))}

Format the output strictly as a JSON array matching this schema:
[
  {
    "question": "string (clear, direct question stem typical of WAEC/JAMB)",
    "options": ["string (Option A)", "string (Option B)", "string (Option C)", "string (Option D)"],
    "correctAnswer": number (0-3),
    "explanation": "string (clear, concise explanation referencing WAEC/JAMB economic principles)"
  }
]

Return only raw valid JSON array.`
          : `You are an experienced Economics professor and examiner. Generate exactly ${currentBatchCount} well-balanced, MODERATE DIFFICULTY multiple-choice questions for a ${level} student covering: "${topicTitle}".

REQUIREMENTS:
1. MODERATE DIFFICULTY: Questions should be neither too easy nor overly complex. They must test genuine understanding — not just memorisation, but also not advanced graduate-level derivations. Aim for the level of a well-prepared final-year student.
2. DIVERSE QUESTION TYPES — STRICTLY NOT RESTRICTED TO MATH. Spread questions across these types:
   - Conceptual understanding (e.g. "Which of the following best explains why...")
   - Application & scenario (e.g. "A government reduces interest rates. What is the most likely effect on...")
   - Policy analysis & trade-offs (e.g. "A country facing stagflation should prioritise...")
   - Cause-and-effect reasoning (e.g. "If the price of a substitute good rises, demand for the original good will...")
   - Mathematical/quantitative (MAXIMUM 20% of questions — only where naturally relevant)
3. CONCISE STEMS: Keep question stems clear and direct (1–2 sentences). No long preambles, no topic name echoes, no "Ref:" labels.
4. CURRICULUM ROTATION: Spread questions across all subtopics mentioned in "${topicTitle}".
5. CLEAN LATEX MATH: Whenever math symbols, equations, or variables appear, format using inline LaTeX \\( ... \\) (e.g. \\( GDP \\), \\( P = MC \\)).
6. NO DUPLICATION: Do NOT repeat or generate questions similar to any of these excluded questions:
${JSON.stringify(accumulatedExcludes.slice(-100))}

Format the output strictly as a JSON array matching this schema:
[
  {
    "question": "string (clear, direct question stem of 1–2 sentences)",
    "options": ["string (Option A)", "string (Option B)", "string (Option C)", "string (Option D)"],
    "correctAnswer": number (0-3),
    "explanation": "string (brief, clear explanation of why the correct answer is right)"
  }
]

Return only raw valid JSON array.`;

        try {
          const response = await generateWithModelFallback(ai, {
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.85,
            }
          });
          const parsed = JSON.parse(response.text || "[]");
          const cleanBatch = deduplicateQuestions(parsed, accumulatedExcludes);
          
          if (cleanBatch.length === 0) {
            attemptsWithoutProgress++;
          } else {
            allQuestions.push(...cleanBatch);
            attemptsWithoutProgress = 0;
          }
        } catch (batchErr) {
          console.warn("Chunk generation error, attempting fallback...", batchErr);
          attemptsWithoutProgress++;
        }
      }

      if (allQuestions.length === 0) {
        // Fallback to offline generator if AI failed completely
        if (isSecondary) {
          const secondaryFallbacks = [
            {
              question: `Which of the following best defines opportunity cost in economics with reference to ${topicTitle}?`,
              options: [
                "The next best alternative forgone when a choice is made",
                "The total monetary cost of purchasing a good",
                "The financial expense recorded in a firm's balance sheet",
                "The market price determined by government decree"
              ],
              correctAnswer: 0,
              explanation: "In WAEC and JAMB economics, opportunity cost is defined as the real cost of an action expressed in terms of the next best alternative sacrificed."
            },
            {
              question: `In the study of ${topicTitle}, a movement along a demand curve is caused by a change in:`,
              options: [
                "The price of the commodity itself",
                "Consumers' disposable income",
                "Prices of substitute goods",
                "Tastes and preferences of consumers"
              ],
              correctAnswer: 0,
              explanation: "A change in the price of the commodity itself leads to a movement along the demand curve (contraction or expansion in quantity demanded), whereas other factors cause a shift of the demand curve."
            },
            {
              question: `If a 10% rise in the price of a product leads to a 5% drop in quantity demanded during analysis of ${topicTitle}, the price elasticity of demand is:`,
              options: [
                "Inelastic (\\( E_d = 0.5 \\))",
                "Elastic (\\( E_d = 2.0 \\))",
                "Unitary elastic (\\( E_d = 1.0 \\))",
                "Perfectlys elastic (\\( E_d = \\infty \\))"
              ],
              correctAnswer: 0,
              explanation: "Price elasticity of demand is \\( \\frac{\\% \\Delta Q_d}{\\% \\Delta P} = \\frac{5\\%}{10\\%} = 0.5 \\). Since \\( E_d < 1 \\), demand is inelastic."
            },
            {
              question: `According to the law of diminishing marginal utility relevant to ${topicTitle}, as a consumer consumes more units of a commodity:`,
              options: [
                "The marginal utility derived from each successive unit diminishes",
                "The total utility decreases immediately from the first unit",
                "The marginal utility increases at an increasing rate",
                "Average utility always equals zero"
              ],
              correctAnswer: 0,
              explanation: "The law of diminishing marginal utility states that as additional units of a good are consumed, the extra satisfaction (marginal utility) derived from each successive unit decreases."
            },
            {
              question: `In production economics under ${topicTitle}, division of labour is primarily limited by:`,
              options: [
                "The extent of the market and demand",
                "The level of direct taxation",
                "The presence of trade unions alone",
                "The availability of commercial bank overdrafts"
              ],
              correctAnswer: 0,
              explanation: "Adam Smith famously demonstrated that the division of labour is limited by the extent of the market (the volume of demand)."
            },
            {
              question: `Which of the following is a primary function of a Central Bank that distinguishes it from commercial banks under ${topicTitle}?`,
              options: [
                "Acting as lender of last resort to commercial banks",
                "Accepting demand deposits from individual customers",
                "Granting personal overdrafts to small retail businesses",
                "Underwriting corporate shares on the stock exchange"
              ],
              correctAnswer: 0,
              explanation: "The Central Bank acts as the lender of last resort, banker to the government, and sole issuer of legal tender, which commercial banks cannot do."
            },
            {
              question: `Under fiscal policy and public finance regarding ${topicTitle}, a tax whose rate increases as income increases is called a:`,
              options: [
                "Progressive tax",
                "Regressive tax",
                "Proportional tax",
                "Specific excise tax"
              ],
              correctAnswer: 0,
              explanation: "A progressive tax takes a higher percentage of income from higher-income earners, aiding income redistribution."
            },
            {
              question: `In national income accounting covering ${topicTitle}, Gross Domestic Product (GDP) differs from Gross National Product (GNP) by:`,
              options: [
                "Net factor income from abroad",
                "Depreciation (capital consumption allowance)",
                "Transfer payments from government",
                "Undistributed corporate profits"
              ],
              correctAnswer: 0,
              explanation: "GNP = GDP + Net Factor Income from Abroad (NFIA)."
            }
          ];
          const fallback = Array.from({ length: totalNeeded }).map((_, i) => {
            const item = secondaryFallbacks[i % secondaryFallbacks.length];
            return {
              question: item.question,
              options: item.options,
              correctAnswer: item.correctAnswer,
              explanation: item.explanation
            };
          });
          return res.json({ questions: fallback });
        }

        const fallback = Array.from({ length: totalNeeded }).map((_, i) => ({
          question: `In advanced technical analysis of ${topicTitle}, consider optimal resource allocation model # ${i + 1} with utility \\( U(x,y) = x^\\alpha y^{1-\\alpha} \\). What condition maximizes technical efficiency?`,
          options: [
            "\\( MRS_{x,y} = \\frac{P_x}{P_y} \\)",
            "\\( P_x = P_y + \\lambda \\)",
            "\\( MC > MR \\)",
            "\\( \\frac{\\partial U}{\\partial x} = 0 \\)"
          ],
          correctAnswer: 0,
          explanation: "Optimal consumer equilibrium occurs where Marginal Rate of Substitution equals relative price ratio."
        }));
        return res.json({ questions: fallback });
      }

      res.json({ questions: allQuestions });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let status = typeof error?.status === 'number' ? error.status : 500;
      if (error?.status === "UNAVAILABLE" || error?.code === 503) status = 503;
      if (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) status = 429;
      const message = status === 503 ? "Gemini API is currently overloaded." : "Failed to generate questions";
      
      if (allQuestions.length > 0) {
        return res.json({ questions: allQuestions });
      }
      res.status(status).json({ questions: [], error: message });
    }
  });

  app.post("/api/parsePdf", async (req, res) => {
    const { pdfBase64, prompt } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });
    
    try {
      const response = await generateWithModelFallback(ai, {
        contents: [
          prompt || "Extract and summarize the educational content of this PDF into a detailed markdown study guide.",
          {
            inlineData: {
              data: pdfBase64,
              mimeType: "application/pdf"
            }
          }
        ]
      });
      res.json({ markdown: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let status = typeof error?.status === 'number' ? error.status : 500;
      if (error?.status === "UNAVAILABLE" || error?.code === 503) status = 503;
      if (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) status = 429;
    }
  });

  app.post("/api/agentTask", async (req, res) => {
    const { prompt, agent, stream } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });

    const agentModel = agent || "antigravity-preview-05-2026";
    const userPrompt = prompt || "Explain economic equilibrium and market elasticity.";

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
      }

      try {
        const modelsToTry = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"];
        let streamResult = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
          try {
            streamResult = await ai.models.generateContentStream({
              model: modelName,
              contents: userPrompt
            });
            break; // Success
          } catch (err: any) {
            lastError = err;
            console.warn(`Streaming failed for ${modelName}, trying next model...`, err?.message || err);
          }
        }

        if (!streamResult) {
          throw lastError || new Error("All Gemini streaming models failed");
        }

        for await (const chunk of streamResult) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            if (typeof (res as any).flush === 'function') {
              (res as any).flush();
            }
          }
        }
        res.write('data: [DONE]\n\n');
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
        res.end();
      } catch (error: any) {
        console.error("Gemini Streaming Error:", error);
        res.write(`data: ${JSON.stringify({ error: error?.message || "Streaming failed" })}\n\n`);
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
        res.end();
      }
      return;
    }

    try {
      if ((ai as any).interactions && typeof (ai as any).interactions.create === 'function') {
        const interaction = await withRetry(() => (ai as any).interactions.create({
          agent: agentModel,
          input: userPrompt,
        }));
        return res.json({ result: interaction });
      } else {
        const response = await generateWithModelFallback(ai, { contents: userPrompt });
        return res.json({ result: response.text });
      }
    } catch (error: any) {
      console.warn("Agent interaction fallback triggered:", error?.message || error);
      try {
        const response = await generateWithModelFallback(ai, { contents: userPrompt });
        return res.json({ result: response.text });
      } catch (fallbackErr: any) {
        console.error("Gemini Agent Error:", fallbackErr);
        return res.status(500).json({ error: fallbackErr?.message || "Failed to execute agent task" });
      }
    }
  });

  app.post("/api/restoreAdvancedStudy", async (req, res) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'development_economics.md');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.json({ content });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read file' });
    }
  });

  app.post("/api/extractFromPdf", async (req, res) => {
    const { pdfBase64, level, count, topicId } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });
    
    const isSecondary = level === 'secondary' || level === 'secondary-ss2' || level === 'secondary-ss3' || (typeof level === 'string' && level.startsWith('secondary'));
    // The prompt guides the model to extract questions specifically addressing the PDF content
    const prompt = isSecondary
      ? `You are an expert Chief Examiner for Senior Secondary School Economics, specializing strictly in WASSCE (WAEC) and JAMB (UTME) standards. Given the provided document, extract and generate ${count || 5} multiple-choice questions suitable for a Senior Secondary School student (${level}).

CRITICAL RESTRICTIONS:
- All questions must strictly adhere to the high school WASSCE/JAMB Economics syllabus.
- Under NO circumstances generate undergraduate calculus, advanced microeconomic derivations, or econometrics questions.
- Maintain standard 4 options (A, B, C, D) with a single clearly correct answer.

Each question must have:
- A clear question text directly related to the concepts in the document.
- Exactly 4 options.
- The index of the correct answer (0-3).
- A brief explanation for the correct answer based on the document.

Return the response in JSON format as an array of objects with the following schema:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": number,
    "explanation": "string"
  }
]`
      : `You are an expert Economics examiner. Given the provided document, extract and generate ${count || 5} multiple-choice questions suitable for a ${level} student.

Each question must have:
- A clear question text directly related to the concepts in the document.
- Exactly 4 options.
- The index of the correct answer (0-3).
- A brief explanation for the correct answer based on the document.

Return the response in JSON format as an array of objects with the following schema:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": number,
    "explanation": "string"
  }
]`;

    try {
      const response = await generateWithModelFallback(ai, {
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
        }
      });
      res.json({ questions: JSON.parse(response.text || "[]") });
    } catch (error: any) {
      console.error("Gemini PDF Extract Error:", error);
      let status = typeof error?.status === 'number' ? error.status : 500;
      if (error?.status === "UNAVAILABLE" || error?.code === 503) status = 503;
      if (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) status = 429;
      const message = status === 503 ? "Gemini API is currently overloaded." : "Failed to extract questions from PDF";
      res.status(status).json({ questions: [], error: message });
    }
  });

  app.post("/api/generateDailyChallengeBatch", async (req, res) => {
    const { courses, count, level, exclude } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });

    const isSecondary = level === 'secondary' || level === 'secondary-ss2' || level === 'secondary-ss3' || (typeof level === 'string' && level.startsWith('secondary'));

    // Build the prompt requesting highly balanced questions with clear scenario and question separation.
    const prompt = isSecondary
      ? `You are an expert Senior Secondary School Economics Chief Examiner specializing in the official West African Examinations Council (WAEC / WASSCE) and Nigerian Joint Admissions and Matriculation Board (JAMB / UTME) curricula. Generate exactly ${count || 10} high-quality multiple-choice questions for a Daily Challenge at the Senior Secondary level (${level || 'secondary'}).
The questions must rotate dynamically across standard secondary economics fields: Basic Economic Principles, Theory of Demand and Supply, Theory of Production, Market Structures, Money and Banking, Public Finance, National Income, and International Trade.

CRITICAL DESIGN & CONTENT GUIDELINES:
1. STRICTLY WASSCE & JAMB STANDARDS: Target the exact standard, style, and syllabus of official WASSCE and JAMB UTME Economics examination past questions.
2. ABSOLUTELY NO UNDERGRADUATE CONTENT: Under no circumstances generate university-level, graduate-level, or advanced econometrics/calculus derivations. Strictly avoid Cobb-Douglas derivations, Slutsky equations, Solow-Swan growth differential equations, Gauss-Markov theorem, OLS matrix errors, or Game Theory payoff matrices.
3. CONCISE SCENARIOS: Keep each scenario short, crisp, and high-impact (maximum 1 to 2 sentences) grounded in realistic West African economic contexts.
4. MINIMAL LIGHT MATH: At most 20% simple arithmetic (simple price elasticity % calculation, TR/MR table calculation, or basic linear Qd=Qs equilibrium).
5. FORMATTING: Use inline LaTeX \\( ... \\) for any numbers, variables, or equations so they render cleanly.
6. NO REPETITION: Do NOT generate questions similar or identical to the following previously generated scenarios/questions:
${exclude && exclude.length > 0 ? JSON.stringify(exclude) : '[]'}

Each question must be an object matching this JSON schema:
{
  "scenario": "string (1-2 sentence situational setup in West African/secondary context with LaTeX formatting)",
  "question": "string (the specific secondary school economic question, with LaTeX formatting)",
  "options": ["string (with LaTeX formatting if numerical/variable)", "string", "string", "string"],
  "correctAnswer": number (index 0-3),
  "explanation": "string (clear, high school level explanation referencing WAEC/JAMB economic principles, using LaTeX formatting for equations)",
  "course": "string (the specific category: 'Basic Principles', 'Demand & Supply', 'Production & Markets', 'Money & Banking', 'Public Finance', 'National Income', or 'International Trade')"
}

Return the response in JSON format as a raw array of objects matching this schema. Do not wrap the JSON in markdown code blocks. Make sure to return exactly ${count || 10} unique questions.`
      : `You are an elite university professor of Economics. Generate exactly ${count || 10} multiple-choice questions for a Daily Challenge at the '${level || 'undergraduate'}' level.
The questions must toggle and rotate dynamically across different core fields of economics: Microeconomics, Macroeconomics, Econometrics (empirical regression analysis), International Trade, Public Finance, and Game Theory.

CRITICAL DESIGN & CONTENT GUIDELINES:
1. CONCISE SCENARIOS: Keep each scenario very short, crisp, and high-impact (maximum 1 to 2 sentences). Avoid long blocks of text.
2. HEAVILY CONCEPTUAL & THEORETICAL: At least 80% of the generated questions MUST be purely conceptual, theoretical, or qualitative, testing core principles, policy intuition, structural characteristics, or economic logic (e.g., Giffen goods, Nash equilibrium definitions, Ricardian trade theory, Gauss-Markov assumptions, liquidity traps, or public goods characteristics). No calculations should be required for these.
3. MINIMAL LIGHT MATH: At most 20% of the questions should contain extremely simple, single-step mathematical or statistical logic (e.g. simple elasticity, basic expenditure totals, or simple multiplier calculations). Keep numbers friendly and simple.
4. MATHEMATICAL EXPRESSIONS (LaTeX): For any mathematical variables, functional forms, equations, systems of equations, vectors, or matrices, you MUST format them using LaTeX notation. Use inline math delimiters like "\\\\( ... \\\\)" (e.g. "\\\\( U(x,y) = x \\\\cdot y \\\\)" or "\\\\( P = 15 \\\\)") and display/block math delimiters like "\\\\\\\\[ ... \\\\\\\\]" for large equations. Ensure all variables (like \\\\( k^* \\\\), \\\\( P^* \\\\), \\\\( Y \\\\)) are in LaTeX format so they render beautifully and professionally.
5. REAL-LIFE ECONOMIC SCENARIOS: Every single question MUST be grounded in a specific, tangible real-world scenario (e.g., inflation in a specific country, a tech company's monopoly pricing, international trade tariffs between nations, real-world behavioral economics nudges). Do NOT use generic "Widget Corp" or "Country A" examples. Make it feel like a real-life case study.
6. SEPARATION OF SCENARIO AND QUESTION: Clearly split the situational setup (the scenario/data) from the actual technical query.
7. NO REPETITION: Do NOT generate questions similar or identical to the following previously generated scenarios/questions:
${exclude && exclude.length > 0 ? JSON.stringify(exclude) : '[]'}

Each question must be an object matching this JSON schema:
{
  "scenario": "string (1-2 sentence situational setup with beautifully formatted LaTeX variables and equations)",
  "question": "string (the specific analytical, mathematical, or conceptual question to solve, with LaTeX formatting)",
  "options": ["string (with LaTeX formatting if it is an equation, variable, or numerical value)", "string", "string", "string"],
  "correctAnswer": number (index 0-3),
  "explanation": "string (scholarly, clear, step-by-step logic and calculation showing exactly why the option is correct, using LaTeX formatting for equations)",
  "course": "string (the specific category: 'Microeconomics', 'Macroeconomics', 'Econometrics', 'International Economics', 'Public Finance', or 'Game Theory')"
}

Return the response in JSON format as a raw array of objects matching this schema. Do not wrap the JSON in markdown code blocks. Make sure to return exactly ${count || 10} unique questions.`;

    try {
      const response = await generateWithModelFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      res.json({ questions: JSON.parse(response.text || "[]") });
    } catch (error: any) {
      console.error("Gemini Daily Challenge Generation Error:", error);
      let status = typeof error?.status === 'number' ? error.status : 500;
      if (error?.status === "UNAVAILABLE" || error?.code === 503) status = 503;
      if (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) status = 429;
      res.status(status).json({ questions: [], error: "Failed to generate daily challenge questions" });
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  // --- Socket.io Logic for Live Challenges ---
  const rooms = new Map<string, { players: any[], questions: any[], status: 'waiting' | 'playing' | 'finished' }>();
  const lobbyUsers = new Map<string, any>();
  const matchmakingQueue = new Map<string, { socketId: string, user: any, topicId: string }>();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_lobby", (user) => {
      socket.join("lobby");
      const userData = { ...user, socketId: socket.id, status: 'idle' };
      lobbyUsers.set(socket.id, userData);
      
      socket.emit("lobby_users_list", Array.from(lobbyUsers.values()));
      socket.to("lobby").emit("user_joined_lobby", userData);
    });

    socket.on("find_match", ({ user, topicId, questions }) => {
      const userData = lobbyUsers.get(socket.id);
      if (userData) {
        userData.status = 'searching';
        io.to("lobby").emit("user_status_updated", { socketId: socket.id, status: 'searching' });
      }

      // Check if someone else is searching for the same topic
      let opponent: any = null;
      for (const [sId, entry] of matchmakingQueue.entries()) {
        if (entry.topicId === topicId && sId !== socket.id) {
          opponent = entry;
          matchmakingQueue.delete(sId);
          break;
        }
      }

      if (opponent) {
        // Found a match!
        const roomId = `match_${Date.now()}`;
        const challengerUser = lobbyUsers.get(opponent.socketId);
        const acceptorUser = lobbyUsers.get(socket.id);
        
        if (challengerUser) challengerUser.status = 'playing';
        if (acceptorUser) acceptorUser.status = 'playing';
        
        io.to("lobby").emit("user_status_updated", { socketId: socket.id, status: 'playing' });
        io.to("lobby").emit("user_status_updated", { socketId: opponent.socketId, status: 'playing' });

        rooms.set(roomId, {
          players: [
            { ...user, socketId: socket.id, score: 0, currentQuestion: 0 },
            { ...opponent.user, socketId: opponent.socketId, score: 0, currentQuestion: 0 }
          ],
          questions,
          status: 'playing'
        });

        socket.join(roomId);
        io.to(opponent.socketId).emit("match_found", { roomId, opponent: user, questions });
        socket.emit("match_found", { roomId, opponent: opponent.user, questions });
      } else {
        // Add to queue
        matchmakingQueue.set(socket.id, { socketId: socket.id, user, topicId });
      }
    });

    socket.on("cancel_search", () => {
      matchmakingQueue.delete(socket.id);
      const userData = lobbyUsers.get(socket.id);
      if (userData) {
        userData.status = 'idle';
        io.to("lobby").emit("user_status_updated", { socketId: socket.id, status: 'idle' });
      }
    });

    socket.on("update_status", (status) => {
      const user = lobbyUsers.get(socket.id);
      if (user) {
        user.status = status;
        io.to("lobby").emit("user_status_updated", { socketId: socket.id, status });
      }
    });

    socket.on("challenge_user", ({ targetSocketId, challenger, topicTitle, questions }) => {
      // Update statuses to 'challenging' and 'challenged'? 
      // For now just keep it simple, but we could update them.
      io.to(targetSocketId).emit("challenge_received", { challenger, challengerSocketId: socket.id, topicTitle, questions });
    });

    socket.on("accept_challenge", ({ challengerSocketId, acceptor, questions }) => {
      const roomId = `match_${Date.now()}`;
      
      // Update statuses in lobby
      const acceptorUser = lobbyUsers.get(socket.id);
      const challengerUser = lobbyUsers.get(challengerSocketId);
      if (acceptorUser) acceptorUser.status = 'playing';
      if (challengerUser) challengerUser.status = 'playing';
      io.to("lobby").emit("user_status_updated", { socketId: socket.id, status: 'playing' });
      io.to("lobby").emit("user_status_updated", { socketId: challengerSocketId, status: 'playing' });

      rooms.set(roomId, {
        players: [
          { ...acceptor, socketId: socket.id, score: 0, currentQuestion: 0 },
          { socketId: challengerSocketId, score: 0, currentQuestion: 0 }
        ],
        questions,
        status: 'playing'
      });

      socket.join(roomId);
      io.to(challengerSocketId).emit("challenge_accepted", { roomId, acceptor, questions });
    });

    socket.on("join_match", ({ roomId, user }) => {
      socket.join(roomId);
      const room = rooms.get(roomId);
      if (room) {
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex !== -1) {
          room.players[playerIndex] = { ...user, socketId: socket.id, score: 0, currentQuestion: 0 };
        }
        io.to(roomId).emit("match_started", { players: room.players, questions: room.questions });
      }
    });

    socket.on("submit_answer", ({ roomId, correct, questionIndex }) => {
      const room = rooms.get(roomId);
      if (room) {
        const player = room.players.find(p => p.socketId === socket.id);
        if (player) {
          if (correct) player.score += 10;
          player.currentQuestion = questionIndex + 1;
          
          io.to(roomId).emit("player_progress", { players: room.players });

          if (room.players.every(p => p.currentQuestion >= room.questions.length)) {
            room.status = 'finished';
            io.to(roomId).emit("match_finished", { players: room.players });
            
            // Set players back to idle in lobby
            room.players.forEach(p => {
              const lobbyUser = lobbyUsers.get(p.socketId);
              if (lobbyUser) {
                lobbyUser.status = 'idle';
                io.to("lobby").emit("user_status_updated", { socketId: p.socketId, status: 'idle' });
              }
            });
          }
        }
      }
    });

    socket.on("send_message", ({ roomId, message, senderName }) => {
      io.to(roomId).emit("receive_message", { 
        message, 
        senderName, 
        senderId: socket.id,
        timestamp: new Date().toISOString()
      });
    });

    socket.on("request_rematch", ({ roomId, challengerName }) => {
      socket.to(roomId).emit("rematch_offered", { challengerName, challengerSocketId: socket.id });
    });

    socket.on("accept_rematch", ({ roomId, questions }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.status = 'playing';
        room.questions = questions;
        room.players.forEach(p => {
          p.score = 0;
          p.currentQuestion = 0;
          const lobbyUser = lobbyUsers.get(p.socketId);
          if (lobbyUser) {
            lobbyUser.status = 'playing';
            io.to("lobby").emit("user_status_updated", { socketId: p.socketId, status: 'playing' });
          }
        });
        io.to(roomId).emit("match_started", { players: room.players, questions: room.questions });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      lobbyUsers.delete(socket.id);
      matchmakingQueue.delete(socket.id);
      io.to("lobby").emit("user_left_lobby", socket.id);
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

