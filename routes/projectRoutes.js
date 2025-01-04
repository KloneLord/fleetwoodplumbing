import express from 'express';
const router = express.Router();
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController.js';

// Create a new project
router.post('/projects', createProject);

// Get all projects
router.get('/projects', getAllProjects);

// Get a project by ID
router.get('/projects/:id', getProjectById);

// Update a project
router.put('/projects/:id', updateProject);

// Delete a project
router.delete('/projects/:id', deleteProject);

export default router;