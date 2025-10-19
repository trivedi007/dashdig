'use client';

import { useState } from 'react';
import { generateSmartUrl, testSmartUrlGenerator } from '../../lib/smartUrlGenerator';

export default function SmartUrlDemo() {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<any>(null);

  const testUrls = [
    'https://www.bjs.com/product/harrys-5-blade-razor-handle-value-pack/3000000000003879255',
    'https://www.amazon.com/dp/B08N5WRWNW',
    'https://www.amazon.com/Echo-Dot-5th-Gen-Smart-speaker/dp/B09B8V1LZ3',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.nytimes.com/2025/01/15/technology/ai-regulation-congress.html',
    'https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets',
    'https://www.hoka.com/en/us/mens-everyday-running-shoes/bondi-9/197634740874.html',
    'https://www.nike.com/t/vaporfly-3-mens-road-racing-shoes',
  ];

  const handleGenerate = () => {
    if (!inputUrl) return;
    const smartUrl = generateSmartUrl(inputUrl);
    setResult(smartUrl);
  };

  const handleTestUrl = (url: string) => {
    setInputUrl(url);
    const smartUrl = generateSmartUrl(url);
    setResult(smartUrl);
  };

  const runAllTests = () => {
    testSmartUrlGenerator();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ⚡ Dashdig Smart URLs
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
          Transform cryptic URLs into human-readable Smart Links
        </p>

        {/* Input Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Try It Out
          </h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Paste any URL here..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{
                flex: 1,
                padding: '15px 20px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                outline: 'none',
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              style={{
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Generate Smart URL
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '30px',
              marginTop: '20px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>
                Result:
              </h3>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#667eea',
                marginBottom: '20px',
                padding: '15px',
                background: 'white',
                borderRadius: '8px'
              }}>
                dashdig.com/{result.slug}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <strong>Confidence:</strong>
                  <span style={{
                    marginLeft: '10px',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    background: result.confidence === 'high' ? '#10b981' : 
                               result.confidence === 'medium' ? '#f59e0b' : '#ef4444',
                    color: 'white',
                    fontSize: '14px',
                  }}>
                    {result.confidence}
                  </span>
                </div>
                <div>
                  <strong>Slug Length:</strong> {result.slug.length} chars
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <strong>Components:</strong>
                <div style={{ 
                  marginTop: '10px', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '10px' 
                }}>
                  {result.components.merchant && (
                    <span style={{
                      padding: '8px 16px',
                      background: '#dbeafe',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      🏪 {result.components.merchant}
                    </span>
                  )}
                  {result.components.brand && (
                    <span style={{
                      padding: '8px 16px',
                      background: '#fef3c7',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      🏷️ {result.components.brand}
                    </span>
                  )}
                  {result.components.product && (
                    <span style={{
                      padding: '8px 16px',
                      background: '#d1fae5',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      📦 {result.components.product}
                    </span>
                  )}
                  {result.components.modifier && (
                    <span style={{
                      padding: '8px 16px',
                      background: '#e9d5ff',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      ✨ {result.components.modifier}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Example URLs */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Example URLs
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {testUrls.map((url, index) => (
              <div
                key={index}
                onClick={() => handleTestUrl(url)}
                style={{
                  padding: '15px 20px',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>
                  Click to test
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {url}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Run All Tests Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={runAllTests}
            style={{
              padding: '15px 40px',
              fontSize: '16px',
              fontWeight: '600',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            🧪 Run All Tests (Check Console)
          </button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Open browser console (F12) to see detailed test results
          </p>
        </div>

        {/* Features List */}
        <div style={{ marginTop: '60px', borderTop: '2px solid #e0e0e0', paddingTop: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '30px' }}>
            ✨ Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎯</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                Semantic Understanding
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Extracts merchant, brand, and product info from URLs
              </p>
            </div>
            
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>📝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                PascalCase Format
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Clean, readable slugs like BJs.Harrys.5Blade
              </p>
            </div>
            
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>✂️</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                Smart Truncation
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Keeps URLs under 50 characters while preserving meaning
              </p>
            </div>
            
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>🚫</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                Tracking Removal
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Strips utm_* and other tracking parameters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

