// src/models/ScreenshotSettings.js
const { Schema, model } = require('mongoose');

const screenshotSettingsSchema = new Schema({
  // Enable/disable screenshots
  screenshotEnabled: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('ScreenshotSettings', screenshotSettingsSchema);
