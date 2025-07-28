// src/models/EmployeePrivileges.js
const { Schema } = require('mongoose');
const { PRIVILEGE_VALUES } = require('./Enums');

const employeePrivilegesSchema = new Schema({
  // Provide access to AppUsage data, if true
  apps: {
    type: Boolean,
    required: true
  },
  
  // Provide access to Productivity data, if true
  productivity: {
    type: Boolean,
    required: true
  },
  
  // Controls access to screenshots
  screenshots: {
    type: Schema.Types.Mixed, // Can be Privilege enum or false
    validate: {
      validator: function(value) {
        return value === false || PRIVILEGE_VALUES.includes(value);
      },
      message: 'screenshots must be either false or a valid privilege (read/write)'
    },
    required: true
  },
  
  // Controls access to PM
  pm: {
    type: Schema.Types.Mixed, // Can be Privilege enum or false
    validate: {
      validator: function(value) {
        return value === false || PRIVILEGE_VALUES.includes(value);
      },
      message: 'pm must be either false or a valid privilege (read/write)'
    },
    required: true
  },
  
  // Provide access to Productivity data, if true
  offline: {
    type: Schema.Types.Mixed, // Can be Privilege enum or false
    validate: {
      validator: function(value) {
        return value === false || PRIVILEGE_VALUES.includes(value);
      },
      message: 'offline must be either false or a valid privilege (read/write)'
    },
    required: true
  }
}, {
  timestamps: false,
  _id: false
});

module.exports = model('EmployeePrivileges', employeePrivilegesSchema);
