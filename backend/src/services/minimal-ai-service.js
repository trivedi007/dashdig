// backend/src/services/minimal-ai-service.js
const Anthropic = require('@anthropic-ai/sdk');

class AIService {
  constructor() {
    this.anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    }) : null;
  }

  async generateHumanReadableUrl(originalUrl, keywords = [], metadata = {}) {
    try {
      if (!this.anthropic) {
        console.warn('Anthropic API key not provided, using fallback');
        return this.generateFallbackUrl(originalUrl, keywords);
      }

      const prompt = `Create a human-readable URL slug based on:
Original URL: ${originalUrl}
Keywords: ${keywords.join(', ')}
Title: ${metadata.title || ''}
Description: ${metadata.description || ''}

Requirements:
- 2-5 words maximum
- Use dots (.) as separators
- Must be memorable and contextual
- Lowercase only
- No special characters except dots

Examples:
- "deals.black.friday.tv"
- "recipe.chocolate.cake"
- "review.iphone.fifteen"

Return ONLY the slug, nothing else:`;

      const completion = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 50,
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        temperature: 0.7,
      });

      let slug = completion.content[0].text.trim();
      
      // Clean and validate
      slug = this.sanitizeSlug(slug);
      
      return slug;
    } catch (error) {
      console.error('Claude AI Error:', error);
      // Fallback to keyword-based generation
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

  generateFallbackUrl(keywords, originalUrl) {
    if (keywords && keywords.length > 0) {
      return keywords
        .slice(0, 3)
        .map(k => k.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10))
        .join('.');
    }

    // Extract domain as last resort
    try {
      const url = new URL(originalUrl);
      const domain = url.hostname.replace('www.', '').split('.')[0];
      const random = Math.random().toString(36).substring(7);
      return `${domain}.link.${random}`;
    } catch {
      return `link.${Date.now().toString(36)}`;
    }
  }

  async extractMetadata(url) {
    // In production, use cheerio or puppeteer
    // For MVP, return basic metadata
    return {
      title: '',
      description: '',
      image: ''
    };
  }
}

module.exports = new AIService();