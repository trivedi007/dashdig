# DashDig Widget - Testing Guide

Comprehensive testing documentation for the DashDig widget project.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [E2E Tests](#e2e-tests)
- [Performance Tests](#performance-tests)
- [Coverage](#coverage)
- [Best Practices](#best-practices)

## Overview

The DashDig widget uses a comprehensive testing strategy with multiple test types:

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test component interactions and React integration
- **E2E Tests**: Test the complete widget in a real browser environment
- **Performance Tests**: Benchmark load times and performance metrics

### Testing Stack

- **Vitest**: Fast unit and integration testing framework
- **Playwright**: Cross-browser E2E testing
- **Testing Library**: Component testing utilities
- **jsdom**: DOM environment for unit tests

## Test Structure

```
tests/
├── setup.ts              # Global test configuration
├── unit/                 # Unit tests
│   ├── widget.test.ts
│   ├── api-client.test.ts
│   └── url-shortener.test.ts
├── integration/          # Integration tests
│   ├── react.test.tsx
│   └── react-shortener.test.tsx
├── e2e/                  # End-to-end tests
│   ├── widget-rendering.spec.ts
│   └── react-integration.spec.ts
└── performance/          # Performance benchmarks
    └── load-time.bench.ts
```

## Running Tests

### All Unit & Integration Tests

```bash
# Run all tests once
npm test

# Watch mode (re-run on changes)
npm run test:watch

# With UI dashboard
npm run test:ui
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

### E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### Performance Benchmarks

```bash
# Run performance benchmarks
npm run test:bench
```

## Unit Tests

Unit tests focus on testing individual functions and components in isolation.

### Location
`tests/unit/`

### What to Test

- Widget initialization and configuration
- API client methods
- URL shortener functionality
- Utility functions
- Error handling

### Example

```typescript
import { describe, it, expect } from 'vitest';
import { createWidget } from '@/core/widget';

describe('Widget', () => {
  it('should initialize with correct config', () => {
    const widget = createWidget({
      apiKey: 'test-key',
      endpoint: 'https://api.dashdig.com'
    });
    
    expect(widget.config.apiKey).toBe('test-key');
  });
});
```

### Running Specific Tests

```bash
# Run specific test file
npm test -- widget.test.ts

# Run tests matching pattern
npm test -- --grep "Widget"
```

## Integration Tests

Integration tests verify that components work correctly together, especially React integration.

### Location
`tests/integration/`

### What to Test

- React component rendering
- Hook functionality
- Props and state updates
- Component lifecycle
- Context providers

### Example

```typescript
import { render, screen } from '@testing-library/react';
import { DashdigWidget } from '@/integrations/react';

describe('DashdigWidget Integration', () => {
  it('should render with props', () => {
    render(<DashdigWidget apiKey="test-key" />);
    
    expect(screen.getByTestId('dashdig-widget')).toBeInTheDocument();
  });
});
```

## E2E Tests

End-to-end tests verify the widget works correctly in real browser environments.

### Location
`tests/e2e/`

### What to Test

- Widget rendering in browser
- User interactions
- Network requests
- Mobile responsiveness
- Cross-browser compatibility
- Error states

### Example

```typescript
import { test, expect } from '@playwright/test';

test('should render widget', async ({ page }) => {
  await page.goto('/test.html');
  
  const widget = page.locator('.dashdig-widget');
  await expect(widget).toBeVisible();
});
```

### Browser Configuration

Playwright is configured to test across:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Running Specific Browsers

```bash
# Run only Chromium tests
npm run test:e2e -- --project=chromium

# Run only mobile tests
npm run test:e2e -- --project="Mobile Chrome"
```

## Performance Tests

Performance benchmarks measure widget load times and operations.

### Location
`tests/performance/`

### What to Benchmark

- Widget initialization time
- API client creation
- Data parsing speed
- DOM manipulation
- State updates

### Example

```typescript
import { bench } from 'vitest';

bench('widget initialization', () => {
  const widget = createWidget({
    apiKey: 'test-key',
    endpoint: 'https://api.dashdig.com'
  });
});
```

### Viewing Results

Benchmark results show operations per second and relative performance.

## Coverage

### Coverage Goals

- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 80%+
- **Statements**: 80%+

### Viewing Coverage

```bash
# Generate and view coverage
npm run test:coverage
open coverage/index.html
```

### Coverage Configuration

Coverage is configured in `vitest.config.ts`:
- Provider: v8
- Reporters: text, json, html, lcov
- Excludes: node_modules, dist, examples, config files

## Best Practices

### Writing Tests

1. **Use descriptive test names**
   ```typescript
   // Good
   it('should render error message when API fails')
   
   // Bad
   it('should work')
   ```

2. **Follow AAA pattern**: Arrange, Act, Assert
   ```typescript
   it('should update on refresh', () => {
     // Arrange
     const widget = createWidget(config);
     
     // Act
     widget.refresh();
     
     // Assert
     expect(widget.loading).toBe(true);
   });
   ```

3. **Test behavior, not implementation**
   ```typescript
   // Good - tests behavior
   expect(button).toHaveAttribute('aria-label', 'Close');
   
   // Bad - tests implementation
   expect(button.onClick).toBeDefined();
   ```

4. **Use Testing Library queries wisely**
   - Prefer `getByRole` over `getByTestId`
   - Use `getByText` for user-visible content
   - Use `getByTestId` only when necessary

5. **Clean up after tests**
   ```typescript
   afterEach(() => {
     cleanup();
     vi.clearAllMocks();
   });
   ```

### Mocking

Mock external dependencies:

```typescript
vi.mock('@/core/api-client', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: [] })
}));
```

### Async Tests

Handle async operations properly:

```typescript
it('should load data', async () => {
  render(<Widget />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- Before deployment

### CI Configuration

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    npm run test:coverage
    npm run test:e2e
```

## Debugging Tests

### Vitest Debugging

```bash
# Run tests in debug mode
npm test -- --inspect-brk

# Run single test in debug mode
npm test -- widget.test.ts --inspect-brk
```

### Playwright Debugging

```bash
# Run with UI mode (best for debugging)
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Debug specific test
npm run test:e2e -- --debug widget-rendering.spec.ts
```

### Common Issues

1. **Test timeouts**: Increase timeout in test
   ```typescript
   test('slow test', async ({ page }) => {
     test.setTimeout(60000); // 60 seconds
     // ...
   });
   ```

2. **Flaky tests**: Add proper waits
   ```typescript
   await page.waitForLoadState('networkidle');
   await expect(element).toBeVisible({ timeout: 10000 });
   ```

3. **Mock not working**: Ensure mock is hoisted
   ```typescript
   vi.mock('./module', () => ({
     // Mock implementation
   }));
   ```

## Additional Resources

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library Documentation](https://testing-library.com)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Contributing

When adding new features:
1. Write unit tests for core logic
2. Add integration tests for React components
3. Create E2E tests for user-facing features
4. Update this documentation if needed

Aim for >80% code coverage for all new code.
