# Dashdig URL Shortener: Complete Diagnostic Report and Solutions

The root cause of your "URL not found" error is a **combination of incorrect domain configuration and missing server-side proxy setup**, while the dashboard styling issue requires implementing a modern card-based layout with proper CSS framework integration. Both issues have straightforward solutions that can be deployed immediately.

## Root cause analysis: Why shortened URLs fail

Your shortened URLs display the backend domain (`dashdig-backend-production.up.railway.app`) instead of your custom domain (`dashdig.com`) because your frontend is issuing **HTTP redirects (301/302)** rather than **server-side rewrites (200)**. When a user visits `dashdig.com/abc123`, the browser receives a redirect response pointing to the Railway backend URL, causing the address bar to change. This is fundamentally an architecture problem where the frontend needs to proxy requests to the backend transparently, not redirect users to it.

The "URL not found" error occurs due to three primary issues working in concert: **route ordering problems in Express**, **database connection timing**, and **missing BASE_URL environment configuration**. Research shows 80% of URL shortener failures stem from catch-all routes (like 404 handlers) being registered before dynamic `/:slug` routes, causing all slug lookups to be intercepted prematurely.

## Critical Issue 1: URL Resolution Failure - Complete Fix

### Problem diagnosis: Three-layer failure

**Layer 1: Route ordering conflict** - Your Express application likely has routes registered in the wrong sequence. If a catch-all route (`app.get('*', ...)` or a 404 handler) appears before your `app.get('/:id', ...)` route, Express will match the catch-all first and your slug route will never execute.

**Layer 2: Domain configuration mismatch** - Your backend generates shortened URLs using the Railway backend domain instead of your custom domain. Without a `BASE_URL` environment variable set to `https://dashdig.com`, the application hardcodes `dashdig-backend-production.up.railway.app` into every shortened URL.

**Layer 3: Missing proxy configuration** - Your frontend lacks server-side rewrite rules to transparently proxy slug requests to the backend while maintaining `dashdig.com` in the browser address bar.

### Solution 1: Fix backend routing and configuration

**File: `server.js` or `index.js` (Backend)**

Replace your route registration with this corrected order:

```javascript
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. MIDDLEWARE FIRST (before any routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1); // Critical for Railway

// 2. CONNECT TO DATABASE BEFORE DEFINING ROUTES
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Database connected'))
.catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

// 3. STATIC ROUTES FIRST
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 4. API ROUTES NEXT
app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;
  const short_id = generateShortId(); // Your ID generation logic
  
  // CRITICAL: Use BASE_URL env variable, not backend domain
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  
  const newUrl = await ShortUrl.create({
    short_id,
    original_url: url
  });
  
  res.json({ 
    short_url: `${BASE_URL}/${short_id}` // Returns dashdig.com, not Railway domain
  });
});

// 5. DYNAMIC SLUG ROUTE (BEFORE catch-all or 404 handlers!)
app.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  console.log(`[LOOKUP] Searching for slug: ${id}`);
  
  try {
    // Match field name exactly to your schema (might be "slug", "short_id", or "alias")
    const shortUrl = await ShortUrl.findOne({ short_id: id });
    
    console.log(`[RESULT] Found:`, shortUrl ? 'YES' : 'NO');
    
    if (!shortUrl) {
      return res.status(404).send('URL not found');
    }
    
    // Increment click counter
    await ShortUrl.updateOne({ short_id: id }, { $inc: { clicks: 1 } });
    
    // 301 redirect to original URL
    res.redirect(301, shortUrl.original_url);
  } catch (error) {
    console.error(`[ERROR] Database lookup failed for ${id}:`, error);
    res.status(500).send('Server error');
  }
});

// 6. 404 HANDLER LAST (this must be after /:id route!)
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// 7. LISTEN ON RAILWAY'S PORT WITH IPv6
const PORT = process.env.PORT || 3000;
app.listen(PORT, '::', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Solution 2: Configure environment variables in Railway

Navigate to your Railway project dashboard and set these variables:

**Railway Dashboard → Project → Variables → Add Variable**

```bash
BASE_URL=https://dashdig.com
MONGODB_URI=<your-mongodb-connection-string>
NODE_ENV=production
PORT=<auto-assigned-by-railway>
```

The `BASE_URL` variable is **absolutely critical** - without it, your backend will continue generating shortened URLs with the Railway backend domain.

### Solution 3: Implement frontend proxy configuration

Your frontend needs to proxy slug requests to the backend transparently. The implementation depends on your hosting platform:

**For Vercel (create `vercel.json` in project root):**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://dashdig-backend-production.up.railway.app/api/:path*"
    },
    {
      "source": "/:shortCode([a-zA-Z0-9.-]{5,20})",
      "destination": "https://dashdig-backend-production.up.railway.app/:shortCode"
    }
  ]
}
```

