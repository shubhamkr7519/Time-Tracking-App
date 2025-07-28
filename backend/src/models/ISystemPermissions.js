// src/models/ISystemPermissions.js
const { Schema, model } = require('mongoose');

const iSystemPermissionsSchema = new Schema({
  // Permission type identifier
  accessibility: {
    type: String,
    enum: ['authorized', 'denied', 'undetermined'],
    required: true
  },
  
  // Screen and system audio recording permission
  screenAndSystemAudioRecording: {
    type: String,
    enum: ['authorized', 'denied', 'undetermined'],
    required: true
  }
}, {
  timestamps: false,
  _id: false // This might be used as a subdocument
});

module.exports = model('ISystemPermissions', iSystemPermissionsSchema);
