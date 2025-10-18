# Frontend Environment Variables

## Required Variables for Vercel

Set these in your Vercel dashboard (Project → Settings → Environment Variables):

### Production Environment
```bash
NEXT_PUBLIC_BASE_URL=https://dashdig.com
NEXT_PUBLIC_API_URL=https://dashdig-backend-production.up.railway.app
```

### Development Environment (Optional)
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## How It Works

The frontend now uses `NEXT_PUBLIC_BASE_URL` to construct complete shortened URLs:

```javascript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dashdig.com';
const shortUrl = `${baseUrl}/${shortCode}`;
```

This ensures:
- ✅ Complete URLs are displayed: `https://dashdig.com/hoka.bondi.running`
- ✅ Environment-specific URLs (dev vs prod)
- ✅ Consistent URL construction across all components

## Components Updated

1. **UrlShortener.tsx** - Demo URL generation
2. **Dashboard page.tsx** - Mock data and URL construction
3. **Homepage page.tsx** - Demo URL display
4. **All display text** - Dynamic domain display

## Verification

After setting environment variables:
1. Visit the homepage and create a demo URL
2. Check that it shows: `https://dashdig.com/your.generated.slug`
3. Visit dashboard and verify URLs display correctly
4. Test copy functionality works with complete URLs
