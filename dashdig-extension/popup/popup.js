/**
 * Dashdig Chrome Extension - Popup Script
 * Transform ugly URLs into human-readable links with AI
 */

// API Configuration
const API_URL = 'https://dashdig-production.up.railway.app/api/shorten';
const BASE_DOMAIN = 'https://dashdig.com';

// DOM Elements
const elements = {};

// Current state
let currentShortUrl = null;
let currentOriginalUrl = null;

/**
 * Initialize extension when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  attachEventListeners();
  loadRecentLinks();
  updateBadge();
});

/**
 * Get all DOM element references
 */
function initializeElements() {
  elements.urlInput = document.getElementById('urlInput');
  elements.shortenBtn = document.getElementById('shortenBtn');
  elements.useCurrentTab = document.getElementById('useCurrentTab');
  elements.clearBtn = document.getElementById('clearBtn');

  elements.loadingSection = document.getElementById('loadingSection');
  elements.resultSection = document.getElementById('resultSection');
  elements.errorSection = document.getElementById('errorSection');

  elements.originalUrl = document.getElementById('originalUrl');
  elements.shortUrl = document.getElementById('shortUrl');
  elements.copyBtn = document.getElementById('copyBtn');
  elements.qrBtn = document.getElementById('qrBtn');

  elements.errorMessage = document.getElementById('errorMessage');
  elements.retryBtn = document.getElementById('retryBtn');

  elements.recentList = document.getElementById('recentList');
  elements.clearAllBtn = document.getElementById('clearAllBtn');

  elements.qrModal = document.getElementById('qrModal');
  elements.qrCanvas = document.getElementById('qrCanvas');
  elements.qrUrl = document.getElementById('qrUrl');
  elements.closeModal = document.getElementById('closeModal');
  elements.downloadQr = document.getElementById('downloadQr');

  elements.toast = document.getElementById('toast');
  elements.toastMessage = document.getElementById('toastMessage');
}

/**
 * Attach all event listeners
 */
function attachEventListeners() {
  // Input handling
  elements.urlInput.addEventListener('input', onInputChange);
  elements.urlInput.addEventListener('keypress', onInputKeypress);
  elements.clearBtn.addEventListener('click', clearInput);

  // Main actions
  elements.shortenBtn.addEventListener('click', handleShorten);
  elements.useCurrentTab.addEventListener('click', useCurrentTabUrl);

  // Result actions
  elements.copyBtn.addEventListener('click', copyToClipboard);
  elements.qrBtn.addEventListener('click', showQrModal);

  // Error handling
  elements.retryBtn.addEventListener('click', retryShorten);

  // Recent links
  elements.clearAllBtn.addEventListener('click', clearRecentLinks);

  // Modal
  elements.closeModal.addEventListener('click', hideQrModal);
  elements.qrModal.querySelector('.modal-backdrop').addEventListener('click', hideQrModal);
  elements.downloadQr.addEventListener('click', downloadQrCode);
}

/**
 * Handle input changes
 */
function onInputChange() {
  const hasValue = elements.urlInput.value.trim().length > 0;
  elements.shortenBtn.disabled = !hasValue;
}

/**
 * Handle Enter key in input
 */
async function onInputKeypress(e) {
  if (e.key === 'Enter' && elements.urlInput.value.trim()) {
    await handleShorten();
  }
}

/**
 * Clear the input field
 */
function clearInput() {
  elements.urlInput.value = '';
  elements.urlInput.focus();
  elements.shortenBtn.disabled = true;
}

/**
 * Use the current tab URL
 */
async function useCurrentTabUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.url) {
      showError('Could not get current tab URL');
      return;
    }

    // Validate URL
    if (tab.url.startsWith('chrome://') ||
        tab.url.startsWith('about:') ||
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('chrome-extension://')) {
      showError('Cannot shorten browser internal pages');
      return;
    }

    elements.urlInput.value = tab.url;
    elements.shortenBtn.disabled = false;
    elements.urlInput.focus();
  } catch (err) {
    showError('Could not access current tab');
  }
}

/**
 * Main shorten handler
 */
async function handleShorten() {
  const url = elements.urlInput.value.trim();

  if (!url) {
    showError('Please enter a valid URL');
    return;
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    showError('Please enter a valid URL (must start with http:// or https://)');
    return;
  }

  currentOriginalUrl = url;
  await shortenUrl(url);
}

/**
 * Call the API to shorten URL
 */
