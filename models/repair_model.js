import mongoose from 'mongoose';

const RepairSchema = new mongoose.Schema({
    machineId: { type: String, required: true },
    repairDate: { type: Date, required: true },
    repairDetails: { type: String, required: true },
    repairCost: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Repair = mongoose.model('Repair', RepairSchema);
export default Repair;