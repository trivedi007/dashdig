const { describe, test, expect, beforeAll } = require('@jest/globals');
const aiService = require('../backend/src/services/ai.service');
const fs = require('fs').promises;
const path = require('path');

// Levenshtein distance for similarity calculation
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Calculate similarity score (0-1, where 1 is identical)
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Quality checks
const qualityChecks = {
  // Check if slug is human-readable (no double dots, proper format)
  isReadable: (slug) => {
    const checks = {
      noDoubleDots: !slug.includes('..'),
      noFileExtensions: !/\.(html|php|aspx|jsp|asp)$/.test(slug),
      properFormat: /^[a-z][a-z0-9.]+$/.test(slug),
      noTrailingDots: !slug.endsWith('.'),
      noLeadingDots: !slug.startsWith('.'),
    };
    
    return {
      passed: Object.values(checks).every(Boolean),
      checks
    };
  },
  
  // Check information density (at least 3 components, meaningful words)
  isInformationDense: (slug) => {
    const components = slug.split('.').filter(c => c.length > 0);
    const checks = {
      minComponents: components.length >= 3,
      maxComponents: components.length <= 6,
      meaningfulWords: components.every(c => c.length >= 2),
      noGenericWords: !components.some(c => 
        ['link', 'url', 'page', 'item', 'product'].includes(c)
      ),
    };
    
    return {
      passed: Object.values(checks).every(Boolean),
      checks,
      componentCount: components.length
    };
  },
  
  // Check if it follows naming conventions (PascalCase style for brands)
  hasSalesPitchQuality: (slug, url) => {
    const components = slug.split('.');
    const urlLower = url.toLowerCase();
    
    // Extract brand/domain from URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '').split('.')[0];
    
    const checks = {
      includesBrand: components[0].toLowerCase() === domain.toLowerCase(),
      descriptiveWords: components.some(c => c.length >= 4),
      noNumbers: !slug.match(/\d{3,}/), // No long number sequences
      maxLength: slug.length <= 60,
      minLength: slug.length >= 10,
    };
    
    return {
      passed: Object.values(checks).every(Boolean),
      checks
    };
  },
  
  // Check for generic/broken slugs
  isNotGeneric: (slug) => {
    const genericPatterns = [
      /^[a-z]+\.\.[a-z]+$/, // domain..something
      /\d{8,}/, // Long numeric sequences
      /^[a-z]+\.link\.\w+$/, // generic.link.xxx
      /^[a-z]+\.products?$/, // domain.product(s)
      /^[a-z]+\.groceries$/, // domain.groceries
    ];
    
    const checks = {
      notGenericPattern: !genericPatterns.some(pattern => pattern.test(slug)),
      notTooShort: slug.length >= 10,
      hasSubstance: slug.split('.').length >= 3,
    };
    
    return {
      passed: Object.values(checks).every(Boolean),
      checks
    };
  }
};

// Test results storage
const testResults = [];

