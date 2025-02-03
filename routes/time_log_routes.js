// File: routes/time_log_routes.js

import express from 'express';
import { createTimeLog, updateTimeLog, getActiveTimeLog } from '../controllers/time_log_controller.js';

const router = express.Router();

router.post('/', createTimeLog); // POST /api/timelogs
router.put('/', updateTimeLog); // PUT /api/timelogs
router.get('/active', getActiveTimeLog); // GET /api/timelogs/active

export default router;