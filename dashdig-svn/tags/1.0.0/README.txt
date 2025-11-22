=== Dashdig Analytics ===
Contributors: dashdig
Tags: analytics, url-shortener, tracking, dashdig, links
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Track and analyze your shortened URLs with Dashdig Analytics. Simple setup, powerful insights.

== Description ==

Dashdig Analytics automatically integrates Dashdig's URL tracking and analytics into your WordPress site. Monitor link performance, track clicks, and gain insights into how your shortened URLs are performing—all from your WordPress dashboard.

**Features:**

* Easy one-time API key setup
* Automatic tracking script injection
* Choose header or footer script placement for optimal performance
* Exclude admin users from tracking
* Test API key connection directly from settings
* No coding required
* GDPR compliant
* Lightweight and fast

**Perfect For:**

* Bloggers who share affiliate links
* Marketers tracking campaign performance
* Content creators monitoring engagement
* Anyone using Dashdig URL shortener

**How It Works:**

1. Install and activate the plugin
2. Get your free API key from https://dashdig.com
3. Enter your API key in Settings > Dashdig Analytics
4. Save settings and you're done!

Your Dashdig tracking script will now load on all public pages, sending analytics data to your Dashdig dashboard.

== Installation ==

**Automatic Installation:**

1. Log in to your WordPress admin panel
2. Navigate to Plugins > Add New
3. Search for "Dashdig Analytics"
4. Click "Install Now" and then "Activate"

**Manual Installation:**

1. Download the plugin ZIP file
2. Log in to WordPress admin panel
3. Navigate to Plugins > Add New > Upload Plugin
4. Choose the downloaded ZIP file and click "Install Now"
5. Activate the plugin

**Configuration:**

1. Navigate to Settings > Dashdig Analytics
2. Enter your Dashdig API key (get one at https://dashdig.com/dashboard/widget)
3. Configure tracking preferences
4. Click "Test API Key" to verify connection
5. Save settings

== External Services ==

This plugin connects to external Dashdig API services to provide analytics and tracking functionality. Please review this disclosure to understand how external services are used.

**Service Used:**

This plugin connects to the Dashdig Analytics API hosted at:
* API Endpoint: `https://dashdig-production.up.railway.app/api`
* Service Provider: Dashdig (https://dashdig.com)

**When Connection Occurs:**

1. **API Key Verification** - When you click "Test API Key" in plugin settings, a request is sent to verify your credentials
2. **Front-End Tracking** - When enabled, the tracking script loads on public pages to collect analytics data
3. **Analytics Dashboard** - When viewing analytics data in your WordPress dashboard (if applicable)

**Data Transmitted:**

The following data may be sent to Dashdig servers:

* **During API Verification:**
  * Your API key and Tracking ID
  * WordPress site URL
  * Plugin version information

* **During Front-End Tracking:**
  * Page URLs visited
  * Referrer information
  * User interaction data
  * Anonymous visitor metrics
  * Browser and device information (user agent)

**User Privacy:**

* No personally identifiable information (PII) is collected without user consent
* IP addresses may be processed for analytics purposes
* Users can be excluded from tracking (administrators by default)
* Tracking can be disabled at any time in plugin settings

**Important Links:**

* Dashdig Website: https://dashdig.com
* Terms of Service: https://dashdig.com/terms
* Privacy Policy: https://dashdig.com/privacy
* API Documentation: https://dashdig.com/docs

By using this plugin, you acknowledge that data will be transmitted to Dashdig's servers as described above. Please review Dashdig's Terms of Service and Privacy Policy before using this plugin.

== Frequently Asked Questions ==

= Do I need a Dashdig account? =

Yes, you need a free Dashdig account to get an API key. Sign up at https://dashdig.com

= Where do I find my API key? =

Log in to your Dashdig dashboard at https://dashdig.com/dashboard/widget to get your API key.

= Will this slow down my website? =

No. The tracking script loads asynchronously and doesn't block page rendering. It's optimized for minimal performance impact.

= Does this track logged-in administrators? =

By default, no. You can enable/disable admin tracking in the settings.

= Is this GDPR compliant? =

Yes. Dashdig Analytics is designed with privacy in mind and complies with GDPR requirements.

= Can I place the script in the header instead of footer? =

Yes. You can choose header or footer placement in the settings, though footer is recommended for better performance.

= How do I disable tracking temporarily? =

Simply uncheck "Enable Tracking" in the settings. Your API key will be saved for when you want to re-enable tracking.

== Screenshots ==

1. Settings page - Easy API key configuration
2. Test connection - Verify your API key works
3. Dashdig dashboard - View your analytics
4. Script placement options - Choose header or footer

== Changelog ==

= 1.0.0 =
* Initial release
* API key configuration
* Automatic script injection
* Header/footer placement options
* Admin exclusion option
* AJAX API key testing

== Upgrade Notice ==

= 1.0.0 =
Initial release of Dashdig Analytics plugin.
