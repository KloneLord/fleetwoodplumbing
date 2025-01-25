import express from 'express';
import { listServices, addNewService, updateService, deleteService } from '../controllers/service_controller.js';

const router = express.Router();

router.get('/services', listServices);
router.post('/service', addNewService);
router.put('/service/:id', updateService);
router.delete('/service/:id', deleteService);

export default router;