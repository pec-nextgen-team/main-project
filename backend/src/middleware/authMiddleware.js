const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// 1. Authenticate Token & Validate Active User Status
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  // Verify JWT Token
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (jwtError) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }

  // Verify User Exists and is Active in Database
  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, isActive: true, departmentId: true, employeeId: true },
    });

    if (!user || user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive, disabled, or no longer exists.',
      });
    }

    // Attach verified user payload
    req.user = {
      userId: user.id,
      id: user.id,
      role: user.role,
      employeeId: user.employeeId,
      departmentId: user.departmentId,
    };

    next();
  } catch (dbError) {
    console.error('Database authentication error:', dbError);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while verifying user account.',
    });
  }
};

// 2. Role-Based Access Control (RBAC)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user illanaalum or req.user.role illanaalum crash aagama safe-ah handle aagum
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };