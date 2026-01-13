/**
 * 🚀 SMART URL GENERATOR V2.0
 * 
 * Complete rewrite with intelligent URL generation:
 * 1. Web scraping for accurate product data
 * 2. Claude AI for human-like slug generation
 * 3. Multi-level fallback system
 * 4. Quality validation and retry logic
 * 
 * Goal: Generate URLs that are:
 * - Human-readable (grandma-friendly)
 * - Information-dense (brand + product + details)
 * - Memorable (sticky after one view)
 * - Sales-pitch quality (sounds like a commercial)
 */

const axios = require('axios');
const cheerio = require('cheerio');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude AI
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// In-memory cache (use Redis in production)
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Stop words to remove
const STOP_WORDS = new Set([
  'the', 'and', 'or', 'for', 'with', 'of', 'from', 'in', 'on', 'at', 'to',
  'a', 'an', 'by', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has',
  'shop', 'buy', 'price', 'sale', 'deal', 'offer', 'free', 'shipping'
]);

/**
 * 🎯 MAIN FUNCTION: Generate Smart URL
 */
async function generateSmartUrl(url, options = {}) {
  const maxRetries = options.maxRetries || 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    attempts++;
    console.log(`\n🎯 Smart URL Generation (Attempt ${attempts}/${maxRetries})`);
    console.log(`📍 URL: ${url}`);

    try {
      // Step 1: Fetch page metadata
      const metadata = await fetchPageMetadata(url);
      
      // Step 2: Generate slug with AI (preferred)
      if (process.env.ANTHROPIC_API_KEY) {
        const aiResult = await generateWithAI(metadata, url);
        if (aiResult && validateSlugQuality(aiResult.slug)) {
          console.log(`✅ AI-generated slug: ${aiResult.slug}`);
          cacheResult(url, aiResult);
          return aiResult;
        }
      }

      // Step 3: Intelligent fallback parsing
      const fallbackResult = generateWithIntelligence(metadata, url);
      if (validateSlugQuality(fallbackResult.slug)) {
        console.log(`✅ Intelligence-generated slug: ${fallbackResult.slug}`);
        cacheResult(url, fallbackResult);
        return fallbackResult;
      }

      // Step 4: Last resort fallback
      if (attempts === maxRetries) {
        const lastResort = generateLastResort(url);
        console.log(`⚠️  Last resort slug: ${lastResort.slug}`);
        return lastResort;
      }

    } catch (error) {
      console.error(`❌ Attempt ${attempts} failed:`, error.message);
      if (attempts === maxRetries) {
        return generateLastResort(url);
      }
    }
  }
}

/**
 * 🕷️ STEP 1: Fetch Page Metadata (Web Scraping)
 */
async function fetchPageMetadata(url) {
  console.log('🕷️  Fetching page metadata...');

  // Check cache first
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('💾 Using cached metadata');
    return cached.metadata;
  }

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    const $ = cheerio.load(response.data);
    const urlObj = new URL(url);

    // Extract all possible data sources
    const metadata = {
      // URL components
      domain: urlObj.hostname.replace(/^(www\.|m\.|us\.)/, ''),
      pathname: urlObj.pathname,
      
      // Page title (multiple sources)
      title: extractBestTitle($),
      
      // Meta tags
      ogTitle: $('meta[property="og:title"]').attr('content')?.trim(),
      twitterTitle: $('meta[name="twitter:title"]').attr('content')?.trim(),
      description: $('meta[name="description"]').attr('content')?.trim(),
      ogDescription: $('meta[property="og:description"]').attr('content')?.trim(),
      
      // Product-specific
      brand: extractBrand($),
      productName: extractProductName($),
      price: extractPrice($),
      
      // Headers
      h1: $('h1').first().text().trim(),
      h2: $('h2').first().text().trim(),
      
      // Structured data
      jsonLd: extractJsonLd($),
      
      // Success flag
      scraped: true
    };

    console.log('📦 Metadata extracted:', {
      title: metadata.title?.substring(0, 60),
      brand: metadata.brand,
      productName: metadata.productName?.substring(0, 40)
    });

    return metadata;

  } catch (error) {
    console.log('⚠️  Scraping failed, using URL parsing only');
    console.log('   Error:', error.message);
    
    // Fallback to URL parsing only
    const urlObj = new URL(url);
    return {
      domain: urlObj.hostname.replace(/^(www\.|m\.|us\.)/, ''),
      pathname: urlObj.pathname,
      title: null,
      scraped: false
    };
  }
}

/**
 * 📄 Extract best title from page
 */
