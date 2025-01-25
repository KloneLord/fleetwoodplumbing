import express from 'express';
import { createProjectSite, getProjectSiteDetails, deleteProjectSite, getProjectSitesByClientId, getProjectSiteDetailsById, generateSiteId, getProjectSiteDetailsByClientAndSite } from '../controllers/project_site_controller.js';

const router = express.Router();

router.post('/', createProjectSite);
router.get('/:id', getProjectSiteDetails);
router.delete('/:id', deleteProjectSite);
router.get('/client/:clientId', getProjectSitesByClientId);
router.get('/details/:siteId', getProjectSiteDetailsById);
router.post('/site-id/generate', generateSiteId);
router.get('/details', getProjectSiteDetailsByClientAndSite); // New route for fetching details by clientId and siteName

export default router;