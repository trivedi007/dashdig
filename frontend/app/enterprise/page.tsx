'use client';

import { useState } from 'react';
import { LightningBolt } from '@/components/ui/LightningBolt';
import { Lock, TrendingUp, Zap, User, BarChart, Code, Building, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EnterprisePage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', company: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const features = [
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'SSO/SAML integration, role-based access, and compliance-ready infrastructure.',
      badge: 'Coming Soon'
    },
    {
      icon: TrendingUp,
      title: 'Unlimited Scale',
      description: 'No limits on URLs, clicks, or team members. Built for high-volume operations.',
      badge: null
    },
    {
      icon: Zap,
      title: 'Claude Opus 4.5 AI',
      description: 'Most advanced AI model for brand voice learning and context-aware URL generation.',
      badge: null
    },
    {
      icon: User,
      title: 'Dedicated Support',
      description: '1-hour SLA, dedicated account manager, and quarterly strategy calls.',
      badge: null
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Custom reports, data exports, webhook integrations, and real-time dashboards.',
      badge: null
    },
    {
      icon: Code,
      title: 'Custom Integrations',
      description: 'API access, webhooks, custom data retention policies, and white-label options.',
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 p-4 bg-[#0F0F0F]/95 backdrop-blur-md border-b-3 border-[#1A1A1A] flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-[#FF6B35] border-3 border-[#1A1A1A] rounded-lg flex items-center justify-center shadow-[2px_2px_0_#1A1A1A] transition-transform group-hover:rotate-[-5deg]">
            <LightningBolt size="sm" />
          </div>
          <div>
            <h1 className="text-xl font-black">
              <span className="text-white group-hover:text-[#FF6B35] transition-colors">Dash</span>
              <span className="text-[#FF6B35] group-hover:text-white transition-colors">dig</span>
            </h1>
            <p className="text-[8px] font-bold tracking-widest text-[#FF6B35] uppercase leading-none">
              HUMANIZE • SHORTENIZE
            </p>
          </div>
        </Link>
        <div className="flex space-x-4 items-center">
          <Link 
            href="/"
            className="px-4 py-2 text-white font-bold hover:text-[#FF6B35] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#0F0F0F]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-8">
            {/* Large Lightning Icon */}
            <div className="flex justify-center mb-8">
              <div className="p-12 bg-[#1A1A1A] border-3 border-[#FF6B35] rounded-2xl shadow-[8px_8px_0_#FF6B35] group-hover:shadow-[12px_12px_0_#FF6B35] transition-all duration-300">
                <div style={{ width: '80px', height: '96px' }}>
                  <svg
                    viewBox="-1 0 22 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <path
                      d="M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z"
                      fill="#FFCC33"
                      stroke="#1A1A1A"
                      strokeWidth={1.5}
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black uppercase leading-tight group cursor-pointer">
              <span className="text-white group-hover:text-[#FF6B35] transition-colors">Enterprise-Grade</span>
              <br />
              <span className="text-[#FF6B35] group-hover:text-white transition-colors">URL Intelligence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#A0A0A0] max-w-3xl mx-auto font-medium">
              For teams that demand more
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-[#FF6B35] text-white font-black uppercase text-lg border-3 border-[#1A1A1A] rounded-xl shadow-[6px_6px_0_#1A1A1A] hover:shadow-[8px_8px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <LightningBolt size="sm" />
                  Schedule a Demo
                </span>
              </button>
              <a
                href="mailto:enterprise@dashdig.com"
                className="px-8 py-4 bg-transparent text-white font-bold uppercase text-lg border-3 border-white rounded-xl hover:bg-white hover:text-[#0F0F0F] transition-all duration-200"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#0F0F0F]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-xl hover:border-[#FF6B35] transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#FF6B35] rounded-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  {feature.badge && (
                    <span className="px-3 py-1 bg-[#FFCC33] text-[#1A1A1A] text-xs font-bold uppercase rounded-full border-2 border-[#1A1A1A]">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black uppercase text-white mb-3 group-hover:text-[#FF6B35] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#A0A0A0] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-[#0F0F0F] border-y-3 border-[#1A1A1A]">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center text-sm font-bold uppercase text-[#A0A0A0] mb-8 tracking-wider">
            Trusted by teams at
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {['Company A', 'Company B', 'Company C', 'Company D'].map((company, i) => (
              <div key={i} className="p-6 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-lg text-center">
                <Building className="w-8 h-8 text-[#A0A0A0] mx-auto mb-2" />
                <p className="text-[#A0A0A0] font-medium text-sm">{company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-[#0F0F0F]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-4">
              Let's Talk
            </h2>
            <p className="text-xl text-[#A0A0A0]">
              Get a custom quote and see how Dashdig Enterprise can scale with your business
            </p>
          </div>

          <div className="p-8 bg-[#1A1A1A] border-3 border-[#2A2A2A] rounded-xl shadow-[6px_6px_0_#000]">
            {success ? (
              <div className="text-center space-y-6 py-12">
                <div className="inline-block p-6 bg-[#10B981] rounded-full">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase text-white">Request Sent!</h3>
                <p className="text-[#A0A0A0] text-lg">
                  Our enterprise team will reach out within 1 business day.
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-[#FF6B35] text-white font-bold uppercase border-3 border-[#1A1A1A] rounded-lg shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold uppercase text-white mb-2">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 bg-[#0F0F0F] text-white border-2 border-[#2A2A2A] rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors placeholder:text-[#666]"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-bold uppercase text-white mb-2">
                      Company Name *
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Inc."
                      required
                      className="w-full px-4 py-3 bg-[#0F0F0F] text-white border-2 border-[#2A2A2A] rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors placeholder:text-[#666]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold uppercase text-white mb-2">
                    Work Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@company.com"
                    required
                    className="w-full px-4 py-3 bg-[#0F0F0F] text-white border-2 border-[#2A2A2A] rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors placeholder:text-[#666]"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold uppercase text-white mb-2">
                    Tell us about your needs
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What challenges are you facing with URL management?"
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0F0F0F] text-white border-2 border-[#2A2A2A] rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors placeholder:text-[#666] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#FF6B35] text-white font-black uppercase text-lg border-3 border-[#1A1A1A] rounded-lg shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'SENDING...' : 'SEND REQUEST'}
                </button>

                <p className="text-center text-sm text-[#666]">
                  Or email us directly at{' '}
                  <a href="mailto:enterprise@dashdig.com" className="text-[#FF6B35] hover:text-white font-semibold transition-colors">
                    enterprise@dashdig.com
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0F0F0F] border-t-3 border-[#1A1A1A]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#666] text-sm">
            © 2024 Dashdig. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
