'use client'

import { useUrls, useDeleteUrl } from '../../../lib/hooks/useUrls'
import { UrlTable } from '../../components/tables/UrlTable'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import './fix-overlay.css'

export default function UrlsPage() {
  const { data, isLoading, error } = useUrls()
  const deleteUrl = useDeleteUrl()

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl.mutateAsync(id)
      toast.success('URL deleted successfully')
    } catch {
      toast.error('Failed to delete URL')
    }
  }

  const handleExport = () => {
    if (!data?.urls) return

    const csv = [
      ['Slug', 'Original URL', 'Clicks', 'Created At'],
      ...data.urls.map(url => [
        url.shortCode,
        url.originalUrl,
        url.clicks.toString(),
        new Date(url.createdAt).toISOString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashdig-urls-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
          <p className="text-2xl font-bold text-red-600 mb-2">Error loading URLs</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }

  const urls = data?.urls || []

  return (
    <div className="relative max-w-7xl mx-auto z-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                URL Management
              </h1>
              <p className="text-base text-slate-600">Manage and track all your shortened URLs</p>
            </div>
            <button
              onClick={handleExport}
              disabled={urls.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF6B35]"
            >
              <span>📥</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-2xl">
                🔗
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{urls.length}</div>
                <div className="text-sm text-slate-600">Total URLs</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
                ✨
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {urls.filter(u => u.clicks > 0).length}
                </div>
                <div className="text-sm text-slate-600">Active URLs</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                📊
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{data?.totalClicks || 0}</div>
                <div className="text-sm text-slate-600">Total Clicks</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* URL Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <UrlTable
            urls={urls}
            onDelete={handleDelete}
            isDeleting={deleteUrl.isPending}
          />
        </motion.div>
      </div>
    </div>
  )
}
