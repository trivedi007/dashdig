# DashDig Widget - Quick Start Guide

Get started with the DashDig URL shortener widget in under 5 minutes.

---

## 🚀 Installation

### Option 1: CDN (Fastest - No Build Required)

Add one line to your HTML:

```html
<!-- Auto-initialize with your API key -->
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" 
        data-dashdig-key="your-api-key-here"
        integrity="sha384-Uz8GoxDTr2D+tVVlEtblXchdNt6bieF1r97/7DqGmFSxAZISWtst+J277aK7Yxb4"
        crossorigin="anonymous"></script>
```

That's it! The widget is now loaded and ready to use.

### Option 2: NPM (For Bundler Projects)

```bash
npm install @dashdig/widget
```

---

## 💻 Usage Examples

### Vanilla JavaScript

#### Example 1: Shorten a URL

```html
<!DOCTYPE html>
<html>
<head>
    <title>URL Shortener</title>
</head>
<body>
    <input type="url" id="url" placeholder="Enter URL..." />
    <button onclick="shortenUrl()">Shorten</button>
    <div id="result"></div>
    
    <!-- Load widget with auto-init -->
    <script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" 
            data-dashdig-key="your-api-key"></script>
    
    <script>
        async function shortenUrl() {
            const url = document.getElementById('url').value;
            
            try {
                const result = await Dashdig.shorten({ url });
                document.getElementById('result').innerHTML = 
                    `Short URL: <a href="${result.shortUrl}">${result.shortUrl}</a>`;
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    </script>
</body>
</html>
```

#### Example 2: With Custom Slug

```javascript
const result = await Dashdig.shorten({
    url: 'https://example.com/long-url',
    customSlug: 'my-custom-link'
});

console.log(result.shortUrl); // https://dsh.dg/my-custom-link
```

#### Example 3: With Expiration

```javascript
// Expires in 7 days
const result = await Dashdig.shorten({
    url: 'https://example.com/temporary',
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
});
```

#### Example 4: Track Events

```javascript
// Track custom events
Dashdig.track('button_clicked', {
    buttonId: 'signup-button',
    page: 'homepage'
});
```

---

### React

#### Example 1: Provider + Hook

```jsx
import React, { useState } from 'react';
import { DashdigProvider, useDashdig } from '@dashdig/widget/react';

function App() {
    return (
        <DashdigProvider apiKey="your-api-key">
            <URLShortener />
        </DashdigProvider>
    );
}

function URLShortener() {
    const { shorten, isLoading, error } = useDashdig();
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const shortened = await shorten({ url });
        setResult(shortened);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL..." 
            />
            <button disabled={isLoading}>
                {isLoading ? 'Shortening...' : 'Shorten'}
            </button>
            
            {result && (
                <p>Short URL: <a href={result.shortUrl}>{result.shortUrl}</a></p>
            )}
        </form>
    );
}
```

#### Example 2: Pre-built Component

```jsx
import { DashdigProvider, DashdigShortener } from '@dashdig/widget/react';

function App() {
    return (
        <DashdigProvider apiKey="your-api-key">
            <h1>URL Shortener</h1>
            
            <DashdigShortener
                placeholder="Enter your URL..."
                buttonText="Shorten It!"
                allowCustomSlug={true}
                onSuccess={(shortUrl) => console.log('Success!', shortUrl)}
            />
        </DashdigProvider>
    );
}
```

---

## 🎯 Common Use Cases

### Use Case 1: Link Shortener for Marketing

```javascript
async function createMarketingLink(campaign, url) {
    const result = await Dashdig.shorten({
        url: url,
        customSlug: campaign,
        expiresAt: Date.now() + (90 * 24 * 60 * 60 * 1000) // 90 days
    });
    
    // Track creation
    Dashdig.track('marketing_link_created', {
        campaign: campaign,
        url: result.shortUrl
    });
    
    return result.shortUrl;
}

// Usage
const link = await createMarketingLink('summer-sale', 'https://shop.com/sale');
console.log(link); // https://dsh.dg/summer-sale
```

### Use Case 2: Social Media Sharing

```javascript
async function shareToSocial(url, platform) {
    // Shorten URL first
    const result = await Dashdig.shorten({ url });
    
    // Track share
    Dashdig.track('social_share', {
        platform: platform,
        shortUrl: result.shortUrl
    });
    
    // Open share dialog
    const shareUrl = {
        twitter: `https://twitter.com/intent/tweet?url=${result.shortUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${result.shortUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${result.shortUrl}`
    }[platform];
    
    window.open(shareUrl, '_blank');
}
```

### Use Case 3: QR Code Generator

```javascript
async function generateQRCode(url) {
    // Shorten URL for cleaner QR code
    const result = await Dashdig.shorten({ url });
    
    // Generate QR code with short URL
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(result.shortUrl)}`;
    
    return qrApiUrl;
}
```

