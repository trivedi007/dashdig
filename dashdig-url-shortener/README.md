# DashDig URL Shortener - WordPress Plugin

> Professional URL shortening plugin with analytics, Gutenberg blocks, and bulk tools.

[![WordPress Plugin Version](https://img.shields.io/badge/WordPress-5.0%2B-blue.svg)](https://wordpress.org/)
[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://php.net/)
[![License](https://img.shields.io/badge/License-GPL%20v2%2B-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

---

## 📋 Overview

**DashDig URL Shortener** is a complete WordPress plugin that brings professional URL shortening capabilities directly into your WordPress dashboard. Create, manage, and track shortened links with powerful analytics and seamless WordPress integration.

---

## ✨ Features

### Core Features
- ✅ **Gutenberg Block Integration** - Native block for the block editor
- ✅ **Classic Editor Support** - TinyMCE button for classic editor
- ✅ **Shortcode Support** - `[dashdig url="..."]` shortcode
- ✅ **Custom Post Type** - Dedicated post type for link management
- ✅ **Bulk URL Shortening** - Scan and shorten URLs from existing posts
- ✅ **Analytics Dashboard** - Track clicks, performance, and trends
- ✅ **Dashboard Widget** - Quick stats on WordPress dashboard
- ✅ **Link Management** - Full CRUD operations for shortened URLs

### Admin Features
- 🔧 **Settings Page** - API key, custom domain, default expiration
- 📊 **Analytics Page** - Detailed analytics and top performers
- 🔄 **Bulk Tools** - Mass URL shortening from existing content
- 📈 **Dashboard Widget** - Total links, clicks, and top performers
- ✏️ **Link Editor** - Edit, delete, and manage shortened URLs

### Advanced Options
- 🎯 **Custom Slugs** - Create memorable branded short links
- 🔒 **Password Protection** - Secure links with passwords
- ⏰ **Expiration Dates** - Set automatic link expiration
- 🌐 **Custom Domains** - Use your own branded domain (when configured)

### Technical Excellence
- 🔐 **Secure** - Nonces, sanitization, validation throughout
- 🌍 **i18n Ready** - Full internationalization support
- 📱 **Responsive** - Works perfectly on all devices
- ⚡ **Performance** - Optimized queries and caching
- 📝 **WordPress Standards** - Follows WordPress coding standards
- ♿ **Accessible** - WCAG compliant admin interface

---

## 📁 File Structure

```
dashdig-url-shortener/
├── dashdig.php                      # Main plugin file
├── readme.txt                       # WordPress.org readme
├── README.md                        # This file
│
├── admin/                           # Admin functionality
│   ├── class-settings.php           # Settings page handler
│   ├── class-analytics.php          # Analytics dashboard
│   └── views/                       # View templates
│       ├── settings.php             # Settings page template
│       └── bulk-tools.php           # Bulk tools page template
│
├── includes/                        # Core functionality
│   ├── class-api-client.php         # DashDig API client
│   ├── class-shortener.php          # URL shortening logic & CPT
│   └── class-block-editor.php       # Gutenberg block handler
│
├── assets/                          # Frontend assets
│   ├── css/
│   │   └── admin.css                # Admin styles
│   └── js/
│       ├── admin.js                 # Admin JavaScript
│       └── gutenberg-block.js       # Gutenberg block JS
│
└── languages/                       # Translations
    └── dashdig-url-shortener.pot    # Translation template
```

---

## 🚀 Installation

### Requirements
- WordPress 5.0 or higher
- PHP 7.4 or higher
- DashDig account (free at [dashdig.com](https://dashdig.com))

### From WordPress.org (Recommended)
1. Go to **Plugins > Add New** in WordPress
2. Search for "DashDig URL Shortener"
3. Click **Install Now** and then **Activate**

### Manual Installation
1. Download the plugin ZIP file
2. Go to **Plugins > Add New > Upload Plugin**
3. Choose the ZIP file and click **Install Now**
4. Activate the plugin

### From Source
```bash
# Clone into your WordPress plugins directory
cd wp-content/plugins/
git clone https://github.com/dashdig/wordpress-plugin.git dashdig-url-shortener

# Or download and extract
wget https://github.com/dashdig/wordpress-plugin/archive/main.zip
unzip main.zip
mv wordpress-plugin-main dashdig-url-shortener
```

---

## ⚙️ Configuration

### 1. Get Your API Key
1. Sign up for free at [dashdig.com](https://dashdig.com)
2. Navigate to your dashboard
3. Copy your API key

### 2. Configure the Plugin
1. Go to **DashDig Links > Settings** in WordPress
2. Paste your API key
3. (Optional) Configure custom domain
4. (Optional) Set default expiration time
5. Click **Save Settings**

### 3. Verify Connection
The plugin will automatically verify your API key when you save settings.

---

## 📚 Usage

### Method 1: Custom Post Type
1. Go to **DashDig Links > Add New**
2. Enter the long URL
3. (Optional) Add custom slug, expiration, or password
4. Click **Publish**

### Method 2: Gutenberg Block
1. In the block editor, click the **+** button
2. Search for "DashDig URL Shortener"
3. Enter your URL
4. The plugin will automatically shorten it
5. Customize link text if desired

### Method 3: Shortcode
```php
// Basic usage
[dashdig url="https://example.com"]

// With custom text
[dashdig url="https://example.com" text="Click here"]
```

### Method 4: Classic Editor
1. Click the **DashDig** button in the editor toolbar
2. Enter your URL
3. Click **Insert**

### Method 5: Bulk Tools
1. Go to **DashDig Links > Bulk Tools**
2. Select post types to scan
3. Set processing limit
4. Click **Start Bulk Shortening**

---

## 📊 Analytics

### Dashboard Widget
Quick stats appear on your WordPress dashboard:
- Total Links
- Total Clicks
- Average Clicks per Link
- Top 5 Performers

### Full Analytics Page
Access detailed analytics at **DashDig Links > Analytics**:
- Overall statistics
- Top performing links
- Individual link analytics
- Click trends over time

### Individual Link Analytics
View detailed stats for any shortened URL:
1. Go to **DashDig Links**
2. Click on any link
3. View analytics in the sidebar widget
4. Click "View Detailed Analytics" for more

---

## 🔧 API Integration

The plugin communicates with DashDig API for:
- URL shortening
- Analytics retrieval
- Link management
- Statistics

All API communication is:
- ✅ Secure (HTTPS)
- ✅ Authenticated (Bearer token)
- ✅ Cached (for performance)
- ✅ Error-handled

---

## 🌐 Internationalization

The plugin is fully translation-ready:

```bash
# Generate translations
wp i18n make-pot . languages/dashdig-url-shortener.pot

# For translators
msgfmt languages/dashdig-url-shortener-es_ES.po -o languages/dashdig-url-shortener-es_ES.mo
```

Available translation strings: 200+

---

## 🛠️ Development

### Coding Standards
- Follows [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- All functions documented with PHPDoc
- Proper naming conventions
- Security best practices

### Security Features
- ✅ Nonce verification on all forms
- ✅ Data sanitization on input
- ✅ Data escaping on output
- ✅ Capability checks
- ✅ CSRF protection

### Hooks & Filters

**Actions:**
```php
// After URL is shortened
do_action('dashdig_url_shortened', $post_id, $short_url, $long_url);

// Before API request
do_action('dashdig_before_api_request', $endpoint, $data);

// After settings saved
do_action('dashdig_settings_saved', $settings);
```

**Filters:**
```php
// Modify API endpoint
apply_filters('dashdig_api_endpoint', $endpoint);

// Modify default expiration
apply_filters('dashdig_default_expiration', $days);

// Modify shortcode output
apply_filters('dashdig_shortcode_output', $output, $atts);
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup
```bash
# Clone the repository
git clone https://github.com/dashdig/wordpress-plugin.git

# Create a symlink in your WordPress installation
ln -s /path/to/repository /path/to/wordpress/wp-content/plugins/dashdig-url-shortener

# Enable WP_DEBUG in wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

---

## 📄 License

This plugin is licensed under the GPL v2 or later.

```
Copyright (C) 2025 DashDig

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
```

---

## 🐛 Bug Reports

Found a bug? Please report it:

1. **Check existing issues**: [GitHub Issues](https://github.com/dashdig/wordpress-plugin/issues)
2. **Create new issue** with:
   - WordPress version
   - PHP version
   - Plugin version
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)

---

## 💬 Support

- 📖 **Documentation**: [dashdig.com/docs](https://dashdig.com/docs)
- 💬 **Support Forum**: [WordPress.org Support](https://wordpress.org/support/plugin/dashdig-url-shortener/)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/dashdig/wordpress-plugin/issues)
- 📧 **Email**: support@dashdig.com

---

## 🗺️ Roadmap

### Version 1.1
- [ ] QR code generation for shortened URLs
- [ ] UTM parameter builder
- [ ] Export analytics to CSV
- [ ] Link categories/tags

### Version 1.2
- [ ] A/B testing for links
- [ ] Geolocation targeting
- [ ] Device targeting
- [ ] Link cloaking options

### Version 2.0
- [ ] REST API endpoints
- [ ] Webhook support
- [ ] Custom redirects
- [ ] Advanced analytics (devices, browsers, locations)

---

## 🙏 Acknowledgments

- Built with ❤️ by the [DashDig Team](https://dashdig.com)
- Icons from [Dashicons](https://developer.wordpress.org/resource/dashicons/)
- Inspired by the WordPress community

---

## 📞 Contact

- **Website**: [dashdig.com](https://dashdig.com)
- **GitHub**: [github.com/dashdig/wordpress-plugin](https://github.com/dashdig/wordpress-plugin)
- **Twitter**: [@dashdig](https://twitter.com/dashdig)
- **Email**: support@dashdig.com

---

<div align="center">

**⭐ Star us on GitHub** • **🔄 Share with friends** • **💬 Join the community**

Made with ❤️ by [DashDig](https://dashdig.com)

</div>

