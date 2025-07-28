// src/models/NetworkSettings.js
const { Schema, model } = require('mongoose');
const baseSettingsSchema = require('./BaseSettings');

const networkSettingsSchema = new Schema({
  ...baseSettingsSchema.obj,
  // Type must be 'network' for this settings type
  type: {
    type: String,
    enum: ['network'],
    required: true,
    default: 'network'
  },
  
  // List of router mac addresses
  network: [{
    type: Schema.Types.ObjectId,
    ref: 'Network',
    required: true
  }]
}, {
  timestamps: false
});

module.exports = model('NetworkSettings', networkSettingsSchema);
