import express from 'express';
import { createProjectSite, getProjectSiteDetails, deleteProjectSite, getProjectSitesByClientId, getProjectSiteDetailsById } from '../controllers/projectSiteController.js';

const router = express.Router();

// Create a new project site
router.post('/', createProjectSite);

// Get project site details by site ID
router.get('/:id', getProjectSiteDetails);

// Delete a project site
router.delete('/:id', deleteProjectSite);

// Fetch all project sites for a given client ID
router.get('/client/:clientId', getProjectSitesByClientId);

// Fetch details of a specific project site by site ID
router.get('/details/:siteId', getProjectSiteDetailsById);

export default router;