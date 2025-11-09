// ============================================
// DASHDIG BROWSER EXTENSION - popup.js
// ============================================

// API Configuration
const API_CONFIG = {
  baseURL: 'https://dashdig-backend-production.up.railway.app',
  endpoints: {
    shorten: '/api/shorten',
    urls: '/api/urls',
    analytics: '/api/analytics',
    qr: '/api/qr',
    health: '/health'
  }
};

// Legacy support - can be removed later
const API_BASE_URL = API_CONFIG.baseURL;
const ENDPOINTS = {
  shorten: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.shorten}`,
  urls: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.urls}`,
  analytics: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.analytics}`,
  qr: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.qr}`
};

// DOM Elements
let urlInput, shortenBtn, useCurrentTab, loading, result, error;
let oldUrl, newUrl, copyBtn, qrBtn, openBtn, shareBtn;
let clicks, created, errorMessage, retryBtn;
let recentList, clearBtn;

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
  
  // States
  loading = document.getElementById('loading');
  result = document.getElementById('result');
  error = document.getElementById('error');
  
  // Result elements
  oldUrl = document.getElementById('oldUrl');
  newUrl = document.getElementById('newUrl');
  copyBtn = document.getElementById('copyBtn');
  qrBtn = document.getElementById('qrBtn');
  openBtn = document.getElementById('openBtn');
  shareBtn = document.getElementById('shareBtn');
  clicks = document.getElementById('clicks');
  created = document.getElementById('created');
  
  // Error elements
  errorMessage = document.getElementById('errorMessage');
  retryBtn = document.getElementById('retryBtn');
  
  // Recent links
  recentList = document.getElementById('recentList');
  clearBtn = document.getElementById('clearBtn');
}

function attachEventListeners() {
  // Main action - Smart "Dig This!" button
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
  
  // Helper action - "Use Current Tab URL" link
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
      
      console.log('📋 Current tab URL loaded:', tab.url);
    } catch (err) {
      console.error('❌ Error getting current tab:', err);
      showError('Could not get current tab URL');
    }
  });
  
  // Result actions
  copyBtn.addEventListener('click', copyToClipboard);
  qrBtn.addEventListener('click', generateQRCode);
  openBtn.addEventListener('click', openShortUrl);
  shareBtn.addEventListener('click', shareUrl);
  
  // Error retry
  retryBtn.addEventListener('click', () => {
    hideError();
    if (currentOriginalUrl) {
      shortenUrl(currentOriginalUrl);
    }
  });
  
  // Recent links
  clearBtn.addEventListener('click', clearRecentLinks);
  
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
        // No Authorization header - works without login for public usage
      },
      body: JSON.stringify({
        originalUrl: url  // Backend AI will generate the humanized slug
      })
    });
    
    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('✅ API response:', data);
    
    if (response.ok && data.success) {
      // Extract short URL from response
      const shortUrl = data.data.shortUrl || `dashdig.com/${data.data.slug}`;
      const slug = data.data.slug;
      
      console.log('🎉 Humanized URL:', shortUrl);
      
      // Store current short URL
      currentShortUrl = shortUrl;
      
      // Show result
      showResult(url, shortUrl);
      
      // Save to recent links
      await saveRecentLink({
        slug: slug,
        originalUrl: url,
        shortUrl: shortUrl,
        createdAt: new Date().toISOString()
      });
      
      // Clear input
      urlInput.value = '';
    } else {
      // Handle API error
      let errorMsg = data.message || 'Failed to humanize URL. Please try again.';
      
      // Make error messages more user-friendly
      if (response.status === 404) {
        errorMsg = 'API endpoint not found. Please check your connection.';
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
// SLUG GENERATION
// ============================================
// NOTE: Slug generation is now handled by the backend AI.
// The backend analyzes the URL content and generates human-readable slugs automatically.
// No client-side slug generation is needed.

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
  
  // Update URLs
  oldUrl.textContent = truncateUrl(originalUrl, 50);
  newUrl.textContent = shortUrl;
  
  // Update stats
  clicks.textContent = '0';
  created.textContent = 'Just now';
  
  result.classList.remove('hidden');
  
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
  result.classList.add('hidden');
  error.classList.add('hidden');
}

// ============================================
// ACTION HANDLERS
// ============================================

// Copy to clipboard
async function copyToClipboard() {
  if (!currentShortUrl) return;
  
  try {
    await navigator.clipboard.writeText(currentShortUrl);
    
    // Visual feedback
    const originalText = copyBtn.querySelector('.action-text').textContent;
    copyBtn.querySelector('.action-text').textContent = 'Copied!';
    copyBtn.style.background = '#D4F4DD';
    
    setTimeout(() => {
      copyBtn.querySelector('.action-text').textContent = originalText;
      copyBtn.style.background = '';
    }, 2000);
    
    console.log('📋 Copied to clipboard:', currentShortUrl);
    
  } catch (err) {
    console.error('❌ Copy failed:', err);
    showError('Failed to copy to clipboard');
  }
}

// Generate QR Code
function generateQRCode() {
  if (!currentShortUrl) return;
  
  // Extract slug from short URL
  const slug = currentShortUrl.split('/').pop();
  const qrUrl = `${ENDPOINTS.qr}/${slug}`;
  
  chrome.tabs.create({ url: qrUrl });
  
  console.log('📱 Opening QR code:', qrUrl);
}

// Open short URL
function openShortUrl() {
  if (!currentShortUrl) return;
  
  chrome.tabs.create({ url: currentShortUrl });
  console.log('🔗 Opening:', currentShortUrl);
}

// Share URL
async function shareUrl() {
  if (!currentShortUrl) return;
  
  // Try native Web Share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Check out this link',
        url: currentShortUrl
      });
      console.log('📤 Shared successfully');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('❌ Share failed:', err);
      }
    }
  } else {
    // Fallback: copy to clipboard
    await copyToClipboard();
  }
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
          <span class="empty-icon">🔗</span>
          <p class="empty-text">No recent links yet</p>
        </div>
      `;
      return;
    }
    
    // Render recent links
    recentList.innerHTML = recentLinks.map(link => `
      <div class="recent-item" data-url="${link.short}">
        <code>${link.short}</code>
      </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.recent-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.dataset.url;
        chrome.tabs.create({ url });
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
function truncateUrl(url, maxLength = 60) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + '...';
}
