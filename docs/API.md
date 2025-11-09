# Dashdig API Documentation ⚡

## Humanize and Shortenize URLs Programmatically

The Dashdig API allows you to humanize and shortenize URLs programmatically from your applications, scripts, and workflows.

---

## 🔗 Base URL

```
https://api.dashdig.com
```

**Production**: `https://api.dashdig.com`  
**Staging**: `https://api-staging.dashdig.com`

---

## 🔑 Authentication

All API requests require authentication using Bearer tokens.

### Get Your API Key

1. Log in to [dashdig.com/dashboard](https://dashdig.com/dashboard)
2. Navigate to **Settings > API Keys**
3. Click "Generate New API Key"
4. Copy and store securely

### Authentication Header

```http
Authorization: Bearer YOUR_API_KEY
```

### Example Request

```bash
curl -X POST https://api.dashdig.com/api/shorten \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/long-url"}'
```

---

## 📡 API Endpoints

### POST /api/shorten

Humanize and shortenize a URL using AI-powered contextual analysis.

#### Request

**Headers**:
```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Body**:
```json
{
  "originalUrl": "https://example.com/very-long-url-here",
  "customSlug": "My.Custom.Slug",
  "keywords": ["example", "product"],
  "expiryClicks": 100,
  "password": "optional-password"
}
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `originalUrl` | string | Yes | The URL to humanize and shortenize |
| `customSlug` | string | No | Custom slug (if not provided, AI generates one) |
| `keywords` | array | No | Keywords to help AI understand context |
| `expiryClicks` | number | No | Expire after N clicks |
| `expiryDate` | string | No | Expire on specific date (ISO 8601) |
| `password` | string | No | Password protect the humanized URL |
| `domain` | string | No | Custom domain (Pro feature) |

#### Response

**Success (200)**:
```json
{
  "success": true,
  "message": "URL successfully humanized and shortenized",
  "data": {
    "slug": "Example.Best.Product.2025",
    "originalUrl": "https://example.com/very-long-url-here",
    "shortUrl": "https://dashdig.com/Example.Best.Product.2025",
    "qrCodeUrl": "https://api.dashdig.com/qr/Example.Best.Product.2025",
    "qrCode": "data:image/png;base64,...",
    "metadata": {
      "title": "Best Product 2025",
      "description": "The ultimate product guide",
      "image": "https://example.com/image.jpg"
    },
    "expiresAfter": "100 clicks",
    "createdAt": "2025-01-09T18:00:00.000Z"
  }
}
```

**Error (400)**:
```json
{
  "success": false,
  "error": "Failed to humanize URL. Please try again.",
  "message": "Invalid URL format"
}
```

#### cURL Example

```bash
curl -X POST https://api.dashdig.com/api/shorten \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://www.nytimes.com/2025/11/09/technology/ai-breakthrough.html",
    "keywords": ["AI", "technology", "news"]
  }'
```

#### JavaScript Example

```javascript
const humanizeUrl = async (url) => {
  const response = await fetch('https://api.dashdig.com/api/shorten', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      originalUrl: url
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Humanized URL:', data.data.shortUrl);
    console.log('QR Code:', data.data.qrCodeUrl);
  }
  
  return data;
};

// Usage
humanizeUrl('https://example.com/long-url')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

#### Python Example

```python
import requests
import json

def humanize_url(url, api_key):
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'originalUrl': url
    }
    
    response = requests.post(
        'https://api.dashdig.com/api/shorten',
        headers=headers,
        json=data
    )
    
    return response.json()

# Usage
result = humanize_url(
    'https://example.com/long-url',
    'YOUR_API_KEY'
)

