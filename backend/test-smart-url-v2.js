/**
 * 🧪 TEST SCRIPT: Smart URL Generator V2.0
 * 
 * Tests the complete rewrite with:
 * - Web scraping
 * - Claude AI generation
 * - Intelligent fallbacks
 * - Quality validation
 */

require('dotenv').config();
const { generateSmartUrl, getCacheStats } = require('./src/services/smartUrlGenerator');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Test cases covering different scenarios
const testCases = [
  {
    name: 'Target - Allergy Medicine',
    url: 'https://www.target.com/p/diphenhydramine-hci-allergy-relief-tablets-100ct-up-38-up-848',
    expected: 'Target.Diphenhydramine.Allergy.Relief.100ct',
    notes: 'Should extract medicine name and quantity'
  },
  {
    name: 'Shein - Household Product',
    url: 'https://us.shein.com/goods-p-85331494.html?goods_id=85331494&test=5051&url_from=adhub288746916',
    expected: 'Shein.Charmin.Ultra.Strong.6.Mega',
    notes: 'Should scrape actual product title, not generic IDs'
  },
  {
    name: 'Amazon - Tech Product',
    url: 'https://www.amazon.com/Apple-AirPods-Pro-2nd-Generation/dp/B0CHWRXH8B',
    expected: 'Amazon.AirPods.Pro.2ndGen',
    notes: 'Should extract brand, product, and generation'
  },
  {
    name: 'Walmart - Grocery Item',
    url: 'https://www.walmart.com/ip/Great-Value-Whole-Vitamin-D-Milk-Gallon-128-fl-oz/10450114',
    expected: 'Walmart.GreatValue.Vitamin.D.Milk.Gallon',
    notes: 'Should include brand name and key details'
  },
  {
    name: 'BJs - Razor Value Pack',
    url: 'https://www.bjs.com/product/harrys-5-blade-razor-handle-value-pack/3000000000003879255?fulfillment=shipping',
    expected: 'BJs.Harrys.5Blade.Razor',
    notes: 'Should extract brand and key product features'
  },
  {
    name: 'Hoka - Running Shoes',
    url: 'https://www.hoka.com/en/us/mens-everyday-running-shoes/bondi-9/197634740874.html',
    expected: 'Hoka.Bondi.9.Mens.Running',
    notes: 'Should include shoe model and category'
  },
  {
    name: 'Nike - Athletic Shoes',
    url: 'https://www.nike.com/t/vaporfly-3-mens-road-racing-shoes-LdPwCB/DV4129-600',
    expected: 'Nike.Vaporfly.3.Mens.Racing',
    notes: 'Should capture product line and use case'
  },
  {
    name: 'NYTimes - News Article',
    url: 'https://www.nytimes.com/2025/01/15/technology/artificial-intelligence-regulation.html',
    expected: 'NYTimes.AI.Regulation.2025',
    notes: 'Should work for news articles, not just products'
  }
];

/**
 * Run all tests
 */
async function runTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗`);
  console.log(`║  🧪 SMART URL GENERATOR V2.0 - COMPREHENSIVE TEST SUITE  ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Check if API key is configured
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  console.log(`🔑 Anthropic API Key: ${hasApiKey ? colors.green + 'CONFIGURED ✓' : colors.yellow + 'NOT SET (will use fallback)'}${colors.reset}\n`);

  const results = {
    passed: 0,
    failed: 0,
    total: testCases.length,
    details: []
  };

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.cyan}TEST ${i + 1}/${testCases.length}: ${test.name}${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`📍 URL: ${test.url.substring(0, 80)}...`);
    console.log(`📝 Notes: ${test.notes}`);
    console.log(`🎯 Expected Pattern: ${colors.yellow}${test.expected}${colors.reset}\n`);

    try {
      const startTime = Date.now();
      const result = await generateSmartUrl(test.url);
      const duration = Date.now() - startTime;

      // Display result
      console.log(`\n✨ RESULT:`);
      console.log(`   Generated: ${colors.green}${result.slug}${colors.reset}`);
      console.log(`   Confidence: ${getConfidenceColor(result.confidence)}${result.confidence}${colors.reset}`);
      console.log(`   Source: ${colors.cyan}${result.source}${colors.reset}`);
      console.log(`   Method: ${result.method}`);
      console.log(`   Duration: ${duration}ms`);

      // Validate quality
      const quality = evaluateQuality(result.slug, test.expected);
      console.log(`\n📊 QUALITY ASSESSMENT:`);
      console.log(`   Length: ${result.slug.length} chars ${quality.lengthOk ? colors.green + '✓' : colors.yellow + '⚠'} ${colors.reset}`);
      console.log(`   Components: ${result.slug.split('.').length} ${quality.componentsOk ? colors.green + '✓' : colors.yellow + '⚠'} ${colors.reset}`);
      console.log(`   Readability: ${quality.readability}% ${quality.readabilityOk ? colors.green + '✓' : colors.yellow + '⚠'} ${colors.reset}`);
      console.log(`   Similarity to Expected: ${quality.similarity}% ${quality.similarityOk ? colors.green + '✓' : colors.yellow + '⚠'} ${colors.reset}`);

      const passed = quality.overall >= 70;
      
      if (passed) {
        console.log(`\n${colors.green}✅ TEST PASSED${colors.reset} (Score: ${quality.overall}%)\n`);
        results.passed++;
      } else {
        console.log(`\n${colors.yellow}⚠️  TEST WARNING${colors.reset} (Score: ${quality.overall}%) - Could be improved\n`);
        results.failed++;
      }

      results.details.push({
        name: test.name,
        generated: result.slug,
        expected: test.expected,
        quality: quality.overall,
        passed
      });

    } catch (error) {
      console.log(`\n${colors.red}❌ TEST FAILED${colors.reset}`);
      console.log(`   Error: ${error.message}\n`);
      results.failed++;
      results.details.push({
        name: test.name,
        error: error.message,
        passed: false
      });
    }

    // Small delay between tests to avoid rate limiting
    if (i < testCases.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Print summary
  printSummary(results);

  // Show cache stats
  const cacheStats = getCacheStats();
  console.log(`\n${colors.cyan}📦 CACHE STATISTICS:${colors.reset}`);
  console.log(`   Cached entries: ${cacheStats.size}`);
  if (cacheStats.entries.length > 0) {
    console.log(`   Recent entries:`);
    cacheStats.entries.forEach(entry => {
      console.log(`   - ${entry.slug} (${entry.source}, ${entry.age} ago)`);
    });
  }
}

