require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const WebSocket = require('ws');

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(fileUpload());

// Handle preflight requests
app.options('*', cors());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const settingRoutes = require('./routes/settingRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/tasks', taskRoutes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/innerself';
console.log('Using MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// WebSocket
let wss;
try {
  wss = new WebSocket.Server({ port: process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 5001 });
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      // Handle messages
    });
  });
} catch (err) {
  console.error('WebSocket server error:', err.message);
}


// Export wss for use in other modules
module.exports = { wss };

// Test route
app.get('/', (req, res) => {
  res.send('InnerSelf Buddy backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Initialize reminder scheduler after server starts to avoid circular dependency
  const { scheduleReminders } = require('./utils/reminderScheduler');
  scheduleReminders();
});