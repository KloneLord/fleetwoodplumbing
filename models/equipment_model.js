import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema({
    machineId: { type: String, required: true, unique: true },
    machineName: { type: String, required: true },
    yearOfManufacture: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true },
    numberPlate: { type: String, required: true },
    currentHours: { type: Number, required: true },
    fuelType: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: { type: String, required: true },
    licenseRequired: { type: String, required: true },
    nextServiceDate: { type: Date, required: true },
    lastServiceDate: { type: Date, required: true },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    chargeOutRate: { type: Number, required: true },
    insurancePolicy: { type: String },
    attachments: { type: [String] },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Equipment = mongoose.model('Equipment', EquipmentSchema);
export default Equipment;