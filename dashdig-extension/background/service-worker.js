/**
 * Dashdig Chrome Extension - Background Service Worker
 * Handles context menus, badge updates, and background tasks
 */

const API_URL = 'https://dashdig-production.up.railway.app/api/shorten';
const BASE_DOMAIN = 'https://dashdig.com';

// Context Menu ID
const CONTEXT_MENU_ID = 'dashdig-shorten';

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Shorten with Dashdig',
    contexts: ['link', 'page', 'selection']
  });

  // Initialize storage
  chrome.storage.local.get(['linksToday', 'recentLinks'], (result) => {
    if (!result.linksToday) {
      chrome.storage.local.set({
        linksToday: { count: 0, date: new Date().toDateString() }
      });
    }
    if (!result.recentLinks) {
      chrome.storage.local.set({ recentLinks: [] });
    }
  });

  // Update badge on install
  updateBadge(0);
});

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  let urlToShorten = null;

  // Determine URL based on context
  if (info.linkUrl) {
    urlToShorten = info.linkUrl;
  } else if (info.selectionText) {
    // Check if selection is a valid URL
    try {
      new URL(info.selectionText);
      urlToShorten = info.selectionText;
    } catch {
      // Not a valid URL, use page URL
      urlToShorten = info.pageUrl;
    }
  } else if (info.pageUrl) {
    urlToShorten = info.pageUrl;
  }

  if (!urlToShorten) {
    showNotification('Error', 'No valid URL found to shorten');
    return;
  }

  // Validate URL
  if (urlToShorten.startsWith('chrome://') ||
      urlToShorten.startsWith('about:') ||
      urlToShorten.startsWith('chrome-extension://')) {
    showNotification('Error', 'Cannot shorten browser internal pages');
    return;
  }

  // Shorten the URL
  await shortenUrlFromContext(urlToShorten);
});

/**
 * Shorten URL from context menu
 */
async function shortenUrlFromContext(url) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      showNotification('Error', data.message || 'Failed to shorten URL');
      return;
    }

    // Extract short URL
    const payload = data.data || data;
    const slug = payload.slug || payload.shortCode;
    const shortUrl = payload.shortUrl || (slug ? `${BASE_DOMAIN}/${slug}` : null);

    if (!shortUrl) {
      showNotification('Error', 'Invalid response from server');
      return;
    }

    // Normalize URL
    const normalizedShortUrl = shortUrl.startsWith('http')
      ? shortUrl
      : `https://${shortUrl.replace(/^https?:\/\//, '')}`;

    // Copy to clipboard
    try {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['CLIPBOARD'],
        justification: 'Copy shortened URL to clipboard'
      });
    } catch {
      // Document may already exist
    }

    // Save to storage
    await saveRecentLink(url, normalizedShortUrl, slug);

    // Show success notification
    showNotification('URL Shortened!', normalizedShortUrl.replace(/^https?:\/\//, ''));

    // Update badge
    const storage = await chrome.storage.local.get(['linksToday']);
    const count = storage.linksToday?.count || 0;
    updateBadge(count);

  } catch (err) {
    showNotification('Error', 'Network error. Please try again.');
  }
}

/**
 * Save link to recent history
 */
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
  } catch {
    // Silent fail
  }
}

/**
 * Show Chrome notification
 */
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title,
    message,
    priority: 2
  });
}

/**
 * Update extension badge
 */
function updateBadge(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#FF6B35' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

/**
 * Handle messages from popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_BADGE') {
    updateBadge(message.count);
  } else if (message.type === 'URL_SHORTENED') {
    // Could trigger additional background tasks here
  }

  return true;
});

/**
 * Reset badge at midnight
 */
chrome.alarms.create('reset-badge', {
  when: getNextMidnight(),
  periodInMinutes: 24 * 60
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'reset-badge') {
    updateBadge(0);
    chrome.storage.local.set({
      linksToday: { count: 0, date: new Date().toDateString() }
    });
  }
});

/**
 * Get timestamp for next midnight
 */
function getNextMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * Handle startup - refresh badge
 */
chrome.runtime.onStartup.addListener(async () => {
  const storage = await chrome.storage.local.get(['linksToday']);
  const linksToday = storage.linksToday || { count: 0, date: new Date().toDateString() };
  const today = new Date().toDateString();

  if (linksToday.date === today) {
    updateBadge(linksToday.count);
  } else {
    updateBadge(0);
    chrome.storage.local.set({
      linksToday: { count: 0, date: today }
    });
  }
});
