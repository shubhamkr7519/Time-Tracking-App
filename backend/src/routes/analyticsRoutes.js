// src/routes/analyticsRoutes.js (Add screenshot route)
const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController');
const screenshotController = require('../controllers/screenshotController');

// GET /api/v1/analytics/window - Get window analytics
router.get('/window', analyticsController.getWindowAnalytics);

// GET /api/v1/analytics/project-time - Get project time analytics
router.get('/project-time', analyticsController.getProjectTimeAnalytics);

// GET /api/v1/analytics/screenshot-paginate - Get paginated screenshots
router.get('/screenshot-paginate', screenshotController.getScreenshotsPaginated);

module.exports = router;
