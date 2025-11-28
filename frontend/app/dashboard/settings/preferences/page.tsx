'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiX, FiPlus, FiAlertCircle, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Preferences {
  industry: string;
  brandVoice: string;
  preferredStyle: string;
  preferredLength: string;
  avoidWords: string[];
  mustInclude: string[];
}

interface DetectedPattern {
  structure: string | null;
  avgWordCount: number;
  separator: string;
  capitalization: string;
  includesBrand: boolean;
  includesYear: boolean;
  usesCTA: boolean;
  confidence: number;
}

interface PreferencesResponse {
  preferences: Preferences;
  detectedPattern: DetectedPattern;
}

const INDUSTRIES = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'media', label: 'Media' },
  { value: 'marketing_agency', label: 'Marketing Agency' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'education', label: 'Education' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' },
];

const BRAND_VOICES = [
  { value: 'casual', label: 'Casual', example: 'Hey.Check.This.Out' },
  { value: 'professional', label: 'Professional', example: 'Quarterly.Report.Q4.2025' },
  { value: 'technical', label: 'Technical', example: 'API.Documentation.v2.0' },
  { value: 'playful', label: 'Playful', example: 'Amazing.Deal.Alert' },
];

const STYLES = [
  { value: 'auto', label: 'Auto (Varied)' },
  { value: 'brand_focused', label: 'Brand Focused' },
  { value: 'product_focused', label: 'Product Focused' },
  { value: 'feature_focused', label: 'Feature Focused' },
  { value: 'benefit_focused', label: 'Benefit Focused' },
  { value: 'action_focused', label: 'Action Focused' },
];

