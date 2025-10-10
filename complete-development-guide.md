# Complete Development Guide: SmartLink MVP
*From Zero to Fully Working Local Application*

## Part 1: Development Environment Setup

### Required Tools Installation (In Order)

```bash
# 1. Core Development Tools
- Node.js v20+ (https://nodejs.org/) - Choose LTS version
- Git (https://git-scm.com/)
- VSCode or Cursor (https://cursor.sh/) - Cursor recommended for AI assistance
- MongoDB Community Server (https://www.mongodb.com/try/download/community)
- Redis Stack (https://redis.io/download) or use Docker
- Postman (https://www.postman.com/) for API testing

# 2. Optional but Recommended
- Docker Desktop (https://www.docker.com/products/docker-desktop/)
- TablePlus or MongoDB Compass (database GUI)
- ngrok (for testing webhooks locally)
```

### Initial Project Setup

```bash
# Create project directory
mkdir smartlink
cd smartlink

# Initialize git
git init
git branch -M main

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.vscode/
.idea/
coverage/
.next/
EOF

# Create folder structure
mkdir -p backend frontend chrome-extension docs
```

## Part 2: Backend Development (Do This First!)

### Step 1: Initialize Backend

```bash
cd backend
npm init -y

# Install dependencies
npm install express cors dotenv mongoose redis ioredis
npm install bcryptjs jsonwebtoken stripe
npm install openai cheerio qrcode nanoid
npm install express-rate-limit helmet compression
npm install express-validator

# Dev dependencies
npm install -D nodemon jest supertest
npm install -D @types/node typescript ts-node

# Create package.json scripts
```

Update `backend/package.json`:
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest --watchAll"
  }
}
```

### Step 2: Backend File Structure

```bash
# Create backend structure
cd backend
mkdir -p src/{config,models,routes,controllers,services,middleware,utils}

# Create all necessary files
touch src/server.js
touch src/app.js
touch src/config/{database.js,redis.js,keys.js}
touch src/models/{User.js,Url.js,Analytics.js}
touch src/routes/{auth.js,url.js,analytics.js}
touch src/controllers/{authController.js,urlController.js}
touch src/services/{aiService.js,urlService.js,qrService.js}
touch src/middleware/{auth.js,rateLimiter.js}
touch src/utils/validators.js
touch .env
```

### Step 3: Environment Configuration

Create `backend/.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smartlink

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
SALT_ROUNDS=10

# OpenAI
OPENAI_API_KEY=sk-... (get from OpenAI dashboard)

# Stripe (for later)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000

# Limits
FREE_URLS_LIMIT=25
FREE_CLICKS_LIMIT=2500
```

### Step 4: Core Backend Implementation

**src/server.js**
```javascript
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected');

    // Connect to Redis
    await connectRedis();
    console.log('✅ Redis connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
```

**src/app.js**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Redirect handler (most important!)
app.get('/:code', require('./controllers/urlController').redirect);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
```

**src/config/database.js**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

module.exports = connectDB;
```

**src/config/redis.js**
```javascript
const Redis = require('ioredis');

let redis;

const connectRedis = async () => {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redis.on('connect', () => {
    console.log('Redis Client Connected');
  });

  return redis;
};

const getRedis = () => {
  if (!redis) {
    throw new Error('Redis not initialized');
  }
  return redis;
};

module.exports = { connectRedis, getRedis };
```

**src/models/Url.js**
```javascript
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  title: String,
  description: String,
  keywords: [String],
  qrCode: String,
  customizable: {
    type: Boolean,
    default: true
  },
  clicks: {
    count: { type: Number, default: 0 },
    limit: { type: Number, default: null },
    lastClickedAt: Date
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    ip: String,
    userAgent: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Index for faster lookups
urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ clicks: 1 });
urlSchema.index({ shortCode: 1, isActive: 1 });

// Check if URL has expired
urlSchema.methods.hasExpired = function() {
  if (this.clicks.limit && this.clicks.count >= this.clicks.limit) {
    return true;
  }
  if (this.expiresAt && new Date() > this.expiresAt) {
    return true;
  }
  return false;
};

