#!/usr/bin/env node

/**
 * Test Script for Product URL Parser
 * Tests the fix for broken slug generation
 */

const { parseProductUrl } = require('./src/services/productUrlParser');

console.log('🧪 TESTING PRODUCT URL PARSER FIX\n');
console.log('='.repeat(80));

const testCases = [
  {
    name: 'Shein Product (CRITICAL BUG EXAMPLE)',
    url: 'https://us.shein.com/goods-p-85331494.html?goods_id=85331494&test=5051&url_from=adhub288746916',
    expectedPattern: 'Shein.*',
    shouldNotContain: ['..', '.html', 'us.', 'good']
  },
  {
    name: 'Amazon Echo Dot',
    url: 'https://www.amazon.com/dp/B08N5WRWNW',
    expectedPattern: 'Amazon.*',
    shouldNotContain: ['..', '.html']
  },
  {
    name: 'BJs Harrys Razor',
    url: 'https://www.bjs.com/product/harrys-5-blade-razor-handle-value-pack/3000000000003879255',
    expectedPattern: 'BJs.*',
    shouldNotContain: ['..', '.html', '3000000000003879255']
  },
  {
    name: 'Target Centrum Vitamins',
    url: 'https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets/-/A-12345678',
    expectedPattern: 'Target.*',
    shouldNotContain: ['..', '.html', 'A-12345678']
  },
  {
    name: 'Amazon with Long Tracking Parameters',
    url: 'https://www.amazon.com/Echo-Dot-5th-Gen/dp/B09B8V1LZ3?tag=affiliate-20&ref=xyz&utm_source=google',
    expectedPattern: 'Amazon.*',
    shouldNotContain: ['..', 'tag', 'ref', 'utm']
  }
];

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    console.log(`\n📦 TEST: ${testCase.name}`);
    console.log(`   URL: ${testCase.url.substring(0, 80)}...`);
    
    try {
      const result = await parseProductUrl(testCase.url);
      
      console.log(`\n   ✅ Generated Slug: ${result.slug}`);
      console.log(`   📊 Merchant: ${result.merchant}`);
      console.log(`   🎯 Confidence: ${result.confidence}`);
      
      if (result.productInfo) {
        console.log(`   📝 Title: ${result.productInfo.title?.substring(0, 50)}...`);
        if (result.productInfo.brand) {
          console.log(`   🏷️  Brand: ${result.productInfo.brand}`);
        }
      }
      
      // Validation checks
      const issues = [];
      
      // Check if slug matches expected pattern
      if (testCase.expectedPattern) {
        const regex = new RegExp(testCase.expectedPattern);
        if (!regex.test(result.slug)) {
          issues.push(`Slug doesn't match pattern ${testCase.expectedPattern}`);
        }
      }
      
      // Check for things that shouldn't be in the slug
      if (testCase.shouldNotContain) {
        for (const badString of testCase.shouldNotContain) {
          if (result.slug.includes(badString)) {
            issues.push(`Slug contains unwanted string: "${badString}"`);
          }
        }
      }
      
      // Check length
      if (result.slug.length > 60) {
        issues.push(`Slug too long: ${result.slug.length} chars (max 60)`);
      }
      
      // Check for double dots
      if (result.slug.includes('..')) {
        issues.push('Slug contains double dots (..)');
      }
      
      // Check for file extensions
      if (/\.(html|htm|php)$/i.test(result.slug)) {
        issues.push('Slug contains file extension');
      }
      
      if (issues.length > 0) {
        console.log(`\n   ❌ FAILED:`);
        issues.forEach(issue => console.log(`      - ${issue}`));
        failed++;
      } else {
        console.log(`\n   ✅ PASSED: All checks passed!`);
        passed++;
      }
      
    } catch (error) {
      console.log(`\n   ❌ ERROR: ${error.message}`);
      failed++;
    }
    
    console.log('-'.repeat(80));
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`\n📊 TEST RESULTS:`);
  console.log(`   ✅ Passed: ${passed}/${testCases.length}`);
  console.log(`   ❌ Failed: ${failed}/${testCases.length}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / testCases.length) * 100)}%`);
  
  if (passed === testCases.length) {
    console.log(`\n🎉 ALL TESTS PASSED! The bug is fixed! 🚀`);
  } else {
    console.log(`\n⚠️  Some tests failed. Review the issues above.`);
  }
  
  console.log(`\n${'='.repeat(80)}\n`);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});

