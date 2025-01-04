import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    projectID: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    projectSite: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Lodged', 'Scheduled', 'In Progress', 'Works Complete', 'Invoiced', 'Paid', 'Complete'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;