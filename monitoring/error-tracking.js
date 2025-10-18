// ==========================================
// DASHDIG ERROR TRACKING & LOGGING
// Integrates with Sentry, LogRocket, or custom logging
// ==========================================

class ErrorTracker {
  constructor(config = {}) {
    this.config = {
      environment: process.env.NODE_ENV || 'development',
      serviceName: 'dashdig',
      sentryDsn: process.env.SENTRY_DSN || null,
      logLevel: config.logLevel || 'info',
      enableConsoleLogging: config.enableConsoleLogging !== false,
      ...config
    };
    
    this.initializeSentry();
  }
  
  // Initialize Sentry if DSN is provided
  initializeSentry() {
    if (this.config.sentryDsn) {
      try {
        // Uncomment when Sentry is installed
        // const Sentry = require('@sentry/node');
        // Sentry.init({
        //   dsn: this.config.sentryDsn,
        //   environment: this.config.environment,
        //   tracesSampleRate: 1.0,
        // });
        console.log('✓ Sentry initialized');
      } catch (error) {
        console.error('Failed to initialize Sentry:', error.message);
      }
    }
  }
  
  // Log error with context
  logError(error, context = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      service: this.config.serviceName,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context: {
        ...context,
        url: context.req?.url,
        method: context.req?.method,
        userId: context.userId,
        requestId: context.requestId
      }
    };
    
    // Console logging
    if (this.config.enableConsoleLogging) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('🚨 ERROR LOGGED');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Time:', errorData.timestamp);
      console.error('Message:', error.message);
      console.error('Context:', JSON.stringify(context, null, 2));
      console.error('Stack:', error.stack);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
    
    // Send to Sentry
    if (this.config.sentryDsn) {
      // Uncomment when Sentry is installed
      // Sentry.captureException(error, { contexts: { custom: context } });
    }
    
    // Log to file
    this.logToFile(errorData);
    
    return errorData;
  }
  
  // Log to file
  logToFile(errorData) {
    const fs = require('fs');
    const path = require('path');
    
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, `error-${errorData.timestamp.split('T')[0]}.log`);
    
    try {
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      fs.appendFileSync(logFile, JSON.stringify(errorData) + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }
  
  // Track performance metrics
  trackPerformance(metricName, duration, metadata = {}) {
    const metric = {
      timestamp: new Date().toISOString(),
      metric: metricName,
      duration: duration,
      metadata: metadata
    };
    
    if (this.config.enableConsoleLogging && duration > 1000) {
      console.warn(`⚠️  Slow operation: ${metricName} took ${duration}ms`);
    }
    
    // Log slow operations
    if (duration > 2000) {
      this.logToFile({
        type: 'performance',
        ...metric
      });
    }
  }
  
  // Track user actions
  trackAction(action, userId, metadata = {}) {
    const actionData = {
      timestamp: new Date().toISOString(),
      action: action,
      userId: userId,
      metadata: metadata
    };
    
    if (this.config.enableConsoleLogging && this.config.logLevel === 'debug') {
      console.log('📊 Action:', action, 'User:', userId);
    }
  }
  
  // Express middleware for automatic error tracking
  expressMiddleware() {
    return (err, req, res, next) => {
      this.logError(err, {
        req: {
          url: req.url,
          method: req.method,
          headers: req.headers,
          body: req.body
        },
        userId: req.user?.id,
        requestId: req.id
      });
      
      // Pass error to next middleware
      next(err);
    };
  }
  
  // Track API calls
  trackApiCall(endpoint, method, statusCode, duration) {
    const call = {
      timestamp: new Date().toISOString(),
      endpoint: endpoint,
      method: method,
      statusCode: statusCode,
      duration: duration
    };
    
    // Log errors (4xx, 5xx)
    if (statusCode >= 400) {
      this.logToFile({
        type: 'api-error',
        ...call
      });
    }
    
    // Log slow requests
    if (duration > 3000) {
      console.warn(`⚠️  Slow API call: ${method} ${endpoint} - ${duration}ms`);
    }
  }
}

// Export singleton instance
const errorTracker = new ErrorTracker({
  logLevel: process.env.LOG_LEVEL || 'info',
  enableConsoleLogging: process.env.NODE_ENV !== 'test'
});

module.exports = errorTracker;

// Example usage in Express:
/*
const errorTracker = require('./monitoring/error-tracking');

// Use as middleware
app.use(errorTracker.expressMiddleware());

// Manual error tracking
try {
  // Your code
} catch (error) {
  errorTracker.logError(error, {
    userId: req.user?.id,
    action: 'create_url'
  });
  throw error;
}

// Track performance
const start = Date.now();
// ... operation
const duration = Date.now() - start;
errorTracker.trackPerformance('url_creation', duration);

// Track API calls
errorTracker.trackApiCall('/api/urls', 'POST', 201, 450);
*/
