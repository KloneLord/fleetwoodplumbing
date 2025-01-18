import PlantEquipment from '../models/plant_equipment_model.js';

export const createPlantEquipment = async (req, res) => {
    const plantEquipment = new PlantEquipment(req.body);
    await plantEquipment.save();
    res.send(plantEquipment);
};

export const getPlantEquipment = async (req, res) => {
    const plantEquipments = await PlantEquipment.find();
    res.send(plantEquipments);
};