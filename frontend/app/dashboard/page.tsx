'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createShortUrl, getAllUrls } from '../../src/lib/api'
import SmartLinkCreator from '../../src/components/SmartLinkCreator'

// API Base URL for backend calls
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api';
import Link from 'next/link'

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
  const [useSmartCreator, setUseSmartCreator] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchUrls()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token found, using demo-url endpoint for URL creation')
    } else {
      console.log('Token found, using authenticated API endpoints')
    }
  }

  const fetchUrls = async () => {
    try {
      // Always call the real API endpoint (Vercel will rewrite /api/* to backend)
      try {
        // Try to get URLs from backend
	  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/urls`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        if (response.ok) {
          const apiResponse = await response.json();
          console.log('✅ Dashboard fetchUrls API success:', apiResponse);
          setUrls(apiResponse.urls || []);
          return;
        }
      } catch (apiError) {
        console.log('⚠️ Dashboard fetchUrls API failed:', apiError.message);
      }
      
      // Fallback: Show empty state if API fails
      console.log('📭 No URLs found or API failed, showing empty state');
      setUrls([]);
      
    } catch (error) {
      console.error('Failed to fetch URLs:', error)
      setUrls([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl) return

    setCreating(true)
    try {
      // Use correct authenticated API endpoint (Vercel will rewrite /api/* to backend)
      const response = await fetch(`${API_BASE}/api/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: newUrl,
          customSlug: customSlug || undefined,
          keywords: keywords ? keywords.split(',').map(k => k.trim()) : []
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const apiResponse = await response.json();
      console.log('✅ Dashboard API success:', apiResponse);
      
      if (apiResponse.success) {
        await fetchUrls(); // Refresh the list
        setNewUrl('');
        setCustomSlug('');
        setKeywords('');
      }
    } catch (error) {
      console.error('Failed to create URL:', error)
    } finally {
      setCreating(false)
    }
  }

  const generateContextualSlug = (url: string) => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      const pathname = urlObj.pathname.toLowerCase()
      
      const domain = hostname.replace('www.', '').split('.')[0]
      const pathWords = pathname.split('/').filter(p => p && p.length > 2)
      
      const meaningfulWords = []
      
      if (hostname.includes('nike')) {
        meaningfulWords.push('nike')
        if (pathname.includes('vaporfly')) meaningfulWords.push('vaporfly')
        if (pathname.includes('running')) meaningfulWords.push('running')
        if (pathname.includes('shoes')) meaningfulWords.push('shoes')
        if (pathname.includes('mens')) meaningfulWords.push('mens')
      } else if (hostname.includes('target')) {
        meaningfulWords.push('target')
        if (pathname.includes('centrum')) meaningfulWords.push('centrum')
        if (pathname.includes('vitamin')) meaningfulWords.push('vitamin')
      } else {
        meaningfulWords.push(domain)
        pathWords.slice(0, 3).forEach(word => {
          const cleanWord = word.replace(/[^a-z]/g, '').substring(0, 12)
          if (cleanWord.length > 2) meaningfulWords.push(cleanWord)
        })
      }
      
      return meaningfulWords.slice(0, 4).join('.')
    } catch (error) {
      return 'link.generated'
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --primary: #FF6B35;
          --secondary: #4ECDC4;
          --accent: #FFE66D;
          --dark: #2D3436;
          --light: #F8F9FA;
          --gradient: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          color: var(--dark);
          background: var(--light);
          overflow-x: hidden;
        }
        
        .bg-animation {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: -1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0.05;
        }
        
        nav {
          padding: 1.5rem 5%;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          animation: slideDown 0.5s ease;
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          font-size: 28px;
          font-weight: 800;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        
        .logo-icon {
          font-size: 32px;
          margin-right: 10px;
        }
        
        .logo-text {
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .nav-links a {
          text-decoration: none;
          color: var(--dark);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        
        .cta-button {
          background: var(--gradient);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        
        .dashboard-container {
          margin-top: 80px;
          padding: 4rem 5%;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .dashboard-header {
          text-align: center;
          margin-bottom: 4rem;
          padding: 2rem 0;
        }
        
        .dashboard-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .dashboard-subtitle {
          font-size: 1.3rem;
          color: #666;
          margin-bottom: 1rem;
        }
        
        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .stat-item {
          background: white;
          padding: 1rem 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          display: block;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 600;
        }
        
        .section {
          margin-bottom: 3rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .section-subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
        }
        
        .form-card {
          background: var(--light);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          margin-bottom: 3rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }
        
        .form-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
        }
        
        .form-row .form-input {
          flex: 1;
        }
        
        .submit-button {
          background: var(--gradient);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        
        .urls-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .empty-state-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 0.5rem;
        }
        
        .empty-state-text {
          color: #666;
          margin-bottom: 2rem;
        }
        
        .quick-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .quick-action-btn {
          background: var(--gradient);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        
        .url-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .url-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .url-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .url-slug {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary);
          font-family: monospace;
          flex: 1;
          margin-right: 1rem;
        }
        
        .url-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .action-button {
          padding: 0.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .copy-button {
          background: var(--secondary);
          color: white;
        }
        
        .copy-button:hover {
          background: #3bb5b0;
          transform: scale(1.05);
        }
        
        .visit-button {
          background: var(--primary);
          color: white;
        }
        
        .visit-button:hover {
          background: #e55a2b;
          transform: scale(1.05);
        }
        
        .analytics-button {
          background: #6c757d;
          color: white;
        }
        
        .analytics-button:hover {
          background: #5a6268;
          transform: scale(1.05);
        }
        
        .url-original {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          word-break: break-all;
        }
        
        .url-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
        }
        
        .click-count {
          font-weight: 600;
          color: var(--primary);
        }
        
        .loading {
          text-align: center;
          padding: 3rem;
          color: #666;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 2rem 1rem;
          }
          
          .dashboard-title {
            font-size: 2.5rem;
          }
          
          .stats-bar {
            flex-direction: column;
            gap: 1rem;
          }
          
          .form-row {
            flex-direction: column;
          }
          
          .urls-grid {
            grid-template-columns: 1fr;
          }
          
          .url-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .url-slug {
            margin-right: 0;
            margin-bottom: 1rem;
          }
          
          .url-actions {
            justify-content: center;
          }
          
          .quick-actions {
            flex-direction: column;
            align-items: center;
          }
        }
        
        @media (max-width: 480px) {
          .nav-container {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 0;
          }
          
          .nav-links {
            gap: 1rem;
          }
          
          .dashboard-container {
            margin-top: 120px;
          }
          
          .form-card {
            padding: 1.5rem;
          }
          
          .url-card {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="bg-animation"></div>
      
      <nav>
        <div className="nav-container">
          <Link href="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Dashdig</span>
          </Link>
          <div className="nav-links">
            <a href="#create">Create Link</a>
            <a href="#links">Your Links</a>
            <button onClick={logout} className="cta-button">
              Logout
            </button>
                </div>
              </div>
      </nav>
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Transform URLs into memorable links</p>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">{urls.length}</span>
              <span className="stat-label">Total Links</span>
              </div>
            <div className="stat-item">
              <span className="stat-number">{urls.reduce((sum, url) => sum + url.clicks, 0)}</span>
              <span className="stat-label">Total Clicks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{urls.length > 0 ? Math.round(urls.reduce((sum, url) => sum + url.clicks, 0) / urls.length) : 0}</span>
              <span className="stat-label">Avg Clicks</span>
          </div>
        </div>
      </div>

        <div className="section" id="create">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
              <h2 className="section-title">Create New Memorable Link</h2>
              <p className="section-subtitle">Make your links unforgettable</p>
            </div>
            <button
              onClick={() => setUseSmartCreator(!useSmartCreator)}
              style={{
                padding: '0.75rem 1.5rem',
                background: useSmartCreator ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5',
                color: useSmartCreator ? 'white' : '#666',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {useSmartCreator ? '⚡ Smart Creator (AI)' : '📝 Classic Form'}
            </button>
            </div>
          
          {useSmartCreator ? (
            <SmartLinkCreator 
              onCreateLink={async (data) => {
                setCreating(true);
                try {
                  const response = await fetch(`${API_BASE}/api/urls`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      url: data.originalUrl,
                      customSlug: data.slug,
                      keywords: []
                    }),
                  });

                  if (response.ok) {
                    await fetchUrls();
                  }
                } catch (error) {
                  console.error('Failed to create URL:', error);
                } finally {
                  setCreating(false);
                }
              }}
            />
          ) : (
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">🔗 Original URL</label>
                    <input
                      type="url"
                  className="form-input"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://example.com"
                      required
                    />
                </div>
                
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">✏️ Custom Slug (optional)</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ 
                      padding: '1rem', 
                      background: '#f5f5f5', 
                      border: '2px solid #e0e0e0',
                      borderRight: 'none',
                      borderRadius: '10px 0 0 10px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      {(process.env.NEXT_PUBLIC_BASE_URL || 'https://dashdig.com').replace('https://', '')}/
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="my-custom-link"
                      style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">🏷️ Keywords (comma-separated)</label>
                  <input
                    type="text"
                  className="form-input"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="business, marketing, link"
                  />
              </div>
              
                <button
                  type="submit"
                className="submit-button"
                disabled={creating || !newUrl}
              >
                {creating ? 'Creating...' : '🚀 Dig This!'}
                </button>
            </form>
          </div>
          )}
        </div>

        <div className="section" id="links">
          <h2 className="section-title">Your Links</h2>
          <p className="section-subtitle">Manage your memorable links</p>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading your links...</p>
                  </div>
          ) : urls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔗</div>
              <h3 className="empty-state-title">No links created yet</h3>
              <p className="empty-state-text">Create your first memorable link and start sharing!</p>
              <div className="quick-actions">
                <a href="#create" className="quick-action-btn">
                  ⚡ Create First Link
                </a>
                <a href="/" className="quick-action-btn">
                  🏠 Back to Homepage
                </a>
              </div>
              </div>
            ) : (
            <div className="urls-grid">
              {urls.map((url) => (
                <div key={url._id} className="url-card">
                  <div className="url-header">
                    <div className="url-slug">{url.shortCode}</div>
                    <div className="url-actions">
                            <button
                        className="action-button copy-button"
                              onClick={() => copyToClipboard(url.shortUrl)}
                              title="Copy link"
                            >
                        📋
                            </button>
                          <button
                        className="action-button visit-button"
                        onClick={() => window.open(url.originalUrl, '_blank')}
                        title="Visit original URL"
                      >
                        🔗
                          </button>
                <button
                        className="action-button analytics-button"
                        onClick={() => {
                          setSelectedUrl(url)
                          setShowAnalytics(true)
                        }}
                        title="View analytics"
                      >
                        📊
                </button>
                    </div>
                  </div>
                  
                  <div className="url-original">
                    {truncateUrl(url.originalUrl)}
                  </div>
                  
                  <div className="url-stats">
                    <span className="click-count">{url.clicks} clicks</span>
                    <span>{formatDate(url.createdAt)}</span>
                  </div>
                      </div>
                    ))}
            </div>
          )}
        </div>
    </div>
    </>
  )
}
