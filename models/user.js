import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, default: 'not_provided@example.com' },
    password: { type: String, required: true },
    phone: { type: String, default: '0000000000' },
    role: { type: String, default: 'worker' }, // Default role: worker
    credentials: { type: String, default: null },
    access: { type: String, default: 'basic' }, // Default access: basic
    archived: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, default: null },
    authCode: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
