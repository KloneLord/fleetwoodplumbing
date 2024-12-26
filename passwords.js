import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/admin_user.js';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const hashPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        const adminUsers = await AdminUser.find();
        for (const adminUser of adminUsers) {
            if (!adminUser.password.startsWith('$2a$')) {
                adminUser.password = await bcrypt.hash(adminUser.password, 10);
                await adminUser.save();
                console.log(`Hashed password for admin user: ${adminUser.username}`);
            }
        }

        const users = await User.find();
        for (const user of users) {
            if (!user.password.startsWith('$2a$')) {
                user.password = await bcrypt.hash(user.password, 10);
                await user.save();
                console.log(`Hashed password for user: ${user.username}`);
            }
        }

        console.log('Password hashing completed');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error hashing passwords:', error);
        mongoose.disconnect();
    }
};

hashPasswords();