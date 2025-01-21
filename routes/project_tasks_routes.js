import express from 'express';
import { createTask, getTasks } from '../controllers/project_tasks_controller.js';

const router = express.Router();

router.post('/tasks', createTask); // Ensure this path matches the frontend
router.get('/tasks', getTasks); // Add a GET route to fetch tasks

export default router;