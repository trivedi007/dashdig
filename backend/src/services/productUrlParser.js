/**
 * Product URL Parser Service
 * 
 * Extracts product information from e-commerce URLs using:
 * 1. Web scraping (page title, meta tags)
 * 2. URL pattern matching
 * 3. Domain-specific parsers
 */

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Main function to parse product URL and generate smart slug
 */
async function parseProductUrl(url) {
  try {
    console.log(`🔍 Parsing product URL: ${url}`);
    
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '').replace('us.', '').replace('m.', '');
    
    // Extract merchant name
    const merchant = extractMerchantName(domain);
    
    // Try web scraping first (most accurate)
    let productInfo = await scrapeProductInfo(url);
    
    // If scraping fails, use URL parsing
    if (!productInfo || !productInfo.title) {
      console.log('⚠️  Scraping failed, using URL parsing fallback');
      productInfo = parseFromUrl(url, urlObj);
    }
    
    // Generate slug
    const slug = generateProductSlug(merchant, productInfo);
    
    console.log(`✅ Generated slug: ${slug}`);
    
    return {
      slug,
      merchant,
      productInfo,
      confidence: productInfo.fromScraping ? 'high' : 'medium'
    };
    
  } catch (error) {
    console.error('❌ Error parsing product URL:', error.message);
    return generateFallbackSlug(url);
  }
}

/**
 * Extract merchant name from domain
 */
function extractMerchantName(domain) {
  const merchants = {
    'shein.com': 'Shein',
    'amazon.com': 'Amazon',
    'amazon.co.uk': 'Amazon',
    'amazon.de': 'Amazon',
    'amazon.ca': 'Amazon',
    'bjs.com': 'BJs',
    'target.com': 'Target',
    'walmart.com': 'Walmart',
    'ebay.com': 'eBay',
    'etsy.com': 'Etsy',
    'costco.com': 'Costco',
    'homedepot.com': 'HomeDepot',
    'lowes.com': 'Lowes',
    'bestbuy.com': 'BestBuy',
    'wayfair.com': 'Wayfair'
  };
  
  for (const [key, value] of Object.entries(merchants)) {
    if (domain.includes(key)) {
      return value;
    }
  }
  
  // Generic: capitalize first part of domain
  const parts = domain.split('.');
  return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
}

/**
 * Scrape product information from the page
 */
async function scrapeProductInfo(url) {
  try {
    console.log('🕷️  Attempting to scrape page...');
    
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract title (try multiple selectors)
    let title = $('meta[property="og:title"]').attr('content') ||
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text() ||
                $('h1').first().text();
    
    // Extract brand
    let brand = $('meta[property="product:brand"]').attr('content') ||
                $('meta[itemprop="brand"]').attr('content') ||
                $('.brand').text() ||
                extractBrandFromTitle(title);
    
    // Extract description
    let description = $('meta[property="og:description"]').attr('content') ||
                     $('meta[name="description"]').attr('content');
    
    console.log('📄 Scraped data:', { title: title?.substring(0, 50), brand, description: description?.substring(0, 50) });
    
    if (title) {
      return {
        title: cleanText(title),
        brand: cleanText(brand),
        description: cleanText(description),
        fromScraping: true
      };
    }
    
    return null;
    
  } catch (error) {
    console.log('⚠️  Scraping failed:', error.message);
    return null;
  }
}

/**
 * Extract brand name from title
 */
