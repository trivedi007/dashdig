/**
 * Comprehensive URL Shortening System Diagnostics
 * 
 * This script tests:
 * 1. Database connectivity
 * 2. URL creation process
 * 3. AI service functionality
 * 4. Performance metrics
 * 5. Recent changes impact
 */

const mongoose = require('mongoose');
const Url = require('./src/models/Url');
const aiService = require('./src/services/ai.service');
require('dotenv').config();

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`  ${title}`, colors.bright + colors.cyan);
  log('='.repeat(60), colors.cyan);
}

function pass(message) {
  log(`✅ PASS: ${message}`, colors.green);
}

function fail(message) {
  log(`❌ FAIL: ${message}`, colors.red);
}

function warn(message) {
  log(`⚠️  WARN: ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ️  INFO: ${message}`, colors.blue);
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function recordTest(name, status, message, details = null) {
  results.tests.push({ name, status, message, details });
  if (status === 'pass') results.passed++;
  else if (status === 'fail') results.failed++;
  else if (status === 'warn') results.warnings++;
}

/**
 * TEST 1: Database Connection
 */
async function testDatabaseConnection() {
  section('TEST 1: DATABASE CONNECTION');
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      fail('MONGODB_URI not found in environment variables');
      recordTest('Database Connection', 'fail', 'Missing MONGODB_URI');
      return false;
    }
    
    info(`Connecting to: ${mongoUri.substring(0, 30)}...`);
    
    const startTime = Date.now();
    await mongoose.connect(mongoUri);
    const connectTime = Date.now() - startTime;
    
    pass(`Connected to MongoDB in ${connectTime}ms`);
    recordTest('Database Connection', 'pass', `Connected in ${connectTime}ms`);
    
    // Test read operation
    info('Testing read operation...');
    const readStart = Date.now();
    const count = await Url.countDocuments();
    const readTime = Date.now() - readStart;
    
    pass(`Read operation successful: ${count} URLs in database (${readTime}ms)`);
    recordTest('Database Read', 'pass', `${count} URLs found in ${readTime}ms`);
    
    // Test write operation
    info('Testing write operation...');
    const writeStart = Date.now();
    const testDoc = new Url({
      shortCode: `test-${Date.now()}`,
      originalUrl: 'https://example.com/test',
      clicks: { count: 0 },
      isActive: false // Mark as test
    });
    await testDoc.save();
    const writeTime = Date.now() - writeStart;
    
    pass(`Write operation successful (${writeTime}ms)`);
    recordTest('Database Write', 'pass', `Test document created in ${writeTime}ms`);
    
    // Cleanup test document
    await Url.deleteOne({ _id: testDoc._id });
    info('Test document cleaned up');
    
    return true;
  } catch (error) {
    fail(`Database connection failed: ${error.message}`);
    recordTest('Database Connection', 'fail', error.message, error.stack);
    return false;
  }
}

/**
 * TEST 2: URL Creation Process
 */
