import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;