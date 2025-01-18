import mongoose from 'mongoose';

const projectTaskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    details: { type: String, required: true },
    assigned: { type: String, required: true },
    hours: { type: Number, required: true },
    status: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
}, { timestamps: true });

const ProjectTask = mongoose.model('ProjectTask', projectTaskSchema);

export default ProjectTask;