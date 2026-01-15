import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - Dashdig",
  description: "Dashdig terms of service - rules and guidelines for using our URL shortening service.",
};

export default function TermsOfService() {
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
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: January 15, 2025</p>

        <div className="prose prose-invert prose-orange max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using Dashdig (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              Dashdig is an AI-powered URL shortening service that creates human-readable short links.
              The Service includes our website (dashdig.com), API, and browser extension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">3. Acceptable Use</h2>
            <p className="text-gray-300 leading-relaxed mb-4">You agree NOT to use Dashdig to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Create links to illegal, harmful, or malicious content</li>
              <li>Distribute malware, viruses, or phishing attempts</li>
              <li>Spam or send unsolicited communications</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm others</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Circumvent security measures or access restrictions</li>
              <li>Overload or disrupt our infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">4. User Accounts</h2>
            <p className="text-gray-300 leading-relaxed">
              You are responsible for maintaining the security of your account credentials.
              You agree to notify us immediately of any unauthorized access to your account.
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              The Dashdig name, logo, and all related trademarks are our property.
              You retain ownership of the content you link to. By using our Service,
              you grant us a license to process and redirect URLs as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">6. Link Availability</h2>
            <p className="text-gray-300 leading-relaxed">
              We strive to maintain high availability but do not guarantee that links will
              be accessible at all times. We reserve the right to disable or remove links
              that violate our terms or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">7. Paid Services</h2>
            <p className="text-gray-300 leading-relaxed">
              Paid plans are billed in advance. Refunds are provided at our discretion.
              We reserve the right to modify pricing with reasonable notice.
              Failure to pay may result in service suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-300 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND.
              WE DO NOT GUARANTEE THAT THE SERVICE WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DASHDIG SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
              FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">10. Indemnification</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to indemnify and hold harmless Dashdig from any claims, damages,
              or expenses arising from your use of the Service or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">11. Modifications</h2>
            <p className="text-gray-300 leading-relaxed">
              We may modify these terms at any time. Continued use of the Service after
              changes constitutes acceptance of the new terms. We will notify users of
              significant changes via email or website notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">12. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your access to the Service at any time,
              with or without cause, with or without notice. Upon termination,
              your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">13. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms shall be governed by the laws of the jurisdiction in which
              Dashdig operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#FF6B35] mb-4">14. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms of Service, contact us at:
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
