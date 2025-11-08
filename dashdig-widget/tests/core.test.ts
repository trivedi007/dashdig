/**
 * Core Widget Tests
 * Tests for the core DashDig widget functionality
 */

import DashdigWidget from '../src/core/widget';
import type { DashdigConfig } from '../src/core/widget';

describe('DashDig Core Widget', () => {
  let widget: DashdigWidget;
  const mockConfig: DashdigConfig = {
    apiKey: 'ddg_test_key_12345',
    position: 'bottom-right',
    theme: 'light',
    autoShow: true
  };

  beforeEach(() => {
    // Clear any existing instances
    jest.clearAllMocks();
    
    // Mock fetch for API calls
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
      text: async () => 'OK',
      status: 200,
      headers: new Headers()
    });
  });

  afterEach(() => {
    // Cleanup widget instance
    if (widget) {
      widget.destroy();
    }
  });

  describe('Initialization', () => {
    it('should create a new widget instance with valid config', () => {
      widget = new DashdigWidget(mockConfig);
      expect(widget).toBeInstanceOf(DashdigWidget);
    });

    it('should throw error with invalid API key format', () => {
      const invalidConfig = { ...mockConfig, apiKey: 'invalid_key' };
      expect(() => new DashdigWidget(invalidConfig)).toThrow();
    });

    it('should throw error without required apiKey', () => {
      const invalidConfig = { ...mockConfig, apiKey: '' };
      expect(() => new DashdigWidget(invalidConfig)).toThrow('API key is required');
    });

    it('should use default position if not provided', () => {
      const configWithoutPosition = { ...mockConfig };
      delete (configWithoutPosition as any).position;
      widget = new DashdigWidget(configWithoutPosition);
      expect(widget).toBeDefined();
    });

    it('should use default theme if not provided', () => {
      const configWithoutTheme = { ...mockConfig };
      delete (configWithoutTheme as any).theme;
      widget = new DashdigWidget(configWithoutTheme);
      expect(widget).toBeDefined();
    });
  });

  describe('Widget Visibility', () => {
    beforeEach(() => {
      widget = new DashdigWidget(mockConfig);
    });

    it('should show widget', () => {
      widget.show();
      expect(widget.isVisible()).toBe(true);
    });

    it('should hide widget', () => {
      widget.show();
      widget.hide();
      expect(widget.isVisible()).toBe(false);
    });

    it('should toggle widget visibility', () => {
      const initialState = widget.isVisible();
      widget.toggle();
      expect(widget.isVisible()).toBe(!initialState);
    });

    it('should auto-show widget if autoShow is true', () => {
      const autoShowWidget = new DashdigWidget({ ...mockConfig, autoShow: true });
      expect(autoShowWidget.isVisible()).toBe(true);
      autoShowWidget.destroy();
    });

    it('should not auto-show widget if autoShow is false', () => {
      const noAutoShowWidget = new DashdigWidget({ ...mockConfig, autoShow: false });
      expect(noAutoShowWidget.isVisible()).toBe(false);
      noAutoShowWidget.destroy();
    });
  });

  describe('Event Tracking', () => {
    beforeEach(() => {
      widget = new DashdigWidget(mockConfig);
    });

    it('should track page view event', async () => {
      await widget.track('page_view');
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should track custom event with data', async () => {
      const eventData = { button: 'signup', page: 'homepage' };
      await widget.track('button_click', eventData);
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('button_click')
        })
      );
    });

    it('should batch multiple events', async () => {
      await widget.track('event1');
      await widget.track('event2');
      await widget.track('event3');
      
      // Should make API calls
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle tracking errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      await expect(widget.track('test_event')).rejects.toThrow('Network error');
    });
  });

  describe('Configuration', () => {
    it('should get current configuration', () => {
      widget = new DashdigWidget(mockConfig);
      const config = widget.getConfig();
      
      expect(config).toMatchObject({
        apiKey: mockConfig.apiKey,
        position: mockConfig.position,
        theme: mockConfig.theme
      });
    });

    it('should update configuration', () => {
      widget = new DashdigWidget(mockConfig);
      
      widget.updateConfig({ theme: 'dark' });
      
      const config = widget.getConfig();
      expect(config.theme).toBe('dark');
    });

    it('should not allow updating apiKey', () => {
      widget = new DashdigWidget(mockConfig);
      
      expect(() => {
        widget.updateConfig({ apiKey: 'new_key' } as any);
      }).toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should destroy widget instance', () => {
      widget = new DashdigWidget(mockConfig);
      widget.destroy();
      
      // Widget should be cleaned up
      expect(widget.isVisible()).toBe(false);
    });

    it('should remove event listeners on destroy', () => {
      widget = new DashdigWidget(mockConfig);
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      widget.destroy();
      
      expect(removeEventListenerSpy).toHaveBeenCalled();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      widget = new DashdigWidget(mockConfig);
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });
      
      await expect(widget.track('test_event')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      widget = new DashdigWidget(mockConfig);
      
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      await expect(widget.track('test_event')).rejects.toThrow('Network error');
    });

    it('should validate event names', async () => {
      widget = new DashdigWidget(mockConfig);
      
      await expect(widget.track('')).rejects.toThrow('Event name is required');
    });
  });

  describe('Position', () => {
    it('should support bottom-right position', () => {
      widget = new DashdigWidget({ ...mockConfig, position: 'bottom-right' });
      const config = widget.getConfig();
      expect(config.position).toBe('bottom-right');
    });

    it('should support bottom-left position', () => {
      widget = new DashdigWidget({ ...mockConfig, position: 'bottom-left' });
      const config = widget.getConfig();
      expect(config.position).toBe('bottom-left');
    });
  });

  describe('Theme', () => {
    it('should support light theme', () => {
      widget = new DashdigWidget({ ...mockConfig, theme: 'light' });
      const config = widget.getConfig();
      expect(config.theme).toBe('light');
    });

    it('should support dark theme', () => {
      widget = new DashdigWidget({ ...mockConfig, theme: 'dark' });
      const config = widget.getConfig();
      expect(config.theme).toBe('dark');
    });
  });

  describe('API URL Configuration', () => {
    it('should use custom API URL if provided', () => {
      const customApiUrl = 'https://custom-api.example.com';
      widget = new DashdigWidget({ ...mockConfig, apiUrl: customApiUrl });
      
      const config = widget.getConfig();
      expect(config.apiUrl).toBe(customApiUrl);
    });

    it('should use default API URL if not provided', () => {
      widget = new DashdigWidget(mockConfig);
      
      const config = widget.getConfig();
      expect(config.apiUrl).toBeDefined();
    });
  });
});

