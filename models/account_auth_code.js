import mongoose from 'mongoose';

const authCodeSchema = new mongoose.Schema({
    authCode: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });

const AuthCode = mongoose.model('AuthCode', authCodeSchema);

export default AuthCode;