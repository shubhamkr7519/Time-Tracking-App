// src/services/analyticsService.js
const Window = require('../models/Window');
const ProjectTime = require('../models/ProjectTime');

class AnalyticsService {
  // Get window analytics
  async getWindowAnalytics(filters) {
    const { 
      start, 
      end, 
      timezone,
      employeeId, 
      teamId, 
      projectId, 
      taskId, 
      shiftId 
    } = filters;

    let query = Window.find({
      start: { $gte: start, $lte: end }
    });

    // Apply filters if provided
    if (employeeId) {
      const employeeIds = employeeId.split(',');
      query = query.where('employeeId').in(employeeIds);
    }

    if (teamId) {
      const teamIds = teamId.split(',');
      query = query.where('teamId').in(teamIds);
    }

    if (projectId) {
      const projectIds = projectId.split(',');
      query = query.where('projectId').in(projectIds);
    }

    if (taskId) {
      const taskIds = taskId.split(',');
      query = query.where('taskId').in(taskIds);
    }

    if (shiftId) {
      const shiftIds = shiftId.split(',');
      query = query.where('shiftId').in(shiftIds);
    }

    const windows = await query.exec();

    // Transform windows for response with timezone adjustment
    return windows.map(window => {
      const windowObj = window.toObject();
      
      // Apply timezone offset if provided
      if (timezone) {
        const timezoneOffset = this.parseTimezoneOffset(timezone);
        windowObj.startTranslated = windowObj.start - timezoneOffset;
        windowObj.endTranslated = windowObj.end - timezoneOffset;
      }

      return windowObj;
    });
  }

  // Get project time analytics
  async getProjectTimeAnalytics(filters) {
    const { 
      start, 
      end, 
      timezone,
      employeeId, 
      teamId, 
      projectId, 
      taskId, 
      shiftId 
    } = filters;

    // Build aggregation pipeline based on Window data
    let matchConditions = {
      start: { $gte: start, $lte: end }
    };

    // Apply filters if provided
    if (employeeId) {
      const employeeIds = employeeId.split(',');
      matchConditions.employeeId = { $in: employeeIds };
    }

    if (teamId) {
      const teamIds = teamId.split(',');
      matchConditions.teamId = { $in: teamIds };
    }

    if (projectId) {
      const projectIds = projectId.split(',');
      matchConditions.projectId = { $in: projectIds };
    }

    if (taskId) {
      const taskIds = taskId.split(',');
      matchConditions.taskId = { $in: taskIds };
    }

    if (shiftId) {
      const shiftIds = shiftId.split(',');
      matchConditions.shiftId = { $in: shiftIds };
    }

    // Aggregate windows to calculate project time
    const projectTimeData = await Window.aggregate([
      {
        $match: matchConditions
      },
      {
        $group: {
          _id: '$projectId',
          totalTime: { 
            $sum: { $subtract: ['$end', '$start'] } 
          },
          totalCosts: { 
            $sum: { 
              $multiply: [
                { $divide: [{ $subtract: ['$end', '$start'] }, 3600000] }, // Convert to hours
                '$payRate'
              ]
            }
          },
          totalIncome: { 
            $sum: { 
              $multiply: [
                { $divide: [{ $subtract: ['$end', '$start'] }, 3600000] }, // Convert to hours
                '$billRate'
              ]
            }
          }
        }
      },
      {
        $project: {
          id: '$_id',
          time: '$totalTime',
          costs: '$totalCosts',
          income: '$totalIncome',
          _id: 0
        }
      }
    ]);

    return projectTimeData;
  }

  // Parse timezone offset from string format
  parseTimezoneOffset(timezone) {
    // Handle formats like "+05:30", "-08:00", etc.
    const match = timezone.match(/([+-])(\d{1,2}):?(\d{2})?/);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      const hours = parseInt(match[2]);
      const minutes = parseInt(match[3] || '0');
      return sign * (hours * 60 + minutes) * 60 * 1000; // Convert to milliseconds
    }
    return 0; // Default to UTC if parsing fails
  }
}

module.exports = new AnalyticsService();
