# Dashdig Neo-Brutalist → React/Next.js Conversion
## Complete Cursor IDE Prompts Guide

**Created**: December 8, 2025  
**Tool**: Cursor IDE with Claude Sonnet 4.5  
**Approach**: Full Page Replacement (Option 1)

---

## 📋 PHASE 0: BACKUP HTML MOCKUPS (Do This First!)

### Step 1: Create Backup Branch

```bash
# Navigate to your dashdig directory
cd ~/AI-ML/Business-Ideas/Dashdig

# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create a backup branch for HTML mockups
git checkout -b backup/neo-brutalist-html-mockups

# Create directory for mockups
mkdir -p frontend/src/designs/neo-brutalist-v12

# Copy the HTML files from Claude outputs to your local machine
# (You'll download these from Claude and place them here)
# Files to copy:
# - dashdig-neo-brutalist-v12-FINAL.html → landing.html
# - dashdig-dashboard-aurora-v2.html → dashboard.html
# - dashdig-demo-dashboard.html → demo-dashboard.html
# - dashdig-login-sso.html → login.html
# - dashdig-enterprise.html → enterprise.html
# - dashdig-extension-popup.html → extension-popup.html

# Commit the backup
git add .
git commit -m "backup: Neo-Brutalist HTML mockups v12 - pre-React conversion

Files included:
- Landing page (neo-brutalist style)
- Dashboard (aurora theme)
- Demo dashboard (free tier preview)
- SSO Login (5 providers)
- Enterprise page
- Browser extension popup

Design system:
- Bolt color: #FFCC33 (solid gold)
- Accent: #FF6B35 (orange)
- Font: Space Grotesk + Inter
- Tagline: HUMANIZE • SHORTENIZE • URLS"

# Tag this backup
git tag -a v0.12.0-html-mockups -m "Neo-Brutalist HTML mockups before React conversion"

# Push backup
git push origin backup/neo-brutalist-html-mockups
git push origin v0.12.0-html-mockups

# Now create the conversion branch
git checkout main
git checkout -b feature/neo-brutalist-react-conversion
```

---

## 📋 PHASE 1: SHARED COMPONENTS

### Prompt 1.1: Create Design System Constants

```
Create a design system constants file for Dashdig's Neo-Brutalist theme.

FILE: frontend/src/lib/design-system.ts

Include these EXACT values:

COLORS:
- accent: #FF6B35 (primary orange)
- accentHover: #E55A2B 
- boltGold: #FFCC33 (lightning bolt - ALWAYS solid, never gradient)
- black: #1A1A1A
- bgDark: #0F0F1A
- bgCard: #1A1A2E
- bgCream: #FDF8F3
- textPrimary: #FFFFFF (dark mode) / #1A1A1A (light mode)
- textSecondary: #A0A0B8 (dark mode) / #6B7280 (light mode)
- success: #10B981
- warning: #F59E0B
- error: #EF4444
- auroraStart: #4F46E5
- auroraMid: #7C3AED
- auroraEnd: #EC4899

TYPOGRAPHY:
- fontDisplay: 'Space Grotesk', sans-serif (for headings, logo, buttons)
- fontBody: 'Inter', sans-serif (for body text)
- fontMono: 'JetBrains Mono', 'Courier New', monospace (for URLs, code)

SHADOWS (Neo-Brutalist):
- shadowSm: '2px 2px 0 #1A1A1A'
- shadowMd: '3px 3px 0 #1A1A1A'
- shadowLg: '4px 4px 0 #1A1A1A'
- shadowHover: '6px 6px 0 #1A1A1A'

BORDERS:
- borderWidth: '2px'
- borderColor: '#1A1A1A'
- borderRadius: '8px' (buttons), '12px' (cards), '10px' (logo icon)

Export as TypeScript constants and also generate Tailwind config extension.
```

---

### Prompt 1.2: Create Lightning Bolt Component

