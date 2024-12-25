import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {type: String,required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.']},
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    po_street: { type: String },
    po_city: { type: String },
    po_state: { type: String },
    role: { type: String, enum: ['client', 'worker', 'admin'], required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`Password hashed for user: ${this.username}`);
        next();
    } catch (err) {
        console.error('Error hashing password:', err.message);
        next(err);
    }
});

export default mongoose.model('User', userSchema);
