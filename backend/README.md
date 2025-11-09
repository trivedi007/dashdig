# Dashdig Backend API - Humanize and Shortenize URLs

> Transform cryptic URLs into human-readable links with AI-powered contextual shortening

[![Version](https://img.shields.io/badge/version-1.2.0-orange.svg)](https://github.com/dashdig/backend)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

---

## 🎯 What is Dashdig?

Dashdig is an AI-powered URL shortener that creates **human-readable, memorable links**. Instead of cryptic strings like `bit.ly/3x7Kq2`, you get beautiful URLs like `dashdig.com/Best.Coffee.In.Seattle`.

**Humanize and Shortenize URLs** - Make the web more memorable!

---

## ✨ Features

### 🧠 AI-Powered URL Humanization
- Uses Claude AI to analyze webpage content
- Generates contextual, meaningful slugs
- Understands product names, brands, and content themes

### ⚡ Fast URL Shortenization
- Sub-50ms response times
- Redis caching for instant lookups
- Optimized database queries

### 📊 Analytics and Click Tracking
- Real-time click analytics
- Geographic data (country, city)
- Device and browser detection
- Referrer tracking

### 📱 QR Code Generation
- Instant QR code creation
- Multiple formats (PNG, SVG)
- Customizable sizes

### 🔒 Secure and Privacy-First
- JWT authentication
- Rate limiting
- API key management
- No tracking cookies

### 🌐 Custom Domains
- Bring your own domain
- SSL/TLS support
- Domain verification

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.0.0
- MongoDB ≥ 5.0
- Redis ≥ 6.0
- Anthropic API key (for AI features)

### Installation

```bash
# Clone repository
git clone https://github.com/dashdig/backend.git
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/dashdig
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# AI Service
ANTHROPIC_API_KEY=your-anthropic-key
AI_MODEL=claude-3-5-sonnet-20241022

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@dashdig.com

# Frontend
FRONTEND_URL=https://dashdig.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

---

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

### URL Operations

#### Humanize and Shortenize URL
```http
POST /api/urls
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://www.amazon.com/dp/B08N5WRWNW",
  "customSlug": "Amazon.Laptop.Deal",
  "domain": "dashdig.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "URL successfully humanized and shortenized",
  "data": {
    "slug": "Amazon.Laptop.Deal",
    "originalUrl": "https://www.amazon.com/dp/B08N5WRWNW",
    "shortUrl": "https://dashdig.com/Amazon.Laptop.Deal",
    "qrCodeUrl": "https://api.dashdig.com/qr/Amazon.Laptop.Deal",
    "createdAt": "2025-01-09T18:00:00Z"
  }
}
```

#### Get All URLs
```http
GET /api/urls
Authorization: Bearer <token>
```

#### Get Single URL
```http
GET /api/urls/:slug
Authorization: Bearer <token>
```

#### Delete URL
```http
DELETE /api/urls/:id
Authorization: Bearer <token>
```

### Analytics

#### Get URL Analytics
```http
GET /api/analytics/:slug
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "slug": "Amazon.Laptop.Deal",
    "clicks": 1247,
    "uniqueVisitors": 892,
    "countries": ["US", "CA", "GB"],
    "devices": {
      "mobile": 60,
      "desktop": 35,
      "tablet": 5
    },
    "topReferrers": ["twitter.com", "facebook.com"],
    "clicksByDay": [...]
  }
}
```

### QR Code Generation

#### Generate QR Code
```http
GET /api/qr/:slug
```

---

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis
- **AI**: Anthropic Claude API
- **Authentication**: JWT
- **Email**: Nodemailer
- **QR Codes**: node-qrcode

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── branding.js          # Brand constants & messaging
│   │   ├── database.js          # MongoDB configuration
│   │   └── redis.js             # Redis configuration
│   │
│   ├── controllers/
│   │   ├── url.controller.js    # URL CRUD operations
│   │   ├── auth.controller.js   # Authentication
│   │   ├── analytics.controller.js
│   │   └── ...
│   │
│   ├── models/
│   │   ├── Url.js               # URL schema
│   │   ├── User.js              # User schema
│   │   ├── Analytics.js         # Analytics schema
│   │   └── ...
│   │
│   ├── services/
│   │   ├── ai.service.js        # Claude AI integration
│   │   ├── email.service.js     # Email sending
│   │   ├── analytics.service.js # Analytics tracking
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── cache.js             # Redis caching
│   │
│   ├── routes/
│   │   ├── url.route.js
│   │   ├── auth.js
│   │   └── ...
│   │
│   ├── utils/
│   │   └── ...
│   │
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
│
├── tests/
│   ├── smartUrl.test.js
│   ├── slugApi.integration.test.js
│   └── ...
│
├── package.json
├── README.md
└── .env.example
```

