import Project from '../models/Project.js';

// Create a new project
export const createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).send(project);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Get all projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).send(projects);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get a project by ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send({ error: 'Project not found' });
        }
        res.status(200).send(project);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update a project
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).send({ error: 'Project not found' });
        }
        res.send(project);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Delete a project
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).send({ error: 'Project not found' });
        }
        res.send({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};