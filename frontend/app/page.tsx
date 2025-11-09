'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generateSmartUrl } from '../lib/smartUrlGenerator'
import { generateAISmartSlug } from '../lib/aiUrlAnalyzer'

// API Base URL for backend calls (NO /api suffix - routes handle it)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';

export default function LandingPage() {
  const [userType, setUserType] = useState<'personal' | 'business'>('personal')
  const [demoOutput, setDemoOutput] = useState('target.centrum.mens.vitamin')
  const [demoUrl, setDemoUrl] = useState('https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleConvert = async () => {
    setIsGenerating(true)
    
    try {
      console.log('🔍 Creating AI-Powered Smart URL for:', demoUrl)
      
      // Try AI-powered generation first
      const aiSlugResult = await generateAISmartSlug(demoUrl);
      console.log('🤖 AI Smart URL generated:', aiSlugResult);
      console.log('📊 Confidence:', aiSlugResult.confidence);
      console.log('🎯 Source:', aiSlugResult.source);
      console.log('🧩 Components:', aiSlugResult.components);
     
      let finalSlug;

      if (aiSlugResult.source === 'ai' || aiSlugResult.source === 'cache') {
        console.log('✨ Using AI-generated slug');
        finalSlug = aiSlugResult.slug;
        setDemoOutput(finalSlug);
      } else {
        // Fallback to regex-based generation
        console.log('🔄 AI unavailable, using regex-based Smart URL');
        const smartUrlResult = generateSmartUrl(demoUrl);
        finalSlug = smartUrlResult.slug;
        setDemoOutput(finalSlug);
      }

      // Save to backend with comprehensive error handling
      try {
        const requestBody = {
          url: demoUrl,
          customSlug: finalSlug,
        };
        
        console.log('📤 Sending POST request to:', `${API_BASE}/api/urls`);
        console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(`${API_BASE}/api/urls`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
        });

        console.log('📥 Response status:', response.status, response.statusText);
        
        if (response.ok) {
          const apiResponse = await response.json();
          console.log('✅ Smart URL saved to backend:', apiResponse);
          
          // Update display with backend-generated URL if available
          if (apiResponse.data?.slug) {
            setDemoOutput(apiResponse.data.slug);
            console.log('🔄 Updated display with backend slug:', apiResponse.data.slug);
          }
        } else {
          // Handle error responses
          const errorText = await response.text();
          console.error('❌ Backend save failed:');
          console.error('   Status:', response.status, response.statusText);
          console.error('   Response:', errorText);
          
          // Try to parse as JSON for detailed error
          try {
            const errorJson = JSON.parse(errorText);
            console.error('   Error details:', errorJson);
          } catch {
            // Response wasn't JSON, already logged as text
          }
        }
      } catch (apiError: any) {
        console.error('❌ Network error saving to backend:', apiError);
        console.error('   Error type:', apiError.name);
        console.error('   Error message:', apiError.message);
        // Don't block UI - user can still see the generated slug
      }
      
    } catch (error) {
      console.error('❌ AI Smart URL generation failed:', error)
      // Final fallback: use regex-based Smart URL
      try {
        const smartUrlResult = generateSmartUrl(demoUrl);
        setDemoOutput(smartUrlResult.slug);
      } catch (fallbackError) {
        // Ultimate fallback: use old contextual slug
        const contextualSlug = generateContextualSlug(demoUrl)
        console.log('🔄 Using final fallback slug:', contextualSlug)
        setDemoOutput(contextualSlug)
      }
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
          gap: 8px;
          cursor: pointer;
        }
        
        .logo-icon {
          font-size: 32px;
        }
        
        .logo-text {
          font-size: 28px;
          font-weight: 800;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .nav-tagline {
          font-size: 11px;
          color: #7F8C8D;
          font-style: italic;
          margin-top: -4px;
          font-weight: 500;
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
          font-size: 16px;
          color: rgba(255, 107, 53, 0.95);
          font-weight: 600;
          font-style: italic;
          letter-spacing: 0.3px;
          margin-top: 8px;
          margin-bottom: 2rem;
        }
        
        .brand-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .brand-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        
        .lightning {
          font-size: 3rem;
          filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3));
        }
        
        .hero-headline {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }
        
        .hero-subheadline {
          font-size: 1.3rem;
          color: #666;
          margin-bottom: 2.5rem;
          font-weight: 500;
        }
        
        .primary-cta {
          background: var(--gradient);
          color: white;
          border: none;
          padding: 1.2rem 2.5rem;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          transition: all 0.3s ease;
        }
        
        .primary-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
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
        
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          font-weight: 700;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-card {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }
        
        .feature-icon {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
        }
        
        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--dark);
          font-weight: 700;
        }
        
        .feature-card p {
          color: #666;
          line-height: 1.6;
          font-size: 1.05rem;
        }
        
        .cta-section {
          padding: 5rem 5%;
          background: var(--gradient);
          text-align: center;
          color: white;
        }
        
        .footer {
          background: var(--dark);
          color: white;
          padding: 4rem 5%;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
        }
        
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.5rem;
        }
        
        .footer-logo .logo-text {
          font-size: 24px;
          font-weight: 800;
        }
        
        .footer-logo .lightning {
          font-size: 24px;
        }
        
        .footer-tagline {
          font-size: 14px;
          color: #7F8C8D;
          font-style: italic;
          margin-top: 4px;
          margin-bottom: 1rem;
        }
        
        .footer-copyright {
          font-size: 13px;
          color: #999;
        }
        
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        
        .footer-column h4 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }
        
        .footer-column ul {
          list-style: none;
          padding: 0;
        }
        
        .footer-column li {
          margin-bottom: 0.75rem;
        }
        
        .footer-column a {
          color: #999;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }
        
        .footer-column a:hover {
          color: var(--primary);
        }
        
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .footer-links {
            grid-template-columns: 1fr;
          }
          
          .brand-title {
            font-size: 2.5rem;
          }
          
          .hero-headline {
            font-size: 2rem;
          }
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
            <div className="brand-header">
              <h1 className="brand-title">
                <span className="logo-text">Dashdig</span>
                <span className="lightning">⚡</span>
              </h1>
              <p className="tagline">Humanize and Shortenize URLs</p>
            </div>

            {userType === 'personal' ? (
              <>
                <h2 className="hero-headline">
                  Stop Using Cryptic Links. Create URLs People Actually Remember.
                </h2>
                <p className="hero-subheadline">
                  Transform <strong>bit.ly/3xK9m2L</strong> into <strong>dashdig.com/Best.Coffee.In.Seattle</strong>
                </p>
              </>
            ) : (
              <>
                <h2 className="hero-headline">
                  Brand-Safe Links That Convert Better
                </h2>
                <p className="hero-subheadline">
                  Increase click-through rates by 34% with human-readable, branded links
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
                  dashdig.com/{demoOutput}
                </a>
              </div>
            </div>
            
            <div style={{marginTop: '2rem'}}>
              <Link href={`/auth/signin?type=${userType}`} style={{textDecoration: 'none'}}>
                <button className="primary-cta">
                  ⚡ {userType === 'personal' ? 'Start Humanizing URLs Free' : 'Start Enterprise Trial'}
                </button>
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
          <h2 className="section-title">
            <span className="highlight">Why Humanize and Shortenize URLs?</span>
          </h2>
          
          {/* Core Value Props - Always Show */}
          <div className="features-grid" style={{marginBottom: '4rem'}}>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Humanize</h3>
              <p>URLs that make sense to humans, not robots. AI understands your content and creates meaningful slugs.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Shortenize</h3>
              <p>Shorter than full URLs, smarter than random strings. Perfect length, perfect readability.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Memorize</h3>
              <p>Links people can actually remember and trust. No more copying and pasting cryptic codes.</p>
            </div>
          </div>

          {/* User Type Specific Features */}
          <h3 style={{textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: 'var(--dark)'}}>
            {userType === 'personal' ? 'Perfect for Creators' : 'Built for Business'}
          </h3>
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

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-text">Dashdig</span>
              <span className="lightning">⚡</span>
            </div>
            <p className="footer-tagline">Humanize and Shortenize URLs</p>
            <p className="footer-copyright">© 2025 Dashdig. All rights reserved.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/enterprise">Enterprise</Link></li>
                <li><Link href="/api">API</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/status">Status</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}