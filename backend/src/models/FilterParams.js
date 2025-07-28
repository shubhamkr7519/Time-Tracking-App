// src/models/FilterParams.js
const { Schema } = require('mongoose');

const filterParamsSchema = new Schema({
  // Date in milliseconds
  start: {
    type: Number,
    required: true
  },
  
  // Date in milliseconds
  end: {
    type: Number,
    required: true
  },
  
  // By which parameter you want to group response data
  groupBy: {
    type: String,
    enum: ['day', 'week', 'month', 'employee', 'team', 'shift', 'task', 'project', 'window'],
    required: false
  },
  
  // If passed data will be shown as in particular timezone
  timezone: {
    type: String,
    required: false
  },
  
  // Get result for specific employees (comma separated string)
  employeeId: {
    type: String,
    required: false
  },
  
  // Get result for specific teams (comma separated string)
  teamId: {
    type: String,
    required: false
  },
  
  // Get result for specific projects (comma separated string)
  projectId: {
    type: String,
    required: false
  },
  
  // Get result for specific tasks (comma separated string)
  taskId: {
    type: String,
    required: false
  },
  
  // Get result for specific shifts (comma separated string)
  shiftId: {
    type: String,
    required: false
  },
  
  // Get result for specific apps (comma separated string)
  appId: {
    type: String,
    required: false
  },
  
  // Get result by productivity
  productivity: {
    type: String,
    required: false
  }
}, {
  timestamps: false,
  _id: false
});

module.exports = model('FilterParams', filterParamsSchema);
