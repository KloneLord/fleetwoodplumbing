import { saveToDatabase } from '../models/swms_model.js';
import { sendEmail } from '../utils/email_client.js';

export const saveSwms = async (req, res) => {
    try {
        await saveToDatabase(req.body);
        res.status(200).send('SWMS saved successfully!');
    } catch (error) {
        res.status(500).send('Error saving SWMS.');
    }
};

export const emailSwms = async (req, res) => {
    try {
        const { email, ...swmsData } = req.body;
        await sendEmail(email, 'SWMS Document', swmsData);
        res.status(200).send('SWMS emailed successfully!');
    } catch (error) {
        res.status(500).send('Error emailing SWMS.');
    }
};
