# DashDig Widget - Usage Guide

Complete guide for integrating the DashDig URL shortener widget into your application.

## Table of Contents

- [Installation](#installation)
- [Vanilla JavaScript](#vanilla-javascript)
- [React Integration](#react-integration)
- [Vue 3 Integration](#vue-3-integration)
- [Angular Integration](#angular-integration)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Error Handling](#error-handling)

---

## Installation

### Via CDN (Recommended for Quick Start)

```html
<!-- Vanilla JavaScript -->
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" 
        data-dashdig-key="your-api-key-here"
        crossorigin="anonymous"></script>

<!-- React (requires React to be loaded first) -->
<script src="https://cdn.dashdig.com/widget/v1/dashdig-react.min.js" 
        crossorigin="anonymous"></script>
```

### Via NPM

```bash
npm install @dashdig/widget
```

### Via Yarn

```bash
yarn add @dashdig/widget
```

---

## Vanilla JavaScript

### Method 1: Auto-Initialize from Script Tag

The simplest way to use the widget - it automatically initializes when the script loads:

```html
<!DOCTYPE html>
<html>
<head>
    <title>DashDig URL Shortener</title>
</head>
<body>
    <h1>Shorten Your URLs</h1>
    
    <!-- Auto-init with data-dashdig-key attribute -->
    <script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" 
            data-dashdig-key="your-api-key-here"
            crossorigin="anonymous"></script>
    
    <script>
        // Widget is automatically initialized and ready to use
        async function shortenUrl() {
            try {
                const result = await Dashdig.shorten({
                    url: 'https://example.com/very/long/url'
                });
                
                console.log('Shortened URL:', result.shortUrl);
                console.log('Short Code:', result.shortCode);
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    </script>
</body>
</html>
```

### Method 2: Manual Initialization

For more control over when the widget initializes:

```html
<!DOCTYPE html>
<html>
<head>
    <title>DashDig URL Shortener</title>
</head>
<body>
    <h1>Shorten Your URLs</h1>
    
    <!-- Load script without auto-init -->
    <script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" 
            crossorigin="anonymous"></script>
    
    <script>
        // Initialize manually
        Dashdig.init({
            apiKey: 'your-api-key-here',
            baseUrl: 'https://api.dashdig.com' // optional
        });
        
        // Now you can use the widget
        async function shortenUrl() {
            const result = await Dashdig.shorten({
                url: 'https://example.com/long-url'
            });
            console.log(result.shortUrl);
        }
    </script>
</body>
</html>
```

### Method 3: ES Module Import

For modern applications using ES6 modules:

```javascript
import Dashdig from '@dashdig/widget';

// Initialize
Dashdig.init({
    apiKey: 'your-api-key-here'
});

// Shorten a URL
const result = await Dashdig.shorten({
    url: 'https://example.com/long-url'
});

console.log(result.shortUrl);
```

### Complete Example with UI

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DashDig URL Shortener</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        
        .container {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #e1e4e8;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        
        button {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            font-weight: 600;
            color: white;
            background: #667eea;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        button:hover {
            background: #5568d3;
        }
        
        button:disabled {
            background: #cbd5e0;
            cursor: not-allowed;
        }
        
        .result {
            margin-top: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border: 2px solid #667eea;
        }
        
        .result a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        
        .error {
            margin-top: 12px;
            padding: 12px;
            background: #fed7d7;
            color: #9b2c2c;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔗 URL Shortener</h1>
        <p>Shorten your long URLs instantly</p>
        
        <form id="shortenForm">
            <input 
                type="url" 
                id="urlInput" 
                placeholder="Enter your long URL..." 
                required
            >
            
            <input 
                type="text" 
                id="customSlug" 
                placeholder="Custom slug (optional)" 
                pattern="[a-zA-Z0-9_-]+"
            >
            
            <button type="submit" id="submitBtn">Shorten URL</button>
        </form>
        
        <div id="result" style="display:none;" class="result">
            <strong>✅ Shortened URL:</strong><br>
            <a id="shortUrl" href="" target="_blank"></a>
            <button onclick="copyToClipboard()" style="margin-top:10px;width:auto;padding:8px 16px;">
                📋 Copy
            </button>
        </div>
        
        <div id="error" style="display:none;" class="error"></div>
    </div>
    
    <!-- Load DashDig Widget -->
    <script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" 
            data-dashdig-key="your-api-key-here"
            crossorigin="anonymous"></script>
    
    <script>
        const form = document.getElementById('shortenForm');
        const urlInput = document.getElementById('urlInput');
        const customSlug = document.getElementById('customSlug');
        const submitBtn = document.getElementById('submitBtn');
        const resultDiv = document.getElementById('result');
        const errorDiv = document.getElementById('error');
        const shortUrlLink = document.getElementById('shortUrl');
        
        let lastShortUrl = '';
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Hide previous results
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Shortening...';
            
            try {
                const options = {
                    url: urlInput.value.trim()
                };
                
                // Add custom slug if provided
                if (customSlug.value.trim()) {
                    options.customSlug = customSlug.value.trim();
                }
                
                // Shorten the URL
                const result = await Dashdig.shorten(options);
                
                // Show result
                lastShortUrl = result.shortUrl;
                shortUrlLink.href = result.shortUrl;
                shortUrlLink.textContent = result.shortUrl;
                resultDiv.style.display = 'block';
                
                // Track success event
                Dashdig.track('url_shortened_via_ui', {
                    hasCustomSlug: !!options.customSlug
                });
                
                // Clear form
                urlInput.value = '';
                customSlug.value = '';
                
            } catch (error) {
                // Show error
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
                
                // Track error
                Dashdig.track('shorten_error_via_ui', {
                    error: error.message
                });
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Shorten URL';
            }
        });
        
        async function copyToClipboard() {
            try {
                await navigator.clipboard.writeText(lastShortUrl);
                alert('✅ Copied to clipboard!');
                
                Dashdig.track('url_copied', { url: lastShortUrl });
            } catch (error) {
                console.error('Failed to copy:', error);
            }
        }
    </script>
</body>
</html>
```

---

## React Integration

### Method 1: Provider + Hook (Recommended)

Wrap your app with `DashdigProvider` and use the `useDashdig` hook in components:

```jsx
import React from 'react';
import { DashdigProvider, useDashdig } from '@dashdig/widget/react';

// Main App Component
function App() {
    return (
        <DashdigProvider apiKey="your-api-key-here">
            <URLShortenerForm />
        </DashdigProvider>
    );
}

// Component that uses the hook
function URLShortenerForm() {
    const { shorten, isLoading, error } = useDashdig();
    const [url, setUrl] = React.useState('');
    const [result, setResult] = React.useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const shortened = await shorten({ url });
            setResult(shortened);
            setUrl(''); // Clear input
        } catch (err) {
            console.error('Failed to shorten URL:', err);
        }
    };
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL to shorten..."
                    required
                />
                <button type="submit" disabled={isLoading || !url}>
                    {isLoading ? 'Shortening...' : 'Shorten URL'}
                </button>
            </form>
            
            {error && <div className="error">{error.message}</div>}
            
            {result && (
                <div className="result">
                    <p>Shortened URL: <a href={result.shortUrl}>{result.shortUrl}</a></p>
                </div>
            )}
        </div>
    );
}

export default App;
```

### Method 2: Pre-built Component

Use the ready-made `DashdigShortener` component:

```jsx
import React from 'react';
import { DashdigProvider, DashdigShortener } from '@dashdig/widget/react';

function App() {
    return (
        <DashdigProvider apiKey="your-api-key-here">
            <h1>URL Shortener</h1>
            
            <DashdigShortener
                placeholder="Enter your URL here..."
                buttonText="Shorten It!"
                allowCustomSlug={true}
                allowExpiration={true}
                onSuccess={(shortUrl, shortCode) => {
                    console.log('Success!', shortUrl);
                }}
                onError={(error) => {
                    console.error('Error:', error);
                }}
            />
        </DashdigProvider>
    );
}

export default App;
```

### Method 3: Multiple Components with Shared State

```jsx
import React from 'react';
import { DashdigProvider, useDashdig } from '@dashdig/widget/react';

function App() {
    return (
        <DashdigProvider apiKey="your-api-key-here">
            <Header />
            <URLShortenerForm />
            <RecentLinks />
        </DashdigProvider>
    );
}

function Header() {
    const { isInitialized } = useDashdig();
    
    return (
        <header>
            <h1>DashDig URL Shortener</h1>
            {isInitialized ? (
                <span>✅ Connected</span>
            ) : (
                <span>⏳ Connecting...</span>
            )}
        </header>
    );
}

function URLShortenerForm() {
    const { shorten, isLoading, track } = useDashdig();
    const [url, setUrl] = React.useState('');
    const [customSlug, setCustomSlug] = React.useState('');
    const [result, setResult] = React.useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const options = { url };
            
            if (customSlug) {
                options.customSlug = customSlug;
            }
            
            const shortened = await shorten(options);
            setResult(shortened);
            
            // Track success
            track('url_shortened', {
                hasCustomSlug: !!customSlug
            });
            
            // Clear form
            setUrl('');
            setCustomSlug('');
        } catch (err) {
            console.error('Failed:', err);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL..."
                required
            />
            
            <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="Custom slug (optional)"
                pattern="[a-zA-Z0-9_-]+"
            />
            
            <button type="submit" disabled={isLoading || !url}>
                {isLoading ? 'Shortening...' : 'Shorten'}
            </button>
            
            {result && (
                <div>
                    <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                        {result.shortUrl}
                    </a>
                </div>
            )}
        </form>
    );
}

function RecentLinks() {
    const { track } = useDashdig();
    
    const handleLinkClick = (url) => {
        track('recent_link_clicked', { url });
    };
    
    return (
        <div>
            <h3>Recent Links</h3>
            {/* Your recent links UI here */}
        </div>
    );
}

export default App;
```

---

## Vue 3 Integration

DashDig provides three flexible ways to integrate with Vue 3 applications, all with full TypeScript support.

### Installation

```bash
npm install @dashdig/widget
# or
yarn add @dashdig/widget
```

### Method 1: useDashdig Composable (Recommended) ⭐

The composable provides the most Vue-native experience with reactive state and automatic lifecycle management.

```vue
<script setup lang="ts">
import { useDashdig } from '@dashdig/widget/vue';
import { ref } from 'vue';

const url = ref('');
const result = ref(null);

// Initialize widget with composable
const { show, hide, track, isLoaded, isVisible } = useDashdig('your-api-key', {
  position: 'bottom-right',
  theme: 'dark',
  autoShow: false
});

async function shortenUrl() {
  try {
    const response = await fetch('https://api.dashdig.com/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.value })
    });
    
    result.value = await response.json();
    track('url_shortened', { url: url.value });
  } catch (error) {
    console.error('Error:', error);
  }
}
</script>

