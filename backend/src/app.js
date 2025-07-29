// backend/src/app.js
const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const sharedSettingsRoutes = require('./routes/sharedSettingsRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const timeTrackingRoutes = require('./routes/timeTrackingRoutes'); // ADD THIS LINE
const { authMiddleware, requireRole } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
      'https://time-tracking-app-tau.vercel.app' // Your deployed frontend
    ].filter(Boolean);
    
    // Allow requests with no origin (desktop app, mobile apps, Postman) 
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Public routes (no authentication required)
app.use('/api/v1/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/v1/employee', authMiddleware, employeeRoutes);
app.use('/api/v1/team', authMiddleware, requireRole(['admin']), teamRoutes);
app.use('/api/v1/shared-settings', authMiddleware, requireRole(['admin']), sharedSettingsRoutes);
app.use('/api/v1/project', authMiddleware, requireRole(['admin']), projectRoutes);
app.use('/api/v1/task', authMiddleware, taskRoutes);
app.use('/api/v1/analytics', authMiddleware, analyticsRoutes);
app.use('/api/v1/time-tracking', authMiddleware, timeTrackingRoutes); // ADD THIS LINE

// Remove test route in production
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/v1/test/create-admin', async (req, res) => {
    try {
      const User = require('./models/User');
      
      const existingAdmin = await User.findOne({ email: 'admin@test.com' });
      if (existingAdmin) {
        await User.deleteOne({ email: 'admin@test.com' });
      }

      const admin = new User({
        id: 'admin_test_123',
        email: 'admin@test.com',
        password: 'Admin123!',
        role: 'admin',
        organizationId: 'wbtmikjuiimvh3z',
        emailVerified: true,
        active: true,
        createdAt: Date.now()
      });
      
      await admin.save();
      
      res.json({ 
        message: 'Admin created successfully',
        email: 'admin@test.com',
        password: 'Admin123!'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
  });
}

// ✅ This works in Express v5
app.use('/*path', (req, res) => {
  res.status(404).json({
    type: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`
  });
});


// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
