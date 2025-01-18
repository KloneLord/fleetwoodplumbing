import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    projectId: String,
    clientId: String,
    username: String,
    task: String,
    details: String,
    assigned: String,
    hours: Number,
    status: String,
});

const Task = mongoose.model('Task', taskSchema);
export default Task;