// src/controllers/analyticsController.js
const analyticsService = require('../services/analyticsService');

class AnalyticsController {
  // Get window analytics
  async getWindowAnalytics(req, res, next) {
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

      const filters = {
        start: startTime,
        end: endTime,
        timezone: req.query.timezone,
        employeeId: req.query.employeeId,
        teamId: req.query.teamId,
        projectId: req.query.projectId,
        taskId: req.query.taskId,
        shiftId: req.query.shiftId
      };

      const windowData = await analyticsService.getWindowAnalytics(filters);
      res.json(windowData);
    } catch (error) {
      next(error);
    }
  }

  // Get project time analytics
  async getProjectTimeAnalytics(req, res, next) {
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

      const filters = {
        start: startTime,
        end: endTime,
        timezone: req.query.timezone,
        employeeId: req.query.employeeId,
        teamId: req.query.teamId,
        projectId: req.query.projectId,
        taskId: req.query.taskId,
        shiftId: req.query.shiftId
      };

      const projectTimeData = await analyticsService.getProjectTimeAnalytics(filters);
      res.json(projectTimeData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
