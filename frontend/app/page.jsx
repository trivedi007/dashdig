'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, useDeferredValue } from 'react';
import {
  Menu, X, Zap, ChevronDown, ChevronUp, Search, Filter, SortDesc, Copy, Edit2, Archive, Trash2, Send, Clock, Lock, Target, Plus, User, Mail, Briefcase, Building, Check, ArrowRight, TrendingUp, TrendingDown, RefreshCw, Layers, HardHat, Globe, Phone, CreditCard, DollarSign, Bell, LogOut, Code, Minus, MessageCircle, Mic, Star, Menu as MenuIcon, CheckCircle, Smartphone, Tablet, Monitor, Chrome, Facebook, Linkedin, Twitter, Github, Heart, Loader, Link as LinkIcon, AlertTriangle, Home, Settings, BarChart, Sliders, Paperclip, Download, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../lib/api';

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
    {label && <label htmlFor={id} className="text-slate-300 text-sm font-medium">{label}</label>}
    <div className="relative flex items-center">
      {prefix && (
        <span className="inline-flex items-center px-3 text-slate-400 bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg text-sm">
          {prefix}
        </span>
      )}
      {Icon && <Icon className="absolute left-3 w-4 h-4 text-slate-500" />}
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={`flex-grow block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg placeholder-slate-500 focus:ring-orange-500 focus:border-orange-500 transition duration-200 ${prefix ? 'rounded-l-none' : ''} ${Icon ? 'pl-10' : ''} ${suffix ? 'pr-16' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3 inline-flex items-center text-sm">
          {suffix}
        </span>
      )}
    </div>
    {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));

// Button Component
const Button = ({ children, onClick, variant = 'primary', disabled = false, loading = false, icon: Icon, fullWidth = false, className = '', type = 'button' }) => {
  const baseStyle = 'flex items-center justify-center font-medium rounded-lg transition duration-200 shadow-lg';
  let colorStyle = '';

  switch (variant) {
    case 'primary':
      colorStyle = 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/50 hover:shadow-orange-400/70 transform hover:scale-[1.02]';
      break;
    case 'secondary':
      colorStyle = 'bg-slate-700 text-slate-200 hover:bg-slate-600 shadow-slate-900/50 transform hover:scale-[1.02]';
      break;
    case 'danger':
      colorStyle = 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/50 transform hover:scale-[1.02]';
      break;
    case 'ghost':
      colorStyle = 'bg-transparent text-orange-400 hover:bg-slate-800/50 transform hover:scale-105 shadow-none';
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
  <div ref={ref} className={`p-6 bg-slate-900/70 border border-slate-800 rounded-xl shadow-2xl ${className}`}>
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

// DashDig Logo Component
const DashDigLogo = ({ showTagline = true, onClick, className = '' }) => {
  // Increased size and prominence of the golden lightning bolt
  const IconStyle = "w-7 h-7 text-amber-300 fill-amber-300 absolute";
  return (
    <div className={`flex flex-col items-start cursor-pointer group ${className}`} onClick={onClick}>
      <div className="flex items-center space-x-2">
        <div className="relative w-9 h-9 flex items-center justify-center bg-orange-600 rounded-md group-hover:bg-orange-500 transition-colors duration-300">
          <Zap className={IconStyle} style={{ transform: 'rotate(180deg)' }} />
        </div>
        <span className="text-2xl font-black tracking-widest text-white uppercase group-hover:text-orange-400 transition-colors duration-300">
          DashDig
        </span>
      </div>
      {showTagline && (
        <span className="text-xs font-semibold tracking-widest text-orange-400 mt-0.5 group-hover:text-orange-300 transition-colors duration-300">
          HUMANIZE • SHORTENIZE • URLS
        </span>
      )}
    </div>
  );
};

// Auth Logo Component (for auth pages)
const AuthLogo = () => (
  <div className="flex items-center justify-center gap-2 mb-6 group cursor-pointer">
    <div className="relative w-10 h-10 flex items-center justify-center bg-orange-600 rounded-md group-hover:bg-orange-500 transition-colors duration-300">
      <Zap className="w-7 h-7 text-amber-300 fill-amber-300" style={{ transform: 'rotate(180deg)' }} />
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black tracking-widest text-white group-hover:text-orange-400 transition-colors duration-300">DASHDIG</span>
      <span className="text-[10px] font-semibold tracking-widest text-orange-400">HUMANIZE • SHORTENIZE • URLS</span>
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
      
      // Handle multiple possible response structures from backend
      const slug = result.slug 
        || result.shortCode 
        || result.short_id
        || result.data?.slug 
        || result.data?.shortCode
        || result.data?.short_id
        || (result.shortUrl && result.shortUrl.split('/').pop())
        || (result.data?.shortUrl && result.data.shortUrl.split('/').pop());
      
      if (!slug) {
        console.error('Could not extract slug from response:', result);
        throw new Error('Failed to generate short URL. Please try again.');
      }
      
      // Use dashdig.com as the domain instead of the Railway URL
      setShortenedUrl(`dashdig.com/${slug}`);
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
  const ResultModal = () => (
    <Modal
      title={error ? "⚠️ Error" : "⚡ Link Shortened!"}
      isOpen={isResultModalOpen}
      onClose={() => {
        setIsResultModalOpen(false);
        setError('');
      }}
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium mb-1">Oops! Something went wrong</p>
                <p className="text-slate-400 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Only show success content if no error */}
        {!error && (
          <>
            {/* Original URL */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Original URL</label>
              <div className="bg-slate-800 rounded-lg px-4 py-3 text-slate-300 text-sm break-all border border-slate-700">
                {linkInput}
              </div>
            </div>
            
            {/* Shortened URL */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Your Dashdig Link</label>
              <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-lg px-4 py-4 border border-orange-500/30">
                <div className="flex items-center gap-3">
                  <a 
                    href={`https://${shortenedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 font-bold text-lg truncate min-w-0 flex-1 transition-colors"
                    title={shortenedUrl}
                  >
                    {shortenedUrl}
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://${shortenedUrl}`);
                    }}
                    className="flex-shrink-0 flex items-center gap-1 bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
            
            {/* Demo Mode Notice */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Unauthenticated link created!</p>
                  <p className="text-slate-400 text-sm">
                    This link works! Sign up to track analytics, add custom slugs, QR codes, and manage all your links.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* CTA Buttons */}
        <div className="flex gap-3">
          {!error ? (
            <>
              <Button 
                onClick={() => {
                  setIsResultModalOpen(false);
                  setError('');
                  setAuthView('signup');
                }}
                className="flex-1"
              >
                Sign Up Free
              </Button>
              <Button 
                onClick={() => {
                  setIsResultModalOpen(false);
                  setError('');
                  setLinkInput('');
                }}
                variant="secondary"
                className="flex-1"
              >
                Try Another
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => {
                setIsResultModalOpen(false);
                setError('');
              }}
              className="flex-1"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );

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
            Want to explore the dashboard right now? Try our interactive demo with sample data!
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                setIsDemoModalOpen(false);
                setAuthView('dashboard');
              }}
              className="px-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Try Dashboard Demo
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <section className="relative pt-24 pb-32 bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl text-center z-10">
        {/* V2 Badge */}
        <span className="inline-flex items-center text-xs font-medium px-3 py-1 mb-6 rounded-full text-amber-300 bg-slate-800 border border-amber-300/30 shadow-md">
          <Zap className="w-3 h-3 mr-1" /> V2.0 NOW AVAILABLE
        </span>

        {/* Main Title - colors swap on hover */}
        <div className="group cursor-pointer select-none">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase text-white group-hover:text-orange-500 tracking-tighter leading-none mb-4 transition-colors duration-300">
            URLS WITH
          </h1>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase text-orange-500 group-hover:text-white tracking-tighter leading-none mb-10 transition-colors duration-300">
            ATTITUDE.
          </h1>
        </div>

        {/* Quick Shortener Form */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
          <Input
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            className="flex-1 w-full"
            placeholder="paste_your_long_ugly_link_here.com"
          />
          <button 
            onClick={handleShortenClick}
            disabled={isShortening}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-700 disabled:cursor-wait text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 whitespace-nowrap"
          >
            {isShortening ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Digging...</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 flex items-center justify-center bg-orange-700 rounded">
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" style={{ transform: 'rotate(180deg)' }} />
                </div>
                <span>Dig This!</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-6">
          <Button onClick={() => setAuthView('signup')} variant="secondary">
            Get Started Free
          </Button>
          <Button onClick={() => setIsDemoModalOpen(true)} className="!bg-transparent text-sky-400 border border-sky-600 hover:bg-slate-800/50">
            Launch Demo
          </Button>
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
    <section id="how-it-works" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-2">Shorten Links in Seconds</h2>
          <p className="text-xl text-slate-400">Three simple steps to better links</p>
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
                className={`md:w-1/3 flex flex-col items-center text-center transition duration-500 ease-out transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-orange-600/20 rounded-full border border-orange-600">
                  <span className="text-3xl font-black text-orange-500">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 mb-4">{step.desc}</p>
                {step.visual && (
                  <p className="text-sm font-mono text-orange-400 bg-slate-800 p-2 rounded-lg mt-auto">{step.visual.split('→').map((t, i) => <span key={i} className={i === 0 ? 'text-slate-500 line-through' : 'font-semibold block'}>{t}</span>)}</p>
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
    <section id="social-proof" ref={ref} className={`py-20 bg-slate-950 transition-opacity duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Trusted by 10,000+ marketers</h2>
          {/* Logo Row */}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            {LOGOS.map((logo, index) => (
              <div key={index} className="flex items-center space-x-2 text-slate-400 hover:text-white transition duration-200">
                <logo.icon className="w-6 h-6" />
                <span className="text-lg font-semibold">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <Card key={index} className="transition duration-500 ease-out hover:shadow-orange-500/30 transform hover:scale-[1.01]">
              <div className="flex space-x-1 mb-4 text-orange-400">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-orange-400" />)}
              </div>
              <p className="text-lg text-slate-300 italic mb-6">"{t.quote}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-orange-600 rounded-full text-white font-bold text-sm">{t.avatar}</div>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-slate-400">{t.company}</p>
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
    <section id="features" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-2">Features Built for Conversion</h2>
          <p className="text-xl text-slate-400">Everything you need to humanize your URLs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="space-y-4 hover:shadow-orange-500/30 transform hover:scale-[1.01] transition duration-200">
              <feature.icon className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
              <a href="#" className="flex items-center text-orange-400 hover:text-orange-300 text-sm font-medium">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const Pricing = ({ setAuthView, setLandingView }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      title: "Free", priceMonthly: 0, priceAnnual: 0, desc: "Perfect for getting started",
      features: [
        "100 links per month", "Basic analytics (30 days)", "1 custom domain", "AI-powered URL naming", "QR code generation", "Browser extension"
      ],
      cta: "Get Started Free", variant: 'secondary', action: () => setAuthView('signup'), noCard: true
    },
    {
      title: "Pro", priceMonthly: 29, priceAnnual: 23, desc: "For growing businesses",
      features: [
        "Everything in Free, plus:", "5,000 links per month", "Advanced analytics (1 year)", "25 custom domains", "Team collaboration (5 users)", "Link expiration & passwords", "UTM builder", "Priority support"
      ],
      cta: "Start 14-Day Free Trial", variant: 'primary', action: () => setAuthView('signup'), popular: true, noCard: true
    },
    {
      title: "Enterprise", priceMonthly: 'Custom', priceAnnual: 'Custom', desc: "For large organizations",
      features: [
        "Everything in Pro, plus:", "Unlimited links", "Unlimited team members", "SSO/SAML integration", "99.9% SLA guarantee", "Dedicated account manager", "Custom integrations", "Advanced security & compliance"
      ],
      cta: "Contact Sales", variant: 'secondary', action: () => setLandingView('enterprise'), noCard: false, contactSales: true
    },
  ];

  const faqs = [
    { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time directly from your billing settings." },
    { q: "What happens if I exceed my limits?", a: "We'll notify you when you reach 80% and 100% of your limit. You can easily upgrade to the next tier or wait until the next billing cycle." },
    { q: "Do you offer refunds?", a: "Yes, we offer a 30-day money-back guarantee for all annual plans if you are not satisfied." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal." },
  ];

  const PriceDisplay = ({ plan }) => {
    const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
    const isCustom = price === 'Custom';

    return (
      <div className="flex items-end space-x-1 mb-4 h-10">
        <span className="text-4xl font-extrabold text-white">
          {isCustom ? price : `$${price}`}
        </span>
        {!isCustom && <span className="text-slate-400 mb-1">/{isAnnual ? 'month' : 'month'}</span>} {/* Display /month for monthly, /year for annual is usually implied */}
      </div>
    );
  };

  const FAQItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b border-slate-800/50">
        <button
          className="flex justify-between items-center w-full py-4 text-left font-semibold text-white hover:text-orange-400 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {q}
          {isOpen ? <Minus className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-slate-400" />}
        </button>
        {isOpen && <p className="pb-4 text-slate-400 transition-all duration-300 ease-in-out">{a}</p>}
      </div>
    );
  };

  return (
    <section id="pricing" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-2">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-400">Start free, upgrade when you need more power</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative flex p-1 bg-slate-800 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition duration-300 ${!isAnnual ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative px-6 py-2 text-sm font-medium rounded-full transition duration-300 ${isAnnual ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Annual
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 py-0.5 text-xs font-bold text-slate-900 bg-amber-300 rounded-full shadow-lg">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col transform hover:scale-[1.01] transition duration-300 ${plan.popular ? 'border-orange-600 border-2 shadow-orange-500/50' : 'border-slate-800'}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 text-xs font-bold text-slate-900 bg-orange-500 rounded-full shadow-lg uppercase tracking-wider">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
              <p className="text-slate-400 mb-4 h-12">{plan.desc}</p>

              <PriceDisplay plan={plan} />

              <div className="border-t border-slate-800/50 pt-6 mb-8 flex-grow">
                <ul className="space-y-3 text-slate-300">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Button onClick={plan.action} variant={plan.variant} fullWidth>
                  {plan.cta}
                </Button>
                {plan.noCard && <p className="text-xs text-center text-slate-500 mt-2">No credit card required</p>}
                {plan.contactSales && <p className="text-xs text-center text-slate-500 mt-2">Talk to our team</p>}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mt-24">
          <h3 className="text-center text-3xl font-bold text-white mb-8">Frequently Asked Questions</h3>
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            {faqs.map((faq, index) => <FAQItem key={index} q={faq.q} a={faq.a} />)}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
          <Button onClick={() => setLandingView('contact')} variant="secondary" className="px-8 py-3">
            Contact our sales team
          </Button>
        </div>

      </div>
    </section>
  );
};

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
    <section id="contact" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-2">Get in Touch</h2>
          <p className="text-xl text-slate-400">We'd love to hear from you</p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <MessageCircle className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">GENERAL INQUIRIES</h3>
            <p className="text-slate-400 mb-4">Questions, feedback, or just want to chat?</p>
            <a href="mailto:hello@dashdig.com" className="text-orange-400 hover:text-orange-300 font-medium block">hello@dashdig.com</a>
            <p className="text-xs text-slate-500 mt-2">We reply within 24 hours</p>
          </Card>
          <Card>
            <Briefcase className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">SALES</h3>
            <p className="text-slate-400 mb-4">Ready to upgrade or need a custom plan?</p>
            <a href="mailto:sales@dashdig.com" className="text-orange-400 hover:text-orange-300 font-medium block">sales@dashdig.com</a>
            <p className="text-xs text-slate-500 mt-2">Phone: <a href="tel:18443274344" className='hover:underline'>1-844-DASHDIG</a></p>
            <a href="#" onClick={() => setLandingView('enterprise')} className="mt-4 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 py-2 px-4 rounded-lg inline-block transition">Schedule a demo</a>
          </Card>
          <Card>
            <Building className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">ENTERPRISE</h3>
            <p className="text-slate-400 mb-4">Looking for a POC or custom integration?</p>
            <a href="mailto:enterprise@dashdig.com" className="text-orange-400 hover:text-orange-300 font-medium block">enterprise@dashdig.com</a>
            <a href="#" onClick={() => setLandingView('enterprise')} className="mt-4 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 py-2 px-4 rounded-lg inline-block transition">Request a pilot program</a>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Send Us a Quick Message</h3>
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
    <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <DashDigLogo showTagline={true} onClick={() => setLandingView('home')} className="mb-4" />
            <div className="flex space-x-4 mt-6">
              <SocialIcon icon={Twitter} href="https://twitter.com" />
              <SocialIcon icon={Linkedin} href="https://linkedin.com" />
              <SocialIcon icon={Github} href="https://github.com/trivedi007/dashdig" />
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-4">Product</h5>
            <FooterLink onClick={() => setLandingView('home')}>Features</FooterLink>
            <FooterLink onClick={() => setLandingView('pricing')}>Pricing</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>API</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Widget</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Changelog</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Status</FooterLink>
          </div>

          {/* Column 3: Company */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-4">Company</h5>
            <FooterLink onClick={() => setLandingView('home')}>About</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Blog</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Careers</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Press Kit</FooterLink>
            <FooterLink onClick={() => setLandingView('contact')}>Contact</FooterLink>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-4">Resources</h5>
            <FooterLink onClick={() => setLandingView('home')}>Documentation</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Help Center</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Community</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Templates</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Integrations</FooterLink>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-4">Legal</h5>
            <FooterLink onClick={() => setLandingView('home')}>Privacy Policy</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Terms of Service</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>Cookie Policy</FooterLink>
            <FooterLink onClick={() => setLandingView('home')}>GDPR</FooterLink>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p className="mb-2 md:mb-0">© 2025 Dashdig. All rights reserved.</p>
          <p className="flex items-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1.5" /> in Raleigh, NC
          </p>
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
    <Card ref={ref} className={`space-y-4 transition-opacity duration-700 ${inView ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between">
        <p className="text-slate-400 font-medium">{title}</p>
        <Icon className="w-5 h-5 text-orange-500" />
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-bold text-white">
          <CountUp end={deferredValue} />
        </div>
        <TrendIcon change={change} />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-500">vs. previous period</p>
        {sparklineData && <SparklineChart data={sparklineData} />}
      </div>
    </Card>
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

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard title="Total Clicks" value={deferredAnalytics.stats.totalClicks} change={deferredAnalytics.stats.totalClicksChange} Icon={Zap} sparklineData={deferredAnalytics.stats.sparklines.clicks} />
        <StatsCard title="Unique Visitors" value={deferredAnalytics.stats.uniqueVisitors} change={deferredAnalytics.stats.uniqueVisitorsChange} Icon={User} sparklineData={deferredAnalytics.stats.sparklines.visitors} />
        <StatsCard title="Active Links" value={activeLinks} change={totalLinks > 0 ? ((activeLinks / totalLinks) * 100 - 80) : 0} Icon={LinkIcon} sparklineData={deferredAnalytics.stats.sparklines.activeLinks} />
        <StatsCard title="Custom Domains" value={deferredAnalytics.stats.customDomains} change={0.0} Icon={Globe} sparklineData={[3, 3, 3, 3, 3, 3, 3]} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChartComponent data={deferredAnalytics.chartData} title="Clicks Last 7 Days" height={300} />
        </div>
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Top Performing Link</h3>
          <div className="space-y-4">
            <p className="text-orange-400 font-bold text-2xl">{latestLink?.title || 'N/A'}</p>
            <p className="text-slate-400">{latestLink ? `dashdig.com/${latestLink.shortUrl}` : 'No links created'}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-slate-300">Clicks:</span>
              <span className="font-bold text-white text-lg">{latestLink?.clicks.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Trend:</span>
              {latestLink ? <TrendIcon change={latestLink.trend} /> : <span className='text-slate-500'>N/A</span>}
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
            <div key={index} className="flex items-center space-x-3 text-slate-300 text-sm">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
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
          <MenuIcon className="w-5 h-5 text-slate-400" />
        </Button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl z-10 py-1 text-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(`dashdig.com/${link.shortUrl}`, showToast);
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-700 w-full text-left"
            >
              <Copy className="w-4 h-4 mr-2" /> Copy URL
            </button>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); onOpenDetail(link); }} className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-700 w-full text-left">
              <Edit2 className="w-4 h-4 mr-2" /> Edit Link
            </button>
            <button onClick={(e) => e.stopPropagation()} className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-700 w-full text-left">
              <Archive className="w-4 h-4 mr-2" /> {link.status === 'ACTIVE' ? 'Archive' : 'Activate'}
            </button>
            <button onClick={(e) => e.stopPropagation()} className="flex items-center px-4 py-2 text-red-400 hover:bg-red-900/50 w-full text-left">
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
    <Card className="p-0 overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
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
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="w-4 px-6 py-3 text-left">
                <input type="checkbox" onChange={toggleAll} checked={selected.length > 0 && selected.length === deferredLinks.filter(l => l.status === 'ACTIVE').length} className="rounded text-orange-600 bg-slate-900 border-slate-700 focus:ring-orange-500" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Link Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Original URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Clicks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {filteredLinks.map((link, index) => (
              <tr
                key={link.id}
                className="hover:bg-slate-800/50 transition duration-150 cursor-pointer animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onOpenDetail(link)}
              >
                <td className="px-6 py-4 whitespace-nowrap w-4">
                  <input type="checkbox" checked={selected.includes(link.id)} onChange={() => toggleLink(link.id)} onClick={(e) => e.stopPropagation()} className="rounded text-orange-600 bg-slate-900 border-slate-700 focus:ring-orange-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{link.title}</div>
                  <div className="text-xs text-orange-400 font-mono">dashdig.com/{link.shortUrl}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <p className="text-sm text-slate-400 truncate max-w-xs">{link.originalUrl}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white flex items-center space-x-2">
                    <span>{link.clicks.toLocaleString()}</span>
                    <TrendIcon change={link.trend} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {getStatusBadge(link.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 hidden lg:table-cell">
                  {link.created}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ActionsDropdown link={link} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 md:p-6 flex items-center justify-between border-t border-slate-800">
        <p className="text-sm text-slate-400">Showing 1-{Math.min(5, filteredLinks.length)} of {filteredLinks.length} links</p>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" className="px-3 py-1.5" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {[1, 2, 3].map(page => (
            <button key={page} className={`w-8 h-8 rounded-full text-sm font-medium transition duration-150 ${page === 1 ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
              {page}
            </button>
          ))}
          <Button variant="secondary" className="px-3 py-1.5">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
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
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl z-20 py-1 text-sm border border-slate-700">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 w-full text-left transition duration-100"
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
    <Zap className="w-12 h-12 text-orange-600 mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 mb-6">{message}</p>
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
          <div className="w-16 h-16 flex items-center justify-center bg-orange-600 rounded-full text-white font-bold text-xl">{currentUser.initials}</div>
          <Button variant="secondary" className="px-3 py-1">Change Avatar</Button>
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
          <DashDigLogo onClick={() => setAuthView('landing')} showTagline={false} />
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

const SocialAuthButtons = () => (
  <div className="space-y-3">
    {/* Google Button with authentic 4-color G logo */}
    <button className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-slate-700 bg-white hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium transform hover:scale-[1.02]">
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
    
    {/* Apple Button with Apple logo */}
    <button className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-slate-700 bg-black hover:bg-gray-900 transition-all duration-200 text-white font-medium transform hover:scale-[1.02]">
      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
      Continue with Apple
    </button>
    
    {/* Facebook Button */}
    <Button variant="social-facebook" icon={Facebook} fullWidth>
      Continue with Facebook
    </Button>
    
    {/* GitHub Button */}
    <button className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all duration-200 text-white font-medium transform hover:scale-[1.02]">
      <Github className="w-5 h-5 mr-3" />
      Continue with GitHub
    </button>
  </div>
);

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
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);

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

  const handleSendSMS = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setShowSMSModal(true);
    }, 1500);
  };

  const countryCodes = [
    { code: '+1', label: '(North America)' },
    { code: '+44', label: '(UK)' },
    { code: '+91', label: '(India)' },
  ];

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your account" setAuthView={setAuthView}>
      <AuthLogo />
      <SocialAuthButtons />
      <Divider />

      <form onSubmit={handleSignIn} className="space-y-4">
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          suffix={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-orange-400 text-sm font-medium px-1 py-0.5 rounded hover:bg-slate-700/50 transition-colors">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
          error={error}
        />
        <div className="flex justify-end">
          <button type="button" onClick={() => setAuthView('forgot-password')} className="text-sm text-orange-400 hover:text-orange-300 font-medium">
            Forgot password?
          </button>
        </div>
        <Button type="submit" loading={loading} fullWidth>
          Sign In
        </Button>
      </form>

      <Divider />

      {/* Phone Login */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="w-1/3">
            <label htmlFor="country-code" className="text-slate-300 text-sm font-medium block mb-1">Code</label>
            <select
              id="country-code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="block w-full px-2 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              {countryCodes.map(c => (
                <option key={c.code} value={c.code}>{c.code} {c.label}</option>
              ))}
            </select>
          </div>
          <div className="w-2/3">
            <label htmlFor="phone" className="text-slate-300 text-sm font-medium block mb-1">Phone number</label>
            <Input
              id="phone"
              type="tel"
              placeholder="phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-0"
            />
          </div>
        </div>
        <Button onClick={handleSendSMS} loading={loading} fullWidth variant='sms' icon={Send}>
          Send SMS Code
        </Button>
      </div>

      <div className="text-center text-sm pt-2">
        <p className="text-slate-400">Don't have an account?</p>
        <button onClick={() => setAuthView('signup')} className="text-orange-400 hover:text-orange-300 font-medium text-lg">
          Sign up
        </button>
      </div>

      <SMSVerificationModal isOpen={showSMSModal} onClose={() => setShowSMSModal(false)} onVerify={onLogin} />
    </AuthCard>
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
      <AuthLogo />
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
      <AuthLogo />
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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 flex justify-between items-center h-16">
        <DashDigLogo onClick={() => setLandingView('landing')} showTagline={true} />
        <div className="flex space-x-4 items-center">
          <Button variant="secondary" className="px-4 py-2" onClick={() => setLandingView('landing')}>
            Back to Pricing
          </Button>
          <Button variant="primary" className="px-4 py-2">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-32 bg-slate-900 border-b border-slate-700" style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(139, 92, 246, 0.1), transparent 50%)' }}>
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-white">Dashdig Enterprise Solutions</h1>
          <p className="text-xl text-purple-300">Scale your brand's linking strategy with bespoke features and dedicated support built for volume and security.</p>
          <p className="text-slate-400">Achieve guaranteed uptime, deep compliance, and custom integrations required by large organizations.</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl grid lg:grid-cols-2 gap-12">
          {/* Left: Assurance & Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Request a Private Consultation</h2>
            <p className="text-purple-300 text-lg">Talk directly with our Enterprise team to craft a solution that fits your exact needs.</p>

            <div className="space-y-4">
              {[
                { text: 'Dedicated Account Manager', icon: Briefcase },
                { text: '99.9% SLA Guarantee', icon: CheckCircle },
                { text: 'SSO/SAML Integration', icon: Lock },
                { text: 'Custom Data Retention & Compliance', icon: Code },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 text-slate-300">
                  <item.icon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form Card */}
          <Card className="p-6 bg-slate-800/90 border-slate-700 shadow-purple-500/20 shadow-xl space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">Contact Sales</h3>
            {success ? (
              <div className="text-center space-y-4 pt-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <p className="text-xl text-white font-medium">Request Sent!</p>
                <p className="text-slate-400">Our team will be in touch within 1 business day.</p>
                <Button onClick={() => setLandingView('landing')} fullWidth>Back to Home</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input label="Work Email" type="email" placeholder="jane@enterprise.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <Input label="Company Name" placeholder="Acme Corp" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                <div>
                  <label htmlFor="message" className="text-slate-300 text-sm font-medium block mb-1">Project Details</label>
                  <textarea
                    id="message"
                    placeholder="Tell us about your expected link volume and compliance needs."
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    required
                  />
                </div>
                <Button type="submit" loading={loading} fullWidth className="bg-purple-600 hover:bg-purple-700 text-white">
                  Submit Request
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-4 text-center text-xs text-slate-500 border-t border-slate-700">
        <p>© 2025 Dashdig Enterprise. All rights reserved.</p>
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
        className={`bg-slate-900 rounded-xl shadow-2xl transition-all duration-300 transform scale-100 opacity-100 border border-slate-800 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition">
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
const DashboardHeader = ({ onOpenCreateModal, currentUser, setAuthView, isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <header className="sticky top-0 z-30 p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex justify-between items-center h-16">
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

      <div className="relative group">
        <button className="w-10 h-10 flex items-center justify-center bg-orange-600 rounded-full text-white font-bold text-sm ring-2 ring-orange-500/50">
          {currentUser.initials}
        </button>
        {/* User Dropdown */}
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl z-20 py-1 text-sm opacity-0 group-hover:opacity-100 transition duration-150 pointer-events-none group-hover:pointer-events-auto">
          <div className="px-4 py-2 border-b border-slate-700 text-slate-300">
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
          <button onClick={() => setAuthView('dashboard', 'settings')} className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-700 w-full text-left">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </button>
          <button onClick={() => setAuthView('landing')} className="flex items-center px-4 py-2 text-red-400 hover:bg-red-900/50 w-full text-left">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  </header>
);

// Main Dashboard Sidebar
const Sidebar = ({ currentView, setCurrentView, currentUser, onLogout }) => {
  const NavItem = ({ view, icon: Icon, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center px-4 py-3 rounded-lg w-full text-left transition duration-200 group ${currentView === view
        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${currentView === view ? 'animate-bounce-subtle' : ''}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900/90 border-r border-slate-800 h-full p-4 sticky top-0">
      {/* Logo */}
      <div className="mb-8">
        <DashDigLogo showTagline={true} onClick={() => setCurrentView('overview')} />
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-1">
        <NavItem view="overview" icon={Home} label="Overview" />
        <NavItem view="links" icon={LinkIcon} label="My Links" />
        <NavItem view="analytics" icon={BarChart} label="Analytics" />
        <NavItem view="widgets" icon={Code} label="Widgets" />
        <NavItem view="settings" icon={Settings} label="Settings" />
      </nav>

      {/* User Profile Card */}
      <div className="mt-8 pt-4 border-t border-slate-800">
        <Card className="p-4 flex flex-col space-y-3 bg-slate-800/50 border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-orange-600 rounded-full text-white font-bold text-sm">
              {currentUser.initials}
            </div>
            <div>
              <p className="font-semibold text-white">{currentUser.name}</p>
              <p className="text-xs text-slate-400">{currentUser.plan} Plan</p>
            </div>
          </div>
          <Button onClick={onLogout} variant="danger" icon={LogOut} fullWidth className="text-sm">
            Sign Out
          </Button>
        </Card>
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
        ? 'bg-orange-600 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
      <div className={`fixed top-0 right-0 h-full w-64 bg-slate-950 z-50 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center pb-6 border-b border-slate-800">
            <DashDigLogo showTagline={true} onClick={() => { setCurrentView('overview'); onClose(); }} />
            <button onClick={onClose} className="text-orange-500 hover:text-white transition">
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

          {/* User Profile */}
          <div className="pt-4 border-t border-slate-800">
            <Card className="p-4 flex flex-col space-y-3 bg-slate-800/50 border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-orange-600 rounded-full text-white font-bold text-sm">
                  {currentUser.initials}
                </div>
                <div>
                  <p className="font-semibold text-white">{currentUser.name}</p>
                  <p className="text-xs text-slate-400">{currentUser.plan} Plan</p>
                </div>
              </div>
              <Button onClick={onLogout} variant="danger" icon={LogOut} fullWidth className="text-sm">
                Sign Out
              </Button>
            </Card>
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
      <Zap className="w-4 h-4" />
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
    <div className="flex h-screen bg-slate-950 overflow-hidden">
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
        />
        <main className="flex-grow p-4 md:p-8">
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


const App = () => {
  // Global State Management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    initials: 'DU',
    plan: 'Pro',
    avatar: null
  });
  const [currentView, setCurrentView] = useState('overview'); // dashboard view: overview, links, analytics, etc.
  const [authView, setAuthView] = useState('landing'); // global view: landing, signin, signup, forgot-password, enterprise, dashboard
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [links, setLinks] = useState(MOCK_LINKS);
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS);
  const [toasts, setToasts] = useState([]);

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
    setCurrentUser({
      name: user?.name || 'Demo User',
      email: user?.email || 'demo@example.com',
      initials: user?.initials || 'DU',
      plan: user?.plan || 'Pro',
      avatar: user?.avatar || null,
    });
    setAuthView('dashboard');
    setCurrentView('overview');
    showToast(`Welcome back, ${user?.name || 'Demo User'}!`, 'success');
  }, [showToast]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser({ name: 'Guest User', email: '', initials: 'GU', plan: 'Free', avatar: null });
    setAuthView('landing');
    showToast('Signed out successfully.', 'info');
  }, [showToast]);

  const updateCurrentUser = useCallback((newUserData) => {
    if (newUserData === null) {
      handleLogout();
    } else {
      setCurrentUser(prev => ({ ...prev, ...newUserData }));
    }
  }, [handleLogout]);

  // Link Management Handlers
  const addLink = useCallback((newLinkData) => {
    const newLink = {
      id: Date.now(),
      title: newLinkData.title || 'Untitled Link',
      shortUrl: newLinkData.customSlug || "ai-generated-" + Math.random().toString(36).substring(2, 8),
      originalUrl: newLinkData.destinationUrl,
      clicks: Math.floor(Math.random() * 1000),
      trend: Math.random() * 50 - 25, // -25 to 25
      status: 'ACTIVE',
      created: new Date().toISOString().split('T')[0],
    };
    setLinks(prev => [newLink, ...prev]);
    showToast('Link created successfully!', 'success');
  }, [showToast]);

  // Modal Handler
  const onOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  // Handle demo login when Launch Demo is clicked
  useEffect(() => {
    if (authView === 'dashboard' && !isAuthenticated) {
      handleLogin({ name: 'Demo User', email: 'demo@dashdig.com', initials: 'DU', plan: 'Pro' });
    }
  }, [authView, isAuthenticated, handleLogin]);


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
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-20 p-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 flex justify-between items-center h-16">
        <DashDigLogo onClick={() => setLandingView('home')} showTagline={true} />
        <div className="flex space-x-4 items-center text-sm font-medium">
          <a href="/docs" className="text-slate-300 hover:text-orange-400 transition">Docs</a>
          <a href="#features" className="text-slate-300 hover:text-orange-400 transition">Features</a>
          <a href="#pricing" className="text-slate-300 hover:text-orange-400 transition">Pricing</a>
          <button onClick={() => setAuthView('enterprise')} className="text-slate-300 hover:text-orange-400 transition">Enterprise</button>
          <button onClick={() => setAuthView('signin')} className="text-slate-300 hover:text-orange-400 transition">LOGIN</button>
          <Button onClick={() => setAuthView('signup')} className="px-4 py-2 text-sm">Get Started</Button>
        </div>
      </header>

      <Hero onOpenCreateModal={onOpenCreateModal} setAuthView={setAuthView} />
      <HowItWorks />
      <SocialProof />
      <Features />
      <div id="pricing"><Pricing setAuthView={setAuthView} setLandingView={setLandingView} /></div>
      <div id="contact"><ContactSection setLandingView={setLandingView} /></div>
      <Footer setLandingView={setLandingView} />

      <SupportChatWidget currentUser={currentUser} onOpenCreateModal={onOpenCreateModal} />
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

  const handleCreateLink = (e) => {
    e.preventDefault();
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(form.destinationUrl)) {
      showToast('Please enter a valid Destination URL (must start with http/https).', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const newLink = {
        destinationUrl: form.destinationUrl,
        customSlug: form.customSlug,
        title: form.title,
      };

      addLink(newLink); // Update global state

      const shortUrl = form.customSlug || "ai-generated-link";
      let fullUrl = `dashdig.com/${shortUrl}`;

      if (form.hasUtm && form.utmSource) {
        fullUrl += `?utm_source=${form.utmSource}&utm_medium=${form.utmMedium || 'link'}&utm_campaign=${form.utmCampaign || shortUrl}`;
      }

      setFinalLink({
        shortUrl: `dashdig.com/${shortUrl}`,
        fullUrl: fullUrl,
        hasUtm: form.hasUtm && !!form.utmSource,
        slug: shortUrl,
      });
      setStep('success');
    }, 1500);
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
              <Code className="w-12 h-11 text-slate-900" />
            </div>
            <Button variant="secondary" className="text-xs px-2 py-1">Download QR</Button>
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
    <form onSubmit={handleCreateLink} className="space-y-6">
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
        helperText={<Button type="button" variant="ghost" className="p-0 text-sm h-auto" onClick={() => {}}>Paste from clipboard</Button>}
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
      <div className="flex justify-between pt-6 border-t border-slate-800">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button type="submit" loading={isLoading} disabled={!form.destinationUrl}>
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


// --- Support Chat Widget Components (Global) ---

const MESSAGE_HISTORY_KEY = "dashdig_chat_history_v2";

const SupportChatWidget = ({ currentUser, onOpenCreateModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Initialize with empty array, set greeting in useEffect to avoid hydration mismatch
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const hasLoadedRef = useRef(false);

  // Initialize greeting on client-side only to avoid hydration mismatch
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    try {
      const savedHistory = localStorage.getItem(MESSAGE_HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Only restore if there's actual conversation history (more than just greeting)
        if (parsed && parsed.length > 1) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    
    // Set initial greeting (client-side only)
    setMessages([{
      sender: 'Dash',
      text: `👋 Hi there! I'm Dash. How can I help you today?`,
      timestamp: Date.now(),
      isInitial: true,
    }]);
  }, []);

  // Save history to localStorage whenever messages change (only if there's actual conversation)
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem(MESSAGE_HISTORY_KEY, JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (text = input) => {
    if (!text.trim()) return;

    const newMessage = {
      sender: 'User',
      text: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    processMessage(text);
  };

  const processMessage = (text) => {
    const lowerText = text.toLowerCase();
    setIsTyping(true);

    let botResponse = '';

    if (lowerText.includes('how do i create a link')) {
      botResponse = "It's easy! 1. Click the '+ New Link' button. 2. Paste your Destination URL. 3. Customize the slug if you wish. 4. Click 'Create Link'.";
    } else if (lowerText.includes('api key')) {
      botResponse = `Your API key is located in your **Settings** under the **API** tab. You can view, copy, or regenerate it there.`;
    } else if (lowerText.includes('upgrade') || lowerText.includes('billing question')) {
      botResponse = "You can manage your plan and payment methods in the **Settings** section under the **Billing** tab.";
    } else if (lowerText.includes('talk to a human') || lowerText.includes('human help')) {
      botResponse = `I'll connect you with our team! While you wait, here are our contact options (Avg. response time: 2 hours):\n\n**Email:** support@dashdig.com\n**Phone:** 1-844-DASHDIG`;
    } else if (lowerText.includes('show me my analytics')) {
      botResponse = "To view your link performance, navigate to the **Analytics** tab in your dashboard. There you can see charts for clicks, geography, and referrers.";
    } else if (lowerText.includes('shorten a url')) {
      botResponse = "Use the '+ New Link' button at the top of your dashboard to open the link creation window immediately!";
    } else {
      botResponse = "I'm sorry, I don't have enough information to answer that yet. Please try rephrasing your question or choose one of the quick actions below.";
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'Dash',
        text: botResponse,
        timestamp: Date.now(),
      }]);
    }, 1500);
  };

  const DashAvatar = () => (
    <div className="w-8 h-8 flex items-center justify-center bg-orange-600 rounded-full text-amber-300">
      <Zap className="w-4 h-4 fill-amber-300" />
    </div>
  );

  const UserAvatar = () => (
    <div className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-full text-white font-bold text-sm">
      {currentUser.initials}
    </div>
  );

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5 p-2 bg-slate-800 rounded-lg max-w-xs">
      <span className="text-slate-400 text-sm">Dash is typing</span>
      <div className="dot-flashing ml-1"></div>
    </div>
  );

  const ChatWindow = () => (
    <div className={`fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4 pointer-events-none'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <DashAvatar />
          <div>
            <p className="font-semibold text-white">Support</p>
            <div className="flex items-center text-xs text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div> Online
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 overflow-y-auto h-[350px]">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] ${msg.sender === 'User' ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
              {msg.sender === 'Dash' ? <DashAvatar /> : <UserAvatar />}
              <div className={`p-3 rounded-xl shadow-md ${msg.sender === 'User' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`block text-xs mt-1 ${msg.sender === 'User' ? 'text-white/70' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <DashAvatar />
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions and Input */}
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900/90 rounded-b-xl">
        {/* Quick Actions */}
        {messages.length === 1 && messages[0].isInitial && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => handleSendMessage('How do I shorten a URL?')} className="text-xs px-2 py-1 bg-slate-800 text-orange-400 border border-orange-400/50 rounded-full hover:bg-slate-700 transition">How do I shorten a URL?</button>
            <button onClick={() => handleSendMessage('Show me my analytics')} className="text-xs px-2 py-1 bg-slate-800 text-orange-400 border border-orange-400/50 rounded-full hover:bg-slate-700 transition">Show me my analytics</button>
            <button onClick={() => handleSendMessage('Billing question')} className="text-xs px-2 py-1 bg-slate-800 text-orange-400 border border-orange-400/50 rounded-full hover:bg-slate-700 transition">Billing question</button>
            <button onClick={() => handleSendMessage('Talk to a human')} className="text-xs px-2 py-1 bg-slate-800 text-orange-400 border border-orange-400/50 rounded-full hover:bg-slate-700 transition">Talk to a human</button>
          </div>
        )}

        {/* Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            className="flex-grow px-4 py-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-full placeholder-slate-500 focus:ring-orange-500 focus:border-orange-500 transition"
            disabled={isTyping}
          />
          <button type="button" className="text-slate-400 hover:text-white transition">
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleSendMessage()}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-200 ${input.trim() ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-center text-slate-600 mt-2">Powered by Dashdig AI</p>
      </div>
    </div>
  );

  return (
    <>
      <ChatWindow />
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-xl z-50 transition duration-300 transform hover:scale-[1.05] ring-4 ring-orange-500/20 hover:ring-orange-500/50 animate-pulse-subtle"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && messages.filter(m => m.sender === 'Dash' && !m.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
            {messages.filter(m => m.sender === 'Dash' && !m.isRead).length}
          </span>
        )}
      </button>

      {/* CSS for typing animation */}
      <style>{`
        .dot-flashing {
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #f97316;
          color: #f97316;
          animation: dotFlashing 1s infinite linear alternate;
          animation-delay: 0s;
        }

        .dot-flashing::before, .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }

        .dot-flashing::before {
          left: -8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #f97316;
          color: #f97316;
          animation: dotFlashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }

        .dot-flashing::after {
          left: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #f97316;
          color: #f97316;
          animation: dotFlashing 1s infinite linear alternate;
          animation-delay: 1s;
        }

        @keyframes dotFlashing {
          0% { background-color: #f97316; }
          50%, 100% { background-color: rgba(249, 115, 22, 0.2); }
        }

        @keyframes grow-vertical {
          0% { height: 0; }
          100% { height: var(--final-height); }
        }

        @keyframes slide-in {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .animate-grow-vertical {
          animation-name: grow-vertical;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        .animate-slide-in {
          animation-name: slide-in;
          animation-duration: 0.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: backwards;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 0.8s ease-in-out;
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .animate-pulse-subtle {
            animation: pulse-subtle 3s infinite;
        }

        @keyframes pulse-subtle {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.3);
            }
            50% {
                box-shadow: 0 0 0 8px rgba(249, 115, 22, 0);
            }
        }
      `}</style>
    </>
  );
};

export default App;
