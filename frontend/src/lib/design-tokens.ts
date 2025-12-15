export const colors = {
  // Neo-Brutalist Light Theme (Landing/Marketing)
  bgCream: '#FDF8F3',
  bgWhite: '#FFFFFF',
  
  // Refined Dark Theme (Dashboard)
  dashBg: '#0F0F0F',        // Base dark background
  dashSurface: '#1A1A1A',   // Cards, sidebar
  dashElevated: '#242424',  // Modals, dropdowns
  dashBorder: '#2A2A2A',    // Subtle borders
  
  // Brand
  accent: '#FF6B35',
  accentHover: '#E55A2B',
  boltGold: '#FFCC33',
  
  // Text
  textDark: '#1A1A1A',      // For light backgrounds
  textLight: '#FFFFFF',     // Primary text on dark
  textMuted: '#6B7280',     // For light backgrounds
  textSecondary: '#A0A0A0', // Secondary text on dark
  
  // Borders (for landing/marketing)
  border: '#1A1A1A',
  
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const fonts = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const shadows = {
  brutalist: '4px 4px 0 #1A1A1A',
  brutalistHover: '6px 6px 0 #1A1A1A',
  brutalistSm: '2px 2px 0 #1A1A1A',
};

export const transitions = {
  default: 'all 0.2s ease',
};

export const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceAnnual: 0,
    aiModel: 'Claude Haiku 4.5',
    costPerUrl: '~$0.00009',
    margin: 'Loss leader',
    urls: 25,
    clicks: '1K',
    retention: '7 days',
    features: [
      '25 AI-generated URLs/month',
      '1,000 tracked clicks',
      '7-day analytics',
      'AI-powered suggestions',
      'Community support',
    ],
    cta: 'Start Free',
    ctaVariant: 'secondary' as const,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 12,
    priceAnnual: 10,
    aiModel: 'Claude Haiku 4.5',
    costPerUrl: '~$0.00009',
    margin: '~$0.024/URL (266x)',
    urls: 500,
    clicks: '10K',
    retention: '30 days',
    features: [
      '500 AI-generated URLs/month',
      '10,000 tracked clicks',
      '30-day analytics retention',
      'AI-powered suggestions',
      '3 AI suggestions per URL',
      'Custom domains (1)',
      'Email support',
    ],
    cta: 'Start Trial',
    ctaVariant: 'secondary' as const,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceAnnual: 24,
    aiModel: 'Claude Sonnet 4.5',
    costPerUrl: '~$0.001',
    margin: '~$0.0058/URL (6x)',
    urls: 5000,
    clicks: '100K',
    retention: '90 days',
    popular: true,
    features: [
      '5,000 AI-generated URLs/month',
      '100,000 tracked clicks',
      '90-day analytics retention',
      'Advanced AI suggestions',
      '5 AI suggestions with styles',
      'Promotional AI intelligence',
      'Custom domains (3)',
      '3 team members',
      'Priority support',
      'API access',
    ],
    cta: 'Go Pro',
    ctaVariant: 'primary' as const,
  },
  {
    id: 'business',
    name: 'Business',
    price: 99,
    priceAnnual: 79,
    aiModel: 'Sonnet + Opus fallback',
    costPerUrl: '~$0.003',
    margin: '~$0.0198/URL (7x)',
    urls: 'Unlimited',
    clicks: '1M',
    retention: '1 year',
    features: [
      'Unlimited AI-generated URLs',
      '1,000,000 tracked clicks',
      '1-year analytics retention',
      'Premium AI engine',
      'Brand voice learning',
      'Team pattern consistency',
      'Custom domains (unlimited)',
      '10 team members',
      'Priority chat support',
      'Webhooks & integrations',
    ],
    cta: 'Scale Up',
    ctaVariant: 'primary' as const,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    priceAnnual: null,
    aiModel: 'Claude Opus 4.5',
    costPerUrl: '~$0.005',
    margin: 'Custom',
    urls: 'Unlimited',
    clicks: 'Unlimited',
    retention: 'Unlimited',
    custom: true,
    features: [
      'Everything in Business',
      'Most advanced AI',
      'Custom brand guidelines',
      'SSO/SAML (coming soon)',
      'Dedicated account manager',
      '1-hour support SLA',
      'Custom contract terms',
      'Invoice billing (NET 30)',
      'Quarterly strategy calls',
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
  },
] as const;

