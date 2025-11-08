# CDN Deployment Guide - CloudFlare R2

## ✅ Complete CDN Deployment Automation

The DashDig widget includes a fully automated CDN deployment system for CloudFlare R2 with SRI hashing, compression, and versioning.

---

## Features

### ✅ Automated Deployment
- Build production bundles automatically
- Upload to CloudFlare R2
- Generate versioned and latest URLs
- Verify bucket access before deployment

### ✅ Security & Integrity
- **SRI (Subresource Integrity) hashes** for all files
- SHA-384 cryptographic hashes
- Prevents tampering and XSS attacks
- Saved to `.cdn-integrity/hashes.txt`

### ✅ Performance Optimization
- **Gzip compression** (~70% size reduction)
- **Brotli compression** (~80% size reduction)
- Both versions uploaded automatically
- Browsers choose best format

### ✅ Caching Strategy
- **Versioned URLs:** `max-age=31536000, immutable` (1 year)
- **Latest URLs:** `max-age=300` (5 minutes)
- **Source maps:** `no-cache`
- Optimal balance of performance and freshness

### ✅ File Management
- All `.js` bundles uploaded
- Source maps uploaded separately
- Compressed versions (.gz, .br)
- Organized by version

---

## Quick Start

### 1. Get CloudFlare R2 Credentials

```bash
# Go to CloudFlare Dashboard
https://dash.cloudflare.com

# Navigate to: R2 → Manage R2 API Tokens
# Create new token with "Admin Read & Write" permissions
# Copy: Access Key ID and Secret Access Key
```

### 2. Create Bucket

```bash
# In CloudFlare Dashboard → R2
# Click "Create bucket"
# Name: dashdig-widget-cdn
# Location: Automatic (or choose closest to users)
# Optional: Set up custom domain
```

### 3. Configure Environment

Create `.env.local` file in project root:

```bash
# CloudFlare R2 Configuration
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_BUCKET_NAME=dashdig-widget-cdn

# Optional: Custom domain
CDN_CUSTOM_DOMAIN=cdn.dashdig.com
```

### 4. Deploy

```bash
npm run deploy
```

That's it! Your widget is now on the CDN.

---

## Deployment Commands

### Full Deployment
```bash
# Build + Deploy (recommended)
npm run deploy

# This runs:
# 1. npm run build:prod (clean + build + compress)
# 2. node scripts/deploy-cdn.js
```

### Manual Steps
```bash
# 1. Build only
npm run build:prod

# 2. Deploy only (uses existing build)
node scripts/deploy-cdn.js
```

### Verification
```bash
# Check what's deployed
curl -I https://cdn.dashdig.com/latest/dashdig.min.js

# View SRI hashes
cat .cdn-integrity/hashes.txt
```

---

## Deployment Process

### What Happens When You Run `npm run deploy`

#### Step 1: Build Production Bundles
```
🔨 Building production bundles...
✅ Build complete

Output:
- dist/dashdig.min.js
- dist/dashdig.esm.js
- dist/dashdig-react.min.js
- dist/dashdig-react.esm.js
- dist/dashdig-angular.min.js
- dist/dashdig-angular.esm.js
+ source maps for each
```

#### Step 2: Validate Configuration
```
🔍 Checking environment variables...
✅ R2_ACCESS_KEY_ID found
✅ R2_SECRET_ACCESS_KEY found
✅ R2_ENDPOINT found
✅ R2_BUCKET_NAME found
```

#### Step 3: Check Bucket Access
```
🔍 Checking R2 bucket access...
✅ Connected to R2 bucket: dashdig-widget-cdn
```

#### Step 4: Process Files
```
📦 Processing files...

📄 dashdig.min.js (4.7 KB)
  🔐 SRI: sha384-abc123...
  📦 Compressing...
     Gzip: 1.8 KB
     Brotli: 1.5 KB
  ☁️  Uploading to /v1.0.0/dashdig.min.js...
  ☁️  Uploading to /latest/dashdig.min.js...

[Repeat for all bundles]
```

