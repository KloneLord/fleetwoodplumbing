import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/admin_user.js';
import User from '../models/user.js';

// Function to handle user login
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate request payload
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if the user exists in AdminUser collection
        let user = await AdminUser.findOne({ username });

        // If not found, check in the User collection
        if (!user) {
            user = await User.findOne({ username });
        }

        // If user not found in both collections
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role, access: user.access, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set session
        req.session.user = { id: user._id, username: user.username, role: user.role, access: user.access };

        res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role, access: user.access } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};