### AI-Powered Smart URL Generation

1. **URL Analysis**: Extract domain, path, query parameters
2. **Content Fetching**: Scrape webpage metadata (title, description)
3. **AI Processing**: Send to Claude AI for contextual understanding
4. **Slug Generation**: Create human-readable slug based on AI analysis
5. **Validation**: Ensure slug is unique and follows naming rules
6. **Storage**: Save to MongoDB with metadata

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm run test:pattern

# Run integration tests
npm run test:api
```

---

## 📊 Performance

- **URL Creation**: <500ms (including AI processing)
- **URL Redirect**: <50ms (with Redis cache)
- **Analytics Tracking**: Async, no redirect delay
- **QR Code Generation**: <100ms
- **Database Queries**: Optimized with indexes

### Optimization Techniques
- Redis caching for hot URLs
- MongoDB indexes on shortCode and userId
- Async analytics tracking
- Connection pooling
- Compression middleware
- Rate limiting

---

## 🔒 Security

### Authentication
- JWT-based authentication
- Bcrypt password hashing
- Token expiration and refresh

### Rate Limiting
- 100 requests per 15 minutes (default)
- Configurable per endpoint
- Redis-backed for distributed systems

### Data Protection
- Input validation and sanitization
- SQL injection prevention (Mongoose)
- XSS protection
- CORS configuration
- Helmet.js security headers

### API Keys
- Separate API keys for programmatic access
- Key rotation support
- Usage tracking

---

## 📈 Monitoring

### Logging
- Structured logging with winston
- Log levels: error, warn, info, debug
- Log rotation

### Metrics
- Request/response times
- Error rates
- Cache hit/miss ratios
- AI API usage

### Alerts
- Database connection failures
- AI API errors
- High error rates
- Rate limit violations

---

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t dashdig-backend .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/dashdig \
  -e REDIS_URL=redis://redis:6379 \
  dashdig-backend
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Railway / Heroku

```bash
# Push to Railway
railway up

# Set environment variables
railway variables set MONGODB_URI=<your-uri>
railway variables set REDIS_URL=<your-url>

# Deploy
railway deploy
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- ESLint configuration provided
- Run `npm run lint` before committing
- Follow Node.js best practices

---

## 📄 API Documentation

Full API documentation available at:
- **Swagger UI**: https://api.dashdig.com/docs
- **Postman Collection**: [Download](https://dashdig.com/api/postman)

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB is running
mongosh --eval "db.version()"

# Check connection string
echo $MONGODB_URI
```

**Redis Connection Failed**
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

**AI API Errors**
```bash
# Verify API key
echo $ANTHROPIC_API_KEY

# Check API status
curl https://api.anthropic.com/v1/health
```

---

## 📞 Support

- **Website**: [dashdig.com](https://dashdig.com)
- **Documentation**: [dashdig.com/docs](https://dashdig.com/docs)
- **Email**: support@dashdig.com
- **Issues**: [GitHub Issues](https://github.com/dashdig/backend/issues)

---

## 📜 License

ISC © 2025 Dashdig Team

---

## 🙏 Acknowledgments

- **Claude AI** by Anthropic for intelligent slug generation
- **MongoDB** for scalable data storage
- **Redis** for blazing-fast caching
- Open source community

---

**⚡ Humanize and Shortenize URLs - Making the web more memorable**

Built with ❤️ by the Dashdig team