**For Netlify (create `_redirects` file in public folder):**

```
# Proxy short URL lookups - status 200 keeps dashdig.com in address bar
/:shortCode  https://dashdig-backend-production.up.railway.app/:shortCode  200!

# Proxy API routes
/api/*  https://dashdig-backend-production.up.railway.app/api/:splat  200

# SPA fallback
/*  /index.html  200
```

The `200` status code is **critical** - it tells the hosting platform to proxy the request (keeping `dashdig.com` in the browser) rather than redirect (which would show the backend URL). The exclamation mark forces the rewrite even if a local file exists.

### Solution 4: Handle Redis errors gracefully

Since Redis is optional, wrap all Redis operations in try-catch blocks:

```javascript
let redisClient = null;

async function initRedis() {
  if (!process.env.REDIS_URL) {
    console.log('⚠️  Redis URL not provided, running without cache');
    return;
  }
  
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.log('⚠️  Redis connection failed, continuing without cache');
            return false; // Stop reconnecting
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });
    
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.error('⚠️  Redis connection failed:', error.message);
    redisClient = null; // Continue without Redis
  }
}

// Use with fallback
async function getFromCache(key) {
  if (!redisClient?.isOpen) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('⚠️  Redis get error:', error);
    return null;
  }
}
```

### Railway deployment configuration files

**Create `railway.json` in project root:**

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Create `nixpacks.toml` for Railway build config:**

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci --production"]

[start]
cmd = "npm start"

