// ***********************************************
// This file contains custom commands for Cypress tests
// that can be used across all test files
// ***********************************************

/**
 * Custom command to log in a user
 * Usage: cy.login() or cy.login({ email: 'user@example.com', password: 'pass123' })
 */
Cypress.Commands.add('login', (credentials = {}) => {
  const defaultCredentials = {
    email: 'test@dashdig.com',
    password: 'testpassword123',
    token: 'mock-jwt-token-xyz'
  };

  const user = { ...defaultCredentials, ...credentials };

  // Store token and user info in localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('token', user.token);
    win.localStorage.setItem('user', JSON.stringify({
      id: 'test-user-123',
      email: user.email,
      name: 'Test User'
    }));
  });
});

/**
 * Custom command to log out a user
 * Usage: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('token');
    win.localStorage.removeItem('user');
  });
});

/**
 * Custom command to check if user is authenticated
 * Usage: cy.isAuthenticated().should('be.true')
 */
Cypress.Commands.add('isAuthenticated', () => {
  return cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    return !!token;
  });
});

/**
 * Custom command to intercept and mock dashboard API calls
 * Usage: cy.mockDashboardAPI()
 */
Cypress.Commands.add('mockDashboardAPI', (options = {}) => {
  const defaultStats = {
    success: true,
    stats: {
      totalLinks: options.totalLinks || 125,
      totalClicks: options.totalClicks || 4523,
      activeLinks: options.activeLinks || 98,
      clicksToday: options.clicksToday || 234
    }
  };

  const defaultUrls = {
    success: true,
    count: 2,
    urls: options.urls || [
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
  };

  // Mock stats endpoint
  cy.intercept('GET', '**/api/dashboard/stats', {
    statusCode: 200,
    body: options.stats || defaultStats
  }).as('getDashboardStats');

  // Mock URLs endpoint
  cy.intercept('GET', '**/api/urls*', {
    statusCode: 200,
    body: options.urlsData || defaultUrls
  }).as('getUrls');

  // Mock analytics endpoint
  cy.intercept('GET', '**/api/analytics*', {
    statusCode: 200,
    body: options.analytics || {
      success: true,
      analytics: {
        totalClicks: 4523,
        uniqueVisitors: 2341
      }
    }
  }).as('getAnalytics');
});

/**
 * Custom command to wait for page to be fully loaded
 * Usage: cy.waitForPageLoad()
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      if (win.document.readyState === 'complete') {
        resolve();
      } else {
        win.addEventListener('load', resolve);
      }
    });
  });
});

/**
 * Custom command to visit dashboard route with authentication
 * Usage: cy.visitDashboard('/overview')
 */
Cypress.Commands.add('visitDashboard', (route = '/overview') => {
  cy.login();
  cy.visit(`/dashboard${route}`);
  cy.waitForPageLoad();
});

/**
 * Custom command to check for loading state
 * Usage: cy.checkLoadingState()
 */
Cypress.Commands.add('checkLoadingState', () => {
  cy.get('.animate-spin, [data-testid="loading-spinner"], [data-testid="loading"]', 
    { timeout: 1000 }
  ).should('exist');
});

/**
 * Custom command to check for error message
 * Usage: cy.checkErrorMessage('Failed to load')
 */
Cypress.Commands.add('checkErrorMessage', (message) => {
  if (message) {
    cy.contains(message, { matchCase: false }).should('be.visible');
  } else {
    cy.get('[data-testid="error-message"], .error').should('exist');
  }
});

/**
 * Custom command to create a short URL via UI
 * Usage: cy.createShortUrl('https://example.com')
 */
Cypress.Commands.add('createShortUrl', (url, customSlug = '') => {
  cy.get('input[placeholder*="URL"], input[type="url"]').first().clear().type(url);
  
  if (customSlug) {
    cy.get('input[placeholder*="slug"], input[name*="slug"]').type(customSlug);
  }
  
  cy.get('button[type="submit"], button:contains("Create"), button:contains("Shorten")')
    .first()
    .click();
});

/**
 * Custom command to intercept API with delay (for testing loading states)
 * Usage: cy.interceptWithDelay('GET', '**/api/urls', 2000, { body: mockData })
 */
Cypress.Commands.add('interceptWithDelay', (method, url, delay, response = {}) => {
  cy.intercept(method, url, (req) => {
    req.reply((res) => {
      res.delay(delay);
      res.send({
        statusCode: response.statusCode || 200,
        body: response.body || { success: true }
      });
    });
  });
});

/**
 * Custom command to mock API failure
 * Usage: cy.mockAPIFailure('GET', '**/api/urls', 500)
 */
Cypress.Commands.add('mockAPIFailure', (method, url, statusCode = 500) => {
  cy.intercept(method, url, {
    statusCode: statusCode,
    body: { error: 'Internal server error' }
  });
});

/**
 * Custom command to copy text to clipboard and verify
 * Usage: cy.copyToClipboard('[data-testid="copy-button"]')
 */
Cypress.Commands.add('copyToClipboard', (selector) => {
  cy.get(selector).click();
  cy.contains('Copied', { matchCase: false, timeout: 3000 }).should('exist');
});

/**
 * Custom command to navigate using sidebar
 * Usage: cy.navigateToPage('urls')
 */
Cypress.Commands.add('navigateToPage', (page) => {
  cy.get('[id*="nav-' + page + '"], a[href*="/dashboard/' + page + '"]').first().click();
  cy.url().should('include', '/dashboard/' + page);
});

// Add custom assertions
Cypress.Commands.add('shouldBeAuthenticated', () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    expect(token).to.exist;
  });
});

Cypress.Commands.add('shouldNotBeAuthenticated', () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    expect(token).to.be.null;
  });
});

// Export for TypeScript support
export {};