function extractBestTitle($) {
  const sources = [
    $('meta[property="og:title"]').attr('content'),
    $('meta[name="twitter:title"]').attr('content'),
    $('title').text(),
    $('h1').first().text(),
    $('meta[itemprop="name"]').attr('content')
  ];

  for (const source of sources) {
    if (source && source.trim().length > 5) {
      return cleanText(source.trim());
    }
  }

  return null;
}

/**
 * 🏷️ Extract brand from page
 */
function extractBrand($) {
  const sources = [
    $('meta[property="product:brand"]').attr('content'),
    $('meta[itemprop="brand"]').attr('content'),
    $('[itemprop="brand"] [itemprop="name"]').text(),
    $('.brand').text(),
    $('[class*="brand"]').first().text()
  ];

  for (const source of sources) {
    if (source && source.trim().length > 1) {
      return cleanText(source.trim());
    }
  }

  return null;
}

/**
 * 📦 Extract product name
 */
function extractProductName($) {
  const sources = [
    $('meta[property="og:title"]').attr('content'),
    $('meta[itemprop="name"]').attr('content'),
    $('h1[itemprop="name"]').text(),
    $('[class*="product"][class*="name"]').first().text(),
    $('[class*="product"][class*="title"]').first().text()
  ];

  for (const source of sources) {
    if (source && source.trim().length > 5) {
      return cleanText(source.trim());
    }
  }

  return null;
}

/**
 * 💰 Extract price (for context)
 */
function extractPrice($) {
  const sources = [
    $('meta[property="og:price:amount"]').attr('content'),
    $('[itemprop="price"]').attr('content'),
    $('[class*="price"]').first().text()
  ];

  for (const source of sources) {
    if (source && source.trim().length > 0) {
      const priceMatch = source.match(/[\d,.]+/);
      return priceMatch ? priceMatch[0] : null;
    }
  }

  return null;
}

/**
 * 📊 Extract JSON-LD structured data
 */
function extractJsonLd($) {
  try {
    const jsonLdScript = $('script[type="application/ld+json"]').first().html();
    if (jsonLdScript) {
      const data = JSON.parse(jsonLdScript);
      return {
        type: data['@type'],
        name: data.name,
        brand: data.brand?.name || data.brand,
        description: data.description
      };
    }
  } catch (error) {
    // Ignore JSON-LD parsing errors
  }
  return null;
}

/**
 * 🤖 STEP 2: Generate Slug with Claude AI
 */
