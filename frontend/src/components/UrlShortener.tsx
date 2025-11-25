'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { createShortUrl, CreateUrlRequest } from '@/lib/api';
import QRCode from 'react-qr-code';
import SuggestionCarousel, { Suggestion } from './SuggestionCarousel';
import { ArrowLeft, Copy, ExternalLink, BarChart3, Plus } from 'lucide-react';

// API Base URL for backend calls
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app';
const SHORT_URL_BASE = (process.env.NEXT_PUBLIC_SHORT_URL_BASE || 'https://dashdig.com').replace(/\/$/, '');

interface Props {
  onUrlCreated: (data: any) => void;
}

type Step = 'input' | 'suggestions' | 'success';

export default function UrlShortener({ onUrlCreated }: Props) {
  // Step management
  const [step, setStep] = useState<Step>('input');
  
  // Form inputs
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [expiryClicks, setExpiryClicks] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Suggestions flow
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [customSlug, setCustomSlug] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // URL creation
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
    
  // Fetch suggestions from API
  const fetchSuggestions = async (inputUrl: string) => {
    if (!inputUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(inputUrl);
    } catch {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k);

      const response = await fetch(`${API_BASE}/api/suggestions/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: inputUrl.trim(),
          keywords: keywordArray,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data?.suggestions) {
        setSuggestions(data.data.suggestions);
        setStep('suggestions');
        toast.success(`Generated ${data.data.suggestions.length} suggestions!`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Failed to fetch suggestions:', error);
      toast.error('Failed to generate suggestions. Using fallback...');
      // Fallback: proceed with single suggestion flow
      handleCreateUrlDirectly(inputUrl);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelect = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setCustomSlug(''); // Clear custom slug when selecting a suggestion
  };

  // Handle feedback submission
  const submitFeedback = async (suggestionId: string, vote: 'up' | 'down') => {
    try {
      // Get or create session ID for anonymous tracking
      let sessionId = sessionStorage.getItem('dashdig_session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('dashdig_session_id', sessionId);
      }

      // Get user ID if authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let userId = null;
      if (token) {
        try {
          // Decode JWT to get user ID (simple decode, not verification)
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.userId || payload.id || null;
        } catch (e) {
          // Ignore decode errors
        }
      }

      await fetch(`${API_BASE}/api/suggestions/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestionId,
          vote,
          originalUrl: url,
          allSuggestions: suggestions,
          userId,
          sessionId,
          metadata: {
            pageTitle: document.title,
            generationTime: 0, // Could track this if needed
          },
        }),
      });
    } catch (error) {
      console.error('Feedback submission failed:', error);
      // Non-blocking - don't show error to user
    }
  };

  // Handle regenerate
  const handleRegenerate = () => {
    fetchSuggestions(url);
  };

  // Handle custom slug
  const handleCustomSlug = (slug: string) => {
    setCustomSlug(slug);
    setSelectedSuggestion(null); // Clear selected suggestion when using custom slug
  };

  // Create URL with selected suggestion or custom slug
  const handleCreateUrl = async () => {
    const slugToUse = customSlug.trim() || selectedSuggestion?.slug;
    
    if (!slugToUse) {
      toast.error('Please select a suggestion or enter a custom slug');
      return;
    }

    // Submit "selected" feedback if a suggestion was chosen
    if (selectedSuggestion) {
      try {
        let sessionId = sessionStorage.getItem('dashdig_session_id');
        if (!sessionId) {
          sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('dashdig_session_id', sessionId);
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        let userId = null;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.userId || payload.id || null;
          } catch (e) {
            // Ignore decode errors
          }
        }

        // Submit selection feedback (non-blocking)
        fetch(`${API_BASE}/api/suggestions/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            suggestionId: selectedSuggestion.id,
            vote: 'selected',
            originalUrl: url,
            allSuggestions: suggestions,
            userId,
            sessionId,
            metadata: {
              pageTitle: document.title,
            },
          }),
        }).catch(error => {
          console.error('Failed to submit selection feedback:', error);
        });
      } catch (error) {
        // Ignore errors - non-blocking
      }
    }

    await createShortUrlWithSlug(url, slugToUse, selectedSuggestion?.id);
  };

  // Fallback: Create URL directly (bypass suggestions)
  const handleCreateUrlDirectly = async (inputUrl: string) => {
    setLoading(true);
    try {
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k);

      const requestData: CreateUrlRequest = {
        url: inputUrl.trim(),
        keywords: keywordArray,
        expiryClicks,
      };

      const apiResponse = await createShortUrl(requestData);
      
      const data = {
        success: apiResponse.success,
        shortUrl: apiResponse.shortUrl,
        shortCode: apiResponse.shortCode,
        qrCode: apiResponse.qrCode || '',
        originalUrl: inputUrl.trim(),
        expiresAfter: apiResponse.expiresAfter || 'Never',
      };
      
      setResult(data);
      setStep('success');
      onUrlCreated(data);
      toast.success('Link created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  // Create URL with specific slug
  const createShortUrlWithSlug = async (inputUrl: string, slug: string, suggestionId?: string) => {
    setLoading(true);
    try {
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k);

      const requestData: CreateUrlRequest = {
        url: inputUrl.trim(),
        keywords: keywordArray,
        expiryClicks,
        customSlug: slug,
      };

      const apiResponse = await createShortUrl(requestData);
      
      const data = {
        success: apiResponse.success,
        shortUrl: apiResponse.shortUrl,
        shortCode: apiResponse.shortCode,
        qrCode: apiResponse.qrCode || '',
        originalUrl: inputUrl.trim(),
        expiresAfter: apiResponse.expiresAfter || 'Never',
        suggestionId, // Track which suggestion was used
      };
      
      setResult(data);
      setStep('success');
      onUrlCreated(data);
      toast.success('Link created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (Step 1: Input)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchSuggestions(url);
  };

  // Reset to start over
  const handleReset = () => {
    setStep('input');
    setSuggestions([]);
    setSelectedSuggestion(null);
    setCustomSlug('');
    setResult(null);
    setUrl('');
    setKeywords('');
    setExpiryClicks(10);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Step 1: Input */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main URL Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter your long URL
          </label>
          <input
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url-that-needs-shortening"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                           focus:border-dashdig-orange focus:outline-none transition-colors
                     text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-dashdig-orange hover:text-[#E85A2A] font-medium"
        >
          {showAdvanced ? '▼ Hide' : '▶ Show'} Advanced Options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 border-t pt-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="gift, electronics, apple"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                 focus:border-dashdig-orange focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Help AI generate better URLs with relevant keywords
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry after clicks
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={expiryClicks}
                  onChange={(e) => setExpiryClicks(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                 focus:border-dashdig-orange focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
                disabled={isLoadingSuggestions}
                className="w-full py-4 bg-gradient-to-r from-dashdig-orange to-[#FF8C5C] 
                         text-white font-semibold rounded-lg hover:from-[#E85A2A] 
                         hover:to-[#E87A4C] disabled:opacity-50 disabled:cursor-not-allowed
                   transform transition hover:scale-[1.02] active:scale-[0.98]
                         shadow-lg flex items-center justify-center gap-2"
              >
                {isLoadingSuggestions ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" 
                        stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
                    Generating suggestions...
                  </>
          ) : (
                  <>
                    <span>⚡</span>
                    Dig This!
                  </>
          )}
        </button>
      </form>
          </motion.div>
        )}

        {/* Step 2: Suggestions */}
        {step === 'suggestions' && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={() => setStep('input')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to URL input</span>
            </button>

            {/* Suggestion Carousel */}
            <SuggestionCarousel
              suggestions={suggestions}
              originalUrl={url}
              isLoading={isLoadingSuggestions}
              onSelect={handleSelect}
              onFeedback={submitFeedback}
              onRegenerate={handleRegenerate}
              onCustomSlug={handleCustomSlug}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setStep('input')}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleCreateUrl}
                disabled={!selectedSuggestion && !customSlug.trim() || loading}
                className="flex-1 px-4 py-2.5 bg-dashdig-orange text-white rounded-md hover:bg-[#E85A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>Create Link</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center">
        <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-3xl">✅</span>
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Link Humanized!
          </h3>
              <p className="text-gray-600">
                Your link is ready to share
              </p>
            </div>

            {/* Generated URL */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 
                         rounded-xl border border-green-200">
            <div className="flex items-center justify-between p-4 bg-white 
                            rounded-lg border border-gray-200 shadow-sm mb-4">
                <div className="flex-1 mr-4 min-w-0">
                  <p className="text-sm text-gray-600 mb-1">Your Short URL:</p>
                  <p className="font-mono text-lg text-dashdig-orange break-all">
                  {result.shortUrl}
                </p>
              </div>
                <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => copyToClipboard(result.shortUrl)}
                    className="px-4 py-2 bg-dashdig-orange text-white rounded-lg 
                             hover:bg-[#E85A2A] transition-colors text-sm font-medium flex items-center gap-2"
                    title="Copy to clipboard"
                >
                    <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => openUrl(result.shortUrl)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg 
                             hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-2"
                    title="Test link"
                >
                    <ExternalLink className="w-4 h-4" />
                  Test
                </button>
              </div>
            </div>

            {/* QR Code and Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">QR Code</p>
                <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                  <QRCode value={result.shortUrl} size={150} />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 font-medium">Original URL:</span>
                  <p className="text-sm text-gray-800 break-all">{result.originalUrl}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Expires after:</span>
                    <p className="text-sm font-medium text-dashdig-orange">{result.expiresAfter}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Short Code:</span>
                  <p className="text-sm font-mono text-gray-800">{result.shortCode}</p>
                </div>
              </div>
            </div>
          </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => window.open(`/dashboard/analytics/${result.shortCode}`, '_blank')}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 bg-dashdig-orange text-white rounded-md hover:bg-[#E85A2A] transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Link
              </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
