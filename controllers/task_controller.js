import Task from '../models/task_model.js';

export const createTask = async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.send(task);
};

export const getTasks = async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
};

