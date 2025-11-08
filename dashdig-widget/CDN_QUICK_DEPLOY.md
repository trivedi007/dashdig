# 🚀 Quick CDN Deployment to CloudFlare R2

**Time to complete:** ~10 minutes  
**Status:** Widget is built and ready to deploy

---

## ✅ Pre-flight Check

Your widget is already built! Files ready:
```
✅ dist/dashdig.min.js (4.7 KB)
✅ dist/dashdig-react.min.js (9.0 KB)
✅ dist/dashdig-angular.min.js (16 KB)
✅ All source maps included
✅ Deployment script ready
✅ @aws-sdk/client-s3 installed
```

---

## 🔧 Step 1: Get CloudFlare R2 Credentials (5 minutes)

### A. Create R2 Bucket

1. Go to: https://dash.cloudflare.com
2. Click "R2" in left sidebar
3. Click "Create bucket"
4. Bucket name: `dashdig-widget-cdn`
5. Location: "Automatic" (or choose your region)
6. Click "Create bucket"

### B. Generate API Token

1. In R2 page, click "Manage R2 API Tokens"
2. Click "Create API token"
3. Token name: "DashDig Widget Deployment"
4. Permissions: **"Admin Read & Write"**
5. TTL: "Forever" (or set expiration)
6. Click "Create API token"

📋 **SAVE THESE - You'll need them next:**
- Access Key ID: `a1b2c3d4e5f6...`
- Secret Access Key: `abc123xyz789...`
- Endpoint URL: `https://1234567890abcdef.r2.cloudflarestorage.com`

⚠️ **Important:** Copy these now - you can't view them again!

---

## 🔐 Step 2: Configure Environment (2 minutes)

### A. Create .env.local file

```bash
cd ~/AI-ML/Business-Ideas/Dashdig/dashdig-widget

# Copy template
cp env.example .env.local

# Edit with your credentials
nano .env.local
# Or use your favorite editor
```

### B. Fill in your credentials

Edit `.env.local` with the values you saved:

```bash
# CloudFlare R2 Configuration (Required)
R2_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
R2_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
R2_ENDPOINT=<YOUR_ENDPOINT_URL>
R2_BUCKET_NAME=dashdig-widget-cdn

# Custom Domain (Optional - configure later)
CDN_CUSTOM_DOMAIN=cdn.dashdig.com
```

**Example:**
```bash
R2_ACCESS_KEY_ID=a1b2c3d4e5f6g7h8i9j0
R2_SECRET_ACCESS_KEY=abc123xyz789def456ghi789
R2_ENDPOINT=https://1234567890abcdef.r2.cloudflarestorage.com
R2_BUCKET_NAME=dashdig-widget-cdn
CDN_CUSTOM_DOMAIN=cdn.dashdig.com
```

---

## ✅ Step 3: Verify Configuration (1 minute)

```bash
cd ~/AI-ML/Business-Ideas/Dashdig/dashdig-widget

# Check configuration
npm run deploy:check
```

**Expected output:**
```
✅ Config OK
```

**If you see errors:**
```
❌ Missing: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
```
→ Go back to Step 2 and check your .env.local file

---

## 🚀 Step 4: Deploy to CDN (2 minutes)

### A. Run deployment

```bash
npm run deploy
```

### B. Watch the magic happen!

You'll see:
```
🚀 DashDig Widget CDN Deployment
================================

📦 Version: 1.0.0

🔍 Checking R2 bucket access...
✅ Connected to R2 bucket: dashdig-widget-cdn

🔨 Building production bundles...
✅ Build complete

📦 Processing files...

📄 dashdig.min.js (4.7 KB)
  🔐 SRI: sha384-abc123...
  📦 Compressing...
     Gzip: 1.9 KB
     Brotli: 1.7 KB
  ☁️  Uploading to /v1.0.0/dashdig.min.js...
  ☁️  Uploading to /latest/dashdig.min.js...

[... more files ...]

📍 Uploading source maps...
  ☁️  dashdig.min.js.map
  ☁️  dashdig-react.min.js.map
  ☁️  dashdig-angular.min.js.map

🔐 Saving SRI hashes...
  ✅ Saved to .cdn-integrity/hashes.txt

✅ Deployment Complete!

📍 Your widget is now available at:
   Versioned: https://cdn.dashdig.com/v1.0.0/dashdig.min.js
   Latest:    https://cdn.dashdig.com/latest/dashdig.min.js

🔐 SRI hashes saved to: .cdn-integrity/hashes.txt
```

