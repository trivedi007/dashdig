'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from 'lucide-react';
import { LightningBolt } from '@/components/ui/LightningBolt';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      console.error('Auth error:', errorParam);
      setError(errorParam);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?error=' + errorParam);
      }, 3000);
      return;
    }

    if (token) {
      try {
        // Store the JWT token
        localStorage.setItem('dashdig_token', token);
        
        // Also store in a cookie for server-side access if needed
        document.cookie = `dashdig_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        
        console.log('✅ Authentication successful');
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Error storing token:', err);
        setError('token_storage_error');
        setTimeout(() => {
          router.push('/login?error=token_storage_error');
        }, 3000);
      }
    } else {
      setError('no_token');
      setTimeout(() => {
        router.push('/login?error=no_token');
      }, 3000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo Animation */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#FF6B35] border-3 border-[#1A1A1A] rounded-xl flex items-center justify-center shadow-[4px_4px_0_#1A1A1A] animate-pulse">
            <LightningBolt size="lg" />
          </div>
        </div>

        {error ? (
          <>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-4">
              Authentication Failed
            </h2>
            <p className="text-[#666] mb-4">
              {error === 'auth_failed' && 'Google authentication failed. Please try again.'}
              {error === 'token_error' && 'Failed to generate authentication token.'}
              {error === 'no_token' && 'No authentication token received.'}
              {error === 'token_storage_error' && 'Failed to store authentication token.'}
              {!['auth_failed', 'token_error', 'no_token', 'token_storage_error'].includes(error) && 
                `An error occurred: ${error}`}
            </p>
            <p className="text-sm text-[#666]">
              Redirecting to login page...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-4">
              Authenticating...
            </h2>
            <p className="text-[#666] mb-6">
              Please wait while we complete your login.
            </p>
            <div className="flex items-center justify-center gap-2 text-[#FF6B35]">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="font-semibold">Processing</span>
            </div>
          </>
        )}

        {/* Dashdig Branding */}
        <div className="mt-8 pt-6 border-t-2 border-[#1A1A1A]/10">
          <p className="text-xs font-bold tracking-widest text-[#FF6B35] uppercase">
            DASHDIG • HUMANIZE • SHORTENIZE
          </p>
        </div>
      </div>
    </div>
  );
}
