'use client'

import { useUrls } from '../../../lib/hooks/useUrls'
import { StatCard } from '../../components/cards/StatCard'
import { ClicksChart } from '../../components/charts/ClicksChart'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

export default function OverviewPage() {
  const { data, isLoading, error } = useUrls()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-2">Error loading data</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }

  const urls = data?.urls || []
  const totalClicks = data?.totalClicks || 0
  const avgClicks = urls.length > 0 ? Math.round(totalClicks / urls.length) : 0
  const clickThroughRate = urls.length > 0 ? ((totalClicks / urls.length) * 100).toFixed(1) : '0.0'

  // Generate mock time series data for the last 7 days
  const clicksByDate = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toISOString(),
      clicks: Math.floor(Math.random() * totalClicks / 7) + Math.floor(totalClicks / 14)
    }
  })

  // Top performing URLs
  const topUrls = [...urls]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  // Recent activity
  const recentUrls = [...urls]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
            Dashboard Overview
          </span>
        </h1>
        <p className="text-gray-600">Track your link performance and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total URLs"
          value={urls.length}
          icon="🔗"
          change={`+${urls.filter(u => {
            const created = new Date(u.createdAt)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return created > weekAgo
          }).length} this week`}
          changeType="positive"
        />
        <StatCard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
          icon="📊"
          change={`+${Math.round(totalClicks * 0.15)} this week`}
          changeType="positive"
        />
        <StatCard
          title="Avg Clicks/URL"
          value={avgClicks}
          icon="⚡"
          change={`${clickThroughRate}% CTR`}
          changeType="neutral"
        />
        <StatCard
          title="Active Links"
          value={urls.filter(u => u.clicks > 0).length}
          icon="✨"
          change={`${Math.round((urls.filter(u => u.clicks > 0).length / urls.length) * 100)}% active`}
          changeType="positive"
        />
      </div>

      {/* Clicks Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Clicks Over Time</h2>
          <p className="text-sm text-gray-600">Last 7 days performance</p>
        </div>
        <ClicksChart data={clicksByDate} />
      </motion.div>

      {/* Grid: Top URLs and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing URLs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 Top Performing URLs</h2>
          <div className="space-y-3">
            {topUrls.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No URLs created yet</p>
            ) : (
              topUrls.map((url, index) => (
                <div
                  key={url._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/analytics/${url.shortCode}`}
                        className="font-mono font-semibold text-[#FF6B35] hover:underline block truncate"
                      >
                        {url.shortCode}
                      </Link>
                      <p className="text-xs text-gray-500 truncate">{url.originalUrl}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{url.clicks}</p>
                    <p className="text-xs text-gray-500">clicks</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">🕐 Recent Activity</h2>
          <div className="space-y-3">
            {recentUrls.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              recentUrls.map((url) => (
                <div
                  key={url._id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-2xl">🔗</div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/analytics/${url.shortCode}`}
                      className="font-mono font-semibold text-[#FF6B35] hover:underline block truncate"
                    >
                      {url.shortCode}
                    </Link>
                    <p className="text-xs text-gray-500 truncate">{url.originalUrl}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(url.createdAt), 'MMM dd, yyyy · HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{url.clicks}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Ready to create more links?</h2>
        <p className="mb-6 opacity-90">Start shortening URLs and track your analytics</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/urls"
            className="px-6 py-3 bg-white text-[#FF6B35] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            📊 Manage URLs
          </Link>
          <Link
            href="/widget"
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            🔌 Install Widget
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

