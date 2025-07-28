// src/models/Team.js (Updated to make description optional)
const { Schema, model } = require('mongoose');

const teamSchema = new Schema({
  // The ID for the team
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Boolean flags for tracking different application types
  ignoreProductive: {
    type: Boolean,
    required: true,
    default: false
  },
  
  ignoreNeutral: {
    type: Boolean,
    required: true,
    default: false
  },
  
  ignoreUnproductive: {
    type: Boolean,
    required: true,
    default: false
  },
  
  ignoreUnreviewed: {
    type: Boolean,
    required: true,
    default: false
  },
  
  // The name of team (REQUIRED)
  name: {
    type: String,
    required: true
  },
  
  // The description of team (OPTIONAL)
  description: {
    type: String,
    required: false, // Changed to optional
    default: ''
  },
  
  // The ID of the organization which team belongs
  organizationId: {
    type: String,
    required: true
  },
  
  // The flag which tells you if team is default
  default: {
    type: Boolean,
    required: true,
    default: false
  },
  
  // Array of all employees in this team
  employees: [{
    type: String // Employee IDs
  }],
  
  // Array of all projects in this team
  projects: [{
    type: String // Project IDs
  }],
  
  // Time in milliseconds represents the time when team was created
  createdAt: {
    type: Number,
    required: true,
    default: Date.now
  }
}, {
  timestamps: false, // Using custom timestamp field
  collection: 'teams' // Explicitly set collection name
});

module.exports = model('Team', teamSchema);
