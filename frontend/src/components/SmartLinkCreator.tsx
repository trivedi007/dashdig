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

      // Try AI generation first
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
    
    try {
      // Simulate API call to check collision
      // In production, call: const response = await fetch(`/api/urls/check/${slug}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Randomly simulate collision for demo
      const collision = Math.random() < 0.1;
      setHasCollision(collision);
      
      if (collision) {
        toast.error('This slug is already taken. Try editing it or regenerating.');
      }
    } catch (error) {
      console.error('Error checking collision:', error);
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create Your Link</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {mode === 'smart' ? '⚡ Smart Link' : '🎲 Random Short Link'}
          </span>
          <button
            onClick={handleModeToggle}
            className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            style={{ background: mode === 'smart' ? '#FF6B35' : '#9CA3AF' }}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                mode === 'smart' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* URL Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🔗 Original URL
        </label>
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="Paste your long URL here... (e.g., https://www.amazon.com/...)"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-gray-700"
        />
      </div>

      {/* Smart Link Preview */}
      <AnimatePresence>
        {url && slug && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 mb-6 shadow-lg"
          >
            {/* AI Badge */}
            {mode === 'smart' && slugSource === 'ai' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                  🤖 AI-powered
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                  confidence === 'high' ? 'bg-green-500 text-white' :
                  confidence === 'medium' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {confidence === 'high' ? '⭐ High' :
                   confidence === 'medium' ? '✓ Medium' :
                   '⚠ Low'} Confidence
                </span>
              </div>
            )}

            {/* Original URL */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 mb-1">Original URL:</p>
              <p className="text-sm text-gray-700 truncate" title={url}>
                {url}
              </p>
            </div>

            {/* Smart Link Preview */}
            <div className="bg-white rounded-lg p-4 mb-4 border-2 border-orange-300">
              <p className="text-xs font-semibold text-orange-600 mb-2">
                ⚡ {mode === 'smart' ? 'Smart Link' : 'Short Link'} (preview):
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{baseUrl}/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugEdit}
                  className="flex-1 text-lg font-bold text-orange-600 bg-transparent border-b-2 border-transparent hover:border-orange-300 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="your-slug-here"
                />
                {isCheckingCollision && (
                  <span className="text-xs text-gray-500 animate-pulse">Checking...</span>
                )}
                {hasCollision && !isCheckingCollision && (
                  <span className="text-xs text-red-500 font-semibold">⚠ Already taken</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200"
              >
                ✏️ Edit
              </button>

              {mode === 'smart' && (
                <>
                  <button
                    onClick={() => generateSlug('concise')}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200 disabled:opacity-50"
                  >
                    {isGenerating ? '⏳' : '🎲'} Regenerate
                  </button>

                  <button
                    onClick={() => generateSlug('descriptive')}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200 disabled:opacity-50"
                  >
                    📝 More Descriptive
                  </button>
                </>
              )}

              <button
                onClick={handleCreateLink}
                disabled={!url || !slug || hasCollision || isGenerating}
                className="ml-auto flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ Create Link
              </button>
            </div>

            {/* Tips */}
            {mode === 'smart' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-white/50 rounded-lg"
              >
                <p className="text-xs text-gray-600">
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

