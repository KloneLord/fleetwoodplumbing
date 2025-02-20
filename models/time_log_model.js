// File: models/time_log_model.js

import mongoose from 'mongoose';

const TimeLogSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    projectTitle: { type: String, required: true },
    customer: { type: String, required: true },
    clientId: { type: String, required: false }, // Changed required to false
    projectSite: { type: String, required: false }, // Changed required to false
    username: { type: String, required: true },
    status: { type: String, enum: ['clockedIn', 'clockedOut'], default: 'clockedIn', required: true },
    action: { type: String, enum: ['clockin', 'clockout'], required: true },
    timestamp: { type: Date, required: true },
    timelogId: { type: String, default: () => Math.random().toString(36).substr(2, 9), unique: true }
});

const TimeLog = mongoose.model('TimeLog', TimeLogSchema);
export default TimeLog;