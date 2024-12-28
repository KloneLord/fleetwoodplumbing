import Business from '../models/business.js';
import AuthCode from '../models/auth_code.js';
import AdminUser from '../models/user.js'; // Assuming this is the admin users model

// Function to set up a new business
export const setupBusiness = async (req, res) => {
    try {
        const { name, abn, email, phone, address, authCode } = req.body;

        // Check if the provided auth code exists and is valid
        const existingAuthCode = await AuthCode.findOne({ code: authCode });
        if (!existingAuthCode) {
            return res.status(400).json({ error: 'Invalid authentication code' });
        }

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
};

// Function to create a new admin user
export const createAdminUser = async (req, res) => {
    try {
        const { username, password, email, authCode } = req.body;

        // Check if the provided auth code exists and is valid
        const existingAuthCode = await AuthCode.findOne({ code: authCode });
        if (!existingAuthCode) {
            return res.status(400).json({ error: 'Invalid authentication code' });
        }

        const newAdminUser = new AdminUser({
            username,
            password, // You should hash the password before saving it
            email,
            authCode,
        });

        await newAdminUser.save();
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};