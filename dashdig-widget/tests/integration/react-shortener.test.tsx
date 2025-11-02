/**
 * Integration tests for React URL Shortener components
 * Tests Provider, Hook, and Shortener component
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { DashdigProvider, useDashdig, DashdigShortener } from '../../src/integrations/react';

// Test component that uses the hook
const TestHookComponent: React.FC = () => {
  const { shorten, isInitialized, isLoading, error } = useDashdig();
  const [result, setResult] = React.useState<string>('');

  const handleClick = async () => {
    try {
      const response = await shorten({ url: 'https://example.com' });
      setResult(response.shortUrl);
    } catch (err) {
      setResult('error');
    }
  };

  return (
    <div>
      <div data-testid="initialized">{isInitialized.toString()}</div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="error">{error?.message || 'none'}</div>
      <div data-testid="result">{result}</div>
      <button onClick={handleClick}>Shorten URL</button>
    </div>
  );
};

describe('React Integration', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================================
  // Provider Tests
  // ============================================================================

  describe('DashdigProvider', () => {
    it('should initialize automatically with apiKey prop', () => {
      render(
        <DashdigProvider apiKey="test-key">
          <TestHookComponent />
        </DashdigProvider>
      );

      expect(screen.getByTestId('initialized').textContent).toBe('true');
    });

    it('should not initialize without apiKey prop', () => {
      render(
        <DashdigProvider>
          <TestHookComponent />
        </DashdigProvider>
      );

      expect(screen.getByTestId('initialized').textContent).toBe('false');
    });

    it('should pass custom baseUrl to initialization', () => {
      render(
        <DashdigProvider apiKey="test-key" baseUrl="https://custom.api.com">
          <TestHookComponent />
        </DashdigProvider>
      );

      expect(screen.getByTestId('initialized').textContent).toBe('true');
    });
  });

  // ============================================================================
  // Hook Tests
  // ============================================================================

  describe('useDashdig', () => {
    it('should throw error when used outside Provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestHookComponent />);
      }).toThrow('useDashdig must be used within a DashdigProvider');

      consoleSpy.mockRestore();
    });

    it('should provide shorten function', async () => {
      const mockResponse = {
        shortUrl: 'https://dsh.dg/abc123',
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
        createdAt: Date.now()
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      render(
        <DashdigProvider apiKey="test-key">
          <TestHookComponent />
        </DashdigProvider>
      );

      const button = screen.getByText('Shorten URL');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe('https://dsh.dg/abc123');
      });
    });

    it('should handle loading state', async () => {
      // Mock a delayed response
      (global.fetch as any).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            shortUrl: 'https://dsh.dg/abc123',
            shortCode: 'abc123',
            originalUrl: 'https://example.com',
            createdAt: Date.now()
          })
        }), 100))
      );

      render(
        <DashdigProvider apiKey="test-key">
          <TestHookComponent />
        </DashdigProvider>
      );

      const button = screen.getByText('Shorten URL');
      fireEvent.click(button);

      // Should show loading immediately
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('true');
      });

      // Should finish loading
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      }, { timeout: 200 });
    });

    it('should handle errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid API key' })
      });

      render(
        <DashdigProvider apiKey="test-key">
          <TestHookComponent />
        </DashdigProvider>
      );

      const button = screen.getByText('Shorten URL');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toContain('Invalid API key');
      });
    });
  });

  // ============================================================================
  // Shortener Component Tests
  // ============================================================================

  describe('DashdigShortener', () => {
    it('should render input and button', () => {
      render(
        <DashdigProvider apiKey="test-key">
          <DashdigShortener />
        </DashdigProvider>
      );

      expect(screen.getByPlaceholderText('Enter URL to shorten...')).toBeInTheDocument();
      expect(screen.getByText('Shorten')).toBeInTheDocument();
    });

    it('should use custom placeholder and button text', () => {
      render(
        <DashdigProvider apiKey="test-key">
          <DashdigShortener
            placeholder="Custom placeholder"
            buttonText="Custom button"
          />
        </DashdigProvider>
      );

      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
      expect(screen.getByText('Custom button')).toBeInTheDocument();
    });

    it('should shorten URL on form submit', async () => {
      const mockResponse = {
        shortUrl: 'https://dsh.dg/abc123',
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
        createdAt: Date.now()
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const onSuccess = vi.fn();

      render(
        <DashdigProvider apiKey="test-key">
          <DashdigShortener onSuccess={onSuccess} />
        </DashdigProvider>
      );

      const input = screen.getByPlaceholderText('Enter URL to shorten...');
      const button = screen.getByText('Shorten');

      fireEvent.change(input, { target: { value: 'https://example.com' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('https://dsh.dg/abc123')).toBeInTheDocument();
        expect(onSuccess).toHaveBeenCalledWith('https://dsh.dg/abc123', 'abc123');
      });
    });

    it('should show error message on failure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid URL' })
      });

      render(
        <DashdigProvider apiKey="test-key">
          <DashdigShortener />
        </DashdigProvider>
      );

      const input = screen.getByPlaceholderText('Enter URL to shorten...');
      const button = screen.getByText('Shorten');

      fireEvent.change(input, { target: { value: 'invalid-url' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Validation Error/)).toBeInTheDocument();
      });
    });

    it('should disable button when loading', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            shortUrl: 'https://dsh.dg/abc123',
            shortCode: 'abc123',
            originalUrl: 'https://example.com',
            createdAt: Date.now()
          })
        }), 100))
      );

      render(
        <DashdigProvider apiKey="test-key">
          <DashdigShortener />
        </DashdigProvider>
      );

      const input = screen.getByPlaceholderText('Enter URL to shorten...');
      const button = screen.getByText('Shorten');

      fireEvent.change(input, { target: { value: 'https://example.com' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Shortening...');
      });
    });

    it('should show custom slug input when enabled', () => {
      render(
        <DashdigProvider apiKey="test-key">
          <DashdigShortener allowCustomSlug={true} />
        </DashdigProvider>
      );

      expect(screen.getByPlaceholderText('Custom slug (optional)')).toBeInTheDocument();
    });

    it('should show expiration select when enabled', () => {
      render(
        <DashdigProvider apiKey="test-key">
          <DashdigShortener allowExpiration={true} />
        </DashdigProvider>
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });
});

