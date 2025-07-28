// src/models/App.js
const { Schema, model } = require('mongoose');

const appSchema = new Schema({
  // The ID of application
  appId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Sum of usage
  usage: {
    type: Number,
    required: true
  },
  
  // Name of the application
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('App', appSchema);
