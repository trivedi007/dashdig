# 🚀 DashDig URL Shortener - Quick Start Guide

## Installation (2 minutes)

### Step 1: Install Plugin
```bash
# Option A: Copy to WordPress plugins directory
cp -r /Users/narendra/AI-ML/Business-Ideas/Dashdig/dashdig-url-shortener \
      /path/to/wordpress/wp-content/plugins/

# Option B: Create ZIP and upload via WordPress admin
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig
zip -r dashdig-url-shortener.zip dashdig-url-shortener/
# Then upload via Plugins > Add New > Upload Plugin
```

### Step 2: Activate
- Go to **Plugins** in WordPress admin
- Find "DashDig URL Shortener"
- Click **Activate**

### Step 3: Configure API Key
1. Sign up at [dashdig.com](https://dashdig.com) (free)
2. Copy your API key
3. In WordPress, go to **DashDig Links > Settings**
4. Paste API key
5. Click **Save Settings**

✅ Done! You're ready to start shortening URLs.

---

## Usage (30 seconds)

### Method 1: Quick Create
1. Go to **DashDig Links > Add New**
2. Enter title and URL
3. Click **Publish**
4. Copy the shortened URL!

### Method 2: Shortcode
```php
[dashdig url="https://example.com"]
[dashdig url="https://example.com" text="Click here"]
```

### Method 3: Gutenberg Block
1. Click **+** in block editor
2. Search "DashDig"
3. Enter URL
4. Auto-shortened! 🎉

---

## Features at a Glance

### ✨ What You Get
- 🔗 **Unlimited URL shortening** (based on your DashDig plan)
- 📊 **Real-time analytics** with click tracking
- 🎯 **Custom slugs** for branded links
- 🔒 **Password protection** for secure links
- ⏰ **Expiration dates** for time-limited links
- 📈 **Dashboard widget** with quick stats
- 🔄 **Bulk shortening** for existing content
- 🎨 **Beautiful UI** with modern design

### 🛠️ How to Access

| Feature | Location |
|---------|----------|
| Create Link | **DashDig Links > Add New** |
| View All Links | **DashDig Links > All Links** |
| Analytics | **DashDig Links > Analytics** |
| Settings | **DashDig Links > Settings** |
| Bulk Tools | **DashDig Links > Bulk Tools** |
| Dashboard Widget | **WordPress Dashboard** |

---

## Common Tasks

### Create Shortened URL with Custom Slug
1. Go to **DashDig Links > Add New**
2. Enter URL: `https://example.com/very-long-url`
3. Enter Custom Slug: `promo`
4. Publish
5. Result: `dashdig.com/promo` ✨

### Add Password Protection
1. Create or edit a shortened URL
2. Enter password in "Password Protection" field
3. Update
4. Users will need password to access

### Set Expiration Date
1. Create or edit a shortened URL
2. Select date/time in "Expiration Date"
3. Update
4. Link expires automatically

### Bulk Shorten Existing URLs
1. Go to **DashDig Links > Bulk Tools**
2. Select post types (Posts, Pages, etc.)
3. Set limit (e.g., 50)
4. Click **Start Bulk Shortening**
5. View results

### View Analytics
1. Go to **DashDig Links > Analytics**
2. See overall stats
3. Click any link for detailed analytics

---

## Shortcode Examples

### Basic Link
```php
[dashdig url="https://example.com"]
```
Output: `https://dashdig.com/abc123`

### With Custom Text
```php
[dashdig url="https://example.com" text="Click here"]
```
Output: `<a href="https://dashdig.com/abc123">Click here</a>`

### In Posts
```
Check out this article: [dashdig url="https://example.com/article" text="Read more"]
```

---

## Troubleshooting

### "API key is not configured"
**Fix**: Go to **Settings** and enter your API key from dashdig.com

### "API key verification failed"
**Fix**: 
1. Double-check API key is correct
2. Ensure server can reach dashdig API
3. Check firewall settings

### Gutenberg block not appearing
**Fix**:
1. Clear browser cache
2. Re-save permalinks
3. Ensure WordPress 5.0+

### Shortcode not working
**Fix**:
1. Check syntax: `[dashdig url="..."]`
2. Ensure URL has `http://` or `https://`
3. Verify plugin is activated

---

## File Structure

```
dashdig-url-shortener/
├── dashdig.php                 # Main plugin file
├── readme.txt                  # WordPress.org readme
├── README.md                   # Full documentation
├── INSTALLATION.md             # Installation guide
├── QUICK_START.md              # This file
├── PLUGIN_SUMMARY.md           # Complete summary
├── DEPLOYMENT_CHECKLIST.md     # Deployment checklist
│
├── admin/                      # Admin functionality
│   ├── class-settings.php
│   ├── class-analytics.php
│   └── views/
│
├── includes/                   # Core classes
│   ├── class-api-client.php
│   ├── class-shortener.php
│   └── class-block-editor.php
│
├── assets/                     # CSS & JS
│   ├── css/admin.css
│   └── js/
│       ├── admin.js
│       └── gutenberg-block.js
│
└── languages/                  # Translations
    └── dashdig-url-shortener.pot
```

---

## Requirements

- ✅ WordPress 5.0+
- ✅ PHP 7.4+
- ✅ DashDig account (free at [dashdig.com](https://dashdig.com))
- ✅ HTTPS recommended

---

## Support

- 📖 **Full Docs**: See `README.md` in plugin folder
- 🐛 **Bug Reports**: GitHub Issues
- 💬 **Support**: support@dashdig.com
- 🌐 **Website**: [dashdig.com](https://dashdig.com)

---

## What's Next?

1. ✅ Plugin installed and configured
2. 🎯 Create your first shortened URL
3. 📊 Check analytics
4. 🚀 Share on social media
5. 🎉 Track your success!

---

<div align="center">

**Need help? Check README.md for full documentation**

Made with ❤️ by [DashDig](https://dashdig.com)

</div>

