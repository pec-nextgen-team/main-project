const express = require('express');
const router = express.Router();

const {
  getPendingApprovals,
  updateApproval,
} = require('../controllers/approvalController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// GET /api/approvals/pending
// Only HOD can access
router.get(
  '/pending',
  authenticate,
  authorizeRoles('HOD'),
  getPendingApprovals
);

// PATCH /api/approvals/:id
// Only HOD can access
router.patch(
  '/:id',
  authenticate,
  authorizeRoles('HOD'),
  updateApproval
);

module.exports = router;