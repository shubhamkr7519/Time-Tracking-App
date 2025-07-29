// backend/src/routes/timeTrackingRoutes.js
const express = require('express');
const router = express.Router();
const timeTrackingController = require('../controllers/timeTrackingController');

// Start time tracking
router.post('/start', timeTrackingController.startTracking);

// Stop time tracking
router.post('/stop', timeTrackingController.stopTracking);

// Get current active session
router.get('/active', timeTrackingController.getActiveSession);

// Get time sessions (with pagination and filters)
router.get('/sessions', timeTrackingController.getSessions);

// Sync data from desktop app
router.post('/sync', timeTrackingController.syncData);

// Get time tracking statistics
router.get('/stats', timeTrackingController.getStats);

module.exports = router;
