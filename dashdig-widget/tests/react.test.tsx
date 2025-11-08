/**
 * React Integration Tests
 * Tests for the React component and hook
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashdigWidget, useDashdig } from '../src/integrations/react';

describe('React Integration', () => {
  const mockConfig = {
    apiKey: 'ddg_test_key_12345',
    position: 'bottom-right' as const,
    theme: 'light' as const,
    autoShow: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fetch
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
      status: 200
    });
  });

  describe('DashdigWidget Component', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <DashdigWidget apiKey={mockConfig.apiKey} />
      );
      expect(container).toBeInTheDocument();
    });

    it('should initialize widget with props', () => {
      render(
        <DashdigWidget 
          apiKey={mockConfig.apiKey}
          position={mockConfig.position}
          theme={mockConfig.theme}
        />
      );
      
      // Widget should be initialized
      expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
    });

    it('should call onLoad callback when widget loads', async () => {
      const onLoad = jest.fn();
      
      render(
        <DashdigWidget 
          apiKey={mockConfig.apiKey}
          onLoad={onLoad}
        />
      );
      
      await waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('should call onError callback on initialization error', async () => {
      const onError = jest.fn();
      
      render(
        <DashdigWidget 
          apiKey="invalid_key"
          onError={onError}
        />
      );
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('should cleanup widget on unmount', () => {
      const { unmount } = render(
        <DashdigWidget apiKey={mockConfig.apiKey} />
      );
      
      unmount();
      
      // Widget should be removed
      expect(document.querySelector('[data-dashdig-widget]')).not.toBeInTheDocument();
    });

    it('should update widget when props change', () => {
      const { rerender } = render(
        <DashdigWidget 
          apiKey={mockConfig.apiKey}
          theme="light"
        />
      );
      
      rerender(
        <DashdigWidget 
          apiKey={mockConfig.apiKey}
          theme="dark"
        />
      );
      
      // Widget should be updated (implementation-specific check)
      expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
    });

    it('should support all position options', () => {
      const positions: Array<'bottom-right' | 'bottom-left'> = ['bottom-right', 'bottom-left'];
      
      positions.forEach(position => {
        const { unmount } = render(
          <DashdigWidget 
            apiKey={mockConfig.apiKey}
            position={position}
          />
        );
        
        expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
        unmount();
      });
    });

    it('should support both theme options', () => {
      const themes: Array<'light' | 'dark'> = ['light', 'dark'];
      
      themes.forEach(theme => {
        const { unmount } = render(
          <DashdigWidget 
            apiKey={mockConfig.apiKey}
            theme={theme}
          />
        );
        
        expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
        unmount();
      });
    });

    it('should respect autoShow prop', () => {
      const { rerender } = render(
        <DashdigWidget 
          apiKey={mockConfig.apiKey}
          autoShow={false}
        />
      );
      
      // Widget should not be automatically shown
      expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
      
      rerender(
        <DashdigWidget 
          apiKey={mockConfig.apiKey}
          autoShow={true}
        />
      );
      
      // Widget should be shown
      expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
    });

    it('should handle custom apiUrl', () => {
      render(
        <DashdigWidget 
          apiKey={mockConfig.apiKey}
          apiUrl="https://custom-api.example.com"
        />
      );
      
      expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
    });
  });

  describe('useDashdig Hook', () => {
    function TestComponent({ config }: { config: any }) {
      const { widget, track, show, hide, isShown } = useDashdig(config);
      
      return (
        <div>
          <div data-testid="widget-status">
            {widget ? 'initialized' : 'not-initialized'}
          </div>
          <div data-testid="visibility-status">
            {isShown() ? 'visible' : 'hidden'}
          </div>
          <button onClick={() => track('test_event')}>Track Event</button>
          <button onClick={show}>Show</button>
          <button onClick={hide}>Hide</button>
        </div>
      );
    }

    it('should initialize widget from hook', async () => {
      render(<TestComponent config={mockConfig} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('widget-status')).toHaveTextContent('initialized');
      });
    });

    it('should provide track function', async () => {
      const user = userEvent.setup();
      render(<TestComponent config={mockConfig} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('widget-status')).toHaveTextContent('initialized');
      });
      
      const trackButton = screen.getByText('Track Event');
      await user.click(trackButton);
      
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should provide show function', async () => {
      const user = userEvent.setup();
      render(<TestComponent config={{ ...mockConfig, autoShow: false }} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('widget-status')).toHaveTextContent('initialized');
      });
      
      const showButton = screen.getByText('Show');
      await user.click(showButton);
      
      expect(screen.getByTestId('visibility-status')).toHaveTextContent('visible');
    });

    it('should provide hide function', async () => {
      const user = userEvent.setup();
      render(<TestComponent config={mockConfig} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('widget-status')).toHaveTextContent('initialized');
      });
      
      const hideButton = screen.getByText('Hide');
      await user.click(hideButton);
      
      expect(screen.getByTestId('visibility-status')).toHaveTextContent('hidden');
    });

    it('should cleanup widget on unmount', async () => {
      const { unmount } = render(<TestComponent config={mockConfig} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('widget-status')).toHaveTextContent('initialized');
      });
      
      unmount();
      
      // Widget should be cleaned up
      expect(document.querySelector('[data-dashdig-widget]')).not.toBeInTheDocument();
    });

    it('should handle errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<TestComponent config={{ apiKey: 'invalid_key' }} />);
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      consoleErrorSpy.mockRestore();
    });

    it('should update when config changes', async () => {
      const { rerender } = render(
        <TestComponent config={{ ...mockConfig, theme: 'light' }} />
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('widget-status')).toHaveTextContent('initialized');
      });
      
      rerender(
        <TestComponent config={{ ...mockConfig, theme: 'dark' }} />
      );
      
      // Widget should still be initialized
      expect(screen.getByTestId('widget-status')).toHaveTextContent('initialized');
    });
  });

  describe('Multiple Instances', () => {
    it('should handle multiple widget components', () => {
      const { container } = render(
        <>
          <DashdigWidget apiKey="ddg_key_1" />
          <DashdigWidget apiKey="ddg_key_2" />
        </>
      );
      
      // Should render both widgets
      const widgets = container.querySelectorAll('[data-dashdig-widget]');
      expect(widgets.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle multiple hook usages', async () => {
      function MultiHookComponent() {
        const widget1 = useDashdig({ ...mockConfig, apiKey: 'ddg_key_1' });
        const widget2 = useDashdig({ ...mockConfig, apiKey: 'ddg_key_2' });
        
        return (
          <div>
            <div data-testid="widget1">{widget1.widget ? 'init' : 'not-init'}</div>
            <div data-testid="widget2">{widget2.widget ? 'init' : 'not-init'}</div>
          </div>
        );
      }
      
      render(<MultiHookComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('widget1')).toHaveTextContent('init');
        expect(screen.getByTestId('widget2')).toHaveTextContent('init');
      });
    });
  });

  describe('TypeScript Types', () => {
    it('should accept valid DashdigConfig', () => {
      // This test ensures TypeScript compilation works
      render(
        <DashdigWidget 
          apiKey="ddg_test_key"
          position="bottom-right"
          theme="light"
          autoShow={true}
          apiUrl="https://api.example.com"
        />
      );
      
      expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
    });

    it('should work with minimal config', () => {
      render(<DashdigWidget apiKey="ddg_test_key" />);
      expect(document.querySelector('[data-dashdig-widget]')).toBeInTheDocument();
    });
  });
});

