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

      const prompt = `Analyze this URL and create a human-readable slug that describes the actual content:

URL: ${originalUrl}
${keywords.length > 0 ? `Keywords: ${keywords.join(', ')}` : ''}

Extract the main product, brand, or content from the URL and create a memorable slug.

Rules:
- Use 2-4 words maximum
- Separate words with dots (.)
- Must describe the actual content (product name, brand, category)
- Lowercase only
- No special characters except dots
- Be specific about the product/content

Examples:
- Nike shoes: "nike.vaporfly.running"
- Recipe sites: "recipe.chocolate.cake"
- News articles: "tech.apple.iphone"
- Deals: "nike.sale.shoes"

For the Nike Vaporfly URL, return something like "nike.vaporfly.men" or "nike.running.shoes"

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
      
      // Extract meaningful words from the path
      const meaningfulWords = [];
      
      // Look for product names, categories, etc. in the path
      path.forEach(segment => {
        // Remove common URL patterns and extract meaningful words
        const cleanSegment = segment
          .replace(/[-_]/g, ' ')
          .replace(/[0-9]/g, '')
          .split(' ')
          .filter(word => word.length > 2 && !['com', 'www', 'html', 'php', 'asp'].includes(word.toLowerCase()));
        
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
