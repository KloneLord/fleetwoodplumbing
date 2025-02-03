import mongoose from 'mongoose';

const scheduleLogSchema = new mongoose.Schema(
    {
        user_id: { type: String, required: true }, // Employee ID
        employee: { type: String, required: true }, // Full name of the employee
        project_id: { type: String, required: true }, // Associated project ID
        project_title: { type: String, required: true }, // Project name
        date: { type: Date, required: true }, // Store actual date object
        start_time: { type: String, required: true }, // Format: "07:00"
        finish_time: { type: String, required: true }, // Format: "16:30"
        schedule_job_description: { type: String, required: true } // Renamed for clarity
    },
    { timestamps: true } // Auto-createdAt & updatedAt fields
);

const ScheduleLog = mongoose.model('ScheduleLog', scheduleLogSchema);
export default ScheduleLog;
