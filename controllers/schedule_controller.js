import ScheduleLog from '../models/schedule_model.js';

// Utility function to extract date from datetime-local input
const extractDate = (dateTimeString) => {
    return dateTimeString.split('T')[0]; // Extract YYYY-MM-DD
};

// Add Schedule Log
export const addScheduleLog = async (req, res) => {
    try {
        let { user_id, employee, project_id, project_title, start_time, finish_time, schedule_job_description } = req.body;

        // Extract date from start_time
        const date = extractDate(start_time);

        // Check if entry already exists for this user on the same project & date
        const existingLog = await ScheduleLog.findOne({ user_id, project_id, date });
        if (existingLog) {
            return res.status(400).json({ error: 'Schedule entry already exists for this user on this date' });
        }

        // Create new schedule entry
        const newLog = new ScheduleLog({
            user_id,
            employee,
            project_id,
            project_title,
            date,
            start_time,
            finish_time,
            schedule_job_description
        });

        await newLog.save();
        res.status(201).json({ message: 'Schedule log saved successfully', log: newLog });

    } catch (error) {
        console.error('Error saving schedule log:', error.message);
        res.status(500).json({ error: 'Failed to save schedule log' });
    }
};

// List all schedule logs
export const listScheduleLogs = async (req, res) => {
    try {
        const logs = await ScheduleLog.find().sort({ date: 1, start_time: 1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error listing schedule logs:', error.message);
        res.status(500).json({ error: 'Failed to list schedule logs' });
    }
};

// Get Schedule Log by ID
export const getScheduleLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await ScheduleLog.findById(id);
        if (!log) {
            return res.status(404).json({ error: 'Schedule log not found' });
        }
        res.status(200).json(log);
    } catch (error) {
        console.error('Error fetching schedule log:', error.message);
        res.status(500).json({ error: 'Failed to fetch schedule log' });
    }
};

// Update Schedule Log
export const updateScheduleLog = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        // Extract and update date from new start_time if provided
        if (updateData.start_time) {
            updateData.date = extractDate(updateData.start_time);
        }

        const updatedLog = await ScheduleLog.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedLog) {
            return res.status(404).json({ error: 'Schedule log not found' });
        }
        res.status(200).json({ message: 'Schedule log updated successfully', log: updatedLog });
    } catch (error) {
        console.error('Error updating schedule log:', error.message);
        res.status(500).json({ error: 'Failed to update schedule log' });
    }
};

// Delete Schedule Log
export const deleteScheduleLog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLog = await ScheduleLog.findByIdAndDelete(id);
        if (!deletedLog) {
            return res.status(404).json({ error: 'Schedule log not found' });
        }
        res.status(200).json({ message: 'Schedule log deleted successfully', log: deletedLog });
    } catch (error) {
        console.error('Error deleting schedule log:', error.message);
        res.status(500).json({ error: 'Failed to delete schedule log' });
    }
};

// Fetch all schedule data
export const fetchScheduleData = async (req, res) => {
    try {
        const response = await fetch('/api/schedule/list');
        if (response.ok) {
            const scheduleData = await response.json();
            res.status(200).json(scheduleData);
        } else {
            console.error('Failed to fetch schedule data:', response.status, response.statusText);
            res.status(500).json({ error: 'Failed to fetch schedule data' });
        }
    } catch (error) {
        console.error('Error fetching schedule data:', error);
        res.status(500).json({ error: 'Error fetching schedule data' });
    }
};
