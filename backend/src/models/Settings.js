// src/models/Settings.js
const { Schema, model } = require('mongoose');
const { baseSettingsSchema, networkSchema } = require('./BaseSettings');

// Main Settings model
const Settings = model('Settings', baseSettingsSchema);

// UnlimitedSettings - inherits all BaseSettings properties
// Type is automatically set to 'unlimited'
const UnlimitedSettings = Settings.discriminator('unlimited', new Schema({
  // No additional fields beyond BaseSettings
}, { timestamps: false }));

// LimitedSettings - has additional start and end properties
const LimitedSettings = Settings.discriminator('limited', new Schema({
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
}, { timestamps: false }));

// NetworkSettings - has additional network array
const NetworkSettings = Settings.discriminator('network', new Schema({
  // List of router mac addresses
  network: [{
    type: networkSchema,
    required: true
  }]
}, { timestamps: false }));

// ProjectSettings - inherits BaseSettings with specific constraints
const ProjectSettings = Settings.discriminator('project', new Schema({
  // Override breaks to be 0
  breaks: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: function(value) {
        return value === 0;
      },
      message: 'breaks must be set to 0 for project settings'
    }
  },
  
  // Override icon to be true
  icon: {
    type: Boolean,
    required: true,
    default: true,
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: 'icon must be set to true for project settings'
    }
  },
  
  // Override timer to be true
  timer: {
    type: Boolean,
    required: true,
    default: true,
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: 'timer must be set to true for project settings'
    }
  },
  
  // Override clocker to be false
  clocker: {
    type: Boolean,
    required: true,
    default: false,
    validate: {
      validator: function(value) {
        return value === false;
      },
      message: 'clocker must be set to false for project settings'
    }
  }
}, { timestamps: false }));

// ManualSettings - inherits BaseSettings with specific constraints
const ManualSettings = Settings.discriminator('manual', new Schema({
  // Override icon to be true
  icon: {
    type: Boolean,
    required: true,
    default: true,
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: 'icon must be set to true for manual settings'
    }
  },
  
  // Override clocker to be true
  clocker: {
    type: Boolean,
    required: true,
    default: true,
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: 'clocker must be set to true for manual settings'
    }
  }
}, { timestamps: false }));

module.exports = {
  Settings,
  UnlimitedSettings,
  LimitedSettings,
  NetworkSettings,
  ProjectSettings,
  ManualSettings
};
