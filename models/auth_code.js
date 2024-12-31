import mongoose from 'mongoose';

const authCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Only keep the code field
}, { timestamps: true });

const AuthCode = mongoose.model('AuthCode', authCodeSchema);
export default AuthCode;
