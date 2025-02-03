import express from 'express';
import {
    addScheduleLog,
    listScheduleLogs,
    getScheduleLogById,
    updateScheduleLog,
    deleteScheduleLog
} from '../controllers/schedule_controller.js';

const router = express.Router();

// Schedule Routes
router.post('/add', addScheduleLog);
router.get('/list', listScheduleLogs);
router.get('/:id', getScheduleLogById);
router.put('/update/:id', updateScheduleLog);
router.delete('/delete/:id', deleteScheduleLog);

export default router;