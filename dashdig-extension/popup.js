// ============================================
// DASHDIG BROWSER EXTENSION - popup.js
// Modern UI Integration
// ============================================

const DEFAULT_API_BASE = 'https://dashdig-production.up.railway.app/api';
const FALLBACK_DOMAIN = 'https://dashdig.com';

// API Configuration
const API_CONFIG = {
  baseURL: DEFAULT_API_BASE,
  endpoints: {
    shorten: '/urls',
    urls: '/urls',
    analytics: '/analytics',
    qr: '/qr',
    health: '/health'
  }
};

// Legacy support
const API_BASE_URL = API_CONFIG.baseURL;
const ENDPOINTS = {
  shorten: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.shorten}`,
  urls: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.urls}`,
  analytics: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.analytics}`,
  qr: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.qr}`
};

// DOM Elements
let urlInput, shortenBtn, useCurrentTab, clearBtn;
let loading, result, error;
let newUrl, copyBtn;
let clicks, created, errorMessage, retryBtn;
let recentList, clearAllBtn;

// Current short URL data
let currentShortUrl = null;
let currentOriginalUrl = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Dashdig extension loaded');
  
  // Get DOM elements
  initializeElements();
  
  // Load recent links from storage
  await loadRecentLinks();
  
  // Add event listeners
  attachEventListeners();
});

function initializeElements() {
  // Input section
  urlInput = document.getElementById('urlInput');
  shortenBtn = document.getElementById('shortenBtn');
  useCurrentTab = document.getElementById('useCurrentTab');
  clearBtn = document.getElementById('clearBtn');
  
  // States
  loading = document.getElementById('loading');
  result = document.getElementById('result');
  error = document.getElementById('error');
  
  // Result elements
  newUrl = document.getElementById('newUrl');
  copyBtn = document.getElementById('copyBtn');
  clicks = document.getElementById('clicks');
  created = document.getElementById('created');
  
  // Error elements
  errorMessage = document.getElementById('errorMessage');
  retryBtn = document.getElementById('retryBtn');
  
  // Recent links
  recentList = document.getElementById('recentList');
  clearAllBtn = document.getElementById('clearAllBtn');
}

function attachEventListeners() {
  // Input handling - Enable/disable button based on input
  urlInput.addEventListener('input', () => {
    const hasValue = urlInput.value.trim().length > 0;
    shortenBtn.disabled = !hasValue;
  });
  
  // Clear button
  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    urlInput.focus();
    shortenBtn.disabled = true;
  });
  
  // Main action - "Dig This!" button
  shortenBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    
    if (!url) {
      // Auto-use current tab if input is empty
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url) {
          await shortenUrl(tab.url);
        } else {
          showError('Please enter a URL or open a valid web page');
        }
      } catch (err) {
        console.error('❌ Error getting current tab:', err);
        showError('Please enter a URL to shorten');
      }
    } else {
      // Use the URL from input
      await shortenUrl(url);
    }
  });
  
  // Use current tab URL - fill input with current tab URL
  useCurrentTab.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url) {
        showError('Could not get current tab URL');
        return;
      }
      
      // Validate URL
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith('edge://')) {
        showError('Cannot shorten browser internal pages');
        return;
      }
      
      // Fill input with current tab URL
      urlInput.value = tab.url;
      urlInput.focus();
      
      // Enable shorten button
      shortenBtn.disabled = false;
      
      // Trigger input event to show clear button
      urlInput.dispatchEvent(new Event('input'));
      
      console.log('📋 Current tab URL loaded:', tab.url);
    } catch (err) {
      console.error('❌ Error getting current tab:', err);
      showError('Could not get current tab URL');
    }
  });
  
  // Copy button with visual feedback
  copyBtn.addEventListener('click', async () => {
    if (!currentShortUrl) return;
    
    try {
      await navigator.clipboard.writeText(currentShortUrl);
      
      // Visual feedback - show checkmark
      copyBtn.classList.add('copied');
      
      // Reset after 2 seconds
      setTimeout(() => {
        copyBtn.classList.remove('copied');
      }, 2000);
      
      console.log('📋 Copied to clipboard:', currentShortUrl);
      
    } catch (err) {
      console.error('❌ Copy failed:', err);
      showError('Failed to copy to clipboard');
    }
  });
  
  // Error retry
  retryBtn.addEventListener('click', () => {
    hideError();
    if (currentOriginalUrl) {
      shortenUrl(currentOriginalUrl);
    }
  });
  
  // Clear all recent links
  clearAllBtn.addEventListener('click', clearRecentLinks);
  
  // Enter key in input
  urlInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const url = urlInput.value.trim();
      
      if (!url) {
        // Auto-use current tab if input is empty
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab && tab.url) {
            await shortenUrl(tab.url);
          }
        } catch (err) {
          showError('Please enter a URL to shorten');
        }
      } else {
        await shortenUrl(url);
      }
    }
  });
}

// ============================================
// CORE FUNCTIONALITY
// ============================================

