// src/models/BaseSettings.js
const { Schema } = require('mongoose');

// Enums
const TRACKING_TYPES = ['unlimited', 'limited', 'network', 'project', 'manual'];
const PRIVILEGE_VALUES = ['read', 'write'];

// WeekDays Schema
const weekDaysSchema = new Schema({
  monday: { type: Boolean, required: true },
  tuesday: { type: Boolean, required: true },
  wednesday: { type: Boolean, required: true },
  thursday: { type: Boolean, required: true },
  friday: { type: Boolean, required: true },
  saturday: { type: Boolean, required: true },
  sunday: { type: Boolean, required: true }
}, { _id: false });

// Employee Privileges Schema
const employeePrivilegesSchema = new Schema({
  // Provide access to AppUsage data, if true
  apps: { type: Boolean, required: true },
  
  // Provide access to Productivity data, if true
  productivity: { type: Boolean, required: true },
  
  // Controls access to screenshots (can be 'read', 'write', or false)
  screenshots: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(value) {
        return value === false || PRIVILEGE_VALUES.includes(value);
      },
      message: 'screenshots must be either false or a valid privilege (read/write)'
    }
  },
  
  // Controls access to PM (can be 'read', 'write', or false)
  pm: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(value) {
        return value === false || PRIVILEGE_VALUES.includes(value);
      },
      message: 'pm must be either false or a valid privilege (read/write)'
    }
  },
  
  // Provide access to offline data (can be 'read', 'write', or false)
  offline: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(value) {
        return value === false || PRIVILEGE_VALUES.includes(value);
      },
      message: 'offline must be either false or a valid privilege (read/write)'
    }
  }
}, { _id: false });

// Network Schema
const networkSchema = new Schema({
  // Network Name
  name: { type: String, required: true },
  
  // Router mac address
  macAddress: { type: String, required: true }
}, { _id: false });

// Base Settings Schema
const baseSettingsSchema = new Schema({
  // Type of tracking
  type: {
    type: String,
    enum: TRACKING_TYPES,
    required: true
  },
  
  // Idle time
  idle: {
    type: Number,
    required: true
  },
  
  // Breaks
  breaks: {
    type: Number,
    required: true
  },
  
  // Screenshots
  screenshots: {
    type: Number,
    required: true
  },
  
  // Days
  days: {
    type: weekDaysSchema,
    required: true
  },
  
  // Agent shows app icon on the taskbar, if true
  icon: {
    type: Boolean,
    required: true
  },
  
  // Agent shows Projects and Tasks, if true
  timer: {
    type: Boolean,
    required: true
  },
  
  // Agent shows timer, if true
  clocker: {
    type: Boolean,
    required: true
  },
  
  // Privileges of an employee
  privileges: {
    type: employeePrivilegesSchema,
    required: true
  }
}, {
  discriminatorKey: 'type',
  timestamps: false,
  _id: false
});

module.exports = { baseSettingsSchema, networkSchema };