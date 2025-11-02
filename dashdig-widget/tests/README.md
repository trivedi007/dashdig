# Testing Documentation

## Overview

This project uses **Vitest** as the testing framework with comprehensive configuration for unit and integration testing.

## Testing Stack

### Core Dependencies
- **Vitest** (^1.1.0) - Fast unit test framework powered by Vite
- **@vitest/coverage-v8** (^1.1.0) - Code coverage using V8
- **@vitest/ui** (^1.1.0) - Web-based UI for test visualization

### Testing Environments
- **jsdom** (^27.0.1) - Primary DOM environment for browser simulation
- **happy-dom** (^20.0.10) - Lightweight alternative DOM environment (available if needed)

### React Testing Utilities
- **@testing-library/react** (^16.3.0) - React component testing utilities
- **@testing-library/jest-dom** (^6.9.1) - Custom matchers for DOM assertions
- **@testing-library/user-event** (^14.6.1) - User interaction simulation

## Configuration

### Vitest Configuration (`vitest.config.ts`)

The configuration includes:
- **Environment**: jsdom for browser API simulation
- **Globals**: Enabled for describe, it, expect without imports
- **Coverage**: V8 provider with 80% thresholds
- **Path Aliases**: Configured for clean imports (@, @core, @integrations, @standalone)

### Global Setup (`tests/setup.ts`)

The setup file provides:
- jest-dom matchers for enhanced assertions
- Mock implementations for ResizeObserver, IntersectionObserver
- Mock for window.matchMedia
- Automatic mock cleanup after each test
- Console error/warning suppression for expected test output

## Available Scripts

```bash
# Run all tests once
npm run test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Coverage Configuration

Coverage thresholds are set to **80%** for:
- Lines
- Functions
- Branches
- Statements

Coverage reports are generated in multiple formats:
- **text**: Console output
- **json**: JSON format for CI/CD integration
- **html**: Interactive HTML report (in `coverage/` directory)
- **lcov**: LCOV format for coverage tracking tools

### Coverage Exclusions

The following are excluded from coverage:
- `node_modules/`
- `dist/`
- `examples/`
- Configuration files (`**/*.config.{js,ts}`)
- Type definition files (`**/*.d.ts`)
- Index files (`**/index.ts`)
- Test files themselves (`**/*.spec.{ts,tsx}`, `**/*.test.{ts,tsx}`)

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### React Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Async Testing

```typescript
it('should handle async operations', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

### Mocking

```typescript
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn();

// Mock a module
vi.mock('./api-client', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'test' }))
}));
```

## Test Organization

Tests should be placed in one of two locations:

1. **Co-located with source files**: `src/**/*.{test,spec}.{ts,tsx}`
   - Recommended for unit tests
   - Example: `src/core/utils.test.ts` next to `src/core/utils.ts`

2. **Dedicated tests directory**: `tests/**/*.{test,spec}.{ts,tsx}`
   - Recommended for integration tests
   - Shared test utilities and fixtures

## Best Practices

### 1. Test Naming
- Use descriptive test names that explain the expected behavior
- Follow the pattern: "should [expected behavior] when [condition]"

```typescript
it('should return user data when API call succeeds', async () => {
  // test implementation
});
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [10, 20, 30];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(60);
});
```

### 3. Test Independence
- Each test should be independent and not rely on other tests
- Use `beforeEach` for common setup
- Clean up after tests if needed

```typescript
describe('UserService', () => {
  let service: UserService;
  
  beforeEach(() => {
    service = new UserService();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
});
```

### 4. Avoid Implementation Details
- Test behavior, not implementation
- Use `screen.getByRole()` over `container.querySelector()`
- Test from the user's perspective

### 5. Coverage Goals
- Aim for 80%+ coverage on critical paths
- 100% coverage on utility functions
- Focus on meaningful tests over coverage numbers

## Debugging Tests

### Run Specific Test File
```bash
npm run test src/core/utils.test.ts
```

### Run Tests Matching Pattern
```bash
npm run test -- --grep "should calculate"
```

### Debug in VS Code
Add this to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:watch"],
  "console": "integratedTerminal"
}
```

## CI/CD Integration

The test suite is integrated with the build process:
- `prepublishOnly` runs tests before publishing
- `validate` script runs type-check, lint, and tests

For CI pipelines, use:
```bash
npm run test:coverage
```

This generates coverage reports that can be uploaded to coverage tracking services.

## Troubleshooting

### Tests Not Found
- Check that test files match the pattern `*.{test,spec}.{ts,tsx}`
- Verify files are in `src/` or `tests/` directories

### Module Resolution Issues
- Check path aliases in `vitest.config.ts`
- Ensure imports match configured aliases

### Coverage Not Meeting Thresholds
- Run `npm run test:coverage` to see detailed report
- Check `coverage/index.html` for visual breakdown
- Focus on untested critical paths

### React Component Tests Failing
- Ensure React is installed as a peer dependency for tests requiring React components
- Verify setup file is loaded correctly

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
