import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Don't redirect special pages or API routes
  const specialPages = ['/dashboard', '/auth', '/debug-analytics', '/bypass', '/onboarding']
  const isSpecialPage = specialPages.some(page => pathname.startsWith(page))
  const isApiRoute = pathname.startsWith('/api')
  const isStaticFile = pathname.includes('.') && !pathname.includes('/')
  
  if (isSpecialPage || isApiRoute || isStaticFile || pathname === '/') {
    return NextResponse.next()
  }
  
  // For short URLs, redirect directly to backend
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app'
  const redirectUrl = `${backendUrl}${pathname}`
  
  return NextResponse.redirect(redirectUrl)
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
