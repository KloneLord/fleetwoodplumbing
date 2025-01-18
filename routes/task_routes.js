import express from 'express';
import { createTask, getTasks } from '../controllers/task_controller.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);

export default router;