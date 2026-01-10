'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader, Phone } from 'lucide-react';
import { LightningBolt } from '@/components/ui/LightningBolt';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password.');
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    console.log(`Logging in with ${provider}`);
    setLoading(true);
    await signIn(provider.toLowerCase(), { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-[#1A1A1A] hover:text-[#FF6B35] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-white border-3 border-[#1A1A1A] rounded-xl shadow-[4px_4px_0_#1A1A1A] p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FF6B35] border-3 border-[#1A1A1A] rounded-xl flex items-center justify-center shadow-[2px_2px_0_#1A1A1A] transition-transform group-hover:rotate-[-5deg] group-hover:scale-110">
                  <LightningBolt size="md" />
                </div>
                <div>
                  <h1 className="text-2xl font-black">
                    <span className="text-[#1A1A1A] group-hover:text-[#FF6B35] transition-colors">Dash</span>
                    <span className="text-[#FF6B35] group-hover:text-[#1A1A1A] transition-colors">dig</span>
                  </h1>
                </div>
              </div>
              <span className="text-sm font-bold tracking-widest text-[#FF6B35] uppercase">
                HUMANIZE • SHORTENIZE • URLS
              </span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-black text-center text-[#1A1A1A] mb-8">
            Sign in to your account
          </h2>

          {/* Email/Password Form */}
          <form onSubmit={handleSignIn} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-white border-2 border-[#1A1A1A] rounded-lg text-[#1A1A1A] placeholder-[#666] focus:outline-none focus:border-[#FF6B35] transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white border-2 border-[#1A1A1A] rounded-lg text-[#1A1A1A] placeholder-[#666] focus:outline-none focus:border-[#FF6B35] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#1A1A1A] text-sm font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-400 rounded-lg">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#FF6B35] hover:text-[#E55A2B] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF6B35] text-white font-black uppercase text-sm border-3 border-[#1A1A1A] rounded-lg shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#1A1A1A]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm font-bold text-[#666]">OR</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full py-3 px-4 bg-white text-[#1A1A1A] font-semibold border-2 border-[#1A1A1A] rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#1A1A1A] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocialLogin('Apple')}
              className="w-full py-3 px-4 bg-[#1A1A1A] text-white font-semibold border-2 border-[#1A1A1A] rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#1A1A1A] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.33 14.96c-.35.77-.52 1.12-1 1.81-.65.96-1.57 2.15-2.71 2.16-1.01.01-1.28-.65-2.61-.64-1.33.01-1.63.66-2.64.64-1.14-.01-1.99-1.09-2.64-2.05-1.82-2.67-2.01-5.81-.89-7.47.8-1.19 2.05-1.88 3.24-1.88 1.21 0 1.97.66 2.96.66.96 0 1.54-.66 2.92-.66 1.04 0 2.17.57 2.97 1.54-2.61 1.43-2.19 5.15.4 6.89zM13.24 3.57c.51-.67.91-1.6.76-2.57-.83.04-1.8.58-2.38 1.27-.51.61-.93 1.56-.77 2.47.91.06 1.85-.49 2.39-1.17z"/>
              </svg>
              Continue with Apple
            </button>

            {/* Phone */}
            <button
              onClick={() => handleSocialLogin('Phone')}
              className="w-full py-3 px-4 bg-white text-[#FF6B35] font-semibold border-2 border-[#FF6B35] rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#FF6B35] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              Continue with Phone
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-[#666]">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-[#FF6B35] hover:text-[#E55A2B] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs text-[#666]">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-[#1A1A1A] hover:text-[#FF6B35] font-semibold">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#1A1A1A] hover:text-[#FF6B35] font-semibold">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
