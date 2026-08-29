const express = require('express');
const router = express.Router();

// Add 'logout' to the list of imported functions here
const { register, login, getMe, logout } = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

// Change this line to just use the 'logout' function directly
router.post('/logout', logout); 

module.exports = router;