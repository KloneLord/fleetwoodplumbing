// project_tasks_routes.js
import express from 'express';
import { addTask } from '../controllers/project_tasks_controller.js'; // Ensure the path and export name are correct

const router = express.Router();

router.post('/tasks', addTask);

export default router;