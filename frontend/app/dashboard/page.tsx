'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createShortUrl, getAllUrls } from '../../src/lib/api'

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
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState<UrlItem | null>(null)

  useEffect(() => {
    checkAuth()
    fetchUrls()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token found, but allowing demo access')
    }
  }

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setUrls([
          {
            _id: '1',
            shortCode: 'nike.vaporfly.running',
            shortUrl: 'https://dashdig.com/nike.vaporfly.running',
            originalUrl: 'https://www.nike.com/w/nike-vaporfly-running-shoes-37v7jz5mvs0zy7ok',
            clicks: 42,
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            shortCode: 'target.centrum.silver',
            shortUrl: 'https://dashdig.com/target.centrum.silver',
            originalUrl: 'https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets',
            clicks: 18,
            createdAt: new Date().toISOString()
          }
        ])
        setLoading(false)
        return
      }

      const response = await getAllUrls(token)
      if (response.success) {
        setUrls(response.data)
      }
    } catch (error) {
      console.error('Error fetching URLs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token, creating demo URL')
        const newUrlItem: UrlItem = {
          _id: Date.now().toString(),
          shortCode: customSlug || 'demo.link',
          shortUrl: `https://dashdig.com/${customSlug || 'demo.link'}`,
          originalUrl: newUrl,
          clicks: 0,
          createdAt: new Date().toISOString()
        }
        setUrls(prev => [newUrlItem, ...prev])
        setNewUrl('')
        setCustomSlug('')
        setKeywords('')
        setCreating(false)
        return
      }

      const response = await createShortUrl(newUrl, keywords.split(',').map(k => k.trim()), customSlug, token)
      if (response.success) {
        setUrls(prev => [response.data, ...prev])
        setNewUrl('')
        setCustomSlug('')
        setKeywords('')
      }
    } catch (error) {
      console.error('Error creating URL:', error)
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const viewAnalytics = (url: UrlItem) => {
    setSelectedUrl(url)
    setShowAnalytics(true)
  }

  const closeAnalytics = () => {
    setShowAnalytics(false)
    setSelectedUrl(null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUrls([])
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-100/10 to-yellow-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Ultra-Modern Glass Header */}
      <div className="bg-white/60 backdrop-blur-xl shadow-2xl border-b border-white/20 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
                  <span className="text-white font-bold text-2xl drop-shadow-lg">⚡</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent tracking-tight">
                  Dashdig Dashboard
                </h1>
                <p className="text-gray-600 font-semibold text-lg mt-1">Transform URLs into memorable links</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-2xl border border-green-200">
                <span className="text-sm font-bold text-green-700 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </span>
              </div>
              <button
                onClick={logout}
                className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        {/* Ultra-Modern Create URL Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-4xl shadow-2xl p-10 mb-12 border border-white/30 relative overflow-hidden">
          {/* Form Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-blue-50/30 rounded-4xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-orange-300/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-6 mb-10">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                  <span className="text-white text-2xl drop-shadow-lg">✨</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent tracking-tight">
                  Create New Memorable Link
                </h2>
                <p className="text-gray-600 font-semibold text-lg mt-2">Make your links unforgettable</p>
              </div>
            </div>
          
            <form onSubmit={handleCreateUrl} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                    Original URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-8 py-5 border-2 border-gray-200/50 rounded-3xl focus:ring-4 focus:ring-orange-200/50 focus:border-orange-500 transition-all duration-500 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-400 font-semibold text-lg shadow-lg hover:shadow-xl group-hover:border-orange-300"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                    Custom Slug (optional)
                  </label>
                  <div className="flex relative">
                    <span className="inline-flex items-center px-6 py-5 rounded-l-3xl border-2 border-r-0 border-gray-200/50 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-sm font-bold shadow-lg">
                      dashdig.com/
                    </span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="my-custom-link"
                      className="flex-1 px-6 py-5 border-2 border-gray-200/50 rounded-r-3xl focus:ring-4 focus:ring-orange-200/50 focus:border-orange-500 transition-all duration-500 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-400 font-semibold text-lg shadow-lg hover:shadow-xl group-hover:border-orange-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                  Keywords (comma-separated)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="business, marketing, link"
                    className="w-full px-8 py-5 border-2 border-gray-200/50 rounded-3xl focus:ring-4 focus:ring-orange-200/50 focus:border-orange-500 transition-all duration-500 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-400 font-semibold text-lg shadow-lg hover:shadow-xl group-hover:border-orange-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              
              <div className="relative group">
                <button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white font-black rounded-3xl hover:from-orange-600 hover:via-orange-700 hover:to-red-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 text-xl tracking-wide relative overflow-hidden"
                  disabled={creating}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    {creating ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        <span className="text-lg">Digging...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-2xl mr-3">🚀</span>
                        <span>Dig This!</span>
                      </div>
                    )}
                  </div>
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
            </form>
          </div>
        </div>

        {/* Ultra-Modern URLs List */}
        <div className="bg-white/80 backdrop-blur-xl rounded-4xl shadow-2xl p-10 border border-white/30 relative overflow-hidden">
          {/* List Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 rounded-4xl"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                    <span className="text-white text-2xl drop-shadow-lg">📊</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent tracking-tight">
                    Your Links
                  </h2>
                  <p className="text-gray-600 font-semibold text-lg mt-2">Manage your memorable links</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-3xl border border-blue-200 shadow-lg">
                <span className="text-sm font-bold text-blue-800 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  {urls.length} {urls.length === 1 ? 'link' : 'links'} created
                </span>
              </div>
            </div>
          
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
                <p className="mt-6 text-gray-600 font-medium text-lg">Loading your links...</p>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔗</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No links yet</h3>
                <p className="text-gray-600 text-lg">Create your first memorable link above!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {urls.map((url, index) => (
                  <div key={url.shortCode} className="group relative">
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-purple-500/10 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-4xl p-8 hover:shadow-3xl transition-all duration-500 group-hover:border-orange-300/50 transform group-hover:-translate-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Short URL - Ultra Prominent Display */}
                          <div className="flex items-center gap-6 mb-6">
                            <div className="relative group/url">
                              <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white px-8 py-4 rounded-3xl font-black text-xl shadow-2xl transform group-hover/url:scale-105 transition-all duration-300">
                                dashdig.com/{url.shortCode}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl blur-lg opacity-0 group-hover/url:opacity-30 transition-opacity duration-300"></div>
                            </div>
                            <button
                              onClick={() => copyToClipboard(url.shortUrl)}
                              className="text-gray-400 hover:text-orange-600 transition-all duration-300 p-3 hover:bg-orange-100 rounded-2xl transform hover:scale-110"
                              title="Copy link"
                            >
                              <span className="text-2xl">📋</span>
                            </button>
                          </div>
                          
                          {/* Original URL - Collapsed by default */}
                          <details className="mb-4">
                            <summary className="text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition-colors font-medium">
                              View original URL →
                            </summary>
                            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <p className="text-gray-600 text-sm break-all font-mono">
                                {url.originalUrl}
                              </p>
                            </div>
                          </details>
                          
                          {/* Stats */}
                          <div className="flex items-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                              <span className="font-semibold text-gray-700">{url.clicks} clicks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📅</span>
                              <span className="text-gray-600">{new Date(url.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ultra-Modern Action Buttons */}
                        <div className="flex gap-4 ml-8">
                          <button
                            onClick={() => viewAnalytics(url)}
                            className="relative group/analytics px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 text-white rounded-3xl hover:from-blue-600 hover:via-purple-700 hover:to-indigo-600 transition-all duration-500 shadow-2xl hover:shadow-3xl text-sm font-black transform hover:-translate-y-2 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/analytics:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex items-center">
                              <span className="text-lg mr-2">📊</span>
                              <span>Analytics</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-lg opacity-0 group-hover/analytics:opacity-30 transition-opacity duration-500"></div>
                          </button>
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group/visit px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-3xl hover:from-gray-200 hover:to-gray-300 transition-all duration-500 shadow-xl hover:shadow-2xl text-sm font-black transform hover:-translate-y-2 border border-gray-200"
                          >
                            <div className="flex items-center">
                              <span className="text-lg mr-2">🔗</span>
                              <span>Visit</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Analytics Modal */}
      {showAnalytics && selectedUrl && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
          onClick={closeAnalytics}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-orange-200 transform scale-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modern Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
                  <p className="text-gray-600 text-lg mt-1">
                    <span className="font-mono bg-gradient-to-r from-orange-100 to-orange-200 px-4 py-2 rounded-xl text-orange-700 font-bold text-base">dashdig.com/{selectedUrl.shortCode}</span>
                    <span className="mx-4 text-gray-400">→</span>
                    <span className="text-sm text-gray-500 truncate max-w-md">{selectedUrl.originalUrl}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={closeAnalytics}
                  className="text-gray-400 hover:text-gray-600 text-4xl font-bold hover:bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Professional Analytics Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-8 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Clicks</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{selectedUrl.clicks}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-xl">👆</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Unique Visitors</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{Math.floor(selectedUrl.clicks * 0.8)}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-xl">👥</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Conversion Rate</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">12.5%</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-xl">📈</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Avg. Session</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">2m 34s</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-xl">⏱️</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Device Breakdown */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                      <span className="text-white text-xl">📱</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Device Breakdown</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">📱</span>
                        <span className="text-gray-700 font-semibold">Mobile</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900 text-xl mr-3">65</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">💻</span>
                        <span className="text-gray-700 font-semibold">Desktop</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900 text-xl mr-3">22</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '22%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">📱</span>
                        <span className="text-gray-700 font-semibold">Tablet</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900 text-xl mr-3">13</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '13%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Time Series Chart Section */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                      <span className="text-white text-xl">📈</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Click Trends</h3>
                  </div>
                  <div className="grid grid-cols-7 gap-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="text-center">
                        <div className="text-sm text-gray-600 mb-2">{day}</div>
                        <div className="bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg mx-auto" 
                             style={{height: `${Math.random() * 60 + 20}px`, width: '20px'}}></div>
                        <div className="text-xs text-gray-500 mt-2">{Math.floor(Math.random() * 50 + 10)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}