// src/models/UnlimitedSettings.js
const { Schema, model } = require('mongoose');
const baseSettingsSchema = require('./BaseSettings');

const unlimitedSettingsSchema = new Schema({
  ...baseSettingsSchema.obj,
  // Type must be 'unlimited' for this settings type
  type: {
    type: String,
    enum: ['unlimited'],
    required: true,
    default: 'unlimited'
  }
}, {
  timestamps: false
});

module.exports = model('UnlimitedSettings', unlimitedSettingsSchema);
