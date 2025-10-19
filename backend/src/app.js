const express = require('express');
const cors = require('cors');
const path = require('path');
const Url = require('./models/Url');

const app = express();
app.use((req, res, next) => { console.log('🌍', req.method, req.path); next(); });

// Trust proxy for Railway
app.set('trust proxy', 1);

// Log ALL requests
app.use((req, res, next) => {
  console.log('🌍 REQUEST:', req.method, req.path, '- Headers:', JSON.stringify(req.headers));
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rest of your app.js remains the same...
