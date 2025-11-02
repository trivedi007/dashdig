=== DashDig URL Shortener ===
Contributors: dashdig
Tags: url shortener, short links, analytics, link management, dashdig
Requires at least: 5.0
Tested up to: 6.8
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Professional URL shortening with analytics, Gutenberg blocks, and bulk tools. Create and manage shortened links directly in WordPress.

== Description ==

**DashDig URL Shortener** brings professional URL shortening capabilities directly into your WordPress dashboard. Create, manage, and track shortened links with powerful analytics and seamless WordPress integration.

= 🚀 Key Features =

* **Gutenberg Block Integration** - Add shortened links with a native WordPress block
* **Classic Editor Support** - TinyMCE button for classic editor users
* **Shortcode Support** - Use `[dashdig url="https://example.com"]` anywhere
* **Custom Post Type** - Manage all shortened URLs in one place
* **Bulk URL Shortening** - Scan and shorten URLs from existing posts
* **Analytics Dashboard** - Track clicks, performance, and top links
* **Dashboard Widget** - Quick stats right on your WordPress dashboard
* **Link Management** - Edit, delete, and organize shortened URLs
* **Custom Slugs** - Create memorable short links with custom slugs
* **Password Protection** - Secure links with password protection
* **Expiration Dates** - Set automatic expiration for time-sensitive links
* **Custom Domains** - Use your own branded domain (Pro feature)

= 💡 Use Cases =

* **Bloggers** - Share cleaner links on social media
* **Marketers** - Track campaign performance with detailed analytics
* **E-commerce** - Create trackable product links
* **Publishers** - Manage affiliate links efficiently
* **Agencies** - Provide URL shortening services to clients
* **Podcasters** - Create memorable URLs for show notes

= 🎯 Why Choose DashDig? =

Unlike other URL shorteners that require you to leave WordPress, DashDig is fully integrated into your workflow:

* ✅ No need to switch between tools
* ✅ All your links stored in WordPress
* ✅ Native Gutenberg and Classic Editor support
* ✅ Professional analytics and reporting
* ✅ Built with WordPress coding standards
* ✅ Secure with nonces and sanitization
* ✅ Translation ready (i18n)
* ✅ Fast and lightweight

= 🔧 Requirements =

