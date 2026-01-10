'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { LightningBolt } from '../ui/LightningBolt';

interface Suggestion {
  id: string;
  slug: string;
  style: string;
  reasoning: string;
  model: string;
}

interface UrlSuggestionsProps {
  suggestions: Suggestion[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  baseUrl: string;
}

const styleLabels: Record<string, string> = {
  brand_focused: '🏷️ Brand',
  product_focused: '📦 Product',
  feature_focused: '✨ Feature',
  action_focused: '🎯 Action',
  benefit_focused: '🎁 Benefit',
  promotional: '🔥 Promo',
  general: '💡 Smart',
  fallback: '🔗 Basic',
};

const modelBadges: Record<string, { label: string; color: string }> = {
  haiku: { label: 'Haiku', color: 'bg-blue-500/20 text-blue-400' },
  sonnet: { label: 'Sonnet', color: 'bg-purple-500/20 text-purple-400' },
  opus: { label: 'Opus', color: 'bg-gold-500/20 text-dashdig-gold' },
  fallback: { label: 'Basic', color: 'bg-gray-500/20 text-gray-400' },
};

export function UrlSuggestions({
  suggestions,
  selectedSlug,
  onSelect,
  baseUrl,
}: UrlSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <LightningBolt size="sm" />
        <span>AI Suggestions ({suggestions.length})</span>
      </div>

      <div className="grid gap-3">
        {suggestions.map((suggestion) => {
          const isSelected = suggestion.slug === selectedSlug;
          const badge = modelBadges[suggestion.model] || modelBadges.fallback;

          return (
            <Card
              key={suggestion.id}
              variant="dashboard"
              padding="md"
              hoverable
              onClick={() => onSelect(suggestion.slug)}
              className={`
                cursor-pointer transition-all
                ${isSelected
                  ? 'ring-2 ring-dashdig-orange border-dashdig-orange'
                  : ''
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Slug */}
                  <p className="text-dashdig-orange font-mono text-lg font-medium truncate">
                    {baseUrl}/{suggestion.slug}
                  </p>

                  {/* Reasoning */}
                  {suggestion.reasoning && (
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {suggestion.reasoning}
                    </p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  {/* Style badge */}
                  <span className="text-xs text-gray-500">
                    {styleLabels[suggestion.style] || suggestion.style}
                  </span>

                  {/* Model badge */}
                  <span className={`text-xs px-2 py-0.5 rounded ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-dashdig-orange rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
