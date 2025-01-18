import Project from '../models/project_model.js';

// Create a new project
export const createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a project by ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ projectID: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a project
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate({ projectID: req.params.id }, req.body, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a project
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ projectID: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Archive a project
export const archiveProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate({ projectID: req.params.id }, { status: 'Archived' }, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get archived projects
export const getArchivedProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'Archived' });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reinstate an archived project
export const reinstateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate({ projectID: req.params.id }, { status: 'Active' }, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};