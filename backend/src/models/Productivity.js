// src/models/Productivity.js
const { Schema, model } = require('mongoose');

const productivitySchema = new Schema({
  // Type of productivity (0=unreviewed, 1,2,3=productivity levels)
  productivity: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true
  },
  
  // Sum of usage
  usage: {
    type: Number,
    required: true
  }
}, {
  timestamps: false,
  _id: false // This might be used as a subdocument
});

module.exports = model('Productivity', productivitySchema);
