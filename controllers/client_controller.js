// controllers/client_controller.js

import Client from '../models/client_model.js';
import { generateUniqueClientId } from '../middleware/unique_code_middleware.js';

export const addClient = async (req, res) => {
    try {
        const clientId = await generateUniqueClientId();
        const newClient = new Client({ ...req.body, clientId });
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getClients = async (req, res) => {
    try {
        const clients = await Client.find({ archived: false });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateClient = async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const archiveClients = async (req, res) => {
    try {
        const { clientIds } = req.body;
        await Client.updateMany({ _id: { $in: clientIds } }, { archived: true });
        res.status(200).json({ message: 'Clients archived successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteClients = async (req, res) => {
    try {
        const { clientIds } = req.body;
        await Client.deleteMany({ _id: { $in: clientIds } });
        res.status(200).json({ message: 'Clients deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getArchivedClients = async (req, res) => {
    try {
        const clients = await Client.find({ archived: true });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const reinstateClient = async (req, res) => {
    try {
        const { clientId } = req.body;
        const reinstatedClient = await Client.findByIdAndUpdate(clientId, { archived: false }, { new: true });
        res.status(200).json(reinstatedClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};