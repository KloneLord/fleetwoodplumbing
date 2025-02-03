import express from 'express';
import { updateEmployeeColor, getAllEmployeesWithColors } from '../controllers/employee_color_controller.js';

const router = express.Router();

// Get all employees with their colors
router.get('/all', getAllEmployeesWithColors);

// Update an employee's color
router.put('/update-color/:user_id', updateEmployeeColor);

export default router;
