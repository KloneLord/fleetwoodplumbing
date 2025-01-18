import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    projectId: String,
    clientId: String,
    username: String,
    fileName: String,
    employee: String,
    time: String,
    date: String,
});

const Plan = mongoose.model('Plan', planSchema);
export default Plan;