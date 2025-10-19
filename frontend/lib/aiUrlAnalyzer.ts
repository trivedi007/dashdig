/**
 * AI URL Analyzer - Frontend client for Claude-powered smart URL generation
 */

export interface AISlugResult {
  slug: string;
  confidence: 'high' | 'medium' | 'low';
  source: 'ai' | 'cache' | 'fallback' | 'error';
  components: {
    merchant?: string;
    subject?: string;
    descriptor?: string;
  };
  aiModel?: string;
  error?: string;
}

/**
 * Generate AI-powered smart slug via backend API
 */
export async function generateAISmartSlug(url: string): Promise<AISlugResult> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api';
    
    const response = await fetch(`${API_BASE}/smart-url/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.error('❌ AI slug generation failed:', error);
    
    // Return error result
    return {
      slug: 'Link',
      confidence: 'low',
      source: 'error',
      components: {},
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate AI slugs for multiple URLs (batch)
 */
export async function generateAISmartSlugBatch(urls: string[]): Promise<AISlugResult[]> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api';
    
    const response = await fetch(`${API_BASE}/smart-url/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: urls.slice(0, 10) }), // Max 10
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.error('❌ Batch AI slug generation failed:', error);
    
    // Return error results for all URLs
    return urls.map(() => ({
      slug: 'Link',
      confidence: 'low' as const,
      source: 'error' as const,
      components: {},
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api';
    
    const response = await fetch(`${API_BASE}/smart-url/cache/stats`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('❌ Failed to get cache stats:', error);
    return null;
  }
}

/**
 * Clear the cache
 */
export async function clearCache() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api';
    
    const response = await fetch(`${API_BASE}/smart-url/cache`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
    return null;
  }
}

