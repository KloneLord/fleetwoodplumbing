import mongoose from 'mongoose';

const timeLogSchema = new mongoose.Schema({
    projectId: String,
    clientId: String,
    username: String,
    employee: String,
    checkIn: String,
    checkOut: String,
    date: String,
});

const TimeLog = mongoose.model('TimeLog', timeLogSchema);
export default TimeLog;