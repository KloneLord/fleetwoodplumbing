// routes/admin.js
import express from 'express';
import User_model from '../models/user_model.js';
import { hashPasswordMiddleware } from '../middleware/hash_password.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin registration endpoint
router.post('/register', hashPasswordMiddleware, async (req, res) => {
    try {
        console.log('register: Request received with body:', req.body);
        const { username, email, password, phone, authCode } = req.body;

        // Validate required fields
        if (!username || !email || !password || !authCode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newUser = new User_model({
            username,
            email,
            password, // Password is already hashed by the middleware
            phone,
            role: 'admin', // Ensure the role is set to admin
            access: 'full', // Provide full access
            authCode
        });

        await newUser.save();
        console.log('register: Admin user saved to database');
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error registering admin user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin login endpoint
router.post('/login', async (req, res) => {
    try {
        console.log('login: Request received with body:', req.body);
        const { username, password } = req.body;

        const user = await User_model.findOne({ username, role: 'admin' });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role, auth_code: user.authCode}, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('login: JWT token generated');

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in admin user:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;