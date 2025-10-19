#!/bin/bash

echo "=== Test 1: Create a URL via API ==="
RESULT=$(curl -s -X POST https://dashdig-production.up.railway.app/api/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com", "keywords": ["test", "debug"]}')

echo "$RESULT" | jq '.'

# Extract the slug
SLUG=$(echo "$RESULT" | jq -r '.data.slug')
echo -e "\n✅ Created URL with slug: $SLUG"

echo -e "\n=== Test 2: Try to access the shortened URL ==="
echo "Trying: https://dashdig-production.up.railway.app/$SLUG"
curl -I "https://dashdig-production.up.railway.app/$SLUG" 2>&1 | head -20

echo -e "\n=== Test 3: Check what the backend returns ==="
curl -s "https://dashdig-production.up.railway.app/$SLUG"

echo -e "\n\n=== Test 4: Check Railway logs ==="
echo "Run this separately to see what the backend logs:"
echo "  railway logs | grep -A 5 -B 5 'SLUG LOOKUP'"

echo -e "\n=== Diagnosis ==="
echo "If you see 'URL not found', the issue is:"
echo "1. Either the slug isn't being saved to the database correctly"
echo "2. Or the slug lookup in app.js isn't finding it"
echo "3. Or there's a field name mismatch (shortCode vs slug vs short_id)"
