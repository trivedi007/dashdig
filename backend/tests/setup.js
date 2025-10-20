/**
 * Test Setup and Configuration
 * Runs before all tests
 */

const { beforeAll, afterAll } = require('vitest');
const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/dashdig-test';

// Global test setup
beforeAll(async () => {
  console.log('🧪 Setting up test environment...');
  
  // Connect to test database if not already connected
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Test database connected');
    } catch (error) {
      console.error('❌ Test database connection failed:', error);
      process.exit(1);
    }
  }
});

// Global test teardown
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...');
  
  // Close database connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('✅ Test database disconnected');
  }
});

// Mock console during tests to reduce noise
global.console = {
  ...console,
  log: (...args) => {
    // Only log in verbose mode
    if (process.env.VERBOSE_TESTS) {
      console.info(...args);
    }
  },
  // Keep error, warn, and info
  error: console.error,
  warn: console.warn,
  info: console.info
};

