import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import AuthCode from '../models/auth_code.js';

// Login User
export const loginUser = async (req, res) => {
    try {
        console.log('loginUser: Request received with body:', req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('loginUser: Missing fields:', !username ? 'username' : '', !password ? 'password' : '');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.log('loginUser: User not found for username:', username);
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('loginUser: Password mismatch for username:', username);
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update the session to include access level
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role,
            access: user.access, // Include the access level
        };


        console.log('loginUser: User logged in successfully:', { id: user._id, username: user.username });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('loginUser: Error occurred:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Register User
export const registerUser = async (req, res) => {
    console.log('registerUser: Request received with body:', req.body);

    try {
        const { username, password, authCode, role } = req.body;

        const missingFields = [];
        if (!username) missingFields.push('username');
        if (!password) missingFields.push('password');
        if (!authCode) missingFields.push('authCode');

        if (missingFields.length > 0) {
            console.log('registerUser: Missing fields:', missingFields.join(', '));
            return res.status(400).json({
                error: `The following fields are required: ${missingFields.join(', ')}`,
            });
        }

        const existingAuthCode = await AuthCode.findOne({ code: authCode });
        if (!existingAuthCode) {
            console.log('registerUser: Invalid authentication code:', authCode);
            return res.status(400).json({ error: 'Invalid authentication code' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('registerUser: Duplicate username:', username);
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = role || 'worker';
        let userAccess = 'basic';

        if (userRole === 'admin') {
            userAccess = 'full';
        } else if (userRole === 'client') {
            userAccess = 'client';
        }

        const newUser = new User({
            username,
            email: req.body.email || 'not_provided@example.com',
            password: hashedPassword,
            phone: req.body.phone || '0000000000',
            role: userRole,
            credentials: req.body.credentials || null,
            access: userAccess,
            authCode,
        });

        await newUser.save();
        console.log('registerUser: User registered successfully:', newUser);
        res.status(201).json({ message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registered successfully` });
    } catch (error) {
        console.error('registerUser: Error occurred:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
