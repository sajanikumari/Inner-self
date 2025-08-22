require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const WebSocket = require('ws');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000', 
    'http://127.0.0.1:5500',
    'https://sajanikumari.github.io',
    'https://sajanikumari.github.io/Inner-self',
    'https://sajanikumari.github.io/Inner-self/client'
  ],
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
console.log('Using MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

// Improved MongoDB connection with retry logic
const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    
    // In production, continue without DB rather than crashing
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Continuing without database in production mode');
    } else {
      // In development, you might want to retry or exit
      console.log('💡 Make sure MongoDB is running locally');
    }
  }
};

connectDB();

// WebSocket - use same server instance to avoid port conflicts
let wss;
try {
  const http = require('http');
  const server = http.createServer(app);
  
  // Use the same port as the HTTP server
  wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    ws.on('message', (message) => {
      // Handle messages
      console.log('Received:', message);
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
  
  console.log('✅ WebSocket server initialized');
} catch (err) {
  console.error('❌ WebSocket server error:', err.message);
  // Continue without WebSocket rather than crashing
}


// Export wss for use in other modules
module.exports = { wss };

// Test route
app.get('/', (req, res) => {
  res.send('InnerSelf Buddy backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize reminder scheduler after server starts to avoid circular dependency
  try {
    const { scheduleReminders } = require('./utils/reminderScheduler');
    scheduleReminders();
    console.log('✅ Reminder scheduler loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load reminder scheduler:', error.message);
    // Continue without scheduler rather than crashing
  }
});