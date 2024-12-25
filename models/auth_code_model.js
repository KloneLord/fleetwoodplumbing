import mongoose from 'mongoose';

const authCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            minlength: 16,
            maxlength: 16,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

const AuthCode = mongoose.model('AuthCode', authCodeSchema);

export default AuthCode;
