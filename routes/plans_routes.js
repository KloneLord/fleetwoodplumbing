import express from 'express';
import multer from 'multer';
import { uploadPlan, getPlans } from '../controllers/plans_controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadPlan);
router.get('/:projectID', getPlans);

export default router;