<template>
  <div>
    <input
      v-model="url"
      type="url"
      placeholder="Enter URL to shorten..."
    />
    
    <button @click="shortenUrl" :disabled="!isLoaded">
      Shorten URL
    </button>
    
    <button @click="show" :disabled="!isLoaded">
      Show Widget
    </button>
    
    <button @click="hide" :disabled="!isLoaded">
      Hide Widget
    </button>
    
    <div v-if="result">
      <p>Shortened: <a :href="result.shortUrl">{{ result.shortUrl }}</a></p>
    </div>
    
    <p v-if="isLoaded" class="status">
      ✅ Widget loaded | Visible: {{ isVisible }}
    </p>
  </div>
</template>
```

**Composable API:**

```typescript
const {
  show,       // () => void - Show the widget
  hide,       // () => void - Hide the widget
  track,      // (event: string, data?: object) => void - Track events
  isLoaded,   // Readonly<Ref<boolean>> - Widget loaded state
  isVisible,  // Readonly<Ref<boolean>> - Widget visibility state
  widget      // Readonly<Ref<Widget | null>> - Widget instance
} = useDashdig(apiKey, options);
```

**Options:**

```typescript
interface UseDashdigOptions {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
  apiUrl?: string;
}
```

---

### Method 2: Component Approach

Use the `<DashdigWidget>` component for declarative integration.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import DashdigWidget from '@dashdig/widget/vue';

const widgetRef = ref(null);
const apiKey = ref('your-api-key');
const position = ref('bottom-right');
const theme = ref('light');

const showWidget = () => widgetRef.value?.show();
const hideWidget = () => widgetRef.value?.hide();

const trackEvent = () => {
  widgetRef.value?.track('button_click', {
    source: 'vue_component',
    timestamp: new Date().toISOString()
  });
};

const onLoad = () => {
  console.log('Widget loaded successfully');
};

const onError = (error) => {
  console.error('Widget error:', error);
};
</script>

<template>
  <div>
    <!-- DashDig Widget Component -->
    <DashdigWidget
      ref="widgetRef"
      :api-key="apiKey"
      :position="position"
      :theme="theme"
      :auto-show="false"
      @load="onLoad"
      @error="onError"
    />
    
    <!-- Controls -->
    <button @click="showWidget">Show Widget</button>
    <button @click="hideWidget">Hide Widget</button>
    <button @click="trackEvent">Track Event</button>
  </div>
</template>
```