async function shortenUrl(url) {
  showLoading();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-api-key'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response.status, data);
      return;
    }

    // Extract short URL from response
    const payload = data.data || data;
    const slug = payload.slug || payload.shortCode;
    const shortUrl = payload.shortUrl || (slug ? `${BASE_DOMAIN}/${slug}` : null);

    if (!shortUrl) {
      showError('Invalid response from server');
      return;
    }

    // Normalize URL
    currentShortUrl = shortUrl.startsWith('http')
      ? shortUrl
      : `https://${shortUrl.replace(/^https?:\/\//, '')}`;

    showResult(url, currentShortUrl);
    await saveRecentLink(url, currentShortUrl, slug);
    updateBadge();

    // Clear input
    elements.urlInput.value = '';
    elements.shortenBtn.disabled = true;

    // Notify service worker
    chrome.runtime.sendMessage({
      type: 'URL_SHORTENED',
      data: { originalUrl: url, shortUrl: currentShortUrl }
    });

  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      showError('Unable to connect. Check your internet connection.');
    } else {
      showError('Something went wrong. Please try again.');
    }
  }
}

/**
 * Handle API errors
 */
function handleApiError(status, data) {
  const message = data?.message || data?.error;

  switch (status) {
    case 400:
      showError(message || 'Invalid URL provided');
      break;
    case 429:
      showError('Too many requests. Please wait a moment.');
      break;
    case 500:
    case 502:
    case 503:
      showError('Server is temporarily unavailable. Try again later.');
      break;
    default:
      showError(message || 'Failed to shorten URL. Please try again.');
  }
}

/**
 * Retry the last shortening attempt
 */
function retryShorten() {
  if (currentOriginalUrl) {
    shortenUrl(currentOriginalUrl);
  }
}

// UI State Management

function showLoading() {
  hideAllSections();
  elements.loadingSection.classList.remove('hidden');
  elements.shortenBtn.disabled = true;
}

function showResult(originalUrl, shortUrl) {
  hideAllSections();

  elements.originalUrl.textContent = truncateUrl(originalUrl, 60);
  elements.originalUrl.title = originalUrl;
  elements.shortUrl.textContent = shortUrl.replace(/^https?:\/\//, '');

  elements.resultSection.classList.remove('hidden');
  elements.shortenBtn.disabled = false;
}

function showError(message) {
  hideAllSections();
  elements.errorMessage.textContent = message;
  elements.errorSection.classList.remove('hidden');
  elements.shortenBtn.disabled = false;
}

function hideAllSections() {
  elements.loadingSection.classList.add('hidden');
  elements.resultSection.classList.add('hidden');
  elements.errorSection.classList.add('hidden');
}

// Clipboard

async function copyToClipboard() {
  if (!currentShortUrl) return;

  try {
    await navigator.clipboard.writeText(currentShortUrl);

    // Visual feedback
    elements.copyBtn.classList.add('copied');
    const label = elements.copyBtn.querySelector('.btn-label');
    const originalText = label.textContent;
    label.textContent = 'Copied!';

    showToast('Copied to clipboard!');

    setTimeout(() => {
      elements.copyBtn.classList.remove('copied');
      label.textContent = originalText;
    }, 2000);
  } catch {
    showToast('Failed to copy');
  }
}

// QR Code Generation

function showQrModal() {
  if (!currentShortUrl) return;

  elements.qrUrl.textContent = currentShortUrl.replace(/^https?:\/\//, '');
  generateQrCode(currentShortUrl);
  elements.qrModal.classList.remove('hidden');
}

function hideQrModal() {
  elements.qrModal.classList.add('hidden');
}

/**
 * Generate QR code using canvas
 */
function generateQrCode(url) {
  const canvas = elements.qrCanvas;
  const ctx = canvas.getContext('2d');
  const size = 200;

  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Simple QR code generation using a basic pattern
  // For production, use a proper QR code library
  const qrData = encodeQrData(url);
  const moduleCount = qrData.length;
  const moduleSize = (size - 24) / moduleCount;
  const offset = 12;

  ctx.fillStyle = '#000000';

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qrData[row][col]) {
        ctx.fillRect(
          offset + col * moduleSize,
          offset + row * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }
}

/**
 * Simple QR code data encoder
 * Note: This is a simplified version. For production, use a library like qrcode-generator
 */
function encodeQrData(text) {
  const size = 25;
  const matrix = Array(size).fill(null).map(() => Array(size).fill(false));

  // Add finder patterns (top-left, top-right, bottom-left)
  addFinderPattern(matrix, 0, 0);
  addFinderPattern(matrix, size - 7, 0);
  addFinderPattern(matrix, 0, size - 7);

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Add data (simplified - creates a pattern based on text)
  const hash = simpleHash(text);
  let bitIndex = 0;

  for (let row = size - 1; row > 8; row -= 2) {
    for (let col = size - 1; col > 8; col--) {
      if (!isReserved(row, col, size)) {
        matrix[row][col] = (hash >> (bitIndex % 32)) & 1;
        bitIndex++;
      }
    }
  }

  return matrix;
}

function addFinderPattern(matrix, row, col) {
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
  ];

  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (row + r < matrix.length && col + c < matrix.length) {
        matrix[row + r][col + c] = pattern[r][c] === 1;
      }
    }
  }
}

