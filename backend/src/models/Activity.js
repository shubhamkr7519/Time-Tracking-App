// src/models/Activity.js
const { Schema, model } = require('mongoose');

const activitySchema = new Schema({
  // The ID for the activity
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Employee ID
  employeeId: {
    type: String,
    required: true
  },
  
  // team ID
  teamId: {
    type: String,
    required: true
  },
  
  // Organization ID
  organizationId: {
    type: String,
    required: true
  },
  
  // The name of user
  name: {
    type: String,
    required: true
  },
  
  // The username of user
  user: {
    type: String,
    required: true
  },
  
  // Company domain
  domain: {
    type: String,
    required: true
  },
  
  // Computer name
  computer: {
    type: String,
    required: true
  },
  
  // Hardware ID
  hwid: {
    type: String,
    required: true
  },
  
  // Operating system
  os: {
    type: String,
    required: true
  },
  
  // Version of operating system
  osVersion: {
    type: String,
    required: true
  },
  
  // Time in milliseconds when shift is started
  start: {
    type: Number,
    required: true
  },
  
  // Time in milliseconds when shift is ended
  end: {
    type: Number,
    required: true
  },
  
  // Timezone difference in milliseconds, between the UTC and the current local time
  timezoneOffset: {
    type: Number,
    required: true
  },
  
  // It is calculated by subtracting the timezone offset from the start time of the shift
  startTranslated: {
    type: Number,
    required: true
  },
  
  // It is calculated by subtracting the timezone offset from the end time of the shift
  endTranslated: {
    type: Number,
    required: true
  },
  
  // ID of shift
  shiftId: {
    type: String,
    required: true
  },
  
  // The ID of project
  projectId: {
    type: Number, // Note: API shows Number type for this field
    required: true
  },
  
  // The ID of task
  taskId: {
    type: String,
    required: true
  },
  
  // The ID of window
  windowId: {
    type: String,
    required: true
  },
  
  // Indicates whether the employee is paid for the work on the shift or not during the activity
  paid: {
    type: Boolean,
    required: true
  },
  
  // Indicates whether the project is billable or not
  billable: {
    type: Boolean,
    required: true
  },
  
  // Indicates whether the activity is created while the employee is working overtime or not
  overtime: {
    type: Boolean,
    required: true
  },
  
  // Bill rate
  billRate: {
    type: Number,
    required: true
  },
  
  // Overtime bill rate
  overtimeBillRate: {
    type: Number,
    required: true
  },
  
  // Employee's hourly pay rate
  payRate: {
    type: Number,
    required: true
  },
  
  // Employee's overtime hourly pay rate
  overtimePayRate: {
    type: Number,
    required: true
  },
  
  // Number of key strokes during the activity
  keystrokes: {
    type: Number,
    required: true
  },
  
  // Optional. System permissions if any provided for screenshot
  systemPermissions: {
    type: Schema.Types.ObjectId,
    ref: 'ISystemPermissions',
    required: false
  },
  
  // Number of clicks during the activity
  mouseClicks: {
    type: Number,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('Activity', activitySchema);
