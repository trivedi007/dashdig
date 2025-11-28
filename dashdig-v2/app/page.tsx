'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, useDeferredValue } from 'react';
import {
  Menu, X, Zap, ChevronDown, ChevronUp, Search, Filter, SortDesc, Copy, Edit2, Archive, Trash2,
  Send, Clock, Lock, Target, Plus, User, Mail, Briefcase, Building, Check, ArrowRight,
  TrendingUp, TrendingDown, RefreshCw, Layers, HardHat, Globe, Phone, CreditCard, DollarSign,
  Bell, LogOut, Code, Minus, MessageCircle, Mic, Star, Menu as MenuIcon, CheckCircle, Smartphone,
  Tablet, Monitor, Chrome, Facebook, Linkedin, Twitter, Github, Heart, Loader, Link as LinkIcon,
  AlertTriangle, Home, Settings, BarChart, Sliders, Paperclip, Download, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react';

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style jsx global>{`
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
    @keyframes pulse-subtle {
      0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.3); }
      50% { box-shadow: 0 0 0 8px rgba(249, 115, 22, 0); }
    }
    .dot-flashing {
      position: relative; width: 6px; height: 6px; border-radius: 50%;
      background-color: #f97316; color: #f97316;
      animation: dotFlashing 1s infinite linear alternate;
    }
    .dot-flashing::before, .dot-flashing::after {
      content: ''; display: inline-block; position: absolute; top: 0;
      width: 6px; height: 6px; border-radius: 50%;
      background-color: #f97316; color: #f97316;
      animation: dotFlashing 1s infinite linear alternate;
    }
    .dot-flashing::before { left: -8px; animation-delay: 0.5s; }
    .dot-flashing::after { left: 8px; animation-delay: 1s; }
    
    .animate-grow-vertical { animation: grow-vertical 0.8s ease-out forwards; }
    .animate-slide-in { animation: slide-in 0.4s ease-out backwards; }
    .animate-pulse-subtle { animation: pulse-subtle 3s infinite; }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  `}</style>
);

