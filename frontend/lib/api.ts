const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';

export interface ShortenUrlResponse {
  shortUrl: string;
  shortCode: string;
  slug?: string; // Alias for shortCode for compatibility
  originalUrl: string;
  qrCode?: string | null;
  createdAt?: string;
  expiresAt?: string | null;
}

export interface ApiError {
  error: string;
  message?: string;
}

export const api = {
  // Shorten URL
  async shortenUrl(url: string, customSlug?: string): Promise<ShortenUrlResponse> {
    const response = await fetch(`${API_URL}/api/shorten`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Add a demo API key for unauthenticated shortening
        'Authorization': 'Bearer demo-api-key'
      },
      body: JSON.stringify({ url, customSlug }),
    });
    
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ 
        error: 'Failed to shorten URL',
        message: `HTTP ${response.status}` 
      }));
      throw new Error(error.message || error.error || 'Failed to shorten URL');
    }
    
    const data = await response.json();
    
    // Normalize response to include slug alias for compatibility
    return {
      ...data,
      slug: data.shortCode || data.slug,
    };
  },
  
  // Check slug availability
  async checkSlug(slug: string): Promise<{ available: boolean; slug: string; message: string; suggestions?: Array<{ slug: string; type: string; available: boolean }> }> {
    const response = await fetch(`${API_URL}/api/slug/check/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ 
        error: 'Failed to check slug',
        message: `HTTP ${response.status}` 
      }));
      throw new Error(error.message || error.error || 'Failed to check slug');
    }
    
    return response.json();
  },
  
  // Get user's URLs (with auth token)
  async getUrls(token: string) {
    const response = await fetch(`${API_URL}/api/urls`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ 
        error: 'Failed to fetch URLs',
        message: `HTTP ${response.status}` 
      }));
      throw new Error(error.message || error.error || 'Failed to fetch URLs');
    }
    
    return response.json();
  },
  
  // Get URL analytics
  async getAnalytics(id: string, token: string) {
    const response = await fetch(`${API_URL}/api/analytics/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ 
        error: 'Failed to fetch analytics',
        message: `HTTP ${response.status}` 
      }));
      throw new Error(error.message || error.error || 'Failed to fetch analytics');
    }
    
    return response.json();
  },
};

