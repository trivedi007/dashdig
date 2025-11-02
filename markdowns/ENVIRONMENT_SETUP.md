# 🔧 Environment Setup Guide

## Critical: Frontend-Backend API Integration

### Problem Identified
The environment variables were pointing to incorrect backend URLs, causing 500 errors.

---

## 📝 Environment Variables

### Frontend (Next.js)

Create these files in `/frontend`:

#### `.env.local` (Development)
```bash
# Backend API URL (without /api suffix)
NEXT_PUBLIC_API_URL=https://dashdig-backend-production-8e12.up.railway.app

# Frontend Base URL
NEXT_PUBLIC_BASE_URL=https://dashdig.com

# Anthropic API Key (optional)
ANTHROPIC_API_KEY=
```

#### `.env.production.local` (Production)
```bash
# Backend API URL (without /api suffix)
NEXT_PUBLIC_API_URL=https://dashdig-backend-production-8e12.up.railway.app

# Frontend Base URL
NEXT_PUBLIC_BASE_URL=https://dashdig.com

# Anthropic API Key (optional)
ANTHROPIC_API_KEY=
```

---

## 🎯 API URL Format

### ❌ WRONG (Old Configuration)
```
NEXT_PUBLIC_API_URL=https://dashdig-production.up.railway.app/api
```

**Problems:**
- Wrong domain (`dashdig-production` instead of `dashdig-backend-production-8e12`)
- Included `/api` suffix (routes already include it)

### ✅ CORRECT (New Configuration)
```
NEXT_PUBLIC_API_URL=https://dashdig-backend-production-8e12.up.railway.app
```

**Why:**
- Correct Railway backend domain
- No `/api` suffix (backend routes handle it)
- API calls use: `${NEXT_PUBLIC_API_URL}/api/urls`

---

## 🔗 API Endpoints

### Backend Routes Structure
```
app.use('/api', apiRoutes)
  └─ router.use('/urls', urlRoutes)
      └─ router.post('/', createShortUrl)
```

**Full Path:** `POST https://dashdig-backend-production-8e12.up.railway.app/api/urls`

### Frontend API Calls
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Create short URL
fetch(`${API_BASE}/api/urls`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    customSlug: 'my-link',
    keywords: ['example', 'test']
  })
})
```

---

## 🐛 Common Issues & Solutions

### Issue 1: 500 Internal Server Error
**Cause:** Incorrect `NEXT_PUBLIC_API_URL`  
**Fix:** Update to `https://dashdig-backend-production-8e12.up.railway.app`

### Issue 2: 404 Not Found
**Cause:** `/api` suffix in environment variable  
**Fix:** Remove `/api` from `NEXT_PUBLIC_API_URL`

### Issue 3: CORS Errors
**Cause:** Backend CORS not configured for frontend domain  
**Fix:** Add to backend:
```javascript
app.use(cors({
  origin: ['https://dashdig.com', 'http://localhost:3000'],
  credentials: true
}));
```

### Issue 4: Authentication Errors
**Cause:** Missing or expired token  
**Fix:** Check localStorage for `token`, refresh if expired

---

## 🧪 Testing the Configuration

### 1. Test Backend Health
```bash
curl https://dashdig-backend-production-8e12.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-20T...",
  "uptime": 12345
}
```

### 2. Test API Endpoint (No Auth)
```bash
curl -X POST https://dashdig-backend-production-8e12.up.railway.app/api/urls \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","keywords":["test"]}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "shortUrl": "https://dashdig.com/example-test",
    "slug": "example-test",
    ...
  }
}
```

### 3. Test from Frontend
Open browser console on `localhost:3000`:
```javascript
fetch('http://localhost:3000/api/test')
  .then(r => r.json())
  .then(console.log)
```

---

## 📋 Setup Checklist

- [ ] Create `frontend/.env.local` with correct URLs
- [ ] Create `frontend/.env.production.local` with correct URLs
- [ ] Update `NEXT_PUBLIC_API_URL` to remove `/api` suffix
- [ ] Restart frontend dev server: `npm run dev`
- [ ] Test health endpoint
- [ ] Test API endpoint
- [ ] Test full flow: paste URL → generate slug → save to database
- [ ] Check browser console for errors
- [ ] Check backend logs for errors

---

## 🚀 Deployment

### Vercel (Frontend)
Add environment variables in Vercel dashboard:

1. Go to: Project Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://dashdig-backend-production-8e12.up.railway.app
   NEXT_PUBLIC_BASE_URL=https://dashdig.com
   ```
3. Redeploy

### Railway (Backend)
Add environment variables in Railway dashboard:

1. Go to: Variables tab
2. Add:
   ```
   BASE_URL=https://dashdig.com
   FRONTEND_URL=https://dashdig.com
   NODE_ENV=production
   ```
3. Redeploy

---

## 📊 API Flow Diagram

```
User pastes URL
      ↓
Frontend (Next.js)
      ↓
Generate AI slug (client-side)
      ↓
POST ${NEXT_PUBLIC_API_URL}/api/urls
      ↓
Backend receives at /api/urls
      ↓
Routes: app.use('/api', router) → router.use('/urls', urlRoutes)
      ↓
Controller: createShortUrl(req, res)
      ↓
1. Validate URL
2. Generate slug (if not custom)
3. Check uniqueness
4. Save to MongoDB
5. Generate QR code
6. Return response
      ↓
Frontend receives response
      ↓
Display short URL to user
```

---

## 🔑 Key Points

1. **No `/api` suffix in env var** - Routes add it
2. **Correct Railway domain** - `dashdig-backend-production-8e12`
3. **CORS configured** - Frontend domain whitelisted
4. **Auth optional** - `authMiddleware` allows unauthenticated requests
5. **Error logging** - Console logs for debugging

---

_Last Updated: October 20, 2025_  
_Status: Configuration Fixed_

