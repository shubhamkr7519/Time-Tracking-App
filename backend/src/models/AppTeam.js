// src/models/AppTeam.js
const { Schema, model } = require('mongoose');

const appTeamSchema = new Schema({
  // The ID of app team
  appTeamId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Sum of usage
  usage: {
    type: Number,
    required: true
  },
  
  // The name of application
  name: {
    type: String,
    required: true
  },
  
  // The ID of application
  appId: {
    type: String,
    required: true
  },
  
  // Type of productivity (0=unreviewed, 1,2,3=productivity levels)
  productivity: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('AppTeam', appTeamSchema);
