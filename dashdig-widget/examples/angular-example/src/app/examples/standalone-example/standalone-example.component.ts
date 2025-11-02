import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashdigComponent } from '@dashdig/widget/angular';

/**
 * Standalone Component Example (Angular 17+)
 * Demonstrates using DashdigComponent as a standalone component
 * without NgModule
 */
@Component({
  selector: 'app-standalone-example',
  standalone: true,
  imports: [CommonModule, DashdigComponent],
  template: `
    <div class="example">
      <div class="example-header">
        <h2>⚡ Standalone Component (Angular 17+)</h2>
        <p class="description">
          Use DashDig with Angular 17+ standalone components without NgModule.
          Perfect for modern Angular applications.
        </p>
      </div>

      <div class="example-content">
        <!-- Standalone Info -->
        <div class="section highlight">
          <h3>🎉 Standalone Components</h3>
          <p class="info-text">
            This example uses Angular 17+ standalone components. No NgModule required!
            Just import <code>DashdigComponent</code> directly in your component's imports array.
          </p>
        </div>

        <!-- Implementation -->
        <div class="section">
          <h3>Implementation</h3>
          <pre class="code-block"><code>import &#123; Component &#125; from '&#64;angular/core';
import &#123; DashdigComponent &#125; from '&#64;dashdig/widget/angular';

&#64;Component(&#123;
  selector: 'app-example',
  standalone: true,  // ← Standalone!
  imports: [DashdigComponent],  // ← Direct import
  template: \`
    &lt;dashdig-widget
      [apiKey]="'your-api-key'"
      [position]="'bottom-right'"
      [theme]="'light'"&gt;
    &lt;/dashdig-widget&gt;
  \`
&#125;)
export class ExampleComponent &#123;&#125;</code></pre>
        </div>

        <!-- Widget Demo -->
        <div class="section">
          <h3>Live Widget</h3>
          <div class="widget-info">
            <p>
              The widget below is rendered using a standalone component.
              It works exactly the same as the module-based approach!
            </p>
            <div class="widget-status">
              <span class="status-dot" [class.active]="widgetLoaded"></span>
              <span>Widget {{ widgetLoaded ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>

          <!-- DashDig Widget -->
          <dashdig-widget
            #dashdigWidget
            [apiKey]="'demo-api-key-standalone'"
            [position]="'bottom-right'"
            [theme]="'light'"
            [autoShow]="false"
            (load)="onLoad()"
            (error)="onError($event)"
          ></dashdig-widget>
        </div>

        <!-- Controls -->
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

        <!-- Key Features -->
        <div class="section features">
          <h3>Key Features</h3>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📦</div>
              <h4>No NgModule</h4>
              <p>Import directly without creating modules</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h4>Smaller Bundles</h4>
              <p>Tree-shakeable and optimized</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h4>Simpler</h4>
              <p>Less boilerplate, more clarity</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🚀</div>
              <h4>Future-Ready</h4>
              <p>Angular 17+ recommended approach</p>
            </div>
          </div>
        </div>

        <!-- Migration Guide -->
        <div class="section">
          <h3>Migration from NgModule</h3>
          <div class="migration-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Add standalone: true</h4>
                <p>Add <code>standalone: true</code> to your component decorator</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Add imports array</h4>
                <p>Import <code>DashdigComponent</code> directly in the component</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Remove from NgModule</h4>
                <p>Remove the component from your NgModule declarations</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Complete Example -->
        <div class="section">
          <h3>Complete Example</h3>
          <pre class="code-block"><code>// app.component.ts
import &#123; Component &#125; from '&#64;angular/core';
import &#123; DashdigComponent &#125; from '&#64;dashdig/widget/angular';

&#64;Component(&#123;
  selector: 'app-root',
  standalone: true,
  imports: [DashdigComponent],
  template: \`
    &lt;h1&gt;My App&lt;/h1&gt;
    
    &lt;dashdig-widget
      [apiKey]="'your-api-key'"
      [position]="'bottom-right'"
      [theme]="'dark'"
      (load)="onWidgetLoad()"&gt;
    &lt;/dashdig-widget&gt;
  \`
&#125;)
export class AppComponent &#123;
  onWidgetLoad() &#123;
    console.log('DashDig widget loaded!');
  &#125;
&#125;

// main.ts
import &#123; bootstrapApplication &#125; from '&#64;angular/platform-browser';
import &#123; AppComponent &#125; from './app/app.component';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));</code></pre>
        </div>

        <!-- Advantages -->
        <div class="section advantages">
          <h3>Why Use Standalone Components?</h3>
          <ul>
            <li>✓ Simpler mental model - no modules to manage</li>
            <li>✓ Better tree-shaking - smaller bundle sizes</li>
            <li>✓ Faster compilation - Angular compiles faster</li>
            <li>✓ Easier testing - less setup required</li>
            <li>✓ Future-proof - Angular's recommended approach</li>
            <li>✓ Lazy loading - built-in support</li>
          </ul>
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

    .section.highlight {
      background: #f0f9ff;
      border-color: #667eea;
    }

    .section h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .info-text {
      color: #555;
      line-height: 1.8;
      margin: 0;
    }

    .info-text code {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
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

    .section.features {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border: none;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .feature-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .feature-card h4 {
      color: #667eea;
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }

    .feature-card p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.5;
    }

    .migration-steps {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .step {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .step-number {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .step-content h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1rem;
    }

    .step-content p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    .step-content code {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
    }

    .advantages {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
    }

    .advantages h3 {
      color: white;
    }

    .advantages ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .advantages li {
      padding: 0.5rem 0;
      font-size: 1rem;
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
      .features-grid {
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
export class StandaloneExampleComponent {
  @ViewChild('dashdigWidget') dashdigWidget!: DashdigComponent;

  widgetLoaded = false;
  errorMessage = '';

  onLoad(): void {
    console.log('[Standalone Example] Widget loaded');
    this.widgetLoaded = true;
    this.errorMessage = '';
  }

  onError(error: Error): void {
    console.error('[Standalone Example] Widget error:', error);
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
      this.dashdigWidget.track('standalone_button_click', {
        source: 'standalone_example',
        angularVersion: '17+',
        timestamp: new Date().toISOString()
      });
      alert('Event tracked from standalone component!');
    }
  }
}

