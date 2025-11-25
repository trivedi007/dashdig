require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('🚀 Starting Dashdig server...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected');

    // Try to connect to Redis (optional)
    try {
      await connectRedis();
    } catch (error) {
      console.warn('⚠️  Redis connection skipped:', error.message);
    }

    // Start job scheduler
    try {
      const { startScheduler } = require('./jobs/scheduler');
      startScheduler();
    } catch (error) {
      console.warn('⚠️  Job scheduler failed to start:', error.message);
    }

    // Start server - listen on IPv6 for Railway
    app.listen(PORT, '::', () => {
      console.log(`🎉 Server running on port ${PORT}`);
      console.log(`❤️  Health check: /health`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
// Force Railway rebuild Thu Oct  2 15:12:48 EDT 2025
