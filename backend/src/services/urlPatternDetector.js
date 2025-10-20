/**
 * URL Pattern Detector Service
 * Matches URLs to pre-defined templates for popular sites
 */

const patterns = {
  amazon: {
    name: 'Amazon',
    domains: ['amazon.com', 'amzn.com', 'amazon.co.uk', 'amazon.ca', 'amazon.de'],
    regex: /amazon\.[a-z.]+\/(dp|gp\/product|exec\/obidos\/ASIN)\/([A-Z0-9]+)/i,
    template: 'Amazon.{ProductName}.{Category}',
    extract: (url) => {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // Find ASIN (product ID)
      const asinIndex = pathParts.findIndex(p => p === 'dp' || p === 'ASIN');
      const asin = asinIndex >= 0 ? pathParts[asinIndex + 1] : null;
      
      // Extract product name from path or title tag (would need scraping in production)
      const productName = pathParts[pathParts.length - 1]
        .replace(/[^a-zA-Z0-9]+/g, '.')
        .replace(/^\.+|\.+$/g, '')
        .split('.')
        .slice(0, 3)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('.');
      
      return {
        merchant: 'Amazon',
        product: productName || asin,
        category: extractCategory(pathParts),
        asin
      };
    }
  },
  
  youtube: {
    name: 'YouTube',
    domains: ['youtube.com', 'youtu.be', 'm.youtube.com'],
    regex: /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/i,
    template: 'YouTube.{ChannelName}.{VideoTitle}',
    extract: (url) => {
      const urlObj = new URL(url);
      const videoId = extractYouTubeVideoId(url);
      
      // Extract from query params or path
      const searchParams = new URLSearchParams(urlObj.search);
      const channelName = searchParams.get('channel') || 'Video';
      
      // In production, you'd fetch video metadata from YouTube API
      return {
        platform: 'YouTube',
        videoId,
        channel: channelName,
        type: urlObj.pathname.includes('shorts') ? 'Short' : 'Video'
      };
    }
  },
  
  github: {
    name: 'GitHub',
    domains: ['github.com', 'raw.githubusercontent.com', 'gist.github.com'],
    regex: /github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)/i,
    template: 'GitHub.{Username}.{RepoName}',
    extract: (url) => {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      const username = pathParts[0];
      const repoName = pathParts[1];
      
      return {
        platform: 'GitHub',
        username,
        repo: repoName,
        type: pathParts[2] === 'issues' ? 'Issue' : 
              pathParts[2] === 'pull' ? 'PR' : 
              'Repo'
      };
    }
  },
  
  nytimes: {
    name: 'New York Times',
    domains: ['nytimes.com', 'nyti.ms'],
    regex: /nytimes\.com\/(\d{4})\/(\d{2})\/(\d{2})\//i,
    template: 'NYTimes.{Headline}.{Year}',
    extract: (url) => {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // Extract date
      const year = pathParts[0];
      const month = pathParts[1];
      
      // Extract headline (usually last part of path)
      const headline = pathParts[pathParts.length - 1]
        .replace('.html', '')
        .split('-')
        .slice(0, 3)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('.');
      
      return {
        publication: 'NYTimes',
        headline,
        year,
        month,
        category: pathParts[3] || 'News'
      };
    }
  },
  
  medium: {
    name: 'Medium',
    domains: ['medium.com'],
    regex: /medium\.com\/(@?[a-zA-Z0-9_-]+)\/(.*)/i,
    template: 'Medium.{Author}.{Title}',
    extract: (url) => {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      const author = pathParts[0].replace('@', '');
      const titleSlug = pathParts[1] || '';
      
      const title = titleSlug
        .split('-')
        .slice(0, 3)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('.');
      
      return {
        platform: 'Medium',
        author,
        title
      };
    }
  },
  
  twitter: {
    name: 'Twitter/X',
    domains: ['twitter.com', 'x.com', 't.co'],
    regex: /(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/(\d+)/i,
    template: 'X.{Username}.Tweet',
    extract: (url) => {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      const username = pathParts[0];
      const tweetId = pathParts[2];
      
      return {
        platform: 'X',
        username,
        tweetId,
        type: 'Tweet'
      };
    }
  },
  
  linkedin: {
    name: 'LinkedIn',
    domains: ['linkedin.com', 'lnkd.in'],
    regex: /linkedin\.com\/(in|company|pulse)\//i,
    template: 'LinkedIn.{Name}.{Type}',
    extract: (url) => {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      const type = pathParts[0]; // 'in', 'company', 'pulse'
      const name = pathParts[1];
      
      return {
        platform: 'LinkedIn',
        name,
        type: type === 'in' ? 'Profile' : 
              type === 'company' ? 'Company' : 
              'Article'
      };
    }
  },
  
  reddit: {
    name: 'Reddit',
    domains: ['reddit.com', 'redd.it'],
    regex: /reddit\.com\/r\/([a-zA-Z0-9_]+)/i,
    template: 'Reddit.{Subreddit}.{PostTitle}',
    extract: (url) => {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      const subreddit = pathParts[1];
      const postId = pathParts[3];
      const postTitle = pathParts[4];
      
      return {
        platform: 'Reddit',
        subreddit,
        postId,
        title: postTitle ? postTitle.split('-').slice(0, 2).join('.') : 'Post'
      };
    }
  }
};

