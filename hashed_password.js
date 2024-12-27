import mongoose from 'mongoose';
import { hashPassword } from './middleware/hash_password.js'; // Adjust the path as necessary
import dotenv from 'dotenv';
import User from './models/user.js';
import connectDB from "./config/db_config.js"; // Adjust the path as necessary

dotenv.config(); // Load environment variables from .env file

const updatePassword = async (userId, newPassword) => {
    try {
        // Connect to the database
        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found');
            return;
        }

        // Hash the new password
        const hashedPassword = hashPassword(newPassword);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        console.log(`Password for user ${user.username} has been updated`);

        mongoose.disconnect();
    } catch (error) {
        console.error('Error updating password:', error);
        mongoose.disconnect();
    }
};

// Call the function with the user's ObjectId and new password
updatePassword('676dc5b7f65d06bee5f0a31a', '12345');