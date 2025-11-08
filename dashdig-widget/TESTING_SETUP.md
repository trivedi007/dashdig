# Testing Setup Guide

Quick guide to set up and run the DashDig Widget test suite.

---

## 📦 Installation

### Required Dependencies

Add these to your `package.json`:

```json
{
  "devDependencies": {
    // Jest core
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.1.1",
    "@types/jest": "^29.5.0",
    
    // Testing Library
    "@testing-library/react": "^14.0.0",
    "@testing-library/vue": "^8.0.0",
    "@testing-library/user-event": "^14.6.0",
    "@testing-library/jest-dom": "^6.1.0",
    
    // Framework testing utilities
    "@vue/test-utils": "^2.4.0",
    "@angular/platform-browser-dynamic": "^16.0.0",
    "@angular/compiler": "^16.0.0"
  },
  "scripts": {
    "test:jest": "jest",
    "test:jest:watch": "jest --watch",
    "test:jest:coverage": "jest --coverage",
    "test:jest:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### Install Commands

```bash
# Using NPM
npm install

# Using Yarn
yarn install

# Using pnpm
pnpm install
```

---

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm run test:jest

# Run with watch mode (auto-rerun on changes)
npm run test:jest:watch

# Generate coverage report
npm run test:jest:coverage

# Run in CI mode
npm run test:jest:ci
```

### Run Specific Tests

```bash
# Run only core tests
npm run test:jest core.test.ts

# Run only React tests
npm run test:jest react.test.tsx

# Run only Vue tests
npm run test:jest vue.test.ts

# Run only Angular tests
npm run test:jest angular.test.ts
```

### Advanced Options

```bash
# Run tests matching pattern
npm run test:jest -- --testNamePattern="should track"

# Run tests in specific file
npm run test:jest -- tests/core.test.ts

# Update snapshots
npm run test:jest -- --updateSnapshot

# Run tests with specific timeout
npm run test:jest -- --testTimeout=10000

# Run tests verbose
npm run test:jest -- --verbose

# Run tests with specific config
npm run test:jest -- --config=jest.config.js
```

---

## 📊 Coverage Reports

### Viewing Coverage

After running `npm run test:jest:coverage`:

1. **Terminal Output**
   - Summary table displayed immediately

2. **HTML Report**
   ```bash
   open coverage/lcov-report/index.html
   ```

3. **Coverage Files**
   - `coverage/lcov.info` - LCOV format
   - `coverage/coverage-final.json` - JSON format
   - `coverage/clover.xml` - Clover format

### Coverage Thresholds

Current thresholds (80%):

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

---

## 🔧 Configuration Files

### jest.config.js

Located at: `/dashdig-widget/jest.config.js`

Key configurations:
- **Test Environment:** jsdom (browser simulation)
- **Preset:** ts-jest (TypeScript support)
- **Coverage:** 80% threshold
- **Test Match:** `**/*.test.ts` and `**/*.test.tsx`

### tests/setup.ts

Located at: `/dashdig-widget/tests/setup.ts`

Includes:
- Global test utilities
- Browser API mocks
- Cleanup functions

---

## 📁 Test Files

### Test Structure

```
/dashdig-widget/
├── tests/
│   ├── setup.ts              # Test environment setup
│   ├── core.test.ts          # Core widget tests (35+)
│   ├── react.test.tsx        # React integration tests (25+)
│   ├── vue.test.ts           # Vue integration tests (23+)
│   └── angular.test.ts       # Angular integration tests (28+)
├── jest.config.js            # Jest configuration
└── TESTING_COMPLETE.md       # Complete test documentation
```

### Test Count by File

| File | Tests | Coverage |
|------|-------|----------|
| `core.test.ts` | 35+ | Core functionality |
| `react.test.tsx` | 25+ | React integration |
| `vue.test.ts` | 23+ | Vue 3 integration |
| `angular.test.ts` | 28+ | Angular integration |
| **Total** | **111+** | **All features** |

---

## 🎯 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
npm run test:jest
```

### 3. Check Coverage

```bash
npm run test:jest:coverage
open coverage/lcov-report/index.html
```

### 4. Watch Mode (Development)

```bash
npm run test:jest:watch
```

---

## ✅ Test Examples

### Core Widget Test

```typescript
it('should initialize with valid config', () => {
  const widget = new DashdigWidget({
    apiKey: 'ddg_test_key',
    position: 'bottom-right',
    theme: 'light'
  });
  
  expect(widget).toBeInstanceOf(DashdigWidget);
});
```

### React Component Test

```typescript
it('should render without crashing', () => {
  render(<DashdigWidget apiKey="ddg_test_key" />);
  expect(document.querySelector('[data-dashdig-widget]'))
    .toBeInTheDocument();
});
```

### Vue Component Test

```typescript
it('should mount successfully', () => {
  const wrapper = mount(DashdigWidget, {
    props: { apiKey: 'ddg_test_key' }
  });
  
  expect(wrapper.exists()).toBe(true);
});
```

### Angular Component Test

```typescript
it('should create component', fakeAsync(() => {
  const fixture = TestBed.createComponent(DashdigComponent);
  fixture.detectChanges();
  tick(100);
  
  expect(fixture.componentInstance).toBeTruthy();
  flush();
}));
```

---

## 🐛 Troubleshooting

### Tests Not Running

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check TypeScript configuration
npm run type-check

# Build project first
npm run build
```

### Coverage Issues

```bash
# Check which files are included
npm run test:jest:coverage -- --verbose

# Update coverage paths in jest.config.js
collectCoverageFrom: [
  'src/**/*.ts',
  '!src/**/*.d.ts'
]
```

### Watch Mode Issues

```bash
# Clear cache and restart
npx jest --clearCache
npm run test:jest:watch
```

---

## 📚 Additional Commands

### Debugging

```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run single test file in debug mode
node --inspect-brk node_modules/.bin/jest tests/core.test.ts
```

### Performance

```bash
# Run tests with timing information
npm run test:jest -- --verbose

# Run tests without coverage (faster)
npm run test:jest

# Run tests in parallel
npm run test:jest -- --maxWorkers=4
```

### Reporting

```bash
# Generate JSON report
npm run test:jest -- --json --outputFile=test-results.json

# Generate JUnit report
npm run test:jest -- --reporters=default --reporters=jest-junit
```

---

## 🎓 Best Practices

### Writing Tests

1. **Use descriptive test names**
   ```typescript
   it('should track custom event with data', async () => {
     // Test implementation
   });
   ```

2. **Follow Arrange-Act-Assert pattern**
   ```typescript
   it('should show widget', () => {
     // Arrange
     const widget = new DashdigWidget(config);
     
     // Act
     widget.show();
     
     // Assert
     expect(widget.isVisible()).toBe(true);
   });
   ```

3. **Clean up after tests**
   ```typescript
   afterEach(() => {
     if (widget) {
       widget.destroy();
     }
   });
   ```

### Running Tests

1. **Use watch mode during development**
   ```bash
   npm run test:jest:watch
   ```

2. **Check coverage regularly**
   ```bash
   npm run test:jest:coverage
   ```

3. **Run all tests before committing**
   ```bash
   npm run test:jest:ci
   ```

---

## 🔗 Resources

### Documentation

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Complete Test Docs](./TESTING_COMPLETE.md)

### Quick Links

- Test Files: `tests/`
- Configuration: `jest.config.js`
- Coverage Reports: `coverage/lcov-report/index.html`

---

**Last Updated:** November 8, 2025
**Status:** ✅ Ready to Use
**Coverage Target:** 80%+
**Total Tests:** 111+