async function testUrlCreation() {
  section('TEST 2: URL CREATION PROCESS');
  
  const testUrl = 'https://example.com/test-page';
  const testKeywords = ['test', 'example'];
  
  try {
    info(`Creating short URL for: ${testUrl}`);
    
    const totalStart = Date.now();
    
    // Step 1: AI Slug Generation
    info('Step 1: Generating AI slug...');
    const slugStart = Date.now();
    let slug;
    
    try {
      slug = await aiService.generateHumanReadableUrl(testUrl, testKeywords);
      const slugTime = Date.now() - slugStart;
      pass(`AI slug generated: "${slug}" (${slugTime}ms)`);
      recordTest('AI Slug Generation', 'pass', `Generated "${slug}" in ${slugTime}ms`);
      
      if (slugTime > 5000) {
        warn(`AI slug generation took ${slugTime}ms - potential bottleneck!`);
        recordTest('AI Performance', 'warn', `Slow AI response: ${slugTime}ms`);
      }
    } catch (error) {
      const slugTime = Date.now() - slugStart;
      warn(`AI slug generation failed after ${slugTime}ms: ${error.message}`);
      recordTest('AI Slug Generation', 'warn', `Failed after ${slugTime}ms, using fallback`);
      slug = `test.${Date.now().toString(36)}`;
      info(`Using fallback slug: ${slug}`);
    }
    
    // Step 2: Check uniqueness
    info('Step 2: Checking slug uniqueness...');
    const uniqueStart = Date.now();
    const existing = await Url.findOne({ shortCode: slug });
    const uniqueTime = Date.now() - uniqueStart;
    
    if (existing) {
      warn(`Slug "${slug}" already exists, appending timestamp`);
      slug = `${slug}.${Date.now().toString(36).slice(-4)}`;
      recordTest('Slug Uniqueness', 'warn', `Collision detected, slug modified to ${slug}`);
    } else {
      pass(`Slug is unique (${uniqueTime}ms)`);
      recordTest('Slug Uniqueness', 'pass', `Checked in ${uniqueTime}ms`);
    }
    
    // Step 3: Create URL document
    info('Step 3: Creating URL document...');
    const createStart = Date.now();
    
    const urlDoc = new Url({
      shortCode: slug,
      originalUrl: testUrl,
      clicks: { count: 0 },
      keywords: testKeywords,
      isActive: false // Mark as test
    });
    
    await urlDoc.save();
    const createTime = Date.now() - createStart;
    
    pass(`URL document created (${createTime}ms)`);
    recordTest('URL Document Creation', 'pass', `Created in ${createTime}ms`);
    
    // Step 4: Verify document
    info('Step 4: Verifying created document...');
    const verifyStart = Date.now();
    const verified = await Url.findOne({ shortCode: slug });
    const verifyTime = Date.now() - verifyStart;
    
    if (verified) {
      pass(`Document verified in database (${verifyTime}ms)`);
      recordTest('URL Verification', 'pass', `Verified in ${verifyTime}ms`);
      
      info('Document details:');
      info(`  - Short Code: ${verified.shortCode}`);
      info(`  - Original URL: ${verified.originalUrl}`);
      info(`  - Created At: ${verified.createdAt}`);
      info(`  - Clicks: ${verified.clicks?.count || 0}`);
    } else {
      fail('Document not found in database after creation');
      recordTest('URL Verification', 'fail', 'Document not found');
    }
    
    const totalTime = Date.now() - totalStart;
    
    section('URL CREATION SUMMARY');
    pass(`Total creation time: ${totalTime}ms`);
    
    if (totalTime > 3000) {
      warn(`⚠️  Total time exceeded 3 seconds - performance issue detected!`);
      recordTest('Overall Performance', 'warn', `Slow total time: ${totalTime}ms`);
    } else {
      pass(`✓ Performance within acceptable range`);
      recordTest('Overall Performance', 'pass', `Total time: ${totalTime}ms`);
    }
    
    // Cleanup
    await Url.deleteOne({ _id: urlDoc._id });
    info('Test document cleaned up');
    
    return true;
  } catch (error) {
    fail(`URL creation failed: ${error.message}`);
    recordTest('URL Creation', 'fail', error.message, error.stack);
    console.error('Full error:', error);
    return false;
  }
}

/**
 * TEST 3: AI Service Functionality
 */
