'use client';

import { Zap } from 'lucide-react';

interface AvatarProps {
  name?: string;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showImage?: boolean; // Option to force custom avatar even if image exists
}

export default function Avatar({ 
  name = 'User', 
  image = null, 
  size = 'md', 
  className = '',
  showImage = true // Default to showing Google image if available
}: AvatarProps) {
  const getInitials = (name: string) => {
    if (!name || name === 'User' || name === 'Guest User') return 'U';
    
    return name
      .trim()
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl'
  };

  const lightningSize = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  // If user has a Google profile image and we want to show it
  if (showImage && image) {
    return (
      <div className={`relative rounded-full overflow-hidden ring-2 ring-orange-500/50 ${sizeClasses[size]} ${className}`}>
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Otherwise show custom branded avatar with initials
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        boxShadow: '0 2px 8px rgba(249, 115, 22, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* Lightning bolt watermark - More visible at 40% opacity */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <Zap 
          className={`${lightningSize[size]} text-amber-200 fill-amber-200`}
          style={{ transform: 'rotate(15deg)' }}
        />
      </div>
      
      {/* Glass effect overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
        style={{ mixBlendMode: 'overlay' }}
      />
      
      {/* Initials */}
      <span className="relative z-10 font-bold tracking-wide drop-shadow-sm">
        {getInitials(name)}
      </span>
    </div>
  );
}

// Optional: Avatar with dropdown/click functionality
export function AvatarButton({ 
  name, 
  image, 
  size = 'md',
  showImage = true,
  onClick,
  className = ''
}: AvatarProps & { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all rounded-full ${className}`}
      aria-label="User menu"
    >
      <Avatar name={name} image={image} size={size} showImage={showImage} />
    </button>
  );
}

