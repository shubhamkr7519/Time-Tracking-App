// src/controllers/timeTrackingController.js
const timeTrackingService = require('../services/timeTrackingService');

class TimeTrackingController {
  // Get project time analytics
  async getProjectTime(req, res, next) {
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

      const projectTimeData = await timeTrackingService.getProjectTime(filters);
      res.json(projectTimeData);
    } catch (error) {
      next(error);
    }
  }

  // Get detailed time tracking data
  async getTimeTrackingData(req, res, next) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'start and end parameters are required'
        });
      }

      const filters = {
        start: parseInt(start),
        end: parseInt(end),
        timezone: req.query.timezone,
        employeeId: req.query.employeeId,
        teamId: req.query.teamId,
        projectId: req.query.projectId,
        taskId: req.query.taskId,
        shiftId: req.query.shiftId
      };

      const trackingData = await timeTrackingService.getTimeTrackingData(filters);
      res.json(trackingData);
    } catch (error) {
      next(error);
    }
  }

  // Start time tracking
  async startTimeTracking(req, res, next) {
    try {
      const { projectId, taskId } = req.body;
      const { organizationId, id: employeeId } = req.user;

      if (!projectId || !taskId) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'projectId and taskId are required'
        });
      }

      const activity = await timeTrackingService.startTimeTracking(
        req.body,
        organizationId,
        employeeId
      );

      res.status(201).json(activity);
    } catch (error) {
      next(error);
    }
  }

  // Stop time tracking
  async stopTimeTracking(req, res, next) {
    try {
      const { id: employeeId } = req.user;

      const activity = await timeTrackingService.stopTimeTracking(
        employeeId,
        req.body
      );

      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  // Get active time tracking session
  async getActiveSession(req, res, next) {
    try {
      const { id: employeeId } = req.user;

      const activeSession = await timeTrackingService.getActiveSession(employeeId);
      
      if (!activeSession) {
        return res.status(404).json({
          type: 'NOT_FOUND',
          message: 'No active time tracking session found'
        });
      }

      res.json(activeSession);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TimeTrackingController();
