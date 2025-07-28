// src/models/Shift.js
const { Schema, model } = require('mongoose');

const shiftSchema = new Schema({
  // The ID for the shift
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
  
  // Type of shift - references ShiftType model (to be created later)
  type: {
    type: String,
    enum: SHIFT_TYPE_VALUES, // ['manual', 'automated', 'scheduled', 'leave']
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
  
  // Indicates if the employee is paid for work on the shift
  paid: {
    type: Boolean,
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
  
  // A moment (timestamp in milliseconds) during the shift when overtime has started
  overtimeStart: {
    type: Number,
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
  
  // It is calculated by subtracting the timezone offset from the overtime start time
  overtimeStartTranslated: {
    type: Number,
    required: true
  },
  
  // Reserved field
  negativeTime: {
    type: Number,
    required: true
  },
  
  // Number of deleted screenshots during the shift
  deletedScreenshots: {
    type: Number,
    required: true
  },
  
  // Time of the last activity on shift
  lastActivityEnd: {
    type: Number,
    required: true
  },
  
  // It is calculated by subtracting the timezone offset from the end time of the last activity
  lastActivityEndTranslated: {
    type: Number,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('Shift', shiftSchema);