#### Step 5: Upload Source Maps
```
📍 Uploading source maps...
  ☁️  dashdig.min.js.map
  ☁️  dashdig.esm.js.map
  [etc...]
```

#### Step 6: Save SRI Hashes
```
🔐 Saving SRI hashes...
  ✅ Saved to .cdn-integrity/hashes.txt
```

#### Step 7: Success!
```
✅ Deployment Complete!

📍 Your widget is now available at:
   Versioned: https://cdn.dashdig.com/v1.0.0/dashdig.min.js
   Latest:    https://cdn.dashdig.com/latest/dashdig.min.js

🔐 SRI hashes saved to: .cdn-integrity/hashes.txt
```

---

## CDN URL Structure

### Versioned URLs (Recommended for Production)
```
https://cdn.dashdig.com/v1.0.0/dashdig.min.js
https://cdn.dashdig.com/v1.0.0/dashdig.esm.js
https://cdn.dashdig.com/v1.0.0/dashdig-react.min.js
https://cdn.dashdig.com/v1.0.0/dashdig-angular.min.js
```

**Benefits:**
- Immutable (cached for 1 year)
- Never changes
- Perfect for production
- Rollback by changing version

### Latest URLs (For Development)
```
https://cdn.dashdig.com/latest/dashdig.min.js
https://cdn.dashdig.com/latest/dashdig.esm.js
```

**Benefits:**
- Always up-to-date
- Short cache (5 minutes)
- Good for testing
- Auto-updates

### Compressed Versions (Automatic)
```
# Gzip
https://cdn.dashdig.com/v1.0.0/dashdig.min.js.gz

# Brotli
https://cdn.dashdig.com/v1.0.0/dashdig.min.js.br
```

**Note:** Browsers automatically request these based on `Accept-Encoding` header.

---

## Usage Examples

### Basic Script Tag
```html
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
<script>
  Dashdig.init({ apiKey: 'your-api-key' });
</script>
```

### With SRI (Recommended)
```html
<script 
  src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous">
</script>
```

**Get SRI hash from:** `.cdn-integrity/hashes.txt`

### React via CDN
```html
<script 
  src="https://cdn.dashdig.com/v1.0.0/dashdig-react.min.js"
  integrity="sha384-xyz789..."
  crossorigin="anonymous">
</script>
```

### Angular via CDN
```html
<script 
  src="https://cdn.dashdig.com/v1.0.0/dashdig-angular.min.js"
  integrity="sha384-def456..."
  crossorigin="anonymous">
</script>
```

---

## Configuration Details

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `R2_ACCESS_KEY_ID` | ✅ Yes | CloudFlare R2 access key | `a1b2c3d4...` |
| `R2_SECRET_ACCESS_KEY` | ✅ Yes | CloudFlare R2 secret key | `xyz789...` |
| `R2_ENDPOINT` | ✅ Yes | R2 API endpoint | `https://abc.r2.cloudflarestorage.com` |
| `R2_BUCKET_NAME` | No | Bucket name (default: dashdig-widget-cdn) | `my-cdn-bucket` |
| `CDN_CUSTOM_DOMAIN` | No | Custom domain (default: cdn.dashdig.com) | `assets.example.com` |

### Cache Control Headers

| File Type | Path | Cache-Control | Duration |
|-----------|------|---------------|----------|
| Versioned JS | `/v1.0.0/*.js` | `public, max-age=31536000, immutable` | 1 year |
| Latest JS | `/latest/*.js` | `public, max-age=300` | 5 minutes |
| Source Maps | `*.js.map` | `no-cache` | Always fresh |
| Compressed | `*.gz`, `*.br` | Same as original | - |

---

## File Structure After Deployment

### On CloudFlare R2