* WordPress 5.0 or higher
* PHP 7.4 or higher
* Free DashDig account (sign up at [dashdig.com](https://dashdig.com))

= 📚 Documentation =

Detailed documentation is available at [dashdig.com/docs](https://dashdig.com/docs)

= 🌐 Translations =

DashDig URL Shortener is translation ready! Help us translate it into your language at [translate.wordpress.org](https://translate.wordpress.org)

= 💬 Support =

* Documentation: [dashdig.com/docs](https://dashdig.com/docs)
* Support Forum: [WordPress.org Support](https://wordpress.org/support/plugin/dashdig-url-shortener/)
* GitHub: [github.com/dashdig/wordpress-plugin](https://github.com/dashdig/wordpress-plugin)

== Installation ==

= Automatic Installation =

1. Log in to your WordPress dashboard
2. Navigate to **Plugins > Add New**
3. Search for "DashDig URL Shortener"
4. Click **Install Now** and then **Activate**

= Manual Installation =

1. Download the plugin ZIP file
2. Log in to your WordPress dashboard
3. Navigate to **Plugins > Add New > Upload Plugin**
4. Choose the downloaded ZIP file and click **Install Now**
5. Activate the plugin

= Configuration =

1. After activation, go to **DashDig Links > Settings**
2. Sign up for a free account at [dashdig.com](https://dashdig.com)
3. Copy your API key from the DashDig dashboard
4. Paste the API key in the plugin settings
5. Click **Save Settings**

You're all set! Start creating shortened URLs.

== Frequently Asked Questions ==

= Do I need a DashDig account? =

Yes, you need a free DashDig account to use this plugin. Sign up at [dashdig.com](https://dashdig.com) to get your API key.

= Is there a free plan? =

Yes! DashDig offers a generous free plan that's perfect for most users. Premium plans are available for advanced features and higher limits.

= How do I create a shortened URL? =

There are multiple ways:

1. **Custom Post Type**: Go to **DashDig Links > Add New**
2. **Gutenberg Block**: Add the "DashDig URL Shortener" block in the block editor
3. **Shortcode**: Use `[dashdig url="https://example.com"]` in any post or page
4. **Classic Editor**: Click the "DashDig" button in the editor toolbar

= How do I use the shortcode? =

Basic usage:
`[dashdig url="https://example.com"]`

With custom text:
`[dashdig url="https://example.com" text="Click here"]`

= Can I customize the shortened URLs? =

Yes! When creating a shortened URL, you can specify a custom slug to make it more memorable (e.g., `dashdig.com/my-custom-link`).

= Can I track analytics? =

Absolutely! The plugin includes a full analytics dashboard showing:

* Total clicks per link
* Overall statistics
* Top performing links
* Click trends over time

Access analytics from **DashDig Links > Analytics** or the WordPress dashboard widget.

= Can I set expiration dates for links? =

Yes, you can set an expiration date when creating or editing a shortened URL. The link will automatically stop working after that date.

= Can I password-protect links? =

Yes, you can add password protection to any shortened URL for added security.

= Can I use my own custom domain? =

Yes! Custom domains are supported (requires configuration in your DashDig account).

= How does bulk URL shortening work? =

1. Go to **DashDig Links > Bulk Tools**
2. Select which post types to scan
3. Set a limit for how many posts to process
4. Click **Start Bulk Shortening**

The tool will scan your posts for URLs and create shortened versions automatically.

= Is this plugin GDPR compliant? =

The plugin itself doesn't collect any personal data from your site visitors. However, when visitors click on shortened links, DashDig may collect analytics data. Please review DashDig's privacy policy and ensure compliance with your local regulations.

= Does this work with multisite? =

Yes, the plugin is multisite compatible. Each site needs its own API key configuration.

= What if I encounter issues? =

1. Check the [documentation](https://dashdig.com/docs)
2. Ask in the [support forum](https://wordpress.org/support/plugin/dashdig-url-shortener/)
3. Report bugs on [GitHub](https://github.com/dashdig/wordpress-plugin/issues)

== Screenshots ==

1. **Settings Page** - Configure your API key and default settings
2. **Create Shortened URL** - Easy-to-use interface for creating short links
3. **Link Management** - View and manage all your shortened URLs
4. **Analytics Dashboard** - Track performance with detailed analytics
5. **Dashboard Widget** - Quick stats on your WordPress dashboard
6. **Gutenberg Block** - Native block editor integration
7. **Bulk Tools** - Shorten multiple URLs at once

== Changelog ==

= 1.0.0 - 2025-11-01 =
* Initial release
* Gutenberg block for URL shortening
* Classic editor button integration
* Custom post type for link management
* Shortcode support: `[dashdig url="..."]`
* Analytics dashboard with click tracking
* Dashboard widget with quick stats
* Bulk URL shortening tool
* Settings page for API configuration
* Custom slugs for branded links
* Password protection for links
* Expiration dates for time-sensitive links
* Link management table with edit/delete
* WordPress coding standards compliance
* Security: nonces, sanitization, validation
* Translation ready (i18n support)
* Responsive admin interface

== Upgrade Notice ==

= 1.0.0 =
Initial release of DashDig URL Shortener. Install to start creating and managing shortened URLs in WordPress!

== Credits ==

* Developed by [DashDig](https://dashdig.com)
* Icon and banner design by DashDig Team

== Privacy Policy ==

DashDig URL Shortener connects to the DashDig API to create and manage shortened URLs. When you use this plugin:

* Your API key is stored in your WordPress database
* URLs you shorten are sent to DashDig servers
* Click data is collected by DashDig for analytics purposes
* No personal data from your WordPress users is collected by this plugin

For more information, please review:
* [DashDig Privacy Policy](https://dashdig.com/privacy)
* [DashDig Terms of Service](https://dashdig.com/terms)

== Support This Plugin ==

If you find this plugin helpful, please:

* ⭐ [Rate it 5 stars on WordPress.org](https://wordpress.org/support/plugin/dashdig-url-shortener/reviews/)
* 💬 [Share feedback](https://wordpress.org/support/plugin/dashdig-url-shortener/)
* 🐛 [Report bugs on GitHub](https://github.com/dashdig/wordpress-plugin/issues)
* 🌐 [Help translate](https://translate.wordpress.org/projects/wp-plugins/dashdig-url-shortener/)

Thank you for using DashDig URL Shortener!

