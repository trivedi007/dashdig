import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Documentation | Dashdig',
  description: 'Documentation and guides for Dashdig URL Shortener - Getting started, WordPress plugin, API reference',
  openGraph: {
    title: 'Documentation | Dashdig',
    description: 'Everything you need to get started with Dashdig URL Shortener',
    type: 'website',
  },
};

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
            <Logo linkTo={null} variant="compact" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Documentation</h1>
        <p className="text-gray-600 text-lg mb-12">
          Everything you need to get started with Dashdig - Humanize and Shortenize URLs
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Getting Started */}
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Getting Started</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Quick start guide to create your first human-readable short URL
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
              <li>Sign up for a free account at <Link href="/auth/signin" className="text-[#FF6B35] hover:underline">dashdig.com</Link></li>
              <li>Access your dashboard</li>
              <li>Click "Create New Link" button</li>
              <li>Enter your long URL</li>
              <li>Customize your human-readable short URL</li>
              <li>Click "Dig This!" to create your link</li>
            </ol>
            <Link 
              href="/auth/signin" 
              className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
            >
              Get Started Free
            </Link>
          </section>

          {/* WordPress Plugin */}
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🔌</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">WordPress Plugin</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Install Dashdig on your WordPress site for seamless integration
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
              <li>Install from WordPress.org plugin directory</li>
              <li>Activate the "Dashdig Analytics" plugin</li>
              <li>Go to <strong>Settings → Dashdig</strong></li>
              <li>Enter your API key from dashboard</li>
              <li>Click "Test Connection" to verify</li>
              <li>Save settings and start shortening!</li>
            </ol>
            <a 
              href="https://wordpress.org/plugins/dashdig-analytics/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
            >
              Download Plugin
            </a>
          </section>

          {/* API Documentation */}
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🔑</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">API Access</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Integrate Dashdig into your applications with our RESTful API
            </p>
            <div className="bg-gray-50 p-4 rounded border border-gray-300 mb-4 overflow-x-auto">
              <p className="text-xs text-gray-600 mb-2">Endpoint:</p>
              <code className="text-sm text-gray-900 font-mono">
                POST https://dashdig-production.up.railway.app/api/shorten
              </code>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Authentication:</strong> Bearer token in Authorization header
              </p>
            </div>
            <Link 
              href="/dashboard" 
              className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
            >
              Get API Key
            </Link>
          </section>

          {/* Support */}
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Get Help</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Need assistance? We're here to help!
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">📧 Support:</span>
                <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:underline">
                  support@dashdig.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">🔒 Privacy:</span>
                <a href="mailto:privacy@dashdig.com" className="text-[#FF6B35] hover:underline">
                  privacy@dashdig.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">💼 Sales:</span>
                <a href="mailto:sales@dashdig.com" className="text-[#FF6B35] hover:underline">
                  sales@dashdig.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">🐛 Issues:</span>
                <a href="https://github.com/trivedi007/dashdig/issues" className="text-[#FF6B35] hover:underline" target="_blank" rel="noopener noreferrer">
                  GitHub Issues
                </a>
              </li>
            </ul>
            <a 
              href="mailto:support@dashdig.com"
              className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
            >
              Contact Support
            </a>
          </section>
        </div>

        {/* API Reference Section */}
        <section className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">🔧 API Reference</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Create Short URL</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Request:</p>
                <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
{`POST /api/shorten
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "url": "https://example.com/very-long-url",
  "keywords": ["optional", "keywords"],
  "customSlug": "optional-custom-slug"
}`}
                </pre>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-300 mt-4">
                <p className="text-sm text-gray-600 mb-2">Response:</p>
                <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "shortCode": "Example.Long.Custom.Slug",
    "shortUrl": "https://dashdig.com/Example.Long.Custom.Slug",
    "originalUrl": "https://example.com/very-long-url"
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Get Analytics</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Request:</p>
                <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
{`GET /api/analytics/:shortCode
Authorization: Bearer YOUR_API_KEY`}
                </pre>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-300 mt-4">
                <p className="text-sm text-gray-600 mb-2">Response:</p>
                <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "clicks": 1234,
    "uniqueClicks": 567,
    "browsers": { "Chrome": 45, "Firefox": 30 },
    "devices": { "Desktop": 60, "Mobile": 40 },
    "countries": { "US": 50, "UK": 20 }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">❓ Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">What makes Dashdig different?</h3>
              <p className="text-gray-700 leading-relaxed">
                Dashdig creates <strong>human-readable short URLs</strong> like "dashdig.com/Target.Tide.WashingMachine.Cleaner" 
                instead of cryptic strings like "bit.ly/3xK9mP2". Our tagline says it all: <strong>"Humanize and Shortenize URLs"</strong>. 
                These memorable links are easier to share verbally, improve click-through rates, and boost SEO.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Is there a free plan?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes! Our free plan includes <strong>100 short URLs per month</strong> and basic analytics including 
                click tracking, browser stats, and device breakdown. Perfect for personal projects and small websites.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">How do I get an API key?</h3>
              <p className="text-gray-700 leading-relaxed">
                Sign up for an account, then go to <strong>Dashboard → Settings → API Keys</strong> to generate your key. 
                You can create multiple API keys for different applications and revoke them anytime.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Can I use custom domains?</h3>
              <p className="text-gray-700 leading-relaxed">
                Custom domains are available on Pro and Enterprise plans. Use your own branded domain like "go.yourcompany.com" 
                for shortened URLs. Contact{' '}
                <a href="mailto:sales@dashdig.com" className="text-[#FF6B35] hover:underline">sales@dashdig.com</a> for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">How does the WordPress plugin work?</h3>
              <p className="text-gray-700 leading-relaxed">
                The WordPress plugin connects to our secure API at{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">dashdig-production.up.railway.app</code> to 
                create short URLs directly from your WordPress dashboard. All communication is encrypted via HTTPS/TLS. 
                See our{' '}
                <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link> for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">What analytics do you provide?</h3>
              <p className="text-gray-700 leading-relaxed">
                Dashdig provides comprehensive analytics including: total clicks, unique visitors, geographic location (city/country), 
                browser types, device breakdown (desktop/mobile/tablet), referrer sources, and time-based click patterns. 
                Analytics data is retained for 24 months.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Is my data secure?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes! We use industry-standard security measures including HTTPS/TLS encryption, bcrypt password hashing, 
                secure MongoDB Atlas storage, and Redis Cloud caching. We are GDPR and CCPA compliant. 
                Read our full{' '}
                <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Can I delete my short URLs?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes, you can delete any short URL from your dashboard at any time. Once deleted, the short URL will 
                immediately stop redirecting. This is useful for managing expired campaigns or removing outdated links.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-lg border border-orange-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">📚 Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/terms" className="text-[#FF6B35] hover:underline">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Resources</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard" className="text-[#FF6B35] hover:underline">Dashboard</Link>
                </li>
                <li>
                  <a href="https://wordpress.org/plugins/dashdig-analytics/" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:underline">
                    WordPress Plugin
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Support</h3>
              <ul className="space-y-1">
                <li>
                  <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:underline">Email Support</a>
                </li>
                <li>
                  <a href="https://github.com/trivedi007/dashdig/issues" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:underline">
                    Report Issues
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6">
            <Link href="/" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              ← Back to Home
            </Link>
            <Link href="/terms" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link href="/dashboard" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Dashboard
            </Link>
            <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Contact Support
            </a>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Dashdig. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}


