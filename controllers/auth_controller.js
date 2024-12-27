import { hashPassword } from '../middleware/hash_password.js';
import User from '../models/user.js';

export const registerUser = async (req, res) => {
    try {
        console.log('registerUser: Request received with body:', req.body);
        const { username, email, password, phone, role, credentials, access, authCode } = req.body;

        // Validate required fields
        if (!username || !email || !password || !phone || !authCode) {
            console.error('registerUser: Missing required fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the user already exists by email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.error('registerUser: User with this email or username already exists');
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        // Hash the password
        const hashedPassword = hashPassword(password);
        console.log('registerUser: Password hashed');

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            role: role || 'client',
            credentials: credentials || null,
            access: access || 'basic',
            authCode,
        });

        await newUser.save();
        console.log('registerUser: User saved to database');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        console.log('loginUser: Request received with body:', req.body);
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.error('loginUser: Invalid email or password');
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Verify the password
        const isMatch = verifyPassword(password, user.password);
        if (!isMatch) {
            console.error('loginUser: Invalid email or password');
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role, access: user.access, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('loginUser: JWT token generated');

        // Set session
        req.session.user = { id: user._id, username: user.username, role: user.role, access: user.access };
        console.log('loginUser: Session set');

        res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role, access: user.access } });
    } catch (error) {
        console.error('Error logging in user:', error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};

export const createAdminUser = async (req, res) => {
    try {
        console.log('createAdminUser: Request received with body:', req.body);
        const { username, email, password, phone, authCode } = req.body;

        // Validate required fields
        if (!username || !email || !password || !phone || !authCode) {
            console.error('createAdminUser: Missing required fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the admin user already exists by email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.error('createAdminUser: Admin user with this email or username already exists');
            return res.status(400).json({ error: 'Admin user with this email or username already exists' });
        }

        // Hash the password
        const hashedPassword = hashPassword(password);
        console.log('createAdminUser: Password hashed');

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
        console.error('Error creating admin user:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};