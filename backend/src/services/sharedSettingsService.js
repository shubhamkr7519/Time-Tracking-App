// src/services/sharedSettingsService.js
const SharedSettings = require('../models/SharedSettings');
const crypto = require('crypto');

class SharedSettingsService {
  // Create a new shared setting
  async createSharedSettings(settingsData, organizationId) {
    const { name, type, settings } = settingsData;

    // Validate that settings has the required structure
    if (!settings || !settings.type) {
      const error = new Error('Settings object with type is required');
      error.type = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    // Validate settings type
    const validSettingsTypes = ['unlimited', 'limited', 'network', 'project', 'manual'];
    if (!validSettingsTypes.includes(settings.type)) {
      const error = new Error('Invalid settings type');
      error.type = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    // Validate required fields based on settings type
    this.validateSettingsFields(settings);

    const currentTime = Date.now();

    const newSharedSettings = {
      id: this.generateSharedSettingsId(),
      name,
      type,
      settings,
      organizationId,
      default: false, // Default to false, can be overridden
      createdAt: currentTime
    };

    // Save to database
    const savedSettings = await SharedSettings.create(newSharedSettings);
    
    // Transform for API response to match exact format
    const settingsObj = savedSettings.toObject();
    return {
      id: settingsObj.id,
      name: settingsObj.name,
      type: settingsObj.type,
      settings: settingsObj.settings,
      organizationId: settingsObj.organizationId,
      default: settingsObj.default,
      createdAt: settingsObj.createdAt
    };
  }

  // Validate settings fields based on type
  validateSettingsFields(settings) {
    const { type } = settings;

    // Common required fields for all settings types
    const requiredFields = ['idle', 'breaks', 'screenshots', 'days', 'icon', 'timer', 'clocker', 'privileges'];
    
    for (const field of requiredFields) {
      if (settings[field] === undefined || settings[field] === null) {
        const error = new Error(`Missing required field: ${field}`);
        error.type = 'VALIDATION_ERROR';
        error.status = 400;
        throw error;
      }
    }

    // Validate days object
    if (!settings.days || typeof settings.days !== 'object') {
      const error = new Error('Days object is required');
      error.type = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    const dayFields = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of dayFields) {
      if (typeof settings.days[day] !== 'boolean') {
        const error = new Error(`Day ${day} must be a boolean`);
        error.type = 'VALIDATION_ERROR';
        error.status = 400;
        throw error;
      }
    }

    // Validate privileges object
    if (!settings.privileges || typeof settings.privileges !== 'object') {
      const error = new Error('Privileges object is required');
      error.type = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    // Type-specific validations
    switch (type) {
      case 'limited':
        if (settings.start === undefined || settings.end === undefined) {
          const error = new Error('Limited settings require start and end times');
          error.type = 'VALIDATION_ERROR';
          error.status = 400;
          throw error;
        }
        break;

      case 'network':
        if (!settings.network || !Array.isArray(settings.network)) {
          const error = new Error('Network settings require network array');
          error.type = 'VALIDATION_ERROR';
          error.status = 400;
          throw error;
        }
        break;

      case 'project':
        // Enforce project settings constraints
        if (settings.breaks !== 0) {
          const error = new Error('Project settings must have breaks set to 0');
          error.type = 'VALIDATION_ERROR';
          error.status = 400;
          throw error;
        }
        if (settings.icon !== true) {
          const error = new Error('Project settings must have icon set to true');
          error.type = 'VALIDATION_ERROR';
          error.status = 400;
          throw error;
        }
        if (settings.timer !== true) {
          const error = new Error('Project settings must have timer set to true');
          error.type = 'VALIDATION_ERROR';
          error.status = 400;
          throw error;
        }
        if (settings.clocker !== false) {
          const error = new Error('Project settings must have clocker set to false');
          error.type = 'VALIDATION_ERROR';
          error.status = 400;
          throw error;
        }
        break;

      case 'manual':
        // Enforce manual settings constraints
        if (settings.icon !== true) {
          const error = new Error('Manual settings must have icon set to true');
          error.type = 'VALIDATION_ERROR';
          error.status = 400;
          throw error;
        }
        if (settings.clocker !== true) {
          const error = new Error('Manual settings must have clocker set to true');
          error.type = 'VALIDATION_ERROR';
          error.status = 400;
          throw error;
        }
        break;
    }
  }

  // Get shared settings by ID
  async getSharedSettingsById(settingsId) {
    const settings = await SharedSettings.findOne({ id: settingsId });
    if (!settings) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    return settings.toObject();
  }

  // Get all shared settings
  async getSharedSettings(filters = {}) {
    let query = SharedSettings.find();
    
    if (filters.organizationId) {
      query = query.where('organizationId').equals(filters.organizationId);
    }
    if (filters.type) {
      query = query.where('type').equals(filters.type);
    }
    
    const settings = await query.exec();
    return settings.map(setting => setting.toObject());
  }

  // Update shared settings
  async updateSharedSettings(settingsId, updateData) {
    const settings = await SharedSettings.findOne({ id: settingsId });
    if (!settings) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Update allowed fields
    const allowedFields = ['name', 'type', 'settings', 'default'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        settings[field] = updateData[field];
      }
    });

    // Validate settings if being updated
    if (updateData.settings) {
      this.validateSettingsFields(updateData.settings);
    }

    const savedSettings = await settings.save();
    return savedSettings.toObject();
  }

  // Delete shared settings
  async deleteSharedSettings(settingsId) {
    const settings = await SharedSettings.findOne({ id: settingsId });
    if (!settings) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Check if it's a default setting (cannot be deleted)
    if (settings.default) {
      const error = new Error("Can't remove default settings");
      error.status = 409;
      throw error;
    }

    await SharedSettings.deleteOne({ id: settingsId });
    return settings.toObject();
  }

  // Generate Insightful-style shared settings ID
  generateSharedSettingsId() {
    return 'w' + crypto.randomBytes(7).toString('hex').substring(0, 14);
  }
}

module.exports = new SharedSettingsService();
