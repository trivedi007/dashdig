#!/bin/bash

echo "🧪 Testing Context-Aware URL Generation..."

# Test URLs
test_urls=(
  "https://delivery.publix.com/landing?product_id=16777619"
  "https://www.target.com/p/dial-antibacterial-deodorant-12pk/-/A-123456789"
  "https://www.walmart.com/ip/iPhone-15-Pro-Max-256GB-Blue/123456789"
  "https://www.amazon.com/Nike-Vaporfly-Running-Shoes/dp/B08N5WRWNW"
  "https://www.costco.com/kirkland-signature-dog-food-40-lb.product.123456789.html"
  "https://www.google.com/search?q=wilson+baseball+gloves"
  "https://www.nike.com/us/en/p/air-max-270-mens-shoes-123456789"
  "https://www.hoka.com/en/us/mens/clifton-9/123456789.html"
)

API_URL="https://dashdig-backend-production.up.railway.app"

echo "Testing AI slug generation with improved prompts..."
echo ""

for url in "${test_urls[@]}"; do
  echo "🔗 Testing: $url"
  
  response=$(curl -s -X POST "$API_URL/test-slug" \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$url\"}")
  
  if [ $? -eq 0 ]; then
    slug=$(echo "$response" | grep -o '"slug":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$slug" ]; then
      echo "✅ Generated: dashdig.com/$slug"
    else
      echo "❌ Failed to extract slug from response"
      echo "Response: $response"
    fi
  else
    echo "❌ API call failed"
  fi
  
  echo ""
done

echo "🎯 Test completed! Check if the AI is generating context-aware slugs."