**Component Props:**

- `api-key` (string, required): Your DashDig API key
- `position` ('bottom-right' | 'bottom-left', optional): Widget position
- `theme` ('light' | 'dark', optional): Widget theme
- `auto-show` (boolean, optional): Auto-show on mount
- `api-url` (string, optional): Custom API URL

**Component Events:**

- `@load`: Emitted when widget loads successfully
- `@error`: Emitted on initialization error

**Exposed Methods (via ref):**

- `show()`: Show the widget
- `hide()`: Hide the widget
- `track(event, data)`: Track custom events
- `widget`: Access the underlying widget instance

---

### Method 3: Global Plugin

Install DashDig globally for app-wide access via `$dashdig`.

```typescript
// main.ts
import { createApp } from 'vue';
import { DashdigPlugin } from '@dashdig/widget/vue';
import App from './App.vue';

const app = createApp(App);

// Install plugin globally
app.use(DashdigPlugin, {
  apiKey: 'your-api-key',
  position: 'bottom-right',
  theme: 'light',
  autoShow: true
});

app.mount('#app');
```

**Access in Components:**

```vue
<script setup lang="ts">
import { getCurrentInstance, inject } from 'vue';

// Method 1: getCurrentInstance (Composition API)
const instance = getCurrentInstance();
const dashdig = instance?.proxy?.$dashdig;

// Method 2: Inject (Composition API)
const dashdigInjected = inject('dashdig');

function showWidget() {
  dashdig?.show();
}

function hideWidget() {
  dashdig?.hide();
}

function trackEvent() {
  dashdig?.track('event_name', { key: 'value' });
}

function checkStatus() {
  const isLoaded = dashdig?.isLoaded();
  const instance = dashdig?.getInstance();
  console.log('Loaded:', isLoaded, 'Instance:', instance);
}
</script>

<template>
  <div>
    <button @click="showWidget">Show Widget</button>
    <button @click="hideWidget">Hide Widget</button>
    <button @click="trackEvent">Track Event</button>
    <button @click="checkStatus">Check Status</button>
  </div>
</template>
```

