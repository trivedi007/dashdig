'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'compact' | 'default' | 'large'
  showTagline?: boolean
  linkTo?: string | null
  className?: string
}

export function Logo({ 
  variant = 'default', 
  showTagline = true,
  linkTo = '/',
  className 
}: LogoProps) {
  const sizes = {
    compact: { 
      box: 'w-8 h-8 p-1.5', 
      bolt: 'w-5 h-5', 
      text: 'text-lg', 
      tagline: 'text-[9px]' 
    },
    default: { 
      box: 'w-10 h-10 p-2', 
      bolt: 'w-6 h-6', 
      text: 'text-xl', 
      tagline: 'text-[10px]' 
    },
    large: { 
      box: 'w-12 h-12 p-2.5', 
      bolt: 'w-7 h-7', 
      text: 'text-2xl', 
      tagline: 'text-xs' 
    }
  }
  
  const size = sizes[variant]
  
  const LogoContent = () => (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Orange box with gold lightning bolt */}
      <div className={cn(
        "bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md hover:shadow-lg transition-shadow",
        size.box
      )}>
        <svg 
          className={size.bolt}
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Dashdig Logo"
        >
          <path 
            d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" 
            fill="#FFD700"
            stroke="#FF6B35"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Logo text and tagline */}
      <div className="flex flex-col">
        <span className={cn("font-bold text-gray-900 leading-none", size.text)}>
          Dashdig
        </span>
        {showTagline && (
          <span className={cn(
            "font-semibold text-gray-600 tracking-wide uppercase leading-tight mt-0.5",
            size.tagline
          )}>
            Humanize • Shortenize • URLs
          </span>
        )}
      </div>
    </div>
  )
  
  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-flex">
        <LogoContent />
      </Link>
    )
  }
  
  return <LogoContent />
}

// Export variants for convenience
export const CompactLogo = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="compact" />
)

export const LargeLogo = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="large" />
)

