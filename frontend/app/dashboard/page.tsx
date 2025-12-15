'use client';

import { useEffect } from 'react';

export default function DashboardRoute() {
  useEffect(() => {
    // Redirect to main page with dashboard view parameter
    window.location.href = '/?view=dashboard';
  }, []);
  
  // Show branded loading state during redirect
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#FF6B35] rounded-xl flex items-center justify-center animate-pulse border-3 border-[#1A1A1A]">
          <svg className="w-8 h-8 text-[#FFCC33]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <p className="text-white font-semibold text-lg">Loading Dashboard...</p>
        <p className="text-[#A0A0A0] text-sm">Preparing your analytics</p>
      </div>
    </div>
  );
}
