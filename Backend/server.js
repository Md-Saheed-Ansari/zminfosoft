// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const logger = require ('./logger')


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
// Serve static frontend files from root directory
app.use(express.static(path.join(__dirname, '..')));

// Import Routes
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/contact', contactRoutes); // contact form submits
app.use('/api/admin', adminRoutes);     //  employee + message mgmt
app.use('/api/auth', authRoutes);       // admin login
// Handle frontend routes only (excluding API paths)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
})
.catch((err) => {
  logger.error(err)
});

