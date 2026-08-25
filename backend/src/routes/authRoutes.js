const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);


// // Route 1: Should ALLOW your SUPERVISOR user
// router.get(
//   '/test-supervisor',
//   authenticate,
//   authorizeRoles('SUPERVISOR', 'MANAGER'),
//   (req, res) => {
//     res.status(200).json({
//       success: true,
//       message: `Access granted! Hello ${req.user.role}`,
//     });
//   }
// );

// // Route 2: Should FORBID your SUPERVISOR user
// router.get(
//   '/test-electrician-only',
//   authenticate,
//   authorizeRoles('ELECTRICIAN', 'ELECTRICIAN_HEAD'),
//   (req, res) => {
//     res.status(200).json({
//       success: true,
//       message: 'If you see this, role check failed',
//     });
//   }
// );

module.exports = router;