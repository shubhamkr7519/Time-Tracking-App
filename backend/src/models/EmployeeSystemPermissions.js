// src/models/EmployeeSystemPermissions.js
const { Schema, model } = require('mongoose');

const employeeSystemPermissionsSchema = new Schema({
  // Name of the computer from which the permissions were taken
  computer: {
    type: String,
    required: true
  },
  
  // Reference to ISystemPermissions
  permissions: {
    type: Schema.Types.ObjectId,
    ref: 'ISystemPermissions',
    required: true
  },
  
  // Date in milliseconds when item was created
  createdAt: {
    type: Number,
    required: true,
    default: Date.now
  },
  
  // Date in milliseconds when item was updated
  updatedAt: {
    type: Number,
    required: true,
    default: Date.now
  }
}, {
  timestamps: false // Using custom timestamp fields
});

// Update the updatedAt field before saving
employeeSystemPermissionsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = model('EmployeeSystemPermissions', employeeSystemPermissionsSchema);
