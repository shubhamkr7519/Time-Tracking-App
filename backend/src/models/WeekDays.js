// src/models/WeekDays.js
const { Schema } = require('mongoose');

const weekDaysSchema = new Schema({
  monday: {
    type: Boolean,
    required: true
  },
  
  tuesday: {
    type: Boolean,
    required: true
  },
  
  wednesday: {
    type: Boolean,
    required: true
  },
  
  thursday: {
    type: Boolean,
    required: true
  },
  
  friday: {
    type: Boolean,
    required: true
  },
  
  saturday: {
    type: Boolean,
    required: true
  },
  
  sunday: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: false,
  _id: false
});

module.exports = model('WeekDays', weekDaysSchema);
