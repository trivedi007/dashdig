'use client';

import { useState } from 'react';
import SmartLinkCreator from '../../src/components/SmartLinkCreator';
import toast, { Toaster } from 'react-hot-toast';

export default function SmartLinkCreatorDemo() {
  const [createdLinks, setCreatedLinks] = useState<any[]>([]);

  const handleCreateLink = (data: { originalUrl: string; slug: string; mode: 'smart' | 'random' }) => {
    console.log('Creating link:', data);
    
    // Add to created links
    const newLink = {
      ...data,
      shortUrl: `https://dashdig.com/${data.slug}`,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };
    
    setCreatedLinks(prev => [newLink, ...prev]);
    
    toast.success(
      <div>
        <div className="font-bold">Link Created! 🎉</div>
        <div className="text-sm">dashdig.com/{data.slug}</div>
      </div>,
      { duration: 4000 }
    );
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            ⚡ Smart Link Creator
          </h1>
          <p className="text-xl text-orange-100">
            Create beautiful, memorable links powered by AI
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Creator Component */}
        <div className="mb-12">
          <SmartLinkCreator onCreateLink={handleCreateLink} />
        </div>

        {/* Created Links */}
        {createdLinks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📋 Your Created Links ({createdLinks.length})
            </h2>
            
            <div className="grid gap-4">
              {createdLinks.map((link, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-orange-300 transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Short URL */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl font-bold text-orange-600 truncate">
                          dashdig.com/{link.slug}
                        </div>
                        {link.mode === 'smart' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                            ⚡ Smart
                          </span>
                        )}
                      </div>

                      {/* Original URL */}
                      <div className="text-sm text-gray-500 truncate mb-2">
                        → {link.originalUrl}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>👁️ {link.clicks} clicks</span>
                        <span>🕐 {new Date(link.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => copyToClipboard(link.shortUrl)}
                        className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-sm whitespace-nowrap"
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={() => window.open(link.shortUrl, '_blank')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
                      >
                        🔗 Visit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border-2 border-purple-200">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-purple-900 mb-3">
              AI-Powered Intelligence
            </h3>
            <p className="text-purple-700 mb-4">
              Our Smart Links use Claude Sonnet 4.5 to analyze URLs and generate human-readable slugs that actually mean something.
            </p>
            <ul className="space-y-2 text-sm text-purple-600">
              <li>✓ Extracts merchant and product info</li>
              <li>✓ Creates memorable, semantic slugs</li>
              <li>✓ Caches results for instant generation</li>
              <li>✓ Falls back to regex if AI unavailable</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border-2 border-orange-200">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-orange-900 mb-3">
              Beautiful UX
            </h3>
            <p className="text-orange-700 mb-4">
              Live preview, instant editing, collision detection, and smooth animations make link creation a joy.
            </p>
            <ul className="space-y-2 text-sm text-orange-600">
              <li>✓ Real-time slug generation</li>
              <li>✓ Inline editing with validation</li>
              <li>✓ Automatic collision checking</li>
              <li>✓ Smart/Random mode toggle</li>
            </ul>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-16 bg-white rounded-2xl p-8 border-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            📚 Example Transformations
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Original URL:</div>
              <div className="text-sm text-gray-700 mb-2 truncate">
                https://www.amazon.com/Echo-Dot-5th-Gen-Smart-speaker-Charcoal/dp/B09B8V1LZ3
              </div>
              <div className="text-xs text-gray-500 mb-1">Smart Link:</div>
              <div className="text-lg font-bold text-orange-600">
                dashdig.com/Amazon.Echo.Dot.5thGen
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Original URL:</div>
              <div className="text-sm text-gray-700 mb-2 truncate">
                https://www.bjs.com/product/harrys-5-blade-razor-handle-value-pack/3000000000003879255
              </div>
              <div className="text-xs text-gray-500 mb-1">Smart Link:</div>
              <div className="text-lg font-bold text-orange-600">
                dashdig.com/BJs.Harrys.5Blade
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Original URL:</div>
              <div className="text-sm text-gray-700 mb-2 truncate">
                https://www.nytimes.com/2025/01/15/technology/ai-regulation-congress.html
              </div>
              <div className="text-xs text-gray-500 mb-1">Smart Link:</div>
              <div className="text-lg font-bold text-orange-600">
                dashdig.com/NYTimes.AI.Regulation.2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