---

## 🌐 Step 5: Configure Public Access (3 minutes)

Your files are uploaded but not yet publicly accessible. Let's fix that:

### A. Enable Public Access

1. Go to CloudFlare Dashboard → R2
2. Click on your bucket: `dashdig-widget-cdn`
3. Go to "Settings" tab
4. Find "Public Access" section
5. Toggle "Allow Access" to ON
6. Note the public bucket URL (e.g., `https://pub-xyz123.r2.dev`)

### B. Option 1: Use R2 Public URL (Quick)

Your files are immediately accessible at:
```
https://pub-xyz123.r2.dev/v1.0.0/dashdig.min.js
```

**Test it:**
```bash
curl -I https://pub-xyz123.r2.dev/v1.0.0/dashdig.min.js
```

Expected: `200 OK`

### B. Option 2: Setup Custom Domain (Recommended)

#### i. Add Custom Domain in R2

1. In bucket Settings → Custom Domains
2. Click "Connect Domain"
3. Domain: `cdn.dashdig.com`
4. Click "Add"

#### ii. Configure DNS

1. Go to CloudFlare Dashboard → DNS
2. Add CNAME record:
   - Type: `CNAME`
   - Name: `cdn`
   - Target: `dashdig-widget-cdn.1234567890abcdef.r2.cloudflarestorage.com`
   - Proxy status: ON (orange cloud)
   - TTL: Auto

#### iii. Wait for DNS propagation (1-5 minutes)

```bash
# Test when ready
curl -I https://cdn.dashdig.com/v1.0.0/dashdig.min.js
```

---

## ✅ Step 6: Verify Deployment

### A. Check File Accessibility

```bash
# Test versioned URL
curl -I https://cdn.dashdig.com/v1.0.0/dashdig.min.js

# Expected headers:
HTTP/2 200
content-type: application/javascript; charset=utf-8
cache-control: public, max-age=31536000, immutable
access-control-allow-origin: *
```

### B. Check Compression

```bash
# Test Gzip
curl -I -H "Accept-Encoding: gzip" https://cdn.dashdig.com/v1.0.0/dashdig.min.js

# Expected:
content-encoding: gzip
```

### C. View SRI Hashes

```bash
cat .cdn-integrity/hashes.txt
```

Output:
```
# SRI Hashes - Generated 2025-11-08...

dashdig.min.js: sha384-abc123xyz789...
dashdig-react.min.js: sha384-def456uvw012...
dashdig-angular.min.js: sha384-ghi789rst345...
```

---

## 📝 Step 7: Update Integration Page

### A. Create Test Page

Create `test-cdn.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DashDig Widget - CDN Test</title>
</head>
<body>
  <h1>DashDig Widget CDN Test</h1>
  <p>If you see this and no errors in console, the CDN deployment is working!</p>

  <!-- Load from CDN -->
  <script 
    src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"
    crossorigin="anonymous">
  </script>

  <script>
    console.log('✅ DashDig loaded from CDN:', typeof Dashdig !== 'undefined');
    
    // Test initialization
    if (typeof Dashdig !== 'undefined') {
      Dashdig.init({
        apiKey: 'test_key_123',
        debug: true
      });
      console.log('✅ DashDig initialized successfully');
    }
  </script>
</body>
</html>
```

### B. Test in Browser

