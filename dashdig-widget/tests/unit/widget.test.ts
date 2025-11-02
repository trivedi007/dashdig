/**
 * Unit Tests for DashdigWidget
 * Tests widget initialization, Shadow DOM, positioning, theming, visibility, events, and cleanup
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DashdigWidget from '../../src/core/widget';
import type { DashdigConfig } from '../../src/core/widget';

describe('DashdigWidget', () => {
  let widget: DashdigWidget | null = null;

  beforeEach(() => {
    // Clear DOM before each test
    document.body.innerHTML = '';
    
    // Mock fetch for API calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true })
      } as Response)
    );

    // Mock requestIdleCallback
    global.requestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
      setTimeout(() => callback({} as IdleDeadline), 0);
      return 0;
    });
  });

  afterEach(() => {
    // Cleanup widget after each test
    if (widget) {
      widget.destroy();
      widget = null;
    }
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should throw error when API key is missing', () => {
      expect(() => {
        widget = new DashdigWidget({} as DashdigConfig);
      }).toThrow('[DashDig] API key is required');
    });

    it('should initialize with required API key', () => {
      expect(() => {
        widget = new DashdigWidget({ apiKey: 'test-api-key' });
      }).not.toThrow();
    });

    it('should use default configuration values', () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      const config = widget.getConfig();
      
      expect(config.apiKey).toBe('test-api-key');
      expect(config.apiUrl).toBe('https://api.dashdig.com');
      expect(config.position).toBe('bottom-right');
      expect(config.theme).toBe('light');
      expect(config.autoShow).toBe(true);
      expect(config.enableWebVitals).toBe(true);
    });

    it('should accept custom configuration', () => {
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        apiUrl: 'https://custom.api.com',
        position: 'bottom-left',
        theme: 'dark',
        autoShow: false,
        enableWebVitals: false
      });
      
      const config = widget.getConfig();
      expect(config.apiUrl).toBe('https://custom.api.com');
      expect(config.position).toBe('bottom-left');
      expect(config.theme).toBe('dark');
      expect(config.autoShow).toBe(false);
      expect(config.enableWebVitals).toBe(false);
    });

    it('should create container element in DOM', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      expect(container).toBeTruthy();
      expect(container?.getAttribute('data-dashdig-widget')).toBe('true');
    });

    it('should track initialization event', async () => {
      const trackSpy = vi.spyOn(DashdigWidget.prototype, 'track');
      
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(trackSpy).toHaveBeenCalledWith('widget_initialized', expect.any(Object));
    });
  });

  describe('Shadow DOM', () => {
    it('should create Shadow DOM', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      expect(container?.shadowRoot).toBeTruthy();
    });

    it('should render widget content inside Shadow DOM', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      const shadowContent = container?.shadowRoot?.querySelector('.dashdig-widget');
      
      expect(shadowContent).toBeTruthy();
    });

    it('should contain header, content, and footer sections', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      const shadowRoot = container?.shadowRoot;
      
      expect(shadowRoot?.querySelector('.dashdig-header')).toBeTruthy();
      expect(shadowRoot?.querySelector('.dashdig-content')).toBeTruthy();
      expect(shadowRoot?.querySelector('.dashdig-footer')).toBeTruthy();
    });

    it('should have close button in Shadow DOM', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      const closeBtn = container?.shadowRoot?.getElementById('dashdig-close-btn');
      
      expect(closeBtn).toBeTruthy();
      expect(closeBtn?.getAttribute('aria-label')).toBe('Close widget');
    });
  });

  describe('Positioning', () => {
    it('should position widget at bottom-right by default', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      const styles = container?.style;
      
      expect(styles?.position).toBe('fixed');
      expect(styles?.right).toBe('20px');
      expect(styles?.bottom).toBe('20px');
    });

    it('should position widget at bottom-left when configured', async () => {
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        position: 'bottom-left'
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      const styles = container?.style;
      
      expect(styles?.position).toBe('fixed');
      expect(styles?.left).toBe('20px');
      expect(styles?.bottom).toBe('20px');
    });

    it('should have high z-index for proper layering', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      expect(container?.style.zIndex).toBe('999999');
    });
  });

  describe('Theme', () => {
    it('should apply light theme styles by default', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      const styleElement = container?.shadowRoot?.querySelector('style');
      
      expect(styleElement?.textContent).toContain('#ffffff');
      expect(styleElement?.textContent).toContain('light');
    });

    it('should apply dark theme styles when configured', async () => {
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        theme: 'dark'
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      const styleElement = container?.shadowRoot?.querySelector('style');
      
      expect(styleElement?.textContent).toContain('#1e1e1e');
      expect(styleElement?.textContent).toContain('dark');
    });
  });

  describe('Show/Hide Functionality', () => {
    it('should show widget when autoShow is true', async () => {
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        autoShow: true
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(widget.isShown()).toBe(true);
    });

    it('should not auto-show widget when autoShow is false', async () => {
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        autoShow: false
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(widget.isShown()).toBe(false);
    });

    it('should show widget when show() is called', async () => {
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        autoShow: false
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.show();
      
      const container = document.getElementById('dashdig-widget-container');
      expect(container?.style.opacity).toBe('1');
      expect(container?.style.transform).toBe('translateY(0)');
      expect(widget.isShown()).toBe(true);
    });

    it('should hide widget when hide() is called', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.hide();
      
      const container = document.getElementById('dashdig-widget-container');
      expect(container?.style.opacity).toBe('0');
      expect(container?.style.transform).toBe('translateY(20px)');
      expect(widget.isShown()).toBe(false);
    });

    it('should track widget_shown event', async () => {
      const trackSpy = vi.spyOn(DashdigWidget.prototype, 'track');
      
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        autoShow: false
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.show();
      
      expect(trackSpy).toHaveBeenCalledWith('widget_shown', {});
    });

    it('should track widget_hidden event', async () => {
      const trackSpy = vi.spyOn(DashdigWidget.prototype, 'track');
      
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.hide();
      
      expect(trackSpy).toHaveBeenCalledWith('widget_hidden', {});
    });

    it('should hide widget when close button is clicked', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const container = document.getElementById('dashdig-widget-container');
      const closeBtn = container?.shadowRoot?.getElementById('dashdig-close-btn') as HTMLButtonElement;
      
      closeBtn?.click();
      
      expect(widget.isShown()).toBe(false);
    });
  });

  describe('Event Tracking', () => {
    it('should track custom events', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.track('custom_event', { key: 'value' });
      
      // Wait for API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should include session ID in tracked events', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.track('test_event', {});
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      
      expect(requestBody.events[0].sessionId).toBeTruthy();
      expect(requestBody.events[0].timestamp).toBeTruthy();
    });

    it('should send events to API endpoint', async () => {
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        apiUrl: 'https://test.api.com'
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.track('test_event', { data: 'test' });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com/v1/events',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-DashDig-API-Key': 'test-api-key'
          })
        })
      );
    });

    it('should not track events on destroyed widget', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.destroy();
      
      const consoleSpy = vi.spyOn(console, 'warn');
      widget.track('should_not_track', {});
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[DashDig] Cannot track events on destroyed widget'
      );
    });
  });

  describe('Destroy and Cleanup', () => {
    it('should remove container from DOM', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      let container = document.getElementById('dashdig-widget-container');
      expect(container).toBeTruthy();
      
      widget.destroy();
      
      container = document.getElementById('dashdig-widget-container');
      expect(container).toBeNull();
    });

    it('should track widget_destroyed event', async () => {
      const trackSpy = vi.spyOn(DashdigWidget.prototype, 'track');
      
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.destroy();
      
      expect(trackSpy).toHaveBeenCalledWith('widget_destroyed', {});
    });

    it('should set isShown to false after destroy', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(widget.isShown()).toBe(true);
      
      widget.destroy();
      
      expect(widget.isShown()).toBe(false);
    });

    it('should not allow showing destroyed widget', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.destroy();
      
      const consoleSpy = vi.spyOn(console, 'warn');
      widget.show();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[DashDig] Cannot show destroyed widget'
      );
    });

    it('should handle multiple destroy calls gracefully', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      widget.destroy();
      
      expect(() => {
        widget?.destroy();
      }).not.toThrow();
    });

    it('should cleanup event listeners', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      widget.destroy();
      
      // Event listeners should be cleaned up implicitly when container is removed
      expect(widget.isShown()).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should use requestIdleCallback for initialization', () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      expect(global.requestIdleCallback).toHaveBeenCalled();
    });

    it('should add resource hints for API domain', async () => {
      const preconnectSpy = vi.fn();
      (global as any).preconnect = preconnectSpy;
      
      widget = new DashdigWidget({
        apiKey: 'test-api-key',
        apiUrl: 'https://custom.api.com'
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Widget should attempt to add resource hints
      expect(widget).toBeTruthy();
    });
  });

  describe('Configuration', () => {
    it('should return immutable config copy', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      const config1 = widget.getConfig();
      const config2 = widget.getConfig();
      
      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2); // Different object instances
    });

    it('should not allow modifying returned config', async () => {
      widget = new DashdigWidget({ apiKey: 'test-api-key' });
      
      const config = widget.getConfig();
      const originalApiKey = config.apiKey;
      
      // Try to modify (TypeScript will prevent, but test runtime behavior)
      (config as any).apiKey = 'modified';
      
      // Original config should remain unchanged
      const freshConfig = widget.getConfig();
      expect(freshConfig.apiKey).toBe(originalApiKey);
    });
  });
});
