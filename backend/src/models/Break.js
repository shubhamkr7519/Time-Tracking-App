// src/models/Break.js
const { Schema, model } = require('mongoose');

const breakSchema = new Schema({
  // The ID for the break
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // The ID of shift
  shiftId: {
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
  }
}, {
  timestamps: false
});

module.exports = model('Break', breakSchema);
