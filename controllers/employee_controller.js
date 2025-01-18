import User_model from '../models/user_model.js';

// Controller to create a new employee
export const createEmployee = async (req, res) => {
    const { first_name, last_name, email, username, auth_code } = req.body;

    try {
        const existingUser = await User_model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = new User_model({
            first_name,
            last_name,
            email,
            username,
            authCode: auth_code
        });

        await newUser.save();

        res.status(201).json({ message: 'Employee added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving user' });
    }
};

// Controller to fetch all employees
export const getAllEmployees = async (req, res) => {
    try {
        const users = await User_model.find({}, 'first_name last_name email username access role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
};

// Controller to fetch a single employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const user = await User_model.findById(req.params.id, 'first_name last_name email username access role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user' });
    }
};

// Other controller functions remain unchanged...