module.exports = mongoose.model('Url', urlSchema);
```

**src/services/aiService.js**
```javascript
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateHumanReadableUrl(originalUrl, keywords = [], metadata = {}) {
    try {
      const prompt = `
        Create a human-readable URL slug based on:
        Original URL: ${originalUrl}
        Keywords: ${keywords.join(', ')}
        Title: ${metadata.title || ''}
        Description: ${metadata.description || ''}
        
        Requirements:
        - 2-5 words maximum
        - Use dots (.) as separators
        - Must be memorable and contextual
        - Lowercase only
        - No special characters except dots
        
        Examples:
        - "deals.black.friday.tv"
        - "recipe.chocolate.cake"
        - "review.iphone.fifteen"
        
        Return ONLY the slug, nothing else:
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 30,
      });

      let slug = completion.choices[0].message.content.trim();
      
      // Clean and validate
      slug = this.sanitizeSlug(slug);
      
      return slug;
    } catch (error) {
      console.error('OpenAI Error:', error);
      // Fallback to keyword-based generation
      return this.generateFallbackUrl(keywords, originalUrl);
    }
  }

  sanitizeSlug(slug) {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '')
      .replace(/\.+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .substring(0, 50);
  }

  generateFallbackUrl(keywords, originalUrl) {
    if (keywords && keywords.length > 0) {
      return keywords
        .slice(0, 3)
        .map(k => k.toLowerCase().substring(0, 10))
        .join('.');
    }

    // Extract domain as last resort
    try {
      const url = new URL(originalUrl);
      const domain = url.hostname.replace('www.', '').split('.')[0];
      const random = Math.random().toString(36).substring(7);
      return `${domain}.link.${random}`;
    } catch {
      return `link.${Date.now().toString(36)}`;
    }
  }

  async extractMetadata(url) {
    // In production, use cheerio or puppeteer
    // For MVP, return basic metadata
    return {
      title: '',
      description: '',
      image: ''
    };
  }
}

module.exports = new AIService();
```

**src/controllers/urlController.js**
```javascript
const Url = require('../models/Url');
const aiService = require('../services/aiService');
const QRCode = require('qrcode');
const { getRedis } = require('../config/redis');

class UrlController {
  async createShortUrl(req, res) {
    try {
      const { url, keywords = [], customSlug, expiryClicks } = req.body;
      const userId = req.user?.id;

      // Generate slug
      let shortCode = customSlug;
      if (!shortCode) {
        const metadata = await aiService.extractMetadata(url);
        shortCode = await aiService.generateHumanReadableUrl(
          url, 
          keywords,
          metadata
        );

        // Ensure uniqueness
        let attempts = 0;
        let baseCode = shortCode;
        while (await Url.findOne({ shortCode }) && attempts < 5) {
          shortCode = `${baseCode}.${Date.now().toString(36).slice(-2)}`;
          attempts++;
        }
      }

      // Check if custom slug is taken
      if (customSlug) {
        const existing = await Url.findOne({ shortCode: customSlug });
        if (existing) {
          return res.status(400).json({ 
            error: 'This custom URL is already taken' 
          });
        }
      }

      // Generate QR Code
      const fullUrl = `${process.env.FRONTEND_URL}/${shortCode}`;
      const qrCode = await QRCode.toDataURL(fullUrl, {
        width: 400,
        margin: 2,
      });

      // Create URL document
      const urlDoc = new Url({
        shortCode,
        originalUrl: url,
        userId,
        keywords,
        qrCode,
        clicks: {
          limit: expiryClicks || null
        }
      });

      await urlDoc.save();

      // Cache for fast access
      const redis = getRedis();
      await redis.setex(
        `url:${shortCode}`, 
        3600, 
        JSON.stringify({
          originalUrl: url,
          clicks: 0
        })
      );

      res.status(201).json({
        success: true,
        data: {
          shortUrl: fullUrl,
          shortCode,
          qrCode,
          originalUrl: url,
          expiresAfter: expiryClicks ? `${expiryClicks} clicks` : 'Never'
        }
      });

    } catch (error) {
      console.error('Create URL Error:', error);
      res.status(500).json({ 
        error: 'Failed to create short URL',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async redirect(req, res) {
    try {
      const { code } = req.params;
      const redis = getRedis();

      // Check cache first
      const cached = await redis.get(`url:${code}`);
      if (cached) {
        const data = JSON.parse(cached);
        
        // Async click tracking (don't wait)
        setImmediate(() => this.trackClick(code));
        
        return res.redirect(301, data.originalUrl);
      }

      // Database lookup
      const urlDoc = await Url.findOne({ 
        shortCode: code, 
        isActive: true 
      });

      if (!urlDoc) {
        return res.status(404).send('URL not found');
      }

      // Check if expired
      if (urlDoc.hasExpired()) {
        return res.status(410).send('This link has expired');
      }

      // Track click
      await this.trackClick(code);

      // Update cache
      await redis.setex(
        `url:${code}`,
        3600,
        JSON.stringify({
          originalUrl: urlDoc.originalUrl,
          clicks: urlDoc.clicks.count
        })
      );

      res.redirect(301, urlDoc.originalUrl);

    } catch (error) {
      console.error('Redirect Error:', error);
      res.status(500).send('Server error');
    }
  }

  async trackClick(shortCode) {
    try {
      const redis = getRedis();
      
      // Increment Redis counter
      await redis.incr(`clicks:${shortCode}`);
      
      // Update database (can be done async)
      await Url.findOneAndUpdate(
        { shortCode },
        { 
          $inc: { 'clicks.count': 1 },
          $set: { 'clicks.lastClickedAt': new Date() }
        }
      );

      // Add to trending
      const score = Date.now();
      await redis.zadd('trending:urls', score, shortCode);

    } catch (error) {
      console.error('Click tracking error:', error);
    }
  }

  async getUserUrls(req, res) {
    try {
      const userId = req.user.id;
      
      const urls = await Url.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        success: true,
        data: urls
      });

    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch URLs' });
    }
  }
}

module.exports = new UrlController();
```

## Part 3: Frontend Development

### Step 1: Initialize Frontend

```bash
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --app

# Additional dependencies
npm install axios react-hot-toast framer-motion
npm install recharts react-qr-code
npm install @headlessui/react @heroicons/react
npm install zustand # For state management
npm install react-hook-form zod
```

### Step 2: Frontend Structure

```bash
# Create folder structure
mkdir -p app/{dashboard,api}
mkdir -p components/{ui,layout}
mkdir -p lib/{api,hooks,utils}
mkdir -p styles
mkdir -p public/images
```

### Step 3: Core Frontend Implementation

**app/layout.tsx**
```tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/layout/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SmartLink - AI-Powered Human-Readable URLs',
  description: 'Transform long URLs into memorable, shareable links',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
```

**app/page.tsx**
```tsx
'use client'

import { useState } from 'react'
import UrlShortener from '@/components/UrlShortener'
import Features from '@/components/Features'
import RecentUrls from '@/components/RecentUrls'

export default function Home() {
  const [recentUrls, setRecentUrls] = useState([])

  const handleUrlCreated = (urlData: any) => {
    setRecentUrls(prev => [urlData, ...prev].slice(0, 5))
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          URLs That Make Sense
        </h1>
        <p className="text-xl text-gray-600">
          Transform ugly links into human-readable, memorable URLs with AI
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <UrlShortener onUrlCreated={handleUrlCreated} />
        
        {recentUrls.length > 0 && (
          <div className="mt-12">
            <RecentUrls urls={recentUrls} />
          </div>
        )}
      </div>

      <Features />
    </div>
  )
}
```

**components/UrlShortener.tsx**
```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { createShortUrl } from '@/lib/api/urls'
import QRCode from 'react-qr-code'

interface Props {
  onUrlCreated: (data: any) => void
}

export default function UrlShortener({ onUrlCreated }: Props) {
  const [url, setUrl] = useState('')
  const [keywords, setKeywords] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k)

      const data = await createShortUrl({
        url,
        keywords: keywordArray,
        customSlug: customSlug || undefined,
        expiryClicks: 10
      })

      setResult(data)
      onUrlCreated(data)
      toast.success('Smart link created!')
      
      // Reset form
      setUrl('')
      setKeywords('')
      setCustomSlug('')
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create link')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter your long URL
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url-that-needs-shortening"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                     focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (optional)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="gift, razor, birthday (comma-separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Help AI generate better URLs with relevant keywords
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom URL (optional)
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">smartlink.ai/</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="your.custom.url"
                  pattern="[a-z0-9.]+"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                           focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                   text-white font-semibold rounded-lg hover:from-blue-700 
                   hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transform transition hover:scale-[1.02]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" 
                        stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating Smart Link...
            </span>
          ) : (
            'Create Smart Link'
          )}
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 
                   rounded-xl border border-green-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ✨ Your Smart Link is Ready!
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white 
                          rounded-lg border border-gray-200">
              <span className="font-mono text-lg text-blue-600">
                {result.shortUrl}
              </span>
              <button
                onClick={() => copyToClipboard(result.shortUrl)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg 
                         hover:bg-blue-200 transition-colors"
              >
                Copy
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">QR Code</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCode value={result.shortUrl} size={150} />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Original URL:</span>
                  <p className="text-sm truncate">{result.originalUrl}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Expires:</span>
                  <p className="text-sm font-medium">{result.expiresAfter}</p>
                </div>
                <button
                  onClick={() => window.open(result.shortUrl, '_blank')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Test Link →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
```

**lib/api/urls.ts**
```typescript
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface CreateUrlDto {
  url: string
  keywords?: string[]
  customSlug?: string
  expiryClicks?: number
}

export async function createShortUrl(data: CreateUrlDto) {
  try {
    const response = await axios.post(`${API_URL}/urls`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Network error')
  }
}

export async function getUserUrls() {
  const response = await axios.get(`${API_URL}/urls/my`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  return response.data.data
}

export async function getUrlAnalytics(shortCode: string) {
  const response = await axios.get(`${API_URL}/analytics/${shortCode}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  return response.data.data
}
```

## Part 4: Local Development Setup

### Step 1: Start MongoDB

```bash
# Using Docker (Recommended)
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Or using local installation
mongod --dbpath ~/data/db
```

### Step 2: Start Redis

```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Or using local installation
redis-server
```

### Step 3: Start Backend

```bash
cd backend
npm run dev

# You should see:
# ✅ MongoDB connected
# ✅ Redis connected  
# 🚀 Server running on http://localhost:5000
```

### Step 4: Start Frontend

```bash
# In new terminal
cd frontend
npm run dev

# Open http://localhost:3000
```

## Part 5: Testing Everything

### Test URL Creation

```bash
# Using curl
curl -X POST http://localhost:5000/api/urls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.amazon.com/gp/product/B07XQS3JVK",
    "keywords": ["headphones", "sony", "wireless"]
  }'

