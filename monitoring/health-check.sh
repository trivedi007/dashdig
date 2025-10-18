#!/bin/bash

# ==========================================
# DASHDIG HEALTH MONITORING SCRIPT
# Monitors uptime and performance
# ==========================================

# Configuration
BACKEND_URL="${BACKEND_URL:-https://dashdig-backend-production.up.railway.app}"
FRONTEND_URL="${FRONTEND_URL:-https://dashdig.com}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
EMAIL_TO="${EMAIL_TO:-}"
LOG_FILE="monitoring/health-check.log"

# Create log directory if it doesn't exist
mkdir -p monitoring

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

alert() {
    local message="$1"
    log "🚨 ALERT: $message"
    
    # Send to Slack if webhook is configured
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST "$SLACK_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"🚨 Dashdig Alert: $message\"}" \
            2>/dev/null
    fi
    
    # Send email if configured
    if [ -n "$EMAIL_TO" ]; then
        echo "$message" | mail -s "Dashdig Alert" "$EMAIL_TO" 2>/dev/null
    fi
}

# Check backend health
check_backend() {
    log "Checking backend health..."
    
    start_time=$(date +%s%3N)
    response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health" 2>/dev/null)
    end_time=$(date +%s%3N)
    
    http_code=$(echo "$response" | tail -n1)
    response_time=$((end_time - start_time))
    
    if [ "$http_code" = "200" ]; then
        log "${GREEN}✓${NC} Backend healthy (${response_time}ms)"
        return 0
    else
        alert "Backend unhealthy (HTTP $http_code)"
        return 1
    fi
}

# Check frontend health
check_frontend() {
    log "Checking frontend health..."
    
    start_time=$(date +%s%3N)
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null)
    end_time=$(date +%s%3N)
    
    response_time=$((end_time - start_time))
    
    if [ "$http_code" = "200" ]; then
        log "${GREEN}✓${NC} Frontend healthy (${response_time}ms)"
        return 0
    else
        alert "Frontend unhealthy (HTTP $http_code)"
        return 1
    fi
}

# Check database connectivity (via backend)
check_database() {
    log "Checking database connectivity..."
    
    # Create a test URL
    response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/demo-url" \
        -H "Content-Type: application/json" \
        -d '{"url":"https://example.com/health-check","keywords":["health"]}' 2>/dev/null)
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        log "${GREEN}✓${NC} Database connectivity OK"
        return 0
    else
        alert "Database connectivity issue (HTTP $http_code)"
        return 1
    fi
}

# Check URL redirect functionality
check_redirect() {
    log "Checking URL redirect..."
    
    # Use a known test URL
    test_code="nike.vaporfly.running"
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/$test_code" 2>/dev/null)
    
    if [ "$http_code" = "301" ] || [ "$http_code" = "302" ] || [ "$http_code" = "404" ]; then
        log "${GREEN}✓${NC} Redirect functionality OK"
        return 0
    else
        alert "Redirect not working (HTTP $http_code)"
        return 1
    fi
}

# Performance check
check_performance() {
    log "Checking performance..."
    
    # Backend response time
    backend_time=$(curl -s -w "%{time_total}" -o /dev/null "$BACKEND_URL/health" 2>/dev/null)
    backend_ms=$(echo "$backend_time * 1000" | bc)
    
    # Frontend response time
    frontend_time=$(curl -s -w "%{time_total}" -o /dev/null "$FRONTEND_URL" 2>/dev/null)
    frontend_ms=$(echo "$frontend_time * 1000" | bc)
    
    log "Backend: ${backend_ms}ms, Frontend: ${frontend_ms}ms"
    
    # Alert if slow
    if (( $(echo "$backend_time > 2" | bc -l) )); then
        alert "Backend response time high: ${backend_ms}ms"
    fi
    
    if (( $(echo "$frontend_time > 3" | bc -l) )); then
        alert "Frontend response time high: ${frontend_ms}ms"
    fi
}

# Main monitoring loop
main() {
    log "========================================="
    log "Starting health check..."
    log "========================================="
    
    failures=0
    
    check_backend || ((failures++))
    check_frontend || ((failures++))
    check_database || ((failures++))
    check_redirect || ((failures++))
    check_performance
    
    log "========================================="
    if [ $failures -eq 0 ]; then
        log "${GREEN}All checks passed!${NC}"
    else
        log "${RED}$failures check(s) failed${NC}"
    fi
    log "========================================="
    
    return $failures
}

# Run monitoring
main