describe('Smart URL Generator - Comprehensive Test Suite', () => {
  let testCases = [];
  
  beforeAll(async () => {
    // Load test cases
    const testDataPath = path.join(__dirname, 'url-test-cases.json');
    const testData = await fs.readFile(testDataPath, 'utf-8');
    testCases = JSON.parse(testData);
  });
  
  describe('Individual URL Tests', () => {
    testCases.forEach((testCase, index) => {
      test(`[${index + 1}/${testCases.length}] ${testCase.category}: ${testCase.url}`, async () => {
        const startTime = Date.now();
        
        // Generate slug
        const generatedSlug = await aiService.generateHumanReadableUrl(
          testCase.url,
          []
        );
        
        const executionTime = Date.now() - startTime;
        
        // Run quality checks
        const readability = qualityChecks.isReadable(generatedSlug);
        const informationDensity = qualityChecks.isInformationDense(generatedSlug);
        const salesPitch = qualityChecks.hasSalesPitchQuality(generatedSlug, testCase.url);
        const notGeneric = qualityChecks.isNotGeneric(generatedSlug);
        
        // Calculate similarity with expected slug
        const similarity = calculateSimilarity(
          generatedSlug.toLowerCase(),
          testCase.expectedSlug.toLowerCase()
        );
        
        // Store results
        const result = {
          index: index + 1,
          url: testCase.url,
          category: testCase.category,
          expectedSlug: testCase.expectedSlug,
          generatedSlug,
          similarity,
          executionTime,
          qualityChecks: {
            readability,
            informationDensity,
            salesPitch,
            notGeneric
          },
          passed: {
            readability: readability.passed,
            informationDensity: informationDensity.passed,
            salesPitch: salesPitch.passed,
            notGeneric: notGeneric.passed,
            similarityThreshold: similarity >= 0.6
          }
        };
        
        testResults.push(result);
        
        // Assertions
        expect(generatedSlug).toBeTruthy();
        expect(readability.passed).toBe(true);
        expect(informationDensity.passed).toBe(true);
        expect(salesPitch.passed).toBe(true);
        expect(notGeneric.passed).toBe(true);
        
        // Allow some flexibility in similarity matching
        // (fuzzy match - we're testing quality, not exact matches)
        if (similarity < 0.6) {
          console.warn(
            `⚠️  Low similarity (${(similarity * 100).toFixed(1)}%):`,
            `\n   Expected: ${testCase.expectedSlug}`,
            `\n   Got:      ${generatedSlug}`
          );
        }
      }, 30000); // 30 second timeout per test
    });
  });
  
  describe('Category-Based Analysis', () => {
    test('Household products generate quality slugs', () => {
      const householdResults = testResults.filter(r => r.category === 'household');
      const passRate = householdResults.filter(r => 
        Object.values(r.passed).every(Boolean)
      ).length / householdResults.length;
      
      expect(passRate).toBeGreaterThanOrEqual(0.8); // 80% pass rate
    });
    
    test('Electronics products generate quality slugs', () => {
      const electronicsResults = testResults.filter(r => r.category === 'electronics');
      const passRate = electronicsResults.filter(r => 
        Object.values(r.passed).every(Boolean)
      ).length / electronicsResults.length;
      
      expect(passRate).toBeGreaterThanOrEqual(0.8);
    });
    
    test('Fashion products generate quality slugs', () => {
      const fashionResults = testResults.filter(r => r.category === 'fashion');
      const passRate = fashionResults.filter(r => 
        Object.values(r.passed).every(Boolean)
      ).length / fashionResults.length;
      
      expect(passRate).toBeGreaterThanOrEqual(0.8);
    });
    
    test('Beauty products generate quality slugs', () => {
      const beautyResults = testResults.filter(r => r.category === 'beauty');
      const passRate = beautyResults.filter(r => 
        Object.values(r.passed).every(Boolean)
      ).length / beautyResults.length;
      
      expect(passRate).toBeGreaterThanOrEqual(0.8);
    });
    
    test('Food products generate quality slugs', () => {
      const foodResults = testResults.filter(r => r.category === 'food');
      const passRate = foodResults.filter(r => 
        Object.values(r.passed).every(Boolean)
      ).length / foodResults.length;
      
      expect(passRate).toBeGreaterThanOrEqual(0.8);
    });
  });
  
  describe('Performance Metrics', () => {
    test('Average generation time is reasonable', () => {
      const avgTime = testResults.reduce((sum, r) => sum + r.executionTime, 0) / testResults.length;
      console.log(`Average generation time: ${avgTime.toFixed(0)}ms`);
      expect(avgTime).toBeLessThan(5000); // Less than 5 seconds average
    });
    
    test('No slugs are excessively long', () => {
      const tooLong = testResults.filter(r => r.generatedSlug.length > 60);
      expect(tooLong.length).toBe(0);
    });
    
    test('All slugs have minimum length', () => {
      const tooShort = testResults.filter(r => r.generatedSlug.length < 10);
      expect(tooShort.length).toBe(0);
    });
  });
  
  describe('Quality Standards', () => {
    test('Overall readability pass rate >= 90%', () => {
      const passRate = testResults.filter(r => r.passed.readability).length / testResults.length;
      console.log(`Readability pass rate: ${(passRate * 100).toFixed(1)}%`);
      expect(passRate).toBeGreaterThanOrEqual(0.9);
    });
    
    test('Overall information density pass rate >= 85%', () => {
      const passRate = testResults.filter(r => r.passed.informationDensity).length / testResults.length;
      console.log(`Information density pass rate: ${(passRate * 100).toFixed(1)}%`);
      expect(passRate).toBeGreaterThanOrEqual(0.85);
    });
    
    test('Overall sales pitch quality pass rate >= 80%', () => {
      const passRate = testResults.filter(r => r.passed.salesPitch).length / testResults.length;
      console.log(`Sales pitch quality pass rate: ${(passRate * 100).toFixed(1)}%`);
      expect(passRate).toBeGreaterThanOrEqual(0.8);
    });
    
    test('No generic slugs generated', () => {
      const genericSlugs = testResults.filter(r => !r.passed.notGeneric);
      console.log(`Generic slugs: ${genericSlugs.length}`);
      expect(genericSlugs.length).toBe(0);
    });
  });
  
  // Generate report after all tests
  afterAll(async () => {
    await generateTestReport(testResults);
  });
});

