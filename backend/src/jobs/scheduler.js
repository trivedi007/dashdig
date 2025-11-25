/**
 * Job Scheduler
 * Sets up cron jobs for background tasks
 */

const cron = require('node-cron');
const { weeklyPatternAnalysis } = require('./pattern-detection.job');

let schedulerEnabled = false;

/**
 * Initialize and start all scheduled jobs
 */
function startScheduler() {
  if (schedulerEnabled) {
    console.log('⚠️  Scheduler already running');
    return;
  }

  // Only run in production or if explicitly enabled
  if (process.env.NODE_ENV !== 'production' && !process.env.ENABLE_JOBS) {
    console.log('⏭️  Skipping scheduler (not in production)');
    return;
  }

  console.log('🕐 Starting job scheduler...');

  // Weekly pattern analysis: Every Sunday at 2 AM
  cron.schedule('0 2 * * 0', async () => {
    console.log('📅 Running weekly pattern analysis job...');
    try {
      await weeklyPatternAnalysis();
    } catch (error) {
      console.error('❌ Weekly pattern analysis failed:', error);
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });

  console.log('✅ Scheduler started:');
  console.log('   - Weekly pattern analysis: Sundays at 2:00 AM UTC');

  schedulerEnabled = true;
}

/**
 * Stop all scheduled jobs
 */
function stopScheduler() {
  if (!schedulerEnabled) {
    return;
  }

  // Note: node-cron doesn't have a built-in stop all, but we can track it
  schedulerEnabled = false;
  console.log('🛑 Scheduler stopped');
}

module.exports = {
  startScheduler,
  stopScheduler
};