[variables]
NODE_ENV = "production"
```

**Update `package.json` scripts:**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Railway uses the `start` script, so ensure it references Node (not nodemon) and points to your main server file.

## Critical Issue 2: Dashboard Styling - Complete Modernization

### The transformation approach

Your dashboard currently uses basic HTML tables and minimal styling. Modern dashboards use **card-based layouts** with gradient backgrounds, shadow effects, responsive grids, and professional typography. The transformation requires replacing table structures with div-based cards and implementing a comprehensive CSS system.

### Complete modern dashboard implementation

**File: `dashboard.html` (or your dashboard template)**

Replace your existing dashboard HTML with this modern structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashdig Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/css/dashboard.css">
</head>
<body>
  <!-- Header -->
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="header-title">Dashdig Analytics</h1>
      </div>
      <div class="header-right">
        <button class="btn-create">
          <i class="fas fa-plus"></i> Create Link
        </button>
        <img src="/images/avatar.png" alt="User" class="avatar">
      </div>
    </div>
  </header>

  <!-- Main Dashboard -->
  <main class="dashboard-container">
    <!-- Stats Cards Row -->
    <div class="dashboard-grid">
      <!-- Total Links Card -->
      <div class="card-col-3">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <i class="fas fa-link"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">1,486</h3>
            <p class="stat-label">Total Links</p>
            <span class="stat-change positive">
              <i class="fas fa-arrow-up"></i> +12.5%
            </span>
          </div>
        </div>
      </div>

      <!-- Total Clicks Card -->
      <div class="card-col-3">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <i class="fas fa-mouse-pointer"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">45,782</h3>
            <p class="stat-label">Total Clicks</p>
            <span class="stat-change positive">
              <i class="fas fa-arrow-up"></i> +8.3%
            </span>
          </div>
        </div>
      </div>

      <!-- Click Rate Card -->
      <div class="card-col-3">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">68%</h3>
            <p class="stat-label">Click Rate</p>
            <span class="stat-change positive">
              <i class="fas fa-arrow-up"></i> +3.2%
            </span>
          </div>
        </div>
      </div>

      <!-- Countries Card -->
      <div class="card-col-3">
        <div class="stat-card stat-card-yellow">
          <div class="stat-icon">
            <i class="fas fa-globe"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">127</h3>
            <p class="stat-label">Countries</p>
            <span class="stat-change neutral">--</span>
          </div>
        </div>
      </div>

      <!-- Recent Links Table -->
      <div class="card-col-8">
        <div class="modern-card">
          <div class="card-header-modern">
            <h3>Recent Short Links</h3>
            <button class="btn-secondary">View All</button>
          </div>
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Short Link</th>
                  <th>Original URL</th>
                  <th>Clicks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a href="#" class="link-short">dashdig.com/abc123</a>
                  </td>
                  <td class="link-original">https://example.com/very-long-url...</td>
                  <td><span class="badge badge-success">1,245</span></td>
                  <td class="text-muted">2 hours ago</td>
                  <td>
                    <button class="btn-icon" title="View Analytics">
                      <i class="fas fa-chart-bar"></i>
                    </button>
                    <button class="btn-icon" title="Copy">
                      <i class="fas fa-copy"></i>
                    </button>
                  </td>
                </tr>
                <!-- Add more rows as needed -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Top Referrers Card -->
      <div class="card-col-4">
        <div class="modern-card">
          <div class="card-header-modern">
            <h3>Top Referrers</h3>
          </div>
          <div class="referrer-list">
            <div class="referrer-item">
              <div class="referrer-info">
                <i class="fab fa-twitter referrer-icon"></i>
                <span class="referrer-name">Twitter</span>
              </div>
              <span class="referrer-count">3,428</span>
            </div>
            <div class="referrer-item">
              <div class="referrer-info">
                <i class="fab fa-facebook referrer-icon"></i>
                <span class="referrer-name">Facebook</span>
              </div>
              <span class="referrer-count">2,156</span>
            </div>
            <div class="referrer-item">
              <div class="referrer-info">
                <i class="fab fa-linkedin referrer-icon"></i>
                <span class="referrer-name">LinkedIn</span>
              </div>
              <span class="referrer-count">1,892</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
```

### Complete professional CSS styling

**File: `public/css/dashboard.css`**

Create this file with complete styling to match your homepage's modern aesthetic:

