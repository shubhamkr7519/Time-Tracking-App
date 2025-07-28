// src/models/Fragment.js
const { Schema, model } = require('mongoose');

const fragmentSchema = new Schema({
  // The ID for the fragment
  id: {
    type: String,
    required: true,
    unique: true
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
  
  // Company name
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
  
  // Operating system version
  osVersion: {
    type: String,
    required: true
  },
  
  // Time in milliseconds when fragment is started
  start: {
    type: Number,
    required: true
  },
  
  // Time in milliseconds when fragment is ended
  end: {
    type: Number,
    required: true
  },
  
  // Timezone difference in milliseconds, between the UTC and the current local time
  timezoneOffset: {
    type: String, // Note: API shows string type for this field
    required: true
  },
  
  // Application name
  app: {
    type: String,
    required: true
  },
  
  // Application executable's name
  appFileName: {
    type: String,
    required: true
  },
  
  // Application executable's full path
  appFilePath: {
    type: String,
    required: true
  },
  
  // Application/Website Title
  title: {
    type: String,
    required: true
  },
  
  // Website Url
  url: {
    type: String,
    required: true
  },
  
  // Reserved field
  document: {
    type: String,
    required: true
  },
  
  // Indicates whether the application is active or not
  active: {
    type: Boolean,
    required: true
  },
  
  // List of network adapters mac addresses
  gateways: [{
    type: String
  }],
  
  // Number of key strokes during the fragment
  keystrokes: {
    type: Number,
    required: true
  },
  
  // Number of clicks during the fragment
  mouseClicks: {
    type: Number,
    required: true
  },
  
  // The ID of shift
  shiftId: {
    type: String,
    required: true
  },
  
  // The ID of project
  projectId: {
    type: String,
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
  
  // Tasks priority
  taskPriority: {
    type: String,
    required: true
  },
  
  // The ID of window
  windowId: {
    type: String,
    required: true
  },
  
  // Indicates whether the employee is paid for the work on the shift or not during the fragment
  paid: {
    type: Boolean,
    required: true
  },
  
  // Indicates whether the project is billable or not
  billable: {
    type: Boolean,
    required: true
  },
  
  // Indicates whether the fragment is created while the employee is working overtime or not
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
  
  // Site address
  site: {
    type: String,
    required: true
  },
  
  // Type of productivity (0=unreviewed, 1,2,3=productivity levels)
  productivity: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true
  },
  
  // The ID of app
  appId: {
    type: String,
    required: true
  },
  
  // The ID of app org
  appOrgId: {
    type: String,
    required: true
  },
  
  // The ID of app team
  appTeamId: {
    type: String,
    required: true
  },
  
  // The ID of organization
  organizationId: {
    type: String,
    required: true
  },
  
  // The ID of team
  teamId: {
    type: String,
    required: true
  },
  
  // The ID of activity
  activityId: {
    type: String,
    required: true
  },
  
  // It is calculated by subtracting the timezone offset from the start time of the fragment
  startTranslated: {
    type: Number,
    required: true
  },
  
  // It is calculated by subtracting the timezone offset from the end time of the fragment
  endTranslated: {
    type: Number,
    required: true
  },
  
  // Hash value that can be used for fetching next bunch of data if result is bigger than 10000 records
  next: {
    type: String,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('Fragment', fragmentSchema);
