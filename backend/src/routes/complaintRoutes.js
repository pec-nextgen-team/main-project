const express = require('express');

const {
  createComplaint,
  getComplaints,
  getMyComplaints,
  updateComplaint,
} = require('../controllers/complaintController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Create complaint
router.post(
  '/',
  authenticate,
  authorizeRoles('SUPERVISOR'),
  createComplaint
);

// Get all complaints
router.get(
  '/',
  authenticate,
  authorizeRoles('SUPERVISOR', 'HOD', 'ELECTRICIAN_HEAD', 'ELECTRICIAN'),
  getComplaints
);

// Get complaints created by logged-in supervisor
router.get(
  '/my',
  authenticate,
  authorizeRoles('SUPERVISOR'),
  getMyComplaints
);

// Update own pending complaint
router.put(
  '/:id',
  authenticate,
  authorizeRoles('SUPERVISOR'),
  updateComplaint
);

module.exports = router;