// src/models/SharedSettings.js
const { Schema, model } = require('mongoose');
const { baseSettingsSchema } = require('./BaseSettings');

const sharedSettingsSchema = new Schema({
  // The ID for the settings
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // The ID for the name
  name: {
    type: String,
    required: true
  },
  
  // Type of settings - enum with values 'personal' or 'office'
  type: {
    type: String,
    enum: ['personal', 'office'],
    required: true
  },
  
  // Settings object - references the Settings model we just created
  settings: {
    type: baseSettingsSchema,
    required: true
  },
  
  // The ID of organization
  organizationId: {
    type: String,
    required: true
  },
  
  // Flag to mark if settings is default or not
  default: {
    type: Boolean,
    required: true,
    default: false
  },
  
  // Date in milliseconds representing when settings was created
  createdAt: {
    type: String, // API shows string type for this timestamp
    required: true
  }
}, {
  timestamps: false // Using custom timestamp field
});

module.exports = model('SharedSettings', sharedSettingsSchema);
