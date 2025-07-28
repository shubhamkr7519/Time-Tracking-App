// src/middleware/errorHandler.js (Updated to handle validation details)
module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle custom errors with type and details
  if (err.type) {
    const response = {
      type: err.type,
      message: err.message
    };
    
    // Add details if they exist (for validation errors)
    if (err.details) {
      response.details = err.details;
    }
    
    return res.status(err.status || 500).json(response);
  }
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      type: 'VALIDATION_ERROR',
      message: 'Parameters validation error!'
    });
  }
  
  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      type: 'EntityConflict',
      message: 'Duplicated resource.'
    });
  }
  
  // Default error
  res.status(500).json({
    type: 'INTERNAL_ERROR',
    message: err.message || 'Internal server error'
  });
};
