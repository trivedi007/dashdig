# DashDig Modern Analytics Dashboard

## Overview

A comprehensive, modern analytics dashboard for DashDig URL shortener with real-time data visualization, URL management, and embeddable widget support.

## Features

### 1. **Dashboard Overview** (`/overview`)
- Real-time statistics with animated cards
- Click trends with interactive line charts
- Top performing URLs ranking
- Recent activity timeline
- Quick action buttons

### 2. **URL Management** (`/urls`)
- Sortable data table (by clicks, date, slug)
- Advanced search and filtering
- Bulk operations (delete, export)
- QR code generation
- Copy to clipboard
- CSV export functionality
- Delete confirmation modals

### 3. **Analytics Detail View** (`/analytics/[slug]`)
- Detailed click analytics per URL
- Time-series charts (clicks over time)
- Device breakdown (pie chart)
- Browser distribution (bar chart)
- Geographic data (top countries)
- Referrer sources
- Export analytics data (JSON)

### 4. **Widget Installation** (`/widget`)
- Framework-specific code examples:
  - Vanilla JavaScript
  - React
  - Vue 3
  - Angular
- Syntax-highlighted code snippets
- One-click copy functionality
- API key management
- Feature highlights

## Tech Stack

### Core
- **Next.js 15.5.3** - App Router with React 19
- **TypeScript** - Type-safe development
- **TailwindCSS 4** - Utility-first styling

### Data & State
- **React Query (@tanstack/react-query)** - Server state management
- **React Hot Toast** - Notifications

### Visualization
- **Recharts** - Charts and graphs
- **React QR Code** - QR code generation

### UI/UX
- **Framer Motion** - Smooth animations
- **React Syntax Highlighter** - Code display
- **date-fns** - Date formatting

## Project Structure

```
frontend/
├── app/
│   ├── (dashboard)/           # Dashboard route group
│   │   ├── layout.tsx         # Shared sidebar layout
│   │   ├── overview/          # Overview dashboard
│   │   ├── urls/              # URL management
│   │   ├── analytics/         # Analytics views
│   │   │   ├── page.tsx       # Analytics index
│   │   │   └── [slug]/        # Specific URL analytics
│   │   └── widget/            # Widget installation
│   ├── components/
│   │   ├── charts/            # Chart components
│   │   │   ├── ClicksChart.tsx
│   │   │   ├── DeviceChart.tsx
│   │   │   └── BrowserChart.tsx
│   │   ├── cards/             # Card components
│   │   │   └── StatCard.tsx
│   │   └── tables/            # Table components
│   │       └── UrlTable.tsx
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── lib/
│   ├── providers.tsx          # React Query provider
│   └── hooks/
│       └── useUrls.ts         # Custom hooks
└── package.json
```

## Design System

### Colors
```css
--primary: #FF6B35      /* Dashdig Orange */
--secondary: #4ECDC4    /* Teal */
--accent: #FFE66D       /* Yellow */
--dark: #2D3436         /* Dark Gray */
--light: #F8F9FA        /* Light Gray */
```

### Gradients
- **Primary:** `linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)`
- **Secondary:** `linear-gradient(135deg, #4ECDC4 0%, #3bb5b0 100%)`

### Typography
- **Font:** Inter (system fallback to -apple-system, BlinkMacSystemFont)
- **Headings:** Bold, gradient text for emphasis
- **Body:** Gray scale for hierarchy

## Installation

```bash
cd frontend
npm install
```

### Dependencies Installed
```bash
npm install @tanstack/react-query react-syntax-highlighter @types/react-syntax-highlighter date-fns
```

## Development

```bash
npm run dev
```

Visit `http://localhost:3000/overview` to see the dashboard.

## API Integration

### Hooks Available

#### `useUrls()`
Fetch all URLs for the authenticated user.

```typescript
const { data, isLoading, error } = useUrls()
// data: { urls: UrlItem[], totalClicks: number }
```

#### `useUrlAnalytics(slug)`
Fetch detailed analytics for a specific URL.

```typescript
const { data, isLoading, error } = useUrlAnalytics('my-slug')
// data: AnalyticsData with clicks, devices, browsers, etc.
```

#### `useCreateUrl()`
Create a new shortened URL.

```typescript
const createUrl = useCreateUrl()
await createUrl.mutateAsync({
  url: 'https://example.com',
  customSlug: 'my-link',
  keywords: ['tag1', 'tag2']
})
```

#### `useDeleteUrl()`
Delete a URL.

```typescript
const deleteUrl = useDeleteUrl()
await deleteUrl.mutateAsync(urlId)
```

## Features Breakdown

### Animations
- **Card Hover:** Lift effect with shadow increase
- **Page Transitions:** Fade in and slide up
- **Loading States:** Spinning orange loader
- **Modal Animations:** Scale and fade

### Responsive Design
- **Mobile:** Stacked layout, hamburger menu
- **Tablet:** 2-column grid
- **Desktop:** Full sidebar, multi-column grids

### Dark Mode Support
CSS variables configured for dark mode (ready to toggle).

### Data Persistence
- React Query caching (1 minute stale time)
- Automatic refetch on mutations
- Local storage for auth tokens

## Usage Examples

### Creating a URL
Navigate to `/urls` and use the form or import from the old dashboard.

### Viewing Analytics
1. Go to `/analytics` to see all URLs with clicks
2. Click on any URL card
3. View detailed breakdown with charts

### Exporting Data
- **URLs:** Click "Export CSV" on `/urls` page
- **Analytics:** Click "Export Analytics Data" on detail page

### Installing Widget
1. Navigate to `/widget`
2. Select your framework
3. Copy the code snippet
4. Paste into your project

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting per route
- Lazy loading for charts
- Optimized images and assets
- React Query caching strategy

## Accessibility

- Semantic HTML
- Keyboard navigation
- ARIA labels
- Focus indicators
- Color contrast (WCAG AA)

## Security

- API key protection
- Token-based authentication
- HTTPS only
- XSS protection
- CSRF tokens

## Future Enhancements

- [ ] Real-time analytics with WebSockets
- [ ] Advanced filtering (date ranges, custom fields)
- [ ] Team collaboration features
- [ ] Custom domain management
- [ ] A/B testing for URLs
- [ ] Scheduled link expiration
- [ ] Link preview customization
- [ ] Webhook integrations

## Support

For issues or questions:
- GitHub: [dashdig/issues](https://github.com/dashdig/issues)
- Email: support@dashdig.com
- Docs: https://docs.dashdig.com

## License

Proprietary - © 2024 Dashdig

---

Built with ⚡ by the Dashdig team

