const express = require('express');
const router = express.Router();
const domainController = require('../controllers/domain.controller');
const { requireAuth } = require('../middleware/auth');

// All domain routes require authentication
router.use(requireAuth);

// Add a new domain
router.post('/', domainController.addDomain);

// Get user's domains
router.get('/', domainController.getUserDomains);

// Get domain limits
router.get('/limits', domainController.getDomainLimits);

// Verify domain ownership
router.post('/:domainId/verify', domainController.verifyDomain);

// Set default domain
router.put('/:domainId/default', domainController.setDefaultDomain);

// Get DNS instructions for domain
router.get('/:domainId/instructions', domainController.getDNSInstructions);

// Delete domain
router.delete('/:domainId', domainController.deleteDomain);

module.exports = router;
