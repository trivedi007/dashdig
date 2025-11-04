'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useUrls } from '../../../lib/hooks/useUrls'

export default function AnalyticsIndexPage() {
  const { data, isLoading, error } = useUrls()

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#FF6B35] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-lg font-semibold text-red-600">Unable to load analytics.</p>
          <p className="mt-2 text-sm text-red-500">Please refresh the page or try again shortly.</p>
        </div>
      </div>
    )
  }

  const urls = data?.urls ?? []
  const urlsWithClicks = urls.filter(url => url.clicks > 0).sort((a, b) => b.clicks - a.clicks)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Analytics
          </h1>
          <p className="text-base text-slate-600">Select a link to dive into granular metrics.</p>
        </div>

        {urlsWithClicks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-slate-300 bg-white px-10 py-16 text-center"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-slate-900">No analytics yet</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">Create short links and drive traffic to start collecting insights.</p>
            <Link
              href="/dashboard/urls"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FF6B35] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E85A2A]"
            >
              Create your first link →
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {urlsWithClicks.map((url, index) => (
              <motion.div
                key={url._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                className="h-full"
              >
                <div className="flex flex-col h-full rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                      <i className="fas fa-chart-line text-[#FF6B35] text-xl"></i>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#FF6B35]" style={{ fontSize: '24px', fontWeight: 700 }}>{url.clicks.toLocaleString()}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">clicks</p>
                    </div>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="mt-4 flex-1">
                    <p className="truncate font-mono text-sm font-bold text-slate-900" title={url.shortCode}>
                      {url.shortCode}
                    </p>
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block truncate text-xs text-slate-500 hover:text-[#FF6B35] transition-colors font-medium"
                      title={url.originalUrl}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {url.originalUrl}
                    </a>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link
                      href={`/analytics/${url.shortCode}`}
                      className="flex-1 text-center px-3 py-2 border-2 border-[#FF6B35] text-[#FF6B35] text-xs font-semibold rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors"
                    >
                      View Report
                    </Link>
                    <Link
                      href={`/analytics/${url.shortCode}`}
                      className="flex items-center gap-1 text-xs font-medium text-[#FF6B35] hover:text-[#E85A2A] transition-colors"
                    >
                      Insights
                      <i className="fas fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
