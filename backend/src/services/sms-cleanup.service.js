/**
 * SMS Verification Cleanup Service
 * Automatically cleans up expired SMS verifications
 */

const smsService = require('./sms.service');

class SmsCleanupService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.cleanupInterval = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Start the cleanup service
   * @param {number} intervalMs - Cleanup interval in milliseconds (default: 30 minutes)
   */
  start(intervalMs = this.cleanupInterval) {
    if (this.isRunning) {
      console.log('⚠️  SMS cleanup service is already running');
      return;
    }

    this.cleanupInterval = intervalMs;
    console.log(`🧹 Starting SMS cleanup service (interval: ${intervalMs / 1000 / 60} minutes)`);

    // Run cleanup immediately
    this.runCleanup();

    // Schedule periodic cleanup
    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, this.cleanupInterval);

    this.isRunning = true;
  }

  /**
   * Stop the cleanup service
   */
  stop() {
    if (!this.isRunning) {
      console.log('⚠️  SMS cleanup service is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('🛑 SMS cleanup service stopped');
  }

  /**
   * Run cleanup
   */
  async runCleanup() {
    try {
      console.log('🧹 Running SMS verification cleanup...');
      
      const result = await smsService.cleanupExpired();
      
      if (result.total > 0) {
        console.log(`✅ SMS cleanup completed: ${result.total} records deleted`);
        console.log(`   - Expired: ${result.expiredDeleted}`);
        console.log(`   - Old verified: ${result.oldVerifiedDeleted}`);
      } else {
        console.log('✅ SMS cleanup completed: No records to delete');
      }

      // Log statistics
      const stats = await smsService.getStatistics();
      console.log(`📊 SMS stats: ${stats.active} active, ${stats.verified} verified, ${stats.expired} expired`);

    } catch (error) {
      console.error('❌ SMS cleanup failed:', error.message);
    }
  }

  /**
   * Get service status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.cleanupInterval,
      intervalMinutes: this.cleanupInterval / 1000 / 60
    };
  }

  /**
   * Update cleanup interval
   * @param {number} intervalMs - New interval in milliseconds
   */
  updateInterval(intervalMs) {
    if (this.isRunning) {
      this.stop();
      this.start(intervalMs);
    } else {
      this.cleanupInterval = intervalMs;
    }
    console.log(`✅ SMS cleanup interval updated to ${intervalMs / 1000 / 60} minutes`);
  }
}

// Export singleton instance
module.exports = new SmsCleanupService();

