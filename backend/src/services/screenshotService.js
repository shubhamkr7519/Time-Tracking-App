// src/services/screenshotService.js
const ScreenshotResponse = require('../models/ScreenshotResponse');
const crypto = require('crypto');

class ScreenshotService {
  // Get paginated screenshots with analytics
  async getScreenshotsPaginated(filters) {
    const { 
      start, 
      end, 
      timezone,
      taskId, 
      shiftId, 
      projectId,
      sortBy = 'timestampTranslated',
      limit = 10000,
      next
    } = filters;

    // Build query conditions
    let query = ScreenshotResponse.find({
      timestampTranslated: { 
        $gte: start.toString(), 
        $lte: end.toString() 
      }
    });

    // Apply filters if provided
    if (taskId) {
      const taskIds = taskId.split(',');
      query = query.where('taskId').in(taskIds);
    }

    if (shiftId) {
      const shiftIds = shiftId.split(',');
      query = query.where('shiftId').in(shiftIds);
    }

    if (projectId) {
      const projectIds = projectId.split(',');
      query = query.where('projectId').in(projectIds);
    }

    // Handle pagination with 'next' parameter
    if (next) {
      // Decode the next token to get the last document's sort value
      const decodedNext = this.decodeNextToken(next);
      if (decodedNext) {
        query = query.where(sortBy).gt(decodedNext.lastValue);
      }
    }

    // Apply sorting
    const sortOptions = this.buildSortOptions(sortBy);
    query = query.sort(sortOptions);

    // Apply limit
    query = query.limit(parseInt(limit));

    // Populate related fields if needed
    query = query.populate('systemPermissions');

    const screenshots = await query.exec();

    // Transform screenshots for response with timezone adjustment
    const transformedScreenshots = screenshots.map(screenshot => {
      const screenshotObj = screenshot.toObject();
      
      // Apply timezone offset if provided
      if (timezone) {
        const timezoneOffset = this.parseTimezoneOffset(timezone);
        const timestamp = parseInt(screenshotObj.timestampTranslated);
        screenshotObj.timestampTranslated = (timestamp - timezoneOffset).toString();
      }

      return screenshotObj;
    });

    // Generate next token for pagination
    let nextToken = null;
    if (transformedScreenshots.length === parseInt(limit)) {
      const lastScreenshot = transformedScreenshots[transformedScreenshots.length - 1];
      nextToken = this.generateNextToken(lastScreenshot, sortBy);
    }

    return {
      screenshots: transformedScreenshots,
      next: nextToken,
      hasMore: transformedScreenshots.length === parseInt(limit)
    };
  }

  // Build sort options based on sortBy parameter
  buildSortOptions(sortBy) {
    const validSortFields = [
      'productivity', 'name', 'user', 'app', 'title', 'url', 
      'shiftId', 'projectId', 'taskId', 'WindowId', 'appOrgId', 
      'appTeamId', 'employeeId', 'teamId'
    ];

    if (!validSortFields.includes(sortBy)) {
      return { timestampTranslated: 1 }; // Default sort
    }

    // Map API sort fields to model fields
    const sortFieldMap = {
      'productivity': 'productivity',
      'name': 'name',
      'user': 'employeeId',
      'app': 'appId',
      'title': 'title',
      'url': 'site',
      'shiftId': 'shiftId',
      'projectId': 'projectId',
      'taskId': 'taskId',
      'WindowId': 'windowId',
      'appOrgId': 'appOrgId',
      'appTeamId': 'appTeamId',
      'employeeId': 'employeeId',
      'teamId': 'teamId'
    };

    const modelField = sortFieldMap[sortBy] || 'timestampTranslated';
    return { [modelField]: 1 };
  }

  // Generate next token for pagination
  generateNextToken(lastItem, sortBy) {
    const sortFieldMap = {
      'productivity': 'productivity',
      'name': 'name',
      'user': 'employeeId',
      'app': 'appId',
      'title': 'title',
      'url': 'site',
      'shiftId': 'shiftId',
      'projectId': 'projectId',
      'taskId': 'taskId',
      'WindowId': 'windowId',
      'appOrgId': 'appOrgId',
      'appTeamId': 'appTeamId',
      'employeeId': 'employeeId',
      'teamId': 'teamId'
    };

    const modelField = sortFieldMap[sortBy] || 'timestampTranslated';
    const lastValue = lastItem[modelField];

    // Create a hash-based token
    const tokenData = {
      sortBy,
      lastValue,
      timestamp: Date.now()
    };

    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
  }

  // Decode next token for pagination
  decodeNextToken(nextToken) {
    try {
      const decodedData = JSON.parse(Buffer.from(nextToken, 'base64').toString());
      return decodedData;
    } catch (error) {
      console.warn('Invalid next token:', error.message);
      return null;
    }
  }

  // Parse timezone offset from string format
  parseTimezoneOffset(timezone) {
    // Handle formats like "+05:30", "-08:00", "UTC+5", etc.
    const match = timezone.match(/([+-])(\d{1,2}):?(\d{2})?/);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      const hours = parseInt(match[2]);
      const minutes = parseInt(match[3] || '0');
      return sign * (hours * 60 + minutes) * 60 * 1000; // Convert to milliseconds
    }
    return 0; // Default to UTC if parsing fails
  }

  // Generate screenshot ID
  generateScreenshotId() {
    return 'w' + crypto.randomBytes(7).toString('hex').substring(0, 14);
  }
}

module.exports = new ScreenshotService();
