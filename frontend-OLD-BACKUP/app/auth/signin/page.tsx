'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Logo } from '@/components/Logo'
import Link from 'next/link'
import './signin.css'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api'

function SignInForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [authMethod, setAuthMethod] = useState<'email' | 'sms'>('email')
  
  // SMS-specific states
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', ''])
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verifying, setVerifying] = useState(false)
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Business mode detection from URL search params
  const isBusiness = searchParams.get('type') === 'business'

  // Check for OAuth errors
  const oauthError = searchParams?.get('error')

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

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

  // Handle email magic link
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${API_BASE}/auth/magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          identifier,
          userType: isBusiness ? 'business' : 'personal',
          method: 'email'
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(errorData.error || 'Failed to send email')
      }

      const data = await response.json()
      if (data.success) {
        setSent(true)
      } else {
        throw new Error(data.message || 'Failed to send email')
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      if (err.name === 'AbortError') {
        setError('Connection timed out. Please check your internet and try again.')
      } else {
        setError(err.message || 'Failed to send email. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle SMS code sending
  const handleSendSMSCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!phoneNumber) {
      setError('Please enter a valid phone number')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/auth/sms/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code')
      }

      if (data.success) {
        setCodeSent(true)
        setCountdown(30) // 30 second countdown for resend
        setError('')
      }
    } catch (err: any) {
      console.error('SMS send error:', err)
      if (err.message.includes('Too many attempts')) {
        const match = err.message.match(/(\d+)\s+minute/)
        setError(err.message)
      } else {
        setError(err.message || 'Failed to send code. Check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle code verification
  const handleVerifyCode = async () => {
    const code = verificationCode.join('')
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setVerifying(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/auth/sms/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
          code
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code')
      }

      if (data.success && data.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.token)
        
        // Redirect to dashboard
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      setError(err.message || 'Invalid or expired code. Please try again.')
      // Clear code inputs
      setVerificationCode(['', '', '', '', '', ''])
      codeInputRefs.current[0]?.focus()
    } finally {
      setVerifying(false)
    }
  }

  // Handle code input change
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newCode = [...verificationCode]
    newCode[index] = value.slice(-1) // Only take last character
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when 6 digits entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerifyCode()
    }
  }

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus()
    }
  }

  // Handle resend code
  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setError('')
    await handleSendSMSCode(new Event('submit') as any)
  }

  // Reset SMS flow
  const handleUseDifferentNumber = () => {
    setCodeSent(false)
    setVerificationCode(['', '', '', '', '', ''])
    setPhoneNumber('')
    setError('')
    setCountdown(0)
  }

  if (sent && authMethod === 'email') {
    return (
      <div className={`signin-container ${isBusiness ? 'business-mode' : ''}`}>
        <div className="signin-card">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h2>Check your email for the one-time code</h2>
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
        {authMethod === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
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
                {isBusiness ? 'Business Email' : 'Email Address'}
              </label>
              <input
                id="identifier"
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
        ) : (
          <>
            {!codeSent ? (
              <form onSubmit={handleSendSMSCode}>
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
                  <label htmlFor="phone">
                    {isBusiness ? 'Business Phone' : 'Phone Number'}
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || '')}
                    className="phone-input-wrapper"
                    style={{
                      '--PhoneInputCountryFlag-height': '1.5em',
                      '--PhoneInputCountrySelectArrow-opacity': '0.5'
                    } as React.CSSProperties}
                  />
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading || oauthLoading !== null || !phoneNumber} className={`submit-button ${isBusiness ? 'business-button' : ''}`}>
                  {loading ? (
                    <span className="loading-text">
                      <span className="loading-dots">Sending code</span>
                      <span className="dot-animation">...</span>
                    </span>
                  ) : (
                    '📱 Send Code'
                  )}
                </button>
              </form>
            ) : (
              <div className="sms-verification-container">
                <p className="verification-message">
                  Enter the 6-digit code sent to <strong>{phoneNumber}</strong>
                </p>

                <div className="code-inputs">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (codeInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="code-input"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <div className="resend-container">
                  <button
                    onClick={handleResendCode}
                    disabled={countdown > 0 || verifying}
                    className="resend-button"
                  >
                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
                  </button>
                  <button
                    onClick={handleUseDifferentNumber}
                    className="different-number-link"
                  >
                    Use different number
                  </button>
                </div>

                {verifying && (
                  <div className="verifying-indicator">
                    Verifying...
                  </div>
                )}
              </div>
            )}
          </>
        )}

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
