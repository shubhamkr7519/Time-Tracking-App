// src/routes/taskRoutes.js (Complete routes)
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Task CRUD operations
router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Employee assignment operations
router.put('/assign-employee/:id', taskController.assignEmployee);
router.put('/remove-employee/:id', taskController.removeEmployee);

// Get tasks for specific employee
router.get('/employee/:employeeId', taskController.getEmployeeTasks);

module.exports = router;