// Main shorten function
async function shortenUrl(url) {
  // Validate URL
  if (!url || !url.trim()) {
    showError('Please enter a valid URL');
    return;
  }
  
  // Validate URL format
  try {
    new URL(url);
  } catch (e) {
    showError('Please enter a valid URL (must start with http:// or https://)');
    return;
  }
  
  currentOriginalUrl = url;
  
  // Show loading state
  showLoading();
  
  try {
    console.log('🎯 Humanizing URL:', url);
    console.log('🔗 API endpoint:', ENDPOINTS.shorten);
    
    // Call API - Let backend AI generate the slug
    const response = await fetch(ENDPOINTS.shorten, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url
      })
    });
    
    console.log('📡 Response status:', response.status);
    
    const rawText = await response.text();
    let data = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.warn('⚠️ Non-JSON response from API:', rawText);
      data = { success: false, message: rawText };
    }
    
    console.log('✅ API response:', data);
    
    const payload = data.data || data || {};
    const slug = payload.slug || payload.shortCode;
    const resolvedShortUrl = payload.shortUrl || (slug ? `${FALLBACK_DOMAIN}/${slug}` : null);
    const success = response.ok && (!!slug || !!resolvedShortUrl);
    
    if (success) {
      const normalizedShortUrl = resolvedShortUrl?.startsWith('http')
        ? resolvedShortUrl
        : resolvedShortUrl
          ? `https://${resolvedShortUrl.replace(/^https?:\/\//, '')}`
          : `${FALLBACK_DOMAIN}/${slug || 'link'}`;

      console.log('🎉 Humanized URL:', normalizedShortUrl);
      
      currentShortUrl = normalizedShortUrl;
      
      showResult(url, normalizedShortUrl);
      
      await saveRecentLink({
        slug: slug || normalizedShortUrl.split('/').pop(),
        originalUrl: url,
        shortUrl: normalizedShortUrl,
        createdAt: new Date().toISOString()
      });
      
      urlInput.value = '';
      shortenBtn.disabled = true;
    } else {
      // Handle API error
      let errorMsg = data.message || payload.error || 'Failed to humanize URL. Please try again.';
      
      if (response.status === 404 || /application not found/i.test(errorMsg)) {
        errorMsg = 'Dashdig backend is offline. Start the API or update NEXT_PUBLIC_API_URL in the extension settings.';
      } else if (response.status === 500) {
        errorMsg = 'Server error. Please try again in a moment.';
      } else if (response.status === 429) {
        errorMsg = 'Too many requests. Please wait a moment and try again.';
      }
      
      showError(errorMsg);
    }
  } catch (err) {
    console.error('❌ Error humanizing URL:', err);
    
    // User-friendly error messages
    let errorMsg = 'Failed to connect to Dashdig. Please check your internet connection.';
    
    // Check for specific error types
    if (err.message) {
      errorMsg = err.message;
    }
    
    showError(errorMsg);
  }
}

// ============================================
// UI STATE MANAGEMENT
// ============================================
function showLoading() {
  hideAllStates();
  loading.classList.remove('hidden');
  shortenBtn.disabled = true;
  useCurrentTab.disabled = true;
}

function showResult(originalUrl, shortUrl) {
  hideAllStates();
  
  // Update URL
  newUrl.textContent = shortUrl.replace(/^https?:\/\//, '');
  
  // Update stats
  clicks.textContent = '0';
  created.textContent = 'Just now';
  
  result.style.display = 'block';
  
  // Re-enable buttons
  shortenBtn.disabled = false;
  useCurrentTab.disabled = false;
}

function showError(message) {
  hideAllStates();
  errorMessage.textContent = message;
  error.classList.remove('hidden');
  
  // Re-enable buttons
  shortenBtn.disabled = false;
  useCurrentTab.disabled = false;
}

function hideError() {
  error.classList.add('hidden');
}

function hideAllStates() {
  loading.classList.add('hidden');
  result.style.display = 'none';
  error.classList.add('hidden');
}

// ============================================
// RECENT LINKS STORAGE
// ============================================
async function saveRecentLink(linkData) {
  try {
    const storage = await chrome.storage.local.get(['recentLinks']);
    let recentLinks = storage.recentLinks || [];
    
    // Add new link at the beginning
    recentLinks.unshift(linkData);
    
    // Keep only last 10 links
    recentLinks = recentLinks.slice(0, 10);
    
    await chrome.storage.local.set({ recentLinks });
    
    // Update UI
    await loadRecentLinks();
    
  } catch (err) {
    console.error('❌ Error saving recent link:', err);
  }
}

async function loadRecentLinks() {
  try {
    const storage = await chrome.storage.local.get(['recentLinks']);
    const recentLinks = storage.recentLinks || [];
    
    if (recentLinks.length === 0) {
      recentList.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="empty-icon">
            <circle cx="24" cy="24" r="23" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>
            <path d="M20 18L16 22L20 26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 30L32 26L28 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="empty-text">No recent links yet</p>
          <p class="empty-subtext">Shortened URLs will appear here</p>
        </div>
      `;
      return;
    }
    
    // Render recent links with modern design
    recentList.innerHTML = recentLinks.map(link => `
      <button class="recent-item" data-url="${link.shortUrl}">
        <div class="recent-item-icon">🔗</div>
        <div class="recent-meta">
          <p class="recent-short">${(link.shortUrl || '').replace(/^https?:\/\//, '')}</p>
          <p class="recent-original" title="${escapeHtml(link.originalUrl || '')}">${truncateUrl(link.originalUrl || '', 50)}</p>
        </div>
        <span class="recent-time">${formatRelativeTime(link.createdAt)}</span>
      </button>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.recent-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url) {
          chrome.tabs.create({ url });
        }
      });
    });
    
  } catch (err) {
    console.error('❌ Error loading recent links:', err);
  }
}

async function clearRecentLinks() {
  try {
    await chrome.storage.local.set({ recentLinks: [] });
    await loadRecentLinks();
    console.log('🗑️ Recent links cleared');
  } catch (err) {
    console.error('❌ Error clearing recent links:', err);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function truncateUrl(url, maxLength = 60) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + '...';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
