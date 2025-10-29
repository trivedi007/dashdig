# Dependency Updates - package.json

## Summary

Updated package.json to fix dependency resolution issues and ensure compatibility with Rollup 3 and all build tools and frameworks.

## Latest Update (Rollup 3 Compatibility)

### Replaced rollup-plugin-terser with @rollup/plugin-terser

**Critical Change for Rollup 3:**

The old `rollup-plugin-terser` package is deprecated and incompatible with Rollup 3. It has been replaced with the official `@rollup/plugin-terser`.

**Before:**
```json
"rollup-plugin-terser": "^7.0.2"
```

**After:**
```json
"@rollup/plugin-terser": "^0.4.4"
```

**rollup.config.js Import Change:**

**Before:**
```javascript
import { terser } from 'rollup-plugin-terser';
```

**After:**
```javascript
import terser from '@rollup/plugin-terser';
```

This ensures full compatibility with Rollup 3 and uses the officially maintained plugin.

## Changes Made

### 1. Updated Core Dependencies to Use Caret Ranges

**Before:**
```json
"typescript": "5.0.0",
"rollup": "3.0.0",
"@rollup/plugin-typescript": "11.0.0",
"@rollup/plugin-node-resolve": "15.0.0",
"@rollup/plugin-commonjs": "25.0.0",
"rollup-plugin-terser": "7.0.0"
```

**After:**
```json
"typescript": "^5.3.0",
"rollup": "^3.29.0",
"@rollup/plugin-typescript": "^11.1.0",
"@rollup/plugin-node-resolve": "^15.2.0",
"@rollup/plugin-commonjs": "^25.0.0",
"@rollup/plugin-terser": "^0.4.4",
"tslib": "^2.6.0"
```

### 2. Added tslib Dependency

Added `tslib: "^2.6.0"` which is required by `@rollup/plugin-typescript` for TypeScript helper functions. This reduces bundle size by reusing common TypeScript helpers.

### 3. Updated Dev Dependencies

All dev dependencies now use caret ranges for better flexibility:

- `@types/node`: `20.0.0` → `^20.10.0`
- `@types/react`: `18.0.0` → `^18.2.0`
- `@typescript-eslint/eslint-plugin`: `^6.0.0` → `^6.15.0`
- `@typescript-eslint/parser`: `^6.0.0` → `^6.15.0`
- `@vitest/ui`: `^1.0.0` → `^1.1.0`
- `@angular/core`: `16.0.0` → `^16.2.0`
- `eslint`: `^8.50.0` → `^8.56.0`
- `prettier`: `^3.0.0` → `^3.1.0`
- `rimraf`: `^5.0.0` → `^5.0.5`
- `rollup-plugin-visualizer`: `^5.9.0` → `^5.12.0`
- `size-limit`: `^10.0.0` → `^11.0.0`
- `@size-limit/preset-small-lib`: `^10.0.0` → `^11.0.0`
- `vitest`: `^1.0.0` → `^1.1.0`
- `@vitest/coverage-v8`: `^1.0.0` → `^1.1.0`
- `vue`: `3.3.0` → `^3.4.0`

### 4. Added Resolutions Field

Added `resolutions` field for Yarn compatibility to ensure consistent versions across the dependency tree:

```json
"resolutions": {
  "typescript": "^5.3.0",
  "rollup": "^3.29.0",
  "@rollup/plugin-typescript": "^11.1.0",
  "@rollup/plugin-node-resolve": "^15.2.0",
  "@rollup/plugin-commonjs": "^25.0.0"
}
```

This prevents version conflicts when using Yarn package manager.

### 5. Added Engines Field

Added `engines` field to specify minimum required versions:

```json
"engines": {
  "node": ">=16.0.0",
  "npm": ">=8.0.0"
}
```

## Compatibility Matrix

### TypeScript Compatibility

- **TypeScript**: 5.3.x
- **@rollup/plugin-typescript**: 11.1.x (requires TypeScript 5.0+)
- **tslib**: 2.6.x

These versions are fully compatible and tested together.

### Rollup Plugin Compatibility

All Rollup plugins are now on compatible versions for Rollup 3:

- **rollup**: 3.29.x
- **@rollup/plugin-typescript**: 11.1.x
- **@rollup/plugin-node-resolve**: 15.2.x
- **@rollup/plugin-commonjs**: 25.0.x
- **@rollup/plugin-terser**: 0.4.4 (official Rollup 3 compatible replacement)
- **rollup-plugin-visualizer**: 5.12.x

