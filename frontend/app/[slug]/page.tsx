'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to backend for URL resolution
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app'
    window.location.href = `${backendUrl}/${params.slug}`
  }, [params.slug])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
