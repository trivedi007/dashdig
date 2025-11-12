#!/bin/bash

# Manual Test Script for URL Redirects
# Tests that shortened URLs properly redirect regardless of case

echo "🧪 DashDig URL Redirect Manual Test"
echo "====================================="
echo ""

# Get first argument as base URL or use default
BASE_URL="${1:-http://localhost:5001}"

echo "🌐 Testing against: $BASE_URL"
echo ""

# Test with a sample slug (you'll need to replace this with an actual slug from your DB)
TEST_SLUG="Target.Tide.WashingMachine.Cleaner"

echo "📝 Test slug: $TEST_SLUG"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Original case
echo "Test 1: Original mixed case"
echo "URL: $BASE_URL/$TEST_SLUG"
echo ""
echo "Response:"
curl -I "$BASE_URL/$TEST_SLUG" 2>/dev/null | head -n 10
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2: All lowercase
LOWERCASE_SLUG=$(echo "$TEST_SLUG" | tr '[:upper:]' '[:lower:]')
echo "Test 2: All lowercase"
echo "URL: $BASE_URL/$LOWERCASE_SLUG"
echo ""
echo "Response:"
curl -I "$BASE_URL/$LOWERCASE_SLUG" 2>/dev/null | head -n 10
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3: All uppercase
UPPERCASE_SLUG=$(echo "$TEST_SLUG" | tr '[:lower:]' '[:upper:]')
echo "Test 3: All uppercase"
echo "URL: $BASE_URL/$UPPERCASE_SLUG"
echo ""
echo "Response:"
curl -I "$BASE_URL/$UPPERCASE_SLUG" 2>/dev/null | head -n 10
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Test complete!"
echo ""
echo "📋 Expected Results:"
echo "   - All three tests should return HTTP 301 (redirect)"
echo "   - Location header should point to original URL"
echo "   - NO 404 errors"
echo ""
echo "💡 If you see 404 errors:"
echo "   1. Check that '$TEST_SLUG' exists in your database"
echo "   2. Update TEST_SLUG in this script with an actual slug"
echo "   3. Check backend logs for [SLUG LOOKUP] messages"
echo ""






