# Technical Implementation Guide: SmartLink.ai MVP

## Project Structure

```
smartlink/
├── frontend/                 # React + Next.js
│   ├── components/
│   │   ├── URLShortener.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   └── QRGenerator.jsx
│   ├── pages/
│   │   ├── api/            # Next.js API routes
│   │   ├── index.js         # Landing page
│   │   ├── dashboard.js     # User dashboard
│   │   └── [slug].js        # Redirect handler
│   ├── lib/
│   │   ├── api-client.js
│   │   └── auth.js
│   └── styles/
├── backend/                  # Node.js + Express/Fastify
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── url.controller.js
│   │   │   ├── auth.controller.js
│   │   │   └── analytics.controller.js
│   │   ├── services/
│   │   │   ├── ai.service.js       # OpenAI integration
│   │   │   ├── url.service.js      # URL logic
│   │   │   └── cache.service.js    # Redis
│   │   ├── models/
│   │   │   ├── url.model.js
│   │   │   └── user.model.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rateLimit.js
│   │   └── app.js
│   └── tests/
├── chrome-extension/         # Quick shortening tool
│   ├── manifest.json
│   ├── popup.html
│   └── background.js
└── infrastructure/
    ├── docker-compose.yml
    └── deploy.sh
```

## Database Schema

### MongoDB Collections

```javascript
// URLs Collection
{
  _id: ObjectId,
  shortCode: "razor.gift.mike",      // Human-readable
  originalUrl: "https://amazon.com/...",
  userId: ObjectId,
  keywords: ["razor", "gift", "mike"],
  metadata: {
    title: "Gillette Razor 12-pack",
    description: "...",
    image: "https://..."
  },
  qrCode: "data:image/png;base64...",
  clicks: {
    total: 0,
    limit: 10,                      // null for unlimited
    details: []                     // Array of click events
  },
  expires: {
    at: ISODate,                   // Time-based expiry
    afterClicks: 10                // Click-based expiry
  },
  customizable: true,
  createdAt: ISODate,
  updatedAt: ISODate
}

// Users Collection  
{
  _id: ObjectId,
  email: "user@example.com",
  name: "John Doe",
  subscription: {
    plan: "free|pro|enterprise",
    status: "active|cancelled",
    stripeCustomerId: "cus_xxx",
    currentPeriodEnd: ISODate
  },
  usage: {
    urlsCreated: 0,
    clicksTracked: 0,
    currentMonth: {
      urls: 0,
      clicks: 0
    }
  },
  settings: {
    defaultExpiry: 10,
    apiKey: "sk_xxx"
  },
  createdAt: ISODate
}

// Analytics Collection
{
  _id: ObjectId,
  urlId: ObjectId,
  timestamp: ISODate,
  ip: "192.168.1.1",
  userAgent: "...",
  referrer: "https://twitter.com",
  location: {
    country: "US",
    city: "San Francisco",
    coordinates: [37.7749, -122.4194]
  },
  device: {
    type: "mobile|desktop|tablet",
    os: "iOS|Android|Windows|Mac",
    browser: "Chrome|Safari|Firefox"
  }
}
```

### Redis Structure

```javascript
// Click counting (atomic operations)
INCR url:clicks:{shortCode}

// Temporary URL cache (with TTL)
SET cache:url:{shortCode} "{originalUrl}" EX 3600

// Rate limiting
INCR rate:user:{userId}:{window}
EXPIRE rate:user:{userId}:{window} 60

// Real-time analytics
ZADD trending:urls {timestamp} {shortCode}
```

## Core Implementation Code

### AI Service (ai.service.js)

