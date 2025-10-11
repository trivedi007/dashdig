const crypto = require('crypto');
const dns = require('dns').promises;
const Domain = require('../models/Domain');
const User = require('../models/User');

class DomainService {
  constructor() {
    this.baseDomain = process.env.BASE_URL || 'dashdig.com';
  }

  // Generate verification token for domain
  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Add a new domain for a user
  async addDomain(userId, domainName, plan = 'free') {
    try {
      // Clean domain name
      const cleanDomain = domainName.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      // Check if domain already exists
      const existingDomain = await Domain.findOne({ domain: cleanDomain });
      if (existingDomain) {
        throw new Error('Domain already registered');
      }

      // Check user's plan limits
      const userDomains = await Domain.countDocuments({ userId });
      const planLimits = {
        free: 1,
        pro: 5,
        business: 20
      };

      if (userDomains >= planLimits[plan]) {
        throw new Error(`Plan limit reached. Upgrade to add more domains.`);
      }

      const verificationToken = this.generateVerificationToken();
      
      const domain = new Domain({
        domain: cleanDomain,
        userId,
        verificationToken,
        plan,
        dnsRecords: this.generateDNSRecords(cleanDomain, verificationToken)
      });

      await domain.save();
      return domain;
    } catch (error) {
      console.error('Add domain error:', error);
      throw error;
    }
  }

  // Generate DNS records for verification
  generateDNSRecords(domain, token) {
    return [
      {
        type: 'TXT',
        name: '_dashdig-verification',
        value: `dashdig-verification=${token}`
      },
      {
        type: 'CNAME',
        name: 'dashdig',
        value: `${this.baseDomain}`
      }
    ];
  }

  // Verify domain ownership via DNS
  async verifyDomain(domainId, userId) {
    try {
      const domain = await Domain.findOne({ _id: domainId, userId });
      if (!domain) {
        throw new Error('Domain not found');
      }

      if (domain.status === 'verified') {
        return { verified: true, domain };
      }

      const isVerified = await this.checkDNSVerification(domain.domain, domain.verificationToken);
      
      if (isVerified) {
        domain.status = 'verified';
        domain.verifiedAt = new Date();
        
        // If this is the first verified domain, make it default
        const existingDefault = await Domain.findOne({ userId, isDefault: true });
        if (!existingDefault) {
          domain.isDefault = true;
        }
        
        await domain.save();
        return { verified: true, domain };
      } else {
        domain.status = 'failed';
        await domain.save();
        return { verified: false, domain, error: 'DNS verification failed' };
      }
    } catch (error) {
      console.error('Verify domain error:', error);
      throw error;
    }
  }

  // Check DNS records for verification
  async checkDNSVerification(domain, token) {
    try {
      // Check TXT record
      const txtRecords = await dns.resolveTxt(`_dashdig-verification.${domain}`);
      const expectedValue = `dashdig-verification=${token}`;
      
      const hasCorrectTXT = txtRecords.some(record => 
        record.some(txt => txt === expectedValue)
      );

      if (!hasCorrectTXT) {
        console.log(`TXT record verification failed for ${domain}`);
        return false;
      }

      // Check CNAME record (optional for subdomain setup)
      try {
        const cnameRecords = await dns.resolveCname(`dashdig.${domain}`);
        const hasCorrectCNAME = cnameRecords.includes(this.baseDomain);
        
        if (!hasCorrectCNAME) {
          console.log(`CNAME record verification failed for ${domain}`);
          // CNAME is optional, so we don't fail verification for this
        }
      } catch (cnameError) {
        // CNAME might not exist, which is okay
        console.log(`CNAME record not found for ${domain} (optional)`);
      }

      return hasCorrectTXT;
    } catch (error) {
      console.error('DNS verification error:', error);
      return false;
    }
  }

  // Get user's domains
  async getUserDomains(userId) {
    try {
      const domains = await Domain.find({ userId }).sort({ createdAt: -1 });
      return domains;
    } catch (error) {
      console.error('Get user domains error:', error);
      throw error;
    }
  }

  // Set default domain
  async setDefaultDomain(userId, domainId) {
    try {
      // Remove default from other domains
      await Domain.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      );

      // Set new default
      const domain = await Domain.findOneAndUpdate(
        { _id: domainId, userId, status: 'verified' },
        { isDefault: true },
        { new: true }
      );

      if (!domain) {
        throw new Error('Domain not found or not verified');
      }

      return domain;
    } catch (error) {
      console.error('Set default domain error:', error);
      throw error;
    }
  }

  // Delete domain
  async deleteDomain(userId, domainId) {
    try {
      const domain = await Domain.findOneAndDelete({ _id: domainId, userId });
      if (!domain) {
        throw new Error('Domain not found');
      }

      // If this was the default domain, set another verified domain as default
      if (domain.isDefault) {
        const newDefault = await Domain.findOne({ userId, status: 'verified', _id: { $ne: domainId } });
        if (newDefault) {
          newDefault.isDefault = true;
          await newDefault.save();
        }
      }

      return domain;
    } catch (error) {
      console.error('Delete domain error:', error);
      throw error;
    }
  }

  // Get domain for URL generation
  async getDomainForUser(userId, preferredDomain = null) {
    try {
      if (preferredDomain) {
        const domain = await Domain.findOne({ 
          userId, 
          domain: preferredDomain, 
          status: 'verified' 
        });
        if (domain) return domain;
      }

      // Fallback to default domain
      const defaultDomain = await Domain.findOne({ 
        userId, 
        isDefault: true, 
        status: 'verified' 
      });

      return defaultDomain || null;
    } catch (error) {
      console.error('Get domain for user error:', error);
      return null;
    }
  }

  // Check domain limits for user
  async checkDomainLimits(userId, plan) {
    try {
      const userDomains = await Domain.countDocuments({ userId });
      const planLimits = {
        free: 1,
        pro: 5,
        business: 20
      };

      return {
        current: userDomains,
        limit: planLimits[plan] || 1,
        canAdd: userDomains < planLimits[plan]
      };
    } catch (error) {
      console.error('Check domain limits error:', error);
      return { current: 0, limit: 1, canAdd: false };
    }
  }
}

module.exports = new DomainService();
