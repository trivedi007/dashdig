#!/bin/bash
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig/frontend

echo "=== Finding all 'Please sign in' alerts ==="
grep -r "Please sign in" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.vercel

echo -e "\n=== Finding localStorage.getItem('token') checks ==="
grep -r "localStorage.getItem.*token" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.vercel

echo -e "\n=== Finding isAuthenticated checks ==="
grep -r "isAuthenticated" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.vercel

echo -e "\n=== Files that need to be checked ==="
echo "Look for these patterns in the above files and remove them:"
echo "1. alert('Please sign in to create URLs')"
echo "2. if (!token) { alert(...); return; }"
echo "3. if (!isAuthenticated) { ... }"
