// src/models/ProjectSettings.js
const { Schema, model } = require('mongoose');
const baseSettingsSchema = require('./BaseSettings');

const projectSettingsSchema = new Schema({
  ...baseSettingsSchema.obj,
  // Type must be 'project' for this settings type
  type: {
    type: String,
    enum: ['project'],
    required: true,
    default: 'project'
  },
  // Override specific fields as per API requirements
  breaks: {
    type: Number,
    required: true,
    default: 0 // Must be 0 for project settings
  },
  icon: {
    type: Boolean,
    required: true,
    default: true // Must be true for project settings
  },
  timer: {
    type: Boolean,
    required: true,
    default: true // Must be true for project settings
  },
  clocker: {
    type: Boolean,
    required: true,
    default: false // Must be false for project settings
  }
}, {
  timestamps: false
});

module.exports = model('ProjectSettings', projectSettingsSchema);
