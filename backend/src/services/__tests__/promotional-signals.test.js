const DashdigAIEngine = require('../ai-engine.service');

// Mock the Anthropic client
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ text: '[]' }]
      })
    }
  }));
});

describe('Promotional Signal Detection', () => {
  let aiEngine;

  beforeEach(() => {
    aiEngine = new DashdigAIEngine();
  });

  describe('Discount Signals', () => {
    it('detects "50% off" as discount signal', () => {
      const metadata = {
        title: 'Amazing Product - 50% off Today!',
        description: 'Get this product at half price'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'discount',
            priority: 'high'
          })
        ])
      );
      
      const discountSignal = signals.find(s => s.type === 'discount');
      expect(discountSignal.match).toMatch(/50%\s*off/i);
    });

    it('detects "save $20" as discount signal', () => {
      const metadata = {
        title: 'Save $20 on Your Order',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);
      const discountSignal = signals.find(s => s.type === 'discount');

      expect(discountSignal).toBeDefined();
      expect(discountSignal.priority).toBe('high');
    });

    it('detects "sale" as discount signal', () => {
      const metadata = {
        title: 'Summer Sale Event',
        description: 'Shop our biggest sale'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'discount')).toBe(true);
    });
  });

  describe('Urgency Signals', () => {
    it('detects "limited time" as urgency signal', () => {
      const metadata = {
        title: 'Limited Time Offer',
        description: 'This deal won\'t last long'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'urgency',
            priority: 'high'
          })
        ])
      );
      
      const urgencySignal = signals.find(s => s.type === 'urgency');
      expect(urgencySignal.match).toMatch(/limited\s*time/i);
    });

    it('detects "ends today" as urgency signal', () => {
      const metadata = {
        title: 'Flash Deal - Ends Today!',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);
      const urgencySignal = signals.find(s => s.type === 'urgency');

      expect(urgencySignal).toBeDefined();
      expect(urgencySignal.priority).toBe('high');
    });

    it('detects "last chance" as urgency signal', () => {
      const metadata = {
        title: 'Last Chance to Save',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'urgency')).toBe(true);
    });
  });

  describe('Social Signals', () => {
    it('detects "bestseller" as social signal', () => {
      const metadata = {
        title: '#1 Bestseller in Electronics',
        description: 'The most popular choice'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'social',
            priority: 'medium'
          })
        ])
      );
      
      const socialSignal = signals.find(s => s.type === 'social');
      expect(socialSignal.match).toMatch(/bestsell/i);
    });

    it('detects "top rated" as social signal', () => {
      const metadata = {
        title: 'Top Rated Product',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'social')).toBe(true);
    });

    it('detects "trending" as social signal', () => {
      const metadata = {
        title: 'Trending Now',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'social')).toBe(true);
    });
  });

  describe('Scarcity Signals', () => {
    it('detects "only 3 left" as scarcity signal', () => {
      const metadata = {
        title: 'Popular Item',
        description: 'Only 3 left in stock'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'scarcity',
            priority: 'high'
          })
        ])
      );
      
      const scarcitySignal = signals.find(s => s.type === 'scarcity');
      expect(scarcitySignal.match).toMatch(/only\s*3\s*left/i);
    });

    it('detects "low stock" as scarcity signal', () => {
      const metadata = {
        title: 'Low Stock Warning',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'scarcity')).toBe(true);
    });

    it('detects "limited edition" as scarcity signal', () => {
      const metadata = {
        title: 'Limited Edition Release',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'scarcity')).toBe(true);
    });
  });

  describe('Non-Promotional Content', () => {
    it('returns empty array for non-promotional content', () => {
      const metadata = {
        title: 'Product Documentation',
        description: 'Learn how to use this product effectively'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals).toEqual([]);
    });

    it('returns empty array for empty metadata', () => {
      const metadata = {
        title: '',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals).toEqual([]);
    });

    it('returns empty array for undefined metadata fields', () => {
      const metadata = {};

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals).toEqual([]);
    });
  });

  describe('Priority Sorting', () => {
    it('sorts by priority (high first)', () => {
      const metadata = {
        title: 'Bestseller - 50% off - Limited Time Only!',
        description: 'Top rated product on sale'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      // Should have multiple signals
      expect(signals.length).toBeGreaterThan(1);

      // Verify sorted by priority: high, medium, low
      const priorities = signals.map(s => s.priority);
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      
      for (let i = 1; i < priorities.length; i++) {
        expect(priorityOrder[priorities[i - 1]]).toBeLessThanOrEqual(
          priorityOrder[priorities[i]]
        );
      }
    });

    it('places high priority signals before medium priority', () => {
      const metadata = {
        title: 'Trending Bestseller with 30% off',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);
      
      // Find first high and first medium priority signal
      const highIndex = signals.findIndex(s => s.priority === 'high');
      const mediumIndex = signals.findIndex(s => s.priority === 'medium');

      if (highIndex !== -1 && mediumIndex !== -1) {
        expect(highIndex).toBeLessThan(mediumIndex);
      }
    });

    it('places medium priority signals before low priority', () => {
      const metadata = {
        title: 'New Arrival - Top Rated',
        description: 'Introducing our brand new product'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);
      
      // Find indices of different priorities
      const mediumIndex = signals.findIndex(s => s.priority === 'medium');
      const lowIndex = signals.findIndex(s => s.priority === 'low');

      if (mediumIndex !== -1 && lowIndex !== -1) {
        expect(mediumIndex).toBeLessThan(lowIndex);
      }
    });
  });

  describe('Additional Signal Types', () => {
    it('detects "free shipping" as free signal', () => {
      const metadata = {
        title: 'Free Shipping on All Orders',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'free')).toBe(true);
    });

    it('detects "new arrival" as new signal', () => {
      const metadata = {
        title: 'New Arrival - Just Launched',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'new')).toBe(true);
    });

    it('detects "exclusive" as exclusive signal', () => {
      const metadata = {
        title: 'Exclusive Members Only Deal',
        description: ''
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'exclusive')).toBe(true);
    });

    it('detects "money back guarantee" as guarantee signal', () => {
      const metadata = {
        title: 'Risk Free Purchase',
        description: '30-day money back guarantee'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'guarantee')).toBe(true);
    });
  });

  describe('Price Signal Detection', () => {
    it('detects price in metadata', () => {
      const metadata = {
        title: 'Great Product',
        description: '',
        price: '$49.99'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);

      expect(signals.some(s => s.type === 'price')).toBe(true);
    });

    it('extracts price value from metadata', () => {
      const metadata = {
        title: 'Premium Product',
        description: '',
        price: '$199.00'
      };

      const signals = aiEngine.detectPromotionalSignals(metadata);
      const priceSignal = signals.find(s => s.type === 'price');

      expect(priceSignal).toBeDefined();
      expect(priceSignal.match).toContain('$199');
    });
  });
});
