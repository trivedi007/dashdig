const Anthropic = require('@anthropic-ai/sdk');

/**
 * Dashdig AI Engine
 * Uses Claude models for intelligent URL slug generation
 */
class DashdigAIEngine {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Model identifiers
    this.models = {
      HAIKU: 'claude-haiku-4-5-20251001',
      SONNET: 'claude-sonnet-4-5-20250929',
      OPUS: 'claude-opus-4-5-20251101',
    };
    
    // Temperature settings by model
    this.temperatures = {
      [this.models.HAIKU]: 0.3,
      [this.models.SONNET]: 0.5,
      [this.models.OPUS]: 0.6,
    };
  }

  /**
   * Select the appropriate model based on user tier and context
   * @param {Object} context - Selection context
   * @param {string} context.userTier - User's subscription tier
   * @param {boolean} context.hasPromotionalSignals - Whether promotional content detected
   * @param {boolean} context.hasBrandGuidelines - Whether custom brand guidelines exist
   * @returns {string} Model identifier
   */
  selectModel(context) {
    const { userTier = 'free', hasPromotionalSignals = false, hasBrandGuidelines = false } = context;
    
    // Enterprise with brand guidelines gets Opus
    if (userTier === 'enterprise' && hasBrandGuidelines) {
      return this.models.OPUS;
    }
    
    // Enterprise without guidelines still gets Opus
    if (userTier === 'enterprise') {
      return this.models.OPUS;
    }
    
    // Business tier gets Sonnet
    if (userTier === 'business') {
      return this.models.SONNET;
    }
    
    // Pro tier gets Sonnet
    if (userTier === 'pro') {
      return this.models.SONNET;
    }
    
    // Pro-level intelligence if promotional signals detected (upgrade experience)
    if ((userTier === 'starter' || userTier === 'free') && hasPromotionalSignals) {
      // Still use Haiku but with enhanced prompting
      return this.models.HAIKU;
    }
    
    // Free and Starter get Haiku
    return this.models.HAIKU;
  }

  /**
   * Build the prompt for slug generation
   * @param {Object} context - Prompt context
   * @param {string} context.url - Original URL
   * @param {Object} context.metadata - Page metadata
   * @param {Array} context.keywords - User-provided keywords
   * @param {Array} context.promotionalSignals - Detected promo signals
   * @param {number} context.count - Number of suggestions to generate
   * @returns {string} Formatted prompt
   */
  buildPrompt(context) {
    const { 
      url, 
      metadata = {}, 
      keywords = [], 
      promotionalSignals = [],
      count = 1
    } = context;
    
    let prompt = `Generate ${count} human-readable URL slug${count > 1 ? 's' : ''} for Dashdig.

PAGE INFORMATION:
- URL: ${url}
- Title: ${metadata.title || 'Not available'}
- Description: ${metadata.description || 'Not available'}`;

    if (keywords.length > 0) {
      prompt += `
- User Keywords: ${keywords.join(', ')}`;
    }

    if (promotionalSignals.length > 0) {
      prompt += `

PROMOTIONAL SIGNALS DETECTED:
${promotionalSignals.map(s => `- ${s.type}: "${s.match}"`).join('\n')}

Since promotional content was detected, prioritize CONVERSION-FOCUSED slugs:
- Create urgency if there's a time limit
- Emphasize savings if there's a discount
- Leverage social proof if popularity indicators exist`;
    }

    if (count > 1) {
      prompt += `

Generate exactly ${count} different slugs with varied approaches:
1. Brand-focused (emphasize the brand/company name)
2. Product-focused (emphasize what the product/service is)
3. Feature-focused (highlight key features or benefits)
4. Action-focused (include action words like Get, Save, Try)
5. Benefit-focused (emphasize what the user gains)`;
    }

    prompt += `

OUTPUT REQUIREMENTS:
- Return as JSON array: [{"slug": "Example.Slug.Here", "style": "brand_focused", "reasoning": "Why this works"}]
- Use PascalCase (capitalize each word)
- Separate words with dots (.)
- 3-6 words maximum
- Maximum 50 characters total
- No special characters except dots
- Make them MEMORABLE and SHAREABLE
- Focus on what makes someone WANT to click`;

    return prompt;
  }

  /**
   * Generate URL slug suggestions using Claude AI
   * @param {string} originalUrl - The URL to shorten
   * @param {Object} options - Generation options
   * @param {string} options.userTier - User's subscription tier
   * @param {Array} options.keywords - User-provided keywords
   * @param {number} options.count - Number of suggestions (1-5)
   * @returns {Promise<Array>} Array of suggestion objects
   */
  async generateSuggestions(originalUrl, options = {}) {
    const { 
      userTier = 'free', 
      keywords = [], 
      count = 1 
    } = options;

    try {
      // Fetch page metadata
      const metadata = await this.fetchMetadata(originalUrl);
      
      // Detect promotional signals
      const promotionalSignals = this.detectPromotionalSignals(metadata);
      
      // Select model based on tier and context
      const model = this.selectModel({
        userTier,
        hasPromotionalSignals: promotionalSignals.length > 0,
        hasBrandGuidelines: false, // TODO: Check user settings
      });
      
      // Build the prompt
      const prompt = this.buildPrompt({
        url: originalUrl,
        metadata,
        keywords,
        promotionalSignals,
        count,
      });
      
      // Call Claude API
      const response = await this.anthropic.messages.create({
        model,
        max_tokens: 1000,
        temperature: this.temperatures[model],
        messages: [
          { 
            role: 'user', 
            content: prompt 
          }
        ],
      });
      
      // Parse the response
      const content = response.content[0]?.text || '[]';
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const suggestions = JSON.parse(jsonStr);
      
      // Add unique IDs and sanitize slugs
      return suggestions.map((suggestion, index) => ({
        id: `${Date.now()}-${index}`,
        slug: this.sanitizeSlug(suggestion.slug),
        style: suggestion.style || 'general',
        reasoning: suggestion.reasoning || '',
        model: model.split('-')[1], // Extract 'haiku', 'sonnet', or 'opus'
      }));
      
    } catch (error) {
      console.error('AI Engine error:', error);
      
      // Return fallback suggestion
      return [{
        id: `${Date.now()}-fallback`,
        slug: this.generateFallbackSlug(originalUrl),
        style: 'fallback',
        reasoning: 'Generated using fallback method',
        model: 'fallback',
      }];
    }
  }

  /**
   * Sanitize a slug to ensure it meets requirements
   * @param {string} slug - Raw slug
   * @returns {string} Sanitized slug
   */
  sanitizeSlug(slug) {
    return slug
      .replace(/[^a-zA-Z0-9.]/g, '') // Remove invalid chars
      .replace(/\.+/g, '.')          // Remove duplicate dots
      .replace(/^\.+|\.+$/g, '')     // Remove leading/trailing dots
      .slice(0, 50);                 // Max length
  }

  /**
   * Generate a fallback slug when AI fails
   * @param {string} url - Original URL
   * @returns {string} Fallback slug
   */
  generateFallbackSlug(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '').split('.')[0];
      const timestamp = Date.now().toString(36).slice(-4);
      return `${domain}.link.${timestamp}`;
    } catch {
      return `link.${Date.now().toString(36).slice(-6)}`;
    }
  }

  /**
   * Fetch and parse page metadata
   * @param {string} url - URL to fetch
   * @returns {Promise<Object>} Metadata object with title, description, etc.
   */
  async fetchMetadata(url) {
    const cheerio = require('cheerio');
    
    try {
      // Fetch with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Dashdig URL Bot/1.0 (+https://dashdig.com)',
        },
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract metadata with fallbacks
      const title = 
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        $('title').text() ||
        '';
      
      const description = 
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '';
      
      const image = 
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        '';
      
      // Try to extract price if it's a product page
      const priceSelectors = [
        '[itemprop="price"]',
        '.price',
        '#price',
        '[data-price]',
      ];
      
      let price = '';
      for (const selector of priceSelectors) {
        const priceEl = $(selector).first();
        if (priceEl.length) {
          price = priceEl.attr('content') || priceEl.text().trim();
          break;
        }
      }
      
      return {
        title: title.trim().slice(0, 200),
        description: description.trim().slice(0, 500),
        image,
        price,
        url,
      };
      
    } catch (error) {
      console.warn(`Failed to fetch metadata for ${url}:`, error.message);
      
      // Return basic info from URL
      try {
        const urlObj = new URL(url);
        return {
          title: urlObj.hostname,
          description: '',
          image: '',
          price: '',
          url,
        };
      } catch {
        return {
          title: '',
          description: '',
          image: '',
          price: '',
          url,
        };
      }
    }
  }

  /**
   * Detect promotional signals in page content
   * Used to enhance AI prompting for conversion-focused slugs
   * @param {Object} metadata - Page metadata
   * @returns {Array} Array of detected signal objects
   */
  detectPromotionalSignals(metadata) {
    const signals = [];
    const text = `${metadata.title || ''} ${metadata.description || ''}`.toLowerCase();
    
    const patterns = {
      discount: {
        pattern: /(\d+%?\s*off|save\s*\$?\d+|discount|sale|deal|clearance)/i,
        priority: 'high',
      },
      urgency: {
        pattern: /(limited\s*time|ends?\s*(today|soon|tonight)|last\s*chance|hurry|flash|expires?|countdown)/i,
        priority: 'high',
      },
      social: {
        pattern: /(bestsell|#1|top\s*rated|most\s*popular|trending|award|featured)/i,
        priority: 'medium',
      },
      scarcity: {
        pattern: /(only\s*\d+\s*left|low\s*stock|selling\s*fast|almost\s*gone|limited\s*(quantity|edition))/i,
        priority: 'high',
      },
      free: {
        pattern: /(free\s*shipping|free\s*trial|bonus|gift|included|complimentary)/i,
        priority: 'medium',
      },
      new: {
        pattern: /(new\s*arrival|just\s*launched|introducing|brand\s*new|fresh)/i,
        priority: 'low',
      },
      exclusive: {
        pattern: /(exclusive|members?\s*only|vip|early\s*access|insider)/i,
        priority: 'medium',
      },
      guarantee: {
        pattern: /(money\s*back|guarantee|risk\s*free|no\s*risk|satisfaction)/i,
        priority: 'low',
      },
    };
    
    for (const [type, config] of Object.entries(patterns)) {
      const match = text.match(config.pattern);
      if (match) {
        signals.push({
          type,
          match: match[0],
          priority: config.priority,
        });
      }
    }
    
    // Also check for price signals
    if (metadata.price) {
      const priceMatch = metadata.price.match(/\$[\d,]+/);
      if (priceMatch) {
        signals.push({
          type: 'price',
          match: priceMatch[0],
          priority: 'medium',
        });
      }
    }
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    signals.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return signals;
  }
}

module.exports = DashdigAIEngine;
