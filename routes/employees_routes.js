import express from 'express';
import { updateEmployeeColor } from '../controllers/employees_controller.js';

const router = express.Router();

router.put('/update-color', updateEmployeeColor);

export default router;
