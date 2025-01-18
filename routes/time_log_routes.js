import express from 'express';
import { createTimeLog, getTimeLogs } from '../controllers/time_log_controller.js';

const router = express.Router();

router.post('/', createTimeLog);
router.get('/', getTimeLogs);

export default router;