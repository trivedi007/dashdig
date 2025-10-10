// src/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const createShortUrl = async (data: CreateUrlRequest): Promise<CreateUrlResponse> => {
  try {
    const response = await apiClient.post('/urls', data);
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
    const response = await axios.get('http://localhost:3001/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend is not responding');
  }
};
