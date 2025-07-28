// src/controllers/screenshotController.js
const screenshotService = require('../services/screenshotService');

class ScreenshotController {
  // Get paginated screenshots
  async getScreenshotsPaginated(req, res, next) {
    try {
      const { start, end } = req.query;

      // Validate required parameters
      if (!start || !end) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'start and end parameters are required'
        });
      }

      // Validate that start and end are valid timestamps
      const startTime = parseInt(start);
      const endTime = parseInt(end);

      if (isNaN(startTime) || isNaN(endTime)) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'start and end must be valid unix timestamps in milliseconds'
        });
      }

      if (startTime >= endTime) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'start time must be before end time'
        });
      }

      // Validate limit parameter
      const limit = req.query.limit ? parseInt(req.query.limit) : 10000;
      if (isNaN(limit) || limit <= 0 || limit > 50000) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'limit must be a positive number between 1 and 50000'
        });
      }

      // Validate sortBy parameter
      const validSortFields = [
        'productivity', 'name', 'user', 'app', 'title', 'url', 
        'shiftId', 'projectId', 'taskId', 'WindowId', 'appOrgId', 
        'appTeamId', 'employeeId', 'teamId'
      ];

      const sortBy = req.query.sortBy;
      if (sortBy && !validSortFields.includes(sortBy)) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: `sortBy must be one of: ${validSortFields.join(', ')}`
        });
      }

      const filters = {
        start: startTime,
        end: endTime,
        timezone: req.query.timezone,
        taskId: req.query.taskId,
        shiftId: req.query.shiftId,
        projectId: req.query.projectId,
        sortBy: sortBy || 'timestampTranslated',
        limit: limit,
        next: req.query.next
      };

      const result = await screenshotService.getScreenshotsPaginated(filters);
      
      // Return screenshots array directly (matching Insightful API format)
      res.json(result.screenshots);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ScreenshotController();
