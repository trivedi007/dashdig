import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M10 16L14 20L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#667eea"/>
                  <stop offset="100%" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
            <h1>DashDig Widget</h1>
          </div>
          <p class="subtitle">Angular Integration Examples</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main">
        <div class="container">
          <!-- Tab Navigation -->
          <nav class="tabs">
            <a 
              routerLink="/test" 
              routerLinkActive="active"
              class="tab"
            >
              <span class="tab-icon">🧪</span>
              <span class="tab-label">Simple Test</span>
            </a>
            <a 
              routerLink="/component" 
              routerLinkActive="active"
              class="tab"
            >
              <span class="tab-icon">🧩</span>
              <span class="tab-label">Component</span>
            </a>
            <a 
              routerLink="/service" 
              routerLinkActive="active"
              class="tab"
            >
              <span class="tab-icon">💉</span>
              <span class="tab-label">Service</span>
            </a>
            <a 
              routerLink="/standalone" 
              routerLinkActive="active"
              class="tab"
            >
              <span class="tab-icon">⚡</span>
              <span class="tab-label">Standalone</span>
            </a>
            <a 
              routerLink="/module" 
              routerLinkActive="active"
              class="tab"
            >
              <span class="tab-icon">📦</span>
              <span class="tab-label">Module</span>
            </a>
          </nav>

          <!-- Tab Content -->
          <div class="tab-content">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <p><strong>DashDig Widget Angular Examples</strong></p>
          <p class="footer-links">
            <a href="https://github.com/dashdig/widget" target="_blank">GitHub</a>
            <span>•</span>
            <a href="https://dashdig.com/docs" target="_blank">Documentation</a>
            <span>•</span>
            <a href="https://dashdig.com" target="_blank">DashDig.com</a>
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      width: 100%;
    }

    /* Header */
    .header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 2rem 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .logo h1 {
      color: white;
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      margin: 0;
    }

    /* Main Content */
    .main {
      flex: 1;
      padding: 3rem 0;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 0.5rem;
      border-radius: 12px;
      overflow-x: auto;
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background: transparent;
      border: 2px solid transparent;
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      text-decoration: none;
    }

    .tab:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .tab.active {
      background: white;
      color: #667eea;
      border-color: white;
    }

    .tab-icon {
      font-size: 1.5rem;
    }

    .tab-label {
      font-size: 1rem;
    }

    /* Tab Content */
    .tab-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      min-height: 500px;
    }

    /* Footer */
    .footer {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      padding: 2rem 0;
      color: white;
      text-align: center;
    }

    .footer p {
      margin: 0.5rem 0;
    }

    .footer-links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .footer-links a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s ease;
    }

    .footer-links a:hover {
      opacity: 1;
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header {
        padding: 1.5rem 0;
      }

      .logo h1 {
        font-size: 1.5rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .tabs {
        flex-wrap: wrap;
      }

      .tab {
        flex: 1 1 calc(50% - 0.5rem);
        min-width: 150px;
      }

      .tab-content {
        padding: 1.5rem;
      }

      .main {
        padding: 2rem 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'DashDig Widget - Angular Example';
}




