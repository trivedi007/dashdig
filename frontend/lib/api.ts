// src/lib/api.ts
import axios from 'axios';

// Use full backend URL for API calls
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app/api';
const API_HEALTH_URL = RAW_API_URL.endsWith('/api')
  ? RAW_API_URL.replace(/\/api$/, '')
  : RAW_API_URL;

export interface CreateUrlRequest {
  url: string;
  keywords?: string[];
  customSlug?: string;
  expiryClicks?: number;
}

export interface CreateUrlResponse {
  success: boolean;
  shortUrl: string;
  shortCode: string;
  qrCode: string;
  originalUrl: string;
  expiresAfter: string;
}

export interface UrlItem {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export interface GetUrlsResponse {
  success: boolean;
  count: number;
  urls: UrlItem[];
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: RAW_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API functions
export const createShortUrl = async (data: CreateUrlRequest): Promise<CreateUrlResponse> => {
  try {
    const response = await apiClient.post('/shorten', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to create short URL');
  }
};

export const getAllUrls = async (): Promise<GetUrlsResponse> => {
  try {
    const response = await apiClient.get('/urls');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch URLs');
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_HEALTH_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error('Backend is not responding');
  }
};
