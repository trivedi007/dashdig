'use client'

import { useState } from 'react'

export default function AuthBypass() {
  const [email, setEmail] = useState('trivedi.narendra@gmail.com')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')

  const handleBypass = async () => {
    try {
      setLoading(true)
      
      // Create a mock JWT token for testing
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci1pZCIsImVtYWlsIjoidHJpdmVkaS5uYXJlbmRyYUBnbWFpbC5jb20iLCJpc0VtYWlsVmVyaWZpZWQiOnRydWUsImlhdCI6MTczNjY2NzY4NCwiZXhwIjoxNzM3MjcyNDg0fQ.test-signature'
      
      // Store token in localStorage
      localStorage.setItem('token', mockToken)
      setToken(mockToken)
      
      alert('Authentication bypass successful! You can now access the dashboard.')
      
    } catch (error) {
      console.error('Bypass failed:', error)
      alert('Bypass failed: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const goToDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Bypass</h1>
          <p className="text-gray-600">For immediate testing access</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            onClick={handleBypass}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Access...' : '🚀 Bypass Authentication'}
          </button>

          {token && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">✅ Authentication Successful!</h3>
              <p className="text-green-700 text-sm mb-3">
                Token stored in localStorage. You can now access the dashboard.
              </p>
              <button
                onClick={goToDashboard}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                📊 Go to Dashboard
              </button>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-yellow-800 font-semibold mb-2">⚠️ Development Only</h3>
            <p className="text-yellow-700 text-sm">
              This bypass is for testing purposes only. In production, proper email authentication will be required.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
