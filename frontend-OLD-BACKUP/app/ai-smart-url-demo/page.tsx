'use client';

import { useState } from 'react';
import { generateAISmartSlug, getCacheStats, clearCache } from '../../lib/aiUrlAnalyzer';
import { generateSmartUrl } from '../../lib/smartUrlGenerator';

export default function AISmartUrlDemo() {
  const [inputUrl, setInputUrl] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [regexResult, setRegexResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cacheStats, setCacheStats] = useState<any>(null);

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

  const handleGenerate = async () => {
    if (!inputUrl) return;
    
    setIsGenerating(true);
    setAiResult(null);
    setRegexResult(null);

    try {
      // Generate AI slug
      const ai = await generateAISmartSlug(inputUrl);
      setAiResult(ai);

      // Generate regex slug for comparison
      const regex = generateSmartUrl(inputUrl);
      setRegexResult(regex);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestUrl = (url: string) => {
    setInputUrl(url);
    setTimeout(() => handleGenerate(), 100);
  };

  const loadCacheStats = async () => {
    const stats = await getCacheStats();
    setCacheStats(stats);
  };

  const handleClearCache = async () => {
    const result = await clearCache();
    alert(`Cache cleared! ${result?.cleared || 0} entries removed.`);
    loadCacheStats();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🤖 AI-Powered Smart URLs
          </h1>
          <p style={{ fontSize: '20px', color: '#666', marginBottom: '10px' }}>
            Enhanced with Claude Sonnet 4.5
          </p>
          <div style={{ 
            display: 'inline-block',
            padding: '8px 20px',
            background: '#10b981',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Anthropic Claude API
          </div>
        </div>

        {/* Input Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Paste any URL here to compare AI vs Regex..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{
                flex: 1,
                padding: '18px 24px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                outline: 'none',
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                padding: '18px 40px',
                fontSize: '16px',
                fontWeight: '600',
                background: isGenerating ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating ? '⏳ Generating...' : '🚀 Generate'}
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        {(aiResult || regexResult) && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '30px',
            marginBottom: '40px'
          }}>
            {/* AI Result */}
            <div style={{
              background: '#f0fdf4',
              borderRadius: '16px',
              padding: '30px',
              border: '3px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '32px', marginRight: '10px' }}>🤖</div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                  AI-Powered (Claude)
                </h3>
              </div>

              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#059669',
                marginBottom: '20px',
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                wordBreak: 'break-all'
              }}>
                dashdig.com/{aiResult?.slug || 'Loading...'}
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '8px' }}>
                  <strong>Source:</strong>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    background: aiResult?.source === 'ai' ? '#10b981' :
                               aiResult?.source === 'cache' ? '#3b82f6' : '#f59e0b',
                    color: 'white'
                  }}>
                    {aiResult?.source || 'N/A'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '8px' }}>
                  <strong>Confidence:</strong>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    background: aiResult?.confidence === 'high' ? '#10b981' :
                               aiResult?.confidence === 'medium' ? '#f59e0b' : '#ef4444',
                    color: 'white'
                  }}>
                    {aiResult?.confidence || 'N/A'}
                  </span>
                </div>

                {aiResult?.aiModel && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <strong>Model:</strong>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {aiResult.aiModel}
                    </span>
                  </div>
                )}

                {aiResult?.components && Object.keys(aiResult.components).length > 0 && (
                  <div style={{ padding: '15px', background: 'white', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', marginBottom: '10px' }}>Components:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {aiResult.components.merchant && (
                        <span style={{ padding: '6px 14px', background: '#dbeafe', borderRadius: '16px', fontSize: '13px' }}>
                          🏪 {aiResult.components.merchant}
                        </span>
                      )}
                      {aiResult.components.subject && (
                        <span style={{ padding: '6px 14px', background: '#fef3c7', borderRadius: '16px', fontSize: '13px' }}>
                          📦 {aiResult.components.subject}
                        </span>
                      )}
                      {aiResult.components.descriptor && (
                        <span style={{ padding: '6px 14px', background: '#e9d5ff', borderRadius: '16px', fontSize: '13px' }}>
                          ✨ {aiResult.components.descriptor}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Regex Result */}
            <div style={{
              background: '#fef3c7',
              borderRadius: '16px',
              padding: '30px',
              border: '3px solid #f59e0b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '32px', marginRight: '10px' }}>🔧</div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                  Regex-Based (Fallback)
                </h3>
              </div>

              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#d97706',
                marginBottom: '20px',
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                wordBreak: 'break-all'
              }}>
                dashdig.com/{regexResult?.slug || 'Loading...'}
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '8px' }}>
                  <strong>Source:</strong>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    background: '#f59e0b',
                    color: 'white'
                  }}>
                    regex
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '8px' }}>
                  <strong>Confidence:</strong>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    background: regexResult?.confidence === 'high' ? '#10b981' :
                               regexResult?.confidence === 'medium' ? '#f59e0b' : '#ef4444',
                    color: 'white'
                  }}>
                    {regexResult?.confidence || 'N/A'}
                  </span>
                </div>

                {regexResult?.components && Object.keys(regexResult.components).length > 0 && (
                  <div style={{ padding: '15px', background: 'white', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', marginBottom: '10px' }}>Components:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {regexResult.components.merchant && (
                        <span style={{ padding: '6px 14px', background: '#dbeafe', borderRadius: '16px', fontSize: '13px' }}>
                          🏪 {regexResult.components.merchant}
                        </span>
                      )}
                      {regexResult.components.brand && (
                        <span style={{ padding: '6px 14px', background: '#fef3c7', borderRadius: '16px', fontSize: '13px' }}>
                          🏷️ {regexResult.components.brand}
                        </span>
                      )}
                      {regexResult.components.product && (
                        <span style={{ padding: '6px 14px', background: '#d1fae5', borderRadius: '16px', fontSize: '13px' }}>
                          📦 {regexResult.components.product}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Test URLs */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            🧪 Test URLs
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {testUrls.map((url, index) => (
              <div
                key={index}
                onClick={() => handleTestUrl(url)}
                style={{
                  padding: '16px 20px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
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

        {/* Cache Controls */}
        <div style={{ borderTop: '2px solid #e0e0e0', paddingTop: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            🗄️ Cache Management
          </h2>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <button
              onClick={loadCacheStats}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📊 Load Cache Stats
            </button>
            <button
              onClick={handleClearCache}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              🗑️ Clear Cache
            </button>
          </div>

          {cacheStats && (
            <div style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '12px' 
            }}>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                Cache Entries: {cacheStats.size}
              </div>
              {cacheStats.entries && cacheStats.entries.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <strong>Recent Entries:</strong>
                  <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
                    {cacheStats.entries.slice(0, 5).map((entry: any, i: number) => (
                      <div key={i} style={{ 
                        padding: '10px', 
                        background: 'white', 
                        borderRadius: '8px',
                        fontSize: '13px'
                      }}>
                        <strong>{entry.slug}</strong> • {entry.age} min ago
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

