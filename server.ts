import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
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
  
  app.post("/api/generateStudyGuide", async (req, res) => {
    const { topicTitle, level, description } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });
    
    const prompt = `You are an expert Economics tutor. Generate a comprehensive study guide for a ${level} student on the topic: "${topicTitle}". 
Description: ${description}

Format the output in Markdown with:
- Clear headings
- Key definitions
- Detailed explanations
- Examples where applicable
- Professional Markdown tables for data (ensure proper rows and columns)
- Mathematical expressions formatted in LaTeX using $ for inline and $$ for block math. Ensure all LaTeX commands (like \\frac, \\Delta, \\epsilon) are correctly formatted with a single backslash as per standard LaTeX.
- A summary section

Make it educational, engaging, and easy to understand for a ${level} level.`;

    try {
      const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      }));
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
  
  app.post("/api/generateQuestions", async (req, res) => {
    const { topicTitle, level, count } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });
    
    const prompt = `You are an expert Economics examiner. Generate ${count || 5} multiple-choice questions for a ${level} student on the topic: "${topicTitle}".

Each question must have:
- A clear question text
- Exactly 4 options
- The index of the correct answer (0-3)
- A brief explanation for the correct answer

Return the response in JSON format as an array of objects with the following schema:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": number,
    "explanation": "string"
  }
]

Ensure the questions are challenging but appropriate for the ${level} level.`;

    try {
      const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      }));
      res.json({ questions: JSON.parse(response.text || "[]") });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let status = typeof error?.status === 'number' ? error.status : 500;
      if (error?.status === "UNAVAILABLE" || error?.code === 503) status = 503;
      if (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) status = 429;
      const message = status === 503 ? "Gemini API is currently overloaded." : "Failed to generate questions";
      res.status(status).json({ questions: [], error: message });
    }
  });

  app.post("/api/parsePdf", async (req, res) => {
    const { pdfBase64, prompt } = req.body;
    const ai = getGenAI();
    if (!ai) return res.status(500).json({ error: "Missing API key" });
    
    try {
      const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          prompt || "Extract and summarize the educational content of this PDF into a detailed markdown study guide.",
          {
            inlineData: {
              data: pdfBase64,
              mimeType: "application/pdf"
            }
          }
        ]
      }));
      res.json({ markdown: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let status = typeof error?.status === 'number' ? error.status : 500;
      if (error?.status === "UNAVAILABLE" || error?.code === 503) status = 503;
      if (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) status = 429;
      res.status(status).json({ error: "Failed to parse PDF" });
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
    
    // The prompt guides the model to extract questions specifically addressing the PDF content
    const prompt = `You are an expert Economics examiner. Given the provided document, extract and generate ${count || 5} multiple-choice questions suitable for a ${level} student.

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
      const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
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
      }));
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

    // Build the prompt requesting highly balanced, real-world analytical questions with clear scenario and question separation.
    const prompt = `You are an elite university professor of Economics. Generate exactly ${count || 10} multiple-choice questions for a Daily Challenge at the '${level || 'undergraduate'}' level.
The questions must toggle and rotate dynamically across different core fields of economics: Microeconomics, Macroeconomics, Econometrics (empirical regression analysis), International Trade, Public Finance, and Game Theory.

CRITICAL DESIGN & CONTENT GUIDELINES:
1. CONCISE SCENARIOS: Keep each scenario very short, crisp, and high-impact (maximum 1 to 2 sentences). Avoid long blocks of text.
2. HEAVILY CONCEPTUAL & THEORETICAL: At least 80% of the generated questions MUST be purely conceptual, theoretical, or qualitative, testing core principles, policy intuition, structural characteristics, or economic logic (e.g., Giffen goods, Nash equilibrium definitions, Ricardian trade theory, Gauss-Markov assumptions, liquidity traps, or public goods characteristics). No calculations should be required for these.
3. MINIMAL LIGHT MATH: At most 20% of the questions should contain extremely simple, single-step mathematical or statistical logic (e.g. simple elasticity, basic expenditure totals, or simple multiplier calculations). Keep numbers friendly and simple.
4. MATHEMATICAL EXPRESSIONS (LaTeX): For any mathematical variables, functional forms, equations, systems of equations, vectors, or matrices, you MUST format them using LaTeX notation. Use inline math delimiters like "\\\\( ... \\\\)" (e.g. "\\\\( U(x,y) = x \\\\cdot y \\\\)" or "\\\\( P = 15 \\\\)") and display/block math delimiters like "\\\\\\\\[ ... \\\\\\\\]" for large equations. Ensure all variables (like \\\\( k^* \\\\), \\\\( P^* \\\\), \\\\( Y \\\\)) are in LaTeX format so they render beautifully and professionally.
5. REAL ECONOMY REASONING: Ground each question in real-world scenarios or realistic empirical study concepts.
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
      const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      }));
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

  const PORT = 3000;

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

