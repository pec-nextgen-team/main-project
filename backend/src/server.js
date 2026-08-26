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
app.use('/api/complaints', complaintRoutes);
app.use('/api/complaints', complaintStatusRoutes);
app.use('/api/jobs', jobRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});