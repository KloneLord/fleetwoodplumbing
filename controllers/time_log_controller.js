import TimeLog from '../models/time_log_model.js';

export const createTimeLog = async (req, res) => {
    const timeLog = new TimeLog(req.body);
    await timeLog.save();
    res.send(timeLog);
};

export const getTimeLogs = async (req, res) => {
    const timeLogs = await TimeLog.find();
    res.send(timeLogs);
};