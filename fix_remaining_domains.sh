#!/bin/bash
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig/frontend

OLD_DOMAIN="dashdig-backend-production.up.railway.app"
NEW_DOMAIN="dashdig-production.up.railway.app"

echo "=== Fixing remaining domain references ==="

# 1. Fix .env.production.local
echo "1. Fixing .env.production.local..."
if [ -f .env.production.local ]; then
    sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" .env.production.local
    echo "✅ Updated .env.production.local"
else
    echo "⚠️  .env.production.local not found, creating..."
    echo "NEXT_PUBLIC_API_URL=https://$NEW_DOMAIN/api" > .env.production.local
fi

# 2. Fix src/components/UrlShortener.tsx
echo "2. Fixing src/components/UrlShortener.tsx..."
if [ -f src/components/UrlShortener.tsx ]; then
    sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" src/components/UrlShortener.tsx
    echo "✅ Updated src/components/UrlShortener.tsx"
else
    echo "⚠️  src/components/UrlShortener.tsx not found"
fi

# 3. Fix src/lib/api.ts
echo "3. Fixing src/lib/api.ts..."
if [ -f src/lib/api.ts ]; then
    sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" src/lib/api.ts
    echo "✅ Updated src/lib/api.ts"
else
    echo "⚠️  src/lib/api.ts not found"
fi

echo -e "\n=== Verification ==="
echo "Checking for any remaining old domain references..."
grep -r "$OLD_DOMAIN" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.vercel 2>/dev/null && echo "❌ Still found old references!" || echo "✅ All old domain references fixed!"

echo -e "\n=== Cleaning cache ==="
rm -rf .next
rm -rf node_modules/.cache

echo -e "\n=== Rebuilding and redeploying ==="
npm run build
vercel --prod

echo -e "\n✅ Complete! Your app should now use the correct domain."
