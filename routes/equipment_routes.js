import express from 'express';
import { listEquipment, addNewEquipment, getNamesForDropdowns, scheduleService, logRepair } from '../controllers/equipment_controller.js';

const router = express.Router();

router.get('/list', listEquipment);
router.post('/add', addNewEquipment);
router.get('/names', getNamesForDropdowns);
router.post('/service', scheduleService);
router.post('/repair', logRepair);

export default router;