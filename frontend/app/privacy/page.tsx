import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '../components/Logo';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dashdig',
  description: 'Privacy Policy for Dashdig URL Shortener and Analytics platform',
  openGraph: {
    title: 'Privacy Policy | Dashdig',
    description: 'Privacy Policy for Dashdig URL Shortener and Analytics platform',
    type: 'website',
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
            <Logo className="w-8 h-8" />
            <span>Dashdig</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          Last Updated: November 14, 2025
        </p>

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Introduction</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Dashdig ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our URL shortening service.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-gray-900">1.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Email address, username, password (encrypted)</li>
              <li><strong>Profile Information:</strong> Optional display name and preferences</li>
              <li><strong>URLs:</strong> Original URLs and custom short codes you create</li>
              <li><strong>Payment Information:</strong> Processed securely through third-party payment providers</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-900">1.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Analytics Data:</strong> Click counts, timestamps, referrer URLs</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
              <li><strong>Location Data:</strong> Approximate geographic location based on IP address (anonymized)</li>
              <li><strong>Usage Data:</strong> Features used, pages visited, time spent on service</li>
              <li><strong>IP Addresses:</strong> Collected for security and analytics (anonymized after processing)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-900">1.3 WordPress Plugin Data</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              When using the Dashdig WordPress plugin, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>WordPress Site URL:</strong> Your website domain for authentication</li>
              <li><strong>Plugin Version:</strong> To ensure compatibility and provide updates</li>
              <li><strong>WordPress Version:</strong> For compatibility checks</li>
              <li><strong>API Authentication Requests:</strong> To verify and secure API access</li>
              <li><strong>Analytics Data:</strong> Link performance data you choose to track</li>
              <li><strong>API Keys:</strong> Securely stored for integration authentication</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-gray-800 mb-2">
                <strong>🔌 API Endpoint Disclosure:</strong>
              </p>
              <p className="text-gray-700 mb-2">
                Our WordPress plugin connects to our secure API endpoint hosted on Railway:
              </p>
              <p className="font-mono text-sm bg-white px-3 py-2 rounded border border-gray-300 text-gray-900">
                https://dashdig-production.up.railway.app/api
              </p>
              <p className="text-gray-600 text-sm mt-2">
                All communication is encrypted via HTTPS/TLS. No data is stored on your WordPress server beyond cached API responses.
              </p>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide and maintain the URL shortening service</li>
              <li>Create and manage shortened URLs with human-readable names</li>
              <li>Generate analytics and insights for your shortened links</li>
              <li>Authenticate API requests from WordPress plugin and other integrations</li>
              <li>Process your transactions and manage subscriptions</li>
              <li>Send service-related notifications and updates</li>
              <li>Improve and optimize our service functionality</li>
              <li>Detect and prevent fraud, abuse, or security threats</li>
              <li>Comply with legal obligations and regulatory requirements</li>
            </ul>
          </section>

          {/* 3. Data Sharing and Disclosure */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>We DO NOT sell your personal information.</strong> We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> Railway (hosting), MongoDB Atlas (database), Redis Cloud (caching), Stripe (payments), and email service providers</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and user safety</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales (users will be notified)</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing with third parties</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              All service providers are contractually obligated to protect your data and use it only for providing services to Dashdig.
            </p>
          </section>

          {/* 4. Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Third-Party Services</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our service integrates with the following third-party providers:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Railway (Hosting):</strong> Backend API hosting and infrastructure at{' '}
                <span className="font-mono text-sm">dashdig-production.up.railway.app</span>
              </li>
              <li><strong>MongoDB Atlas (Database):</strong> Secure cloud database for storing URLs and analytics</li>
              <li><strong>Redis Cloud (Caching):</strong> High-performance caching for fast URL redirects</li>
              <li><strong>Vercel (Frontend Hosting):</strong> Dashboard and website hosting</li>
              <li><strong>Stripe (Payment Processing):</strong> Secure payment and subscription management</li>
              <li><strong>Email Services:</strong> Transactional emails and notifications</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              These third parties have their own privacy policies governing how they handle data. We encourage you to review them:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Railway Privacy: <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:text-[#e55a28] underline">railway.app/legal/privacy</a></li>
              <li>MongoDB Privacy: <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:text-[#e55a28] underline">mongodb.com/legal/privacy-policy</a></li>
              <li>Vercel Privacy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:text-[#e55a28] underline">vercel.com/legal/privacy-policy</a></li>
            </ul>
          </section>

          {/* 5. Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Data Retention</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Analytics Data:</strong> Retained for 24 months for reporting and insights</li>
              <li><strong>Payment Records:</strong> Retained for 7 years for tax and legal compliance</li>
              <li><strong>Security Logs:</strong> Retained for 90 days</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You may request deletion of your account and associated data at any time by contacting{' '}
              <a href="mailto:privacy@dashdig.com" className="text-[#FF6B35] hover:text-[#e55a28] underline font-medium">
                privacy@dashdig.com
              </a>
              . Some information may be retained for legal or legitimate business purposes.
            </p>
          </section>

          {/* 6. Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Data Security</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* 7. Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Your Rights</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Request limitation on how we use your data</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@dashdig.com" className="text-[#FF6B35] hover:text-[#e55a28] underline font-medium">
                privacy@dashdig.com
              </a>
            </p>
          </section>

          {/* 8. Cookies and Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze service usage</li>
              <li>Improve user experience</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You can control cookies through your browser settings, but disabling them may affect functionality.
            </p>
          </section>

          {/* 9. Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Children's Privacy</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our service is not intended for users under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          {/* 10. International Data Transfers */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. International Data Transfers</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </section>

          {/* 11. California Privacy Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. California Privacy Rights (CCPA)</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              California residents have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to deletion of personal information</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
          </section>

          {/* 12. GDPR Compliance */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. GDPR Compliance (European Users)</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              For users in the European Economic Area (EEA), we comply with GDPR requirements:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Lawful basis for processing (consent, contract, legitimate interest)</li>
              <li>Data protection by design and default</li>
              <li>Right to lodge a complaint with supervisory authority</li>
              <li>Data Protection Officer contact available</li>
            </ul>
          </section>

          {/* 13. Changes to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes via 
              email or through the service. The "Last Updated" date at the top indicates when the policy was last revised.
            </p>
          </section>

          {/* 14. Contact Us */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">14. Contact Us</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              For questions or concerns about this Privacy Policy, contact us at:
            </p>
            <ul className="list-none text-gray-700 mb-4 space-y-1">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@dashdig.com" className="text-[#FF6B35] hover:text-[#e55a28] underline font-medium">
                  privacy@dashdig.com
                </a>
              </li>
              <li>
                <strong>Support:</strong>{' '}
                <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:text-[#e55a28] underline font-medium">
                  support@dashdig.com
                </a>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6">
            <Link href="/" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              ← Back to Home
            </Link>
            <Link href="/terms" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Terms of Service
            </Link>
            <Link href="/dashboard" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Dashboard
            </Link>
            <a href="mailto:privacy@dashdig.com" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Privacy Contact
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

