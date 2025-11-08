'use client'

import { Breadcrumbs } from './Breadcrumbs'
import { ReactNode } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  icon?: string
}

export function PageHeader({ title, description, breadcrumbs, actions, icon }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}
      
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] font-bold text-[#1F2937] mb-2 flex items-center gap-3">
            {icon && (
              <span className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <i className={`fas ${icon} text-white text-lg`}></i>
              </span>
            )}
            <span>{title}</span>
          </h1>
          {description && (
            <p className="text-slate-600 text-base">{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}





