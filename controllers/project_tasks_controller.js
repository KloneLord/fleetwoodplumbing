import ProjectTask from '../models/project_tasks_model.js';

// Add a new task
export const addTask = async (req, res) => {
    const { task, details, assigned, hours, status, start_time, end_time } = req.body;

    try {
        const newTask = new ProjectTask({
            task,
            details,
            assigned,
            hours,
            status,
            start_time,
            end_time
        });

        await newTask.save();
        res.status(201).json({ message: 'Task added successfully', newTask });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Error adding task' });
    }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await ProjectTask.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

// Get a task by ID
export const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await ProjectTask.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Error fetching task' });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { task, details, assigned, hours, status, start_time, end_time } = req.body;

    try {
        const updatedTask = await ProjectTask.findByIdAndUpdate(
            id,
            { task, details, assigned, hours, status, start_time, end_time },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await ProjectTask.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
};