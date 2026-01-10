import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className, style }: any) => (
    <a href={href} className={className} style={style}>
      {children}
    </a>
  );
});

describe('Button Component', () => {
  describe('Variants', () => {
    it('renders primary variant with orange background', () => {
      render(<Button variant="primary">Primary Button</Button>);
      
      const button = screen.getByRole('button', { name: /primary button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveStyle({ backgroundColor: '#FF6B35' });
      expect(button).toHaveClass('text-white');
    });

    it('renders secondary variant with white background', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      
      const button = screen.getByRole('button', { name: /secondary button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-transparent');
      expect(button).toHaveStyle({ color: '#1A1A1A' });
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading prop is true', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button', { name: /loading button/i });
      const spinner = button.querySelector('svg.animate-spin');
      
      expect(spinner).toBeInTheDocument();
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      );
      
      const button = screen.getByRole('button', { name: /disabled button/i });
      
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Link Rendering', () => {
    it('renders as Link when href is provided', () => {
      render(<Button href="/dashboard">Link Button</Button>);
      
      const link = screen.getByRole('link', { name: /link button/i });
      
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('renders as button when href is not provided', () => {
      render(<Button>Regular Button</Button>);
      
      const button = screen.getByRole('button', { name: /regular button/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable Button</Button>);
      
      const button = screen.getByRole('button', { name: /clickable button/i });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <Button loading onClick={handleClick}>
          Loading Button
        </Button>
      );
      
      const button = screen.getByRole('button', { name: /loading button/i });
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icon Rendering', () => {
    it('renders icon on left when icon prop provided', () => {
      const TestIcon = () => <span data-testid="test-icon">★</span>;
      render(<Button icon={<TestIcon />}>Icon Button</Button>);
      
      const button = screen.getByRole('button', { name: /icon button/i });
      const icon = screen.getByTestId('test-icon');
      
      expect(icon).toBeInTheDocument();
      
      // Verify icon comes before text (is on the left)
      const children = Array.from(button.children);
      const iconWrapper = children.find(child => child.contains(icon));
      const textSpan = children.find(child => child.textContent === 'Icon Button');
      
      expect(children.indexOf(iconWrapper!)).toBeLessThan(children.indexOf(textSpan!));
    });

    it('renders iconRight on right side', () => {
      const TestIcon = () => <span data-testid="right-icon">→</span>;
      render(<Button iconRight={<TestIcon />}>Button With Right Icon</Button>);
      
      const button = screen.getByRole('button', { name: /button with right icon/i });
      const icon = screen.getByTestId('right-icon');
      
      expect(icon).toBeInTheDocument();
      
      // Verify icon comes after text (is on the right)
      const children = Array.from(button.children);
      const iconWrapper = children.find(child => child.contains(icon));
      const textSpan = children.find(child => child.textContent === 'Button With Right Icon');
      
      expect(children.indexOf(iconWrapper!)).toBeGreaterThan(children.indexOf(textSpan!));
    });

    it('does not render icon when loading', () => {
      const TestIcon = () => <span data-testid="test-icon">★</span>;
      render(
        <Button loading icon={<TestIcon />}>
          Loading With Icon
        </Button>
      );
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
      expect(screen.getByRole('button').querySelector('svg.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-2', 'px-4', 'text-sm');
    });

    it('renders medium size correctly (default)', () => {
      render(<Button>Medium Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-3', 'px-6', 'text-base');
    });

    it('renders large size correctly', () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-4', 'px-8', 'text-lg');
    });
  });

  describe('Additional Props', () => {
    it('supports fullWidth prop', () => {
      render(<Button fullWidth>Full Width Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('supports custom className', () => {
      render(<Button className="custom-class">Custom Class Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('supports type prop', () => {
      render(<Button type="submit">Submit Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('defaults to type="button"', () => {
      render(<Button>Default Type Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
