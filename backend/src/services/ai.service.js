const OpenAI = require('openai');

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
      
      // Brand-specific contextual extraction
      const meaningfulWords = [];
      
      // Check for specific brands and products
      if (hostname.includes('hoka')) {
        meaningfulWords.push('hoka');
        if (pathname.includes('bondi')) meaningfulWords.push('bondi');
        if (pathname.includes('running')) meaningfulWords.push('running');
        if (pathname.includes('shoes')) meaningfulWords.push('shoes');
        if (pathname.includes('mens')) meaningfulWords.push('mens');
        if (pathname.includes('everyday')) meaningfulWords.push('everyday');
      } else if (hostname.includes('nike')) {
        meaningfulWords.push('nike');
        if (pathname.includes('vaporfly')) meaningfulWords.push('vaporfly');
        if (pathname.includes('running')) meaningfulWords.push('running');
        if (pathname.includes('shoes')) meaningfulWords.push('shoes');
        if (pathname.includes('mens')) meaningfulWords.push('mens');
      } else if (hostname.includes('amazon')) {
        meaningfulWords.push('amazon');
        if (pathname.includes('airpods')) meaningfulWords.push('airpods');
        if (pathname.includes('echo')) meaningfulWords.push('echo');
        if (pathname.includes('kindle')) meaningfulWords.push('kindle');
        if (pathname.includes('apple')) meaningfulWords.push('apple');
      } else if (hostname.includes('target')) {
        meaningfulWords.push('target');
        if (pathname.includes('tide')) meaningfulWords.push('tide');
        if (pathname.includes('pods')) meaningfulWords.push('pods');
        if (pathname.includes('detergent')) meaningfulWords.push('detergent');
      } else if (hostname.includes('walmart')) {
        meaningfulWords.push('walmart');
        if (pathname.includes('tide')) meaningfulWords.push('tide');
        if (pathname.includes('pods')) meaningfulWords.push('pods');
        if (pathname.includes('detergent')) meaningfulWords.push('detergent');
      }
      
      if (meaningfulWords.length > 0) {
        const slug = meaningfulWords.slice(0, 3).join('.');
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
