// controllers/projectSiteController.js
import asyncHandler from 'express-async-handler';
import ProjectSite from '../models/projectSite.js';

export const getProjectSitesByClientId = asyncHandler(async (req, res) => {
    const projectSites = await ProjectSite.find({ clientId: req.params.clientId });
    res.json(projectSites);
});

export const saveProjectSite = asyncHandler(async (req, res) => {
    const {
        projectSiteTitle,
        streetAddress,
        city,
        postcode,
        state,
        country,
        clientId,
        fullName
    } = req.body;

    const projectSite = new ProjectSite({
        project_site_address_name: projectSiteTitle,
        project_site_street: streetAddress,
        project_site_city: city,
        project_site_postcode: postcode,
        project_site_state: state,
        project_site_country: country,
        clientId,
        fullName
    });

    const createdProjectSite = await projectSite.save();
    res.status(201).json(createdProjectSite);
});

export const deleteProjectSite = asyncHandler(async (req, res) => {
    const projectSite = await ProjectSite.findById(req.params.id);

    if (projectSite) {
        await projectSite.remove();
        res.json({ message: 'Project site removed' });
    } else {
        res.status(404);
        throw new Error('Project site not found');
    }
});