```
Create a reusable Lightning Bolt SVG component for Dashdig.

FILE: frontend/src/components/ui/LightningBolt.tsx

REQUIREMENTS:
1. Use this EXACT SVG path (do not modify):
   M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z

2. Props interface:
   - size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
   - className?: string (for additional styling)

3. Size mappings:
   - sm: width="14" height="18"
   - md: width="20" height="24"  
   - lg: width="24" height="28"
   - xl: width="28" height="32"

4. ALWAYS use:
   - viewBox="-1 0 22 32" (for proper centering)
   - fill="#FFCC33" (solid gold - NEVER use gradients)
   - stroke="#1A1A1A"
   - strokeWidth="1.5"
   - strokeLinejoin="round"

5. Export as default and named export

Example usage:
<LightningBolt size="lg" />
<LightningBolt size="sm" className="mr-2" />
```

---

### Prompt 1.3: Create Logo Component

```
Create the Dashdig Logo component with the lightning bolt in orange box.

FILE: frontend/src/components/brand/Logo.tsx

REQUIREMENTS:
1. Structure:
   - Orange box container (#FF6B35 background)
   - Lightning bolt inside (using LightningBolt component)
   - "Dashdig" text (Space Grotesk, 700 weight)
   - Tagline: "HUMANIZE • SHORTENIZE • URLS" (uppercase, orange, 8-9px)

2. Props interface:
   - size: 'sm' | 'md' | 'lg' (default: 'md')
   - showTagline: boolean (default: true)
   - variant: 'light' | 'dark' (for text color)
   - href?: string (makes it a link)

3. Size mappings:
   - sm: icon 36px, text 18px, tagline 7px
   - md: icon 44px, text 24px, tagline 9px
   - lg: icon 48px, text 26px, tagline 10px

4. Hover effects:
   - Logo text turns orange (#FF6B35)
   - Icon lifts: transform translate(-2px, -2px)
   - Shadow increases: 3px 3px 0 → 5px 5px 0

5. Neo-Brutalist styling:
   - Icon border: 2px solid #1A1A1A
   - Icon shadow: 3px 3px 0 #1A1A1A
   - Icon border-radius: 10px

6. Transitions: all 0.2s ease
```

---

### Prompt 1.4: Create Button Components

```
Create Neo-Brutalist button components for Dashdig.

FILE: frontend/src/components/ui/Button.tsx

REQUIREMENTS:

1. Variants:
   - primary: Orange (#FF6B35) background, white text
   - secondary: Transparent, dark border, hover fills orange
   - ghost: No border/shadow, just text, hover turns orange
   - outline: Border only, no fill

2. Sizes:
   - sm: padding 8px 16px, font 13px
   - md: padding 12px 24px, font 14px (default)
   - lg: padding 16px 32px, font 16px

3. Props interface:
   - variant: 'primary' | 'secondary' | 'ghost' | 'outline'
   - size: 'sm' | 'md' | 'lg'
   - icon?: ReactNode (left icon)
   - iconRight?: ReactNode (right icon)
   - loading?: boolean
   - disabled?: boolean
   - fullWidth?: boolean
   - children: ReactNode
   - onClick?: () => void
   - href?: string (renders as Link)
   - type?: 'button' | 'submit'

4. Neo-Brutalist styling:
   - Border: 2px solid #1A1A1A
   - Shadow: 4px 4px 0 #1A1A1A
   - Border-radius: 8px
   - Font: Space Grotesk, 700 weight

5. Hover state:
   - Transform: translate(-2px, -2px)
   - Shadow: 6px 6px 0 #1A1A1A

6. Active/Click state:
   - Transform: translate(0, 0)
   - Shadow: none (pressed effect)

7. Include lightning bolt variant:
   <Button variant="primary" icon={<LightningBolt size="sm" />}>
     DIG THIS!
   </Button>
```

---

## 📋 PHASE 2: LANDING PAGE CONVERSION

### Prompt 2.1: Landing Page Structure

