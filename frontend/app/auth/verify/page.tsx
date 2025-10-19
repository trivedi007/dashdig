'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function VerifyContent() {
  const [status, setStatus] = useState<'verifying' | 'code' | 'success' | 'error'>('verifying')
  const [code, setCode] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
      setStatus('code') // Ask for code
    } else {
      setStatus('error')
    }
  }, [searchParams])

  const verifyToken = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api'}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, code })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      // Store token
      localStorage.setItem('token', data.token)
      
      // Update status
      setStatus('success')

      // Redirect after 2 seconds
      setTimeout(() => {
        // Check if this is a new user or user without payment method
        if (data.isNewUser) {
          router.push('/onboarding')
        } else {
          router.push('/dashboard')
        }
      }, 2000)

    } catch (error: any) {
      console.error('Verification error:', error)
      alert(error.message || 'Verification failed')
    }
  }

  if (status === 'code') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Enter Verification Code</h2>
          <p className="text-gray-600 mb-6">
            Please enter the 6-digit code from your email
          </p>

          <form onSubmit={verifyToken} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-3xl font-mono tracking-widest px-4 py-3 
                       border-2 border-gray-200 rounded-lg focus:border-blue-500 
                       focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={code.length !== 6}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg 
                       hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Code
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Dashdig!</h1>
          <p className="text-xl text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-4">The link may have expired or is invalid.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