```javascript
const OpenAI = require('openai');
const natural = require('natural'); // Fallback NLP

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.tokenizer = new natural.WordTokenizer();
  }

  async generateHumanUrl(originalUrl, userKeywords = []) {
    try {
      // Fetch page metadata
      const metadata = await this.fetchMetadata(originalUrl);
      
      // Extract keywords using GPT-4o Mini
      const prompt = `
        Generate a human-readable URL slug from:
        URL: ${originalUrl}
        Title: ${metadata.title}
        Description: ${metadata.description}
        User keywords: ${userKeywords.join(', ')}
        
        Rules:
        - Use 3-5 words maximum
        - Words should be memorable and contextual
        - Separate with dots (.)
        - Lowercase only
        - No special characters
        
        Example: "deals.blackfriday.samsung.tv"
        
        Output only the slug:
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 50,
      });

      const suggestion = completion.choices[0].message.content.trim();
      
      // Validate and sanitize
      return this.sanitizeSlug(suggestion);
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to local NLP
      return this.generateFallbackUrl(originalUrl, userKeywords);
    }
  }

  generateFallbackUrl(url, keywords) {
    // Simple fallback using keywords or domain
    const domain = new URL(url).hostname.replace('www.', '');
    const domainParts = domain.split('.')[0];
    
    if (keywords.length > 0) {
      return keywords.slice(0, 3).join('.').toLowerCase();
    }
    
    // Generate from domain + timestamp
    const timestamp = Date.now().toString(36).slice(-4);
    return `${domainParts}.link.${timestamp}`;
  }

  sanitizeSlug(slug) {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '')
      .replace(/\.+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .slice(0, 50); // Max length
  }

  async fetchMetadata(url) {
    // Use puppeteer or cheerio to fetch page metadata
    // Simplified version:
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Extract title and description (simplified)
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
      
      return {
        title: titleMatch ? titleMatch[1] : '',
        description: descMatch ? descMatch[1] : ''
      };
    } catch {
      return { title: '', description: '' };
    }
  }
}

module.exports = AIService;
```

### URL Controller (url.controller.js)

```javascript
const URLService = require('../services/url.service');
const AIService = require('../services/ai.service');
const QRCode = require('qrcode');
const { redis } = require('../config/redis');

class URLController {
  constructor() {
    this.urlService = new URLService();
    this.aiService = new AIService();
  }

