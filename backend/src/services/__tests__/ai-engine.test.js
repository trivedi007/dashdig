const DashdigAIEngine = require('../ai-engine.service');

// Mock the Anthropic client
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ text: '[{"slug": "Test.Slug.Here", "style": "brand_focused", "reasoning": "Test reasoning"}]' }]
      })
    }
  }));
});

describe('AI Engine Model Selection', () => {
  let aiEngine;

  beforeEach(() => {
    // Create fresh instance for each test
    aiEngine = new DashdigAIEngine();
  });

  describe('selectModel', () => {
    it('returns HAIKU for free tier', () => {
      const model = aiEngine.selectModel({ userTier: 'free' });
      
      expect(model).toBe(aiEngine.models.HAIKU);
      expect(model).toBe('claude-haiku-4-5-20251001');
    });

    it('returns HAIKU for starter tier', () => {
      const model = aiEngine.selectModel({ userTier: 'starter' });
      
      expect(model).toBe(aiEngine.models.HAIKU);
      expect(model).toBe('claude-haiku-4-5-20251001');
    });

    it('returns SONNET for pro tier', () => {
      const model = aiEngine.selectModel({ userTier: 'pro' });
      
      expect(model).toBe(aiEngine.models.SONNET);
      expect(model).toBe('claude-sonnet-4-5-20250929');
    });

    it('returns SONNET for business tier', () => {
      const model = aiEngine.selectModel({ userTier: 'business' });
      
      expect(model).toBe(aiEngine.models.SONNET);
      expect(model).toBe('claude-sonnet-4-5-20250929');
    });

    it('returns OPUS for enterprise tier', () => {
      const model = aiEngine.selectModel({ userTier: 'enterprise' });
      
      expect(model).toBe(aiEngine.models.OPUS);
      expect(model).toBe('claude-opus-4-5-20251101');
    });

    it('returns OPUS for enterprise with brand guidelines', () => {
      const model = aiEngine.selectModel({ 
        userTier: 'enterprise', 
        hasBrandGuidelines: true 
      });
      
      expect(model).toBe(aiEngine.models.OPUS);
      expect(model).toBe('claude-opus-4-5-20251101');
    });
  });

  describe('Model Selection Edge Cases', () => {
    it('defaults to HAIKU when no tier specified', () => {
      const model = aiEngine.selectModel({});
      
      expect(model).toBe(aiEngine.models.HAIKU);
    });

    it('returns HAIKU for free tier even with promotional signals', () => {
      const model = aiEngine.selectModel({ 
        userTier: 'free', 
        hasPromotionalSignals: true 
      });
      
      expect(model).toBe(aiEngine.models.HAIKU);
    });

    it('returns HAIKU for starter tier with promotional signals', () => {
      const model = aiEngine.selectModel({ 
        userTier: 'starter', 
        hasPromotionalSignals: true 
      });
      
      expect(model).toBe(aiEngine.models.HAIKU);
    });

    it('returns SONNET for pro tier regardless of brand guidelines', () => {
      const model = aiEngine.selectModel({ 
        userTier: 'pro', 
        hasBrandGuidelines: true 
      });
      
      // Pro tier doesn't upgrade to OPUS even with brand guidelines
      expect(model).toBe(aiEngine.models.SONNET);
    });

    it('returns SONNET for business tier regardless of brand guidelines', () => {
      const model = aiEngine.selectModel({ 
        userTier: 'business', 
        hasBrandGuidelines: true 
      });
      
      // Business tier doesn't upgrade to OPUS even with brand guidelines
      expect(model).toBe(aiEngine.models.SONNET);
    });
  });

  describe('Model Constants', () => {
    it('has correct model identifiers', () => {
      expect(aiEngine.models.HAIKU).toBe('claude-haiku-4-5-20251001');
      expect(aiEngine.models.SONNET).toBe('claude-sonnet-4-5-20250929');
      expect(aiEngine.models.OPUS).toBe('claude-opus-4-5-20251101');
    });

    it('has temperature settings for all models', () => {
      expect(aiEngine.temperatures[aiEngine.models.HAIKU]).toBe(0.3);
      expect(aiEngine.temperatures[aiEngine.models.SONNET]).toBe(0.5);
      expect(aiEngine.temperatures[aiEngine.models.OPUS]).toBe(0.6);
    });
  });

  describe('Tier Hierarchy', () => {
    it('follows correct tier hierarchy: free < starter < pro < business < enterprise', () => {
      const freeModel = aiEngine.selectModel({ userTier: 'free' });
      const starterModel = aiEngine.selectModel({ userTier: 'starter' });
      const proModel = aiEngine.selectModel({ userTier: 'pro' });
      const businessModel = aiEngine.selectModel({ userTier: 'business' });
      const enterpriseModel = aiEngine.selectModel({ userTier: 'enterprise' });
      
      // Free and Starter should get same model (HAIKU)
      expect(freeModel).toBe(starterModel);
      expect(freeModel).toBe(aiEngine.models.HAIKU);
      
      // Pro and Business should get same model (SONNET)
      expect(proModel).toBe(businessModel);
      expect(proModel).toBe(aiEngine.models.SONNET);
      
      // Enterprise gets the best model (OPUS)
      expect(enterpriseModel).toBe(aiEngine.models.OPUS);
      
      // HAIKU !== SONNET !== OPUS
      expect(freeModel).not.toBe(proModel);
      expect(proModel).not.toBe(enterpriseModel);
    });
  });
});
