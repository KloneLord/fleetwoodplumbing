import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    details: { type: String, required: true },
    assigned: { type: String, default: 'Unassigned' },
    hours: { type: Number, default: 1, min: 0 },
    status: { type: String, default: 'Stored' },
    start_time: { type: Date, default: () => new Date().setHours(8, 0, 0, 0) },
    end_time: { type: Date, default: () => new Date().setHours(16, 30, 0, 0) },
}, {
    timestamps: true
});

const TaskModel = mongoose.model('Task', TaskSchema);
export default TaskModel;