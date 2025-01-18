import mongoose from 'mongoose';

const plantEquipmentSchema = new mongoose.Schema({
    projectId: String,
    clientId: String,
    username: String,
    plantEquipment: String,
    hours: Number,
    employee: String,
    checkedIn: String,
    checkedOut: String,
});

const PlantEquipment = mongoose.model('PlantEquipment', plantEquipmentSchema);
export default PlantEquipment;