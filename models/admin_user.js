import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Ensure you hash the password before saving it
    email: { type: String, required: true, unique: true },
    authCode: { type: String, required: true },
}, { timestamps: true });

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;