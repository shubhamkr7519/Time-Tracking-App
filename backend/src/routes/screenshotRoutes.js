// src/routes/screenshotRoutes.js
const router = require('express').Router();
const screenshotController = require('../controllers/screenshotController');

// GET /api/v1/analytics/screenshot-paginate - Get paginated screenshots
router.get('/screenshot-paginate', screenshotController.getScreenshotsPaginated);

module.exports = router;
