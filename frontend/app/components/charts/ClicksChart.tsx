'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface ClicksChartProps {
  data: Array<{ date: string; clicks: number }>
}

export function ClicksChart({ data }: ClicksChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd')
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#FF6B35"
            strokeWidth={3}
            dot={{ fill: '#FF6B35', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

