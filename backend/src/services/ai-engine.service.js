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
    
    // Extract source domain/brand
    let sourceDomain = 'Unknown';
    try {
      const urlObj = new URL(url);
      sourceDomain = urlObj.hostname.replace('www.', '').replace(/^(m\.|us\.)/, '').split('.')[0];
      // Capitalize first letter for brand presentation
      sourceDomain = sourceDomain.charAt(0).toUpperCase() + sourceDomain.slice(1);
    } catch (e) {
      console.warn('Failed to extract source domain:', e.message);
    }
    
    let prompt = `Generate ${count} human-readable URL slug${count > 1 ? 's' : ''} for Dashdig.

PAGE INFORMATION:
- URL: ${url}
- Source Domain: ${sourceDomain}
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
1. Brand-focused (${sourceDomain} + product + key detail)
2. Product-focused (${sourceDomain} + what it is + category)
3. Feature-focused (${sourceDomain} + key feature + product)
4. Action-focused (${sourceDomain} + product + action word)
5. Benefit-focused (${sourceDomain} + benefit + what it is)`;
    }

    prompt += `

CRITICAL RULES:
1. ⚠️  ALWAYS START WITH THE SOURCE BRAND: "${sourceDomain}"
2. Use dots to separate words (e.g., ${sourceDomain}.Product.Detail)
3. Use PascalCase (capitalize each word)
4. Include key product/content identifiers
5. Maximum 50 characters total
6. No special characters except dots
7. Make it memorable and shareable

EXAMPLES (Source: ${sourceDomain}):
- ${sourceDomain}.Product.Name.Detail
- ${sourceDomain}.Category.Feature
- ${sourceDomain}.Item.Benefit

OUTPUT REQUIREMENTS:
- Return as JSON array: [{"slug": "${sourceDomain}.Example.Here", "style": "brand_focused", "reasoning": "Why this works"}]
- Every slug MUST start with "${sourceDomain}"
- Focus on what makes someone WANT to click

⚠️  REMEMBER: Every slug MUST start with "${sourceDomain}" - NO EXCEPTIONS!

IMPORTANT: Respond with ONLY a JSON array. No explanation. No markdown code blocks. No introductory text. Start your response with [ and end with ].`;

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

    console.log(`\n🤖 [AI Engine] Starting slug generation for: ${originalUrl}`);
    console.log(`   Tier: ${userTier}, Keywords: [${keywords.join(', ')}], Count: ${count}`);

    try {
      // Fetch page metadata
      console.log('   📡 Fetching page metadata...');
      const metadata = await this.fetchMetadata(originalUrl);
      console.log(`   ✅ Metadata fetched: title="${metadata.title?.substring(0, 50)}..."`);
      
      // Detect promotional signals
      const promotionalSignals = this.detectPromotionalSignals(metadata);
      console.log(`   🎯 Promotional signals detected: ${promotionalSignals.length}`);
      
      // Select model based on tier and context
      const model = this.selectModel({
        userTier,
        hasPromotionalSignals: promotionalSignals.length > 0,
        hasBrandGuidelines: false, // TODO: Check user settings
      });
      console.log(`   🧠 Selected AI model: ${model}`);
      
      // Build the prompt
      const prompt = this.buildPrompt({
        url: originalUrl,
        metadata,
        keywords,
        promotionalSignals,
        count,
      });
      console.log(`   📝 Prompt built (${prompt.length} chars)`);
      
      // Check API key
      if (!process.env.ANTHROPIC_API_KEY) {
        console.error('   ❌ ANTHROPIC_API_KEY not configured!');
        throw new Error('ANTHROPIC_API_KEY not configured');
      }
      
      // Call Claude API
      console.log('   🚀 Calling Claude API...');
      const response = await this.anthropic.messages.create({
        model,
        max_tokens: 1000,
        temperature: this.temperatures[model],
        system: 'You are a URL slug generator. You ONLY output valid JSON arrays. Never include explanations, introductions, or any text outside the JSON. Your response must start with [ and end with ].',
        messages: [
          { 
            role: 'user', 
            content: prompt 
          }
        ],
      });
      console.log('   ✅ Claude API response received');
      
      // Parse the response
      const content = response.content[0]?.text || '[]';
      console.log(`   📄 Response content (${content.length} chars):`, content.substring(0, 200));
      
      // Clean response - remove any text before [ and after ]
      let jsonStr = content;
      
      // First, check for markdown code blocks
      const codeBlockMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
        console.log('   🧹 Extracted JSON from markdown code block');
      } else {
        // Clean response by extracting only the JSON array
        const jsonStart = content.indexOf('[');
        const jsonEnd = content.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          jsonStr = content.slice(jsonStart, jsonEnd + 1);
          if (jsonStart > 0) {
            console.log('   🧹 Cleaned response text (removed preamble/postamble)');
          }
        }
      }
      
      const suggestions = JSON.parse(jsonStr);
      console.log(`   ✅ Parsed ${suggestions.length} suggestions from AI`);
      
      // Add unique IDs and sanitize slugs
      const finalSuggestions = suggestions.map((suggestion, index) => ({
        id: `${Date.now()}-${index}`,
        slug: this.sanitizeSlug(suggestion.slug),
        style: suggestion.style || 'general',
        reasoning: suggestion.reasoning || '',
        model: model.split('-')[1], // Extract 'haiku', 'sonnet', or 'opus'
      }));
      
      console.log(`   🎉 Final suggestions:`, finalSuggestions.map(s => s.slug));
      return finalSuggestions;
      
    } catch (error) {
      console.error('   ❌ AI Engine error:', error.message);
      console.error('   Error type:', error.constructor.name);
      console.error('   Error stack:', error.stack);
      
      // Return fallback suggestion
      const fallbackSlug = this.generateFallbackSlug(originalUrl);
      console.log(`   🔧 Using fallback slug: ${fallbackSlug}`);
      
      return [{
        id: `${Date.now()}-fallback`,
        slug: fallbackSlug,
        style: 'fallback',
        reasoning: `Generated using fallback method due to: ${error.message}`,
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
   * ALWAYS starts with source domain for consistency
   * @param {string} url - Original URL
   * @returns {string} Fallback slug
   */
  generateFallbackSlug(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '').replace(/^(m\.|us\.)/, '').split('.')[0];
      // Capitalize for brand consistency
      const brandName = domain.charAt(0).toUpperCase() + domain.slice(1);
      const timestamp = Date.now().toString(36).slice(-4);
      return `${brandName}.Link.${timestamp}`;
    } catch {
      return `Link.${Date.now().toString(36).slice(-6)}`;
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
