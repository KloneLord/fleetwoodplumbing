import Business_model from '../models/business_model.js';
import AuthCode from '../models/auth_code_model.js';
import AdminUser from '../models/user_model.js'; // Assuming this is the admin users model

// Function to set up a new business
export const setupBusiness = async (req, res) => {
    try {
        const { name, abn, email, phone, street, city, state, postalCode, country, authCode } = req.body;

        // Check if the provided auth code exists and is valid
        const existingAuthCode = await AuthCode.findOne({ code: authCode });
        if (!existingAuthCode) {
            return res.status(400).json({ error: 'Invalid authentication code' });
        }

        const newBusiness = new Business_model({
            name,
            abn,
            email,
            phone,
            street,
            city,
            state,
            postalCode,
            country,
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

// Function to get business details
export const getBusinessDetails = async (req, res) => {
    try {
        const business = await Business_model.findOne();
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }
        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to update business details
export const updateBusinessDetails = async (req, res) => {
    try {
        const { name, abn, email, phone, street, city, state, postalCode, country, authCode } = req.body;

        // Check if the provided auth code exists and is valid
        const existingAuthCode = await AuthCode.findOne({ code: authCode });
        if (!existingAuthCode) {
            return res.status(400).json({ error: 'Invalid authentication code' });
        }

        const business = await Business_model.findOne();
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        business.name = name;
        business.abn = abn;
        business.email = email;
        business.phone = phone;
        business.street = street;
        business.city = city;
        business.state = state;
        business.postalCode = postalCode;
        business.country = country;

        await business.save();
        res.status(200).json({ message: 'Business details updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};