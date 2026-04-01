const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join-role', (role) => {
    socket.data.role = role;
    socket.join(role);
    console.log(`${role} joined`);
  });

  socket.on('call-role', (targetRole) => {
    const from = socket.data.role;
    io.to(targetRole).emit('incoming-call', { from });
    console.log(`${from} called ${targetRole}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5001, () => console.log('Backend running on port 5000'));