**Note**: `@rollup/plugin-terser` replaces the deprecated `rollup-plugin-terser` and is the official minification plugin for Rollup 3.

### Framework Compatibility

- **React**: 16.8+ || 17.x || 18.x (peer dependency)
- **Vue**: 3.4.x (dev) / 3.0+ (peer)
- **Angular**: 16.2.x (dev) / 14.x || 15.x || 16.x (peer)

## Benefits of These Changes

### 1. Rollup 3 Full Compatibility

Replaced deprecated `rollup-plugin-terser` with official `@rollup/plugin-terser`:
- Full compatibility with Rollup 3.x
- Uses officially maintained plugin
- Better performance and smaller output
- Receives ongoing updates and support

### 2. Better Version Flexibility

Using caret ranges (^) allows npm/yarn to install compatible patch and minor updates automatically, ensuring:
- Security fixes are applied automatically
- Bug fixes are received without manual updates
- Breaking changes are avoided (major versions still locked)

### 3. Resolved TypeScript Compatibility

TypeScript 5.3.0 is the latest stable version and is fully compatible with:
- @rollup/plugin-typescript 11.1.x
- All ESLint TypeScript plugins
- All framework type definitions

### 4. Added Missing Dependency

`tslib` was missing but is required by `@rollup/plugin-typescript`. Adding it explicitly:
- Prevents installation warnings
- Ensures consistent version across builds
- Reduces final bundle size through helper reuse

### 5. Yarn Compatibility

The `resolutions` field ensures Yarn users won't encounter version conflicts in nested dependencies.

### 6. Clear Engine Requirements

The `engines` field helps developers know minimum requirements upfront and prevents issues with older Node.js versions.

## Migration Guide

### For npm Users

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Install with new versions
npm install
```

### For Yarn Users

```bash
# Remove old dependencies
rm -rf node_modules yarn.lock

# Install with new versions
yarn install
```

### For pnpm Users

```bash
# Remove old dependencies
rm -rf node_modules pnpm-lock.yaml

# Install with new versions
pnpm install
```

## Verification

After updating, verify everything works:

```bash
# Check TypeScript compilation
npm run type-check

# Build all bundles
npm run build

# Run tests
npm run test

# Check bundle sizes
npm run size
```

All commands should complete successfully with no errors.

## Version Ranges Explained

### Caret (^) Range

`^5.3.0` means:
- ✅ 5.3.0 (exact match)
- ✅ 5.3.1 (patch updates)
- ✅ 5.4.0 (minor updates)
- ❌ 6.0.0 (major updates - breaking changes)

This provides a good balance between:
- **Stability**: No breaking changes
- **Security**: Automatic security patches
- **Features**: New minor features and improvements

## Testing Done

All changes have been validated:

- ✅ TypeScript compilation successful
- ✅ Rollup builds all bundles correctly
- ✅ No peer dependency warnings
- ✅ All plugins work together
- ✅ Compatible with npm, yarn, and pnpm
- ✅ Zero linter errors

## Rollback Instructions

If you need to revert these changes:

```bash
# Restore original package.json from git
git checkout HEAD -- package.json

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Future Maintenance

### Updating Dependencies

To check for updates:

```bash
# Check for outdated packages
npm outdated

# Or use npm-check-updates
npx npm-check-updates
```

To update (carefully):

```bash
# Update patch and minor versions (respects ^)
npm update

# Update to latest versions (use with caution)
npx npm-check-updates -u
npm install
```

Always test after updating:
1. Run `npm run type-check`
2. Run `npm run build`
3. Run `npm run test`
4. Check that bundle sizes haven't increased significantly

## Conclusion

These updates ensure:
- ✅ **Full Rollup 3 compatibility** with official @rollup/plugin-terser
- ✅ All dependencies are compatible
- ✅ Build system works reliably
- ✅ Package manager flexibility (npm/yarn/pnpm)
- ✅ Future-proof with semantic versioning
- ✅ Security updates applied automatically
- ✅ No breaking changes introduced
- ✅ Uses officially maintained plugins

The package is now production-ready with properly managed dependencies and full Rollup 3 support.

## Quick Reference: All Rollup Plugins

All official Rollup 3 compatible plugins:

```json
{
  "rollup": "^3.29.0",
  "@rollup/plugin-typescript": "^11.1.0",
  "@rollup/plugin-node-resolve": "^15.2.0",
  "@rollup/plugin-commonjs": "^25.0.0",
  "@rollup/plugin-terser": "^0.4.4"
}
```

All plugins are official `@rollup/*` packages except `rollup-plugin-visualizer` which is community-maintained but Rollup 3 compatible.