```
dashdig-widget-cdn/
├── v1.0.0/
│   ├── dashdig.min.js
│   ├── dashdig.min.js.gz
│   ├── dashdig.min.js.br
│   ├── dashdig.min.js.map
│   ├── dashdig.esm.js
│   ├── dashdig.esm.js.gz
│   ├── dashdig.esm.js.br
│   ├── dashdig.esm.js.map
│   ├── dashdig-react.min.js
│   ├── dashdig-react.esm.js
│   ├── dashdig-angular.min.js
│   └── dashdig-angular.esm.js
│
└── latest/
    ├── dashdig.min.js
    ├── dashdig.min.js.gz
    ├── dashdig.min.js.br
    ├── dashdig.min.js.map
    └── [same structure as versioned]
```

### Local Files

```
.cdn-integrity/
└── hashes.txt          # SRI hashes for all deployed files
```

---

## Troubleshooting

### Issue: Missing Environment Variables

**Error:**
```
❌ Missing required environment variables in .env.local:
   - R2_ACCESS_KEY_ID
   - R2_SECRET_ACCESS_KEY
```

**Solution:**
1. Create `.env.local` file in project root
2. Add all required variables
3. Verify no typos in variable names

---

### Issue: Cannot Access R2 Bucket

**Error:**
```
❌ Cannot access R2 bucket: Access Denied
```

**Check:**
1. API credentials are correct
2. Bucket exists in CloudFlare R2
3. Bucket name matches `R2_BUCKET_NAME`
4. API token has correct permissions
5. Endpoint URL is correct

**Fix:**
```bash
# Test credentials
curl -X GET \
  "https://your-account-id.r2.cloudflarestorage.com/dashdig-widget-cdn" \
  -H "Authorization: Bearer <token>"
```

---

### Issue: Build Failed

**Error:**
```
❌ Build failed: Command failed: npm run build:prod
```

**Solution:**
```bash
# Clean and rebuild
npm run clean
npm install
npm run build:prod
```

---

### Issue: Files Not Accessible

**Error:**
```
404 Not Found when accessing CDN URL
```

**Check:**
1. Custom domain is configured in CloudFlare
2. DNS records are set up correctly
3. Public access is enabled on bucket
4. Wait a few minutes for DNS propagation

**Fix:**
```bash
# In CloudFlare Dashboard:
# 1. R2 → Your Bucket → Settings
# 2. Enable "Public Access"
# 3. Add custom domain
# 4. Configure DNS (CNAME)
```

---

### Issue: SRI Hash Mismatch

**Error:**
```
Failed to find a valid digest in the 'integrity' attribute
```

**Cause:** File was modified after SRI hash was generated

**Solution:**
```bash
# Redeploy to regenerate hashes
npm run deploy

# Get new hashes
cat .cdn-integrity/hashes.txt
```

---

## Security Best Practices

### 1. Protect Credentials
```bash
# NEVER commit .env.local
echo ".env.local" >> .gitignore

# Use separate credentials for prod/staging
# Rotate credentials every 90 days
```

### 2. Use SRI Hashes
```html
<!-- Always include integrity attribute -->
<script 
  src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

### 3. Least Privilege
```bash
# API token permissions:
# - Read & Write on specific bucket only
# - No account-wide permissions
# - Short expiration time
```

### 4. Monitor Access
```bash
# Enable CloudFlare Access Logs
# Set up alerts for suspicious activity
# Review access patterns regularly
```

---

## Performance Optimization

### 1. Use Compressed Versions
Browsers automatically request `.gz` or `.br` versions based on support.

**Savings:**
- Gzip: ~70% size reduction
- Brotli: ~80% size reduction

### 2. Leverage Caching
- Versioned URLs cached for 1 year
- CDN edge caching in 300+ locations
- Browser caching reduces repeat downloads

### 3. Use Versioned URLs in Production
```html
<!-- ✅ GOOD: Versioned URL -->
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>

<!-- ❌ AVOID: Latest URL in production -->
<script src="https://cdn.dashdig.com/latest/dashdig.min.js"></script>
```

---

## Maintenance

### Regular Tasks

#### Update Widget
```bash
# 1. Update version in package.json
npm version patch  # or minor/major

# 2. Build and deploy
npm run deploy