# Should return:
# {
#   "success": true,
#   "data": {
#     "shortUrl": "http://localhost:3000/headphones.sony.wireless",
#     "shortCode": "headphones.sony.wireless",
#     "qrCode": "data:image/png;base64,...",
#     "originalUrl": "https://www.amazon.com/...",
#     "expiresAfter": "10 clicks"
#   }
# }
```

### Test Redirect

```bash
# Open in browser
http://localhost:5000/headphones.sony.wireless

# Should redirect to Amazon product page
```

## Part 6: Domain Search & Registration

### Best Domain Options (Check Availability)

```bash
# Top choices for .com domains:
1. smartlink.com - Likely taken, but check
2. humanlink.com 
3. cleverlink.com
4. memorylink.com
5. speakableurl.com
6. sayablelink.com
7. wordlink.com
8. clearlink.com
9. simplelink.com
10. naturallink.com

# Alternative TLDs if .com unavailable:
- smartlink.ai ($50-70/year)
- smartlink.io ($50/year)
- smartlink.app ($20/year)
- smartlink.link ($10/year)
- smartlink.dev ($15/year)

# Check availability:
- Namecheap.com
- GoDaddy.com
- Google Domains
- Cloudflare Registrar (cheapest)
```

## Part 7: Mobile App Development Costs

### After Web MVP Success ($5K MRR achieved)

**Option 1: React Native (Recommended)**
```
Development Time: 8-10 weeks
Cost Breakdown:
- React Native Developer: $5,000-$8,000
- UI/UX Design: $2,000-$3,000
- QR Scanner Integration: $500
- Testing (iOS + Android): $1,500
- App Store Fees: $125 (Apple) + $25 (Google)
- Total: $9,000-$13,000
```

**Option 2: Flutter**
```
Development Time: 6-8 weeks  
Cost Breakdown:
- Flutter Developer: $4,000-$7,000
- Design: $2,000
- Testing: $1,000
- Publishing: $150
- Total: $7,000-$10,000
```

**Option 3: Progressive Web App (PWA)**
```
Development Time: 3-4 weeks
Cost Breakdown:
- PWA Development: $2,000-$3,000
- Service Worker Setup: $500
- Testing: $500
- Total: $3,000-$4,000
```

### Mobile-Specific Features

```javascript
// QR Scanning Feature (React Native)
import { Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'

export function QRScanner({ onScan }) {
  const handleBarCodeScanned = ({ type, data }) => {
    // Send to backend for AI processing
    createSmartLinkFromQR(data)
      .then(result => {
        // Show result: "product.nike.shoes.2024"
        onScan(result)
      })
  }

  return (
    <Camera
      onBarCodeScanned={handleBarCodeScanned}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
      }}
    />
  )
}
```

## Part 8: Using Claude/Cursor for Development

### Best Approach: Cursor + Claude

**Setup Cursor with Claude:**

1. **Install Cursor** from cursor.sh
2. **Configure Claude** in settings
3. **Create project files:**

```bash
# Create instruction files
touch CLAUDE.md
touch INITIAL.md
touch .cursorrules
```

**CLAUDE.md** (Project context for Claude):
```markdown
# SmartLink Project

