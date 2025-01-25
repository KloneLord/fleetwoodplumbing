import Repair from '../models/repair_model.js';

// List all repairs
export const listRepairs = async (req, res) => {
    try {
        const repairs = await Repair.find();
        res.json(repairs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new repair
export const addNewRepair = async (req, res) => {
    const newRepair = new Repair(req.body);

    try {
        const savedRepair = await newRepair.save();
        res.status(201).json(savedRepair);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a repair
export const updateRepair = async (req, res) => {
    try {
        const updatedRepair = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json(updatedRepair);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a repair
export const deleteRepair = async (req, res) => {
    try {
        const deletedRepair = await Repair.findByIdAndDelete(req.params.id);
        if (!deletedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json(deletedRepair);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};