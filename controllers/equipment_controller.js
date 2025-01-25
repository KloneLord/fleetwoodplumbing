import Equipment from '../models/equipment_model.js';
import Service from '../models/service_model.js';
import Repair from '../models/repair_model.js';

// List all equipment
export const listEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find();
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new equipment
export const addNewEquipment = async (req, res) => {
    if (!req.body.machineId) {
        req.body.machineId = 'MACHINE-' + Date.now(); // Generate unique machineId if not provided
    }

    const newEquipment = new Equipment(req.body);

    try {
        const savedEquipment = await newEquipment.save();
        res.status(201).json(savedEquipment);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Get equipment names for dropdowns
export const getNamesForDropdowns = async (req, res) => {
    try {
        const equipmentNames = await Equipment.find({}, 'machineId machineName');
        res.json(equipmentNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Schedule a service
export const scheduleService = async (req, res) => {
    const newService = new Service(req.body);

    try {
        const savedService = await newService.save();
        await Equipment.updateOne(
            { machineId: req.body.machineId },
            { nextServiceDate: req.body.serviceDate }
        );
        res.status(201).json(savedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Log a repair
export const logRepair = async (req, res) => {
    const newRepair = new Repair(req.body);

    try {
        const savedRepair = await newRepair.save();
        res.status(201).json(savedRepair);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};