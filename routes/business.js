import express from 'express';
import { setupBusiness, createAdminUser } from '../controllers/business_controller.js';

const router = express.Router();

// Business setup route
router.post('/setup', setupBusiness);

// Admin user creation route
router.post('/create-admin', createAdminUser);

export default router;