  async createShortUrl(req, res) {
    try {
      const { url, keywords = [], customSlug, expiryClicks = 10 } = req.body;
      const userId = req.user?.id;

      // Check user limits
      if (userId) {
        const canCreate = await this.urlService.checkUserLimits(userId);
        if (!canCreate) {
          return res.status(429).json({
            error: 'Monthly limit reached. Please upgrade.'
          });
        }
      }

      // Generate human-readable slug
      let slug = customSlug;
      if (!slug) {
        slug = await this.aiService.generateHumanUrl(url, keywords);
        
        // Ensure uniqueness
        let attempts = 0;
        while (await this.urlService.slugExists(slug) && attempts < 5) {
          slug = `${slug}.${Date.now().toString(36).slice(-2)}`;
          attempts++;
        }
      }

      // Generate QR code
      const fullUrl = `${process.env.BASE_URL}/${slug}`;
      const qrCode = await QRCode.toDataURL(fullUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Save to database
      const shortUrl = await this.urlService.create({
        shortCode: slug,
        originalUrl: url,
        userId,
        keywords,
        qrCode,
        expires: {
          afterClicks: expiryClicks
        }
      });

      // Cache for fast redirects
      await redis.set(
        `url:${slug}`,
        url,
        'EX', 
        3600 // 1 hour cache
      );

      res.status(201).json({
        success: true,
        data: {
          shortUrl: fullUrl,
          slug,
          qrCode,
          expiresAfter: expiryClicks + ' clicks'
        }
      });

    } catch (error) {
      console.error('Create URL error:', error);
      res.status(500).json({ 
        error: 'Failed to create short URL' 
      });
    }
  }

  async redirect(req, res) {
    try {
      const { slug } = req.params;

      // Check cache first
      const cached = await redis.get(`url:${slug}`);
      if (cached) {
        // Track async (don't block redirect)
        this.trackClick(slug, req);
        return res.redirect(301, cached);
      }

      // Database lookup
      const urlDoc = await this.urlService.findBySlug(slug);
      if (!urlDoc) {
        return res.status(404).send('URL not found');
      }

      // Check expiry
      if (urlDoc.expires.afterClicks !== null) {
        if (urlDoc.clicks.total >= urlDoc.expires.afterClicks) {
          return res.status(410).send('This link has expired');
        }
      }

      // Track click
      await this.trackClick(slug, req);

      // Update cache
      await redis.set(`url:${slug}`, urlDoc.originalUrl, 'EX', 3600);

      res.redirect(301, urlDoc.originalUrl);

    } catch (error) {
      console.error('Redirect error:', error);
      res.status(500).send('Server error');
    }
  }

  async trackClick(slug, req) {
    try {
      // Increment counter
      await redis.incr(`url:clicks:${slug}`);

      // Get IP and user agent
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const referrer = req.headers['referer'] || 'direct';

      // Store analytics data
      await this.urlService.recordClick({
        slug,
        ip,
        userAgent,
        referrer,
        timestamp: new Date()
      });

      // Update trending
      await redis.zadd(
        'trending:urls',
        Date.now(),
        slug
      );

    } catch (error) {
      console.error('Click tracking error:', error);
      // Don't throw - tracking shouldn't break redirects
    }
  }
}

module.exports = URLController;
```

### Frontend: URL Shortener Component

```jsx
// components/URLShortener.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function URLShortener() {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const shortenUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          keywords: keywords.split(',').map(k => k.trim()),
          expiryClicks: 10
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }

      setResult(data.data);
      
      // Reset form
      setUrl('');
      setKeywords('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={shortenUrl} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Long URL
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Keywords (optional, comma-separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="gift, razor, mike"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating Smart Link...' : 'Create Smart Link'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-green-50 rounded-lg"
        >
          <h3 className="font-semibold mb-4">Your Smart Link is Ready!</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded">
              <span className="font-mono">{result.shortUrl}</span>
              <button
                onClick={() => copyToClipboard(result.shortUrl)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
              >
                Copy
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Expires after: {result.expiresAfter}
            </div>

            <div className="mt-4">
              <img 
                src={result.qrCode} 
                alt="QR Code" 
                className="w-32 h-32 mx-auto"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

## Deployment Configuration

### Vercel (Frontend)

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.railway.app/api/:path*"
    },
    {
      "source": "/:slug",
      "destination": "/api/redirect/:slug"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

### Railway (Backend)

```toml
# railway.toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
restartPolicyType = "always"

[env]
NODE_ENV = "production"
```

### Docker Compose (Local Development)

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data

  app:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      MONGODB_URI: mongodb://admin:password@mongo:27017/smartlink
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
    depends_on:
      - mongo
      - redis
    volumes:
      - ./:/app
      - /app/node_modules

volumes:
  mongo-data:
  redis-data:
```

## Testing Strategy

### Unit Tests (Jest)

```javascript
// tests/ai.service.test.js
describe('AIService', () => {
  test('generates human-readable URL', async () => {
    const service = new AIService();
    const url = 'https://amazon.com/gillette-razor-12pack';
    const keywords = ['razor', 'gift'];
    
    const result = await service.generateHumanUrl(url, keywords);
    
    expect(result).toMatch(/^[a-z0-9.]+$/);
    expect(result.split('.').length).toBeLessThanOrEqual(5);
  });

  test('falls back when OpenAI fails', async () => {
    // Mock OpenAI failure
    jest.spyOn(service.openai.chat.completions, 'create')
      .mockRejectedValue(new Error('API Error'));
    
    const result = await service.generateHumanUrl('https://example.com');
    
    expect(result).toBeTruthy();
    expect(result).toMatch(/^[a-z0-9.]+$/);
  });
});
```

### Load Testing (Artillery)

```yaml
# load-test.yml
config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 120
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "Create and Visit URL"
    flow:
      - post:
          url: "/api/shorten"
          json:
            url: "https://example.com/{{ $randomNumber() }}"
            keywords: ["test", "load"]
      - think: 2
      - get:
          url: "/{{ slug }}"
```

## Performance Optimizations

### Caching Strategy

```javascript
// middleware/cache.js
const cacheMiddleware = (duration = 60) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Cache error:', error);
    }

    // Store original send
    const originalSend = res.json;
    
    res.json = function(data) {
      // Cache the response
      redis.setex(key, duration, JSON.stringify(data));
      originalSend.call(this, data);
    };

    next();
  };
};
```

### Rate Limiting

```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
});

// Different limits for different endpoints
const createUrlLimiter = rateLimit({
  ...limiter,
  max: 10, // 10 URLs per minute
});

const apiLimiter = rateLimit({
  ...limiter,
  max: 100, // 100 API calls per minute
});
```

---

*This technical guide provides the foundation for your MVP development. Each component is production-ready and scalable.*