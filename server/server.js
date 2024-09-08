const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',  // Allow requests from this origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:4200',  // Allow requests from this origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

let rooms = [];
let users = [];
let messages = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  // Emit initial data
  socket.emit('rooms', rooms);
  socket.emit('users', users);
  socket.emit('messages', messages);

  // Handle room creation
  socket.on('createRoom', (name) => {
    const newRoom = { id: generateId(), name };
    rooms.push(newRoom);
    io.emit('rooms', rooms);
  });

  // Handle joining a room
  let temproomid;
  socket.on('joinRoom', (payload) => {
    const { roomId, user } = payload;
    temproomid = roomId;
    user.id = socket.id; // Assign user ID from socket ID
    users = users.filter(u => u.roomId !== roomId); // Remove user from other rooms
    users.push(user);
    io.emit('users', users);
    socket.join(roomId);
  });

  // Handle sending a message
  socket.on('sendMessage', (message) => {
    message.id = generateId(); // Generate a unique ID for the message
    messages.push(message);
    io.to(message.roomId).emit('messages', messages.filter(m => m.roomId === message.roomId));
  });

  // Handle updating a message
  socket.on('updateMessage', (updatedMessage) => {
    messages = messages.map(m => m.id === updatedMessage.id ? updatedMessage : m);
    io.to(updatedMessage.roomId).emit('messages', messages.filter(m => m.roomId === updatedMessage.roomId));
  });

  // Handle deleting a message
  socket.on('deleteMessage', (message) => {
    messages = messages.filter(m => m.id !== message.id);
    io.to(message.roomId).emit('messages', messages.filter(m => m.roomId === message.roomId));
  });

  // Handle fetching messages for a room
  socket.on('getRoomMessages', (roomId) => {
    const roomMessages = messages.filter(m => m.roomId === roomId);
    socket.emit('roomMessages', { roomId, messages: roomMessages });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Clean up disconnected user
    users = users.filter(user => user.id !== socket.id);
    rooms = rooms.filter(room =>room.id !== temproomid)
    io.emit('users', users , users);
  });
});

function generateId() {
  return Math.random().toString(36).substring(2, 15); // Simple ID generator
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
