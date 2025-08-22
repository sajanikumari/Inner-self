require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const WebSocket = require('ws');

const app = express();

// CORS Configuration - More permissive for debugging
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5500',
      'https://sajanikumari.github.io',
      'https://sajanikumari.github.io/Inner-self',
      'https://sajanikumari.github.io/Inner-self/client',
      'https://sajanikumari.github.io/Inner-self/client/index.html'
    ];

    console.log(`🔍 CORS Check - Origin: ${origin}`);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS: No origin header, allowing request');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin not allowed:', origin);
      // For debugging, allow all origins temporarily
      console.log('⚠️  Allowing origin for debugging purposes');
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Apply CORS middleware first
app.use(cors(corsOptions));

// Additional CORS headers middleware for extra safety
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Set CORS headers explicitly
  if (origin && (origin.includes('sajanikumari.github.io') || origin.includes('localhost'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling preflight request for:', req.url);
    return res.status(200).end();
  }

  next();
});

// Explicit preflight handling for all routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(fileUpload());

// Enhanced request logging with CORS debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`Origin: ${req.headers.origin}`);

  // Log important headers for CORS debugging
  const corsHeaders = {
    'origin': req.headers.origin,
    'access-control-request-method': req.headers['access-control-request-method'],
    'access-control-request-headers': req.headers['access-control-request-headers'],
    'user-agent': req.headers['user-agent']
  };
  console.log(`CORS Debug Headers:`, corsHeaders);

  // Log response headers being sent
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`Response Headers for ${req.method} ${req.url}:`, {
      'access-control-allow-origin': res.get('Access-Control-Allow-Origin'),
      'access-control-allow-methods': res.get('Access-Control-Allow-Methods'),
      'access-control-allow-headers': res.get('Access-Control-Allow-Headers'),
      'access-control-allow-credentials': res.get('Access-Control-Allow-Credentials')
    });
    originalSend.call(this, data);
  };

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

// Test route
app.get('/', (req, res) => {
  res.send('InnerSelf Buddy backend is running!');
});

// CORS test endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);

// WebSocket - use same server instance to avoid port conflicts
let wss;
try {
  // Use the same server instance for WebSocket
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

server.listen(PORT, () => {
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