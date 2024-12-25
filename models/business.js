import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    abn: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    authCode: { type: String, required: true },
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);

export default Business;