# 3. Update HTML to use new version
<script src="https://cdn.dashdig.com/v1.0.1/dashdig.min.js"></script>
```

#### Clean Old Versions
```bash
# In CloudFlare Dashboard → R2
# Manually delete old version folders
# Keep last 3-5 versions for rollback
```

#### Rotate Credentials
```bash
# Every 90 days:
# 1. Create new API token in CloudFlare
# 2. Update .env.local
# 3. Test deployment
# 4. Revoke old token
```

---

## Advanced Usage

### Custom Domain Setup

#### 1. In CloudFlare Dashboard
```
R2 → Your Bucket → Settings → Custom Domains
Add domain: cdn.dashdig.com
```

#### 2. Configure DNS
```
Type: CNAME
Name: cdn
Content: <your-r2-public-url>
Proxy: ✅ Enabled (for CDN benefits)
```

#### 3. Update .env.local
```bash
CDN_CUSTOM_DOMAIN=cdn.dashdig.com
```

### Multiple Environments

#### Production
```bash
# .env.production
R2_BUCKET_NAME=dashdig-cdn-prod
CDN_CUSTOM_DOMAIN=cdn.dashdig.com
```

#### Staging
```bash
# .env.staging
R2_BUCKET_NAME=dashdig-cdn-staging
CDN_CUSTOM_DOMAIN=cdn-staging.dashdig.com
```

#### Deploy to specific environment
```bash
# Production
cp .env.production .env.local
npm run deploy

# Staging
cp .env.staging .env.local
npm run deploy
```

---

## Monitoring & Analytics

### CloudFlare Analytics
- View in: CloudFlare Dashboard → R2 → Your Bucket → Analytics
- Metrics: Requests, bandwidth, errors
- Timeframes: 24h, 7d, 30d

### Custom Monitoring
```bash
# Add to your monitoring system
curl -s -o /dev/null -w "%{http_code}" \
  https://cdn.dashdig.com/latest/dashdig.min.js

# Expected: 200
# Alert if: 404, 500, timeout
```

---

## Rollback Procedure

### If New Version Has Issues

#### 1. Identify Last Good Version
```bash
# Check deployed versions
# In CloudFlare Dashboard → R2 → Browse

# Or check git tags
git tag
```

#### 2. Revert in HTML
```html
<!-- Change from broken version -->
<script src="https://cdn.dashdig.com/v1.0.1/dashdig.min.js"></script>

<!-- To last good version -->
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
```

#### 3. Fix and Redeploy
```bash
# Fix code
git checkout v1.0.0
# Make fixes
git commit -m "fix: issue description"

# Bump version
npm version patch

# Deploy new fixed version
npm run deploy
```

---

## Costs

### CloudFlare R2 Pricing (as of 2025)

| Operation | Free Tier | Price After Free |
|-----------|-----------|------------------|
| Storage | 10 GB | $0.015/GB/month |
| Class A Operations | 1 million/month | $4.50/million |
| Class B Operations | 10 million/month | $0.36/million |
| Egress | Unlimited | $0 |

**Typical Monthly Cost for DashDig Widget:**
- Storage: < 100 MB → Free
- Operations: ~10K uploads/month → Free
- Egress: Unlimited → Free
- **Total: $0/month** for most use cases

---

## Summary

### ✅ What You Get

- **Automated Deployment:** One command to deploy
- **Global CDN:** CloudFlare's 300+ edge locations
- **Security:** SRI hashing for all files
- **Performance:** Gzip/Brotli compression
- **Versioning:** Immutable versioned URLs
- **Monitoring:** Built-in analytics
- **Cost-Effective:** Free tier covers most use cases

### 🚀 Ready to Deploy

```bash
# 1. Configure
cp .env.example .env.local
# Edit .env.local with your credentials

# 2. Deploy
npm run deploy

# 3. Use
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
```

---

**Last Updated:** November 8, 2025
**Script:** `scripts/deploy-cdn.js`
**Status:** ✅ Production Ready

