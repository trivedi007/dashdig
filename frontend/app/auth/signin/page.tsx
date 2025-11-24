'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Logo } from '@/components/Logo'
import Link from 'next/link'
import './signin.css'

function SignInForm() {
  const searchParams = useSearchParams()
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [authMethod, setAuthMethod] = useState<'email' | 'sms'>('email')

  // Business mode detection from URL search params
  const isBusiness = searchParams.get('type') === 'business'

  // Check for OAuth errors
  const oauthError = searchParams?.get('error')

  // Handle OAuth sign-in
  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setError('')
      setOauthLoading(provider)
      await signIn(provider, {
        callbackUrl: '/dashboard',
        redirect: true
      })
    } catch (err: any) {
      console.error('OAuth error:', err)
      setError(getErrorMessage(err.message || 'oauth_error'))
      setOauthLoading(null)
    }
  }

  // Get user-friendly error message
  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
      case 'OAuthCallback':
        return 'Error connecting to authentication provider. Please try again.'
      case 'OAuthCreateAccount':
        return 'Could not create user account. Please try a different method.'
      case 'EmailCreateAccount':
        return 'Could not create user account with this email.'
      case 'Callback':
        return 'Error during authentication callback. Please try again.'
      case 'OAuthAccountNotLinked':
        return 'Email already in use with a different sign-in method. Please use your original sign-in method.'
      case 'EmailSignin':
        return 'The sign-in link is no longer valid.'
      case 'CredentialsSignin':
        return 'Sign in failed. Please check your credentials.'
      case 'SessionRequired':
        return 'Please sign in to access this page.'
      case 'oauth_cancelled':
        return 'Authentication cancelled. Please try again.'
      case 'network_error':
        return 'Network error. Please check your connection and try again.'
      default:
        return 'An error occurred during sign-in. Please try again.'
    }
  }

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
          <Logo size="xl" variant="full" linkTo="/" />
        </div>
        <div className="welcome-section">
          <h1>Welcome to Dashdig</h1>
          <p>Humanize and Shortenize Your URLs</p>
        </div>

        {/* Display OAuth errors */}
        {oauthError && (
          <div className="error-message">
            {getErrorMessage(oauthError)}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="oauth-buttons">
          <button
            onClick={() => handleOAuthSignIn('google')}
            disabled={oauthLoading !== null}
            className="oauth-button google"
          >
            <span className="oauth-button-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </span>
            {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
          </button>

          <button
            onClick={() => handleOAuthSignIn('apple')}
            disabled={oauthLoading !== null}
            className="oauth-button apple"
          >
            <span className="oauth-button-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </span>
            {oauthLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
          </button>

          <button
            onClick={() => handleOAuthSignIn('facebook')}
            disabled={oauthLoading !== null}
            className="oauth-button facebook"
          >
            <span className="oauth-button-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </span>
            {oauthLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
          </button>
        </div>

        {/* Divider */}
        <div className="divider">OR</div>

        {/* Email/SMS Form */}
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

          <button type="submit" disabled={loading || oauthLoading !== null} className={`submit-button ${isBusiness ? 'business-button' : ''}`}>
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

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}
