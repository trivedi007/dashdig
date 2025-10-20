/**
 * Comprehensive Test Suite for Smart URL Generator
 * 
 * Tests:
 * 1. E-commerce URLs (Amazon, BJs, Target, Walmart)
 * 2. Social media (Twitter/X, LinkedIn, Instagram)
 * 3. News articles (NYTimes, WashPost, Reuters)
 * 4. Videos (YouTube, Vimeo, TikTok)
 * 5. GitHub repositories
 * 6. Google Search results
 * 7. Very long URLs with many parameters
 * 8. Already shortened URLs
 * 9. URLs with special characters
 * 10. International domains
 */

const { describe, it, expect, beforeEach, afterEach, vi } = require('vitest');
const { detectPattern, getSupportedPatterns } = require('../src/services/urlPatternDetector');

describe('Smart URL Generator - Pattern Detection', () => {
  
  // =============================================================================
  // TEST SUITE 1: E-COMMERCE URLs
  // =============================================================================
  
  describe('E-Commerce URLs', () => {
    
    it('should detect Amazon product URLs with ASIN', () => {
      const url = 'https://www.amazon.com/Echo-Dot-5th-Gen-2022-release/dp/B09B8V1LZ3';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('Amazon');
      expect(result.confidence).toBe('high');
      expect(result.extracted.merchant).toBe('Amazon');
      expect(result.extracted.asin).toBe('B09B8V1LZ3');
      expect(result.suggestedSlug).toMatch(/Amazon\./);
      expect(result.suggestedSlug.length).toBeLessThanOrEqual(50);
    });
    
    it('should handle Amazon URLs with tracking parameters', () => {
      const url = 'https://www.amazon.com/dp/B09B8V1LZ3?tag=affiliate-20&ref=xyz&keywords=echo+dot';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('Amazon');
      expect(result.extracted.asin).toBe('B09B8V1LZ3');
      // Should strip tracking params
      expect(result.suggestedSlug).not.toMatch(/tag|ref|keywords/);
    });
    
    it('should handle Amazon international domains (.co.uk, .de, .jp)', () => {
      const urls = [
        'https://www.amazon.co.uk/dp/B09B8V1LZ3',
        'https://www.amazon.de/dp/B09B8V1LZ3',
        'https://www.amazon.ca/dp/B09B8V1LZ3'
      ];
      
      urls.forEach(url => {
        const result = detectPattern(url);
        expect(result.matched).toBe(true);
        expect(result.patternName).toBe('Amazon');
        expect(result.extracted.asin).toBe('B09B8V1LZ3');
      });
    });
    
    it('should handle BJs Wholesale Club URLs', () => {
      const url = 'https://www.bjs.com/product/harrys-5-blade-razor-handle-value-pack/3000000000003879255';
      const result = detectPattern(url);
      
      // BJs doesn't have a pre-defined pattern, should use generic
      expect(result.matched).toBe(false);
      expect(result.patternName).toBe('Generic');
    });
    
    it('should handle Target URLs with product IDs', () => {
      const url = 'https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets/-/A-12345678';
      const result = detectPattern(url);
      
      // Target doesn't have a pre-defined pattern, should use generic
      expect(result.matched).toBe(false);
    });
    
  });
  
  // =============================================================================
  // TEST SUITE 2: SOCIAL MEDIA URLs
  // =============================================================================
  
  describe('Social Media URLs', () => {
    
    it('should detect Twitter/X tweets', () => {
      const url = 'https://twitter.com/elonmusk/status/1234567890123456789';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('Twitter/X');
      expect(result.extracted.platform).toBe('X');
      expect(result.extracted.username).toBe('elonmusk');
      expect(result.extracted.tweetId).toBe('1234567890123456789');
      expect(result.suggestedSlug).toMatch(/X\.elonmusk/);
    });
    
    it('should handle x.com domain (Twitter rebrand)', () => {
      const url = 'https://x.com/elonmusk/status/1234567890123456789';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('Twitter/X');
      expect(result.extracted.username).toBe('elonmusk');
    });
    
    it('should detect LinkedIn profiles', () => {
      const url = 'https://www.linkedin.com/in/john-doe-12345';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('LinkedIn');
      expect(result.extracted.platform).toBe('LinkedIn');
      expect(result.extracted.name).toBe('john-doe-12345');
      expect(result.extracted.type).toBe('Profile');
    });
    
    it('should detect LinkedIn company pages', () => {
      const url = 'https://www.linkedin.com/company/microsoft';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.extracted.type).toBe('Company');
      expect(result.extracted.name).toBe('microsoft');
    });
    
    it('should handle Instagram URLs (not pre-defined)', () => {
      const url = 'https://www.instagram.com/p/ABC123xyz/';
      const result = detectPattern(url);
      
      // Instagram not in pre-defined patterns
      expect(result.matched).toBe(false);
      expect(result.patternName).toBe('Generic');
    });
    
  });
  
  // =============================================================================
  // TEST SUITE 3: NEWS ARTICLES
  // =============================================================================
  
  describe('News Article URLs', () => {
    
    it('should detect NYTimes articles with date and headline', () => {
      const url = 'https://www.nytimes.com/2025/01/15/technology/ai-regulation-congress.html';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('New York Times');
      expect(result.extracted.publication).toBe('NYTimes');
      expect(result.extracted.year).toBe('2025');
      expect(result.extracted.month).toBe('01');
      expect(result.extracted.category).toBe('technology');
      expect(result.suggestedSlug).toMatch(/NYTimes/);
      expect(result.suggestedSlug).toMatch(/2025/);
    });
    
    it('should handle NYTimes shortened URLs (nyti.ms)', () => {
      const url = 'https://nyti.ms/3xK7mQ2';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('New York Times');
    });
    
    it('should handle Washington Post URLs (not pre-defined)', () => {
      const url = 'https://www.washingtonpost.com/technology/2025/01/15/ai-regulation/';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(false);
      expect(result.patternName).toBe('Generic');
    });
    
    it('should handle Reuters URLs', () => {
      const url = 'https://www.reuters.com/technology/2025/01/15/ai-regulation-2025-01-15/';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(false);
      expect(result.patternName).toBe('Generic');
    });
    
  });
  
  // =============================================================================
  // TEST SUITE 4: VIDEO PLATFORMS
  // =============================================================================
  
  describe('Video Platform URLs', () => {
    
    it('should detect YouTube watch URLs', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('YouTube');
      expect(result.extracted.videoId).toBe('dQw4w9WgXcQ');
      expect(result.suggestedSlug).toMatch(/YouTube/);
    });
    
    it('should detect YouTube short URLs (youtu.be)', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('YouTube');
      expect(result.extracted.videoId).toBe('dQw4w9WgXcQ');
    });
    
    it('should detect YouTube Shorts', () => {
      const url = 'https://www.youtube.com/shorts/abc123xyz';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.extracted.type).toBe('Short');
    });
    
    it('should detect YouTube embed URLs', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.extracted.videoId).toBe('dQw4w9WgXcQ');
    });
    
    it('should handle Vimeo URLs (not pre-defined)', () => {
      const url = 'https://vimeo.com/123456789';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(false);
      expect(result.patternName).toBe('Generic');
    });
    
    it('should handle TikTok URLs (not pre-defined)', () => {
      const url = 'https://www.tiktok.com/@username/video/1234567890';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(false);
    });
    
  });
  
  // =============================================================================
  // TEST SUITE 5: GITHUB REPOSITORIES
  // =============================================================================
  
  describe('GitHub URLs', () => {
    
    it('should detect GitHub repository URLs', () => {
      const url = 'https://github.com/facebook/react';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('GitHub');
      expect(result.extracted.platform).toBe('GitHub');
      expect(result.extracted.username).toBe('facebook');
      expect(result.extracted.repo).toBe('react');
      expect(result.extracted.type).toBe('Repo');
      expect(result.suggestedSlug).toBe('GitHub.facebook.react');
    });
    
    it('should detect GitHub issues', () => {
      const url = 'https://github.com/facebook/react/issues/12345';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.extracted.type).toBe('Issue');
    });
    
    it('should detect GitHub pull requests', () => {
      const url = 'https://github.com/facebook/react/pull/67890';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.extracted.type).toBe('PR');
    });
    
    it('should handle GitHub gist URLs', () => {
      const url = 'https://gist.github.com/username/abc123xyz';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('GitHub');
    });
    
  });
  
  // =============================================================================
  // TEST SUITE 6: SPECIAL CASES
  // =============================================================================
  
  describe('Special Cases', () => {
    
    it('should handle very long URLs with many parameters', () => {
      const url = 'https://www.amazon.com/dp/B09B8V1LZ3?tag=aff-20&ref=xyz&keywords=echo+dot&qid=123&sr=8-1&th=1&psc=1&spLa=xyz&linkCode=abc';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.suggestedSlug.length).toBeLessThanOrEqual(50);
      // Should extract ASIN despite long URL
      expect(result.extracted.asin).toBe('B09B8V1LZ3');
    });
    
    it('should handle already shortened URLs (bit.ly, tinyurl)', () => {
      const shortUrls = [
        'https://bit.ly/3xK7mQ2',
        'https://tinyurl.com/abc123',
        'https://t.co/xyz789'
      ];
      
      shortUrls.forEach(url => {
        const result = detectPattern(url);
        // Should not match specific patterns, use generic
        expect(result.matched).toBe(false);
        expect(result.patternName).toBe('Generic');
      });
    });
    
    it('should handle URLs with special characters (%, &, =)', () => {
      const url = 'https://www.example.com/search?q=hello%20world&filter=new&sort=relevance';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(false);
      expect(() => detectPattern(url)).not.toThrow();
    });
    
    it('should handle international domains (.co.uk, .de, .jp)', () => {
      const urls = [
        'https://www.example.co.uk/product/123',
        'https://www.example.de/artikel/456',
        'https://www.example.jp/item/789'
      ];
      
      urls.forEach(url => {
        expect(() => detectPattern(url)).not.toThrow();
      });
    });
    
    it('should handle Google Search result URLs', () => {
      const url = 'https://www.google.com/search?q=smart+url+generator&oq=smart+url&aqs=chrome';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(false);
      expect(result.patternName).toBe('Generic');
    });
    
    it('should enforce 50 character limit on generated slugs', () => {
      const longUrl = 'https://www.example.com/this/is/a/very/long/path/with/many/segments/that/should/be/truncated';
      const result = detectPattern(longUrl);
      
      if (result.suggestedSlug) {
        expect(result.suggestedSlug.length).toBeLessThanOrEqual(50);
      }
    });
    
    it('should handle Reddit URLs with post titles', () => {
      const url = 'https://www.reddit.com/r/programming/comments/abc123/cool-project-that-i-built';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('Reddit');
      expect(result.extracted.subreddit).toBe('programming');
    });
    
    it('should handle Medium article URLs', () => {
      const url = 'https://medium.com/@author/how-to-build-smart-urls-abc123';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(true);
      expect(result.patternName).toBe('Medium');
      expect(result.extracted.author).toBe('author');
    });
    
  });
  
  // =============================================================================
  // TEST SUITE 7: EDGE CASES & ERROR HANDLING
  // =============================================================================
  
  describe('Edge Cases & Error Handling', () => {
    
    it('should handle invalid URLs gracefully', () => {
      const invalidUrls = [
        'not-a-url',
        'http://',
        'ftp://invalid',
        '',
        null,
        undefined
      ];
      
      invalidUrls.forEach(url => {
        expect(() => detectPattern(url)).not.toThrow();
      });
    });
    
    it('should handle URLs with no path', () => {
      const url = 'https://www.example.com';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(false);
    });
    
    it('should handle URLs with only query parameters', () => {
      const url = 'https://www.example.com?query=test';
      const result = detectPattern(url);
      
      expect(result.matched).toBe(false);
    });
    
    it('should remove invalid characters from slugs', () => {
      // Slugs should only contain a-zA-Z0-9.-
      const urls = [
        'https://github.com/user-name/repo_name',
        'https://github.com/user@email/repo#123'
      ];
      
      urls.forEach(url => {
        const result = detectPattern(url);
        if (result.suggestedSlug) {
          expect(result.suggestedSlug).toMatch(/^[a-zA-Z0-9.-]+$/);
        }
      });
    });
    
  });
  
  // =============================================================================
  // TEST SUITE 8: SUPPORTED PATTERNS
  // =============================================================================
  
  describe('Supported Patterns Configuration', () => {
    
    it('should return all supported patterns', () => {
      const patterns = getSupportedPatterns();
      
      expect(patterns).toBeInstanceOf(Array);
      expect(patterns.length).toBe(8); // Should have 8 patterns
      
      const patternNames = patterns.map(p => p.name);
      expect(patternNames).toContain('Amazon');
      expect(patternNames).toContain('YouTube');
      expect(patternNames).toContain('GitHub');
      expect(patternNames).toContain('New York Times');
      expect(patternNames).toContain('Medium');
      expect(patternNames).toContain('Twitter/X');
      expect(patternNames).toContain('LinkedIn');
      expect(patternNames).toContain('Reddit');
    });
    
    it('should have correct structure for each pattern', () => {
      const patterns = getSupportedPatterns();
      
      patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('id');
        expect(pattern).toHaveProperty('name');
        expect(pattern).toHaveProperty('domains');
        expect(pattern).toHaveProperty('template');
        expect(pattern.domains).toBeInstanceOf(Array);
        expect(pattern.domains.length).toBeGreaterThan(0);
      });
    });
    
  });
  
  // =============================================================================
  // TEST SUITE 9: SLUG QUALITY
  // =============================================================================
  
  describe('Slug Quality & Formatting', () => {
    
    it('should generate PascalCase slugs', () => {
      const url = 'https://github.com/facebook/react';
      const result = detectPattern(url);
      
      // Should not have all lowercase or all uppercase
      expect(result.suggestedSlug).toMatch(/GitHub/);
      expect(result.suggestedSlug).not.toBe(result.suggestedSlug.toLowerCase());
    });
    
    it('should use dots as separators', () => {
      const url = 'https://github.com/facebook/react';
      const result = detectPattern(url);
      
      expect(result.suggestedSlug).toMatch(/\./);
      expect(result.suggestedSlug.split('.').length).toBeGreaterThan(1);
    });
    
    it('should not have consecutive dots', () => {
      const url = 'https://github.com/user-name/repo-name';
      const result = detectPattern(url);
      
      if (result.suggestedSlug) {
        expect(result.suggestedSlug).not.toMatch(/\.\./);
      }
    });
    
    it('should not start or end with dots', () => {
      const url = 'https://github.com/facebook/react';
      const result = detectPattern(url);
      
      if (result.suggestedSlug) {
        expect(result.suggestedSlug).not.toMatch(/^\./);
        expect(result.suggestedSlug).not.toMatch(/\.$/);
      }
    });
    
  });
  
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Helper to create mock AI responses
 */
function mockAIResponse(url, suggestedSlug) {
  return {
    slug: suggestedSlug,
    confidence: 'high',
    source: 'ai',
    components: {
      merchant: suggestedSlug.split('.')[0],
      product: suggestedSlug.split('.')[1]
    }
  };
}

/**
 * Helper to validate slug format
 */
function isValidSlug(slug) {
  if (!slug) return false;
  if (slug.length > 50) return false;
  if (!/^[a-zA-Z0-9.-]+$/.test(slug)) return false;
  if (/\.\./.test(slug)) return false;
  if (/^\./.test(slug) || /\.$/.test(slug)) return false;
  return true;
}

module.exports = {
  mockAIResponse,
  isValidSlug
};

