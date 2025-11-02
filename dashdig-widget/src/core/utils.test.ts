/**
 * Sample test file to verify testing environment setup
 */

import { describe, it, expect } from 'vitest';

describe('Testing Environment', () => {
  it('should be configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should have access to jsdom environment', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });

  it('should support async tests', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
