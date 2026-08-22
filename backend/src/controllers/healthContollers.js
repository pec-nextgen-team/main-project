const prisma = require('../config/db');

const getHealthStatus = async (req, res) => {
  try {
    // Ping Neon database using Prisma raw query
    await prisma.$queryRawUnsafe('SELECT 1');

    res.status(200).json({
      status: 'success',
      message: 'Backend server & Database are running smoothly 🚀',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server is up, but Database connection failed ❌',
      error: error.message || 'Database unreachable',
    });
  }
};

module.exports = { getHealthStatus };