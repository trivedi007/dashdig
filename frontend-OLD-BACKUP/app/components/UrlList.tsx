'use client';

import { UrlItem } from '@/lib/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Props {
  urls: UrlItem[];
}

export default function UrlList({ urls }: Props) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {urls.map((url, index) => (
        <motion.div
          key={url.shortCode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm 
                   hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Short URL */}
              <div className="flex items-center mb-2">
                <span className="font-mono text-blue-600 font-medium mr-3">
                  {url.shortCode}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
                </span>
              </div>

              {/* Original URL */}
              <p className="text-gray-600 text-sm truncate mb-2" title={url.originalUrl}>
                {url.originalUrl}
              </p>

              {/* Metadata */}
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                <span>Created {formatDate(url.createdAt)}</span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  {url.shortUrl}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => copyToClipboard(url.shortUrl)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded 
                         hover:bg-gray-200 transition-colors font-medium"
                title="Copy short URL"
              >
                Copy
              </button>
              <button
                onClick={() => openUrl(url.shortUrl)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded 
                         hover:bg-blue-200 transition-colors font-medium"
                title="Test redirect"
              >
                Test
              </button>
              <button
                onClick={() => openUrl(url.originalUrl)}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded 
                         hover:bg-green-200 transition-colors font-medium"
                title="Open original URL"
              >
                Original
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}