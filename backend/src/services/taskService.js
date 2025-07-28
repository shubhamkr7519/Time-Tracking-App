// src/services/taskService.js (Complete with all operations)
const Task = require('../models/Task');
const Project = require('../models/Project');
const crypto = require('crypto');

class TaskService {
  // Create a new task
  async createTask(taskData, organizationId) {
    const { name, projectId, description, priority } = taskData;
    
    // Verify project exists
    const project = await Project.findOne({ id: projectId });
    if (!project) {
      const error = new Error('Project not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }
    
    const currentTime = Date.now();
    
    const newTask = {
      id: this.generateTaskId(),
      name,
      projectId,
      organizationId,
      employees: [],
      description: description || '',
      status: 'active',
      priority: priority || 'medium',
      createdAt: currentTime
    };
    
    // Save to database
    const savedTask = await Task.create(newTask);
    
    // Transform for API response
    const taskObj = savedTask.toObject();
    return {
      id: taskObj.id,
      name: taskObj.name,
      projectId: taskObj.projectId,
      organizationId: taskObj.organizationId,
      employees: taskObj.employees,
      description: taskObj.description,
      status: taskObj.status,
      priority: taskObj.priority,
      createdAt: taskObj.createdAt,
      modelName: "Task"
    };
  }

  // Get task by ID
  async getTaskById(taskId) {
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      const error = new Error('Task not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    return task.toObject();
  }

  // Get all tasks with optional filters
  async getTasks(filters = {}) {
    let query = Task.find();
    
    // Apply filters
    if (filters.organizationId) {
      query = query.where('organizationId').equals(filters.organizationId);
    }
    if (filters.projectId) {
      query = query.where('projectId').equals(filters.projectId);
    }
    if (filters.status) {
      query = query.where('status').equals(filters.status);
    }
    if (filters.priority) {
      query = query.where('priority').equals(filters.priority);
    }
    
    const tasks = await query.exec();
    
    return tasks.map(task => task.toObject());
  }

  // Update task
  async updateTask(taskId, updateData) {
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      const error = new Error('Task not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Update allowed fields
    const allowedFields = ['name', 'description', 'status', 'priority'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        task[field] = updateData[field];
      }
    });

    const savedTask = await task.save();
    return savedTask.toObject();
  }

  // Delete task
  async deleteTask(taskId) {
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      const error = new Error('Task not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    await Task.deleteOne({ id: taskId });
    
    return { message: 'Task deleted successfully' };
  }

  // Assign employee to task
  async assignEmployeeToTask(taskId, employeeId) {
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      const error = new Error('Task not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Check if employee is already assigned
    if (!task.employees.includes(employeeId)) {
      task.employees.push(employeeId);
      await task.save();
    }

    return task.toObject();
  }

  // Remove employee from task
  async removeEmployeeFromTask(taskId, employeeId) {
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      const error = new Error('Task not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    task.employees = task.employees.filter(emp => emp !== employeeId);
    await task.save();

    return task.toObject();
  }

  // Get tasks assigned to specific employee
  async getTasksForEmployee(employeeId, organizationId) {
    const tasks = await Task.find({
      organizationId: organizationId,
      employees: employeeId,
      status: 'active'
    });

    return tasks.map(task => task.toObject());
  }

  // Generate task ID
  generateTaskId() {
    return 't' + crypto.randomBytes(7).toString('hex').substring(0, 14);
  }
}

module.exports = new TaskService();
