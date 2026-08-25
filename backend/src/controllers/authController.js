const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// @desc    Register a new user (Staff / Admin / Electrician)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { employeeId, username, password, fullName, email, phone, role, departmentId } = req.body;

    // Check if user already exists by employeeId, username, or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { employeeId },
          { username },
          ...(email ? [{ email }] : [])
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'A user with this Employee ID, username, or email already exists.' 
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in Neon PostgreSQL
    const user = await prisma.user.create({
      data: {
        employeeId,
        username,
        passwordHash,
        fullName,
        email: email || null,
        phone: phone || null,
        role,
        departmentId: departmentId || null,
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
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or employeeId
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { employeeId: username }
        ]
      },
      include: {
        department: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username/Employee ID or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/Employee ID or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role, 
        employeeId: user.employeeId,
        departmentId: user.departmentId 
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
        department: user.department
      }
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