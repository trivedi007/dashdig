'use client';

import { LightningBolt } from '@/components/ui/LightningBolt';
import { Check } from 'lucide-react';

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
}

export function PricingCard({ plan, isAnnual, onSelect }: PricingCardProps) {
  const displayPrice = isAnnual && plan.priceAnnual ? plan.priceAnnual : plan.price;
  
  return (
    <div 
      className={`
        relative flex flex-col p-6 bg-white rounded-xl
        border-3 transition-all duration-200
        hover:translate-x-[-2px] hover:translate-y-[-2px] hover:scale-[1.02]
        ${plan.popular 
          ? 'border-[#FF6B35] shadow-[6px_6px_0_#FF6B35] hover:shadow-[8px_8px_0_#FF6B35] hover:bg-[#FFF5F0]' 
          : 'border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:bg-[#FFFEF5]'
        }
      `}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF6B35] text-white text-xs font-bold uppercase rounded-full border-2 border-[#1A1A1A]">
          Most Popular
        </div>
      )}
      
      {/* Plan Name */}
      <h3 className="text-2xl font-black uppercase text-[#1A1A1A] mb-4">
        {plan.name}
      </h3>
      
      {/* AI Model Badge - HIDDEN per requirements */}
      {/* 
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-white text-xs font-bold rounded-full w-fit mb-4">
        <LightningBolt size="xs" />
        {plan.aiModel}
      </div>
      */}
      
      {/* Price */}
      <div className="mb-6">
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
      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
            <span className="text-[#1A1A1A] text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan.id)}
        className={`
          w-full py-3 px-6 font-bold uppercase text-sm
          border-3 border-[#1A1A1A] rounded-lg
          transition-all duration-200
          hover:translate-x-[-2px] hover:translate-y-[-2px]
          ${plan.popular || plan.id === 'pro'
            ? 'bg-[#FF6B35] text-white shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A]'
            : 'bg-white text-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A]'
          }
        `}
      >
        <span className="flex items-center justify-center gap-2">
          <LightningBolt size="sm" />
          {plan.cta}
        </span>
      </button>
    </div>
  );
}