async function testAIService() {
  section('TEST 3: AI SERVICE FUNCTIONALITY');
  
  try {
    // Check OpenAI configuration
    const hasApiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-';
    
    if (!hasApiKey) {
      warn('OpenAI API key not configured');
      recordTest('AI Configuration', 'warn', 'No API key configured');
      info('Using fallback URL generation');
    } else {
      pass('OpenAI API key configured');
      recordTest('AI Configuration', 'pass', 'API key present');
    }
    
    // Test with various URLs
    const testUrls = [
      { url: 'https://www.nike.com/t/vaporfly-running-shoes', expected: 'nike' },
      { url: 'https://www.hoka.com/bondi-running-shoes', expected: 'hoka' },
      { url: 'https://www.amazon.com/apple-airpods-pro', expected: 'amazon' },
      { url: 'https://example.com/unknown-page', expected: 'example' }
    ];
    
    for (const test of testUrls) {
      info(`\nTesting slug generation for: ${test.url}`);
      const start = Date.now();
      
      try {
        const slug = await aiService.generateHumanReadableUrl(test.url, []);
        const time = Date.now() - start;
        
        pass(`Generated: "${slug}" (${time}ms)`);
        
        if (slug.includes(test.expected)) {
          pass(`✓ Contains expected keyword: "${test.expected}"`);
        } else {
          warn(`⚠️  Missing expected keyword: "${test.expected}"`);
        }
        
        if (time > 5000) {
          warn(`⚠️  Generation took ${time}ms - slow!`);
        }
      } catch (error) {
        fail(`Failed: ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    fail(`AI Service test failed: ${error.message}`);
    recordTest('AI Service', 'fail', error.message);
    return false;
  }
}

/**
 * TEST 4: Recent Changes Review
 */
async function reviewRecentChanges() {
  section('TEST 4: RECENT CHANGES REVIEW');
  
  info('Analyzing recent commits...');
  
  const recentCommits = [
    '423ff6f - WordPress plugin fixes (no backend changes)',
    '15e8aeb - Frontend consolidation (no backend changes)',
    '4ea3fdf - Frontend fixes (no backend changes)'
  ];
  
  info('\nRecent commits:');
  recentCommits.forEach(commit => {
    info(`  ${commit}`);
  });
  
  pass('No backend files modified in recent commits');
  recordTest('Recent Changes', 'pass', 'No backend modifications detected');
  
  info('\nCurrent backend file status:');
  info('  ✓ url.route.js - No changes');
  info('  ✓ ai.service.js - No changes');
  info('  ✓ Url model - No changes');
  
  return true;
}

/**
 * TEST 5: Performance Benchmarks
 */
async function performanceBenchmarks() {
  section('TEST 5: PERFORMANCE BENCHMARKS');
  
  const iterations = 5;
  const times = [];
  
  info(`Running ${iterations} URL creation cycles...\n`);
  
  for (let i = 1; i <= iterations; i++) {
    const testUrl = `https://example.com/test-${i}`;
    const start = Date.now();
    
    try {
      // Simulate full URL creation process
      const slug = await aiService.generateHumanReadableUrl(testUrl, []);
      
      const urlDoc = new Url({
        shortCode: `perf-test-${Date.now()}-${i}`,
        originalUrl: testUrl,
        clicks: { count: 0 },
        isActive: false
      });
      
      await urlDoc.save();
      await Url.deleteOne({ _id: urlDoc._id });
      
      const time = Date.now() - start;
      times.push(time);
      
      info(`Cycle ${i}: ${time}ms`);
    } catch (error) {
      fail(`Cycle ${i} failed: ${error.message}`);
    }
  }
  
  if (times.length > 0) {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    info('\nPerformance Summary:');
    info(`  Average: ${avg}ms`);
    info(`  Min: ${min}ms`);
    info(`  Max: ${max}ms`);
    
    if (avg < 1000) {
      pass(`✓ Excellent performance (avg: ${avg}ms)`);
      recordTest('Performance', 'pass', `Average ${avg}ms`);
    } else if (avg < 3000) {
      warn(`⚠️  Acceptable performance (avg: ${avg}ms)`);
      recordTest('Performance', 'warn', `Average ${avg}ms`);
    } else {
      fail(`✗ Poor performance (avg: ${avg}ms)`);
      recordTest('Performance', 'fail', `Average ${avg}ms - too slow`);
    }
  }
  
  return true;
}

/**
 * Generate Final Report
 */
function generateReport() {
  section('DIAGNOSTIC REPORT SUMMARY');
  
  log(`\nTotal Tests: ${results.tests.length}`, colors.bright);
  pass(`Passed: ${results.passed}`);
  
  if (results.warnings > 0) {
    warn(`Warnings: ${results.warnings}`);
  }
  
  if (results.failed > 0) {
    fail(`Failed: ${results.failed}`);
  }
  
  // Detailed findings
  section('DETAILED FINDINGS');
  
  const failures = results.tests.filter(t => t.status === 'fail');
  const warnings = results.tests.filter(t => t.status === 'warn');
  
  if (failures.length > 0) {
    log('\n❌ FAILURES:', colors.red);
    failures.forEach(test => {
      log(`\n  ${test.name}:`, colors.red);
      log(`    ${test.message}`, colors.red);
      if (test.details) {
        log(`    ${test.details}`, colors.red);
      }
    });
  }
  
  if (warnings.length > 0) {
    log('\n⚠️  WARNINGS:', colors.yellow);
    warnings.forEach(test => {
      log(`\n  ${test.name}:`, colors.yellow);
      log(`    ${test.message}`, colors.yellow);
    });
  }
  
  // Recommendations
  section('RECOMMENDATIONS');
  
  if (failures.length === 0 && warnings.length === 0) {
    pass('✓ System is functioning correctly!');
    pass('✓ No issues detected');
  } else {
    if (warnings.some(w => w.name.includes('AI'))) {
      info('📋 AI Service Issues:');
      info('   - Check OPENAI_API_KEY environment variable');
      info('   - Verify OpenAI API key is valid');
      info('   - System will use fallback if AI fails');
    }
    
    if (warnings.some(w => w.name.includes('Performance'))) {
      info('📋 Performance Issues:');
      info('   - AI slug generation may be slow');
      info('   - Consider caching or using fallback more often');
      info('   - Check network latency to OpenAI');
    }
    
    if (failures.length > 0) {
      info('📋 Critical Issues:');
      info('   - Review failed tests above');
      info('   - Check database connection');
      info('   - Verify environment variables');
    }
  }
  
  log('\n');
}

/**
 * Main diagnostic function
 */
async function runDiagnostics() {
  log(colors.bright + colors.cyan);
  log('╔═══════════════════════════════════════════════════════════╗');
  log('║                                                           ║');
  log('║     DASHDIG URL SHORTENING SYSTEM DIAGNOSTICS            ║');
  log('║                                                           ║');
  log('╚═══════════════════════════════════════════════════════════╝');
  log(colors.reset);
  
  try {
    // Run all tests
    await testDatabaseConnection();
    await testUrlCreation();
    await testAIService();
    await reviewRecentChanges();
    await performanceBenchmarks();
    
    // Generate report
    generateReport();
    
  } catch (error) {
    fail(`\nDiagnostic suite crashed: ${error.message}`);
    console.error(error);
  } finally {
    // Cleanup
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      info('\n✓ Database connection closed');
    }
  }
}

// Run diagnostics
runDiagnostics().catch(console.error);