// Report generation function
async function generateTestReport(results) {
  const report = {
    summary: {
      totalTests: results.length,
      timestamp: new Date().toISOString(),
      categories: {}
    },
    overallMetrics: {
      readability: {
        passed: results.filter(r => r.passed.readability).length,
        failed: results.filter(r => !r.passed.readability).length,
        passRate: (results.filter(r => r.passed.readability).length / results.length * 100).toFixed(1) + '%'
      },
      informationDensity: {
        passed: results.filter(r => r.passed.informationDensity).length,
        failed: results.filter(r => !r.passed.informationDensity).length,
        passRate: (results.filter(r => r.passed.informationDensity).length / results.length * 100).toFixed(1) + '%'
      },
      salesPitch: {
        passed: results.filter(r => r.passed.salesPitch).length,
        failed: results.filter(r => !r.passed.salesPitch).length,
        passRate: (results.filter(r => r.passed.salesPitch).length / results.length * 100).toFixed(1) + '%'
      },
      notGeneric: {
        passed: results.filter(r => r.passed.notGeneric).length,
        failed: results.filter(r => !r.passed.notGeneric).length,
        passRate: (results.filter(r => r.passed.notGeneric).length / results.length * 100).toFixed(1) + '%'
      },
      averageSimilarity: (results.reduce((sum, r) => sum + r.similarity, 0) / results.length * 100).toFixed(1) + '%',
      averageExecutionTime: (results.reduce((sum, r) => sum + r.executionTime, 0) / results.length).toFixed(0) + 'ms'
    },
    failedTests: results.filter(r => !Object.values(r.passed).every(Boolean)),
    detailedResults: results
  };
  
  // Calculate per-category metrics
  const categories = [...new Set(results.map(r => r.category))];
  categories.forEach(category => {
    const categoryResults = results.filter(r => r.category === category);
    report.summary.categories[category] = {
      total: categoryResults.length,
      passed: categoryResults.filter(r => Object.values(r.passed).every(Boolean)).length,
      passRate: (categoryResults.filter(r => Object.values(r.passed).every(Boolean)).length / categoryResults.length * 100).toFixed(1) + '%'
    };
  });
  
  // Save full report
  const reportPath = path.join(__dirname, 'smart-url-test-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  // Generate human-readable summary
  const summaryPath = path.join(__dirname, 'smart-url-test-summary.md');
  const summary = generateMarkdownSummary(report);
  await fs.writeFile(summaryPath, summary);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST REPORT GENERATED');
  console.log('='.repeat(80));
  console.log(`\n📁 Full Report: ${reportPath}`);
  console.log(`📄 Summary: ${summaryPath}`);
  console.log('\n' + summary);
}

function generateMarkdownSummary(report) {
  const { summary, overallMetrics, failedTests } = report;
  
  let md = '# Smart URL Generator Test Report\n\n';
  md += `**Generated:** ${new Date(summary.timestamp).toLocaleString()}\n\n`;
  md += `**Total Tests:** ${summary.totalTests}\n\n`;
  
  md += '## Overall Metrics\n\n';
  md += '| Metric | Passed | Failed | Pass Rate |\n';
  md += '|--------|--------|--------|----------|\n';
  md += `| Readability | ${overallMetrics.readability.passed} | ${overallMetrics.readability.failed} | ${overallMetrics.readability.passRate} |\n`;
  md += `| Information Density | ${overallMetrics.informationDensity.passed} | ${overallMetrics.informationDensity.failed} | ${overallMetrics.informationDensity.passRate} |\n`;
  md += `| Sales Pitch Quality | ${overallMetrics.salesPitch.passed} | ${overallMetrics.salesPitch.failed} | ${overallMetrics.salesPitch.passRate} |\n`;
  md += `| Not Generic | ${overallMetrics.notGeneric.passed} | ${overallMetrics.notGeneric.failed} | ${overallMetrics.notGeneric.passRate} |\n\n`;
  
  md += `**Average Similarity:** ${overallMetrics.averageSimilarity}\n`;
  md += `**Average Execution Time:** ${overallMetrics.averageExecutionTime}\n\n`;
  
  md += '## Category Breakdown\n\n';
  md += '| Category | Total | Passed | Pass Rate |\n';
  md += '|----------|-------|--------|----------|\n';
  Object.entries(summary.categories).forEach(([category, stats]) => {
    md += `| ${category} | ${stats.total} | ${stats.passed} | ${stats.passRate} |\n`;
  });
  md += '\n';
  
  if (failedTests.length > 0) {
    md += `## Failed Tests (${failedTests.length})\n\n`;
    failedTests.forEach((test, index) => {
      md += `### ${index + 1}. ${test.category} - Test #${test.index}\n\n`;
      md += `**URL:** ${test.url}\n\n`;
      md += `**Expected:** \`${test.expectedSlug}\`\n`;
      md += `**Generated:** \`${test.generatedSlug}\`\n`;
      md += `**Similarity:** ${(test.similarity * 100).toFixed(1)}%\n\n`;
      md += '**Failed Checks:**\n';
      Object.entries(test.passed).forEach(([check, passed]) => {
        if (!passed) {
          md += `- ❌ ${check}\n`;
        }
      });
      md += '\n';
    });
  } else {
    md += '## ✅ All Tests Passed!\n\n';
    md += 'No failures detected. All generated slugs meet quality standards.\n';
  }
  
  return md;
}

module.exports = { qualityChecks, calculateSimilarity, generateTestReport };
