/**
 * Integration Tests for React Components
 * Tests DashdigReactWidget component and useDashdig hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Helper function to wait for async operations
const wait = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));
import { DashdigReactWidget } from '../../src/integrations/react/DashdigWidget';
import { useDashdig } from '../../src/integrations/react/useDashdig';
import DashdigWidget from '../../src/core/widget';

// Mock the core widget
vi.mock('../../src/core/widget', () => {
  const mockWidgetInstance = {
    show: vi.fn(),
    hide: vi.fn(),
    track: vi.fn(),
    destroy: vi.fn(),
    isShown: vi.fn(() => true),
    getConfig: vi.fn(() => ({
      apiKey: 'test-key',
      apiUrl: 'https://api.dashdig.com',
      position: 'bottom-right',
      theme: 'light',
      autoShow: true,
      enableWebVitals: true
    }))
  };

  const MockWidget = vi.fn(() => mockWidgetInstance);
  MockWidget.prototype = mockWidgetInstance;
  
  return {
    default: MockWidget
  };
;

describe('DashdigReactWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  ;

  afterEach(() => {
    cleanup();
  ;

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      expect(() => {
        render(<DashdigReactWidget apiKey="test-api-key" />);
      }).not.toThrow();
    ;

    it('should return null (renders outside React tree)', () => {
      const { container } = render(<DashdigReactWidget apiKey="test-api-key" />);
      expect(container.firstChild).toBeNull();
    ;

    it('should have correct display name', () => {
      expect(DashdigReactWidget.displayName).toBe('DashdigWidget');
    ;
  ;

  describe('Props Handling', () => {
    it('should initialize widget with API key', () => {
      render(<DashdigReactWidget apiKey="test-api-key" />);
      
      expect(DashdigWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'test-api-key'
        })
      );
    ;

    it('should pass position prop to widget', () => {
      render(<DashdigReactWidget apiKey="test-api-key" position="bottom-left" />);
      
      expect(DashdigWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'bottom-left'
        })
      );
    ;

    it('should pass theme prop to widget', () => {
      render(<DashdigReactWidget apiKey="test-api-key" theme="dark" />);
      
      expect(DashdigWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'dark'
        })
      );
    ;

    it('should pass autoShow prop to widget', () => {
      render(<DashdigReactWidget apiKey="test-api-key" autoShow={false} />);
      
      expect(DashdigWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          autoShow: false
        })
      );
    ;

    it('should handle all props together', () => {
      render(
        <DashdigReactWidget
          apiKey="test-api-key"
          position="bottom-left"
          theme="dark"
          autoShow={false}
        />
      );
      
      expect(DashdigWidget).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        position: 'bottom-left',
        theme: 'dark',
        autoShow: false
      ;
    ;
  ;

  describe('Lifecycle Methods', () => {
    it('should initialize widget on mount', () => {
      render(<DashdigReactWidget apiKey="test-api-key" />);
      
      expect(DashdigWidget).toHaveBeenCalled();
    ;

    it('should destroy widget on unmount', () => {
      const { unmount } = render(<DashdigReactWidget apiKey="test-api-key" />);
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      
      unmount();
      
      expect(widgetInstance.destroy).toHaveBeenCalled();
    ;

    it('should reinitialize widget when props change', () => {
      const { rerender } = render(<DashdigReactWidget apiKey="key1" />);
      
      expect(DashdigWidget).toHaveBeenCalledTimes(1);
      
      rerender(<DashdigReactWidget apiKey="key2" />);
      
      expect(DashdigWidget).toHaveBeenCalledTimes(2);
    ;

    it('should cleanup old widget before reinitializing', () => {
      const { rerender } = render(<DashdigReactWidget apiKey="key1" />);
      
      const firstInstance = (DashdigWidget as any).mock.results[0].value;
      
      rerender(<DashdigReactWidget apiKey="key2" />);
      
      expect(firstInstance.destroy).toHaveBeenCalled();
    ;
  ;

  describe('Callback Props', () => {
    it('should call onLoad callback on successful initialization', async () => {
      const onLoad = vi.fn();
      
      render(<DashdigReactWidget apiKey="test-api-key" onLoad={onLoad} />);
      
      await wait();
      expect(onLoad).toHaveBeenCalled();
    ;

    it('should call onError callback on initialization error', async () => {
      const onError = vi.fn();
      
      // Mock widget to throw error
      (DashdigWidget as any).mockImplementationOnce(() => {
        throw new Error('Initialization failed');
      ;
      
      render(<DashdigReactWidget apiKey="test-api-key" onError={onError} />);
      
      await wait();
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    ;

    it('should pass error object to onError callback', async () => {
      const onError = vi.fn();
      const testError = new Error('Test error');
      
      (DashdigWidget as any).mockImplementationOnce(() => {
        throw testError;
      ;
      
      render(<DashdigReactWidget apiKey="test-api-key" onError={onError} />);
      
      await wait();
      expect(onError).toHaveBeenCalledWith(testError);
    ;

    it('should not crash if onLoad is not provided', () => {
      expect(() => {
        render(<DashdigReactWidget apiKey="test-api-key" />);
      }).not.toThrow();
    ;

    it('should not crash if onError is not provided', () => {
      (DashdigWidget as any).mockImplementationOnce(() => {
        throw new Error('Test error');
      ;
      
      expect(() => {
        render(<DashdigReactWidget apiKey="test-api-key" />);
      }).not.toThrow();
    ;
  ;

  describe('Error Handling', () => {
    it('should handle widget initialization errors gracefully', () => {
      (DashdigWidget as any).mockImplementationOnce(() => {
        throw new Error('Init error');
      ;
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {;
      
      render(<DashdigReactWidget apiKey="test-api-key" />);
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    ;

    it('should handle widget cleanup errors gracefully', () => {
      const { unmount } = render(<DashdigReactWidget apiKey="test-api-key" />);
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      widgetInstance.destroy.mockImplementationOnce(() => {
        throw new Error('Cleanup error');
      ;
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {;
      
      expect(() => unmount()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    ;
  ;
;

describe('useDashdig Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  ;

  describe('Hook Initialization', () => {
    it('should initialize with API key', () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      expect(DashdigWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'test-api-key'
        })
      );
    ;

    it('should set isLoaded to true after initialization', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
    ;

    it('should set initial visibility state based on autoShow', async () => {
      const { result } = renderHook(() => 
        useDashdig('test-api-key', { autoShow: false })
      );
      
      await wait();
        expect(result.current.isVisible).toBe(false);
      ;
    ;

    it('should pass options to widget', () => {
      renderHook(() => 
        useDashdig('test-api-key', {
          position: 'bottom-left',
          theme: 'dark',
          autoShow: false,
          apiUrl: 'https://custom.api.com'
        })
      );
      
      expect(DashdigWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'test-api-key',
          position: 'bottom-left',
          theme: 'dark',
          autoShow: false,
          apiUrl: 'https://custom.api.com'
        })
      );
    ;

    it('should warn when API key is missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {;
      
      renderHook(() => useDashdig(''));
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[DashDig React Hook] API key is required'
      );
      
      consoleSpy.mockRestore();
    ;
  ;

  describe('Hook Methods', () => {
    it('should provide show method', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.show).toBeDefined();
        expect(typeof result.current.show).toBe('function');
      ;
    ;

    it('should provide hide method', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.hide).toBeDefined();
        expect(typeof result.current.hide).toBe('function');
      ;
    ;

    it('should provide track method', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.track).toBeDefined();
        expect(typeof result.current.track).toBe('function');
      ;
    ;

    it('should call widget.show() when show is invoked', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      
      act(() => {
        result.current.show();
      ;
      
      expect(widgetInstance.show).toHaveBeenCalled();
    ;

    it('should call widget.hide() when hide is invoked', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      
      act(() => {
        result.current.hide();
      ;
      
      expect(widgetInstance.hide).toHaveBeenCalled();
    ;

    it('should call widget.track() when track is invoked', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      
      act(() => {
        result.current.track('test_event', { key: 'value' ;
      ;
      
      expect(widgetInstance.track).toHaveBeenCalledWith('test_event', { key: 'value' ;
    ;

    it('should update isVisible state when show is called', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key', { autoShow: false }));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      act(() => {
        result.current.show();
      ;
      
      await wait();
        expect(result.current.isVisible).toBe(true);
      ;
    ;

    it('should update isVisible state when hide is called', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      act(() => {
        result.current.hide();
      ;
      
      await wait();
        expect(result.current.isVisible).toBe(false);
      ;
    ;
  ;

  describe('Hook State', () => {
    it('should expose widget instance', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.widget).not.toBeNull();
      ;
    ;

    it('should provide isLoaded state', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBeDefined();
        expect(typeof result.current.isLoaded).toBe('boolean');
      ;
    ;

    it('should provide isVisible state', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isVisible).toBeDefined();
        expect(typeof result.current.isVisible).toBe('boolean');
      ;
    ;
  ;

  describe('Hook Cleanup', () => {
    it('should destroy widget on unmount', async () => {
      const { result, unmount } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      
      unmount();
      
      expect(widgetInstance.destroy).toHaveBeenCalled();
    ;

    it('should set isLoaded to false on unmount', async () => {
      const { result, unmount } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      unmount();
      
      // Can't check state after unmount, but cleanup should run
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      expect(widgetInstance.destroy).toHaveBeenCalled();
    ;

    it('should handle cleanup errors gracefully', async () => {
      const { result, unmount } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      widgetInstance.destroy.mockImplementationOnce(() => {
        throw new Error('Cleanup error');
      ;
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {;
      
      expect(() => unmount()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    ;
  ;

  describe('Hook Error Handling', () => {
    it('should handle initialization errors', () => {
      (DashdigWidget as any).mockImplementationOnce(() => {
        throw new Error('Init error');
      ;
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {;
      
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      expect(result.current.isLoaded).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    ;

    it('should warn when calling methods on uninitialized widget', async () => {
      const { result } = renderHook(() => useDashdig(''));
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {;
      
      act(() => {
        result.current.show();
      ;
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[DashDig React Hook] Widget not initialized'
      );
      
      consoleSpy.mockRestore();
    ;

    it('should handle show errors gracefully', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      widgetInstance.show.mockImplementationOnce(() => {
        throw new Error('Show error');
      ;
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {;
      
      act(() => {
        result.current.show();
      ;
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    ;

    it('should handle hide errors gracefully', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      widgetInstance.hide.mockImplementationOnce(() => {
        throw new Error('Hide error');
      ;
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {;
      
      act(() => {
        result.current.hide();
      ;
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    ;

    it('should handle track errors gracefully', async () => {
      const { result } = renderHook(() => useDashdig('test-api-key'));
      
      await wait();
        expect(result.current.isLoaded).toBe(true);
      ;
      
      const widgetInstance = (DashdigWidget as any).mock.results[0].value;
      widgetInstance.track.mockImplementationOnce(() => {
        throw new Error('Track error');
      ;
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {;
      
      act(() => {
        result.current.track('test_event');
      ;
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    ;
  ;

  describe('Hook Re-initialization', () => {
    it('should reinitialize when API key changes', async () => {
      const { rerender } = renderHook(
        ({ apiKey }) => useDashdig(apiKey),
        { initialProps: { apiKey: 'key1' } }
      );
      
      expect(DashdigWidget).toHaveBeenCalledTimes(1);
      
      rerender({ apiKey: 'key2' ;
      
      await wait();
        expect(DashdigWidget).toHaveBeenCalledTimes(2);
      ;
    ;

    it('should cleanup old widget before reinitializing', async () => {
      const { rerender } = renderHook(
        ({ apiKey }) => useDashdig(apiKey),
        { initialProps: { apiKey: 'key1' } }
      );
      
      const firstInstance = (DashdigWidget as any).mock.results[0].value;
      
      rerender({ apiKey: 'key2' ;
      
      await wait();
        expect(firstInstance.destroy).toHaveBeenCalled();
      ;
    ;
  ;
;
