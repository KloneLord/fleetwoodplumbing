import express from 'express';
import { saveBusinessTimes, getBusinessTimes } from '../controllers/business_times_controller.js';

const router = express.Router();

router.post('/save', saveBusinessTimes);
router.get('/get', getBusinessTimes);

export default router;
