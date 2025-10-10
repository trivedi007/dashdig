const OpenAI = require('openai');

class AIService {
  constructor() {
    // Initialize OpenAI only if API key is available
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

  async generateHumanReadableUrl(originalUrl, keywords = []) {
    try {
      // If no OpenAI instance, use fallback
      if (!this.openai) {
        return this.generateFallbackUrl(keywords, originalUrl);
      }

      const prompt = `Create a human-readable URL slug for this URL: ${originalUrl}
      ${keywords.length > 0 ? `Keywords: ${keywords.join(', ')}` : ''}
      
      Rules:
      - Use 2-4 words maximum
      - Separate words with dots (.)
      - Must be memorable and contextual
      - Lowercase only
      - No special characters except dots
      
      Examples: "deals.black.friday", "recipe.chocolate.cake", "review.iphone.pro"
      
      Return ONLY the slug:`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 30,
      });

      const slug = completion.choices[0].message.content.trim();
      return this.sanitizeSlug(slug);
      
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

  generateFallbackUrl(keywords, originalUrl) {
    // Smart fallback without AI
    if (keywords && keywords.length > 0) {
      return keywords
        .slice(0, 3)
        .map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .join('.');
    }

    try {
      const url = new URL(originalUrl);
      const domain = url.hostname.replace('www.', '').split('.')[0];
      const path = url.pathname.split('/').filter(p => p).slice(0, 2);
      
      if (path.length > 0) {
        return `${domain}.${path.join('.')}.${Date.now().toString(36).slice(-3)}`;
      }
      
      return `${domain}.link.${Date.now().toString(36).slice(-4)}`;
    } catch {
      return `link.${Date.now().toString(36)}`;
    }
  }
}

module.exports = new AIService();
