'use client'

import Link from 'next/link'
import { useUrls } from '../../../lib/hooks/useUrls'
import { PageHeader } from '../../components/PageHeader'
import { motion } from 'framer-motion'

export default function AnalyticsIndexPage() {
  const { data, isLoading } = useUrls()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const urls = data?.urls || []
  const urlsWithClicks = urls.filter(url => url.clicks > 0).sort((a, b) => b.clicks - a.clicks)

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Select a URL to view detailed analytics"
        icon="fa-chart-bar"
        breadcrumbs={[
          { label: 'Dashboard', href: '/overview' },
          { label: 'Analytics' }
        ]}
      />

      {urlsWithClicks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-chart-bar text-slate-400 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Analytics Yet</h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Create some URLs and get clicks to see analytics data here
          </p>
          <Link
            href="/urls"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-sm"
          >
            <i className="fas fa-link"></i>
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
                className="block bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#FF6B35] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-line text-white text-xl"></i>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{url.clicks.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">clicks</div>
                  </div>
                </div>
                <div className="font-mono font-semibold text-[#FF6B35] group-hover:underline mb-2 truncate">
                  {url.shortCode}
                </div>
                <div className="text-sm text-slate-500 truncate">
                  {url.originalUrl}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[#FF6B35] font-medium flex items-center gap-1">
                    View details
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}










