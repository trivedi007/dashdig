/**
 * DashDig Widget - Angular Module
 * NgModule for integrating DashDig widget into Angular applications
 */

import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { DashdigComponent } from './dashdig.component';
import { DashdigService } from './dashdig.service';

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

/**
 * DashDig Module
 * 
 * Import this module in your Angular application to use DashDig widget.
 * Use forRoot() to configure the widget globally.
 * 
 * @example
 * ```typescript
 * import { DashdigModule } from '@dashdig/widget/angular';
 * 
 * @NgModule({
 *   imports: [
 *     DashdigModule.forRoot({
 *       apiKey: 'your-api-key',
 *       position: 'bottom-right',
 *       theme: 'light'
 *     })
 *   ]
 * })
 * export class AppModule { }
 * ```
 */
@NgModule({
  imports: [DashdigComponent],
  exports: [DashdigComponent]
})
export class DashdigModule {
  /**
   * Configure DashDig module with global settings
   * Use this in your root module (AppModule)
   * 
   * @param config - DashDig configuration
   * @returns Module with providers
   */
  static forRoot(config: DashdigConfig): ModuleWithProviders<DashdigModule> {
    return {
      ngModule: DashdigModule,
      providers: [
        {
          provide: DASHDIG_CONFIG,
          useValue: config
        },
        DashdigService
      ]
    };
  }
}


