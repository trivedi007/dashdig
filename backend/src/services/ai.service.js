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

      const prompt = `Analyze this URL and create a human-readable slug that describes the ACTUAL PRODUCT or content, NOT generic URL parts.

URL: ${originalUrl}
${keywords.length > 0 ? `Keywords: ${keywords.join(', ')}` : ''}

CRITICAL RULES:
- IGNORE generic URL parts like "delivery", "landing", "product", "item", "page"
- FOCUS on the actual brand, product name, or service
- Use 2-5 words maximum
- Separate words with dots (.)
- Lowercase only
- No special characters except dots
- Be specific about the ACTUAL PRODUCT/BRAND
- Include store name if from major retailers

E-COMMERCE URL ANALYSIS:
- For URLs with product_id parameters, focus on the brand/store and product type
- For delivery/service URLs, identify the actual product or service being delivered
- For landing pages, extract the product category or brand

Examples:
- "delivery.publix.com/landing?product_id=123" → "publix.groceries" or "publix.products"
- "target.com/p/dial-antibacterial-deodorant-12pk" → "dial.antibacterial.deodorant.target.12pack"
- "walmart.com/ip/iPhone-15-Pro-Max" → "iphone.15.pro.walmart"
- "amazon.com/nike-vaporfly-running-shoes" → "nike.vaporfly.running.amazon"
- "costco.com/kirkland-signature-dog-food" → "kirkland.dog.food.costco"
- Recipe sites: "recipe.chocolate.cake"

Store Detection:
- target.com → .target
- walmart.com → .walmart  
- amazon.com → .amazon
- costco.com → .costco
- ebay.com → .ebay

Product Variants:
- 12pk, 12-pack, 12 count → .12pack
- 24pk, 24-pack, 24 count → .24pack
- multipack → .multipack
- single → .single

For Google search URLs, extract the search terms and make them into a product slug.
For direct product URLs, extract the brand, product name, store, and variants.

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
