'use client'

import { use } from 'react'
import { useUrlAnalytics } from '../../../../lib/hooks/useUrls'
import { ClicksChart } from '../../../components/charts/ClicksChart'
import { DeviceChart } from '../../../components/charts/DeviceChart'
import { BrowserChart } from '../../../components/charts/BrowserChart'
import { PageHeader } from '../../../components/PageHeader'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AnalyticsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const { data, isLoading, error } = useUrlAnalytics(resolvedParams.slug)

  const handleExport = () => {
    if (!data) return
    
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
    
    toast.success('Analytics data exported')
  }

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

  if (error || !data) {
    return (
      <div>
        <PageHeader
          title="Analytics Not Available"
          description="This URL may not have any analytics data yet"
          icon="fa-chart-bar"
          breadcrumbs={[
            { label: 'Dashboard', href: '/overview' },
            { label: 'Analytics', href: '/analytics' },
            { label: resolvedParams.slug }
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-chart-bar text-red-600 text-3xl"></i>
            </div>
            <p className="text-xl font-bold text-slate-900 mb-2">Analytics not available</p>
            <p className="text-slate-600 mb-6">This URL may not have any analytics data yet</p>
            <Link
              href="/urls"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-sm"
            >
              <i className="fas fa-arrow-left"></i>
              Back to URLs
            </Link>
          </div>
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
    <div>
      <PageHeader
        title={`Analytics: ${resolvedParams.slug}`}
        description="Detailed analytics for this URL"
        icon="fa-chart-line"
        breadcrumbs={[
          { label: 'Dashboard', href: '/overview' },
          { label: 'Analytics', href: '/analytics' },
          { label: resolvedParams.slug }
        ]}
        actions={
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#3bb5b0] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-sm"
          >
            <i className="fas fa-download"></i>
            Export Data
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-mouse-pointer text-[#FF6B35] text-xl"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{data.totalClicks}</div>
              <div className="text-sm text-slate-600">Total Clicks</div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{data.uniqueVisitors || data.totalClicks}</div>
              <div className="text-sm text-slate-600">Unique Visitors</div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-globe text-green-600 text-xl"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {Object.keys(data.countries || {}).length}
              </div>
              <div className="text-sm text-slate-600">Countries</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Clicks Over Time */}
      {data.clicksByDate && data.clicksByDate.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-chart-line text-[#FF6B35]"></i>
            Clicks Over Time
          </h2>
          <ClicksChart data={data.clicksByDate} />
        </motion.div>
      )}

      {/* Device and Browser Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {data.devices && Object.keys(data.devices).length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-mobile-alt text-[#4ECDC4]"></i>
              Device Breakdown
            </h2>
            <DeviceChart data={data.devices} />
          </motion.div>
        )}

        {data.browsers && Object.keys(data.browsers).length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-browser text-[#8B5CF6]"></i>
              Browser Distribution
            </h2>
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
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-globe-americas text-[#10B981]"></i>
              Top Countries
            </h2>
            <div className="space-y-3">
              {topCountries.map(([country, clicks], index) => (
                <div key={country} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                    <span className="font-medium text-slate-900">{country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{clicks}</div>
                    <div className="text-xs text-slate-500">
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
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-external-link-alt text-[#0066FF]"></i>
              Top Referrers
            </h2>
            <div className="space-y-3">
              {topReferrers.map(([referrer, clicks], index) => (
                <div key={referrer} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                    <span className="font-medium text-slate-900 truncate">
                      {referrer === 'direct' ? 'Direct Traffic' : referrer}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{clicks}</div>
                    <div className="text-xs text-slate-500">
                      {((clicks / data.totalClicks) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

