'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { format } from 'date-fns'
import { UrlItem } from '../../../lib/hooks/useUrls'
import QRCode from 'react-qr-code'

interface UrlTableProps {
  urls: UrlItem[]
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function UrlTable({ urls, onDelete, isDeleting }: UrlTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<'clicks' | 'createdAt' | 'shortCode'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredUrls = urls.filter(url =>
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedUrls = [...filteredUrls].sort((a, b) => {
    let comparison = 0
    if (sortField === 'clicks') {
      comparison = a.clicks - b.clicks
    } else if (sortField === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else {
      comparison = a.shortCode.localeCompare(b.shortCode)
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const toggleSelectUrl = (id: string) => {
    const newSelected = new Set(selectedUrls)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedUrls(newSelected)
  }

  const selectAll = () => {
    if (selectedUrls.size === sortedUrls.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(sortedUrls.map(u => u._id)))
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm(null)
    onDelete(id)
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          />
        </div>
        {selectedUrls.size > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <button
              onClick={() => {
                // Bulk delete logic
                selectedUrls.forEach(id => onDelete(id))
                setSelectedUrls(new Set())
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete Selected ({selectedUrls.size})
            </button>
            <button
              onClick={() => setSelectedUrls(new Set())}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear
            </button>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUrls.size === sortedUrls.length && sortedUrls.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
                  />
                </th>
                <th
                  onClick={() => handleSort('shortCode')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    Slug
                    {sortField === 'shortCode' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original URL
                </th>
                <th
                  onClick={() => handleSort('clicks')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    Clicks
                    {sortField === 'clicks' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    Created
                    {sortField === 'createdAt' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {sortedUrls.map((url) => (
                  <motion.tr
                    key={url._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUrls.has(url._id)}
                        onChange={() => toggleSelectUrl(url._id)}
                        className="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/analytics/${url.shortCode}`}
                        className="font-mono text-[#FF6B35] hover:underline font-semibold"
                      >
                        {url.shortCode}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md truncate text-gray-900" title={url.originalUrl}>
                        {url.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{url.clicks}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(url.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="p-2 text-gray-600 hover:text-[#FF6B35] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy link"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => setQrCodeUrl(url.shortUrl)}
                          className="p-2 text-gray-600 hover:text-[#FF6B35] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Show QR code"
                        >
                          📱
                        </button>
                        <Link
                          href={`/analytics/${url.shortCode}`}
                          className="p-2 text-gray-600 hover:text-[#FF6B35] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View analytics"
                        >
                          📊
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(url._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrCodeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setQrCodeUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-center">QR Code</h3>
              <div className="flex justify-center mb-4 bg-white p-4 rounded-lg">
                <QRCode value={qrCodeUrl} size={200} />
              </div>
              <p className="text-sm text-gray-600 text-center mb-4 break-all">{qrCodeUrl}</p>
              <button
                onClick={() => setQrCodeUrl(null)}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Delete URL?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this URL? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {sortedUrls.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'No URLs found matching your search' : 'No URLs created yet'}
        </div>
      )}
    </div>
  )
}

