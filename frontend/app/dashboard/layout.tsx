'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Providers } from '../../lib/providers';
import Script from 'next/script';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const showSection = (section: string) => {
    // This will be handled by Next.js routing
  };

  return (
    <Providers>
      <>
        {/* Tailwind CSS */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
          }
          
          .stat-card {
            transition: all 0.3s ease;
          }
          
          .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .nav-item {
            transition: all 0.2s ease;
          }
          
          .nav-item:hover {
            background: rgba(255, 107, 44, 0.1);
            transform: translateX(4px);
          }
          
          .nav-item.active {
            background: linear-gradient(135deg, #FF6B2C 0%, #FF8C5C 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(255, 107, 44, 0.3);
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .orange-gradient {
            background: linear-gradient(135deg, #FF6B2C 0%, #FF8C5C 100%);
          }
          
          .blue-gradient {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          }
          
          .green-gradient {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          }
          
          .purple-gradient {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
          }
        `}</style>

        <div className="bg-gray-50">
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-lg z-50">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 orange-gradient rounded-lg flex items-center justify-center shadow-lg">
                  <i className="fas fa-link text-white text-xl"></i>
                </div>
                <span className="text-2xl font-bold text-gray-900">Dashdig</span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-4 space-y-2">
              <Link 
                href="/dashboard/overview" 
                id="nav-overview" 
                className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer ${
                  pathname === '/dashboard/overview' ? 'active' : 'text-gray-600'
                }`}
              >
                <i className="fas fa-home text-lg"></i>
                <span className="font-medium">Overview</span>
              </Link>
              <Link 
                href="/dashboard/urls" 
                id="nav-urls" 
                className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer ${
                  pathname === '/dashboard/urls' ? 'active' : 'text-gray-600'
                }`}
              >
                <i className="fas fa-link text-lg"></i>
                <span className="font-medium">URLs</span>
              </Link>
              <Link 
                href="/dashboard/analytics" 
                id="nav-analytics" 
                className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer ${
                  pathname === '/dashboard/analytics' ? 'active' : 'text-gray-600'
                }`}
              >
                <i className="fas fa-chart-bar text-lg"></i>
                <span className="font-medium">Analytics</span>
              </Link>
              <Link 
                href="/dashboard/widget" 
                id="nav-widget" 
                className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer ${
                  pathname === '/dashboard/widget' ? 'active' : 'text-gray-600'
                }`}
              >
                <i className="fas fa-code text-lg"></i>
                <span className="font-medium">Widget</span>
              </Link>
            </nav>
            
            {/* Help Section */}
            <div className="absolute bottom-8 left-4 right-4">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-orange-900 mb-2">Need help?</h3>
                <p className="text-xs text-orange-700 mb-3">Check the widget guide for integration help.</p>
                <a href="#" className="text-orange-600 text-sm font-medium hover:underline">View guide →</a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="ml-64">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
              <div className="h-full px-8 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900" id="page-title">
                    {pathname === '/dashboard/overview' && 'Dashboard Overview'}
                    {pathname === '/dashboard/urls' && 'URL Management'}
                    {pathname === '/dashboard/analytics' && 'Analytics'}
                    {pathname === '/dashboard/widget' && 'Widget Integration'}
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 orange-gradient text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
                    <i className="fas fa-plus mr-2"></i>Create Link
                  </button>
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <i className="fas fa-user text-gray-600"></i>
                  </div>
                </div>
              </div>
            </header>

            {/* Page Content */}
            {children}
          </div>
        </div>
      </>
    </Providers>
  );
}
