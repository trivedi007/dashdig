'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from './components/Logo'

// API Base URL for backend calls
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app';

export default function LandingPage() {
  const [userType, setUserType] = useState<'personal' | 'business'>('personal')
  const [demoUrl, setDemoUrl] = useState('https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets')
  const [demoOutput, setDemoOutput] = useState('target.centrum.mens.vitamin')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleConvert = async () => {
    setIsGenerating(true)
    
    try {
      // Try backend API
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          url: demoUrl,
          keywords: []
        }),
      });

      if (response.ok) {
        const apiResponse = await response.json();
        if (apiResponse.success && apiResponse.data?.shortCode) {
          setDemoOutput(apiResponse.data.shortCode);
          return;
        }
      }
      
      // Fallback: Generate slug locally
      const slug = generateContextualSlug(demoUrl);
      setDemoOutput(slug);
      
    } catch (error) {
      console.error('Error:', error);
      const slug = generateContextualSlug(demoUrl);
      setDemoOutput(slug);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
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
          font-weight: 800;
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
        }
        
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 3rem;
          color: #1F2937;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1F2937;
        }
        
        .feature-card p {
          color: #6B7280;
          line-height: 1.6;
        }
        
        .cta-section {
          padding: 5rem 0;
          text-align: center;
          background: var(--gradient);
          color: white;
        }
        
        .cta-section h2 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }
        
        .cta-section p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
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
                  <>⚡ Dig This! →</>
                )}
              </button>
            </div>

            <div className="transform-arrow">↓</div>

            <div className="output-box">
              <div className="output-label">Your Human-Readable URL</div>
              <div className="output-url">dashdig.com/{demoOutput}</div>
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
            <span className="highlight">Why Humanize and Shortenize URLs?</span>
          </h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Memorable URLs</h3>
              <p>Create links people can actually remember and share verbally. No more "bit dot ly slash random characters."</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>SEO-Friendly</h3>
              <p>Human-readable URLs improve click-through rates and search engine rankings with keyword-rich links.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Advanced Analytics</h3>
              <p>Track clicks, geographic data, referral sources, and conversion metrics for every link.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>AI-powered URL generation in milliseconds. Our CDN ensures redirects happen in under 50ms globally.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Enterprise Security</h3>
              <p>Link expiration, password protection, and detailed access logs to keep your URLs secure.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Brand Consistency</h3>
              <p>Custom domains, branded short URLs, and consistent naming conventions across all campaigns.</p>
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
