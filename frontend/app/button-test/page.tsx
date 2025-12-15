'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { LightningBolt } from '@/src/components/ui/LightningBolt';

export default function ButtonTestPage() {
  const [clickCount, setClickCount] = useState(0);

  const variants = ['primary', 'secondary', 'ghost', 'outline'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F5F5DC',
      padding: '40px 20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#1A1A1A'
          }}>
            Button Component Test Suite
          </h1>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Testing all variants, sizes, icons, hover states, loading and disabled states
          </p>
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            backgroundColor: '#fff',
            border: '2px solid #1A1A1A',
            borderRadius: '8px'
          }}>
            <strong>Click Counter:</strong> {clickCount} clicks
          </div>
        </header>

        {/* Section 1: All Variants in Medium Size */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            1. All Variants (Medium Size)
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {variants.map(variant => (
              <Button
                key={variant}
                variant={variant}
                onClick={() => setClickCount(prev => prev + 1)}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
        </section>

        {/* Section 2: All Sizes (Primary Variant) */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            2. All Sizes - Primary Variant
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {sizes.map(size => (
              <Button
                key={size}
                variant="primary"
                size={size}
                onClick={() => setClickCount(prev => prev + 1)}
              >
                Size: {size.toUpperCase()}
              </Button>
            ))}
          </div>
        </section>

        {/* Section 3: All Sizes (Secondary Variant) */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            3. All Sizes - Secondary Variant
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {sizes.map(size => (
              <Button
                key={size}
                variant="secondary"
                size={size}
                onClick={() => setClickCount(prev => prev + 1)}
              >
                Size: {size.toUpperCase()}
              </Button>
            ))}
          </div>
        </section>

        {/* Section 4: Buttons with Icons (Left) */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            4. Buttons with Icons (Left Position)
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {variants.map(variant => (
              <Button
                key={variant}
                variant={variant}
                icon={<LightningBolt size="md" />}
                onClick={() => setClickCount(prev => prev + 1)}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
        </section>

        {/* Section 5: Buttons with Icons (Right) */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            5. Buttons with Icons (Right Position)
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {variants.map(variant => (
              <Button
                key={variant}
                variant={variant}
                iconRight={<LightningBolt size="md" />}
                onClick={() => setClickCount(prev => prev + 1)}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
        </section>

        {/* Section 6: Icon Sizes */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            6. Icon Sizes (Small, Medium, Large buttons)
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Button
              variant="primary"
              size="sm"
              icon={<LightningBolt size="sm" />}
              onClick={() => setClickCount(prev => prev + 1)}
            >
              Small + Icon
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<LightningBolt size="md" />}
              onClick={() => setClickCount(prev => prev + 1)}
            >
              Medium + Icon
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={<LightningBolt size="lg" />}
              onClick={() => setClickCount(prev => prev + 1)}
            >
              Large + Icon
            </Button>
          </div>
        </section>

        {/* Section 7: Loading States */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            7. Loading States (All Variants)
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {variants.map(variant => (
              <Button
                key={variant}
                variant={variant}
                loading={true}
              >
                Loading...
              </Button>
            ))}
          </div>
        </section>

        {/* Section 8: Disabled States */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            8. Disabled States (All Variants)
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {variants.map(variant => (
              <Button
                key={variant}
                variant={variant}
                disabled={true}
              >
                Disabled
              </Button>
            ))}
          </div>
        </section>

        {/* Section 9: Disabled with Icons */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            9. Disabled with Icons
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {variants.map(variant => (
              <Button
                key={variant}
                variant={variant}
                icon={<LightningBolt size="md" />}
                disabled={true}
              >
                Disabled + Icon
              </Button>
            ))}
          </div>
        </section>

        {/* Section 10: All Variants × All Sizes Grid */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            10. Complete Grid: All Variants × All Sizes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {variants.map(variant => (
              <div key={variant}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '12px',
                  color: '#1A1A1A',
                  textTransform: 'capitalize'
                }}>
                  {variant}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  {sizes.map(size => (
                    <Button
                      key={`${variant}-${size}`}
                      variant={variant}
                      size={size}
                      onClick={() => setClickCount(prev => prev + 1)}
                    >
                      {size.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 11: Full Width Buttons */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            11. Full Width Buttons
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {variants.map(variant => (
              <Button
                key={variant}
                variant={variant}
                fullWidth={true}
                onClick={() => setClickCount(prev => prev + 1)}
              >
                Full Width {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
        </section>

        {/* Section 12: Hover State Instructions */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            12. Hover State Testing
          </h2>
          <div style={{ 
            padding: '24px', 
            backgroundColor: '#fff',
            border: '2px solid #1A1A1A',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
              Expected Hover Behaviors:
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '24px', lineHeight: '1.8' }}>
              <li><strong>Primary:</strong> Background changes to #E55A2B, shadow increases</li>
              <li><strong>Secondary:</strong> Background changes to #FF6B35, text becomes white, shadow increases</li>
              <li><strong>Ghost:</strong> Text color changes to #FF6B35</li>
              <li><strong>Outline:</strong> Background changes to #1A1A1A, text becomes white</li>
              <li><strong>Shadow variants (Primary, Secondary):</strong> Translate animation with increased shadow</li>
            </ul>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {variants.map(variant => (
              <Button
                key={variant}
                variant={variant}
                icon={<LightningBolt size="md" />}
                onClick={() => setClickCount(prev => prev + 1)}
              >
                Hover Me - {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
        </section>

        {/* Test Results Summary */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: '#1A1A1A',
            borderBottom: '3px solid #FF6B35',
            paddingBottom: '8px'
          }}>
            ✅ Test Checklist
          </h2>
          <div style={{ 
            padding: '24px', 
            backgroundColor: '#fff',
            border: '2px solid #1A1A1A',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>All 4 variants render correctly (primary, secondary, ghost, outline)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>All 3 sizes work properly (sm, md, lg)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>Icons (LightningBolt) display correctly in all positions</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>Hover states work with correct colors and animations</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>Loading state shows spinner and prevents clicks</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>Disabled state prevents interaction and shows opacity</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>No console errors</span>
              </label>
            </div>
          </div>
        </section>

        <footer style={{ 
          marginTop: '60px', 
          paddingTop: '20px', 
          borderTop: '2px solid #1A1A1A',
          textAlign: 'center',
          color: '#666'
        }}>
          <p>Button Component Test Suite • {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
}
