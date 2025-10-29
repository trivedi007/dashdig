# NPM Scripts Documentation

This document explains all available npm scripts for the DashDig Widget project.

## Build Scripts

### `npm run build`
Production build of all bundles (vanilla, React, Vue, Angular) in both UMD and ESM formats.
- Runs `prebuild` automatically to clean dist folder
- Generates minified bundles with source maps
- Outputs 8 bundle files total

### `npm run build:core`
Build only the vanilla JavaScript/standalone bundle.
- Output: `dist/dashdig.min.js` and `dist/dashdig.esm.js`

### `npm run build:react`
Build only the React integration bundle.
- Output: `dist/dashdig-react.min.js` and `dist/dashdig-react.esm.js`

### `npm run build:vue`
Build only the Vue 3 integration bundle.
- Output: `dist/dashdig-vue.min.js` and `dist/dashdig-vue.esm.js`

### `npm run build:angular`
Build only the Angular integration bundle.
- Output: `dist/dashdig-angular.min.js` and `dist/dashdig-angular.esm.js`

## Development Scripts

### `npm run dev`
Watch mode for all bundles - rebuilds on file changes.
- No minification for faster builds
- Useful for development across all frameworks

### `npm run dev:core`
Watch mode for vanilla JavaScript bundle only.

### `npm run dev:react`
Watch mode for React bundle only.

### `npm run dev:vue`
Watch mode for Vue bundle only.

### `npm run dev:angular`
Watch mode for Angular bundle only.

## Utility Scripts

### `npm run clean`
Remove the entire `dist` folder using rimraf.
- Cross-platform compatible
- Safe to run anytime

### `npm run prebuild`
Automatically runs before `build` to clean the dist folder.
- No need to run manually

### `npm run type-check`
Run TypeScript compiler without emitting files.
- Validates all TypeScript types
- Catches type errors before build

## Code Quality Scripts

### `npm run lint`
Check code for ESLint errors and warnings.
- Checks all `.ts` and `.tsx` files in `src/`
- Reports issues without fixing

### `npm run lint:fix`
Check and automatically fix ESLint issues.
- Fixes auto-fixable problems
- Reports remaining issues

### `npm run format`
Format all source code with Prettier.
- Formats TypeScript, JavaScript, JSON, CSS, and Markdown
- Overwrites files with formatted code

### `npm run format:check`
Check if code is formatted without modifying files.
- Useful for CI/CD pipelines
- Returns error if formatting needed

## Testing Scripts

### `npm run test`
Run all unit tests once.
- Uses Vitest test runner
- Exits after completion

### `npm run test:watch`
Run tests in watch mode.
- Re-runs tests on file changes
- Interactive mode

### `npm run test:ui`
Run tests with visual UI interface.
- Opens browser interface
- Better for debugging tests

### `npm run test:coverage`
Run tests and generate coverage report.
- Uses V8 coverage provider
- Outputs text, JSON, HTML, and LCOV reports

## Bundle Analysis Scripts

### `npm run size`
Check bundle sizes against configured limits.
- Compares gzipped sizes to limits in package.json
- Fails if any bundle exceeds limit
- Useful for CI/CD

### `npm run analyze`
Visualize bundle composition and dependencies.
- Generates interactive HTML report
- Shows what's included in each bundle
- Helps identify optimization opportunities

## Publishing Scripts

### `npm run prepublishOnly`
Automatically runs before `npm publish`.
- Builds all bundles
- Runs tests
- Ensures clean publish

### `npm run validate`
Run all quality checks at once.
- Type checking
- Linting
- Tests
- Useful before committing or publishing

## Common Workflows

### Development Workflow
```bash
# Start development on React integration
npm run dev:react

# In another terminal, run tests in watch mode
npm run test:watch
```

### Pre-Commit Workflow
```bash
# Validate everything before committing
npm run validate

# Or run individually
npm run type-check
npm run lint:fix
npm run format
npm run test
```

### Release Workflow
```bash
# Build and validate everything
npm run build
npm run validate
npm run size

# Check bundle sizes and composition
npm run analyze

# Publish (prepublishOnly runs automatically)
npm publish
```

## Environment Variables

- `ROLLUP_WATCH`: Set automatically in watch mode
- `BUILD`: Can be set to `core`, `react`, `vue`, or `angular` to build specific bundle
- `ANALYZE`: Set to enable rollup-plugin-visualizer

## Cross-Platform Compatibility

All scripts are designed to work on:
- Windows (using rimraf instead of rm -rf)
- macOS
- Linux

No platform-specific commands are used.


