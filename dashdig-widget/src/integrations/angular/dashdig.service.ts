/**
 * DashDig Widget - Angular Service
 * Injectable service for global widget management
 */

import { Injectable, Inject, Optional } from '@angular/core';
import DashdigWidget from '../../core/widget';
import type { DashdigConfig as CoreDashdigConfig } from '../../core/widget';
import { DASHDIG_CONFIG, DashdigConfig } from './dashdig.module';

/**
 * DashDig Service
 * 
 * Injectable service for managing DashDig widget globally in your Angular application.
 * Use this service when you've configured DashDig with forRoot() and want
 * programmatic access to the widget from anywhere in your app.
 * 
 * @example
 * ```typescript
 * import { DashdigService } from '@dashdig/widget/angular';
 * 
 * @Component({
 *   selector: 'app-root',
 *   template: '<button (click)="trackClick()">Track Click</button>'
 * })
 * export class AppComponent {
 *   constructor(private dashdig: DashdigService) {}
 * 
 *   trackClick() {
 *     this.dashdig.track('button_click', { button: 'example' });
 *   }
 * 
 *   showWidget() {
 *     this.dashdig.show();
 *   }
 * 
 *   hideWidget() {
 *     this.dashdig.hide();
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DashdigService {
  /**
   * Widget instance
   */
  private widget: DashdigWidget | null = null;

  /**
   * Whether the widget has been initialized
   */
  private initialized = false;

  /**
   * Constructor - injects configuration and initializes widget
   * 
   * @param config - DashDig configuration from forRoot()
   */
  constructor(@Optional() @Inject(DASHDIG_CONFIG) private config: DashdigConfig | null) {
    if (this.config) {
      this.initialize();
    } else {
      console.warn(
        '[DashDig Angular Service] No configuration provided. ' +
        'Use DashdigModule.forRoot() to configure the service, ' +
        'or use DashdigComponent directly with inputs.'
      );
    }
  }

  /**
   * Initialize the widget with provided configuration
   */
  private initialize(): void {
    if (this.initialized || !this.config) {
      return;
    }

    try {
      const widgetConfig: CoreDashdigConfig = {
        apiKey: this.config.apiKey,
        position: this.config.position,
        theme: this.config.theme,
        autoShow: this.config.autoShow,
        apiUrl: this.config.apiUrl
      };

      this.widget = new DashdigWidget(widgetConfig);
      this.initialized = true;
    } catch (error) {
      console.error('[DashDig Angular Service] Initialization error:', error);
    }
  }

  /**
   * Show the widget
   */
  public show(): void {
    if (this.widget) {
      try {
        this.widget.show();
      } catch (error) {
        console.error('[DashDig Angular Service] Error showing widget:', error);
      }
    } else {
      console.warn('[DashDig Angular Service] Widget not initialized');
    }
  }

  /**
   * Hide the widget
   */
  public hide(): void {
    if (this.widget) {
      try {
        this.widget.hide();
      } catch (error) {
        console.error('[DashDig Angular Service] Error hiding widget:', error);
      }
    } else {
      console.warn('[DashDig Angular Service] Widget not initialized');
    }
  }

  /**
   * Track an event
   * 
   * @param event - Event name
   * @param data - Optional event data
   */
  public track(event: string, data?: Record<string, any>): void {
    if (this.widget) {
      try {
        this.widget.track(event, data);
      } catch (error) {
        console.error('[DashDig Angular Service] Error tracking event:', error);
      }
    } else {
      console.warn('[DashDig Angular Service] Widget not initialized');
    }
  }

  /**
   * Get the widget instance
   * For advanced usage
   * 
   * @returns Widget instance or null
   */
  public getInstance(): DashdigWidget | null {
    return this.widget;
  }

  /**
   * Check if the widget is initialized
   * 
   * @returns True if widget is initialized
   */
  public isInitialized(): boolean {
    return this.initialized && this.widget !== null;
  }

  /**
   * Manually initialize widget with configuration
   * Use this if you didn't configure with forRoot()
   * 
   * @param config - DashDig configuration
   */
  public initializeWith(config: DashdigConfig): void {
    if (this.initialized) {
      console.warn('[DashDig Angular Service] Widget already initialized');
      return;
    }

    this.config = config;
    this.initialize();
  }

  /**
   * Destroy the widget and clean up resources
   * Called automatically when the service is destroyed
   */
  public destroy(): void {
    if (this.widget) {
      try {
        this.widget.destroy();
        this.widget = null;
        this.initialized = false;
      } catch (error) {
        console.error('[DashDig Angular Service] Cleanup error:', error);
      }
    }
  }

  /**
   * Angular lifecycle hook - cleanup on service destroy
   */
  ngOnDestroy(): void {
    this.destroy();
  }
}

