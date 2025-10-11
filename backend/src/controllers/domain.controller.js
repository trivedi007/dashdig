const domainService = require('../services/domain.service');

class DomainController {
  // Add a new domain
  async addDomain(req, res) {
    try {
      const { domain, plan = 'free' } = req.body;
      const userId = req.user.id;

      if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
      }

      const newDomain = await domainService.addDomain(userId, domain, plan);
      
      res.status(201).json({
        success: true,
        domain: newDomain,
        message: 'Domain added successfully. Please verify ownership via DNS.'
      });
    } catch (error) {
      console.error('Add domain error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Verify domain ownership
  async verifyDomain(req, res) {
    try {
      const { domainId } = req.params;
      const userId = req.user.id;

      const result = await domainService.verifyDomain(domainId, userId);
      
      if (result.verified) {
        res.json({
          success: true,
          domain: result.domain,
          message: 'Domain verified successfully!'
        });
      } else {
        res.status(400).json({
          success: false,
          domain: result.domain,
          error: result.error || 'Domain verification failed'
        });
      }
    } catch (error) {
      console.error('Verify domain error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Get user's domains
  async getUserDomains(req, res) {
    try {
      const userId = req.user.id;
      const domains = await domainService.getUserDomains(userId);
      
      res.json({
        success: true,
        domains,
        count: domains.length
      });
    } catch (error) {
      console.error('Get user domains error:', error);
      res.status(500).json({ error: 'Failed to fetch domains' });
    }
  }

  // Set default domain
  async setDefaultDomain(req, res) {
    try {
      const { domainId } = req.params;
      const userId = req.user.id;

      const domain = await domainService.setDefaultDomain(userId, domainId);
      
      res.json({
        success: true,
        domain,
        message: 'Default domain updated successfully'
      });
    } catch (error) {
      console.error('Set default domain error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete domain
  async deleteDomain(req, res) {
    try {
      const { domainId } = req.params;
      const userId = req.user.id;

      const domain = await domainService.deleteDomain(userId, domainId);
      
      res.json({
        success: true,
        message: 'Domain deleted successfully',
        deletedDomain: domain
      });
    } catch (error) {
      console.error('Delete domain error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Get domain limits for user
  async getDomainLimits(req, res) {
    try {
      const userId = req.user.id;
      const userPlan = req.user.subscription?.plan || 'free';
      
      const limits = await domainService.checkDomainLimits(userId, userPlan);
      
      res.json({
        success: true,
        limits,
        plan: userPlan
      });
    } catch (error) {
      console.error('Get domain limits error:', error);
      res.status(500).json({ error: 'Failed to fetch domain limits' });
    }
  }

  // Get DNS instructions for domain verification
  async getDNSInstructions(req, res) {
    try {
      const { domainId } = req.params;
      const userId = req.user.id;

      const domain = await domainService.getUserDomains(userId);
      const targetDomain = domain.find(d => d._id.toString() === domainId);
      
      if (!targetDomain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      const instructions = {
        domain: targetDomain.domain,
        dnsRecords: targetDomain.dnsRecords,
        steps: [
          {
            step: 1,
            title: 'Add TXT Record',
            description: `Add a TXT record to verify domain ownership`,
            record: {
              type: 'TXT',
              name: '_dashdig-verification',
              value: `dashdig-verification=${targetDomain.verificationToken}`,
              ttl: '300'
            }
          },
          {
            step: 2,
            title: 'Add CNAME Record (Optional)',
            description: `Add a CNAME record for subdomain support`,
            record: {
              type: 'CNAME',
              name: 'dashdig',
              value: 'dashdig.com',
              ttl: '300'
            }
          },
          {
            step: 3,
            title: 'Wait for DNS Propagation',
            description: 'DNS changes can take up to 24 hours to propagate',
            note: 'Most changes are visible within 5-15 minutes'
          },
          {
            step: 4,
            title: 'Verify Domain',
            description: 'Click the verify button to check DNS records'
          }
        ]
      };

      res.json({
        success: true,
        instructions
      });
    } catch (error) {
      console.error('Get DNS instructions error:', error);
      res.status(500).json({ error: 'Failed to fetch DNS instructions' });
    }
  }
}

module.exports = new DomainController();
