// project_materials_routes.js
import express from 'express';
import { bookOutMaterials, returnMaterials, getProjectMaterialsLog, getProjectMaterialsBooked } from '../controllers/project_materials_controller.js';

const router = express.Router();

// Project Materials Routes
router.post('/book-out', bookOutMaterials);
router.post('/return', returnMaterials);
router.get('/log/:projectID', getProjectMaterialsLog);
router.get('/booked/:projectID', getProjectMaterialsBooked);

export default router;