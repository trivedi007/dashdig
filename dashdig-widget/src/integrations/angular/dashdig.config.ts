/**
 * DashDig Widget - Angular Configuration
 * Shared configuration interface and injection token
 */

import { InjectionToken } from '@angular/core';

/**
 * Configuration interface for DashDig module
 */
export interface DashdigConfig {
  /** API key for authentication (required) */
  apiKey: string;
  /** Widget position on screen */
  position?: 'bottom-right' | 'bottom-left';
  /** Widget theme */
  theme?: 'light' | 'dark';
  /** Auto-show widget on initialization */
  autoShow?: boolean;
  /** API URL override */
  apiUrl?: string;
}

/**
 * Injection token for DashDig configuration
 */
export const DASHDIG_CONFIG = new InjectionToken<DashdigConfig>('DASHDIG_CONFIG');


