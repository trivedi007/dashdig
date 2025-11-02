import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashdigModule, DashdigService, DASHDIG_CONFIG } from '@dashdig/widget/angular';

@Component({
  selector: 'app-service-example',
  standalone: true,
  imports: [CommonModule, FormsModule, DashdigModule],
  providers: [
    {
      provide: DASHDIG_CONFIG,
      useValue: {
        apiKey: 'demo-api-key-service',
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
        <h2>💉 Service Injection Approach</h2>
        <p class="description">
          Use <code>DashdigService</code> for dependency injection and programmatic control.
          Perfect for TypeScript-heavy Angular applications.
        </p>
      </div>

      <div class="example-content">
        <!-- Service Status -->
        <div class="section" [class.success]="isInitialized">
          <h3>Service Status</h3>
          <div class="status-banner" [class.initialized]="isInitialized">
            <div class="status-icon">
              {{ isInitialized ? '✅' : '⏳' }}
            </div>
            <div class="status-content">
              <h4>{{ isInitialized ? 'Service Initialized' : 'Initializing Service' }}</h4>
              <p *ngIf="isInitialized">
                The DashdigService is active and available for dependency injection.
              </p>
              <p *ngIf="!isInitialized">
                Waiting for service to initialize...
              </p>
            </div>
          </div>
        </div>

        <!-- Service Configuration -->
        <div class="section">
          <h3>Service Configuration</h3>
          <p class="section-description">
            The service is configured via providers and is available throughout your application.
          </p>
          <div class="config-example">
            <h4>Provider Setup</h4>
            <pre class="code-block"><code>import &#123; DashdigService, DASHDIG_CONFIG &#125; from '&#64;dashdig/widget/angular';

&#64;Component(&#123;
  selector: 'app-example',
  providers: [
    &#123;
      provide: DASHDIG_CONFIG,
      useValue: &#123;
        apiKey: 'your-api-key',
        position: 'bottom-right',
        theme: 'light',
        autoShow: false
      &#125;
    &#125;,
    DashdigService
  ]
&#125;)
export class ExampleComponent &#123;
  constructor(private dashdig: DashdigService) &#123;&#125;
&#125;</code></pre>
          </div>
        </div>

        <!-- Controls Section -->
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
              (click)="checkStatus()" 
              class="btn btn-info"
              [disabled]="!isInitialized"
            >
              ℹ️ Check Status
            </button>
          </div>
        </div>

        <!-- Tracking Section -->
        <div class="section">
          <h3>Event Tracking</h3>
          <div class="track-form">
            <div class="form-group">
              <label for="eventName">Event Name</label>
              <input
                id="eventName"
                [(ngModel)]="eventName"
                type="text"
                placeholder="button_click"
                [disabled]="!isInitialized"
              />
            </div>
            <div class="form-group">
              <label for="eventData">Event Data (JSON)</label>
              <textarea
                id="eventData"
                [(ngModel)]="eventData"
                placeholder='{"key": "value"}'
                rows="3"
                [disabled]="!isInitialized"
              ></textarea>
            </div>
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

        <!-- Service Methods -->
        <div class="section">
          <h3>DashdigService Methods</h3>
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
              <code>track(event, data?)</code>
              <span>Track custom events</span>
            </div>
            <div class="method-item">
              <code>getInstance()</code>
              <span>Get the widget instance</span>
            </div>
            <div class="method-item">
              <code>isInitialized()</code>
              <span>Check if service is initialized</span>
            </div>
            <div class="method-item">
              <code>initializeWith(config)</code>
              <span>Manually initialize with config</span>
            </div>
          </div>
        </div>

        <!-- Advantages -->
        <div class="section advantages">
          <h3>Advantages of Service Approach</h3>
          <ul>
            <li>✓ Dependency injection support</li>
            <li>✓ Available anywhere via DI</li>
            <li>✓ Programmatic control</li>
            <li>✓ Single instance per injector</li>
            <li>✓ Full TypeScript support</li>
            <li>✓ Works with all Angular versions</li>
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

    .section.success {
      border-color: #28a745;
      background: #f0f9f4;
    }

    .section h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .section-description {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.6;
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

    .config-example h4 {
      margin-bottom: 0.75rem;
      color: #555;
      font-size: 1rem;
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

    .btn-info {
      background: #17a2b8;
      color: white;
    }

    .btn-info:hover:not(:disabled) {
      background: #138496;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #218838;
    }

    .track-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #555;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
      font-family: inherit;
    }

    .form-group input:disabled,
    .form-group textarea:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .error-banner {
      padding: 1rem;
      background: #fed7d7;
      color: #9b2c2c;
      border-radius: 8px;
      font-weight: 600;
    }

    .methods-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .method-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9f9f9;
      border-radius: 6px;
    }

    .method-item code {
      background: #667eea;
      color: white;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      font-size: 0.85rem;
      white-space: nowrap;
    }

    .method-item span {
      color: #666;
      line-height: 1.6;
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
      .button-group {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ServiceExampleComponent implements OnInit {
  // State
  isInitialized = false;
  errorMessage = '';

  // Tracking form
  eventName = 'service_button_click';
  eventData = '{"source": "service_example"}';

  constructor(private dashdigService: DashdigService) {}

  ngOnInit(): void {
    // Check if service is initialized
    this.isInitialized = this.dashdigService.isInitialized();
    
    if (!this.isInitialized) {
      this.errorMessage = 'Service not initialized. Check provider configuration.';
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
      const data = this.eventData ? JSON.parse(this.eventData) : undefined;
      this.dashdigService.track(this.eventName, data);
      alert(`Event tracked: ${this.eventName}`);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Invalid JSON in event data';
    }
  }

  checkStatus(): void {
    const isInit = this.dashdigService.isInitialized();
    const instance = this.dashdigService.getInstance();
    alert(`Service Status:\nInitialized: ${isInit}\nInstance: ${instance ? 'Available' : 'Null'}`);
  }
}

