/**
 * Token Cleanup Service
 * Automatically cleans up expired verification tokens
 */

const User = require('../models/User');

class TokenCleanupService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    // Run cleanup every hour
    this.cleanupInterval = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  /**
   * Start the automatic cleanup service
   */
  start() {
    if (this.isRunning) {
      console.log('Token cleanup service is already running');
      return;
    }

    console.log('🧹 Starting token cleanup service...');
    
    // Run immediately on start
    this.cleanupExpiredTokens();
    
    // Then run on interval
    this.intervalId = setInterval(() => {
      this.cleanupExpiredTokens();
    }, this.cleanupInterval);
    
    this.isRunning = true;
    console.log('✅ Token cleanup service started (runs every hour)');
  }

  /**
   * Stop the cleanup service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('🛑 Token cleanup service stopped');
    }
  }

  /**
   * Clean up expired verification tokens
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupExpiredTokens() {
    try {
      const now = new Date();
      
      console.log('🧹 Running token cleanup...');

      // Find and update users with expired tokens
      const result = await User.updateMany(
        {
          verificationToken: { $ne: null },
          verificationTokenExpires: { $lt: now }
        },
        {
          $set: {
            verificationToken: null,
            verificationTokenExpires: null
          }
        }
      );

      const cleanedCount = result.modifiedCount || 0;

      if (cleanedCount > 0) {
        console.log(`✅ Cleaned up ${cleanedCount} expired verification token(s)`);
      } else {
        console.log('✅ No expired tokens to clean up');
      }

      // Also clean up rate limit counters older than 1 hour
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const rateLimitResult = await User.updateMany(
        {
          lastVerificationEmailSent: { $lt: oneHourAgo },
          verificationEmailSentCount: { $gt: 0 }
        },
        {
          $set: {
            verificationEmailSentCount: 0
          }
        }
      );

      const resetCount = rateLimitResult.modifiedCount || 0;
      if (resetCount > 0) {
        console.log(`✅ Reset ${resetCount} rate limit counter(s)`);
      }

      return {
        success: true,
        tokensCleanedUp: cleanedCount,
        rateLimitsReset: resetCount,
        timestamp: now
      };

    } catch (error) {
      console.error('❌ Error during token cleanup:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Clean up unverified users older than specified days
   * @param {number} days - Number of days
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupOldUnverifiedUsers(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      console.log(`🧹 Cleaning up unverified users older than ${days} days...`);

      const result = await User.deleteMany({
        emailVerified: false,
        createdAt: { $lt: cutoffDate }
      });

      const deletedCount = result.deletedCount || 0;

      if (deletedCount > 0) {
        console.log(`✅ Deleted ${deletedCount} old unverified user(s)`);
      } else {
        console.log('✅ No old unverified users to delete');
      }

      return {
        success: true,
        usersDeleted: deletedCount,
        cutoffDate,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('❌ Error cleaning up old unverified users:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get cleanup statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    try {
      const now = new Date();

      // Count expired tokens
      const expiredTokensCount = await User.countDocuments({
        verificationToken: { $ne: null },
        verificationTokenExpires: { $lt: now }
      });

      // Count active tokens
      const activeTokensCount = await User.countDocuments({
        verificationToken: { $ne: null },
        verificationTokenExpires: { $gte: now }
      });

      // Count unverified users
      const unverifiedUsersCount = await User.countDocuments({
        emailVerified: false
      });

      // Count users with rate limit active
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const rateLimitedCount = await User.countDocuments({
        lastVerificationEmailSent: { $gte: oneHourAgo },
        verificationEmailSentCount: { $gte: 3 }
      });

      return {
        success: true,
        statistics: {
          expiredTokens: expiredTokensCount,
          activeTokens: activeTokensCount,
          unverifiedUsers: unverifiedUsersCount,
          rateLimitedUsers: rateLimitedCount,
          serviceRunning: this.isRunning
        },
        timestamp: now
      };

    } catch (error) {
      console.error('❌ Error getting cleanup statistics:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }
}

// Export singleton instance
module.exports = new TokenCleanupService();