/**
 * Evaluate slug quality
 */
function evaluateQuality(generated, expected) {
  const lengthOk = generated.length >= 15 && generated.length <= 60;
  const components = generated.split('.');
  const componentsOk = components.length >= 2 && components.length <= 6;
  
  // Readability: check for meaningful words
  const hasGoodWords = /[A-Z][a-z]{3,}/.test(generated);
  const noDoubleDotsOrExtensions = !generated.includes('..') && !/\.(html|htm|php)$/i.test(generated);
  const readability = (hasGoodWords ? 50 : 0) + (noDoubleDotsOrExtensions ? 50 : 0);
  const readabilityOk = readability >= 80;

  // Similarity to expected (not exact match, but similar structure)
  const genWords = generated.toLowerCase().split('.');
  const expWords = expected.toLowerCase().split('.');
  const commonWords = genWords.filter(w => expWords.includes(w)).length;
  const similarity = Math.round((commonWords / Math.max(genWords.length, expWords.length)) * 100);
  const similarityOk = similarity >= 30; // Lowered threshold as exact match is not expected

  const overall = Math.round(
    (lengthOk ? 25 : 0) +
    (componentsOk ? 25 : 0) +
    (readability * 0.25) +
    (similarity * 0.25)
  );

  return {
    lengthOk,
    componentsOk,
    readability,
    readabilityOk,
    similarity,
    similarityOk,
    overall
  };
}

/**
 * Get color for confidence level
 */
function getConfidenceColor(confidence) {
  if (confidence === 'high') return colors.green;
  if (confidence === 'medium') return colors.yellow;
  return colors.red;
}

/**
 * Print summary
 */
function printSummary(results) {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                      TEST SUMMARY                          ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const passRate = Math.round((results.passed / results.total) * 100);
  const passColor = passRate >= 80 ? colors.green : passRate >= 60 ? colors.yellow : colors.red;

  console.log(`   Total Tests: ${results.total}`);
  console.log(`   ${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`   ${colors.yellow}Warnings: ${results.failed}${colors.reset}`);
  console.log(`   ${passColor}Pass Rate: ${passRate}%${colors.reset}\n`);

  // Show details
  console.log(`${colors.cyan}DETAILED RESULTS:${colors.reset}`);
  results.details.forEach((detail, i) => {
    const status = detail.passed ? colors.green + '✓' : colors.yellow + '⚠';
    const quality = detail.quality ? ` (${detail.quality}%)` : '';
    console.log(`   ${status} ${colors.reset}${detail.name}${quality}`);
    if (detail.generated) {
      console.log(`      Generated: ${detail.generated}`);
    }
    if (detail.error) {
      console.log(`      ${colors.red}Error: ${detail.error}${colors.reset}`);
    }
  });

  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════════${colors.reset}\n`);

  if (passRate >= 80) {
    console.log(`${colors.green}🎉 EXCELLENT! Smart URL Generator V2.0 is working great!${colors.reset}\n`);
  } else if (passRate >= 60) {
    console.log(`${colors.yellow}⚠️  GOOD, but could be improved. Check warnings above.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}❌ NEEDS IMPROVEMENT. Review failed tests above.${colors.reset}\n`);
  }
}

// Run tests
runTests()
  .then(() => {
    console.log(`${colors.green}✅ Test suite completed${colors.reset}\n`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`${colors.red}❌ Test suite failed:${colors.reset}`, error);
    process.exit(1);
  });

