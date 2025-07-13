import { io } from 'socket.io-client';
export const socket = io('http://localhost:5000');


const socketHandler = (io) => {
  const users = {}; // Keeps track of socketId → username

  const getSocketIdByUsername = (username) => {
    return Object.keys(users).find(
      (socketId) => users[socketId] === username
    );
  };

  io.on('connection', (socket) => {
    console.log(`🟢 ${socket.id} connected`);

    // When user joins with username
    socket.on('join', (username) => {
      users[socket.id] = username;
      io.emit('user-list', Object.values(users));
    });

    // 🔒 Private messaging logic
    socket.on('private-message', ({ to, message }) => {
      const recipientSocketId = getSocketIdByUsername(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('private-message', {
          from: users[socket.id],
          message,
          timestamp: new Date(),
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔴 ${socket.id} disconnected`);
      delete users[socket.id];
      io.emit('user-list', Object.values(users));
    });
  });
};

module.exports = socketHandler;
