const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';

export const api = {
  // Shorten URL
  async shortenUrl(url: string, customSlug?: string) {
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
      const error = await response.json().catch(() => ({ message: 'Failed to shorten URL' }));
      throw new Error(error.message || error.error || 'Failed to shorten URL');
    }
    
    return response.json();
  },
  
  // Get user's URLs (with auth token)
  async getUrls(token: string) {
    const response = await fetch(`${API_URL}/api/urls`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch URLs' }));
      throw new Error(error.message || 'Failed to fetch URLs');
    }
    
    return response.json();
  },
  
  // Get URL analytics
  async getAnalytics(id: string, token: string) {
    const response = await fetch(`${API_URL}/api/analytics/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch analytics' }));
      throw new Error(error.message || 'Failed to fetch analytics');
    }
    
    return response.json();
  },
};

