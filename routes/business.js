// routes/business.js
import express from 'express';
import Business from '../models/business.js';
import crypto from 'crypto';

const router = express.Router();

// Generate a unique authentication code
const generateAuthCode = async () => {
    let authCode;
    let isUnique = false;

    while (!isUnique) {
        authCode = crypto.randomBytes(8).toString('hex');
        const existingBusiness = await Business.findOne({ authCode });
        if (!existingBusiness) {
            isUnique = true;
        }
    }

    return authCode;
};

// Business setup endpoint
router.post('/setup', async (req, res) => {
    try {
        const { name, abn, email, phone, address } = req.body;
        const authCode = await generateAuthCode();

        const newBusiness = new Business({
            name,
            abn,
            email,
            phone,
            address,
            authCode,
        });

        await newBusiness.save();
        res.status(201).json({ message: 'Business setup successful', authCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;