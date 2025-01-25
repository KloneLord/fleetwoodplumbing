import express from 'express';
import { listRepairs, addNewRepair, updateRepair, deleteRepair } from '../controllers/repair_controller.js';

const router = express.Router();

router.get('/repairs', listRepairs);
router.post('/repair', addNewRepair);
router.put('/repair/:id', updateRepair);
router.delete('/repair/:id', deleteRepair);

export default router;