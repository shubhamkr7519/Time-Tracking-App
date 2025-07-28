// src/models/Window.js
const { Schema, model } = require('mongoose');

const windowSchema = new Schema({
  // The ID for the window
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Token
  token: {
    type: String,
    required: true
  },
  
  // Type of window - references WindowType enum
  type: {
    type: String,
    enum: ['manual', 'tracked'],
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
  
  // ID of shift
  shiftId: {
    type: String,
    required: true
  },
  
  // The ID of project
  projectId: {
    type: Number,
    required: true
  },
  
  // The ID of task
  taskId: {
    type: String,
    required: true
  },
  
  // The status of task
  taskStatus: {
    type: String,
    required: true
  },
  
  // The priority of task
  taskPriority: {
    type: String,
    required: true
  },
  
  // Indicates whether the employee is paid for the work on the shift or not during the window
  paid: {
    type: Boolean,
    required: true
  },
  
  // Indicates whether the project is billable or not
  billable: {
    type: Boolean,
    required: true
  },
  
  // Indicates whether the window is created while the employee is working overtime or not
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
  
  // Overtime bill rate
  overtimePayRate: {
    type: Number,
    required: true
  },
  
  // Task note
  note: {
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
  
  // Reserved field
  negativeTime: {
    type: Number,
    required: true
  },
  
  // Count of deleted screenshots during the window
  deletedScreenshots: {
    type: Number,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('Window', windowSchema);
