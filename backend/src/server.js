const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check API with Database Check
app.get('/api/health', async (req, res) => {
  try {
    // Database kuda connection eruka nu paaka Query
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'success',
      message: 'Backend server & Database are running smoothly 🚀',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server is up, but Database connection failed ❌',
      error: error.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});