**Global $dashdig API:**

```typescript
interface DashdigGlobal {
  show: () => void;
  hide: () => void;
  track: (event: string, data?: Record<string, any>) => void;
  getInstance: () => DashdigWidget | null;
  isLoaded: () => boolean;
}
```

**Options API Access:**

```vue
<script>
export default {
  methods: {
    showWidget() {
      this.$dashdig.show();
    },
    hideWidget() {
      this.$dashdig.hide();
    },
    trackEvent() {
      this.$dashdig.track('button_click', {
        button: 'example'
      });
    }
  }
}
</script>
```

---

### Complete Vue Example

Here's a complete example showing URL shortening with the composable:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDashdig } from '@dashdig/widget/vue';

interface ShortenResult {
  shortUrl: string;
  shortCode: string;
  originalUrl: string;
}

// Widget composable
const { show, hide, track, isLoaded, isVisible } = useDashdig('your-api-key', {
  position: 'bottom-right',
  theme: 'light',
  autoShow: false
});

// Form state
const url = ref('');
const customSlug = ref('');
const result = ref<ShortenResult | null>(null);
const loading = ref(false);
const error = ref('');

async function handleShorten() {
  if (!url.value) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const options: any = { url: url.value };
    
    if (customSlug.value) {
      options.customSlug = customSlug.value;
    }
    
    const response = await fetch('https://api.dashdig.com/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer your-api-key`
      },
      body: JSON.stringify(options)
    });
    
    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }
    
    result.value = await response.json();
    
    // Track success
    track('url_shortened', {
      hasCustomSlug: !!customSlug.value,
      originalLength: url.value.length
    });
    
    // Clear form
    url.value = '';
    customSlug.value = '';
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
    
    // Track error
    track('shorten_error', {
      error: error.value
    });
  } finally {
    loading.value = false;
  }
}

