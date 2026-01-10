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
        // IMPORTANT: Reserved paths (login, enterprise, etc.) are excluded via negative lookahead
        source: '/:slug((?!login|signup|enterprise|dashboard|api|auth|settings|profile|pricing|about|contact|terms|privacy|docs|admin|_next|static|public|assets|favicon\\.ico|robots\\.txt|sitemap\\.xml)[A-Za-z0-9\\.\\-_]+)',
        destination: 'https://dashdig-production.up.railway.app/:slug',
      },
    ];
  },
};

export default nextConfig;
