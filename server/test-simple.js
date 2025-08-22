const express = require('express');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Test endpoint
app.post('/api/test-login', (req, res) => {
  console.log('Test login received:', req.body);
  res.json({ 
    message: 'Test login successful', 
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    server: 'Test Server',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
});