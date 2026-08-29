const express = require('express');

const { getJobs } = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize('ELECTRICIAN'),
  getJobs
);

module.exports = router;