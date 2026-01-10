import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with type errors
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        // Proxy slug redirects to Railway backend
        source: '/:slug([A-Za-z0-9\\.\\-_]+)',
        destination: 'https://dashdig-production.up.railway.app/:slug',
      },
    ];
  },
};

export default nextConfig;
