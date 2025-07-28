// src/routes/timeTrackingRoutes.js
const router = require('express').Router();
const timeTrackingController = require('../controllers/timeTrackingController');

// GET /api/v1/analytics/project-time - Get project time analytics
router.get('/project-time', timeTrackingController.getProjectTime);

// GET /api/v1/analytics/time-tracking - Get detailed time tracking data
router.get('/time-tracking', timeTrackingController.getTimeTrackingData);

// POST /api/v1/time-tracking/start - Start time tracking
router.post('/start', timeTrackingController.startTimeTracking);

// POST /api/v1/time-tracking/stop - Stop time tracking
router.post('/stop', timeTrackingController.stopTimeTracking);

// GET /api/v1/time-tracking/active - Get active session
router.get('/active', timeTrackingController.getActiveSession);

module.exports = router;
