// middleware/unique_code_middleware.js

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
        clientId = generateCode();
        const existingClient = await Client.findOne({ clientId });
        if (!existingClient) {
            isUnique = true;
        }
    }

    return clientId;
};