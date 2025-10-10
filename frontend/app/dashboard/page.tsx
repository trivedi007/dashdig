'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createShortUrl, getAllUrls } from '@/lib/api'

interface UrlItem {
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

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashdig Dashboard</h1>
            <p className="text-gray-600 mt-2">Create and manage your smart links</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Create URL Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create New Short Link</h2>
          
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
              {creating ? 'Creating...' : '🚀 Create Smart Link'}
            </button>
          </form>
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Your Links</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your links...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No links yet</h3>
              <p className="text-gray-600">Create your first smart link above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => (
                <div key={url.shortCode} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-blue-600">
                          dashdig.com/{url.shortCode}
                        </h3>
                        <button
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy link"
                        >
                          📋
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 break-all">{url.originalUrl}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👆 {url.clicks} clicks</span>
                        <span>📅 {new Date(url.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        Visit
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