function extractBrandFromTitle(title) {
  if (!title) return '';
  
  // Common brand patterns
  const brandPatterns = [
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*[-:|]/,  // "Brand Name - Product"
    /\b(Charmin|Bounty|Tide|Crest|Colgate|Dove|Oral-B|Gillette|Pampers|Huggies)\b/i,
    /\b(Apple|Samsung|Sony|LG|Nike|Adidas|Puma|HP|Dell|Lenovo)\b/i,
    /\b(Amazon|Google|Microsoft|Meta|Tesla)\b/i
  ];
  
  for (const pattern of brandPatterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  // Fallback: first capitalized word
  const match = title.match(/\b([A-Z][a-z]+)\b/);
  return match ? match[1] : '';
}

/**
 * Parse product info from URL if scraping fails
 */
function parseFromUrl(url, urlObj) {
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  
  // Look for product ID patterns
  const productIdMatch = url.match(/(?:goods-p-|dp\/|product\/|item\/)([A-Z0-9]+)/i);
  
  // Try to extract meaningful words from path
  const meaningfulWords = [];
  
  for (const segment of pathSegments) {
    // Skip common e-commerce paths
    if (['goods-p', 'product', 'item', 'dp', 'p'].includes(segment.toLowerCase())) {
      continue;
    }
    
    // Extract words from segment (remove IDs and extensions)
    const words = segment
      .replace(/\.[a-z]+$/i, '') // Remove file extensions
      .replace(/[-_]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !/^\d+$/.test(w)); // Remove short words and pure numbers
    
    meaningfulWords.push(...words);
  }
  
  return {
    title: meaningfulWords.slice(0, 5).join(' '),
    productId: productIdMatch ? productIdMatch[1] : null,
    fromScraping: false
  };
}

/**
 * Generate product slug from merchant and product info
 */
function generateProductSlug(merchant, productInfo) {
  const parts = [merchant];
  
  if (!productInfo || !productInfo.title) {
    return `${merchant}.Product`;
  }
  
  // Parse title into components
  const title = productInfo.title;
  const brand = productInfo.brand;
  
  // Add brand if different from merchant
  if (brand && brand.toLowerCase() !== merchant.toLowerCase()) {
    parts.push(toPascalCase(brand));
  }
  
  // Parse title for product details
  const titleWords = title
    .replace(/[^\w\s.-]/g, ' ') // Remove special chars except dots and hyphens
    .split(/\s+/)
    .filter(word => {
      // Remove stop words and short words
      const stopWords = ['the', 'and', 'or', 'for', 'with', 'pack', 'count', 'set'];
      return word.length > 2 && !stopWords.includes(word.toLowerCase());
    })
    .map(word => {
      // Handle special cases
      if (/^\d+$/.test(word)) {
        return word; // Keep numbers as-is
      }
      return toPascalCase(word);
    });
  
  // Smart selection of words (prioritize product descriptors)
  const productWords = selectProductWords(titleWords, brand);
  parts.push(...productWords);
  
  // Join and clean up
  let slug = parts.join('.');
  
  // Remove double dots
  slug = slug.replace(/\.{2,}/g, '.');
  
  // Remove trailing dots
  slug = slug.replace(/\.$/, '');
  
  // Remove file extensions
  slug = slug.replace(/\.(html|htm|php|asp)$/i, '');
  
  // Enforce max length (60 chars)
  if (slug.length > 60) {
    const slugParts = slug.split('.');
    while (slug.length > 60 && slugParts.length > 3) {
      slugParts.pop();
      slug = slugParts.join('.');
    }
  }
  
  return slug;
}

/**
 * Select most important product words
 */
function selectProductWords(words, brand) {
  // Priority keywords
  const priorityKeywords = [
    'ultra', 'strong', 'mega', 'plus', 'premium', 'deluxe', 'pro',
    'max', 'super', 'extra', 'soft', 'gentle', 'fresh', 'clean',
    'pack', 'rolls', 'count', 'oz', 'lb', 'piece', 'set'
  ];
  
  const selected = [];
  
  // First, add brand-specific words (skip if it's the brand name)
  for (const word of words) {
    if (brand && word.toLowerCase() === brand.toLowerCase()) {
      continue; // Skip brand name (already in slug)
    }
    
    // Prioritize keywords
    if (priorityKeywords.some(kw => word.toLowerCase().includes(kw))) {
      selected.push(word);
    } else if (selected.length < 5) {
      selected.push(word);
    }
  }
  
  // Limit to 5 words max
  return selected.slice(0, 5);
}

/**
 * Convert string to PascalCase
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
 * Clean text (remove extra whitespace, special chars)
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.-]/g, '')
    .trim();
}

/**
 * Generate fallback slug if all else fails
 */
function generateFallbackSlug(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '').replace('us.', '');
    const merchant = extractMerchantName(domain);
    
    // Try to get product ID
    const productIdMatch = url.match(/(?:goods-p-|dp\/|product\/)([A-Z0-9]+)/i);
    const productId = productIdMatch ? productIdMatch[1] : 'Product';
    
    return {
      slug: `${merchant}.${productId}`,
      merchant,
      productInfo: { productId },
      confidence: 'low'
    };
  } catch (error) {
    return {
      slug: 'Product.' + Math.random().toString(36).substring(7),
      confidence: 'low'
    };
  }
}

module.exports = {
  parseProductUrl,
  extractMerchantName,
  toPascalCase,
  cleanText
};

