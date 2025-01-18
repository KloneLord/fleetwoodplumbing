import User from '../models/user_model.js';
import NewUserModel from '../models/new_user_model.js';
import { generateAuthCode } from '../routes/auth_code_routes.js';


export const addCertification = async (req, res) => {
    const { user_id } = req.params;
    const { title } = req.body;

    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const certification = {
            title,
            front: req.files['front'][0].path,
            back: req.files['back'] ? req.files['back'][0].path : undefined
        };

        user.certifications.push(certification);
        await user.save();

        res.status(200).json({ message: 'Certification added successfully', certification });
    } catch (error) {
        console.error('Error adding certification:', error);
        res.status(500).json({ message: 'Error adding certification' });
    }
};

export const deleteCertification = async (req, res) => {
    const { user_id, certification_id } = req.params;

    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const certificationIndex = user.certifications.findIndex(cert => cert._id.toString() === certification_id);
        if (certificationIndex === -1) {
            return res.status(404).json({ message: 'Certification not found' });
        }

        user.certifications.splice(certificationIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Certification deleted successfully' });
    } catch (error) {
        console.error('Error deleting certification:', error);
        res.status(500).json({ message: 'Error deleting certification' });
    }
};

export const registerEmployee = async (req, res) => {
    const { first_name, last_name, email, username } = req.body;

    try {
        const auth_code = await generateAuthCode();

        const newUser = new User({
            user_id: auth_code,
            first_name,
            last_name,
            email,
            username,
            authCode: auth_code,
            role: 'new'
        });

        await newUser.save();

        const registrationLink = `${newUser.user_id}`;

        const newUserEntry = new NewUserModel({
            user_id: newUser.user_id,
            first_name,
            last_name,
            email,
            username,
            authCode: auth_code,
            registration_link: registrationLink
        });

        await newUserEntry.save();

        res.status(201).json({ message: 'Employee registered successfully. Please check your email to complete the registration.' });
    } catch (error) {
        console.error('Error registering employee:', error);
        res.status(500).json({ message: 'Error registering employee' });
    }
};

export const getNewUsers = async (req, res) => {
    try {
        const newUsers = await NewUserModel.find({});
        res.json(newUsers);
    } catch (error) {
        console.error('Error fetching new users:', error);
        res.status(500).json({ message: 'Error fetching new users' });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find({});
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Error fetching employees' });
    }
};

export const getEmployeeById = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

export const updateEmployee = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fieldsToUpdate = [
            'first_name', 'last_name', 'email', 'username', 'phone',
            'credentials', 'rate_cost', 'rate_charge', 'employment',
            'job_title', 'role', 'access', 'profile_picture_url',
            'tfn', 'claim_tax', 'notes'
        ];

        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        if (req.body['certifications[]']) {
            const certifications = JSON.parse(req.body['certifications[]']);
            user.certifications = certifications.map((cert, index) => ({
                title: cert.title,
                front: req.files['certification_front[]'] ? req.files['certification_front[]'][index].path : undefined,
                back: req.files['certification_back[]'] ? req.files['certification_back[]'][index].path : undefined
            }));
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};