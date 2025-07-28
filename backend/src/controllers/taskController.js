// src/controllers/taskController.js (Complete with all operations)
const taskService = require('../services/taskService');

class TaskController {
  // Create new task
  async createTask(req, res, next) {
    try {
      const { name, projectId, description, priority } = req.body;
      const { organizationId } = req.user;

      // Simple validation
      if (!name) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Task name is required'
        });
      }

      if (!projectId) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Project ID is required'
        });
      }

      const task = await taskService.createTask({
        name, 
        projectId,
        description,
        priority
      }, organizationId);

      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  // Get task by ID
  async getTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  // Get all tasks
  async getTasks(req, res, next) {
    try {
      const filters = {
        organizationId: req.user.organizationId,
        projectId: req.query.projectId,
        status: req.query.status,
        priority: req.query.priority
      };
      
      const tasks = await taskService.getTasks(filters);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  // Update task
  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const task = await taskService.updateTask(id, updateData);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  // Delete task
  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const result = await taskService.deleteTask(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Assign employee to task
  async assignEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;

      if (!employeeId) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Employee ID is required'
        });
      }

      const task = await taskService.assignEmployeeToTask(id, employeeId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  // Remove employee from task
  async removeEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;

      if (!employeeId) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Employee ID is required'
        });
      }

      const task = await taskService.removeEmployeeFromTask(id, employeeId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  // Get tasks for specific employee
  async getEmployeeTasks(req, res, next) {
    try {
      const { employeeId } = req.params;
      const { organizationId } = req.user;
      
      const tasks = await taskService.getTasksForEmployee(employeeId, organizationId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
