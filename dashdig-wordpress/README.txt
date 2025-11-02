=== Dashdig Analytics ===
Contributors: dashdig
Tags: analytics, tracking, url-shortener, dashdig, statistics, insights
Requires at least: 6.0
Tested up to: 6.8
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Real-time analytics with AI-powered insights for WordPress.

== Description ==

Dashdig Analytics brings powerful, privacy-friendly analytics to your WordPress site with AI-powered insights.

**Key Features:**

* 📊 Real-time analytics dashboard
* 🤖 AI-powered insights generation
* 🎯 Automatic page view tracking
* 🔒 GDPR compliant (sensitive data blurred)
* ⚡ Lightweight (< 50ms page load impact)
* 🔐 Secure (nonce verification, proper sanitization)
* 🎨 Beautiful modern UI

**Perfect for:**

* Bloggers wanting audience insights
* E-commerce sites tracking conversions
* Agencies managing client sites
* Anyone needing simple, powerful analytics

**Requirements:**

* Free Dashdig account (sign up at https://dashdig.com)
* Tracking ID and API Key from dashboard

== Installation ==

1. Upload plugin ZIP via Plugins > Add New > Upload
2. Activate the plugin
3. Go to Dashdig > Settings
4. Enter your Tracking ID and API Key from dashdig.com
5. Enable tracking and save

That's it! Your site is now tracking analytics.

== Frequently Asked Questions ==

= Do I need a Dashdig account? =

Yes, sign up free at https://dashdig.com to get your Tracking ID and API Key.

= Is this GDPR compliant? =

Yes! Dashdig automatically blurs sensitive form fields and respects user privacy.

= Will this slow down my site? =

No. The tracking script loads asynchronously with <50ms impact on page load.

= Does it work with my theme? =

Yes! Works with all WordPress themes.

= Where is my data stored? =

Securely on Dashdig's servers with encryption at rest and in transit.

= Why do I see CORS errors in console? =

If testing locally, CORS errors are expected. In production with your actual domain configured in Dashdig settings, these will not occur.

= Can I use this on multiple sites? =

Yes! Each site needs its own Tracking ID from your Dashdig dashboard.

= Is there a free plan? =

Yes! Sign up at https://dashdig.com for free access.

== Screenshots ==

1. Real-time analytics dashboard with beautiful UI
2. Simple settings page with API configuration
3. AI-powered insights generation
4. Clean, modern interface

== Changelog ==

= 1.0.0 - 2025-10-27 =
* Initial release
* Real-time analytics dashboard
* AI-powered insights generation
* Settings management interface
* Automatic page view tracking
* GDPR compliance features
* Beautiful modern UI
* Secure implementation (nonces, sanitization)
* Asynchronous tracking script
* WordPress 6.8.3 compatibility

== Upgrade Notice ==

= 1.0.0 =
Initial release of Dashdig Analytics. Welcome!

== Additional Info ==

**Known Limitations:**

* Requires active Dashdig account
* Local testing may show CORS errors (normal, works in production)
* Network errors with invalid API credentials (use real keys from dashdig.com)

**Support:**

Visit https://dashdig.com/support or use WordPress.org support forum

**Privacy Policy:**

This plugin connects to Dashdig's external service (https://dashdig.com) to:
* Send analytics data from your website
* Retrieve AI-generated insights
* Provide real-time statistics

Data transmitted includes: page URLs, referrers, user agents, and browser information.
See Dashdig's privacy policy at: https://dashdig.com/privacy

**Validation:**

Validate this readme at: https://wordpress.org/plugins/developers/readme-validator/
