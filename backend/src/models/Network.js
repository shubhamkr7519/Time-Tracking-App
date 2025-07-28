// src/models/Network.js
const { Schema, model } = require('mongoose');

const networkSchema = new Schema({
  // Network Name
  name: {
    type: String,
    required: true
  },
  
  // Router mac address
  macAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('Network', networkSchema);
