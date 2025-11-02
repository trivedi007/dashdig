/**
 * DashDig Widget - React Integration
 * Export all React components and hooks for URL shortening
 * @version 1.0.0
 */

// Export Provider and Hook
export { DashdigProvider, useDashdig, default as default } from './DashdigProvider';
export type { DashdigProviderProps, DashdigContextValue } from './DashdigProvider';

// Export pre-built URL Shortener component
export { DashdigShortener } from './DashdigShortener';
export type { DashdigShortenerProps } from './DashdigShortener';

// Re-export core types for convenience
export type { DashdigInitOptions, ShortenOptions, ShortenResponse } from '../../core/url-shortener';

