'use client';

import { LightningBolt } from '@/components/ui/LightningBolt';
import { Check, Loader } from 'lucide-react';

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    priceAnnual?: number | null;
    aiModel: string;
    features: string[];
    cta: string;
    popular?: boolean;
    custom?: boolean;
  };
  isAnnual: boolean;
  onSelect: (planId: string) => void;
  isLoading?: boolean;
}

export function PricingCard({ plan, isAnnual, onSelect, isLoading }: PricingCardProps) {
  const displayPrice = isAnnual && plan.priceAnnual ? plan.priceAnnual : plan.price;
  
  return (
    <div 
      className={`
        relative flex flex-col p-8 bg-white rounded-2xl
        border-3 transition-all duration-200
        hover:translate-x-[-2px] hover:translate-y-[-2px] hover:scale-[1.02]
        ${plan.popular 
          ? 'border-[#FF6B35] shadow-[6px_6px_0_rgba(255,107,53,0.8)] hover:shadow-[8px_8px_0_rgba(255,107,53,0.9)] hover:bg-[#FFF5F0]' 
          : 'border-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.8)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.9)] hover:bg-[#FFFEF5]'
        }
      `}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF6B35] text-white text-xs font-bold uppercase rounded-full border-2 border-[#1A1A1A]" style={{ zIndex: 10 }}>
          Most Popular
        </div>
      )}
      
      {/* Plan Name */}
      <h3 className={`text-2xl font-black uppercase text-[#1A1A1A] mb-4`} style={{ marginTop: plan.popular ? '16px' : '0' }}>
        {plan.name}
      </h3>
      
      {/* Price */}
      <div className="mb-8">
        {plan.custom ? (
          <span className="text-3xl font-black text-[#1A1A1A]">Custom</span>
        ) : (
          <>
            <span className="text-4xl font-black text-[#1A1A1A]">${displayPrice}</span>
            <span className="text-[#666] text-lg">/month</span>
          </>
        )}
        {isAnnual && plan.priceAnnual && !plan.custom && (
          <p className="text-sm text-[#FF6B35] font-medium mt-1">
            Save ${(plan.price - plan.priceAnnual) * 12}/year
          </p>
        )}
      </div>
      
      {/* Features */}
      <ul className="mb-8 flex-grow" style={{ padding: 0 }}>
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 mb-3" style={{ marginBottom: '12px' }}>
            <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
            <span className="text-[#1A1A1A] text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan.id)}
        disabled={isLoading}
        className={`
          w-full py-3 px-6 font-bold uppercase text-sm mt-auto
          border-3 border-[#1A1A1A] rounded-lg
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:translate-x-[-2px] hover:translate-y-[-2px]
          ${plan.popular || plan.id === 'pro'
            ? 'bg-[#FF6B35] text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.9)]'
            : 'bg-white text-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.8)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.9)]'
          }
        `}
        style={{ minHeight: '48px' }}
      >
        <span className="flex items-center justify-center gap-2 whitespace-nowrap">
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <LightningBolt size="sm" />
              {plan.cta}
            </>
          )}
        </span>
      </button>
    </div>
  );
}