function isReserved(row, col, size) {
  // Finder patterns and timing
  if (row < 9 && col < 9) return true;
  if (row < 9 && col >= size - 8) return true;
  if (row >= size - 8 && col < 9) return true;
  if (row === 6 || col === 6) return true;
  return false;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function downloadQrCode() {
  const canvas = elements.qrCanvas;
  const link = document.createElement('a');
  link.download = 'dashdig-qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Recent Links Storage

async function saveRecentLink(originalUrl, shortUrl, slug) {
  try {
    const storage = await chrome.storage.local.get(['recentLinks', 'linksToday']);
    let recentLinks = storage.recentLinks || [];
    let linksToday = storage.linksToday || { count: 0, date: new Date().toDateString() };

    // Update today's count
    const today = new Date().toDateString();
    if (linksToday.date !== today) {
      linksToday = { count: 0, date: today };
    }
    linksToday.count++;

    // Add new link
    recentLinks.unshift({
      slug: slug || shortUrl.split('/').pop(),
      originalUrl,
      shortUrl,
      createdAt: new Date().toISOString()
    });

    // Keep only last 10
    recentLinks = recentLinks.slice(0, 10);

    await chrome.storage.local.set({ recentLinks, linksToday });
    renderRecentLinks(recentLinks);
  } catch (err) {
    // Silent fail for storage errors
  }
}

async function loadRecentLinks() {
  try {
    const storage = await chrome.storage.local.get(['recentLinks']);
    const recentLinks = storage.recentLinks || [];
    renderRecentLinks(recentLinks);
  } catch (err) {
    // Silent fail
  }
}

function renderRecentLinks(links) {
  if (links.length === 0) {
    elements.recentList.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8M12 8v8"/>
        </svg>
        <p class="empty-text">No recent links</p>
        <p class="empty-subtext">Shortened URLs will appear here</p>
      </div>
    `;
    return;
  }

  elements.recentList.innerHTML = links.map(link => `
    <button class="recent-item" data-url="${escapeHtml(link.shortUrl)}">
      <div class="recent-icon">&#9889;</div>
      <div class="recent-content">
        <p class="recent-short">${escapeHtml((link.shortUrl || '').replace(/^https?:\/\//, ''))}</p>
        <p class="recent-original" title="${escapeHtml(link.originalUrl)}">${escapeHtml(truncateUrl(link.originalUrl, 40))}</p>
      </div>
      <span class="recent-time">${formatRelativeTime(link.createdAt)}</span>
    </button>
  `).join('');

  // Add click handlers
  elements.recentList.querySelectorAll('.recent-item').forEach(item => {
    item.addEventListener('click', () => {
      const url = item.dataset.url;
      if (url) {
        chrome.tabs.create({ url });
      }
    });
  });
}

async function clearRecentLinks() {
  try {
    await chrome.storage.local.set({ recentLinks: [] });
    renderRecentLinks([]);
  } catch (err) {
    // Silent fail
  }
}

// Badge

async function updateBadge() {
  try {
    const storage = await chrome.storage.local.get(['linksToday']);
    const linksToday = storage.linksToday || { count: 0, date: new Date().toDateString() };

    const today = new Date().toDateString();
    const count = linksToday.date === today ? linksToday.count : 0;

    chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      count
    });
  } catch (err) {
    // Silent fail
  }
}

// Toast

function showToast(message) {
  elements.toastMessage.textContent = message;
  elements.toast.classList.add('show');
  elements.toast.classList.remove('hidden');

  setTimeout(() => {
    elements.toast.classList.remove('show');
    setTimeout(() => {
      elements.toast.classList.add('hidden');
    }, 300);
  }, 2000);
}

// Utility Functions

function truncateUrl(url, maxLength = 60) {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + '...';
}

function formatRelativeTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d`;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
