# Vercel Environment Variables Setup

Complete guide for configuring environment variables in Vercel Dashboard.

---

## 🔐 Required Environment Variables

### 1. NEXT_PUBLIC_API_URL

**Purpose:** Backend API endpoint for all API calls

**Value:** 
```
https://dashdig-production.up.railway.app
```

**Visibility:** Public (starts with `NEXT_PUBLIC_`)

**Environment:** Production, Preview, Development

---

## 📝 How to Set Environment Variables in Vercel

### Step 1: Access Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your **Dashdig** project
3. Click on **Settings** tab
4. Click on **Environment Variables** in left sidebar

### Step 2: Add Variables

For each variable:

1. Click **Add New** button
2. Enter the **Key** (variable name)
3. Enter the **Value**
4. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (optional)
5. Click **Save**

### Step 3: Redeploy

**Important:** After adding environment variables, you must redeploy!

```bash
# Option 1: Push a commit to trigger deployment
git commit --allow-empty -m "trigger deployment for env vars"
git push origin main

# Option 2: Manual redeploy in Vercel Dashboard
# Go to Deployments → Click three dots → Redeploy
```

---

## ✅ Environment Variables Checklist

### Production Variables

```bash
# API Backend URL
NEXT_PUBLIC_API_URL=https://dashdig-production.up.railway.app

# Add any authentication variables if needed
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Add any analytics keys if needed
# NEXT_PUBLIC_GA_ID=...
```

### Verification

After setting variables, verify they're loaded:

1. Go to any deployment
2. Click "..." menu
3. Select "View Function Logs"
4. Check if variables are available

Or add this to a page temporarily:

```typescript
// app/(dashboard)/page.tsx
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

---

## 🔍 Troubleshooting

### Variable Not Showing Up

1. **Ensure variable name starts with `NEXT_PUBLIC_`** for client-side access
2. **Redeploy after adding variables** (they don't apply to existing deployments)
3. **Check environment** (Production/Preview/Development)
4. **Clear browser cache** and test in incognito

### API Calls Failing

1. Check Network tab in DevTools
2. Verify `NEXT_PUBLIC_API_URL` is accessible
3. Check CORS configuration on backend
4. Ensure no trailing slashes in URL

### Build Failing

1. Check build logs in Vercel
2. Verify all required variables are set
3. Check for any references to undefined variables
4. Ensure no typos in variable names

---

## 📱 Testing Environment Variables

### Local Testing

```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=https://dashdig-production.up.railway.app" > .env.local

# Test locally
npm run dev

# Open http://localhost:3000 and check Network tab
```

### Production Testing

1. Deploy to Vercel
2. Open DevTools → Console
3. Check for API calls in Network tab
4. Verify correct backend URL is being used

---

## 🎯 Quick Setup Commands

### View Current Variables

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# List environment variables
vercel env ls
```

### Add Variable via CLI

```bash
# Add production variable
vercel env add NEXT_PUBLIC_API_URL production

# When prompted, enter:
# https://dashdig-production.up.railway.app
```

### Pull Environment Variables

```bash
# Pull production env vars to local .env.local
vercel env pull .env.local
```

---

## 🔗 Important URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Backend API:** https://dashdig-production.up.railway.app
- **Production Site:** https://dashdig.com

---

**Last Updated:** November 8, 2025  
**Status:** ✅ Ready to Configure

