import express from 'express';
import { createPlantEquipment, getPlantEquipment } from '../controllers/plant_equipment_controller.js';

const router = express.Router();

router.post('/', createPlantEquipment);
router.get('/', getPlantEquipment);

export default router;