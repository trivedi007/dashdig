'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/signin')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p>Welcome to your SmartLink dashboard!</p>
          <p className="mt-4 text-gray-600">
            You are now signed in. URL shortening and other features coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
