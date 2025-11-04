'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Providers } from '../../lib/providers'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navigation = [
    { name: 'Overview', href: '/overview', icon: 'fa-chart-line' },
    { name: 'URLs', href: '/urls', icon: 'fa-link' },
    { name: 'Analytics', href: '/analytics', icon: 'fa-chart-bar' },
    { name: 'Widget', href: '/widget', icon: 'fa-plug' },
  ]

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <Providers>
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Fixed Top Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between">
            {/* Left: Logo + Hamburger */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
              
              <Link href="/overview" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-lg flex items-center justify-center shadow-sm">
                  <i className="fas fa-bolt text-white text-lg"></i>
                </div>
                <span className="text-xl font-bold text-slate-900 hidden sm:block">
                  Dashdig
                </span>
              </Link>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center gap-4">
              {/* Notifications (optional) */}
              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block">
                <i className="far fa-bell text-lg"></i>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full"></span>
              </button>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4ECDC4] to-[#3bb5b0] rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                    <i className="fas fa-user"></i>
                  </div>
                  <i className={`fas fa-chevron-down text-xs text-slate-600 transition-transform ${userMenuOpen ? 'rotate-180' : ''} hidden sm:block`}></i>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      
                      {/* Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-200">
                          <p className="text-sm font-semibold text-slate-900">John Doe</p>
                          <p className="text-xs text-slate-500 mt-0.5">john@example.com</p>
                        </div>
                        
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <i className="fas fa-user-circle w-4 text-slate-400"></i>
                          Profile
                        </Link>
                        
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <i className="fas fa-cog w-4 text-slate-400"></i>
                          Settings
                        </Link>
                        
                        <div className="border-t border-slate-200 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false)
                              logout()
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <i className="fas fa-sign-out-alt w-4"></i>
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <nav className="h-full overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <i className={`fas ${item.icon} w-5 text-center`}></i>
                      <span>{item.name}</span>
                      {isActive && (
                        <i className="fas fa-chevron-right ml-auto text-sm"></i>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Quick Actions */}
            <div className="mt-8 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <i className="fas fa-bolt text-[#FF6B35]"></i>
                Quick Actions
              </h3>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-slate-700 hover:text-[#FF6B35] transition-colors"
              >
                <i className="fas fa-plus-circle"></i>
                Create New URL
              </Link>
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="lg:ml-64 pt-16 min-h-screen">
          <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </Providers>
  )
}

