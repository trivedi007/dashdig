const Url = require('../models/Url');
const User = require('../models/User');

/**
 * Pattern Detection Service
 * Analyzes user's URL history to detect naming patterns and preferences
 */
class PatternDetectionService {
  /**
   * Analyze user's URL history and detect naming patterns
   * @param {string} userId - User's MongoDB ID
   * @param {boolean} forceUpdate - Force update even if recently analyzed
   * @returns {Object} Detected pattern with confidence score
   */
  async analyzeUserPatterns(userId, forceUpdate = false) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if recently analyzed (within last 24 hours)
      if (!forceUpdate && user.namingProfile?.patternLastUpdated) {
        const lastUpdate = new Date(user.namingProfile.patternLastUpdated);
        const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceUpdate < 24) {
          return {
            confidence: user.namingProfile.detectedPattern?.confidence || 0,
            message: 'Recently analyzed, skipping',
            pattern: user.namingProfile.detectedPattern
          };
        }
      }

      // 1. Fetch user's last 20 URLs
      const urls = await Url.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('shortCode originalUrl createdAt keywords');

      if (urls.length < 5) {
        return { 
          confidence: 0, 
          message: 'Not enough data (need at least 5 URLs)',
          urlsAnalyzed: urls.length
        };
      }

      // 2. Analyze each slug
      const analysis = urls.map(url => this.analyzeSlug(url.shortCode));

      // 3. Find common patterns
      const pattern = {
        structure: this.detectStructure(analysis),
        avgWordCount: this.calculateAvgWordCount(analysis),
        separator: this.detectSeparator(analysis),
        capitalization: this.detectCapitalization(analysis),
        includesBrand: this.checkBrandInclusion(analysis),
        includesYear: this.checkYearInclusion(analysis),
        usesCTA: this.checkCTAUsage(analysis),
        confidence: this.calculateConfidence(analysis, urls.length)
      };

      // 4. Update user profile
      user.initializeNamingProfile();
      user.namingProfile.detectedPattern = pattern;
      user.namingProfile.patternLastUpdated = new Date();
      user.namingProfile.urlsAnalyzed = urls.length;
      
      // Update pattern if confidence is high enough
      if (pattern.confidence > 0.7) {
        user.updateDetectedPattern();
      }
      
      user.checkProfileComplete();
      await user.save();

      console.log(`✅ Pattern analysis complete for user ${userId}:`, {
        confidence: pattern.confidence,
        structure: pattern.structure,
        urlsAnalyzed: urls.length
      });

      return {
        ...pattern,
        urlsAnalyzed: urls.length,
        message: 'Pattern detected successfully'
      };

    } catch (error) {
      console.error('Error analyzing user patterns:', error);
      throw error;
    }
  }

  /**
   * Analyze a single slug's characteristics
   * @param {string} slug - The slug to analyze
   * @returns {Object} Analysis result
   */
  analyzeSlug(slug) {
    if (!slug || typeof slug !== 'string') {
      return null;
    }

    // Detect separator
    const separators = ['.', '-', '_'];
    let detectedSeparator = '.';
    for (const sep of separators) {
      if (slug.includes(sep)) {
        detectedSeparator = sep;
        break;
      }
    }

    const parts = slug.split(/[.\-_]/).filter(p => p.length > 0);
    
    return {
      wordCount: parts.length,
      separator: detectedSeparator,
      capitalization: this.detectSlugCase(slug),
      firstWordType: parts.length > 0 ? this.categorizeWord(parts[0]) : 'Noun',
      lastWordType: parts.length > 0 ? this.categorizeWord(parts[parts.length - 1]) : 'Noun',
      containsYear: /20\d{2}|19\d{2}/.test(slug),
      containsCTA: parts.length > 0 ? this.hasCTA(parts[parts.length - 1]) : false,
      structure: parts.map(p => this.categorizeWord(p)).join('.'),
      parts: parts
    };
  }

  /**
   * Categorize a word (Brand, Product, Feature, Action, etc.)
   * @param {string} word - Word to categorize
   * @returns {string} Category
   */
  categorizeWord(word) {
    if (!word || word.length === 0) return 'Noun';

    const lowerWord = word.toLowerCase();
    
    // Known brands (common e-commerce and tech brands)
    const brands = [
      'amazon', 'target', 'walmart', 'nike', 'apple', 'google', 'microsoft',
      'samsung', 'sony', 'dell', 'hp', 'lenovo', 'adidas', 'puma', 'reebok',
      'hoka', 'under', 'armour', 'tesla', 'ford', 'toyota', 'honda',
      'starbucks', 'mcdonalds', 'coca', 'cola', 'pepsi', 'nike', 'adidas'
    ];

    // Action/CTA words
    const actions = [
      'buy', 'shop', 'get', 'save', 'deal', 'sale', 'free', 'try', 'start',
      'join', 'download', 'subscribe', 'register', 'apply', 'order', 'purchase',
      'claim', 'grab', 'find', 'explore', 'discover', 'learn', 'watch', 'read'
    ];

    // Feature/benefit words
    const features = [
      'fast', 'easy', 'smart', 'pro', 'premium', 'best', 'top', 'new', 'latest',
      'advanced', 'professional', 'expert', 'ultimate', 'deluxe', 'luxury',
      'affordable', 'cheap', 'budget', 'quality', 'durable', 'reliable'
    ];

    // Check for brand
    if (brands.some(brand => lowerWord.includes(brand) || brand.includes(lowerWord))) {
      return 'Brand';
    }

    // Check for action
    if (actions.includes(lowerWord)) {
      return 'Action';
    }

    // Check for feature
    if (features.includes(lowerWord)) {
      return 'Feature';
    }

    // Check for number
    if (/^\d+$/.test(word)) {
      return 'Number';
    }

    // Check for year
    if (/20\d{2}|19\d{2}/.test(word)) {
      return 'Year';
    }

    // Check for ordinal (1st, 2nd, 3rd, etc.)
    if (/\d+(st|nd|rd|th)/.test(lowerWord)) {
      return 'Ordinal';
    }

    // Default to noun
    return 'Noun';
  }

  /**
   * Detect most common structure pattern
   * @param {Array} analysis - Array of slug analyses
   * @returns {string} Most common structure
   */
  detectStructure(analysis) {
    const structures = analysis
      .map(a => a.structure)
      .filter(s => s && s.length > 0);

    if (structures.length === 0) {
      return 'Noun.Noun.Noun';
    }

    const counts = {};
    structures.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });

    // Return most common structure
    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a);

    return sorted[0]?.[0] || 'Noun.Noun.Noun';
  }

  /**
   * Calculate average word count
   * @param {Array} analysis - Array of slug analyses
   * @returns {number} Average word count
   */
  calculateAvgWordCount(analysis) {
    if (analysis.length === 0) return 0;
    
    const wordCounts = analysis
      .map(a => a.wordCount)
      .filter(wc => wc > 0);
    
    if (wordCounts.length === 0) return 0;
    
    const sum = wordCounts.reduce((acc, wc) => acc + wc, 0);
    return Math.round((sum / wordCounts.length) * 10) / 10;
  }

  /**
   * Detect most common separator
   * @param {Array} analysis - Array of slug analyses
   * @returns {string} Most common separator
   */
  detectSeparator(analysis) {
    const separators = analysis
      .map(a => a.separator)
      .filter(s => s);

    if (separators.length === 0) return '.';

    const counts = {};
    separators.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a);

    return sorted[0]?.[0] || '.';
  }

  /**
   * Detect capitalization style
   * @param {Array} analysis - Array of slug analyses
   * @returns {string} Capitalization style
   */
  detectCapitalization(analysis) {
    const styles = analysis
      .map(a => a.capitalization)
      .filter(s => s);

    if (styles.length === 0) return 'TitleCase';

    const counts = {};
    styles.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a);

    return sorted[0]?.[0] || 'TitleCase';
  }

  /**
   * Detect capitalization style of a single slug
   * @param {string} slug - Slug to analyze
   * @returns {string} Capitalization style
   */
  detectSlugCase(slug) {
    if (!slug || slug.length === 0) return 'TitleCase';

    const parts = slug.split(/[.\-_]/).filter(p => p.length > 0);
    if (parts.length === 0) return 'TitleCase';

    let titleCaseCount = 0;
    let lowercaseCount = 0;
    let uppercaseCount = 0;

    parts.forEach(part => {
      if (part === part.toUpperCase() && part.length > 1) {
        uppercaseCount++;
      } else if (part === part.toLowerCase()) {
        lowercaseCount++;
      } else if (/^[A-Z]/.test(part)) {
        titleCaseCount++;
      }
    });

    if (uppercaseCount > lowercaseCount && uppercaseCount > titleCaseCount) {
      return 'UPPERCASE';
    } else if (lowercaseCount > titleCaseCount) {
      return 'lowercase';
    } else {
      return 'TitleCase';
    }
  }

  /**
   * Check if user typically includes brand names
   * @param {Array} analysis - Array of slug analyses
   * @returns {boolean}
   */
  checkBrandInclusion(analysis) {
    const brandCount = analysis.filter(a => 
      a.firstWordType === 'Brand' || 
      a.parts?.some(p => this.categorizeWord(p) === 'Brand')
    ).length;

    // If >50% include brands, return true
    return brandCount / analysis.length > 0.5;
  }

  /**
   * Check if user typically includes years
   * @param {Array} analysis - Array of slug analyses
   * @returns {boolean}
   */
  checkYearInclusion(analysis) {
    const yearCount = analysis.filter(a => a.containsYear).length;
    return yearCount / analysis.length > 0.3; // >30% include years
  }

  /**
   * Check if user typically uses CTA words
   * @param {Array} analysis - Array of slug analyses
   * @returns {boolean}
   */
  checkCTAUsage(analysis) {
    const ctaCount = analysis.filter(a => 
      a.containsCTA || 
      a.lastWordType === 'Action'
    ).length;
    
    return ctaCount / analysis.length > 0.3; // >30% use CTAs
  }

  /**
   * Check if a word is a CTA word
   * @param {string} word - Word to check
   * @returns {boolean}
   */
  hasCTA(word) {
    if (!word) return false;

    const ctaWords = [
      'buy', 'shop', 'get', 'save', 'deal', 'sale', 'free', 'try', 'start',
      'join', 'download', 'subscribe', 'register', 'apply', 'order', 'purchase',
      'claim', 'grab', 'find', 'explore', 'discover', 'learn', 'watch', 'read',
      'now', 'today', 'here'
    ];

    return ctaWords.includes(word.toLowerCase());
  }

  /**
   * Calculate confidence based on consistency
   * @param {Array} analysis - Array of slug analyses
   * @param {number} totalUrls - Total number of URLs analyzed
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(analysis, totalUrls) {
    if (analysis.length < 5) return 0;

    // Check how consistent the patterns are
    const wordCounts = analysis.map(a => a.wordCount).filter(wc => wc > 0);
    const wordCountVariance = this.variance(wordCounts);

    const structures = analysis.map(a => a.structure).filter(s => s);
    const structureConsistency = this.getMostCommonPercentage(structures);

    const separators = analysis.map(a => a.separator).filter(s => s);
    const separatorConsistency = this.getMostCommonPercentage(separators);

    // Higher consistency = higher confidence
    // Structure consistency: 50% weight
    // Word count variance: 20% weight (lower variance = higher score)
    // Separator consistency: 15% weight
    // Sample size: 15% weight (more URLs = higher score)
    const confidence = (
      (structureConsistency * 0.5) +
      (wordCountVariance < 1 ? 0.2 : (wordCountVariance < 2 ? 0.1 : 0)) +
      (separatorConsistency * 0.15) +
      (totalUrls >= 10 ? 0.15 : (totalUrls >= 5 ? 0.1 : 0.05))
    );

    return Math.min(Math.max(confidence, 0), 1);
  }

  /**
   * Calculate variance of an array
   * @param {Array<number>} arr - Array of numbers
   * @returns {number} Variance
   */
  variance(arr) {
    if (arr.length === 0) return 0;

    const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    const squaredDiffs = arr.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / arr.length;

    return Math.round(variance * 100) / 100;
  }

  /**
   * Get percentage of most common value in array
   * @param {Array} arr - Array of values
   * @returns {number} Percentage (0-1)
   */
  getMostCommonPercentage(arr) {
    if (arr.length === 0) return 0;

    const counts = {};
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts));
    return maxCount / arr.length;
  }

  /**
   * Batch analyze multiple users
   * @param {Array<string>} userIds - Array of user IDs
   * @param {number} batchSize - Number of users to process at once
   * @returns {Object} Results summary
   */
  async batchAnalyzeUsers(userIds, batchSize = 10) {
    const results = {
      total: userIds.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };

    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (userId) => {
          try {
            const result = await this.analyzeUserPatterns(userId, false);
            if (result.message === 'Recently analyzed, skipping') {
              results.skipped++;
            } else {
              results.successful++;
            }
          } catch (error) {
            results.failed++;
            results.errors.push({ userId, error: error.message });
            console.error(`Failed to analyze user ${userId}:`, error.message);
          }
        })
      );
    }

    return results;
  }

  /**
   * Analyze all active users who have created URLs
   * @returns {Object} Results summary
   */
  async analyzeAllActiveUsers() {
    try {
      // Find users who have created at least 5 URLs
      const usersWithUrls = await Url.aggregate([
        {
          $match: {
            userId: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$userId',
            urlCount: { $sum: 1 }
          }
        },
        {
          $match: {
            urlCount: { $gte: 5 }
          }
        },
        {
          $project: {
            userId: '$_id',
            urlCount: 1
          }
        }
      ]);

      const userIds = usersWithUrls.map(u => u.userId.toString());
      
      console.log(`📊 Analyzing ${userIds.length} users with sufficient URL history...`);
      
      return await this.batchAnalyzeUsers(userIds);
    } catch (error) {
      console.error('Error analyzing all active users:', error);
      throw error;
    }
  }
}

module.exports = new PatternDetectionService();

