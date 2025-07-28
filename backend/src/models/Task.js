// src/models/Task.js (Simplified and Fixed)
const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  // The ID for the task
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // The name of the task
  name: { 
    type: String, 
    required: true 
  },
  
  // The ID of project which task belongs to
  projectId: { 
    type: String, 
    required: true 
  },
  
  // The ID of organization which task belongs to
  organizationId: { 
    type: String, 
    required: true 
  },
  
  // The IDs of employees assigned to this task
  employees: [{ 
    type: String 
  }],
  
  // Task description (optional)
  description: {
    type: String,
    default: ''
  },
  
  // Task status
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  
  // Task priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Time in milliseconds represents the time when task was created
  createdAt: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: false // No automatic timestamps
});

module.exports = model('Task', taskSchema);
