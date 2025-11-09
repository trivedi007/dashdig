// ***********************************************************
// This file is processed and loaded automatically before test files.
//
// You can change the location of this file or turn off automatically serving support files
// with the 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR logs to reduce noise in test output
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Add custom error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // for uncaught exceptions (like React hydration warnings)
  
  // Allow test to fail for actual errors, but not warnings
  if (err.message.includes('Hydration')) {
    return false;
  }
  
  // Log the error but don't fail the test for common React warnings
  if (err.message.includes('Warning:')) {
    console.warn('React Warning:', err.message);
    return false;
  }
  
  // Let real errors fail the test
  return true;
});

// Custom configuration
Cypress.on('window:before:load', (win) => {
  // Stub console methods if needed
  win.console.warn = () => {}; // Suppress warnings in test output
});
