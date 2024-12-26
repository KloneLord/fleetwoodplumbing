import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'client' },
    credentials: { type: String, default: null },
    access: { type: String, default: 'basic' },
    archived: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, default: null },
    authCode: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;