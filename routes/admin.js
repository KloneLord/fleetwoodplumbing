// routes/admin.js
import express from 'express';
import AdminUser from '../models/admin_user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin registration endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdminUser = new AdminUser({
            username,
            email,
            password: hashedPassword,
        });

        await newAdminUser.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const adminUser = await AdminUser.findOne({ username });

        if (!adminUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: adminUser._id, username: adminUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;