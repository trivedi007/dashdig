import Link from 'next/link';
import LightningBolt from '../ui/LightningBolt';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  variant?: 'light' | 'dark';
  href?: string;
  onClick?: () => void;
}

const Logo = ({ size = 'lg', showTagline = true, variant = 'light', href, onClick }: LogoProps) => {
  const content = (
    <div className={`logo ${variant === 'dark' ? 'logo-dark' : ''}`}>
      <div className="logo-icon">
        <LightningBolt size={size} />
      </div>
      <div className="logo-text-group">
        <span className="logo-text">Dashdig</span>
        {showTagline && (
          <span className="logo-tagline">HUMANIZE • SHORTENIZE • URLS</span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  if (onClick) {
    return (
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        {content}
      </div>
    );
  }
  
  return content;
};

export { Logo };
export default Logo;

