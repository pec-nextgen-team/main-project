const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const approvalRoutes = require('./routes/approvalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Mount All API Routes First
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/approvals', approvalRoutes);

// // Optional test endpoint
// app.get('/api/auth/me-test', (req, res) => {
//   res.json({ success: true, message: 'Endpoint reached successfully' });
// });

// 2. Global 404 Handler MUST be at the very bottom (after all routes)
app.use((req, res) => {
  console.log(`❌ 404 on: [${req.method}] ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});