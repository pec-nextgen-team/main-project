const express = require('express');
const router = express.Router();
const { getHealthStatus } = require('../controllers/healthController');

router.get('/health', getHealthStatus);

module.exports = router;