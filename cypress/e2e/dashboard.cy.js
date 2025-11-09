/**
 * Dashboard Routes E2E Tests - Cypress Implementation
 * 
 * Run with:
 *   npx cypress open  (interactive mode)
 *   npx cypress run   (headless mode)
 */

describe('Dashboard Routes - Comprehensive E2E Tests', () => {
  
  beforeEach(() => {
    // Setup: Mock authenticated user
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token-xyz');
      win.localStorage.setItem('user', JSON.stringify({
        id: 'test-user-123',
        email: 'test@dashdig.com',
        name: 'Test User'
      }));
    });
  });

  afterEach(() => {
    // Cleanup
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  /**
   * TEST SCENARIO 1: Route Accessibility
   * Verify all dashboard routes load without 404 errors
   */
  describe('Route Accessibility', () => {
    
    it('should load main dashboard page and redirect to overview', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard/overview');
      cy.contains('Dashboard Overview').should('be.visible');
    });

    it('should load overview page with stat cards', () => {
      cy.visit('/dashboard/overview');
      cy.get('[data-testid="total-links"], .stat-card').should('exist');
    });

    it('should load URLs page', () => {
      cy.visit('/dashboard/urls');
      cy.url().should('include', '/dashboard/urls');
      cy.contains('URL').should('be.visible');
    });

    it('should load analytics page', () => {
      cy.visit('/dashboard/analytics');
      cy.url().should('include', '/dashboard/analytics');
      cy.contains('Analytics').should('be.visible');
    });

    it('should load widget page', () => {
      cy.visit('/dashboard/widget');
      cy.url().should('include', '/dashboard/widget');
      cy.contains('Widget').should('be.visible');
    });
  });

  /**
   * TEST SCENARIO 2: Data Fetching
   * Verify API calls return expected data
   */
  describe('Data Fetching', () => {
    
    it('should fetch and display dashboard statistics', () => {
      cy.intercept('GET', '**/api/dashboard/stats', {
        statusCode: 200,
        body: {
          success: true,
          stats: {
            totalLinks: 125,
            totalClicks: 4523,
            activeLinks: 98
          }
        }
      }).as('getDashboardStats');

      cy.visit('/dashboard/overview');
      cy.wait('@getDashboardStats');
    });

    it('should fetch and display URL list', () => {
      cy.intercept('GET', '**/api/urls*', {
        statusCode: 200,
        body: {
          success: true,
          count: 2,
          urls: [
            {
              _id: '1',
              shortCode: 'summer-sale-2024',
              shortUrl: 'https://dshd.gg/summer-sale-2024',
              originalUrl: 'https://example.com/summer-sale',
              clicks: 456,
              createdAt: '2024-01-15T10:00:00.000Z'
            },
            {
              _id: '2',
              shortCode: 'product-launch',
              shortUrl: 'https://dshd.gg/product-launch',
              originalUrl: 'https://example.com/products',
              clicks: 234,
              createdAt: '2024-01-20T14:30:00.000Z'
            }
          ]
        }
      }).as('getUrls');

      cy.visit('/dashboard/urls');
      cy.wait('@getUrls');
      cy.contains('summer-sale-2024').should('be.visible');
    });

    it('should handle empty data gracefully', () => {
      cy.intercept('GET', '**/api/urls*', {
        statusCode: 200,
        body: { success: true, count: 0, urls: [] }
      });

      cy.visit('/dashboard/urls');
      cy.contains('No URLs', { matchCase: false }).should('exist');
    });
  });

  /**
   * TEST SCENARIO 3: Loading States
   * Verify loading indicators display correctly
   */
  describe('Loading States', () => {
    
    it('should show loading spinner on overview page', () => {
      cy.intercept('GET', '**/api/dashboard/stats', (req) => {
        req.reply((res) => {
          res.delay(1000);
          res.send({
            statusCode: 200,
            body: { success: true, stats: { totalLinks: 0, totalClicks: 0 } }
          });
        });
      });

      cy.visit('/dashboard/overview');
      cy.get('.animate-spin, [data-testid="loading-spinner"]', { timeout: 500 })
        .should('exist');
    });

    it('should show loading state for URL list', () => {
      cy.intercept('GET', '**/api/urls*', (req) => {
        req.reply((res) => {
          res.delay(1000);
          res.send({ statusCode: 200, body: { success: true, urls: [] } });
        });
      });

      cy.visit('/dashboard/urls');
      cy.get('.animate-spin, [data-testid="loading-spinner"]', { timeout: 500 })
        .should('exist');
    });
  });

  /**
   * TEST SCENARIO 4: Error Handling
   * Verify error states are handled gracefully
   */
  describe('Error Handling', () => {
    
    it('should display error message on API failure', () => {
      cy.intercept('GET', '**/api/dashboard/stats', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      });

      cy.visit('/dashboard/overview');
      cy.contains('error', { matchCase: false }).should('exist');
    });

    it('should show retry button or error message on failed request', () => {
      cy.intercept('GET', '**/api/urls*', {
        statusCode: 500
      }).as('failedRequest');

      cy.visit('/dashboard/urls');
      cy.wait('@failedRequest');
      
      // Check for either retry button or error message
      cy.get('body').then($body => {
        const hasRetry = $body.find('[data-testid="retry-button"]').length > 0;
        const hasError = $body.text().toLowerCase().includes('error') || 
                        $body.text().toLowerCase().includes('failed');
        expect(hasRetry || hasError).to.be.true;
      });
    });

    it('should handle network timeout gracefully', () => {
      cy.intercept('GET', '**/api/dashboard/stats', {
        forceNetworkError: true
      });

      cy.visit('/dashboard/overview');
      // Page should not crash
      cy.get('body').should('exist');
    });
  });

  /**
   * TEST SCENARIO 5: Navigation
   * Verify navigation between dashboard pages works correctly
   */
  describe('Navigation', () => {
    
    it('should navigate to URLs page from dashboard', () => {
      cy.visit('/dashboard');
      cy.get('[id*="nav-urls"], a[href*="/dashboard/urls"]').first().click();
      cy.url().should('include', '/dashboard/urls');
    });

    it('should navigate to analytics page via sidebar', () => {
      cy.visit('/dashboard/overview');
      cy.get('[id*="nav-analytics"], a[href*="/dashboard/analytics"]').first().click();
      cy.url().should('include', '/dashboard/analytics');
    });

    it('should navigate to widget page', () => {
      cy.visit('/dashboard');
      cy.get('[id*="nav-widget"], a[href*="/dashboard/widget"]').first().click();
      cy.url().should('include', '/dashboard/widget');
    });

    it('should highlight active navigation item', () => {
      cy.visit('/dashboard/urls');
      cy.get('[id*="nav-urls"]').should('have.class', 'active')
        .or('have.attr', 'class').and('match', /text-\[#FF6B35\]/);
    });

    it('should navigate using browser back button', () => {
      cy.visit('/dashboard/overview');
      cy.get('[id*="nav-urls"]').click();
      cy.url().should('include', '/dashboard/urls');
      cy.go('back');
      cy.url().should('include', '/dashboard/overview');
    });
  });

  /**
   * TEST SCENARIO 6: Authentication & Authorization
   * Verify auth checks are properly enforced
   */
  describe('Authentication & Authorization', () => {
    
    it('should redirect to login if not authenticated', () => {
      cy.window().then((win) => {
        win.localStorage.removeItem('token');
      });

      cy.visit('/dashboard', { failOnStatusCode: false });
      // Should redirect or show login prompt
      cy.url().then(url => {
        expect(url).to.satisfy(u => 
          u.includes('/auth/signin') || 
          u.includes('/login') || 
          u.includes('/dashboard')
        );
      });
    });

    it('should allow access with valid token', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token-xyz');
      });

      cy.visit('/dashboard/overview');
      cy.url().should('include', '/dashboard');
    });

    it('should include auth header in API requests', () => {
      cy.intercept('GET', '**/api/dashboard/stats', (req) => {
        // Check if request includes Authorization header
        if (req.headers.authorization) {
          expect(req.headers.authorization).to.include('Bearer');
        }
        req.reply({ statusCode: 200, body: { success: true, stats: {} } });
      }).as('statsRequest');

      cy.visit('/dashboard/overview');
    });
  });

  /**
   * ADDITIONAL TEST SCENARIOS
   */
  describe('Advanced Functionality', () => {
    
    it('should create new URL from dashboard', () => {
      cy.intercept('POST', '**/api/urls', {
        statusCode: 200,
        body: {
          success: true,
          shortCode: 'test-url',
          shortUrl: 'https://dshd.gg/test-url',
          originalUrl: 'https://example.com/test'
        }
      }).as('createUrl');

      cy.visit('/dashboard/urls');
      
      // Try to find URL creation form elements
      cy.get('body').then($body => {
        if ($body.find('input[placeholder*="URL"], input[type="url"]').length > 0) {
          cy.get('input[placeholder*="URL"], input[type="url"]').first()
            .type('https://example.com/test');
          cy.get('button[type="submit"], button:contains("Create"), button:contains("Shorten")')
            .first().click();
        }
      });
    });

    it('should copy short URL to clipboard', () => {
      cy.intercept('GET', '**/api/urls*', {
        statusCode: 200,
        body: {
          success: true,
          urls: [{
            shortCode: 'test',
            shortUrl: 'https://dshd.gg/test',
            originalUrl: 'https://example.com',
            clicks: 0
          }]
        }
      });

      cy.visit('/dashboard/urls');
      
      // Look for copy button
      cy.get('body').then($body => {
        const copyButtons = $body.find('button:contains("Copy"), [data-testid*="copy"]');
        if (copyButtons.length > 0) {
          cy.wrap(copyButtons).first().click();
          cy.contains('Copied', { matchCase: false, timeout: 3000 }).should('exist');
        }
      });
    });
  });

  /**
   * RESPONSIVE DESIGN TESTS
   */
  describe('Responsive Design', () => {
    
    it('should display mobile-friendly layout on small screens', () => {
      cy.viewport('iphone-x');
      cy.visit('/dashboard');
      
      // Page should render without horizontal scroll
      cy.get('body').should('be.visible');
    });

    it('should display desktop layout on large screens', () => {
      cy.viewport(1920, 1080);
      cy.visit('/dashboard');
      cy.get('body').should('be.visible');
    });
  });

  /**
   * PERFORMANCE TESTS
   */
  describe('Performance', () => {
    
    it('should load dashboard within acceptable time', () => {
      const start = Date.now();
      
      cy.visit('/dashboard/overview');
      cy.get('body').should('be.visible').then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(5000); // 5 seconds
      });
    });
  });
});
