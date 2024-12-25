// utils/auth_key.js
import crypto from 'crypto';
import { AllKeysModel } from '../models/all_keys_model.js';

export async function generateAuthKey() {
    let uniqueKey = false;
    let authKey = '';

    while (!uniqueKey) {
        authKey = crypto.randomBytes(6).toString('hex'); // Generate 12-character key
        console.log(`Generated Key: ${authKey}`);
        const existingKey = await AllKeysModel.findOne({ auth_key: authKey });

        if (!existingKey) {
            await AllKeysModel.create({ auth_key: authKey, created_at: new Date() });
            console.log(`Auth Key ${authKey} successfully saved to database.`);
            uniqueKey = true;
        } else {
            console.log(`Duplicate Key Detected: ${authKey}. Generating a new key.`);
        }
    }

    return authKey;
}
