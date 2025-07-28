// src/routes/projectRoutes.js (Complete routes)
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Project CRUD operations
router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Employee assignment operations
router.put('/assign-employee/:id', projectController.assignEmployee);
router.put('/remove-employee/:id', projectController.removeEmployee);

// Get projects for specific employee
router.get('/employee/:employeeId', projectController.getEmployeeProjects);

module.exports = router;