async function copyToClipboard() {
  if (!result.value) return;
  
  try {
    await navigator.clipboard.writeText(result.value.shortUrl);
    alert('Copied to clipboard!');
    
    track('url_copied', {
      shortUrl: result.value.shortUrl
    });
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}
</script>

<template>
  <div class="url-shortener">
    <header>
      <h1>🔗 DashDig URL Shortener</h1>
      <div class="widget-status">
        <span v-if="isLoaded" class="status-badge success">
          ✅ Widget Ready
        </span>
        <span v-else class="status-badge loading">
          ⏳ Loading...
        </span>
      </div>
    </header>
    
    <form @submit.prevent="handleShorten">
      <div class="form-group">
        <label for="url">URL to Shorten</label>
        <input
          id="url"
          v-model="url"
          type="url"
          placeholder="https://example.com/your/long/url"
          required
          :disabled="loading"
        />
      </div>
      
      <div class="form-group">
        <label for="slug">Custom Slug (optional)</label>
        <input
          id="slug"
          v-model="customSlug"
          type="text"
          placeholder="my-custom-slug"
          pattern="[a-zA-Z0-9_-]+"
          :disabled="loading"
        />
      </div>
      
      <button type="submit" :disabled="loading || !url || !isLoaded">
        {{ loading ? 'Shortening...' : 'Shorten URL' }}
      </button>
    </form>
    
    <div v-if="error" class="error">
      ❌ {{ error }}
    </div>
    
    <div v-if="result" class="result">
      <h3>✅ URL Shortened!</h3>
      <div class="result-content">
        <a :href="result.shortUrl" target="_blank" rel="noopener noreferrer">
          {{ result.shortUrl }}
        </a>
        <button @click="copyToClipboard" class="copy-btn">
          📋 Copy
        </button>
      </div>
    </div>
    
    <div class="widget-controls">
      <h3>Widget Controls</h3>
      <div class="button-group">
        <button @click="show" :disabled="!isLoaded">
          👁️ Show Widget
        </button>
        <button @click="hide" :disabled="!isLoaded">
          🙈 Hide Widget
        </button>
      </div>
      <p class="visibility-status">
        Widget is {{ isVisible ? 'visible' : 'hidden' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.url-shortener {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0 0 1rem 0;
  color: #333;
}

.widget-status {
  margin-bottom: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge.success {
  background: #d4edda;
  color: #155724;
}

.status-badge.loading {
  background: #fff3cd;
  color: #856404;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #667eea;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #5568d3;
}

button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background: #fed7d7;
  color: #9b2c2c;
  border-radius: 8px;
}

.result {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f0f9ff;
  border: 2px solid #667eea;
  border-radius: 8px;
}

.result h3 {
  margin: 0 0 1rem 0;
  color: #667eea;
}

.result-content {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.result-content a {
  flex: 1;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  word-break: break-all;
}

.result-content a:hover {
  text-decoration: underline;
}

.copy-btn {
  width: auto;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.widget-controls {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.widget-controls h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.button-group button {
  flex: 1;
}

.visibility-status {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}
</style>
```

---

### Vue 3 Integration Comparison

| Feature | Composable | Component | Plugin |
|---------|-----------|-----------|--------|
| **Reactive State** | ✅ Yes | ⚠️ Manual | ❌ No |
| **Auto Cleanup** | ✅ Yes | ✅ Yes | ✅ Yes |
| **TypeScript** | ✅ Full | ✅ Full | ✅ Full |
| **Template Refs** | ❌ No | ✅ Yes | ❌ No |
| **Global Access** | ❌ No | ❌ No | ✅ Yes |
| **Lifecycle** | Auto | Auto | Auto |
| **Best For** | Modern Vue 3 | Specific components | Legacy/Options API |

**Recommendation:** Use the `useDashdig` composable for most Vue 3 applications. It provides the best DX with reactive state and automatic lifecycle management.

---

## Angular Integration

DashDig provides four flexible ways to integrate with Angular applications, fully compatible with Angular 17+ and TypeScript strict mode.

### Installation

```bash
npm install @dashdig/widget
# or
yarn add @dashdig/widget
```

### Method 1: Component Approach

Use the `<dashdig-widget>` component in your templates:

```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DashdigComponent],
  template: `
    <dashdig-widget
      [apiKey]="'your-api-key'"
      [position]="'bottom-right'"
      [theme]="'light'"
      [autoShow]="true"
      (load)="onLoad()"
      (error)="onError($event)"
    ></dashdig-widget>

    <button (click)="dashdigWidget.show()">Show</button>
    <button (click)="dashdigWidget.hide()">Hide</button>
  `
})
export class ExampleComponent {
  @ViewChild('dashdigWidget') dashdigWidget!: DashdigComponent;

  onLoad() {
    console.log('Widget loaded');
  }

  onError(error: Error) {
    console.error('Widget error:', error);
  }
}
```

**Component Props:**
- `[apiKey]` (required): Your DashDig API key
- `[position]`: Widget position (`'bottom-right'` | `'bottom-left'`)
- `[theme]`: Widget theme (`'light'` | `'dark'`)
- `[autoShow]`: Auto-show on mount (boolean)
- `[apiUrl]`: Custom API URL (string)

**Component Events:**
- `(load)`: Emitted when widget loads successfully
- `(error)`: Emitted on error (provides `Error` object)

**Public Methods (via ViewChild):**
- `show()`: Show the widget
- `hide()`: Hide the widget
- `track(event, data)`: Track custom events
- `getInstance()`: Get widget instance

---

### Method 2: Service Injection

Inject `DashdigService` for programmatic control:

```typescript
import { Component } from '@angular/core';
import { DashdigService, DASHDIG_CONFIG } from '@dashdig/widget/angular';

@Component({
  selector: 'app-example',
  standalone: true,
  providers: [
    {
      provide: DASHDIG_CONFIG,
      useValue: {
        apiKey: 'your-api-key',
        position: 'bottom-right',
        theme: 'light',
        autoShow: false
      }
    },
    DashdigService
  ],
  template: `
    <button (click)="showWidget()">Show Widget</button>
    <button (click)="hideWidget()">Hide Widget</button>
    <button (click)="trackClick()">Track Event</button>
  `
})
export class ExampleComponent {
  constructor(private dashdig: DashdigService) {}

  showWidget() {
    this.dashdig.show();
  }

  hideWidget() {
    this.dashdig.hide();
  }

  trackClick() {
    this.dashdig.track('button_click', { button: 'cta' });
  }
}
```

**Service Methods:**
- `show()`: Show the widget
- `hide()`: Hide the widget
- `track(event, data?)`: Track custom events
- `getInstance()`: Get widget instance
- `isInitialized()`: Check if initialized
- `initializeWith(config)`: Manual initialization

---

### Method 3: Standalone Components (Angular 17+) ⭐ Recommended

The modern approach without NgModule:

```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  standalone: true,  // ← No NgModule!
  imports: [DashdigComponent],
  template: `
    <h1>My App</h1>
    
    <dashdig-widget
      [apiKey]="'your-api-key'"
      [position]="'bottom-right'"
      [theme]="'dark'"
      (load)="onWidgetLoad()"
    ></dashdig-widget>
  `
})
export class AppComponent {
  onWidgetLoad() {
    console.log('DashDig widget loaded!');
  }
}
```

**Bootstrap:**
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
```

**Why Standalone?**
- ✅ No NgModule boilerplate
- ✅ Better tree-shaking (smaller bundles)
- ✅ Simpler mental model
- ✅ Faster compilation
- ✅ Angular 17+ recommended approach

---

### Method 4: Module Approach

Traditional NgModule approach with `forRoot()`:

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashdigModule } from '@dashdig/widget/angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    DashdigModule.forRoot({
      apiKey: 'your-api-key',
      position: 'bottom-right',
      theme: 'light',
      autoShow: true
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**Usage in Components:**
```typescript
import { Component } from '@angular/core';
import { DashdigService } from '@dashdig/widget/angular';

@Component({
  selector: 'app-my-component',
  template: `
    <button (click)="showWidget()">Show</button>
    <button (click)="trackEvent()">Track</button>
  `
})
export class MyComponent {
  constructor(private dashdig: DashdigService) {}

  showWidget() {
    this.dashdig.show();
  }

  trackEvent() {
    this.dashdig.track('component_action', {
      component: 'my-component',
      action: 'click'
    });
  }
}
```

