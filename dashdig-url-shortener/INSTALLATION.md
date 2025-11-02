# DashDig URL Shortener - Installation & Deployment Guide

## 📦 Package Contents

Your plugin package includes:

```
dashdig-url-shortener/
├── dashdig.php                    ✅ Main plugin file
├── readme.txt                     ✅ WordPress.org readme
├── README.md                      ✅ Documentation
├── INSTALLATION.md                ✅ This file
│
├── admin/                         ✅ Admin functionality
│   ├── class-settings.php         ✅ Settings page
│   ├── class-analytics.php        ✅ Analytics dashboard
│   └── views/
│       ├── settings.php           ✅ Settings template
│       └── bulk-tools.php         ✅ Bulk tools template
│
├── includes/                      ✅ Core classes
│   ├── class-api-client.php       ✅ API communication
│   ├── class-shortener.php        ✅ URL shortening & CPT
│   └── class-block-editor.php     ✅ Gutenberg integration
│
├── assets/                        ✅ Frontend assets
│   ├── css/
│   │   └── admin.css              ✅ Admin styles
│   └── js/
│       ├── admin.js               ✅ Admin JavaScript
│       └── gutenberg-block.js     ✅ Gutenberg block
│
└── languages/                     ✅ Internationalization
    └── dashdig-url-shortener.pot  ✅ Translation template
```

---

## 🚀 Quick Installation

### Method 1: ZIP Upload (Recommended)

1. **Create Plugin ZIP**:
   ```bash
   cd /Users/narendra/AI-ML/Business-Ideas/Dashdig
   zip -r dashdig-url-shortener.zip dashdig-url-shortener/ -x "*.git*" "*.DS_Store"
   ```

2. **Upload to WordPress**:
   - Go to **Plugins > Add New > Upload Plugin**
   - Choose `dashdig-url-shortener.zip`
   - Click **Install Now**
   - Click **Activate Plugin**

