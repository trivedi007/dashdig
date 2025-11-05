'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Providers } from '../../lib/providers';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard/overview', icon: 'fa-home' },
    { name: 'URLs', href: '/dashboard/urls', icon: 'fa-link' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'fa-chart-bar' },
    { name: 'Widget', href: '/dashboard/widget', icon: 'fa-code' },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <Providers>
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/dashboard/overview" className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-gray-900">Dashdig</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${
                    active
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <i className={`fas ${item.icon} text-lg`}></i>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Need Help Box */}
        <div className="p-4 m-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <i className="fas fa-question text-white"></i>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Need help?</h3>
              <p className="text-xs text-gray-600 mb-3">
                Check our docs or contact support
              </p>
              <Link
                href="/docs"
                className="inline-block text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View Documentation →
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Create Link Button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300"
            >
              <i className="fas fa-plus"></i>
              <span>Create Link</span>
            </Link>

            {/* User Avatar */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full border-2 border-gray-200"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-user-circle text-gray-400"></i>
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-cog text-gray-400"></i>
                  <span>Settings</span>
                </Link>
                <div className="border-t border-gray-100 my-2"></div>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/auth/signin';
                  }}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
    </Providers>
  );
}
