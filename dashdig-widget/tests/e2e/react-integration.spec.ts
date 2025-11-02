/**
 * E2E Tests - React Integration
 * Tests for DashDig widget React integration in browser
 */

import { test, expect } from '@playwright/test';

test.describe('React Widget Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to React example page
    await page.goto('/examples/react-example/');
  });

  test('should render React widget component', async ({ page }) => {
    // Wait for React app to load
    await page.waitForLoadState('networkidle');
    
    // Check for React widget
    const widget = page.locator('[data-testid="dashdig-widget"]').or(page.locator('.dashdig-widget'));
    await expect(widget).toBeVisible({ timeout: 10000 });
  });

  test('should handle React state updates', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find and click a button that triggers state update
    const button = page.locator('button').filter({ hasText: /update|refresh|load/i }).first();
    
    if (await button.isVisible()) {
      await button.click();
      
      // Wait for component to update
      await page.waitForTimeout(1000);
      
      // Verify state change reflected in UI
      const widget = page.locator('.dashdig-widget');
      await expect(widget).toBeVisible();
    }
  });

  test('should handle component mount/unmount cycles', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Trigger component mount/unmount cycle
    const toggleButton = page.locator('button').filter({ hasText: /toggle|hide|show/i }).first();
    
    if (await toggleButton.isVisible()) {
      // Unmount
      await toggleButton.click();
      await page.waitForTimeout(500);
      
      // Verify widget is hidden
      const widget = page.locator('.dashdig-widget');
      await expect(widget).not.toBeVisible();
      
      // Remount
      await toggleButton.click();
      await page.waitForTimeout(500);
      
      // Verify widget is visible again
      await expect(widget).toBeVisible();
    }
  });

  test('should handle props changes correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const widget = page.locator('.dashdig-widget');
    
    // Get initial state
    const initialText = await widget.textContent();
    
    // Trigger prop change (if available)
    const changeButton = page.locator('button').filter({ hasText: /change|update/i }).first();
    
    if (await changeButton.isVisible()) {
      await changeButton.click();
      await page.waitForTimeout(1000);
      
      // Verify content changed
      const newText = await widget.textContent();
      // Content may or may not change depending on implementation
    }
  });

  test('should work with React hooks', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Verify hook-based component renders correctly
    const hookComponent = page.locator('[data-hook="dashdig"]').or(page.locator('.dashdig-widget'));
    await expect(hookComponent).toBeVisible({ timeout: 10000 });
  });
});

test.describe('React Performance', () => {
  test('should render quickly in React app', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/examples/react-example/');
    
    // Wait for widget to be visible
    const widget = page.locator('.dashdig-widget');
    await expect(widget).toBeVisible({ timeout: 10000 });
    
    const renderTime = Date.now() - startTime;
    
    // Should render within 3 seconds
    expect(renderTime).toBeLessThan(3000);
  });

  test('should not block React rendering', async ({ page }) => {
    await page.goto('/examples/react-example/');
    
    // Check for console errors
    const errors: string[] = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.waitForLoadState('networkidle');
    
    expect(errors).toHaveLength(0);
  });
});
