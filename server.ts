import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
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
