import express from 'express';
import { setupBusiness, createAdminUser, getBusinessDetails, updateBusinessDetails } from '../controllers/business_controller.js';

const router = express.Router();

// Business setup route
router.post('/setup', setupBusiness);

// Admin user creation route
router.post('/create-admin', createAdminUser);

// Route to get business details
router.get('/details', getBusinessDetails);

// Route to update business details
router.put('/update', updateBusinessDetails);

export default router;