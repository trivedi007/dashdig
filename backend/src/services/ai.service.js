const Anthropic = require('@anthropic-ai/sdk');
const { v4: uuidv4 } = require('uuid');
const { getRedis } = require('../config/redis');
const contextBuilder = require('./context-builder.service');
const { fetchMetadata } = require('../utils/metadata');

class AIService {
  constructor() {
    this.anthropic = null;
    this.contextBuilder = contextBuilder;
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
      try {
        this.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
        console.log('✅ Anthropic Claude initialized successfully');
      } catch (error) {
        console.warn('⚠️  Anthropic initialization failed. Using fallback URL generation.');
      }
    } else {
      console.warn('⚠️  Anthropic API key not configured. Using fallback URL generation.');
    }
  }

  // Re-export fetchMetadata for backward compatibility
  async fetchMetadata(url) {
    return fetchMetadata(url);
  }

  /**
   * Generate multiple diverse URL slug suggestions
   * @param {string} originalUrl - The original URL to shorten
   * @param {Object|Array} optionsOrKeywords - Options object or keywords array (for backward compatibility)
   * @param {number} count - Number of suggestions to generate (default: 5) - only used if second param is array
   * @returns {Promise<Array>} Array of suggestion objects with id, slug, style, confidence, reasoning
   */
  async generateMultipleSuggestions(originalUrl, optionsOrKeywords = [], count = 5) {
    const startTime = Date.now();
    
    // Handle backward compatibility: if second param is array, treat as keywords
    let options = {};
    if (Array.isArray(optionsOrKeywords)) {
      options = {
        keywords: optionsOrKeywords,
        count: count
      };
    } else {
      options = {
        keywords: optionsOrKeywords.keywords || [],
        userId: optionsOrKeywords.userId,
        utmParams: optionsOrKeywords.utmParams || {},
        count: optionsOrKeywords.count || count
      };
    }

    const { keywords = [], userId, utmParams = {}, count: suggestionCount = 5 } = options;
    
    // Build cache key including user context for personalization
    const cacheKey = userId 
      ? `ai:suggestions:${userId}:${Buffer.from(originalUrl).toString('base64')}`
      : `ai:suggestions:${Buffer.from(originalUrl).toString('base64')}`;
    
    try {
      // Check Redis cache first
      const redis = getRedis();
      if (redis) {
        try {
          const cached = await redis.get(cacheKey);
          if (cached) {
            const cachedData = JSON.parse(cached);
            const elapsed = Date.now() - startTime;
            console.log(`⚡ Cache hit for suggestions (${elapsed}ms):`, originalUrl);
            return cachedData;
          }
        } catch (cacheError) {
          console.warn('⚠️  Redis cache read failed:', cacheError.message);
        }
      }

      if (!this.anthropic) {
        console.log('⚠️  No Anthropic instance, using fallback');
        const fallbackSuggestions = this.generateFallbackSuggestions(originalUrl, keywords, suggestionCount);
        const elapsed = Date.now() - startTime;
        console.log(`🔧 Generated fallback suggestions (${elapsed}ms)`);
        return fallbackSuggestions;
      }

      console.log(`🤖 Generating ${suggestionCount} diverse AI slug suggestions for:`, originalUrl);
      if (userId) {
        console.log(`👤 User context enabled for user: ${userId}`);
      }

      // Build rich context
      const context = await this.contextBuilder.buildContext({
        originalUrl,
        userId,
        utmParams,
        customKeywords: keywords
      });

      // Generate context-aware prompt
      const systemPrompt = this.getSystemPrompt(context.user);
      const userPrompt = this.buildContextAwarePrompt(context, suggestionCount);

      // Use Claude API
      const completion = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Fast and cost-effective for free tier
        max_tokens: 1000,
        system: systemPrompt, // System prompt is separate in Claude
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.8, // Higher temperature for more diversity
      });

      let suggestions = [];
      const responseText = completion.content[0].text.trim();
      
      // Handle markdown code blocks if present
      let jsonText = responseText;
      const codeBlockMatch = responseText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1];
      }

      try {
        // Parse JSON response
        let parsed = JSON.parse(jsonText);
        
        // Handle different response formats
        if (Array.isArray(parsed)) {
          suggestions = parsed;
        } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          suggestions = parsed.suggestions;
        } else if (parsed.data && Array.isArray(parsed.data)) {
          suggestions = parsed.data;
        } else {
          // Try to extract array from object values
          const values = Object.values(parsed);
          if (values.length > 0 && Array.isArray(values[0])) {
            suggestions = values[0];
          } else {
            suggestions = values.filter(item => item && typeof item === 'object' && item.slug);
          }
        }

        // Validate and ensure we have all 5 styles
        const requiredStyles = ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused'];
        const existingStyles = new Set(suggestions.map(s => s.style));
        const missingStyles = requiredStyles.filter(style => !existingStyles.has(style));

        // Fill missing styles with fallback suggestions
        if (missingStyles.length > 0 && suggestions.length < suggestionCount) {
          const fallback = this.generateFallbackSuggestions(originalUrl, keywords, missingStyles.length, missingStyles);
          suggestions = [...suggestions, ...fallback];
        }

        // Ensure we have exactly count suggestions
        if (suggestions.length < suggestionCount) {
          const additionalFallback = this.generateFallbackSuggestions(
            originalUrl, 
            keywords, 
            suggestionCount - suggestions.length,
            requiredStyles.filter(s => !suggestions.some(sug => sug.style === s))
          );
          suggestions = [...suggestions, ...additionalFallback];
        }

        // Process and validate suggestions
        suggestions = suggestions.slice(0, suggestionCount).map((suggestion, index) => {
          const slug = suggestion.slug || suggestion;
          const sanitizedSlug = this.sanitizeSlugPascalCase(slug);
          
          return {
            id: uuidv4(),
            slug: sanitizedSlug,
            style: suggestion.style || this.inferStyle(sanitizedSlug, index),
            confidence: typeof suggestion.confidence === 'number' 
              ? Math.max(0, Math.min(1, suggestion.confidence))
              : (0.9 - index * 0.05),
            reasoning: suggestion.reasoning || this.generateReasoning(sanitizedSlug, index)
          };
        });

        // Validate all styles are represented
        const finalStyles = new Set(suggestions.map(s => s.style));
        if (finalStyles.size < 5) {
          console.warn(`⚠️  Only ${finalStyles.size} unique styles generated, expected 5`);
        }

        const elapsed = Date.now() - startTime;
        console.log(`✅ Generated ${suggestions.length} diverse suggestions (${elapsed}ms)`);

        // Cache in Redis for 1 hour (3600 seconds)
        if (redis) {
          try {
            await redis.setex(cacheKey, 3600, JSON.stringify(suggestions));
            console.log('💾 Cached suggestions in Redis (1 hour TTL)');
          } catch (cacheError) {
            console.warn('⚠️  Redis cache write failed:', cacheError.message);
          }
        }

        return suggestions;

      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError.message);
        console.error('Response text:', responseText.substring(0, 200));
        
        // Fallback: try regex-based extraction
        const slugMatches = responseText.match(/"slug":\s*"([^"]+)"/g);
        if (slugMatches && slugMatches.length > 0) {
          suggestions = slugMatches.slice(0, suggestionCount).map((match, index) => {
            const slug = match.match(/"slug":\s*"([^"]+)"/)[1];
            return {
              id: uuidv4(),
              slug: this.sanitizeSlugPascalCase(slug),
              style: this.inferStyle(slug, index),
              confidence: 0.85 - index * 0.05,
              reasoning: this.generateReasoning(slug, index)
            };
          });
          
          const elapsed = Date.now() - startTime;
          console.log(`🔧 Extracted ${suggestions.length} suggestions via regex (${elapsed}ms)`);
          return suggestions;
        }
        
        // Ultimate fallback
        throw parseError;
      }
      
    } catch (error) {
      console.error('❌ Claude AI Error generating suggestions:', error.message);
      console.error('Error details:', error.response?.data || error);
      const fallbackSuggestions = this.generateFallbackSuggestions(originalUrl, keywords, suggestionCount);
      const elapsed = Date.now() - startTime;
      console.log(`🔧 Using fallback suggestions (${elapsed}ms)`);
      return fallbackSuggestions;
    }
  }

  /**
   * Build system prompt based on user preferences
   * @param {Object} userContext - User context from context builder
   * @returns {string} System prompt for AI
   */
  getSystemPrompt(userContext) {
    let systemPrompt = `You are an expert at creating memorable, human-readable URL slugs`;

    // Add industry context
    if (userContext.industry && userContext.industry !== 'other') {
      systemPrompt += ` for the ${userContext.industry} industry`;
    }
    systemPrompt += `.`;

    // Add brand voice
    if (userContext.brandVoice && userContext.brandVoice !== 'professional') {
      systemPrompt += ` Use a ${userContext.brandVoice} tone.`;
    }

    // Add detected pattern if confidence is high
    if (userContext.detectedPattern?.confidence > 0.7) {
      systemPrompt += `\n\nThe user has an established naming pattern. Try to match it:`;
      
      if (userContext.detectedPattern.structure) {
        systemPrompt += `\n- Structure: ${userContext.detectedPattern.structure}`;
      }
      
      if (userContext.detectedPattern.avgWordCount > 0) {
        systemPrompt += `\n- Average words: ${userContext.detectedPattern.avgWordCount}`;
      }
      
      systemPrompt += `\n- Uses CTAs: ${userContext.detectedPattern.usesCTA ? 'Yes' : 'No'}`;
      
      if (userContext.pastExamples && userContext.pastExamples.length > 0) {
        const exampleSlugs = userContext.pastExamples
          .slice(0, 3)
          .map(e => e.slug)
          .join(', ');
        systemPrompt += `\n- Example slugs they've used: ${exampleSlugs}`;
      }
    }

    // Add avoid words
    if (userContext.avoidWords && userContext.avoidWords.length > 0) {
      systemPrompt += `\n\nNEVER use these words: ${userContext.avoidWords.join(', ')}`;
    }

    // Add must include words
    if (userContext.mustInclude && userContext.mustInclude.length > 0) {
      systemPrompt += `\nTry to include these words when relevant: ${userContext.mustInclude.join(', ')}`;
    }

    return systemPrompt;
  }

  /**
   * Build context-aware user prompt
   * @param {Object} context - Complete context object from context builder
   * @param {number} count - Number of suggestions to generate
   * @returns {string} User prompt for AI
   */
  buildContextAwarePrompt(context, count = 5) {
    const { page, user, temporal, campaign, custom } = context;

    let prompt = `Generate ${count} DIFFERENT human-readable URL slugs for this page.

PAGE INFORMATION:
- URL: ${page.url}
- Title: ${page.title || 'Not available'}
- Description: ${page.description || 'Not available'}
- Platform: ${page.platform}
- Content Type: ${page.type}`;

    // Add temporal context if relevant
    if (temporal.isHoliday) {
      prompt += `\n\nTEMPORAL CONTEXT:
- It's ${temporal.holidayName} season - consider incorporating seasonal relevance if appropriate`;
    } else if (temporal.season) {
      // Optionally mention season for context
      prompt += `\n- Current season: ${temporal.season}`;
    }

    // Add campaign context if present
    if (campaign.detectedPlatform) {
      prompt += `\n\nCAMPAIGN CONTEXT:
- This link will be shared on: ${campaign.detectedPlatform}`;
      
      if (campaign.campaignName) {
        prompt += `\n- Campaign: ${campaign.campaignName}`;
      }
      
      // Platform-specific length recommendations
      if (campaign.detectedPlatform === 'twitter' || campaign.detectedPlatform === 'x') {
        prompt += `\n- Consider shorter slugs (2-4 words) for Twitter/X`;
      } else if (campaign.detectedPlatform === 'email') {
        prompt += `\n- Can use longer, descriptive slugs (4-6 words) for email`;
      }
    }

    // Add length preference
    const lengthMap = {
      'short': '2-3 words',
      'medium': '4-5 words',
      'long': '5-7 words'
    };
    
    prompt += `\n\nUSER PREFERENCES:
- Preferred length: ${lengthMap[user.preferredLength] || '4-5 words'}`;

    // Add style preference
    if (user.preferredStyle !== 'auto') {
      prompt += `\n- Preferred style: ${user.preferredStyle}`;
    } else {
      prompt += `\n- Style: Varied (use different approaches)`;
    }

    // Add custom keywords
    if (custom.keywords && custom.keywords.length > 0) {
      prompt += `\n- Must include these keywords if possible: ${custom.keywords.join(', ')}`;
    }

    // Add intent context
    if (custom.intent && custom.intent !== 'general') {
      prompt += `\n- Intent: ${custom.intent}`;
      if (custom.intent === 'sales' || custom.intent === 'marketing') {
        prompt += ` (consider action-oriented or benefit-focused slugs)`;
      }
    }

    prompt += `\n\nOUTPUT REQUIREMENTS:

Generate exactly ${count} slugs, each with a different approach:

1. Brand-focused (start with brand/company name)
2. Product-focused (emphasize what it is)
3. Feature-focused (highlight key features)
4. Benefit-focused (what user gets)
5. Action-focused (end with action word)

Format as JSON array:

[
  {"slug": "Example.Slug.Here", "style": "brand_focused", "confidence": 0.95, "reasoning": "Why this works"},
  {"slug": "Another.Example.Slug", "style": "product_focused", "confidence": 0.88, "reasoning": "Describes the product"},
  ...
]

Rules:
- Use PascalCase (capitalize each word)
- Separate words with dots (.)
- Max 50 characters
- No special characters except dots
- Make them MEMORABLE and HUMAN-READABLE
- Each slug MUST be unique and different in structure

Output only valid JSON array:`;

    return prompt;
  }

  /**
   * Generate fallback suggestions when AI is unavailable
   * @param {string} originalUrl - The original URL
   * @param {string[]} keywords - Optional keywords
   * @param {number} count - Number of suggestions needed
   * @param {string[]} preferredStyles - Preferred styles to generate
   */
  generateFallbackSuggestions(originalUrl, keywords = [], count = 5, preferredStyles = []) {
    console.log('🔧 Generating fallback suggestions for:', originalUrl);
    
    const suggestions = [];
    const allStyles = ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused'];
    const stylesToUse = preferredStyles.length > 0 ? preferredStyles : allStyles;
    
    try {
      const url = new URL(originalUrl);
      const domain = url.hostname.replace('www.', '').split('.')[0];
      const pathSegments = url.pathname
        .split('/')
        .filter(p => p && p.length > 2)
        .slice(0, 3)
        .map(seg => {
          // Convert to PascalCase
          return seg
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
        });
      
      for (let i = 0; i < count && i < stylesToUse.length; i++) {
        const style = stylesToUse[i % stylesToUse.length];
        let slug;
        
        switch (style) {
          case 'brand_focused':
            slug = domain.charAt(0).toUpperCase() + domain.slice(1) + '.' + 
                   (pathSegments[0] || 'Product') + '.' + 
                   (pathSegments[1] || 'Item');
            break;
          case 'product_focused':
            slug = (pathSegments[0] || 'Product') + '.' + 
                   (pathSegments[1] || 'Category') + '.' + 
                   (keywords[0] ? keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1) : 'Item');
            break;
          case 'feature_focused':
            slug = (keywords[0] ? keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1) : 'Smart') + '.' + 
                   (keywords[1] ? keywords[1].charAt(0).toUpperCase() + keywords[1].slice(1) : 'Feature') + '.' + 
                   (pathSegments[0] || 'Device');
            break;
          case 'benefit_focused':
            slug = 'Best.' + 
                   (pathSegments[0] || domain.charAt(0).toUpperCase() + domain.slice(1)) + '.' + 
                   (keywords[0] ? keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1) : 'Deal');
            break;
          case 'action_focused':
            slug = (pathSegments[0] || domain.charAt(0).toUpperCase() + domain.slice(1)) + '.' + 
                   (keywords[0] ? keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1) : 'Deal') + '.' + 
                   'Today';
            break;
          default:
            slug = domain.charAt(0).toUpperCase() + domain.slice(1) + '.Product.' + i;
        }
        
        suggestions.push({
          id: uuidv4(),
          slug: this.sanitizeSlugPascalCase(slug),
          style: style,
          confidence: 0.75 - i * 0.05,
          reasoning: `Fallback ${style} suggestion based on URL structure`
        });
      }
    } catch {
      // Ultimate fallback
      const domain = originalUrl.split('/')[2]?.split('.')[0] || 'Link';
      for (let i = 0; i < count; i++) {
        suggestions.push({
          id: uuidv4(),
          slug: this.sanitizeSlugPascalCase(`${domain}.Product.${i}`),
          style: allStyles[i % allStyles.length],
          confidence: 0.7,
          reasoning: 'Fallback suggestion'
        });
      }
    }
    
    return suggestions;
  }

  /**
   * Sanitize slug to PascalCase format
   * @param {string} slug - Raw slug string
   * @returns {string} Sanitized PascalCase slug
   */
  sanitizeSlugPascalCase(slug) {
    return slug
      .split('.')
      .map(word => {
        // Remove special characters, keep alphanumeric
        const cleaned = word.replace(/[^a-zA-Z0-9]/g, '');
        if (!cleaned) return '';
        // Convert to PascalCase
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
      })
      .filter(word => word.length > 0)
      .join('.')
      .replace(/\.+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .substring(0, 50);
  }

  /**
   * Sanitize slug to lowercase (for backward compatibility)
   * @param {string} slug - Raw slug string
   * @returns {string} Sanitized lowercase slug
   */
  sanitizeSlug(slug) {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '')
      .replace(/\.+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .substring(0, 50);
  }

  /**
   * Infer style from slug
   * @param {string} slug - The slug to analyze
   * @param {number} index - Index for default style selection
   * @returns {string} Inferred style
   */
  inferStyle(slug, index) {
    const styles = ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused'];
    const slugLower = slug.toLowerCase();
    
    // Check for action words
    const actionWords = ['buy', 'deal', 'sale', 'now', 'shop', 'get', 'today', 'today'];
    if (actionWords.some(word => slugLower.includes(word))) {
      return 'action_focused';
    }
    
    // Check for benefit words
    const benefitWords = ['best', 'top', 'premium', 'pro', 'plus', 'hands', 'free'];
    if (benefitWords.some(word => slugLower.includes(word))) {
      return 'benefit_focused';
    }
    
    // Check for feature words
    const featureWords = ['smart', 'wireless', 'portable', 'advanced', 'voice', 'assistant'];
    if (featureWords.some(word => slugLower.includes(word))) {
      return 'feature_focused';
    }
    
    // Check if starts with common brand names (brand_focused)
    const brandWords = ['amazon', 'nike', 'apple', 'google', 'samsung', 'sony'];
    const firstWord = slugLower.split('.')[0];
    if (brandWords.some(brand => firstWord === brand)) {
      return 'brand_focused';
    }
    
    // Default based on index
    return styles[index % styles.length];
  }

  /**
   * Generate reasoning for a suggestion
   * @param {string} slug - The slug
   * @param {number} index - Index for style inference
   * @returns {string} Reasoning text
   */
  generateReasoning(slug, index) {
    const style = this.inferStyle(slug, index);
    
    const reasoningMap = {
      'brand_focused': 'Starts with trusted brand name for recognition',
      'product_focused': 'Describes what the product does',
      'feature_focused': 'Emphasizes key capability',
      'benefit_focused': 'Focuses on user benefits',
      'action_focused': 'Creates urgency and action'
    };
    
    return reasoningMap[style] || 'Human-readable and memorable URL slug';
  }

  /**
   * Generate a single human-readable URL slug (backward compatibility)
   * Calls generateMultipleSuggestions and returns the first result
   * @param {string} originalUrl - The original URL to shorten
   * @param {string[]} keywords - Optional keywords for context
   * @returns {Promise<string>} Single slug string
   */
  async generateHumanReadableUrl(originalUrl, keywords = [], userId = null) {
    try {
      // Support both old signature (keywords array) and new (options object)
      const options = Array.isArray(keywords) 
        ? { keywords, userId }
        : { ...keywords, userId: userId || keywords.userId };
      
      const suggestions = await this.generateMultipleSuggestions(originalUrl, options, 5);
      if (suggestions && suggestions.length > 0) {
        // Return the slug from the first suggestion (highest confidence)
        return suggestions[0].slug;
      }
      // Fallback if no suggestions
      const keywordArray = Array.isArray(keywords) ? keywords : (keywords.keywords || []);
      return this.generateFallbackUrl(keywordArray, originalUrl);
    } catch (error) {
      console.error('Error in generateHumanReadableUrl:', error.message);
      const keywordArray = Array.isArray(keywords) ? keywords : (keywords.keywords || []);
      return this.generateFallbackUrl(keywordArray, originalUrl);
    }
  }

  /**
   * Generate fallback URL (for backward compatibility)
   * @param {string[]} keywords - Optional keywords
   * @param {string} originalUrl - Original URL
   * @returns {string} Fallback slug
   */
  generateFallbackUrl(keywords, originalUrl) {
    console.log('🔧 Generating fallback URL for:', originalUrl);
    
    // Smart fallback without AI
    if (keywords && keywords.length > 0) {
      return keywords
        .slice(0, 3)
        .map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .join('.');
    }

    try {
      const url = new URL(originalUrl);
      const hostname = url.hostname.replace('www.', '');
      const pathname = url.pathname.toLowerCase();
      const domain = hostname.split('.')[0];
      
      // Brand-specific contextual extraction with generic path parser
      const meaningfulWords = [];
      
      // List of known e-commerce brands
      const knownBrands = ['hoka', 'nike', 'amazon', 'target', 'walmart', 'adidas', 'reebok'];
      const brandName = knownBrands.find(brand => hostname.includes(brand));
      
      if (brandName) {
        meaningfulWords.push(brandName);
        
        // Generic product extraction from URL path
        const pathSegments = pathname.split('/').filter(p => p);
        const stopWords = ['for', 'the', 'and', 'with', 'from', 'this', 'that', 'item', 'product'];
        
        pathSegments.forEach(segment => {
          // Split by hyphens and underscores
          const words = segment
            .split(/[-_]/)
            .filter(w => {
              const lower = w.toLowerCase();
              return w.length > 2 && 
                     !stopWords.includes(lower) &&
                     !/^\d+$/.test(w); // Exclude pure numbers
            })
            .map(w => w.toLowerCase());
          
          meaningfulWords.push(...words);
        });
      }
      
      if (meaningfulWords.length > 0) {
        const slug = meaningfulWords.slice(0, 5).join('.');
        console.log('🎯 Generated contextual fallback:', slug);
        return slug;
      }
      
      // Handle major retailers and e-commerce sites
      const retailerMap = {
        'target': 'target',
        'walmart': 'walmart',
        'amazon': 'amazon',
        'costco': 'costco',
        'publix': 'publix',
        'kroger': 'kroger',
        'safeway': 'safeway',
        'wholefoods': 'wholefoods',
        'instacart': 'instacart'
      };
      
      // Check if it's a delivery or service subdomain
      const isDeliveryService = hostname.includes('delivery.') || hostname.includes('shop.') || hostname.includes('store.');
      const mainDomain = isDeliveryService ? hostname.split('.')[1] : domain;
      
      // For e-commerce URLs, focus on the retailer and product category
      if (retailerMap[mainDomain]) {
        // For delivery services, use the main retailer + category
        if (isDeliveryService) {
          return `${retailerMap[mainDomain]}.groceries`;
        } else {
          return `${retailerMap[mainDomain]}.products`;
        }
      }
      
      // For other URLs, extract meaningful words from path
      const path = url.pathname.split('/').filter(p => p).slice(0, 2);
      
      path.forEach(segment => {
        // Remove common URL patterns and extract meaningful words
        const cleanSegment = segment
          .replace(/[-_]/g, ' ')
          .replace(/[0-9]/g, '')
          .split(' ')
          .filter(word => word.length > 2 && !['com', 'www', 'html', 'php', 'asp', 'landing', 'product', 'item'].includes(word.toLowerCase()));
        
        meaningfulWords.push(...cleanSegment.slice(0, 2));
      });
      
      if (meaningfulWords.length > 0) {
        // Create a meaningful slug from domain and extracted words
        const slugWords = [domain, ...meaningfulWords.slice(0, 2)].join('.');
        return slugWords.toLowerCase().replace(/[^a-z0-9.]/g, '').substring(0, 50);
      }
      
      // Fallback to timestamp-based slug
      return `${domain}.link.${Date.now().toString(36).slice(-4)}`;
    } catch {
      return `link.${Date.now().toString(36)}`;
    }
  }
}

module.exports = new AIService();
