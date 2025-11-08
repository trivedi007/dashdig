import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashdigComponent } from '@dashdig/widget/angular';

/**
 * Simple Test Component
 * Minimal example to verify DashDig Angular integration works
 */
@Component({
  selector: 'app-simple-test',
  standalone: true,
  imports: [CommonModule, DashdigComponent],
  template: `
    <div class="test-container">
      <div class="test-header">
        <h1>🧪 DashDig Angular Integration Test</h1>
        <p class="subtitle">Minimal example to verify everything works</p>
      </div>

      <div class="test-content">
        <!-- DashDig Widget Component -->
        <div class="widget-section">
          <h2>Widget Integration</h2>
          <p>If the widget initializes below without errors, the integration is working! ✅</p>
          
          <dashdig-widget 
            [apiKey]="'ddg_test_key_12345'"
            [position]="'bottom-right'"
            [theme]="'light'"
            [autoShow]="false"
            (load)="onWidgetLoad()"
            (error)="onWidgetError($event)">
          </dashdig-widget>
        </div>

        <!-- Status Indicator -->
        <div class="status-section">
          <h2>Status</h2>
          <div class="status-card" [class.success]="widgetLoaded" [class.error]="hasError">
            <div class="status-indicator">
              <span class="status-dot" [class.active]="widgetLoaded"></span>
              <span class="status-text">
                {{ widgetLoaded ? 'Widget Loaded Successfully ✅' : 'Waiting for widget...' }}
              </span>
            </div>
            
            <div *ngIf="hasError" class="error-message">
              <strong>Error:</strong> {{ errorMessage }}
            </div>
          </div>
        </div>

        <!-- Verification Checklist -->
        <div class="checklist-section">
          <h2>Verification Checklist</h2>
          <ul class="checklist">
            <li [class.checked]="!hasError">
              <span class="checkbox">{{ !hasError ? '✅' : '⬜' }}</span>
              App compiles without errors
            </li>
            <li [class.checked]="widgetLoaded">
              <span class="checkbox">{{ widgetLoaded ? '✅' : '⬜' }}</span>
              Widget initializes successfully
            </li>
            <li [class.checked]="widgetLoaded">
              <span class="checkbox">{{ widgetLoaded ? '✅' : '⬜' }}</span>
              No console errors
            </li>
            <li [class.checked]="widgetLoaded">
              <span class="checkbox">{{ widgetLoaded ? '✅' : '⬜' }}</span>
              Component renders correctly
            </li>
          </ul>
        </div>

        <!-- Success Message -->
        <div *ngIf="widgetLoaded && !hasError" class="success-banner">
          <h3>🎉 Success!</h3>
          <p>DashDig Angular integration is working perfectly!</p>
          <p class="next-steps">
            Next steps: Check out the full examples in the navigation to see advanced features.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .test-header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .test-header h1 {
      color: #667eea;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .test-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .widget-section,
    .status-section,
    .checklist-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid #e0e0e0;
    }

    h2 {
      color: #333;
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .widget-section p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .status-card {
      padding: 1.5rem;
      border-radius: 8px;
      background: #f8f9fa;
      border: 2px solid #e0e0e0;
      transition: all 0.3s ease;
    }

    .status-card.success {
      background: #d4edda;
      border-color: #28a745;
    }

    .status-card.error {
      background: #f8d7da;
      border-color: #dc3545;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ccc;
      transition: all 0.3s ease;
    }

    .status-dot.active {
      background: #28a745;
      box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.2);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.2);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(40, 167, 69, 0.1);
      }
    }

    .status-text {
      font-weight: 600;
      color: #333;
      font-size: 1.1rem;
    }

    .error-message {
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 6px;
      color: #721c24;
    }

    .error-message strong {
      display: block;
      margin-bottom: 0.5rem;
    }

    .checklist {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .checklist li {
      padding: 1rem;
      margin-bottom: 0.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
      font-size: 1.05rem;
    }

    .checklist li.checked {
      background: #d4edda;
      border-left: 4px solid #28a745;
    }

    .checkbox {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .success-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }

    .success-banner h3 {
      margin: 0 0 1rem 0;
      font-size: 2rem;
      color: white;
    }

    .success-banner p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }

    .next-steps {
      margin-top: 1rem;
      opacity: 0.9;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .test-container {
        padding: 1rem;
      }

      .test-header h1 {
        font-size: 1.8rem;
      }

      .widget-section,
      .status-section,
      .checklist-section {
        padding: 1.5rem;
      }
    }
  `]
})
export class SimpleTestComponent {
  widgetLoaded = false;
  hasError = false;
  errorMessage = '';

  onWidgetLoad(): void {
    console.log('✅ [Simple Test] Widget loaded successfully!');
    this.widgetLoaded = true;
    this.hasError = false;
  }

  onWidgetError(error: Error): void {
    console.error('❌ [Simple Test] Widget error:', error);
    this.hasError = true;
    this.errorMessage = error.message;
    this.widgetLoaded = false;
  }
}

