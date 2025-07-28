// src/services/teamService.js (Updated)
const Team = require('../models/Team');
const crypto = require('crypto');

class TeamService {
  // Create a new team (only name is required)
  async createTeam(teamData, organizationId) { // organizationId now passed as an argument
    const { 
      name,
      description = '' // Optional, defaults to empty
    } = teamData;

    const currentTime = Date.now();
    
    const newTeam = {
      id: this.generateTeamId(),
      name,
      description,
      organizationId, // Use the ID from the authenticated user's context
      ignoreProductive: false,
      ignoreNeutral: false,
      ignoreUnproductive: false,
      ignoreUnreviewed: false,
      default: false,
      employees: [],
      projects: [],
      createdAt: currentTime
    };
    
    // Save to database
    const savedTeam = await Team.create(newTeam);
    return savedTeam.toObject();
  }

  // Get team by ID
  async getTeamById(teamId) {
    // Validate ID format (must be 15 characters as per API spec)
    if (!teamId || teamId.length !== 15) {
      const error = new Error('Parameters validation error!');
      error.type = 'VALIDATION_ERROR';
      error.status = 422;
      error.details = [{
        type: "stringLength",
        expected: 15,
        actual: teamId ? teamId.length : 0,
        field: "id",
        message: "The 'id' field length must be 15 characters long!"
      }];
      throw error;
    }

    const team = await Team.findOne({ id: teamId });
    if (!team) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    return team.toObject();
  }

  // Get all teams
  async getTeams(filters = {}) {
    let query = Team.find();
    
    // Apply filters
    if (filters.organizationId) {
      query = query.where('organizationId').equals(filters.organizationId);
    }
    
    const teams = await query.exec();
    return teams.map(team => team.toObject());
  }

  // Update team
  async updateTeam(teamId, updateData) {
    // Validate ID format first
    if (!teamId || teamId.length !== 15) {
      const error = new Error('Parameters validation error!');
      error.type = 'VALIDATION_ERROR';
      error.status = 422;
      error.details = [{
        type: "stringLength",
        expected: 15,
        actual: teamId ? teamId.length : 0,
        field: "id",
        message: "The 'id' field length must be 15 characters long!"
      }];
      throw error;
    }

    const team = await Team.findOne({ id: teamId });
    if (!team) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Validate update data types
    const validationErrors = [];

    if ('employees' in updateData && !Array.isArray(updateData.employees)) {
      validationErrors.push({
        type: "array",
        field: "employees",
        message: "The 'employees' field must be an array!"
      });
    }

    if ('projects' in updateData && !Array.isArray(updateData.projects)) {
      validationErrors.push({
        type: "array",
        field: "projects",
        message: "The 'projects' field must be an array!"
      });
    }

    const booleanFields = ['ignoreProductive', 'ignoreNeutral', 'ignoreUnproductive', 'ignoreUnreviewed'];
    booleanFields.forEach(field => {
      if (field in updateData && typeof updateData[field] !== 'boolean') {
        validationErrors.push({
          type: "boolean",
          field: field,
          message: `The '${field}' field must be a boolean!`
        });
      }
    });

    if (validationErrors.length > 0) {
      const error = new Error('Parameters validation error!');
      error.type = 'VALIDATION_ERROR';
      error.status = 422;
      error.details = validationErrors;
      throw error;
    }

    // Update allowed fields
    const allowedFields = [
      'employees', 'projects', 'description', 
      'ignoreProductive', 'ignoreNeutral', 
      'ignoreUnproductive', 'ignoreUnreviewed'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        team[field] = updateData[field];
      }
    });

    const savedTeam = await team.save();
    return savedTeam.toObject();
  }

  // Delete team
  async deleteTeam(teamId) {
    // Validate ID format first
    if (!teamId || teamId.length !== 15) {
      const error = new Error('Parameters validation error!');
      error.type = 'VALIDATION_ERROR';
      error.status = 422;
      error.details = [{
        type: "stringLength",
        expected: 15,
        actual: teamId ? teamId.length : 0,
        field: "id",
        message: "The 'id' field length must be 15 characters long!"
      }];
      throw error;
    }

    const team = await Team.findOne({ id: teamId });
    if (!team) {
      const error = new Error('Not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Check if it's a default team (cannot be deleted)
    if (team.default) {
      const error = new Error("Can't remove default team");
      error.status = 409;
      throw error;
    }

    await Team.deleteOne({ id: teamId });
    return team.toObject();
  }

  // Generate Insightful-style team ID (15 characters starting with 'w')
  generateTeamId() {
    return 'w' + crypto.randomBytes(7).toString('hex').substring(0, 14);
  }
}

module.exports = new TeamService();
