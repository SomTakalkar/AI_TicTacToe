import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const games = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Optional: Notify others in room
    // socket.to(roomId).emit('playerJoined', socket.id);
  });

  socket.on('playerMove', (data) => {
    const { roomId, ...moveData } = data;
    // Broadcast the move to other clients in the specific room
    socket.to(roomId).emit('updateGame', moveData);
  });

  socket.on('resetGame', (data) => {
      const { roomId } = data;
      io.to(roomId).emit('gameReset');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});