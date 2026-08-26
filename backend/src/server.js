const jobRoutes = require('./routes/jobRoutes');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const complaintRoutes = require('./routes/complaintRoutes');

const healthRoutes = require('./routes/healthRoutes');
const complaintStatusRoutes = require('./routes/complaintStatusRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/complaints', complaintStatusRoutes);
app.use('/api/jobs', jobRoutes);

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