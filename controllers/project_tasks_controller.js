import TaskModel from '../models/project_tasks_model.js';

export async function createTask(req, res) {
    try {
        const task = new TaskModel(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
}

export async function getTasks(req, res) {
    try {
        const tasks = await TaskModel.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}