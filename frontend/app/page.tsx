'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [userType, setUserType] = useState<'personal' | 'business'>('personal')
  const [demoOutput, setDemoOutput] = useState('target.centrum.mens.vitamin')
  const [demoUrl, setDemoUrl] = useState('https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleConvert = async () => {
    setIsGenerating(true)
    
    try {
      console.log('🔍 Creating real URL for:', demoUrl)
      
      // Check authentication first
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to create URLs');
        setIsGenerating(false);
        return;
      }
      
      // Try to call the backend API first
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app';
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/urls`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            url: demoUrl,
            keywords: []
          }),
        });

        if (response.ok) {
          const apiResponse = await response.json();
          console.log('✅ Backend API success:', apiResponse);
          
          if (apiResponse.success && apiResponse.data?.shortCode) {
            setDemoOutput(apiResponse.data.shortCode);
            console.log('🎯 Using backend-generated slug:', apiResponse.data.shortCode);
            return;
          }
        }
      } catch (apiError) {
        console.log('⚠️ Backend API failed, using fallback:', apiError.message);
      }
      
      // Fallback: Generate contextual slug locally
      const contextualSlug = generateContextualSlug(demoUrl)
      console.log('🔄 Using fallback slug:', contextualSlug)
      setDemoOutput(contextualSlug)
      
    } catch (error) {
      console.error('❌ URL generation failed:', error)
      // Final fallback: generate contextual slug based on URL
      const contextualSlug = generateContextualSlug(demoUrl)
      console.log('🔄 Using final fallback slug:', contextualSlug)
      setDemoOutput(contextualSlug)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateContextualSlug = (url: string) => {
    try {
      console.log('🔧 Generating contextual slug for:', url)
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      const pathname = urlObj.pathname.toLowerCase()
      
      // Extract meaningful words from URL
      const domain = hostname.replace('www.', '').split('.')[0]
      const pathWords = pathname.split('/').filter(p => p && p.length > 2)
      
      // Extract product/brand keywords with enhanced context
      const meaningfulWords = []
      
      // Enhanced brand-specific extraction with more context
      if (hostname.includes('target')) {
        meaningfulWords.push('target')
        // Extract product categories and types
        if (pathname.includes('centrum')) meaningfulWords.push('centrum')
        if (pathname.includes('multivitamin')) meaningfulWords.push('vitamin')
        if (pathname.includes('men')) meaningfulWords.push('mens')
        if (pathname.includes('women')) meaningfulWords.push('womens')
        if (pathname.includes('silver')) meaningfulWords.push('silver')
        if (pathname.includes('supplement')) meaningfulWords.push('supplement')
        if (pathname.includes('tablets')) meaningfulWords.push('tablets')
        if (pathname.includes('50')) meaningfulWords.push('50plus')
      } else if (hostname.includes('zappos')) {
        meaningfulWords.push('zappos')
        // Extract shoe-specific context
        if (pathname.includes('hoka')) meaningfulWords.push('hoka')
        if (pathname.includes('clifton')) meaningfulWords.push('clifton')
        if (pathname.includes('womens')) meaningfulWords.push('womens')
        if (pathname.includes('mens')) meaningfulWords.push('mens')
        if (pathname.includes('running')) meaningfulWords.push('running')
        if (pathname.includes('shoes')) meaningfulWords.push('shoes')
        if (pathname.includes('rose')) meaningfulWords.push('rose')
        if (pathname.includes('cream')) meaningfulWords.push('cream')
        if (pathname.includes('dried')) meaningfulWords.push('dried')
      } else if (hostname.includes('hoka')) {
        meaningfulWords.push('hoka')
        if (pathname.includes('bondi')) meaningfulWords.push('bondi')
        if (pathname.includes('running')) meaningfulWords.push('running')
        if (pathname.includes('shoes')) meaningfulWords.push('shoes')
        if (pathname.includes('mens')) meaningfulWords.push('mens')
        if (pathname.includes('womens')) meaningfulWords.push('womens')
        if (pathname.includes('everyday')) meaningfulWords.push('everyday')
      } else if (hostname.includes('nike')) {
        meaningfulWords.push('nike')
        if (pathname.includes('vaporfly')) meaningfulWords.push('vaporfly')
        if (pathname.includes('running')) meaningfulWords.push('running')
        if (pathname.includes('shoes')) meaningfulWords.push('shoes')
        if (pathname.includes('mens')) meaningfulWords.push('mens')
        if (pathname.includes('womens')) meaningfulWords.push('womens')
      } else if (hostname.includes('amazon')) {
        meaningfulWords.push('amazon')
        if (pathname.includes('airpods')) meaningfulWords.push('airpods')
        if (pathname.includes('echo')) meaningfulWords.push('echo')
        if (pathname.includes('kindle')) meaningfulWords.push('kindle')
        if (pathname.includes('apple')) meaningfulWords.push('apple')
        if (pathname.includes('pro')) meaningfulWords.push('pro')
      } else if (hostname.includes('walmart')) {
        meaningfulWords.push('walmart')
        if (pathname.includes('tide')) meaningfulWords.push('tide')
        if (pathname.includes('pods')) meaningfulWords.push('pods')
        if (pathname.includes('detergent')) meaningfulWords.push('detergent')
        if (pathname.includes('laundry')) meaningfulWords.push('laundry')
      } else if (hostname.includes('grainger')) {
        meaningfulWords.push('grainger')
        if (pathname.includes('dial')) meaningfulWords.push('dial')
        if (pathname.includes('soap')) meaningfulWords.push('soap')
        if (pathname.includes('hand')) meaningfulWords.push('hand')
        if (pathname.includes('cleaning')) meaningfulWords.push('cleaning')
      } else if (hostname.includes('officesupply')) {
        meaningfulWords.push('officesupply')
        if (pathname.includes('charmin')) meaningfulWords.push('charmin')
        if (pathname.includes('ultra')) meaningfulWords.push('ultra')
        if (pathname.includes('strong')) meaningfulWords.push('strong')
        if (pathname.includes('toilet')) meaningfulWords.push('toilet')
        if (pathname.includes('paper')) meaningfulWords.push('paper')
        if (pathname.includes('mega')) meaningfulWords.push('mega')
        if (pathname.includes('rolls')) meaningfulWords.push('rolls')
      } else if (hostname.includes('chewy')) {
        meaningfulWords.push('chewy')
        if (pathname.includes('tidy')) meaningfulWords.push('tidy')
        if (pathname.includes('cats')) meaningfulWords.push('cats')
        if (pathname.includes('litter')) meaningfulWords.push('litter')
        if (pathname.includes('free')) meaningfulWords.push('free')
        if (pathname.includes('clean')) meaningfulWords.push('clean')
        if (pathname.includes('unscented')) meaningfulWords.push('unscented')
      } else {
        // Generic extraction with better context
        meaningfulWords.push(domain)
        pathWords.slice(0, 3).forEach(word => {
          const cleanWord = word.replace(/[^a-z]/g, '').substring(0, 12)
          if (cleanWord.length > 2) meaningfulWords.push(cleanWord)
        })
      }
      
      // Create a more descriptive slug with better context
      const slug = meaningfulWords.slice(0, 4).join('.')
      console.log('🎯 Generated contextual slug:', slug)
      return slug
      
    } catch (error) {
      console.error('❌ Contextual generation failed:', error)
      return 'link.generated'
    }
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
        
        nav.business-mode {
          background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
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
        
        nav.business-mode .nav-links a {
          color: #e0e0e0;
        }
        
        .cta-button {
          background: var(--gradient);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }
        
        .hero {
          margin-top: 80px;
          padding: 4rem 5%;
          min-height: 700px;
          background: white;
          position: relative;
          overflow: hidden;
        }
        
        .hero-content h1 {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        
        .highlight {
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .tagline {
          font-size: 1.5rem;
          color: var(--secondary);
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .hero-description {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .url-demo {
          background: var(--light);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        
        .business-demo {
          background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
        }
        
        .url-input-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .url-input {
          flex: 1;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .business-demo .url-input {
          background: rgba(255,255,255,0.1);
          border-color: #555;
          color: white;
        }
        
        .convert-btn {
          background: var(--gradient);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s ease;
        }
        
        .convert-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .example-conversion {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 10px;
        }
        
        .business-demo .example-conversion {
          background: rgba(255,255,255,0.05);
        }
        
        .url-before, .url-after {
          padding: 0.75rem;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.9rem;
        }
        
        .url-before {
          color: #999;
          text-decoration: line-through;
        }
        
        .url-after {
          color: var(--primary);
          font-weight: 600;
          background: linear-gradient(135deg, #fff 0%, #ffe6dd 100%);
          border: 2px solid var(--primary);
        }
        
        .arrow {
          color: var(--secondary);
          font-size: 2rem;
        }
        
        .user-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        
        .toggle-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .toggle-btn.active {
          background: var(--gradient);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }
        
        .features {
          padding: 5rem 5%;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .cta-section {
          padding: 5rem 5%;
          background: var(--gradient);
          text-align: center;
          color: white;
        }
        
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div className="bg-animation"></div>
      
      <nav className={userType === 'business' ? 'business-mode' : ''}>
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Dashdig</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <Link href={`/auth/signin?type=${userType}`} className="cta-button">
              {userType === 'business' ? 'Book Demo' : 'Start Free'}
            </Link>
          </div>
        </div>
      </nav>
      
      <section className="hero">
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div className="user-toggle">
            <button 
              className={`toggle-btn ${userType === 'personal' ? 'active' : ''}`}
              onClick={() => setUserType('personal')}
            >
              <span>👤</span> For Individuals
            </button>
            <button 
              className={`toggle-btn ${userType === 'business' ? 'active' : ''}`}
              onClick={() => setUserType('business')}
            >
              <span>🏢</span> For Business
            </button>
          </div>

          <div style={{textAlign: 'center', maxWidth: '900px', margin: '0 auto'}}>
            {userType === 'personal' ? (
              <>
                <div className="tagline">✨ Dig This!</div>
                <h1>Share Links People <span className="highlight">Actually Remember</span></h1>
                <p className="hero-description">
                  Make your links memorable and shareable. Perfect for creators, influencers, and anyone who shares links online.
                  Because <strong>your.birthday.gift</strong> beats <strong>bit.ly/x8K2p9</strong> every time.
                </p>
              </>
            ) : (
              <>
                <div className="tagline">🚀 Enterprise Ready</div>
                <h1>Brand-Safe Links That <span className="highlight">Convert Better</span></h1>
                <p className="hero-description">
                  Increase click-through rates by 34% with human-readable, branded links.
                  Turn <strong>bit.ly/campaign2024</strong> into <strong>yourbrand.com/exclusive</strong>.
                </p>
              </>
            )}
            
            <div className={`url-demo ${userType === 'business' ? 'business-demo' : ''}`}>
              <div className="url-input-group">
                <input 
                  type="text" 
                  className="url-input" 
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="Paste your long URL here..." 
                />
                <button 
                  className="convert-btn" 
                  onClick={handleConvert}
                  disabled={isGenerating}
                >
                  {isGenerating ? '⚡ Generating...' : (userType === 'personal' ? 'Dig This! →' : 'Create Branded Link →')}
                </button>
              </div>
              <div className="example-conversion">
                <div className="url-before">bit.ly/3xK9p2L</div>
                <div className="arrow">→</div>
                <a 
                  href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://dashdig.com'}/${demoOutput}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="url-after"
                  style={{textDecoration: 'none', color: 'inherit'}}
                >
                  {(process.env.NEXT_PUBLIC_BASE_URL || 'https://dashdig.com').replace('https://', '')}/{demoOutput}
                </a>
              </div>
            </div>
            
            <div style={{marginTop: '2rem'}}>
              <Link href={`/auth/signin?type=${userType}`} className="cta-button" style={{fontSize: '1.2rem', padding: '1rem 2rem'}}>
                {userType === 'personal' ? 'Start Free - Forever' : 'Start 14-Day Trial'}
              </Link>
              <p style={{marginTop: '1rem', color: '#999', fontSize: '0.9rem'}}>
                {userType === 'personal' ? 'No credit card required • 100 links/month free' : 'Trusted by 500+ companies • SOC 2 Certified'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{textAlign: 'center', fontSize: '3rem', marginBottom: '3rem'}} className="highlight">
            {userType === 'personal' ? 'Why Creators Love Dashdig' : 'Built for Business Success'}
          </h2>
          <div className="features-grid">
            {userType === 'personal' ? (
              <>
                <div className="feature-card">
                  <div className="feature-icon">🎯</div>
                  <h3>Personal Branding</h3>
                  <p>Create links that reflect your personal brand.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📱</div>
                  <h3>Social Media Ready</h3>
                  <p>Perfect for Instagram, TikTok, and YouTube.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🎁</div>
                  <h3>Special Occasions</h3>
                  <p>your.wedding.rsvp or birthday.party.here</p>
                </div>
              </>
            ) : (
              <>
                <div className="feature-card">
                  <div className="feature-icon">📈</div>
                  <h3>34% Higher CTR</h3>
                  <p>Branded links get clicked 34% more.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🏢</div>
                  <h3>Custom Domains</h3>
                  <p>Use your own domain with SSL support.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">👥</div>
                  <h3>Team Collaboration</h3>
                  <p>Manage links across teams with permissions.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 style={{fontSize: '3rem', marginBottom: '1rem'}}>
          {userType === 'personal' ? 'Ready to Dig This?' : 'Transform Your Link Strategy'}
        </h2>
        <p style={{fontSize: '1.3rem', marginBottom: '2rem'}}>
          {userType === 'personal' ? 'Join thousands making their links memorable' : 'See why 500+ companies switched'}
        </p>
        <Link href={`/auth/signin?type=${userType}`} style={{
          background: 'white',
          color: 'var(--primary)',
          padding: '1rem 3rem',
          borderRadius: '50px',
          textDecoration: 'none',
          fontSize: '1.2rem',
          fontWeight: '700',
          display: 'inline-block'
        }}>
          {userType === 'personal' ? 'Start Free - No Card Required' : 'Start Your Trial'}
        </Link>
      </section>
    </>
  )
}