export default function PreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    industry: 'other',
    brandVoice: 'professional',
    preferredStyle: 'auto',
    preferredLength: 'medium',
    avoidWords: [],
    mustInclude: [],
  });
  const [detectedPattern, setDetectedPattern] = useState<DetectedPattern | null>(null);
  const [newAvoidWord, setNewAvoidWord] = useState('');
  const [newMustIncludeWord, setNewMustIncludeWord] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/users/preferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: PreferencesResponse = await response.json();
        setPreferences(data.preferences);
        setDetectedPattern(data.detectedPattern);
      } else {
        toast.error('Failed to load preferences');
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast.success('Preferences saved successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPattern = async () => {
    if (!confirm('Are you sure you want to reset your detected pattern? This will clear the pattern analysis.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/users/preferences/reset-pattern`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Pattern reset successfully');
        await fetchPreferences();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to reset pattern');
      }
    } catch (error) {
      console.error('Failed to reset pattern:', error);
      toast.error('Failed to reset pattern');
    }
  };

  const addAvoidWord = () => {
    const word = newAvoidWord.trim().toLowerCase();
    if (word && !preferences.avoidWords.includes(word)) {
      setPreferences({
        ...preferences,
        avoidWords: [...preferences.avoidWords, word],
      });
      setNewAvoidWord('');
    }
  };

  const removeAvoidWord = (word: string) => {
    setPreferences({
      ...preferences,
      avoidWords: preferences.avoidWords.filter((w) => w !== word),
    });
  };

  const addMustIncludeWord = () => {
    const word = newMustIncludeWord.trim();
    if (word && !preferences.mustInclude.includes(word)) {
      setPreferences({
        ...preferences,
        mustInclude: [...preferences.mustInclude, word],
      });
      setNewMustIncludeWord('');
    }
  };

  const removeMustIncludeWord = (word: string) => {
    setPreferences({
      ...preferences,
      mustInclude: preferences.mustInclude.filter((w) => w !== word),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">URL Naming Preferences</h1>
          <p className="text-gray-600 mt-2">
            Configure how Dashdig generates URL slugs for your links
          </p>
        </div>

        {/* Industry */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏢</span>
            <h2 className="text-xl font-semibold text-gray-900">Your Industry</h2>
          </div>
          <select
            value={preferences.industry}
            onChange={(e) => setPreferences({ ...preferences, industry: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent mb-2"
          >
            {INDUSTRIES.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500">
            This helps us suggest industry-appropriate URL formats.
          </p>
        </div>

        {/* Brand Voice */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎨</span>
            <h2 className="text-xl font-semibold text-gray-900">Brand Voice</h2>
          </div>
          <div className="space-y-3">
            {BRAND_VOICES.map((voice) => (
              <label
                key={voice.value}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  preferences.brandVoice === voice.value
                    ? 'border-[#FF6B35] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="brandVoice"
                  value={voice.value}
                  checked={preferences.brandVoice === voice.value}
                  onChange={(e) => setPreferences({ ...preferences, brandVoice: e.target.value })}
                  className="mt-1 mr-3 text-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{voice.label}</div>
                  <div className="text-sm text-gray-500 font-mono mt-1">{voice.example}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Length */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📏</span>
            <h2 className="text-xl font-semibold text-gray-900">Preferred Length</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="2"
                value={preferences.preferredLength === 'short' ? 0 : preferences.preferredLength === 'medium' ? 1 : 2}
                onChange={(e) => {
                  const values = ['short', 'medium', 'long'];
                  setPreferences({ ...preferences, preferredLength: values[parseInt(e.target.value)] });
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Short (2-3 words)</span>
              <span className="font-semibold text-[#FF6B35]">
                {preferences.preferredLength === 'short' ? '2-3' : preferences.preferredLength === 'medium' ? '4-5' : '6+'} words
              </span>
              <span>Long (6+ words)</span>
            </div>
          </div>
        </div>

        {/* Preferred Style */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-semibold text-gray-900">Preferred Style</h2>
          </div>
          <select
            value={preferences.preferredStyle}
            onChange={(e) => setPreferences({ ...preferences, preferredStyle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          >
            {STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {/* Detected Pattern */}
        {detectedPattern && detectedPattern.confidence > 0.5 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-semibold text-gray-900">Detected Pattern</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Based on your last URLs, you tend to use:
            </p>
            <div className="space-y-2 mb-4">
              {detectedPattern.structure && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Structure:</span>
                  <span className="font-mono text-gray-900">{detectedPattern.structure}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Avg Words:</span>
                <span className="font-semibold text-gray-900">{detectedPattern.avgWordCount.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Usually Includes:</span>
                <span className="text-gray-900">
                  {[
                    detectedPattern.includesBrand && 'Brand name',
                    detectedPattern.includesYear && 'Year',
                    detectedPattern.usesCTA && 'CTA',
                  ]
                    .filter(Boolean)
                    .join(', ') || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Confidence:</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(detectedPattern.confidence * 100)}%
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleResetPattern}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                Reset Pattern
              </button>
            </div>
          </div>
        )}

        {/* Words to Avoid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚫</span>
            <h2 className="text-xl font-semibold text-gray-900">Words to Avoid</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {preferences.avoidWords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
              >
                {word}
                <button
                  onClick={() => removeAvoidWord(word)}
                  className="hover:bg-red-100 rounded-full p-0.5"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAvoidWord}
              onChange={(e) => setNewAvoidWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAvoidWord()}
              placeholder="Enter word to avoid"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
            <button
              onClick={addAvoidWord}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            >
              <FiPlus /> Add
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            These words will never appear in your generated slugs.
          </p>
        </div>

        {/* Words to Always Include */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h2 className="text-xl font-semibold text-gray-900">Words to Always Include</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {preferences.mustInclude.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {word}
                <button
                  onClick={() => removeMustIncludeWord(word)}
                  className="hover:bg-green-100 rounded-full p-0.5"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMustIncludeWord}
              onChange={(e) => setNewMustIncludeWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMustIncludeWord()}
              placeholder="Enter word to include"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
            <button
              onClick={addMustIncludeWord}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            >
              <FiPlus /> Add
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            We&apos;ll try to include these when relevant.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a28] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave /> Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}




