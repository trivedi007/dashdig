const Feedback = require('../models/Feedback');

/**
 * Submit feedback on a suggestion
 * POST /api/suggestions/feedback
 */
const submitFeedback = async (req, res) => {
  try {
    const {
      suggestionId,
      vote,
      originalUrl,
      allSuggestions = [],
      userId,
      sessionId,
      metadata = {}
    } = req.body;

    // Validation
    if (!suggestionId || typeof suggestionId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'suggestionId is required and must be a string'
      });
    }

    if (!vote || !['up', 'down', 'selected'].includes(vote)) {
      return res.status(400).json({
        success: false,
        error: 'vote must be one of: up, down, selected'
      });
    }

    if (!originalUrl || typeof originalUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'originalUrl is required and must be a string'
      });
    }

    // Extract suggestion data from allSuggestions array
    const suggestionData = allSuggestions.find(s => s.id === suggestionId);
    
    if (!suggestionData) {
      return res.status(400).json({
        success: false,
        error: 'suggestionId not found in allSuggestions array'
      });
    }

    // Hash IP address for privacy
    const clientIP = req.ip || req.connection.remoteAddress || '';
    const ipHash = Feedback.hashIP(clientIP);

    // Prepare feedback document
    const feedbackData = {
      suggestionId,
      vote,
      originalUrl,
      suggestion: {
        slug: suggestionData.slug,
        style: suggestionData.style,
        confidence: suggestionData.confidence || 0,
        reasoning: suggestionData.reasoning || ''
      },
      allSuggestions: allSuggestions.map(s => ({
        id: s.id,
        slug: s.slug,
        style: s.style,
        confidence: s.confidence
      })),
      userId: userId || null,
      sessionId: sessionId || null,
      metadata: {
        pageTitle: metadata.pageTitle || '',
        generationTime: metadata.generationTime || 0,
        userAgent: req.headers['user-agent'] || metadata.userAgent || '',
        ipHash: ipHash
      }
    };

    // Save feedback (fire and forget - don't block)
    Feedback.create(feedbackData).catch(error => {
      console.error('Failed to save feedback:', error);
      // Don't throw - this is non-blocking
    });

    // Return success immediately
    res.json({
      success: true,
      message: 'Feedback recorded'
    });

  } catch (error) {
    console.error('Error in submitFeedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record feedback',
      message: error.message
    });
  }
};

/**
 * Get analytics on suggestion feedback
 * GET /api/suggestions/analytics
 */
const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, style } = req.query;

    // Build query
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (style) {
      query['suggestion.style'] = style;
    }

    // Get all feedback
    const allFeedback = await Feedback.find(query);

    // Calculate statistics
    const totalFeedback = allFeedback.length;

    // Group by style
    const byStyle = {};
    const styles = ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused'];
    
    styles.forEach(styleName => {
      const styleFeedback = allFeedback.filter(f => f.suggestion.style === styleName);
      const up = styleFeedback.filter(f => f.vote === 'up').length;
      const down = styleFeedback.filter(f => f.vote === 'down').length;
      const selected = styleFeedback.filter(f => f.vote === 'selected').length;
      const total = up + down + selected;
      
      byStyle[styleName] = {
        up,
        down,
        selected,
        total,
        rate: total > 0 ? (up + selected) / total : 0 // Positive rate (up + selected)
      };
    });

    // Average confidence of selected suggestions
    const selectedFeedback = allFeedback.filter(f => f.vote === 'selected');
    const averageConfidenceBySelection = selectedFeedback.length > 0
      ? selectedFeedback.reduce((sum, f) => sum + (f.suggestion.confidence || 0), 0) / selectedFeedback.length
      : 0;

    // Top performing patterns (most selected slugs)
    const slugCounts = {};
    selectedFeedback.forEach(f => {
      const slug = f.suggestion.slug;
      slugCounts[slug] = (slugCounts[slug] || 0) + 1;
    });

    const topPerformingPatterns = Object.entries(slugCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([slug, count]) => ({ slug, selections: count }));

    // Overall statistics
    const overallStats = {
      totalUp: allFeedback.filter(f => f.vote === 'up').length,
      totalDown: allFeedback.filter(f => f.vote === 'down').length,
      totalSelected: allFeedback.filter(f => f.vote === 'selected').length,
      averageConfidence: allFeedback.length > 0
        ? allFeedback.reduce((sum, f) => sum + (f.suggestion.confidence || 0), 0) / allFeedback.length
        : 0
    };

    res.json({
      success: true,
      data: {
        totalFeedback,
        byStyle,
        averageConfidenceBySelection: parseFloat(averageConfidenceBySelection.toFixed(2)),
        topPerformingPatterns,
        overallStats,
        timeRange: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      }
    });

  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
};

module.exports = {
  submitFeedback,
  getAnalytics
};

