import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Dashdig",
  description: "Dashdig privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">⚡</span>
            <span>Dash</span>
            <span className="text-[#FF6B35]">dig</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: January 15, 2025</p>

        <div className="prose prose-invert prose-orange max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Dashdig (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our URL shortening service, website (dashdig.com),
              and browser extension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Account information (email address, password) when you create an account</li>
              <li>URLs you submit for shortening</li>
              <li>Custom slugs or aliases you create</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Click analytics on shortened URLs (click count, timestamp, referrer)</li>
              <li>Browser type and version</li>
              <li>Geographic location (country/region level only)</li>
              <li>Device type (desktop, mobile, tablet)</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">2.3 Browser Extension</h3>
            <p className="text-gray-300 leading-relaxed">
              Our browser extension stores your recent shortened URLs locally in your browser.
              This data never leaves your device unless you explicitly use the shortening feature,
              which sends the URL to our servers for processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>To provide and maintain our URL shortening service</li>
              <li>To generate AI-powered human-readable short URLs</li>
              <li>To provide click analytics and insights</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send service-related communications</li>
              <li>To improve and optimize our services</li>
              <li>To prevent abuse and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">4. Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share information only in these circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our service (hosting, payment processing, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">5. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">6. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide services.
              You can request deletion of your account and associated data at any time by contacting us
              at support@dashdig.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">7. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">8. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies to maintain your session and preferences. We do not use
              third-party tracking cookies for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">11. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none text-gray-300 space-y-2 mt-4">
              <li>Email: <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:underline">support@dashdig.com</a></li>
              <li>Website: <a href="https://dashdig.com" className="text-[#FF6B35] hover:underline">dashdig.com</a></li>
            </ul>
          </section>

        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#FF6B35] hover:underline"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Dashdig. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
