# DashDig Widget - Production Deployment Guide

Complete guide for deploying the DashDig URL shortener widget to production.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Build for Production](#build-for-production)
- [CDN Deployment](#cdn-deployment)
- [NPM Publishing](#npm-publishing)
- [Version Management](#version-management)
- [Security](#security)
- [Monitoring](#monitoring)

---

## Pre-Deployment Checklist

Before deploying to production, ensure all these items are completed:

### ✅ Code Quality
- [ ] All tests pass (`npm test`)
- [ ] No linter errors (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Code is formatted (`npm run format:check`)

### ✅ Bundle Size
- [ ] Vanilla JS bundle < 2KB gzipped
- [ ] React bundle < 5KB gzipped
- [ ] Run `npm run size` to verify

### ✅ Documentation
- [ ] README.md is up to date
- [ ] USAGE.md has all examples
- [ ] API documentation is complete
- [ ] CHANGELOG.md is updated

### ✅ Security
- [ ] No sensitive data in code
- [ ] Dependencies are up to date
- [ ] Security audit passed (`npm audit`)
- [ ] SRI hashes generated

### ✅ Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Browser compatibility tested

---

## Build for Production

### 1. Clean Previous Builds

```bash
npm run clean
```

### 2. Install Dependencies

```bash
npm install --production=false
```

### 3. Run Full Build

```bash
npm run build:prod
```

This will:
- Clean dist directory
- Build all bundles (vanilla JS, React, ESM, UMD)
- Minify with Terser
- Generate TypeScript declarations
- Create gzipped versions
- Generate SRI hashes

### 4. Verify Build Output

```bash
ls -lh dist/
```

Expected files:
```
dist/
├── dashdig.min.js          # Vanilla JS (UMD)
├── dashdig.min.js.map      # Source map
├── dashdig.esm.js          # Vanilla JS (ESM)
├── dashdig.esm.js.map      # Source map
├── dashdig-react.min.js    # React (UMD)
├── dashdig-react.min.js.map # Source map
├── dashdig-react.esm.js    # React (ESM)
├── dashdig-react.esm.js.map # Source map
├── *.d.ts                  # TypeScript declarations
└── sri-hashes.json         # SRI integrity hashes
```

### 5. Verify Bundle Sizes

```bash
npm run size
```

Expected output:
```
Package size limit has succeeded!

  dist/dashdig.min.js
  Size:       1.91 KB with all dependencies, minified and gzipped
  Loading time: 38 ms   on slow 3G
  Running time: 94 ms   on Snapdragon 410
  Total time:   132 ms

  dist/dashdig-react.min.js
  Size:       3.35 KB with all dependencies, minified and gzipped
  Loading time: 67 ms   on slow 3G
  Running time: 165 ms  on Snapdragon 410
  Total time:   232 ms
```

---

## CDN Deployment

### Option 1: AWS S3 + CloudFront

#### 1. Upload to S3

```bash
# Install AWS CLI (if not already installed)
# aws configure

# Upload files
aws s3 cp dist/ s3://cdn.dashdig.com/widget/v1/ \
  --recursive \
  --exclude "*.map" \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "application/javascript"

# Upload source maps separately (with restricted access)
aws s3 cp dist/ s3://cdn.dashdig.com/widget/v1/maps/ \
  --recursive \
  --include "*.map" \
  --cache-control "public, max-age=31536000"
```

#### 2. Configure CloudFront

```json
{
  "Origins": [{
    "DomainName": "cdn.dashdig.com.s3.amazonaws.com",
    "OriginPath": "/widget"
  }],
  "DefaultCacheBehavior": {
    "Compress": true,
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
    "CachedMethods": ["GET", "HEAD"],
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }
}
```

#### 3. Invalidate Cache (for updates)

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/widget/v1/*"
```

### Option 2: Cloudflare R2

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Upload
wrangler r2 object put dashdig-cdn/widget/v1/dashdig.min.js \
  --file dist/dashdig.min.js \
  --content-type "application/javascript"
```

### Option 3: jsDelivr (Via NPM)

Once published to NPM, jsDelivr will automatically serve it:

```html
<!-- Auto-served from NPM -->
<script src="https://cdn.jsdelivr.net/npm/@dashdig/widget@1/dist/dashdig.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/@dashdig/widget@1.0.0/dist/dashdig.min.js"></script>
```

### CDN URLs

After deployment, your widget will be available at:

```
https://cdn.dashdig.com/widget/v1/dashdig.min.js
https://cdn.dashdig.com/widget/v1/dashdig.esm.js
https://cdn.dashdig.com/widget/v1/dashdig-react.min.js
https://cdn.dashdig.com/widget/v1/dashdig-react.esm.js
```

### Verify CDN Deployment

```bash
# Check if files are accessible
curl -I https://cdn.dashdig.com/widget/v1/dashdig.min.js

# Expected response:
# HTTP/2 200
# content-type: application/javascript
# cache-control: public, max-age=31536000, immutable
# content-encoding: gzip
```

---

## NPM Publishing

### 1. Update Version

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### 2. Verify Package Contents

```bash
# Dry run to see what will be published
npm pack --dry-run

# Check files that will be included
npm publish --dry-run
```

Expected files in package:
```
package/
├── dist/
│   ├── *.js
│   ├── *.d.ts
│   └── sri-hashes.json
├── README.md
├── USAGE.md
├── LICENSE
└── package.json
```

### 3. Test Package Locally

```bash
# Create tarball
npm pack

# Install in test project
cd /path/to/test-project
npm install /path/to/dashdig-widget/dashdig-widget-1.0.0.tgz

# Test import
node -e "const Dashdig = require('@dashdig/widget'); console.log(Dashdig);"
```

### 4. Publish to NPM

```bash
# Login to NPM (first time only)
npm login

# Publish
npm publish --access public

# For scoped packages
npm publish --access public
```

### 5. Verify Publication

```bash
# Check package on NPM
npm view @dashdig/widget

# Install and test
npm install @dashdig/widget
```

### 6. Tag Release on GitHub

```bash
# Create and push tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Create GitHub release
gh release create v1.0.0 \
  --title "v1.0.0" \
  --notes "See CHANGELOG.md for details" \
  dist/*.js \
  dist/sri-hashes.json
```

---

## Version Management

### Semantic Versioning

Follow [SemVer](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (1.X.0): New features (backward compatible)
- **PATCH** (1.0.X): Bug fixes

### Version Strategy

```
v1.0.0 - Initial release
v1.0.1 - Bug fixes
v1.1.0 - New features (backward compatible)
v2.0.0 - Breaking changes
```

### CDN Versioning

Maintain multiple versions on CDN:

```
/widget/
  /v1/           # Latest v1.x.x (auto-updates)
  /v1.0.0/       # Specific version (immutable)
  /v1.0.1/       # Specific version (immutable)
  /latest/       # Latest stable (all majors)
```

Users can choose:
- **Pinned**: `v1.0.0` (no auto-updates, most stable)
- **Minor updates**: `v1` (auto-updates to v1.x.x, safer)
- **Latest**: `latest` (all updates, least stable)

---

## Security

### 1. Generate SRI Hashes

```bash
# Generate hashes for all bundles
npm run generate-sri

# Or manually
openssl dgst -sha384 -binary dist/dashdig.min.js | openssl base64 -A
```

### 2. Provide SRI in Documentation

Update README with SRI hashes:

```html
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" 
        data-dashdig-key="your-api-key"
        integrity="sha384-Uz8GoxDTr2D+tVVlEtblXchdNt6bieF1r97/7DqGmFSxAZISWtst+J277aK7Yxb4"
        crossorigin="anonymous"></script>
```

### 3. Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force
```

### 4. HTTPS Only

Ensure CDN serves over HTTPS only:

```javascript
// In CDN configuration
{
  "ViewerProtocolPolicy": "redirect-to-https"
}
```

### 5. Content Security Policy

Provide CSP headers:

```
Content-Security-Policy: 
  script-src 'self' https://cdn.dashdig.com;
  connect-src 'self' https://api.dashdig.com;
```

---

## Monitoring

### 1. CDN Analytics

Monitor:
- Request count
- Bandwidth usage
- Cache hit rate
- Geographic distribution
- Error rates

### 2. Error Tracking

Integrate error tracking in widget:

```javascript
// In production build
window.addEventListener('error', (event) => {
  if (event.filename?.includes('dashdig')) {
    // Send error to monitoring service
    fetch('https://api.dashdig.com/errors', {
      method: 'POST',
      body: JSON.stringify({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    });
  }
});
```

### 3. Performance Monitoring

Track Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms

### 4. Usage Analytics

Monitor:
- Widget initialization rate
- API call success/failure rates
- Average response times
- Geographic distribution of users
- Browser/device breakdown

---

## Deployment Checklist

### Pre-Deployment
- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated
- [ ] All tests pass
- [ ] Bundle sizes verified
- [ ] Security audit passed
- [ ] Documentation updated

### Deployment
- [ ] Production build created
- [ ] Files uploaded to CDN
- [ ] NPM package published
- [ ] Git tag created
- [ ] GitHub release created
- [ ] CDN cache invalidated

### Post-Deployment
- [ ] CDN files accessible
- [ ] NPM package installable
- [ ] Documentation site updated
- [ ] Monitoring dashboards checked
- [ ] Team notified
- [ ] Social media announcement (optional)

---

## Rollback Plan

If issues are discovered after deployment:

### 1. Immediate Rollback (CDN)

```bash
# Revert to previous version on CDN
aws s3 cp s3://cdn.dashdig.com/widget/v1.0.0/ \
          s3://cdn.dashdig.com/widget/v1/ \
          --recursive

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/widget/v1/*"
```

### 2. NPM Deprecation

```bash
# Deprecate bad version
npm deprecate @dashdig/widget@1.0.1 "This version has issues, use 1.0.0 instead"

# Or unpublish within 72 hours
npm unpublish @dashdig/widget@1.0.1
```

### 3. Communication

- Update status page
- Notify users via email/Twitter
- Post incident report
- Document lessons learned

---

## Support

For deployment issues or questions:

- **Documentation**: https://docs.dashdig.com
- **GitHub Issues**: https://github.com/dashdig/dashdig-widget/issues
- **Email**: devops@dashdig.com
- **Slack**: #widget-deployments

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0




