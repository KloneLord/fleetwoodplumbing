import express from 'express';
import { createPlan, getPlans } from '../controllers/plan_controller.js';

const router = express.Router();

router.post('/', createPlan);
router.get('/', getPlans);

export default router;