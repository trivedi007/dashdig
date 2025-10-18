#!/bin/bash

# ==========================================
# DASHDIG END-TO-END TEST SUITE
# Tests the complete flow from creation to redirect
# ==========================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="${BACKEND_URL:-https://dashdig-backend-production.up.railway.app}"
FRONTEND_URL="${FRONTEND_URL:-https://dashdig.com}"
LOCAL_BACKEND="${LOCAL_BACKEND:-http://localhost:5001}"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((PASSED_TESTS++))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    ((FAILED_TESTS++))
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

test_header() {
    ((TOTAL_TESTS++))
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}TEST $TOTAL_TESTS: $1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Test 1: Backend Health Check
test_backend_health() {
    test_header "Backend Health Check"
    
    response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        log_success "Backend is healthy (HTTP 200)"
        echo "Response: $body"
    else
        log_error "Backend health check failed (HTTP $http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Test 2: Create Demo URL
test_create_demo_url() {
    test_header "Create Demo URL"
    
    TEST_URL="https://www.target.com/p/test-product-$(date +%s)"
    
    log_info "Creating short URL for: $TEST_URL"
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/demo-url" \
        -H "Content-Type: application/json" \
        -d "{\"url\":\"$TEST_URL\",\"keywords\":[\"target\",\"test\",\"product\"]}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        # Extract shortCode from JSON response
        SHORT_CODE=$(echo "$body" | grep -o '"shortCode":"[^"]*' | cut -d'"' -f4)
        
        if [ -n "$SHORT_CODE" ]; then
            log_success "URL created successfully"
            echo "Short Code: $SHORT_CODE"
            echo "Full Response: $body"
            
            # Export for next test
            export CREATED_SHORT_CODE="$SHORT_CODE"
            export CREATED_ORIGINAL_URL="$TEST_URL"
        else
            log_error "Short code not found in response"
            echo "Response: $body"
            return 1
        fi
    else
        log_error "URL creation failed (HTTP $http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Test 3: Verify URL in Database
test_verify_database() {
    test_header "Verify URL in Database"
    
    if [ -z "$CREATED_SHORT_CODE" ]; then
        log_warning "Skipping: No short code from previous test"
        return 0
    fi
    
    log_info "Checking if URL exists in database: $CREATED_SHORT_CODE"
    
    # This would require database access or API endpoint
    # For now, we'll test the redirect instead
    log_info "Database verification via redirect test (next test)"
}

# Test 4: Test URL Redirect
test_url_redirect() {
    test_header "URL Redirect"
    
    if [ -z "$CREATED_SHORT_CODE" ]; then
        log_warning "Skipping: No short code from previous test"
        return 0
    fi
    
    log_info "Testing redirect: $BACKEND_URL/$CREATED_SHORT_CODE"
    
    # Follow redirects and capture final URL
    final_url=$(curl -Ls -o /dev/null -w "%{url_effective}" "$BACKEND_URL/$CREATED_SHORT_CODE")
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/$CREATED_SHORT_CODE")
    
    if [ "$http_code" = "301" ] || [ "$http_code" = "302" ]; then
        if [[ "$final_url" == "$CREATED_ORIGINAL_URL"* ]]; then
            log_success "Redirect works correctly (HTTP $http_code)"
            echo "Original: $CREATED_ORIGINAL_URL"
            echo "Final: $final_url"
        else
            log_error "Redirect destination incorrect"
            echo "Expected: $CREATED_ORIGINAL_URL"
            echo "Got: $final_url"
            return 1
        fi
    else
        log_error "Redirect failed (HTTP $http_code)"
        return 1
    fi
}

# Test 5: Frontend Health
test_frontend_health() {
    test_header "Frontend Health"
    
    log_info "Checking if frontend is accessible"
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
    
    if [ "$http_code" = "200" ]; then
        log_success "Frontend is accessible (HTTP 200)"
    else
        log_error "Frontend not accessible (HTTP $http_code)"
        return 1
    fi
}

# Test 6: Frontend Middleware Rewrite
test_frontend_middleware() {
    test_header "Frontend Middleware Rewrite"
    
    if [ -z "$CREATED_SHORT_CODE" ]; then
        log_warning "Skipping: No short code from previous test"
        return 0
    fi
    
    log_info "Testing frontend middleware: $FRONTEND_URL/$CREATED_SHORT_CODE"
    
    # Check if URL shows backend domain (bad) or stays on dashdig.com (good)
    response_headers=$(curl -sI "$FRONTEND_URL/$CREATED_SHORT_CODE")
    
    if echo "$response_headers" | grep -q "Location:"; then
        location=$(echo "$response_headers" | grep "Location:" | cut -d' ' -f2 | tr -d '\r')
        
        if [[ "$location" == "https://dashdig-backend-production"* ]]; then
            log_error "Frontend showing backend URL (middleware issue)"
            echo "Location: $location"
            return 1
        else
            log_success "Middleware working correctly"
            echo "Redirects to: $location"
        fi
    else
        log_info "No redirect header (might be rewrite working correctly)"
    fi
}

# Test 7: Rate Limiting
test_rate_limiting() {
    test_header "Rate Limiting"
    
    log_info "Testing rate limiting (15 requests)"
    
    for i in {1..15}; do
        http_code=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
        if [ "$http_code" = "429" ]; then
            log_success "Rate limiting is working (got 429 after $i requests)"
            return 0
        fi
        sleep 0.1
    done
    
    log_info "Rate limiting not triggered (might need more requests)"
}

# Test 8: Error Handling
test_error_handling() {
    test_header "Error Handling"
    
    log_info "Testing non-existent URL"
    
    response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/this-does-not-exist-$(date +%s)")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "404" ]; then
        log_success "404 handling works correctly"
    else
        log_error "Unexpected response for non-existent URL (HTTP $http_code)"
        return 1
    fi
}

# Test 9: Schema Validation (null userId)
test_schema_validation() {
    test_header "Schema Validation (null userId)"
    
    log_info "Testing demo URL creation with null userId"
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/demo-url" \
        -H "Content-Type: application/json" \
        -d '{"url":"https://example.com/schema-test","keywords":["test"]}')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        if echo "$body" | grep -q '"success":true'; then
            log_success "Schema accepts null userId"
        else
            log_error "Schema validation issue"
            echo "Response: $body"
            return 1
        fi
    else
        log_error "Demo URL creation failed (HTTP $http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Main test execution
main() {
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║   DASHDIG END-TO-END TEST SUITE       ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    echo "Backend URL: $BACKEND_URL"
    echo "Frontend URL: $FRONTEND_URL"
    echo ""
    
    # Run all tests
    test_backend_health || true
    test_create_demo_url || true
    test_verify_database || true
    test_url_redirect || true
    test_frontend_health || true
    test_frontend_middleware || true
    test_rate_limiting || true
    test_error_handling || true
    test_schema_validation || true
    
    # Summary
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║          TEST SUMMARY                  ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    echo -e "Total Tests:   $TOTAL_TESTS"
    echo -e "${GREEN}Passed:        $PASSED_TESTS${NC}"
    echo -e "${RED}Failed:        $FAILED_TESTS${NC}"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
        exit 0
    else
        echo -e "${RED}✗ SOME TESTS FAILED${NC}"
        exit 1
    fi
}

# Run tests
main
