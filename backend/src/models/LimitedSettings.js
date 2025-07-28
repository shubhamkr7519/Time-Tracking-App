// src/models/LimitedSettings.js
const { Schema, model } = require('mongoose');
const baseSettingsSchema = require('./BaseSettings');

const limitedSettingsSchema = new Schema({
  ...baseSettingsSchema.obj,
  // Type must be 'limited' for this settings type
  type: {
    type: String,
    enum: ['limited'],
    required: true,
    default: 'limited'
  },
  
  // Shift start time
  start: {
    type: Number,
    required: true
  },
  
  // Shift end time
  end: {
    type: Number,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('LimitedSettings', limitedSettingsSchema);
