/**
 * Example usage of SuggestionCarousel component
 * 
 * This shows how to integrate the carousel into a URL creation modal/form
 */

'use client';

import { useState } from 'react';
import SuggestionCarousel, { Suggestion } from './SuggestionCarousel';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app';

export default function UrlCreationModal() {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  // Fetch suggestions from API
  const fetchSuggestions = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/suggestions/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          keywords: keywords,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data.suggestions || []);
      } else {
        console.error('Failed to fetch suggestions');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSelect = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    console.log('Selected suggestion:', suggestion);
  };

  // Handle feedback
  const handleFeedback = async (suggestionId: string, vote: 'up' | 'down') => {
    // TODO: Send feedback to API endpoint
    console.log('Feedback:', { suggestionId, vote });
    // Example: await fetch(`${API_BASE}/api/suggestions/feedback`, { ... });
  };

  // Handle regenerate
  const handleRegenerate = () => {
    fetchSuggestions();
  };

  // Handle custom slug
  const handleCustomSlug = (slug: string) => {
    console.log('Custom slug:', slug);
    // Create URL with custom slug
  };

  // Create URL with selected suggestion
  const handleCreateUrl = async () => {
    if (!selectedSuggestion) return;

    try {
      const response = await fetch(`${API_BASE}/api/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalUrl: url,
          shortCode: selectedSuggestion.slug,
          keywords: keywords,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('URL created:', data);
        // Handle success (show success message, redirect, etc.)
      }
    } catch (error) {
      console.error('Error creating URL:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Short URL</h2>
      
      {/* URL Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Original URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Keywords Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Keywords (optional)</label>
        <input
          type="text"
          value={keywords.join(', ')}
          onChange={(e) => setKeywords(e.target.value.split(',').map(k => k.trim()).filter(k => k))}
          placeholder="keyword1, keyword2, keyword3"
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={fetchSuggestions}
        disabled={!url.trim() || isLoading}
        className="mb-6 px-6 py-2 bg-dashdig-orange text-white rounded-md hover:bg-[#E85A2A] disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate Suggestions'}
      </button>

      {/* Suggestion Carousel */}
      {suggestions.length > 0 && (
        <SuggestionCarousel
          suggestions={suggestions}
          originalUrl={url}
          isLoading={isLoading}
          onSelect={handleSelect}
          onFeedback={handleFeedback}
          onRegenerate={handleRegenerate}
          onCustomSlug={handleCustomSlug}
        />
      )}

      {/* Create URL Button */}
      {selectedSuggestion && (
        <button
          onClick={handleCreateUrl}
          className="mt-6 w-full px-6 py-3 bg-dashdig-orange text-white rounded-md hover:bg-[#E85A2A] font-semibold"
        >
          Create URL with Selected Suggestion
        </button>
      )}
    </div>
  );
}

