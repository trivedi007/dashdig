# 🚀 Dashdig Frontend Deployment Checklist

Complete checklist for deploying the Dashdig dashboard to production on Vercel.

---

## ✅ Pre-Deployment Checks

### 1. Code Quality

- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings fixed
- [ ] No console.log statements in production code
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds locally (`npm run build`)

### 2. Configuration Files

- [ ] `next.config.js` properly configured
  - [x] Turbopack root set to `__dirname`
  - [x] Output mode set to `standalone`
  - [x] Console removal enabled for production
  - [x] Redirects configured
  
- [ ] `vercel.json` configured
  - [x] API rewrites to Railway backend
  - [x] Short URL rewrites configured

- [ ] No unnecessary lockfiles in root directory
  - [x] Removed `/Users/narendra/AI-ML/Business-Ideas/Dashdig/package-lock.json`
  - [x] Kept `frontend/package-lock.json`

### 3. Dashboard Routes

Verify all routes exist and work:

- [x] `/app/(dashboard)/page.tsx` - Dashboard root
- [x] `/app/(dashboard)/layout.tsx` - Dashboard layout
- [x] `/app/(dashboard)/overview/page.tsx` - Overview page
- [x] `/app/(dashboard)/urls/page.tsx` - URLs page
- [x] `/app/(dashboard)/analytics/page.tsx` - Analytics list
- [x] `/app/(dashboard)/analytics/[slug]/page.tsx` - Analytics detail

**Note:** Widget page was removed (as intended)

---

## 🔐 Environment Variables

### Required Variables in Vercel Dashboard

Navigate to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

#### Production Environment

```bash
# API URL
NEXT_PUBLIC_API_URL=https://dashdig-production.up.railway.app

# Add any other required environment variables here
```

#### Verification

- [ ] `NEXT_PUBLIC_API_URL` is set in Vercel
- [ ] All environment variables are set for "Production" environment
- [ ] Variables are marked as "Encrypted" in Vercel

---

## 📝 Deployment Steps

### Step 1: Local Verification

```bash
# Navigate to frontend directory
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig/frontend

# Install dependencies
npm install

# Build locally to verify
npm run build

# Test the production build
npm start

# Visit http://localhost:3000 and verify all routes work
```

**Verify these routes work locally:**
- ✅ http://localhost:3000/dashboard/overview
- ✅ http://localhost:3000/dashboard/urls
- ✅ http://localhost:3000/dashboard/analytics

### Step 2: Commit Changes

```bash
# From the root Dashdig directory
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig

# Check status
git status

# Add all changes
git add -A

# Commit with descriptive message
git commit -m "fix: Configure Next.js for production deployment

- Remove root lockfiles causing Turbopack warning
- Add turbo.root configuration to next.config.js
- Enable TypeScript and ESLint for production builds
- Configure standalone output mode
- Add console removal for production
- Update image optimization config
- Configure dashboard redirects

Fixes production deployment issues"

# Push to main
git push origin main
```

### Step 3: Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)

Vercel automatically deploys when you push to `main`:

1. Push changes to GitHub (done in Step 2)
2. Wait for Vercel to detect the push
3. Monitor deployment at: https://vercel.com/dashboard
4. Check deployment status

#### Option B: Manual Deployment

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Deploy from frontend directory
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig/frontend

