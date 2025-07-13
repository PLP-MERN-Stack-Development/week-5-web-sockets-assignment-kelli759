const socketHandler = (io) => {
  const users = {};

  const getSocketIdByUsername = (username) =>
    Object.keys(users).find((id) => users[id] === username);

  io.on('connection', (socket) => {
    socket.on('send-message', (msg, callback) => {
  // Broadcast message to all users in the specified room
  io.to(msg.room).emit('message', msg);
  // Simulate message delivery status
  callback({
    status: 'delivered',
    timestamp: new Date(),
  });
});

    console.log(`🟢 ${socket.id} connected`);

    // User joins with a username
    socket.on('join', (username) => {
      users[socket.id] = username;
      io.emit('user-list', Object.values(users));
      console.log(`👤 ${username} joined`);
    });

    // Typing indicator (global or private)
    socket.on('typing', ({ to, isPrivate }) => {
      const sender = users[socket.id];
      if (isPrivate) {
        const socketId = getSocketIdByUsername(to);
        if (socketId) {
          io.to(socketId).emit('typing', sender);
        }
      } else {
        socket.broadcast.emit('typing', sender);
      }
    });

    // Private messaging
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

    // Read receipts
    socket.on('message-read', ({ from }) => {
      const fromSocket = getSocketIdByUsername(from);
      if (fromSocket) {
        io.to(fromSocket).emit('read-receipt', { to: users[socket.id] });
      }
    });

    // Reactions
    socket.on('reaction', ({ messageId, reaction }) => {
      io.emit('reaction', {
        messageId,
        reaction,
        user: users[socket.id],
      });
    });

    // Join a chat room
    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`📥 ${users[socket.id]} joined room: ${room}`);
    });

    // Send message to a room
    socket.on('room-message', ({ room, message }) => {
      io.to(room).emit('room-message', {
        user: users[socket.id],
        message,
        timestamp: new Date(),
      });
    });

    // File upload (base64)
    socket.on('file-upload', (fileData) => {
      io.emit('file-received', fileData);
    });

    // Global message
    socket.on('message', (data) => {
      io.emit('message', {
        user: users[socket.id],
        text: data,
        timestamp: new Date(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔴 ${socket.id} disconnected`);
      delete users[socket.id];
      io.emit('user-list', Object.values(users));
    });
  });
};

useEffect(() => {
  socket.on('connect', () => {
    console.log('🟢 Reconnected');
  });
  socket.on('disconnect', () => {
    console.log('🔴 Disconnected');
  });
}, []);

const chatNamespace = io.of('/chat');
chatNamespace.on('connection', (socket) => {
  // logic for chat users
});



module.exports = socketHandler;
