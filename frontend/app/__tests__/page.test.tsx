import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SessionProvider } from 'next-auth/react';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock the api module
jest.mock('../../lib/api', () => ({
  api: {
    shortenUrl: jest.fn().mockResolvedValue({ slug: 'Test.Slug.Here' }),
  },
}));

// Mock qrcode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockQRCode'),
}));

// Import the App component after mocks
import App from '../page';

// Wrapper component with SessionProvider
const renderWithSession = (component: React.ReactNode) => {
  return render(
    <SessionProvider session={null}>
      {component}
    </SessionProvider>
  );
};

describe('Landing Page', () => {
  describe('Header', () => {
    it('renders header with logo', () => {
      renderWithSession(<App />);
      
      // Check for DashDig logo text
      expect(screen.getByText('Dash')).toBeInTheDocument();
      expect(screen.getByText('dig')).toBeInTheDocument();
      
      // Check for tagline
      expect(screen.getByText(/HUMANIZE.*SHORTENIZE.*URLS/i)).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText('Docs')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Pricing')).toBeInTheDocument();
      expect(screen.getByText('How It Works')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });

    it('renders login and get started buttons', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText('LOGIN')).toBeInTheDocument();
      expect(screen.getByText('GET STARTED')).toBeInTheDocument();
    });
  });

  describe('Hero Section', () => {
    it('renders hero section with headline', () => {
      renderWithSession(<App />);
      
      // Check for main headlines
      expect(screen.getByText('URLS WITH')).toBeInTheDocument();
      expect(screen.getByText('ATTITUDE.')).toBeInTheDocument();
    });

    it('renders V2 badge', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText('V2.0 NOW AVAILABLE')).toBeInTheDocument();
    });

    it('renders before/after comparison cards', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText('BEFORE')).toBeInTheDocument();
      expect(screen.getByText('AFTER')).toBeInTheDocument();
      expect(screen.getByText('bit.ly/3xK9mZb')).toBeInTheDocument();
      expect(screen.getByText('dashdig.com/Best.Coffee.Seattle')).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('renders all 6 feature cards', () => {
      renderWithSession(<App />);
      
      const featureTitles = [
        'AI-Powered Slugs',
        'Custom Domains',
        'Deep Analytics',
        'Widget Integration',
        'Link Management',
        'Password Protection',
      ];

      featureTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it('renders feature section header', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText('FEATURES BUILT FOR CONVERSION')).toBeInTheDocument();
      expect(screen.getByText('Everything you need to humanize your URLs.')).toBeInTheDocument();
    });

    it('renders learn more links for features', () => {
      renderWithSession(<App />);
      
      const learnMoreLinks = screen.getAllByText('Learn More');
      expect(learnMoreLinks.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Pricing Section', () => {
    it('renders all 5 pricing tiers', () => {
      renderWithSession(<App />);
      
      const pricingTiers = ['Free', 'Starter', 'Pro', 'Business', 'Enterprise'];
      
      pricingTiers.forEach(tier => {
        expect(screen.getByRole('heading', { name: tier })).toBeInTheDocument();
      });
    });

    it('renders pricing values', () => {
      renderWithSession(<App />);
      
      // Check for price values (some tiers have specific prices)
      expect(screen.getByText('$0')).toBeInTheDocument(); // Free tier
      expect(screen.getByText('$12')).toBeInTheDocument(); // Starter tier
      expect(screen.getByText('$29')).toBeInTheDocument(); // Pro tier
      expect(screen.getByText('$99')).toBeInTheDocument(); // Business tier
    });

    it('highlights popular plan', () => {
      renderWithSession(<App />);
      
      // Pro plan should be marked as popular
      expect(screen.getByText('MOST POPULAR')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders footer with links', () => {
      renderWithSession(<App />);
      
      // Check for footer section headers
      expect(screen.getByText('PRODUCT')).toBeInTheDocument();
      expect(screen.getByText('COMPANY')).toBeInTheDocument();
      expect(screen.getByText('RESOURCES')).toBeInTheDocument();
      expect(screen.getByText('LEGAL')).toBeInTheDocument();
    });

    it('renders footer product links', () => {
      renderWithSession(<App />);
      
      // Check for specific footer links under PRODUCT
      const footerLinks = ['Features', 'Pricing', 'API', 'Widget', 'Changelog', 'Status'];
      footerLinks.forEach(link => {
        const elements = screen.getAllByText(link);
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('renders copyright notice', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText(/© 2025 Dashdig. All rights reserved./)).toBeInTheDocument();
    });

    it('renders social media links', () => {
      renderWithSession(<App />);
      
      // Check for social icons (by their container classes or svg elements)
      const socialLinks = screen.getAllByRole('link');
      const socialContainers = socialLinks.filter(link => 
        link.className.includes('social-link') || link.querySelector('svg')
      );
      expect(socialContainers.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('URL Input', () => {
    it('URL input accepts text', () => {
      renderWithSession(<App />);
      
      const input = screen.getByPlaceholderText('paste_your_long_ugly_link_here');
      expect(input).toBeInTheDocument();
      
      fireEvent.change(input, { target: { value: 'https://example.com/very/long/url' } });
      expect(input).toHaveValue('https://example.com/very/long/url');
    });

    it('URL input is focusable', () => {
      renderWithSession(<App />);
      
      const input = screen.getByPlaceholderText('paste_your_long_ugly_link_here');
      fireEvent.focus(input);
      expect(document.activeElement).toBe(input);
    });
  });

  describe('DIG THIS Button', () => {
    it('DIG THIS button is clickable', () => {
      renderWithSession(<App />);
      
      const digButton = screen.getByRole('button', { name: /Dig This!/i });
      expect(digButton).toBeInTheDocument();
      expect(digButton).not.toBeDisabled();
    });

    it('DIG THIS button triggers shortening process', async () => {
      renderWithSession(<App />);
      
      // Enter a URL first
      const input = screen.getByPlaceholderText('paste_your_long_ugly_link_here');
      fireEvent.change(input, { target: { value: 'https://example.com/test' } });
      
      // Click the button
      const digButton = screen.getByRole('button', { name: /Dig This!/i });
      fireEvent.click(digButton);
      
      // Button should show loading state
      await waitFor(() => {
        expect(screen.getByText(/Digging.../i)).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('shows loading spinner when shortening', async () => {
      renderWithSession(<App />);
      
      const input = screen.getByPlaceholderText('paste_your_long_ugly_link_here');
      fireEvent.change(input, { target: { value: 'https://example.com/test' } });
      
      const digButton = screen.getByRole('button', { name: /Dig This!/i });
      fireEvent.click(digButton);
      
      // Should show "Digging..." text while loading
      await waitFor(() => {
        const loadingText = screen.queryByText(/Digging.../i);
        expect(loadingText).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('How It Works Section', () => {
    it('renders 3 steps', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText('Paste Your URL')).toBeInTheDocument();
      expect(screen.getByText('AI Creates Your Link')).toBeInTheDocument();
      expect(screen.getByText('Share & Track')).toBeInTheDocument();
    });

    it('renders step numbers', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Call to Action Section', () => {
    it('renders CTA section', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText('Ready to Dig This?')).toBeInTheDocument();
      expect(screen.getByText(/Join 10,000\+ marketers/)).toBeInTheDocument();
    });

    it('renders GET STARTED FREE buttons', () => {
      renderWithSession(<App />);
      
      const getStartedButtons = screen.getAllByText(/GET STARTED FREE/i);
      expect(getStartedButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Social Proof Section', () => {
    it('renders trusted by text', () => {
      renderWithSession(<App />);
      
      expect(screen.getByText(/Trusted by 10,000\+ marketers/)).toBeInTheDocument();
    });

    it('renders testimonials', () => {
      renderWithSession(<App />);
      
      // Check for testimonial names
      expect(screen.getByText('Alex T.')).toBeInTheDocument();
      expect(screen.getByText('Sarah L.')).toBeInTheDocument();
      expect(screen.getByText('Mark P.')).toBeInTheDocument();
    });
  });
});