/**
 * Helper: Extract category from Amazon path
 */
function extractCategory(pathParts) {
  const categoryKeywords = {
    'dp': 'Product',
    'Electronics': 'Electronics',
    'Books': 'Books',
    'Clothing': 'Fashion',
    'Sports': 'Sports',
    'Home': 'Home',
    'Beauty': 'Beauty',
    'Toys': 'Toys'
  };
  
  for (const part of pathParts) {
    if (categoryKeywords[part]) {
      return categoryKeywords[part];
    }
  }
  
  return 'Product';
}

/**
 * Helper: Extract YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Main function: Detect URL pattern and generate smart slug
 */
function detectPattern(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '').replace('m.', '');
    
    // Find matching pattern
    for (const [key, pattern] of Object.entries(patterns)) {
      const domainMatch = pattern.domains.some(d => domain.includes(d));
      const regexMatch = pattern.regex.test(url);
      
      if (domainMatch || regexMatch) {
        console.log(`✅ Pattern matched: ${pattern.name}`);
        
        const extracted = pattern.extract(url);
        const slug = generateSlugFromPattern(extracted, pattern);
        
        return {
          matched: true,
          patternName: pattern.name,
          template: pattern.template,
          extracted,
          suggestedSlug: slug,
          confidence: 'high'
        };
      }
    }
    
    // No pattern matched
    console.log('⚠️  No pattern matched, using generic extraction');
    return {
      matched: false,
      patternName: 'Generic',
      template: '{Domain}.{Path}',
      suggestedSlug: null,
      confidence: 'low'
    };
    
  } catch (error) {
    console.error('Error detecting pattern:', error);
    return {
      matched: false,
      error: error.message
    };
  }
}

/**
 * Generate slug from extracted components
 */
function generateSlugFromPattern(extracted, pattern) {
  const parts = [];
  
  // Add main components
  if (extracted.merchant) parts.push(extracted.merchant);
  if (extracted.platform) parts.push(extracted.platform);
  if (extracted.publication) parts.push(extracted.publication);
  
  // Add secondary components
  if (extracted.product) parts.push(extracted.product);
  if (extracted.username) parts.push(extracted.username);
  if (extracted.author) parts.push(extracted.author);
  if (extracted.channel) parts.push(extracted.channel);
  if (extracted.subreddit) parts.push(extracted.subreddit);
  if (extracted.headline) parts.push(extracted.headline);
  if (extracted.title) parts.push(extracted.title);
  if (extracted.name) parts.push(extracted.name);
  if (extracted.repo) parts.push(extracted.repo);
  
  // Add tertiary components
  if (extracted.category && extracted.category !== 'Product') parts.push(extracted.category);
  if (extracted.type && extracted.type !== 'Video' && extracted.type !== 'Repo') parts.push(extracted.type);
  if (extracted.year) parts.push(extracted.year);
  
  // Join and clean up
  let slug = parts.join('.').substring(0, 50);
  
  // Remove any invalid characters
  slug = slug.replace(/[^a-zA-Z0-9.-]/g, '.');
  slug = slug.replace(/\.{2,}/g, '.');
  slug = slug.replace(/^\.+|\.+$/g, '');
  
  return slug;
}

/**
 * Get list of all supported patterns
 */
function getSupportedPatterns() {
  return Object.entries(patterns).map(([key, pattern]) => ({
    id: key,
    name: pattern.name,
    domains: pattern.domains,
    template: pattern.template
  }));
}

module.exports = {
  detectPattern,
  getSupportedPatterns,
  patterns
};

