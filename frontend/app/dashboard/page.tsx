'use client';

import { useEffect } from 'react';
import { LightningBolt } from '@/components/ui/LightningBolt';

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
          <LightningBolt size="lg" />
        </div>
        <p className="text-white font-semibold text-lg">Loading Dashboard...</p>
        <p className="text-[#A0A0A0] text-sm">Preparing your analytics</p>
      </div>
    </div>
  );
}
