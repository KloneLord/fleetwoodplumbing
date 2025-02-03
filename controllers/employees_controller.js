import User from '../models/user_model.js';

// Update Employee Color
export const updateEmployeeColor = async (req, res) => {
    try {
        const { user_id, schedule_color } = req.body;

        const employee = await User.findOneAndUpdate(
            { user_id },
            { schedule_color },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee color updated successfully', employee });
    } catch (error) {
        console.error('Error updating employee color:', error);
        res.status(500).json({ error: 'Failed to update employee color' });
    }
};
