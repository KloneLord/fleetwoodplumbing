import express from 'express';
import { checkDuplicateCode, saveCode, validateCode } from '../controllers/auth_codes_controller.js';

const router = express.Router();

// Save a new authentication code
router.post('/save_auth_code', async (req, res) => {
    const { code } = req.body;

    try {
        // Check for duplicates
        const isDuplicate = await checkDuplicateCode(code);
        if (isDuplicate) {
            return res.status(400).json({ success: false, message: 'Duplicate code found.' });
        }

        // Save the code
        await saveCode(code);
        res.status(201).json({ success: true, message: 'Code saved successfully.' });
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ success: false, message: 'Error saving code.' });
    }
});

// Validate an authentication code
router.post('/validate_auth_code', async (req, res) => {
    const { code } = req.body;

    try {
        const isValid = await validateCode(code);
        if (isValid) {
            res.status(200).json({ valid: true, message: 'Code is valid.' });
        } else {
            res.status(404).json({ valid: false, message: 'Invalid or expired code.' });
        }
    } catch (error) {
        console.error('Error validating code:', error);
        res.status(500).json({ valid: false, message: 'Error validating code.' });
    }
});

export default router;
