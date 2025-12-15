'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    _hsq: any[];
  }
}

export default function HubSpotChat() {
  const { data: session } = useSession();

  useEffect(() => {
    // Don't load twice
    if (document.getElementById('hs-script-loader')) return;
    
    // Load HubSpot script
    const script = document.createElement('script');
    script.src = '//js.hs-scripts.com/244605971.js';
    script.async = true;
    script.defer = true;
    script.id = 'hs-script-loader';
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('hs-script-loader');
      if (existingScript) existingScript.remove();
    };
  }, []);

  // Identify user when logged in
  useEffect(() => {
    if (session?.user && typeof window !== 'undefined') {
      window._hsq = window._hsq || [];
      window._hsq.push(['identify', {
        email: session.user.email,
        firstname: session.user.name?.split(' ')[0] || '',
      }]);
    }
  }, [session]);

  return null;
}

