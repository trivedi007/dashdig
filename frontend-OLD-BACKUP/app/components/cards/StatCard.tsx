'use client'

import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  icon: string // Font Awesome class (e.g., "fa-link") or emoji
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  color?: 'orange' | 'blue' | 'green' | 'purple'
  iconType?: 'fontawesome' | 'emoji' // New prop to determine icon type
}

export function StatCard({ title, value, icon, change, changeType = 'neutral', color = 'orange', iconType = 'fontawesome' }: StatCardProps) {
  const changeStyles = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50'
  }

  const colorStyles = {
    orange: {
      bg: 'bg-orange-100',
      text: 'text-[#FF6B35]',
      iconBg: 'bg-[#FF6B35]' // Changed to match spec: #FF6B2C → #FF6B35
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      iconBg: 'bg-[#0066FF]' // Changed to match spec
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      iconBg: 'bg-[#10B981]' // Changed to match spec
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      iconBg: 'bg-[#8B5CF6]' // Changed to match spec
    }
  }

  const colorStyle = colorStyles[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all"
    >
      <div className="mb-4 flex items-start justify-between">
        {/* Icon Container - 40px circle with shadow */}
        <div 
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colorStyle.iconBg}`}
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        >
          {iconType === 'fontawesome' ? (
            <i className={`fas ${icon} text-white`} style={{ fontSize: '20px' }}></i>
          ) : (
            <span className="text-xl">{icon}</span>
          )}
        </div>
        {change && (
          <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${changeStyles[changeType]}`}>
            {changeType === 'positive' && (
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {changeType === 'negative' && (
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
      <p className="mb-2 text-sm font-medium text-slate-600">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </motion.div>
  )
}

