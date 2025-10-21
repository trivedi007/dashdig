/**
 * Route Verification Script
 * Tests that all routes are properly loaded and accessible
 */

const chalk = require('chalk');

console.log(chalk.cyan('🔍 ROUTE VERIFICATION SCRIPT'));
console.log(chalk.cyan('═'.repeat(60)));
console.log('');

// Test 1: Load api.js
console.log(chalk.blue('📦 Test 1: Loading api.js...'));
try {
  const apiRoutes = require('./src/routes/api');
  console.log(chalk.green('✅ api.js loaded successfully'));
  console.log('   Type:', typeof apiRoutes);
} catch (error) {
  console.log(chalk.red('❌ Failed to load api.js'));
  console.log(chalk.red('   Error:'), error.message);
  console.log(chalk.red('   Stack:'), error.stack);
  process.exit(1);
}

// Test 2: Load url.route.js
console.log('');
console.log(chalk.blue('📦 Test 2: Loading url.route.js...'));
try {
  const urlRoutes = require('./src/routes/url.route');
  console.log(chalk.green('✅ url.route.js loaded successfully'));
  console.log('   Type:', typeof urlRoutes);
  console.log('   Stack:', urlRoutes.stack ? urlRoutes.stack.length + ' routes' : 'N/A');
} catch (error) {
  console.log(chalk.red('❌ Failed to load url.route.js'));
  console.log(chalk.red('   Error:'), error.message);
  console.log(chalk.red('   Stack:'), error.stack);
  process.exit(1);
}

// Test 3: Load controller
console.log('');
console.log(chalk.blue('📦 Test 3: Loading url.controller.js...'));
try {
  const urlController = require('./src/controllers/url.controller');
  console.log(chalk.green('✅ url.controller.js loaded successfully'));
  console.log('   Type:', typeof urlController);
  console.log('   createShortUrl:', typeof urlController.createShortUrl);
  console.log('   redirect:', typeof urlController.redirect);
} catch (error) {
  console.log(chalk.red('❌ Failed to load url.controller.js'));
  console.log(chalk.red('   Error:'), error.message);
  console.log(chalk.red('   Stack:'), error.stack);
  process.exit(1);
}

// Test 4: Load middleware
console.log('');
console.log(chalk.blue('📦 Test 4: Loading auth middleware...'));
try {
  const authMiddleware = require('./src/middleware/auth');
  console.log(chalk.green('✅ auth middleware loaded successfully'));
  console.log('   authMiddleware:', typeof authMiddleware.authMiddleware);
  console.log('   requireAuth:', typeof authMiddleware.requireAuth);
} catch (error) {
  console.log(chalk.red('❌ Failed to load auth middleware'));
  console.log(chalk.red('   Error:'), error.message);
  console.log(chalk.red('   Stack:'), error.stack);
  process.exit(1);
}

// Test 5: Load app.js
console.log('');
console.log(chalk.blue('📦 Test 5: Loading app.js...'));
try {
  const app = require('./src/app');
  console.log(chalk.green('✅ app.js loaded successfully'));
  console.log('   Type:', typeof app);
  
  // List all registered routes
  console.log('');
  console.log(chalk.yellow('📋 Registered Routes:'));
  
  function listRoutes(stack, basePath = '') {
    stack.forEach(layer => {
      if (layer.route) {
        // Route with methods
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        console.log(chalk.green('   ✓'), chalk.white(methods.padEnd(10)), chalk.cyan(basePath + layer.route.path));
      } else if (layer.name === 'router' && layer.handle.stack) {
        // Nested router
        const path = layer.regexp.source
          .replace('\\/?', '')
          .replace('(?=\\/|$)', '')
          .replace(/\\\//g, '/')
          .replace('^', '')
          .replace('$', '');
        
        const cleanPath = path || '';
        console.log(chalk.yellow('   →'), chalk.magenta('ROUTER'), chalk.cyan(basePath + cleanPath));
        listRoutes(layer.handle.stack, basePath + cleanPath);
      }
    });
  }
  
  if (app._router && app._router.stack) {
    listRoutes(app._router.stack);
  }
  
} catch (error) {
  console.log(chalk.red('❌ Failed to load app.js'));
  console.log(chalk.red('   Error:'), error.message);
  console.log(chalk.red('   Stack:'), error.stack);
  process.exit(1);
}

// Summary
console.log('');
console.log(chalk.cyan('═'.repeat(60)));
console.log(chalk.green('✅ ALL ROUTE VERIFICATION TESTS PASSED'));
console.log('');
console.log(chalk.yellow('🎯 Expected Routes:'));
console.log(chalk.white('   POST /api/urls') + chalk.gray(' - Create short URL'));
console.log(chalk.white('   GET  /api/urls') + chalk.gray(' - Get all URLs (auth required)'));
console.log(chalk.white('   GET  /:slug') + chalk.gray(' - Redirect short URL'));
console.log(chalk.white('   GET  /health') + chalk.gray(' - Health check'));
console.log('');
console.log(chalk.cyan('═'.repeat(60)));

