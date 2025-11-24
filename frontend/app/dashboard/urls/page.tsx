'use client';

import { useState, useEffect } from 'react';
import { getAllUrls, UrlItem } from '@/lib/api';
import QRCodeSection from '@/app/components/QRCodeSection';
import QRCodeTooltip from '@/app/components/QRCodeTooltip';

export default function UrlsPage() {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<UrlItem | null>(null);
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = async () => {
    try {
      setLoading(true);
      const response = await getAllUrls();
      if (response.success && response.data) {
        setUrls(response.data);
      }
    } catch (error) {
      console.error('Failed to load URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUrls = urls.filter((url) =>
    url.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div id="section-urls" className="section-content p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">URL Management</h2>
            <button className="px-6 py-3 orange-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all tracking-tight">
              <i className="fas fa-plus mr-2"></i>Create New URL
            </button>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search URLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600">Loading URLs...</p>
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No URLs found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Short URL</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Original URL</th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Clicks</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Created</th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUrls.map((url) => {
                      const qrCodeDataUrl = url.qrCode?.dataUrl || url.qrCodeDataUrl || '';
                      return (
                        <tr
                          key={url._id || url.shortCode}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors group relative"
                          onMouseEnter={() => setHoveredUrl(url._id || url.shortCode)}
                          onMouseLeave={() => setHoveredUrl(null)}
                        >
                          <td className="py-4 px-4">
                            <a
                              href={url.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 font-semibold hover:underline"
                            >
                              {url.shortCode}
                            </a>
                            {hoveredUrl === (url._id || url.shortCode) && qrCodeDataUrl && (
                              <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
                                <img
                                  src={qrCodeDataUrl}
                                  alt="QR Code"
                                  className="w-[100px] h-[100px]"
                                />
                                <p className="text-xs text-gray-600 mt-2 font-mono text-center max-w-[100px] truncate">
                                  {url.shortUrl}
                                </p>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className="text-gray-600 text-sm truncate max-w-xs block"
                              title={url.originalUrl}
                            >
                              {url.originalUrl}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-bold text-gray-900">{url.clicks || 0}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {formatDate(url.createdAt)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center space-x-3">
                              <button
                                onClick={() => copyToClipboard(url.shortUrl)}
                                className="text-gray-400 hover:text-orange-600 transition-colors"
                                title="Copy URL"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                              <button
                                onClick={() => setSelectedUrl(url)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit / View QR Code"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredUrls.length} of {urls.length} URLs
                </p>
              </div>
            </>
          )}

          {/* QR Code Section Modal/Expanded View */}
          {selectedUrl && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                  onClick={() => setSelectedUrl(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
                <h3 className="text-xl font-semibold mb-4">URL Details</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Short URL</p>
                  <p className="font-mono text-orange-600">{selectedUrl.shortUrl}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Original URL</p>
                  <p className="text-sm break-all">{selectedUrl.originalUrl}</p>
                </div>
                {selectedUrl._id && (
                  <QRCodeSection
                    urlId={selectedUrl._id}
                    shortUrl={selectedUrl.shortUrl}
                    initialQRCode={selectedUrl.qrCode?.dataUrl || selectedUrl.qrCodeDataUrl}
                    initialCustomizations={selectedUrl.qrCode?.customizations}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
