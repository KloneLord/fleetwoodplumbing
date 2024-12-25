import Client from '../models/client_model.js';

// Fetch active or archived clients
export const getClients = async (req, res) => {
    try {
        const { archived } = req.query;
        const isArchived = archived === 'true';
        const clients = await Client.find({ archived: isArchived });
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Failed to fetch clients' });
    }
};

// Fetch a single client by ID
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ message: 'Failed to fetch client' });
    }
};

// Create a new client
export const createClient = async (req, res) => {
    try {
        const { name, phone, email, contactMethod, street, city, state, postcode } = req.body;
        const newClient = new Client({ name, phone, email, contactMethod, street, city, state, postcode });
        await newClient.save();
        res.status(201).json({ message: 'Client added successfully', client: newClient });
    } catch (error) {
        console.error('Error adding client:', error);
        res.status(500).json({ message: 'Failed to add client' });
    }
};

// Update an existing client
export const updateClient = async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client updated successfully', client: updatedClient });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Failed to update client' });
    }
};

// Reactivate an archived client
export const reactivateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, { archived: false }, { new: true });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client reactivated successfully', client });
    } catch (error) {
        console.error('Error reactivating client:', error);
        res.status(500).json({ message: 'Failed to reactivate client' });
    }
};
