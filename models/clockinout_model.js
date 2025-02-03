import mongoose from 'mongoose';

const TimeLogSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    projectTitle: { type: String, required: true },
    customer: { type: String, required: true },
    clientId: { type: String, required: true },
    projectSite: { type: String, required: true },
    username: { type: String, required: true },
    action: { type: String, enum: ['clockin', 'clockout'], required: true },
    timestamp: { type: Date, required: true },
    timelogId: { type: String, default: () => Math.random().toString(36).substr(2, 9), unique: true } // Generate unique ID
});

const TimeLog = mongoose.model('TimeLog', TimeLogSchema);
export default TimeLog;