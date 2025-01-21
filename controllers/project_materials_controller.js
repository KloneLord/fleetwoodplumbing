// project_materials_controller.js

import ProjectMaterials from '../models/project_materials_model.js';
import InventoryItem from '../models/inventory_model.js';
import { generateAuthCode } from '../routes/auth_code_routes.js';

// Book out materials and update inventory
export const bookOutMaterials = async (req, res) => {
    try {
        const { project_id, username, materials } = req.body;

        if (!project_id || !username || !materials) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate a unique log ID
        const logId = await generateAuthCode('LOG');

        const materialsToBookOut = materials.map(material => ({
            project_id,
            username,
            item_id: material.itemId,
            item_name: material.description,
            item_category: material.category,
            quantity_booked_out: material.quantity,
            log_id: logId,
            time: new Date().toISOString().split('T')[1].split('.')[0], // Get time part
            date: new Date().toISOString().split('T')[0], // Get date part
            project_status: 'Booked Out'
        }));

        // Save to project materials collection
        await ProjectMaterials.insertMany(materialsToBookOut);

        // Update inventory stock levels
        for (const material of materials) {
            const item = await InventoryItem.findOne({ itemId: material.itemId });
            if (item) {
                item.stockLevel -= material.quantity;
                await item.save();
            }
        }

        res.status(200).json({ message: 'Materials booked out and inventory updated successfully' });
    } catch (error) {
        console.error('Error booking out materials:', error.message);
        res.status(500).json({ error: 'Failed to book out materials' });
    }
};

// Return materials and update inventory
export const returnMaterials = async (req, res) => {
    try {
        const { project_id, username, materials } = req.body;

        if (!project_id || !username || !materials) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate a unique log ID
        const logId = await generateAuthCode('LOG');

        const materialsToReturn = materials.map(material => ({
            project_id,
            username,
            item_id: material.itemId,
            item_name: material.description,
            item_category: material.category,
            quantity_booked_out: -material.quantity, // Negative quantity for return
            log_id: logId,
            time: new Date().toISOString().split('T')[1].split('.')[0], // Get time part
            date: new Date().toISOString().split('T')[0], // Get date part
            project_status: 'Returned'
        }));

        // Save to project materials collection
        await ProjectMaterials.insertMany(materialsToReturn);

        // Update inventory stock levels
        for (const material of materials) {
            const item = await InventoryItem.findOne({ itemId: material.itemId });
            if (item) {
                item.stockLevel += material.quantity;
                await item.save();
            }
        }

        res.status(200).json({ message: 'Materials returned and inventory updated successfully' });
    } catch (error) {
        console.error('Error returning materials:', error.message);
        res.status(500).json({ error: 'Failed to return materials' });
    }
};

// Get project materials log
export const getProjectMaterialsLog = async (req, res) => {
    try {
        const { projectID } = req.params;
        const materialsLog = await ProjectMaterials.find({ project_id: projectID }).sort({ date: 1, time: 1 });
        res.status(200).json(materialsLog);
    } catch (error) {
        console.error('Error fetching project materials log:', error.message);
        res.status(500).json({ error: 'Failed to fetch project materials log' });
    }
};

// Get materials booked to job
export const getProjectMaterialsBooked = async (req, res) => {
    try {
        const { projectID } = req.params;
        const materialsBooked = await ProjectMaterials.find({ project_id: projectID });
        res.status(200).json(materialsBooked);
    } catch (error) {
        console.error('Error fetching project materials booked:', error.message);
        res.status(500).json({ error: 'Failed to fetch project materials booked' });
    }
};