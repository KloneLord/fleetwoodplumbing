// Assuming you have some express setup
import express from 'express';
import User_model from '../models/user_model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, authCode, password, phone, rate_cost, rate_charge, employment, job_title, certifications, profile_picture_url, tfn, claim_tax, notes } = req.body;

    try {
        const user = await User_model.findOne({ email, authCode });
        if (!user) {
            return res.status(400).json({ message: 'Invalid registration link' });
        }

        user.password = bcrypt.hashSync(password, 8);
        user.phone = phone;
        user.rate_cost = rate_cost;
        user.rate_charge = rate_charge;
        user.employment = employment;
        user.job_title = job_title;
        user.certifications = certifications;
        user.profile_picture_url = profile_picture_url;
        user.tfn = tfn;
        user.claim_tax = claim_tax;
        user.notes = notes;

        await user.save();

        res.status(200).json({ message: 'Registration completed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

export default router;