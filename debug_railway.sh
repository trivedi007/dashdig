#!/bin/bash

# ============================================
# Step 1: Verify what's actually deployed
# ============================================
echo "=== Step 1: Check deployed version ==="
curl -s https://dashdig-backend-production.up.railway.app/health | jq .

# ============================================
# Step 2: Test demo endpoint with verbose output
# ============================================
echo -e "\n=== Step 2: Test /demo-url with verbose ==="
curl -v -X POST https://dashdig-backend-production.up.railway.app/demo-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com"}' 2>&1 | grep -E "(HTTP|error|success)"

# ============================================
# Step 3: Test API URLs endpoint (currently failing)
# ============================================
echo -e "\n=== Step 3: Test /api/urls ==="
curl -v -X POST https://dashdig-backend-production.up.railway.app/api/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com"}' 2>&1 | grep -E "(HTTP|error|Authentication)"

# ============================================
# Step 4: Check if Railway is stripping headers
# ============================================
echo -e "\n=== Step 4: Test with explicit headers ==="
curl -X POST https://dashdig-backend-production.up.railway.app/api/urls \
  -H "Content-Type: application/json" \
  -H "X-Test: railway-debug" \
  -d '{"url": "https://www.example.com"}'

# ============================================
# Step 5: Check Railway logs for these requests
# ============================================
echo -e "\n=== Step 5: After running above, check Railway logs ==="
echo "Run: railway logs | tail -20"
