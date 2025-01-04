import ProjectSite from '../models/ProjectSite.js';
import SiteId from '../models/SiteId.js';

// Function to generate a unique siteId
export const generateSiteId = async (req, res) => {
    try {
        let unique = false;
        let siteId;

        while (!unique) {
            siteId = Math.random().toString(36).substr(2, 16);
            const existingId = await SiteId.findOne({ siteId });

            if (!existingId) {
                unique = true;
                const newSiteId = new SiteId({ siteId });
                await newSiteId.save();
            }
        }

        res.status(201).json({ siteId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new project site
export const createProjectSite = async (req, res) => {
    const { siteId, clientID, clientName, siteName, streetAddress, cityTown, postcode, state, country } = req.body;

    if (!siteId || !clientID || !clientName || !siteName || !streetAddress || !cityTown || !postcode || !state || !country) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const projectSite = new ProjectSite({
        siteId,
        clientID,
        clientName,
        siteName,
        streetAddress,
        cityTown,
        postcode,
        state,
        country
    });

    try {
        const savedProjectSite = await projectSite.save();
        res.status(201).json(savedProjectSite);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get project site details by site ID
export const getProjectSiteDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const projectSite = await ProjectSite.findById(id);
        if (!projectSite) {
            return res.status(404).json({ message: 'Project site not found' });
        }
        res.status(200).json(projectSite);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a project site
export const deleteProjectSite = async (req, res) => {
    const { id } = req.params;

    try {
        await ProjectSite.findByIdAndDelete(id);
        res.status(200).json({ message: 'Project site deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fetch all project sites for a given client ID
export const getProjectSitesByClientId = async (req, res) => {
    try {
        const projectSites = await ProjectSite.find({ clientID: req.params.clientId });
        res.json(projectSites);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch details of a specific project site by site ID
export const getProjectSiteDetailsById = async (req, res) => {
    try {
        const siteDetails = await ProjectSite.findById(req.params.siteId);
        if (!siteDetails) {
            return res.status(404).json({ message: 'Project site not found' });
        }
        res.json(siteDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};