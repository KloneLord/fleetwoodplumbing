import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contactMethod: { type: String, required: true, enum: ['phone', 'email', 'text'] },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    archived: { type: Boolean, default: false },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
