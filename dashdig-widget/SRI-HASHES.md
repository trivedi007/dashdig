# DashDig Widget - SRI Hashes

Generated: 2025-10-31T21:33:34.278Z

## Bundle Information

### dashdig.min.js

- **File**: `dist/dashdig.min.js`
- **Size**: 4.69 KB (1.91 KB gzipped)
- **CDN URL**: `https://cdn.dashdig.com/widget/v1/dashdig.min.js`
- **SRI Hash**: `sha384-Uz8GoxDTr2D+tVVlEtblXchdNt6bieF1r97/7DqGmFSxAZISWtst+J277aK7Yxb4`

### dashdig.esm.js

- **File**: `dist/dashdig.esm.js`
- **Size**: 4.43 KB (1.80 KB gzipped)
- **CDN URL**: `https://cdn.dashdig.com/widget/v1/dashdig.esm.js`
- **SRI Hash**: `sha384-axCyjs6CqtE7Z2/obyEF2ZCPLtl6Um4SO6UtMtzh63zqHb9zXbo42ZvtkHHaq8Fl`

### dashdig-react.min.js

- **File**: `dist/dashdig-react.min.js`
- **Size**: 8.96 KB (3.35 KB gzipped)
- **CDN URL**: `https://cdn.dashdig.com/widget/v1/dashdig-react.min.js`
- **SRI Hash**: `sha384-CbgZBQVl5l3MfhvNFjs3NEDE3Ne1/BZxySUpJXz8RaKcAWgdWeQRsz4vuMhmAWl6`

### dashdig-react.esm.js

- **File**: `dist/dashdig-react.esm.js`
- **Size**: 8.63 KB (3.23 KB gzipped)
- **CDN URL**: `https://cdn.dashdig.com/widget/v1/dashdig-react.esm.js`
- **SRI Hash**: `sha384-KBarygoT+dhEVa/N9B6XF5X7KfOmJCuQAPKUKYSrQ1fN6cYDuhOBERTBFhFAzLDh`

## CDN Integration

### Vanilla JavaScript (Auto-init)

```html
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js"
        data-dashdig-key="your-api-key-here"
        integrity="sha384-Uz8GoxDTr2D+tVVlEtblXchdNt6bieF1r97/7DqGmFSxAZISWtst+J277aK7Yxb4"
        crossorigin="anonymous"></script>
```

### React Integration

```html
<script src="https://cdn.dashdig.com/widget/v1/dashdig-react.min.js"
        integrity="sha384-CbgZBQVl5l3MfhvNFjs3NEDE3Ne1/BZxySUpJXz8RaKcAWgdWeQRsz4vuMhmAWl6"
        crossorigin="anonymous"></script>
```

### ES Module

```html
<script type="module">
  import Dashdig from 'https://cdn.dashdig.com/widget/v1/dashdig.esm.js';
  // ES modules with SRI requires 'integrity' attribute support
</script>
```

## Security Notes

1. **SRI (Subresource Integrity)** ensures that files loaded from CDNs haven't been tampered with.
2. Always use `crossorigin="anonymous"` attribute with SRI.
3. Update SRI hashes after every new build/release.
4. ES module integrity support varies by browser. Use UMD bundles for maximum compatibility.

## Verification

To verify a file's integrity:

```bash
# Generate hash locally
cat dist/dashdig.min.js | openssl dgst -sha384 -binary | openssl base64 -A

# Compare with SRI hash (without 'sha384-' prefix)
```

## NPM Package

For bundler-based projects, install via NPM:

```bash
npm install @dashdig/widget
```

No SRI needed for NPM packages as they're verified through package integrity checks.
