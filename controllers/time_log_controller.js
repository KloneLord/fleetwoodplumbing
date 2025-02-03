// File: controllers/time_log_controller.js

import TimeLog from '../models/time_log_model.js';

export const createTimeLog = async (req, res) => {
    try {
        const timeLog = new TimeLog(req.body);
        await timeLog.save();
        res.status(201).json(timeLog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateTimeLog = async (req, res) => {
    try {
        const timeLog = await TimeLog.findOneAndUpdate(
            { projectId: req.body.projectId, status: 'clockedIn', username: req.body.username },
            { $set: { ...req.body, status: 'clockedOut' } }, // Ensure status is set to 'clockedOut'
            { new: true, runValidators: true }
        );
        if (!timeLog) return res.status(404).json({ error: 'Active time log not found' });
        res.json(timeLog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getActiveTimeLog = async (req, res) => {
    try {
        const timeLog = await TimeLog.findOne({ status: 'clockedIn', username: req.query.username });
        if (!timeLog) return res.status(404).json({ error: 'No active time log found' });
        res.json(timeLog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};