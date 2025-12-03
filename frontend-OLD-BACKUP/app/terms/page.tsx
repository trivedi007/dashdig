import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Terms of Service | Dashdig',
  description: 'Terms of Service for Dashdig URL Shortener and Analytics platform',
  openGraph: {
    title: 'Terms of Service | Dashdig',
    description: 'Terms of Service for Dashdig URL Shortener and Analytics platform',
    type: 'website',
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
            <Logo size="md" variant="icon-only" linkTo={null} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Terms of Service</h1>
        <p className="text-gray-600 mb-8">
          Last Updated: November 14, 2025
        </p>

        <div className="prose prose-lg max-w-none">
          {/* 1. Acceptance of Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              By accessing or using Dashdig ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, do not use the Service.
            </p>
          </section>

          {/* 2. Description of Service */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Description of Service</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Dashdig provides URL shortening, link management, and analytics services ("Service"). 
              The Service allows users to create shortened URLs with human-readable names and track link performance.
            </p>
          </section>

          {/* 3. Account Registration */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Account Registration</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              To use certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          {/* 4. Acceptable Use */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Acceptable Use</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You agree NOT to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute malware, viruses, or harmful code</li>
              <li>Engage in phishing, spam, or fraudulent activities</li>
              <li>Create misleading or deceptive shortened URLs</li>
              <li>Abuse, harass, or harm others</li>
              <li>Overload or interfere with Service infrastructure</li>
            </ul>
          </section>

          {/* 5. Subscription and Payment */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Subscription and Payment</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Paid subscriptions are billed in advance on a recurring basis. You agree to pay all applicable fees. 
              Fees are non-refundable except as required by law. We reserve the right to change pricing with 30 days notice.
            </p>
          </section>

          {/* 6. Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The Service, including all content, features, and functionality, is owned by Dashdig and protected by 
              copyright, trademark, and other intellectual property laws. You retain ownership of content you submit.
            </p>
          </section>

          {/* 7. Data and Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Data and Privacy</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Your use of the Service is subject to our{' '}
              <Link href="/privacy" className="text-[#FF6B35] hover:text-[#e55a28] underline font-medium">
                Privacy Policy
              </Link>
              . By using the Service, you consent to our collection and use of data as described in the Privacy Policy.
            </p>
          </section>

          {/* 8. Service Availability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Service Availability</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We strive for 99.9% uptime but do not guarantee uninterrupted access. We reserve the right to 
              modify, suspend, or discontinue the Service at any time with reasonable notice.
            </p>
          </section>

          {/* 9. Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Termination</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We may terminate or suspend your account for violations of these Terms. You may cancel your 
              account at any time. Upon termination, your right to use the Service immediately ceases.
            </p>
          </section>

          {/* 10. Disclaimer of Warranties */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
              WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE OR UNINTERRUPTED.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DASHDIG SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Indemnification</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You agree to indemnify and hold harmless Dashdig from any claims, damages, losses, or expenses 
              arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* 13. Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Governing Law</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which Dashdig operates, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* 14. Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">14. Changes to Terms</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes 
              via email or Service notification. Continued use after changes constitutes acceptance.
            </p>
          </section>

          {/* 15. Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">15. Third-Party Services</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The Service may integrate with third-party services. We are not responsible for the content, 
              privacy policies, or practices of third-party services. Your use of third-party services is at your own risk.
            </p>
          </section>

          {/* 16. Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">16. Contact Information</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              For questions about these Terms, contact us at:{' '}
              <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:text-[#e55a28] underline font-medium">
                support@dashdig.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6">
            <Link href="/" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              ← Back to Home
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


