const { Server } = require('socket.io');

let io = null;
const connectedUsers = new Map(); // userId -> socketId

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User authentication
    socket.on('authenticate', (userId) => {
      if (userId) {
        connectedUsers.set(userId, socket.id);
        socket.userId = userId;
        console.log(`User ${userId} authenticated with socket ${socket.id}`);
        socket.join(`user:${userId}`);
      }
    });

    // Join village room for psychologues
    socket.on('join-village', (village) => {
      if (village) {
        socket.join(`village:${village}`);
        console.log(`Socket ${socket.id} joined village room: ${village}`);
      }
    });

    // Join role room
    socket.on('join-role', (role) => {
      if (role) {
        socket.join(`role:${role}`);
        console.log(`Socket ${socket.id} joined role room: ${role}`);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Send notification to specific user
const sendNotificationToUser = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
    console.log(`Notification sent to user ${userId}`);
  }
};

// Send notification to village psychologues
const sendNotificationToVillage = (village, notification) => {
  if (io) {
    io.to(`village:${village}`).emit('notification', notification);
    console.log(`Notification sent to village ${village}`);
  }
};

// Send notification to all users with specific role
const sendNotificationToRole = (role, notification) => {
  if (io) {
    io.to(`role:${role}`).emit('notification', notification);
    console.log(`Notification sent to role ${role}`);
  }
};

// Broadcast to all connected clients
const broadcastNotification = (notification) => {
  if (io) {
    io.emit('notification', notification);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  sendNotificationToUser,
  sendNotificationToVillage,
  sendNotificationToRole,
  broadcastNotification
};