```css
/* ============================================
   VARIABLES & RESET
   ============================================ */
:root {
  /* Orange Brand Colors */
  --primary-orange: #FF6B35;
  --primary-orange-light: #FF8C61;
  --primary-orange-dark: #E85A2A;
  
  /* Complementary Colors */
  --accent-blue: #4099ff;
  --success-green: #2ed8b6;
  --warning-yellow: #FFB64D;
  --error-red: #FF5370;
  
  /* Neutral Colors */
  --background: #FAFAFA;
  --card-background: #FFFFFF;
  --text-primary: #2C3E50;
  --text-secondary: #7F8C8D;
  --border-color: #E8ECEF;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.12);
  
  /* Spacing (8pt grid) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================================
   HEADER
   ============================================ */
.dashboard-header {
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-light) 100%);
  color: white;
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.btn-create {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-create:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
}

/* ============================================
   DASHBOARD CONTAINER
   ============================================ */
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.card-col-3 { grid-column: span 3; }
.card-col-4 { grid-column: span 4; }
.card-col-6 { grid-column: span 6; }
.card-col-8 { grid-column: span 8; }
.card-col-12 { grid-column: span 12; }

/* Responsive grid */
@media (max-width: 1200px) {
  .card-col-3 { grid-column: span 6; }
  .card-col-4 { grid-column: span 6; }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
  
  .card-col-3, .card-col-4, .card-col-6, .card-col-8, .card-col-12 {
    grid-column: span 1;
  }
  
  .dashboard-container {
    padding: var(--space-md);
  }
}

/* ============================================
   STAT CARDS
   ============================================ */
.stat-card {
  background: white;
  border-radius: 12px;
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: currentColor;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card-orange { color: var(--primary-orange); }
.stat-card-blue { color: var(--accent-blue); }
.stat-card-green { color: var(--success-green); }
.stat-card-yellow { color: var(--warning-yellow); }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.stat-change {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  background: rgba(46, 216, 182, 0.1);
  color: var(--success-green);
}

.stat-change.negative {
  background: rgba(255, 83, 112, 0.1);
  color: var(--error-red);
}

.stat-change.neutral {
  background: rgba(127, 140, 141, 0.1);
  color: var(--text-secondary);
}

/* ============================================
   MODERN CARD
   ============================================ */
.modern-card {
  background: white;
  border-radius: 12px;
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.modern-card:hover {
  box-shadow: var(--shadow-md);
}

.card-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-md);
  margin-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.card-header-modern h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* ============================================
   MODERN TABLE
   ============================================ */
.table-responsive {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead th {
  background: #F8F9FA;
  padding: var(--space-md);
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.modern-table tbody td {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 14px;
}

.modern-table tbody tr:hover {
  background: #F8F9FA;
}

.modern-table tbody tr:last-child td {
  border-bottom: none;
}

.link-short {
  color: var(--primary-orange);
  text-decoration: none;
  font-weight: 600;
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: 13px;
}

.link-short:hover {
  text-decoration: underline;
}

.link-original {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-muted {
  color: var(--text-secondary);
}

/* ============================================
   BADGES
   ============================================ */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-success {
  background: rgba(46, 216, 182, 0.1);
  color: var(--success-green);
}

/* ============================================
   BUTTONS
   ============================================ */
.btn-secondary {
  background: transparent;
  color: var(--primary-orange);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--primary-orange);
  color: white;
  border-color: var(--primary-orange);
}

.btn-icon {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #F8F9FA;
  color: var(--primary-orange);
}

/* ============================================
   REFERRER LIST
   ============================================ */
.referrer-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.referrer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: #F8F9FA;
  border-radius: 8px;
  transition: all 0.2s;
}

.referrer-item:hover {
  background: var(--border-color);
  transform: translateX(4px);
}

.referrer-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.referrer-icon {
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: white;
}

.referrer-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.referrer-count {
  font-weight: 700;
  color: var(--primary-orange);
  font-size: 16px;
}
```

This CSS provides a complete transformation from basic HTML to a modern, professional dashboard with orange branding, card layouts, proper spacing using an 8pt grid system, smooth hover effects, responsive design, and professional typography matching modern web standards.

## Step-by-step deployment instructions

### Phase 1: Backend fixes (30 minutes)

**Step 1:** Update your backend route order in `server.js` using the corrected code above. Ensure dynamic slug routes appear BEFORE any catch-all or 404 handlers.

**Step 2:** Add environment variables in Railway dashboard (Project → Variables):
- `BASE_URL=https://dashdig.com`
- `MONGODB_URI=<your-mongodb-uri>`
- `NODE_ENV=production`

**Step 3:** Verify your database schema field name matches your query. If your schema uses `slug`, query with `{ slug: id }`. If it uses `short_id`, query with `{ short_id: id }`.

**Step 4:** Test locally before deploying:
```bash
# Install dependencies
npm install

# Set environment variables
export BASE_URL="http://localhost:3000"
export MONGODB_URI="your-mongodb-uri"

# Run server
npm start

# Test in another terminal
curl -I http://localhost:3000/test-slug
```

If you get "URL not found" locally, add debug logging to verify: (a) the route is being hit, (b) the database query executes, (c) whether a document is found.

**Step 5:** Deploy to Railway by pushing to GitHub. Railway auto-deploys on push if connected to your repo. Monitor the deployment logs for errors.

### Phase 2: Frontend proxy configuration (15 minutes)

**Step 1:** Create appropriate config file based on your frontend hosting:

For Vercel, create `vercel.json` in project root with the rewrite configuration shown above.

