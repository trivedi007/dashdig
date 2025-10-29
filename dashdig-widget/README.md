# DashDig Embeddable Widget

> AI-powered URL shortener widget for websites

A lightweight, customizable embeddable widget that brings DashDig's powerful URL shortening and analytics capabilities directly to your website. Built with TypeScript and available for vanilla JavaScript, React, Vue, and Angular.

[![npm version](https://img.shields.io/npm/v/@dashdig/widget.svg)](https://www.npmjs.com/package/@dashdig/widget)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@dashdig/widget)](https://bundlephobia.com/package/@dashdig/widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🚀 **Lightweight** - Vanilla JS only 2KB gzipped, React 11KB gzipped
- 🎨 **Customizable** - Light/dark themes, flexible positioning
- 🔒 **Secure** - Shadow DOM isolation, CSP compliant
- 📱 **Responsive** - Works seamlessly on mobile and desktop
- ⚡ **Fast** - Zero dependencies in core bundle
- 🎯 **Framework Agnostic** - Works with any tech stack
- 📊 **Analytics Ready** - Built-in event tracking

---

## 📦 Installation

### NPM / Yarn

```bash
# npm
npm install @dashdig/widget

# yarn
yarn add @dashdig/widget

# pnpm
pnpm add @dashdig/widget
```

### CDN

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/@dashdig/widget@latest/dist/dashdig.min.js"></script>

<!-- Specific version (recommended for production) -->
<script src="https://cdn.jsdelivr.net/npm/@dashdig/widget@1.0.0/dist/dashdig.min.js"></script>

<!-- Unpkg alternative -->
<script src="https://unpkg.com/@dashdig/widget@latest/dist/dashdig.min.js"></script>
```

---

## 🚀 Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DashDig Widget Example</title>
</head>
<body>
  <h1>My Website</h1>
  
  <!-- Load widget from CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@dashdig/widget@latest/dist/dashdig.min.js"></script>
  
  <!-- Initialize widget -->
  <script>
    // Initialize with your API key
    const widget = new DashdigWidget({
      apiKey: 'your-api-key-here',
      position: 'bottom-right',
      theme: 'light',
      autoShow: true
    });
    
    // Optional: Control programmatically
    // widget.show();
    // widget.hide();
    // widget.track('custom_event', { key: 'value' });
  </script>
</body>
</html>
```

### React

```jsx
import React from 'react';
import { DashdigReactWidget } from '@dashdig/widget/dist/integrations/react';

function App() {
  return (
    <div>
      <h1>My React App</h1>
      
      <DashdigReactWidget
        apiKey="your-api-key-here"
        position="bottom-right"
        theme="light"
        autoShow={true}
        onLoad={() => console.log('Widget loaded!')}
        onError={(error) => console.error('Widget error:', error)}
      />
    </div>
  );
}

export default App;
```

### React Hook

```jsx
import React from 'react';
import { useDashdig } from '@dashdig/widget/dist/integrations/react';

function App() {
  const { show, hide, track, isLoaded, isVisible } = useDashdig('your-api-key-here', {
    position: 'bottom-right',
    theme: 'dark',
    autoShow: false
  });

  return (
    <div>
      <h1>My React App</h1>
      
      {isLoaded && (
        <div>
          <button onClick={show}>Show Widget</button>
          <button onClick={hide}>Hide Widget</button>
          <button onClick={() => track('button_click', { action: 'example' })}>
            Track Event
          </button>
          <p>Widget is {isVisible ? 'visible' : 'hidden'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
```

---

## ⚙️ Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `apiKey` | `string` | **required** | Your DashDig API key for authentication |
| `position` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Widget position on the screen |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme for the widget |
| `autoShow` | `boolean` | `true` | Whether to show widget automatically on load |
| `apiUrl` | `string` | `'https://api.dashdig.com'` | API endpoint (for custom deployments) |

### Example with All Options

```javascript
const widget = new DashdigWidget({
  apiKey: 'your-api-key-here',
  position: 'bottom-left',
  theme: 'dark',
  autoShow: false,
  apiUrl: 'https://custom-api.example.com'
});
```

---

## 📚 API Methods

### `show()`

Display the widget on the page.

```javascript
widget.show();
```

### `hide()`

Hide the widget from the page.

```javascript
widget.hide();
```

### `track(event, data?)`

Track a custom analytics event.

**Parameters:**
- `event` (string): Event name
- `data` (object, optional): Additional event data

```javascript
widget.track('button_click', { 
  button: 'signup',
  page: 'home' 
});

widget.track('page_view');
```

### `destroy()`

Remove the widget completely and clean up all resources.

```javascript
widget.destroy();
```

### `getConfig()`

Get the current widget configuration.

```javascript
const config = widget.getConfig();
console.log(config.theme); // 'light' or 'dark'
```

### `isShown()`

Check if the widget is currently visible.

```javascript
if (widget.isShown()) {
  console.log('Widget is visible');
}
```

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

### Required Features
- ES6+ support
- Shadow DOM v1
- Fetch API
- CSS Custom Properties

---

## 📊 Bundle Sizes

| Package | Minified | Gzipped |
|---------|----------|---------|
| **Vanilla JS** | ~5 KB | ~2 KB |
| **React** | ~25 KB | ~11 KB |
| **Vue** | ~23 KB | ~10 KB |
| **Angular** | ~28 KB | ~12 KB |

*Note: Sizes include the core widget logic. Framework packages have peer dependencies that are not included in these numbers.*

---

## 🔧 CDN Usage Examples

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>DashDig Widget</title>
</head>
<body>
  <!-- Your content -->
  
  <!-- Widget script -->
  <script src="https://cdn.jsdelivr.net/npm/@dashdig/widget@1.0.0/dist/dashdig.min.js"></script>
  <script>
    new DashdigWidget({
      apiKey: 'your-api-key-here'
    });
  </script>
</body>
</html>
```

### With Custom Configuration

```html
<script src="https://cdn.jsdelivr.net/npm/@dashdig/widget@1.0.0/dist/dashdig.min.js"></script>
<script>
  const widget = new DashdigWidget({
    apiKey: 'your-api-key-here',
    position: 'bottom-left',
    theme: 'dark',
    autoShow: false
  });
  
  // Show widget when user clicks a button
  document.getElementById('show-widget-btn').addEventListener('click', () => {
    widget.show();
  });
  
  // Track custom events
  document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      widget.track('button_clicked', {
        buttonId: e.target.id
      });
    });
  });
