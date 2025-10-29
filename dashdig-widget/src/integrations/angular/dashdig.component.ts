/**
 * DashDig Widget - Angular Component
 * Component for embedding DashDig widget in Angular templates
 */

import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import DashdigWidget from '../../core/widget';
import type { DashdigConfig } from '../../core/widget';

/**
 * DashDig Widget Component
 * 
 * Embeds the DashDig analytics widget in your Angular application.
 * The widget is rendered outside the Angular component tree using Shadow DOM.
 * 
 * @example
 * ```html
 * <dashdig-widget
 *   [apiKey]="'your-api-key'"
 *   [position]="'bottom-right'"
 *   [theme]="'light'"
 *   [autoShow]="true"
 *   (load)="onLoad()"
 *   (error)="onError($event)">
 * </dashdig-widget>
 * ```
 */
@Component({
  selector: 'dashdig-widget',
  template: '<!-- Widget appends to body via Shadow DOM -->',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashdigComponent implements OnInit, OnDestroy {
  /**
   * API key for authentication (required)
   */
  @Input() apiKey!: string;

  /**
   * Widget position on screen
   */
  @Input() position?: 'bottom-right' | 'bottom-left';

  /**
   * Widget theme
   */
  @Input() theme?: 'light' | 'dark';

  /**
   * Auto-show widget on initialization
   */
  @Input() autoShow?: boolean;

  /**
   * API URL override
   */
  @Input() apiUrl?: string;

  /**
   * Event emitted when widget successfully loads
   */
  @Output() load = new EventEmitter<void>();

  /**
   * Event emitted when widget encounters an error
   */
  @Output() error = new EventEmitter<Error>();

  /**
   * Widget instance
   */
  private widget: DashdigWidget | null = null;

  /**
   * Component initialization
   * Creates and initializes the DashDig widget
   */
  ngOnInit(): void {
    // Validate required inputs
    if (!this.apiKey) {
      const errorMsg = 'DashDig: apiKey is required';
      console.error(errorMsg);
      this.error.emit(new Error(errorMsg));
      return;
    }

    try {
      // Create widget configuration
      const config: DashdigConfig = {
        apiKey: this.apiKey,
        position: this.position,
        theme: this.theme,
        autoShow: this.autoShow,
        apiUrl: this.apiUrl
      };

      // Create widget instance
      this.widget = new DashdigWidget(config);

      // Emit load event
      this.load.emit();
    } catch (err) {
      // Emit error event
      const error = err instanceof Error ? err : new Error('Unknown error initializing DashDig widget');
      console.error('[DashDig Angular] Widget initialization error:', error);
      this.error.emit(error);
    }
  }

  /**
   * Component cleanup
   * Destroys the widget and cleans up resources
   */
  ngOnDestroy(): void {
    if (this.widget) {
      try {
        this.widget.destroy();
        this.widget = null;
      } catch (error) {
        console.error('[DashDig Angular] Widget cleanup error:', error);
      }
    }
  }

  /**
   * Show the widget
   * Public method for programmatic control
   */
  public show(): void {
    if (this.widget) {
      this.widget.show();
    } else {
      console.warn('[DashDig Angular] Widget not initialized');
    }
  }

  /**
   * Hide the widget
   * Public method for programmatic control
   */
  public hide(): void {
    if (this.widget) {
      this.widget.hide();
    } else {
      console.warn('[DashDig Angular] Widget not initialized');
    }
  }

  /**
   * Track an event
   * Public method for programmatic control
   * 
   * @param event - Event name
   * @param data - Optional event data
   */
  public track(event: string, data?: Record<string, any>): void {
    if (this.widget) {
      this.widget.track(event, data);
    } else {
      console.warn('[DashDig Angular] Widget not initialized');
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
}


