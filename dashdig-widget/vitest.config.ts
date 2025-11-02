/**
 * Vitest Configuration
 * Unit testing configuration for DashDig Widget
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'examples/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/index.ts',
        '**/*.spec.{ts,tsx}',
        '**/*.test.{ts,tsx}'
      ],
      // Coverage thresholds - targeting 80% coverage
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      },
      // Enable all coverage checks
      all: true,
      // Include source files for coverage
      include: ['src/**/*.{ts,tsx}']
    },
    include: ['src/**/*.{test,spec}.{js,ts,tsx}', 'tests/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', 'examples']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@integrations': path.resolve(__dirname, './src/integrations'),
      '@standalone': path.resolve(__dirname, './src/standalone')
    }
  }
});