```bash
# Open test file
open test-cdn.html

# Or with Python server
python3 -m http.server 8000
# Visit: http://localhost:8000/test-cdn.html
```

**Check console for:**
```
✅ DashDig loaded from CDN: true
✅ DashDig initialized successfully
```

---

## 🎉 Success Checklist

After completing all steps, verify:

- [ ] Widget files uploaded to R2 bucket
- [ ] Public access enabled on bucket
- [ ] Files accessible via CDN URL
- [ ] CORS headers properly set
- [ ] Gzip compression working
- [ ] Test page loads widget successfully
- [ ] No console errors
- [ ] SRI hashes generated
- [ ] `.cdn-integrity/hashes.txt` exists

---

## 🔧 CORS Configuration (Important!)

If you get CORS errors, configure CORS in CloudFlare R2:

### A. In CloudFlare Dashboard

1. Go to R2 → Your Bucket → Settings
2. Find "CORS Policy" section
3. Add this policy:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length"],
    "MaxAgeSeconds": 3600
  }
]
```

### B. Save and Test

```bash
curl -I -H "Origin: https://example.com" \
  https://cdn.dashdig.com/v1.0.0/dashdig.min.js

# Should see:
access-control-allow-origin: *
```

---

## 🚀 Quick Reference

### Deploy New Version

```bash
# 1. Update version
npm version patch

# 2. Deploy
npm run deploy
```

### URLs

```
Versioned:  https://cdn.dashdig.com/v1.0.0/dashdig.min.js
Latest:     https://cdn.dashdig.com/latest/dashdig.min.js
React:      https://cdn.dashdig.com/v1.0.0/dashdig-react.min.js
Angular:    https://cdn.dashdig.com/v1.0.0/dashdig-angular.min.js
```

### Files Generated

```
.cdn-integrity/
  └── hashes.txt         # SRI hashes for security

On R2:
  ├── v1.0.0/           # Versioned (immutable)
  │   ├── dashdig.min.js
  │   ├── dashdig.min.js.gz
  │   ├── dashdig.min.js.br
  │   └── *.map files
  └── latest/           # Latest (updates)
      └── [same files]
```

---

## ❓ Troubleshooting

### Issue: "Cannot access R2 bucket"

**Fix:**
```bash
# Verify credentials in .env.local
npm run deploy:check

# Test manually
curl -X GET \
  -H "Authorization: Bearer <access-key>" \
  "$R2_ENDPOINT/$R2_BUCKET_NAME"
```

### Issue: "404 Not Found"

**Check:**
1. Public access is enabled
2. DNS is configured (if using custom domain)
3. Wait 5 minutes for DNS propagation
4. Try R2 public URL first: `https://pub-xyz.r2.dev/`

### Issue: CORS Errors

**Fix:**
1. Add CORS policy (see CORS section above)
2. Restart browser to clear cache
3. Test with curl first

### Issue: Widget not loading

**Check console for:**
```
❌ Failed to load script
❌ CORS error
❌ 404 Not Found
```

**Solutions:**
- Check URL is correct
- Verify file was uploaded
- Check CORS policy
- Clear browser cache

---

## 📚 Next Steps

1. ✅ Widget deployed to CDN
2. ✅ Public access configured
3. ✅ CORS headers set
4. → Update your main website to use CDN URL
5. → Add SRI hashes for security
6. → Monitor usage in CloudFlare Analytics

---

## 🔗 Useful Links

- **CloudFlare Dashboard:** https://dash.cloudflare.com
- **R2 Documentation:** https://developers.cloudflare.com/r2/
- **Full Deployment Guide:** `CDN_DEPLOYMENT.md`
- **Environment Template:** `env.example`
- **Deploy Script:** `scripts/deploy-cdn.js`

---

**Status:** ✅ Ready to Deploy  
**Time:** ~10 minutes total  
**Cost:** FREE (CloudFlare R2 free tier)

🚀 **Run: `npm run deploy` to get started!**

