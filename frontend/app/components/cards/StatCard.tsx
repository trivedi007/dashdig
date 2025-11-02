'use client'

import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

export function StatCard({ title, value, icon, change, changeType = 'neutral' }: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        {change && (
          <span className={`text-sm font-semibold ${changeColor[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  )
}

