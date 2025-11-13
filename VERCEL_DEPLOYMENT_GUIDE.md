# Vercel Deployment Guide - Dashdig Frontend

Complete step-by-step guide to deploy the Dashdig frontend to Vercel.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with `trivedi007/dashdig` repository access
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Backend API running on Railway: `https://dashdig-production.up.railway.app`
- ✅ Domain configured (if using custom domain): `dashdig.com`

---

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Connect Vercel to GitHub

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select **GitHub** as the provider
5. Find and select **`trivedi007/dashdig`** repository
6. Click **"Import"**

### Step 2: Configure Project Settings

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Enter: `frontend`
- Click **"Continue"**

**Framework Preset:**
- Auto-detected: **Next.js**
- Leave as is ✓

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

### Step 3: Set Environment Variables

Click **"Environment Variables"** section, then add:

#### Required Variables:

| Key | Value | All Environments |
|-----|-------|------------------|
| `NEXT_PUBLIC_API_URL` | `https://dashdig-production.up.railway.app` | ✅ Yes |
| `NEXT_PUBLIC_BASE_URL` | `https://dashdig.com` | ✅ Yes |

**To add each variable:**
1. Enter the Key name
2. Enter the Value
3. Check "Production", "Preview", and "Development"
4. Click **"Add"**

### Step 4: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. You'll see: ✅ **"Your project has been deployed!"**

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain Setup

If using `dashdig.com`:

1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter `dashdig.com`
4. Follow DNS instructions to add:
   - A Record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`
5. Wait for DNS propagation (5-30 minutes)
6. Verify with: https://dashdig.com

### 2. Verify Deployment

**Check these URLs work:**

1. **Homepage**: https://dashdig.com/
2. **Dashboard**: https://dashdig.com/dashboard
3. **API Connection**:
   - Open DevTools (F12)
   - Go to Network tab
   - Navigate to dashboard
   - Verify API calls go to `https://dashdig-production.up.railway.app`

### 3. Enable Production Optimizations

Go to **Settings** → **General**:

- **Auto-assign Custom Domain Production Branch**: `main`
- **Ignored Build Step**: Leave empty
- **Protection Password**: (optional) Enable for preview deployments
- **Branch Deployments**: Enable for `main` branch

### 4. Configure Build Settings

Go to **Settings** → **Git**:

- **Production Branch**: `main`
- **Auto Deploy**: ✅ Enabled
- **Preview Deployments**: ✅ Enabled for all branches

---

## 🧪 Testing Deployment

### Smoke Tests

After deployment, test these flows:

#### 1. Landing Page
- [ ] Homepage loads at https://dashdig.com/
- [ ] Hero section displays correctly
- [ ] "Humanize and Shortenize URLs" tagline visible
- [ ] Navigation menu works

#### 2. Authentication
- [ ] Sign in page loads: `/auth/signin`
- [ ] Can create new account
- [ ] Email verification works
- [ ] Can log in successfully

#### 3. Dashboard
- [ ] Dashboard loads: `/dashboard`
- [ ] Stats cards display data
- [ ] Charts render correctly
- [ ] URL table shows data
- [ ] Create new URL works

#### 4. API Connection
- [ ] Network tab shows API calls to Railway
- [ ] No CORS errors in console
- [ ] API responses return data
- [ ] Authentication headers present