async function generateWithAI(metadata, url) {
  console.log('🤖 Generating slug with Claude AI...');

  try {
    // Prepare context for Claude
    const context = buildContextForAI(metadata, url);
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      temperature: 0.2, // Low temperature for consistency
      system: 'You are a URL slug generator. Return ONLY the slug text. Never include explanations, quotes, markdown, or any extra text.',
      messages: [{
        role: 'user',
        content: `You are an expert at creating memorable, human-readable short URLs for products and pages.

Given this information:
${context}

Create a SHORT, MEMORABLE URL slug that:
1. Captures the merchant/brand name
2. Includes the product/item name or main subject
3. Adds 1-2 key differentiators (size, quantity, version, model, color)
4. Uses PascalCase with dots as separators
5. Is under 60 characters
6. Sounds like a SALES PITCH - memorable and enticing
7. Avoids generic words like "product", "item", "good"

Format: Merchant.Product.Descriptor
Examples:
- Target.Benadryl.Allergy.Relief.100ct
- Amazon.AirPods.Pro.2ndGen
- Walmart.GreatValue.Vitamin.D.Milk.Gallon
- Shein.Charmin.Ultra.Strong.6.Mega

IMPORTANT: Return ONLY the slug text. No explanations, quotes, or extra text. Just the slug itself.`
      }]
    });

    // Clean response - remove any quotes, markdown, or extra text
    let slug = message.content[0].text.trim();
    
    // Remove quotes if present
    slug = slug.replace(/^["']|["']$/g, '');
    
    // Remove markdown formatting if present
    slug = slug.replace(/`/g, '');
    
    // Clean to only valid characters
    slug = slug
      .replace(/[^a-zA-Z0-9.]/g, '')
      .replace(/\.+/g, '.')
      .replace(/^\.+|\.+$/g, '');

    if (slug.length < 10 || slug.length > 70) {
      console.log('⚠️  AI slug failed length check:', slug);
      return null;
    }

    return {
      slug,
      confidence: 'high',
      source: 'claude-ai',
      method: 'ai-enhanced-scraping',
      metadata: {
        title: metadata.title?.substring(0, 100),
        brand: metadata.brand
      }
    };

  } catch (error) {
    console.error('❌ Claude AI error:', error.message);
    return null;
  }
}

/**
 * 📝 Build context for AI
 */
function buildContextForAI(metadata, url) {
  const parts = [];

  parts.push(`URL: ${url}`);
  parts.push(`Domain: ${metadata.domain}`);
  
  if (metadata.title) {
    parts.push(`Page Title: ${metadata.title}`);
  }
  
  if (metadata.brand) {
    parts.push(`Brand: ${metadata.brand}`);
  }
  
  if (metadata.productName) {
    parts.push(`Product: ${metadata.productName}`);
  }
  
  if (metadata.description) {
    parts.push(`Description: ${metadata.description.substring(0, 150)}`);
  }

  if (metadata.jsonLd) {
    parts.push(`Structured Data: ${JSON.stringify(metadata.jsonLd)}`);
  }

  return parts.join('\n');
}

/**
 * 🧠 STEP 3: Intelligent Fallback (No AI)
 */
function generateWithIntelligence(metadata, url) {
  console.log('🧠 Using intelligent parsing (no AI)...');

  try {
    const merchant = extractMerchantName(metadata.domain);
    const parts = [merchant];

    // Strategy 1: Use scraped data if available
    if (metadata.scraped && metadata.title) {
      const titleParts = parseTitle(metadata.title, metadata.brand);
      
      // Add brand if different from merchant
      if (metadata.brand && !merchant.toLowerCase().includes(metadata.brand.toLowerCase())) {
        parts.push(toPascalCase(metadata.brand));
      }
      
      parts.push(...titleParts.slice(0, 4));
    }
    // Strategy 2: Parse URL pathname
    else {
      const pathParts = parsePathname(metadata.pathname);
      parts.push(...pathParts.slice(0, 4));
    }

    let slug = parts
      .filter(p => p && p.length > 0)
      .join('.')
      .replace(/\.+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .substring(0, 60);

    // Clean up common issues
    slug = slug
      .replace(/\.(html|htm|php|asp|jsp)$/i, '')
      .replace(/\.(us|good|item|product)$/i, '');

    return {
      slug,
      confidence: metadata.scraped ? 'medium' : 'low',
      source: 'intelligent-parsing',
      method: metadata.scraped ? 'scraping-based' : 'url-based',
      metadata: {
        title: metadata.title?.substring(0, 100)
      }
    };

  } catch (error) {
    console.error('❌ Intelligent parsing error:', error.message);
    return generateLastResort(url);
  }
}

/**
 * 📝 Parse title into meaningful components
 */
function parseTitle(title, brand) {
  if (!title) return [];

  // Clean and tokenize
  let cleaned = title
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into words
  const words = cleaned.split(/\s+/);
  
  const parts = [];
  const seenWords = new Set();

  for (const word of words) {
    const lower = word.toLowerCase();
    
    // Skip if already seen, stop word, or too short
    if (seenWords.has(lower) || STOP_WORDS.has(lower) || word.length < 2) {
      continue;
    }
    
    // Skip brand name (already in slug)
    if (brand && lower === brand.toLowerCase()) {
      continue;
    }

    // Keep numbers with units (100ct, 5oz, etc)
    if (/^\d+[a-z]+$/i.test(word)) {
      parts.push(word);
      seenWords.add(lower);
      continue;
    }

    // Keep meaningful words
    if (word.length > 2 && !/^\d+$/.test(word)) {
      parts.push(toPascalCase(word));
      seenWords.add(lower);
    }
    // Keep standalone numbers if they seem important
    else if (/^\d+$/.test(word) && parseInt(word) < 10000) {
      parts.push(word);
      seenWords.add(lower);
    }

    // Limit to reasonable number of parts
    if (parts.length >= 5) break;
  }

  return parts;
}

/**
 * 🛣️ Parse pathname into components
 */
function parsePathname(pathname) {
  if (!pathname) return [];

  const segments = pathname
    .split('/')
    .filter(s => s && s.length > 2)
    .filter(s => !['product', 'item', 'goods-p', 'dp', 'p'].includes(s.toLowerCase()));

  const parts = [];

  for (const segment of segments) {
    // Clean segment
    const cleaned = segment
      .replace(/\.[a-z]+$/i, '') // Remove extensions
      .replace(/[-_]/g, ' ');
    
    // Split and process words
    const words = cleaned.split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()))
      .map(w => toPascalCase(w));

    parts.push(...words);

    if (parts.length >= 4) break;
  }

  return parts;
}

/**
 * 🏪 Extract merchant name from domain
 */
function extractMerchantName(domain) {
  const merchants = {
    'amazon.com': 'Amazon',
    'amazon.co.uk': 'Amazon',
    'amazon.de': 'Amazon',
    'amazon.ca': 'Amazon',
    'target.com': 'Target',
    'walmart.com': 'Walmart',
    'bjs.com': 'BJs',
    'costco.com': 'Costco',
    'shein.com': 'Shein',
    'ebay.com': 'eBay',
    'etsy.com': 'Etsy',
    'homedepot.com': 'HomeDepot',
    'lowes.com': 'Lowes',
    'bestbuy.com': 'BestBuy',
    'wayfair.com': 'Wayfair',
    'nike.com': 'Nike',
    'adidas.com': 'Adidas',
    'apple.com': 'Apple',
    'samsung.com': 'Samsung',
    'nytimes.com': 'NYTimes',
    'washingtonpost.com': 'WashPost',
    'cnn.com': 'CNN',
    'bbc.com': 'BBC'
  };

  for (const [key, value] of Object.entries(merchants)) {
    if (domain.includes(key)) {
      return value;
    }
  }

  // Generic: capitalize first part
  const firstPart = domain.split('.')[0];
  return toPascalCase(firstPart);
}

/**
 * ⚠️ STEP 4: Last Resort Fallback
 */
function generateLastResort(url) {
  console.log('⚠️  Using last resort generation...');

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^(www\.|m\.|us\.)/, '');
    const merchant = extractMerchantName(domain);
    
    // Try to extract product ID or meaningful segment
    const pathMatch = urlObj.pathname.match(/\/([a-z0-9-]+)(?:\.html?)?$/i);
    const segment = pathMatch ? pathMatch[1].split('-').slice(0, 2).join('.') : 'Product';
    
    return {
      slug: `${merchant}.${toPascalCase(segment)}`,
      confidence: 'very-low',
      source: 'last-resort',
      method: 'url-fallback'
    };

  } catch (error) {
    return {
      slug: `Product.${Math.random().toString(36).substring(2, 8)}`,
      confidence: 'very-low',
      source: 'error-fallback',
      method: 'random'
    };
  }
}

/**
 * ✅ Validate slug quality
 */
function validateSlugQuality(slug) {
  if (!slug || typeof slug !== 'string') {
    console.log('❌ Validation failed: empty or invalid slug');
    return false;
  }

  // Length check
  if (slug.length < 5 || slug.length > 70) {
    console.log(`❌ Validation failed: length ${slug.length} (must be 5-70)`);
    return false;
  }

  // Must have at least 2 components (Merchant.Product minimum)
  const parts = slug.split('.');
  if (parts.length < 2) {
    console.log('❌ Validation failed: needs at least 2 components');
    return false;
  }

  // No double dots
  if (slug.includes('..')) {
    console.log('❌ Validation failed: contains double dots');
    return false;
  }

  // No file extensions
  if (/\.(html|htm|php|asp|jsp)$/i.test(slug)) {
    console.log('❌ Validation failed: contains file extension');
    return false;
  }

  // No generic-only slugs
  const genericPatterns = /^(us|good|item|product|page)\..*$/i;
  if (genericPatterns.test(slug)) {
    console.log('❌ Validation failed: starts with generic word');
    return false;
  }

  // Must have some letters
  if (!/[a-zA-Z]{3,}/.test(slug)) {
    console.log('❌ Validation failed: insufficient letters');
    return false;
  }

  console.log(`✅ Slug passed validation: ${slug}`);
  return true;
}

/**
 * 💾 Cache result
 */
function cacheResult(url, result) {
  cache.set(url, {
    ...result,
    timestamp: Date.now()
  });
}

/**
 * 🧹 Utility: Convert to PascalCase
 */
function toPascalCase(str) {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/**
 * 🧹 Utility: Clean text
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.-]/g, '')
    .trim();
}

/**
 * 📊 Get cache stats
 */
function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.entries()).slice(0, 10).map(([url, data]) => ({
      url: url.substring(0, 60),
      slug: data.slug,
      source: data.source,
      age: Math.round((Date.now() - data.timestamp) / 1000 / 60) + 'm'
    }))
  };
}

/**
 * 🗑️ Clear cache
 */
function clearCache() {
  const size = cache.size;
  cache.clear();
  console.log(`🗑️  Cleared ${size} cached entries`);
  return { cleared: size };
}

module.exports = {
  generateSmartUrl,
  validateSlugQuality,
  getCacheStats,
  clearCache,
  extractMerchantName,
  toPascalCase
};

