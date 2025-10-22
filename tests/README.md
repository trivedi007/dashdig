# Smart URL Generator Test Suite

Comprehensive testing suite for validating Smart URL slug generation quality across 100+ real-world e-commerce URLs.

## Overview

This test suite ensures that generated URL slugs are:
- ✅ **Human-readable**: No double dots, file extensions, or broken patterns
- ✅ **Information-dense**: 3-5 meaningful components, no generic words
- ✅ **Sales-pitch quality**: Brand-focused, descriptive, shareable
- ❌ **Not generic**: No `domain.products` or `us.good..html` patterns

## Test Coverage

- **100 URLs** across 5 categories:
  - 20 Household products (Charmin, Tide, Lysol, etc.)
  - 20 Electronics (AirPods, Echo, Samsung, etc.)
  - 20 Fashion items (Nike, Hoka, Lululemon, etc.)
  - 20 Beauty products (Sephora, Ulta, Fenty, etc.)
  - 20 Food/Grocery items (Instacart, Walmart, Target, etc.)

## Files

```
tests/
├── url-test-cases.json              # 100 test cases with expected slugs
├── smart-url-generator.test.js      # Main test runner (Jest)
├── auto-fix-slugs.js                # Auto-fix script for failures
├── README.md                        # This file
├── smart-url-test-report.json       # Generated after tests run
├── smart-url-test-summary.md        # Human-readable summary
├── suggested-fixes.json             # Auto-generated fix suggestions
└── improvement-recommendations.md   # Code improvement suggestions
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- smart-url-generator.test.js
```

### 3. Analyze Results

After tests complete, check the generated reports:

```bash
# View summary
cat tests/smart-url-test-summary.md

# View detailed JSON report
cat tests/smart-url-test-report.json
```

### 4. Auto-Fix Failures

If tests fail, run the auto-fix script to get suggestions:

```bash
npm run test:fix
```

This will generate:
- `suggested-fixes.json` - Specific fixes for each failure
- `improvement-recommendations.md` - Code improvement suggestions

## Test Execution

### Running Specific Test Groups

```bash
# Test only household products
npm test -- -t "household"

# Test only electronics
npm test -- -t "electronics"

# Test performance metrics
npm test -- -t "Performance"

# Test quality standards
npm test -- -t "Quality Standards"
```

### Environment Variables

```bash
# Use OpenAI for slug generation (recommended for full testing)
export OPENAI_API_KEY=your_key_here

# Run without OpenAI (uses fallback generation)
unset OPENAI_API_KEY
```

## Quality Metrics

The test suite validates:

### 1. Readability (90% pass threshold)
- No double dots (`..`)
- No file extensions (`.html`, `.php`, etc.)
- Proper format (`^[a-z][a-z0-9.]+$`)
- No trailing/leading dots

### 2. Information Density (85% pass threshold)
- 3-6 components
- Meaningful words (≥2 chars each)
- No generic words (link, url, page, item, product)

### 3. Sales Pitch Quality (80% pass threshold)
- Brand/domain in first position
- Descriptive words (≥4 chars)
- No long number sequences
- Length 10-60 characters

### 4. Not Generic (100% pass threshold)
- No generic patterns
- Not too short
- Has substance (≥3 components)

## Test Report

After running tests, you'll get a comprehensive report:

```markdown
# Smart URL Generator Test Report

**Generated:** 10/21/2025, 7:00:00 PM

**Total Tests:** 100

## Overall Metrics

| Metric | Passed | Failed | Pass Rate |
|--------|--------|--------|-----------|
| Readability | 95 | 5 | 95.0% |
| Information Density | 90 | 10 | 90.0% |
| Sales Pitch Quality | 85 | 15 | 85.0% |
| Not Generic | 100 | 0 | 100.0% |

**Average Similarity:** 78.5%
**Average Execution Time:** 1250ms

## Category Breakdown

| Category | Total | Passed | Pass Rate |
|----------|-------|--------|-----------|
| household | 20 | 18 | 90.0% |
| electronics | 20 | 19 | 95.0% |
| fashion | 20 | 17 | 85.0% |
| beauty | 20 | 18 | 90.0% |
| food | 20 | 19 | 95.0% |
```

## Auto-Fix Script

The auto-fix script analyzes failures and suggests improvements:

```bash
npm run test:fix
```

Example output:

```
🔧 Smart URL Auto-Fix Tool

🔧 Analyzing 5 failed tests...

================================================================================
Test #23 - electronics
================================================================================
URL: https://www.bestbuy.com/site/samsung-65-oled-4k-tv/6536981.p

Current:  bestbuy.samsung.oled
Expected: bestbuy.samsung.oled.4k.tv

📋 Suggested Fixes (1):

  1. 🟠 Not enough components (3/3)
     Fix: bestbuy.samsung.oled.4k.tv
     ✅ This fix passes all quality checks!
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/test-smart-urls.yml`:

```yaml
name: Smart URL Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: cd backend && npm install
    
    - name: Run tests
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      run: cd backend && npm test -- smart-url-generator.test.js
    
    - name: Upload test reports
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-reports
        path: |
          tests/smart-url-test-report.json
          tests/smart-url-test-summary.md
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run Smart URL tests before commit
cd backend && npm test -- smart-url-generator.test.js --bail
```

## Troubleshooting

### Tests Taking Too Long

Each test has a 30-second timeout. If tests are slow:

1. Check your OpenAI API key is valid
2. Consider running without AI (fallback mode is faster)
3. Run specific test groups instead of all tests

### High Failure Rate

If seeing >20% failures:

1. Run the auto-fix script: `npm run test:fix`
2. Review `improvement-recommendations.md`
3. Update `ai.service.js` based on recommendations
4. Re-run tests to verify improvements

### Memory Issues

For large test runs:

```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm test
```

## Adding New Test Cases

Edit `tests/url-test-cases.json`:

```json
{
  "url": "https://www.example.com/product/amazing-widget",
  "expectedSlug": "example.amazing.widget",
  "category": "household"
}
```

Then run tests to validate the new case.

## Best Practices

1. **Run tests before major releases**
2. **Monitor pass rates by category**
3. **Use auto-fix suggestions to improve code**
4. **Keep test cases up-to-date with real URLs**
5. **Review failure patterns regularly**

## Performance Benchmarks

Target metrics:
- Average generation time: <5 seconds
- Readability pass rate: ≥90%
- Information density pass rate: ≥85%
- Sales pitch quality pass rate: ≥80%
- Generic slugs: 0

## Support

For issues or questions:
1. Check the generated reports first
2. Run auto-fix script for suggestions
3. Review improvement recommendations
4. Update code based on patterns
5. Re-run tests to verify

## License

Part of the Dashdig project.
