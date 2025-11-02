import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/api' 
    : 'https://dashdig-production.up.railway.app/api')

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

export function useUrls() {
  return useQuery<{ urls: UrlItem[]; totalClicks: number }>({
    queryKey: ['urls'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/urls`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch URLs')
      }
      
      const data = await response.json()
      const totalClicks = data.urls?.reduce((sum: number, url: UrlItem) => sum + url.clicks, 0) || 0
      
      return { urls: data.urls || [], totalClicks }
    }
  })
}

export function useUrlAnalytics(slug: string) {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics', slug],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/analytics/${slug}`, {
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
      const response = await fetch(`${API_BASE}/urls`, {
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
      const response = await fetch(`${API_BASE}/urls/${id}`, {
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

