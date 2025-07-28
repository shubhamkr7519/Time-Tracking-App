// src/controllers/projectController.js (Complete with all operations)
const projectService = require('../services/projectService');

class ProjectController {
  // Create new project
  async createProject(req, res, next) {
    try {
      const { name, teamId, description } = req.body;
      const { organizationId } = req.user;

      // Simple validation
      if (!name) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Project name is required'
        });
      }

      if (!teamId) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Team ID is required'
        });
      }

      const project = await projectService.createProject({
        name, 
        teamId,
        description
      }, organizationId);

      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  // Get project by ID
  async getProject(req, res, next) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  // Get all projects
  async getProjects(req, res, next) {
    try {
      const filters = {
        organizationId: req.user.organizationId,
        teamId: req.query.teamId,
        status: req.query.status
      };
      
      const projects = await projectService.getProjects(filters);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  // Update project
  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const project = await projectService.updateProject(id, updateData);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  // Delete project
  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const result = await projectService.deleteProject(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Assign employee to project
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

      const project = await projectService.assignEmployeeToProject(id, employeeId);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  // Remove employee from project
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

      const project = await projectService.removeEmployeeFromProject(id, employeeId);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  // Get projects for specific employee
  async getEmployeeProjects(req, res, next) {
    try {
      const { employeeId } = req.params;
      const { organizationId } = req.user;
      
      const projects = await projectService.getProjectsForEmployee(employeeId, organizationId);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
