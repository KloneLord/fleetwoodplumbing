import express from 'express';
import {
    addTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} from '../controllers/project_tasks_controller.js';

const router = express.Router();

router.post('/api/project_tasks', addTask);
router.get('/api/project_tasks', getAllTasks);
router.get('/api/project_tasks/:id', getTaskById);
router.put('/api/project_tasks/:id', updateTask);
router.delete('/api/project_tasks/:id', deleteTask);

export default router;