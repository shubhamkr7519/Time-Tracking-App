// src/routes/sharedSettingsRoutes.js
const router = require('express').Router();
const sharedSettingsController = require('../controllers/sharedSettingsController');

// POST /api/v1/shared-settings - Create shared settings
router.post('/', sharedSettingsController.createSharedSettings);

// GET /api/v1/shared-settings/:id - Get shared settings by ID
router.get('/:id', sharedSettingsController.getSharedSettings);

// GET /api/v1/shared-settings - Get all shared settings
router.get('/', sharedSettingsController.getAllSharedSettings);

// PUT /api/v1/shared-settings/:id - Update shared settings
router.put('/:id', sharedSettingsController.updateSharedSettings);

// DELETE /api/v1/shared-settings/:id - Delete shared settings
router.delete('/:id', sharedSettingsController.deleteSharedSettings);

module.exports = router;