3. **Configure API Key**:
   - Go to **DashDig Links > Settings**
   - Enter your API key from [dashdig.com](https://dashdig.com)
   - Click **Save Settings**

### Method 2: FTP/SFTP Upload

1. **Connect to your server** via FTP/SFTP
2. **Navigate to** `/wp-content/plugins/`
3. **Upload the entire** `dashdig-url-shortener` folder
4. **In WordPress**, go to **Plugins**
5. **Find** "DashDig URL Shortener" and click **Activate**

### Method 3: SSH/Command Line

```bash
# Navigate to plugins directory
cd /path/to/wordpress/wp-content/plugins/

# Copy plugin files
cp -r /Users/narendra/AI-ML/Business-Ideas/Dashdig/dashdig-url-shortener .

# Set proper permissions
chown -R www-data:www-data dashdig-url-shortener
chmod -R 755 dashdig-url-shortener

# Activate via WP-CLI
wp plugin activate dashdig-url-shortener
```

---

## ⚙️ Configuration Steps

### Step 1: Get DashDig API Key

1. Visit [dashdig.com](https://dashdig.com)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

### Step 2: Configure Plugin

1. In WordPress, go to **DashDig Links > Settings**
2. Enter your API key
3. (Optional) Configure:
   - API Endpoint: `https://dashdig-production.up.railway.app/api`
   - Custom Domain: Your branded domain
   - Default Expiration: Link expiration time
4. Click **Save Settings**

### Step 3: Test Connection

The plugin automatically verifies your API key. You should see:
- ✅ "Settings saved and API key verified successfully!"

If you see an error:
- ❌ Check your API key is correct
- ❌ Ensure your server can reach the API endpoint
- ❌ Check firewall settings

---

## 🧪 Testing

### Test 1: Create a Shortened URL

1. Go to **DashDig Links > Add New**
2. Enter title: "Test Link"
3. Enter URL: `https://example.com`
4. Click **Publish**
5. Verify shortened URL appears

### Test 2: Test Shortcode

1. Create a new post
2. Add shortcode: `[dashdig url="https://example.com"]`
3. Preview or publish
4. Verify shortened link appears

### Test 3: Test Gutenberg Block

1. Create a new post in block editor
2. Add "DashDig URL Shortener" block
3. Enter URL: `https://example.com`
4. Verify it automatically shortens
5. Publish and check frontend

### Test 4: Test Analytics

1. Click on a shortened link
2. Go to **DashDig Links > Analytics**
3. Verify click count increased
4. Check dashboard widget shows stats

### Test 5: Test Bulk Tools

1. Create a test post with URLs in content
2. Go to **DashDig Links > Bulk Tools**
3. Select "Posts" and set limit to 1
4. Click **Start Bulk Shortening**
5. Verify shortened URLs were created

---

## 🔧 Troubleshooting

### Issue: "API key is not configured"

**Solution:**
1. Go to **DashDig Links > Settings**
2. Enter your API key
3. Save settings

### Issue: "API key verification failed"

**Possible causes:**
- Incorrect API key
- Server cannot reach API endpoint
- Firewall blocking requests

**Solutions:**
1. Verify API key is correct
2. Test API endpoint manually:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://dashdig-production.up.railway.app/api/stats/overview
   ```
3. Check server firewall settings
4. Contact hosting provider

### Issue: Gutenberg block not appearing

**Solutions:**
1. Clear browser cache
2. Disable other plugins temporarily
3. Check WordPress version (requires 5.0+)
4. Re-save permalinks

### Issue: Shortcode not working

**Solutions:**
1. Check shortcode syntax: `[dashdig url="..."]`
2. Ensure URL includes `http://` or `https://`
3. Check for typos
4. Try in a simple post first

### Issue: Analytics not showing

**Solutions:**
1. Wait 5 minutes (caching)
2. Click "Refresh Analytics"
3. Verify API key has analytics permissions
4. Check browser console for errors

### Issue: Permission errors

**Solutions:**
```bash
# Fix file permissions
cd /path/to/wordpress/wp-content/plugins/
chown -R www-data:www-data dashdig-url-shortener
chmod -R 755 dashdig-url-shortener
```

---

## 🔄 Updates

### Manual Update

1. **Backup current version**
2. **Deactivate plugin** (don't delete)
3. **Upload new version**
4. **Activate plugin**
5. **Test functionality**

### Via WordPress

When published on WordPress.org:
1. Go to **Plugins**
2. Click **Update** next to DashDig URL Shortener
3. WordPress handles the rest

---

## 🗑️ Uninstallation

### Clean Uninstall

1. **Deactivate plugin**
   - Go to **Plugins**
   - Click **Deactivate** under DashDig URL Shortener

2. **Delete plugin**
   - Click **Delete**
   - WordPress removes all files

3. **Clean database** (optional):
   ```sql
   -- Remove custom post type entries
   DELETE FROM wp_posts WHERE post_type = 'dashdig_link';
   DELETE FROM wp_postmeta WHERE post_id NOT IN (SELECT ID FROM wp_posts);
   
   -- Remove plugin options
   DELETE FROM wp_options WHERE option_name LIKE 'dashdig_%';
   ```

---

## 📊 Requirements Checklist

- ✅ WordPress 5.0 or higher
- ✅ PHP 7.4 or higher
- ✅ MySQL 5.6 or higher / MariaDB 10.1 or higher
- ✅ HTTPS (recommended for security)
- ✅ `allow_url_fopen` enabled OR cURL support
- ✅ Outbound HTTPS connections allowed
- ✅ DashDig account with API key

### Recommended Server Settings

```ini
; PHP.ini settings
memory_limit = 128M
max_execution_time = 300
upload_max_filesize = 64M
post_max_size = 64M
```

---

## 🔐 Security Notes

1. **API Key Storage**: Stored securely in WordPress database
2. **Nonce Verification**: All forms use nonces
3. **Data Sanitization**: All input is sanitized
4. **Capability Checks**: Proper user permission checks
5. **HTTPS**: All API communication over HTTPS

---

## 📝 Post-Installation Checklist

- [ ] Plugin installed and activated
- [ ] API key configured
- [ ] API connection verified
- [ ] Test shortened URL created
- [ ] Shortcode tested
- [ ] Gutenberg block tested
- [ ] Analytics dashboard accessible
- [ ] Dashboard widget showing data
- [ ] Bulk tools tested
- [ ] Custom post type working
- [ ] Settings saving correctly

---

## 🆘 Getting Help

If you encounter issues:

1. **Check this guide** first
2. **Review documentation**: [dashdig.com/docs](https://dashdig.com/docs)
3. **Search support forum**: [WordPress.org Support](https://wordpress.org/support/plugin/dashdig-url-shortener/)
4. **Report bugs**: [GitHub Issues](https://github.com/dashdig/wordpress-plugin/issues)
5. **Contact support**: support@dashdig.com

---

## 🎉 Success!

If all tests pass, you're ready to use DashDig URL Shortener!

**Next steps:**
1. Start creating shortened URLs
2. Share them on social media
3. Track analytics
4. Optimize your campaigns

---

## 📞 Support

- 📖 Documentation: [dashdig.com/docs](https://dashdig.com/docs)
- 💬 Support Forum: [WordPress.org](https://wordpress.org/support/plugin/dashdig-url-shortener/)
- 🐛 Bug Reports: [GitHub](https://github.com/dashdig/wordpress-plugin/issues)
- 📧 Email: support@dashdig.com

---

<div align="center">

**Made with ❤️ by [DashDig](https://dashdig.com)**

</div>

