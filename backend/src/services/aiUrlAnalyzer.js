/**
 * AI-Powered URL Analyzer using Claude Sonnet 4.5
 * Generates intelligent, semantic short URLs
 */

const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// In-memory cache for AI-generated slugs (use Redis in production)
const slugCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate smart URL slug using Claude AI
 */
async function generateAISlug(url) {
  try {
    console.log('🤖 Claude AI analyzing URL:', url);

    // Check cache first
    const cacheKey = url.toLowerCase().trim();
    if (slugCache.has(cacheKey)) {
      const cached = slugCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('✅ Using cached AI slug:', cached.slug);
        return {
          slug: cached.slug,
          confidence: 'high',
          source: 'cache',
          components: cached.components,
        };
      } else {
        slugCache.delete(cacheKey);
      }
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      temperature: 0.3, // Lower temperature for more consistent results
      messages: [
        {
          role: 'user',
          content: `Analyze this URL and create a short, memorable, human-readable slug.

URL: ${url}

Instructions:
1. Extract the merchant/domain name (e.g., Amazon, BJs, Nike, NYTimes)
2. Identify the main subject (product name, article topic, brand, etc.)
3. Add 1-2 key descriptors if relevant (size, color, model, category)
4. Format as: Merchant.Subject.Descriptor (use PascalCase, no spaces)
5. Keep it under 50 characters total
6. Be concise and meaningful
7. Remove tracking parameters and unnecessary words

Examples:
- https://www.bjs.com/product/harrys-5-blade-razor-handle-value-pack/... → BJs.Harrys.5Blade
- https://www.amazon.com/Echo-Dot-5th-Gen/... → Amazon.Echo.Dot.5thGen
- https://www.nytimes.com/2025/01/15/technology/ai-regulation-congress.html → NYTimes.AI.Regulation.2025

Return ONLY the slug, nothing else. No explanations, no quotes, just the slug.`,
        },
      ],
    });

    // Extract slug from Claude's response
    const aiSlug = message.content[0].text.trim();
    console.log('✨ Claude AI generated slug:', aiSlug);

    // Validate and clean the slug
    let cleanSlug = aiSlug
      .replace(/[^a-zA-Z0-9.]/g, '') // Remove non-alphanumeric except dots
      .replace(/\.+/g, '.') // Remove consecutive dots
      .replace(/^\.+|\.+$/g, ''); // Remove leading/trailing dots

    // Ensure it's under 50 characters
    if (cleanSlug.length > 50) {
      const parts = cleanSlug.split('.');
      cleanSlug = parts.slice(0, 3).join('.').substring(0, 50);
    }

    // Extract components for metadata
    const parts = cleanSlug.split('.');
    const components = {
      merchant: parts[0] || undefined,
      subject: parts[1] || undefined,
      descriptor: parts.slice(2).join('.') || undefined,
    };

    // Cache the result
    slugCache.set(cacheKey, {
      slug: cleanSlug,
      components,
      timestamp: Date.now(),
    });

    return {
      slug: cleanSlug,
      confidence: 'high',
      source: 'ai',
      components,
      aiModel: 'claude-sonnet-4-20250514',
    };
  } catch (error) {
    console.error('❌ Claude AI error:', error.message);

    // Return null to trigger fallback
    return null;
  }
}

/**
 * Fallback regex-based slug generation
 */
function generateFallbackSlug(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    const pathname = urlObj.pathname;

    // Extract domain name
    const domainParts = hostname.split('.');
    const merchant = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);

    // Extract meaningful parts from pathname
    const pathParts = pathname
      .split('/')
      .filter(p => p && p.length > 2 && !/^\d+$/.test(p))
      .slice(0, 3)
      .map(p =>
        p
          .split(/[-_]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join('')
      );

    let slug = [merchant, ...pathParts].join('.').substring(0, 50);

    return {
      slug: slug || `${merchant}.Link`,
      confidence: 'medium',
      source: 'fallback',
      components: {
        merchant,
        subject: pathParts[0] || undefined,
        descriptor: pathParts.slice(1).join('.') || undefined,
      },
    };
  } catch (error) {
    console.error('❌ Fallback generation error:', error);
    return {
      slug: 'Link',
      confidence: 'low',
      source: 'error',
      components: {},
    };
  }
}

/**
 * Generate smart URL with AI (with fallback)
 */
async function generateSmartSlug(url) {
  console.log('🎯 Generating smart slug for:', url);

  // Check if API key is available
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️ No Anthropic API key, using fallback');
    return generateFallbackSlug(url);
  }

  // Try AI generation first
  const aiResult = await generateAISlug(url);

  if (aiResult) {
    return aiResult;
  }

  // Fallback to regex-based generation
  console.log('🔄 Using fallback slug generation');
  return generateFallbackSlug(url);
}

/**
 * Clear cache (for testing/admin)
 */
function clearCache() {
  const size = slugCache.size;
  slugCache.clear();
  console.log(`🗑️ Cleared ${size} cached slugs`);
  return { cleared: size };
}

/**
 * Get cache stats
 */
function getCacheStats() {
  return {
    size: slugCache.size,
    entries: Array.from(slugCache.entries()).map(([url, data]) => ({
      url,
      slug: data.slug,
      age: Math.round((Date.now() - data.timestamp) / 1000 / 60), // minutes
    })),
  };
}

module.exports = {
  generateSmartSlug,
  generateAISlug,
  generateFallbackSlug,
  clearCache,
  getCacheStats,
};