## Overview
AI-powered URL shortener that creates human-readable URLs instead of random strings.

## Tech Stack
- Backend: Node.js, Express, MongoDB, Redis
- Frontend: Next.js, TypeScript, Tailwind
- AI: OpenAI GPT-4o-mini
- Deployment: Vercel + Railway

## Core Features
1. Convert long URLs to human-readable format
2. AI-powered keyword extraction
3. QR code generation
4. Click tracking and analytics
5. Custom URL creation

## Current Task
Building MVP with focus on:
- Fast URL generation (<500ms)
- Reliable redirect system
- Clean, modern UI
- Comprehensive testing

## Code Style
- Functional programming where possible
- Clear variable names
- Comprehensive error handling
- TypeScript for type safety
```

**.cursorrules** (Coding standards):
```
# Code Style Rules

- Use TypeScript for all new files
- Prefer async/await over callbacks
- Always handle errors properly
- Add comments for complex logic
- Keep functions under 20 lines
- Use descriptive variable names
- Test every endpoint
- Validate all user input
```

### Using Claude Code vs Cursor

**Claude Code (Terminal):**
- Best for: Quick scripts, one-off tasks
- Command: `claude-code "create a script to test URL generation"`

**Cursor (Recommended):**
- Best for: Full application development
- Features:
  - Multi-file context awareness
  - Inline code suggestions
  - Chat-based refactoring
  - Git integration

**Workflow:**
1. Open project in Cursor
2. Use Cmd+K for inline edits
3. Use Cmd+L for chat assistance
4. Reference CLAUDE.md for context

## Part 9: Complete Testing Strategy

### Backend Testing

```javascript
// backend/tests/url.test.js
const request = require('supertest')
const app = require('../src/app')

