// test-server.js - Create this file to test basic functionality
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/health', (req, res) => {
  console.log('Health check hit!');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is working!' 
  });
});

app.post('/api/urls', (req, res) => {
  console.log('POST /api/urls hit!');
  console.log('Body:', req.body);
  
  res.json({
    success: true,
    message: 'URL endpoint is working',
    received: req.body,
    shortUrl: 'http://localhost:5000/test.link.123'
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'SmartLink API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log('404 hit for:', req.url);
  res.status(404).json({ error: 'Route not found', url: req.url });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 API: http://localhost:${PORT}/api/urls`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});