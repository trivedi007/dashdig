// Dashdig Chrome Extension - Popup Script
// Creates smart short links from current page URL

const API_BASE = 'https://dashdig-backend-production-8e12.up.railway.app';
const API_ENDPOINT = `${API_BASE}/api/urls`;

// DOM Elements
let currentUrlElement;
let createBtn;
let resultSection;
let shortUrlInput;
let copyBtn;
let copySuccess;
let errorSection;
let errorMessage;
let btnText;
let btnLoader;

// Current page URL
let currentPageUrl = '';

/**
 * Initialize extension when popup opens
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Dashdig Extension Loaded');
  
  // Get DOM elements
  currentUrlElement = document.getElementById('currentUrl');
  createBtn = document.getElementById('createBtn');
  resultSection = document.getElementById('resultSection');
  shortUrlInput = document.getElementById('shortUrl');
  copyBtn = document.getElementById('copyBtn');
  copySuccess = document.getElementById('copySuccess');
  errorSection = document.getElementById('errorSection');
  errorMessage = document.getElementById('errorMessage');
  btnText = document.querySelector('.btn-text');
  btnLoader = document.querySelector('.btn-loader');
  
  // Get current tab URL
  await getCurrentTabUrl();
  
  // Event listeners
  createBtn.addEventListener('click', handleCreateShortLink);
  copyBtn.addEventListener('click', handleCopyToClipboard);
});

/**
 * Get current tab URL using Chrome API
 */
async function getCurrentTabUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url) {
      currentPageUrl = tab.url;
      
      // Display URL (truncate if too long)
      const displayUrl = truncateUrl(currentPageUrl, 100);
      currentUrlElement.textContent = displayUrl;
      
      console.log('📍 Current URL:', currentPageUrl);
    } else {
      currentUrlElement.textContent = 'Unable to get current page URL';
      createBtn.disabled = true;
    }
  } catch (error) {
    console.error('❌ Error getting current tab:', error);
    currentUrlElement.textContent = 'Error: ' + error.message;
    createBtn.disabled = true;
  }
}

/**
 * Create short link by calling Dashdig API
 */
async function handleCreateShortLink() {
  console.log('🔗 Creating short link for:', currentPageUrl);
  
  // Validate URL
  if (!currentPageUrl || currentPageUrl === 'chrome://') {
    showError('Cannot shorten Chrome internal pages');
    return;
  }
  
  // Show loading state
  setLoadingState(true);
  hideError();
  hideResult();
  
  try {
    // Call Dashdig API
    console.log('📤 Sending request to:', API_ENDPOINT);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: currentPageUrl,
        customSlug: null, // Let backend generate smart slug
        keywords: []
      })
    });
    
    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response:', data);
    
    if (data.success && data.data) {
      // Extract short URL
      const shortUrl = data.data.shortUrl || `https://dashdig.com/${data.data.slug}`;
      
      console.log('🎉 Short URL created:', shortUrl);
      
      // Display result
      showResult(shortUrl);
      
      // Store in chrome.storage for history (optional)
      saveToHistory(currentPageUrl, shortUrl);
      
    } else {
      throw new Error('Invalid API response format');
    }
    
  } catch (error) {
    console.error('❌ Error creating short link:', error);
    showError(error.message || 'Failed to create short link. Please try again.');
  } finally {
    setLoadingState(false);
  }
}

/**
 * Copy short URL to clipboard
 */
async function handleCopyToClipboard() {
  const url = shortUrlInput.value;
  
  try {
    // Use Clipboard API (requires clipboardWrite permission)
    await navigator.clipboard.writeText(url);
    
    console.log('📋 Copied to clipboard:', url);
    
    // Show success message
    copySuccess.style.display = 'block';
    
    // Hide after 2 seconds
    setTimeout(() => {
      copySuccess.style.display = 'none';
    }, 2000);
    
    // Animate copy button
    copyBtn.textContent = '✓';
    setTimeout(() => {
      copyBtn.textContent = '📋';
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error copying to clipboard:', error);
    
    // Fallback: select and copy
    shortUrlInput.select();
    document.execCommand('copy');
    
    copySuccess.textContent = '✓ Copied!';
    copySuccess.style.display = 'block';
    setTimeout(() => {
      copySuccess.style.display = 'none';
      copySuccess.textContent = '✓ Copied to clipboard!';
    }, 2000);
  }
}

/**
 * Show result section with short URL
 */
function showResult(shortUrl) {
  shortUrlInput.value = shortUrl;
  resultSection.style.display = 'block';
}

/**
 * Hide result section
 */
function hideResult() {
  resultSection.style.display = 'none';
}

/**
 * Show error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorSection.style.display = 'block';
}

/**
 * Hide error message
 */
function hideError() {
  errorSection.style.display = 'none';
}

/**
 * Set loading state for create button
 */
function setLoadingState(loading) {
  createBtn.disabled = loading;
  
  if (loading) {
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
  } else {
    btnText.style.display = 'inline-block';
    btnLoader.style.display = 'none';
  }
}

/**
 * Truncate URL for display
 */
function truncateUrl(url, maxLength) {
  if (url.length <= maxLength) {
    return url;
  }
  
  const start = url.substring(0, maxLength - 20);
  const end = url.substring(url.length - 17);
  return `${start}...${end}`;
}

/**
 * Save to history using chrome.storage
 */
async function saveToHistory(originalUrl, shortUrl) {
  try {
    const historyItem = {
      originalUrl,
      shortUrl,
      timestamp: Date.now()
    };
    
    // Get existing history
    const result = await chrome.storage.local.get(['history']);
    const history = result.history || [];
    
    // Add new item (keep last 50)
    history.unshift(historyItem);
    if (history.length > 50) {
      history.pop();
    }
    
    // Save back to storage
    await chrome.storage.local.set({ history });
    
    console.log('💾 Saved to history');
  } catch (error) {
    console.error('⚠️ Error saving to history:', error);
    // Non-critical, don't show error to user
  }
}



