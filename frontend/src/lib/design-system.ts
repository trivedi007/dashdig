/**
 * Dashdig Design System - Neo-Brutalist Theme
 * 
 * A comprehensive design system with colors, typography, shadows, and spacing
 * optimized for Dashdig's bold, modern aesthetic.
 */

// ============================================
// BRAND COLORS
// ============================================

export const brandColors = {
  accent: '#FF6B35',        // Primary orange (buttons, CTAs, hover states)
  accentHover: '#E55A2B',   // Orange hover state
  boltGold: '#FFCC33',      // Lightning bolt fill (ALWAYS solid, never gradient)
  black: '#1A1A1A',         // Borders, shadows, strokes
} as const;

// ============================================
// BACKGROUNDS
// ============================================

export const backgrounds = {
  bgDark: '#0F0F1A',        // Dashboard dark background
  bgCard: '#1A1A2E',        // Cards on dark background
  bgCream: '#FDF8F3',       // Landing page background
} as const;

// ============================================
// TEXT COLORS
// ============================================

export const textColors = {
  // Dark Mode
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B80',
  
  // Light Mode
  textPrimaryLight: '#1A1A1A',
  textSecondaryLight: '#6B7280',
} as const;

// ============================================
// STATUS COLORS
// ============================================

export const statusColors = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

// ============================================
// AURORA GRADIENT (Dashboard)
// ============================================

export const auroraGradient = {
  start: '#4F46E5',         // Indigo
  mid: '#7C3AED',           // Purple
  end: '#EC4899',           // Pink
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontDisplay: "'Space Grotesk', sans-serif",     // Headings, logo, buttons
  fontBody: "'Inter', sans-serif",                 // Body text
  fontMono: "'JetBrains Mono', 'Courier New', monospace", // URLs, code
} as const;

// ============================================
// NEO-BRUTALIST SHADOWS
// ============================================

export const shadows = {
  shadowSm: '2px 2px 0 #1A1A1A',
  shadowMd: '3px 3px 0 #1A1A1A',
  shadowLg: '4px 4px 0 #1A1A1A',
  shadowXl: '6px 6px 0 #1A1A1A',    // Hover state
} as const;

// ============================================
// BORDERS
// ============================================

export const borders = {
  borderWidth: '2px',
  borderColor: '#1A1A1A',
  borderRadiusSm: '6px',
  borderRadiusMd: '8px',
  borderRadiusLg: '12px',
  borderRadiusXl: '16px',
} as const;

// ============================================
// COMBINED DESIGN SYSTEM
// ============================================

export const designSystem = {
  colors: {
    ...brandColors,
    ...backgrounds,
    ...textColors,
    ...statusColors,
    aurora: auroraGradient,
  },
  typography,
  shadows,
  borders,
} as const;

// ============================================
// INDIVIDUAL COLOR EXPORTS (For Easy Imports)
// ============================================

export const {
  accent,
  accentHover,
  boltGold,
  black,
} = brandColors;

export const {
  bgDark,
  bgCard,
  bgCream,
} = backgrounds;

export const {
  textPrimary,
  textSecondary,
  textMuted,
  textPrimaryLight,
  textSecondaryLight,
} = textColors;

export const {
  success,
  warning,
  error,
} = statusColors;

// ============================================
// TAILWIND CONFIG EXTENSION
// ============================================

