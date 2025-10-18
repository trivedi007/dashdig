'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createShortUrl, CreateUrlRequest } from '@/lib/api';
import QRCode from 'react-qr-code';

interface Props {
  onUrlCreated: (data: any) => void;
}

export default function UrlShortener({ onUrlCreated }: Props) {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [expiryClicks, setExpiryClicks] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);

    try {
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k);

      const requestData: CreateUrlRequest = {
        url: url.trim(),
        keywords: keywordArray,
        expiryClicks,
      };

      if (customSlug.trim()) {
        requestData.customSlug = customSlug.trim();
      }

      // Use demo-url endpoint to get actual API response
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app';
      const response = await fetch(`${API_URL}/demo-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(),
          keywords: keywords ? keywords.split(',').map(k => k.trim()) : []
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create demo URL');
      }

      const apiResponse = await response.json();
      
      // Use the actual API response
      const data = {
        success: apiResponse.success,
        shortUrl: apiResponse.data.shortUrl, // This comes from backend with correct domain
        shortCode: apiResponse.data.slug,
        qrCode: apiResponse.data.qrCode || '',
        originalUrl: url.trim(),
        expiresAfter: apiResponse.data.expiresAfter || 'Never (Demo)',
      };
      
      setResult(data);
      onUrlCreated(data);
      toast.success('Demo link created successfully!');
      
      // Reset form
      setUrl('');
      setKeywords('');
      setCustomSlug('');
      setExpiryClicks(10);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
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
                     focus:border-blue-500 focus:outline-none transition-colors
                     text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                           focus:border-blue-500 focus:outline-none"
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
                           focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom URL (optional)
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2 text-sm">{(process.env.NEXT_PUBLIC_BASE_URL || 'https://dashdig.com').replace('https://', '')}/</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="your.custom.url"
                  pattern="[a-z0-9.]+"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                           focus:border-blue-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for AI-generated URL
              </p>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                   text-white font-semibold rounded-lg hover:from-blue-700 
                   hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transform transition hover:scale-[1.02] active:scale-[0.98]
                   shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" 
                        stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating Dig This!...
            </span>
          ) : (
            'Create Dig This!'
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 
                   rounded-xl border border-green-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            Your Dig This! is Ready!
          </h3>

          <div className="space-y-4">
            {/* Generated URL */}
            <div className="flex items-center justify-between p-4 bg-white 
                          rounded-lg border border-gray-200 shadow-sm">
              <div className="flex-1 mr-4">
                <p className="text-sm text-gray-600 mb-1">Dig This!:</p>
                <p className="font-mono text-lg text-blue-600 break-all">
                  {result.shortUrl}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(result.shortUrl)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg 
                           hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Copy
                </button>
                <button
                  onClick={() => openUrl(result.shortUrl)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg 
                           hover:bg-green-200 transition-colors text-sm font-medium"
                >
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
                  <p className="text-sm font-medium text-orange-600">{result.expiresAfter}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Short Code:</span>
                  <p className="text-sm font-mono text-gray-800">{result.shortCode}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}