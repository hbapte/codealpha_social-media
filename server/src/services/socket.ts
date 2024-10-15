// server/src/services/socket.ts
import { Server } from 'socket.io';
import http from 'http';

let io: Server | null = null;  
const userSocketMap: { [key: string]: string } = {}; 

export const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5500", 
      methods: ["GET", "POST"],
      credentials: true, 
    },
  });

  io.on('connection', (socket) => {
    console.info(`Socket connected: ${socket.id}`);
    socket.on('join', (userId: string) => {
      userSocketMap[socket.id] = userId;
      socket.join(userId); 
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on('sendNotification', ({ toUserId, notification }) => {
      console.log(`Sending notification to user ${toUserId}`);
      io?.to(toUserId).emit('receiveNotification', notification); 
    });

    socket.on('disconnect', () => {
      console.info(`Socket disconnected: ${socket.id}`);
      const userId = userSocketMap[socket.id];
      if (userId) {
        delete userSocketMap[socket.id]; 
      }
    });
  });
  return io;
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
