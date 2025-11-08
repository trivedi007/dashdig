// Dashdig Extension - popup.js
const API_URL = 'https://dashdig-production.up.railway.app';

// DOM elements
let currentUrlElement;
let createButton;
let resultContainer;
let shortUrlElement;
let copyButton;
let errorElement;

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Dashdig extension loaded');
  
  // Get DOM elements
  currentUrlElement = document.getElementById('current-url');
  createButton = document.getElementById('create-btn');
  resultContainer = document.getElementById('result-container');
  shortUrlElement = document.getElementById('short-url');
  copyButton = document.getElementById('copy-btn');
  errorElement = document.getElementById('error');
  
  // Get current tab URL
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tab.url;
    
    console.log('📍 Current URL:', currentUrl);
    currentUrlElement.textContent = truncateUrl(currentUrl);
    currentUrlElement.title = currentUrl; // Show full URL on hover
    
    // Store URL for later use
    currentUrlElement.dataset.fullUrl = currentUrl;
    
  } catch (error) {
    console.error('❌ Error getting current tab:', error);
    showError('Could not get current page URL');
  }
  
  // Add event listeners
  createButton.addEventListener('click', createSmartLink);
  copyButton.addEventListener('click', copyToClipboard);
});

// Create smart link
async function createSmartLink() {
  const currentUrl = currentUrlElement.dataset.fullUrl;
  
  if (!currentUrl) {
    showError('No URL found');
    return;
  }
  
  // Show loading state
  createButton.disabled = true;
  createButton.textContent = '⚡ Generating...';
  errorElement.style.display = 'none';
  resultContainer.style.display = 'none';
  
  try {
    // Generate smart slug with timestamp suffix to avoid duplicates
    const baseSlug = generateSmartSlug(currentUrl);
    const uniqueSuffix = Date.now().toString(36).substr(-4); // 4 character timestamp
    const smartSlug = baseSlug + '.' + uniqueSuffix;
    
    console.log('🎯 Base slug:', baseSlug);
    console.log('🔑 Unique slug:', smartSlug);
    
    // Send to backend
    console.log('📤 Sending to API:', `${API_URL}/api/urls`);
    const response = await fetch(`${API_URL}/api/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: currentUrl,
        customSlug: smartSlug
      })
    });
    
    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      // Try to get error details
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error('❌ Backend error details:', errorData);
      } catch (e) {
        const errorText = await response.text();
        console.error('❌ Backend error:', errorText);
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('✅ API response:', data);
    
    // Display result
    const shortUrl = data.data?.shortUrl || `https://dashdig.com/${data.data?.slug}`;
    shortUrlElement.textContent = shortUrl;
    shortUrlElement.href = shortUrl;
    
    resultContainer.style.display = 'block';
    
    console.log('✅ Link created successfully:', shortUrl);
    
  } catch (error) {
    console.error('❌ Error creating link:', error);
    showError(error.message || 'Failed to create link. Please try again.');
  } finally {
    // Reset button
    createButton.textContent = '⚡ Create Smart Link';
    createButton.disabled = false;
  }
}

// Copy to clipboard
async function copyToClipboard() {
  const url = shortUrlElement.textContent;
  
  try {
    await navigator.clipboard.writeText(url);
    
    // Show feedback
    const originalText = copyButton.textContent;
    copyButton.textContent = '✓ Copied!';
    copyButton.style.background = '#4CAF50';
    
    setTimeout(() => {
      copyButton.textContent = originalText;
      copyButton.style.background = '';
    }, 2000);
    
    console.log('📋 Copied to clipboard:', url);
    
  } catch (error) {
    console.error('❌ Copy failed:', error);
    showError('Failed to copy to clipboard');
  }
}

// Smart URL slug generator
function generateSmartSlug(url) {
  try {
    console.log('🔍 Generating smart slug for:', url);
    
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase().replace('www.', '');
    const pathname = urlObj.pathname.toLowerCase();
    
    const parts = [];
    
    // 1. Extract domain/store name
    const domain = hostname.split('.')[0];
    parts.push(capitalize(domain));
    
    // 2. Extract product info from URL path
    const pathSegments = pathname.split('/').filter(p => p && p.length > 2);
    
    for (const segment of pathSegments) {
      // Skip common patterns
      if (segment === 'p' || segment.startsWith('a-') || segment.match(/^\d+$/)) {
        continue;
      }
      
      // Extract meaningful words from dashed segments
      if (segment.includes('-')) {
        const words = segment.split('-')
          .filter(w => w.length > 2)
          .filter(w => !['the', 'and', 'with', 'for', 'from', 'about'].includes(w))
          .map(w => capitalize(w))
          .slice(0, 4); // Max 4 words per segment
        
        parts.push(...words);
      }
    }
    
    // 3. Create slug (max 5 components for readability)
    const slug = parts.slice(0, 5).join('.');
    
    console.log('✅ Generated base slug:', slug);
    return slug;
    
  } catch (error) {
    console.error('❌ Slug generation failed:', error);
    // Fallback: domain + random
    try {
      const domain = new URL(url).hostname.split('.')[0];
      return capitalize(domain) + '.Link';
    } catch {
      return 'Link';
    }
  }
}

// Helper: Capitalize first letter
function capitalize(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Truncate URL for display
function truncateUrl(url) {
  if (url.length <= 60) return url;
  return url.substring(0, 57) + '...';
}

// Show error message
function showError(message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
}








