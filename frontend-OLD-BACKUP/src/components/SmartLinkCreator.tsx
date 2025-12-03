'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { generateAISmartSlug } from '../../lib/aiUrlAnalyzer';
import { generateSmartUrl } from '../../lib/smartUrlGenerator';

interface SmartLinkCreatorProps {
  onCreateLink: (data: { originalUrl: string; slug: string; mode: 'smart' | 'random' }) => void;
  baseUrl?: string;
}

export default function SmartLinkCreator({ onCreateLink, baseUrl = 'https://dashdig.com' }: SmartLinkCreatorProps) {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mode, setMode] = useState<'smart' | 'random'>('smart');
  const [slugSource, setSlugSource] = useState<'ai' | 'regex' | 'manual' | ''>('');
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low' | ''>('');
  const [isCheckingCollision, setIsCheckingCollision] = useState(false);
  const [hasCollision, setHasCollision] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [detectedPattern, setDetectedPattern] = useState<any>(null);
  const [showPatternInfo, setShowPatternInfo] = useState(false);

  // Auto-generate smart slug when URL changes
  useEffect(() => {
    if (url && mode === 'smart' && !isEditing) {
      const debounceTimer = setTimeout(() => {
        generateSlug('normal');
      }, 800);

      return () => clearTimeout(debounceTimer);
    }
  }, [url, mode]);

  const generateSlug = async (style: 'normal' | 'concise' | 'descriptive' = 'normal') => {
    if (!url) return;

    setIsGenerating(true);

    try {
      // Validate URL
      new URL(url);

      // First, try pattern detection
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app/api';
        const patternResponse = await fetch(`${API_BASE}/slug/detect-pattern`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });

        if (patternResponse.ok) {
          const patternResult = await patternResponse.json();
          
          if (patternResult.matched && patternResult.suggestedSlug) {
            setDetectedPattern(patternResult);
            setSlug(patternResult.suggestedSlug);
            setSlugSource('regex');
            setConfidence('high');
            setShowPatternInfo(true);
            console.log('🎯 Pattern detected:', patternResult.patternName, '→', patternResult.suggestedSlug);
            toast.success(`Detected ${patternResult.patternName} pattern!`, { duration: 2000 });
            setIsGenerating(false);
            setIsEditing(false);
            return;
          }
        }
      } catch (patternError) {
        console.log('Pattern detection unavailable, continuing with AI/regex');
      }

      // Try AI generation if pattern detection didn't work
      const aiResult = await generateAISmartSlug(url);

      if (aiResult.source === 'ai' || aiResult.source === 'cache') {
        setSlug(aiResult.slug);
        setSlugSource(aiResult.source);
        setConfidence(aiResult.confidence);
        console.log('✨ AI slug generated:', aiResult.slug);
      } else {
        // Fallback to regex
        const regexResult = generateSmartUrl(url);
        setSlug(regexResult.slug);
        setSlugSource('regex');
        setConfidence(regexResult.confidence);
        console.log('🔧 Regex slug generated:', regexResult.slug);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error generating slug:', error);
      toast.error('Invalid URL. Please enter a valid URL.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRandomSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomSlug = '';
    for (let i = 0; i < 7; i++) {
      randomSlug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSlug(randomSlug);
    setSlugSource('regex');
    setConfidence('medium');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (mode === 'random') {
      generateRandomSlug();
    }
  };

  const handleSlugEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.replace(/[^a-zA-Z0-9.-]/g, ''));
    setSlugSource('manual');
    setIsEditing(true);
  };

  const handleModeToggle = () => {
    const newMode = mode === 'smart' ? 'random' : 'smart';
    setMode(newMode);
    
    if (newMode === 'random' && url) {
      generateRandomSlug();
    } else if (newMode === 'smart' && url) {
      generateSlug('normal');
    }
  };

  const checkSlugCollision = async () => {
    if (!slug) return;
    
    setIsCheckingCollision(true);
    setSuggestions([]);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app/api';
      const response = await fetch(`${API_BASE}/slug/check/${encodeURIComponent(slug)}`);
      
      if (response.ok) {
        const data = await response.json();
        
        setHasCollision(!data.available);
        
        if (!data.available) {
          console.log('❌ Slug taken:', slug);
          setSuggestions(data.suggestions || []);
          toast.error(`"${slug}" is taken. Try one of the suggestions!`, { duration: 4000 });
        } else {
          console.log('✅ Slug available:', slug);
        }
      }
    } catch (error) {
      console.error('Error checking collision:', error);
      // Don't block if API fails
      setHasCollision(false);
    } finally {
      setIsCheckingCollision(false);
    }
  };

  useEffect(() => {
    if (slug) {
      checkSlugCollision();
    }
  }, [slug]);

  const handleCreateLink = () => {
    if (!url || !slug) {
      toast.error('Please enter a URL and generate a slug');
      return;
    }

    if (hasCollision) {
      toast.error('Please resolve the slug collision first');
      return;
    }

    onCreateLink({
      originalUrl: url,
      slug,
      mode,
    });

    // Reset form
    setUrl('');
    setSlug('');
    setSlugSource('');
    setConfidence('');
  };

  return (
    <div className="w-full">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">
            {mode === 'smart' ? '⚡ Smart Link' : '🎲 Random Link'}
          </span>
          <button
            onClick={handleModeToggle}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 ${
              mode === 'smart' ? 'bg-[#FF6B35]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                mode === 'smart' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* URL Input */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          🔗 Original URL
        </label>
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="Paste your long URL here... (e.g., https://www.amazon.com/...)"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
        />
      </div>

      {/* Smart Link Preview */}
      <AnimatePresence>
        {url && slug && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-5"
          >
            {/* Badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {/* Pattern Badge */}
              {detectedPattern && detectedPattern.matched && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  🎯 {detectedPattern.patternName}
                </span>
              )}
              
              {/* AI Badge */}
              {mode === 'smart' && slugSource === 'ai' && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  🤖 AI-powered
                </span>
              )}
              
              {/* Confidence Badge */}
              {confidence && (
                <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold ${
                  confidence === 'high' ? 'bg-green-100 text-green-700' :
                  confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {confidence === 'high' ? '⭐ High' :
                   confidence === 'medium' ? '✓ Medium' :
                   '⚠ Low'} Confidence
                </span>
              )}
            </div>

            {/* Original URL */}
            <div className="mb-4">
              <p className="mb-1 text-xs font-semibold text-slate-500">Original URL:</p>
              <p className="truncate text-sm text-slate-700" title={url}>
                {url}
              </p>
            </div>

            {/* Smart Link Preview */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 mb-4">
              <p className="mb-2 text-xs font-semibold text-[#FF6B35]">
                ⚡ {mode === 'smart' ? 'Smart Link' : 'Short Link'} (preview):
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">{baseUrl}/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugEdit}
                  className="flex-1 border-b-2 border-transparent bg-transparent text-base font-bold text-[#FF6B35] transition-colors hover:border-slate-300 focus:border-[#FF6B35] focus:outline-none"
                  placeholder="your-slug-here"
                />
                
                {/* Availability Indicators */}
                {isCheckingCollision && (
                  <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></div>
                    <span className="text-xs text-slate-500">Checking...</span>
                  </div>
                )}
                {!isCheckingCollision && slug && !hasCollision && (
                  <div className="flex items-center gap-1 text-green-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold">Available!</span>
                  </div>
                )}
                {!isCheckingCollision && hasCollision && (
                  <div className="flex items-center gap-1 text-red-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold">Taken</span>
                  </div>
                )}
              </div>
            </div>

            {/* Suggestions if slug is taken */}
            {hasCollision && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4"
              >
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  💡 Try these available alternatives:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSlug(suggestion.slug);
                        setHasCollision(false);
                        setSuggestions([]);
                      }}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      {suggestion.slug}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pattern Info */}
            {showPatternInfo && detectedPattern && detectedPattern.template && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3"
              >
                <p className="text-xs text-blue-700">
                  <strong>🎯 Pattern Template:</strong> {detectedPattern.template}
                </p>
                {detectedPattern.extracted && (
                  <p className="mt-1 text-xs text-blue-600">
                    <strong>Extracted:</strong> {JSON.stringify(detectedPattern.extracted, null, 2).slice(0, 100)}...
                  </p>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                ✏️ Edit
              </button>

              {mode === 'smart' && (
                <>
                  <button
                    onClick={() => generateSlug('concise')}
                    disabled={isGenerating}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    {isGenerating ? '⏳' : '🎲'} Regenerate
                  </button>

                  <button
                    onClick={() => generateSlug('descriptive')}
                    disabled={isGenerating}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    📝 Descriptive
                  </button>
                </>
              )}

              <button
                onClick={handleCreateLink}
                disabled={!url || !slug || hasCollision || isGenerating}
                className="ml-auto flex items-center gap-2 rounded-lg bg-[#FF6B35] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#E85A2A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✅ Create Link
              </button>
            </div>

            {/* Tips */}
            {mode === 'smart' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 rounded-lg bg-slate-50 p-3"
              >
                <p className="text-xs text-slate-600">
                  💡 <strong>Tip:</strong> Smart Links are human-readable and include semantic information about your destination.
                  {slugSource === 'ai' && ' This slug was generated using AI for maximum clarity.'}
                  {slugSource === 'regex' && ' This slug was generated using pattern matching.'}
                  {slugSource === 'manual' && ' You\'re editing this slug manually.'}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg"
        >
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
          <span className="text-sm text-gray-600">
            {mode === 'smart' ? 'Generating smart slug...' : 'Generating random slug...'}
          </span>
        </motion.div>
      )}

      {/* Empty State */}
      {!url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 px-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300"
        >
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Paste a URL to get started
          </h3>
          <p className="text-gray-500 text-sm">
            {mode === 'smart' 
              ? 'We\'ll automatically generate a smart, human-readable slug using AI'
              : 'We\'ll generate a short, random slug for you'
            }
          </p>
        </motion.div>
      )}

      {/* Feature Highlights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">⚡</div>
          <h4 className="font-semibold text-gray-800 mb-1">AI-Powered</h4>
          <p className="text-xs text-gray-600">
            Uses Claude Sonnet 4.5 for intelligent slug generation
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">✏️</div>
          <h4 className="font-semibold text-gray-800 mb-1">Fully Editable</h4>
          <p className="text-xs text-gray-600">
            Customize the slug to match your brand perfectly
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="font-semibold text-gray-800 mb-1">Collision Check</h4>
          <p className="text-xs text-gray-600">
            Automatically detects if a slug is already taken
          </p>
        </div>
      </div>
    </div>
  );
}

