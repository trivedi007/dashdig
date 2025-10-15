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
      // For demo purposes, redirect to signin but don't block access
      console.log('No token found, but allowing demo access')
      // router.push('/auth/signin')
    }
  }

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // For demo purposes, show some sample URLs
        setUrls([
          {
            _id: 'demo1',
            shortCode: 'tide.oxi.boost.pods.25ct.target',
            shortUrl: 'https://dashdig.com/tide.oxi.boost.pods.25ct.target',
            originalUrl: 'https://www.target.com/p/tide-oxi-boost-laundry-detergent-power-pods-with-stain-remover-25ct/-/A-93248130',
            clicks: 12,
            createdAt: new Date().toISOString()
          },
          {
            _id: 'demo2', 
            shortCode: 'tide.oxi.boost.pods.25ct.walmart',
            shortUrl: 'https://dashdig.com/tide.oxi.boost.pods.25ct.walmart',
            originalUrl: 'https://www.walmart.com/ip/Tide-Oxi-Boost-Power-PODS-with-Stain-Remover-and-Oxi-Power-Laundry-Detergent-Pacs-25-Count/11295015861',
            clicks: 8,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: 'demo3',
            shortCode: 'nike.vaporfly.running',
            shortUrl: 'https://dashdig.com/nike.vaporfly.running',
            originalUrl: 'https://www.nike.com/vaporfly',
            clicks: 0,
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ])
        setLoading(false)
        return
      }
      
      const response = await getAllUrls()
      setUrls(response.urls || [])
    } catch (error) {
      console.error('Failed to fetch URLs:', error)
      if (error.response?.status === 401) {
        router.push('/auth/signin')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl.trim()) return

    setCreating(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // For demo purposes, redirect to signin
        alert('Please sign in to create short URLs')
        router.push('/auth/signin')
        return
      }

      const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k)
      const data = {
        url: newUrl.trim(),
        customSlug: customSlug.trim() || undefined,
        keywords: keywordArray.length > 0 ? keywordArray : undefined
      }

      const response = await createShortUrl(data)
      setUrls(prev => [response, ...prev])
      
      // Reset form
      setNewUrl('')
      setCustomSlug('')
      setKeywords('')
    } catch (error) {
      console.error('Failed to create URL:', error)
      alert('Failed to create short URL')
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
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
    // Clear demo URLs and redirect to home
    setUrls([])
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">⚡</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Dashdig Dashboard</h1>
                <p className="text-gray-600 text-lg">Transform URLs into memorable links</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-xl hover:shadow-2xl text-base font-semibold transform hover:-translate-y-1"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create URL Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🔗</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create New Memorable Link</h2>
          </div>
          
          <form onSubmit={handleCreateUrl} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Original URL
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Slug (optional)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    dashdig.com/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="my-custom-link"
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="business, marketing, link"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              disabled={creating}
            >
              {creating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Digging...
                </div>
              ) : (
                '🚀 Dig This!'
              )}
            </button>
          </form>
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">📊</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Your Links</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-200">
              <span className="text-sm font-semibold text-blue-700">
                {urls.length} {urls.length === 1 ? 'link' : 'links'} created
              </span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading your links...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔗</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No links yet</h3>
              <p className="text-gray-600 text-lg">Create your first memorable link above!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {urls.map((url) => (
                <div key={url.shortCode} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group hover:border-blue-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Short URL - Prominent Display */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                          dashdig.com/{url.shortCode}
                        </div>
                        <button
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                          title="Copy link"
                        >
                          <span className="text-xl">📋</span>
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
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 ml-6">
                      <button
                        onClick={() => viewAnalytics(url)}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold transform hover:-translate-y-0.5"
                      >
                        📊 Analytics
                      </button>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold transform hover:-translate-y-0.5"
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

      {/* Professional Analytics Modal */}
      {showAnalytics && selectedUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
          onClick={closeAnalytics}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border border-gray-200 transform scale-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Professional Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h2>
                  <p className="text-gray-600 text-lg mt-1">
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-blue-600 font-semibold text-base">dashdig.com/{selectedUrl.shortCode}</span>
                    <span className="mx-3 text-gray-400">→</span>
                    <span className="text-sm text-gray-500 truncate max-w-md">{selectedUrl.originalUrl}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Time Range Selector */}
                <select className="border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold">
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                
                {/* Export Buttons */}
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold transform hover:-translate-y-0.5">
                  📊 Export CSV
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold transform hover:-translate-y-0.5">
                  📄 Export JSON
                </button>
                
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
                {/* Key Metrics Cards - Professional Design */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">{selectedUrl.clicks}</div>
                        <div className="text-sm text-blue-800 font-semibold uppercase tracking-wide">Total Clicks</div>
                        <div className="text-xs text-gray-500 mt-1">+12% from last week</div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">👆</span>
                      </div>
                    </div>
                    <div className="mt-4 bg-blue-50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold text-green-600 mb-2">12</div>
                        <div className="text-sm text-green-800 font-semibold uppercase tracking-wide">Countries</div>
                        <div className="text-xs text-gray-500 mt-1">+3 new this week</div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">🌍</span>
                      </div>
                    </div>
                    <div className="mt-4 bg-green-50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
                        <div className="text-sm text-purple-800 font-semibold uppercase tracking-wide">Device Types</div>
                        <div className="text-xs text-gray-500 mt-1">Mobile leading</div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">📱</span>
                      </div>
                    </div>
                    <div className="mt-4 bg-purple-50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold text-orange-600 mb-2">5</div>
                        <div className="text-sm text-orange-800 font-semibold uppercase tracking-wide">Browsers</div>
                        <div className="text-xs text-gray-500 mt-1">Chrome dominant</div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">🌐</span>
                      </div>
                    </div>
                    <div className="mt-4 bg-orange-50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{width: '80%'}}></div>
                    </div>
                  </div>
                </div>
                
                {/* Professional Analytics Sections */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Top Countries - Professional Card */}
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                        <span className="text-white text-xl">🌍</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Top Countries</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">1</span>
                          </div>
                          <span className="text-gray-700 font-semibold">United States</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-xl mr-3">142</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">2</span>
                          </div>
                          <span className="text-gray-700 font-semibold">Canada</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-xl mr-3">38</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">3</span>
                          </div>
                          <span className="text-gray-700 font-semibold">United Kingdom</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-xl mr-3">28</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '18%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Device Types - Professional Card */}
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                        <span className="text-white text-xl">📱</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Device Types</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm">💻</span>
                          </div>
                          <span className="text-gray-700 font-semibold">Desktop</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-xl mr-3">156</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '70%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm">📱</span>
                          </div>
                          <span className="text-gray-700 font-semibold">Mobile</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-xl mr-3">78</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '35%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm">📱</span>
                          </div>
                          <span className="text-gray-700 font-semibold">Tablet</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-xl mr-3">13</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '6%'}}></div>
                          </div>
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