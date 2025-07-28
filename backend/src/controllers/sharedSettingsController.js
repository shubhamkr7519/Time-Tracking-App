// src/controllers/sharedSettingsController.js
const sharedSettingsService = require('../services/sharedSettingsService');

class SharedSettingsController {
  // Create new shared settings
  async createSharedSettings(req, res, next) {
    try {
      const { name, type, settings } = req.body;
      const { organizationId } = req.user; // Get from auth middleware

      // Validate required fields
      if (!name || !type || !settings) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Missing required fields: name, type, settings'
        });
      }

      // Validate type enum
      if (!['personal', 'office'].includes(type)) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Type must be either personal or office'
        });
      }

      const sharedSettings = await sharedSettingsService.createSharedSettings(
        req.body, 
        organizationId
      );

      res.status(201).json(sharedSettings);
    } catch (error) {
      next(error);
    }
  }

  // Get shared settings by ID
  async getSharedSettings(req, res, next) {
    try {
      const { id } = req.params;
      const settings = await sharedSettingsService.getSharedSettingsById(id);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  // Get all shared settings
  async getAllSharedSettings(req, res, next) {
    try {
      const filters = {
        organizationId: req.user.organizationId,
        type: req.query.type
      };

      const settings = await sharedSettingsService.getSharedSettings(filters);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  // Update shared settings
  async updateSharedSettings(req, res, next) {
    try {
      const { id } = req.params;
      const settings = await sharedSettingsService.updateSharedSettings(id, req.body);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  // Delete shared settings
  async deleteSharedSettings(req, res, next) {
    try {
      const { id } = req.params;
      const settings = await sharedSettingsService.deleteSharedSettings(id);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SharedSettingsController();
