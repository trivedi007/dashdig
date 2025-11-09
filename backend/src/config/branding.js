/**
 * Dashdig Branding Configuration
 * Centralized branding constants for consistent messaging across the platform
 * Version: 1.2.0
 */

const DASHDIG_BRAND = {
  name: 'Dashdig',
  fullName: 'Dashdig - Humanize and Shortenize URLs',
  tagline: 'Humanize and Shortenize URLs',
  slogan: 'Dig This!',
  icon: '⚡',
  version: '1.2.0',
  
  messaging: {
    hero: 'Stop using cryptic links. Humanize and shortenize URLs with AI.',
    description: 'Transform cryptic URLs into human-readable links that people actually remember.',
    shortDescription: 'AI-powered URL shortener that creates human-readable, memorable links',
    cta: 'Start Humanizing URLs Free',
    
    features: {
      humanize: {
        title: 'Humanize',
        description: 'URLs that make sense to humans, not robots',
        icon: '🧠'
      },
      shortenize: {
        title: 'Shortenize',
        description: 'Shorter than full URLs, smarter than random strings',
        icon: '⚡'
      },
      memorize: {
        title: 'Memorize',
        description: 'Links people can actually remember and trust',
        icon: '🎯'
      }
    },
    
    api: {
      success: {
        urlCreated: 'URL successfully humanized and shortenized',
        urlDeleted: 'Humanized URL deleted successfully',
        urlUpdated: 'Humanized URL updated successfully',
        qrGenerated: 'QR code generated for your humanized URL'
      },
      loading: {
        creating: 'Humanizing and shortenizing your URL...',
        fetching: 'Loading your humanized URLs...'
      },
      errors: {
        createFailed: 'Failed to humanize URL. Please try again.',
        notFound: 'Humanized URL not found',
        invalid: 'Invalid URL format'
      }
    },
    
    email: {
      welcome: {
        subject: 'Welcome to Dashdig - Humanize and Shortenize URLs!',
        greeting: 'Welcome to Dashdig!',
        body: "You're now ready to humanize and shortenize URLs with the power of AI.",
        signature: 'The Dashdig Team\nHumanize and Shortenize URLs ⚡'
      },
      urlCreated: {
        subject: 'Your URL has been humanized!',
        body: 'Your URL has been successfully humanized and shortenized.',
        shareMessage: 'Share your human-readable link with confidence!'
      },
      verification: {
        subject: 'Verify your Dashdig account',
        title: 'Verify Your Email'
      }
    }
  },
  
  colors: {
    primary: '#FF6B35',
    primaryDark: '#E85A2A',
    primaryLight: '#FF8559',
    deep: '#FF4500',
    light: '#FFB399',
    pale: '#FFE5DD',
    dark: '#2C3E50',
    darkest: '#1A1A1A',
    gray: '#ECF0F1',
    grayMedium: '#7F8C8D',
    white: '#FFFFFF',
    success: '#00B894',
    error: '#D63031',
    warning: '#FDCB6E'
  },
  
  urls: {
    website: 'https://dashdig.com',
    dashboard: 'https://dashdig.com/dashboard',
    docs: 'https://dashdig.com/docs',
    support: 'https://dashdig.com/support',
    api: 'https://api.dashdig.com',
    extension: 'https://dashdig.com/extension',
    pricing: 'https://dashdig.com/pricing',
    blog: 'https://dashdig.com/blog'
  },
  
  social: {
    twitter: 'https://twitter.com/dashdig',
    github: 'https://github.com/dashdig',
    linkedin: 'https://linkedin.com/company/dashdig'
  },
  
  contact: {
    email: 'hello@dashdig.com',
    support: 'support@dashdig.com',
    sales: 'sales@dashdig.com'
  },
  
  seo: {
    title: 'Dashdig - Humanize and Shortenize URLs | AI-Powered URL Shortener',
    description: 'Transform cryptic URLs into human-readable links. Dashdig helps you humanize and shortenize URLs with AI-powered contextual shortening.',
    keywords: [
      'url shortener',
      'humanize urls',
      'shortenize',
      'dashdig',
      'ai url shortener',
      'human-readable links',
      'memorable urls',
      'smart url shortener'
    ]
  }
};

// Freeze the object to prevent modifications
Object.freeze(DASHDIG_BRAND);
Object.freeze(DASHDIG_BRAND.messaging);
Object.freeze(DASHDIG_BRAND.colors);
Object.freeze(DASHDIG_BRAND.urls);

module.exports = DASHDIG_BRAND;

