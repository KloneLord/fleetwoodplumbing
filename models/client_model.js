import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    clientId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    postalStreetAddress: { type: String },
    postalCity: { type: String },
    postalState: { type: String },
    postalPostalCode: { type: String },
    postalCountry: { type: String },
    poBoxAddress: { type: String },
    outstandingBalance: { type: Number, default: 0 },
    transactionHistory: { type: String },
    accountCreationDate: { type: Date, default: Date.now },
    lastLoginDate: { type: Date },
    accountStatus: { type: String, default: 'active' }
});

const Client = mongoose.model('Client', clientSchema);

export default Client;