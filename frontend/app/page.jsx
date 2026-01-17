'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, useDeferredValue } from 'react';
import {
  Menu, X, Zap, ChevronDown, ChevronUp, Search, Filter, SortDesc, Copy, Edit2, Archive, Trash2, Send, Clock, Lock, Target, Plus, User, Mail, Briefcase, Building, Check, ArrowRight, TrendingUp, TrendingDown, RefreshCw, Layers, HardHat, Globe, Phone, CreditCard, DollarSign, Bell, LogOut, Code, Minus, MessageCircle, Mic, Star, Menu as MenuIcon, CheckCircle, Smartphone, Tablet, Monitor, Chrome, Facebook, Linkedin, Twitter, Github, Heart, Loader, Link as LinkIcon, AlertTriangle, Home, Settings, BarChart, Sliders, Paperclip, Download, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { api } from '../lib/api';
import QRCode from 'qrcode';
import Avatar, { AvatarButton } from '../components/Avatar';
import { Logo } from '@/components/brand/Logo';
import { Button as NeoBrutalistButton } from '@/components/ui/Button';
import { LightningBolt } from '@/components/ui/LightningBolt';
import { Pricing } from '@/components/landing/Pricing';

// --- Utility Hooks & Components ---

// GEMINI API Constants
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=`;
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""; // Placeholder, key provided by runtime

// Utility function to copy text
const copyToClipboard = (text, showToast) => {
  try {
    // Fallback for secure context issues, using execCommand which works in iframes
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Link copied to clipboard!', 'success');
  } catch (err) {
    showToast('Failed to copy. Please copy manually.', 'error');
  }
};

// Password strength utility function (used by multiple auth components)
const getPasswordStrength = (pass) => {
  if (!pass || pass.length === 0) return { strength: 'None', color: 'text-slate-500', width: '0%' };
  if (pass.length < 8) return { strength: 'Weak', color: 'text-red-400', width: '33%' };
  if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && pass.length >= 10) return { strength: 'Strong', color: 'text-green-400', width: '100%' };
  return { strength: 'Medium', color: 'text-yellow-400', width: '66%' };
};

// Generate initials from a name (e.g., "Narendra Trivedi" -> "NT")
const getInitials = (name) => {
  if (!name || name.trim() === '') return 'U';
  
  return name
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .slice(0, 2)
    .join('');
};

// Hook to check if element is in view for fade-in animations
const useInView = (options) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        // observer.unobserve(ref.current); // Optional: stop observing after first visibility
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, inView];
};

// Generic Input Component with Styling
const Input = React.forwardRef(({ label, id, type = 'text', placeholder, value, onChange, prefix, suffix, helperText, error, readOnly, disabled, icon: Icon, className = '' }, ref) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label htmlFor={id} className="text-white text-sm font-medium">{label}</label>}
    <div className="relative flex items-center">
      {prefix && (
        <span className="inline-flex items-center px-4 py-3 text-[#A0A0A0] bg-[#242424] border border-r-0 border-[#2A2A2A] rounded-l-lg text-sm font-medium">
          {prefix}
        </span>
      )}
      {Icon && <Icon className="absolute left-3 w-4 h-4 text-[#A0A0A0]" />}
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={`flex-grow block w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg placeholder-[#A0A0A0] focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition duration-200 ${prefix ? 'rounded-l-none' : ''} ${Icon ? 'pl-10' : ''} ${suffix ? 'pr-16' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3 inline-flex items-center text-sm">
          {suffix}
        </span>
      )}
    </div>
    {helperText && <p className="text-xs text-[#A0A0A0]">{helperText}</p>}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));

