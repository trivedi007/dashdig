'use client'

import { useState } from 'react'
import { useUrls, useDeleteUrl } from '../../../lib/hooks/useUrls'
import { UrlTable } from '../../components/tables/UrlTable'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
              URL Management
            </span>
          </h1>
          <p className="text-gray-600">Manage and track all your shortened URLs</p>
        </div>
        <button
          onClick={handleExport}
          disabled={urls.length === 0}
          className="px-6 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#3bb5b0] text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-2">🔗</div>
          <div className="text-3xl font-bold text-gray-900">{urls.length}</div>
          <div className="text-sm text-gray-600">Total URLs</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-2">✨</div>
          <div className="text-3xl font-bold text-gray-900">
            {urls.filter(u => u.clicks > 0).length}
          </div>
          <div className="text-sm text-gray-600">Active URLs</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-gray-900">{data?.totalClicks || 0}</div>
          <div className="text-sm text-gray-600">Total Clicks</div>
        </motion.div>
      </div>

      {/* URL Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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

