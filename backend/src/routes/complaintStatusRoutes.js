const express = require('express');

const {
  updateComplaintStatus,
} = require('../controllers/complaintStatusController');

const router = express.Router();

router.patch('/:complaintId/status', updateComplaintStatus);

module.exports = router;