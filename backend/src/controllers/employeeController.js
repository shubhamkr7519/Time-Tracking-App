// src/controllers/employeeController.js (Updated with proper validation)
const employeeService = require('../services/employeeService');

class EmployeeController {
  // Create (invite) new employee
  async createEmployee(req, res, next) {
    try {
      const { name, email, teamId, sharedSettingsId } = req.body;
      const { organizationId } = req.user; // Get from auth middleware

      // Validate required fields
      if (!name || !email || !teamId || !sharedSettingsId) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Parameters validation error!'
        });
      }

      const employee = await employeeService.createEmployee({
        name, 
        email,
        teamId,
        sharedSettingsId
      }, organizationId);

      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }

  // Get employee by ID
  async getEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const { select } = req.query;
      
      const employee = await employeeService.getEmployeeById(id, select);
      
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  // Get all employees
  async getEmployees(req, res, next) {
    try {
      const filters = {
        select: req.query.select,
        organizationId: req.user.organizationId,
        teamId: req.query.teamId
      };
      
      const employees = await employeeService.getEmployees(filters);
      
      res.json(employees);
    } catch (error) {
      next(error);
    }
  }

  // Update employee
  async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate that at least one field is provided for update
      const allowedFields = ['name', 'email', 'title', 'teamId', 'sharedSettingsId', 'projects'];
      const hasValidField = allowedFields.some(field => updateData[field] !== undefined);
      
      if (!hasValidField) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'At least one field must be provided for update'
        });
      }
      
      const employee = await employeeService.updateEmployee(id, updateData);
      
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  // Deactivate employee
  async deactivateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await employeeService.deactivateEmployee(id);
      
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
