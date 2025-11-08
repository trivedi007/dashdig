# CDN Deployment - Quick Start (2 Minutes)

## Setup (One-Time)

### 1. Get CloudFlare R2 Credentials
```
→ https://dash.cloudflare.com
→ R2 → Manage R2 API Tokens
→ Create token (Admin Read & Write)
→ Copy: Access Key ID + Secret Access Key
```

### 2. Create Bucket
```
→ CloudFlare Dashboard → R2
→ Create bucket → Name: dashdig-widget-cdn
→ Done!
```

### 3. Configure
```bash
# Copy template
cp env.example .env.local

# Edit .env.local with your credentials
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
R2_BUCKET_NAME=dashdig-widget-cdn
```

### 4. Verify
```bash
npm run deploy:check
# Should show: ✅ Config OK
```

---

## Deploy

### Full Deployment (Build + Upload)
```bash
npm run deploy
```

### Quick Deploy (Skip Build)
```bash
npm run deploy:quick
```

**That's it!** Your widget is now on CDN.

---

## CDN URLs

### Production (Use This)
```html
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
```

### Latest (Testing Only)
```html
<script src="https://cdn.dashdig.com/latest/dashdig.min.js"></script>
```

### With Security (Recommended)
```html
<script 
  src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"
  integrity="sha384-[hash-from-.cdn-integrity/hashes.txt]"
  crossorigin="anonymous">
</script>
```

---

## What Gets Deployed

```
✅ All bundles (core, React, Vue, Angular)
✅ Compressed versions (Gzip + Brotli)
✅ Source maps
✅ SRI hashes
✅ Versioned + Latest URLs
```

---

## Commands Reference

| Command | What It Does |
|---------|-------------|
| `npm run deploy` | Build + Deploy |
| `npm run deploy:quick` | Deploy only (no build) |
| `npm run deploy:check` | Verify config |
| `npm run build:prod` | Build only |

---

## Files & URLs

### What Gets Uploaded
```
v1.0.0/
├── dashdig.min.js (+ .gz + .br)
├── dashdig.esm.js (+ .gz + .br)
├── dashdig-react.min.js (+ .gz + .br)
├── dashdig-angular.min.js (+ .gz + .br)
└── [source maps]

latest/
└── [same structure]
```

### Your CDN URLs
```
Versioned: https://cdn.dashdig.com/v1.0.0/[file].js
Latest:    https://cdn.dashdig.com/latest/[file].js
```

---

## Troubleshooting

### Missing Config
```bash
❌ Missing: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY

Fix: Edit .env.local with your credentials
```

### Cannot Access Bucket
```bash
❌ Cannot access R2 bucket: Access Denied

Fix: 
1. Check credentials are correct
2. Verify bucket exists
3. Check API token permissions
```

### Build Failed
```bash
❌ Build failed

Fix:
npm run clean
npm install
npm run build:prod
```

---

## Security Checklist

- [ ] Created `.env.local` (not `.env`)
- [ ] Added `.env.local` to `.gitignore` (already done)
- [ ] Never committed credentials to git
- [ ] Using strong API tokens
- [ ] Enabled SRI hashes in production
- [ ] Set up separate prod/staging credentials

---

## Next Steps

1. **Deploy:** `npm run deploy`
2. **Get URLs:** Check terminal output
3. **Use in HTML:** Copy URL from output
4. **Add SRI:** Get hash from `.cdn-integrity/hashes.txt`
5. **Monitor:** CloudFlare Dashboard → R2 → Analytics

---

## Full Documentation

See `CDN_DEPLOYMENT.md` for:
- Detailed setup guide
- Security best practices
- Performance optimization
- Monitoring & analytics
- Rollback procedures
- Cost analysis

---

**Last Updated:** November 8, 2025
**Status:** ✅ Ready to Use

