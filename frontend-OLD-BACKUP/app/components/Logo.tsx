'use client'

import React from 'react'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon-only'
  className?: string
  linkTo?: string | null
  // Legacy props for backward compatibility
  compact?: boolean
  showTagline?: boolean
}

const sizes = {
  sm: { box: 32, icon: 16, text: 'text-lg' },
  md: { box: 40, icon: 20, text: 'text-xl' },
  lg: { box: 48, icon: 24, text: 'text-2xl' },
  xl: { box: 64, icon: 32, text: 'text-3xl' }
}

// Professional SVG lightning bolt path
const LightningSVG = ({ width, height }: { width: number; height: number }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
  >
    <path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      fill="#FFD700"
      stroke="#FFA500"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </svg>
)

export function Logo({
  size = 'md',
  variant = 'full',
  className = '',
  linkTo = '/',
  compact = false,
  showTagline = false
}: LogoProps) {
  // Handle legacy props
  const effectiveVariant = compact ? 'icon-only' : variant
  const effectiveSize = compact ? 'sm' : size

  const { box, icon, text } = sizes[effectiveSize]

  const LogoContent = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Orange gradient box with SVG lightning */}
      <div
        className="flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600"
        style={{
          width: box,
          height: box,
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        <LightningSVG width={icon} height={icon} />
      </div>

      {effectiveVariant === 'full' && (
        <div className="flex flex-col">
          <span
            className={`${text} font-extrabold text-gray-900 dark:text-white`}
            style={{
              letterSpacing: '-0.025em',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            Dashdig
          </span>
          <span className="text-xs text-gray-500 tracking-wider uppercase">
            Humanize · Shortenize · URLs
          </span>
        </div>
      )}
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

export default Logo