describe('URL Shortener', () => {
  test('Creates human-readable URL', async () => {
    const response = await request(app)
      .post('/api/urls')
      .send({
        url: 'https://amazon.com/product/B123',
        keywords: ['laptop', 'dell']
      })

    expect(response.status).toBe(201)
    expect(response.body.data.shortCode).toMatch(/^[a-z0-9.]+$/)
    expect(response.body.data.shortCode).toContain('laptop')
  })

  test('Redirects correctly', async () => {
    const response = await request(app)
      .get('/laptop.dell.deals')
      .expect(301)
    
    expect(response.headers.location).toBeTruthy()
  })
})
```

### Frontend Testing

```typescript
// frontend/__tests__/UrlShortener.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UrlShortener from '@/components/UrlShortener'

test('creates short URL', async () => {
  render(<UrlShortener onUrlCreated={jest.fn()} />)
  
  const input = screen.getByPlaceholderText(/long-url/i)
  fireEvent.change(input, {
    target: { value: 'https://example.com/test' }
  })
  
  const button = screen.getByText(/create smart link/i)
  fireEvent.click(button)
  
  await waitFor(() => {
    expect(screen.getByText(/your smart link is ready/i)).toBeInTheDocument()
  })
})
```

### Load Testing

```yaml
# backend/loadtest.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 20
      name: "Ramp up"

scenarios:
  - name: "Create and Visit"
    flow:
      - post:
          url: "/api/urls"
          json:
            url: "https://example.com/{{ $randomNumber() }}"
      - think: 1
      - get:
          url: "/{{ shortCode }}"
```

Run: `npx artillery run loadtest.yml`

## Deployment Preparation (After Local Success)

### Production Environment Variables

```env
# Production .env
NODE_ENV=production
MONGODB_URI=mongodb+srv://... (MongoDB Atlas)
REDIS_URL=redis://... (Redis Cloud)
OPENAI_API_KEY=sk-...
JWT_SECRET=generated-secure-key
FRONTEND_URL=https://smartlink.ai
API_URL=https://api.smartlink.ai
```

### Deployment Commands

```bash
# Backend to Railway
cd backend
railway login
railway init
railway up

# Frontend to Vercel
cd frontend
vercel --prod
```

---

## Next Steps After Local MVP Works

1. **Domain Purchase** ($10-50)
2. **SSL Certificate** (Free with Cloudflare)
3. **MongoDB Atlas** (Free tier)
4. **Redis Cloud** (Free 30MB)
5. **Vercel Deployment** (Free)
6. **Railway Deployment** ($5/month)
7. **OpenAI Credits** ($20/month)

**Total Monthly Cost to Go Live: ~$25-30**

---

*You now have everything needed to build a complete working MVP locally. Start with Part 2 (Backend) as it's the foundation everything else depends on.*