// src/models/RecordingChunkResponse.js
const { Schema, model } = require('mongoose');

const recordingChunkResponseSchema = new Schema({
  // The ID for the settings
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Start of item in milliseconds
  start: {
    type: Number,
    required: true
  },
  
  // End of item in milliseconds
  end: {
    type: Number,
    required: true
  },
  
  // Duration of item
  duration: {
    type: Number,
    required: true
  },
  
  // Id of video session
  videoSessionId: {
    type: String,
    required: true
  },
  
  // Id of screen recording
  screenRecordingId: {
    type: String,
    required: true
  },
  
  // Url of video chunk
  videoUrl: {
    type: String,
    required: true
  },
  
  // Url of thumbnail
  thumbnailUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: false
});

module.exports = model('RecordingChunkResponse', recordingChunkResponseSchema);
