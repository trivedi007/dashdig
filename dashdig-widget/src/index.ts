/**
 * DashDig Widget - Main Entry Point
 * Export all public APIs
 */

// Core exports
export { default } from './core/widget';
export { default as DashdigWidget } from './core/widget';
export type { DashdigConfig } from './core/widget';

// API Client
export { default as DashdigAPIClient } from './core/api-client';
export type {
  EventData,
  TrackEventRequest,
  TrackEventResponse,
  ShortenUrlRequest,
  ShortenUrlResponse,
  AnalyticsData,
  AnalyticsResponse,
  NetworkError,
  APIError,
  ValidationError
} from './core/api-client';

// Utilities
export * from './core/utils';


