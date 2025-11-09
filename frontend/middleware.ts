import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Don't process special pages or API routes
  const specialPages = ['/dashboard', '/auth', '/debug-analytics', '/bypass', '/onboarding', '/ai-smart-url-demo', '/smart-link-creator-demo']
  const isSpecialPage = specialPages.some(page => pathname.startsWith(page))
  const isApiRoute = pathname.startsWith('/api')
  
  // CRITICAL: Exclude static files (favicon.svg, favicon.ico, etc.)
  const staticExtensions = ['.ico', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.css', '.js', '.json', '.xml', '.txt', '.woff', '.woff2', '.ttf', '.eot']
  const isStaticFile = staticExtensions.some(ext => pathname.toLowerCase().endsWith(ext))
  
  // Exclude Next.js internals and common static paths
  const excludedPaths = ['_next', 'favicon', 'robots.txt', 'sitemap.xml', 'apple-touch-icon']
  const isExcludedPath = excludedPaths.some(path => pathname.includes(path))
  
  if (isSpecialPage || isApiRoute || isStaticFile || isExcludedPath || pathname === '/') {
    return NextResponse.next()
  }
  
  // For short URLs, proxy to backend using rewrite (not redirect!)
  // This keeps dashdig.com in the address bar instead of showing the backend URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app'
  const proxyUrl = `${backendUrl}${pathname}`
  
  // Use rewrite() to proxy the request without changing the browser URL
  return NextResponse.rewrite(proxyUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.* (all favicon files: .ico, .svg, .png)
     */
    '/((?!api|_next/static|_next/image|favicon).*)',
  ],
}
