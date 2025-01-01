import Client from '../models/client_model.js';

// Function to add a new client
export const addClient = async (req, res) => {
    try {
        const clientData = req.body;
        const newClient = new Client(clientData);
        await newClient.save();
        res.status(201).json({ message: 'Client saved successfully!' });
    } catch (error) {
        console.error('Error saving client:', error);
        res.status(500).json({ error: 'Failed to save client' });
    }
};

// Function to get the list of clients
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
};

// Function to update client details
export const updateClient = async (req, res) => {
    const { id } = req.params; // Use clientId instead of _id
    try {
        const updatedClient = await Client.findOneAndUpdate({ clientId: id }, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Failed to update client' });
    }
};

// Function to delete clients
export const deleteClients = async (req, res) => {
    const { ids } = req.body;
    try {
        await Client.deleteMany({ clientId: { $in: ids } });
        res.status(200).json({ message: 'Clients deleted successfully' });
    } catch (error) {
        console.error('Error deleting clients:', error);
        res.status(500).json({ error: 'Failed to delete clients' });
    }
};

// Function to toggle the hidden status of a client
export const toggleHideClient = async (req, res) => {
    const { clientId } = req.body;
    try {
        const client = await Client.findOne({ clientId });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        client.accountStatus = client.accountStatus === 'hidden' ? 'active' : 'hidden';
        await client.save();

        res.status(200).json({ message: `Client ${client.accountStatus === 'hidden' ? 'hidden' : 'unhidden'} successfully` });
    } catch (error) {
        console.error('Error toggling hide status:', error);
        res.status(500).json({ error: 'Failed to toggle hide status' });
    }
};

// Function to get a client by clientId
export const getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Client.findOne({ clientId: id });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Failed to fetch client' });
    }
};

// Function to get the list of archived clients
export const getArchivedClients = async (req, res) => {
    try {
        const clients = await Client.find({ accountStatus: 'hidden' });
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching archived clients:', error);
        res.status(500).json({ error: 'Failed to fetch archived clients' });
    }
};

// Function to reinstate archived clients
export const reinstateClient = async (req, res) => {
    const { clientId } = req.body;
    try {
        const client = await Client.findOneAndUpdate({ clientId }, { accountStatus: 'active' }, { new: true });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client reinstated successfully', client });
    } catch (error) {
        console.error('Error reinstating client:', error);
        res.status(500).json({ error: 'Failed to reinstate client' });
    }
};