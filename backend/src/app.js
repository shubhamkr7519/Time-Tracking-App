// src/app.js (Add CORS)
const express = require('express');
const cors = require('cors'); // Add this import
const employeeRoutes = require('./routes/employeeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const sharedSettingsRoutes = require('./routes/sharedSettingsRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const { authMiddleware, requireRole } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Add CORS before other middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true
}));

app.use(express.json());

// Public routes (no authentication required)
app.use('/api/v1/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/v1/employee', authMiddleware, employeeRoutes);
app.use('/api/v1/team', authMiddleware, requireRole(['admin']), teamRoutes);
app.use('/api/v1/shared-settings', authMiddleware, requireRole(['admin']), sharedSettingsRoutes);
app.use('/api/v1/project', authMiddleware, requireRole(['admin']), projectRoutes);
app.use('/api/v1/task', authMiddleware, taskRoutes);
app.use('/api/v1/analytics', authMiddleware, analyticsRoutes);

// Add this before app.use(errorHandler); in your app.js
// Temporary route for testing - create admin user
app.post('/api/v1/test/create-admin', async (req, res) => {
  try {
    const User = require('./models/User');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      return res.json({ 
        message: 'Admin already exists', 
        email: 'admin@test.com', 
        password: 'Admin123!' 
      });
    }

    const admin = await User.create({
      id: 'admin_test_123',
      email: 'admin@test.com',
      password: 'Admin123!',
      role: 'admin',
      organizationId: 'wbtmikjuiimvh3z',
      emailVerified: true,
      active: true,
      createdAt: Date.now()
    });
    
    res.json({ 
      message: 'Admin created successfully', 
      email: 'admin@test.com', 
      password: 'Admin123!' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});


// Error handling middleware
app.use(errorHandler);

module.exports = app;
