// routes/projectSiteRoutes.js
import express from 'express';
import {
    getAllProjectSites,
    getProjectSitesByClientId,
    createProjectSite,
    deleteProjectSite,
    updateProjectSite
} from '../controllers/projectSiteController.js';

const router = express.Router();

// Define routes
router.get('/', getAllProjectSites); // Get all project sites
router.get('/:clientId', getProjectSitesByClientId); // Get project sites by client ID
router.post('/', createProjectSite); // Create a new project site
router.delete('/:id', deleteProjectSite); // Delete a project site by ID
router.put('/:id', updateProjectSite); // Update a project site by ID

export default router;