**forRoot() vs forChild():**
- Use `forRoot()` in **AppModule** - provides singleton service
- Use `forChild()` in **feature modules** - imports component only
- Only call `forRoot()` **once** in your application

---

### Complete Angular Example

Here's a complete example with URL shortening functionality:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DashdigService, DASHDIG_CONFIG } from '@dashdig/widget/angular';

interface ShortenResult {
  shortUrl: string;
  shortCode: string;
  originalUrl: string;
}

@Component({
  selector: 'app-url-shortener',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: DASHDIG_CONFIG,
      useValue: {
        apiKey: 'your-api-key',
        position: 'bottom-right',
        theme: 'light',
        autoShow: false
      }
    },
    DashdigService
  ],
  template: `
    <div class="url-shortener">
      <h1>🔗 DashDig URL Shortener</h1>
      
      <form (ngSubmit)="handleShorten()">
        <input
          [(ngModel)]="url"
          name="url"
          type="url"
          placeholder="https://example.com/your/long/url"
          required
          [disabled]="loading"
        />
        
        <input
          [(ngModel)]="customSlug"
          name="customSlug"
          type="text"
          placeholder="custom-slug (optional)"
          pattern="[a-zA-Z0-9_-]+"
          [disabled]="loading"
        />
        
        <button type="submit" [disabled]="loading || !url">
          {{ loading ? 'Shortening...' : 'Shorten URL' }}
        </button>
      </form>
      
      <div *ngIf="error" class="error">
        ❌ {{ error }}
      </div>
      
      <div *ngIf="result" class="result">
        <h3>✅ URL Shortened!</h3>
        <a [href]="result.shortUrl" target="_blank">
          {{ result.shortUrl }}
        </a>
        <button (click)="copyToClipboard()">📋 Copy</button>
      </div>
      
      <div class="widget-controls">
        <h3>Widget Controls</h3>
        <button (click)="dashdig.show()">👁️ Show</button>
        <button (click)="dashdig.hide()">🙈 Hide</button>
      </div>
    </div>
  `,
  styles: [`
    .url-shortener {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    input {
      padding: 0.75rem;
      font-size: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    button {
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      color: white;
      background: #667eea;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover:not(:disabled) {
      background: #5568d3;
    }

    button:disabled {
      background: #cbd5e0;
      cursor: not-allowed;
    }

    .error {
      padding: 1rem;
      background: #fed7d7;
      color: #9b2c2c;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .result {
      padding: 1.5rem;
      background: #f0f9ff;
      border: 2px solid #667eea;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .result h3 {
      margin: 0 0 1rem 0;
      color: #667eea;
    }

    .result a {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      word-break: break-all;
    }

    .widget-controls {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #e0e0e0;
    }

    .widget-controls button {
      margin-right: 1rem;
    }
  `]
})
export class URLShortenerComponent implements OnInit {
  url = '';
  customSlug = '';
  loading = false;
  error = '';
  result: ShortenResult | null = null;

  constructor(
    private http: HttpClient,
    public dashdig: DashdigService
  ) {}

  ngOnInit() {
    if (!this.dashdig.isInitialized()) {
      this.error = 'DashDig service not initialized';
    }
  }