// Button Component
const Button = ({ children, onClick, variant = 'primary', disabled = false, loading = false, icon: Icon, fullWidth = false, className = '', type = 'button' }) => {
  const baseStyle = 'flex items-center justify-center font-medium rounded-lg transition duration-200 shadow-lg';
  let colorStyle = '';

  switch (variant) {
    case 'primary':
      colorStyle = 'bg-[#FF6B35] text-white hover:bg-[#E55A2B] transform hover:scale-[1.02]';
      break;
    case 'secondary':
      colorStyle = 'bg-[#242424] text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white transform hover:scale-[1.02]';
      break;
    case 'danger':
      colorStyle = 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-[1.02]';
      break;
    case 'ghost':
      colorStyle = 'bg-transparent text-[#FF6B35] hover:bg-[#242424] transform hover:scale-105 shadow-none';
      break;
    case 'social-google':
      colorStyle = 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 transform hover:scale-[1.02]';
      break;
    case 'social-apple':
      colorStyle = 'bg-black text-white hover:bg-slate-800 transform hover:scale-[1.02]';
      break;
    case 'social-facebook':
      colorStyle = 'bg-[#1877F2] text-white hover:bg-[#156cd4] transform hover:scale-[1.02]';
      break;
    case 'sms':
      colorStyle = 'bg-orange-600 text-white hover:bg-orange-700 transform hover:scale-[1.02] shadow-orange-500/50';
      break;
    default:
      colorStyle = 'bg-orange-600 text-white hover:bg-orange-700 transform hover:scale-[1.02] shadow-orange-500/50';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${colorStyle} ${fullWidth ? 'w-full' : 'px-4 py-2'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      type={type}
    >
      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''} ${variant === 'primary' || variant === 'sms' ? 'text-amber-300 fill-amber-300' : ''}`} />}
      {children}
    </button>
  );
};

// Card Component
const Card = React.forwardRef(({ children, className = '' }, ref) => (
  <div ref={ref} className={`p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl ${className}`}>
    {children}
  </div>
));

// Skeleton Loader Card
const SkeletonCard = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} className="space-y-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        <div className="h-8 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-800 rounded w-full"></div>
      </Card>
    ))}
  </>
);

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, label, disabled = false }) => (
  <div className="flex items-center justify-between space-x-4">
    <span className="text-slate-300 font-medium">{label}</span>
    <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only peer" />
      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
    </label>
  </div>
);

// Count Up Animation Component
const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const deferredEnd = useDeferredValue(end);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      const value = Math.floor(percentage * deferredEnd);

      setCount(value);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [deferredEnd, duration]);

  return <>{count.toLocaleString()}</>;
};

// Toast Component
const Toast = ({ id, message, type, onDismiss }) => {
  const colorMap = {
    success: 'bg-green-600 border-green-400',
    error: 'bg-red-600 border-red-400',
    info: 'bg-sky-600 border-sky-400',
  };
  const IconMap = {
    success: CheckCircle,
    error: AlertTriangle,
    info: Bell,
  };
  const Icon = IconMap[type] || Bell;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      className={`flex items-center justify-between w-full max-w-xs p-4 rounded-lg shadow-xl text-white mt-2 cursor-pointer transition-all duration-300 transform translate-x-0 ${colorMap[type]}`}
      onClick={() => onDismiss(id)}
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};


// --- Custom Branding Components ---

// DashDig Logo Component - Matches Landing Page Branding
const DashDigLogo = ({ showTagline = true, onClick, className = '' }) => {
  return (
    <div 
      className={`logo logo-dark ${className}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex items-center gap-3">
        <div className="logo-icon">
          <LightningBolt size="md" />
        </div>
        <div className="logo-text-group">
          <span className="logo-text">Dashdig</span>
          {showTagline && (
            <span className="logo-tagline">HUMANIZE • SHORTENIZE • URLS</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Auth Logo Component (for auth pages) - Matches Landing Page Branding
const AuthLogo = () => (
  <div className="logo logo-dark flex justify-center mb-6" style={{ cursor: 'pointer' }}>
    <div className="flex items-center gap-3">
      <div className="logo-icon">
        <LightningBolt size="md" />
      </div>
      <div className="logo-text-group">
        <span className="logo-text">Dashdig</span>
        <span className="logo-tagline">HUMANIZE • SHORTENIZE • URLS</span>
      </div>
    </div>
  </div>
);

// --- Landing Page Components ---

// Hero Section
const Hero = ({ onOpenCreateModal, setAuthView }) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);
  const [error, setError] = useState('');
  
  // Free link tracking
  const FREE_LINK_LIMIT = 5;
  const [freeLinksUsed, setFreeLinksUsed] = useState(0);
  const [linkHistory, setLinkHistory] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false); // Track hydration
  const [modalMode, setModalMode] = useState('result'); // 'result' | 'input' | 'limit'
  
  // QR Code state
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Consistent Lightning Bolt Icon - USE THIS EVERYWHERE in the modal
  const LightningIcon = ({ className = "" }) => (
    <Zap 
      className={`w-4 h-4 text-amber-300 fill-amber-300 ${className}`} 
      style={{ transform: 'rotate(180deg)' }} 
    />
  );

  // === HYDRATION-SAFE LOADING FROM LOCALSTORAGE ===
  useEffect(() => {
    // This runs ONLY on client after hydration
    setIsHydrated(true);
    
    console.log('🔄 Loading from localStorage...');
    
    // Load counter from localStorage
    const storedCount = localStorage.getItem('dashdig_free_links_used');
    console.log('🔄 Stored count:', storedCount);
    if (storedCount) {
      const count = parseInt(storedCount, 10);
      if (!isNaN(count)) {
        setFreeLinksUsed(count);
        console.log('🔄 Set freeLinksUsed to:', count);
      }
    }
    
    // Load history from localStorage
    const storedHistory = localStorage.getItem('dashdig_link_history');
    console.log('🔄 Stored history:', storedHistory);
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        console.log('🔄 Parsed history:', history);
        if (Array.isArray(history)) {
          setLinkHistory(history);
          console.log('🔄 Set linkHistory to:', history);
        }
      } catch (e) {
        console.error('❌ Failed to parse link history:', e);
      }
    } else {
      console.log('🔄 No stored history found');
    }
  }, []); // Empty deps = runs once on mount

  // Generate QR Code as Data URL
  const generateQRCode = async (url) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e293b',  // slate-800 (dark squares)
          light: '#ffffff', // white background
        },
        errorCorrectionLevel: 'M',
      });
      return qrDataUrl;
    } catch (err) {
      console.error('QR Code generation failed:', err);
      return null;
    }
  };

  // Download QR Code as PNG
  const downloadQRCode = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    // Create filename from the short URL slug
    const slug = filename.replace('dashdig.com/', '').replace(/\./g, '-');
    link.download = `dashdig-qr-${slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate a demo shortened URL based on the input
  const generateDemoSlug = (url) => {
    // Extract domain and path hints from URL
    let slug = 'Demo.Link.Example';
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const domain = urlObj.hostname.replace('www.', '').split('.')[0];
      const pathParts = urlObj.pathname.split('/').filter(p => p && p.length > 2);
      
      // Create smart slug based on URL
      const capitalizedDomain = domain.charAt(0).toUpperCase() + domain.slice(1);
      
      if (pathParts.length > 0) {
        const keywords = pathParts.slice(0, 3).map(p => 
          p.replace(/-/g, '.').split('.').map(w => 
            w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          ).join('.')
        );
        slug = `${capitalizedDomain}.${keywords.join('.')}`;
      } else {
        slug = `${capitalizedDomain}.Quick.Link`;
      }
    } catch (e) {
      // Fallback for invalid URLs
      slug = 'Your.Custom.Link';
    }
    return slug.slice(0, 40); // Limit length
  };

  const handleShortenClick = async () => {
    if (!linkInput.trim() || linkInput === 'paste_your_long_ugly_link_here.com') {
      // Show placeholder prompt
      setLinkInput('');
      return;
    }
    
    setIsShortening(true);
    setError('');
    
    try {
      // Call the real API
      const result = await api.shortenUrl(linkInput);
      
      // Extract slug from normalized response (api.ts ensures slug is always present)
      const slug = result.slug || result.shortCode;
      
      if (!slug) {
        console.error('Could not extract slug from response:', result);
        throw new Error('Failed to generate short URL. Please try again.');
      }
      
      // Use dashdig.com as the domain instead of the Railway URL
      const shortUrlDisplay = `dashdig.com/${slug}`;
      setShortenedUrl(shortUrlDisplay);
      
      // Generate QR Code
      setIsGeneratingQR(true);
      const fullShortUrl = `https://${shortUrlDisplay}`;
      const qrCode = await generateQRCode(fullShortUrl);
      setQrCodeUrl(qrCode);
      setIsGeneratingQR(false);
      
      // Increment and persist counter
      const newCount = freeLinksUsed + 1;
      setFreeLinksUsed(newCount);
      localStorage.setItem('dashdig_free_links_used', newCount.toString());
      
      // Set modal mode based on limit
      if (newCount >= FREE_LINK_LIMIT) {
        setModalMode('limit');
      } else {
        setModalMode('result');
      }
      
      setIsResultModalOpen(true);
    } catch (err) {
      // Handle errors
      console.error('Error shortening URL:', err);
      setError(err.message || 'Failed to shorten URL. Please try again.');
      
      // Still open the modal to show the error
      setIsResultModalOpen(true);
    } finally {
      setIsShortening(false);
    }
  };

  // URL Shortening Result Modal
  const ResultModal = () => {
    const remainingLinks = FREE_LINK_LIMIT - freeLinksUsed;
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle creating new link from within modal
    const handleCreateFromModal = async () => {
      if (!inputValue.trim()) return;
      
      setIsProcessing(true);
      setError('');
      
      try {
        const result = await api.shortenUrl(inputValue);
        // Extract slug from normalized response
        const slug = result.slug || result.shortCode;
        
        if (!slug) {
          throw new Error('Failed to generate short URL. Please try again.');
        }
        
        const newShortUrl = `dashdig.com/${slug}`;
        
        // === GENERATE QR CODE FOR NEW LINK ===
        setIsGeneratingQR(true);
        const fullShortUrl = `https://${newShortUrl}`;
        const qrCode = await generateQRCode(fullShortUrl);
        setQrCodeUrl(qrCode);
        setIsGeneratingQR(false);
        
        // === ADD PREVIOUS LINK TO HISTORY (with duplicate check) ===
        let currentHistory = linkHistory;
        
        console.log('📋 Adding to history - Current linkHistory:', linkHistory);
        console.log('📋 Previous link (shortenedUrl):', shortenedUrl);
        console.log('📋 Previous link input:', linkInput);
        
        if (shortenedUrl) {
          // Check if this exact short URL is already in history
          const isDuplicate = linkHistory.some(item => item.shortUrl === shortenedUrl);
          
          console.log('📋 Is duplicate?', isDuplicate);
          
          if (!isDuplicate) {
            const newHistoryEntry = {
              shortUrl: shortenedUrl,
              originalUrl: linkInput.length > 40 ? linkInput.substring(0, 40) + '...' : linkInput,
              createdAt: new Date().toISOString()
            };
            
            console.log('📋 Adding new history entry:', newHistoryEntry);
            
            const updatedHistory = [newHistoryEntry, ...linkHistory].slice(0, 5);
            currentHistory = updatedHistory;
            setLinkHistory(updatedHistory);
            localStorage.setItem('dashdig_link_history', JSON.stringify(updatedHistory));
            
            console.log('📋 Updated history:', updatedHistory);
          } else {
            console.log('📋 Skipping duplicate entry');
          }
        } else {
          console.log('📋 No previous shortenedUrl, skipping history addition');
        }
        
        // === INCREMENT AND PERSIST COUNTER ===
        const newCount = freeLinksUsed + 1;
        setFreeLinksUsed(newCount);
        localStorage.setItem('dashdig_free_links_used', newCount.toString());
        
        // === CHECK LIMIT ===
        if (newCount >= FREE_LINK_LIMIT) {
          // Add the FINAL link to history too before showing limit screen
          const finalHistoryEntry = {
            shortUrl: newShortUrl,
            originalUrl: inputValue.length > 40 ? inputValue.substring(0, 40) + '...' : inputValue,
            createdAt: new Date().toISOString()
          };
          const finalHistory = [finalHistoryEntry, ...currentHistory].slice(0, 5);
          setLinkHistory(finalHistory);
          localStorage.setItem('dashdig_link_history', JSON.stringify(finalHistory));
          
          setModalMode('limit');
        } else {
          setModalMode('result');
        }
        
        // === UPDATE CURRENT LINK (after history updates) ===
        setLinkInput(inputValue);
        setShortenedUrl(newShortUrl);
        setInputValue(''); // Clear input for next
        
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to shorten URL');
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <Modal
        title={
          modalMode === 'limit' ? (
            <span className="flex items-center gap-2">
              <LightningIcon /> You're on Fire!
            </span>
          ) : error ? (
            "⚠️ Error"
          ) : (
            <span className="flex items-center gap-2">
              <LightningIcon /> Link Shortened!
            </span>
          )
        }
        isOpen={isResultModalOpen}
        onClose={() => {
          setIsResultModalOpen(false);
          setModalMode('result');
          setError('');
          setInputValue('');
          setQrCodeUrl(null);
          setIsGeneratingQR(false);
        }}
        className="max-w-lg"
      >
        <div className="space-y-4">
          
          {/* ═══ ERROR STATE ═══ */}
          {error && (
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Oops! Something went wrong</p>
                  <p className="text-slate-400 text-sm mt-1">{error}</p>
                </div>
              </div>
              <Button 
                onClick={() => setError('')}
                className="w-full mt-4"
                variant="secondary"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* ═══ LIMIT REACHED ═══ */}
          {!error && modalMode === 'limit' && (
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-600/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-amber-300 fill-amber-300" style={{ transform: 'rotate(180deg)' }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You've created 5 trial links!</h3>
                <p className="text-slate-400">Sign up to unlock unlimited Digs</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-white font-medium mb-3 flex items-center gap-2">
                  <LightningIcon /> Unlock with a free account:
                </p>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> 1,000 Digs per month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Click analytics & tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Custom slugs & QR codes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Link management dashboard
                  </li>
                </ul>
              </div>

              {/* Show history even at limit */}
              {linkHistory.length > 0 && (
                <div className="border-t border-slate-800 pt-4">
                  <label className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                    Your Trial Digs <LightningIcon className="w-3 h-3" />
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {linkHistory.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-800/30 rounded px-3 py-2 text-sm">
                        <span className="text-orange-400 truncate flex-1">{item.shortUrl}</span>
                        <button 
                          onClick={() => navigator.clipboard.writeText(`https://${item.shortUrl}`)}
                          className="text-slate-500 hover:text-white ml-2"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={() => {
                  setIsResultModalOpen(false);
                  setModalMode('result');
                  setAuthView('signup');
                }}
                fullWidth
              >
                <LightningIcon className="mr-2" /> Sign Up Free
              </Button>
              
              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    setIsResultModalOpen(false);
                    setAuthView('signin');
                  }}
                  className="text-orange-400 hover:text-orange-300"
                >
                  Sign In
                </button>
              </p>
            </>
          )}

          {/* ═══ SUCCESS STATE (not at limit) ═══ */}
          {!error && modalMode !== 'limit' && (
            <>
              {/* INPUT FIELD - Editable for next URL */}
              <div>
                <label className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                  Your Long Ugly URL <LightningIcon className="w-3 h-3" /> Dig Here!
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && inputValue.trim()) handleCreateFromModal(); }}
                    placeholder="Paste your next long URL here..."
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg placeholder-slate-500 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                  <button
                    onClick={handleCreateFromModal}
                    disabled={!inputValue.trim() || isProcessing}
                    className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                  >
                    {isProcessing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <LightningIcon />
                    )}
                    <span className="hidden sm:inline">{isProcessing ? 'Digging...' : 'Dig!'}</span>
                  </button>
                </div>
              </div>
              
              {/* CURRENT SHORTENED URL */}
              <div>
                <label className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                  Your Dashdig <LightningIcon className="w-3 h-3" /> Link
                </label>
                <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-lg px-4 py-3 border border-orange-500/30">
                  <div className="flex items-center gap-3">
                    <a 
                      href={`https://${shortenedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-300 font-bold text-lg truncate min-w-0 flex-1 transition-colors"
                    >
                      {shortenedUrl}
                    </a>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`https://${shortenedUrl}`)}
                      className="flex-shrink-0 flex items-center gap-1 bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* QR CODE SECTION */}
              {qrCodeUrl && (
                <div className="border-t border-slate-800 pt-4">
                  <label className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                    QR Code <LightningIcon className="w-3 h-3" />
                  </label>
                  <div className="flex items-center gap-4 bg-slate-800/30 rounded-lg p-4">
                    {/* QR Code Image */}
                    <div className="bg-white p-2 rounded-lg shadow-lg">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code for shortened URL"
                        className="w-24 h-24"
                      />
                    </div>
                    
                    {/* QR Actions */}
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-xs text-slate-400">
                        Scan to open your shortened link
                      </p>
                      <button
                        onClick={() => downloadQRCode(qrCodeUrl, shortenedUrl)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        Download QR Code
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Loading state while generating QR */}
              {isGeneratingQR && (
                <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating QR code...
                </div>
              )}

              {/* LINK HISTORY */}
              {(() => {
                console.log('🎯 Rendering history section - linkHistory.length:', linkHistory.length);
                console.log('🎯 linkHistory:', linkHistory);
                return linkHistory.length > 0;
              })() && (
                <div className="border-t border-slate-800 pt-4">
                  <label className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                    Your Trial Digs <LightningIcon className="w-3 h-3" />
                  </label>
                  <div className="space-y-2 max-h-28 overflow-y-auto">
                    {linkHistory.map((item, idx) => {
                      console.log(`🎯 Rendering history item ${idx}:`, item);
                      return (
                        <div key={idx} className="flex items-center justify-between bg-slate-800/30 rounded px-3 py-2 text-sm">
                          <span className="text-orange-400 truncate flex-1">{item.shortUrl}</span>
                          <button 
                            onClick={() => navigator.clipboard.writeText(`https://${item.shortUrl}`)}
                            className="text-slate-500 hover:text-white ml-2"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* COUNTER */}
              <div className="flex items-center justify-center gap-2 text-sm bg-slate-800/30 rounded-lg py-2">
                <LightningIcon />
                <span className="text-slate-400">
                  {remainingLinks} trial link{remainingLinks !== 1 ? 's' : ''} remaining
                </span>
              </div>
              
              {/* CTA */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setIsResultModalOpen(false);
                      setModalMode('result');
                      setAuthView('signup');
                    }}
                    className="flex-1"
                  >
                    Sign Up Free
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsResultModalOpen(false);
                      setModalMode('result');
                      setLinkInput('');
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setIsResultModalOpen(false);
                      setAuthView('signin');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[#FF6B35] font-semibold hover:text-white transition-colors"
                  >
                    <LightningBolt size="xs" />
                    <span>Sign In to View Dashboard</span>
                  </button>
                  <p className="text-xs text-slate-500 mt-1">Login to view analytics for your links</p>
                </div>
              </div>
            </>
          )}
          
        </div>
      </Modal>
    );
  };

  const DemoVideoModal = () => (
    <Modal
      title="Dashdig Demo"
      isOpen={isDemoModalOpen}
      onClose={() => setIsDemoModalOpen(false)}
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Video Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center border border-slate-700">
          <div className="w-20 h-20 rounded-full bg-orange-600/20 flex items-center justify-center mb-4">
            <Monitor className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Video Coming Soon!</h3>
          <p className="text-slate-400 text-center max-w-md px-4">
            We're creating an amazing 60-second video showcasing how Dashdig transforms ugly URLs into memorable links.
          </p>
        </div>
        
        {/* Try Dashboard CTA */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-300 text-center mb-4">
            Want to access the dashboard? Sign in with Google to get started!
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                setIsDemoModalOpen(false);
                const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';
                window.location.href = `${backendUrl}/api/auth/google`;
              }}
              className="px-6 flex items-center gap-2"
            >
              <LightningBolt size="sm" />
              Sign In with Google
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <section className="relative pt-24 pb-32 bg-[#FDF8F3] overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl text-center z-10">
        {/* V2 Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FF6B35] text-white px-4 py-2 rounded-full border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] text-sm font-bold mb-6">
          <LightningBolt size="sm" />
          <span>V2.0 NOW AVAILABLE</span>
        </div>

        {/* Main Title - colors swap on hover */}
        <div className="group cursor-pointer select-none">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase text-[#1A1A1A] group-hover:text-[#FF6B35] tracking-tighter leading-none mb-4 transition-colors duration-300">
            URLS WITH
          </h1>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase text-[#FF6B35] group-hover:text-[#1A1A1A] tracking-tighter leading-none mb-10 transition-colors duration-300">
            ATTITUDE.
          </h1>
        </div>

        {/* Before/After Comparison Cards */}
        <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
          {/* BEFORE Card - Red */}
          <div className="bg-[#FEE2E2] border-3 border-[#EF4444] rounded-lg p-5 shadow-[4px_4px_0_#1A1A1A] transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A]">
            <div className="text-[#EF4444] text-xs font-bold uppercase mb-2 flex items-center gap-1">
              <span>✗</span> BEFORE
            </div>
            <div className="font-mono text-base text-gray-500 line-through">bit.ly/3xK9mZb</div>
          </div>
          
          {/* Arrow */}
          <div className="text-[#FF6B35] text-3xl font-bold">→</div>
          
          {/* AFTER Card - Green */}
          <div className="bg-[#DCFCE7] border-3 border-[#22C55E] rounded-lg p-5 shadow-[4px_4px_0_#1A1A1A] transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A]">
            <div className="text-[#22C55E] text-xs font-bold uppercase mb-2 flex items-center gap-1">
              <span>✓</span> AFTER
            </div>
            <div className="font-mono text-base text-[#1A1A1A]">dashdig.com/Best.Coffee.Seattle</div>
          </div>
        </div>

        {/* Quick Shortener Form */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
          <input
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            className="flex-1 w-full px-4 py-3 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] rounded-lg text-[#1A1A1A] placeholder-slate-500 focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition duration-200"
            placeholder="paste_your_long_ugly_link_here"
          />
          <NeoBrutalistButton 
            onClick={handleShortenClick}
            disabled={isShortening}
            variant="primary"
            icon={isShortening ? null : <LightningBolt size="sm" />}
          >
            {isShortening ? 'Digging...' : 'Dig This!'}
          </NeoBrutalistButton>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <NeoBrutalistButton onClick={() => setAuthView('signup')} variant="primary" icon={<LightningBolt size="sm" />}>
              GET STARTED FREE
            </NeoBrutalistButton>
            <NeoBrutalistButton onClick={() => setAuthView('signin')} variant="secondary" icon={<LightningBolt size="sm" />}>
              Sign In
            </NeoBrutalistButton>
          </div>
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1A1A1A] font-bold border-3 border-[#1A1A1A] rounded-full shadow-[4px_4px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A] transition-all duration-200"
          >
            <LightningBolt size="sm" />
            <span>Dig Video!</span>
          </button>
        </div>

      </div>
      <DemoVideoModal />
      <ResultModal />
    </section>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    { num: 1, title: "Paste Your URL", desc: "Drop any long, ugly URL into Dashdig. We accept links from any website, anywhere.", icon: Copy },
    { num: 2, title: "AI Creates Your Link", desc: "Our AI analyzes the destination and generates a memorable, human-readable short URL. Or customize your own.", icon: Zap, visual: "bit.ly/3xK9mL2 → dashdig.com/Target.Tide.Pods" },
    { num: 3, title: "Share & Track", desc: "Share your branded link everywhere. Track clicks, geography, devices, and more in real-time.", icon: Sliders, visual: "Mini analytics dashboard mockup" },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#FDF8F3]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="section-header text-center mb-16">
          <h2 className="text-[#1A1A1A]">SHORTEN LINKS IN SECONDS</h2>
          <p className="text-xl text-slate-600">Three simple steps to better links</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8 relative">
          {/* Connector lines on desktop */}
          <div className="absolute top-1/2 left-0 right-0 hidden md:flex justify-between -z-0 transform -translate-y-1/2 px-12">
            <div className="w-1/3 border-t border-slate-700/50 relative">
              <ArrowRight className="w-4 h-4 text-slate-700 absolute -right-2 -top-2" />
            </div>
            <div className="w-1/3 border-t border-slate-700/50 relative">
              <ArrowRight className="w-4 h-4 text-slate-700 absolute -right-2 -top-2" />
            </div>
          </div>

          {steps.map((step, index) => {
            const [ref, inView] = useInView({ threshold: 0.1 });
            return (
              <Card
                key={index}
                ref={ref}
                className={`md:w-1/3 flex flex-col items-center text-center transition duration-500 ease-out transform bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#FF6B35] rounded-full border-2 border-[#1A1A1A]">
                  <span className="text-3xl font-black text-white">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{step.title}</h3>
                <p className="text-slate-600 mb-4">{step.desc}</p>
                {step.visual && (
                  <p className="text-sm font-mono text-[#FF6B35] bg-[#FDF8F3] p-2 rounded-lg mt-auto border border-[#1A1A1A]">{step.visual.split('→').map((t, i) => <span key={i} className={i === 0 ? 'text-slate-500 line-through' : 'font-semibold block'}>{t}</span>)}</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};


// Social Proof Section
const SocialProof = () => {
  const LOGOS = [
    { name: 'Vertex', icon: Layers },
    { name: 'Spherule', icon: Globe },
    { name: 'HardHat', icon: HardHat },
    { name: 'CodeForge', icon: Code },
    { name: 'Synergy', icon: Zap },
    { name: 'Apex', icon: TrendingUp },
  ];

  const TESTIMONIALS = [
    { name: 'Alex T.', company: 'Digital Marketer @ Vertex', quote: 'Dashdig transformed our social media campaigns. The branded links look so much more trustworthy and professional.', rating: 5, avatar: 'AT' },
    { name: 'Sarah L.', company: 'CTO @ Spherule Tech', quote: 'The API is rock solid and the uptime is impeccable. It integrated seamlessly into our internal link management tools.', rating: 5, avatar: 'SL' },
    { name: 'Mark P.', company: 'Founder @ HardHat Co.', quote: 'We saw an immediate 15% increase in click-through rates after switching to Dashdig’s AI-powered slugs.', rating: 5, avatar: 'MP' },
  ];

  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <section id="social-proof" ref={ref} className={`py-20 bg-[#FDF8F3] transition-opacity duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8">Trusted by 10,000+ marketers</h2>
          {/* Logo Row */}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            {LOGOS.map((logo, index) => (
              <div key={index} className="flex items-center space-x-2 text-slate-600 hover:text-[#1A1A1A] transition duration-200">
                <logo.icon className="w-6 h-6" />
                <span className="text-lg font-semibold">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <Card key={index} className="transition duration-500 ease-out transform bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px]">
              <div className="flex space-x-1 mb-4 text-[#FF6B35]">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#FF6B35]" />)}
              </div>
              <p className="text-lg text-slate-700 italic mb-6">"{t.quote}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#FF6B35] rounded-full text-white font-bold text-sm border-2 border-[#1A1A1A]">{t.avatar}</div>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">{t.name}</p>
                  <p className="text-sm text-slate-600">{t.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Section
const Features = () => {
  const features = [
    { title: "AI-Powered Slugs", desc: "Stop generic, random strings. Our AI generates short, memorable, human-readable slugs based on your content.", icon: Zap },
    { title: "Custom Domains", desc: "Use your own brandable domain (e.g., your.link/product) to increase trust and conversions.", icon: Globe },
    { title: "Deep Analytics", desc: "Track every click, location, device, and referrer in real-time. Make data-driven decisions.", icon: TrendingUp },
    { title: "Widget Integration", desc: "Integrate our shortener directly into your website or app with our powerful JavaScript widget.", icon: Code },
    { title: "Link Management", desc: "Easily manage, archive, and edit links in one beautiful, intuitive dashboard.", icon: Sliders },
    { title: "Password Protection", desc: "Secure sensitive links with optional password protection and expiration dates.", icon: Lock },
  ];

  return (
    <section id="features" className="py-24 bg-[#FDF8F3]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="section-header text-center mb-16">
          <h2 className="text-[#1A1A1A]">FEATURES BUILT FOR CONVERSION</h2>
          <p className="text-xl text-slate-600">Everything you need to humanize your URLs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            // Use LightningBolt for AI-Powered Slugs, regular icons for others
            const IconComponent = feature.title === "AI-Powered Slugs" ? 
              () => <LightningBolt size="md" /> : 
              () => <feature.icon style={{ width: '24px', height: '24px', color: 'white' }} />;
            
            return (
              <div key={index} className="brutalist-card feature-card">
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: '#FF6B35',
                  border: '3px solid #1A1A1A',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '4px 4px 0px #1A1A1A',
                  marginBottom: '20px'
                }}>
                  <IconComponent />
                </div>
                <h3>{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
                <a href="#" className="flex items-center text-[#FF6B35] hover:text-[#1A1A1A] text-sm font-medium">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Pricing Section - Now imported from @/components/landing/Pricing

// Contact Section
const ContactSection = ({ setLandingView }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', email: '', subject: 'General', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const subjects = ['General', 'Sales', 'Support', 'Partnership', 'Other'];

  return (
    <section id="contact" className="py-24 bg-[#FDF8F3]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-2">Get in Touch</h2>
          <p className="text-xl text-slate-600">We'd love to hear from you</p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition duration-200">
            <MessageCircle className="w-8 h-8 text-[#FF6B35] mb-4" />
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">GENERAL INQUIRIES</h3>
            <p className="text-slate-600 mb-4">Questions, feedback, or just want to chat?</p>
            <a href="mailto:hello@dashdig.com" className="text-[#FF6B35] hover:text-[#1A1A1A] font-medium block">hello@dashdig.com</a>
            <p className="text-xs text-slate-600 mt-2">We reply within 24 hours</p>
          </Card>
          <Card className="bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition duration-200">
            <Briefcase className="w-8 h-8 text-[#FF6B35] mb-4" />
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">SALES</h3>
            <p className="text-slate-600 mb-4">Ready to upgrade or need a custom plan?</p>
            <a href="mailto:sales@dashdig.com" className="text-[#FF6B35] hover:text-[#1A1A1A] font-medium block">sales@dashdig.com</a>
            <p className="text-xs text-slate-600 mt-2">Phone: <a href="tel:18443274344" className='hover:underline'>1-844-DASHDIG</a></p>
            <a href="#" onClick={() => setLandingView('enterprise')} className="mt-4 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#1A1A1A] py-2 px-4 rounded-lg inline-block transition border-2 border-[#1A1A1A]">Schedule a demo</a>
          </Card>
          <Card className="bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition duration-200">
            <Building className="w-8 h-8 text-[#FF6B35] mb-4" />
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">ENTERPRISE</h3>
            <p className="text-slate-600 mb-4">Looking for a POC or custom integration?</p>
            <a href="mailto:enterprise@dashdig.com" className="text-[#FF6B35] hover:text-[#1A1A1A] font-medium block">enterprise@dashdig.com</a>
            <a href="#" onClick={() => setLandingView('enterprise')} className="mt-4 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#1A1A1A] py-2 px-4 rounded-lg inline-block transition border-2 border-[#1A1A1A]">Request a pilot program</a>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="max-w-xl mx-auto bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A]">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6 text-center">Send Us a Quick Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                id="name"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Your Email"
                id="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="text-slate-300 text-sm font-medium block mb-1">Subject</label>
              <select
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="message" className="text-slate-300 text-sm font-medium block mb-1">Message</label>
              <textarea
                id="message"
                placeholder="How can we help?"
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg placeholder-slate-500 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                required
              />
            </div>
            {success && (
              <div className="flex items-center space-x-2 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
                <CheckCircle className="w-5 h-5" />
                <span>Message sent successfully! We'll be in touch soon.</span>
              </div>
            )}
            <Button type="submit" loading={loading} fullWidth>
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

// Footer Component
const Footer = ({ setLandingView }) => {
  const FooterLink = ({ children, onClick }) => (
    <button onClick={onClick} className="text-slate-400 hover:text-orange-400 text-sm block mb-2 transition duration-200 text-left">
      {children}
    </button>
  );

  const SocialIcon = ({ icon: Icon, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-orange-500 transition duration-200">
      <Icon className="w-5 h-5" />
    </a>
  );

  return (
    <footer className="bg-[#1A1A1A] pt-16 pb-8 border-t-[3px] border-[#FF6B35]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo variant="dark" showTagline={true} onClick={() => setLandingView('home')} />
            
            {/* Description */}
            <p style={{
              color: '#A0A0A0',
              fontSize: '14px',
              marginBottom: '24px',
              marginTop: '12px'
            }}>
              Making the web more human, one link at a time.
            </p>
            
            {/* Social Media Icons - Exact HTML Mockup Match */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Facebook */}
              <a 
                href="https://facebook.com/dashdig" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link facebook"
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#FF6B35',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  boxShadow: '4px 4px 0px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1877F2';
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0px #000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF6B35';
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #000';
                }}
              >
                <svg style={{ width: '24px', height: '24px', fill: 'white' }} viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* X (Twitter) */}
              <a 
                href="https://x.com/dashdig" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link twitter"
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#FF6B35',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  boxShadow: '4px 4px 0px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0px #000';
                  e.currentTarget.querySelector('svg').style.fill = 'black';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF6B35';
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #000';
                  e.currentTarget.querySelector('svg').style.fill = 'white';
                }}
              >
                <svg style={{ width: '24px', height: '24px', fill: 'white', transition: 'fill 0.2s ease' }} viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/dashdig" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link linkedin"
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#FF6B35',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  boxShadow: '4px 4px 0px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0A66C2';
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0px #000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF6B35';
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #000';
                }}
              >
                <svg style={{ width: '24px', height: '24px', fill: 'white' }} viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              {/* Reddit */}
              <a 
                href="https://reddit.com/r/dashdig" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link reddit"
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#FF6B35',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  boxShadow: '4px 4px 0px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0px #000';
                  e.currentTarget.querySelector('svg').style.fill = '#FF4500';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF6B35';
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #000';
                  e.currentTarget.querySelector('svg').style.fill = 'white';
                }}
              >
                <svg style={{ width: '24px', height: '24px', fill: 'white', transition: 'fill 0.2s ease' }} viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="https://tiktok.com/@dashdig" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link tiktok"
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#FF6B35',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  boxShadow: '4px 4px 0px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0px #000';
                  e.currentTarget.querySelector('svg').style.fill = 'black';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF6B35';
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #000';
                  e.currentTarget.querySelector('svg').style.fill = 'white';
                }}
              >
                <svg style={{ width: '24px', height: '24px', fill: 'white', transition: 'fill 0.2s ease' }} viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 transition-colors duration-200 hover:text-[#FF6B35] cursor-default">PRODUCT</h4>
            <FooterLink onClick={() => setLandingView('home')}>Features</FooterLink>
            <FooterLink onClick={() => setLandingView('pricing')}>Pricing</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>API</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Widget</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Changelog</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Status</FooterLink>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 transition-colors duration-200 hover:text-[#FF6B35] cursor-default">COMPANY</h4>
            <FooterLink onClick={() => setLandingView('home')}>About</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Blog</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Careers</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Press Kit</FooterLink>
            <FooterLink onClick={() => setLandingView('contact')}>Contact</FooterLink>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 transition-colors duration-200 hover:text-[#FF6B35] cursor-default">RESOURCES</h4>
            <FooterLink onClick={() => setLandingView('home')}>Documentation</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Help Center</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Community</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Templates</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Integrations</FooterLink>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 transition-colors duration-200 hover:text-[#FF6B35] cursor-default">LEGAL</h4>
            <FooterLink onClick={() => setLandingView('home')}>Privacy Policy</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Terms of Service</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Cookie Policy</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>GDPR</FooterLink>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-900 pt-6 pb-6 flex flex-col md:flex-row justify-between items-center text-sm">
          {/* BORN IN THE CLOUD badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              backgroundColor: '#FF6B35',
              border: '3px solid #1A1A1A',
              borderRadius: '12px',
              boxShadow: '4px 4px 0 #1A1A1A',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '24px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A';
            }}
          >
            <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cloud shape - puffy with 3 bumps */}
              <path
                d="M26.5 21H6.5C3.5 21 1 18.5 1 15.5C1 13 2.8 10.8 5.2 10.2C5.1 9.8 5 9.4 5 9C5 6.2 7.2 4 10 4C11.1 4 12.1 4.4 12.9 5C14 2.6 16.4 1 19.2 1C23 1 26 4 26 7.8C26 8.2 26 8.5 25.9 8.9C28.3 9.5 30 11.6 30 14.2C30 17.4 27.6 20 24.5 20L26.5 21Z"
                fill="#FDE68A"
                stroke="#1A1A1A"
                strokeWidth="1.5"
              />
              {/* Lightning bolt - centered */}
              <path
                d="M17 7L19 7L17 12L21 12L13 21L15 14L11 14L17 7Z"
                fill="#FFCC33"
                stroke="#1A1A1A"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            
            <span style={{
              color: 'white',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: '700',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              BORN IN THE CLOUD
            </span>
          </div>
          
          {/* Copyright */}
          <p className="text-slate-500">© 2025 Dashdig. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Dashboard Utility Components ---

// Bar Chart for Analytics (Reusable)
const BarChartComponent = ({ data, title, height = 200, isSmall = false }) => {
  const maxClicks = Math.max(...data.map(d => d.clicks));
  const scaleY = (clicks) => (clicks / maxClicks) * 100;
  const showTooltip = (e, clicks) => {
    const tooltip = document.getElementById('chart-tooltip');
    if (tooltip) {
      tooltip.innerHTML = `${clicks.toLocaleString()} Clicks`;
      tooltip.style.left = `${e.clientX + 10}px`;
      tooltip.style.top = `${e.clientY - 30}px`;
      tooltip.style.opacity = 1;
    }
  };
  const hideTooltip = () => {
    const tooltip = document.getElementById('chart-tooltip');
    if (tooltip) tooltip.style.opacity = 0;
  };

  return (
    <Card className="p-4 md:p-6 h-full">
      <h3 className={`font-semibold text-white ${isSmall ? 'text-lg' : 'text-xl'} mb-4`}>{title}</h3>
      <div style={{ height: `${height}px` }} className="flex items-end justify-between space-x-3 w-full">
        {data.map((d, index) => (
          <div
            key={d.day}
            className="flex flex-col items-center w-full group relative h-full justify-end"
            onMouseEnter={(e) => showTooltip(e, d.clicks)}
            onMouseLeave={hideTooltip}
          >
            <div
              className={`w-full bg-orange-600 rounded-t-lg shadow-xl transition duration-300 hover:bg-orange-500 animate-grow-vertical`}
              style={{
                height: `${scaleY(d.clicks)}%`,
                animationDelay: `${index * 100}ms`
              }}
            ></div>
            <span className={`mt-2 text-xs font-medium ${isSmall ? 'text-slate-500' : 'text-slate-400'}`}>
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Custom Sparkline Mini-Chart for StatsCard
const SparklineChart = ({ data, color = '#f97316' }) => {
  // Guard against empty or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <svg width={100} height={30} className="w-16 h-8 opacity-30" />;
  }
  
  // Filter out non-numeric values
  const validData = data.filter(d => typeof d === 'number' && !isNaN(d));
  if (validData.length === 0) {
    return <svg width={100} height={30} className="w-16 h-8 opacity-30" />;
  }
  
  const max = Math.max(...validData);
  const min = Math.min(...validData);
  const range = max - min;
  const width = 100;
  const height = 30;
  
  const points = validData.map((d, i) => {
    const x = validData.length === 1 ? width / 2 : (i / (validData.length - 1)) * width;
    // Avoid division by zero when all values are the same
    const y = range === 0 ? height / 2 : height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-16 h-8 opacity-70">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

// Trend Icon component
const TrendIcon = ({ change }) => {
  const isUp = change >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  const color = isUp ? 'text-green-400' : 'text-red-400';
  const arrowColor = isUp ? 'fill-green-400' : 'fill-red-400';

  return (
    <div className={`flex items-center space-x-1 ${color}`}>
      <Icon className={`w-4 h-4 ${arrowColor}`} />
      <span className="text-sm font-semibold">{Math.abs(change).toFixed(1)}%</span>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, change, Icon, sparklineData }) => {
  const [ref, inView] = useInView({ threshold: 0.5 });
  // Use useMemo for complex components or calculations
  const deferredValue = useDeferredValue(value);

  return (
    <div 
      ref={ref} 
      className={`p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:bg-[#242424] transition-all duration-300 space-y-4 ${inView ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#A0A0A0] font-medium uppercase tracking-wide">{title}</p>
        <Icon className="w-6 h-6 text-[#FF6B35]" />
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-black text-white">
          <CountUp end={deferredValue} />
        </div>
        <TrendIcon change={change} />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-[#2A2A2A]">
        <p className="text-xs text-[#A0A0A0]">vs. previous period</p>
        {sparklineData && <SparklineChart data={sparklineData} />}
      </div>
    </div>
  );
};


// Donut Chart for Analytics
const DonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const colorMap = {
    Direct: 'text-orange-600',
    Social: 'text-sky-500',
    Email: 'text-green-500',
    Referral: 'text-purple-500',
    Other: 'text-slate-500',
  };

  const segmentStyles = useMemo(() => {
    let currentCumulative = 0;
    return data.map((item) => {
      const percentage = item.value / total;
      const dasharray = percentage * circumference;
      const dashoffset = -currentCumulative * circumference;
      currentCumulative += percentage;
      return {
        strokeDasharray: `${dasharray} ${circumference - dasharray}`,
        strokeDashoffset: dashoffset,
        stroke: colorMap[item.name].replace('text-', 'stroke-').replace('-600', '-500'), // Use a utility to map to stroke color
        strokeWidth: 10,
      };
    });
  }, [data, total, circumference, colorMap]);

  return (
    <div className="flex flex-col items-center">
      <svg width="150" height="150" viewBox="0 0 150 150" className="rotate-[-90deg]">
        <circle cx="75" cy="75" r={radius} fill="transparent" stroke="#1e293b" strokeWidth="10" />
        {segmentStyles.map((style, index) => (
          <circle key={index} cx="75" cy="75" r={radius} fill="transparent" {...style} className="transition-all duration-500 ease-out" />
        ))}
        <text x="75" y="75" textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold text-white fill-white rotate-[90deg] translate-x-1/2 translate-y-1/2">100%</text>
      </svg>
      <div className="mt-6 space-y-2 w-full">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm text-slate-300">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${colorMap[item.name].replace('text-', 'bg-')}`}></div>
              <span>{item.name}</span>
            </div>
            <span className="font-semibold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Dashboard Views ---

const DashboardOverview = ({ links, analytics }) => {
  const deferredLinks = useDeferredValue(links);
  const deferredAnalytics = useDeferredValue(analytics);
  const loading = !deferredLinks || !deferredAnalytics || !deferredAnalytics.stats || !deferredAnalytics.stats.sparklines;

  if (loading) return <SkeletonCard count={4} />;

  const activeLinks = deferredLinks.filter(l => l.status === 'ACTIVE').length;
  const totalLinks = deferredLinks.length;
  const latestLink = deferredLinks.sort((a, b) => new Date(b.created) - new Date(a.created))[0];

  const LightningIcon = (props) => <LightningBolt size="md" {...props} />;
  
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard title="Total URLs" value={totalLinks} change={totalLinks > 0 ? 12.5 : 0} Icon={LightningIcon} sparklineData={[20, 22, 25, 24, 26, 28, 30]} />
        <StatsCard title="Total Clicks" value={deferredAnalytics.stats.totalClicks} change={deferredAnalytics.stats.totalClicksChange} Icon={BarChart} sparklineData={deferredAnalytics.stats.sparklines.clicks} />
        <StatsCard title="Active URLs" value={activeLinks} change={totalLinks > 0 ? ((activeLinks / totalLinks) * 100 - 80) : 0} Icon={LinkIcon} sparklineData={deferredAnalytics.stats.sparklines.activeLinks} />
        <StatsCard title="Conversion Rate" value={deferredAnalytics.stats.avgClickRate} change={deferredAnalytics.stats.avgClickRateChange} Icon={Target} sparklineData={deferredAnalytics.stats.sparklines.clickRate} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChartComponent data={deferredAnalytics.chartData} title="Clicks Last 7 Days" height={300} />
        </div>
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Top Performing Link</h3>
          <div className="space-y-4">
            <p className="text-[#FF6B35] font-bold text-2xl">{latestLink?.title || 'N/A'}</p>
            <p className="text-[#A0A0A0]">{latestLink ? `dashdig.com/${latestLink.shortUrl}` : 'No links created'}</p>
            <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
              <span className="text-[#A0A0A0]">Clicks:</span>
              <span className="font-bold text-white text-lg">{latestLink?.clicks.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#A0A0A0]">Trend:</span>
              {latestLink ? <TrendIcon change={latestLink.trend} /> : <span className='text-[#A0A0A0]'>N/A</span>}
            </div>
            <Button variant="secondary" fullWidth className="mt-4">
              View Analytics
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            'User John Doe updated "Summer Campaign"',
            'New link created: "Partnership Program"',
            'Link "Holiday Promo" archived',
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 text-[#A0A0A0] text-sm">
              <Clock className="w-4 h-4 text-[#A0A0A0]" />
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Table Row Component with Copy Button and Actions
const TableRow = ({ link, index, showToast, onOpenDetail }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    copyToClipboard(`dashdig.com/${link.shortUrl}`, showToast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr
      className="border-b border-[#2A2A2A] hover:bg-[#242424] transition-colors duration-150 cursor-pointer animate-slide-in"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onOpenDetail(link)}
    >
      {/* Short URL with Copy Button */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm font-semibold text-white mb-1">{link.title}</div>
            <div className="text-xs text-[#FF6B35] font-mono">dashdig.com/{link.shortUrl}</div>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 text-[#A0A0A0] hover:text-[#FF6B35] hover:bg-[#242424] rounded-lg transition-colors duration-150"
            title="Copy URL"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>

      {/* Original URL */}
      <td className="px-6 py-4 hidden lg:table-cell">
        <p className="text-sm text-[#A0A0A0] truncate max-w-md">{link.originalUrl}</p>
      </td>

      {/* Clicks */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{link.clicks.toLocaleString()}</span>
          <TrendIcon change={link.trend} />
        </div>
      </td>

      {/* Created */}
      <td className="px-6 py-4 hidden md:table-cell">
        <span className="text-sm text-[#A0A0A0]">{link.created}</span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onOpenDetail(link)}
            className="p-2 text-[#A0A0A0] hover:text-[#FF6B35] hover:bg-[#242424] rounded-lg transition-colors duration-150"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-[#A0A0A0] hover:text-[#FF6B35] hover:bg-[#242424] rounded-lg transition-colors duration-150"
            title="Generate QR Code"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-[#A0A0A0] hover:text-red-400 hover:bg-[#242424] rounded-lg transition-colors duration-150"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Links Table Component
const LinksTable = ({ links, onOpenDetail, onOpenCreateModal, showToast }) => {
  const [selected, setSelected] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All Links');
  const [sortField, setSortField] = useState('Newest');
  const [searchTerm, setSearchTerm] = useState('');

  const deferredLinks = useDeferredValue(links);

  // Debounced search term for performance
  const debouncedSearchTerm = useDeferredValue(searchTerm);

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected(deferredLinks.filter(l => l.status === 'ACTIVE').map(l => l.id));
    } else {
      setSelected([]);
    }
  };

  const toggleLink = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Memoize filtering and sorting
  const filteredLinks = useMemo(() => {
    let result = deferredLinks;

    // 1. Filtering
    result = result.filter(link => {
      if (filterStatus === 'Active' && link.status !== 'ACTIVE') return false;
      if (filterStatus === 'Archived' && link.status !== 'ARCHIVED') return false;
      if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        if (!link.title.toLowerCase().includes(term) && !link.shortUrl.toLowerCase().includes(term)) return false;
      }
      return true;
    });

    // 2. Sorting (In-memory sort to avoid index issues with mock data)
    result.sort((a, b) => {
      if (sortField === 'Newest') return new Date(b.created) - new Date(a.created);
      if (sortField === 'Oldest') return new Date(a.created) - new Date(b.created);
      if (sortField === 'Most Clicks') return b.clicks - a.clicks;
      if (sortField === 'Alphabetical') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [deferredLinks, filterStatus, debouncedSearchTerm, sortField]);


  const getStatusBadge = (status) => {
    const color = status === 'ACTIVE' ? 'bg-green-600' : 'bg-slate-500';
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${color}`}>
        {status}
      </span>
    );
  };

  const ActionsDropdown = ({ link }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative inline-block text-left">
        <Button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} variant="ghost" className="p-1">
          <MenuIcon className="w-5 h-5 text-[#A0A0A0]" />
        </Button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#242424] rounded-lg shadow-xl z-10 py-1 text-sm border border-[#2A2A2A]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(`dashdig.com/${link.shortUrl}`, showToast);
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white w-full text-left transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" /> Copy URL
            </button>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); onOpenDetail(link); }} className="flex items-center px-4 py-2 text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white w-full text-left transition-colors">
              <Edit2 className="w-4 h-4 mr-2" /> Edit Link
            </button>
            <button onClick={(e) => e.stopPropagation()} className="flex items-center px-4 py-2 text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white w-full text-left transition-colors">
              <Archive className="w-4 h-4 mr-2" /> {link.status === 'ACTIVE' ? 'Archive' : 'Activate'}
            </button>
            <button onClick={(e) => e.stopPropagation()} className="flex items-center px-4 py-2 text-red-400 hover:bg-red-900/30 w-full text-left transition-colors">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  if (deferredLinks.length === 0) {
    return (
      <EmptyState
        title="No links yet"
        message="Create your first shortened URL and start tracking performance."
        buttonText="+ Create Link"
        onActionClick={onOpenCreateModal}
      />
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2A2A]">
        <Input
          placeholder="Search links..."
          icon={Search}
          className="w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <Dropdown
            title={filterStatus}
            options={['All Links', 'Active', 'Archived']}
            onSelect={setFilterStatus}
            icon={Filter}
          />
          <Dropdown
            title={sortField}
            options={['Newest', 'Oldest', 'Most Clicks', 'Alphabetical']}
            onSelect={setSortField}
            icon={SortDesc}
          />
          <Button onClick={onOpenCreateModal} icon={Plus} className="text-sm px-3 py-2">
            New Link
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#242424]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#A0A0A0] uppercase tracking-wide">Short URL</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#A0A0A0] uppercase tracking-wide hidden lg:table-cell">Original URL</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#A0A0A0] uppercase tracking-wide">Clicks</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#A0A0A0] uppercase tracking-wide hidden md:table-cell">Created</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-[#A0A0A0] uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#1A1A1A]">
            {filteredLinks.map((link, index) => (
              <TableRow key={link.id} link={link} index={index} showToast={showToast} onOpenDetail={onOpenDetail} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 md:p-6 flex items-center justify-between border-t border-[#2A2A2A]">
        <p className="text-sm text-[#A0A0A0]">Showing 1-{Math.min(5, filteredLinks.length)} of {filteredLinks.length} links</p>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" className="px-3 py-1.5" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {[1, 2, 3].map(page => (
            <button key={page} className={`w-8 h-8 rounded-full text-sm font-medium transition duration-150 ${page === 1 ? 'bg-[#FF6B35] text-white' : 'text-[#A0A0A0] hover:bg-[#242424]'}`}>
              {page}
            </button>
          ))}
          <Button variant="secondary" className="px-3 py-1.5">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Dropdown utility component
const Dropdown = ({ title, options, onSelect, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button onClick={() => setIsOpen(!isOpen)} variant="secondary" className="px-3 py-2 text-sm">
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {title}
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#242424] rounded-lg shadow-xl z-20 py-1 text-sm border border-[#2A2A2A]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white w-full text-left transition duration-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ title, message, buttonText, onActionClick }) => (
  <Card className="flex flex-col items-center justify-center p-12 text-center">
    <div className="mb-4">
      <LightningBolt size="lg" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-[#A0A0A0] mb-6">{message}</p>
    <Button onClick={onActionClick} icon={Plus}>
      {buttonText}
    </Button>
  </Card>
);

// Link Detail Modal Placeholder
const LinkDetailModal = ({ isOpen, onClose, link }) => (
  <Modal title="Link Details (Coming Soon)" isOpen={isOpen} onClose={onClose} className="max-w-3xl">
    <div className="space-y-4">
      <p className="text-slate-300">Detailed analytics, editing, and QR code customization for **{link?.title || 'this link'}** will appear here.</p>
      <div className="p-4 bg-slate-800 rounded-lg">
        <p className="font-mono text-orange-400">Short URL: dashdig.com/{link?.shortUrl}</p>
        <p className="text-sm text-slate-500 truncate">Original: {link?.originalUrl}</p>
      </div>
      <Button fullWidth onClick={onClose}>Close</Button>
    </div>
  </Modal>
);

const LinksManagement = ({ onOpenCreateModal, links, showToast }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  const handleOpenDetail = (link) => {
    setSelectedLink(link);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">My Links</h2>
      </div>
      <LinksTable
        links={links}
        onOpenDetail={handleOpenDetail}
        onOpenCreateModal={onOpenCreateModal}
        showToast={showToast}
      />
      <LinkDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        link={selectedLink}
      />
    </div>
  );
};

// Analytics View Component
const AnalyticsView = ({ analytics }) => {
  const deferredAnalytics = useDeferredValue(analytics);
  const loading = !deferredAnalytics || !deferredAnalytics.stats;

  if (loading) return <SkeletonCard count={4} />;

  const { stats, chartData, trafficSources, topReferrers, topLinks } = deferredAnalytics;

  const AreaChartComponent = ({ data, title, height = 300 }) => {
    const maxClicks = Math.max(...data.map(d => d.clicks));
    const width = 1000;
    const chartHeight = height - 50;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = chartHeight - (d.clicks / maxClicks) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    const gradientId = "area-gradient";

    return (
      <Card className="p-4 md:p-6">
        <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polyline
            fill={`url(#${gradientId})`}
            points={`0,${chartHeight} ${points} ${width},${chartHeight}`}
          />
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            points={points}
          />
          {/* X-Axis labels (simplified) */}
          <text x="0" y={height - 5} className="text-xs fill-slate-500">Day 1</text>
          <text x={width - 40} y={height - 5} className="text-xs fill-slate-500">Day 30</text>
        </svg>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>

      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Dropdown
          title="Last 30 Days"
          options={['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom']}
          onSelect={() => { }}
          icon={Clock}
        />
        <div className="flex items-center space-x-4">
          <ToggleSwitch label="Compare to previous period" checked={false} onChange={() => { }} />
          <Button variant="secondary" icon={Download} className="text-sm">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard title="Total Clicks" value={stats.totalClicks} change={stats.totalClicksChange} Icon={Zap} sparklineData={stats.sparklines.clicks} />
        <StatsCard title="Unique Visitors" value={stats.uniqueVisitors} change={stats.uniqueVisitorsChange} Icon={User} sparklineData={stats.sparklines.visitors} />
        <StatsCard title="Avg. Click Rate" value={stats.avgClickRate} change={stats.avgClickRateChange} Icon={Target} sparklineData={stats.sparklines.clickRate} />
        <Card className="flex flex-col justify-center">
          <p className="text-slate-400 font-medium mb-1">Top Link</p>
          <p className="text-lg font-bold text-white">{stats.topLink.name}</p>
          <p className="text-sm text-orange-400 mt-1">{stats.topLink.clicks.toLocaleString()} clicks</p>
        </Card>
      </div>

      {/* Main Chart */}
      <AreaChartComponent data={chartData} title="Clicks Over Time" />

      {/* Traffic Sources & Top Referrers (Two Column) */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Traffic Sources</h3>
          <DonutChart
            data={trafficSources}
          />
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Top Referrers</h3>
          <div className="space-y-4">
            {topReferrers.map((ref, index) => {
              const maxClicks = topReferrers[0].clicks;
              const percent = (ref.clicks / maxClicks) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between items-center text-sm text-slate-300 mb-1">
                    <span>{ref.name}</span>
                    <span className="font-semibold">{ref.clicks.toLocaleString()} clicks</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-orange-600" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Geo & Devices (Two Column) */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Geographic Distribution</h3>
          <div className="space-y-3">
            {[
              { country: '🇺🇸 United States', clicks: 5234, percent: 42 },
              { country: '🇬🇧 United Kingdom', clicks: 2156, percent: 17 },
              { country: '🇩🇪 Germany', clicks: 1543, percent: 12 },
              { country: '🇨🇦 Canada', clicks: 1234, percent: 10 },
              { country: '🇦🇺 Australia', clicks: 987, percent: 8 },
            ].map((geo, index) => (
              <div key={index} className="flex justify-between items-center text-sm text-slate-300">
                <span>{geo.country}</span>
                <div className="flex space-x-4">
                  <span className="font-mono text-slate-400">{geo.clicks.toLocaleString()}</span>
                  <span className="font-semibold text-white w-8 text-right">{geo.percent}%</span>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="mt-4 text-sm font-medium text-orange-400 hover:text-orange-300 block">View all countries</a>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Devices & Browsers</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-300 mb-2">Devices</h4>
              {[
                { type: 'Desktop', percent: 62, Icon: Monitor, color: 'sky-500' },
                { type: 'Mobile', percent: 34, Icon: Smartphone, color: 'orange-500' },
                { type: 'Tablet', percent: 4, Icon: Tablet, color: 'purple-500' },
              ].map((device, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center text-sm text-slate-300 mb-1">
                    <div className="flex items-center space-x-2">
                      <device.Icon className={`w-4 h-4 text-${device.color}`} />
                      <span>{device.type}</span>
                    </div>
                    <span className="font-semibold">{device.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-${device.color}`} style={{ width: `${device.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-300 mb-2">Browsers</h4>
              {[
                { type: 'Chrome', percent: 58 },
                { type: 'Safari', percent: 24 },
                { type: 'Firefox', percent: 12 },
                { type: 'Other', percent: 6 },
              ].map((browser, index) => (
                <div key={index} className="flex justify-between items-center text-sm text-slate-300">
                  <span>{browser.type}</span>
                  <span className="font-semibold">{browser.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performing Links Table */}
      <Card>
        <h3 className="text-xl font-semibold text-white mb-6">Top Performing Links</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Link Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Short URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">CTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {topLinks.map((link, index) => (
                <tr key={index} className="hover:bg-slate-800/50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{link.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-400 font-mono">dashdig.com/{link.shortUrl}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{link.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{link.ctr}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    <TrendIcon change={link.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center">
          <Button variant="secondary" className="px-6 py-2">
            View all links
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Widgets View Component
const WidgetsView = () => {
  const [currentTab, setCurrentTab] = useState('JavaScript');
  const [widgetConfig, setWidgetConfig] = useState({
    theme: 'dark',
    position: 'bottom-right',
    buttonColor: '#f97316',
    autoOpen: false,
    apiKey: 'YOUR_API_KEY_XXXXXXXXXXXX'
  });

  const updateConfig = (key, value) => {
    setWidgetConfig(prev => ({ ...prev, [key]: value }));
  };

  const getCodeSnippet = () => {
    const { apiKey, theme, position } = widgetConfig;
    const configString = `{\n  apiKey: '${apiKey}',\n  theme: '${theme}',\n  position: '${position}'\n}`;

    switch (currentTab) {
      case 'JavaScript':
        return `
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js"></script>
<script>
  DashDig.init(${configString.replace(/\n/g, '\n  ')});
</script>
        `.trim();
      case 'React':
        return `
npm install @dashdig/react

import { DashDigWidget } from '@dashdig/react';

function App() {
  return <DashDigWidget
    apiKey="${apiKey}"
    theme="${theme}"
    position="${position}"
  />;
}
        `.trim();
      case 'Vue':
        return `
npm install @dashdig/vue

<template>
  <DashDigWidget api-key="${apiKey}" theme="${theme}" position="${position}" />
</template>
        `.trim();
      case 'Angular':
        return `
npm install @dashdig/angular

// In your component template:
<dashdig-widget
  [apiKey]="'${apiKey}'"
  [theme]="'${theme}'"
  [position]="'${position}'"
></dashdig-widget>
        `.trim();
      case 'WordPress':
        return `
Installation Steps:
1. Install "Dashdig URL Shortener" from WordPress.org plugins.
2. Go to Settings → Dashdig.
3. Enter your API key: ${apiKey}
4. Save changes.
(Widget automatically appears on all pages after setup.)
        `.trim();
      default:
        return '// Select a framework to view installation code';
    }
  };

  const CodeBlock = ({ children, language = 'javascript' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      copyToClipboard(children.trim(), () => alert('Copied!')); // Use simple alert here
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative bg-slate-800 rounded-lg p-4 text-sm font-mono shadow-inner border border-slate-700">
        <pre className="overflow-x-auto text-slate-300">
          <code className={`language-${language}`}>{children.trim()}</code>
        </pre>
        <Button onClick={handleCopy} variant="secondary" className="absolute top-2 right-2 px-3 py-1 text-xs">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    );
  };

  const WidgetPreview = () => (
    <div className="relative w-full h-96 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden p-4">
      <p className="text-slate-500 text-sm mb-4">Live Preview of the Widget (Bottom-Right Corner)</p>
      <div className={`absolute right-4 ${widgetConfig.position.includes('bottom') ? 'bottom-4' : 'top-4'} ${widgetConfig.position.includes('right') ? 'right-4' : 'left-4'}`}>
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition duration-300 transform hover:scale-105`}
          style={{ backgroundColor: widgetConfig.buttonColor }}
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Widget Integration</h2>
      <p className="text-slate-400">Add Dashdig to your website or app in minutes.</p>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800">
        {['JavaScript', 'React', 'Vue', 'Angular', 'WordPress'].map(tab => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`px-4 py-2 font-medium transition duration-200 ${currentTab === tab
              ? 'border-b-2 border-orange-600 text-orange-400'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Code & Configuration */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Installation</h3>
            <CodeBlock>{getCodeSnippet()}</CodeBlock>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Configuration Options</h3>
            <ToggleSwitch
              label="Theme: Dark / Light"
              checked={widgetConfig.theme === 'dark'}
              onChange={() => updateConfig('theme', widgetConfig.theme === 'dark' ? 'light' : 'dark')}
            />
            <div className="space-y-1">
              <label className="text-slate-300 text-sm font-medium">Position</label>
              <select
                value={widgetConfig.position}
                onChange={(e) => updateConfig('position', e.target.value)}
                className="block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-slate-300 text-sm font-medium">Button Color</label>
              <input
                type="color"
                value={widgetConfig.buttonColor}
                onChange={(e) => updateConfig('buttonColor', e.target.value)}
                className="w-8 h-8 rounded-full border-none cursor-pointer"
              />
            </div>
            <ToggleSwitch
              label="Auto-open on page load"
              checked={widgetConfig.autoOpen}
              onChange={() => updateConfig('autoOpen', !widgetConfig.autoOpen)}
            />
          </Card>
        </div>

        {/* Right Column: Live Preview & API Key */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-semibold text-white mb-4">Live Preview</h3>
            <WidgetPreview />
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-white mb-4">API Key</h3>
            <div className="space-y-3">
              <Input
                label="Your API Key"
                value={widgetConfig.apiKey}
                readOnly
                suffix={<Button variant="secondary" className="px-2 py-0.5 text-xs">Copy</Button>}
              />
              <div className="flex justify-between items-center text-sm">
                <Button variant="danger" className="px-3 py-1 text-xs">Regenerate Key</Button>
                <a href="#" className="text-orange-400 hover:text-orange-300">Need help?</a>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <div className="pt-6 border-t border-slate-800 text-center space-y-3">
        <p className="text-slate-400">Need advanced integration help or have questions?</p>
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-orange-400 hover:text-orange-300 font-medium flex items-center">
            <Code className="w-4 h-4 mr-1" /> Documentation
          </a>
          <a href="mailto:support@dashdig.com" className="text-orange-400 hover:text-orange-300 font-medium flex items-center">
            <Mail className="w-4 h-4 mr-1" /> Support Email
          </a>
        </div>
      </div>
    </div>
  );
};

// Settings View Component
const SettingsView = ({ currentUser, updateUser, showToast }) => {
  const { data: session } = useSession();
  const [currentSettingTab, setCurrentSettingTab] = useState('Profile');
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser.name || '',
    email: currentUser.email || '',
    company: 'Dashdig Inc.',
    jobTitle: 'Software Engineer',
    timezone: 'EST'
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Check if user signed in with OAuth (Google, etc.)
  const isOAuthUser = session?.user?.image != null; // OAuth users typically have an image

  const teamMembers = [
    { name: 'Demo User', email: 'demo@example.com', role: 'Admin', initials: 'DU' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Member', initials: 'JS' },
  ];
  const pendingInvites = [
    { email: 'newhire@example.com', role: 'Member', sent: '2025-11-20' },
  ];
  const invoices = [
    { date: '2025-10-27', desc: 'Pro Plan Subscription', amount: 29.00, status: 'Paid', invoice: '#' },
    { date: '2025-09-27', desc: 'Pro Plan Subscription', amount: 29.00, status: 'Paid', invoice: '#' },
    { date: '2025-08-27', desc: 'Pro Plan Subscription', amount: 29.00, status: 'Paid', invoice: '#' },
    { date: '2025-07-27', desc: 'Pro Plan Subscription', amount: 29.00, status: 'Paid', invoice: '#' },
    { date: '2025-06-27', desc: 'Pro Plan Subscription', amount: 29.00, status: 'Paid', invoice: '#' },
  ];

  // getPasswordStrength is now defined globally at the top of the file

  const InviteMemberModal = ({ isOpen, onClose }) => {
    const [inviteForm, setInviteForm] = useState({ email: '', role: 'Member' });
    const [loading, setLoading] = useState(false);

    const handleSendInvite = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onClose();
        showToast('Invitation sent successfully!', 'success');
      }, 1000);
    };

    return (
      <Modal title="Invite Team Member" isOpen={isOpen} onClose={onClose}>
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="new.member@company.com"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
          />
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-1">Role</label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              className="block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-200"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <Button onClick={handleSendInvite} loading={loading} fullWidth>
            Send Invitation
          </Button>
        </div>
      </Modal>
    );
  };

  const DeleteAccountModal = ({ isOpen, onClose }) => {
    const [confirmText, setConfirmText] = useState('');
    const handleDelete = () => {
      if (confirmText === 'DELETE') {
        onClose();
        showToast('Account deletion initiated. Goodbye!', 'info');
        updateUser(null); // Simulate logout/deletion
      } else {
        showToast('Please type DELETE exactly to confirm.', 'error');
      }
    };

    return (
      <Modal title="Confirm Account Deletion" isOpen={isOpen} onClose={onClose}>
        <div className="space-y-4">
          <p className="text-red-400">
            <AlertTriangle className="w-5 h-5 inline mr-2" />
            Are you sure you want to delete your account? This action is irreversible. All your links, analytics, and data will be permanently lost.
          </p>
          <p className="text-slate-400">Please type "DELETE" to confirm.</p>
          <Input placeholder="Type DELETE" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
          <Button variant="danger" fullWidth onClick={handleDelete} disabled={confirmText !== 'DELETE'}>
            Confirm Deletion
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    );
  };

  const handleProfileSave = () => {
    updateUser({
      name: profileForm.fullName,
      email: profileForm.email,
      initials: profileForm.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || currentUser.initials,
      plan: currentUser.plan,
    });
    showToast('Profile saved successfully!', 'success');
  };

  const handlePasswordUpdate = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    // Mock update
    setPasswordForm({ current: '', new: '', confirm: '' });
    showToast('Password updated successfully!', 'success');
  };


  const ProfileTab = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">Public Profile</h3>
      <Card className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar 
            name={currentUser.name} 
            size="lg"
            showImage={false}
          />
          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="px-3 py-1">Change Avatar</Button>
            <p className="text-xs text-slate-500">Branded avatar with your initials</p>
          </div>
        </div>
        <Input
          label="Full Name"
          value={profileForm.fullName}
          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
        />
        <Input
          label="Email Address"
          type="email"
          value={profileForm.email}
          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
          suffix={<span className="text-green-400 flex items-center">Verified <Check className="w-4 h-4 ml-1" /></span>}
          readOnly // Assuming email is generally read-only after verification
        />
        <Input
          label="Company / Organization (Optional)"
          value={profileForm.company}
          onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
        />
        <Input
          label="Job Title (Optional)"
          value={profileForm.jobTitle}
          onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
        />
        <div className="w-full">
          <label className="text-slate-300 text-sm font-medium block mb-1">Timezone</label>
          <select
            value={profileForm.timezone}
            onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
            className="block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-200"
          >
            <option value="EST">(UTC-05:00) Eastern Time (US & Canada)</option>
            <option value="PST">(UTC-08:00) Pacific Time (US & Canada)</option>
          </select>
        </div>
        <Button onClick={handleProfileSave}>Save Changes</Button>
      </Card>
    </div>
  );

  const AccountTab = () => {
    const strength = getPasswordStrength(passwordForm.new);
    return (
      <div className="space-y-8">
        <h3 className="text-2xl font-semibold text-white">Account Security</h3>

        {/* Password Change Section - Only show for non-OAuth users */}
        {!isOAuthUser ? (
          <Card className="space-y-6">
            <h4 className="text-xl font-medium text-white">Change Password</h4>
            <Input label="Current Password" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
            <Input label="New Password" type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} />
            <div className='space-y-1'>
              <Input label="Confirm New Password" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
              <div className="flex items-center space-x-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-300`} style={{ width: strength.width, backgroundColor: strength.color === 'text-red-400' ? '#f87171' : strength.color === 'text-yellow-400' ? '#facc15' : '#4ade80' }}></div>
                </div>
                <span className={`text-xs font-medium ${strength.color}`}>{strength.strength}</span>
              </div>
            </div>
            <Button onClick={handlePasswordUpdate}>Update Password</Button>
          </Card>
        ) : (
          <Card className="space-y-4">
            <h4 className="text-xl font-medium text-white">Password</h4>
            <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="w-10 h-10 flex items-center justify-center bg-orange-600/20 rounded-full">
                <Lock className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-slate-300 font-medium mb-1">You signed in with Google</p>
                <p className="text-sm text-slate-400">
                  Password management is handled by your Google account. You don't need to set a password for Dashdig.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="space-y-4">
          <h4 className="text-xl font-medium text-white">Connected Accounts</h4>
          {[
            { name: 'Google', Icon: Loader, connected: true, buttonText: 'Disconnect' },
            { name: 'Apple', Icon: Loader, connected: false, buttonText: 'Connect' },
            { name: 'Facebook', Icon: Loader, connected: false, buttonText: 'Connect' }
          ].map((acc, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${acc.connected ? 'bg-green-600' : 'bg-slate-700'}`}>
                  {/* Real logos would go here */}
                  <span className='text-sm text-white'>{acc.name.charAt(0)}</span>
                </div>
                <span className="text-slate-300">{acc.name}</span>
              </div>
              <Button variant={acc.connected ? 'danger' : 'secondary'} className="px-3 py-1 text-sm">
                {acc.buttonText}
              </Button>
            </div>
          ))}
        </Card>

        <Card className="border border-red-500/50 bg-red-900/10 p-6 space-y-4">
          <h4 className="text-xl font-medium text-red-400">Danger Zone</h4>
          <p className="text-sm text-red-300">Permanently delete your Dashdig account and all associated data.</p>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            Delete Account
          </Button>
        </Card>
        <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      </div>
    );
  };

  const BillingTab = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">Billing & Payments</h3>

      <Card className="space-y-4">
        <h4 className="text-xl font-medium text-white">Current Plan</h4>
        <div className="p-4 bg-slate-800/50 rounded-lg space-y-2 border border-slate-700">
          <p className="text-3xl font-bold text-orange-400">{currentUser.plan} Plan</p>
          <p className="text-xl text-white font-medium">${currentUser.plan === 'Pro' ? 29 : 0}/month</p>
          <p className="text-sm text-slate-400">Next billing date: December 27, 2025</p>
          <div className="pt-3 flex space-x-4">
            <Button className="px-3 py-1.5 text-sm">Change Plan</Button>
            <a href="#" className="text-sm text-red-400 hover:text-red-300 self-center">Cancel Subscription</a>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h4 className="text-xl font-medium text-white">Payment Method</h4>
        <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3 text-slate-300">
            <CreditCard className="w-6 h-6 text-orange-400" />
            <div>
              <p>Visa ending in 4242</p>
              <p className="text-xs text-slate-500">Expires: 12/26</p>
            </div>
          </div>
          <Button variant="secondary" className="px-3 py-1 text-sm">Update</Button>
        </div>
      </Card>

      <Card>
        <h4 className="text-xl font-medium text-white mb-4">Billing History</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {invoices.map((inv, index) => (
                <tr key={index} className="hover:bg-slate-800/50 transition duration-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{inv.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{inv.desc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white font-medium">${inv.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-900/50 text-green-400">Paid</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href={inv.invoice} className="text-orange-400 hover:text-orange-300">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const TeamTab = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">Team Management</h3>
      {currentUser.plan !== 'Pro' ? (
        <Card className="text-center p-8 space-y-4">
          <Building className="w-10 h-10 text-orange-500 mx-auto" />
          <h4 className="text-xl font-medium text-white">Team collaboration requires Pro or Enterprise.</h4>
          <p className="text-slate-400">Upgrade your plan to invite team members and collaborate on links.</p>
          <Button className="px-6 py-2">Upgrade Now</Button>
        </Card>
      ) : (
        <>
          <p className="text-slate-400">Manage who has access to your Dashdig workspace.</p>
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-medium text-white">Team Members ({teamMembers.length})</h4>
              <Button onClick={() => setIsInviteModalOpen(true)} icon={Plus}>
                Invite Team Member
              </Button>
            </div>
            <div className="divide-y divide-slate-800">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex justify-between items-center py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-full text-white font-bold text-sm">{member.initials}</div>
                    <div>
                      <p className="font-medium text-white">{member.name} {member.name === currentUser.name && <span className="text-xs text-orange-400">(You)</span>}</p>
                      <p className="text-sm text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${member.role === 'Admin' ? 'bg-orange-900/50 text-orange-400' : 'bg-slate-700 text-slate-300'}`}>{member.role}</span>
                    {member.name !== currentUser.name && (
                      <Button variant="danger" className="p-1.5 text-xs">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="text-xl font-medium text-white mb-4">Pending Invites ({pendingInvites.length})</h4>
            <div className="divide-y divide-slate-800">
              {pendingInvites.map((invite, index) => (
                <div key={index} className="flex justify-between items-center py-3 text-sm text-slate-300">
                  <div className="space-y-0.5">
                    <p>{invite.email}</p>
                    <p className="text-xs text-slate-500">Role: {invite.role} | Sent: {invite.sent}</p>
                  </div>
                  <Button variant="ghost" className="p-1.5 text-xs text-red-400 hover:bg-red-900/50">
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              ))}
            </div>
          </Card>
          <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
        </>
      )}
    </div>
  );

  const APITab = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">API Management</h3>

      <Card className="space-y-6">
        <h4 className="text-xl font-medium text-white">API Keys</h4>
        {[
          { name: 'Production Key', key: 'dk_live_xxxxxxxxxxxx', created: '2025-01-01', lastUsed: 'Just now' },
          { name: 'Test Key', key: 'dk_test_xxxxxxxxxxxx', created: '2025-06-15', lastUsed: '2 days ago' },
        ].map((keyItem, index) => (
          <div key={index} className="space-y-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm font-medium text-slate-300">{keyItem.name}</p>
            <div className="flex justify-between items-center">
              <p className="font-mono text-white break-all">{showApiKey ? keyItem.key : keyItem.key.substring(0, 9) + '************'}</p>
              <Button variant="secondary" className="px-2 py-1 text-xs ml-4" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? 'Hide' : 'Show'}
              </Button>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800">
              <span>Created: {keyItem.created}</span>
              <span>Last Used: {keyItem.lastUsed}</span>
              <Button variant="danger" className="px-2 py-1 text-xs">Regenerate</Button>
            </div>
          </div>
        ))}
        <Button icon={Plus} className="px-4 py-2 text-sm">Create New Key</Button>
      </Card>

      <Card className="space-y-4">
        <h4 className="text-xl font-medium text-white">API Usage</h4>
        <p className="text-slate-400">Current plan limit: 10,000 calls/month</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>API calls this month: 1,234</span>
            <span>12% Used</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div className="h-3 rounded-full bg-orange-600" style={{ width: `12.34%` }}></div>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h4 className="text-xl font-medium text-white">Webhooks</h4>
        <Input label="Webhook Endpoint URL" placeholder="https://yourdomain.com/dashdig-hook" />
        <p className="text-slate-400 font-medium pt-2">Events to Subscribe</p>
        <div className="grid md:grid-cols-2 gap-3">
          {['link.created', 'link.clicked', 'link.deleted', 'domain.added'].map(event => (
            <ToggleSwitch key={event} label={event} checked={true} onChange={() => { }} />
          ))}
        </div>
        <Button onClick={() => console.log('Saving Webhook')}>Save Webhook</Button>
      </Card>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">Notification Preferences</h3>

      <Card className="space-y-6">
        <h4 className="text-xl font-medium text-white">Email Notifications</h4>
        <div className="space-y-4 pt-2">
          <ToggleSwitch label="Weekly analytics report" checked={true} onChange={() => { }} />
          <ToggleSwitch label="Link milestone alerts (100, 1000, 10000 clicks)" checked={true} onChange={() => { }} />
          <ToggleSwitch label="Team activity summaries" checked={false} onChange={() => { }} />
          <ToggleSwitch label="Product updates & features" checked={true} onChange={() => { }} />
        </div>
        <div className="pt-4 border-t border-slate-800">
          <ToggleSwitch label="Security alerts" checked={true} onChange={() => { }} disabled={true} />
          <p className="text-sm text-slate-500 mt-1">Security alerts cannot be disabled.</p>
        </div>
        <Button onClick={() => showToast('Notification preferences saved!', 'success')}>Save Preferences</Button>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (currentSettingTab) {
      case 'Profile': return <ProfileTab />;
      case 'Account': return <AccountTab />;
      case 'Billing': return <BillingTab />;
      case 'Team': return <TeamTab />;
      case 'API': return <APITab />;
      case 'Notifications': return <NotificationsTab />;
      default: return <ProfileTab />;
    }
  };

  const tabs = ['Profile', 'Account', 'Billing', 'Team', 'API', 'Notifications'];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Settings</h2>

      {/* Tabs */}
      <div className="flex flex-wrap space-x-2 border-b border-slate-800">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setCurrentSettingTab(tab)}
            className={`px-4 py-2 font-medium transition duration-200 ${currentSettingTab === tab
              ? 'border-b-2 border-orange-600 text-orange-400'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-4">
        {renderTabContent()}
      </div>
    </div>
  );
};


// --- Authentication Views ---

// Base Auth Card Layout
const AuthCard = ({ title, subtitle, children, setAuthView }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="fixed top-4 left-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => setAuthView('landing')}>
          Back to Home
        </Button>
      </div>
      <Card className="max-w-md w-full p-8 space-y-6 relative shadow-orange-900/50 shadow-2xl">
        <div className="flex flex-col items-center space-y-2 text-center">
          <DashDigLogo onClick={() => setAuthView('landing')} showTagline={true} />
          <h2 className="text-3xl font-bold text-white mt-4">{title}</h2>
          <p className="text-slate-400">{subtitle}</p>
        </div>
        {children}
        <p className="text-xs text-center text-slate-500 pt-4 border-t border-slate-800">
          <a href="#" className="text-orange-400 hover:text-orange-300">By signing in, you agree to our Terms</a> and <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>.
        </p>
        <p className="text-xs text-center text-slate-600">
          © 2025 Dashdig. All rights reserved.
        </p>
      </Card>
    </div>
  );
};

const SocialAuthButtons = () => {
  const handleGoogleSignIn = () => {
    // Redirect to backend OAuth endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <div className="space-y-3">
      {/* Google Button with authentic 4-color G logo - WORKING */}
      <button 
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-slate-700 bg-white hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium transform hover:scale-[1.02]"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
      
      {/* Apple Button - Coming Soon */}
      <button 
        disabled
        className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-slate-700 bg-black hover:bg-gray-900 transition-all duration-200 text-white font-medium transform hover:scale-[1.02] opacity-50 cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Continue with Apple (Coming Soon)
      </button>
      
      {/* Facebook Button - Coming Soon */}
      <Button variant="social-facebook" icon={Facebook} fullWidth disabled>
        Continue with Facebook (Coming Soon)
      </Button>
      
      {/* GitHub Button - Coming Soon */}
      <button 
        disabled
        className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all duration-200 text-white font-medium transform hover:scale-[1.02] opacity-50 cursor-not-allowed"
      >
        <Github className="w-5 h-5 mr-3" />
        Continue with GitHub (Coming Soon)
      </button>
    </div>
  );
};

const Divider = ({ text = 'or' }) => (
  <div className="relative flex items-center py-5">
    <div className="flex-grow border-t border-slate-800"></div>
    <span className="flex-shrink mx-4 text-slate-500 text-sm">{text}</span>
    <div className="flex-grow border-t border-slate-800"></div>
  </div>
);

const SignInView = ({ setAuthView, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      if (email === 'demo@example.com' && password === 'password') {
        onLogin();
      } else {
        setError('Invalid email or password.');
      }
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    if (provider.toLowerCase() === 'google') {
      // Redirect to backend OAuth endpoint
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';
      window.location.href = `${backendUrl}/api/auth/google`;
      return;
    }
    
    // For other providers, show coming soon message
    console.log(`${provider} login coming soon`);
    alert(`${provider} authentication coming soon!`);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <button
          onClick={() => setAuthView('landing')}
          className="mb-8 flex items-center gap-2 text-[#1A1A1A] hover:text-[#FF6B35] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Main Card */}
        <div className="bg-white border-3 border-[#1A1A1A] rounded-xl shadow-[4px_4px_0_#1A1A1A] p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FF6B35] border-3 border-[#1A1A1A] rounded-xl flex items-center justify-center shadow-[2px_2px_0_#1A1A1A] transition-transform group-hover:rotate-[-5deg] group-hover:scale-110">
                  <LightningBolt size="md" />
                </div>
                <div>
                  <h1 className="text-2xl font-black">
                    <span className="text-[#1A1A1A] group-hover:text-[#FF6B35] transition-colors">Dash</span><span className="text-[#FF6B35] group-hover:text-[#1A1A1A] transition-colors">dig</span>
                  </h1>
                </div>
              </div>
              <span className="text-sm font-bold tracking-widest text-[#FF6B35] uppercase">
                HUMANIZE • SHORTENIZE • URLS
              </span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-black text-center text-[#1A1A1A] mb-8">
            Sign in to your account
          </h2>

          {/* Email/Password Form */}
          <form onSubmit={handleSignIn} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-white border-2 border-[#1A1A1A] rounded-lg text-[#1A1A1A] placeholder-[#666] focus:outline-none focus:border-[#FF6B35] transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white border-2 border-[#1A1A1A] rounded-lg text-[#1A1A1A] placeholder-[#666] focus:outline-none focus:border-[#FF6B35] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#1A1A1A] text-sm font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-400 rounded-lg">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAuthView('forgot-password')}
                className="text-sm font-semibold text-[#FF6B35] hover:text-[#E55A2B] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF6B35] text-white font-black uppercase text-sm border-3 border-[#1A1A1A] rounded-lg shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#1A1A1A]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm font-bold text-[#666]">OR</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full py-3 px-4 bg-white text-[#1A1A1A] font-semibold border-2 border-[#1A1A1A] rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#1A1A1A] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocialLogin('Apple')}
              className="w-full py-3 px-4 bg-[#1A1A1A] text-white font-semibold border-2 border-[#1A1A1A] rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#1A1A1A] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.33 14.96c-.35.77-.52 1.12-1 1.81-.65.96-1.57 2.15-2.71 2.16-1.01.01-1.28-.65-2.61-.64-1.33.01-1.63.66-2.64.64-1.14-.01-1.99-1.09-2.64-2.05-1.82-2.67-2.01-5.81-.89-7.47.8-1.19 2.05-1.88 3.24-1.88 1.21 0 1.97.66 2.96.66.96 0 1.54-.66 2.92-.66 1.04 0 2.17.57 2.97 1.54-2.61 1.43-2.19 5.15.4 6.89zM13.24 3.57c.51-.67.91-1.6.76-2.57-.83.04-1.8.58-2.38 1.27-.51.61-.93 1.56-.77 2.47.91.06 1.85-.49 2.39-1.17z"/>
              </svg>
              Continue with Apple
            </button>

            {/* Phone */}
            <button
              onClick={() => handleSocialLogin('Phone')}
              className="w-full py-3 px-4 bg-white text-[#FF6B35] font-semibold border-2 border-[#FF6B35] rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#FF6B35] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              Continue with Phone
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-[#666]">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthView('signup')}
                className="font-bold text-[#FF6B35] hover:text-[#E55A2B] transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs text-[#666]">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-[#1A1A1A] hover:text-[#FF6B35] font-semibold">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#1A1A1A] hover:text-[#FF6B35] font-semibold">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const SignUpView = ({ setAuthView, onLogin }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', agreed: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.agreed) {
      setError('You must agree to the Terms of Service.');
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  return (
    <AuthCard title="Create your account" subtitle="Start shortening URLs in seconds" setAuthView={setAuthView}>
      <SocialAuthButtons />
      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div className='space-y-1'>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="flex items-center space-x-2">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-300`} style={{ width: strength.width, backgroundColor: strength.color === 'text-red-400' ? '#f87171' : strength.color === 'text-yellow-400' ? '#facc15' : '#4ade80' }}></div>
            </div>
            <span className={`text-xs font-medium ${strength.color}`}>{strength.strength}</span>
          </div>
        </div>

        <div className="flex items-start space-x-3 pt-2">
          <input
            type="checkbox"
            id="agreed"
            checked={form.agreed}
            onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
            className="mt-1 rounded text-orange-600 bg-slate-900 border-slate-700 focus:ring-orange-500"
          />
          <label htmlFor="agreed" className="text-sm text-slate-400">
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" loading={loading} fullWidth>
          Create Account
        </Button>
      </form>

      <div className="text-center text-sm pt-2">
        <p className="text-slate-400">Already have an account?</p>
        <button onClick={() => setAuthView('signin')} className="text-orange-400 hover:text-orange-300 font-medium text-lg">
          Sign in
        </button>
      </div>
    </AuthCard>
  );
};

const ForgotPasswordView = ({ setAuthView }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <AuthCard title="Reset your password" subtitle="Enter your email to receive a reset link" setAuthView={setAuthView}>
      {success ? (
        <div className="text-center space-y-4 pt-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
          <p className="text-xl text-white font-medium">Check your email</p>
          <p className="text-slate-400">We've sent reset instructions to **{email}**. Check your spam folder if you don't see it.</p>
          <Button onClick={() => setAuthView('signin')} fullWidth>
            Back to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            Send Reset Link
          </Button>
          <div className="text-center">
            <button type="button" onClick={() => setAuthView('signin')} className="text-sm text-slate-400 hover:text-orange-400 font-medium">
              Back to sign in
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  );
};


const SMSVerificationModal = ({ isOpen, onClose, onVerify }) => {
  const [code, setCode] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value) || value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    const isCodeComplete = newCode.every(digit => digit !== '');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (isCodeComplete) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (fullCode) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      if (fullCode === '123456') { // Mock verification
        onClose();
        onVerify();
      } else {
        setError('Invalid code. Please try again.');
        setCode(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }
    }, 1000);
  };

  return (
    <Modal title="Enter Verification Code" isOpen={isOpen} onClose={onClose} className="max-w-xs">
      <div className="text-center space-y-6">
        <p className="text-slate-400">A 6-digit code was sent to your phone number.</p>
        <div className="flex justify-center space-x-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 text-center text-xl font-bold bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
              autoFocus={index === 0}
            />
          ))}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button onClick={() => handleVerify(code.join(''))} loading={loading} fullWidth disabled={code.some(d => d === '')}>
          Verify
        </Button>
        <p className="text-sm text-slate-500">
          Didn't receive code? <a href="#" className="text-orange-400 hover:text-orange-300">Resend</a>
        </p>
      </div>
    </Modal>
  );
};


// --- Enterprise Landing Page ---
const EnterpriseLandingPage = ({ setLandingView }) => {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', company: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const features = [
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'SSO/SAML integration, role-based access, and compliance-ready infrastructure.',
      badge: 'Coming Soon'
    },
    {
      icon: TrendingUp,
      title: 'Unlimited Scale',
      description: 'No limits on URLs, clicks, or team members. Built for high-volume operations.',
      badge: null
    },
    {
      icon: Zap,
      title: 'Claude Opus 4.5 AI',
      description: 'Most advanced AI model for brand voice learning and context-aware URL generation.',
      badge: null
    },
    {
      icon: User,
      title: 'Dedicated Support',
      description: '1-hour SLA, dedicated account manager, and quarterly strategy calls.',
      badge: null
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Custom reports, data exports, webhook integrations, and real-time dashboards.',
      badge: null
    },
    {
      icon: Code,
      title: 'Custom Integrations',
      description: 'API access, webhooks, custom data retention policies, and white-label options.',
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 p-4 bg-[#0F0F0F]/95 backdrop-blur-md border-b-3 border-[#1A1A1A] flex justify-between items-center h-16">
        <DashDigLogo onClick={() => setLandingView('landing')} showTagline={true} />
        <div className="flex space-x-4 items-center">
          <button 
            onClick={() => setLandingView('landing')}
            className="px-4 py-2 text-white font-bold hover:text-[#FF6B35] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#0F0F0F]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-8">
            {/* Large Lightning Icon */}
            <div className="flex justify-center mb-8">
              <div className="p-12 bg-[#1A1A1A] border-3 border-[#FF6B35] rounded-2xl shadow-[8px_8px_0_#FF6B35] group-hover:shadow-[12px_12px_0_#FF6B35] transition-all duration-300">
                <div style={{ width: '80px', height: '96px' }}>
                  <svg
                    viewBox="-1 0 22 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <path
                      d="M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z"
                      fill="#FFCC33"
                      stroke="#1A1A1A"
                      strokeWidth={1.5}
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black uppercase leading-tight group cursor-pointer">
              <span className="text-white group-hover:text-[#FF6B35] transition-colors">Enterprise-Grade</span>
              <br />
              <span className="text-[#FF6B35] group-hover:text-white transition-colors">URL Intelligence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#A0A0A0] max-w-3xl mx-auto font-medium">
              For teams that demand more
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-[#FF6B35] text-white font-black uppercase text-lg border-3 border-[#1A1A1A] rounded-xl shadow-[6px_6px_0_#1A1A1A] hover:shadow-[8px_8px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <LightningBolt size="sm" />
                  Schedule a Demo
                </span>
              </button>
              <a
                href="mailto:enterprise@dashdig.com"
                className="px-8 py-4 bg-transparent text-white font-bold uppercase text-lg border-3 border-white rounded-xl hover:bg-white hover:text-[#0F0F0F] transition-all duration-200"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#0F0F0F]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-xl hover:border-[#FF6B35] transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#FF6B35] rounded-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  {feature.badge && (
                    <span className="px-3 py-1 bg-[#FFCC33] text-[#1A1A1A] text-xs font-bold uppercase rounded-full border-2 border-[#1A1A1A]">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black uppercase text-white mb-3 group-hover:text-[#FF6B35] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#A0A0A0] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-[#0F0F0F] border-y-3 border-[#1A1A1A]">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center text-sm font-bold uppercase text-[#A0A0A0] mb-8 tracking-wider">
            Trusted by teams at
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {['Company A', 'Company B', 'Company C', 'Company D'].map((company, i) => (
              <div key={i} className="p-6 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-lg text-center">
                <Building className="w-8 h-8 text-[#A0A0A0] mx-auto mb-2" />
                <p className="text-[#A0A0A0] font-medium text-sm">{company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-[#0F0F0F]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-4">
              Let's Talk
            </h2>
            <p className="text-xl text-[#A0A0A0]">
              Get a custom quote and see how Dashdig Enterprise can scale with your business
            </p>
          </div>

          <div className="p-8 bg-[#1A1A1A] border-3 border-[#2A2A2A] rounded-xl shadow-[6px_6px_0_#000]">
            {success ? (
              <div className="text-center space-y-6 py-12">
                <div className="inline-block p-6 bg-[#10B981] rounded-full">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase text-white">Request Sent!</h3>
                <p className="text-[#A0A0A0] text-lg">
                  Our enterprise team will reach out within 1 business day.
                </p>
                <button
                  onClick={() => setLandingView('landing')}
                  className="px-6 py-3 bg-[#FF6B35] text-white font-bold uppercase border-3 border-[#1A1A1A] rounded-lg shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white text-sm font-bold uppercase mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white rounded-lg placeholder-[#A0A0A0] focus:border-[#FF6B35] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-bold uppercase mb-2 block">Work Email *</label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white rounded-lg placeholder-[#A0A0A0] focus:border-[#FF6B35] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-white text-sm font-bold uppercase mb-2 block">Company Name *</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white rounded-lg placeholder-[#A0A0A0] focus:border-[#FF6B35] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-bold uppercase mb-2 block">Tell us about your needs *</label>
                  <textarea
                    placeholder="Expected link volume, compliance requirements, integration needs..."
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white rounded-lg placeholder-[#A0A0A0] focus:border-[#FF6B35] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-[#FF6B35] text-white font-black uppercase text-lg border-3 border-[#1A1A1A] rounded-xl shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Submit Request
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0F0F0F] border-t-3 border-[#1A1A1A]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#A0A0A0] text-sm">
            © 2025 Dashdig Enterprise. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};


// --- Global Components ---

// Modal Component
const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm" onClick={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div
        className={`bg-[#242424] rounded-xl shadow-2xl transition-all duration-300 transform scale-100 opacity-100 border border-[#2A2A2A] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#2A2A2A] mb-4">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-[#A0A0A0] hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};


// Main Dashboard Header
const DashboardHeader = ({ onOpenCreateModal, currentUser, setAuthView, isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 p-4 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#2A2A2A] flex justify-between items-center h-16">
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="hidden md:block">
          <DashDigLogo onClick={() => setAuthView('landing')} showTagline={false} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={onOpenCreateModal} icon={Plus} className="hidden sm:flex">
          New Link
        </Button>

        <div className="relative" ref={dropdownRef}>
          <AvatarButton
            name={currentUser.name}
            size="md"
            showImage={false}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {/* User Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#242424] rounded-lg shadow-xl z-20 py-1 text-sm border border-[#2A2A2A]">
              <div className="px-4 py-2 border-b border-[#2A2A2A] text-white">
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-xs text-[#A0A0A0]">{currentUser.email}</p>
              </div>
              <button 
                onClick={() => { 
                  setAuthView('landing'); 
                  setIsDropdownOpen(false); 
                }} 
                className="flex items-center px-4 py-2 text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white w-full text-left transition-colors"
              >
                <Home className="w-4 h-4 mr-2" /> Back to Home
              </button>
              <button 
                onClick={() => { 
                  setAuthView('dashboard', 'settings'); 
                  setIsDropdownOpen(false); 
                }} 
                className="flex items-center px-4 py-2 text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white w-full text-left transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </button>
              <hr className="border-[#2A2A2A] my-1" />
              <button 
                onClick={() => { 
                  onLogout(); 
                  setIsDropdownOpen(false); 
                }} 
                className="flex items-center px-4 py-2 text-red-400 hover:bg-red-900/30 w-full text-left transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Main Dashboard Sidebar
const Sidebar = ({ currentView, setCurrentView, currentUser, onLogout }) => {
  const NavItem = ({ view, icon: Icon, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 px-4 py-3 rounded-r-lg w-full text-left transition-colors duration-200 ${currentView === view
        ? 'text-[#FF6B35] bg-[#FF6B35]/10 border-l-3 border-[#FF6B35]'
        : 'text-[#A0A0A0] bg-transparent hover:bg-[#242424] hover:text-white'
        }`}
    >
      <Icon className={`w-5 h-5 transition-colors duration-200`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="hidden md:flex flex-col w-60 bg-[#1A1A1A] border-r border-[#2A2A2A] h-full p-6 sticky top-0">
      {/* Logo - Click to return to landing page */}
      <div className="mb-8 cursor-pointer group">
        <DashDigLogo 
          showTagline={true} 
          onClick={() => {
            setCurrentView('overview');
            // Option: Uncomment below to go to landing page instead
            // window.location.href = '/';
          }} 
        />
        <p className="text-xs text-[#A0A0A0] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Dashboard Home
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-1">
        <NavItem view="overview" icon={Home} label="Overview" />
        <NavItem view="links" icon={LinkIcon} label="My Links" />
        <NavItem view="analytics" icon={BarChart} label="Analytics" />
        <NavItem view="widgets" icon={Code} label="Widgets" />
        <NavItem view="settings" icon={Settings} label="Settings" />
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-t border-[#2A2A2A]">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#242424] border border-[#2A2A2A] mb-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border-2 border-[#FF6B35]/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C35] border-2 border-[#FF6B35]/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {currentUser.initials || currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          
          {/* User Details */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">
              {currentUser.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {currentUser.plan === 'Trial' || currentUser.plan === 'trial' ? (
                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md border border-[#FF6B35]/30 text-[#FF6B35] bg-[#FF6B35]/5 font-medium uppercase tracking-wide">
                  Trial
                </span>
              ) : currentUser.plan === 'Pro' || currentUser.plan === 'pro' ? (
                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30 font-medium uppercase tracking-wide">
                  Pro
                </span>
              ) : currentUser.plan === 'Business' || currentUser.plan === 'business' ? (
                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium uppercase tracking-wide">
                  Business
                </span>
              ) : currentUser.plan === 'Enterprise' || currentUser.plan === 'enterprise' ? (
                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium uppercase tracking-wide">
                  Enterprise
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-[#2A2A2A] text-[#A0A0A0] border border-[#2A2A2A] font-medium uppercase tracking-wide">
                  {currentUser.plan}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Sign Out Button - Subtle Style */}
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#A0A0A0] bg-transparent border border-[#2A2A2A] hover:bg-[#242424] hover:text-white hover:border-[#3A3A3A] transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 group-hover:text-[#FF6B35] transition-colors duration-200" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// Mobile Menu
const MobileMenu = ({ isOpen, onClose, currentView, setCurrentView, onLogout, currentUser }) => {
  const NavItem = ({ view, icon: Icon, label }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        onClose();
      }}
      className={`flex items-center px-4 py-3 rounded-lg w-full text-left transition duration-200 ${currentView === view
        ? 'bg-[#FF6B35] text-white'
        : 'text-[#A0A0A0] hover:bg-[#242424] hover:text-white'
        }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={onClose} />}

      {/* Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-[#0F0F0F] z-50 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center pb-6 border-b border-[#2A2A2A]">
            <DashDigLogo showTagline={true} onClick={() => { setCurrentView('overview'); onClose(); }} />
            <button onClick={onClose} className="text-[#FF6B35] hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow space-y-1 py-4">
            <NavItem view="overview" icon={Home} label="Overview" />
            <NavItem view="links" icon={LinkIcon} label="My Links" />
            <NavItem view="analytics" icon={BarChart} label="Analytics" />
            <NavItem view="widgets" icon={Code} label="Widgets" />
            <NavItem view="settings" icon={Settings} label="Settings" />
          </nav>

          {/* User Profile Section */}
          <div className="pt-4 border-t border-[#2A2A2A]">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#242424] border border-[#2A2A2A] mb-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border-2 border-[#FF6B35]/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C35] border-2 border-[#FF6B35]/20 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {currentUser.initials || currentUser.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* User Details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {currentUser.plan === 'Trial' || currentUser.plan === 'trial' ? (
                    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md border border-[#FF6B35]/30 text-[#FF6B35] bg-[#FF6B35]/5 font-medium uppercase tracking-wide">
                      Trial
                    </span>
                  ) : currentUser.plan === 'Pro' || currentUser.plan === 'pro' ? (
                    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30 font-medium uppercase tracking-wide">
                      Pro
                    </span>
                  ) : currentUser.plan === 'Business' || currentUser.plan === 'business' ? (
                    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium uppercase tracking-wide">
                      Business
                    </span>
                  ) : currentUser.plan === 'Enterprise' || currentUser.plan === 'enterprise' ? (
                    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium uppercase tracking-wide">
                      Enterprise
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-[#2A2A2A] text-[#A0A0A0] border border-[#2A2A2A] font-medium uppercase tracking-wide">
                      {currentUser.plan}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sign Out Button - Subtle Style */}
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#A0A0A0] bg-transparent border border-[#2A2A2A] hover:bg-[#242424] hover:text-white hover:border-[#3A3A3A] transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 group-hover:text-[#FF6B35] transition-colors duration-200" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Demo Mode Banner Component
const DemoModeBanner = ({ setAuthView }) => (
  <div className="bg-gradient-to-r from-orange-600/90 to-amber-500/90 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
    <div className="flex items-center gap-2">
      <LightningBolt size="sm" />
      <span className="text-sm font-medium">You're in Demo Mode — exploring with sample data</span>
    </div>
    <button
      onClick={() => setAuthView('signup')}
      className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm font-medium transition-colors"
    >
      Sign up to save your links
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

// Main Dashboard Layout
const DashboardContent = ({ currentView, setCurrentView, onOpenCreateModal, currentUser, onLogout, setAuthView, links, analytics, showToast, isDemo = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardOverview links={links} analytics={analytics} />;
      case 'links':
        return <LinksManagement onOpenCreateModal={onOpenCreateModal} links={links} showToast={showToast} />;
      case 'analytics':
        return <AnalyticsView analytics={analytics} />;
      case 'widgets':
        return <WidgetsView />;
      case 'settings':
        return <SettingsView currentUser={currentUser} updateUser={setAuthView} showToast={showToast} />;
      default:
        return <DashboardOverview links={links} analytics={analytics} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0F0F0F] overflow-hidden">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <div className="flex-grow flex flex-col overflow-y-auto">
        {/* Demo Mode Banner - show when user is in demo mode */}
        {isDemo && <DemoModeBanner setAuthView={setAuthView} />}
        <DashboardHeader
          onOpenCreateModal={onOpenCreateModal}
          currentUser={currentUser}
          setAuthView={(view, dashView) => {
            if (view === 'dashboard' && dashView) {
              setCurrentView(dashView);
            }
            setAuthView(view);
          }}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
        />
        <main className="flex-grow p-4 md:p-8 bg-[#0F0F0F]">
          {renderView()}
        </main>
      </div>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={onLogout}
        currentUser={currentUser}
      />
    </div>
  );
};

// --- Main App Component ---

// Mock Data Structure
const MOCK_LINKS = [
  { id: 1, title: 'Summer Campaign', shortUrl: 'summer-sale', originalUrl: 'https://example.com/very/long/url/for/summer/campaign/2025', clicks: 2430, trend: 12.5, status: 'ACTIVE', created: '2025-06-01' },
  { id: 2, title: 'Product Launch', shortUrl: 'new-product', originalUrl: 'https://store.example.com/products/new-product-line-q3-2025', clicks: 1856, trend: -3.2, status: 'ACTIVE', created: '2025-09-10' },
  { id: 3, title: 'Newsletter Jan', shortUrl: 'news-jan', originalUrl: 'https://newsletter.example.com/archive/january-2025-edition', clicks: 945, trend: 0.0, status: 'ARCHIVED', created: '2025-01-15' },
  { id: 4, title: 'Webinar Signup', shortUrl: 'webinar-2025', originalUrl: 'https://events.example.com/webinar-signup-page-for-q4-strategy', clicks: 3201, trend: 25.1, status: 'ACTIVE', created: '2025-10-20' },
  { id: 5, title: 'Holiday Promo', shortUrl: 'holiday', originalUrl: 'https://example.com/holiday-promotion-page-limited-time-offer', clicks: 678, trend: -15.8, status: 'ARCHIVED', created: '2024-12-01' },
  { id: 6, title: 'API Documentation', shortUrl: 'api-docs', originalUrl: 'https://docs.dashdig.com/api/getting-started/v1', clicks: 4500, trend: 8.9, status: 'ACTIVE', created: '2025-05-10' },
  { id: 7, title: 'Partnership Program', shortUrl: 'partners', originalUrl: 'https://dashdig.com/partner-program-benefits-and-signup', clicks: 120, trend: 5.5, status: 'ACTIVE', created: '2025-11-20' },
];

const MOCK_ANALYTICS = {
  stats: {
    totalClicks: 12453, totalClicksChange: 12.5,
    uniqueVisitors: 8921, uniqueVisitorsChange: 8.3,
    avgClickRate: 4.2, avgClickRateChange: 0.8,
    customDomains: 3,
    topLink: { name: "Summer Campaign", clicks: 2430 },
    sparklines: {
      clicks: [100, 150, 120, 180, 200, 190, 220],
      visitors: [80, 120, 90, 140, 160, 150, 180],
      activeLinks: [25, 25, 24, 24, 23, 23, 24],
      clickRate: [4.0, 4.1, 4.2, 4.1, 4.3, 4.2, 4.4]
    }
  },
  chartData: [
    { day: 'MON', clicks: 1250 }, { day: 'TUE', clicks: 1890 }, { day: 'WED', clicks: 1456 },
    { day: 'THU', clicks: 2340 }, { day: 'FRI', clicks: 1980 }, { day: 'SAT', clicks: 2650 }, { day: 'SUN', clicks: 2180 }
  ],
  trafficSources: [
    { name: 'Direct', value: 45 }, { name: 'Social', value: 28 }, { name: 'Email', value: 15 },
    { name: 'Referral', value: 8 }, { name: 'Other', value: 4 },
  ],
  topReferrers: [
    { name: 'twitter.com', clicks: 3245 }, { name: 'linkedin.com', clicks: 1892 }, { name: 'facebook.com', clicks: 1456 },
    { name: 'google.com', clicks: 987 }, { name: 'reddit.com', clicks: 654 },
  ],
  topLinks: [
    { name: 'Webinar Signup', shortUrl: 'webinar-2025', clicks: 3201, ctr: 8.5, trend: 25.1 },
    { name: 'Summer Campaign', shortUrl: 'summer-sale', clicks: 2430, ctr: 7.1, trend: 12.5 },
    { name: 'API Documentation', shortUrl: 'api-docs', clicks: 4500, ctr: 6.8, trend: 8.9 },
    { name: 'Product Launch', shortUrl: 'new-product', clicks: 1856, ctr: 5.5, trend: -3.2 },
    { name: 'Newsletter Jan', shortUrl: 'news-jan', clicks: 945, ctr: 4.9, trend: 0.0 },
  ],
};

// Support Chat Widget Component
const SupportChatWidget = ({ chatOpen, setChatOpen }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '👋 Hi there! I\'m Dash. How can I help you humanize your URLs today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = (userMessage) => {
    const lowerText = userMessage.toLowerCase();
    let botResponse = '';

    // Escalation triggers - HubSpot integration
    if (lowerText.includes('enterprise') || lowerText.includes('talk to sales') || lowerText.includes('custom pricing')) {
      botResponse = "I'd love to connect you with our sales team! 🎯\n\nFor enterprise inquiries, we can discuss:\n• Custom pricing\n• SSO/SAML integration\n• Dedicated support\n\nWould you like to:\n• Schedule a call\n• Email sales@dashdig.com\n• Have someone reach out to you?";
    } else if (lowerText.includes('cancel') || lowerText.includes('refund')) {
      botResponse = "I'm sorry to hear you're considering canceling. 😔\n\nBefore you go, would you like to:\n• Talk to our support team about any issues\n• Downgrade to a lower plan instead\n• Get a pause on your subscription\n\nEmail billing@dashdig.com or I can have someone reach out.";
    } else if (lowerText.includes('bug') || lowerText.includes('not working') || lowerText.includes('error')) {
      botResponse = "I'm sorry you're experiencing issues! 🔧\n\nTo help you faster:\n1. What were you trying to do?\n2. What error message did you see?\n\nOr email support@dashdig.com with screenshots and we'll prioritize your ticket.";
    } else if (lowerText.includes('talk to human') || lowerText.includes('speak to someone')) {
      botResponse = "I'll connect you with our team! 👋\n\nYou can:\n• Schedule a call\n• Email support@dashdig.com\n• Leave your email and we'll reach out within 24 hours\n\nWhat works best for you?";
    } else if (lowerText.includes('how does it work') || lowerText.includes('how to')) {
      botResponse = "Great question! Here's how Dashdig works:\n\n1️⃣ Paste any long URL\n2️⃣ Our AI generates a human-readable short URL\n3️⃣ Track clicks and analytics\n\nWant to try it? Just click 'Get Started' at the top!";
    } else if (lowerText.includes('pricing') || lowerText.includes('cost') || lowerText.includes('price')) {
      botResponse = "We have plans for every need! 💰\n\n• Free: 25 URLs/month\n• Starter: $12/month (500 URLs)\n• Pro: $29/month (5,000 URLs) - Most Popular!\n• Business: $99/month (Unlimited)\n• Enterprise: Custom pricing\n\nAll plans include AI-powered URL generation. Ready to upgrade?";
    } else if (lowerText.includes('api') || lowerText.includes('documentation') || lowerText.includes('docs')) {
      botResponse = "Check out our API docs! 📚\n\nWe have:\n• REST API for URL shortening\n• Webhook integrations\n• Analytics endpoints\n\nVisit dashdig.com/docs or need help with integration? Let me know!";
    } else {
      botResponse = "I'm here to help! Try asking me about:\n• How Dashdig works\n• Pricing plans\n• API documentation\n• Enterprise solutions\n\nOr type 'talk to sales' to connect with our team! 🚀";
    }

    return botResponse;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = processMessage(inputValue);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponse
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-widget">
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">
              <LightningBolt size="sm" />
            </div>
            <div className="chat-header-info">
              <h3>Dash</h3>
              <span>Your Dashdig Assistant</span>
            </div>
            <button className="chat-close" onClick={() => setChatOpen(false)}>×</button>
          </div>
          
          <div className="chat-body" style={{ maxHeight: '400px', overflowY: 'auto', padding: '16px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.type === 'user' ? 'user-message' : ''}`} style={{
                marginBottom: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: msg.type === 'user' ? '#FF6B35' : '#f5f5f5',
                color: msg.type === 'user' ? 'white' : '#1A1A1A',
                marginLeft: msg.type === 'user' ? '20%' : '0',
                marginRight: msg.type === 'user' ? '0' : '20%',
                whiteSpace: 'pre-line'
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message" style={{ padding: '12px', color: '#666' }}>
                <em>Dash is typing...</em>
              </div>
            )}
            {messages.length === 1 && (
              <div className="quick-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                <button className="quick-action" onClick={() => handleQuickAction('How does it work?')} style={{
                  padding: '8px 12px',
                  background: 'white',
                  border: '2px solid #1A1A1A',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>How does it work?</button>
                <button className="quick-action" onClick={() => handleQuickAction('Pricing plans')} style={{
                  padding: '8px 12px',
                  background: 'white',
                  border: '2px solid #1A1A1A',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>Pricing plans</button>
                <button className="quick-action" onClick={() => handleQuickAction('API docs')} style={{
                  padding: '8px 12px',
                  background: 'white',
                  border: '2px solid #1A1A1A',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>API docs</button>
                <button className="quick-action" onClick={() => handleQuickAction('Talk to sales')} style={{
                  padding: '8px 12px',
                  background: 'white',
                  border: '2px solid #1A1A1A',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>Talk to sales</button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input" style={{
            padding: '12px',
            borderTop: '2px solid #e0e0e0',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              style={{
                padding: '10px 20px',
                background: inputValue.trim() ? '#FF6B35' : '#ccc',
                color: 'white',
                border: '2px solid #1A1A1A',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              Send
            </button>
          </div>
          
          <div className="chat-footer" style={{
            padding: '8px 12px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#666',
            borderTop: '1px solid #e0e0e0'
          }}>
            Powered by Dashdig AI
          </div>
        </div>
      )}
      <div className="chat-button" onClick={() => setChatOpen(!chatOpen)}>
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
        <div className="notification-dot"></div>
      </div>
    </div>
  );
};

const App = () => {
  // NextAuth Session
  const { data: session, status } = useSession();
  
  // Global State Management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    initials: 'DU',
    plan: 'Trial',
    avatar: null
  });
  const [currentView, setCurrentView] = useState('overview'); // dashboard view: overview, links, analytics, etc.
  const [authView, setAuthView] = useState('landing'); // global view: landing, signin, signup, forgot-password, enterprise, dashboard
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [links, setLinks] = useState(MOCK_LINKS);
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS);
  const [toasts, setToasts] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  // Toast Management
  const showToast = useCallback((message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Auth and User Handlers
  const handleLogin = useCallback((user) => {
    setIsAuthenticated(true);
    const userName = user?.name || 'Demo User';
    const userInitials = user?.initials || getInitials(userName);
    
    setCurrentUser({
      name: userName,
      email: user?.email || 'demo@example.com',
      initials: userInitials,
      plan: user?.plan || 'Pro',
      avatar: user?.avatar || null,
    });
    setAuthView('dashboard');
    setCurrentView('overview');
    showToast(`Welcome back, ${userName}!`, 'success');
  }, [showToast]);

  const handleLogout = useCallback(async () => {
    console.log('🔐 Logging out...');
    
    // Clear JWT token from localStorage and cookies
    if (typeof window !== 'undefined') {
      console.log('[AUTH] Clearing stored token...');
      localStorage.removeItem('dashdig_token');
      document.cookie = 'dashdig_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    
    // Sign out from NextAuth (Google SSO)
    if (session) {
      await signOut({ redirect: false });
    }
    
    setIsAuthenticated(false);
    setCurrentUser({ name: 'Guest User', email: '', initials: 'GU', plan: 'Free', avatar: null });
    setAuthView('landing');
    showToast('Signed out successfully.', 'info');
  }, [session, showToast]);

  const updateCurrentUser = useCallback((newUserData) => {
    if (newUserData === null) {
      handleLogout();
    } else {
      setCurrentUser(prev => ({ ...prev, ...newUserData }));
    }
  }, [handleLogout]);

  // Link Management Handlers
  const addLink = useCallback((newLinkData) => {
    console.log('➕ Adding new link to state:', newLinkData);
    
    const newLink = {
      id: newLinkData.id || Date.now(),
      title: newLinkData.title || newLinkData.metadata?.title || 'Untitled Link',
      shortUrl: newLinkData.shortUrl || newLinkData.customSlug || `dashdig.com/${newLinkData.customSlug}`,
      originalUrl: newLinkData.destinationUrl || newLinkData.originalUrl,
      clicks: newLinkData.clicks || 0, // Real click count from backend or 0 for new links
      trend: newLinkData.trend || 0,
      status: newLinkData.status || 'ACTIVE',
      created: newLinkData.created || new Date().toISOString().split('T')[0],
      metadata: newLinkData.metadata || null,
    };
    
    console.log('✅ Link added to state:', newLink);
    setLinks(prev => [newLink, ...prev]);
    // Don't show toast here - let the caller handle success messages
  }, []);

  // Modal Handler
  const onOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  // Check for existing token on page load and restore authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('dashdig_token');
      console.log('[AUTH] Checking for stored token on page load...');
      console.log('[AUTH] Token found:', !!token);
      
      if (token && !isAuthenticated) {
        console.log('[AUTH] Restoring authentication from stored token');
        // Fetch user data from backend using the token
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app'}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => {
          if (!res.ok) {
            console.log('[AUTH] Token validation failed, clearing token');
            localStorage.removeItem('dashdig_token');
            throw new Error('Token validation failed');
          }
          return res.json();
        })
        .then(data => {
          console.log('[AUTH] User data retrieved:', data.user);
          const user = data.user;
          setIsAuthenticated(true);
          setCurrentUser({
            name: user.profile?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            initials: getInitials(user.profile?.name || user.email || 'U'),
            plan: user.subscription?.plan || 'free',
            avatar: user.profile?.avatar || null
          });
          console.log('[AUTH] Authentication restored successfully');
        })
        .catch(err => {
          console.error('[AUTH] Error restoring authentication:', err);
        });
      } else if (!token) {
        console.log('[AUTH] No token found, user not authenticated');
      }
    }
  }, []); // Run once on mount

  // Redirect to login when visiting /dashboard directly without authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view');
      const pathname = window.location.pathname;
      
      // Don't redirect if we're on the auth callback page - let it complete first
      const isAuthCallback = pathname.includes('/auth/callback');
      if (isAuthCallback) {
        console.log('[AUTH] On callback page, skipping redirect check');
        return;
      }
      
      // Skip auth redirect if coming from OAuth callback
      const hasTokenParam = urlParams.get('token');
      if (hasTokenParam) {
        console.log('[AUTH] OAuth flow detected (token in URL), skipping redirect');
        return;
      }
      
      // Check if there's a token being validated - don't redirect if so
      const hasStoredToken = localStorage.getItem('dashdig_token');
      if (hasStoredToken && !isAuthenticated) {
        console.log('[AUTH] Token found in localStorage, waiting for validation to complete');
        return; // Don't redirect yet, let the token validation finish
      }
      
      // If user navigates directly to /dashboard without auth and no token, redirect to login
      if ((pathname === '/dashboard' || viewParam === 'dashboard') && !isAuthenticated) {
        console.log('🔒 Redirecting unauthenticated user to login');
        setAuthView('signin');
        // Optionally, you can redirect to the actual /login page:
        // window.location.href = '/login';
      }
    }
  }, [isAuthenticated, handleLogin]);

  // Redirect to signin when trying to access dashboard without authentication
  useEffect(() => {
    // Don't redirect if we're on the auth callback page - let it complete first
    if (typeof window !== 'undefined') {
      const isAuthCallback = window.location.pathname.includes('/auth/callback');
      if (isAuthCallback) {
        console.log('[AUTH] On callback page, skipping dashboard auth check');
        return;
      }
      
      // Skip auth redirect if coming from OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const hasTokenParam = urlParams.get('token');
      if (hasTokenParam) {
        console.log('[AUTH] OAuth flow detected (token in URL), skipping dashboard auth check');
        return;
      }
      
      // Check if there's a token being validated - don't redirect if so
      const hasStoredToken = localStorage.getItem('dashdig_token');
      if (hasStoredToken && !isAuthenticated) {
        console.log('[AUTH] Token found, waiting for validation before checking dashboard access');
        return; // Don't redirect yet, let the token validation finish
      }
    }
    
    if (authView === 'dashboard' && !isAuthenticated) {
      console.log('🔒 Dashboard access requires authentication - redirecting to signin');
      setAuthView('signin');
    }
  }, [authView, isAuthenticated]);

  // Handle Google SSO Session (NextAuth - legacy, only for compatibility)
  // NOTE: We now use JWT-based auth from our backend OAuth, not NextAuth sessions
  useEffect(() => {
    // Check if we have a JWT token - if yes, we're using our own auth system
    const hasJwtToken = typeof window !== 'undefined' && localStorage.getItem('dashdig_token');
    
    if (hasJwtToken) {
      console.log('[AUTH] JWT token found - using backend OAuth, ignoring NextAuth session');
      return; // Don't use NextAuth session if we have JWT
    }
    
    // Legacy NextAuth session handling (only if no JWT token exists)
    if (status === 'authenticated' && session?.user && !isAuthenticated) {
      console.log('🔐 Google SSO session detected (NextAuth - legacy):', session.user);
      console.log('   Name:', session.user.name);
      console.log('   Email:', session.user.email);
      console.log('   Image:', session.user.image);
      
      // ALWAYS use the actual name from Google for display
      const displayName = session.user.name || session.user.email?.split('@')[0] || 'User';
      
      // Generate initials from the ACTUAL NAME (not email)
      const nameInitials = getInitials(session.user.name || '');
      
      console.log('   Generated initials:', nameInitials, 'from name:', session.user.name);
      
      setCurrentUser({
        name: displayName,
        email: session.user.email || '',
        initials: nameInitials,
        plan: 'Free', // New Google users start with Free plan
        avatar: session.user.image || null,
      });
      
      setIsAuthenticated(true);
      setAuthView('dashboard');
      setCurrentView('overview');
      
      showToast(`Welcome, ${displayName}!`, 'success');
    } else if (status === 'unauthenticated' && isAuthenticated && !hasJwtToken && currentUser.email !== 'demo@dashdig.com') {
      // Only logout if NextAuth session ends AND no JWT token exists
      console.log('🔐 Google SSO session ended - but checking JWT token...');
      const token = localStorage.getItem('dashdig_token');
      if (token) {
        console.log('[AUTH] User has valid JWT token, staying logged in despite Google session ending');
        return; // Don't logout - JWT is our source of truth
      }
      console.log('[AUTH] No JWT token found, proceeding with logout');
      handleLogout();
    }
  }, [session, status, isAuthenticated, currentUser.email, showToast, handleLogout]);

  // Handle URL query parameters (for redirects after Google auth)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view');
      
      if (viewParam === 'dashboard' && isAuthenticated) {
        setAuthView('dashboard');
        setCurrentView('overview');
        // Clean up URL
        window.history.replaceState({}, '', '/');
      }
    }
  }, [isAuthenticated]);


  // Landing Page Router
  const renderLandingPage = () => {
    switch (authView) {
      case 'signin':
        return <SignInView setAuthView={setAuthView} onLogin={handleLogin} />;
      case 'signup':
        return <SignUpView setAuthView={setAuthView} onLogin={handleLogin} />;
      case 'forgot-password':
        return <ForgotPasswordView setAuthView={setAuthView} />;
      case 'enterprise':
        return <EnterpriseLandingPage setLandingView={setAuthView} />;
      case 'landing':
      default:
        // FIX: Pass onOpenCreateModal as prop
        return <LandingPage onOpenCreateModal={onOpenCreateModal} setAuthView={setAuthView} />;
    }
  };

  const setLandingView = (view) => {
    if (view === 'pricing') {
      document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'contact') {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setAuthView('landing');
    } else {
      setAuthView(view);
    }
  };

  // Main Landing Page Structure (when not in Auth view)
  const LandingPage = ({ onOpenCreateModal, setAuthView }) => (
    <div className="min-h-screen bg-[#FDF8F3]">
      <header className="sticky top-0 z-20 px-6 py-4 bg-[#FDF8F3] border-b-3 border-[#1A1A1A]" style={{ display: 'flex', alignItems: 'center' }}>
        <Logo variant="light" showTagline={true} onClick={() => setLandingView('home')} />
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', marginLeft: '80px' }}>
          <a 
            href="/docs" 
            className="nav-link"
            style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: 700, fontSize: '16px', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B35'}
            onMouseLeave={(e) => e.target.style.color = '#1A1A1A'}
          >
            Docs
          </a>
          <a 
            href="#features" 
            className="nav-link"
            style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: 700, fontSize: '16px', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B35'}
            onMouseLeave={(e) => e.target.style.color = '#1A1A1A'}
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className="nav-link"
            style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: 700, fontSize: '16px', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B35'}
            onMouseLeave={(e) => e.target.style.color = '#1A1A1A'}
          >
            Pricing
          </a>
          <a 
            href="#how-it-works" 
            className="nav-link"
            style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: 700, fontSize: '16px', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B35'}
            onMouseLeave={(e) => e.target.style.color = '#1A1A1A'}
          >
            How It Works
          </a>
          <button 
            onClick={() => setAuthView('enterprise')} 
            className="nav-link"
            style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: 700, fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B35'}
            onMouseLeave={(e) => e.target.style.color = '#1A1A1A'}
          >
            Enterprise
          </button>
        </nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
          <button 
            onClick={() => setAuthView('signin')} 
            className="login-btn"
            style={{ 
              fontSize: '15px', 
              fontWeight: 700, 
              color: '#1A1A1A', 
              padding: '8px 16px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B35'}
            onMouseLeave={(e) => e.target.style.color = '#1A1A1A'}
          >
            LOGIN
          </button>
          <button onClick={() => setAuthView('signup')} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: '#FF6B35',
            color: 'white',
            border: '3px solid #1A1A1A',
            borderRadius: '8px',
            boxShadow: '4px 4px 0 #1A1A1A',
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s ease-out'
          }} className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A]">
            <LightningBolt size="md" />
            <span>GET STARTED</span>
          </button>
        </div>
      </header>

      <Hero onOpenCreateModal={onOpenCreateModal} setAuthView={setAuthView} />
      <HowItWorks />
      <SocialProof />
      <Features />
      <div id="pricing"><Pricing setAuthView={setAuthView} setLandingView={setLandingView} /></div>
      <div id="contact"><ContactSection setLandingView={setLandingView} /></div>
      
      {/* CTA Section - Ready to Dig This? */}
      <section className="py-24 bg-[#FF6B35] border-t-3 border-b-3 border-[#1A1A1A] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black text-white mb-4 uppercase">Ready to Dig This?</h2>
          <p className="text-xl text-white/90 mb-8">Join 10,000+ marketers who've humanized their links.</p>
          <button 
            onClick={() => setAuthView('signup')}
            className="inline-flex items-center gap-3 bg-white text-[#1A1A1A] px-8 py-4 text-lg font-bold uppercase border-3 border-[#1A1A1A] rounded-lg shadow-[4px_4px_0_#1A1A1A] transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A]"
          >
            <LightningBolt size="md" />
            <span>GET STARTED FREE</span>
          </button>
        </div>
      </section>
      
      <Footer setLandingView={setLandingView} />
    </div>
  );

  // Main Renderer
  const renderApp = () => {
    // Check if user is in demo mode (logged in as Demo User)
    const isDemo = currentUser.email === 'demo@dashdig.com';
    
    if (isAuthenticated) {
      return (
        <DashboardContent
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenCreateModal={onOpenCreateModal}
          currentUser={currentUser}
          onLogout={handleLogout}
          setAuthView={(view) => setAuthView(view)}
          links={links}
          analytics={analytics}
          showToast={showToast}
          isDemo={isDemo}
        />
      );
    }
    return renderLandingPage();
  };

  return (
    <ErrorBoundary>
      {renderApp()}
      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        addLink={addLink}
        showToast={showToast}
      />
      {/* Neo-Brutalist Chat Widget */}
      <SupportChatWidget chatOpen={chatOpen} setChatOpen={setChatOpen} />
      
      <div id="chart-tooltip" className="fixed p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg pointer-events-none opacity-0 transition-opacity duration-150 z-50"></div>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ErrorBoundary>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900/50 flex flex-col items-center justify-center p-8 text-center text-white">
          <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Something went wrong.</h1>
          <p className="text-red-300 mb-6">We're sorry for the inconvenience. Please try reloading the page.</p>
          <details className="text-left bg-red-900 p-4 rounded-lg text-sm max-w-lg overflow-x-auto">
            <summary className="font-semibold cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-red-200 whitespace-pre-wrap">{this.state.error.toString()}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Gemini API Call Functions ---

const fetchAiSuggestions = async (prompt, systemInstruction, responseSchema, showToast, isJson = false) => {
  const apiKey = API_KEY;

  if (!apiKey) {
    if (showToast) {
      showToast('Gemini API key missing. Set NEXT_PUBLIC_GEMINI_API_KEY in your environment.', 'error');
    }
    return isJson ? { slugs: [] } : "";
  }

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: isJson ? {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    } : undefined,
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Received empty response from AI model.");
    }

    if (isJson) {
      return JSON.parse(text);
    }

    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (showToast) {
      showToast(`AI generation failed: ${error.message}`, 'error');
    }
    return isJson ? { slugs: [] } : "";
  }
};

const aiSlugSchema = {
  type: "OBJECT",
  properties: {
    slugs: {
      type: "ARRAY",
      description: "Three memorable, human-readable slug recommendations.",
      items: { type: "STRING" }
    }
  }
};

const fetchAiTitle = async (url, showToast) => {
  const prompt = `Analyze the content of this URL: ${url}. Based on the destination, generate a single, professional, compelling link title (maximum 7 words) that would maximize click-through rate. Return only the title text.`;
  const systemInstruction = "Act as a professional marketing analyst and headline writer.";
  return fetchAiSuggestions(prompt, systemInstruction, null, showToast, false);
};

const fetchAiSlugs = async (url, showToast) => {
  const prompt = `Analyze the content and purpose of this URL: ${url}. Generate exactly 3 highly memorable, human-readable, and short link slugs (e.g., 'Target.Tide.Pods', 'Summer-Sale-Guide'). Do not include the domain name.`;
  const systemInstruction = "Act as an AI link humanizer. Provide exactly 3 short, catchy, and professional slug options, returned in a JSON object with a single 'slugs' array.";
  const result = await fetchAiSuggestions(prompt, systemInstruction, aiSlugSchema, showToast, true);
  return result.slugs || [];
};

// --- Create Link Modal Component ---

const CreateLinkModal = ({ isOpen, onClose, currentUser, addLink, showToast }) => {
  // QR Code generation function (local to this component)
  const generateQRCodeLocal = async (url) => {
    try {
      const QRCodeLib = await import('qrcode');
      const qrDataUrl = await QRCodeLib.default.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
      return qrDataUrl;
    } catch (err) {
      console.error('QR Code generation failed:', err);
      return null;
    }
  };

  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingSlugs, setIsGeneratingSlugs] = useState(false);
  const [aiSlugOptions, setAiSlugOptions] = useState([]);

  const [form, setForm] = useState({
    destinationUrl: '',
    customSlug: '',
    title: '',
    tags: [],
    // Advanced
    hasExpiration: false,
    expiryDate: '',
    hasPassword: false,
    password: '',
    hasUtm: false,
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
  });
  const [finalLink, setFinalLink] = useState(null);
  const [tagInput, setTagInput] = useState('');

  // Reset state on modal open/close
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setForm({
        destinationUrl: '', customSlug: '', title: '', tags: [],
        hasExpiration: false, expiryDate: '', hasPassword: false, password: '',
        hasUtm: false, utmSource: '', utmMedium: '', utmCampaign: '',
      });
      setIsAdvancedOpen(false);
      setFinalLink(null);
      setAiSlugOptions([]);
    }
  }, [isOpen]);

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() && !form.tags.includes(tagInput.trim().toLowerCase())) {
      e.preventDefault();
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim().toLowerCase()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleGenerateTitle = async () => {
    if (!form.destinationUrl) {
      showToast('Please enter a Destination URL first.', 'info');
      return;
    }
    setIsGeneratingTitle(true);
    const title = await fetchAiTitle(form.destinationUrl, showToast);
    if (title) {
      setForm(prev => ({ ...prev, title: title.replace(/["']/g, '') })); // Clean up quotes
    }
    setIsGeneratingTitle(false);
  };

  const handleGenerateSlugs = async () => {
    if (!form.destinationUrl) {
      showToast('Please enter a Destination URL first.', 'info');
      return;
    }
    setIsGeneratingSlugs(true);
    const slugs = await fetchAiSlugs(form.destinationUrl, showToast);
    setAiSlugOptions(slugs);
    setIsGeneratingSlugs(false);
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(form.destinationUrl)) {
      showToast('Please enter a valid Destination URL (must start with http/https).', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🚀 Creating link with backend API...');
      console.log('📦 Destination URL:', form.destinationUrl);
      console.log('✏️ Custom Slug:', form.customSlug || 'AI-generated');
      console.log('👤 User:', currentUser);
      
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';
      const token = typeof window !== 'undefined' ? localStorage.getItem('dashdig_token') : null;
      
      // Prepare request body
      const requestBody = {
        url: form.destinationUrl,
        customSlug: form.customSlug || undefined, // Let backend generate if empty
        keywords: form.tags || [],
        expiryClicks: form.hasExpiration ? 100 : 10, // Default click limit
      };
      
      console.log('📤 Request body:', requestBody);
      console.log('🔑 Auth token:', token ? 'Present' : 'Missing');
      
      // Call backend API to create URL
      const response = await fetch(`${backendUrl}/api/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend error:', errorData);
        throw new Error(errorData.error || errorData.message || 'Failed to create link');
      }
      
      const data = await response.json();
      console.log('✅ Link created successfully:', data);
      
      // Extract slug from response
      const slug = data.data?.slug || form.customSlug || 'generated-link';
      const shortUrl = data.data?.shortUrl || `dashdig.com/${slug}`;
      
      // Update global state with real data
      const newLink = {
        destinationUrl: form.destinationUrl,
        customSlug: slug,
        title: form.title || data.data?.metadata?.title || 'Untitled Link',
        shortUrl: shortUrl,
        originalUrl: form.destinationUrl,
        metadata: data.data?.metadata,
      };
      
      addLink(newLink);
      
      // Prepare final link with UTM if needed
      let fullUrl = shortUrl;
      if (form.hasUtm && form.utmSource) {
        fullUrl += `?utm_source=${form.utmSource}&utm_medium=${form.utmMedium || 'link'}&utm_campaign=${form.utmCampaign || slug}`;
      }
      
      // Generate QR code for the short URL
      console.log('🔍 QR Debug - slug:', slug);
      console.log('🔍 QR Debug - shortUrl:', shortUrl);
      console.log('🔍 QR Debug - data.data?.shortUrl:', data.data?.shortUrl);
      
      // Construct full URL for QR code (shortUrl is already "dashdig.com/slug" or full URL from backend)
      const qrUrl = shortUrl.startsWith('http') ? shortUrl : `https://${shortUrl}`;
      console.log('🔍 QR Debug - final QR URL:', qrUrl);
      
      const qrCodeDataUrl = await generateQRCodeLocal(qrUrl);
      
      setFinalLink({
        shortUrl: shortUrl,
        fullUrl: fullUrl,
        hasUtm: form.hasUtm && !!form.utmSource,
        slug: slug,
        qrCode: qrCodeDataUrl,
      });
      
      setIsLoading(false);
      setStep('success');
      showToast('Link created successfully! ✨', 'success');
      
    } catch (error) {
      console.error('❌ Error creating link:', error);
      setIsLoading(false);
      showToast(error.message || 'Failed to create link. Please try again.', 'error');
    }
  };

  const PreviewSection = () => {
    const slug = form.customSlug || '[AI-Generated]';
    return (
      <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
        <p className="text-sm font-medium text-slate-300">Your shortened URL will be:</p>
        <p className="font-mono text-lg text-orange-400">
          dashdig.com/<span className="font-bold">{slug}</span>
        </p>
        {form.hasPassword && <p className="text-sm text-red-400 flex items-center"><Lock className="w-4 h-4 mr-1" /> Password Protected</p>}
        {form.hasUtm && form.utmSource && <p className="text-xs text-slate-500">With UTM Parameters</p>}
      </div>
    );
  };

  const MagicButton = ({ onClick, loading, label }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || !form.destinationUrl}
      className={`flex items-center text-xs font-medium px-2 py-1 rounded-full border border-orange-400/50 bg-slate-800 text-orange-400 hover:bg-slate-700 transition duration-200 ${loading ? 'opacity-50 cursor-wait' : ''}`}
    >
      {loading ? <Loader className="w-3 h-3 mr-1 animate-spin" /> : <Zap className="w-3 h-3 mr-1 fill-amber-300 text-amber-300" />}
      {label}
    </button>
  );

  const SuccessScreen = () => {
    const handleCopy = (text) => {
      copyToClipboard(text, showToast);
    };

    return (
      <div className="text-center space-y-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-3xl font-bold text-white">Link Created Successfully!</h3>

        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
          <p className="text-sm font-medium text-slate-300">New Short URL:</p>
          <p className="font-mono text-xl text-orange-400 break-all">{finalLink.shortUrl}</p>
        </div>

        <div className="flex space-x-4 justify-center">
          <Button onClick={() => handleCopy(finalLink.shortUrl)} icon={Copy} className="text-sm">
            Copy URL
          </Button>
          {finalLink.hasUtm && (
            <Button onClick={() => handleCopy(finalLink.fullUrl)} variant="secondary" icon={Copy} className="text-sm">
              Copy with UTM
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
          <div className="col-span-1 flex flex-col items-center space-y-2">
            <div className="w-20 h-20 bg-white p-1 rounded-lg flex items-center justify-center">
              {finalLink.qrCode ? (
                <img src={finalLink.qrCode} alt="QR Code" className="w-full h-full" />
              ) : (
                <Code className="w-12 h-11 text-slate-900" />
              )}
            </div>
            <Button 
              variant="secondary" 
              className="text-xs px-2 py-1"
              onClick={() => {
                if (finalLink.qrCode) {
                  const link = document.createElement('a');
                  link.href = finalLink.qrCode;
                  link.download = `dashdig-qr-${finalLink.slug}.png`;
                  link.click();
                }
              }}
            >
              Download QR
            </Button>
          </div>
          <Button onClick={() => setStep('form')} variant="secondary" className="col-span-2">
            Create Another
          </Button>
          <Button onClick={onClose} fullWidth className="col-span-3">
            Go to My Links
          </Button>
        </div>
      </div>
    );
  };

  const FormScreen = () => (
    <form onSubmit={handleCreateLink} className="space-y-5">
      <Input
        label="Destination URL"
        type="url"
        placeholder="https://example.com/your-long-url"
        value={form.destinationUrl}
        onChange={(e) => {
          setForm({ ...form, destinationUrl: e.target.value });
          setAiSlugOptions([]); // Clear slugs if URL changes
        }}
        icon={LinkIcon}
        required
        helperText="The full URL you want to shorten"
      />

      {/* AI Title Generator */}
      <div className="flex items-end justify-between">
        <Input
          label="Link Title"
          placeholder="Summer Sale Campaign"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          helperText="For your reference only in the dashboard"
          className="w-2/3"
        />
        <MagicButton
          onClick={handleGenerateTitle}
          loading={isGeneratingTitle}
          label="AI Generate Title"
        />
      </div>

      {/* Custom Slug Input and AI Recommender */}
      <div>
        <div className="flex items-end justify-between">
          <Input
            label="Custom Short URL"
            placeholder="my-custom-link"
            prefix="dashdig.com/"
            value={form.customSlug}
            onChange={(e) => setForm({ ...form, customSlug: e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() })}
            maxLength={50}
            helperText={`Leave empty for AI-generated URL (${form.customSlug.length}/50)`}
            className="flex-grow mr-4"
          />
          <MagicButton
            onClick={handleGenerateSlugs}
            loading={isGeneratingSlugs}
            label="AI Slugs"
          />
        </div>
        {/* AI Slugs Display */}
        {aiSlugOptions.length > 0 && (
          <div className="mt-3 space-y-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 font-medium">AI Recommendations:</p>
            <div className="flex flex-wrap gap-2">
              {aiSlugOptions.map((slug, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, customSlug: slug }))}
                  className="text-xs px-2 py-1 bg-slate-700 text-orange-300 rounded-full hover:bg-orange-900/50 transition duration-150"
                >
                  {slug}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium block mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.tags.map((tag) => (
            <span key={tag} className="flex items-center text-xs font-medium px-2 py-1 bg-orange-600 text-white rounded-full">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-white/70 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          className="block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg placeholder-slate-500 transition duration-200"
        />
        <div className="mt-2 text-xs text-slate-500">Suggestions: marketing, social, email</div>
      </div>

      <PreviewSection />

      {/* Advanced Options Toggle */}
      <div className="pt-4 border-t border-slate-800">
        <button type="button" onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} className="flex justify-between items-center w-full text-orange-400 hover:text-orange-300 font-medium">
          Advanced Options
          {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Advanced Options Content */}
      {isAdvancedOpen && (
        <div className="space-y-4 pt-4 transition-all duration-300 ease-out">
          <h4 className="font-semibold text-white border-b border-slate-800 pb-2">Tracking & Security</h4>
          <ToggleSwitch label="Set link expiration date" checked={form.hasExpiration} onChange={() => setForm(p => ({ ...p, hasExpiration: !p.hasExpiration, expiryDate: '' }))} />
          {form.hasExpiration && (
            <Input
              label="Expiration Date (YYYY-MM-DD)"
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />
          )}

          <ToggleSwitch label="Require password" checked={form.hasPassword} onChange={() => setForm(p => ({ ...p, hasPassword: !p.hasPassword, password: '' }))} />
          {form.hasPassword && (
            <Input
              label="Password"
              type="password"
              placeholder="Secure Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}

          <ToggleSwitch label="Add UTM parameters" checked={form.hasUtm} onChange={() => setForm(p => ({ ...p, hasUtm: !p.hasUtm }))} />
          {form.hasUtm && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Input label="UTM Source" placeholder="google" value={form.utmSource} onChange={(e) => setForm({ ...form, utmSource: e.target.value })} required />
              <Input label="UTM Medium" placeholder="cpc" value={form.utmMedium} onChange={(e) => setForm({ ...form, utmMedium: e.target.value })} />
              <Input label="UTM Campaign" placeholder="summer_sale" value={form.utmCampaign} onChange={(e) => setForm({ ...form, utmCampaign: e.target.value })} />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
        <Button onClick={onClose} variant="secondary" className="px-6 py-2">
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={!form.destinationUrl} className="px-6 py-2">
          Create Link
        </Button>
      </div>
    </form>
  );

  return (
    <Modal title="Create New Link" isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      {step === 'form' ? <FormScreen /> : <SuccessScreen />}
    </Modal>
  );
};

export default App;
