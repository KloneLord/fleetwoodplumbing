import User from '../models/user_model.js';

// Update Employee Color
export const updateEmployeeColor = async (req, res) => {
    const { user_id } = req.params; // Get user_id from request parameters
    const { schedule_color } = req.body; // Get new color from request body

    try {
        // Find employee by user_id
        const employee = await User.findOne({ user_id });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Update schedule color
        employee.schedule_color = schedule_color;
        await employee.save();

        res.status(200).json({ message: 'Employee color updated successfully', employee });
    } catch (error) {
        console.error('Error updating employee color:', error);
        res.status(500).json({ error: 'Failed to update employee color' });
    }
};

// Get All Employees with Colors
export const getAllEmployeesWithColors = async (req, res) => {
    try {
        const employees = await User.find({}, 'user_id first_name last_name schedule_color');
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};
