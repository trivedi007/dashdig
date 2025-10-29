/**
 * DashDig Widget - Main Widget Class
 * Embeddable analytics widget with Shadow DOM isolation
 */

// Type definitions
export interface DashdigConfig {
  apiKey: string;
  apiUrl?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
}

interface TrackingEvent {
  event: string;
  data?: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

interface WindowWithDashdig extends Window {
  DashdigWidget?: typeof DashdigWidget;
}

declare const window: WindowWithDashdig;

/**
 * Main DashDig Widget Class
 */
export default class DashdigWidget {
  private config: Required<DashdigConfig>;
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private isVisible: boolean = false;
  private sessionId: string;
  private eventQueue: TrackingEvent[] = [];
  private isDestroyed: boolean = false;

  /**
   * Constructor - Initialize widget with configuration
   */
  constructor(config: DashdigConfig) {
    // Validate required config
    if (!config.apiKey) {
      throw new Error('[DashDig] API key is required');
    }

    // Merge with defaults
    this.config = {
      apiKey: config.apiKey,
      apiUrl: config.apiUrl || 'https://api.dashdig.com',
      position: config.position || 'bottom-right',
      theme: config.theme || 'light',
      autoShow: config.autoShow !== undefined ? config.autoShow : true
    };

    // Generate session ID
    this.sessionId = this.generateSessionId();

    // Initialize widget
    this.init();
  }

