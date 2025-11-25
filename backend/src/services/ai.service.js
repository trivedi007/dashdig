const OpenAI = require('openai');
const crypto = require('crypto');

class AIService {
  constructor() {
    this.openai = null;
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-') {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
      } catch (error) {
        console.warn('⚠️  OpenAI initialization failed. Using fallback URL generation.');
      }
    } else {
      console.warn('⚠️  OpenAI API key not configured. Using fallback URL generation.');
    }
  }

  async fetchMetadata(url) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        redirect: 'follow'
      });
      const html = await response.text();
      
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
      
      return {
        title: titleMatch ? titleMatch[1] : '',
        description: descMatch ? descMatch[1] : ''
      };
    } catch {
      return { title: '', description: '' };
    }
  }

  async generateHumanReadableUrl(originalUrl, keywords = []) {
    try {
      if (!this.openai) {
        console.log('⚠️  No OpenAI instance, using fallback');
        return this.generateFallbackUrl(keywords, originalUrl);
      }

      console.log('🤖 Generating AI slug for:', originalUrl);
      
      const metadata = await this.fetchMetadata(originalUrl);
      const urlObj = new URL(originalUrl);
      const domain = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname;

      const prompt = `Generate a human-readable URL slug from:
URL: ${originalUrl}
Title: ${metadata.title}
Description: ${metadata.description}
User keywords: ${keywords.join(', ')}

Rules:
- Use 3-5 words maximum
- Words should be memorable and contextual
- Separate with dots (.)
- Lowercase only
- No special characters

Example: "deals.blackfriday.samsung.tv"

Output only the slug:`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 50,
      });

      const suggestion = completion.choices[0].message.content.trim();
      return this.sanitizeSlug(suggestion);
      
    } catch (error) {
      console.error('OpenAI Error:', error.message);
      return this.generateFallbackUrl(keywords, originalUrl);
    }
  }

  sanitizeSlug(slug) {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '')
      .replace(/\.+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .substring(0, 50);
  }

  /**
   * Generate multiple diverse URL slug suggestions
   * @param {string} originalUrl - The original URL to shorten
   * @param {string[]} keywords - Optional keywords for context
   * @param {number} count - Number of suggestions to generate (default: 5)
   * @returns {Promise<Array>} Array of suggestion objects
   */
  async generateMultipleSuggestions(originalUrl, keywords = [], count = 5) {
    try {
      if (!this.openai) {
        console.log('⚠️  No OpenAI instance, using fallback');
        return this.generateFallbackSuggestions(originalUrl, keywords, count);
      }

      console.log('🤖 Generating', count, 'diverse AI slug suggestions for:', originalUrl);
      
      const metadata = await this.fetchMetadata(originalUrl);
      const urlObj = new URL(originalUrl);
      const domain = urlObj.hostname.replace('www.', '');

      const prompt = `Generate ${count} diverse human-readable URL slug suggestions from:
URL: ${originalUrl}
Title: ${metadata.title}
Description: ${metadata.description}
User keywords: ${keywords.join(', ')}

Generate exactly ${count} suggestions, each with a different style:

1. Brand-focused: Starts with brand name (e.g., "Amazon.Echo.Dot.5th.Gen")
2. Product-focused: Starts with product type (e.g., "Smart.Speaker.Alexa.Echo")
3. Feature-focused: Emphasizes key features (e.g., "Voice.Assistant.Smart.Home")
4. Benefit-focused: What user gets (e.g., "Hands.Free.Music.Control")
5. Action-focused: Ends with CTA (e.g., "Best.Smart.Speaker.Deal")

Rules for all suggestions:
- Use 3-5 words maximum
- Words should be memorable and contextual
- Separate with dots (.)
- Lowercase only
- No special characters
- Each suggestion must be unique and different in style

Output format (JSON array):
[
  {
    "slug": "amazon.echo.dot.5th.gen",
    "style": "brand_focused",
    "confidence": 0.95,
    "reasoning": "Emphasizes brand and product generation"
  },
  {
    "slug": "smart.speaker.alexa.echo",
    "style": "product_focused",
    "confidence": 0.87,
    "reasoning": "Focuses on product category and features"
  }
  // ... ${count} total suggestions
]

Output only valid JSON:`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8, // Higher temperature for more diversity
        max_tokens: 800, // More tokens for multiple suggestions
        response_format: { type: 'json_object' } // Request JSON format
      });

      let suggestions = [];
      try {
        const responseText = completion.choices[0].message.content.trim();
        // Try to parse as JSON object first (OpenAI might wrap in object)
        let parsed = JSON.parse(responseText);
        
        // Handle if OpenAI returns { suggestions: [...] } or { data: [...] }
        if (parsed.suggestions) {
          suggestions = parsed.suggestions;
        } else if (parsed.data) {
          suggestions = parsed.data;
        } else if (Array.isArray(parsed)) {
          suggestions = parsed;
        } else {
          // If it's an object with numbered keys, convert to array
          suggestions = Object.values(parsed).filter(item => item.slug);
        }

        // Ensure we have exactly count suggestions
        if (suggestions.length < count) {
          // Generate fallback suggestions to fill the gap
          const fallback = this.generateFallbackSuggestions(originalUrl, keywords, count - suggestions.length);
          suggestions = [...suggestions, ...fallback];
        }

        // Limit to count and add IDs
        suggestions = suggestions.slice(0, count).map((suggestion, index) => ({
          id: crypto.randomUUID(),
          slug: this.sanitizeSlug(suggestion.slug || suggestion),
          style: suggestion.style || this.inferStyle(suggestion.slug || suggestion, index),
          confidence: suggestion.confidence || (0.9 - index * 0.05),
          reasoning: suggestion.reasoning || this.generateReasoning(suggestion.slug || suggestion, index)
        }));

        console.log(`✅ Generated ${suggestions.length} diverse suggestions`);
        return suggestions;

      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        // Fallback: try to extract slugs from text response
        const slugMatches = responseText.match(/"slug":\s*"([^"]+)"/g);
        if (slugMatches) {
          suggestions = slugMatches.slice(0, count).map((match, index) => {
            const slug = match.match(/"slug":\s*"([^"]+)"/)[1];
            return {
              id: crypto.randomUUID(),
              slug: this.sanitizeSlug(slug),
              style: this.inferStyle(slug, index),
              confidence: 0.85 - index * 0.05,
              reasoning: this.generateReasoning(slug, index)
            };
          });
        } else {
          throw parseError;
        }
      }

      return suggestions;
      
    } catch (error) {
      console.error('OpenAI Error generating suggestions:', error.message);
      return this.generateFallbackSuggestions(originalUrl, keywords, count);
    }
  }

  /**
   * Generate fallback suggestions when AI is unavailable
   */
  generateFallbackSuggestions(originalUrl, keywords = [], count = 5) {
    console.log('🔧 Generating fallback suggestions for:', originalUrl);
    
    const baseSlug = this.generateFallbackUrl(keywords, originalUrl);
    const suggestions = [];
    
    try {
      const url = new URL(originalUrl);
      const domain = url.hostname.replace('www.', '').split('.')[0];
      const pathSegments = url.pathname.split('/').filter(p => p && p.length > 2).slice(0, 3);
      
      const styles = ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused'];
      
      for (let i = 0; i < count; i++) {
        let slug;
        const style = styles[i % styles.length];
        
        switch (style) {
          case 'brand_focused':
            slug = domain + '.' + pathSegments.slice(0, 2).join('.');
            break;
          case 'product_focused':
            slug = pathSegments[0] + '.' + (pathSegments[1] || 'product');
            break;
          case 'feature_focused':
            slug = (keywords[0] || pathSegments[0]) + '.' + (keywords[1] || 'feature');
            break;
          case 'benefit_focused':
            slug = 'best.' + (pathSegments[0] || domain) + '.' + (keywords[0] || 'deal');
            break;
          case 'action_focused':
            slug = (pathSegments[0] || domain) + '.' + (keywords[0] || 'deal') + '.now';
            break;
          default:
            slug = baseSlug + '.' + i;
        }
        
        suggestions.push({
          id: crypto.randomUUID(),
          slug: this.sanitizeSlug(slug),
          style: style,
          confidence: 0.75 - i * 0.05,
          reasoning: `Fallback ${style} suggestion based on URL structure`
        });
      }
    } catch {
      // Ultimate fallback
      for (let i = 0; i < count; i++) {
        suggestions.push({
          id: crypto.randomUUID(),
          slug: this.sanitizeSlug(baseSlug + '.' + i),
          style: 'product_focused',
          confidence: 0.7,
          reasoning: 'Fallback suggestion'
        });
      }
    }
    
    return suggestions;
  }

  /**
   * Infer style from slug
   */
  inferStyle(slug, index) {
    const styles = ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused'];
    const words = slug.split('.');
    
    // Check for action words
    const actionWords = ['buy', 'deal', 'sale', 'now', 'shop', 'get'];
    if (actionWords.some(word => slug.includes(word))) {
      return 'action_focused';
    }
    
    // Check for benefit words
    const benefitWords = ['best', 'top', 'premium', 'pro', 'plus'];
    if (benefitWords.some(word => slug.includes(word))) {
      return 'benefit_focused';
    }
    
    // Check for feature words
    const featureWords = ['smart', 'wireless', 'portable', 'advanced'];
    if (featureWords.some(word => slug.includes(word))) {
      return 'feature_focused';
    }
    
    // Default based on index
    return styles[index % styles.length];
  }

  /**
   * Generate reasoning for a suggestion
   */
  generateReasoning(slug, index) {
    const styles = ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused'];
    const style = this.inferStyle(slug, index);
    
    const reasoningMap = {
      'brand_focused': 'Emphasizes brand name for recognition',
      'product_focused': 'Focuses on product category and type',
      'feature_focused': 'Highlights key product features',
      'benefit_focused': 'Emphasizes benefits to the user',
      'action_focused': 'Includes call-to-action for engagement'
    };
    
    return reasoningMap[style] || 'Human-readable and memorable URL slug';
  }

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
