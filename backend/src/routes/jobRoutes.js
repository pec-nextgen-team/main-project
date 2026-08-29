const express = require('express');

const {
  getJobs,
  assignJob,
} = require('../controllers/jobController');

const {
  authenticate,
  authorize,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Assign approved complaint to an electrician
router.post(
  '/assign',
  authenticate,
  authorize('ELECTRICIAN_HEAD', 'ELECTRICIAN_INCHARGE'),
  assignJob
);

// Electrician views assigned jobs
router.get(
  '/',
  authenticate,
  authorize('ELECTRICIAN'),
  getJobs
);

module.exports = router;