  async handleShorten() {
    if (!this.url) return;

    this.loading = true;
    this.error = '';

    try {
      const options: any = { url: this.url };
      
      if (this.customSlug) {
        options.customSlug = this.customSlug;
      }

      const result = await this.http.post<ShortenResult>(
        'https://api.dashdig.com/shorten',
        options,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer your-api-key`
          }
        }
      ).toPromise();

      if (result) {
        this.result = result;

        // Track success
        this.dashdig.track('url_shortened', {
          hasCustomSlug: !!this.customSlug,
          originalLength: this.url.length
        });

        // Clear form
        this.url = '';
        this.customSlug = '';
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to shorten URL';
      
      // Track error
      this.dashdig.track('shorten_error', {
        error: this.error
      });
    } finally {
      this.loading = false;
    }
  }

  async copyToClipboard() {
    if (!this.result) return;

    try {
      await navigator.clipboard.writeText(this.result.shortUrl);
      alert('Copied to clipboard!');

      this.dashdig.track('url_copied', {
        shortUrl: this.result.shortUrl
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
}
```

---

### Angular Integration Comparison

| Feature | Component | Service | Standalone | Module |
|---------|-----------|---------|------------|--------|
| **Template Use** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Programmatic** | ⚠️ ViewChild | ✅ Yes | ⚠️ ViewChild | ✅ Yes |
| **DI Support** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **NgModule** | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Setup** | Simple | Medium | Simplest | Complex |
| **Angular 17+** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Templates | Programmatic | Modern | Legacy |

**Recommendation:** Use **Standalone Components** for Angular 17+ applications. It's the simplest and most modern approach.

---

## API Reference

### Vanilla JavaScript API

#### `Dashdig.init(options)`

Initialize the widget with configuration.

**Parameters:**
- `options.apiKey` (string, required): Your DashDig API key
- `options.baseUrl` (string, optional): Custom API base URL (default: `https://api.dashdig.com`)

**Returns:** `void`

**Throws:** `Error` if API key is invalid

**Example:**
```javascript
Dashdig.init({
    apiKey: 'your-api-key-here',
    baseUrl: 'https://api.dashdig.com' // optional
});
```

---

#### `Dashdig.shorten(options)`

Shorten a URL.

**Parameters:**
- `options.url` (string, required): The URL to shorten
- `options.customSlug` (string, optional): Custom short code (alphanumeric, dash, underscore)
- `options.expiresAt` (number, optional): Expiration timestamp (Unix milliseconds)

**Returns:** `Promise<ShortenResponse>`

**ShortenResponse:**
```typescript
{
    shortUrl: string;      // Complete shortened URL
    shortCode: string;     // Just the short code
    originalUrl: string;   // Original long URL
    createdAt: number;     // Creation timestamp
}
```

**Throws:** `Error` if widget not initialized, invalid URL, network failure, or API error

**Examples:**
```javascript
// Basic usage
const result = await Dashdig.shorten({
    url: 'https://example.com/very/long/url'
});
console.log(result.shortUrl); // https://dsh.dg/abc123

// With custom slug
const result = await Dashdig.shorten({
    url: 'https://example.com/product',
    customSlug: 'my-product'
});
console.log(result.shortUrl); // https://dsh.dg/my-product

// With expiration (7 days from now)
const result = await Dashdig.shorten({
    url: 'https://example.com/temporary',
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
});
```

---

#### `Dashdig.track(event, data)`

Track a custom event with optional data.

**Parameters:**
- `event` (string, required): Event name
- `data` (object, optional): Event data

**Returns:** `void`

**Example:**
```javascript
Dashdig.track('button_clicked', {
    buttonId: 'cta-signup',
    page: 'homepage'
});

Dashdig.track('page_view');
```

---

#### `Dashdig.isInitialized()`

Check if the widget is initialized.

**Returns:** `boolean`

**Example:**
```javascript
if (Dashdig.isInitialized()) {
    console.log('Widget is ready');
} else {
    console.log('Initialize first');
}
```

---

### React API

#### `<DashdigProvider>`

Context provider component that wraps your app.

**Props:**
- `apiKey` (string, optional): Auto-initialize with this API key
- `baseUrl` (string, optional): Custom API base URL
- `children` (ReactNode, required): Child components

**Example:**
```jsx
<DashdigProvider apiKey="your-api-key">
    <App />
</DashdigProvider>
```

---

#### `useDashdig()`

Hook to access DashDig functionality in components.

**Returns:** `DashdigContextValue`

**DashdigContextValue:**
```typescript
{
    isInitialized: boolean;
    init: (options) => void;
    shorten: (options) => Promise<ShortenResponse>;
    track: (event, data?) => void;
    isLoading: boolean;
    error: Error | null;
}
```

**Throws:** `Error` if used outside `DashdigProvider`

**Example:**
```jsx
const { shorten, isLoading, error } = useDashdig();

const handleShorten = async () => {
    const result = await shorten({ url: 'https://example.com' });
    console.log(result.shortUrl);
};
```

---

#### `<DashdigShortener>`

Pre-built URL shortener component.

**Props:**
- `placeholder` (string, optional): Input placeholder text
- `buttonText` (string, optional): Submit button text
- `onSuccess` (function, optional): Called when URL is shortened
- `onError` (function, optional): Called on error
- `className` (string, optional): Custom CSS class
- `allowCustomSlug` (boolean, optional): Show custom slug input
- `allowExpiration` (boolean, optional): Show expiration picker

**Example:**
```jsx
<DashdigShortener
    placeholder="Enter URL..."
    buttonText="Shorten"
    allowCustomSlug={true}
    allowExpiration={true}
    onSuccess={(shortUrl) => console.log('Success!', shortUrl)}
    onError={(error) => console.error('Error:', error)}
/>
```

---

## Examples

### Example 1: Simple Link Shortener

```html
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" 
        data-dashdig-key="your-api-key"></script>

<script>
    async function quickShorten() {
        const result = await Dashdig.shorten({
            url: 'https://example.com/long-url'
        });
        console.log(result.shortUrl);
    }
</script>
```

### Example 2: Custom Slug and Expiration

```javascript
const result = await Dashdig.shorten({
    url: 'https://example.com/event',
    customSlug: 'summer-sale',
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
});

console.log(result.shortUrl); // https://dsh.dg/summer-sale
```

### Example 3: Bulk URL Shortening

```javascript
const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
];

const results = await Promise.all(
    urls.map(url => Dashdig.shorten({ url }))
);

results.forEach((result, index) => {
    console.log(`URL ${index + 1}: ${result.shortUrl}`);
});
```

### Example 4: React Form with Validation

```jsx
import React, { useState } from 'react';
import { useDashdig } from '@dashdig/widget/react';

function URLForm() {
    const { shorten, isLoading, error } = useDashdig();
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [validationError, setValidationError] = useState('');
    
    const validateUrl = (urlString) => {
        try {
            new URL(urlString);
            return true;
        } catch {
            return false;
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate URL
        if (!validateUrl(url)) {
            setValidationError('Please enter a valid URL');
            return;
        }
        
        setValidationError('');
        
        try {
            const shortened = await shorten({ url });
            setResult(shortened);
            setUrl('');
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
            />
            
            {validationError && <div className="error">{validationError}</div>}
            {error && <div className="error">{error.message}</div>}
            
            <button type="submit" disabled={isLoading || !url}>
                {isLoading ? 'Shortening...' : 'Shorten'}
            </button>
            
            {result && (
                <div className="result">
                    <strong>Short URL:</strong>
                    <a href={result.shortUrl}>{result.shortUrl}</a>
                </div>
            )}
        </form>
    );
}
```

---

## Error Handling

### Common Errors

#### Invalid API Key

```javascript
try {
    await Dashdig.shorten({ url: 'https://example.com' });
} catch (error) {
    if (error.message.includes('Invalid API key')) {
        console.error('Please check your API key');
    }
}
```

#### Network Failures

```javascript
try {
    const result = await Dashdig.shorten({ url: 'https://example.com' });
} catch (error) {
    if (error.message.includes('Network error')) {
        console.error('Please check your internet connection');
    }
}
```

#### Rate Limiting

```javascript
try {
    const result = await Dashdig.shorten({ url: 'https://example.com' });
} catch (error) {
    if (error.message.includes('Rate limit')) {
        console.error('Too many requests. Please wait and try again.');
    }
}
```

#### Invalid URL Format

```javascript
try {
    const result = await Dashdig.shorten({ url: 'not-a-valid-url' });
} catch (error) {
    if (error.message.includes('Invalid URL')) {
        console.error('Please provide a valid HTTP or HTTPS URL');
    }
}
```

### Comprehensive Error Handling

```javascript
async function safeShorten(url) {
    try {
        const result = await Dashdig.shorten({ url });
        return { success: true, data: result };
    } catch (error) {
        // Log error for debugging
        console.error('Shorten error:', error);
        
        // Handle specific error types
        if (error.message.includes('Invalid API key')) {
            return { success: false, error: 'Configuration error - please contact support' };
        } else if (error.message.includes('Network error')) {
            return { success: false, error: 'Connection failed - please check your internet' };
        } else if (error.message.includes('Rate limit')) {
            return { success: false, error: 'Too many requests - please wait a moment' };
        } else if (error.message.includes('Invalid URL')) {
            return { success: false, error: 'Please enter a valid URL' };
        } else {
            return { success: false, error: 'An unexpected error occurred' };
        }
    }
}

// Usage
const result = await safeShorten('https://example.com');
if (result.success) {
    console.log('Success:', result.data.shortUrl);
} else {
    console.error('Error:', result.error);
}
```

---

## Support

For more information and support:

- **Documentation**: https://docs.dashdig.com
- **API Reference**: https://docs.dashdig.com/api
- **GitHub**: https://github.com/dashdig/dashdig-widget
- **Issues**: https://github.com/dashdig/dashdig-widget/issues
- **Email**: support@dashdig.com

---

**License:** MIT
**Version:** 1.0.0