print(f"Humanized URL: {result['data']['shortUrl']}")
```

---

### GET /api/urls

Get all your humanized and shortenized URLs.

#### Request

**Headers**:
```http
Authorization: Bearer YOUR_API_KEY
```

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20, max: 100) |
| `sort` | string | Sort by: `createdAt`, `clicks`, `slug` (default: `createdAt`) |
| `order` | string | Order: `asc` or `desc` (default: `desc`) |

#### Response

```json
{
  "success": true,
  "data": {
    "urls": [
      {
        "slug": "Example.Product.2025",
        "originalUrl": "https://example.com/product",
        "shortUrl": "https://dashdig.com/Example.Product.2025",
        "clicks": 142,
        "createdAt": "2025-01-09T18:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

---

### GET /api/urls/:slug

Get details for a specific humanized URL.

#### Request

```bash
curl -X GET https://api.dashdig.com/api/urls/Example.Product.2025 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response

```json
{
  "success": true,
  "data": {
    "slug": "Example.Product.2025",
    "originalUrl": "https://example.com/product",
    "shortUrl": "https://dashdig.com/Example.Product.2025",
    "qrCodeUrl": "https://api.dashdig.com/qr/Example.Product.2025",
    "clicks": {
      "total": 142,
      "unique": 89,
      "lastClickedAt": "2025-01-09T20:30:00.000Z"
    },
    "metadata": {
      "title": "Example Product",
      "description": "Product description"
    },
    "createdAt": "2025-01-09T18:00:00.000Z",
    "expiresAt": null
  }
}
```

---

### DELETE /api/urls/:id

Delete a humanized URL.

#### Request

```bash
curl -X DELETE https://api.dashdig.com/api/urls/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response

```json
{
  "success": true,
  "message": "Humanized URL deleted successfully"
}
```

---

### GET /api/analytics/:slug

Get analytics for a humanized URL.

#### Request

```bash
curl -X GET https://api.dashdig.com/api/analytics/Example.Product.2025 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response

```json
{
  "success": true,
  "data": {
    "slug": "Example.Product.2025",
    "clicks": {
      "total": 142,
      "unique": 89,
      "today": 12,
      "thisWeek": 45,
      "thisMonth": 142
    },
    "geographic": {
      "countries": ["US", "CA", "GB", "DE"],
      "topCountry": "US",
      "cities": ["New York", "Los Angeles", "Toronto"]
    },
    "devices": {
      "mobile": 60,
      "desktop": 35,
      "tablet": 5
    },
    "browsers": {
      "chrome": 65,
      "firefox": 20,
      "safari": 15
    },
    "referrers": {
      "direct": 40,
      "twitter.com": 30,
      "facebook.com": 20,
      "other": 10
    },
    "clicksByDay": [
      { "date": "2025-01-09", "clicks": 12 },
      { "date": "2025-01-08", "clicks": 15 }
    ]
  }
}
```

---

### GET /api/qr/:slug

Generate QR code for a humanized URL.

#### Request

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `size` | number | QR code size in pixels (default: 300, max: 1000) |
| `format` | string | Format: `png` or `svg` (default: `png`) |

```bash
curl -X GET "https://api.dashdig.com/api/qr/Example.Product.2025?size=500&format=png" \
  --output qrcode.png
```

#### Response

Returns image file (PNG or SVG).

---

## 📊 Rate Limits

| Plan | Rate Limit | Burst |
|------|------------|-------|
| Free | 100 req/hour | 20 req/min |
| Pro | 1000 req/hour | 100 req/min |
| Enterprise | Unlimited | Unlimited |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1673280000
```

---

## 🔐 Security Best Practices

### 1. Keep API Keys Secure
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Use different keys for dev/staging/prod

### 2. Use HTTPS
- Always use `https://` not `http://`
- Verify SSL certificates

### 3. Handle Errors Gracefully
```javascript
try {
  const response = await fetch('https://api.dashdig.com/api/shorten', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ originalUrl: url })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Failed to humanize URL:', error);
  // Handle error appropriately
}
```

---

## 🆘 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | API key doesn't have permission |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

**Error Response Format**:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## 📚 SDKs & Libraries

### Official SDKs

- **JavaScript/TypeScript**: `npm install @dashdig/sdk`
- **Python**: `pip install dashdig`
- **PHP**: `composer require dashdig/php-sdk`
- **Ruby**: `gem install dashdig`
- **Go**: `go get github.com/dashdig/go-sdk`

### Community SDKs

- **Java**: [dashdig-java](https://github.com/dashdig/dashdig-java)
- **C#**: [dashdig-dotnet](https://github.com/dashdig/dashdig-dotnet)
- **Rust**: [dashdig-rust](https://github.com/dashdig/dashdig-rust)

---

## 💡 Use Cases

### 1. Marketing Automation

```javascript
// Humanize URLs in email campaigns
const campaignLinks = [
  'https://shop.com/product-1',
  'https://shop.com/product-2'
];

for (const url of campaignLinks) {
  const result = await dashdig.shorten(url, {
    keywords: ['campaign', 'spring-2025']
  });
  console.log(`Humanized: ${result.shortUrl}`);
}
```

### 2. Social Media Management

```python
# Humanize and post to Twitter
import dashdig
import tweepy

url = "https://blog.com/article"
humanized = dashdig.shorten(url)

tweet = f"Check out our latest article: {humanized['shortUrl']}"
twitter.update_status(tweet)
```

### 3. Analytics Integration

```javascript
// Track humanized URLs in Google Analytics
const result = await dashdig.shorten(originalUrl);

gtag('event', 'url_humanized', {
  'short_url': result.shortUrl,
  'original_url': originalUrl
});
```

---

## 🔗 Webhooks (Coming Soon)

Get notified when:
- URL is clicked
- URL expires
- Rate limit approaching

```json
{
  "event": "url.clicked",
  "data": {
    "slug": "Example.Product.2025",
    "clicks": 100,
    "timestamp": "2025-01-09T18:00:00.000Z"
  }
}
```

---

## 📞 Support

Need help with the API?

- **API Status**: [status.dashdig.com](https://status.dashdig.com)
- **Documentation**: [dashdig.com/docs/api](https://dashdig.com/docs/api)
- **Support**: [dashdig.com/support](https://dashdig.com/support)
- **Email**: api@dashdig.com

---

**⚡ Start humanizing and shortenizing URLs programmatically today!**

[Get API Key](https://dashdig.com/dashboard/api) | [View Examples](./examples/) | [Status Page](https://status.dashdig.com)

