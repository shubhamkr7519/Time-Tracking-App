// src/models/ProjectTime.js
const { Schema, model } = require('mongoose');

const projectTimeSchema = new Schema({
  // Project Id
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Total sum of the time spent on the one task
  time: {
    type: Number,
    required: true
  },
  
  // Total costs
  costs: {
    type: Number,
    required: true
  },
  
  // Total income
  income: {
    type: Number,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('ProjectTime', projectTimeSchema);
