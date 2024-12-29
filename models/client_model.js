// models/client_model.js

import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    primaryPhone: { type: String, required: true },
    secondaryPhone: { type: String },
    email: { type: String, required: true },
    preferredContactMethod: { type: String, required: true },
    resStreet: { type: String, required: true },
    resCity: { type: String, required: true },
    resState: { type: String, required: true },
    resZip: { type: String, required: true },
    resCountry: { type: String, required: true },
    postStreet: { type: String, required: true },
    postCity: { type: String, required: true },
    postState: { type: String, required: true },
    postZip: { type: String, required: true },
    postCountry: { type: String, required: true },
    archived: { type: Boolean, default: false },
    clientId: { type: String, required: true, unique: true }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;