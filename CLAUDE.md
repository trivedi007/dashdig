# Dashdig Project Memory

## Project Overview
Dashdig is an AI-powered URL shortener that creates memorable, semantic short links using Claude Sonnet 4.5.

**Live URLs:**
- Frontend: https://dashdig.com (Vercel)
- Backend: https://dashdig-production.up.railway.app (Railway)

## Repository Structure
```
Dashdig/
├── dashdig-frontend/     # Next.js 15 + React 19 (Vercel)
├── dashdig-backend/      # Node.js + Express (Railway)
├── dashdig-wordpress/    # WordPress plugin (testing phase)
├── dashdig-extension/    # Chrome extension (completed)
└── markdowns/            # Project documentation
```

## Current Development Status
- ✅ **Browser Extension**: Completed, Manifest V3
- 🔄 **WordPress Plugin**: In testing phase (next: manual testing)
- ⏭️ **JavaScript Widget**: Next milestone (Opus Prompt #3)
- 🚀 **Backend API**: Live on Railway with MongoDB Atlas + Redis
- 🌐 **Frontend**: Live on Vercel with Next.js 15

## Tech Stack

### Backend (Railway)
- Node.js 18+ with Express
- MongoDB Atlas (database)
- Redis (caching)
- JWT authentication
- Docker containerized

### Frontend (Vercel)
- Next.js 15 (React 19)
- Tailwind CSS 4.0
- Orange/gradient branding (#FF6B00)

### WordPress Plugin
- PHP 7.4+ compatible
- WordPress 6.0+ required
- WordPress Coding Standards compliant
- Settings API integration
- Nonce verification + sanitization/escaping

## Development Workflow
1. **Cursor IDE**: Big features (WordPress, widgets, new components)
2. **VSCode + Cline**: Testing and refinement
3. **Claude.ai**: Strategy, prompts, high-level planning
4. **Claude Code**: Ongoing development with persistent memory

## API Endpoints
- `POST /api/analytics/track` - Send tracking events
- `GET /api/analytics/data` - Retrieve analytics
- `POST /api/analytics/insights` - Get AI insights
- `POST /api/urls` - Create short URLs

## Key Design Decisions
- Using **Railway** (not AWS) for backend hosting - stay until costs > $500/mo
- Using **Vercel** (not Netlify) for frontend hosting
- **PostgreSQL** mentioned in docs but using **MongoDB** in production
- **Docker Compose** (not Kubernetes) for orchestration
- WordPress.org submission planned for next week

## Testing Strategy
- **Manual testing** for WordPress plugin (checklist-based)
- **Automated tests** deferred until post-MVP
- Test WordPress versions: 6.0, 6.1, 6.2, 6.3, 6.4
- Cross-browser testing for Chrome extension

## Next Milestones
1. Complete WordPress plugin manual testing (today/tomorrow)
2. Create readme.txt for WordPress.org submission
3. Build JavaScript embeddable widget (Prompt #3)
4. Submit WordPress plugin to WordPress.org (Week 2-6 approval time)
5. Launch MVP to first 100 users

## Environment Variables
```bash
# Backend (Railway)
DATABASE_URL=mongodb://...
REDIS_URL=redis://...
JWT_SECRET=...
BASE_URL=https://dashdig.com

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://dashdig-production.up.railway.app
```

## Coding Standards
- **WordPress**: WP Coding Standards, sanitize inputs, escape outputs, nonces
- **JavaScript**: ESLint + Prettier
- **TypeScript**: Strict mode enabled
- **Git**: Conventional commits