### Use Case 4: Bulk URL Shortening

```javascript
async function shortenBulk(urls) {
    const results = await Promise.all(
        urls.map(url => Dashdig.shorten({ url }))
    );
    
    return results.map((result, index) => ({
        original: urls[index],
        short: result.shortUrl,
        code: result.shortCode
    }));
}

// Usage
const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
];

const shortened = await shortenBulk(urls);
console.log(shortened);
```

---

## 🔧 Configuration Options

### Vanilla JavaScript

```javascript
// Manual initialization with custom config
Dashdig.init({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.dashdig.com'  // optional
});
```

### React

```jsx
<DashdigProvider 
    apiKey="your-api-key"
    baseUrl="https://api.dashdig.com"  // optional
>
    <App />
</DashdigProvider>
```

---

## 📊 API Reference

### `Dashdig.init(options)`

Initialize the widget.

```typescript
Dashdig.init({
    apiKey: string,      // required
    baseUrl?: string     // optional, default: 'https://api.dashdig.com'
});
```

### `Dashdig.shorten(options)`

Shorten a URL.

```typescript
const result = await Dashdig.shorten({
    url: string,           // required
    customSlug?: string,   // optional (alphanumeric, dash, underscore)
    expiresAt?: number     // optional (Unix timestamp in milliseconds)
});

// Returns:
{
    shortUrl: string,      // Complete short URL
    shortCode: string,     // Just the code
    originalUrl: string,   // Original URL
    createdAt: number      // Creation timestamp
}
```

### `Dashdig.track(event, data?)`

Track custom event.

```typescript
Dashdig.track(
    event: string,         // required
    data?: any             // optional
);
```

### `Dashdig.isInitialized()`

Check if widget is initialized.

```typescript
const ready: boolean = Dashdig.isInitialized();
```

---

## ❌ Error Handling

### Basic Error Handling

```javascript
try {
    const result = await Dashdig.shorten({ url: 'https://example.com' });
    console.log('Success:', result.shortUrl);
} catch (error) {
    console.error('Error:', error.message);
    
    // Show user-friendly message
    alert('Failed to shorten URL. Please try again.');
}
```

### Advanced Error Handling

```javascript
async function safeShorten(url) {
    try {
        return await Dashdig.shorten({ url });
    } catch (error) {
        // Handle specific errors
        if (error.message.includes('Invalid API key')) {
            console.error('Configuration error');
        } else if (error.message.includes('Network error')) {
            console.error('Connection failed');
        } else if (error.message.includes('Rate limit')) {
            console.error('Too many requests');
        }
        
        throw error; // Re-throw for caller to handle
    }
}
```

---

## 🎨 Styling (React Component)

The pre-built `DashdigShortener` component comes with default styling, but you can customize it:

```jsx
<DashdigShortener 
    className="my-custom-class"
    // Add your own CSS
/>
```

```css
.my-custom-class input {
    border: 2px solid blue;
    border-radius: 10px;
}

.my-custom-class button {
    background: purple;
}
```

---

## 🐛 Debugging

### Enable Debug Mode

```javascript
// Check if initialized
console.log('Initialized:', Dashdig.isInitialized());

// Get configuration (API key is hidden)
console.log('Config:', Dashdig.getConfig());

// Test API connection
try {
    await Dashdig.shorten({ url: 'https://example.com' });
    console.log('✅ API working');
} catch (error) {
    console.error('❌ API error:', error);
}
```

### Check Network Requests

Open browser DevTools → Network tab to see:
- API requests to `api.dashdig.com`
- Request/response payloads
- Error status codes

---

## 📦 Bundle Sizes

- **Vanilla JS**: 1.91 KB gzipped (4.69 KB uncompressed)
- **React**: 3.35 KB gzipped (8.96 KB uncompressed)

Both bundles are extremely lightweight and load in <100ms on 3G.

---

## 🔗 Links

- **Full Documentation**: `USAGE.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **API Reference**: `README.md#api`
- **Examples**: `/examples/` directory
- **GitHub**: https://github.com/dashdig/dashdig-widget

---

## 🆘 Need Help?

- **Issues**: https://github.com/dashdig/dashdig-widget/issues
- **Email**: support@dashdig.com
- **Docs**: https://docs.dashdig.com

---

**Version**: 1.0.0  
**License**: MIT  
**Author**: DashDig






