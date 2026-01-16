import Link from 'next/link';
import { ReactNode, ButtonHTMLAttributes, CSSProperties } from 'react';
import { colors, fonts } from '../../lib/design-tokens';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  href,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) => {
  // Size classes
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  // Variant classes and styles
  const getVariantConfig = () => {
    switch (variant) {
      case 'primary':
        return {
          classes: 'text-white border-2 hover:bg-white hover:text-[#FF6B35]',
          style: {
            backgroundColor: colors.accent,
            borderColor: colors.border,
          } as CSSProperties,
          shadow: true,
        };
      case 'secondary':
        return {
          classes: 'bg-transparent border-2 hover:bg-[#FF6B35] hover:text-white',
          style: {
            color: colors.textDark,
            borderColor: colors.border,
          } as CSSProperties,
          shadow: true,
        };
      case 'ghost':
        return {
          classes: 'bg-transparent hover:text-[#FF6B35]',
          style: {
            color: colors.textDark,
          } as CSSProperties,
          shadow: false,
        };
      case 'outline':
        return {
          classes: 'bg-transparent border-2 hover:bg-[#1A1A1A] hover:text-white',
          style: {
            color: colors.textDark,
            borderColor: colors.border,
          } as CSSProperties,
          shadow: false,
        };
    }
  };

  const variantConfig = getVariantConfig();

  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-lg font-bold
    transition-all duration-200
    ${sizeClasses[size]}
    ${variantConfig.classes}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${variantConfig.shadow ? 'shadow-[4px_4px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </>
  );

  const buttonStyle: CSSProperties = {
    fontFamily: fonts.display,
    ...variantConfig.style,
  };

  if (href && !disabled) {
    return (
      <Link href={href} className={baseClasses} style={buttonStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={baseClasses}
      style={buttonStyle}
      {...rest}
    >
      {content}
    </button>
  );
};

export { Button };
export default Button;

