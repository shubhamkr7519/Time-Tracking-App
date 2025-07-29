// backend/src/models/TimeSession.js
const mongoose = require('mongoose');

const timeSessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  taskId: {
    type: String,
    required: true,
    ref: 'Task'
  },
  projectId: {
    type: String,
    required: true,
    ref: 'Project'
  },
  startTime: {
    type: Number,
    required: true
  },
  endTime: {
    type: Number,
    default: null
  },
  duration: {
    type: Number,
    default: 0
  },
  screenshotCount: {
    type: Number,
    default: 0
  },
  activityData: {
    mouseClicks: { type: Number, default: 0 },
    keyPresses: { type: Number, default: 0 },
    activeWindows: [String],
    productivityScore: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  synced: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  updatedAt: {
    type: Number,
    default: Date.now
  }
});

// Generate unique ID
timeSessionSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = 'ts_' + require('crypto').randomBytes(8).toString('hex');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TimeSession', timeSessionSchema);
