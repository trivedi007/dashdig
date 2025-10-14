'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  
  useEffect(() => {
    // Don't redirect special pages - let Next.js handle them normally
    const specialPages = ['debug-analytics', 'bypass', 'dashboard', 'auth', 'onboarding']
    if (specialPages.includes(params.slug)) {
      return
    }
    
    // Only redirect actual short URLs to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app'
    
    // Redirect to backend for URL resolution
    window.location.href = `${backendUrl}/${params.slug}`
  }, [params.slug])

  // Don't redirect special pages - show 404 for them
  const specialPages = ['debug-analytics', 'bypass', 'dashboard', 'auth', 'onboarding']
  if (specialPages.includes(params.slug)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">This page doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
