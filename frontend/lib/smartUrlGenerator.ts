/**
 * Smart URL Generator for Dashdig
 * Generates human-readable short URLs with semantic meaning
 * 
 * Example: https://www.amazon.com/dp/B08N5WRWNW → dashdig.com/Amazon.Echo.Dot.5thGen
 */

export interface SmartUrlResult {
  slug: string;
  confidence: 'high' | 'medium' | 'low';
  components: {
    merchant?: string;
    brand?: string;
    product?: string;
    modifier?: string;
  };
}

// Known merchant/domain mappings
const MERCHANT_MAP: Record<string, string> = {
  'amazon.com': 'Amazon',
  'amazon.co.uk': 'Amazon',
  'bjs.com': 'BJs',
  'target.com': 'Target',
  'walmart.com': 'Walmart',
  'bestbuy.com': 'BestBuy',
  'homedepot.com': 'HomeDepot',
  'lowes.com': 'Lowes',
  'ebay.com': 'Ebay',
  'etsy.com': 'Etsy',
  'youtube.com': 'YouTube',
  'youtu.be': 'YouTube',
  'nytimes.com': 'NYTimes',
  'washingtonpost.com': 'WashPost',
  'medium.com': 'Medium',
  'github.com': 'GitHub',
  'stackoverflow.com': 'StackOverflow',
  'reddit.com': 'Reddit',
  'twitter.com': 'Twitter',
  'x.com': 'X',
  'linkedin.com': 'LinkedIn',
  'facebook.com': 'Facebook',
  'instagram.com': 'Instagram',
  'tiktok.com': 'TikTok',
  'netflix.com': 'Netflix',
  'spotify.com': 'Spotify',
  'apple.com': 'Apple',
  'microsoft.com': 'Microsoft',
  'google.com': 'Google',
  'hoka.com': 'Hoka',
  'nike.com': 'Nike',
  'adidas.com': 'Adidas',
  'underarmour.com': 'UnderArmour',
};

// Common words to filter out
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'should', 'could', 'may', 'might', 'must', 'can', 'about',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'just', 'now', 'product', 'item', 'page', 'detail',
  'details', 'view', 'buy', 'shop', 'store', 'online', 'www', 'http',
  'https', 'html', 'htm', 'php', 'asp', 'aspx', 'jsp'
]);

// Tracking parameters to remove
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'ref', 'referer', 'referrer', 'source', 'src', 'campaign', 'medium',
  'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid', '_ga', 'tracking',
  'track', 'tid', 'trc', 'WT.mc_id', 'fulfillment'
];

/**
 * Extract merchant name from domain
 */
function extractMerchant(hostname: string): string {
  // Remove www. prefix
  const domain = hostname.replace(/^www\./, '');
  
  // Check known merchants
  if (MERCHANT_MAP[domain]) {
    return MERCHANT_MAP[domain];
  }
  
  // Extract main domain name (e.g., example.com → Example)
  const mainDomain = domain.split('.')[0];
  return toPascalCase(mainDomain);
}

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Extract meaningful words from a string
 */
function extractMeaningfulWords(text: string, maxWords: number = 5): string[] {
  // Split by common separators
  const words = text
    .toLowerCase()
    .split(/[-_\s/]+/)
    .filter(word => {
      // Filter out stop words, numbers-only, and very short words
      return (
        word.length > 1 &&
        !STOP_WORDS.has(word) &&
        !/^\d+$/.test(word) &&
        !/^[^a-z0-9]+$/.test(word)
      );
    });
  
  return words.slice(0, maxWords);
}

/**
 * Parse Amazon URLs
 */
function parseAmazonUrl(pathname: string, searchParams: URLSearchParams): SmartUrlResult['components'] {
  // Amazon ASIN pattern: /dp/{ASIN} or /product/{ASIN}
  const asinMatch = pathname.match(/\/(dp|product|gp\/product)\/([A-Z0-9]{10})/);
  
  // Try to extract product name from URL path
  const pathParts = pathname.split('/').filter(p => p && p !== 'dp' && p !== 'product' && p !== 'gp');
  
  // Look for product name in path (usually before /dp/)
  const productNamePart = pathParts.find(part => 
    part.length > 10 && !part.match(/^[A-Z0-9]{10}$/)
  );
  
  if (productNamePart) {
    const words = extractMeaningfulWords(productNamePart, 3);
    const brand = words[0] ? toPascalCase(words[0]) : undefined;
    const product = words.slice(1, 3).map(toPascalCase).join('');
    
    return {
      merchant: 'Amazon',
      brand,
      product: product || 'Product',
    };
  }
  
  return {
    merchant: 'Amazon',
    product: 'Product',
  };
}

/**
 * Parse YouTube URLs
 */
function parseYouTubeUrl(pathname: string, searchParams: URLSearchParams): SmartUrlResult['components'] {
  // Extract video title from URL if available
  const videoId = searchParams.get('v') || pathname.split('/').pop();
  
  // Look for meaningful words in the path
  const pathWords = extractMeaningfulWords(pathname, 3);
  
  if (pathWords.length > 0) {
    const product = pathWords.map(toPascalCase).join('');
    return {
      merchant: 'YouTube',
      product: product || 'Video',
    };
  }
  
  return {
    merchant: 'YouTube',
    product: 'Video',
  };
}

/**
 * Parse article URLs (news, blogs)
 */
