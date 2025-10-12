'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createShortUrl, getAllUrls } from '@/lib/api'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

interface UrlItem {
  _id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  clicks: number
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [urls, setUrls] = useState<UrlItem[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [keywords, setKeywords] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<UrlItem | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/signin')
      return
    }
    
    loadUrls()
  }, [router])

  const loadUrls = async () => {
    try {
      const response = await getAllUrls()
      setUrls(response.urls)
    } catch (error: any) {
      console.error('Failed to load URLs:', error)
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        // Token expired, redirect to signin
        localStorage.removeItem('token')
        router.push('/auth/signin')
        return
      }
      alert('Failed to load URLs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl) return

    setCreating(true)
    try {
      const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : []
      const response = await createShortUrl({
        url: newUrl,
        keywords: keywordsArray,
        customSlug: customSlug || undefined,
        expiryClicks: 100
      })

      // Add to the list
      setUrls([response, ...urls])
      
      // Reset form
      setNewUrl('')
      setCustomSlug('')
      setKeywords('')
      
      alert(`Short URL created: ${response.shortUrl}`)
    } catch (error: any) {
      alert(error.message || 'Failed to create short URL')
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const viewAnalytics = (url: UrlItem) => {
    console.log('🔍 Analytics button clicked!')
    console.log('🔍 URL object:', url)
    console.log('🔍 URL has _id:', url._id)
    console.log('🔍 Setting selectedUrl and showAnalytics...')
    
    setSelectedUrl(url)
    setShowAnalytics(true)
    
    console.log('🔍 State should be updated now')
  }

  const closeAnalytics = () => {
    setShowAnalytics(false)
    setSelectedUrl(null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashdig Dashboard</h1>
                <p className="text-gray-600 text-sm">Transform URLs into memorable links</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Create URL Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔗</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Memorable Link</h2>
          </div>
          
          <form onSubmit={handleCreateUrl} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Slug (optional)
                </label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="my-custom-link"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="business, marketing, link"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating || !newUrl}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Creating...' : '🚀 Dig This!'}
            </button>
          </form>
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your Links</h2>
            </div>
            <div className="text-sm text-gray-500">
              {urls.length} {urls.length === 1 ? 'link' : 'links'} created
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your links...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No links yet</h3>
              <p className="text-gray-600">Create your first memorable link above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => (
                <div key={url.shortCode} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Short URL - Prominent Display */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg font-semibold text-sm">
                          dashdig.com/{url.shortCode}
                        </div>
                        <button
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded"
                          title="Copy link"
                        >
                          📋
                        </button>
                      </div>
                      
                      {/* Original URL - Collapsed by default */}
                      <details className="mb-3">
                        <summary className="text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition-colors">
                          View original URL →
                        </summary>
                        <p className="text-gray-600 text-sm mt-2 break-all bg-gray-50 p-3 rounded-lg font-mono">
                          {url.originalUrl}
                        </p>
                      </details>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{url.clicks} clicks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => viewAnalytics(url)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                      >
                        📊 Analytics
                      </button>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                      >
                        🔗 Visit
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Modal */}
      {console.log('🔍 Modal render check - showAnalytics:', showAnalytics, 'selectedUrl:', selectedUrl)}
      {showAnalytics && selectedUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Analytics for {selectedUrl.shortCode}</h2>
              <button
                onClick={closeAnalytics}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              {console.log('🔍 Rendering AnalyticsDashboard with:', { urlId: selectedUrl._id, shortCode: selectedUrl.shortCode })}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">🔍 Debug: Modal is rendering!</p>
                <p className="text-blue-600 text-sm">URL ID: {selectedUrl._id}</p>
                <p className="text-blue-600 text-sm">Short Code: {selectedUrl.shortCode}</p>
              </div>
              <AnalyticsDashboard
                urlId={selectedUrl._id}
                shortCode={selectedUrl.shortCode}
                originalUrl={selectedUrl.originalUrl}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
