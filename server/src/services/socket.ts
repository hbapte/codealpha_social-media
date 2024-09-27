// server/src/services/socket.ts
import { Server } from 'socket.io';
import http from 'http';

let io: Server | null = null;  // Define io as null initially
const userSocketMap: { [key: string]: string } = {}; // Map for tracking users and their sockets

export const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Your frontend URL
      methods: ["GET", "POST"],
      credentials: true, // Allow credentials
    },
  });

  io.on('connection', (socket) => {
    console.info(`Socket connected: ${socket.id}`);

    // Event for joining user to their own room
    socket.on('join', (userId: string) => {
      userSocketMap[socket.id] = userId;
      socket.join(userId); // User joins a room for receiving personalized updates
      console.log(`User ${userId} joined room ${userId}`);
    });

    // Event for sending notifications
    socket.on('sendNotification', ({ toUserId, notification }) => {
      console.log(`Sending notification to user ${toUserId}`);
      io?.to(toUserId).emit('receiveNotification', notification); // Send notification to the targeted user
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.info(`Socket disconnected: ${socket.id}`);
      const userId = userSocketMap[socket.id];
      if (userId) {
        delete userSocketMap[socket.id]; // Remove user from the map
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
