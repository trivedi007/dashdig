'use client'

import { use } from 'react'
import { useUrlAnalytics } from '../../../../lib/hooks/useUrls'
import { ClicksChart } from '../../../components/charts/ClicksChart'
import { DeviceChart } from '../../../components/charts/DeviceChart'
import { BrowserChart } from '../../../components/charts/BrowserChart'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AnalyticsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const { data, isLoading, error } = useUrlAnalytics(resolvedParams.slug)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35]"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-2">Analytics not available</p>
          <p className="text-gray-600 mb-4">This URL may not have any analytics data yet</p>
          <Link
            href="/urls"
            className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg hover:opacity-90 transition-opacity font-medium inline-block"
          >
            Back to URLs
          </Link>
        </div>
      </div>
    )
  }

  const topCountries = Object.entries(data.countries || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const topReferrers = Object.entries(data.referrers || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/urls" className="text-[#FF6B35] hover:underline mb-2 inline-block">
          ← Back to URLs
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
            Analytics: {resolvedParams.slug}
          </span>
        </h1>
        <p className="text-gray-600">Detailed analytics for this URL</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-gray-900">{data.totalClicks}</div>
          <div className="text-sm text-gray-600">Total Clicks</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-2">👥</div>
          <div className="text-3xl font-bold text-gray-900">{data.uniqueVisitors || data.totalClicks}</div>
          <div className="text-sm text-gray-600">Unique Visitors</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-2">🌍</div>
          <div className="text-3xl font-bold text-gray-900">
            {Object.keys(data.countries || {}).length}
          </div>
          <div className="text-sm text-gray-600">Countries</div>
        </motion.div>
      </div>

      {/* Clicks Over Time */}
      {data.clicksByDate && data.clicksByDate.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Clicks Over Time</h2>
          <ClicksChart data={data.clicksByDate} />
        </motion.div>
      )}

      {/* Device and Browser Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.devices && Object.keys(data.devices).length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">📱 Device Breakdown</h2>
            <DeviceChart data={data.devices} />
          </motion.div>
        )}

        {data.browsers && Object.keys(data.browsers).length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">🌐 Browser Distribution</h2>
            <BrowserChart data={data.browsers} />
          </motion.div>
        )}
      </div>

      {/* Geographic and Referrer Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        {topCountries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">🌍 Top Countries</h2>
            <div className="space-y-3">
              {topCountries.map(([country, clicks], index) => (
                <div key={country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-medium text-gray-900">{country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{clicks}</div>
                    <div className="text-xs text-gray-500">
                      {((clicks / data.totalClicks) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Referrers */}
        {topReferrers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Top Referrers</h2>
            <div className="space-y-3">
              {topReferrers.map(([referrer, clicks], index) => (
                <div key={referrer} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-medium text-gray-900 truncate">
                      {referrer === 'direct' ? 'Direct Traffic' : referrer}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{clicks}</div>
                    <div className="text-xs text-gray-500">
                      {((clicks / data.totalClicks) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Export Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <button
          onClick={() => {
            const exportData = JSON.stringify(data, null, 2)
            const blob = new Blob([exportData], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `analytics-${resolvedParams.slug}-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }}
          className="px-6 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#3bb5b0] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          📥 Export Analytics Data
        </button>
      </motion.div>
    </div>
  )
}

