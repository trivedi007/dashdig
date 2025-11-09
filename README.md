# Dashdig - Humanize and Shortenize URLs ⚡

**Transform cryptic URLs into human-readable links that people actually remember.**

Instead of: `bit.ly/3xK9m2L`  
Create: `dashdig.com/Best.Coffee.In.Seattle`

[![Version](https://img.shields.io/badge/version-1.2.0-orange.svg)](https://github.com/dashdig/dashdig)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

---

## What is "Humanize and Shortenize"?

- **Humanize**: Create URLs that make sense to humans, not robots
- **Shortenize**: Shorter than full URLs, smarter than random strings  
- **Memorize**: Links people can actually remember and trust

Traditional URL shorteners give you cryptic codes like `bit.ly/3xK9m2L`.  
Dashdig creates **human-readable URLs** like `dashdig.com/Best.Coffee.In.Seattle`.

---

## ✨ Features

⚡ **AI-Powered** - Intelligent URL humanization using Claude AI  
🔗 **Smart Shortening** - Contextual, memorable slugs  
📱 **QR Codes** - Built-in for every humanized URL  
📊 **Analytics** - Track clicks on shortenized URLs  
🎨 **Beautiful UI** - Orange lightning bolt ⚡ branding  
🔒 **Privacy-First** - Your data stays secure  
🌐 **Cross-Platform** - Web, browser extension, WordPress plugin, widget  
🚀 **Fast** - Sub-50ms redirects with Redis caching

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/dashdig.git

# Install dependencies
cd dashdig
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys (see .env.example for details)

# Run development server
npm run dev
```

Visit `http://localhost:3000` to start humanizing and shortenizing URLs!

---

## 📁 Project Structure

```
dashdig/
├── frontend/              # Next.js 15 frontend application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   └── styles/            # CSS and styling
│
├── backend/               # Node.js/Express API server
│   ├── src/
│   │   ├── config/        # Configuration (including branding)
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # MongoDB models
│   │   ├── services/      # Business logic (AI, email, analytics)
│   │   └── routes/        # API routes
│   └── tests/             # Backend tests
│
├── dashdig-extension/     # Browser extension (Chrome, Firefox, Edge)
│   ├── icons/             # Extension icons
│   ├── popup.html         # Extension popup
│   ├── popup.css          # Extension styles
│   └── popup.js           # Extension logic
│
├── dashdig-url-shortener/ # WordPress plugin
│   ├── admin/             # Admin interface
│   ├── assets/            # CSS, JS, images
│   ├── includes/          # Core classes
│   └── dashdig.php        # Main plugin file
│
├── dashdig-widget/        # JavaScript widget for websites
│   ├── src/               # Widget source
│   └── dist/              # Compiled widget
│
└── docs/                  # Documentation
    ├── QUICK_START.md     # Getting started guide
    ├── API.md             # API documentation
    ├── WORDPRESS.md       # WordPress plugin guide
    └── EXTENSION.md       # Browser extension guide
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS 4.0
- **State**: React Hooks, Context API
- **Animation**: Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **AI**: Anthropic Claude API
- **Email**: Nodemailer
- **Auth**: JWT, bcrypt

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud
- **CDN**: Cloudflare

### Tools
- **Package Manager**: npm
- **Testing**: Vitest, Jest, Cypress
- **Linting**: ESLint
- **Formatting**: Prettier
- **CI/CD**: GitHub Actions

---

## 🎨 Branding

**Tagline**: "Humanize and Shortenize URLs"  
**Slogan**: "Dig This!" (becoming a web action verb)  
**Version**: 1.2.0  

### Colors
- **Primary Orange**: `#FF6B35`
- **Deep Orange**: `#FF4500`
- **Orange Light**: `#FFB399`
- **Orange Pale**: `#FFE5DD`
- **Dark Gray**: `#2C3E50`
- **Gray Medium**: `#7F8C8D`

### Icon
**Orange lightning bolt ⚡**

### Messaging
- "Transform cryptic URLs into human-readable links"
- "Stop sharing ugly links. Humanize and shortenize with Dashdig!"
- "Links people can actually remember and trust"

---

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - Get started in 5 minutes
- **[API Documentation](./docs/API.md)** - Integrate Dashdig into your app
- **[WordPress Plugin Guide](./docs/WORDPRESS.md)** - Install on WordPress
- **[Browser Extension Guide](./docs/EXTENSION.md)** - Chrome, Firefox, Edge
- **[Widget Integration](./docs/WIDGET.md)** - Add to your website
- **[User Guide](./docs/USER_GUIDE.md)** - Complete feature documentation

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

### Backend (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd backend
railway up
```

### Environment Variables
See `.env.example` in each directory for required environment variables.

---

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Manual Testing
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Test browser extension: Load unpacked in Chrome
4. Test WordPress plugin: Install in local WordPress

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Write tests for new features
- Update documentation
- Use conventional commits
- Keep PRs focused and small

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.

**Latest Version: 1.2.0** (2025-01-09)
- Complete rebranding to "Humanize and Shortenize URLs"
- Enhanced AI-powered URL humanization
- Updated all platforms (web, extension, WordPress, widget)
- Improved analytics dashboard
- Orange lightning bolt theme throughout

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🆘 Support

Need help? We're here for you:

- **Website**: [dashdig.com](https://dashdig.com)
- **Documentation**: [dashdig.com/docs](https://dashdig.com/docs)
- **Support Portal**: [dashdig.com/support](https://dashdig.com/support)
- **Email**: support@dashdig.com
- **Twitter**: [@dashdig](https://twitter.com/dashdig)
- **GitHub Issues**: [github.com/dashdig/dashdig/issues](https://github.com/dashdig/dashdig/issues)

---

## 🌟 Show Your Support

If you find Dashdig helpful, please:
- ⭐ Star this repository
- 🐦 Share on Twitter
- 📝 Write a blog post
- 🎥 Create a video tutorial

---

## 🔗 Links

- **Live Demo**: [dashdig.com](https://dashdig.com)
- **Dashboard**: [dashdig.com/dashboard](https://dashdig.com/dashboard)
- **API**: [api.dashdig.com](https://api.dashdig.com)
- **Status Page**: [status.dashdig.com](https://status.dashdig.com)
- **Blog**: [dashdig.com/blog](https://dashdig.com/blog)

---

## 👥 Team

Built with ❤️ by the Dashdig team:
- Product & Design
- Engineering
- Marketing
- Support

---

## 🙏 Acknowledgments

- **Claude AI** by Anthropic - Powers our intelligent URL humanization
- **Vercel** - Hosting our frontend with blazing speed
- **Railway** - Reliable backend infrastructure
- **MongoDB** - Scalable data storage
- **Redis** - Lightning-fast caching
- **Open Source Community** - For amazing tools and libraries

---

**⚡ Dashdig - Humanize and Shortenize URLs**

*Making the web more memorable, one URL at a time.*

[Get Started](https://dashdig.com) | [Documentation](https://dashdig.com/docs) | [API](https://dashdig.com/api) | [Support](https://dashdig.com/support)

