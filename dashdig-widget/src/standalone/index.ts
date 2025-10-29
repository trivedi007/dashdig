/**
 * DashDig Widget - Standalone Entry Point
 * Export standalone/vanilla JavaScript implementation
 */

export { default } from '../core/widget';
export { default as DashdigWidget } from '../core/widget';
export type { DashdigConfig } from '../core/widget';

// Re-export API client for advanced usage
export { default as DashdigAPIClient } from '../core/api-client';
export type {
  EventData,
  TrackEventRequest,
  TrackEventResponse,
  ShortenUrlRequest,
  ShortenUrlResponse,
  AnalyticsData,
  AnalyticsResponse
} from '../core/api-client';

// Re-export utility functions
export * from '../core/utils';