export const tailwindExtend = {
  colors: {
    // Brand colors
    accent: brandColors.accent,
    'accent-hover': brandColors.accentHover,
    'bolt-gold': brandColors.boltGold,
    'brutalist-black': brandColors.black,
    
    // Backgrounds
    'bg-dark': backgrounds.bgDark,
    'bg-card': backgrounds.bgCard,
    'bg-cream': backgrounds.bgCream,
    
    // Text
    'text-primary': textColors.textPrimary,
    'text-secondary': textColors.textSecondary,
    'text-muted': textColors.textMuted,
    'text-primary-light': textColors.textPrimaryLight,
    'text-secondary-light': textColors.textSecondaryLight,
    
    // Status
    success: statusColors.success,
    warning: statusColors.warning,
    error: statusColors.error,
    
    // Aurora gradient colors
    'aurora-indigo': auroraGradient.start,
    'aurora-purple': auroraGradient.mid,
    'aurora-pink': auroraGradient.end,
  },
  fontFamily: {
    display: [typography.fontDisplay.replace(/'/g, ''), 'sans-serif'],
    body: [typography.fontBody.replace(/'/g, ''), 'sans-serif'],
    mono: [typography.fontMono.replace(/'/g, ''), 'monospace'],
  },
  boxShadow: {
    'brutalist-sm': shadows.shadowSm,
    'brutalist-md': shadows.shadowMd,
    'brutalist-lg': shadows.shadowLg,
    'brutalist-xl': shadows.shadowXl,
  },
  borderWidth: {
    brutalist: borders.borderWidth,
  },
  borderRadius: {
    'brutalist-sm': borders.borderRadiusSm,
    'brutalist-md': borders.borderRadiusMd,
    'brutalist-lg': borders.borderRadiusLg,
    'brutalist-xl': borders.borderRadiusXl,
  },
  borderColor: {
    brutalist: borders.borderColor,
  },
} as const;

// ============================================
// CSS CUSTOM PROPERTIES GENERATOR
// ============================================

export const generateCSSCustomProperties = (): string => {
  return `
:root {
  /* Brand Colors */
  --color-accent: ${brandColors.accent};
  --color-accent-hover: ${brandColors.accentHover};
  --color-bolt-gold: ${brandColors.boltGold};
  --color-brutalist-black: ${brandColors.black};
  
  /* Backgrounds */
  --bg-dark: ${backgrounds.bgDark};
  --bg-card: ${backgrounds.bgCard};
  --bg-cream: ${backgrounds.bgCream};
  
  /* Text Colors - Dark Mode */
  --text-primary: ${textColors.textPrimary};
  --text-secondary: ${textColors.textSecondary};
  --text-muted: ${textColors.textMuted};
  
  /* Text Colors - Light Mode */
  --text-primary-light: ${textColors.textPrimaryLight};
  --text-secondary-light: ${textColors.textSecondaryLight};
  
  /* Status Colors */
  --color-success: ${statusColors.success};
  --color-warning: ${statusColors.warning};
  --color-error: ${statusColors.error};
  
  /* Aurora Gradient */
  --aurora-start: ${auroraGradient.start};
  --aurora-mid: ${auroraGradient.mid};
  --aurora-end: ${auroraGradient.end};
  
  /* Typography */
  --font-display: ${typography.fontDisplay};
  --font-body: ${typography.fontBody};
  --font-mono: ${typography.fontMono};
  
  /* Neo-Brutalist Shadows */
  --shadow-sm: ${shadows.shadowSm};
  --shadow-md: ${shadows.shadowMd};
  --shadow-lg: ${shadows.shadowLg};
  --shadow-xl: ${shadows.shadowXl};
  
  /* Borders */
  --border-width: ${borders.borderWidth};
  --border-color: ${borders.borderColor};
  --border-radius-sm: ${borders.borderRadiusSm};
  --border-radius-md: ${borders.borderRadiusMd};
  --border-radius-lg: ${borders.borderRadiusLg};
  --border-radius-xl: ${borders.borderRadiusXl};
}

/* Aurora Gradient Utility Class */
.aurora-gradient {
  background: linear-gradient(135deg, var(--aurora-start) 0%, var(--aurora-mid) 50%, var(--aurora-end) 100%);
}

/* Accent Gradient Utility Class */
.accent-gradient {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
}

/* Neo-Brutalist Button Class */
.btn-brutalist {
  border: var(--border-width) solid var(--border-color);
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.btn-brutalist:hover {
  box-shadow: var(--shadow-xl);
  transform: translate(-2px, -2px);
}

.btn-brutalist:active {
  box-shadow: var(--shadow-sm);
  transform: translate(1px, 1px);
}
`.trim();
};

// ============================================
// GRADIENT GENERATORS
// ============================================

export const gradients = {
  aurora: `linear-gradient(135deg, ${auroraGradient.start} 0%, ${auroraGradient.mid} 50%, ${auroraGradient.end} 100%)`,
  accent: `linear-gradient(135deg, ${brandColors.accent} 0%, ${brandColors.accentHover} 100%)`,
  orangeGlow: `linear-gradient(135deg, #F97316 0%, #EA580C 100%)`, // Avatar gradient
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Apply neo-brutalist shadow with offset
 * @param size - Shadow size (sm, md, lg, xl)
 * @returns CSS box-shadow value
 */
export const getBrutalistShadow = (size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string => {
  return shadows[`shadow${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof shadows];
};

/**
 * Get Aurora gradient CSS
 * @param opacity - Optional opacity (0-1)
 * @returns CSS gradient string
 */
export const getAuroraGradient = (opacity: number = 1): string => {
  if (opacity === 1) return gradients.aurora;
  return `linear-gradient(135deg, ${auroraGradient.start}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${auroraGradient.mid}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 50%, ${auroraGradient.end}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 100%)`;
};

/**
 * Get accent color with optional opacity
 * @param opacity - Optional opacity (0-1)
 * @returns Color string with opacity
 */
export const getAccentColor = (opacity: number = 1): string => {
  if (opacity === 1) return brandColors.accent;
  const hex = brandColors.accent.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ============================================
// COMPONENT STYLE PRESETS
// ============================================

export const componentStyles = {
  button: {
    primary: {
      background: brandColors.accent,
      color: textColors.textPrimary,
      border: `${borders.borderWidth} solid ${borders.borderColor}`,
      boxShadow: shadows.shadowMd,
      borderRadius: borders.borderRadiusMd,
      fontFamily: typography.fontDisplay,
      fontWeight: 700,
      padding: '12px 24px',
      transition: 'all 0.2s ease',
      hover: {
        background: brandColors.accentHover,
        boxShadow: shadows.shadowXl,
        transform: 'translate(-2px, -2px)',
      },
      active: {
        boxShadow: shadows.shadowSm,
        transform: 'translate(1px, 1px)',
      },
    },
    secondary: {
      background: backgrounds.bgCard,
      color: textColors.textPrimary,
      border: `${borders.borderWidth} solid ${borders.borderColor}`,
      boxShadow: shadows.shadowMd,
      borderRadius: borders.borderRadiusMd,
    },
  },
  card: {
    background: backgrounds.bgCard,
    border: `${borders.borderWidth} solid ${borders.borderColor}`,
    borderRadius: borders.borderRadiusLg,
    boxShadow: shadows.shadowLg,
  },
  input: {
    background: backgrounds.bgDark,
    border: `${borders.borderWidth} solid ${borders.borderColor}`,
    borderRadius: borders.borderRadiusMd,
    color: textColors.textPrimary,
    padding: '12px 16px',
    fontFamily: typography.fontBody,
    focus: {
      borderColor: brandColors.accent,
      boxShadow: `0 0 0 3px ${getAccentColor(0.2)}`,
    },
  },
} as const;

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type BrandColor = keyof typeof brandColors;
export type Background = keyof typeof backgrounds;
export type TextColor = keyof typeof textColors;
export type StatusColor = keyof typeof statusColors;
export type ShadowSize = 'sm' | 'md' | 'lg' | 'xl';
export type BorderRadius = 'sm' | 'md' | 'lg' | 'xl';

export interface DesignSystemConfig {
  colors: typeof brandColors & typeof backgrounds & typeof textColors & typeof statusColors & { aurora: typeof auroraGradient };
  typography: typeof typography;
  shadows: typeof shadows;
  borders: typeof borders;
}

// ============================================
// SPACING & LAYOUT (Bonus)
// ============================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

export const layout = {
  maxWidthContainer: '1280px',
  sidebarWidth: '256px',
  headerHeight: '64px',
  mobileBreakpoint: '768px',
} as const;

// ============================================
// DEFAULT EXPORT
// ============================================

const designSystemComplete: DesignSystemConfig = {
  colors: {
    ...brandColors,
    ...backgrounds,
    ...textColors,
    ...statusColors,
    aurora: auroraGradient,
  },
  typography,
  shadows,
  borders,
};

export default designSystemComplete;

