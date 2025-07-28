// src/routes/teamRoutes.js
const router = require('express').Router();
const teamController = require('../controllers/teamController');

// GET /api/v1/team/:id - Get team by ID
router.get('/:id', teamController.getTeam);

// GET /api/v1/team - Get all teams
router.get('/', teamController.getTeams);

// PUT /api/v1/team/:id - Update team
router.put('/:id', teamController.updateTeam);

// DELETE /api/v1/team/:id - Delete team
router.delete('/:id', teamController.deleteTeam);

// POST /api/v1/team - Create team (for MVP)
router.post('/', teamController.createTeam);

module.exports = router;
