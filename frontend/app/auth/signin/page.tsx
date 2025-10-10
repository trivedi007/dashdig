'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import './signin.css'

function SignInForm() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const isBusiness = searchParams.get('type') === 'business'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5001/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, userType: isBusiness ? 'business' : 'personal' })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send magic link')
      }
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className={`signin-container ${isBusiness ? 'business-mode' : ''}`}>
        <div className="signin-card">
          <div className="email-icon">📧</div>
          <h2>Check Your Inbox!</h2>
          <p className="email-sent-message">
            We sent a magic link to <strong>{identifier}</strong>
          </p>
          <button onClick={() => setSent(false)} className="try-again-link">
            Didn&apos;t receive it? Try again →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`signin-container ${isBusiness ? 'business-mode' : ''}`}>
      <div className="signin-card">
        <Link href="/" className="logo-container">
          <span className="logo-icon">⚡</span>
          <span className={`logo-text ${isBusiness ? 'business-logo' : ''}`}>Dashdig</span>
        </Link>
        
        <div className="welcome-section">
          <h1>{isBusiness ? 'Enterprise Sign In' : 'Welcome Back!'}</h1>
          <p>{isBusiness ? 'Access your business dashboard' : 'Sign in to create your smart links'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{isBusiness ? 'Business Email' : 'Email Address'}</label>
            <input
              id="email"
              type="email"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={isBusiness ? 'work@company.com' : 'your@email.com'}
              className="email-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className={`submit-button ${isBusiness ? 'business-button' : ''}`}>
            {loading ? 'Sending Magic Link...' : isBusiness ? '🔐 Continue to Dashboard' : '🚀 Continue with Magic Link'}
          </button>
        </form>

        <div className="security-note">
          <span>{isBusiness ? '🔐' : '🔒'}</span>
          <p>{isBusiness ? 'Enterprise-grade security with SSO support' : 'No password needed! We\'ll send you a secure link to sign in.'}</p>
        </div>

        <Link href="/" className="back-link">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="signin-container">
        <div className="signin-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '24px', marginBottom: '1rem' }}>Loading...</div>
          </div>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
