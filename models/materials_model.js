import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    projectId: String,
    clientId: String,
    username: String,
    itemId: String,
    description: String,
    quantity: Number,
    employee: String,
    time: String,
    date: String,
});

const Material = mongoose.model('Material', materialSchema);
export default Material;