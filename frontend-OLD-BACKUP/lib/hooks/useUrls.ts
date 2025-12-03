import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Resolve a consistent API base and ensure the `/api` segment is present once
const resolveApiBase = () => {
  const rawBase = (() => {
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
    }

    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL
    }

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001'
    }

    return 'https://dashdig-production.up.railway.app'
  })()

  const normalizedBase = rawBase.replace(/\/$/, '')
  return normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`
}

const buildApiUrl = (path: string) => {
  const base = resolveApiBase()
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export interface UrlItem {
  _id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  clicks: number
  createdAt: string
  userId?: string
  analytics?: {
    countries: Record<string, number>
    devices: Record<string, number>
    browsers: Record<string, number>
    referrers: Record<string, number>
    clicksByDate: Array<{ date: string; clicks: number }>
  }
}

export interface AnalyticsData {
  totalClicks: number
  uniqueVisitors: number
  clicksByDate: Array<{ date: string; clicks: number }>
  countries: Record<string, number>
  devices: Record<string, number>
  browsers: Record<string, number>
  referrers: Record<string, number>
}

type RawUrl = Partial<UrlItem> & {
  clicks?: number | {
    count?: number
    total?: number
    limit?: number
  }
}

export function useUrls() {
  return useQuery<{ urls: UrlItem[]; totalClicks: number }>({
    queryKey: ['urls'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await fetch(buildApiUrl('urls'), {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch URLs')
      }
      
      const responseData = await response.json()
      
      // Handle both response formats:
      // 1. { success: true, data: [...] }
      // 2. { urls: [...], totalClicks: ... }
      const rawUrls = responseData.data || responseData.urls || []
      const urlsArray = Array.isArray(rawUrls) ? rawUrls : []

      const normalizedUrls: UrlItem[] = urlsArray.map((url: RawUrl) => {
        const clicksValue = (() => {
          if (typeof url.clicks === 'number') return url.clicks
          if (url.clicks && typeof url.clicks === 'object') {
            if (typeof url.clicks.count === 'number') return url.clicks.count
            if (typeof url.clicks.total === 'number') return url.clicks.total
            if (typeof url.clicks.limit === 'number') return url.clicks.limit
          }
          return 0
        })()

        return {
          ...url,
          _id: url._id ?? '',
          shortCode: url.shortCode ?? '',
          shortUrl: url.shortUrl ?? '',
          originalUrl: url.originalUrl ?? '',
          createdAt: url.createdAt ?? new Date().toISOString(),
          clicks: clicksValue,
        }
      })

      const totalClicks = normalizedUrls.reduce((sum, url) => sum + (url.clicks || 0), 0)
      
      return { urls: normalizedUrls, totalClicks }
    }
  })
}

export function useUrlAnalytics(slug: string) {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics', slug],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await fetch(buildApiUrl(`analytics/${slug}`), {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      return response.json()
    },
    enabled: !!slug
  })
}

export function useCreateUrl() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { url: string; customSlug?: string; keywords?: string[] }) => {
      const token = localStorage.getItem('token')
      const response = await fetch(buildApiUrl('urls'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create URL')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] })
    }
  })
}

export function useDeleteUrl() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token')
      const response = await fetch(buildApiUrl(`urls/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete URL')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] })
    }
  })
}
