import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    primaryPhone: {
        type: String,
        required: true,
        match: [/^\+?[0-9]{7,15}$/, 'Invalid phone number format'],
    },
    secondaryPhone: {
        type: String,
        match: [/^\+?[0-9]{7,15}$/, 'Invalid phone number format'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Invalid email format'],
    },
    preferredContactMethod: {
        type: String,
        required: true,
        enum: ['Phone', 'Email', 'SMS'],
    },
    resStreet: { type: String, required: true, trim: true },
    resCity: { type: String, required: true, trim: true },
    resState: { type: String, required: true, trim: true },
    resZip: { type: String, required: true, trim: true },
    resCountry: { type: String, required: true, trim: true },
    postStreet: { type: String, required: true, trim: true },
    postCity: { type: String, required: true, trim: true },
    postState: { type: String, required: true, trim: true },
    postZip: { type: String, required: true, trim: true },
    postCountry: { type: String, required: true, trim: true },
    archived: { type: Boolean, default: false },
    clientId: { type: String, required: true, unique: true },
}, { timestamps: true });

clientSchema.index({ email: 1 }, { unique: true });
clientSchema.index({ clientId: 1 }, { unique: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
