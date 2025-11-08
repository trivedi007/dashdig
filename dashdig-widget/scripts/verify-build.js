#!/usr/bin/env node

/**
 * Build Verification Script
 * Verifies production build meets all requirements
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2);
}

// Size limits (in KB)
const SIZE_LIMITS = {
  'dashdig.min.js': {
    minified: 30,
    gzipped: 10,
  },
  'dashdig-react.min.js': {
    minified: 30,
    gzipped: 10,
  },
  'dashdig-angular.min.js': {
    minified: 30,
    gzipped: 10,
  },
};

function checkFileSize(filePath, limits) {
  if (!fs.existsSync(filePath)) {
    log(`  ❌ File not found: ${path.basename(filePath)}`, 'red');
    return false;
  }

  const content = fs.readFileSync(filePath);
  const minifiedSize = content.length;
  const gzippedSize = zlib.gzipSync(content).length;
  const brotliSize = zlib.brotliCompressSync(content).length;

  const minifiedKB = formatBytes(minifiedSize);
  const gzippedKB = formatBytes(gzippedSize);
  const brotliKB = formatBytes(brotliSize);

  const fileName = path.basename(filePath);
  log(`\n📦 ${fileName}:`, 'blue');
  
  // Check minified size
  const minifiedPass = minifiedSize / 1024 < limits.minified;
  const minifiedPercent = ((minifiedSize / 1024 / limits.minified) * 100).toFixed(0);
  log(
    `  Minified: ${minifiedKB} KB ${minifiedPass ? '✅' : '❌'} (${minifiedPercent}% of ${limits.minified} KB limit)`,
    minifiedPass ? 'green' : 'red'
  );

  // Check gzipped size
  const gzippedPass = gzippedSize / 1024 < limits.gzipped;
  const gzippedPercent = ((gzippedSize / 1024 / limits.gzipped) * 100).toFixed(0);
  log(
    `  Gzipped:  ${gzippedKB} KB ${gzippedPass ? '✅' : '❌'} (${gzippedPercent}% of ${limits.gzipped} KB limit)`,
    gzippedPass ? 'green' : 'red'
  );

  // Show Brotli size (no limit, just informational)
  log(`  Brotli:   ${brotliKB} KB (${((brotliSize / minifiedSize) * 100).toFixed(0)}% of original)`, 'blue');

  return minifiedPass && gzippedPass;
}

function checkConsoleStatements(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const consoleRegex = /console\.(log|debug|info|warn|error)/g;
  const matches = content.match(consoleRegex);

  if (matches && matches.length > 0) {
    log(`  ❌ Found ${matches.length} console statements`, 'red');
    return false;
  }

  log(`  ✅ No console statements found`, 'green');
  return true;
}

function checkSourceMaps(filePath) {
  const mapPath = `${filePath}.map`;
  if (!fs.existsSync(mapPath)) {
    log(`  ❌ Source map not found: ${path.basename(mapPath)}`, 'red');
    return false;
  }

  log(`  ✅ Source map exists: ${path.basename(mapPath)}`, 'green');
  return true;
}

function checkUMDFormat(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for UMD pattern
  const hasUMD = content.includes('typeof exports') || 
                 content.includes('typeof module') ||
                 content.includes('typeof define') ||
                 content.includes('function(global');

  if (!hasUMD) {
    log(`  ⚠️  Warning: UMD pattern not detected`, 'yellow');
    return false;
  }

  log(`  ✅ UMD format detected`, 'green');
  return true;
}

function verifyBuild() {
  log('\n🔍 DashDig Widget - Build Verification', 'bold');
  log('=====================================\n', 'bold');

  const distDir = path.join(__dirname, '../dist');
  let allPassed = true;

  // Check each main bundle
  for (const [fileName, limits] of Object.entries(SIZE_LIMITS)) {
    const filePath = path.join(distDir, fileName);

    // 1. Check file size
    log(`\n📊 Checking ${fileName}...`, 'bold');
    const sizePass = checkFileSize(filePath, limits);
    allPassed = allPassed && sizePass;

    // 2. Check console statements
    log(`\n🔍 Checking for console statements...`);
    const consolePass = checkConsoleStatements(filePath);
    allPassed = allPassed && consolePass;

    // 3. Check source maps
    log(`\n🗺️  Checking source maps...`);
    const mapPass = checkSourceMaps(filePath);
    allPassed = allPassed && mapPass;

    // 4. Check UMD format
    log(`\n📦 Checking bundle format...`);
    const umdPass = checkUMDFormat(filePath);
    allPassed = allPassed && umdPass;

    log('\n' + '─'.repeat(50));
  }

  // Summary
  log('\n\n📋 VERIFICATION SUMMARY', 'bold');
  log('======================\n', 'bold');

  if (allPassed) {
    log('✅ ALL CHECKS PASSED!', 'green');
    log('\nYour build is ready for production deployment! 🚀\n', 'green');
    process.exit(0);
  } else {
    log('❌ SOME CHECKS FAILED!', 'red');
    log('\nPlease fix the issues above before deploying.\n', 'red');
    process.exit(1);
  }
}

// Run verification
try {
  verifyBuild();
} catch (error) {
  log(`\n❌ Verification failed: ${error.message}`, 'red');
  process.exit(1);
}
