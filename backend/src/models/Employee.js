// src/models/Employee.js (Corrected based on your image)
const { Schema, model } = require('mongoose');

const employeeSchema = new Schema({
  // The ID for the employee
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // The name for employee
  name: { 
    type: String, 
    required: true 
  },
  
  // The ID of team which employee now belongs
  teamsId: { 
    type: String, 
    required: true 
  },
  
  // The ID of shared settings applied on employee
  sharedSettingsId: { 
    type: String, 
    required: true 
  },
  
  // The ID of the employee account in Insightful application
  accountId: { 
    type: String, 
    required: true 
  },
  
  // Unique ID of an employee based on email, computer logon or domain logon info
  identifier: { 
    type: String, 
    required: true,
    unique: true 
  },
  
  // Type of shared settings applied on this employee. Values are personal, office
  type: { 
    type: String, 
    enum: ['personal', 'office'],
    required: true 
  },
  
  // The ID of organization which employee belongs
  organizationId: { 
    type: String, 
    required: true 
  },
  
  // The IDs of projects which employee has access
  projects: [{ 
    type: String 
  }],
  
  // Time in milliseconds represents the time since the employee was deactivated
  deactivated: { 
    type: Number, 
    required: true 
  },
  
  // Time in milliseconds represents the time elapsed from the time the invitation was sent to the acceptance
  invited: { 
    type: Number, 
    required: true 
  },
  
  // List of system permissions that employee used per computer
  systemPermissions: [{
    type: Schema.Types.ObjectId,
    ref: 'EmployeeSystemPermissions'
  }],
  
  // Time in milliseconds represents the time when employee was created
  createdAt: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: false // No automatic timestamps
});

module.exports = model('Employee', employeeSchema);