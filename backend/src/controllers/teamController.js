// src/controllers/teamController.js (Updated validation)
const teamService = require('../services/teamService');

class TeamController {
  // Get team by ID
  async getTeam(req, res, next) {
    try {
      const { id } = req.params;
      const team = await teamService.getTeamById(id);
      res.json(team);
    } catch (error) {
      next(error);
    }
  }

  // Get all teams
  async getTeams(req, res, next) {
    try {
      const filters = {
        organizationId: req.query.organizationId
      };
      
      const teams = await teamService.getTeams(filters);
      res.json(teams);
    } catch (error) {
      next(error);
    }
  }

  // Update team
  async updateTeam(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const team = await teamService.updateTeam(id, updateData);
      res.json(team);
    } catch (error) {
      next(error);
    }
  }

  // Delete team
  async deleteTeam(req, res, next) {
    try {
      const { id } = req.params;
      const team = await teamService.deleteTeam(id);
      res.json(team);
    } catch (error) {
      next(error);
    }
  }

  // Create new team (only name is required)
  async createTeam(req, res, next) {
    try {
      const { name } = req.body;
      const { organizationId } = req.user; // Get orgId from mock auth middleware
      
      // Only validate required fields: name and organizationId
      if (!name) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Parameters validation error!'
        });
      }
      
      const team = await teamService.createTeam(req.body, organizationId);
      res.status(201).json(team);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();
