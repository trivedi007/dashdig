'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, RefreshCw, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

// Types
export interface Suggestion {
  id: string;
  slug: string;
  style: string;
  confidence: number;
  reasoning: string;
  previewUrl: string;
}

export interface SuggestionCarouselProps {
  suggestions: Suggestion[];
  originalUrl: string;
  isLoading: boolean;
  onSelect: (suggestion: Suggestion) => void;
  onFeedback: (suggestionId: string, vote: 'up' | 'down') => void;
  onRegenerate: () => void;
  onCustomSlug: (slug: string) => void;
}

// Style badge colors mapping
const styleColors: Record<string, { bg: string; text: string; border: string }> = {
  brand_focused: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  product_focused: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  feature_focused: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  benefit_focused: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  action_focused: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

// Format style name for display
const formatStyleName = (style: string): string => {
  return style
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
};

// Loading skeleton component
const SuggestionSkeleton = () => (
  <div className="animate-pulse">
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-gray-200"></div>
        <div className="h-5 bg-gray-200 rounded flex-1"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default function SuggestionCarousel({
  suggestions,
  originalUrl,
  isLoading,
  onSelect,
  onFeedback,
  onRegenerate,
  onCustomSlug,
}: SuggestionCarouselProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'up' | 'down' | null>>({});
  const [customSlug, setCustomSlug] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-select first suggestion when loaded
  useEffect(() => {
    if (suggestions.length > 0 && !selectedId) {
      setSelectedId(suggestions[0].id);
      onSelect(suggestions[0]);
    }
  }, [suggestions, selectedId, onSelect]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      const visibleSuggestions = isExpanded ? suggestions : suggestions.slice(0, 3);
      const currentIndex = focusedIndex !== null ? focusedIndex : 
        (selectedId ? visibleSuggestions.findIndex(s => s.id === selectedId) : 0);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, visibleSuggestions.length - 1);
        setFocusedIndex(nextIndex);
        const nextSuggestion = visibleSuggestions[nextIndex];
        if (nextSuggestion) {
          setSelectedId(nextSuggestion.id);
          onSelect(nextSuggestion);
          suggestionRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        setFocusedIndex(prevIndex);
        const prevSuggestion = visibleSuggestions[prevIndex];
        if (prevSuggestion) {
          setSelectedId(prevSuggestion.id);
          onSelect(prevSuggestion);
          suggestionRefs.current[prevIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else if (e.key === 'Enter' && focusedIndex !== null) {
        e.preventDefault();
        const suggestion = visibleSuggestions[focusedIndex];
        if (suggestion) {
          handleSelect(suggestion);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedId, isExpanded, focusedIndex, isLoading, onSelect]);

  const handleSelect = useCallback((suggestion: Suggestion) => {
    setSelectedId(suggestion.id);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    onSelect(suggestion);
  }, [onSelect]);

  const handleFeedback = useCallback((suggestionId: string, vote: 'up' | 'down') => {
    const currentVote = feedbackMap[suggestionId];
    const newVote = currentVote === vote ? null : vote;
    setFeedbackMap(prev => ({ ...prev, [suggestionId]: newVote }));
    if (newVote) {
      onFeedback(suggestionId, newVote);
    }
  }, [feedbackMap, onFeedback]);

  const handleCustomSlugChange = useCallback((value: string) => {
    // Validate: only alphanumeric, dots, and hyphens
    const sanitized = value.replace(/[^a-zA-Z0-9.\-]/g, '');
    setCustomSlug(sanitized);
  }, []);

  const handleCustomSlugSubmit = useCallback(() => {
    if (customSlug.trim().length >= 3) {
      onCustomSlug(customSlug.trim());
      setSelectedId(null); // Clear selection when using custom slug
    }
  }, [customSlug, onCustomSlug]);

  const visibleSuggestions = isExpanded ? suggestions : suggestions.slice(0, 3);
  const hasMore = suggestions.length > 3;

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-dashdig-orange" />
          <h3 className="text-lg font-semibold text-gray-900">⚡ AI Suggestions (pick your favorite)</h3>
        </div>
        {[1, 2, 3].map((i) => (
          <SuggestionSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="w-full p-6 text-center text-gray-500">
        <p>No suggestions available. Try regenerating.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4" role="region" aria-label="URL suggestions">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-dashdig-orange" />
          <h3 className="text-lg font-semibold text-gray-900">
            ⚡ AI Suggestions (pick your favorite)
          </h3>
        </div>
        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-dashdig-orange transition-colors rounded-md hover:bg-orange-50"
          aria-label="Regenerate suggestions"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3" role="radiogroup" aria-label="URL slug suggestions">
        <AnimatePresence mode="popLayout">
          {visibleSuggestions.map((suggestion, index) => {
            const isSelected = selectedId === suggestion.id;
            const feedback = feedbackMap[suggestion.id];
            const styleConfig = styleColors[suggestion.style] || styleColors.brand_focused;

            return (
              <motion.div
                key={suggestion.id}
                ref={(el) => { suggestionRefs.current[index] = el; }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`
                  relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-dashdig-orange bg-orange-50 shadow-md ring-2 ring-dashdig-orange ring-opacity-20' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }
                  ${focusedIndex === index ? 'ring-2 ring-dashdig-orange ring-offset-2' : ''}
                `}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex(null)}
                role="radio"
                aria-checked={isSelected}
                aria-label={`Select suggestion: ${suggestion.slug}`}
                tabIndex={0}
              >
                {/* Selection indicator */}
                <div className="flex items-start gap-3">
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
                    ${isSelected 
                      ? 'border-dashdig-orange bg-dashdig-orange' 
                      : 'border-gray-300 bg-white'
                    }
                  `}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Slug */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm font-semibold text-gray-900 truncate">
                        {suggestion.previewUrl}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="text-dashdig-orange"
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>

                    {/* Style and Confidence */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`
                        px-2 py-0.5 rounded text-xs font-medium border
                        ${styleConfig.bg} ${styleConfig.text} ${styleConfig.border}
                      `}>
                        {formatStyleName(suggestion.style)}
                      </span>
                      <span className="text-xs text-gray-600">
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </span>
                    </div>

                    {/* Reasoning */}
                    <p className="text-sm text-gray-600 mb-3 italic">
                      "{suggestion.reasoning}"
                    </p>

                    {/* Feedback buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(suggestion.id, 'up');
                        }}
                        className={`
                          flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors
                          ${feedback === 'up'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                        aria-label="Thumbs up"
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(suggestion.id, 'down');
                        }}
                        className={`
                          flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors
                          ${feedback === 'down'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                        aria-label="Thumbs down"
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Not helpful</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pulse animation on selection */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-dashdig-orange"
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show More/Less Toggle */}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 w-full justify-center px-4 py-2 text-sm font-medium text-dashdig-orange hover:text-dashdig-orange/80 transition-colors"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Show fewer suggestions' : 'Show more suggestions'}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Show fewer</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Show {suggestions.length - 3} more</span>
            </>
          )}
        </button>
      )}

      {/* Custom Slug Input */}
      <div className="border-t pt-4 mt-4">
        <label htmlFor="custom-slug" className="block text-sm font-medium text-gray-700 mb-2">
          ✏️ Custom slug:
        </label>
        <div className="flex gap-2">
          <input
            id="custom-slug"
            type="text"
            value={customSlug}
            onChange={(e) => handleCustomSlugChange(e.target.value)}
            placeholder="Enter your custom slug (e.g., my.custom.slug)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dashdig-orange focus:border-transparent font-mono text-sm"
            aria-label="Custom slug input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCustomSlugSubmit();
              }
            }}
          />
          <button
            onClick={handleCustomSlugSubmit}
            disabled={customSlug.trim().length < 3}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            aria-label="Use custom slug"
          >
            Use
          </button>
        </div>
        {customSlug && customSlug.trim().length < 3 && (
          <p className="mt-1 text-xs text-gray-500">Slug must be at least 3 characters</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onRegenerate}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-gray-700"
          aria-label="Regenerate suggestions"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Regenerate</span>
        </button>
        <button
          onClick={() => {
            const selected = suggestions.find(s => s.id === selectedId);
            if (selected) {
              handleSelect(selected);
            }
          }}
          disabled={!selectedId}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-dashdig-orange text-white rounded-md hover:bg-[#E85A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
          aria-label="Use selected suggestion"
        >
          <Check className="w-4 h-4" />
          <span>Use Selected</span>
        </button>
      </div>

      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl"
            >
              ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

