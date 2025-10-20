#!/bin/bash

# Test script to verify static files are served correctly
# and not caught by the short link redirect route

echo "🧪 Testing Static File Routing Fix"
echo "===================================="
echo ""

BASE_URL="${1:-http://localhost:3000}"

echo "Testing against: $BASE_URL"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
pass_count=0
fail_count=0

# Function to test a URL
test_url() {
  local url=$1
  local expected_type=$2
  local description=$3
  
  test_count=$((test_count + 1))
  
  echo -n "[$test_count] Testing: $description ... "
  
  # Make request and capture status code and content type
  response=$(curl -s -o /dev/null -w "%{http_code}|%{content_type}" "$url" 2>&1)
  status_code=$(echo "$response" | cut -d'|' -f1)
  content_type=$(echo "$response" | cut -d'|' -f2)
  
  # Check if status is 200 and content type matches
  if [ "$status_code" = "200" ] && [[ "$content_type" == *"$expected_type"* ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Status: $status_code, Content-Type: $content_type"
    pass_count=$((pass_count + 1))
  else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Expected: 200 with $expected_type"
    echo "   Got: Status $status_code, Content-Type: $content_type"
    fail_count=$((fail_count + 1))
  fi
  echo ""
}

# Test static files
echo "📁 STATIC FILES TESTS:"
echo "----------------------"
test_url "$BASE_URL/favicon.svg" "image/svg" "Favicon SVG"
test_url "$BASE_URL/favicon.ico" "image/x-icon" "Favicon ICO"
test_url "$BASE_URL/favicon.png" "image/png" "Favicon PNG"
test_url "$BASE_URL/apple-touch-icon.png" "image/png" "Apple Touch Icon"

echo ""
echo "🔗 SHORT LINK TESTS (should return 404 or redirect):"
echo "---------------------------------------------------"

# Test a non-existent short link (should return 404, not serve as static file)
echo -n "[$((test_count + 1))] Testing: Non-existent short link ... "
test_count=$((test_count + 1))

response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/nonexistent-link" 2>&1)
if [ "$response" = "404" ] || [ "$response" = "301" ] || [ "$response" = "302" ] || [ "$response" = "307" ]; then
  echo -e "${GREEN}✅ PASS${NC}"
  echo "   Status: $response (correct behavior)"
  pass_count=$((pass_count + 1))
else
  echo -e "${RED}❌ FAIL${NC}"
  echo "   Expected: 404, 301, 302, or 307"
  echo "   Got: $response"
  fail_count=$((fail_count + 1))
fi
echo ""

# Summary
echo "=========================================="
echo "📊 TEST SUMMARY"
echo "=========================================="
echo "Total Tests: $test_count"
echo -e "Passed: ${GREEN}$pass_count${NC}"
echo -e "Failed: ${RED}$fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please review.${NC}"
  exit 1
fi

