// src/routes/employeeRoutes.js (Updated to match Insightful API)
const router = require('express').Router();
const employeeController = require('../controllers/employeeController');

// POST /api/v1/employee - Create (invite) employee
router.post('/', employeeController.createEmployee);

// GET /api/v1/employee/:id - Get employee by ID
router.get('/:id', employeeController.getEmployee);

// GET /api/v1/employee - Get all employees
router.get('/', employeeController.getEmployees);

// PUT /api/v1/employee/:id - Update employee
router.put('/:id', employeeController.updateEmployee);

// GET /api/v1/employee/deactivate/:id - Deactivate employee
router.get('/deactivate/:id', employeeController.deactivateEmployee);

module.exports = router;
