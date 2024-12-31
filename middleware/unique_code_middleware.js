import Client from '../models/client_model.js';

export const generateUniqueClientId = async () => {
    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 16; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    let clientId;
    let isUnique = false;

    while (!isUnique) {
        try {
            clientId = generateCode();
            const existingClient = await Client.findOne({ clientId });
            if (!existingClient) {
                isUnique = true;
            }
        } catch (error) {
            console.error('Error checking client ID uniqueness:', error);
            throw new Error('Failed to generate unique client ID');
        }
    }

    return clientId;
};
