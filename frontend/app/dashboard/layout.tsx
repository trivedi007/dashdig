'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Providers } from '../../lib/providers'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isClient, setIsClient] = useState(false)
  
  // Check for authentication token on mount (client-side only)
  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No auth token found, redirecting to bypass page...')
      // Use setTimeout to avoid blocking render
      setTimeout(() => router.push('/bypass'), 100)
    }
  }, [router])
  
  // Show loading state during SSR or while checking auth
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35]"></div>
      </div>
    )
  }

  const navigation = [
    { name: 'Overview', href: '/dashboard/overview', icon: '📊' },
    { name: 'URLs', href: '/dashboard/urls', icon: '🔗' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { name: 'Widget', href: '/dashboard/widget', icon: '🔌' },
  ]

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Toggle sidebar</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <Link href="/dashboard/overview" className="flex ml-2 md:mr-24">
                  <span className="text-3xl">⚡</span>
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white ml-2">
                    <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                      Dashdig
                    </span>
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-700 hover:text-[#FF6B35] dark:text-gray-300 dark:hover:text-[#FF6B35] transition-colors"
                >
                  Home
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-lg hover:opacity-90 transition-opacity"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } bg-white border-r border-gray-200 lg:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              {navigation.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`p-4 ${sidebarOpen ? 'lg:ml-64' : ''} pt-20 transition-all duration-300`}>
          {children}
        </div>
      </div>
    </Providers>
  )
}

