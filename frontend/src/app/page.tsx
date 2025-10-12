'use client';

import { useState } from 'react';
import UrlShortener from '@/components/UrlShortener';
import UrlList from '@/components/UrlList';
import { UrlItem } from '@/lib/api';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [recentUrls, setRecentUrls] = useState<UrlItem[]>([]);

  const handleUrlCreated = (newUrl: any) => {
    // Convert the created URL to UrlItem format
    const urlItem: UrlItem = {
      shortCode: newUrl.shortCode,
      shortUrl: newUrl.shortUrl,
      originalUrl: newUrl.originalUrl,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    
    setRecentUrls(prev => [urlItem, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Dashdig
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI-Powered Human-Readable URLs
          </p>
          <p className="text-lg text-gray-500">
            Transform ugly links into memorable, shareable URLs
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* URL Shortener Component */}
          <UrlShortener onUrlCreated={handleUrlCreated} />

          {/* Recent URLs */}
          {recentUrls.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Recent URLs
              </h2>
              <UrlList urls={recentUrls} />
            </div>
          )}

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Our AI creates human-readable URLs that make sense and are easy to remember
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Fast</h3>
              <p className="text-gray-600">
                Built with enterprise-grade security and lightning-fast redirects
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track clicks, get insights, and optimize your link performance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}