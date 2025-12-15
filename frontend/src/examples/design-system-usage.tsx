/**
 * Design System Usage Examples
 * 
 * This file demonstrates how to use the Dashdig design system
 * in your components.
 */

import React from 'react';
import { 
  accent, 
  boltGold, 
  bgDark, 
  textPrimary,
  designSystem,
  gradients,
  getBrutalistShadow,
  getAccentColor,
  componentStyles,
} from '../lib/design-system';
import { Zap } from 'lucide-react';

// ============================================
// EXAMPLE 1: Using Individual Color Exports
// ============================================

export function AccentButton() {
  return (
    <button
      style={{
        backgroundColor: accent,
        color: textPrimary,
        border: `2px solid ${designSystem.borders.borderColor}`,
        boxShadow: getBrutalistShadow('md'),
        padding: '12px 24px',
        borderRadius: designSystem.borders.borderRadiusMd,
        fontFamily: designSystem.typography.fontDisplay,
        fontWeight: 700,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = getBrutalistShadow('xl');
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = getBrutalistShadow('md');
        e.currentTarget.style.transform = 'translate(0, 0)';
      }}
    >
      Get Started
    </button>
  );
}

// ============================================
// EXAMPLE 2: Lightning Bolt - Always Solid Gold
// ============================================

export function LightningIcon({ size = 24 }: { size?: number }) {
  return (
    <Zap 
      width={size}
      height={size}
      className="text-bolt-gold fill-bolt-gold"
      style={{ 
        color: boltGold,  // Ensure solid gold
        fill: boltGold,   // NEVER use gradient
      }}
    />
  );
}

// ============================================
// EXAMPLE 3: Neo-Brutalist Card
// ============================================

export function BrutalistCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: designSystem.colors.bgCard,
        border: `${designSystem.borders.borderWidth} solid ${designSystem.borders.borderColor}`,
        borderRadius: designSystem.borders.borderRadiusLg,
        boxShadow: getBrutalistShadow('lg'),
        padding: '24px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = getBrutalistShadow('xl');
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = getBrutalistShadow('lg');
        e.currentTarget.style.transform = 'translate(0, 0)';
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// EXAMPLE 4: Aurora Gradient Background
// ============================================

export function AuroraHero() {
  return (
    <div
      style={{
        background: gradients.aurora,
        padding: '64px 24px',
        textAlign: 'center',
        borderRadius: designSystem.borders.borderRadiusXl,
      }}
    >
      <h1 
        style={{
          fontFamily: designSystem.typography.fontDisplay,
          fontSize: '48px',
          fontWeight: 700,
          color: textPrimary,
          marginBottom: '16px',
        }}
      >
        Dashdig Design System
      </h1>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Using Tailwind Classes
// ============================================

export function TailwindExample() {
  return (
    <div className="bg-bg-dark min-h-screen p-8">
      {/* Primary Button */}
      <button className="bg-accent hover:bg-accent-hover text-white border-2 border-brutalist-black shadow-brutalist-md hover:shadow-brutalist-xl rounded-brutalist-md font-display font-bold px-6 py-3 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5">
        Primary Action
      </button>

      {/* Card with Aurora Gradient */}
      <div className="mt-8 bg-gradient-aurora p-6 rounded-brutalist-lg shadow-brutalist-lg">
        <h2 className="font-display text-2xl text-white mb-4">
          Aurora Card
        </h2>
        <p className="font-body text-white/90">
          Beautiful gradient background
        </p>
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter URL..."
        className="mt-8 w-full bg-bg-card text-text-primary border-2 border-brutalist-black rounded-brutalist-md px-4 py-3 font-body focus:border-accent focus:outline-none"
      />

      {/* Lightning Bolt */}
      <div className="mt-8 flex items-center gap-3">
        <Zap className="w-8 h-8 text-bolt-gold fill-bolt-gold" />
        <span className="font-display text-text-primary">Powered by AI</span>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Dynamic Color with Opacity
// ============================================

export function SemiTransparentAccent() {
  const accentColor = getAccentColor(0.2); // 20% opacity
  
  return (
    <div
      style={{
        backgroundColor: accentColor,
        padding: '16px',
        borderRadius: '8px',
      }}
    >
      Semi-transparent accent background
    </div>
  );
}

// ============================================
// EXAMPLE 7: Component Style Presets
// ============================================

export function PresetButton() {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <button
      style={{
        ...componentStyles.button.primary,
        ...(isHovered ? componentStyles.button.primary.hover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Styled with Preset
    </button>
  );
}

// ============================================
// EXAMPLE 8: Complete Page Layout
// ============================================

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="min-h-screen font-body"
      style={{ 
        background: bgDark,
        color: textPrimary,
      }}
    >
      {/* Header */}
      <header 
        style={{
          height: '64px',
          background: designSystem.colors.bgCard,
          borderBottom: `${designSystem.borders.borderWidth} solid ${designSystem.borders.borderColor}`,
          padding: '16px 24px',
        }}
      >
        <h1 className="font-display text-2xl">DASHDIG</h1>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px' }}>
        {children}
      </main>
    </div>
  );
}

// ============================================
// EXAMPLE 9: Status Badges
// ============================================

export function StatusBadge({ status }: { status: 'success' | 'warning' | 'error' }) {
  const colorMap = {
    success: designSystem.colors.success,
    warning: designSystem.colors.warning,
    error: designSystem.colors.error,
  };

  return (
    <span
      style={{
        backgroundColor: colorMap[status],
        color: textPrimary,
        padding: '4px 12px',
        borderRadius: designSystem.borders.borderRadiusSm,
        fontFamily: designSystem.typography.fontBody,
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
      }}
    >
      {status}
    </span>
  );
}

// ============================================
// EXAMPLE 10: URL Display (Monospace)
// ============================================

export function URLDisplay({ url }: { url: string }) {
  return (
    <div
      style={{
        background: designSystem.colors.bgCard,
        border: `${designSystem.borders.borderWidth} solid ${designSystem.borders.borderColor}`,
        borderRadius: designSystem.borders.borderRadiusMd,
        padding: '12px 16px',
        fontFamily: designSystem.typography.fontMono,
        color: getAccentColor(1),
        fontSize: '14px',
      }}
    >
      {url}
    </div>
  );
}



