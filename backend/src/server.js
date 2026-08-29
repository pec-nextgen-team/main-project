require('dotenv').config();

// Startup Guard: Validate critical environment variables before bootstrapping
const REQUIRED_ENV_VARS = ['JWT_SECRET'];

for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar] || process.env[envVar].trim() === '') {
    console.error(`\x1b[31m[FATAL ERROR] Missing required environment variable: ${envVar}\x1b[0m`);
    console.error(`Please set ${envVar} in your .env file before starting the server.`);
    process.exit(1);
  }
}

const express = require('express');
const cors = require('cors');

const jobRoutes = require('./routes/jobRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const healthRoutes = require('./routes/healthRoutes');
const complaintStatusRoutes = require('./routes/complaintStatusRoutes');
const authRoutes = require('./routes/authRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/complaints', complaintStatusRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/tickets', ticketRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});