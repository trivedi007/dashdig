const fs = require('fs').promises;
const path = require('path');
const { qualityChecks } = require('./smart-url-generator.test');

/**
 * Auto-fix script for failing slug tests
 * Analyzes failed tests and suggests improvements
 */

async function loadTestReport() {
  const reportPath = path.join(__dirname, 'smart-url-test-report.json');
  try {
    const data = await fs.readFile(reportPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ No test report found. Run tests first: npm test');
    process.exit(1);
  }
}

function suggestFix(failedTest) {
  const { generatedSlug, expectedSlug, url, qualityChecks: checks } = failedTest;
  const suggestions = [];
  
  // Analyze what went wrong
  if (!checks.readability.passed) {
    if (checks.readability.checks.noDoubleDots === false) {
      suggestions.push({
        issue: 'Double dots detected',
        fix: generatedSlug.replace(/\.+/g, '.'),
        priority: 'high'
      });
    }
    
    if (checks.readability.checks.noFileExtensions === false) {
      suggestions.push({
        issue: 'File extension detected',
        fix: generatedSlug.replace(/\.(html|php|aspx|jsp|asp)$/, ''),
        priority: 'high'
      });
    }
    
    if (checks.readability.checks.noTrailingDots === false) {
      suggestions.push({
        issue: 'Trailing dots',
        fix: generatedSlug.replace(/\.+$/, ''),
        priority: 'medium'
      });
    }
    
    if (checks.readability.checks.noLeadingDots === false) {
      suggestions.push({
        issue: 'Leading dots',
        fix: generatedSlug.replace(/^\.+/, ''),
        priority: 'medium'
      });
    }
  }
  
  if (!checks.informationDensity.passed) {
    const components = generatedSlug.split('.').filter(c => c.length > 0);
    
    if (checks.informationDensity.checks.minComponents === false) {
      suggestions.push({
        issue: `Not enough components (${components.length}/3)`,
        fix: suggestMoreComponents(url, components),
        priority: 'high'
      });
    }
    
    if (checks.informationDensity.checks.maxComponents === false) {
      suggestions.push({
        issue: `Too many components (${components.length}/6)`,
        fix: components.slice(0, 5).join('.'),
        priority: 'medium'
      });
    }
    
    if (checks.informationDensity.checks.noGenericWords === false) {
      const filteredComponents = components.filter(c => 
        !['link', 'url', 'page', 'item', 'product'].includes(c)
      );
      suggestions.push({
        issue: 'Generic words detected',
        fix: filteredComponents.join('.'),
        priority: 'high'
      });
    }
  }
  
  if (!checks.salesPitch.passed) {
    if (checks.salesPitch.checks.includesBrand === false) {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '').split('.')[0];
      const components = generatedSlug.split('.');
      suggestions.push({
        issue: 'Brand/domain not in first position',
        fix: [domain, ...components.filter(c => c !== domain)].join('.'),
        priority: 'high'
      });
    }
    
    if (checks.salesPitch.checks.maxLength === false) {
      suggestions.push({
        issue: `Too long (${generatedSlug.length} > 60 chars)`,
        fix: generatedSlug.substring(0, 60).replace(/\.[^.]*$/, ''),
        priority: 'medium'
      });
    }
    
    if (checks.salesPitch.checks.minLength === false) {
      suggestions.push({
        issue: `Too short (${generatedSlug.length} < 10 chars)`,
        fix: suggestMoreComponents(url, generatedSlug.split('.')),
        priority: 'high'
      });
    }
  }
  
  if (!checks.notGeneric.passed) {
    suggestions.push({
      issue: 'Slug is too generic',
      fix: generateBetterSlug(url),
      priority: 'critical'
    });
  }
  
  return suggestions;
}

function suggestMoreComponents(url, existingComponents) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  
  // Extract meaningful words from path
  const pathComponents = pathname
    .split('/')
    .filter(p => p && p.length > 0)
    .map(p => p.replace(/[-_]/g, ' '))
    .flatMap(p => p.split(' '))
    .filter(w => w.length > 2 && !/^\d+$/.test(w))
    .map(w => w.toLowerCase())
    .slice(0, 3);
  
  const combined = [...existingComponents, ...pathComponents]
    .filter((v, i, a) => a.indexOf(v) === i) // unique
    .slice(0, 5);
  
  return combined.join('.');
}

function generateBetterSlug(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace('www.', '').split('.')[0];
  const pathname = urlObj.pathname;
  
  // Try to extract product/brand info from path
  const meaningfulParts = pathname
    .split('/')
    .filter(p => p && p.length > 0)
    .map(p => p.replace(/[-_]/g, ' '))
    .flatMap(p => p.split(' '))
    .filter(w => w.length > 2 && !/^\d+$/.test(w) && 
                 !['product', 'item', 'page', 'html'].includes(w.toLowerCase()))
    .map(w => w.toLowerCase())
    .slice(0, 4);
  
  return [domain, ...meaningfulParts].join('.');
}

