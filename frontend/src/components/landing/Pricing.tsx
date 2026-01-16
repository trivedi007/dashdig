'use client';

import { useState } from 'react';
import { Plus, Minus, Loader } from 'lucide-react';
import { PRICING_TIERS } from '@/lib/design-tokens';
import { PricingCard } from '@/components/pricing/PricingCard';
import { useSession } from 'next-auth/react';

interface PricingProps {
  setAuthView?: (view: string) => void;
  setLandingView?: (view: string) => void;
}

export function Pricing({ setAuthView, setLandingView }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { data: session } = useSession();

  const faqs = [
    { 
      q: "Can I change plans later?", 
      a: "Yes, you can upgrade or downgrade your plan at any time directly from your billing settings. Changes take effect immediately." 
    },
    { 
      q: "What happens if I exceed my limits?", 
      a: "We'll notify you when you reach 80% and 100% of your limit. You can easily upgrade to the next tier or wait until the next billing cycle." 
    },
    { 
      q: "How does AI model selection work?", 
      a: "Each tier uses a specific Claude AI model optimized for that price point. Higher tiers use more advanced models that provide better suggestions, brand voice learning, and contextual intelligence." 
    },
    { 
      q: "Do you offer refunds?", 
      a: "Yes, we offer a 30-day money-back guarantee for all annual plans if you are not satisfied." 
    },
    { 
      q: "What payment methods do you accept?", 
      a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. Enterprise plans can use invoice billing (NET 30)." 
    },
  ];

  const handleSelectPlan = async (planId: string) => {
    // Free plan - go to signup
    if (planId === 'free') {
      setAuthView?.('signup');
      return;
    }

    // Enterprise - contact sales
    if (planId === 'enterprise') {
      setLandingView?.('contact');
      return;
    }

    // Paid plans (starter, pro, business) - Stripe checkout
    setLoadingPlan(planId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
          email: session?.user?.email || undefined,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Checkout error:', data.error);
        alert('Failed to start checkout. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[#FDF8F3]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-4xl md:text-5xl font-black uppercase mb-4"
            style={{
              color: '#1A1A1A',
              transition: 'color 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B35'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#1A1A1A'}
          >
            AI-Powered Pricing
          </h1>
          <p className="text-xl text-[#666] max-w-2xl mx-auto">
            Choose the AI model that fits your needs. Start free, upgrade as you grow.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div 
            className="flex items-center p-1 bg-white border-3 border-[#1A1A1A] rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.8)]"
            style={{
              display: 'inline-flex',
              gap: '4px'
            }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`flex items-center justify-center px-6 py-3 text-sm rounded-full transition-all duration-200 ${
                !isAnnual 
                  ? 'bg-[#FF6B35] text-white' 
                  : 'text-[#1A1A1A] hover:bg-[#FDF8F3]'
              }`}
              style={{
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center justify-center px-6 py-3 text-sm rounded-full transition-all duration-200 ${
                isAnnual 
                  ? 'bg-[#FF6B35] text-white' 
                  : 'text-[#1A1A1A] hover:bg-[#FDF8F3]'
              }`}
              style={{
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                position: 'relative'
              }}
            >
              Annual
              {/* Circular -20% sale sticker */}
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '36px',
                height: '36px',
                backgroundColor: '#FF6B35',
                color: 'white',
                borderRadius: '50%',
                border: '2px solid #1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: '800',
                transform: 'rotate(12deg)',
                boxShadow: '2px 2px 0 #1A1A1A'
              }}>
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-24">
          {PRICING_TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              plan={tier as any}
              isAnnual={isAnnual}
              onSelect={handleSelectPlan}
              isLoading={loadingPlan === tier.id}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-3xl font-black uppercase text-[#1A1A1A] mb-8">
            Frequently Asked Questions
          </h3>
          <div className="bg-white p-6 rounded-xl border-3 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A]">
            {faqs.map((faq, index) => (
              <FAQItem key={index} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
            Still have questions?
          </h3>
          <button
            onClick={() => setLandingView?.('contact')}
            className="px-8 py-4 bg-[#1A1A1A] text-white font-bold uppercase rounded-lg border-3 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-[#FF6B35] transition-all duration-200"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}

interface FAQItemProps {
  q: string;
  a: string;
}

function FAQItem({ q, a }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b-2 border-[#1A1A1A] last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-bold text-[#1A1A1A] hover:text-[#FF6B35] transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{q}</span>
        {isOpen ? (
          <Minus className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
        ) : (
          <Plus className="w-5 h-5 text-[#666] flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-[#666] transition-all duration-300 ease-in-out">
          {a}
        </div>
      )}
    </div>
  );
}
