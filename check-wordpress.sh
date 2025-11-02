#!/bin/bash

echo "🔍 Checking for WordPress installations..."
echo ""

# Check MAMP
if [ -d "/Applications/MAMP" ]; then
    echo "✅ MAMP is installed"
    if [ -d "/Applications/MAMP/htdocs/wordpress" ]; then
        echo "   ✅ WordPress found at: /Applications/MAMP/htdocs/wordpress"
    else
        echo "   ❌ No WordPress in MAMP htdocs"
    fi
else
    echo "❌ MAMP not installed"
fi

echo ""

# Check Local by Flywheel
if [ -d "$HOME/Local Sites" ]; then
    echo "✅ Local by Flywheel is installed"
    echo "   WordPress sites:"
    ls -1 "$HOME/Local Sites/"
else
    echo "❌ Local by Flywheel not installed"
fi

echo ""

# Search for wp-config.php
echo "🔍 Searching for WordPress installations..."
find ~ -name "wp-config.php" -maxdepth 5 2>/dev/null | while read path; do
    echo "   ✅ Found WordPress at: $(dirname "$path")"
done

echo ""

# Check running web servers
if lsof -i :80 &>/dev/null; then
    echo "✅ Web server running on port 80"
fi

if lsof -i :8888 &>/dev/null; then
    echo "✅ Web server running on port 8888 (likely MAMP)"
fi
