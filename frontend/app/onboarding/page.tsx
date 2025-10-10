'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/signin')
      return
    }
    
    // For MVP, skip payment and go directly to dashboard
    setTimeout(() => {
      router.push('/dashboard?welcome=true')
    }, 2000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Dashdig!</h1>
        <p className="text-gray-600 mb-6">
          Your account has been created successfully. 
          You're now ready to create your first smart link!
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
