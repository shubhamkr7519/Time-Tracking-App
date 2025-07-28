// src/services/projectService.js (Complete with all operations)
const Project = require('../models/Project');
const Task = require('../models/Task');
const crypto = require('crypto');

class ProjectService {
  // Create a new project
  async createProject(projectData, organizationId) {
    const { name, teamId, description } = projectData;
    
    const currentTime = Date.now();
    
    const newProject = {
      id: this.generateProjectId(),
      name,
      teamId,
      organizationId,
      employees: [],
      description: description || '',
      status: 'active',
      createdAt: currentTime
    };
    
    // Save to database
    const savedProject = await Project.create(newProject);
    
    // Transform for API response
    const projectObj = savedProject.toObject();
    return {
      id: projectObj.id,
      name: projectObj.name,
      teamId: projectObj.teamId,
      organizationId: projectObj.organizationId,
      employees: projectObj.employees,
      description: projectObj.description,
      status: projectObj.status,
      createdAt: projectObj.createdAt,
      modelName: "Project"
    };
  }

  // Get project by ID
  async getProjectById(projectId) {
    const project = await Project.findOne({ id: projectId });
    if (!project) {
      const error = new Error('Project not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    return project.toObject();
  }

  // Get all projects with optional filters
  async getProjects(filters = {}) {
    let query = Project.find();
    
    // Apply filters
    if (filters.organizationId) {
      query = query.where('organizationId').equals(filters.organizationId);
    }
    if (filters.teamId) {
      query = query.where('teamId').equals(filters.teamId);
    }
    if (filters.status) {
      query = query.where('status').equals(filters.status);
    }
    
    const projects = await query.exec();
    
    return projects.map(project => project.toObject());
  }

  // Update project
  async updateProject(projectId, updateData) {
    const project = await Project.findOne({ id: projectId });
    if (!project) {
      const error = new Error('Project not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Update allowed fields
    const allowedFields = ['name', 'description', 'status', 'teamId'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        project[field] = updateData[field];
      }
    });

    const savedProject = await project.save();
    return savedProject.toObject();
  }

  // Delete project
  async deleteProject(projectId) {
    const project = await Project.findOne({ id: projectId });
    if (!project) {
      const error = new Error('Project not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Also delete all tasks under this project
    await Task.deleteMany({ projectId: projectId });

    await Project.deleteOne({ id: projectId });
    
    return { message: 'Project and associated tasks deleted successfully' };
  }

  // Assign employee to project
  async assignEmployeeToProject(projectId, employeeId) {
    const project = await Project.findOne({ id: projectId });
    if (!project) {
      const error = new Error('Project not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Check if employee is already assigned
    if (!project.employees.includes(employeeId)) {
      project.employees.push(employeeId);
      await project.save();
    }

    return project.toObject();
  }

  // Remove employee from project
  async removeEmployeeFromProject(projectId, employeeId) {
    const project = await Project.findOne({ id: projectId });
    if (!project) {
      const error = new Error('Project not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    project.employees = project.employees.filter(emp => emp !== employeeId);
    await project.save();

    return project.toObject();
  }

  // Get projects assigned to specific employee
  async getProjectsForEmployee(employeeId, organizationId) {
    const projects = await Project.find({
      organizationId: organizationId,
      employees: employeeId,
      status: 'active'
    });

    return projects.map(project => project.toObject());
  }

  // Generate project ID
  generateProjectId() {
    return 'p' + crypto.randomBytes(7).toString('hex').substring(0, 14);
  }
}

module.exports = new ProjectService();