```
Convert the Dashdig Neo-Brutalist landing page HTML to Next.js 15 App Router.

FILE: frontend/src/app/page.tsx

REFERENCE HTML: frontend/src/designs/neo-brutalist-v12/landing.html

STRUCTURE TO IMPLEMENT:
1. Header
   - Logo (with tagline)
   - Navigation: Docs, Features, Pricing, How It Works, Enterprise
   - CTA buttons: Log in (ghost), Get Started Free (primary with bolt)

2. Hero Section
   - "Born in the Cloud" badge (cloud with lightning bolt)
   - Main heading with gradient text
   - Subheading
   - URL shortener input with "DIG THIS!" button
   - Before/After URL demo cards
   - Trust badges: "No credit card • 10 free URLs/month • Setup in 30 seconds"

3. Features Section
   - 6 feature cards in 3x2 grid
   - Each card: icon, title, description
   - Neo-Brutalist card styling

4. How It Works Section
   - 3 steps: Paste → Generate → Share
   - Connected with arrow/line

5. Pricing Section
   - 3 tier cards: Free, Starter ($12), Professional ($29)
   - Feature comparison lists
   - CTA buttons

6. Footer
   - Logo with tagline
   - Social links (Facebook, Twitter/X, LinkedIn, Reddit, TikTok)
   - Link columns: Product, Company, Resources, Legal
   - Copyright

STYLING:
- Background: #FDF8F3 (cream)
- Use Tailwind CSS classes
- Ensure all hover states work (orange transitions)
- Mobile responsive (check breakpoints)

IMPORTS NEEDED:
- LightningBolt component
- Logo component
- Button component
```

---

### Prompt 2.2: Landing Page Hero Section

```
Create the Hero section for Dashdig landing page with the URL shortener.

FILE: frontend/src/components/landing/Hero.tsx

FEATURES:
1. "Born in the Cloud" badge
   - Cloud SVG with lightning bolt inside
   - Gradient background
   - Hover animation

2. Main Heading:
   - "The Only URL Shortener"
   - "That Actually Makes Sense"
   - Gradient text on second line (orange to aurora)

3. URL Input Section:
   - Input field with placeholder "Paste your long, ugly URL here..."
   - "DIG THIS!" button with lightning bolt icon
   - AI-generated suggestion appears after paste

4. Before/After Demo:
   - "BEFORE" card: ugly Amazon URL (red tint)
   - Arrow in between
   - "AFTER" card: clean dashdig.com/amazon.echo.dot.5th.gen (green tint)

5. Trust Badges:
   - "No credit card required"
   - "10 free URLs/month"
   - "Setup in 30 seconds"

STATE MANAGEMENT:
- useState for URL input
- Optional: integrate with actual API for demo

ANIMATIONS:
- Fade in on load
- Hover effects on all interactive elements
```

---

## 📋 PHASE 3: AUTHENTICATION PAGES

### Prompt 3.1: SSO Login Page

```
Convert the Dashdig SSO Login page HTML to Next.js.

FILE: frontend/src/app/login/page.tsx

REFERENCE HTML: frontend/src/designs/neo-brutalist-v12/login.html

STRUCTURE:
1. Header
   - Logo (no tagline, smaller)
   - "Don't have an account? Sign up free" link

2. Login Card (centered, Neo-Brutalist border)
   - "Welcome back!" heading with lightning bolt
   - "Sign in to continue to Dashdig" subtext

3. Social Auth Buttons (5 options):
   - Continue with Google (white bg, Google colors icon)
   - Continue with Facebook (Facebook blue bg)
   - Continue with Apple (black bg)
   - Continue with GitHub (dark gray bg)
   - Continue with SMS (green bg)

4. Divider: "OR CONTINUE WITH EMAIL"

5. Email/Password Form:
   - Email input
   - Password input
   - "Forgot password?" link
   - Submit button

6. Terms text: "By continuing, you agree to our Terms of Service..."

HOVER STATES:
- ALL social buttons turn ORANGE (#FF6B35) on hover
- Active/click state: orange background

FUNCTIONALITY:
- Wire up to NextAuth.js or your existing auth system
- Google OAuth: redirect to Google
- Facebook OAuth: redirect to Facebook
- Apple OAuth: redirect to Apple
- GitHub OAuth: redirect to GitHub
- SMS: show phone number input modal
- Email: standard form submission

ERROR HANDLING:
- Show error messages for failed login
- Loading states on buttons
```

