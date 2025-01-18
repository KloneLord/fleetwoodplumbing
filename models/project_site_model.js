import mongoose from 'mongoose';

const ProjectSiteSchema = new mongoose.Schema({
    siteId: { type: String, required: true, unique: true },
    clientID: { type: String, required: true },
    clientName: { type: String, required: true },
    siteName: { type: String, required: true },
    streetAddress: { type: String, required: true },
    cityTown: { type: String, required: true },
    postcode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Project_site_model = mongoose.model('ProjectSite', ProjectSiteSchema);
export default Project_site_model;