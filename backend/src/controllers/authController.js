const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// @desc    Register a new user (Enforces basic role & cross-field uniqueness)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { employeeId, username, password, fullName, email, phone, departmentId } = req.body;

    if (!employeeId || !username || !password || !fullName) {
      return res.status(400).json({
        message: 'Employee ID, username, fullName, and password are required.',
      });
    }

    // Check cross-field uniqueness:
    // - employeeId must not collide with any employeeId OR username
    // - username must not collide with any username OR employeeId
    // - email must not collide with any existing email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { employeeId: employeeId },
          { username: employeeId },
          { username: username },
          { employeeId: username },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'A user with this Employee ID, username, or email already exists or conflicts with an existing identifier.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with default basic role: ELECTRICIAN
    const user = await prisma.user.create({
      data: {
        employeeId,
        username,
        passwordHash,
        fullName,
        email: email || null,
        phone: phone || null,
        role: 'ELECTRICIAN',
        departmentId: departmentId ? String(departmentId) : null,
      },
      select: {
        id: true,
        employeeId: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        departmentId: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'User registered successfully with default role (ELECTRICIAN).',
      user,
    });
  } catch (error) {
    console.error('Register Error:', error);

    // P2003: Foreign key constraint violation (invalid/nonexistent departmentId)
    if (error.code === 'P2003') {
      return res.status(400).json({
        message: 'Invalid departmentId: The specified department does not exist.',
      });
    }

    // P2002: Unique constraint violation fallback
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: `A user with this ${error.meta?.target?.[0] || 'field'} already exists.`,
      });
    }

    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Please provide your username/Employee ID and password.',
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { employeeId: username },
        ],
      },
      include: {
        department: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username/Employee ID or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/Employee ID or password' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        employeeId: user.employeeId,
        departmentId: user.departmentId,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId || req.user.id },
      select: {
        id: true,
        employeeId: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        departmentId: true,
        isActive: true,
        createdAt: true,
        department: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};
// ... existing exports.getMe function finishes above this line

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};