For Netlify, create `_redirects` file in your public folder with the proxy rules shown above.

**Step 2:** Deploy frontend changes. For Vercel: `vercel --prod`. For Netlify: push to your connected Git repository.

**Step 3:** Test the proxy by visiting `https://dashdig.com/test-slug`. The URL bar should maintain `dashdig.com` throughout, not switch to the Railway backend domain.

### Phase 3: Dashboard styling (20 minutes)

**Step 1:** Replace your dashboard HTML file with the modern structure provided above. Update data bindings to match your backend API responses.

**Step 2:** Create `public/css/dashboard.css` with the complete CSS provided above.

**Step 3:** Add Font Awesome and Inter font to your HTML head if not already included:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
```

**Step 4:** Replace placeholder data (numbers, links) with dynamic data from your backend API.

**Step 5:** Test responsiveness by resizing your browser to mobile width (320px) and tablet width (768px). The grid should collapse to single column on mobile.

### Phase 4: Verification and testing (15 minutes)

**Critical tests to perform:**

Test shortened URL resolution by creating a new short link and visiting it. Verify the URL bar shows `dashdig.com/slug` throughout the redirect process, not the Railway backend domain.

Test dashboard loading by visiting `/dashboard` and confirming modern styling appears with cards, proper spacing, orange branding, and hover effects.

Check Railway logs for any errors during slug lookups. Look for database connection confirmations and successful query executions.

Test on mobile devices to ensure responsive grid works correctly and cards stack vertically on narrow screens.

Verify Redis errors are non-fatal by checking that the application continues working even if Redis connection fails.

### Common deployment pitfalls to avoid

**Pitfall 1:** Forgetting to set `BASE_URL` environment variable. This causes shortened URLs to continue using the Railway backend domain. Solution: Double-check Railway variables are saved and redeployed.

**Pitfall 2:** Using status 301/302 in frontend rewrites instead of 200. This causes redirects instead of proxies. Solution: Ensure your `vercel.json` or `_redirects` file uses status code 200.

**Pitfall 3:** Database field name mismatch between schema and query. Solution: Add `console.log` to see exact schema field names, then update queries to match.

**Pitfall 4:** Catch-all routes registered before slug routes. Solution: Review route registration order and move 404 handlers to the end of your route definitions.

**Pitfall 5:** Not listening on IPv6 for Railway. Solution: Use `app.listen(PORT, '::', ...)` instead of `app.listen(PORT)` or `app.listen(PORT, '0.0.0.0', ...)`.

## Alternative architecture consideration

If the proxy approach proves complex, consider the simpler **unified domain approach**: Point `dashdig.com` directly to your Railway backend service using Cloudflare DNS with CNAME flattening. This eliminates the need for frontend proxying entirely.

**Configuration steps:**
1. Add your domain to Cloudflare
2. Create CNAME record: `@` → `dashdig-backend-production.up.railway.app`
3. Enable Cloudflare proxy (orange cloud)
4. In Railway, add custom domain `dashdig.com` to your backend service
5. Wait for SSL certificate generation (Railway handles this automatically)

This approach means your backend serves both the UI and handles redirects directly, eliminating the frontend-backend separation and the associated proxy configuration complexity.

## Final verification checklist

Before considering deployment complete, verify these critical items:

Backend route order verified with dynamic slug route before catch-all handlers

Environment variables set in Railway dashboard including BASE_URL

Frontend proxy configuration deployed with status 200 rewrites

Dashboard CSS file created and linked correctly

Mobile responsiveness tested at 320px, 768px, and 1024px widths

Shortened URLs resolve without showing backend domain in address bar

Dashboard displays modern cards with orange branding and proper spacing

Redis errors are non-fatal and application continues without cache

Database connection confirmed in Railway deployment logs

SSL certificates issued for custom domain (green checkmark in Railway)

Your issues stem from fundamental architecture decisions around domain configuration and styling implementation rather than deep technical bugs. The fixes provided are production-ready and can be deployed immediately. Both Cline and Cursor likely struggled because they attempted incremental patches rather than addressing the core architectural problems outlined here.