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
        const isRetryable = error?.status === 503 || error?.status === 429 || error?.code === 503 || error?.code === 429;
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
      const status = error?.status || 500;
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
      const status = error?.status || 500;
      const message = status === 503 ? "Gemini API is currently overloaded." : "Failed to generate questions";
      res.status(status).json({ questions: [], error: message });
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
      const status = error?.status || 500;
      const message = status === 503 ? "Gemini API is currently overloaded." : "Failed to extract questions from PDF";
      res.status(status).json({ questions: [], error: message });
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