  /**
   * Initialize widget - setup sequence
   */
  private init(): void {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initWidget());
      } else {
        this.initWidget();
      }
    } catch (error) {
      console.warn('[DashDig] Initialization error:', error);
    }
  }

  /**
   * Internal initialization after DOM ready
   */
  private initWidget(): void {
    try {
      this.createContainer();
      this.createShadowRoot();
      this.loadStyles();
      this.render();
      this.setupEvents();

      if (this.config.autoShow) {
        this.show();
      }

      // Track initialization
      this.track('widget_initialized', {
        position: this.config.position,
        theme: this.config.theme
      });
    } catch (error) {
      console.warn('[DashDig] Widget initialization failed:', error);
    }
  }

  /**
   * Create container element with fixed positioning
   */
  private createContainer(): void {
    if (this.container) {
      return;
    }

    this.container = document.createElement('div');
    this.container.id = 'dashdig-widget-container';
    this.container.setAttribute('data-dashdig-widget', 'true');
    
    // Apply positioning styles
    this.container.style.cssText = `
      position: fixed;
      ${this.config.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
      bottom: 20px;
      z-index: 999999;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: auto;
    `;

    document.body.appendChild(this.container);
  }

  /**
   * Create Shadow DOM for complete style isolation
   */
  private createShadowRoot(): void {
    if (!this.container || this.shadowRoot) {
      return;
    }

    try {
      this.shadowRoot = this.container.attachShadow({ mode: 'open' });
    } catch (error) {
      console.warn('[DashDig] Shadow DOM not supported, falling back to regular DOM:', error);
      // Fallback: use container directly without shadow DOM
      this.shadowRoot = this.container as any;
    }
  }

  /**
   * Load and inject CSS styles into Shadow DOM
   */
  private loadStyles(): void {
    if (!this.shadowRoot) {
      return;
    }

    const isDark = this.config.theme === 'dark';
    
    const styles = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .dashdig-widget {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        width: 360px;
        max-width: calc(100vw - 40px);
        background: ${isDark ? '#1e1e1e' : '#ffffff'};
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, ${isDark ? '0.5' : '0.15'}),
                    0 2px 8px rgba(0, 0, 0, ${isDark ? '0.3' : '0.08'});
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .dashdig-widget:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, ${isDark ? '0.6' : '0.2'}),
                    0 4px 12px rgba(0, 0, 0, ${isDark ? '0.4' : '0.1'});
      }

      .dashdig-header {
        padding: 16px 20px;
        background: ${isDark ? '#2d2d2d' : '#f8f9fa'};
        border-bottom: 1px solid ${isDark ? '#3d3d3d' : '#e9ecef'};
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .dashdig-title {
        font-size: 16px;
        font-weight: 600;
        color: ${isDark ? '#ffffff' : '#212529'};
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .dashdig-logo {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      }

      .dashdig-close {
        background: transparent;
        border: none;
        font-size: 24px;
        line-height: 1;
        color: ${isDark ? '#adb5bd' : '#6c757d'};
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background 0.2s ease, color 0.2s ease;
      }

      .dashdig-close:hover {
        background: ${isDark ? '#3d3d3d' : '#e9ecef'};
        color: ${isDark ? '#ffffff' : '#212529'};
      }

      .dashdig-content {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
        color: ${isDark ? '#e9ecef' : '#495057'};
        font-size: 14px;
        line-height: 1.6;
      }

      .dashdig-content::-webkit-scrollbar {
        width: 8px;
      }

      .dashdig-content::-webkit-scrollbar-track {
        background: ${isDark ? '#2d2d2d' : '#f8f9fa'};
      }

      .dashdig-content::-webkit-scrollbar-thumb {
        background: ${isDark ? '#4d4d4d' : '#ced4da'};
        border-radius: 4px;
      }

      .dashdig-content::-webkit-scrollbar-thumb:hover {
        background: ${isDark ? '#5d5d5d' : '#adb5bd'};
      }

      .dashdig-footer {
        padding: 12px 20px;
        background: ${isDark ? '#2d2d2d' : '#f8f9fa'};
        border-top: 1px solid ${isDark ? '#3d3d3d' : '#e9ecef'};
        text-align: center;
        font-size: 12px;
        color: ${isDark ? '#adb5bd' : '#6c757d'};
      }

      .dashdig-footer a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
      }

      .dashdig-footer a:hover {
        color: #764ba2;
      }

      @media (max-width: 480px) {
        .dashdig-widget {
          width: calc(100vw - 40px);
          max-height: calc(100vh - 100px);
        }

        .dashdig-content {
          max-height: calc(100vh - 200px);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .dashdig-animate-in {
        animation: fadeInUp 0.3s ease forwards;
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    this.shadowRoot.appendChild(styleElement);
  }

  /**
   * Render widget UI inside Shadow DOM
   */
  private render(): void {
    if (!this.shadowRoot) {
      return;
    }

    const widgetHTML = `
      <div class="dashdig-widget dashdig-animate-in">
        <div class="dashdig-header">
          <div class="dashdig-title">
            <div class="dashdig-logo">D</div>
            <span>DashDig Analytics</span>
          </div>
          <button class="dashdig-close" id="dashdig-close-btn" aria-label="Close widget">×</button>
        </div>
        <div class="dashdig-content">
          <p><strong>Welcome to DashDig!</strong></p>
          <p style="margin-top: 12px;">
            Your analytics widget is now active and tracking visitor interactions.
          </p>
          <p style="margin-top: 12px;">
            Session ID: <code style="background: rgba(102, 126, 234, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 12px;">${this.sessionId}</code>
          </p>
        </div>
        <div class="dashdig-footer">
          Powered by <a href="https://dashdig.com" target="_blank">DashDig</a>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    this.shadowRoot.appendChild(container);
  }

  /**
   * Setup event listeners
   */
  private setupEvents(): void {
    if (!this.shadowRoot) {
      return;
    }

    // Close button click
    const closeBtn = this.shadowRoot.getElementById('dashdig-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
        this.track('widget_closed', { trigger: 'close_button' });
      });
    }

    // Track visibility changes
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.track('page_hidden', {});
        } else {
          this.track('page_visible', {});
        }
      });
    }
  }

  /**
   * Show widget - Public method
   */
  public show(): void {
    if (this.isDestroyed || !this.container) {
      console.warn('[DashDig] Cannot show destroyed widget');
      return;
    }

    try {
      this.container.style.opacity = '1';
      this.container.style.transform = 'translateY(0)';
      this.isVisible = true;
      this.track('widget_shown', {});
    } catch (error) {
      console.warn('[DashDig] Error showing widget:', error);
    }
  }

  /**
   * Hide widget - Public method
   */
  public hide(): void {
    if (this.isDestroyed || !this.container) {
      return;
    }

    try {
      this.container.style.opacity = '0';
      this.container.style.transform = 'translateY(20px)';
      this.isVisible = false;
      this.track('widget_hidden', {});
    } catch (error) {
      console.warn('[DashDig] Error hiding widget:', error);
    }
  }

  /**
   * Destroy widget and cleanup - Public method
   */
  public destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    try {
      // Track destruction
      this.track('widget_destroyed', {});

      // Flush any pending events
      this.flushEvents();

      // Remove container from DOM
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }

      // Cleanup references
      this.container = null;
      this.shadowRoot = null;
      this.isDestroyed = true;
      this.isVisible = false;
    } catch (error) {
      console.warn('[DashDig] Error destroying widget:', error);
    }
  }

  /**
   * Track event - Public method
   */
  public track(event: string, data?: Record<string, any>): void {
    if (this.isDestroyed) {
      console.warn('[DashDig] Cannot track events on destroyed widget');
      return;
    }

    try {
      const trackingEvent: TrackingEvent = {
        event,
        data: data || {},
        timestamp: Date.now(),
        sessionId: this.sessionId
      };

      // Add to queue
      this.eventQueue.push(trackingEvent);

      // Send to API (debounced)
      this.sendEvents();
    } catch (error) {
      console.warn('[DashDig] Error tracking event:', error);
    }
  }

  /**
   * Send events to API
   */
  private async sendEvents(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(`${this.config.apiUrl}/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DashDig-API-Key': this.config.apiKey
        },
        body: JSON.stringify({
          events: eventsToSend,
          metadata: {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error) {
      console.warn('[DashDig] Error sending events:', error);
      // Re-queue events on failure
      this.eventQueue.unshift(...eventsToSend);
    }
  }

  /**
   * Flush all pending events
   */
  private flushEvents(): void {
    if (this.eventQueue.length > 0) {
      this.sendEvents();
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Get current configuration
   */
  public getConfig(): Readonly<Required<DashdigConfig>> {
    return { ...this.config };
  }

  /**
   * Get visibility state
   */
  public isShown(): boolean {
    return this.isVisible && !this.isDestroyed;
  }
}

// Expose on window for script tag usage
if (typeof window !== 'undefined') {
  window.DashdigWidget = DashdigWidget;
}


