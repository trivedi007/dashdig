'use client'

import { useUrls, useDeleteUrl } from '../../../lib/hooks/useUrls'
import { UrlTable } from '../../components/tables/UrlTable'
import { PageHeader } from '../../components/PageHeader'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function UrlsPage() {
  const { data, isLoading, error } = useUrls()
  const deleteUrl = useDeleteUrl()

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl.mutateAsync(id)
      toast.success('URL deleted successfully')
    } catch (err) {
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
    
    toast.success('CSV exported successfully')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your URLs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <p className="text-xl font-bold text-slate-900 mb-2">Error loading URLs</p>
          <p className="text-slate-600">Please try again later</p>
        </div>
      </div>
    )
  }

  const urls = data?.urls || []

  return (
    <div>
      <PageHeader
        title="URL Management"
        description="Manage and track all your shortened URLs"
        icon="fa-link"
        breadcrumbs={[
          { label: 'Dashboard', href: '/overview' },
          { label: 'URLs' }
        ]}
        actions={
          <button
            onClick={handleExport}
            disabled={urls.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#3bb5b0] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-download"></i>
            Export CSV
          </button>
        }
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-link text-[#FF6B35] text-xl"></i>
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
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
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
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-mouse-pointer text-blue-600 text-xl"></i>
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
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <UrlTable
          urls={urls}
          onDelete={handleDelete}
          isDeleting={deleteUrl.isPending}
        />
      </motion.div>
    </div>
  )
}