</script>
```

### Async Loading (Non-Blocking)

```html
<script>
  // Load widget asynchronously to not block page rendering
  (function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@dashdig/widget@1.0.0/dist/dashdig.min.js';
    script.async = true;
    script.onload = function() {
      window.dashdigWidget = new DashdigWidget({
        apiKey: 'your-api-key-here'
      });
    };
    document.head.appendChild(script);
  })();
</script>
```

---

## 🛠️ Troubleshooting

### Widget Not Appearing

**Problem:** Widget doesn't show up on the page.

**Solutions:**
1. **Check API Key:** Ensure your API key is valid
   ```javascript
   // Verify key is set correctly
   console.log(widget.getConfig().apiKey);
   ```

2. **Check DOM Ready:** Widget initializes after DOM loads
   ```javascript
   // If adding dynamically, ensure DOM is ready
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', initWidget);
   } else {
     initWidget();
   }
   ```

3. **Check z-index conflicts:** Widget uses `z-index: 999999`
   ```css
   /* If your site has higher z-index elements */
   #dashdig-widget-container {
     z-index: 9999999 !important;
   }
   ```

4. **Verify autoShow setting:**
   ```javascript
   const widget = new DashdigWidget({
     apiKey: 'your-key',
     autoShow: true // Make sure this is true
   });
   ```

### API Errors

**Problem:** Console shows API connection errors.

**Solutions:**
1. **Check API Key:** Verify your API key is active
2. **Check Network:** Ensure `https://api.dashdig.com` is accessible
3. **CORS Issues:** Widget should handle CORS automatically, but check browser console
4. **Custom API URL:** If using custom deployment, verify the URL
   ```javascript
   const widget = new DashdigWidget({
     apiKey: 'your-key',
     apiUrl: 'https://your-custom-api.com' // Verify this URL
   });
   ```

### Widget Styling Issues

**Problem:** Widget looks broken or unstyled.

**Solutions:**
1. **Shadow DOM Support:** Ensure browser supports Shadow DOM
   ```javascript
   if (!document.body.attachShadow) {
     console.error('Browser does not support Shadow DOM');
   }
   ```

2. **CSS Conflicts:** Widget uses Shadow DOM for isolation, but check for:
   - Global CSS resets affecting positioning
   - Parent container with `overflow: hidden`
   - Transform or filter properties on parent elements