function parseArticleUrl(hostname: string, pathname: string): SmartUrlResult['components'] {
  const merchant = extractMerchant(hostname);
  
  // Extract article title from URL path
  const pathParts = pathname.split('/').filter(p => p);
  
  // Look for year/date in path to identify articles
  const hasDate = pathParts.some(p => /^\d{4}$/.test(p) || /^\d{4}-\d{2}/.test(p));
  
  if (hasDate || ['article', 'post', 'blog', 'news', 'story'].some(w => pathname.includes(w))) {
    // Find the most meaningful part (usually the slug)
    const titlePart = pathParts.find(part => 
      part.length > 10 && !part.match(/^\d/) && part.includes('-')
    );
    
    if (titlePart) {
      const words = extractMeaningfulWords(titlePart, 4);
      const product = words.map(toPascalCase).join('.');
      
      return {
        merchant,
        product: product || 'Article',
      };
    }
  }
  
  return {
    merchant,
    product: 'Article',
  };
}

/**
 * Parse e-commerce product URLs
 */
function parseEcommerceUrl(hostname: string, pathname: string, searchParams: URLSearchParams): SmartUrlResult['components'] {
  const merchant = extractMerchant(hostname);
  
  // Common e-commerce patterns: /product/, /p/, /item/, /products/
  const productMatch = pathname.match(/\/(product|p|item|products|dp)\/([^/]+)/);
  
  if (productMatch) {
    const productSlug = productMatch[2];
    const words = extractMeaningfulWords(productSlug, 4);
    
    if (words.length > 0) {
      const brand = words[0] ? toPascalCase(words[0]) : undefined;
      const product = words.slice(1, 3).map(toPascalCase).join('');
      const modifier = words[3] ? toPascalCase(words[3]) : undefined;
      
      return {
        merchant,
        brand,
        product: product || 'Product',
        modifier,
      };
    }
  }
  
  // Try to extract from full pathname
  const allWords = extractMeaningfulWords(pathname, 4);
  
  if (allWords.length > 0) {
    const brand = allWords[0] ? toPascalCase(allWords[0]) : undefined;
    const product = allWords.slice(1, 3).map(toPascalCase).join('');
    
    return {
      merchant,
      brand,
      product: product || 'Product',
    };
  }
  
  return {
    merchant,
    product: 'Product',
  };
}

/**
 * Generate smart URL slug from any URL
 */
export function generateSmartUrl(url: string): SmartUrlResult {
  try {
    // Parse URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    
    // Remove tracking parameters
    TRACKING_PARAMS.forEach(param => searchParams.delete(param));
    
    let components: SmartUrlResult['components'];
    let confidence: SmartUrlResult['confidence'] = 'medium';
    
    // Route to specific parsers based on domain
    if (hostname.includes('amazon')) {
      components = parseAmazonUrl(pathname, searchParams);
      confidence = 'high';
    } else if (hostname.includes('youtube') || hostname.includes('youtu.be')) {
      components = parseYouTubeUrl(pathname, searchParams);
      confidence = 'medium';
    } else if (
      hostname.includes('nytimes') ||
      hostname.includes('washingtonpost') ||
      hostname.includes('medium') ||
      hostname.includes('blog')
    ) {
      components = parseArticleUrl(hostname, pathname);
      confidence = 'medium';
    } else if (
      hostname.includes('bjs') ||
      hostname.includes('target') ||
      hostname.includes('walmart') ||
      hostname.includes('bestbuy') ||
      hostname.includes('hoka') ||
      hostname.includes('nike')
    ) {
      components = parseEcommerceUrl(hostname, pathname, searchParams);
      confidence = 'high';
    } else {
      // Generic fallback
      components = parseEcommerceUrl(hostname, pathname, searchParams);
      confidence = 'low';
    }
    
    // Build slug: {Merchant}.{Brand}.{Product}.{Modifier}
    const slugParts = [
      components.merchant,
      components.brand,
      components.product,
      components.modifier,
    ].filter(Boolean);
    
    let slug = slugParts.join('.');
    
    // Ensure slug is within max length (50 chars)
    if (slug.length > 50) {
      // Truncate modifier first
      if (components.modifier) {
        slugParts.pop();
        slug = slugParts.join('.');
      }
      
      // If still too long, truncate product
      if (slug.length > 50 && components.product) {
        const maxProductLen = 50 - slugParts[0].length - (components.brand?.length || 0) - 2;
        components.product = components.product.substring(0, maxProductLen);
        slug = slugParts.join('.');
      }
    }
    
    // Fallback if no meaningful slug generated
    if (!slug || slug.length < 3) {
      const merchant = extractMerchant(hostname);
      slug = `${merchant}.Link`;
      confidence = 'low';
    }
    
    return {
      slug,
      confidence,
      components,
    };
  } catch (error) {
    console.error('Error generating smart URL:', error);
    
    // Ultimate fallback
    return {
      slug: 'Link',
      confidence: 'low',
      components: {},
    };
  }
}

/**
 * Test the smart URL generator with examples
 */
export function testSmartUrlGenerator() {
  const testUrls = [
    'https://www.bjs.com/product/harrys-5-blade-razor-handle-value-pack/3000000000003879255',
    'https://www.amazon.com/dp/B08N5WRWNW',
    'https://www.amazon.com/Echo-Dot-5th-Gen-Smart-speaker/dp/B09B8V1LZ3',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.nytimes.com/2025/01/15/technology/ai-regulation-congress.html',
    'https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets',
    'https://www.hoka.com/en/us/mens-everyday-running-shoes/bondi-9/197634740874.html',
    'https://www.nike.com/t/vaporfly-3-mens-road-racing-shoes',
  ];
  
  console.log('🔍 Smart URL Generator Test Results:\n');
  
  testUrls.forEach(url => {
    const result = generateSmartUrl(url);
    console.log(`Original: ${url}`);
    console.log(`Smart URL: dashdig.com/${result.slug}`);
    console.log(`Confidence: ${result.confidence}`);
    console.log(`Components:`, result.components);
    console.log('---\n');
  });
}

