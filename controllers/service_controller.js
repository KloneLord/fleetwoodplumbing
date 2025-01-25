import Service from '../models/service_model.js';
import Equipment from '../models/equipment_model.js';

// List all services
export const listServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new service
export const addNewService = async (req, res) => {
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

// Update a service
export const updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(updatedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a service
export const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(deletedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};