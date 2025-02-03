// File: project_routes.js

import express from 'express';
const router = express.Router();
import {
    getAllProjects,
    // Other imports
} from '../controllers/project_controller.js';

// Route to fetch all projects
router.get('/projects/list', getAllProjects);

// Other routes

export default router;