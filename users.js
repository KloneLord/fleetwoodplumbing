import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/admin_user.js';
import connectDB from "./config/db_config.js"; // Adjust the path as necessary

dotenv.config();

const listUsers = async () => {
    try {
// Connect to the database
        await connectDB();

        const users = await User.find({});
        console.log('Users:', users);

        mongoose.disconnect();
    } catch (error) {
        console.error('Error listing users:', error);
        mongoose.disconnect();
    }
};

listUsers();