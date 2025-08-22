const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Handle SPA routing - serve index.html for any route that doesn't match a file
app.get('*', (req, res) => {
    // If the request is for an HTML file, serve it directly
    if (req.path.endsWith('.html') || req.path === '/') {
        const filePath = req.path === '/' ? '/index.html' : req.path;
        res.sendFile(path.join(__dirname, '../client', filePath));
    } else {
        // For other routes, try to serve the file, or fallback to index.html
        res.sendFile(path.join(__dirname, '../client', req.path), (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, '../client/index.html'));
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Client server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${path.join(__dirname, '../client')}`);
    console.log(`🔗 Access your app at: http://localhost:${PORT}`);
});