// --- UTILITY & CONSTANTS ---
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=`;
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""; 

const copyToClipboard = (text, showToast) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast('Link copied to clipboard!', 'success'));
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast('Link copied to clipboard!', 'success');
  }
};

const useInView = (options) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [options]);
  return [ref, inView];
};

// --- BASE UI COMPONENTS (DEFINED FIRST TO AVOID REFERENCE ERRORS) ---

const Input = React.forwardRef(({ label, id, type = 'text', placeholder, value, onChange, prefix, suffix, helperText, error, readOnly, disabled, icon: Icon, className = '', ...props }, ref) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label htmlFor={id} className="text-slate-300 text-sm font-medium block">{label}</label>}
    <div className="relative flex items-center group">
      {prefix && <span className="inline-flex items-center px-3 py-2 text-slate-400 bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg text-sm h-10">{prefix}</span>}
      {Icon && <Icon className="absolute left-3 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />}
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={`flex-grow block w-full px-4 py-2 h-10 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition duration-200 outline-none ${prefix ? 'rounded-l-none' : 'rounded-l-lg'} ${suffix ? 'rounded-r-none' : 'rounded-r-lg'} ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      />
      {suffix && <span className="inline-flex items-center px-3 py-2 text-slate-400 bg-slate-800 border border-l-0 border-slate-700 rounded-r-lg text-sm h-10">{suffix}</span>}
    </div>
    {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Input.displayName = 'Input';

const Button = ({ children, onClick, variant = 'primary', disabled = false, loading = false, icon: Icon, fullWidth = false, className = '', type = 'button' }) => {
  const baseStyle = 'flex items-center justify-center font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-900/20 focus:ring-orange-500',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20 focus:ring-red-500',
    ghost: 'bg-transparent text-slate-400 hover:text-orange-400 hover:bg-slate-800/50',
    'social-google': 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-100',
    'social-facebook': 'bg-[#1877F2] text-white hover:bg-[#156cd4]',
    sms: 'bg-orange-600 text-white hover:bg-orange-700',
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : 'px-4 py-2'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'} ${className}`} type={type}>
      {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
};

const Card = React.forwardRef(({ children, className = '' }, ref) => (
  <div ref={ref} className={`p-6 bg-slate-900/70 border border-slate-800 rounded-xl shadow-xl backdrop-blur-sm ${className}`}>{children}</div>
));
Card.displayName = 'Card';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', handleEscape); }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', handleEscape); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm" onClick={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div className={`bg-slate-900 rounded-xl shadow-2xl transition-all duration-300 transform scale-100 opacity-100 border border-slate-800 ${className}`} onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="w-6 h-6" /></button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ id, message, type, onDismiss }) => {
  const styles = { success: 'bg-green-600 border-green-500', error: 'bg-red-600 border-red-500', info: 'bg-sky-600 border-sky-500' };
  const Icons = { success: CheckCircle, error: AlertTriangle, info: Bell };
  const Icon = Icons[type] || Bell;
  useEffect(() => { const timer = setTimeout(() => onDismiss(id), 3000); return () => clearTimeout(timer); }, [id, onDismiss]);
  return (
    <div className={`flex items-center w-full max-w-sm p-4 mb-2 rounded-lg shadow-2xl text-white border-l-4 cursor-pointer transform transition-all duration-300 hover:scale-105 ${styles[type]}`} onClick={() => onDismiss(id)}>
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// --- BRANDING & CHARTS ---

const DashDigLogo = ({ showTagline = true, onClick, className = '' }) => (
  <div className={`flex flex-col items-start cursor-pointer group ${className}`} onClick={onClick}>
    <div className="flex items-center space-x-2">
      <div className="relative w-9 h-9 flex items-center justify-center bg-orange-600 rounded-lg transform group-hover:rotate-3 transition-transform duration-300">
        <Zap className="w-6 h-6 text-amber-300 fill-amber-300" style={{ transform: 'rotate(180deg)' }} />
      </div>
      <span className="text-2xl font-black tracking-widest text-white uppercase group-hover:text-orange-500 transition-colors">DashDig</span>
    </div>
    {showTagline && <span className="text-[10px] font-bold tracking-[0.2em] text-orange-500/80 mt-1 uppercase">HUMANIZE • SHORTENIZE • URLS</span>}
  </div>
);

const TrendIcon = ({ change }) => {
  const isUp = change >= 0;
  return (
    <div className={`flex items-center space-x-1 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
      {isUp ? <TrendingUp className="w-4 h-4 fill-green-400" /> : <TrendingDown className="w-4 h-4 fill-red-400" />}
      <span className="text-sm font-semibold">{Math.abs(change).toFixed(1)}%</span>
    </div>
  );
};

const SparklineChart = ({ data, color = '#f97316' }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const width = 100;
  const height = 30;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / ((max - min) || 1)) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-20 h-8 opacity-70">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};

const StatsCard = ({ title, value, change, Icon, sparklineData }) => (
  <Card className="hover:border-slate-700 transition-colors duration-300">
    <div className="flex items-center justify-between mb-4">
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <Icon className="w-5 h-5 text-orange-500 opacity-80" />
    </div>
    <div className="flex items-end justify-between">
      <div>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        {change !== undefined && <TrendIcon change={change} />}
      </div>
      {sparklineData && <SparklineChart data={sparklineData} />}
    </div>
  </Card>
);

const BarChartComponent = ({ data, title }) => {
  const maxVal = Math.max(...data.map(d => d.clicks)) || 1;
  return (
    <Card className="h-full flex flex-col">
      <h3 className="font-semibold text-white text-lg mb-6">{title}</h3>
      <div className="flex-grow flex items-end justify-between space-x-2 h-64">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
            <div className="w-full relative flex items-end justify-center h-full">
              <div className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{d.clicks.toLocaleString()}</div>
              <div className="w-full max-w-[40px] bg-orange-600/80 hover:bg-orange-500 rounded-t-sm transition-all duration-500 ease-out animate-grow-vertical" style={{ '--final-height': `${(d.clicks / maxVal) * 100}%` }}></div>
            </div>
            <span className="mt-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// --- LANDING PAGE COMPONENTS ---

const Hero = ({ onOpenCreateModal, setAuthView }) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('paste_your_long_ugly_link_here.com');

  return (
    <section className="relative pt-32 pb-40 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-orange-500 opacity-20 blur-[100px]"></div>
      <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
        <span className="inline-flex items-center text-xs font-medium px-3 py-1 mb-6 rounded-full text-amber-300 bg-slate-800 border border-amber-300/30 shadow-md">
          <Zap className="w-3 h-3 mr-1" /> V2.0 NOW AVAILABLE
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-tight uppercase">
          URLS WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">ATTITUDE.</span>
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-10">
          <Input value={linkInput} onChange={(e) => setLinkInput(e.target.value)} className="w-full sm:flex-grow" placeholder="https://paste_your_long_ugly_link_here.com" />
          <Button onClick={() => setAuthView('signup')} icon={Zap} className="h-12 px-8 text-lg w-full sm:w-auto shadow-orange-500/20">Shorten It</Button>
        </div>
        <div className="flex justify-center gap-6">
          <Button variant="secondary" onClick={() => setAuthView('signup')}>Get Started Free</Button>
          <Button variant="ghost" className="border border-slate-700" onClick={() => setIsDemoModalOpen(true)}>Launch Demo</Button>
        </div>
      </div>
      <Modal title="Dashdig Demo" isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} className="max-w-3xl">
        <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative">
          <Monitor className="w-16 h-16 text-slate-500" />
          <p className="absolute text-slate-300 mt-20">Quick 90-second Demo Video Placeholder</p>
        </div>
      </Modal>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: 1, title: "Paste Your URL", desc: "Drop any long, ugly URL into Dashdig. We accept links from any website, anywhere.", icon: Copy },
    { num: 2, title: "AI Creates Your Link", desc: "Our AI analyzes the destination and generates a memorable, human-readable short URL.", icon: Zap, visual: "bit.ly/3xK9mL2 → dashdig.com/Target.Tide.Pods" },
    { num: 3, title: "Share & Track", desc: "Share your branded link everywhere. Track clicks, geography, devices, and more in real-time.", icon: Sliders, visual: "Mini analytics dashboard mockup" },
  ];
  return (
    <section id="how-it-works" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-white mb-2">Shorten Links in Seconds</h2><p className="text-xl text-slate-400">Three simple steps to better links</p></div>
        <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8 relative">
          <div className="absolute top-1/2 left-0 right-0 hidden md:flex justify-between -z-0 transform -translate-y-1/2 px-12">
            <div className="w-1/3 border-t border-slate-700/50 relative"><ArrowRight className="w-4 h-4 text-slate-700 absolute -right-2 -top-2" /></div>
            <div className="w-1/3 border-t border-slate-700/50 relative"><ArrowRight className="w-4 h-4 text-slate-700 absolute -right-2 -top-2" /></div>
          </div>
          {steps.map((step, index) => {
            const [ref, inView] = useInView({ threshold: 0.1 });
            return (
              <Card key={index} ref={ref} className={`md:w-1/3 flex flex-col items-center text-center transition duration-500 ease-out transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-orange-600/20 rounded-full border border-orange-600"><span className="text-3xl font-black text-orange-500">{step.num}</span></div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 mb-4">{step.desc}</p>
                {step.visual && <p className="text-sm font-mono text-orange-400 bg-slate-800 p-2 rounded-lg mt-auto">{step.visual.split('→').map((t, i) => <span key={i} className={i === 0 ? 'text-slate-500 line-through' : 'font-semibold block'}>{t}</span>)}</p>}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { title: "AI-Powered Slugs", desc: "Stop generic, random strings. Our AI generates short, memorable, human-readable slugs.", icon: Zap },
    { title: "Custom Domains", desc: "Use your own brandable domain (e.g., your.link/product) to increase trust and conversions.", icon: Globe },
    { title: "Deep Analytics", desc: "Track every click, location, device, and referrer in real-time. Make data-driven decisions.", icon: TrendingUp },
    { title: "Widget Integration", desc: "Integrate our shortener directly into your website or app with our powerful JavaScript widget.", icon: Code },
    { title: "Link Management", desc: "Easily manage, archive, and edit links in one beautiful, intuitive dashboard.", icon: Sliders },
    { title: "Password Protection", desc: "Secure sensitive links with optional password protection and expiration dates.", icon: Lock },
  ];
  return (
    <section id="features" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-white mb-2">Features Built for Conversion</h2><p className="text-xl text-slate-400">Everything you need to humanize your URLs.</p></div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="space-y-4 hover:shadow-orange-500/30 transform hover:scale-[1.01] transition duration-200">
              <feature.icon className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
              <a href="#" className="flex items-center text-orange-400 hover:text-orange-300 text-sm font-medium">Learn More <ArrowRight className="w-4 h-4 ml-1" /></a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ setAuthView }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const plans = [
    { title: "Free", priceMonthly: 0, priceAnnual: 0, desc: "Perfect for getting started", features: ["100 links per month", "Basic analytics (30 days)", "1 custom domain", "AI-powered URL naming", "QR code generation", "Browser extension"], cta: "Get Started Free", variant: 'secondary', action: () => setAuthView('signup'), noCard: true },
    { title: "Pro", priceMonthly: 29, priceAnnual: 23, desc: "For growing businesses", features: ["Everything in Free, plus:", "5,000 links per month", "Advanced analytics (1 year)", "25 custom domains", "Team collaboration (5 users)", "Link expiration & passwords", "UTM builder", "Priority support"], cta: "Start 14-Day Free Trial", variant: 'primary', action: () => setAuthView('signup'), popular: true, noCard: true },
    { title: "Enterprise", priceMonthly: 'Custom', priceAnnual: 'Custom', desc: "For large organizations", features: ["Everything in Pro, plus:", "Unlimited links", "Unlimited team members", "SSO/SAML integration", "99.9% SLA guarantee", "Dedicated account manager", "Custom integrations", "Advanced security & compliance"], cta: "Contact Sales", variant: 'secondary', action: () => setAuthView('enterprise'), noCard: false, contactSales: true },
  ];
  
  const PriceDisplay = ({ plan }) => {
    const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
    const isCustom = price === 'Custom';
    return (
      <div className="flex items-end space-x-1 mb-4 h-10">
        <span className="text-4xl font-extrabold text-white">{isCustom ? price : `$${price}`}</span>
        {!isCustom && <span className="text-slate-400 mb-1">/{isAnnual ? 'month' : 'month'}</span>}
      </div>
    );
  };

  return (
    <section id="pricing" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-white mb-2">Simple, Transparent Pricing</h2><p className="text-xl text-slate-400">Start free, upgrade when you need more power</p></div>
        <div className="flex justify-center mb-12">
          <div className="relative flex p-1 bg-slate-800 rounded-full">
            <button onClick={() => setIsAnnual(false)} className={`px-6 py-2 text-sm font-medium rounded-full transition duration-300 ${!isAnnual ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Monthly</button>
            <button onClick={() => setIsAnnual(true)} className={`relative px-6 py-2 text-sm font-medium rounded-full transition duration-300 ${isAnnual ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Annual <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 py-0.5 text-xs font-bold text-slate-900 bg-amber-300 rounded-full shadow-lg">SAVE 20%</span></button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`flex flex-col transform hover:scale-[1.01] transition duration-300 ${plan.popular ? 'border-orange-600 border-2 shadow-orange-500/50' : 'border-slate-800'}`}>
              {plan.popular && <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 text-xs font-bold text-slate-900 bg-orange-500 rounded-full shadow-lg uppercase tracking-wider">MOST POPULAR</span>}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
              <p className="text-slate-400 mb-4 h-12">{plan.desc}</p>
              <PriceDisplay plan={plan} />
              <div className="border-t border-slate-800/50 pt-6 mb-8 flex-grow">
                <ul className="space-y-3 text-slate-300">{plan.features.map((feature, i) => (<li key={i} className="flex items-start space-x-3"><Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" /><span className="text-sm">{feature}</span></li>))}</ul>
              </div>
              <div className="mt-6"><Button onClick={plan.action} variant={plan.variant} fullWidth>{plan.cta}</Button></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- AUTH COMPONENTS ---

const AuthLayout = ({ title, children, onBack }) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
    <div className="fixed top-6 left-6 z-20">
      <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </button>
    </div>
    <Card className="w-full max-w-md relative z-10 border-slate-800 bg-slate-900/90 backdrop-blur-xl">
      <div className="flex justify-center mb-6"><DashDigLogo showTagline={false} /></div>
      <h2 className="text-3xl font-bold text-center text-white mb-2">{title}</h2>
      <div className="mt-8">{children}</div>
    </Card>
  </div>
);

const LoginView = ({ onLogin, setAuthView }) => {
  const [loading, setLoading] = useState(false);
  const handleSignIn = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 1500); };
  return (
    <AuthLayout title="Welcome back" onBack={() => setAuthView('landing')}>
      <div className="space-y-3">
        <Button variant="social-google" fullWidth icon={Loader}>Continue with Google</Button>
        <Button variant="social-apple" fullWidth icon={Loader}>Continue with Apple</Button>
      </div>
      <div className="relative flex py-6 items-center">
        <div className="flex-grow border-t border-slate-700"></div>
        <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase">or</span>
        <div className="flex-grow border-t border-slate-700"></div>
      </div>
      <form onSubmit={handleSignIn} className="space-y-4">
        <Input type="email" placeholder="your.email@example.com" />
        <Input type="password" placeholder="Password" suffix={<span className="text-xs text-slate-400 cursor-pointer hover:text-white">Show</span>} />
        <Button type="submit" fullWidth loading={loading}>Sign In</Button>
      </form>
      <div className="text-center text-sm pt-4"><button onClick={() => setAuthView('signup')} className="text-orange-400 hover:text-orange-300 font-medium">Create account</button></div>
    </AuthLayout>
  );
};

const SignUpView = ({ onLogin, setAuthView }) => {
  const [loading, setLoading] = useState(false);
  const handleSignUp = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 1500); };
  return (
    <AuthLayout title="Create your account" onBack={() => setAuthView('landing')}>
      <form onSubmit={handleSignUp} className="space-y-4">
        <Input placeholder="Full Name" required />
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Button type="submit" fullWidth loading={loading}>Create Account</Button>
      </form>
      <div className="text-center text-sm pt-4"><button onClick={() => setAuthView('login')} className="text-orange-400 hover:text-orange-300 font-medium">Sign in</button></div>
    </AuthLayout>
  );
};

// --- DASHBOARD COMPONENTS ---

const Sidebar = ({ currentView, setCurrentView, currentUser, onLogout }) => {
  const links = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'links', label: 'My Links', icon: LinkIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'widgets', label: 'Widgets', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      <div className="p-6 border-b border-slate-800"><DashDigLogo onClick={() => setCurrentView('overview')} /></div>
      <nav className="flex-grow p-4 space-y-1">
        {links.map((link) => (
          <button key={link.id} onClick={() => setCurrentView(link.id)} className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${currentView === link.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <link.icon className={`w-5 h-5 mr-3 ${currentView === link.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            <span className="font-medium text-sm">{link.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">{currentUser.initials}</div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser.plan} Plan</p>
          </div>
        </div>
        <Button variant="danger" fullWidth onClick={onLogout} icon={LogOut} className="justify-start pl-4 text-sm">Sign Out</Button>
      </div>
    </div>
  );
};

const DashboardHeader = ({ title, onOpenCreateModal, setIsMobileMenuOpen }) => (
  <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
    <div className="flex items-center">
      <button className="md:hidden mr-4 text-slate-400" onClick={() => setIsMobileMenuOpen(true)}><MenuIcon className="w-6 h-6" /></button>
      <h1 className="text-xl font-bold text-white capitalize">{title}</h1>
    </div>
    <div className="flex items-center space-x-4">
      <div className="hidden md:block w-64"><Input placeholder="Search links..." icon={Search} className="m-0" /></div>
      <Button onClick={onOpenCreateModal} icon={Plus} className="hidden sm:flex">New Link</Button>
    </div>
  </header>
);

const DashboardOverview = ({ analytics }) => {
  const deferredAnalytics = useDeferredValue(analytics);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Clicks" value={deferredAnalytics.stats.totalClicks.toLocaleString()} change={12.5} Icon={Zap} sparklineData={deferredAnalytics.sparklines.clicks} />
        <StatsCard title="Unique Visitors" value={deferredAnalytics.stats.uniqueVisitors.toLocaleString()} change={8.3} Icon={User} sparklineData={deferredAnalytics.sparklines.visitors} />
        <StatsCard title="Active Links" value="24" change={2.1} Icon={LinkIcon} sparklineData={deferredAnalytics.sparklines.activeLinks} />
        <StatsCard title="Avg. CTR" value="4.2%" change={-0.5} Icon={Target} sparklineData={deferredAnalytics.sparklines.clickRate} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96">
          <BarChartComponent data={deferredAnalytics.chartData} title="Traffic Overview" />
        </div>
        <Card>
          <h3 className="font-semibold text-white mb-4">Top Locations</h3>
          <div className="space-y-4">
            {[ { c: '🇺🇸 United States', v: 45 }, { c: '🇬🇧 United Kingdom', v: 18 }, { c: '🇩🇪 Germany', v: 12 }, { c: '🇨🇦 Canada', v: 8 } ].map((loc, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{loc.c}</span>
                <div className="flex items-center space-x-2 w-1/2">
                  <div className="flex-grow h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600 rounded-full" style={{ width: `${loc.v}%` }}></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 w-8 text-right">{loc.v}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [view, setView] = useState('landing');
  const [dashboardView, setDashboardView] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@dashdig.com', initials: 'DU', plan: 'Pro' });

  const analytics = {
    stats: {
      totalClicks: 12450,
      uniqueVisitors: 8900,
      sparklines: {
        clicks: [40, 60, 45, 70, 80, 65, 90],
        visitors: [30, 50, 40, 60, 70, 55, 80],
        activeLinks: [20, 20, 21, 22, 22, 23, 24],
        clickRate: [3, 4, 3.5, 4.2, 4.5, 4.1, 4.2],
      }
    },
    chartData: [
      { day: 'Mon', clicks: 850 }, { day: 'Tue', clicks: 1200 }, { day: 'Wed', clicks: 950 },
      { day: 'Thu', clicks: 1400 }, { day: 'Fri', clicks: 1100 }, { day: 'Sat', clicks: 600 }, { day: 'Sun', clicks: 400 }
    ]
  };

  const showToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg, type }]);
  };
  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleLogin = () => {
    setView('dashboard');
    showToast('Successfully signed in', 'success');
  };

  if (view === 'landing') return (
    <>
      <GlobalStyles />
      <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-orange-500/30">
        <header className="sticky top-0 z-20 p-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 flex justify-between items-center h-16">
          <DashDigLogo onClick={() => setView('landing')} />
          <div className="flex space-x-4 items-center text-sm font-medium">
            <a href="#features" className="text-slate-300 hover:text-orange-400 transition hidden md:block">Features</a>
            <a href="#pricing" className="text-slate-300 hover:text-orange-400 transition hidden md:block">Pricing</a>
            <button onClick={() => setView('login')} className="text-slate-300 hover:text-orange-400 transition">LOGIN</button>
            <Button onClick={() => setView('signup')} className="px-4 py-2 text-sm">Get Started</Button>
          </div>
        </header>
        <Hero onOpenCreateModal={() => setView('signup')} setAuthView={setView} />
        <HowItWorks />
        <Features />
        <Pricing setAuthView={setView} setLandingView={setView} />
        <footer className="bg-slate-950 border-t border-slate-900 py-12 text-center text-slate-500 text-sm">
          <div className="flex justify-center space-x-6 mb-4"><Github className="w-5 h-5 hover:text-white cursor-pointer"/><Twitter className="w-5 h-5 hover:text-white cursor-pointer"/><Linkedin className="w-5 h-5 hover:text-white cursor-pointer"/></div>
          <p>© 2025 DashDig Inc. All rights reserved.</p>
        </footer>
      </div>
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">{toasts.map(t => <div className="pointer-events-auto" key={t.id}><Toast {...t} onDismiss={dismissToast} /></div>)}</div>
    </>
  );

  if (view === 'login') return (
    <>
      <GlobalStyles />
      <LoginView onLogin={handleLogin} setAuthView={setView} />
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">{toasts.map(t => <div className="pointer-events-auto" key={t.id}><Toast {...t} onDismiss={dismissToast} /></div>)}</div>
    </>
  );

  if (view === 'signup') return (
    <>
      <GlobalStyles />
      <SignUpView onLogin={handleLogin} setAuthView={setView} />
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">{toasts.map(t => <div className="pointer-events-auto" key={t.id}><Toast {...t} onDismiss={dismissToast} /></div>)}</div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <GlobalStyles />
      <Sidebar currentView={dashboardView} setCurrentView={setDashboardView} currentUser={user} onLogout={() => setView('landing')} />
      <div className="flex-1 flex flex-col md:ml-64 h-full overflow-hidden">
        <DashboardHeader title={dashboardView} onOpenCreateModal={() => setIsCreateModalOpen(true)} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {dashboardView === 'overview' && <DashboardOverview analytics={analytics} />}
          {dashboardView !== 'overview' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Code className="w-16 h-16 mb-4 opacity-20" />
              <p>View: {dashboardView} (Restored from Full Codebase)</p>
            </div>
          )}
        </main>
      </div>
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">{toasts.map(t => <div className="pointer-events-auto" key={t.id}><Toast {...t} onDismiss={dismissToast} /></div>)}</div>
      
      {isCreateModalOpen && (
        <Modal title="Create New Link" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="max-w-lg">
           <div className="space-y-4">
             <Input label="Destination URL" placeholder="https://example.com" icon={LinkIcon} />
             <div className="flex gap-2">
                <Input label="Custom Slug (Optional)" prefix="dashdig.com/" placeholder="summer-sale" className="flex-grow" />
                <div className="mt-6"><Button variant="secondary" icon={Zap}>AI</Button></div>
             </div>
             <Button fullWidth onClick={() => { setIsCreateModalOpen(false); showToast('Link created successfully!', 'success'); }}>Create Link</Button>
           </div>
        </Modal>
      )}
    </div>
  );
};

export default App;