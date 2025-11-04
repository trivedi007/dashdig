'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Providers } from '../../lib/providers'
import { DashboardHeader } from '../components/DashboardHeader'

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
    { name: 'Overview', href: '/dashboard/overview', icon: '📊', emoji: '📊' },
    { name: 'URLs', href: '/dashboard/urls', icon: '🔗', emoji: '🔗' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📈', emoji: '📈' },
    { name: 'Widget', href: '/dashboard/widget', icon: '🔌', emoji: '🔌' },
  ]

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-slate-100 text-slate-900 pt-16">
        {/* Dashboard Header */}
        <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Sidebar */}
        <aside
          className={`fixed top-16 bottom-0 left-0 z-40 w-[240px] transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >

          {/* Navigation */}
          <div className="flex h-full flex-col justify-between overflow-y-auto">
            <div className="px-3 py-6">
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </p>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname?.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#FF6B35] text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#FF6B35]'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{item.emoji}</span>
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Help Section */}
            <div className="p-3 pb-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-sm font-bold text-slate-900">Need help?</p>
                <p className="mb-3 text-xs leading-relaxed text-slate-600">
                  Check the widget guide for integration help.
                </p>
                <Link
                  href="/dashboard/widget"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] transition hover:text-[#E85A2A]"
                >
                  View guide →
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-[240px]">
          {/* Main Content */}
          <main className="relative flex-1 bg-slate-50 px-4 pb-12 pt-8 sm:px-6 lg:px-8 z-10">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  )
}
