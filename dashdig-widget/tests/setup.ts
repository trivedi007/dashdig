/**
 * Global Test Setup
 * Configuration and setup for Vitest tests
 */

import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom';

// Extend Vitest's expect with jest-dom matchers
// This provides helpful matchers like toBeInTheDocument(), toHaveClass(), etc.

// Clean up after each test automatically
// Conditionally import React testing utilities only when React is available
afterEach(() => {
  vi.clearAllMocks();
});

// Mock global objects if needed
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock fetch if not available
if (typeof global.fetch === 'undefined') {
  global.fetch = vi.fn();
}

// Console spy to suppress expected errors during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress React error boundary errors in tests
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Error: Uncaught')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    // Suppress specific warnings if needed
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
