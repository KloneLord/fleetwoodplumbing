import Project from '../models/project_model.js';
import TimeLog from '../models/timelog_model.js'; // Import the TimeLog model

// Other existing functions...

// Log time function
export const logTime = async (req, res) => {
    const { projectId, action, username, timestamp } = req.body;

    try {
        const project = await Project.findOne({ projectID: projectId });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const timeLog = new TimeLog({
            projectId,
            projectTitle: project.title,
            customer: project.customer,
            clientId: project.clientId,
            projectSite: project.projectSite,
            username,
            action,
            timestamp
        });

        await timeLog.save();
        res.status(201).json(timeLog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};