---

### Prompt 3.2: Signup Page

```
Create the Dashdig Signup page, similar to login but for new users.

FILE: frontend/src/app/signup/page.tsx

DIFFERENCES FROM LOGIN:
1. Heading: "Create your account" with bolt
2. Subtext: "Start shortening URLs in seconds"
3. Same social auth buttons
4. Email form has additional field: "Full name"
5. Password has strength indicator
6. "Already have an account? Log in" link in header
7. Plan selection if coming from pricing (?plan=starter)

FORM FIELDS:
- Full name (required)
- Email (required, validated)
- Password (required, min 8 chars, strength meter)
- Confirm password (must match)

VALIDATION:
- Real-time email format validation
- Password strength: weak/medium/strong
- Match confirmation

ON SUCCESS:
- Create account via API
- Auto-login
- Redirect to /dashboard or /onboarding
```

---

## 📋 PHASE 4: DASHBOARD PAGES

### Prompt 4.1: Authenticated Dashboard

```
Convert the Dashdig Aurora Dashboard HTML to Next.js.

FILE: frontend/src/app/dashboard/page.tsx

REFERENCE HTML: frontend/src/designs/neo-brutalist-v12/dashboard.html

LAYOUT:
1. Fixed Sidebar (260px width)
   - Logo with tagline
   - Navigation sections:
     - MAIN: Dashboard, My URLs, Analytics, QR Codes
     - INTEGRATIONS: WordPress, Browser Extension, API Access
     - ACCOUNT: Settings, Billing
   - User card at bottom (avatar, name, plan)

2. Main Content Area
   - Header: "Welcome back, {name}!" with bolt in orange box
   - Export and "New Link" buttons
   - Tabs: Overview | URLs | Analytics | Widgets | Settings

3. URL Input Section (Aurora gradient)
   - Same as landing page but inside dashboard

4. Stats Grid (4 cards):
   - Total URLs (orange top border)
   - Total Clicks (indigo top border)
   - QR Scans (pink top border)
   - Avg CTR (green top border)

5. Content Grid:
   - Click Analytics chart (7-day bar chart)
   - Recent URLs table
   - Quick Actions panel

SIDEBAR NAVIGATION:
- Active state: Aurora gradient background
- Hover state: Orange background tint, text turns orange
- Two-tone icons:
  - My URLs: orange + white link, flip on hover
  - Browser Extension: orange arrow + white box, flip on hover

DATA FETCHING:
- Use React Query or SWR
- GET /api/urls - user's URLs
- GET /api/analytics/overview - stats
- GET /api/analytics/clicks - chart data

AUTHENTICATION:
- Protect this route (redirect to /login if not authenticated)
- Get user from session/JWT
```

---

### Prompt 4.2: Demo Dashboard (Unauthenticated)

