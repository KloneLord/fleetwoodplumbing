import express from 'express';
import { createMaterial, getMaterials } from '../controllers/material_controller.js';

const router = express.Router();

router.post('/', createMaterial);
router.get('/', getMaterials);

export default router;