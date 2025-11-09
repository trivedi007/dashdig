# Changelog

All notable changes to **Dashdig - Humanize and Shortenize URLs**

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2025-01-09

### 🎨 Changed - Complete Rebranding

- **Updated branding to "Dashdig - Humanize and Shortenize URLs"**
- Enhanced tagline visibility across all platforms
- Unified messaging: "Transform cryptic URLs into human-readable links"
- Updated browser extension name and description
- Updated WordPress plugin description and interface
- Improved landing page messaging with clear value proposition
- Enhanced dashboard components with new branding
- Updated all documentation with new terminology

### ✨ Added - New Features

- **Backend API**: Centralized branding configuration (`src/config/branding.js`)
- **Backend API**: Enhanced API responses with branded success messages
- **Backend API**: Updated email templates with orange branding
- **Backend API**: HTTP headers include brand information
- **Browser Extension**: Orange lightning bolt icons (16px, 32px, 48px, 128px)
- **Browser Extension**: Animated lightning bolt in popup
- **Browser Extension**: Cross-browser compatibility (Chrome, Firefox, Edge, Safari)
- **WordPress Plugin**: Branded admin settings page with header
- **WordPress Plugin**: Welcome message with Quick Start Guide
- **WordPress Plugin**: Orange-themed dashboard widgets
- **Frontend**: Updated metadata for SEO and social media
- **Frontend**: New landing page sections highlighting humanize/shortenize
- **Documentation**: Comprehensive README.md with project overview
- **Documentation**: Quick Start Guide for new users
- **Documentation**: API Documentation with examples
- **Documentation**: CHANGELOG.md for version tracking

### 🔧 Technical Improvements

- **Backend**: Brand constants now frozen (immutable)
- **Backend**: Email service uses branded templates and colors
- **Backend**: API controllers include JSDoc comments
- **Frontend**: Dashboard layout includes tagline in header
- **Frontend**: Sidebar navigation with updated tooltips
- **Browser Extension**: Manifest V3 compatibility
- **WordPress Plugin**: CSS variables for easy theme customization
- **WordPress Plugin**: Gutenberg block updates with new labels

### 🎯 Fixed

- Consistent messaging across all touchpoints
- UI/UX improvements for clarity
- Color scheme consistency (orange branding throughout)
- Text domain standardization in WordPress plugin
- Email template rendering issues

### 📚 Documentation

- **NEW**: `/README.md` - Comprehensive project documentation
- **NEW**: `/docs/QUICK_START.md` - 5-minute getting started guide
- **NEW**: `/docs/API.md` - Complete API reference
- **NEW**: `/CHANGELOG.md` - Version history (this file)
- **UPDATED**: `/backend/README.md` - Backend-specific documentation
- **UPDATED**: `/dashdig-extension/README.md` - Extension documentation
- **UPDATED**: `/dashdig-extension/INSTALLATION.md` - Multi-browser installation
- **UPDATED**: `/dashdig-url-shortener/readme.txt` - WordPress.org listing

---

## [1.1.0] - 2024-12-15

### Added

- QR code generation for all humanized URLs
- Enhanced analytics dashboard with new visualizations
- WordPress plugin improvements
- Browser extension QR code support
- Recent links history (10 items) in extension

### Changed

- Improved WordPress 6.4 compatibility
- Better error handling and user feedback
- Enhanced analytics data collection
- Faster API response times

### Fixed

- WordPress Gutenberg block rendering issues
- Extension popup layout on small screens
- Analytics date range selection bug
- QR code download filename formatting

---

## [1.0.0] - 2024-11-01

### Added - Initial Release

#### Core Features
- AI-powered URL humanization using Claude API
- Smart URL shortening with contextual slugs
- Click tracking and analytics
- QR code generation
- User authentication (email/password, Google OAuth)
- Dashboard for managing URLs
- RESTful API

#### Frontend
- Next.js 15 application
- React 19 components
- Tailwind CSS 4.0 styling
- Responsive design
- Analytics dashboard
- URL management interface

#### Backend
- Node.js/Express API server
- MongoDB database
- Redis caching
- JWT authentication
- Email verification
- Rate limiting
- API key management

#### Browser Extension
- Chrome support
- One-click URL shortening
- Popup interface
- Recent links history
- Clipboard integration

#### WordPress Plugin
- Gutenberg block integration
- Classic Editor support
- Shortcode: `[dashdig]`
- Custom post type for URLs
- Bulk URL shortening tools
- Analytics dashboard widget

#### Documentation
- Installation guides
- API documentation
- User guides
- Developer documentation

---

## [Unreleased]

### Planned Features

#### Version 1.3.0 (Q1 2025)
- [ ] Custom domains (Pro feature)
- [ ] Webhooks for URL events
- [ ] Team collaboration features
- [ ] Bulk API endpoint
- [ ] URL expiration options (date + click limit)
- [ ] Password-protected URLs
- [ ] Link-in-bio page builder
- [ ] Advanced analytics (heatmaps, conversion tracking)

#### Version 1.4.0 (Q2 2025)
- [ ] Mobile apps (iOS, Android)
- [ ] Browser extension Safari support (native)
- [ ] WordPress plugin multisite support
- [ ] White-label options (Enterprise)
- [ ] API v2 with GraphQL
- [ ] Real-time collaboration
- [ ] URL A/B testing
- [ ] Smart redirects (geo, device, time-based)

#### Version 2.0.0 (Q3 2025)
- [ ] Link management platform
- [ ] Campaign management
- [ ] Team workspaces
- [ ] Advanced permissions
- [ ] Integrations (Zapier, Make, etc.)
- [ ] Custom branding (Enterprise)
- [ ] SLA and support tiers
- [ ] Dedicated infrastructure options

---

## Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR version** (X.0.0): Incompatible API changes
- **MINOR version** (1.X.0): New features (backward compatible)
- **PATCH version** (1.0.X): Bug fixes (backward compatible)

---

## Release Schedule

- **Major releases**: Quarterly (Q1, Q2, Q3, Q4)
- **Minor releases**: Monthly
- **Patch releases**: As needed (security, critical bugs)

---

## Deprecation Policy

- Features marked as deprecated will be supported for **6 months**
- Breaking changes announced **3 months** in advance
- Migration guides provided for all breaking changes

---

## Support & Feedback

- **Report issues**: [GitHub Issues](https://github.com/dashdig/dashdig/issues)
- **Request features**: [Feature Requests](https://dashdig.com/features)
- **Feedback**: [feedback@dashdig.com](mailto:feedback@dashdig.com)
- **Security**: [security@dashdig.com](mailto:security@dashdig.com)

---

## Links

- **Website**: [dashdig.com](https://dashdig.com)
- **Documentation**: [dashdig.com/docs](https://dashdig.com/docs)
- **API Status**: [status.dashdig.com](https://status.dashdig.com)
- **Blog**: [dashdig.com/blog](https://dashdig.com/blog)
- **Twitter**: [@dashdig](https://twitter.com/dashdig)

---

**⚡ Dashdig - Humanize and Shortenize URLs**

*Making the web more memorable, one URL at a time.*

