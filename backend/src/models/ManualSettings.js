// src/models/ManualSettings.js
const { Schema, model } = require('mongoose');
const baseSettingsSchema = require('./BaseSettings');

const manualSettingsSchema = new Schema({
  ...baseSettingsSchema.obj,
  // Type must be 'manual' for this settings type
  type: {
    type: String,
    enum: ['manual'],
    required: true,
    default: 'manual'
  },
  // Override specific fields as per API requirements
  icon: {
    type: Boolean,
    required: true,
    default: true // Must be true for manual settings
  },
  clocker: {
    type: Boolean,
    required: true,
    default: true // Must be true for manual settings
  }
}, {
  timestamps: false
});

module.exports = model('ManualSettings', manualSettingsSchema);
