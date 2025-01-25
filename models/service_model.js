import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    machineId: { type: String, required: true },
    serviceDate: { type: Date, required: true },
    serviceDetails: { type: String, required: true },
    serviceTechnician: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', ServiceSchema);
export default Service;