3. **Theme Issues:** Try switching themes
   ```javascript
   // Try opposite theme
   const widget = new DashdigWidget({
     apiKey: 'your-key',
     theme: 'dark' // or 'light'
   });
   ```

### React Integration Issues

**Problem:** Widget not working in React app.

**Solutions:**
1. **Import Path:** Use correct import path
   ```javascript
   // Correct
   import { DashdigReactWidget } from '@dashdig/widget/dist/integrations/react';
   
   // Also works
   import { useDashdig } from '@dashdig/widget/dist/integrations/react';
   ```

2. **Multiple Instances:** Avoid rendering multiple widgets
   ```jsx
   // Bad - creates multiple instances
   {items.map(item => <DashdigReactWidget key={item.id} apiKey="..." />)}
   
   // Good - single instance
   <DashdigReactWidget apiKey="..." />
   ```

3. **Cleanup:** Widget auto-cleans on unmount, but verify:
   ```jsx
   useEffect(() => {
     // Manual cleanup if needed
     return () => {
       // Widget automatically destroyed
     };
   }, []);
   ```

### Performance Issues

**Problem:** Widget causing page slowdown.

**Solutions:**
1. **Lazy Load:** Load widget after initial page render
   ```javascript
   window.addEventListener('load', () => {
     setTimeout(() => {
       new DashdigWidget({ apiKey: 'your-key' });
     }, 2000); // Load 2 seconds after page load
   });
   ```

2. **Conditional Loading:** Only load on certain pages
   ```javascript
   if (window.location.pathname === '/dashboard') {
     new DashdigWidget({ apiKey: 'your-key' });
   }
   ```

### Getting Help

If you continue to experience issues:

1. **Check Console:** Open browser DevTools and look for `[DashDig]` prefixed messages
2. **GitHub Issues:** Report bugs at [github.com/dashdig/dashdig-widget/issues](https://github.com/dashdig/dashdig-widget/issues)
3. **Documentation:** Visit [dashdig.com/docs](https://dashdig.com/docs)
4. **Support:** Contact support@dashdig.com

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/dashdig-widget.git
   cd dashdig-widget
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

```bash
# Build all packages
npm run build

# Build specific package
npm run build:core
npm run build:react
npm run build:vue
npm run build:angular

# Development mode (watch)
npm run dev
npm run dev:react

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Type checking
npm run type-check

# Validate everything
npm run validate
```

### Code Standards

- **TypeScript:** All code must be written in TypeScript
- **ESLint:** Code must pass linting (`npm run lint`)
- **Prettier:** Code must be formatted (`npm run format`)
- **Tests:** New features must include tests
- **Types:** Maintain strict type safety
- **Documentation:** Update docs for new features

### Pull Request Process

1. **Update tests** for any changed functionality
2. **Update documentation** in README.md
3. **Run validation** before submitting
   ```bash
   npm run validate
   ```
4. **Write clear commit messages**
   ```
   feat: add new configuration option
   fix: resolve widget positioning bug
   docs: update API documentation
   ```
5. **Submit PR** with:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build process or tooling changes

### Reporting Bugs

Please include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Code example (if applicable)
- Console errors/warnings

### Suggesting Features

Open an issue with:
- Clear use case
- Expected behavior
- Example implementation (optional)
- Impact assessment

---

## 📄 License

MIT License

Copyright (c) 2024 DashDig

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🔗 Links

- **Website:** [dashdig.com](https://dashdig.com)
- **Documentation:** [dashdig.com/docs](https://dashdig.com/docs)
- **GitHub:** [github.com/dashdig/dashdig-widget](https://github.com/dashdig/dashdig-widget)
- **NPM:** [npmjs.com/package/@dashdig/widget](https://www.npmjs.com/package/@dashdig/widget)
- **Issues:** [github.com/dashdig/dashdig-widget/issues](https://github.com/dashdig/dashdig-widget/issues)
- **Support:** support@dashdig.com

---

## 🙏 Acknowledgments

Built with:
- [TypeScript](https://www.typescriptlang.org/)
- [Rollup](https://rollupjs.org/)
- [Vitest](https://vitest.dev/)

---

<div align="center">
  
**Made with ❤️ by the DashDig Team**

[⭐ Star us on GitHub](https://github.com/dashdig/dashdig-widget) • [📦 View on NPM](https://www.npmjs.com/package/@dashdig/widget)

</div>
