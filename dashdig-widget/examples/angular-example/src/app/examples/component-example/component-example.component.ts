import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-component-example',
  standalone: true,
  imports: [CommonModule, FormsModule, DashdigComponent],
  template: `
    <div class="example">
      <div class="example-header">
        <h2>🧩 Component Approach</h2>
        <p class="description">
          Use the <code>&lt;dashdig-widget&gt;</code> component for declarative integration.
          Perfect for template-based Angular applications.
        </p>
      </div>

      <div class="example-content">
        <!-- Configuration Section -->
        <div class="section">
          <h3>Configuration</h3>
          <div class="config-grid">
            <div class="config-item">
              <label for="apiKey">API Key</label>
              <input
                id="apiKey"
                [(ngModel)]="apiKey"
                type="text"
                placeholder="your-api-key"
              />
            </div>

            <div class="config-item">
              <label for="position">Position</label>
              <select id="position" [(ngModel)]="position">
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>

            <div class="config-item">
              <label for="theme">Theme</label>
              <select id="theme" [(ngModel)]="theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div class="config-item">
              <label for="autoShow">Auto Show</label>
              <input
                id="autoShow"
                type="checkbox"
                [(ngModel)]="autoShow"
              />
              <span>{{ autoShow ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>
        </div>

        <!-- Widget Instance -->
        <div class="section">
          <h3>Widget Component</h3>
          <div class="widget-info">
            <p>
              The widget is rendered as an Angular component below. It automatically
              initializes on mount and cleans up on destroy.
            </p>
            <div class="widget-status">
              <span class="status-dot" [class.active]="widgetLoaded"></span>
              <span>Widget {{ widgetLoaded ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
          
          <!-- DashDig Widget Component -->
          <dashdig-widget
            #dashdigWidget
            [apiKey]="apiKey"
            [position]="position"
            [theme]="theme"
            [autoShow]="autoShow"
            (load)="onLoad()"
            (error)="onError($event)"
          ></dashdig-widget>
        </div>

        <!-- Controls Section -->
        <div class="section">
          <h3>Widget Controls</h3>
          <div class="button-group">
            <button (click)="showWidget()" class="btn btn-primary">
              👁️ Show Widget
            </button>
            <button (click)="hideWidget()" class="btn btn-secondary">
              🙈 Hide Widget
            </button>
            <button (click)="trackEvent()" class="btn btn-success">
              📊 Track Event
            </button>
          </div>
        </div>

        <!-- Error Display -->
        <div *ngIf="errorMessage" class="error-banner">
          ❌ {{ errorMessage }}
        </div>

        <!-- Events Section -->
        <div class="section">
          <h3>Component Events</h3>
          <div class="events-info">
            <div class="event-item">
              <code>(load)</code>
              <span>Emitted when widget successfully initializes</span>
            </div>
            <div class="event-item">
              <code>(error)</code>
              <span>Emitted when widget encounters an error</span>
            </div>
          </div>
        </div>

        <!-- Code Example -->
        <div class="section">
        <h3>Code Example</h3>
        <pre class="code-block"><code>import &#123; Component, ViewChild &#125; from '&#64;angular/core';
import &#123; DashdigComponent &#125; from '&#64;dashdig/widget/angular';

&#64;Component(&#123;
  selector: 'app-example',
  standalone: true,
  imports: [DashdigComponent],
  template: \`
    &lt;dashdig-widget
      #dashdigWidget
      [apiKey]="'{{ apiKey }}'"
      [position]="'{{ position }}'"
      [theme]="'{{ theme }}'"
      [autoShow]="{{ autoShow }}"
      (load)="onLoad()"
      (error)="onError($event)"&gt;
    &lt;/dashdig-widget&gt;

    &lt;button (click)="dashdigWidget.show()"&gt;Show&lt;/button&gt;
    &lt;button (click)="dashdigWidget.hide()"&gt;Hide&lt;/button&gt;
  \`
&#125;)
export class ExampleComponent &#123;
  &#64;ViewChild('dashdigWidget') widget!: DashdigComponent;

  onLoad() &#123;
    console.log('Widget loaded');
  &#125;

  onError(error: Error) &#123;
    console.error('Widget error:', error);
  &#125;
&#125;</code></pre>
        </div>

        <!-- Public Methods -->
        <div class="section">
          <h3>Public Methods (via ViewChild)</h3>
          <div class="methods-info">
            <div class="method-item">
              <code>show()</code>
              <span>Show the widget</span>
            </div>
            <div class="method-item">
              <code>hide()</code>
              <span>Hide the widget</span>
            </div>
            <div class="method-item">
              <code>track(event, data)</code>
              <span>Track custom events</span>
            </div>
            <div class="method-item">
              <code>getInstance()</code>
              <span>Get the underlying widget instance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .example {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .example-header h2 {
      color: #667eea;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
    }

    .description {
      color: #666;
      line-height: 1.6;
    }

    .description code {
      background: #f5f5f5;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
      color: #667eea;
    }

    .example-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .section {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .section h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .config-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .config-item label {
      font-weight: 600;
      color: #555;
      font-size: 0.9rem;
    }

    .config-item input[type="text"],
    .config-item select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .config-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }

    .config-item span {
      color: #666;
      font-size: 0.9rem;
    }

    .widget-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .widget-info p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    .widget-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ccc;
      transition: background 0.3s ease;
    }

    .status-dot.active {
      background: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
    }

    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover {
      background: #218838;
    }

    .error-banner {
      padding: 1rem;
      background: #fed7d7;
      color: #9b2c2c;
      border-radius: 8px;
      font-weight: 600;
    }

    .events-info,
    .methods-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .event-item,
    .method-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9f9f9;
      border-radius: 6px;
    }

    .event-item code,
    .method-item code {
      background: #667eea;
      color: white;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      font-size: 0.85rem;
      white-space: nowrap;
    }

    .event-item span,
    .method-item span {
      color: #666;
      line-height: 1.6;
    }

    .code-block {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 0.85rem;
      line-height: 1.5;
      margin: 0;
    }

    .code-block code {
      color: #333;
    }

    @media (max-width: 768px) {
      .config-grid {
        grid-template-columns: 1fr;
      }

      .button-group {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ComponentExampleComponent {
  @ViewChild('dashdigWidget') dashdigWidget!: DashdigComponent;

  // Configuration
  apiKey = 'demo-api-key-component';
  position: 'bottom-right' | 'bottom-left' = 'bottom-right';
  theme: 'light' | 'dark' = 'light';
  autoShow = false;

  // State
  widgetLoaded = false;
  errorMessage = '';

  onLoad(): void {
    console.log('[Component Example] Widget loaded');
    this.widgetLoaded = true;
    this.errorMessage = '';
  }

  onError(error: Error): void {
    console.error('[Component Example] Widget error:', error);
    this.errorMessage = error.message;
    this.widgetLoaded = false;
  }

  showWidget(): void {
    if (this.dashdigWidget) {
      this.dashdigWidget.show();
    }
  }

  hideWidget(): void {
    if (this.dashdigWidget) {
      this.dashdigWidget.hide();
    }
  }

  trackEvent(): void {
    if (this.dashdigWidget) {
      this.dashdigWidget.track('component_button_click', {
        source: 'component_example',
        timestamp: new Date().toISOString()
      });
      alert('Event tracked via component!');
    }
  }
}