```
Create the Demo Dashboard for non-authenticated users.

FILE: frontend/src/app/demo/page.tsx

REFERENCE HTML: frontend/src/designs/neo-brutalist-v12/demo-dashboard.html

KEY DIFFERENCES FROM AUTH DASHBOARD:
1. Sticky banner at top:
   - "You're viewing the Demo Dashboard — Sign up free to save your links!"
   - "Start Free" button

2. Header (not sidebar):
   - Logo
   - "Demo Mode" badge
   - Log in / Sign Up Free buttons

3. Demo Notice Box:
   - "This is sample data"
   - "The URLs and analytics below are examples..."

4. Free Tier Counter:
   - "7 of 10 free URLs remaining this month"

5. Sample Data (hardcoded):
   - 3 sample URLs:
     - amazon.echo.dot.5th.gen (142 clicks)
     - nike.air.max.90.white (78 clicks)
     - apple.macbook.pro.m3 (27 clicks)
   - Stats: 3 URLs, 247 clicks, 32 QR scans, 4.2% CTR

6. Pricing Comparison at bottom:
   - Free (current), Starter ($12), Professional ($29)
   - Highlight Starter as "Recommended"

FUNCTIONALITY:
- URL shortener works (creates temp URLs, not saved)
- Show toast: "Sign up to save this link!"
- All CTAs lead to /signup

PURPOSE:
- Let visitors try before signing up
- Showcase the interface
- Convert to paid plans
```

---

## 📋 PHASE 5: ADDITIONAL PAGES

### Prompt 5.1: Enterprise Page

```
Convert the Dashdig Enterprise page HTML to Next.js.

FILE: frontend/src/app/enterprise/page.tsx

REFERENCE HTML: frontend/src/designs/neo-brutalist-v12/enterprise.html

SECTIONS:
1. Header (dark theme)
   - Logo with tagline
   - Nav: Features, Pricing, Enterprise (active), Docs
   - Login / Contact Sales buttons

2. Hero (Aurora gradient background)
   - "Enterprise Ready" badge
   - "URL Management Built for Scale" heading
   - Subtext about AI-powered, enterprise-grade, SSO
   - "Request Demo" and "View Documentation" buttons

3. Security Badges:
   - SOC 2 Type II
   - 99.99% Uptime
   - GDPR Compliant
   - HIPAA Ready
   - ISO 27001

4. Features Grid (6 cards):
   - SSO & SAML
   - API & Webhooks
   - Advanced Analytics
   - Custom Domains
   - Role-Based Access
   - Dedicated Support

5. Comparison Table:
   - Dashdig vs Bitly vs TinyURL
   - Features: AI URLs, Custom Domains, API, Analytics, etc.
   - Dashdig has most checkmarks

6. CTA Section (Aurora gradient):
   - "Ready to scale your URL strategy?"
   - Schedule Demo / Contact Sales buttons

7. Footer (minimal)

FORM:
- "Request Demo" opens modal or goes to /contact-sales
- Collect: Name, Email, Company, Company Size
```

---

## 📋 PHASE 6: TESTING & DEPLOYMENT

### Prompt 6.1: Test All Pages

```
Create a testing checklist component for Dashdig pages.

Run through each page and verify:

LANDING PAGE (/):
- [ ] Logo displays correctly with bolt and tagline
- [ ] Navigation links work
- [ ] URL input accepts paste
- [ ] "DIG THIS!" button has hover/active states
- [ ] Before/After demo cards show
- [ ] Features section renders 6 cards
- [ ] Pricing section shows 3 tiers
- [ ] Footer links work
- [ ] Mobile responsive (test at 375px, 768px, 1024px)

LOGIN (/login):
- [ ] Logo links to home
- [ ] All 5 social buttons render
- [ ] Hover state turns buttons orange
- [ ] Email/password form validates
- [ ] "Forgot password" link works
- [ ] "Sign up free" link goes to /signup

SIGNUP (/signup):
- [ ] Similar checks as login
- [ ] Name field validates
- [ ] Password strength indicator works
- [ ] Plan pre-selection from URL param

DEMO (/demo):
- [ ] Banner shows with CTA
- [ ] "Demo Mode" badge visible
- [ ] Sample data displays
- [ ] URL shortener works (temp)
- [ ] Pricing comparison shows

DASHBOARD (/dashboard):
- [ ] Redirects to /login if not authenticated
- [ ] Sidebar navigation works
- [ ] Hover states on nav items
- [ ] Stats load from API
- [ ] Recent URLs table populates
- [ ] Chart renders

ENTERPRISE (/enterprise):
- [ ] Aurora gradient background
- [ ] Security badges show
- [ ] Feature cards render
- [ ] Comparison table accurate
- [ ] CTA buttons work
```

