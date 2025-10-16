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
        console.log('⚠️  No OpenAI instance, using fallback');
        return this.generateFallbackUrl(keywords, originalUrl);
      }

      console.log('🤖 Generating AI slug for:', originalUrl);
      if (keywords.length > 0) {
        console.log('🏷️  Keywords provided:', keywords);
      }

      // Extract domain and path for context
      const urlObj = new URL(originalUrl);
      const domain = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname;

      const prompt = `Create a short, memorable URL slug for this link. Extract the EXACT brand/product/topic from the URL.

URL: ${originalUrl}
Domain: ${domain}
Path: ${path}
${keywords.length > 0 ? `User Keywords: ${keywords.join(', ')}` : ''}

RULES:
1. Extract the actual brand, product name, or content topic from the URL
2. Use 2-4 words maximum
3. Use dots to separate words (e.g., nike.vaporfly.shoes)
4. All lowercase
5. No special characters except dots
6. Be specific and accurate to what's in the URL

EXAMPLES:
- nike.com/vaporfly-running-shoes → nike.vaporfly.shoes
- amazon.com/apple-airpods → apple.airpods.amazon
- github.com/facebook/react → facebook.react.github
- target.com/dial-soap-12pack → dial.soap.12pack.target

Extract the key terms from the path and domain above. Return ONLY the slug, nothing else:`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 20,
      });

      const rawSlug = completion.choices[0].message.content.trim();
      console.log('🔮 AI generated:', rawSlug);
      
      // Validate the slug is relevant to the input URL
      const slug = this.sanitizeSlug(rawSlug);
      
      // Basic relevance check - ensure slug contains words from URL
      const urlWords = (domain + path).toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);
      const slugWords = slug.split('.');
      
      // Check if at least one slug word appears in URL
      const hasRelevantWord = slugWords.some(word => 
        urlWords.some(urlWord => 
          urlWord.includes(word) || word.includes(urlWord)
        )
      );
      
      if (!hasRelevantWord && slugWords.length > 0) {
        console.warn('⚠️  AI slug seems unrelated to URL, using fallback');
        console.warn('   Generated:', slug);
        console.warn('   URL words:', urlWords.slice(0, 5).join(', '));
        return this.generateFallbackUrl(keywords, originalUrl);
      }
      
      console.log('✅ AI slug validated:', slug);
      return slug;
      
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
      const hostname = url.hostname.replace('www.', '');
      const domain = hostname.split('.')[0];
      
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
      const meaningfulWords = [];
      
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
