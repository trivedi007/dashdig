'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  compact?: boolean
  linkTo?: string | null
  className?: string
}

export function Logo({ compact = false, linkTo = '/', className }: LogoProps) {
  const lightningGlyph = '⚡'
  const emojiFontStack =
    "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif"
  const textFontStack = "'Sora', Inter, Arial, sans-serif"

  const LogoContent = () => {
    if (compact) {
      return (
        <div
          className={cn(
            'rounded-full bg-[#FF6B35] flex items-center justify-center shadow-md flex-shrink-0',
            className
          )}
          style={{ width: 56, height: 56, minWidth: 56, minHeight: 56 }}
        >
          <span
            className="text-[49px] leading-none"
            style={{
              fontFamily: emojiFontStack,
              color: '#FFE8C8',
              textShadow: '0 0 6px rgba(255, 180, 71, 0.6)',
              lineHeight: 1,
              display: 'block'
            }}
          >
            {lightningGlyph}
          </span>
        </div>
      )
    }

    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        <div
          className="w-14 h-14 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 shadow-md"
          style={{ minWidth: 56, minHeight: 56 }}
        >
          <span
            className="text-[49px] leading-none block"
            style={{
              fontFamily: emojiFontStack,
              color: '#FFE8C8',
              textShadow: '0 0 6px rgba(255, 180, 71, 0.6)',
              transform: 'translateY(-2px)',
              lineHeight: 1,
              display: 'block'
            }}
          >
            {lightningGlyph}
          </span>
        </div>

        <div className="flex flex-col">
          <div
            className="text-[32px] font-bold leading-none"
            style={{
              fontFamily: textFontStack,
              letterSpacing: '-1.4px'
            }}
          >
            <span style={{ color: '#0B1727' }}>Dash</span>
            <span style={{ color: '#F9541C' }}>dig</span>
          </div>
          <div
            className="text-[11px] font-semibold mt-1 uppercase"
            style={{
              fontFamily: textFontStack,
              letterSpacing: '3px',
              color: '#1F2933'
            }}
          >
            HUMANIZE · SHORTENIZE · URLS
          </div>
        </div>
      </div>
    )
  }

  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-flex">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
