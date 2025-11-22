'use client'

import { useState } from 'react'
import { Logo } from '@/components/Logo'
import Link from 'next/link'
import './signin.css'

export default function SignInPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [authMethod, setAuthMethod] = useState<'email' | 'sms'>('email')

  // Simple business mode detection from URL
  const isBusiness = typeof window !== 'undefined' && window.location.search.includes('type=business')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api'}/auth/magic-link`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          identifier, 
          userType: isBusiness ? 'business' : 'personal',
          method: authMethod
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to send ${authMethod === 'email' ? 'email' : 'SMS'}`)
      }

      const data = await response.json()
      if (data.success) {
        setSent(true)
      } else {
        throw new Error(data.message || `Failed to send ${authMethod === 'email' ? 'email' : 'SMS'}`)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      if (err.name === 'AbortError') {
        setError('Connection timed out. Please check your internet and try again.')
      } else {
        setError(err.message || `Failed to send ${authMethod === 'email' ? 'email' : 'SMS'}. Please try again.`)
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className={`signin-container ${isBusiness ? 'business-mode' : ''}`}>
        <div className="signin-card">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h2>Check your {authMethod === 'email' ? 'email' : 'phone'} for the one-time code</h2>
            <p className="success-message">
              We sent a secure link to <strong>{identifier}</strong>
            </p>
            <button onClick={() => setSent(false)} className="try-again-link">
              Didn&apos;t receive it (check your spam)? Try again →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`signin-container ${isBusiness ? 'business-mode' : ''}`}>
      <div className="signin-card">
        <div className="logo-container mb-6">
          <Logo linkTo="/" showTagline={true} />
        </div> 
        <div className="welcome-section">
          <h1>{isBusiness ? 'Enterprise Sign In' : 'Welcome Back!'}</h1>
          <p>{isBusiness ? 'Access your business dashboard' : 'Sign in to create your smart links'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-method-selector">
            <button
              type="button"
              className={`method-button ${authMethod === 'email' ? 'active' : ''}`}
              onClick={() => setAuthMethod('email')}
            >
              📧 Email
            </button>
            <button
              type="button"
              className={`method-button ${authMethod === 'sms' ? 'active' : ''}`}
              onClick={() => setAuthMethod('sms')}
            >
              📱 SMS
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="identifier">
              {authMethod === 'email' 
                ? (isBusiness ? 'Business Email' : 'Email Address')
                : (isBusiness ? 'Business Phone' : 'Phone Number')
              }
            </label>
            <input
              id="identifier"
              type={authMethod === 'email' ? 'email' : 'tel'}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={authMethod === 'email' 
                ? (isBusiness ? 'work@company.com' : 'your@email.com')
                : (isBusiness ? '+1 (555) 123-4567' : '+1 (555) 123-4567')
              }
              className="email-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className={`submit-button ${isBusiness ? 'business-button' : ''}`}>
            {loading ? (
              <span className="loading-text">
                <span className="loading-dots">Dig'ging for you</span>
                <span className="dot-animation">...</span>
              </span>
            ) : (
              isBusiness ? '🔐 Continue to Dashboard' : '⚡ Let\'s Start Dig\'ging'
            )}
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
