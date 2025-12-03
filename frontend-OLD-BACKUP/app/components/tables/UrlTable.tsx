'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { format } from 'date-fns'
import { UrlItem } from '../../../lib/hooks/useUrls'
import QRCode from 'react-qr-code'
import toast from 'react-hot-toast'

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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  // Pagination
  const totalPages = Math.ceil(sortedUrls.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUrls = sortedUrls.slice(startIndex, endIndex)
  const totalItems = sortedUrls.length

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
    if (selectedUrls.size === paginatedUrls.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(paginatedUrls.map(u => u._id)))
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!', { duration: 2000 })
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy')
    }
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm(null)
    onDelete(id)
  }

  return (
    <div className="relative space-y-0 z-20">
      {/* Search and Actions Bar */}
      <div className="relative flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-200 p-5 bg-slate-50 z-20">
        <div className="flex flex-1 w-full gap-3">
          <div className="relative flex-1 max-w-md">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search URLs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition bg-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {selectedUrls.size > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-2"
            >
              <button
                onClick={() => {
                  selectedUrls.forEach(id => onDelete(id))
                  setSelectedUrls(new Set())
                  toast.success(`Deleted ${selectedUrls.size} URL(s)`)
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-red-600 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors font-semibold"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete ({selectedUrls.size})
              </button>
              <button
                onClick={() => setSelectedUrls(new Set())}
                className="px-3 py-2 text-slate-600 text-sm rounded-lg hover:bg-slate-100 transition-colors font-medium"
              >
                Clear
              </button>
            </motion.div>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] text-white text-sm rounded-lg hover:bg-[#E85A2A] active:bg-[#D64E1F] transition-all font-semibold shadow-sm"
            >
              <i className="fas fa-plus"></i>
              Create New URL
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden bg-white z-20">
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead className="bg-gray-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedUrls.size === paginatedUrls.length && paginatedUrls.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-[#FF6B35] border-slate-300 rounded focus:ring-[#FF6B35] cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('shortCode')}
                  className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-1.5">
                    Short URL
                    {sortField === 'shortCode' && (
                      <span className="text-[#FF6B35]">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Original URL
                </th>
                <th
                  onClick={() => handleSort('clicks')}
                  className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-1.5">
                    Clicks
                    {sortField === 'clicks' && (
                      <span className="text-[#FF6B35]">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-1.5">
                    Created
                    {sortField === 'createdAt' && (
                      <span className="text-[#FF6B35]">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <AnimatePresence>
                {paginatedUrls.map((url, index) => (
                  <motion.tr
                    key={url._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`hover:bg-[#F9FAFB] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUrls.has(url._id)}
                        onChange={() => toggleSelectUrl(url._id)}
                        className="w-4 h-4 text-[#FF6B35] border-slate-300 rounded focus:ring-[#FF6B35] cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/analytics/${url.shortCode}`}
                        className="font-mono text-sm text-[#FF6B35] font-bold hover:underline transition"
                      >
                        {url.shortCode}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        className="max-w-md truncate text-sm text-[#6C757D] cursor-help" 
                        title={url.originalUrl}
                      >
                        {url.originalUrl.length > 60 
                          ? `${url.originalUrl.substring(0, 60)}...` 
                          : url.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-base font-bold text-slate-900" style={{ fontSize: '16px' }}>{url.clicks.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6C757D]">
                      {format(new Date(url.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="text-[#6C757D] hover:text-[#FF6B35] transition-colors"
                          title="Copy link"
                        >
                          <i className="fas fa-copy" style={{ fontSize: '16px' }}></i>
                        </button>
                        <Link
                          href={`/analytics/${url.shortCode}`}
                          className="text-[#6C757D] hover:text-[#FF6B35] transition-colors"
                          title="View analytics"
                        >
                          <i className="fas fa-edit" style={{ fontSize: '16px' }}></i>
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(url._id)}
                          className="text-[#6C757D] hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <i className="fas fa-trash" style={{ fontSize: '16px' }}></i>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-900">{Math.min(endIndex, totalItems)}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalItems}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                    currentPage === page
                      ? 'bg-[#FF6B35] text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedUrls.length === 0 && (
        <div className="text-center py-16 px-4 bg-white">
          {searchTerm ? (
            <>
              <div className="mb-6">
                <i className="fas fa-search text-slate-300 text-6xl mb-4"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No URLs found</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                No URLs match "{searchTerm}". Try a different search term.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors font-semibold"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <i className="fas fa-link text-slate-300 text-6xl mb-4"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No URLs created yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                Start shortening URLs and track your analytics. Create your first smart link now!
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] text-white text-sm rounded-lg hover:bg-[#E85A2A] transition-colors font-semibold shadow-sm"
              >
                <i className="fas fa-plus"></i>
                Create your first URL
              </Link>
            </>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrCodeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setQrCodeUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-6 text-center text-slate-900">QR Code</h3>
              <div className="flex justify-center mb-5 bg-slate-50 p-6 rounded-xl">
                <QRCode value={qrCodeUrl} size={200} />
              </div>
              <p className="text-xs text-slate-600 text-center mb-6 break-all font-mono bg-slate-50 px-3 py-2 rounded-lg">{qrCodeUrl}</p>
              <button
                onClick={() => setQrCodeUrl(null)}
                className="w-full px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors font-semibold"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-3 text-slate-900">Delete URL?</h3>
              <p className="text-slate-600 mb-6 text-sm">
                Are you sure you want to delete this URL? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