async function generateFixReport(report) {
  const { failedTests } = report;
  
  if (failedTests.length === 0) {
    console.log('✅ No failures to fix!');
    return;
  }
  
  console.log(`\n🔧 Analyzing ${failedTests.length} failed tests...\n`);
  
  const fixes = [];
  
  failedTests.forEach((test, index) => {
    const suggestions = suggestFix(test);
    
    fixes.push({
      testIndex: test.index,
      url: test.url,
      category: test.category,
      current: test.generatedSlug,
      expected: test.expectedSlug,
      suggestions
    });
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Test #${test.index} - ${test.category}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`URL: ${test.url}`);
    console.log(`\nCurrent:  ${test.generatedSlug}`);
    console.log(`Expected: ${test.expectedSlug}`);
    console.log(`\n📋 Suggested Fixes (${suggestions.length}):`);
    
    suggestions.forEach((suggestion, i) => {
      const priorityEmoji = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🟢'
      }[suggestion.priority] || '⚪';
      
      console.log(`\n  ${i + 1}. ${priorityEmoji} ${suggestion.issue}`);
      console.log(`     Fix: ${suggestion.fix}`);
      
      // Validate the fix
      const readability = qualityChecks.isReadable(suggestion.fix);
      const density = qualityChecks.isInformationDense(suggestion.fix);
      const salesPitch = qualityChecks.hasSalesPitchQuality(suggestion.fix, test.url);
      const notGeneric = qualityChecks.isNotGeneric(suggestion.fix);
      
      const allPassed = readability.passed && density.passed && salesPitch.passed && notGeneric.passed;
      
      if (allPassed) {
        console.log(`     ✅ This fix passes all quality checks!`);
      } else {
        const failed = [];
        if (!readability.passed) failed.push('readability');
        if (!density.passed) failed.push('density');
        if (!salesPitch.passed) failed.push('sales-pitch');
        if (!notGeneric.passed) failed.push('not-generic');
        console.log(`     ⚠️  Still fails: ${failed.join(', ')}`);
      }
    });
  });
  
  // Save fixes to file
  const fixesPath = path.join(__dirname, 'suggested-fixes.json');
  await fs.writeFile(fixesPath, JSON.stringify(fixes, null, 2));
  
  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`📁 Fixes saved to: ${fixesPath}`);
  console.log(`${'='.repeat(80)}\n`);
  
  // Generate improvement recommendations
  await generateImprovementRecommendations(report, fixes);
}

async function generateImprovementRecommendations(report, fixes) {
  const recommendations = [];
  
  // Analyze common failure patterns
  const failurePatterns = {
    readability: 0,
    informationDensity: 0,
    salesPitch: 0,
    notGeneric: 0
  };
  
  report.failedTests.forEach(test => {
    if (!test.passed.readability) failurePatterns.readability++;
    if (!test.passed.informationDensity) failurePatterns.informationDensity++;
    if (!test.passed.salesPitch) failurePatterns.salesPitch++;
    if (!test.passed.notGeneric) failurePatterns.notGeneric++;
  });
  
  // Generate recommendations based on patterns
  if (failurePatterns.readability > 5) {
    recommendations.push({
      area: 'Readability',
      issue: `${failurePatterns.readability} tests failed readability checks`,
      recommendation: 'Review the sanitizeSlug function in ai.service.js. Ensure it properly removes double dots, file extensions, and handles edge cases.'
    });
  }
  
  if (failurePatterns.informationDensity > 5) {
    recommendations.push({
      area: 'Information Density',
      issue: `${failurePatterns.informationDensity} tests failed information density checks`,
      recommendation: 'Improve the fallback URL generation logic. Extract more meaningful components from URLs. Consider implementing better path parsing.'
    });
  }
  
  if (failurePatterns.salesPitch > 5) {
    recommendations.push({
      area: 'Sales Pitch Quality',
      issue: `${failurePatterns.salesPitch} tests failed sales pitch quality checks`,
      recommendation: 'Ensure brand/domain is always in the first position. Add validation for length constraints (10-60 chars). Filter out long numeric sequences.'
    });
  }
  
  if (failurePatterns.notGeneric > 0) {
    recommendations.push({
      area: 'Generic Slugs',
      issue: `${failurePatterns.notGeneric} tests generated generic slugs`,
      recommendation: 'Critical: Review fallback generation logic. Generic slugs like "domain.products" or "domain.groceries" should never be generated. Always extract specific product/category info.'
    });
  }
  
  // Category-specific recommendations
  const categoryFailures = {};
  report.failedTests.forEach(test => {
    categoryFailures[test.category] = (categoryFailures[test.category] || 0) + 1;
  });
  
  Object.entries(categoryFailures).forEach(([category, count]) => {
    if (count > report.summary.categories[category].total * 0.3) { // More than 30% failure rate
      recommendations.push({
        area: `Category: ${category}`,
        issue: `${count}/${report.summary.categories[category].total} ${category} tests failed`,
        recommendation: `Add more ${category}-specific pattern matching in the fallback generation. Study the URLs in this category and add brand/product detection logic.`
      });
    }
  });
  
  // Save recommendations
  const recPath = path.join(__dirname, 'improvement-recommendations.md');
  let md = '# Improvement Recommendations\n\n';
  md += `Generated: ${new Date().toLocaleString()}\n\n`;
  md += `Total Failures: ${report.failedTests.length}\n\n`;
  md += '## Recommended Actions\n\n';
  
  recommendations.forEach((rec, i) => {
    md += `### ${i + 1}. ${rec.area}\n\n`;
    md += `**Issue:** ${rec.issue}\n\n`;
    md += `**Recommendation:** ${rec.recommendation}\n\n`;
    md += '---\n\n';
  });
  
  await fs.writeFile(recPath, md);
  
  console.log(`\n📋 Improvement recommendations saved to: ${recPath}\n`);
}

// Main execution
(async () => {
  console.log('🔧 Smart URL Auto-Fix Tool\n');
  
  const report = await loadTestReport();
  await generateFixReport(report);
})();
