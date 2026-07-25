const { Router } = require('express');
const {
  createLead,
  getLeads,
  updateLeadStatus,
} = require('../controllers/leadController.js');
const protectAdmin = require('../middleware/authMiddleware.js');

const router = Router();

router.get('/', protectAdmin, getLeads);
router.post('/', createLead);
router.patch('/:id/status', protectAdmin, updateLeadStatus);

module.exports = router;
