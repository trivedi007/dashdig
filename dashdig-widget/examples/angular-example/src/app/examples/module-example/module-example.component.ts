import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashdigService, DASHDIG_CONFIG } from '@dashdig/widget/angular';

@Component({
  selector: 'app-module-example',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: DASHDIG_CONFIG,
      useValue: {
        apiKey: 'demo-api-key-module',
        position: 'bottom-right',
        theme: 'light',
        autoShow: false
      }
    },
    DashdigService
  ],
  template: `
    <div class="example">
      <div class="example-header">
        <h2>📦 Module Approach</h2>
        <p class="description">
          Use <code>DashdigModule.forRoot()</code> for NgModule-based applications.
          This example shows service configuration with providers (standalone compatible).
        </p>
      </div>

      <div class="example-content">
        <!-- Module Info -->
        <div class="section highlight">
          <h3>NgModule Configuration</h3>
          <p class="info-text">
            This example uses the traditional NgModule approach with <code>forRoot()</code>.
            Configuration is centralized and the service is available app-wide.
          </p>
        </div>

        <!-- Implementation -->
        <div class="section">
          <h3>Module Setup</h3>
          <pre class="code-block"><code>import &#123; NgModule &#125; from '&#64;angular/core';
import &#123; DashdigModule &#125; from '&#64;dashdig/widget/angular';

&#64;NgModule(&#123;
  imports: [
    DashdigModule.forRoot(&#123;
      apiKey: 'your-api-key',
      position: 'bottom-right',
      theme: 'light',
      autoShow: true
    &#125;)
  ]
&#125;)
export class AppModule &#123;&#125;</code></pre>
        </div>

        <!-- Service Status -->
        <div class="section" [class.success]="isInitialized">
          <h3>Service Status</h3>
          <div class="status-banner" [class.initialized]="isInitialized">
            <div class="status-icon">
              {{ isInitialized ? '✅' : '⏳' }}
            </div>
            <div class="status-content">
              <h4>{{ isInitialized ? 'Module Loaded' : 'Loading Module' }}</h4>
              <p *ngIf="isInitialized">
                The DashdigService is configured and available throughout the module.
              </p>
              <p *ngIf="!isInitialized">
                Waiting for module initialization...
              </p>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="section">
          <h3>Widget Controls</h3>
          <div class="button-group">
            <button 
              (click)="showWidget()" 
              class="btn btn-primary"
              [disabled]="!isInitialized"
            >
              👁️ Show Widget
            </button>
            <button 
              (click)="hideWidget()" 
              class="btn btn-secondary"
              [disabled]="!isInitialized"
            >
              🙈 Hide Widget
            </button>
            <button 
              (click)="trackEvent()" 
              class="btn btn-success"
              [disabled]="!isInitialized"
            >
              📊 Track Event
            </button>
          </div>
        </div>

        <!-- Error Display -->
        <div *ngIf="errorMessage" class="error-banner">
          ❌ {{ errorMessage }}
        </div>

        <!-- Usage in Components -->
        <div class="section">
          <h3>Usage in Components</h3>
          <pre class="code-block"><code>import &#123; Component &#125; from '&#64;angular/core';
import &#123; DashdigService &#125; from '&#64;dashdig/widget/angular';

&#64;Component(&#123;
  selector: 'app-my-component',
  template: \`
    &lt;button (click)="showWidget()"&gt;Show&lt;/button&gt;
    &lt;button (click)="trackClick()"&gt;Track&lt;/button&gt;
  \`
&#125;)
export class MyComponent &#123;
  constructor(private dashdig: DashdigService) &#123;&#125;

  showWidget() &#123;
    this.dashdig.show();
  &#125;

  trackClick() &#123;
    this.dashdig.track('button_click', &#123; button: 'cta' &#125;);
  &#125;
&#125;</code></pre>
        </div>

        <!-- forRoot vs forChild -->
        <div class="section">
          <h3>forRoot() vs forChild()</h3>
          <div class="comparison-grid">
            <div class="comparison-card">
              <h4>forRoot()</h4>
              <ul>
                <li>Use in AppModule</li>
                <li>Configures service</li>
                <li>Provides singleton</li>
                <li>One time only</li>
              </ul>
            </div>
            <div class="comparison-card">
              <h4>forChild()</h4>
              <ul>
                <li>Use in feature modules</li>
                <li>Imports component</li>
                <li>No service config</li>
                <li>Multiple times OK</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Complete Example -->
        <div class="section">
          <h3>Complete App Module</h3>
          <pre class="code-block"><code>// app.module.ts
import &#123; NgModule &#125; from '&#64;angular/core';
import &#123; BrowserModule &#125; from '&#64;angular/platform-browser';
import &#123; DashdigModule &#125; from '&#64;dashdig/widget/angular';
import &#123; AppComponent &#125; from './app.component';

&#64;NgModule(&#123;
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    DashdigModule.forRoot(&#123;
      apiKey: 'your-api-key',
      position: 'bottom-right',
      theme: 'dark'
    &#125;)
  ],
  providers: [],
  bootstrap: [AppComponent]
&#125;)
export class AppModule &#123;&#125;

// Feature module
&#64;NgModule(&#123;
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    DashdigModule  // Use forChild() implicitly
  ]
&#125;)
export class FeatureModule &#123;&#125;</code></pre>
        </div>

        <!-- Advantages -->
        <div class="section advantages">
          <h3>Advantages of Module Approach</h3>
          <ul>
            <li>✓ Centralized configuration</li>
            <li>✓ Service available app-wide</li>
            <li>✓ Familiar to Angular developers</li>
            <li>✓ Backwards compatible</li>
            <li>✓ Works with lazy loading</li>
            <li>✓ Dependency injection support</li>
          </ul>
        </div>

        <!-- Migration Note -->
        <div class="section migration-note">
          <h3>💡 Migration to Standalone</h3>
          <p>
            While this module approach still works great, Angular 17+ recommends
            using standalone components. Check the "Standalone" tab to see the
            modern approach!
          </p>
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

    .section.success {
      border-color: #28a745;
      background: #f0f9f4;
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

    .status-banner {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      border-radius: 8px;
      align-items: flex-start;
      background: #fff3cd;
      border: 2px solid #ffc107;
    }

    .status-banner.initialized {
      background: #d4edda;
      border: 2px solid #28a745;
    }

    .status-icon {
      font-size: 3rem;
      line-height: 1;
    }

    .status-content {
      flex: 1;
    }

    .status-content h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .status-content p {
      margin: 0;
      color: #666;
      line-height: 1.6;
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

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #218838;
    }

    .error-banner {
      padding: 1rem;
      background: #fed7d7;
      color: #9b2c2c;
      border-radius: 8px;
      font-weight: 600;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .comparison-card {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
    }

    .comparison-card h4 {
      color: #667eea;
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
    }

    .comparison-card ul {
      margin: 0;
      padding-left: 1.5rem;
      list-style: disc;
    }

    .comparison-card li {
      color: #666;
      line-height: 1.8;
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

    .migration-note {
      background: #fff9e6;
      border-color: #ffc107;
    }

    .migration-note h3 {
      color: #856404;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .migration-note p {
      color: #856404;
      line-height: 1.8;
      margin: 0;
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
      .comparison-grid {
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
export class ModuleExampleComponent implements OnInit {
  isInitialized = false;
  errorMessage = '';

  constructor(private dashdigService: DashdigService) {}

  ngOnInit(): void {
    this.isInitialized = this.dashdigService.isInitialized();
    
    if (!this.isInitialized) {
      this.errorMessage = 'Service not initialized via forRoot()';
    }
  }

  showWidget(): void {
    try {
      this.dashdigService.show();
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to show widget';
    }
  }

  hideWidget(): void {
    try {
      this.dashdigService.hide();
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to hide widget';
    }
  }

  trackEvent(): void {
    try {
      this.dashdigService.track('module_button_click', {
        source: 'module_example',
        approach: 'forRoot',
        timestamp: new Date().toISOString()
      });
      alert('Event tracked from module!');
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to track event';
    }
  }
}

