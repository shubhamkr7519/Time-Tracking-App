// src/models/ScreenshotResponse.js
const { Schema, model } = require('mongoose');

const screenshotResponseSchema = new Schema({
  // The ID for item
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Site used when screenshot is taken
  site: {
    type: String,
    required: true
  },
  
  // Type of productivity
  productivity: {
    type: Number,
    required: true
  },
  
  // The ID of employee
  employeeId: {
    type: String,
    required: true
  },
  
  // The ID of app when screenshot is taken
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
  
  // The ID of team
  teamId: {
    type: String,
    required: true
  },
  
  // The ID of organization
  organizationId: {
    type: String,
    required: true
  },
  
  // The ID of merged employee
  srcEmployeeId: {
    type: String,
    required: true
  },
  
  // The team ID of merged employee
  srcTeamId: {
    type: String,
    required: true
  },
  
  // Timestamp in milliseconds translated to UTC
  timestampTranslated: {
    type: String,
    required: true
  },
  
  // Optional. System permissions if any provided for screenshot.
  systemPermissions: {
    type: Schema.Types.ObjectId,
    ref: 'ISystemPermissions',
    required: false
  },
  
  // Hash value that is used to fetch next batch of data
  next: {
    type: String,
    required: true
  }
}, {
  timestamps: false // Using custom timestamp fields
});

module.exports = model('ScreenshotResponse', screenshotResponseSchema);
