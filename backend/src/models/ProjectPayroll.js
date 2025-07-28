// src/models/ProjectPayroll.js
const { Schema, model } = require('mongoose');

const projectPayrollSchema = new Schema({
  // Payment details for every employee separately or use * to target every employee
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Payroll',
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('ProjectPayroll', projectPayrollSchema);
