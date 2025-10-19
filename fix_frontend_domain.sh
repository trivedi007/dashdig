#!/bin/bash
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig

# Wrong domain that needs to be replaced
OLD_DOMAIN="dashdig-backend-production.up.railway.app"
NEW_DOMAIN="dashdig-production.up.railway.app"

echo "=== Updating frontend domain references ==="

# 1. Fix .env.local
echo "1. Updating .env.local..."
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_BASE_URL="https://dashdig-production.up.railway.app"
NEXT_PUBLIC_API_URL="https://dashdig-production.up.railway.app/api"
EOF

# 2. Fix middleware.ts
echo "2. Updating middleware.ts..."
sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" frontend/middleware.ts

# 3. Fix verify page
echo "3. Updating auth/verify/page.tsx..."
sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" frontend/app/auth/verify/page.tsx

# 4. Fix signin page
echo "4. Updating auth/signin/page.tsx..."
sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" frontend/app/auth/signin/page.tsx

# 5. Fix debug analytics page
echo "5. Updating debug-analytics/page.tsx..."
sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" frontend/app/debug-analytics/page.tsx

# 6. Fix dashboard page
echo "6. Updating dashboard/page.tsx..."
sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" frontend/app/dashboard/page.tsx

# 7. Fix main page
echo "7. Updating page.tsx..."
sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" frontend/app/page.tsx

# 8. Fix vercel.json
echo "8. Updating vercel.json..."
sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" frontend/vercel.json

# 9. Clean Next.js build cache
echo "9. Cleaning Next.js cache..."
rm -rf frontend/.next
rm -rf frontend/node_modules/.cache

echo -e "\n=== Verification ==="
echo "Searching for old domain references..."
grep -r "$OLD_DOMAIN" frontend/ --exclude-dir=node_modules --exclude-dir=.next || echo "✅ No old domain references found!"

echo -e "\n=== Changes made ==="
echo "All files updated to use: $NEW_DOMAIN"

# Commit changes
echo -e "\n=== Committing changes ==="
git add frontend/
git commit -m "Fix: Update frontend to use correct Railway domain"
git push

echo -e "\n=== Deploy frontend ==="
echo "If using Vercel:"
echo "  cd frontend && vercel --prod"
echo ""
echo "Or rebuild Next.js locally:"
echo "  cd frontend && npm run build"
