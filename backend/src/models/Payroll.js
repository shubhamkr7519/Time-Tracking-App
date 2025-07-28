// src/models/Payroll.js
const { Schema, model } = require('mongoose');

const payrollSchema = new Schema({
  // Bill rate
  billRate: {
    type: Number,
    required: true
  },
  
  // Overtime bill rate
  overtimeBillRate: {
    type: Number,
    required: false
  }
}, {
  timestamps: false
});

module.exports = model('Payroll', payrollSchema);
