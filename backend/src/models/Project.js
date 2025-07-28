// src/models/Project.js (Simplified and Fixed)
const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  // The ID for the project
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // The name of the project
  name: { 
    type: String, 
    required: true 
  },
  
  // The ID of team which project belongs to
  teamId: { 
    type: String, 
    required: true 
  },
  
  // The ID of organization which project belongs to
  organizationId: { 
    type: String, 
    required: true 
  },
  
  // The IDs of employees assigned to this project
  employees: [{ 
    type: String 
  }],
  
  // Project description (optional)
  description: {
    type: String,
    default: ''
  },
  
  // Project status
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  
  // Time in milliseconds represents the time when project was created
  createdAt: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: false // No automatic timestamps
});

module.exports = model('Project', projectSchema);
