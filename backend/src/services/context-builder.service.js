const aiService = require('./ai.service');
const User = require('../models/User');

/**
 * Context Builder Service
 * Gathers comprehensive context for AI URL generation
 */
class ContextBuilderService {
  /**
   * Build comprehensive context for AI generation
   * @param {Object} params - Context parameters
   * @param {string} params.originalUrl - The original URL to shorten
   * @param {string} params.userId - Optional user ID for personalization
   * @param {Object} params.utmParams - UTM parameters from URL query string
   * @param {Array<string>} params.customKeywords - Custom keywords provided by user
   * @returns {Object} Complete context object
   */
  async buildContext(params) {
    const {
      originalUrl,
      userId,
      utmParams = {},
      customKeywords = []
    } = params;

    try {
      // 1. Fetch page metadata
      const pageMetadata = await this.fetchPageMetadata(originalUrl);

      // 2. Get user profile and patterns (if authenticated)
      const userContext = userId
        ? await this.getUserContext(userId)
        : this.getAnonymousDefaults();

      // 3. Extract temporal context
      const temporalContext = this.getTemporalContext();

      // 4. Parse campaign context from UTM params
      const campaignContext = this.parseCampaignContext(utmParams);

      // 5. Detect URL type and platform
      const urlContext = this.analyzeUrl(originalUrl);

      // 6. Build the complete context object
      return {
        // Page data
        page: {
          url: originalUrl,
          title: pageMetadata.title || '',
          description: pageMetadata.description || '',
          domain: urlContext.domain,
          type: urlContext.type, // 'product', 'article', 'video', 'homepage', 'webpage'
          platform: urlContext.platform // 'amazon', 'youtube', 'generic', etc.
        },

        // User context
        user: {
          industry: userContext.industry,
          brandVoice: userContext.brandVoice,
          preferredStyle: userContext.preferredStyle,
          preferredLength: userContext.preferredLength,
          detectedPattern: userContext.detectedPattern,
          avoidWords: userContext.avoidWords || [],
          mustInclude: userContext.mustInclude || [],
          pastExamples: userContext.examples?.slice(0, 3) || [] // Last 3 for reference
        },

        // Temporal context
        temporal: {
          season: temporalContext.season,
          month: temporalContext.month,
          year: temporalContext.year,
          isHoliday: temporalContext.isHoliday,
          holidayName: temporalContext.holidayName,
          dayOfWeek: temporalContext.dayOfWeek
        },

        // Campaign context
        campaign: {
          source: campaignContext.source || null,      // utm_source
          medium: campaignContext.medium || null,      // utm_medium
          campaignName: campaignContext.name || null,  // utm_campaign
          content: campaignContext.content || null,    // utm_content
          term: campaignContext.term || null,          // utm_term
          detectedPlatform: campaignContext.detectedPlatform || null
        },

        // Custom inputs
        custom: {
          keywords: customKeywords || [],
          intent: this.detectIntent(pageMetadata, campaignContext, urlContext)
        }
      };
    } catch (error) {
      console.error('Error building context:', error);
      // Return minimal context on error
      return {
        page: {
          url: originalUrl,
          title: '',
          description: '',
          domain: this.extractDomain(originalUrl),
          type: 'webpage',
          platform: 'generic'
        },
        user: this.getAnonymousDefaults(),
        temporal: this.getTemporalContext(),
        campaign: {},
        custom: {
          keywords: customKeywords || [],
          intent: 'general'
        }
      };
    }
  }

  /**
   * Fetch page metadata (title, description)
   * Uses existing aiService.fetchMetadata
   * @param {string} url - URL to fetch metadata from
   * @returns {Object} Metadata object
   */
  async fetchPageMetadata(url) {
    try {
      return await aiService.fetchMetadata(url);
    } catch (error) {
      console.warn('Failed to fetch page metadata:', error.message);
      return { title: '', description: '' };
    }
  }

  /**
   * Get user context from User model
   * @param {string} userId - User MongoDB ID
   * @returns {Object} User context object
   */
  async getUserContext(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return this.getAnonymousDefaults();
      }

      // Initialize naming profile if needed
      user.initializeNamingProfile();

      const namingProfile = user.namingProfile || {};
      const preferences = namingProfile.preferences || {};
      const detectedPattern = namingProfile.detectedPattern || {};

      // Get preferred style (handles 'auto' mode)
      const preferredStyle = user.getPreferredStyle ? user.getPreferredStyle() : preferences.preferredStyle || 'auto';

