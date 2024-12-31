import Client from '../models/client_model.js';
import { generateUniqueClientId } from '../middleware/unique_code_middleware.js';

export const addClient = async (req, res) => {
    try {
        const clientId = await generateUniqueClientId();
        const newClient = new Client({ ...req.body, clientId });
        await newClient.save();
        res.status(201).json({ message: 'Client added successfully', client: newClient });
    } catch (error) {
        res.status(500).json({ error: `Failed to add client: ${error.message}` });
    }
};

export const getClients = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const clients = await Client.find({ archived: false })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const totalClients = await Client.countDocuments({ archived: false });
        res.status(200).json({
            clients,
            totalPages: Math.ceil(totalClients / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch clients: ${error.message}` });
    }
};

export const updateClient = async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client updated successfully', client: updatedClient });
    } catch (error) {
        res.status(500).json({ error: `Failed to update client: ${error.message}` });
    }
};

export const archiveClients = async (req, res) => {
    try {
        const { clientIds } = req.body;
        if (!clientIds || !clientIds.length) {
            return res.status(400).json({ error: 'No client IDs provided' });
        }
        const result = await Client.updateMany({ _id: { $in: clientIds } }, { archived: true });
        res.status(200).json({ message: `${result.nModified} clients archived successfully` });
    } catch (error) {
        res.status(500).json({ error: `Failed to archive clients: ${error.message}` });
    }
};

export const deleteClients = async (req, res) => {
    try {
        const { clientIds } = req.body;
        if (!clientIds || !clientIds.length) {
            return res.status(400).json({ error: 'No client IDs provided' });
        }
        const result = await Client.deleteMany({ _id: { $in: clientIds } });
        res.status(200).json({ message: `${result.deletedCount} clients deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: `Failed to delete clients: ${error.message}` });
    }
};

export const getArchivedClients = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const clients = await Client.find({ archived: true })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const totalClients = await Client.countDocuments({ archived: true });
        res.status(200).json({
            clients,
            totalPages: Math.ceil(totalClients / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch archived clients: ${error.message}` });
    }
};

export const reinstateClient = async (req, res) => {
    try {
        const { clientId } = req.body;
        if (!clientId) {
            return res.status(400).json({ error: 'No client ID provided' });
        }
        const reinstatedClient = await Client.findByIdAndUpdate(clientId, { archived: false }, { new: true });
        if (!reinstatedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client reinstated successfully', client: reinstatedClient });
    } catch (error) {
        res.status(500).json({ error: `Failed to reinstate client: ${error.message}` });
    }
};
