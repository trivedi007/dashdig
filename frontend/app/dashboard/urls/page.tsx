'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useUrls } from '../../../lib/hooks/useUrls';
import toast from 'react-hot-toast';

export default function UrlsPage() {
  const { data, isLoading, error, deleteUrl, isDeleting } = useUrls();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter URLs based on search
  const filteredUrls = data?.urls?.filter(url =>
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUrls = filteredUrls.slice(startIndex, endIndex);
  const totalItems = filteredUrls.length;

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Delete URL
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteUrl.mutate(id, {
        onSuccess: () => {
          toast.success('URL deleted successfully!');
        },
        onError: () => {
          toast.error('Failed to delete URL');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading URLs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">Error loading URLs</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Management</h1>
          <p className="text-gray-600">Manage and track all your shortened URLs</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md shadow-orange-200 hover:shadow-lg"
        >
          <i className="fas fa-plus"></i>
          <span>Create New URL</span>
        </Link>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Short URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUrls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? (
                        <>
                          <i className="fas fa-search text-4xl mb-3 text-gray-300"></i>
                          <p className="font-semibold mb-1">No URLs found</p>
                          <p className="text-sm">Try a different search term</p>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-link text-4xl mb-3 text-gray-300"></i>
                          <p className="font-semibold mb-1">No URLs created yet</p>
                          <p className="text-sm">Create your first shortened URL to get started</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUrls.map((url) => (
                  <tr key={url._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/analytics/${url.shortCode}`}
                        className="font-mono text-sm text-orange-600 font-bold hover:text-orange-700 hover:underline transition"
                      >
                        {url.shortCode}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="max-w-md truncate text-sm text-gray-600 cursor-help"
                        title={url.originalUrl}
                      >
                        {url.originalUrl.length > 60
                          ? `${url.originalUrl.substring(0, 60)}...`
                          : url.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-base font-bold text-gray-900">
                        {url.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(url.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="text-gray-400 hover:text-orange-600 transition-colors"
                          title="Copy link"
                        >
                          <i className="fas fa-copy text-base"></i>
                        </button>
                        <Link
                          href={`/dashboard/analytics/${url.shortCode}`}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="View analytics"
                        >
                          <i className="fas fa-chart-bar text-base"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(url._id)}
                          disabled={isDeleting}
                          className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <i className="fas fa-trash text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
            <div className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-semibold text-gray-900">{startIndex + 1}</span>
              {' '}-{' '}
              <span className="font-semibold text-gray-900">
                {Math.min(endIndex, totalItems)}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-gray-900">{totalItems}</span>
              {' '}URLs
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <i className="fas fa-chevron-left text-xs mr-2"></i>
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
                <i className="fas fa-chevron-right text-xs ml-2"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State for No URLs at All */}
      {!searchTerm && filteredUrls.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-link text-orange-600 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No URLs Yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first shortened URL. Track clicks and manage all your links in one place.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md shadow-orange-200 hover:shadow-lg"
            >
              <i className="fas fa-plus"></i>
              <span>Create Your First URL</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
