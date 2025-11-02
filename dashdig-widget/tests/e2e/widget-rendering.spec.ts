/**
 * E2E Tests - Widget Rendering
 * Tests for DashDig widget rendering in browser
 */

import { test, expect } from '@playwright/test';

test.describe('DashDig Widget Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to test page
    await page.goto('/test.html');
  });

  test('should render widget on page load', async ({ page }) => {
    // Wait for widget to be visible
    const widget = page.locator('.dashdig-widget');
    await expect(widget).toBeVisible();
  });

  test('should display correct initial state', async ({ page }) => {
    // Check for key widget elements
    const widget = page.locator('.dashdig-widget');
    await expect(widget).toBeVisible();
    
    // Verify widget has correct attributes
    const widgetId = await widget.getAttribute('data-widget-id');
    expect(widgetId).toBeTruthy();
  });

  test('should handle API responses correctly', async ({ page }) => {
    // Wait for API call to complete
    const response = await page.waitForResponse(
      response => response.url().includes('/api/') && response.status() === 200
    );
    
    expect(response.ok()).toBeTruthy();
    
    // Verify data is displayed after API call
    const dataContainer = page.locator('.dashdig-data');
    await expect(dataContainer).toBeVisible({ timeout: 5000 });
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const widget = page.locator('.dashdig-widget');
    await expect(widget).toBeVisible();
    
    // Verify widget adapts to mobile size
    const boundingBox = await widget.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });

  test('should load without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/test.html');
    await page.waitForLoadState('networkidle');
    
    expect(errors).toHaveLength(0);
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/test.html');
    
    // Widget should still render with error state
    const widget = page.locator('.dashdig-widget');
    await expect(widget).toBeVisible();
    
    // Check for error message
    const errorMessage = page.locator('.dashdig-error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Widget Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test.html');
  });

  test('should handle button clicks', async ({ page }) => {
    const button = page.locator('.dashdig-button');
    await button.waitFor({ state: 'visible' });
    
    await button.click();
    
    // Verify click triggered expected behavior
    const response = page.locator('.dashdig-response');
    await expect(response).toBeVisible({ timeout: 3000 });
  });

  test('should update on data refresh', async ({ page }) => {
    const refreshButton = page.locator('[data-action="refresh"]');
    
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      
      // Wait for loading state
      const loader = page.locator('.dashdig-loading');
      await expect(loader).toBeVisible();
      
      // Wait for data to reload
      await expect(loader).not.toBeVisible({ timeout: 5000 });
    }
  });
});
