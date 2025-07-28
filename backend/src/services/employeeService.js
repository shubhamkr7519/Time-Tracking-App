// src/services/employeeService.js (Updated with proper validation)
const Employee = require('../models/Employee');
const Team = require('../models/Team');
const SharedSettings = require('../models/SharedSettings');
const crypto = require('crypto');

class EmployeeService {
  // Create (invite) a new employee
  async createEmployee(employeeData, organizationId) {
    const { name, email, teamId, sharedSettingsId } = employeeData;
    
    // 1. Validate that teamId exists in database
    const teamExists = await Team.findOne({ id: teamId });
    if (!teamExists) {
      const error = new Error('Parameters validation error!');
      error.type = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    // 2. Validate that sharedSettingsId exists in database
    const settingsExists = await SharedSettings.findOne({ id: sharedSettingsId });
    if (!settingsExists) {
      const error = new Error('Parameters validation error!');
      error.type = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    // 3. Check if employee with this email already exists
    const existingEmployee = await Employee.findOne({ identifier: email });
    if (existingEmployee) {
      const error = new Error('Duplicated employee.');
      error.type = 'EntityConflict';
      error.status = 409;
      throw error;
    }

    const currentTime = Date.now();
    
    const newEmployee = {
      id: this.generateEmployeeId(),
      name,
      teamsId: teamId, // Store as teamsId in database
      sharedSettingsId,
      accountId: this.generateEmployeeId(),
      identifier: email, // email stored in identifier field
      type: 'personal', // Default type
      organizationId,
      projects: [],
      deactivated: 0,
      invited: currentTime,
      systemPermissions: [],
      createdAt: currentTime
    };
    
    // Save to database
    const savedEmployee = await Employee.create(newEmployee);
    
    // Transform for API response to match expected format
    const employeeObj = savedEmployee.toObject();
    return {
      id: employeeObj.id,
      name: employeeObj.name,
      type: employeeObj.type,
      identifier: employeeObj.identifier,
      deactivated: employeeObj.deactivated,
      invited: employeeObj.invited,
      teamId: employeeObj.teamsId, // Transform teamsId back to teamId for response
      sharedSettingsId: employeeObj.sharedSettingsId,
      accountId: employeeObj.accountId,
      organizationId: employeeObj.organizationId,
      projects: employeeObj.projects,
      email: employeeObj.identifier, // Add email field for response
      logLevel: "http",
      localDataRetention: 259200000,
      systemPermissions: employeeObj.systemPermissions,
      createdAt: employeeObj.createdAt,
      updatedAt: employeeObj.createdAt,
      modelName: "Employee"
    };
  }

  // Get employee by ID
  async getEmployeeById(employeeId, selectFields = null) {
    let query = Employee.findOne({ id: employeeId });
    
    if (selectFields) {
      const fields = selectFields.split(',').join(' ');
      query = query.select(fields);
    }
    
    const employee = await query;
    if (!employee) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Transform teamsId to teamId for API response
    const employeeObj = employee.toObject();
    employeeObj.teamId = employeeObj.teamsId;
    employeeObj.email = employeeObj.identifier;
    delete employeeObj.teamsId;
    
    return employeeObj;
  }

  // Get all employees with optional filters and select
  async getEmployees(filters = {}) {
    let query = Employee.find();
    
    // Apply filters
    if (filters.organizationId) {
      query = query.where('organizationId').equals(filters.organizationId);
    }
    if (filters.teamId) {
      query = query.where('teamsId').equals(filters.teamId);
    }
    
    // Handle select parameter
    if (filters.select) {
      const fields = filters.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    const employees = await query.exec();
    
    // Transform each employee for API response
    return employees.map(employee => {
      const employeeObj = employee.toObject();
      employeeObj.teamId = employeeObj.teamsId;
      employeeObj.email = employeeObj.identifier;
      delete employeeObj.teamsId;
      return employeeObj;
    });
  }

  // Update employee with validation
  async updateEmployee(employeeId, updateData) {
    const employee = await Employee.findOne({ id: employeeId });
    if (!employee) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Validate teamId if provided
    if (updateData.teamId) {
      const teamExists = await Team.findOne({ id: updateData.teamId });
      if (!teamExists) {
        const error = new Error('Parameters validation error!');
        error.type = 'VALIDATION_ERROR';
        error.status = 400;
        throw error;
      }
    }

    // Validate sharedSettingsId if provided
    if (updateData.sharedSettingsId) {
      const settingsExists = await SharedSettings.findOne({ id: updateData.sharedSettingsId });
      if (!settingsExists) {
        const error = new Error('Parameters validation error!');
        error.type = 'VALIDATION_ERROR';
        error.status = 400;
        throw error;
      }
    }

    // Check for duplicate email if email is being updated
    if (updateData.email && updateData.email !== employee.identifier) {
      const existingEmployee = await Employee.findOne({ 
        identifier: updateData.email,
        id: { $ne: employeeId } // Exclude current employee
      });
      if (existingEmployee) {
        const error = new Error('Duplicated employee.');
        error.type = 'EntityConflict';
        error.status = 409;
        throw error;
      }
    }

    // Map API fields to model fields
    const updateMap = {
      name: 'name',
      email: 'identifier', // email maps to identifier
      title: 'title', // Add title field to model if needed
      teamId: 'teamsId', // teamId maps to teamsId
      sharedSettingsId: 'sharedSettingsId',
      projects: 'projects'
    };

    Object.keys(updateData).forEach(apiField => {
      const modelField = updateMap[apiField];
      if (modelField && updateData[apiField] !== undefined) {
        employee[modelField] = updateData[apiField];
      }
    });

    const savedEmployee = await employee.save();
    
    // Transform for API response
    const employeeObj = savedEmployee.toObject();
    employeeObj.teamId = employeeObj.teamsId;
    employeeObj.email = employeeObj.identifier;
    delete employeeObj.teamsId;
    
    return employeeObj;
  }

  // Deactivate employee
  async deactivateEmployee(employeeId) {
    const employee = await Employee.findOne({ id: employeeId });
    if (!employee) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Check if already deactivated (non-zero value means deactivated)
    if (employee.deactivated !== 0) {
      const error = new Error('Employee is already deactivated');
      error.status = 409;
      throw error;
    }

    employee.deactivated = Date.now();
    const savedEmployee = await employee.save();
    
    // Transform for API response
    const employeeObj = savedEmployee.toObject();
    employeeObj.teamId = employeeObj.teamsId;
    employeeObj.email = employeeObj.identifier;
    delete employeeObj.teamsId;
    
    return employeeObj;
  }

  // Generate Insightful-style employee ID
  generateEmployeeId() {
    return 'w' + crypto.randomBytes(7).toString('hex').substring(0, 14);
  }
}

module.exports = new EmployeeService();