/**
 * Button Component Showcase
 * 
 * Visual examples of all button variants, sizes, and states
 * for the Dashdig design system.
 */

import React, { useState } from 'react';
import Button, { 
  DigButton,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  OutlineButton,
} from '../components/ui/Button';
import { Plus, ArrowRight, Download, Settings, Trash2, Lock } from 'lucide-react';

export function ButtonShowcase() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-8 space-y-12 bg-bg-dark min-h-screen">
      <h1 className="text-4xl font-display font-bold text-white mb-8">
        Dashdig Button Showcase
      </h1>

      {/* Variants */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <DigButton>DIG THIS!</DigButton>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Sizes
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          With Icons
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={<Plus size={16} />}>
            Create Link
          </Button>
          <Button variant="secondary" iconRight={<ArrowRight size={16} />}>
            Continue
          </Button>
          <Button 
            variant="primary" 
            icon={<Download size={16} />}
            iconRight={<ArrowRight size={16} />}
          >
            Download Report
          </Button>
          <DigButton size="lg">Quick Create</DigButton>
        </div>
      </section>

      {/* States */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          States
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Normal</Button>
          <Button 
            variant="primary" 
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
          >
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* Full Width */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Full Width
        </h2>
        <div className="space-y-3 max-w-md">
          <Button variant="primary" fullWidth size="lg">
            Sign Up Now
          </Button>
          <Button variant="secondary" fullWidth>
            Learn More
          </Button>
          <Button variant="ghost" fullWidth>
            Skip for Now
          </Button>
        </div>
      </section>

      {/* Button Groups */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Button Groups
        </h2>
        <div className="space-y-6">
          {/* Hero CTA Group */}
          <div className="flex gap-4">
            <DigButton size="lg">Get Started Free</DigButton>
            <Button variant="secondary" size="lg">
              Watch Demo
            </Button>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary" icon={<Settings size={16} />}>
              Save Settings
            </Button>
          </div>

          {/* Destructive Action */}
          <div className="flex gap-3">
            <Button variant="secondary">Keep</Button>
            <Button 
              variant="primary" 
              icon={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </div>
        </div>
      </section>

      {/* Dark vs Light Backgrounds */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          On Different Backgrounds
        </h2>
        
        {/* Dark Background */}
        <div className="bg-bg-dark p-6 rounded-lg mb-4 border-2 border-brutalist-black">
          <p className="text-text-secondary mb-4">Dark Background:</p>
          <div className="flex gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        {/* Light Background */}
        <div className="bg-white p-6 rounded-lg border-2 border-brutalist-black">
          <p className="text-slate-600 mb-4">Light Background:</p>
          <div className="flex gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
      </section>

      {/* Loading Examples */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Loading States
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" loading>
            Creating Link...
          </Button>
          <Button variant="secondary" loading icon={<Download size={16} />}>
            Downloading...
          </Button>
          <DigButton loading>
            Processing...
          </DigButton>
        </div>
      </section>

      {/* Disabled Examples */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Disabled States
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" disabled>
            Unavailable
          </Button>
          <Button variant="secondary" disabled icon={<Lock size={16} />}>
            Locked Feature
          </Button>
          <DigButton disabled>
            Not Ready
          </DigButton>
        </div>
      </section>

      {/* With Links */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          As Links
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" href="/signup">
            Sign Up
          </Button>
          <Button variant="secondary" href="/pricing">
            View Pricing
          </Button>
          <Button variant="ghost" href="/docs">
            Documentation
          </Button>
        </div>
      </section>

      {/* Convenience Exports */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Convenience Components
        </h2>
        <div className="flex flex-wrap gap-4">
          <PrimaryButton>Primary</PrimaryButton>
          <SecondaryButton>Secondary</SecondaryButton>
          <GhostButton>Ghost</GhostButton>
          <OutlineButton>Outline</OutlineButton>
          <DigButton>Dig Button</DigButton>
        </div>
      </section>
    </div>
  );
}

export default ButtonShowcase;

