'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

// API Base URL for backend calls
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app';
const SHORT_URL_BASE = (process.env.NEXT_PUBLIC_SHORT_URL_BASE || 'https://dashdig.com').replace(/\/$/, '');

export default function LandingPage() {
  const [userType, setUserType] = useState<'personal' | 'business'>('personal')
  const defaultSlug = 'target.centrum.mens.vitamin'
  const [demoUrl, setDemoUrl] = useState('https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets')
  const [demoOutput, setDemoOutput] = useState(defaultSlug)
  const [demoShortUrl, setDemoShortUrl] = useState(`${SHORT_URL_BASE}/${defaultSlug}`)
  const [isGenerating, setIsGenerating] = useState(false)

  const buildShortLink = (slug: string) => `${SHORT_URL_BASE}/${slug}`

  const currentShortLink = demoShortUrl || buildShortLink(demoOutput)

  const handleConvert = async () => {
    setIsGenerating(true)
    
    const applyResult = (slug: string, shortUrl?: string) => {
      const finalSlug = slug || generateContextualSlug(demoUrl)
      const finalShort = (shortUrl || buildShortLink(finalSlug)).replace(/\/$/, '')
      setDemoOutput(finalSlug)
      setDemoShortUrl(finalShort)
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const sharedPayload = JSON.stringify({
        url: demoUrl,
        keywords: []
      })

      if (token) {
        const response = await fetch(`${API_BASE}/api/shorten`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: sharedPayload,
        })

        if (response.ok) {
          const apiResponse = await response.json()
          const slug = apiResponse.shortCode || apiResponse.data?.shortCode || apiResponse.data?.slug
          if (slug) {
            applyResult(slug, apiResponse.shortUrl || apiResponse.data?.shortUrl)
            return
          }
        }
      }

      const demoResponse = await fetch(`${API_BASE}/demo-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: sharedPayload,
      })

      if (demoResponse.ok) {
        const demoJson = await demoResponse.json()
        const slug = demoJson?.data?.slug
        if (slug) {
          applyResult(slug, demoJson.data?.shortUrl)
          return
        }
      }

      throw new Error('Failed to create short URL')
    } catch (error) {
      console.error('Error:', error)
      const slug = generateContextualSlug(demoUrl)
      applyResult(slug)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Sora', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-weight: 400;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Sora', 'Inter', Arial, sans-serif;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        
        :root {
          --primary: #FF6B2C;
          --secondary: #FF8C5C;
          --gradient: linear-gradient(135deg, #FF6B2C 0%, #FF8C5C 100%);
        }

        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          border-bottom: 1px solid #E5E7EB;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .nav-link {
          color: #4B5563;
          text-decoration: none;
          font-weight: 500;
          font-family: 'Sora', 'Inter', Arial, sans-serif;
          transition: color 0.2s;
        }
        
        .nav-link:hover {
          color: var(--primary);
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }
        
        .btn-primary {
          background: var(--gradient);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 107, 44, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 44, 0.4);
        }
        
        .btn-secondary {
          background: white;
          color: var(--primary);
          border: 2px solid var(--primary);
        }
        
        .btn-secondary:hover {
          background: rgba(255, 107, 44, 0.1);
        }
        
        .hero {
          padding: 4rem 0;
          text-align: center;
        }
        
        .hero h1 {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          color: #1F2937;
        }
        
        .hero .highlight {
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-description {
          font-size: 1.25rem;
          color: #6B7280;
          font-weight: 500;
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .tab-selector {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
        }
        
        .tab {
          padding: 1rem 2rem;
          border-radius: 12px;
          border: 2px solid #E5E7EB;
          background: white;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Sora', 'Inter', Arial, sans-serif;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .tab.active {
          background: var(--gradient);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(255, 107, 44, 0.3);
        }
        
        .demo-box {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          max-width: 900px;
          margin: 0 auto;
        }
        
        .input-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .input-group input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 107, 44, 0.1);
        }
        
        .transform-arrow {
          text-align: center;
          font-size: 2rem;
          color: var(--primary);
          margin: 1.5rem 0;
        }
        
        .output-box {
          background: linear-gradient(135deg, #FFF5F0 0%, #FFE9DD 100%);
          border: 2px solid var(--primary);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }
        
        .output-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        
        .output-url {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1F2937;
          font-family: 'Monaco', 'Courier New', monospace;
        }
        
        .features {
          padding: 5rem 0;
          background: linear-gradient(180deg, #F9FAFB 0%, white 100%);
          scroll-margin-top: 80px;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: #1F2937;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        .feature-card {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(255, 107, 53, 0.2);
          border-color: var(--primary);
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1F2937;
        }

        .feature-card p {
          color: #6B7280;
          line-height: 1.6;
          font-weight: 400;
          font-size: 1rem;
        }

        .url-comparison {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #F9FAFB;
          border-radius: 12px;
          font-family: 'Monaco', 'Courier New', monospace;
        }

        .url-comparison .before {
          color: #EF4444;
          text-decoration: line-through;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .url-comparison .after {
          color: #10B981;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .pricing {
          padding: 5rem 0;
          background: white;
          scroll-margin-top: 80px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
          }
        }

        .pricing-card {
          background: white;
          border: 2px solid #E5E7EB;
          border-radius: 20px;
          padding: 2.5rem;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
        }

        .pricing-card:nth-child(1) { animation-delay: 0.1s; }
        .pricing-card:nth-child(2) { animation-delay: 0.2s; }
        .pricing-card:nth-child(3) { animation-delay: 0.3s; }

        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .pricing-card.featured {
          border-color: var(--primary);
          box-shadow: 0 8px 30px rgba(255, 107, 53, 0.2);
          transform: scale(1.05);
        }

        .pricing-card.featured:hover {
          transform: scale(1.05) translateY(-8px);
        }

        .pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--gradient);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .pricing-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1F2937;
        }

        .pricing-price {
          font-size: 3rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 0.5rem;
        }

        .pricing-price span {
          font-size: 1.25rem;
          color: #6B7280;
          font-weight: 400;
        }

        .pricing-description {
          color: #6B7280;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .pricing-features {
          list-style: none;
          margin-bottom: 2rem;
        }

        .pricing-features li {
          padding: 0.75rem 0;
          color: #4B5563;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .pricing-features li:before {
          content: '✓';
          color: #10B981;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .pricing-cta {
          width: 100%;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-align: center;
          display: block;
          text-decoration: none;
        }

        .pricing-cta.primary {
          background: var(--gradient);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .pricing-cta.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }

        .pricing-cta.secondary {
          background: white;
          color: var(--primary);
          border: 2px solid var(--primary);
        }

        .pricing-cta.secondary:hover {
          background: rgba(255, 107, 44, 0.1);
        }
        
        .cta-section {
          padding: 5rem 0;
          text-align: center;
          background: var(--gradient);
          color: white;
        }
        
        .cta-section h2 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        
        .cta-section p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          font-weight: 500;
        }
        
        .footer {
          padding: 3rem 0;
          background: #1F2937;
          color: white;
          text-align: center;
        }
        
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .footer-link {
          color: #9CA3AF;
          text-decoration: none;
          font-family: 'Sora', 'Inter', Arial, sans-serif;
          transition: color 0.2s;
        }
        
        .footer-link:hover {
          color: white;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="container">
        {/* Navigation */}
        <nav className="nav">
          <Logo linkTo="/" showTagline={true} />
          
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <Link href="/auth/signin" className="btn btn-primary">Start Free</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <h1>
            Stop Using Cryptic Links. Create URLs People<br />
            <span className="highlight">Actually Remember.</span>
          </h1>
          
          <p className="hero-description">
            Transform bit.ly/3xK9m2L into dashdig.com/Best.Coffee.In.Seattle
          </p>

          {/* Tab Selector */}
          <div className="tab-selector">
            <div 
              className={`tab ${userType === 'personal' ? 'active' : ''}`}
              onClick={() => setUserType('personal')}
            >
              <span>👤</span> For Individuals
            </div>
            <div 
              className={`tab ${userType === 'business' ? 'active' : ''}`}
              onClick={() => setUserType('business')}
            >
              <span>💼</span> For Business
            </div>
          </div>

          {/* Demo Box */}
          <div className="demo-box">
            <div className="input-group">
              <input 
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="Paste your long URL here..."
              />
              <button 
                className="btn btn-primary"
                onClick={handleConvert}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <><span className="spinner"></span> Generating...</>
                ) : (
                  <>⚡ Dig this! →</>
                )}
              </button>
            </div>

            <div className="transform-arrow">↓</div>

        <div className="output-box">
          <div className="output-label">Your Human-Readable URL</div>
          <div className="output-url">
            <a 
              href={currentShortLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#1F2937', textDecoration: 'none', fontWeight: 600 }}
            >
              {currentShortLink.replace(/^https?:\/\//, '')}
            </a>
          </div>
        </div>
          </div>

          <Link href="/auth/signin" className="btn btn-primary" style={{ marginTop: '2rem', fontSize: '1.2rem', padding: '1rem 2rem', display: 'inline-block' }}>
            ⚡ Start Humanizing URLs Free
          </Link>
          <p style={{ marginTop: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>
            No credit card required • 100 links/month free
          </p>
        </section>

        {/* Features Section */}
        <section className="features" id="features">
          <h2 className="section-title">
            Why Choose <span className="highlight">Dashdig</span>?
          </h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-brain" style={{ color: 'white' }}></i>
              </div>
              <h3>Human-Readable URLs</h3>
              <p>AI-powered contextual names like walmart.tide.pods instead of cryptic bit.ly/3xKf9mP</p>
              <div className="url-comparison">
                <div className="before">❌ bit.ly/3xKf9mP</div>
                <div className="after">✓ walmart.tide.pods</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bolt" style={{ color: 'white' }}></i>
              </div>
              <h3>Lightning Fast Performance</h3>
              <p>Sub-100ms redirects with global CDN. Your links load instantly, anywhere.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-qrcode" style={{ color: 'white' }}></i>
              </div>
              <h3>Automatic QR Codes</h3>
              <p>Every short URL gets a beautiful, customizable QR code. Download PNG, SVG, or PDF.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line" style={{ color: 'white' }}></i>
              </div>
              <h3>Advanced Analytics</h3>
              <p>Track clicks, geography, devices, referrers. Know exactly how your links perform.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing" id="pricing">
          <h2 className="section-title">
            Simple, Transparent <span className="highlight">Pricing</span>
          </h2>

          <div className="pricing-grid">
            {/* Free Tier */}
            <div className="pricing-card">
              <div className="pricing-name">Free</div>
              <div className="pricing-price">
                $0<span>/month</span>
              </div>
              <div className="pricing-description">Perfect for trying out Dashdig</div>
              <ul className="pricing-features">
                <li>100 links per month</li>
                <li>Human-readable URLs</li>
                <li>Basic analytics</li>
                <li>Automatic QR codes</li>
                <li>Community support</li>
              </ul>
              <Link href="/auth/signin" className="pricing-cta secondary">
                Start Free
              </Link>
            </div>

            {/* Pro Tier - Featured */}
            <div className="pricing-card featured">
              <div className="pricing-badge">⚡ Most Popular</div>
              <div className="pricing-name">Pro</div>
              <div className="pricing-price">
                $29<span>/month</span>
              </div>
              <div className="pricing-description">For professionals and growing businesses</div>
              <ul className="pricing-features">
                <li>Unlimited links</li>
                <li>Advanced analytics</li>
                <li>Custom domains</li>
                <li>API access</li>
                <li>Priority support</li>
                <li>Team collaboration</li>
              </ul>
              <Link href="/auth/signin" className="pricing-cta primary">
                ⚡ Dig This!
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="pricing-card">
              <div className="pricing-name">Enterprise</div>
              <div className="pricing-price">
                Custom
              </div>
              <div className="pricing-description">For large organizations with specific needs</div>
              <ul className="pricing-features">
                <li>Everything in Pro</li>
                <li>White-label solution</li>
                <li>SSO/SAML authentication</li>
                <li>Dedicated support</li>
                <li>Custom SLA</li>
                <li>On-premise option</li>
              </ul>
              <Link href="/auth/signin" className="pricing-cta secondary">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Humanize Your URLs?</h2>
          <p>Join thousands of marketers, creators, and businesses using Dashdig</p>
          <Link href="/auth/signin" className="btn btn-primary" style={{ background: 'white', color: 'var(--primary)' }}>
            Get Started - It's Free
          </Link>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Logo linkTo="/" showTagline={true} />
          </div>
          
          <div className="footer-links">
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Features</a>
            <a href="#" className="footer-link">Pricing</a>
            <Link href="/docs" className="footer-link">Docs</Link>
            <a href="#" className="footer-link">Blog</a>
            <Link href="/terms" className="footer-link">Terms</Link>
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <a href="mailto:support@dashdig.com" className="footer-link">Contact</a>
          </div>
          
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            © 2025 Dashdig. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </>
  )
}

// Helper function to generate contextual slug from URL
function generateContextualSlug(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(p => p && p.length > 2);
    
    // Extract meaningful words
    const words = parts.flatMap(part => 
      part.split(/[-_]/)
        .filter(word => word.length > 2)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    );
    
    // Take first 3-4 meaningful words
    return words.slice(0, 4).join('.') || 'link';
  } catch {
    return 'link';
  }
}
