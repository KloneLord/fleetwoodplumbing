// models/ProjectSite.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for ProjectSite
const projectSiteSchema = new Schema({
    project_site_address_name: { type: String, required: true },
    project_site_street: { type: String, required: true },
    project_site_city: { type: String, required: true },
    project_site_postcode: { type: String, required: true },
    project_site_state: { type: String, required: true },
    project_site_country: { type: String, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
}, { timestamps: true });

// Export the ProjectSite model
const ProjectSite = mongoose.model('ProjectSite', projectSiteSchema);
export default ProjectSite;