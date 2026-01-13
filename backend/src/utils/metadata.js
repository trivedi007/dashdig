/**
 * Metadata fetching utility
 * Separated to avoid circular dependencies
 */

/**
 * Fetch page metadata from URL
 * @param {string} url - URL to fetch metadata from
 * @returns {Promise<Object>} Metadata object with title and description
 */
async function fetchMetadata(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    const html = await response.text();
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
    const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/i);
    const ogDescMatch = html.match(/<meta property="og:description" content="(.*?)"/i);
    
    return {
      title: titleMatch?.[1] || ogTitleMatch?.[1] || '',
      description: descMatch?.[1] || ogDescMatch?.[1] || ''
    };
  } catch (error) {
    console.warn('Failed to fetch metadata:', error.message);
    return { title: '', description: '' };
  }
}

module.exports = {
  fetchMetadata
};
