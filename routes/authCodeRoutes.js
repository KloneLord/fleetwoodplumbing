import express from 'express';
import AuthCode from '../models/auth_code.js';
import crypto from 'crypto';

const router = express.Router();

// Generate a unique 16-character authentication code
const generateAuthCode = async () => {
    let authCode;
    let isUnique = false;

    while (!isUnique) {
        authCode = crypto.randomBytes(8).toString('hex').toUpperCase(); // 16 characters
        const existingCode = await AuthCode.findOne({ code: authCode });
        if (!existingCode) {
            isUnique = true;
        }
    }

    return authCode;
};

// Generate the authentication code and save it to the database
router.post('/generate-code', async (req, res) => {
    try {
        const authCode = await generateAuthCode();

        // Save the auth code to the database
        const newAuthCode = new AuthCode({ code: authCode });
        await newAuthCode.save();

        res.status(201).json({ authCode });
    } catch (error) {
        console.error('Error generating auth code:', error.message);
        res.status(500).json({ error: 'Failed to generate auth code.' });
    }
});

export default router;
