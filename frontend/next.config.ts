import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxy slug redirects to Railway backend
        // This catches all single-segment paths that look like slugs
        source: '/:slug([A-Za-z0-9\\.\\-_]+)',
        destination: 'https://dashdig-production.up.railway.app/:slug',
      },
    ];
  },
};

export default nextConfig;
