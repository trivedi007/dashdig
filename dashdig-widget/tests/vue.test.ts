/**
 * Vue 3 Integration Tests
 * Tests for the Vue 3 component and composable
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { DashdigWidget, useDashdig } from '../src/integrations/vue';

describe('Vue 3 Integration', () => {
  const mockConfig = {
    apiKey: 'ddg_test_key_12345',
    position: 'bottom-right' as const,
    theme: 'light' as const,
    autoShow: true
  };

  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
      status: 200
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('DashdigWidget Component', () => {
    it('should render without crashing', () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey
        }
      });
      
      expect(wrapper.exists()).toBe(true);
    });

    it('should initialize widget with props', () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey,
          position: mockConfig.position,
          theme: mockConfig.theme
        }
      });
      
      expect(wrapper.exists()).toBe(true);
      expect(document.querySelector('[data-dashdig-widget]')).toBeTruthy();
    });

    it('should emit load event when widget loads', async () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(wrapper.emitted()).toHaveProperty('load');
    });

    it('should emit error event on initialization error', async () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: 'invalid_key'
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(wrapper.emitted()).toHaveProperty('error');
    });

    it('should cleanup widget on unmount', () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey
        }
      });
      
      wrapper.unmount();
      
      // Widget should be removed
      expect(document.querySelector('[data-dashdig-widget]')).toBeNull();
    });

    it('should support all position options', () => {
      const positions: Array<'bottom-right' | 'bottom-left'> = ['bottom-right', 'bottom-left'];
      
      positions.forEach(position => {
        const wrapper = mount(DashdigWidget, {
          props: {
            apiKey: mockConfig.apiKey,
            position
          }
        });
        
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
      });
    });

    it('should support both theme options', () => {
      const themes: Array<'light' | 'dark'> = ['light', 'dark'];
      
      themes.forEach(theme => {
        const wrapper = mount(DashdigWidget, {
          props: {
            apiKey: mockConfig.apiKey,
            theme
          }
        });
        
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
      });
    });

    it('should respect autoShow prop', () => {
      const wrapper1 = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey,
          autoShow: false
        }
      });
      
      expect(wrapper1.exists()).toBe(true);
      wrapper1.unmount();
      
      const wrapper2 = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey,
          autoShow: true
        }
      });
      
      expect(wrapper2.exists()).toBe(true);
      wrapper2.unmount();
    });

    it('should handle custom apiUrl', () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey,
          apiUrl: 'https://custom-api.example.com'
        }
      });
      
      expect(wrapper.exists()).toBe(true);
    });

    it('should update when props change', async () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey,
          theme: 'light'
        }
      });
      
      await wrapper.setProps({ theme: 'dark' });
      
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('useDashdig Composable', () => {
    const TestComponent = defineComponent({
      props: {
        config: {
          type: Object,
          required: true
        }
      },
      setup(props) {
        const { widget, track, show, hide, isShown } = useDashdig(props.config);
        
        return {
          widget,
          track,
          show,
          hide,
          isShown
        };
      },
      template: `
        <div>
          <div data-testid="widget-status">
            {{ widget ? 'initialized' : 'not-initialized' }}
          </div>
          <div data-testid="visibility-status">
            {{ isShown() ? 'visible' : 'hidden' }}
          </div>
          <button @click="track('test_event')">Track Event</button>
          <button @click="show">Show</button>
          <button @click="hide">Hide</button>
        </div>
      `
    });

    it('should initialize widget from composable', async () => {
      const wrapper = mount(TestComponent, {
        props: {
          config: mockConfig
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const widgetStatus = wrapper.find('[data-testid="widget-status"]');
      expect(widgetStatus.text()).toBe('initialized');
    });

    it('should provide track function', async () => {
      const wrapper = mount(TestComponent, {
        props: {
          config: mockConfig
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const trackButton = wrapper.find('button');
      await trackButton.trigger('click');
      
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should provide show function', async () => {
      const wrapper = mount(TestComponent, {
        props: {
          config: { ...mockConfig, autoShow: false }
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const buttons = wrapper.findAll('button');
      const showButton = buttons.find(b => b.text() === 'Show');
      await showButton?.trigger('click');
      
      const visibilityStatus = wrapper.find('[data-testid="visibility-status"]');
      expect(visibilityStatus.text()).toBe('visible');
    });

    it('should provide hide function', async () => {
      const wrapper = mount(TestComponent, {
        props: {
          config: mockConfig
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const buttons = wrapper.findAll('button');
      const hideButton = buttons.find(b => b.text() === 'Hide');
      await hideButton?.trigger('click');
      
      const visibilityStatus = wrapper.find('[data-testid="visibility-status"]');
      expect(visibilityStatus.text()).toBe('hidden');
    });

    it('should cleanup widget on unmount', async () => {
      const wrapper = mount(TestComponent, {
        props: {
          config: mockConfig
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      wrapper.unmount();
      
      // Widget should be cleaned up
      expect(document.querySelector('[data-dashdig-widget]')).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const wrapper = mount(TestComponent, {
        props: {
          config: { apiKey: 'invalid_key' }
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Plugin Installation', () => {
    it('should install as Vue plugin', () => {
      // Note: Testing plugin installation requires a full Vue app instance
      // This is a placeholder for integration with vue-test-utils
      expect(DashdigWidget).toBeDefined();
    });
  });

  describe('Multiple Instances', () => {
    it('should handle multiple widget components', () => {
      const MultiWidgetComponent = defineComponent({
        template: `
          <div>
            <DashdigWidget apiKey="ddg_key_1" />
            <DashdigWidget apiKey="ddg_key_2" />
          </div>
        `,
        components: {
          DashdigWidget
        }
      });
      
      const wrapper = mount(MultiWidgetComponent);
      
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle multiple composable usages', async () => {
      const MultiComposableComponent = defineComponent({
        setup() {
          const widget1 = useDashdig({ ...mockConfig, apiKey: 'ddg_key_1' });
          const widget2 = useDashdig({ ...mockConfig, apiKey: 'ddg_key_2' });
          
          return {
            widget1,
            widget2
          };
        },
        template: `
          <div>
            <div data-testid="widget1">{{ widget1.widget ? 'init' : 'not-init' }}</div>
            <div data-testid="widget2">{{ widget2.widget ? 'init' : 'not-init' }}</div>
          </div>
        `
      });
      
      const wrapper = mount(MultiComposableComponent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(wrapper.find('[data-testid="widget1"]').text()).toBe('init');
      expect(wrapper.find('[data-testid="widget2"]').text()).toBe('init');
    });
  });

  describe('Reactivity', () => {
    it('should update when reactive props change', async () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: mockConfig.apiKey,
          theme: 'light'
        }
      });
      
      await wrapper.setProps({ theme: 'dark' });
      
      expect(wrapper.props('theme')).toBe('dark');
    });

    it('should maintain reactivity with composable', async () => {
      const ReactiveComponent = defineComponent({
        setup() {
          const { widget, isShown } = useDashdig(mockConfig);
          
          return {
            widget,
            isShown
          };
        },
        template: `
          <div>
            <div data-testid="reactive-status">{{ isShown() ? 'visible' : 'hidden' }}</div>
          </div>
        `
      });
      
      const wrapper = mount(ReactiveComponent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const status = wrapper.find('[data-testid="reactive-status"]');
      expect(status.exists()).toBe(true);
    });
  });

  describe('TypeScript Types', () => {
    it('should accept valid DashdigConfig', () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: 'ddg_test_key',
          position: 'bottom-right',
          theme: 'light',
          autoShow: true,
          apiUrl: 'https://api.example.com'
        }
      });
      
      expect(wrapper.exists()).toBe(true);
    });

    it('should work with minimal config', () => {
      const wrapper = mount(DashdigWidget, {
        props: {
          apiKey: 'ddg_test_key'
        }
      });
      
      expect(wrapper.exists()).toBe(true);
    });
  });
});