---

### Prompt 6.2: Final Deployment

```
After all tests pass, deploy to Vercel.

STEPS:
1. Commit all changes:
   git add .
   git commit -m "feat: Complete Neo-Brutalist React conversion

   Pages converted:
   - Landing page (/)
   - Login (/login)
   - Signup (/signup)
   - Demo Dashboard (/demo)
   - Authenticated Dashboard (/dashboard)
   - Enterprise (/enterprise)

   Components created:
   - LightningBolt
   - Logo
   - Button variants
   - Card components
   - Sidebar
   - Stats cards

   Design system:
   - Consistent #FFCC33 bolt color
   - #FF6B35 orange accent
   - Space Grotesk + Inter fonts
   - Neo-Brutalist shadows and borders"

2. Push to GitHub:
   git push origin feature/neo-brutalist-react-conversion

3. Create PR and merge to main (or direct push):
   git checkout main
   git merge feature/neo-brutalist-react-conversion
   git push origin main

4. Vercel auto-deploys from main

5. Test production:
   - https://dashdig.com
   - https://dashdig.com/login
   - https://dashdig.com/demo
   - https://dashdig.com/dashboard
   - https://dashdig.com/enterprise

6. Create release tag:
   git tag -a v1.0.0-neo-brutalist -m "Neo-Brutalist rebrand launch"
   git push origin v1.0.0-neo-brutalist
```

---

## 📁 FILE STRUCTURE AFTER CONVERSION

```
frontend/src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/
│   │   └── page.tsx                # SSO Login
│   ├── signup/
│   │   └── page.tsx                # Signup
│   ├── demo/
│   │   └── page.tsx                # Demo Dashboard
│   ├── dashboard/
│   │   ├── page.tsx                # Main Dashboard
│   │   ├── urls/
│   │   │   └── page.tsx            # URLs list
│   │   ├── analytics/
│   │   │   └── page.tsx            # Analytics
│   │   └── settings/
│   │       └── page.tsx            # Settings
│   └── enterprise/
│       └── page.tsx                # Enterprise page
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LightningBolt.tsx
│   │   └── Modal.tsx
│   ├── brand/
│   │   └── Logo.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   ├── UrlsTable.tsx
│   │   └── ClicksChart.tsx
│   └── auth/
│       ├── SocialAuthButton.tsx
│       └── EmailForm.tsx
├── lib/
│   ├── design-system.ts
│   ├── api.ts
│   └── utils.ts
└── designs/
    └── neo-brutalist-v12/          # HTML backups
        ├── landing.html
        ├── dashboard.html
        ├── demo-dashboard.html
        ├── login.html
        ├── enterprise.html
        └── extension-popup.html
```

---

## ✅ CHECKLIST SUMMARY

### Before Starting:
- [ ] Backup HTML mockups to git branch
- [ ] Tag backup: v0.12.0-html-mockups
- [ ] Create conversion branch

### During Conversion:
- [ ] Design system constants created
- [ ] LightningBolt component works
- [ ] Logo component works  
- [ ] Button components work
- [ ] Landing page converted
- [ ] Login page converted
- [ ] Signup page converted
- [ ] Demo dashboard converted
- [ ] Auth dashboard converted
- [ ] Enterprise page converted

### Before Deployment:
- [ ] All pages tested locally
- [ ] Mobile responsive verified
- [ ] API endpoints connected
- [ ] Auth flow works end-to-end
- [ ] No console errors

### After Deployment:
- [ ] Production URLs work
- [ ] SSL working
- [ ] Analytics tracking
- [ ] Create release tag

---

*This document provides step-by-step Cursor prompts for converting Dashdig HTML mockups to React/Next.js. Follow phases in order for best results.*