# Deploy to production
vercel --prod
```

### Step 4: Post-Deployment Verification

#### A. Check Deployment Status

1. Go to Vercel Dashboard
2. Click on your project
3. Verify deployment status is "Ready"
4. Check deployment logs for any errors

#### B. Test Production URLs

Visit and verify these URLs work:

- [ ] https://dashdig.com/dashboard → Should redirect to /dashboard/overview
- [ ] https://dashdig.com/dashboard/overview → Overview page loads
- [ ] https://dashdig.com/dashboard/urls → URLs page loads
- [ ] https://dashdig.com/dashboard/analytics → Analytics page loads

#### C. Test Functionality

On each page, verify:

- [ ] Page loads without errors
- [ ] No console errors in browser DevTools
- [ ] API calls work (check Network tab)
- [ ] Data displays correctly
- [ ] Navigation between pages works
- [ ] UI matches localhost behavior

---

## 🐛 Troubleshooting

### Issue: "Old version" showing on production

**Cause:** Vercel is serving cached version

**Solutions:**

1. **Force redeploy in Vercel:**
   - Go to Vercel Dashboard
   - Click "Deployments" tab
   - Click the three dots on latest deployment
   - Select "Redeploy"
   - Check "Use existing Build Cache" = **OFF**

2. **Clear Vercel cache:**
   ```bash
   vercel --prod --force
   ```

3. **Check if build succeeded:**
   - Look at deployment logs in Vercel
   - Ensure no build errors
   - Verify correct branch is deployed

### Issue: Turbopack root warning

**Status:** ✅ FIXED

**What was done:**
- Removed root `package.json` and `package-lock.json`
- Added `turbo: { root: __dirname }` to `next.config.js`

### Issue: 404 on dashboard routes

**Possible causes:**

1. **Build didn't include routes:**
   - Check `.next` directory was generated
   - Verify routes exist in build output

2. **Incorrect redirects:**
   - Check `next.config.js` redirects
   - Verify `vercel.json` rewrites don't conflict

3. **TypeScript/ESLint errors:**
   - Check deployment logs
   - Fix any build-time errors

**Solution:**
```bash
# Rebuild locally
npm run build

# Check for errors
# Fix any issues
# Commit and redeploy
```

### Issue: Environment variables not working

**Check:**

1. Variables are set in Vercel Dashboard
2. Variables start with `NEXT_PUBLIC_` for client-side access
3. Deployment environment matches (Production/Preview/Development)
4. Redeploy after adding new environment variables

### Issue: API calls failing

**Check:**

1. `vercel.json` rewrites are correct
2. Backend URL is accessible: https://dashdig-production.up.railway.app
3. CORS is configured on backend
4. Network tab in browser shows correct request URLs

---

## 📊 Post-Deployment Monitoring

### 1. Vercel Analytics

- Go to Vercel Dashboard → Analytics
- Monitor page load times
- Check Core Web Vitals
- Review error rates

### 2. Browser Console

Open DevTools on production:
- Check for console errors
- Verify no 404s in Network tab
- Ensure all assets load

### 3. Performance

Test performance:
- Google PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- Lighthouse in Chrome DevTools

---

## 🎯 Success Criteria

### All checks must pass:

- [ ] No Turbopack root warning
- [ ] Build succeeds in Vercel
- [ ] No console errors on any page
- [ ] All dashboard routes accessible
- [ ] API calls work correctly
- [ ] Environment variables loaded
- [ ] UI matches localhost
- [ ] Navigation works
- [ ] Performance is acceptable (Lighthouse score > 90)

---

## 🔄 Future Deployments

For subsequent deployments:

1. Make changes locally
2. Test on localhost:3000
3. Run `npm run build` to verify
4. Commit changes to git
5. Push to `main` branch
6. Verify automatic deployment in Vercel
7. Test production URLs

---

## 📞 Support Resources

### Documentation

- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Docs: https://vercel.com/docs
- Next.js Config: https://nextjs.org/docs/api-reference/next.config.js/introduction

### Vercel Dashboard

- Project: https://vercel.com/dashboard
- Deployments: https://vercel.com/dashboard/deployments
- Environment Variables: https://vercel.com/dashboard → Settings → Environment Variables
- Deployment Logs: Click on any deployment to see logs

### Debug Commands

```bash
# Check build locally
npm run build

# Start production build locally
npm start

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint

# View Vercel logs
vercel logs [deployment-url]
```

---

**Last Updated:** November 8, 2025  
**Status:** ✅ Ready for Deployment  
**Next Action:** Follow deployment steps above

