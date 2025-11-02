/**
 * DashDig Widget - React URL Shortener Component
 * Ready-to-use URL shortening component
 * 
 * @file Pre-built URL shortener component for React
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useDashdig } from './DashdigProvider';
import type { ShortenOptions } from '../../core/url-shortener';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Props for DashdigShortener component
 */
export interface DashdigShortenerProps {
  /** Placeholder text for input field */
  placeholder?: string;
  /** Button text */
  buttonText?: string;
  /** Callback when URL is shortened successfully */
  onSuccess?: (shortUrl: string, shortCode: string) => void;
  /** Callback when shortening fails */
  onError?: (error: Error) => void;
  /** Custom CSS class for container */
  className?: string;
  /** Show custom slug input */
  allowCustomSlug?: boolean;
  /** Show expiration date picker */
  allowExpiration?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * DashDig URL Shortener Component
 * A pre-built, styled component for shortening URLs
 * 
 * @param props - Component props
 * @returns URL shortener component
 * 
 * @example
 * import { DashdigProvider, DashdigShortener } from '@dashdig/widget-react';
 * 
 * function App() {
 *   return (
 *     <DashdigProvider apiKey="your-api-key">
 *       <DashdigShortener
 *         placeholder="Enter your long URL"
 *         onSuccess={(shortUrl) => console.log('Shortened:', shortUrl)}
 *         allowCustomSlug={true}
 *       />
 *     </DashdigProvider>
 *   );
 * }
 */
export const DashdigShortener: React.FC<DashdigShortenerProps> = ({
  placeholder = 'Enter URL to shorten...',
  buttonText = 'Shorten',
  onSuccess,
  onError,
  className = '',
  allowCustomSlug = false,
  allowExpiration = false
}) => {
  const { shorten, isLoading, error: contextError } = useDashdig();
  
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');
  const [result, setResult] = useState<{ shortUrl: string; shortCode: string } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setLocalError('Please enter a URL');
      return;
    }

    setLocalError(null);
    setResult(null);

    try {
      const options: ShortenOptions = { url: url.trim() };

      if (allowCustomSlug && customSlug.trim()) {
        options.customSlug = customSlug.trim();
      }

      if (allowExpiration && expirationDays) {
        const days = parseInt(expirationDays, 10);
        if (!isNaN(days) && days > 0) {
          options.expiresAt = Date.now() + (days * 24 * 60 * 60 * 1000);
        }
      }

      const response = await shorten(options);
      
      setResult({
        shortUrl: response.shortUrl,
        shortCode: response.shortCode
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(response.shortUrl, response.shortCode);
      }

      // Clear form
      setUrl('');
      setCustomSlug('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to shorten URL';
      setLocalError(errorMessage);

      // Call error callback
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  };

  /**
   * Copy to clipboard
   */
  const handleCopy = async () => {
    if (result?.shortUrl) {
      try {
        await navigator.clipboard.writeText(result.shortUrl);
        // Could add a "Copied!" toast notification here
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const displayError = localError || (contextError ? contextError.message : null);

  return (
    <div className={`dashdig-shortener ${className}`} style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            style={styles.input}
            required
          />
        </div>

        {allowCustomSlug && (
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="Custom slug (optional)"
              disabled={isLoading}
              style={styles.input}
              pattern="[a-zA-Z0-9_-]+"
              title="Only letters, numbers, dashes, and underscores"
            />
          </div>
        )}

        {allowExpiration && (
          <div style={styles.inputGroup}>
            <select
              value={expirationDays}
              onChange={(e) => setExpirationDays(e.target.value)}
              disabled={isLoading}
              style={styles.select}
            >
              <option value="">No expiration</option>
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          style={{
            ...styles.button,
            ...(isLoading || !url.trim() ? styles.buttonDisabled : {})
          }}
        >
          {isLoading ? 'Shortening...' : buttonText}
        </button>
      </form>

      {displayError && (
        <div style={styles.error}>
          {displayError}
        </div>
      )}

      {result && (
        <div style={styles.result}>
          <div style={styles.resultLabel}>Shortened URL:</div>
          <div style={styles.resultUrl}>
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              {result.shortUrl}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              style={styles.copyButton}
              title="Copy to clipboard"
            >
              📋 Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e1e4e8',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box'
  },
  select: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e1e4e8',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#667eea',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    width: '100%'
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e0',
    cursor: 'not-allowed'
  },
  error: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#fed7d7',
    color: '#9b2c2c',
    borderRadius: '8px',
    fontSize: '14px'
  },
  result: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    border: '2px solid #e1e4e8'
  },
  resultLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px'
  },
  resultUrl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    flex: 1,
    wordBreak: 'break-all'
  },
  copyButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: 'white',
    border: '2px solid #e1e4e8',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  }
};

export default DashdigShortener;

