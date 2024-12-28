import bcrypt from 'bcrypt';
import User from '../models/user.js';
import AuthCode from '../models/auth_code.js';

export const createAdminUser = async (req, res) => {
    try {
        console.log('createAdminUser: Request received with body:', req.body);
        const { username, email, password, phone, authCode } = req.body;

        if (!username || !email || !password || !phone || !authCode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Admin user with this email or username already exists' });
        }

        const existingAuthCode = await AuthCode.findOne({ code: authCode });
        if (!existingAuthCode) {
            return res.status(400).json({ error: 'Invalid authentication code' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdminUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            role: 'admin',
            access: 'full',
            authCode,
        });

        await newAdminUser.save();
        console.log('createAdminUser: Admin user saved to database');
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        console.error('Error in createAdminUser:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const loginUser = async (req, res) => {
    try {
        console.log('loginUser: Request received with body:', req.body);
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set session
        req.session.user = { id: user._id, username: user.username, role: user.role };

        console.log('loginUser: User logged in successfully');
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error in loginUser:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const registerUser = async (req, res) => {
    try {
        console.log('registerUser: Request received with body:', req.body);
        const { username, email, password, phone, authCode } = req.body;

        // Validate required fields
        if (!username || !email || !password || !phone || !authCode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate the authCode
        const existingAuthCode = await AuthCode.findOne({ code: authCode });
        if (!existingAuthCode) {
            return res.status(400).json({ error: 'Invalid authentication code' });
        }

        // Check for duplicate username or email
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            role: 'client', // Default role
            authCode,
        });

        await newUser.save();
        console.log('registerUser: User saved successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in registerUser:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
