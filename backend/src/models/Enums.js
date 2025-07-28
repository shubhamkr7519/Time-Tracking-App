// src/models/Enums.js
const GROUP_BY = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  EMPLOYEE: 'employee',
  TEAM: 'team',
  SHIFT: 'shift',
  TASK: 'task',
  PROJECT: 'project',
  WINDOW: 'window'
};

const SCREENSHOT_SORT = {
  PRODUCTIVITY: 'productivity',
  NAME: 'name',
  USER: 'user',
  APP: 'app',
  TITLE: 'title',
  URL: 'url',
  SHIFT_ID: 'shiftId',
  PROJECT_ID: 'projectId',
  TASK_ID: 'taskId',
  WINDOW_ID: 'WindowId',
  APP_ORG_ID: 'appOrgId',
  APP_TEAM_ID: 'appTeamId',
  EMPLOYEE_ID: 'employeeId',
  TEAM_ID: 'teamId'
};

const SETTINGS_TYPE = {
  PERSONAL: 'personal',
  OFFICE: 'office'
};

const TRACKING_TYPE = {
  UNLIMITED: 'unlimited',
  LIMITED: 'limited',
  NETWORK: 'network',
  PROJECT: 'project',
  MANUAL: 'manual'
};

const PRIVILEGE = {
  READ: 'read',
  WRITE: 'write'
};

const APPLICATION_TYPE = {
  APP: 'app',
  SITE: 'site'
};

module.exports = {
  GROUP_BY,
  GROUP_BY_VALUES: Object.values(GROUP_BY),
  SCREENSHOT_SORT,
  SCREENSHOT_SORT_VALUES: Object.values(SCREENSHOT_SORT),
  SETTINGS_TYPE,
  SETTINGS_TYPE_VALUES: Object.values(SETTINGS_TYPE),
  TRACKING_TYPE,
  TRACKING_TYPE_VALUES: Object.values(TRACKING_TYPE),
  PRIVILEGE,
  PRIVILEGE_VALUES: Object.values(PRIVILEGE),
  APPLICATION_TYPE,
  APPLICATION_TYPE_VALUES: Object.values(APPLICATION_TYPE)
};
