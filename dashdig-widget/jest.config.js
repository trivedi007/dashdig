/**
 * Jest Configuration
 * Comprehensive testing setup for DashDig Widget
 */

module.exports = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  // Use jsdom for browser environment simulation
  testEnvironment: 'jsdom',
  
  // Roots for test discovery
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/__tests__/**/*.tsx',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).tsx'
  ],
  
  // Module name mapping for TypeScript paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@dashdig/widget$': '<rootDir>/src/index.ts',
    '^@dashdig/widget/react$': '<rootDir>/src/integrations/react/index.ts',
    '^@dashdig/widget/vue$': '<rootDir>/src/integrations/vue/index.ts',
    '^@dashdig/widget/angular$': '<rootDir>/src/integrations/angular/index.ts',
  },
  
  // Setup files to run after environment is set up
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Coverage collection configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts'
  ],
  
  // Coverage thresholds (80% across all metrics)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Transform files with ts-jest
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  },
  
  // File extensions to consider
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/examples/'
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(@dashdig)/)'
  ],
  
  // Global setup/teardown
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  
  // Verbose output
  verbose: true,
  
  // Timeout for tests (10 seconds)
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Reset mocks between tests
  resetMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true
};