      return {
        industry: namingProfile.industry || 'other',
        brandVoice: preferences.brandVoice || 'professional',
        preferredStyle: preferredStyle,
        preferredLength: preferences.preferredLength || 'medium',
        detectedPattern: {
          structure: detectedPattern.structure || null,
          avgWordCount: detectedPattern.avgWordCount || 0,
          separator: detectedPattern.separator || '.',
          capitalization: detectedPattern.capitalization || 'TitleCase',
          includesBrand: detectedPattern.includesBrand || false,
          includesYear: detectedPattern.includesYear || false,
          usesCTA: detectedPattern.usesCTA || false,
          confidence: detectedPattern.confidence || 0
        },
        avoidWords: preferences.avoidWords || [],
        mustInclude: preferences.mustInclude || [],
        examples: namingProfile.examples || []
      };
    } catch (error) {
      console.error('Error fetching user context:', error);
      return this.getAnonymousDefaults();
    }
  }

  /**
   * Get default context for anonymous users
   * @returns {Object} Default user context
   */
  getAnonymousDefaults() {
    return {
      industry: 'other',
      brandVoice: 'professional',
      preferredStyle: 'auto',
      preferredLength: 'medium',
      detectedPattern: {
        structure: null,
        avgWordCount: 0,
        separator: '.',
        capitalization: 'TitleCase',
        includesBrand: false,
        includesYear: false,
        usesCTA: false,
        confidence: 0
      },
      avoidWords: [],
      mustInclude: [],
      examples: []
    };
  }

  /**
   * Get temporal context (season, holidays, etc.)
   * @returns {Object} Temporal context
   */
  getTemporalContext() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const day = now.getDate();

    // Determine season
    let season;
    if (month >= 2 && month <= 4) {
      season = 'spring';
    } else if (month >= 5 && month <= 7) {
      season = 'summer';
    } else if (month >= 8 && month <= 10) {
      season = 'fall';
    } else {
      season = 'winter';
    }

    // Check for major holidays/events
    const holidays = this.checkHolidays(month, day);

    return {
      season,
      month: now.toLocaleString('default', { month: 'long' }),
      year: now.getFullYear(),
      isHoliday: holidays.isHoliday,
      holidayName: holidays.name,
      dayOfWeek: now.toLocaleString('default', { weekday: 'long' })
    };
  }

  /**
   * Check if current date is near a major holiday
   * @param {number} month - Month (0-11)
   * @param {number} day - Day of month
   * @returns {Object} Holiday information
   */
  checkHolidays(month, day) {
    const holidays = [
      { month: 0, day: 1, name: 'New Year', range: 3 },
      { month: 1, day: 14, name: 'Valentines', range: 3 },
      { month: 2, day: 17, name: 'St Patricks', range: 2 },
      { month: 3, day: 15, name: 'Easter', range: 7 }, // Approximate
      { month: 4, day: 12, name: 'Mothers Day', range: 7 },
      { month: 5, day: 16, name: 'Fathers Day', range: 7 },
      { month: 6, day: 4, name: 'July 4th', range: 3 },
      { month: 9, day: 31, name: 'Halloween', range: 14 },
      { month: 10, day: 28, name: 'Thanksgiving', range: 7 },
      { month: 10, day: 29, name: 'Black Friday', range: 4 },
      { month: 11, day: 25, name: 'Christmas', range: 14 },
      { month: 11, day: 26, name: 'Boxing Day', range: 2 }
    ];

    for (const holiday of holidays) {
      if (month === holiday.month &&
        Math.abs(day - holiday.day) <= holiday.range) {
        return { isHoliday: true, name: holiday.name };
      }
    }

    return { isHoliday: false, name: null };
  }

  /**
   * Parse UTM parameters and detect platform
   * @param {Object} utmParams - UTM parameters object
   * @returns {Object} Campaign context
   */
  parseCampaignContext(utmParams) {
    if (!utmParams || Object.keys(utmParams).length === 0) {
      return {};
    }

    const platformMap = {
      'facebook': ['facebook', 'fb', 'meta'],
      'instagram': ['instagram', 'ig'],
      'twitter': ['twitter', 'x'],
      'linkedin': ['linkedin', 'li'],
      'google': ['google', 'adwords', 'gdn'],
      'email': ['email', 'newsletter', 'mailchimp', 'sendgrid'],
      'tiktok': ['tiktok', 'tt'],
      'youtube': ['youtube', 'yt'],
      'pinterest': ['pinterest', 'pin'],
      'reddit': ['reddit', 'redd']
    };

    let detectedPlatform = null;
    const source = (utmParams.source || '').toLowerCase();
    const medium = (utmParams.medium || '').toLowerCase();
    const sourceAndMedium = `${source} ${medium}`;

    for (const [platform, keywords] of Object.entries(platformMap)) {
      if (keywords.some(kw => sourceAndMedium.includes(kw))) {
        detectedPlatform = platform;
        break;
      }
    }

    return {
      source: utmParams.source || null,
      medium: utmParams.medium || null,
      name: utmParams.campaign || null,
      content: utmParams.content || null,
      term: utmParams.term || null,
      detectedPlatform
    };
  }

  /**
   * Extract UTM parameters from URL query string
   * @param {string} url - URL with query parameters
   * @returns {Object} UTM parameters object
   */
  extractUtmParams(url) {
    try {
      const urlObj = new URL(url);
      const params = {};
      
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      
      utmKeys.forEach(key => {
        const value = urlObj.searchParams.get(key);
        if (value) {
          // Convert utm_campaign to campaign, etc.
          const shortKey = key.replace('utm_', '');
          params[shortKey] = value;
        }
      });

      return params;
    } catch (error) {
      return {};
    }
  }

  /**
   * Analyze URL to detect type and platform
   * @param {string} url - URL to analyze
   * @returns {Object} URL context
   */
  analyzeUrl(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '').toLowerCase();
      const path = urlObj.pathname.toLowerCase();

      // Platform detection
      const platformMap = {
        'amazon.com': 'amazon',
        'amazon.co.uk': 'amazon',
        'amazon.ca': 'amazon',
        'amazon.de': 'amazon',
        'amazon.fr': 'amazon',
        'ebay.com': 'ebay',
        'walmart.com': 'walmart',
        'target.com': 'target',
        'youtube.com': 'youtube',
        'youtu.be': 'youtube',
        'twitter.com': 'twitter',
        'x.com': 'twitter',
        'linkedin.com': 'linkedin',
        'github.com': 'github',
        'medium.com': 'medium',
        'nytimes.com': 'nytimes',
        'washingtonpost.com': 'washingtonpost',
        'reddit.com': 'reddit',
        'pinterest.com': 'pinterest',
        'instagram.com': 'instagram',
        'facebook.com': 'facebook',
        'tiktok.com': 'tiktok',
        'shopify.com': 'shopify',
        'etsy.com': 'etsy'
      };

      let platform = 'generic';
      for (const [domainPattern, platformName] of Object.entries(platformMap)) {
        if (domain.includes(domainPattern)) {
          platform = platformName;
          break;
        }
      }

      // Type detection
      let type = 'webpage';
      
      // Product pages
      if (path.includes('/dp/') || 
          path.includes('/product') || 
          path.includes('/p/') ||
          path.includes('/item/') ||
          path.includes('/products/') ||
          path.includes('/shop/')) {
        type = 'product';
      }
      // Article/blog pages
      else if (path.includes('/article') || 
               path.includes('/blog') || 
               path.includes('/news') ||
               path.includes('/post/') ||
               path.includes('/story/')) {
        type = 'article';
      }
      // Video pages
      else if (path.includes('/watch') || 
               path.includes('/video') ||
               path.includes('/v/')) {
        type = 'video';
      }
      // Homepage
      else if (path === '/' || path === '' || path === '/index.html') {
        type = 'homepage';
      }
      // Category/listing pages
      else if (path.includes('/category') ||
               path.includes('/c/') ||
               path.includes('/browse') ||
               path.includes('/search')) {
        type = 'category';
      }

      return { domain, platform, type };
    } catch (error) {
      console.error('Error analyzing URL:', error);
      return {
        domain: this.extractDomain(url),
        platform: 'generic',
        type: 'webpage'
      };
    }
  }

  /**
   * Extract domain from URL (helper)
   * @param {string} url - URL string
   * @returns {string} Domain name
   */
  extractDomain(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'unknown';
    }
  }

  /**
   * Detect user intent from metadata and campaign
   * @param {Object} metadata - Page metadata
   * @param {Object} campaign - Campaign context
   * @param {Object} urlContext - URL context
   * @returns {string} Intent type
   */
  detectIntent(metadata, campaign, urlContext) {
    // Check for marketing/sales intent
    if (campaign.detectedPlatform || campaign.source) {
      return 'marketing';
    }

    // Check for product pages (likely sales intent)
    if (urlContext.type === 'product') {
      return 'sales';
    }

    // Check for video content (likely sharing)
    if (urlContext.type === 'video') {
      return 'sharing';
    }

    // Check for article/blog (likely reference)
    if (urlContext.type === 'article') {
      return 'reference';
    }

    // Check metadata for keywords
    const titleAndDesc = `${metadata.title || ''} ${metadata.description || ''}`.toLowerCase();
    
    if (titleAndDesc.includes('buy') || 
        titleAndDesc.includes('shop') || 
        titleAndDesc.includes('deal') ||
        titleAndDesc.includes('sale')) {
      return 'sales';
    }

    if (titleAndDesc.includes('learn') || 
        titleAndDesc.includes('guide') || 
        titleAndDesc.includes('tutorial')) {
      return 'education';
    }

    // Default
    return 'general';
  }

  /**
   * Format context for AI prompt
   * Converts context object into a formatted string for AI prompts
   * @param {Object} context - Context object from buildContext
   * @returns {string} Formatted context string
   */
  formatContextForPrompt(context) {
    const parts = [];

    // Page information
    if (context.page.title) {
      parts.push(`Page Title: ${context.page.title}`);
    }
    if (context.page.description) {
      parts.push(`Description: ${context.page.description}`);
    }
    if (context.page.platform !== 'generic') {
      parts.push(`Platform: ${context.page.platform}`);
    }
    if (context.page.type !== 'webpage') {
      parts.push(`Content Type: ${context.page.type}`);
    }

    // User preferences
    if (context.user.preferredStyle !== 'auto') {
      parts.push(`Preferred Style: ${context.user.preferredStyle}`);
    }
    if (context.user.preferredLength !== 'medium') {
      parts.push(`Preferred Length: ${context.user.preferredLength}`);
    }
    if (context.user.brandVoice !== 'professional') {
      parts.push(`Brand Voice: ${context.user.brandVoice}`);
    }
    if (context.user.industry !== 'other') {
      parts.push(`Industry: ${context.user.industry}`);
    }

    // Detected pattern (if confidence is high)
    if (context.user.detectedPattern.confidence > 0.7) {
      if (context.user.detectedPattern.structure) {
        parts.push(`User Pattern: ${context.user.detectedPattern.structure}`);
      }
      if (context.user.detectedPattern.avgWordCount > 0) {
        parts.push(`Typical Word Count: ${context.user.detectedPattern.avgWordCount}`);
      }
    }

    // Avoid/must include words
    if (context.user.avoidWords.length > 0) {
      parts.push(`Avoid Words: ${context.user.avoidWords.join(', ')}`);
    }
    if (context.user.mustInclude.length > 0) {
      parts.push(`Must Include: ${context.user.mustInclude.join(', ')}`);
    }

    // Temporal context
    if (context.temporal.isHoliday) {
      parts.push(`Holiday Context: ${context.temporal.holidayName}`);
    }
    if (context.temporal.season) {
      parts.push(`Season: ${context.temporal.season}`);
    }

    // Campaign context
    if (context.campaign.detectedPlatform) {
      parts.push(`Campaign Platform: ${context.campaign.detectedPlatform}`);
    }
    if (context.campaign.campaignName) {
      parts.push(`Campaign: ${context.campaign.campaignName}`);
    }

    // Custom keywords
    if (context.custom.keywords.length > 0) {
      parts.push(`Keywords: ${context.custom.keywords.join(', ')}`);
    }

    // Intent
    if (context.custom.intent !== 'general') {
      parts.push(`Intent: ${context.custom.intent}`);
    }

    return parts.join('\n');
  }

  /**
   * Build context with UTM extraction from URL
   * Convenience method that extracts UTM params from URL automatically
   * @param {Object} params - Context parameters
   * @param {string} params.originalUrl - The original URL (may contain UTM params)
   * @param {string} params.userId - Optional user ID
   * @param {Array<string>} params.customKeywords - Custom keywords
   * @returns {Object} Complete context object
   */
  async buildContextWithUtmExtraction(params) {
    const { originalUrl, userId, customKeywords = [] } = params;

    // Extract UTM params from URL
    const utmParams = this.extractUtmParams(originalUrl);

    // Remove UTM params from URL for cleaner processing
    let cleanUrl = originalUrl;
    try {
      const urlObj = new URL(originalUrl);
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      utmKeys.forEach(key => urlObj.searchParams.delete(key));
      cleanUrl = urlObj.toString();
    } catch {
      // If URL parsing fails, use original
    }

    return await this.buildContext({
      originalUrl: cleanUrl,
      userId,
      utmParams,
      customKeywords
    });
  }
}

module.exports = new ContextBuilderService();

