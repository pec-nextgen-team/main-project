const prisma = require('../config/db');

const getHealth = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'success',
      message: 'Backend server & Database are running smoothly 🚀',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Server is up, but Database connection failed ❌'
    });
  }
};

module.exports = { getHealth };