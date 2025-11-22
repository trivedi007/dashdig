'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { Providers } from '../../lib/providers';
import { Logo } from '@/components/Logo';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Providers>
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Sora', 'Inter', Arial, sans-serif;
            letter-spacing: -0.01em;
          }
          
          .dashboard-nav span,
          .dashboard-nav a,
          .dashboard-nav button {
            font-family: 'Sora', 'Inter', Arial, sans-serif;
          }
          
          .nav-item span {
            font-weight: 600;
            letter-spacing: -0.01em;
          }
          
          header h1 {
            font-family: 'Sora', 'Inter', Arial, sans-serif;
            font-weight: 700;
          }
          
          .dashboard-btn {
            font-family: 'Sora', 'Inter', Arial, sans-serif;
            font-weight: 600;
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
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-lg z-50 dashboard-nav">
            {/* Logo - Professional Branding */}
            <div className="h-20 flex items-center justify-center border-b border-gray-200 px-4 py-3">
              <Logo linkTo="/dashboard/overview" />
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
                <span className="font-semibold tracking-tight">Overview</span>
              </Link>
              <Link 
                href="/dashboard/urls" 
                id="nav-urls" 
                className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer ${
                  pathname === '/dashboard/urls' ? 'active' : 'text-gray-600'
                }`}
              >
                <i className="fas fa-link text-lg"></i>
                <span className="font-semibold tracking-tight">URLs</span>
              </Link>
              <Link 
                href="/dashboard/analytics" 
                id="nav-analytics" 
                className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer ${
                  pathname === '/dashboard/analytics' ? 'active' : 'text-gray-600'
                }`}
              >
                <i className="fas fa-chart-bar text-lg"></i>
                <span className="font-semibold tracking-tight">Analytics</span>
              </Link>
              <Link 
                href="/dashboard/widget" 
                id="nav-widget" 
                className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer ${
                  pathname === '/dashboard/widget' ? 'active' : 'text-gray-600'
                }`}
              >
                <i className="fas fa-code text-lg"></i>
                <span className="font-semibold tracking-tight">Widget</span>
              </Link>
            </nav>
            
            {/* Help Section */}
            <div className="absolute bottom-8 left-4 right-4">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-orange-900 mb-2" style={{ fontFamily: "'Sora', 'Inter', Arial, sans-serif" }}>Need help?</h3>
                <p className="text-xs text-orange-700 mb-3" style={{ fontFamily: "'Sora', 'Inter', Arial, sans-serif" }}>Check the widget guide for integration help.</p>
                <a href="#" className="text-orange-600 text-sm font-semibold hover:underline" style={{ fontFamily: "'Sora', 'Inter', Arial, sans-serif" }}>View guide →</a>
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
                  <button className="px-4 py-2 orange-gradient text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all dashboard-btn">
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
