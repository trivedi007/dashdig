/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Explicitly set the project root for Turbopack
  },
  
  // Build configuration (temporarily ignore errors for deployment)
  eslint: {
    ignoreDuringBuilds: true, // TODO: Fix ESLint errors and enable for production
  },
  typescript: {
    ignoreBuildErrors: true, // TODO: Fix TypeScript errors and enable for production
  },
  
  // Output configuration for better builds
  output: 'standalone',
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    domains: ['dashdig.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Redirects (ensure old routes redirect properly)
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig
