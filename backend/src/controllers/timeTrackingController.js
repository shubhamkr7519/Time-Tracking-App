// backend/src/controllers/timeTrackingController.js
const TimeSession = require('../models/TimeSession');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Employee = require('../models/Employee');

class TimeTrackingController {
  // Start time tracking session
  async startTracking(req, res) {
    try {
      const { taskId } = req.body;
      const employeeId = req.user.employeeId;
      
      console.log('Starting time tracking:', { taskId, employeeId });

      if (!taskId) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Task ID is required'
        });
      }

      // Check if task exists and is assigned to this employee
      const task = await Task.findOne({ id: taskId });
      if (!task) {
        return res.status(404).json({
          type: 'NOT_FOUND',
          message: 'Task not found'
        });
      }

      // Check if employee has this task assigned
      if (task.assignedEmployees && !task.assignedEmployees.includes(employeeId)) {
        return res.status(403).json({
          type: 'FORBIDDEN',
          message: 'Task not assigned to you'
        });
      }

      // Check if there's already an active session for this employee
      const activeSession = await TimeSession.findOne({
        employeeId,
        status: 'active'
      });

      if (activeSession) {
        return res.status(400).json({
          type: 'ACTIVE_SESSION_EXISTS',
          message: 'You already have an active tracking session. Please stop it first.',
          activeSession: {
            id: activeSession.id,
            taskId: activeSession.taskId,
            startTime: activeSession.startTime
          }
        });
      }

      // Create new time session
      const timeSession = new TimeSession({
        employeeId,
        taskId: task.id,
        projectId: task.projectId,
        startTime: Date.now(),
        status: 'active'
      });

      await timeSession.save();

      // Update task status to 'in-progress' if not already
      if (task.status !== 'in-progress') {
        task.status = 'in-progress';
        await task.save();
      }

      console.log('Time tracking started:', timeSession.id);

      res.status(201).json({
        type: 'SUCCESS',
        message: 'Time tracking started successfully',
        session: {
          id: timeSession.id,
          taskId: timeSession.taskId,
          projectId: timeSession.projectId,
          startTime: timeSession.startTime,
          status: timeSession.status
        }
      });
    } catch (error) {
      console.error('Start tracking error:', error);
      res.status(500).json({
        type: 'INTERNAL_ERROR',
        message: 'Failed to start time tracking',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Stop time tracking session
  async stopTracking(req, res) {
    try {
      const { sessionId, screenshotCount = 0, activityData = {} } = req.body;
      const employeeId = req.user.employeeId;

      console.log('Stopping time tracking:', { sessionId, employeeId });

      // Find active session
      let timeSession;
      if (sessionId) {
        timeSession = await TimeSession.findOne({
          id: sessionId,
          employeeId,
          status: 'active'
        });
      } else {
        // Find any active session for this employee
        timeSession = await TimeSession.findOne({
          employeeId,
          status: 'active'
        });
      }

      if (!timeSession) {
        return res.status(404).json({
          type: 'NOT_FOUND',
          message: 'No active tracking session found'
        });
      }

      // Update session
      const endTime = Date.now();
      const duration = endTime - timeSession.startTime;

      timeSession.endTime = endTime;
      timeSession.duration = duration;
      timeSession.status = 'completed';
      timeSession.screenshotCount = screenshotCount;
      timeSession.activityData = {
        ...timeSession.activityData,
        ...activityData
      };

      await timeSession.save();

      console.log('Time tracking stopped:', {
        sessionId: timeSession.id,
        duration: `${Math.round(duration / 1000 / 60)} minutes`
      });

      res.json({
        type: 'SUCCESS',
        message: 'Time tracking stopped successfully',
        session: {
          id: timeSession.id,
          taskId: timeSession.taskId,
          projectId: timeSession.projectId,
          startTime: timeSession.startTime,
          endTime: timeSession.endTime,
          duration: timeSession.duration,
          status: timeSession.status
        }
      });
    } catch (error) {
      console.error('Stop tracking error:', error);
      res.status(500).json({
        type: 'INTERNAL_ERROR',
        message: 'Failed to stop time tracking',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get current active session
  async getActiveSession(req, res) {
    try {
      const employeeId = req.user.employeeId;

      const activeSession = await TimeSession.findOne({
        employeeId,
        status: 'active'
      });

      if (!activeSession) {
        return res.json({
          type: 'SUCCESS',
          message: 'No active session',
          session: null
        });
      }

      // Get task and project details
      const task = await Task.findOne({ id: activeSession.taskId });
      const project = await Project.findOne({ id: activeSession.projectId });

      res.json({
        type: 'SUCCESS',
        message: 'Active session found',
        session: {
          id: activeSession.id,
          taskId: activeSession.taskId,
          taskName: task ? task.name : 'Unknown Task',
          projectId: activeSession.projectId,
          projectName: project ? project.name : 'Unknown Project',
          startTime: activeSession.startTime,
          duration: Date.now() - activeSession.startTime,
          status: activeSession.status
        }
      });
    } catch (error) {
      console.error('Get active session error:', error);
      res.status(500).json({
        type: 'INTERNAL_ERROR',
        message: 'Failed to get active session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get time sessions for employee (with pagination)
  async getSessions(req, res) {
    try {
      const employeeId = req.user.employeeId;
      const { 
        limit = 50, 
        offset = 0, 
        startDate, 
        endDate, 
        taskId, 
        projectId 
      } = req.query;

      // Build query
      const query = { employeeId };
      
      if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = parseInt(startDate);
        if (endDate) query.startTime.$lte = parseInt(endDate);
      }
      
      if (taskId) query.taskId = taskId;
      if (projectId) query.projectId = projectId;

      // Get sessions with task and project details
      const sessions = await TimeSession.find(query)
        .sort({ startTime: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset));

      // Enrich with task and project data
      const enrichedSessions = await Promise.all(
        sessions.map(async (session) => {
          const task = await Task.findOne({ id: session.taskId });
          const project = await Project.findOne({ id: session.projectId });
          
          return {
            id: session.id,
            taskId: session.taskId,
            taskName: task ? task.name : 'Unknown Task',
            projectId: session.projectId,
            projectName: project ? project.name : 'Unknown Project',
            startTime: session.startTime,
            endTime: session.endTime,
            duration: session.duration,
            screenshotCount: session.screenshotCount,
            status: session.status,
            createdAt: session.createdAt
          };
        })
      );

      // Get total count
      const totalCount = await TimeSession.countDocuments(query);

      res.json({
        type: 'SUCCESS',
        message: 'Sessions retrieved successfully',
        sessions: enrichedSessions,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: totalCount > (parseInt(offset) + parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({
        type: 'INTERNAL_ERROR',
        message: 'Failed to get sessions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Sync data from desktop app
  async syncData(req, res) {
    try {
      const { 
        sessionId,
        screenshotCount = 0,
        activityData = {},
        duration 
      } = req.body;
      const employeeId = req.user.employeeId;

      if (!sessionId) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Session ID is required'
        });
      }

      const timeSession = await TimeSession.findOne({
        id: sessionId,
        employeeId
      });

      if (!timeSession) {
        return res.status(404).json({
          type: 'NOT_FOUND',
          message: 'Session not found'
        });
      }

      // Update session with sync data
      timeSession.screenshotCount = screenshotCount;
      timeSession.activityData = {
        ...timeSession.activityData,
        ...activityData
      };
      
      if (duration) {
        timeSession.duration = duration;
      }
      
      timeSession.synced = true;
      await timeSession.save();

      res.json({
        type: 'SUCCESS',
        message: 'Data synced successfully'
      });
    } catch (error) {
      console.error('Sync data error:', error);
      res.status(500).json({
        type: 'INTERNAL_ERROR',
        message: 'Failed to sync data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get time tracking statistics
  async getStats(req, res) {
    try {
      const employeeId = req.user.employeeId;
      const { period = 'week' } = req.query; // today, week, month

      let startTime;
      const now = Date.now();
      
      switch (period) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          startTime = today.getTime();
          break;
        case 'week':
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
          startTime = weekAgo.getTime();
          break;
        case 'month':
          const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
          startTime = monthAgo.getTime();
          break;
        default:
          startTime = 0;
      }

      // Get completed sessions in period
      const sessions = await TimeSession.find({
        employeeId,
        status: 'completed',
        startTime: { $gte: startTime }
      });

      // Calculate statistics
      const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
      const totalSessions = sessions.length;
      const totalScreenshots = sessions.reduce((sum, session) => sum + (session.screenshotCount || 0), 0);

      // Group by project
      const projectStats = {};
      sessions.forEach(session => {
        if (!projectStats[session.projectId]) {
          projectStats[session.projectId] = {
            projectId: session.projectId,
            totalDuration: 0,
            sessionCount: 0
          };
        }
        projectStats[session.projectId].totalDuration += session.duration || 0;
        projectStats[session.projectId].sessionCount += 1;
      });

      res.json({
        type: 'SUCCESS',
        message: 'Statistics retrieved successfully',
        stats: {
          period,
          totalDuration,
          totalSessions,
          totalScreenshots,
          averageSessionDuration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
          projectBreakdown: Object.values(projectStats)
        }
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        type: 'INTERNAL_ERROR',
        message: 'Failed to get statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new TimeTrackingController();
