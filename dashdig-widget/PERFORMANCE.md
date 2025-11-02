# ⚡ Performance Optimization Guide

This document outlines the performance optimizations implemented in the DashDig widget to achieve sub-50ms load times and excellent Web Vitals scores.

## 🎯 Performance Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **TTFB** | < 800ms | Time to First Byte |
| **FCP** | < 1.8s | First Contentful Paint |
| **Bundle Size** | < 30KB | Vanilla JS (gzipped) |
| **React Bundle** | < 12KB | React integration (gzipped) |

## 📦 Bundle Size Optimization

### Aggressive Tree-Shaking

The Rollup configuration includes aggressive tree-shaking to remove unused code:

```javascript
treeshake: {
  moduleSideEffects: false,
  propertyReadSideEffects: false,
  tryCatchDeoptimization: false,
  unknownGlobalSideEffects: false
}
```

### Terser Compression

Aggressive minification with Terser:

- **Compression passes**: 3 (for maximum reduction)
- **Console removal**: All console statements removed in production
- **Unsafe optimizations**: Enabled for smaller output
- **Property mangling**: Private properties (prefixed with `_`) are mangled
- **ES2020 output**: Modern syntax for smaller bundles

### Code Splitting

The widget automatically splits code for:
- Heavy dependencies into separate vendor chunks
- Non-critical features loaded on-demand
- Analytics module loaded only when first event tracked

### Pre-Compression

All bundles are pre-compressed with:
- **Gzip** compression (best compatibility)
- **Brotli** compression (best compression ratio, ~20% smaller than gzip)

```bash
npm run build:prod  # Builds and compresses all files
```

## 🚀 Loading Performance

### Resource Hints

The widget automatically adds resource hints for faster loading:

```html
<!-- Preconnect to API (fastest) -->
<link rel="preconnect" href="https://api.dashdig.com" crossorigin>

<!-- DNS prefetch for CDN (fallback) -->
<link rel="dns-prefetch" href="https://cdn.dashdig.com">
```

### Async Initialization

Widget initialization uses `requestIdleCallback` to avoid blocking the main thread:

```javascript
onIdle(() => {
  this.render();
  this.setupEvents();
}, { timeout: 2000 });
```

### Lazy Loading

Intersection Observer is used to defer non-critical rendering:

```javascript
// Only loads full content when widget is visible in viewport
const observer = createIntersectionObserver(
  (entry) => {
    if (entry.isIntersecting) {
      loadNonCriticalContent();
    }
  },
  { rootMargin: '50px', threshold: 0.1 }
);
```

## ⚡ Runtime Performance

### Debouncing & Throttling

Event handlers are optimized to reduce overhead:

```javascript
// Scroll events debounced to 200ms
const handleScroll = debounce(() => {
  this.track('scroll', { scrollY: window.scrollY });
}, 200);

// Resize events throttled to 100ms
const handleResize = throttle(() => {
  this.track('resize', { width: window.innerWidth });
}, 100);
```

### Passive Event Listeners

All scroll and touch event listeners use `passive: true` for better scroll performance:

```javascript
window.addEventListener('scroll', handleScroll, { passive: true });
```

### Shadow DOM Isolation

The widget uses Shadow DOM for:
- Complete CSS isolation (no style conflicts)
- Faster initial rendering
- Better encapsulation

## 📊 Web Vitals Monitoring

### Automatic Tracking

The widget automatically tracks Core Web Vitals:

```javascript
const widget = new DashdigWidget({
  apiKey: 'your-api-key',
  enableWebVitals: true  // Enable tracking (default: true)
});
```

### Metrics Collected

- **LCP (Largest Contentful Paint)**: Time until largest content element renders
- **FID (First Input Delay)**: Time from first interaction to browser response
- **CLS (Cumulative Layout Shift)**: Visual stability score
- **TTFB (Time to First Byte)**: Server response time
- **FCP (First Contentful Paint)**: Time until first content renders

### Performance Reporting

Metrics are automatically sent to the analytics endpoint:

```javascript
// Sent via sendBeacon for reliability
navigator.sendBeacon(`${apiUrl}/v1/performance`, metricsData);
```

## 🎨 Best Practices for Users

### 1. Use Resource Hints

Always include resource hints in your HTML:

```html
<head>
  <link rel="preconnect" href="https://api.dashdig.com" crossorigin>
  <link rel="dns-prefetch" href="https://cdn.dashdig.com">
</head>
```

### 2. Async Script Loading

Load the widget asynchronously:

```javascript
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@dashdig/widget@1.0.0/dist/dashdig.min.js';
script.async = true;
document.head.appendChild(script);
```

### 3. Use requestIdleCallback

Initialize widget when browser is idle:

```javascript
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    new DashdigWidget({ apiKey: 'your-api-key' });
  }, { timeout: 2000 });
} else {
  setTimeout(() => {
    new DashdigWidget({ apiKey: 'your-api-key' });
  }, 1);
}
```

### 4. Enable Brotli Compression

Configure your server to serve `.br` files when available:

```nginx
# Nginx configuration
location ~* \.js$ {
  gzip_static on;
  brotli_static on;
}
```

### 5. Set Proper Cache Headers

Cache widget files for better repeat visits:

```nginx
location ~* \.js$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## 📈 Performance Monitoring

### Bundle Size Checks

Run size checks before deployment:

```bash
npm run size        # Check bundle sizes
npm run size:why    # Analyze what's in the bundle
npm run analyze     # Visualize bundle composition
```

### CI/CD Integration

Size limits are enforced in CI:

```json
{
  "size-limit": [
    {
      "name": "Vanilla JS Bundle",
      "path": "dist/dashdig.min.js",
      "limit": "30 KB",
      "gzip": true
    }
  ]
}
```

## 🔧 Development Tips

### 1. Measure First

Always measure before optimizing:

```javascript
performance.mark('widget-start');
// ... widget initialization
performance.mark('widget-end');
performance.measure('widget-init', 'widget-start', 'widget-end');
```

### 2. Profile in Production Mode

Test performance with production builds:

```bash
npm run build  # Build production bundles
npm run size   # Check sizes
```

### 3. Test on Real Devices

Use real devices for testing:
- Low-end Android devices
- Slow 3G connections
- Desktop with throttling

### 4. Monitor Web Vitals

Check Core Web Vitals in production:
- Chrome DevTools Lighthouse
- PageSpeed Insights
- Web Vitals extension

## 🎯 Optimization Checklist

- [x] Aggressive tree-shaking enabled
- [x] Terser compression with 3 passes
- [x] Pre-compressed Gzip and Brotli files
- [x] Resource hints (preconnect, dns-prefetch)
- [x] Async initialization with requestIdleCallback
- [x] Debounced scroll handlers (200ms)
- [x] Throttled resize handlers (100ms)
- [x] Passive event listeners
- [x] Intersection Observer for lazy loading
- [x] Shadow DOM for CSS isolation
- [x] Web Vitals tracking
- [x] Performance budgets in package.json
- [x] Bundle analyzer integration

## 📚 Additional Resources

- [Web Vitals](https://web.dev/vitals/)
- [Optimize LCP](https://web.dev/optimize-lcp/)
- [Optimize FID](https://web.dev/optimize-fid/)
- [Optimize CLS](https://web.dev/optimize-cls/)
- [Resource Hints](https://www.w3.org/TR/resource-hints/)
- [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

---

**Last Updated**: October 29, 2025
**Widget Version**: 1.0.0

