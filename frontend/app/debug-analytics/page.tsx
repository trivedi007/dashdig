'use client'

import { useState } from 'react'

export default function DebugAnalytics() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [urlId, setUrlId] = useState('')

  const testAnalytics = async () => {
    setLoading(true)
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      console.log('🔍 Token:', token)
      
      const testUrlId = urlId || 'test123'
      
      console.log('🔍 Testing analytics with URL ID:', testUrlId)
      
      const response = await fetch(`/api/analytics/url/${testUrlId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('🔍 Response status:', response.status)
      console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()))
      
      const data = await response.text()
      console.log('🔍 Response data:', data)
      
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error) {
      console.error('🔍 Error:', error)
      setResult({
        error: error.message,
        stack: error.stack
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Analytics API</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">URL ID (optional):</label>
            <input
              type="text"
              value={urlId}
              onChange={(e) => setUrlId(e.target.value)}
              placeholder="Leave empty to use test123"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <button
            onClick={testAnalytics}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Analytics API'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
