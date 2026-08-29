const express = require('express');

const router = express.Router();

const {
  openTicket,
  getElectricians,
  assignElectrician,
} = require('../controllers/ticketController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');


// Check an approved complaint before assignment
router.post(
  '/open/:complaintId',
  authenticate,
  authorizeRoles(
    'SUPERVISOR',
    'HOD',
    'ELECTRICIAN_HEAD',
    'MANAGER'
  ),
  openTicket
);


// Get available electricians
router.get(
  '/electricians',
  authenticate,
  authorizeRoles(
    'SUPERVISOR',
    'HOD',
    'ELECTRICIAN_HEAD',
    'MANAGER'
  ),
  getElectricians
);


// Assign electrician
router.patch(
  '/:id/assign-electrician',
  authenticate,
  authorizeRoles(
    'SUPERVISOR',
    'HOD',
    'ELECTRICIAN_HEAD',
    'MANAGER'
  ),
  assignElectrician
);

module.exports = router;