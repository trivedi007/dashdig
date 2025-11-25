/**
 * Pattern Detection Job
 * Runs pattern analysis for users automatically
 */

const patternDetectionService = require('../services/pattern-detection.service');
const Url = require('../models/Url');
const User = require('../models/User');

/**
 * Trigger pattern analysis after URL creation
 * Should be called after a user creates a new URL
 * @param {string} userId - User ID
 * @param {string} urlId - URL ID that was just created
 */
async function triggerPatternAnalysis(userId, urlId) {
  try {
    if (!userId) return;

    // Check user's URL count
    const urlCount = await Url.countDocuments({ userId });
    
    // Only analyze if user has created a multiple of 5 URLs
    // (every 5th URL triggers analysis)
    if (urlCount > 0 && urlCount % 5 === 0) {
      console.log(`🔄 Triggering pattern analysis for user ${userId} (${urlCount} URLs)`);
      
      // Run analysis in background (don't block)
      setImmediate(async () => {
        try {
          await patternDetectionService.analyzeUserPatterns(userId, false);
        } catch (error) {
          console.error(`Failed to analyze patterns for user ${userId}:`, error.message);
        }
      });
    }
  } catch (error) {
    console.error('Error triggering pattern analysis:', error);
    // Don't throw - this is non-blocking
  }
}

/**
 * Weekly pattern analysis job
 * Analyzes all active users who have sufficient URL history
 * Should be run via cron: 0 2 * * 0 (every Sunday at 2 AM)
 */
async function weeklyPatternAnalysis() {
  try {
    console.log('🔄 Starting weekly pattern analysis job...');
    const startTime = Date.now();
    
    const results = await patternDetectionService.analyzeAllActiveUsers();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ Weekly pattern analysis complete:', {
      duration: `${duration}s`,
      total: results.total,
      successful: results.successful,
      skipped: results.skipped,
      failed: results.failed
    });

    if (results.errors.length > 0) {
      console.warn('⚠️  Some users failed analysis:', results.errors.slice(0, 10));
    }

    return results;
  } catch (error) {
    console.error('❌ Weekly pattern analysis job failed:', error);
    throw error;
  }
}

/**
 * Manual trigger for specific user
 * Useful for testing or immediate updates
 * @param {string} userId - User ID
 * @param {boolean} forceUpdate - Force update even if recently analyzed
 */
async function analyzeUserPatterns(userId, forceUpdate = false) {
  try {
    console.log(`🔄 Analyzing patterns for user ${userId}...`);
    const result = await patternDetectionService.analyzeUserPatterns(userId, forceUpdate);
    console.log(`✅ Analysis complete:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to analyze user ${userId}:`, error);
    throw error;
  }
}

module.exports = {
  triggerPatternAnalysis,
  weeklyPatternAnalysis,
  analyzeUserPatterns
};

