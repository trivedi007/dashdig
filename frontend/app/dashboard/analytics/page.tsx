'use client'

import Link from 'next/link'
import { useUrls } from '../../../lib/hooks/useUrls'
import { motion } from 'framer-motion'

export default function AnalyticsIndexPage() {
  const { data, isLoading } = useUrls()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35]"></div>
      </div>
    )
  }

  const urls = data?.urls || []
  const urlsWithClicks = urls.filter(url => url.clicks > 0).sort((a, b) => b.clicks - a.clicks)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
            Analytics
          </span>
        </h1>
        <p className="text-gray-600">Select a URL to view detailed analytics</p>
      </div>

      {urlsWithClicks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-12 shadow-md border border-gray-100 text-center"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analytics Yet</h2>
          <p className="text-gray-600 mb-6">
            Create some URLs and get clicks to see analytics data here
          </p>
          <Link
            href="/urls"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Go to URLs
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urlsWithClicks.map((url, index) => (
            <motion.div
              key={url._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/analytics/${url.shortCode}`}
                className="block bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-[#FF6B35] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">📊</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{url.clicks}</div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>
                </div>
                <div className="font-mono font-semibold text-[#FF6B35] group-hover:underline mb-2 truncate">
                  {url.shortCode}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {url.originalUrl}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

