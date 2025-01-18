import express from 'express';
const router = express.Router();
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    archiveProject,
    getArchivedProjects,
    reinstateProject

} from '../controllers/project_controller.js';
// Route to fetch all projects
router.get('/', getAllProjects);

// Route to fetch a single project by ID
router.get('/:id', getProjectById);

// Route to update an existing project
router.put('/:id', updateProject);

// Create a new project
router.post('/projects', createProject);

// Get all projects
router.get('/projects/list', getAllProjects); // Use '/projects/list' to avoid conflict with '/projects/:id'

// Get a project by ID
router.get('/projects/:id', getProjectById);

// Update a project
router.put('/projects/:id', updateProject);

// Delete a project
router.delete('/projects/:id', deleteProject);

// Archive a project
router.put('/projects/archive/:id', archiveProject);

// Get archived projects
router.get('/projects/archived', getArchivedProjects);

// Reinstate an archived project
router.patch('/projects/reinstate/:id', reinstateProject);

export default router;









