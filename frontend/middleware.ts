import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Don't process special pages or API routes
  const specialPages = ['/dashboard', '/auth', '/debug-analytics', '/bypass', '/onboarding']
  const isSpecialPage = specialPages.some(page => pathname.startsWith(page))
  const isApiRoute = pathname.startsWith('/api')
  const isStaticFile = pathname.includes('.') && !pathname.endsWith('/')
  
  if (isSpecialPage || isApiRoute || isStaticFile || pathname === '/') {
    return NextResponse.next()
  }
  
  // For short URLs, proxy to backend using rewrite (not redirect!)
  // This keeps dashdig.com in the address bar instead of showing the backend URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app'
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
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
