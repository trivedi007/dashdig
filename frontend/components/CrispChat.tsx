'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Crisp Chat Widget Integration Component
export default function CrispChat() {
  const { data: session, status } = useSession();

  // Initialize Crisp
  useEffect(() => {
    // Add Crisp script to page
    if (typeof window !== 'undefined' && !window.$crisp) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || 'YOUR_CRISP_WEBSITE_ID';
      
      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      document.head.appendChild(script);

      console.log('🗨️ Crisp chat widget initialized');
    }
  }, []);

  // Push user data to Crisp when session is available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.$crisp && session?.user) {
      const user = session.user;
      
      console.log('🗨️ Personalizing Crisp with user data:', {
        name: user.name,
        email: user.email
      });

      // Set user email
      if (user.email) {
        window.$crisp.push(['set', 'user:email', [user.email]]);
      }

      // Set user nickname (full name)
      if (user.name) {
        window.$crisp.push(['set', 'user:nickname', [user.name]]);
      }

      // Set session data with first name for personalized triggers
      const firstName = user.name?.split(' ')[0] || 'there';
      window.$crisp.push(['set', 'session:data', [[
        ['firstName', firstName],
        ['isAuthenticated', 'true'],
        ['plan', 'Free'] // You can pass more user data here
      ]]]);

      // Optional: Set user avatar if available
      if (user.image) {
        window.$crisp.push(['set', 'user:avatar', [user.image]]);
      }

      console.log('✅ Crisp personalized with first name:', firstName);
    }
  }, [session, status]);

  // Reset Crisp data on logout
  useEffect(() => {
    if (typeof window !== 'undefined' && window.$crisp && status === 'unauthenticated') {
      console.log('🗨️ Resetting Crisp session data');
      window.$crisp.push(['do', 'session:reset']);
    }
  }, [status]);

  return null; // This component doesn't render anything
}

// TypeScript declaration for Crisp
declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}


