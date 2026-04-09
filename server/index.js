const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ncbuzzer.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"]
}));

app.get('/', (req, res) => {
  res.send('Server is running');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
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

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));