#### 5. Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No console errors

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
Solution:
1. Check package.json dependencies
2. Ensure all imports use correct paths
3. Try: npm install && npm run build locally first
```

**Error: "Environment variable not found"**
```bash
Solution:
1. Check Settings → Environment Variables
2. Ensure NEXT_PUBLIC_API_URL is set
3. Redeploy after adding variables
```

### Deployment Succeeds but Site Doesn't Work

**Issue: API calls fail with CORS errors**
```bash
Solution:
1. Check backend CORS configuration
2. Verify FRONTEND_URL in Railway includes https://dashdig.com
3. Check Network tab for actual error messages
```

**Issue: Environment variables undefined**
```bash
Solution:
1. Ensure variables start with NEXT_PUBLIC_
2. Redeploy (env vars don't apply to existing deployments)
3. Clear browser cache
```

**Issue: 404 on dashboard routes**
```bash
Solution:
1. Check frontend/app/dashboard/ folder exists
2. Verify middleware.ts isn't blocking routes
3. Check vercel.json for rewrites/redirects
```

### Domain Not Working

**Issue: Domain shows "Not Found"**
```bash
Solution:
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check: dig dashdig.com
4. Try: curl -I https://dashdig.com
```

**Issue: SSL certificate not provisioned**
```bash
Solution:
1. Wait 5-10 minutes after DNS verification
2. Vercel auto-provisions Let's Encrypt certs
3. Check Settings → Domains for status
```

---

## 📊 Monitoring Deployment

### View Logs

**Real-time logs:**
1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **"View Function Logs"**
4. See server-side errors and console.log statements

**Build logs:**
1. Click on deployment
2. See **"Building"** section
3. Review any warnings or errors

### Analytics

**Built-in Vercel Analytics:**
1. Go to **Analytics** tab
2. View:
   - Page views
   - Unique visitors
   - Top pages
   - Web Vitals scores

**Add Custom Analytics:**
- Google Analytics: Add `NEXT_PUBLIC_GA_ID`
- PostHog: Add `NEXT_PUBLIC_POSTHOG_KEY`

---

## 🔄 Continuous Deployment

### Automatic Deployments

Every push to GitHub triggers deployment:

**Production (main branch):**
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```
→ Deploys to: `https://dashdig.com`

**Preview (feature branches):**
```bash
git checkout -b feature/my-feature
git add .
git commit -m "feat: working on feature"
git push origin feature/my-feature
```
→ Deploys to: `https://dashdig-git-feature-my-feature.vercel.app`

### Manual Deployment

**Redeploy latest:**
1. Go to **Deployments** tab
2. Click "..." on latest deployment
3. Select **"Redeploy"**
4. Confirm

**Deploy specific commit:**
1. Find the deployment you want
2. Click "..." menu
3. Select **"Redeploy"**

---

## ⚡ Performance Optimization

### Enable Features

**Edge Network:**
- Automatically enabled ✅
- CDN for static assets
- Global edge caching

**Image Optimization:**
```typescript
// Already configured in next.config.js
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Dashdig"
  width={200}
  height={50}
  priority
/>
```

**Compression:**
- Automatic Brotli compression ✅
- Automatic Gzip fallback ✅

### Caching Strategy

**Static Assets:**
- Cached for 1 year
- Cache-Control: `public, max-age=31536000, immutable`

**API Routes:**
- No caching by default
- Add custom Cache-Control headers if needed

**Pages:**
- ISR (Incremental Static Regeneration) enabled
- Revalidate every 60 seconds

---

## 🔐 Security Best Practices

### Environment Variables

✅ **DO:**
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Keep API keys server-side only
- Rotate secrets regularly
- Use different values for staging/production

❌ **DON'T:**
- Commit `.env.local` to git
- Expose sensitive keys client-side
- Use same secrets across environments

### HTTPS

- ✅ Vercel enforces HTTPS automatically
- ✅ HTTP automatically redirects to HTTPS
- ✅ HSTS header enabled

### Headers

Check `next.config.js` for security headers:
```javascript
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN'
},
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```

---

## 📱 Preview Deployments

Every PR automatically gets a preview URL:

1. Open Pull Request on GitHub
2. Vercel bot comments with preview URL
3. Test changes at: `https://dashdig-git-{branch}.vercel.app`
4. Share with team for review
5. Merge when ready → auto-deploys to production

---

## 🆘 Support Resources

**Vercel Documentation:**
- Next.js: https://vercel.com/docs/frameworks/nextjs
- Environment Variables: https://vercel.com/docs/environment-variables
- Custom Domains: https://vercel.com/docs/custom-domains

**Dashdig Resources:**
- Backend README: `/backend/README.md`
- Frontend .env: `/frontend/.env.example`
- API Docs: `/docs/API.md`

**Get Help:**
- Vercel Support: https://vercel.com/support
- Vercel Community: https://github.com/vercel/vercel/discussions
- Dashdig Issues: https://github.com/trivedi007/dashdig/issues

---

## ✅ Deployment Checklist

Use this checklist for each deployment:

### Pre-Deployment
- [ ] All tests pass locally
- [ ] Build succeeds locally: `npm run build`
- [ ] Environment variables documented
- [ ] Backend API is live on Railway
- [ ] Database migrations completed (if any)

### Deployment
- [ ] Connect GitHub repository to Vercel
- [ ] Set root directory to `frontend`
- [ ] Add `NEXT_PUBLIC_API_URL` environment variable
- [ ] Add `NEXT_PUBLIC_BASE_URL` environment variable
- [ ] Click Deploy and wait for completion
- [ ] Check build logs for errors

### Post-Deployment
- [ ] Homepage loads correctly
- [ ] Dashboard loads and shows data
- [ ] API calls work (check Network tab)
- [ ] No console errors
- [ ] Authentication flow works
- [ ] Create URL functionality works
- [ ] Analytics tracking works
- [ ] Lighthouse score > 90

### Custom Domain (if applicable)
- [ ] Add domain in Vercel dashboard
- [ ] Configure DNS records
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate provisioned
- [ ] Test: https://dashdig.com loads

---

**Last Updated:** November 13, 2025
**Status:** ✅ Ready to Deploy
**Estimated Time:** 10-15 minutes for first deployment

---

## 🎉 Success!

Once deployed, your Dashdig frontend will be live at:
- **Production**: https://dashdig.com
- **API**: https://dashdig-production.up.railway.app

Share it with the world! 🚀
