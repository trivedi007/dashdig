#!/bin/bash

# WordPress.org Plugin Compliance Verification Script
# For Dashdig Analytics Plugin

echo "🔍 Verifying WordPress.org Compliance for Dashdig Analytics..."
echo "================================================================"
echo ""

PLUGIN_DIR="dashdig-wordpress"
ERRORS=0
WARNINGS=0

# Change to the plugin directory
cd "$(dirname "$0")" || exit 1

# Check if plugin directory exists
if [ ! -d "$PLUGIN_DIR" ]; then
    echo "❌ ERROR: Plugin directory '$PLUGIN_DIR' not found!"
    exit 1
fi

echo "✅ Plugin directory found: $PLUGIN_DIR"
echo ""

# 1. Check function prefixes
echo "1️⃣  Checking function prefixes..."
UNPREFIXED_FUNCTIONS=$(grep -r "^function [^d]" "$PLUGIN_DIR"/*.php "$PLUGIN_DIR"/includes/*.php 2>/dev/null | grep -v "dashdig_" || true)
if [ -n "$UNPREFIXED_FUNCTIONS" ]; then
    echo "❌ FAIL: Found unprefixed functions:"
    echo "$UNPREFIXED_FUNCTIONS"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASS: All functions properly prefixed with 'dashdig_'"
fi
echo ""

# 2. Check class prefixes
echo "2️⃣  Checking class prefixes..."
UNPREFIXED_CLASSES=$(grep -r "^class [^D]" "$PLUGIN_DIR"/*.php "$PLUGIN_DIR"/includes/*.php 2>/dev/null | grep -v "Dashdig_" || true)
if [ -n "$UNPREFIXED_CLASSES" ]; then
    echo "❌ FAIL: Found unprefixed classes:"
    echo "$UNPREFIXED_CLASSES"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASS: All classes properly prefixed with 'Dashdig_'"
fi
echo ""

# 3. Check readme.txt tags
echo "3️⃣  Checking readme.txt tags..."
if [ -f "$PLUGIN_DIR/readme.txt" ]; then
    TAGS=$(grep "^Tags:" "$PLUGIN_DIR/readme.txt" | sed 's/Tags: //')
    TAG_COUNT=$(echo "$TAGS" | tr ',' '\n' | wc -l | tr -d ' ')
    
    if [ "$TAG_COUNT" -eq 5 ]; then
        echo "✅ PASS: Exactly 5 tags found"
        echo "   Tags: $TAGS"
    else
        echo "❌ FAIL: Found $TAG_COUNT tags (must be exactly 5)"
        echo "   Tags: $TAGS"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "❌ FAIL: readme.txt not found!"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. Check for assets folder
echo "4️⃣  Checking for assets folder..."
if [ -d "$PLUGIN_DIR/assets" ]; then
    echo "❌ FAIL: Assets folder found (must be removed)"
    echo "   Assets should be uploaded separately to WordPress.org SVN"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASS: Assets folder not found (correct)"
fi
echo ""

# 5. Check for required files
echo "5️⃣  Checking required files..."
REQUIRED_FILES=(
    "$PLUGIN_DIR/dashdig-analytics.php"
    "$PLUGIN_DIR/readme.txt"
    "$PLUGIN_DIR/includes/class-dashdig-core.php"
    "$PLUGIN_DIR/includes/class-dashdig-admin.php"
    "$PLUGIN_DIR/includes/class-dashdig-api.php"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Found: $(basename "$file")"
    else
        echo "❌ Missing: $(basename "$file")"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# 6. Check constants prefix
echo "6️⃣  Checking constant prefixes..."
UNPREFIXED_CONSTANTS=$(grep -r "^define(" "$PLUGIN_DIR"/*.php 2>/dev/null | grep -v "DASHDIG_" || true)
if [ -n "$UNPREFIXED_CONSTANTS" ]; then
    echo "❌ FAIL: Found unprefixed constants:"
    echo "$UNPREFIXED_CONSTANTS"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASS: All constants properly prefixed with 'DASHDIG_'"
fi
echo ""

# 7. Check for security best practices
echo "7️⃣  Checking security best practices..."

# Check for direct access protection
UNPROTECTED_FILES=$(grep -rL "defined.*WPINC" "$PLUGIN_DIR"/*.php "$PLUGIN_DIR"/includes/*.php 2>/dev/null || true)
if [ -n "$UNPROTECTED_FILES" ]; then
    echo "⚠️  WARNING: Some files may not have direct access protection"
    echo "$UNPROTECTED_FILES"
    WARNINGS=$((WARNINGS + 1))
else
    echo "✅ PASS: All PHP files have direct access protection"
fi
echo ""

# 8. Check text domain
echo "8️⃣  Checking text domain..."
WRONG_TEXT_DOMAIN=$(grep -r "__(" "$PLUGIN_DIR" | grep -v "dashdig-analytics" || true)
if [ -n "$WRONG_TEXT_DOMAIN" ]; then
    echo "⚠️  WARNING: Found potential incorrect text domains"
    WARNINGS=$((WARNINGS + 1))
else
    echo "✅ PASS: Text domain appears correct"
fi
echo ""

# 9. Check for hardcoded paths
echo "9️⃣  Checking for hardcoded paths..."
HARDCODED_PATHS=$(grep -r "/wp-content/" "$PLUGIN_DIR" 2>/dev/null || true)
if [ -n "$HARDCODED_PATHS" ]; then
    echo "⚠️  WARNING: Found potential hardcoded paths:"
    echo "$HARDCODED_PATHS"
    WARNINGS=$((WARNINGS + 1))
else
    echo "✅ PASS: No hardcoded paths found"
fi
echo ""

# 10. Verify main plugin file header
echo "🔟 Checking main plugin file header..."
if grep -q "Plugin Name.*Dashdig Analytics" "$PLUGIN_DIR/dashdig-analytics.php" && \
   grep -q "Version.*1.0.0" "$PLUGIN_DIR/dashdig-analytics.php" && \
   grep -q "License.*GPL" "$PLUGIN_DIR/dashdig-analytics.php"; then
    echo "✅ PASS: Plugin header is properly formatted"
else
    echo "❌ FAIL: Plugin header may be incomplete"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo "================================================================"
echo "📊 VERIFICATION SUMMARY"
echo "================================================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🎉 SUCCESS! All checks passed!"
    echo ""
    echo "Your plugin is ready for WordPress.org submission!"
    echo ""
    echo "Next steps:"
    echo "1. Validate readme.txt at: https://wordpress.org/plugins/developers/readme-validator/"
    echo "2. Create ZIP: zip -r dashdig-analytics.zip $PLUGIN_DIR/ -x '*.git*' '*.DS_Store'"
    echo "3. Submit at: https://wordpress.org/plugins/developers/add/"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  WARNINGS FOUND: $WARNINGS"
    echo ""
    echo "Your plugin passed all critical checks but has $WARNINGS warning(s)."
    echo "Review the warnings above and fix if necessary."
    echo ""
    exit 0
else
    echo "❌ ERRORS FOUND: $ERRORS"
    echo "⚠️  WARNINGS FOUND: $WARNINGS"
    echo ""
    echo "Please fix the errors above before submitting to WordPress.org"
    echo ""
    exit 1
fi




