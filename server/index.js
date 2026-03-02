const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = new Map(); // socket.id -> username
const messages = [];

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('online-users', Array.from(users.values()));
    socket.emit('message-history', messages);
    io.emit('receive-message', {
      id: Date.now().toString(),
      type: 'system',
      content: `${username} joined the chat.`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('send-message', (content) => {
    const username = users.get(socket.id);
    if (!username) return;

    const msg = {
      id: Date.now().toString() + Math.random().toString(),
      userId: socket.id,
      username,
      content,
      type: 'user',
      timestamp: new Date().toISOString()
    };

    messages.push(msg);
    if (messages.length > 100) messages.shift(); // keep last 100 messages

    io.emit('receive-message', msg);
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      io.emit('online-users', Array.from(users.values()));
      io.emit('receive-message', {
        id: Date.now().toString() + Math.random().toString(),
        type: 'system',
        content: `${username} left the chat.`,
        timestamp: new Date().toISOString()
      });
    }
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
