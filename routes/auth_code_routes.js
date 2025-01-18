import express from 'express';
import AuthCode from '../models/auth_code_model.js';
import crypto from 'crypto';

const router = express.Router();

// Generate a unique 16-character authentication code
export const generateAuthCode = async () => {
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
        const newAuthCode = new AuthCode({ code: authCode });

        await newAuthCode.save();
        res.status(201).json({ authCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validate authentication code
router.post('/validate', async (req, res) => {
    try {
        const { authCode } = req.body;
        const existingCode = await AuthCode.findOne({ code: authCode });

        if (existingCode) {
            res.status(200).json({ valid: true });
        } else {
            res.status(400).json({ valid: false, message: 'Invalid authentication code' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;