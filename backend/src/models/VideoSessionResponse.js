// src/models/VideoSessionResponse.js
const { Schema, model } = require('mongoose');

const videoSessionResponseSchema = new Schema({
  // The ID for the settings
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // The ID of employee
  employeeId: {
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
  
  // Start of item in milliseconds
  start: {
    type: Number,
    required: true
  },
  
  // End of item in milliseconds
  end: {
    type: Number,
    required: true
  },
  
  // Timezone in which item is created
  timezone: {
    type: String,
    required: true
  },
  
  // Duration of item
  duration: {
    type: Number,
    required: true
  },
  
  // Number of screens
  screens: {
    type: Number,
    required: true
  },
  
  // Id of shift in which item is created
  shiftId: {
    type: String,
    required: true
  },
  
  // Id of project in which item is created if working with projects
  projectId: {
    type: String,
    required: true
  },
  
  // Id of task in which item is created if working with projects
  taskId: {
    type: String,
    required: true
  },
  
  // Computer of employee
  computer: {
    type: String,
    required: true
  },
  
  // Hash value that is used to fetch next batch of data
  next: {
    type: String,
    required: true
  }
}, {
  timestamps: false // Using custom timestamp fields
});

module.exports = model('VideoSessionResponse', videoSessionResponseSchema);
