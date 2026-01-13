'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('[AUTH CALLBACK] ========================================');
    console.log('[AUTH CALLBACK] Page loaded');
    console.log('[AUTH CALLBACK] Current URL:', window.location.href);
    console.log('[AUTH CALLBACK] Search params:', searchParams.toString());
    
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    console.log('[AUTH CALLBACK] Token received:', token ? 'YES' : 'NO');
    if (token) {
      console.log('[AUTH CALLBACK] Token (first 20 chars):', token.substring(0, 20) + '...');
    }
    console.log('[AUTH CALLBACK] Error:', error);

    if (error) {
      console.error('[AUTH CALLBACK] Auth error detected:', error);
      router.push('/login?error=' + error);
      return;
    }

    if (token) {
      try {
        console.log('[AUTH CALLBACK] Storing token in localStorage...');
        localStorage.setItem('dashdig_token', token);
        
        // Verify it was stored
        const stored = localStorage.getItem('dashdig_token');
        console.log('[AUTH CALLBACK] Token stored successfully:', !!stored);
        console.log('[AUTH CALLBACK] Stored token matches:', stored === token);
        
        // Also store in cookie for server-side access
        document.cookie = `dashdig_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        console.log('[AUTH CALLBACK] Cookie set successfully');
        
        // Redirect directly to main page with dashboard view (skip intermediate /dashboard redirect)
        console.log('[AUTH CALLBACK] Redirecting to dashboard...');
        console.log('[AUTH CALLBACK] ========================================');
        
        // Small delay to ensure token is fully stored before redirect
        setTimeout(() => {
          window.location.href = '/?view=dashboard';
        }, 100);
      } catch (err) {
        console.error('[AUTH CALLBACK] Error storing token:', err);
        router.push('/login?error=token_storage_error');
      }
    } else {
      console.log('[AUTH CALLBACK] No token received, redirecting to login');
      console.log('[AUTH CALLBACK] ========================================');
      router.push('/login?error=no_token');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center text-white">
        <h2 className="text-xl font-bold mb-2">Authenticating...</h2>
        <p>Please wait while we complete your login.</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
